'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle2, Upload, FileSpreadsheet, Code, ArrowRight } from 'lucide-react';

type EntityOrder = {
  entityType: string;
  label: string;
  order: number;
  status: 'pending' | 'ready' | 'completed';
  description: string;
};

const ENTITY_HIERARCHY: EntityOrder[] = [
  {
    entityType: 'CHART_OF_ACCOUNTS',
    label: '1. Cuentas contables',
    order: 1,
    status: 'ready',
    description: 'Plan contable y grupos',
  },
  {
    entityType: 'CONTACTS',
    label: '2. Contactos',
    order: 2,
    status: 'ready',
    description: 'Clientes, proveedores y empleados',
  },
  {
    entityType: 'PRODUCTS',
    label: '3. Productos',
    order: 3,
    status: 'ready',
    description: 'Catálogo de productos y servicios',
  },
  {
    entityType: 'DOCUMENTS',
    label: '4. Ventas y gastos',
    order: 4,
    status: 'pending',
    description: 'Facturas, albaranes y gastos',
  },
  {
    entityType: 'ASSETS',
    label: '5. Activos fijos',
    order: 5,
    status: 'pending',
    description: 'Inmovilizado y amortizaciones',
  },
];

type StepExportImportProps = {
  projectId: string;
  entityType: string;
  onComplete: () => void;
};

export default function StepExportImport({ onComplete }: StepExportImportProps) {
  const [hierarchy, setHierarchy] = useState<EntityOrder[]>(ENTITY_HIERARCHY);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleGenerateExcel = async (entity: string) => {
    setActiveAction(`excel-${entity}`);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Excel generado para ${entity}`);
      updateEntityStatus(entity, 'completed');
    } catch {
      toast.error('Error al generar Excel');
    } finally {
      setActiveAction(null);
    }
  };

  const handleGeneratePayload = async (entity: string) => {
    setActiveAction(`payload-${entity}`);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Payload generado para ${entity}`);
    } catch {
      toast.error('Error al generar payload');
    } finally {
      setActiveAction(null);
    }
  };

  const handleImportAPI = async (entity: string) => {
    setActiveAction(`import-${entity}`);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Importación completada para ${entity}`);
      updateEntityStatus(entity, 'completed');
    } catch {
      toast.error('Error al importar');
    } finally {
      setActiveAction(null);
    }
  };

  const updateEntityStatus = (entityType: string, status: EntityOrder['status']) => {
    setHierarchy((prev) =>
      prev.map((e) =>
        e.entityType === entityType ? { ...e, status } : e
      )
    );
  };

  const allCompleted = hierarchy.filter((e) => e.status === 'ready').every((e) => e.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Los datos se exportan o importan siguiendo el orden requerido por Holded.</strong>
          <br />
          Puedes generar Excel para revisión manual o importar directamente por API.
        </p>
      </div>

      {/* Entity hierarchy */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Orden de importación</h3>
        <div className="space-y-3">
          {hierarchy.map((entity, idx) => (
            <div key={entity.entityType}>
              <div
                className={`p-4 rounded-lg border-2 ${
                  entity.status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : entity.status === 'ready'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="shrink-0 mt-1">
                      {entity.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entity.label}</div>
                      <div className="text-sm text-muted-foreground">{entity.description}</div>
                      {entity.status === 'pending' && (
                        <Badge variant="secondary" className="mt-2">
                          Bloqueado hasta completar pasos anteriores
                        </Badge>
                      )}
                    </div>
                  </div>
                  {entity.status === 'ready' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateExcel(entity.entityType)}
                        disabled={activeAction !== null}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGeneratePayload(entity.entityType)}
                        disabled={activeAction !== null}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Payload
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleImportAPI(entity.entityType)}
                        disabled={activeAction !== null}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {idx < hierarchy.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Export options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <FileSpreadsheet className="h-8 w-8 text-green-600 mb-2" />
          <h4 className="font-medium mb-1">Generar Excel</h4>
          <p className="text-sm text-muted-foreground">
            Descarga plantilla de Holded para subir manualmente
          </p>
        </Card>
        <Card className="p-4">
          <Code className="h-8 w-8 text-blue-600 mb-2" />
          <h4 className="font-medium mb-1">Generar Payload API</h4>
          <p className="text-sm text-muted-foreground">
            Exporta JSON para integración personalizada
          </p>
        </Card>
        <Card className="p-4">
          <Upload className="h-8 w-8 text-purple-600 mb-2" />
          <h4 className="font-medium mb-1">Importar por API</h4>
          <p className="text-sm text-muted-foreground">
            Importación directa a Holded (requiere API key)
          </p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {allCompleted ? (
            <span className="text-green-600 font-medium">
              ✓ Todas las entidades procesadas
            </span>
          ) : (
            <span>Procesa las entidades en orden</span>
          )}
        </div>
        <Button onClick={onComplete} size="lg" variant={allCompleted ? 'default' : 'outline'}>
          {allCompleted ? 'Finalizar importación' : 'Cerrar asistente'}
        </Button>
      </div>
    </div>
  );
}
