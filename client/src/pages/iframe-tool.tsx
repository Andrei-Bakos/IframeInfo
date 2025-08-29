import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import IframeControls from "@/components/iframe-controls";
import IframeResults from "@/components/iframe-results";
import ConsoleOutput from "@/components/console-output";
import { Code, ExternalLink, Shield, Terminal } from "lucide-react";

interface IframeInfo {
  title: string;
  content: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ConsoleEntry {
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
  timestamp: Date;
}

export default function IframeTool() {
  const [iframeUrl, setIframeUrl] = useState("data:text/html,<h1 style='font-family: Arial; color: %23333; padding: 20px;'>Sample Page</h1><p style='font-family: Arial; color: %23666; padding: 0 20px;'>This is a sample page for testing iframe data extraction.</p>");
  const [iframeStatus, setIframeStatus] = useState<{ status: string; type: 'info' | 'error' | 'warning' | 'success' }>({ status: 'Ready', type: 'success' });
  const [results, setResults] = useState<IframeInfo[]>([]);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([
    { message: 'Iframe tool initialized', type: 'success', timestamp: new Date() },
    { message: 'Ready for extraction operations', type: 'info', timestamp: new Date() }
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const logToConsole = (message: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    setConsoleEntries(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const updateStatus = (status: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    setIframeStatus({ status, type });
  };

  const addResult = (title: string, content: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    setResults(prev => [...prev, { title, content, type }]);
  };

  const loadIframe = () => {
    if (!iframeUrl) {
      logToConsole('Please enter a URL', 'error');
      return;
    }

    updateStatus('Loading...', 'warning');
    logToConsole(`Loading iframe with URL: ${iframeUrl}`);

    if (iframeRef.current) {
      iframeRef.current.src = iframeUrl;
      
      iframeRef.current.onload = () => {
        updateStatus('Loaded', 'success');
        logToConsole('Iframe loaded successfully', 'success');
      };

      iframeRef.current.onerror = () => {
        updateStatus('Error', 'error');
        logToConsole('Failed to load iframe', 'error');
      };
    }
  };

  const loadPreset = (preset: string) => {
    const presets = {
      'same-origin': '/api/test-pages/same-origin',
      'form-test': '/api/test-pages/form-test',
      'secure-test': '/api/test-pages/secure-test',
      'google': 'https://www.google.com',
      'github': 'https://github.com'
    };

    if (presets[preset as keyof typeof presets]) {
      setIframeUrl(presets[preset as keyof typeof presets]);
      setTimeout(loadIframe, 100);
    }
  };

  const gatherBasicInfo = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    logToConsole('Attempting to gather basic iframe information...');

    try {
      const info = {
        'Source URL': iframe.src,
        'Content Window': iframe.contentWindow ? 'Available' : 'Not Available',
        'Width': iframe.offsetWidth + 'px',
        'Height': iframe.offsetHeight + 'px',
        'Loading State': iframe.contentDocument ? 'Loaded' : 'Loading/Blocked'
      };

      // Try to access additional properties
      try {
        if (iframe.contentWindow) {
          info['Window Location'] = iframe.contentWindow.location.href;
          info['Window Origin'] = iframe.contentWindow.location.origin;
        }
      } catch (e) {
        info['Window Location'] = 'BLOCKED: ' + (e as Error).message;
        logToConsole('Cross-origin access blocked for location', 'warning');
      }

      const content = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      addResult('Basic Iframe Properties', content, 'success');
      logToConsole('Basic information gathered successfully', 'success');

    } catch (error) {
      const errorMsg = `Error gathering basic info: ${(error as Error).message}`;
      addResult('Basic Properties Error', errorMsg, 'error');
      logToConsole(errorMsg, 'error');
    }
  };

  const gatherDocumentInfo = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    logToConsole('Attempting to access iframe document content...');

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) {
        throw new Error('Document access blocked (likely cross-origin)');
      }

      const info = {
        'Title': doc.title || 'No title',
        'URL': doc.URL,
        'Domain': doc.domain,
        'Ready State': doc.readyState,
        'Character Set': doc.characterSet,
        'Elements Count': doc.getElementsByTagName('*').length.toString(),
        'Forms Count': doc.forms.length.toString(),
        'Images Count': doc.images.length.toString(),
        'Links Count': doc.links.length.toString()
      };

      // Try to get some content
      try {
        const bodyText = doc.body ? doc.body.innerText.substring(0, 200) : 'No body content';
        info['Body Text Preview'] = bodyText + (bodyText.length === 200 ? '...' : '');
      } catch (e) {
        info['Body Text Preview'] = 'Access denied';
      }

      const content = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      addResult('Document Information', content, 'success');
      logToConsole('Document information accessed successfully', 'success');

    } catch (error) {
      const errorMsg = `Cannot access document: ${(error as Error).message}`;
      addResult('Document Access Blocked', errorMsg, 'error');
      logToConsole(errorMsg, 'error');
    }
  };

  const gatherNetworkInfo = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    logToConsole('Gathering network and security information...');

    try {
      const info = {
        'Iframe Source': iframe.src,
        'Current Origin': window.location.origin,
        'Protocol': window.location.protocol,
        'User Agent': navigator.userAgent.substring(0, 100) + '...'
      };

      // Try to determine if same origin
      try {
        const iframeOrigin = new URL(iframe.src).origin;
        info['Iframe Origin'] = iframeOrigin;
        info['Same Origin'] = iframeOrigin === window.location.origin ? 'Yes' : 'No';
      } catch (e) {
        info['Iframe Origin'] = 'Cannot determine (data URL or invalid)';
      }

      // Check iframe sandbox attributes
      info['Sandbox Attributes'] = iframe.sandbox.length > 0 ? iframe.sandbox.toString() : 'None';

      // Try to access referrer
      try {
        if (iframe.contentDocument) {
          info['Referrer'] = iframe.contentDocument.referrer || 'None';
        }
      } catch (e) {
        info['Referrer'] = 'Access blocked';
      }

      const content = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      addResult('Network & Security Information', content, 'info');
      logToConsole('Network information gathered', 'success');

    } catch (error) {
      const errorMsg = `Error gathering network info: ${(error as Error).message}`;
      addResult('Network Information Error', errorMsg, 'error');
      logToConsole(errorMsg, 'error');
    }
  };

