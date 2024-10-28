"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileLoad: (content: any) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.ipynb') && !file.name.endsWith('.json')) {
      toast.error('Please upload a valid Jupyter notebook file (.ipynb or .json)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        onFileLoad(content);
        toast.success('File uploaded successfully!');
      } catch (error) {
        toast.error('Error parsing file. Please ensure it\'s a valid Jupyter notebook.');
      }
    };
    reader.readAsText(file);
  }, [onFileLoad]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.ipynb', '.json']
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed cursor-pointer transition-colors duration-200 ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          {isDragging ? (
            <FileJson className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragging ? 'Drop your notebook here' : 'Drop your notebook or click to upload'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports .ipynb and .json files
          </p>
        </div>
      </div>
    </Card>
  );
}