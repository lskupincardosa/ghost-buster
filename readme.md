# 👻 Ghost-Buster

[![npm version](https://img.shields.io/npm/v/flyingant-ghost-buster.svg)](https://www.npmjs.com/package/flyingant-ghost-buster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A colorful, interactive Node.js CLI tool to hunt down and terminate rogue background processes holding your local ports hostage.

## 🚀 The Problem

Ever tried to start a local development server only to get `Error: Port 3000 is already in use`? Ghost-Buster automates the annoying process of finding the hidden Process ID (PID) and killing it, now with a safety-first interactive confirmation.

## ✨ Features

- **Interactive Confirmation:** Never kill a process by accident. Ghost-Buster asks for permission before firing.
- **Beautiful Terminal UI:** Color-coded output using `picocolors` for better readability and a professional feel.
- **Instant Port Scanning:** Uses system-level `lsof` to find exactly what is running on a specific port.
- **Auto-Termination:** Surgical `kill -9` execution to free up your environment immediately.

## 📦 Installation

Install Ghost-Buster globally via npm:

```bash
npm install -g flyingant-ghost-buster