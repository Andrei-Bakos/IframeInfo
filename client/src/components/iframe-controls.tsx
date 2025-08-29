import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ExternalLink, Shield, Terminal } from "lucide-react";

interface IframeControlsProps {
  iframeUrl: string;
  onUrlChange: (url: string) => void;
  onLoadIframe: () => void;
  onLoadPreset: (preset: string) => void;
  onGatherBasicInfo: () => void;
  onGatherDocumentInfo: () => void;
  onGatherNetworkInfo: () => void;
  onAttemptFormInteraction: () => void;
  onClearResults: () => void;
}

export default function IframeControls({
  iframeUrl,
  onUrlChange,
  onLoadIframe,
  onLoadPreset,
  onGatherBasicInfo,
  onGatherDocumentInfo,
  onGatherNetworkInfo,
  onAttemptFormInteraction,
  onClearResults
}: IframeControlsProps) {
  return (
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
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="Enter URL or select preset..."
                className="mt-1"
              />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Quick Presets</span>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  data-testid="button-preset-same-origin"
                  onClick={() => onLoadPreset('same-origin')}
                  variant="secondary"
                  className="justify-start text-sm h-10"
                >
                  🏠 Same Origin HTML
                </Button>
                <Button
                  data-testid="button-preset-form-test"
                  onClick={() => onLoadPreset('form-test')}
                  variant="secondary"
                  className="justify-start text-sm h-10"
                >
                  📝 Form Test Page
                </Button>
                <Button
                  data-testid="button-preset-google"
                  onClick={() => onLoadPreset('google')}
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
              onClick={onGatherBasicInfo}
              className="justify-start text-sm h-10"
            >
              ℹ️ Basic Properties
            </Button>
            <Button
              data-testid="button-gather-document"
              onClick={onGatherDocumentInfo}
              variant="secondary"
              className="justify-start text-sm h-10"
            >
              📄 Document Content
            </Button>
            <Button
              data-testid="button-gather-network"
              onClick={onGatherNetworkInfo}
              variant="secondary"
              className="justify-start text-sm h-10"
            >
              🌐 Network Details
            </Button>
            <Button
              data-testid="button-form-interaction"
              onClick={onAttemptFormInteraction}
              variant="secondary"
              className="justify-start text-sm h-10"
            >
              ✏️ Form Interaction
            </Button>
            <Button
              data-testid="button-clear-results"
              onClick={onClearResults}
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
  );
}
