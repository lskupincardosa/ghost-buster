# 👻 Ghost-Buster

A blazing-fast Node.js CLI tool to hunt down and terminate rogue background processes holding your local ports hostage.

## 🚀 The Problem

Ever tried to start a local development server only to get `Error: Port 3000 is already in use`? Ghost-Buster automates the annoying process of finding the hidden Process ID (PID) and manually killing it, saving you from having to remember complex terminal commands.

## ✨ Features

- **Instant Port Scanning:** Uses system-level `lsof` commands to find exactly what is running on a specific port.
- **Auto-Termination:** Parses the raw terminal output, extracts the exact PID, and runs a surgical `kill -9` command to free up your port immediately.
- **Smart Detection:** Gracefully lets you know if a port is already free.

## 🛠️ Usage

Run the script and pass the port you want to clear as an argument:

\`\`\`bash
node index.js <port-number>
\`\`\`

**Example:**

\`\`\`bash
node index.js 8000
\`\`\`

**Example Output:**

\`\`\`text
Hunting for ghosts on port 8000...
👻 Found a ghost! Python is haunting port 8000 (PID: 37162)
🔫 Busting ghost...
✨ SUCCESS! The ghost has been busted. Port 8000 is free.
\`\`\`

## 🧠 What I Learned Building This

- Interacting with the core OS via Node's `child_process.exec`.
- Using Regex to parse and extract data from raw standard output (`stdout`).
- System-level process management and port allocation.

---
*Built as a personal developer utility.*
