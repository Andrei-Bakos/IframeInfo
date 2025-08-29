import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Trash2 } from "lucide-react";

interface ConsoleEntry {
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
  timestamp: Date;
}

interface ConsoleOutputProps {
  entries: ConsoleEntry[];
  onClear: () => void;
}

export default function ConsoleOutput({ entries, onClear }: ConsoleOutputProps) {
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'error':
        return 'status-error';
      case 'warning':
        return 'status-warning';
      case 'success':
        return 'status-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <Terminal className="text-primary mr-2 h-5 w-5" />
        Console Output
      </h3>
      
      <Card className="bg-card border border-border">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Debug Console</span>
            <Button
              data-testid="button-clear-console"
              onClick={onClear}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <div className="console-output p-3 font-mono text-sm space-y-1" data-testid="console-output">
          {entries.map((entry, index) => (
            <div key={index} className={getTypeClass(entry.type)}>
              <span className="text-primary">
                [{entry.timestamp.toLocaleTimeString()}]
              </span> {entry.message}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
