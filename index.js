#!/usr/bin/env node
const { exec } = require('child_process');
const readline = require('readline');
const pc = require('picocolors');

const args = process.argv.slice(2);
const flags = {
  force: args.includes('-f') || args.includes('--yes'),
  watch: args.includes('--watch'),
  list: args.includes('--list')
};

// Filter out flags to get the positional argument (port/range)
const targetArg = args.find(arg => !arg.startsWith('-'));

if (flags.list) {
  listAllPorts();
} else if (!targetArg) {
  showUsage();
} else {
  main();
}

function showUsage() {
  console.log(pc.yellow("\n👻 Ghost-Buster Usage:"));
  console.log(`  ${pc.cyan('ghost <port>')}          Scan a single port`);
  console.log(`  ${pc.cyan('ghost <start>-<end>')}   Scan a range of ports`);
  console.log(`  ${pc.cyan('ghost --list')}            List all active listening ports`);
  console.log(`\n${pc.bold('Options:')}`);
  console.log(`  ${pc.cyan('-f, --yes')}             Skip confirmation (Force Bust)`);
  console.log(`  ${pc.cyan('--watch')}               Monitor and auto-bust any process on the port`);
  process.exit(0);
}

/**
 * Lists all active listening ports
 */
function listAllPorts() {
  console.log(pc.blue("🔍 Scanning for all active ghosts...\n"));
  exec('lsof -iTCP -sTCP:LISTEN -P -n', (error, stdout) => {
    if (error || !stdout) {
      console.log(pc.green("✅ Your machine is ghost-free!"));
      return;
    }

    const lines = stdout.trim().split('\n');
    console.log(pc.magenta(`${pc.bold('COMMAND'.padEnd(15))} | ${pc.bold('PID'.padEnd(8))} | ${pc.bold('PORT')}`));
    console.log('-'.repeat(40));

    // Skip header line
    lines.slice(1).forEach(line => {
      const parts = line.trim().split(/\s+/);
      const command = parts[0];
      const pid = parts[1];
      const name = parts[8]; // e.g. *:3000 or 127.0.0.1:3000
      const port = name.split(':').pop();
      console.log(`${pc.cyan(command.padEnd(15))} | ${pc.yellow(pid.padEnd(8))} | ${pc.green(port)}`);
    });
  });
}

/**
 * Parses the port or range argument
 */
function parsePorts(arg) {
  if (arg.includes('-')) {
    const [start, end] = arg.split('-').map(Number);
    if (isNaN(start) || isNaN(end) || start > end) {
      console.log(pc.red("❌ Invalid port range."));
      process.exit(1);
    }
    const ports = [];
    for (let i = start; i <= end; i++) ports.push(i);
    return ports;
  }
  const port = parseInt(arg);
  if (isNaN(port)) {
    console.log(pc.red("❌ Invalid port number."));
    process.exit(1);
  }
  return [port];
}

/**
 * Gets more context about a process (Alias Detection)
 */
function getProcessContext(pid) {
  return new Promise((resolve) => {
    exec(`ps -p ${pid} -o command=`, (error, stdout) => {
      if (error || !stdout) return resolve('');
      const fullCmd = stdout.trim();
      if (fullCmd.includes('node')) return pc.dim('(Node.js App)');
      if (fullCmd.includes('docker')) return pc.dim('(Docker Container)');
      if (fullCmd.includes('python')) return pc.dim('(Python Script)');
      return '';
    });
  });
}

/**
 * Finds a process on a specific port
 */
function findProcess(port) {
  return new Promise((resolve) => {
    exec(`lsof -i :${port}`, (error, stdout) => {
      if (error || !stdout) return resolve(null);
      
      const lines = stdout.trim().split('\n');
      if (lines.length < 2) return resolve(null);
      
      const columns = lines[1].trim().split(/\s+/);
      const pid = columns[1];
      
      getProcessContext(pid).then(context => {
        resolve({
          port,
          name: columns[0],
          pid,
          context
        });
      });
    });
  });
}

/**
 * Gracefully terminates a process
 */
function bustGhost(ghost) {
  return new Promise((resolve) => {
    console.log(pc.red(`🔫 Busting ghost on port ${ghost.port} (PID: ${ghost.pid}) ${ghost.context}...`));
    
    exec(`kill ${ghost.pid}`, () => {
      setTimeout(() => {
        exec(`lsof -i :${ghost.port}`, (error) => {
          if (error) {
            console.log(pc.green(`✨ SUCCESS! Port ${ghost.port} is now free.`));
            resolve(true);
          } else {
            console.log(pc.yellow(`⚠️  Ghost on ${ghost.port} is resisting! Forcing...`));
            exec(`kill -9 ${ghost.pid}`, (killError) => {
              if (killError) {
                console.log(pc.red(`❌ Failed to bust ghost on port ${ghost.port}.`));
                resolve(false);
              } else {
                console.log(pc.green(`✨ SUCCESS! Port ${ghost.port} is now free.`));
                resolve(true);
              }
            });
          }
        });
      }, 750);
    });
  });
}

async function runScan() {
  const portsToCheck = parsePorts(targetArg);
  const ghosts = [];

  for (const port of portsToCheck) {
    const ghost = await findProcess(port);
    if (ghost) ghosts.push(ghost);
  }
  return ghosts;
}

async function main() {
  const ghosts = await runScan();

  if (ghosts.length === 0) {
    if (!flags.watch) {
      console.log(pc.green(`✅ No ghosts found on ${targetArg}.`));
    }
    
    if (flags.watch) {
      process.stdout.write(pc.dim(`\r👀 Watching ${targetArg}... last checked ${new Date().toLocaleTimeString()}`));
      setTimeout(main, 2000);
    } else {
      process.exit(0);
    }
    return;
  }

  console.log(pc.magenta(`\n👻 Found ${ghosts.length} ghost${ghosts.length > 1 ? 's' : ''}!`));
  ghosts.forEach(g => {
    console.log(`${pc.cyan(g.port.toString().padEnd(6))} | ${pc.bold('Process:')} ${pc.cyan(g.name.padEnd(15))} ${g.context} | ${pc.bold('PID:')} ${pc.cyan(g.pid)}`);
  });
  console.log('');

  if (flags.force) {
    for (const ghost of ghosts) {
      await bustGhost(ghost);
    }
    if (flags.watch) setTimeout(main, 2000);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(pc.yellow(`❓ Do you want to bust ${ghosts.length > 1 ? 'all these ghosts' : 'this ghost'}? (y/n): `), async (answer) => {
    if (answer.toLowerCase() === 'y') {
      for (const ghost of ghosts) {
        await bustGhost(ghost);
      }
    } else {
      console.log(pc.blue(`\n🛡️  The ghosts live on. Exiting...`));
    }
    rl.close();
    if (flags.watch) setTimeout(main, 2000);
  });
}
