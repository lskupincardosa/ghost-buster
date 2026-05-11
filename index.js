#!/usr/bin/env node
const { exec } = require('child_process'); 

const targetPort = process.argv[2];

if (!targetPort) {
  console.log("👻 Usage: ghost <port>");
  console.log("Example: ghost 3000");
  process.exit(1);
}

console.log(`Hunting for ghosts on port ${targetPort}...`);

const command = `lsof -i :${targetPort}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(`✅ Good news! Port ${targetPort} is already free.`);
    return; 
  }

  const lines = stdout.trim().split('\n');
  
  const dataLine = lines[1]; 
  
  const columns = dataLine.trim().split(/\s+/);
  
  const processName = columns[0];
  const pid = columns[1];        

  console.log(`👻 Found a ghost! ${processName} is haunting port ${targetPort} (PID: ${pid})`);
  console.log(`🔫 Busting ghost...`);

  exec(`kill -9 ${pid}`, (killError) => {
    if (killError) {
      console.log(`❌ Failed to bust the ghost. You might need 'sudo' permissions.`);
    } else {
      console.log(`✨ SUCCESS! The ghost has been busted. Port ${targetPort} is free.`);
    }
  });
});