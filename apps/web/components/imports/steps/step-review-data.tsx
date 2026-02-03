'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, XCircle } from 'lucide-react';

type DataStats = {
  total: number;
  ready: number;
  warnings: number;
  errors: number;
};

type DataIssue = {
  rowIndex: number;
  type: 'error' | 'warning';
  field: string;
  message: string;
};

type DataRow = {
  [key: string]: unknown;
  _rowIndex: number;
};

type StepReviewDataProps = {
  projectId: string;
  entityType: string;
  onComplete: () => void;
};

export default function StepReviewData({ onComplete }: StepReviewDataProps) {
  const [stats, setStats] = useState<DataStats>({
    total: 0,
    ready: 0,
    warnings: 0,
    errors: 0,
  });
  const [issues, setIssues] = useState<DataIssue[]>([]);
  const [rows, setRows] = useState<DataRow[]>([]);
  const [filter, setFilter] = useState<'all' | 'errors' | 'warnings'>('all');

  const loadDataReview = async () => {
    // Simulated data - in real implementation, call unified dataset API
    const mockStats = {
      total: 150,
      ready: 142,
      warnings: 5,
      errors: 3,
    };

    const mockIssues: DataIssue[] = [
      { rowIndex: 5, type: 'error', field: 'NIF', message: 'Falta NIF' },
      { rowIndex: 12, type: 'error', field: 'NIF', message: 'Falta NIF' },
      { rowIndex: 23, type: 'error', field: 'Nombre', message: 'Falta nombre' },
      { rowIndex: 8, type: 'warning', field: 'Email', message: 'Email sin formato válido' },
      { rowIndex: 15, type: 'warning', field: 'Teléfono', message: 'Teléfono incompleto' },
      { rowIndex: 34, type: 'warning', field: 'CP', message: 'Código postal no reconocido' },
      { rowIndex: 67, type: 'warning', field: 'Email', message: 'Email sin formato válido' },
      { rowIndex: 89, type: 'warning', field: 'Dirección', message: 'Dirección muy corta' },
    ];

    const mockRows: DataRow[] = Array.from({ length: 10 }, (_, i) => ({
      _rowIndex: i + 1,
      NIF: i === 5 || i === 12 ? '' : `B${12345678 + i}`,
      Nombre: i === 23 ? '' : `Cliente ${i + 1}`,
      Email: `cliente${i + 1}@example.com`,
      Teléfono: '600123456',
      Ciudad: 'Madrid',
    }));

    setStats(mockStats);
    setIssues(mockIssues);
    setRows(mockRows);
  };

  useEffect(() => {
    loadDataReview();
  }, []);

  const filteredIssues =
    filter === 'all' ? issues : issues.filter((issue) => issue.type === filter.replace('s', '') as 'error' | 'warning');

  const canContinue = stats.errors === 0;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Revisa los datos antes de generar la salida final.</strong>
          <br />
          Los errores deben corregirse, los avisos son opcionales.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total registros</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="text-sm text-green-800 mb-1">Listos</div>
          <div className="text-2xl font-bold text-green-900">{stats.ready}</div>
        </Card>
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="text-sm text-orange-800 mb-1">Avisos</div>
          <div className="text-2xl font-bold text-orange-900">{stats.warnings}</div>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="text-sm text-red-800 mb-1">Errores</div>
          <div className="text-2xl font-bold text-red-900">{stats.errors}</div>
        </Card>
      </div>

      {/* Issues list */}
      {issues.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Problemas detectados</h3>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({issues.length})
                </TabsTrigger>
                <TabsTrigger value="errors">
                  Errores ({stats.errors})
                </TabsTrigger>
                <TabsTrigger value="warnings">
                  Avisos ({stats.warnings})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            {filteredIssues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
              >
                {issue.type === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    Fila {issue.rowIndex} • Campo: {issue.field}
                  </div>
                  <div className="text-sm text-muted-foreground">{issue.message}</div>
                </div>
                <Badge variant={issue.type === 'error' ? 'destructive' : 'secondary'}>
                  {issue.type === 'error' ? 'Error' : 'Aviso'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Data preview */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Vista previa de datos preparados</h3>
        <div className="border rounded-lg overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                {Object.keys(rows[0] || {})
                  .filter((k) => !k.startsWith('_'))
                  .map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 10).map((row) => (
                <TableRow key={row._rowIndex}>
                  <TableCell className="font-mono text-xs">{row._rowIndex}</TableCell>
                  {Object.entries(row)
                    .filter(([k]) => !k.startsWith('_'))
                    .map(([key, value]) => (
                      <TableCell key={key} className="text-sm">
                        {String(value || '')}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Mostrando primeras 10 filas de {stats.total}
        </p>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {canContinue ? (
            <span className="text-green-600 font-medium">
              ✓ Datos listos para exportar o importar
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              Corrige los {stats.errors} errores para continuar
            </span>
          )}
        </div>
        <Button onClick={onComplete} disabled={!canContinue} size="lg">
          Continuar al siguiente paso
        </Button>
      </div>
    </div>
  );
}
