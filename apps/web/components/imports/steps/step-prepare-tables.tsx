'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle2, FileSpreadsheet } from 'lucide-react';

type SourceFile = {
  id: string;
  originalName: string;
  detectedSheets: string[] | null;
};

type TablePreview = {
  headers: string[];
  rows: Record<string, unknown>[];
};

type StepPrepareTablesProps = {
  projectId: string;
  entityType: string;
  onComplete: () => void;
};

export default function StepPrepareTables({ projectId, onComplete }: StepPrepareTablesProps) {
  const [files, setFiles] = useState<SourceFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<number>(1);
  const [preview, setPreview] = useState<TablePreview | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/files`);
      if (!response.ok) throw new Error('Error al cargar archivos');
      const data = await response.json();
      setFiles(data);
      if (data.length > 0) {
        setSelectedFile(data[0].id);
        if (data[0].detectedSheets?.[0]) {
          setSelectedSheet(data[0].detectedSheets[0]);
        }
      }
    } catch {
      toast.error('Error al cargar archivos');
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFile && selectedSheet) {
      loadPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, selectedSheet, headerRow]);

  const loadPreview = async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/files/${selectedFile}/preview?sheet=${encodeURIComponent(selectedSheet)}&headerRow=${headerRow}`
      );
      if (!response.ok) throw new Error('Error al cargar vista previa');
      const data = await response.json();
      setPreview(data);
    } catch {
      toast.error('Error al cargar vista previa');
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    toast.success('Tabla confirmada correctamente');
  };

  const selectedFileData = files.find((f) => f.id === selectedFile);
  const canContinue = isConfirmed;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Selecciona la tabla que contiene los datos reales.</strong>
          <br />
          El sistema ignorará títulos, encabezados decorativos y textos informativos.
        </p>
      </div>

      {/* File and sheet selection */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Archivo</label>
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un archivo" />
              </SelectTrigger>
              <SelectContent>
                {files.map((file) => (
                  <SelectItem key={file.id} value={file.id}>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      {file.originalName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Hoja</label>
            <Select value={selectedSheet} onValueChange={setSelectedSheet}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una hoja" />
              </SelectTrigger>
              <SelectContent>
                {selectedFileData?.detectedSheets?.map((sheet) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Fila de cabecera (donde están los nombres de columna)
          </label>
          <Select value={String(headerRow)} onValueChange={(v) => setHeaderRow(Number(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((row) => (
                <SelectItem key={row} value={String(row)}>
                  Fila {row}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Las filas anteriores serán ignoradas
          </p>
        </div>
      </Card>

      {/* Preview */}
      {preview && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Vista previa de datos</h3>
              <p className="text-sm text-muted-foreground">
                Mostrando primeras 5 filas
              </p>
            </div>
            {!isConfirmed && (
              <Button onClick={handleConfirm} variant="outline">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar tabla
              </Button>
            )}
            {isConfirmed && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Confirmado
              </Badge>
            )}
          </div>

          <div className="border rounded-lg overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  {preview.headers.map((header, idx) => (
                    <TableHead key={idx} className="font-semibold">
                      {header || `Columna ${idx + 1}`}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {preview.rows.slice(0, 5).map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {preview.headers.map((header, colIdx) => (
                      <TableCell key={colIdx} className="text-sm">
                        {String(row[header] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {canContinue ? (
            <span className="text-green-600 font-medium">✓ Tabla lista para mapear</span>
          ) : (
            <span>Confirma la tabla para continuar</span>
          )}
        </div>
        <Button onClick={onComplete} disabled={!canContinue} size="lg">
          Continuar al siguiente paso
        </Button>
      </div>
    </div>
  );
}
