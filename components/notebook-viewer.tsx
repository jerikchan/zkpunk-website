"use client";

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NotebookCell {
  cell_type: string;
  source: string[] | string;
  outputs?: any[];
}

interface NotebookViewerProps {
  notebook: {
    cells: NotebookCell[];
  };
}

export function NotebookViewer({ notebook }: NotebookViewerProps) {
  const [expandedCells, setExpandedCells] = useState<string[]>([]);

  const toggleCell = (cellId: string) => {
    setExpandedCells(prev =>
      prev.includes(cellId)
        ? prev.filter(id => id !== cellId)
        : [...prev, cellId]
    );
  };

  const renderCell = (cell: NotebookCell, index: number) => {
    const cellId = `cell-${index}`;
    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;

    return (
      <AccordionItem value={cellId} key={cellId}>
        <AccordionTrigger className="px-4">
          <span className="text-sm font-medium">
            {cell.cell_type === 'code' ? 'Code Cell' : 'Markdown Cell'} #{index + 1}
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-4">
          {cell.cell_type === 'code' ? (
            <SyntaxHighlighter
              language="python"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
              }}
            >
              {source}
            </SyntaxHighlighter>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{source}</ReactMarkdown>
            </div>
          )}
          
          {cell.outputs && cell.outputs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Output:</p>
              <Card className="p-4 bg-muted/50">
                <pre className="text-sm overflow-x-auto">
                  {cell.outputs.map((output, i) => (
                    <div key={i}>
                      {output.text || 
                       output.data?.['text/plain'] ||
                       JSON.stringify(output, null, 2)}
                    </div>
                  ))}
                </pre>
              </Card>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {notebook.cells.map((cell, index) => renderCell(cell, index))}
    </Accordion>
  );
}