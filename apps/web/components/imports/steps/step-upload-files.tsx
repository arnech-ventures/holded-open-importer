'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type SourceFile = {
  id: string;
  originalName: string;
  detectedSheets: string[] | null;
  uploadedAt: string;
};

type StepUploadFilesProps = {
  projectId: string;
  onComplete: () => void;
};

export default function StepUploadFiles({ projectId, onComplete }: StepUploadFilesProps) {
  const [files, setFiles] = useState<SourceFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files`);
      if (!response.ok) throw new Error('Error al cargar archivos');
      const data = await response.json();
      setFiles(data);
    } catch {
      toast.error('Error al cargar archivos');
    }
  };

  const handleUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const file = selectedFiles[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir archivo');
      
      toast.success('Archivo subido correctamente');
      await fetchFiles();
    } catch {
      toast.error('Error al subir archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const canContinue = files.length > 0;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Sube los archivos Excel que te haya proporcionado el cliente.</strong>
          <br />
          Pueden provenir de cualquier software (Excel, LibreOffice, etc.)
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          {isDragging ? 'Suelta el archivo aquí' : 'Arrastra archivos o haz clic para seleccionar'}
        </p>
        <p className="text-sm text-muted-foreground">
          Formatos soportados: .xlsx, .xls
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Archivos subidos ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-card"
              >
                <FileSpreadsheet className="h-8 w-8 text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.originalName}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.detectedSheets?.length || 0} hoja(s) detectada(s)
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {canContinue ? (
            <span className="text-green-600 font-medium">✓ Archivos listos</span>
          ) : (
            <span>Sube al menos un archivo para continuar</span>
          )}
        </div>
        <Button 
          onClick={onComplete} 
          disabled={!canContinue || isUploading}
          size="lg"
        >
          Continuar al siguiente paso
        </Button>
      </div>
    </div>
  );
}
