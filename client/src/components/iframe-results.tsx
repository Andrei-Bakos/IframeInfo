import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface IframeInfo {
  title: string;
  content: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface IframeResultsProps {
  results: IframeInfo[];
}

export default function IframeResults({ results }: IframeResultsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBorderClass = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-destructive bg-red-950/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-950/20';
      case 'success':
        return 'border-green-500 bg-green-950/20';
      default:
        return 'border-border';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <Database className="text-primary mr-2 h-5 w-5" />
        Extraction Results
      </h3>
      
      <div className="space-y-4" data-testid="results-container">
        {results.length === 0 ? (
          <Card className="p-4 bg-card border border-border">
            <p className="text-muted-foreground text-sm">
              <Info className="inline mr-2 h-4 w-4" />
              Click any extraction button to see results here
            </p>
          </Card>
        ) : (
          results.map((result, index) => (
            <Card
              key={index}
              className={`p-4 bg-card border ${getBorderClass(result.type)}`}
              data-testid={`result-${index}`}
            >
              <h4 className="font-medium mb-2 flex items-center">
                {getIcon(result.type)}
                <span className="ml-2">{result.title}</span>
                <Badge
                  variant={result.type === 'error' ? 'destructive' : 'secondary'}
                  className="ml-auto"
                >
                  {result.type}
                </Badge>
              </h4>
              <div className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                {result.content}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
