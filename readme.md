# 👻 Ghost-Buster

[![npm version](https://img.shields.io/npm/v/flyingant-ghost-buster.svg)](https://www.npmjs.com/package/flyingant-ghost-buster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A colorful, interactive Node.js CLI tool to hunt down and terminate rogue background processes holding your local ports hostage.

## 🚀 The Problem

Ever tried to start a local development server only to get `Error: Port 3000 is already in use`? Ghost-Buster automates the annoying process of finding the hidden Process ID (PID) and killing it, now with a safety-first interactive confirmation.
## ✨ Features

- **Interactive Confirmation:** Never kill a process by accident. Ghost-Buster asks for permission before firing.
- **Port Ranges:** Scan and bust multiple ghosts at once (e.g., `ghost 3000-3010`).
- **Ghost List:** See everything running with `ghost --list`.
- **Watch Mode:** Persistently monitor a port and auto-terminate any intruder with `--watch`.
- **Alias Detection:** Automatically identifies if a process is a Node.js app, Docker container, or Python script.
- **Graceful Termination:** First attempts a polite `SIGTERM` to let processes save state, automatically falling back to `kill -9` only if the "ghost" persists.
- **Automation Friendly:** Skip prompts using the `-f` (force) flag for CI/CD or scripts.
- **Beautiful Terminal UI:** Color-coded output using `picocolors`.

## 📦 Installation

Install Ghost-Buster globally via npm:

```bash
npm install -g flyingant-ghost-buster
```

## 🚀 Usage

### Basic Hunt
```bash
ghost 3000
```

### Range Scan
```bash
ghost 3000-3010
```

### List All Active Ports
```bash
ghost --list
```

### Automation (Force Bust)
```bash
ghost 8080 -f
```

### Watch & Guard a Port
Keep a port free permanently (checks every 2 seconds):
```bash
ghost 3000 --watch -f
```