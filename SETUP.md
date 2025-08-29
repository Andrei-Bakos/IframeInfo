# Iframe Information Gathering Tool - Local Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   
   **For Windows:**
   ```cmd
   npx cross-env NODE_ENV=development tsx server/index.ts
   ```
   
   **For Mac/Linux:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Go to `http://localhost:5000`

## Alternative Setup (Works on all platforms)

If you encounter environment variable issues, you can start the server directly:

```bash
npx tsx server/index.ts
```

This will run the server without setting NODE_ENV (it defaults to development).

## What this tool does

This application demonstrates iframe security and data extraction capabilities:

- **Same-origin content**: Full access to DOM, forms, and storage
- **Cross-origin restrictions**: Shows how external sites block iframe access
- **Security testing**: Different test scenarios to understand iframe boundaries
- **Data extraction**: Various methods to gather information from embedded content

## Test Presets Available

- **Same Origin HTML**: Demonstrates full access to content from the same domain
- **Form Test Page**: Shows form interaction and data extraction capabilities
- **Blocked by X-Frame-Options**: Demonstrates how sites prevent iframe embedding
- **Data URL Content**: Shows how inline content works in iframes

## Requirements

- Node.js 18+ 
- npm or yarn
- Modern browser with JavaScript enabled

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js server
- **UI**: Tailwind CSS with shadcn/ui components
- **Port**: Application runs on port 5000

The tool runs entirely locally without external dependencies (except for loading external websites for testing).