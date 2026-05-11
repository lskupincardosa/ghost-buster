# 👻 Ghost-Buster

[![npm version](https://img.shields.io/npm/v/flyingant-ghost-buster.svg)](https://www.npmjs.com/package/flyingant-ghost-buster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightning-fast Node.js CLI tool to hunt down and terminate rogue background processes holding your local ports hostage.

## 🚀 The Problem

Ever tried to start a local development server only to get `Error: Port 3000 is already in use`? Ghost-Buster automates the annoying process of finding the hidden Process ID (PID) and manually killing it, saving you from having to remember complex terminal commands or digging through Activity Monitor.

## ✨ Features

- **Instant Port Scanning:** Uses system-level `lsof` commands to find exactly what is running on a specific port.
- **Auto-Termination:** Parses the raw terminal output, extracts the exact PID, and runs a surgical `kill -9` command to free up your port immediately.
- **Smart Detection:** Gracefully lets you know if a port is already free.

## 📦 Installation

Install Ghost-Buster globally via npm to use the `ghost` command anywhere on your machine:

```bash
npm install -g flyingant-ghost-buster