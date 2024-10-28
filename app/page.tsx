"use client";

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { NotebookViewer } from '@/components/notebook-viewer';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function Home() {
  const [notebook, setNotebook] = useState<any>(null);
  const { setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Jupyter Notebook Viewer</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setTheme('dark')}
          >
            Toggle theme
          </Button>
        </div>

        {!notebook ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileLoad={setNotebook} />
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setNotebook(null)}
              className="mb-4"
            >
              Upload another notebook
            </Button>
            <NotebookViewer notebook={notebook} />
          </div>
        )}
      </div>
    </main>
  );
}