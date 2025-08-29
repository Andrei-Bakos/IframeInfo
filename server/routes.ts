import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve test pages for iframe demonstration
  app.get("/api/test-pages/same-origin", (req, res) => {
    const filePath = path.join(__dirname, 'test-pages', 'same-origin.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('Test page not found');
      }
    });
  });

  app.get("/api/test-pages/form-test", (req, res) => {
    const filePath = path.join(__dirname, 'test-pages', 'form-test.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('Test page not found');
      }
    });
  });

  app.get("/api/test-pages/secure-test", (req, res) => {
    const filePath = path.join(__dirname, 'test-pages', 'secure-test.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('Test page not found');
      }
    });
  });

  // API endpoint to simulate cross-origin restrictions
  app.get("/api/test-pages/blocked", (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'DENY');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Blocked Content</title>
          <style>
              body { font-family: Arial; padding: 40px; text-align: center; background: #f8d7da; color: #721c24; }
              .error { background: white; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          </style>
      </head>
      <body>
          <div class="error">
              <h1>🚫 Frame Access Denied</h1>
              <p>This page cannot be displayed in a frame due to X-Frame-Options: DENY</p>
              <p>This simulates how external sites protect against clickjacking.</p>
          </div>
      </body>
      </html>
    `);
  });

  // Endpoint to test POST data handling
  app.post("/api/test-pages/form-handler", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      message: 'Form data received successfully',
      data: req.body,
      timestamp: new Date().toISOString(),
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent'],
        'origin': req.headers['origin'],
        'referer': req.headers['referer']
      }
    });
  });

  // Endpoint to provide iframe security information
  app.get("/api/iframe-info", (req, res) => {
    res.json({
      serverOrigin: req.get('origin') || 'unknown',
      requestHeaders: req.headers,
      securityHeaders: {
        'X-Frame-Options': 'Information about frame embedding',
        'Content-Security-Policy': 'Controls resource loading and execution',
        'X-Content-Type-Options': 'Prevents MIME type sniffing',
        'Referrer-Policy': 'Controls referrer information'
      },
      commonRestrictions: [
        'Cross-origin iframe access is heavily restricted',
        'Same-origin policy applies to DOM access',
        'postMessage() is the recommended communication method',
        'Cookies and storage access may be limited'
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
