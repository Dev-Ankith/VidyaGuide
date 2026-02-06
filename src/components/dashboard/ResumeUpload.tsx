import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function ResumeUpload({ onFileSelect, selectedFile }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <motion.div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary' : 'text-primary/70'}`} />
            </div>
            
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse • PDF, DOC, DOCX only
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 p-4 bg-secondary/10 border border-secondary/30 rounded-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-secondary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-secondary" />
            <button
              onClick={removeFile}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
