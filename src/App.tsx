import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [terminalContent, setTerminalContent] = useState<string[]>(["$ "]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping] = useState(true);
  const [publicKey, setPublicKey] = useState("");
  const [email, setEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const commands = [
    {
      command: "dmsg --help",
      output: [
        "dmsg - comms for developers",
        "",
        "Usage:",
        "  dmsg [command] [options]",
        "",
        "Commands:",
        "  login       Login to your account",
        "  \\ls         List all channels",
        "  \\checkout   Switch to a different channel",
        "  \\org        Organization management",
        "  \\file       Send a file to the current channel",
        "  \\?          Show help information",
      ],
    },
    {
      command: "dmsg --version",
      output: ["dmsg v1.2.0 (build 2025-03-01)"],
    },
    {
      command: "dmsg features",
      output: [
        "Features:",
        "✓ Private-key based authentication",
        "✓ End-to-end encrypted communication",
        "✓ Direct replacement for slack, optimized for developers",
        "✓ Intuitive commands with backslash",
        "✓ Persistent message history with local SQLite database",
        "✓ Multi-organization and multi-channel support",
        "✓ Support for images and file transfers (planned)",
      ],
    },
  ];

  const terminalRef = useRef<HTMLDivElement>(null);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send this data to your server
    console.log("Submitted:", { email, publicKey });
    setWaitlistSubmitted(true);
  };

  useEffect(() => {
    if (!isTyping) return;

    const currentCommand = commands[currentCommandIndex];

    const typingInterval = setInterval(() => {
      if (currentCharIndex === 0) {
        // Start typing a new command
        setTerminalContent((prev) => {
          const newContent = [...prev];
          newContent[
            newContent.length - 1
          ] = `$ ${currentCommand.command.substring(0, 1)}`;
          return newContent;
        });
        setCurrentCharIndex(1);
      } else if (currentCharIndex < currentCommand.command.length) {
        // Continue typing the command
        setTerminalContent((prev) => {
          const newContent = [...prev];
          newContent[
            newContent.length - 1
          ] = `$ ${currentCommand.command.substring(0, currentCharIndex + 1)}`;
          return newContent;
        });
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        // Command typing finished, show output
        clearInterval(typingInterval);
        setTimeout(() => {
          setTerminalContent((prev) => {
            return [...prev, ...currentCommand.output, "$ "];
          });

          // Limit the number of lines to prevent infinite growth
          setTimeout(() => {
            setTerminalContent((prev) => {
              if (prev.length > 20) {
                return [...prev.slice(prev.length - 20)];
              }
              return prev;
            });

            setCurrentCommandIndex((prev) => (prev + 1) % commands.length);
            setCurrentCharIndex(0);
          }, 2000);
        }, 500);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [currentCommandIndex, currentCharIndex, isTyping, commands]);

  useEffect(() => {
    // Scroll to bottom of terminal when content changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalContent]);

  return (
    <div className="app">
      <header>
        <nav className="container">
          <div className="logo">dmsg.sh</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#waitlist">Join Waitlist</a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              dmsg<span className="dot">.</span>sh
            </h1>
            <p className="tagline">Comms for developers</p>
            <div className="hero-buttons">
              <a href="#waitlist" className="btn primary">
                Join Waitlist
              </a>
              <a href="#docs" className="btn secondary">
                Documentation
              </a>
            </div>
          </div>
          <div className="hero-terminal">
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-button red"></div>
                <div className="terminal-button yellow"></div>
                <div className="terminal-button green"></div>
                <div className="terminal-title">dmsg.sh</div>
              </div>
              <div className="terminal-content" ref={terminalRef}>
                {terminalContent.map((line, index) => (
                  <div key={index} className="terminal-line">
                    {line.startsWith("$ ") ? (
                      <>
                        <span className="prompt">$</span>{" "}
                        <span className="command">{line.substring(2)}</span>
                        {index === terminalContent.length - 1 && showCursor && (
                          <span className="cursor"></span>
                        )}
                      </>
                    ) : (
                      <span className="output">{line}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Private-key Authentication</h3>
              <p>
                Secure access using your SSH keys. No passwords to remember or
                reset.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>CLI Native</h3>
              <p>
                Built for developers who live in the terminal. No browser, no
                electron, just pure CLI goodness.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Lightweight</h3>
              <p>
                Minimal binary with local SQLite database for message
                persistence. Starts in milliseconds, not seconds.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>File Sharing</h3>
              <p>
                Seamlessly share files and images directly in your terminal with
                inline previews for supported formats.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Multi-organization Support</h3>
              <p>
                Easily switch between different organizations and channels with
                intuitive commands.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Developer Focused</h3>
              <p>
                Direct replacement for Slack, but optimized for developers with
                intuitive commands using backslash.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="waitlist">
        <div className="container">
          <h2>Join the Waitlist</h2>
          <div className="waitlist-content">
            <div className="waitlist-info">
              <p>
                dmsg.sh is currently in beta. Join our waitlist to get early
                access.
              </p>
              <p>
                Since dmsg.sh uses private-key authentication, please provide
                your public SSH key to secure your spot.
              </p>
            </div>

            {!waitlistSubmitted ? (
              <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="publicKey">Public SSH Key</label>
                  <textarea
                    id="publicKey"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="paste your public key here (ssh-rsa or ssh-ed25519 format)"
                    required
                  />
                  <small>
                    you should know what this is, if not, checkout slack 😎
                  </small>
                </div>
                <button type="submit" className="btn primary">
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div className="waitlist-success">
                <div className="success-icon">✅</div>
                <h3>You're on the list!</h3>
                <p>
                  Thanks for your interest in dmsg.sh. We'll notify you when
                  you're granted access.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="docs" className="docs">
        <div className="container">
          <h2>Documentation</h2>
          <div className="docs-content">
            <div className="docs-nav">
              <a href="#" className="docs-link active">
                Getting Started
              </a>
              <a href="#" className="docs-link">
                Commands
              </a>
              <a href="#" className="docs-link">
                Configuration
              </a>
              <a href="#" className="docs-link">
                Security
              </a>
              <a href="#" className="docs-link">
                API
              </a>
            </div>
            <div className="docs-main">
              <h3>Getting Started with dmsg.sh</h3>
              <p>
                After installation, you'll need to set up your account using
                your SSH keys:
              </p>
              <div className="terminal">
                <div className="terminal-content">
                  <span className="prompt">$ </span>
                  <span className="command">dmsg login</span>
                  <br />
                  <span className="output">
                    Generating RSA keys if you don't have them already...
                  </span>
                  <br />
                  <span className="output">
                    Enter your display name: dev_user
                  </span>
                  <br />
                  <span className="output">
                    Creating default organization and general channel...
                  </span>
                  <br />
                  <span className="output">
                    Login successful! Your keys are stored in ~/.dmsg/keys
                  </span>
                </div>
              </div>
              <p>Start a new chat session:</p>
              <div className="terminal">
                <div className="terminal-content">
                  <span className="prompt">$ </span>
                  <span className="command">dmsg</span>
                  <br />
                  <span className="output">
                    Connected to dmsg server. Type \\? for help.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">dmsg.sh</div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#waitlist">Join Waitlist</a>
                <a href="#docs">Documentation</a>
              </div>
              <div className="footer-column">
                <h4>Community</h4>
                <a
                  href="https://github.com/tydin/dmsg.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a href="#">Discord</a>
                <a href="#">Twitter</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">License</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} dmsg.sh. All rights reserved.
            </p>
            <p>Made with 💜 for developers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