  const attemptFormInteraction = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    logToConsole('Attempting to interact with iframe forms...');

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!doc) {
        throw new Error('Document access blocked - cannot interact with forms');
      }

      const forms = doc.forms;
      const inputs = doc.getElementsByTagName('input');

      const info = {
        'Forms Found': forms.length.toString(),
        'Input Elements': inputs.length.toString()
      };

      // Try to interact with first form
      if (forms.length > 0) {
        const firstForm = forms[0];
        info['First Form Action'] = firstForm.action || 'No action';
        info['First Form Method'] = firstForm.method || 'GET';

        // Try to fill inputs
        let filledInputs = 0;
        for (let input of firstForm.getElementsByTagName('input')) {
          if (input.type === 'text' || input.type === 'email') {
            input.value = `Test value ${Math.random().toString(36).substring(7)}`;
            filledInputs++;
          }
        }
        info['Inputs Modified'] = filledInputs.toString();
      }

      const content = Object.entries(info)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      addResult('Form Interaction Results', content, 'success');
      logToConsole('Form interaction completed successfully', 'success');

    } catch (error) {
      const errorMsg = `Cannot interact with forms: ${(error as Error).message}`;
      addResult('Form Interaction Blocked', errorMsg, 'error');
      logToConsole(errorMsg, 'error');
    }
  };

  const clearResults = () => {
    setResults([]);
    logToConsole('Results cleared', 'info');
  };

  const clearConsole = () => {
    setConsoleEntries([
      { message: 'Console cleared', type: 'info', timestamp: new Date() }
    ]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="text-primary text-2xl" />
              <div>
                <h1 className="text-xl font-semibold">Iframe Information Gathering Tool</h1>
                <p className="text-sm text-muted-foreground">Explore iframe data access capabilities and security boundaries</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="pulse-dot w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-sm text-muted-foreground">Active Session</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Controls */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Iframe Source Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <ExternalLink className="text-primary mr-2 h-5 w-5" />
                Iframe Configuration
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="iframe-url" className="text-sm font-medium text-muted-foreground">Source URL</Label>
                  <Input
                    id="iframe-url"
                    data-testid="input-iframe-url"
                    type="text"
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    placeholder="Enter URL or select preset..."
                    className="mt-1"
                  />
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Quick Presets</span>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      data-testid="button-preset-same-origin"
                      onClick={() => loadPreset('same-origin')}
                      variant="secondary"
                      className="justify-start text-sm h-10"
                    >
                      🏠 Same Origin HTML
                    </Button>
                    <Button
                      data-testid="button-preset-form-test"
                      onClick={() => loadPreset('form-test')}
                      variant="secondary"
                      className="justify-start text-sm h-10"
                    >
                      📝 Form Test Page
                    </Button>
                    <Button
                      data-testid="button-preset-google"
                      onClick={() => loadPreset('google')}
                      variant="secondary"
                      className="justify-start text-sm h-10"
                    >
                      ⚠️ Cross-Origin (Google)
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Gathering Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Terminal className="text-primary mr-2 h-5 w-5" />
                Data Extraction
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  data-testid="button-gather-basic"
                  onClick={gatherBasicInfo}
                  className="justify-start text-sm h-10"
                >
                  ℹ️ Basic Properties
                </Button>
                <Button
                  data-testid="button-gather-document"
                  onClick={gatherDocumentInfo}
                  variant="secondary"
                  className="justify-start text-sm h-10"
                >
                  📄 Document Content
                </Button>
                <Button
                  data-testid="button-gather-network"
                  onClick={gatherNetworkInfo}
                  variant="secondary"
                  className="justify-start text-sm h-10"
                >
                  🌐 Network Details
                </Button>
                <Button
                  data-testid="button-form-interaction"
                  onClick={attemptFormInteraction}
                  variant="secondary"
                  className="justify-start text-sm h-10"
                >
                  ✏️ Form Interaction
                </Button>
                <Button
                  data-testid="button-clear-results"
                  onClick={clearResults}
                  variant="destructive"
                  className="justify-start text-sm h-10"
                >
                  🗑️ Clear Results
                </Button>
              </div>
            </div>

            {/* Security Information */}
            <Card className="p-4 bg-secondary">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Shield className="text-warning mr-2 h-4 w-4" />
                Security Notes
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Same-origin: Full access</li>
                <li>• Cross-origin: Restricted access</li>
                <li>• CORS policies apply</li>
                <li>• X-Frame-Options blocking</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Iframe Container */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium flex items-center">
                <ExternalLink className="text-primary mr-2 h-5 w-5" />
                Embedded Content
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  data-testid="button-reload-iframe"
                  onClick={loadIframe}
                  size="sm"
                >
                  🔄 Reload
                </Button>
                <Badge
                  variant={
                    iframeStatus.type === 'error' ? 'destructive' :
                    iframeStatus.type === 'warning' ? 'secondary' :
                    iframeStatus.type === 'success' ? 'default' : 'secondary'
                  }
                  data-testid="status-iframe"
                >
                  {iframeStatus.status}
                </Badge>
              </div>
            </div>
            
            <div className="iframe-container bg-white rounded-lg border-2 border-border">
              <iframe
                ref={iframeRef}
                data-testid="iframe-test"
                src={iframeUrl}
                className="w-full h-96 rounded-lg"
                title="Test Iframe"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IframeResults results={results} />
              <ConsoleOutput entries={consoleEntries} onClear={clearConsole} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
