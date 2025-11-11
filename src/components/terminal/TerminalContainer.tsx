// src/components/terminal/TerminalContainer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Plus, X } from 'lucide-react';
import { TerminalSession } from '@/types';
import 'xterm/css/xterm.css';

interface TerminalTab {
  id: string;
  name: string;
  terminal: Terminal;
  fitAddon: FitAddon;
  session: TerminalSession;
}

export const TerminalContainer: React.FC = () => {
  const [tabs, setTabs] = useState<TerminalTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  useEffect(() => {
    // Create first terminal on mount
    if (tabs.length === 0) {
      createNewTerminal();
    }

    return () => {
      // Cleanup all terminals
      tabs.forEach((tab) => {
        tab.terminal.dispose();
      });
    };
  }, []);

  const createNewTerminal = () => {
    const id = `terminal-${Date.now()}`;
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Courier New, Courier, monospace',
      theme: {
        background: '#0a0f1c',
        foreground: '#f8fafc',
        cursor: '#b8860b',
        cursorAccent: '#b8860b',
        selectionBackground: 'rgba(184, 134, 11, 0.3)',
        black: '#0a0f1c',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#f8fafc',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
      allowTransparency: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    const session: TerminalSession = {
      id,
      name: `Terminal ${tabs.length + 1}`,
      workingDirectory: '~',
      history: [],
      environment: {
        user: 'pasante',
        host: 'soc-valtorix',
        shell: 'bash',
      },
      active: true,
    };

    // Mount terminal to DOM
    const element = document.getElementById(`xterm-${id}`);
    if (element) {
      terminal.open(element);
      fitAddon.fit();

      // Initialize terminal with welcome message
      terminal.writeln('\x1b[1;32m╔══════════════════════════════════════════════════╗\x1b[0m');
      terminal.writeln('\x1b[1;32m║  CYBER VALTORIX - SOC Training Platform         ║\x1b[0m');
      terminal.writeln('\x1b[1;32m║  Terminal Emulator v2.0                          ║\x1b[0m');
      terminal.writeln('\x1b[1;32m╚══════════════════════════════════════════════════╝\x1b[0m');
      terminal.writeln('');
      terminal.writeln('Type \x1b[1;33mhelp\x1b[0m to see available commands.');
      terminal.writeln('');
      writePrompt(terminal, session);

      // Handle terminal input
      let currentLine = '';
      terminal.onData((data) => {
        const code = data.charCodeAt(0);

        if (code === 13) {
          // Enter key
          terminal.writeln('');
          if (currentLine.trim()) {
            handleCommand(terminal, session, currentLine.trim());
          }
          currentLine = '';
          writePrompt(terminal, session);
        } else if (code === 127) {
          // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            terminal.write('\b \b');
          }
        } else if (code >= 32) {
          // Printable characters
          currentLine += data;
          terminal.write(data);
        }
      });
    }

    const newTab: TerminalTab = {
      id,
      name: session.name,
      terminal,
      fitAddon,
      session,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
  };

  const writePrompt = (terminal: Terminal, session: TerminalSession) => {
    const { user, host } = session.environment;
    const dir = session.workingDirectory;
    terminal.write(
      `\x1b[1;32m${user}\x1b[0m@\x1b[1;34m${host}\x1b[0m:\x1b[1;33m${dir}\x1b[0m$ `
    );
  };

  const handleCommand = (terminal: Terminal, session: TerminalSession, command: string) => {
    // Save command to history
    session.history.push({
      command,
      output: '',
      timestamp: new Date(),
      exitCode: 0,
    });

    // Process command
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        terminal.writeln('Available commands:');
        terminal.writeln('  \x1b[1;33mhelp\x1b[0m         - Show this help message');
        terminal.writeln('  \x1b[1;33mclear\x1b[0m        - Clear the terminal');
        terminal.writeln('  \x1b[1;33mping\x1b[0m [ip]    - Ping an IP address');
        terminal.writeln('  \x1b[1;33mnmap\x1b[0m [ip]    - Scan a host');
        terminal.writeln('  \x1b[1;33mdig\x1b[0m [domain] - DNS lookup');
        terminal.writeln('  \x1b[1;33mssh\x1b[0m [user@host] - SSH connection');
        terminal.writeln('  \x1b[1;33mexit\x1b[0m         - Exit SSH session');
        break;

      case 'clear':
        terminal.clear();
        break;

      case 'ping':
        if (args.length < 2) {
          terminal.writeln('\x1b[1;31mUsage: ping [ip_address]\x1b[0m');
        } else {
          terminal.writeln(`PING ${args[1]} (56(84) bytes of data.)`);
          terminal.writeln(`64 bytes from ${args[1]}: icmp_seq=1 ttl=64 time=1.2 ms`);
          terminal.writeln(`--- ${args[1]} ping statistics ---`);
          terminal.writeln(`1 packets transmitted, 1 received, 0% packet loss`);
        }
        break;

      case 'ssh':
        if (args.length < 2) {
          terminal.writeln('\x1b[1;31mUsage: ssh [user@host]\x1b[0m');
        } else {
          const [user, host] = args[1].split('@');
          terminal.writeln(`Connecting to ${host}...`);
          terminal.writeln(`\x1b[1;32mWelcome to ${host}\x1b[0m`);
          session.environment.user = user;
          session.environment.host = host;
        }
        break;

      case 'exit':
        session.environment.user = 'pasante';
        session.environment.host = 'soc-valtorix';
        terminal.writeln('Connection closed.');
        break;

      default:
        terminal.writeln(`\x1b[1;31mCommand not found: ${cmd}\x1b[0m`);
        terminal.writeln('Type \x1b[1;33mhelp\x1b[0m for available commands.');
    }
  };

  const closeTerminal = (id: string) => {
    const tab = tabs.find((t) => t.id === id);
    if (tab) {
      tab.terminal.dispose();
      const newTabs = tabs.filter((t) => t.id !== id);
      setTabs(newTabs);

      if (activeTabId === id && newTabs.length > 0) {
        setActiveTabId(newTabs[0].id);
      }
    }
  };

  const renameTerminal = (id: string, newName: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, name: newName, session: { ...tab.session, name: newName } } : tab
      )
    );
  };

  return (
    <div className="glass-morphism rounded-2xl overflow-hidden h-[600px] flex flex-col">
      {/* Terminal Tabs */}
      <div className="flex items-center bg-cv-dark-green/50 border-b border-cv-gold/30 px-2 py-2 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1.5 mr-2 rounded-t-lg cursor-pointer transition-all ${
              activeTabId === tab.id
                ? 'bg-primary-dark text-cv-gold border-t-2 border-cv-gold'
                : 'bg-cv-olive/30 text-gray-300 hover:bg-cv-olive/50'
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="text-sm font-medium">{tab.name}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTerminal(tab.id);
                }}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={createNewTerminal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cv-gold/20 hover:bg-cv-gold/30 text-cv-gold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New</span>
        </button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`xterm-${tab.id}`}
            className={`absolute inset-0 ${activeTabId === tab.id ? 'block' : 'hidden'}`}
            style={{ padding: '1rem' }}
          />
        ))}
      </div>
    </div>
  );
};
