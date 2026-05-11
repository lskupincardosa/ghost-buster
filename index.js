#!/usr/bin/env node
const { exec } = require('child_process');
const readline = require('readline');
const pc = require('picocolors'); // Import the color library

const targetPort = process.argv[2];

if (!targetPort) {
  console.log(pc.yellow("👻 Usage: ghost <port>"));
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const command = `lsof -i :${targetPort}`;

exec(command, (error, stdout) => {
  if (error) {
    console.log(pc.green(`✅ Port ${targetPort} is already free.`));
    rl.close();
    return;
  }

  const lines = stdout.trim().split('\n');
  const columns = lines[1].trim().split(/\s+/);
  const processName = columns[0];
  const pid = columns[1];

  console.log(pc.magenta(`\n👻 Found a ghost!`));
  console.log(`${pc.bold('Process:')} ${pc.cyan(processName)}`);
  console.log(`${pc.bold('PID:')}     ${pc.cyan(pid)}`);
  console.log(`${pc.bold('Port:')}    ${pc.cyan(targetPort)}\n`);

  // The Interactive Prompt
  rl.question(pc.yellow(`❓ Do you want to bust this ghost? (y/n): `), (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log(pc.red(`🔫 Busting ghost...`));
      
      exec(`kill -9 ${pid}`, (killError) => {
        if (killError) {
          console.log(pc.red(`❌ Failed to bust the ghost.`));
        } else {
          console.log(pc.green(`✨ SUCCESS! Port ${targetPort} is now free.`));
        }
        rl.close();
      });
    } else {
      console.log(pc.blue(`\n🛡️  The ghost lives on. Exiting...`));
      rl.close();
    }
  });
});