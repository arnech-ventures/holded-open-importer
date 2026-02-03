'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, ChevronDown, Sparkles, AlertCircle } from 'lucide-react';

type FieldMapping = {
  field: string;
  label: string;
  required: boolean;
  column: string | null;
};

const ENTITY_FIELDS: Record<string, FieldMapping[]> = {
  CONTACTS: [
    { field: 'vatnumber', label: 'NIF/CIF', required: true, column: null },
    { field: 'name', label: 'Nombre o razón social', required: true, column: null },
    { field: 'email', label: 'Email', required: false, column: null },
    { field: 'phone', label: 'Teléfono', required: false, column: null },
    { field: 'address', label: 'Dirección', required: false, column: null },
    { field: 'city', label: 'Ciudad', required: false, column: null },
    { field: 'postalcode', label: 'Código postal', required: false, column: null },
  ],
  PRODUCTS: [
    { field: 'sku', label: 'Código SKU', required: true, column: null },
    { field: 'name', label: 'Nombre del producto', required: true, column: null },
    { field: 'price', label: 'Precio', required: true, column: null },
    { field: 'description', label: 'Descripción', required: false, column: null },
    { field: 'stock', label: 'Stock', required: false, column: null },
  ],
  EMPLOYEES: [
    { field: 'fiscalId', label: 'NIF', required: true, column: null },
    { field: 'name', label: 'Nombre completo', required: true, column: null },
    { field: 'email', label: 'Email', required: false, column: null },
    { field: 'phone', label: 'Teléfono', required: false, column: null },
  ],
};

type StepAssignFieldsProps = {
  projectId: string;
  entityType: string;
  onComplete: () => void;
};

export default function StepAssignFields({ entityType, onComplete }: StepAssignFieldsProps) {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>(
    ENTITY_FIELDS[entityType] || []
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchColumns = async () => {
    // Simulated - in real implementation, fetch from latest file preview
    setAvailableColumns([
      'NIF',
      'Nombre',
      'Email',
      'Teléfono',
      'Dirección',
      'CP',
      'Ciudad',
      'Código',
      'Descripción',
      'Precio',
    ]);
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  const handleAutoMap = () => {
    const autoMapped = mappings.map((mapping) => {
      // Simple heuristic matching
      const matchedColumn = availableColumns.find((col) => {
        const colLower = col.toLowerCase();
        const labelLower = mapping.label.toLowerCase();
        return (
          colLower.includes(labelLower) ||
          labelLower.includes(colLower) ||
          (mapping.field === 'vatnumber' && (colLower.includes('nif') || colLower.includes('cif'))) ||
          (mapping.field === 'sku' && colLower.includes('código'))
        );
      });
      return { ...mapping, column: matchedColumn || mapping.column };
    });
    setMappings(autoMapped);
    toast.success('Campos asignados automáticamente');
  };

  const handleColumnChange = (field: string, column: string | null) => {
    setMappings((prev) =>
      prev.map((m) => (m.field === field ? { ...m, column } : m))
    );
  };

  const requiredMappings = mappings.filter((m) => m.required);
  const optionalMappings = mappings.filter((m) => !m.required);
  const requiredComplete = requiredMappings.every((m) => m.column);
  const totalMapped = mappings.filter((m) => m.column).length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Indica qué columna de tu Excel corresponde a cada campo.</strong>
          <br />
          Los campos obligatorios son necesarios para continuar.
        </p>
      </div>

      {/* Auto-map button */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">{totalMapped}</span> de {mappings.length} campos asignados
        </div>
        <Button onClick={handleAutoMap} variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          Asignar automáticamente
        </Button>
      </div>

      {/* Required fields */}
      <Card className="p-4">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          Campos obligatorios
        </h3>
        <div className="space-y-4">
          {requiredMappings.map((mapping) => (
            <div key={mapping.field} className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1">{mapping.label}</label>
                <Select
                  value={mapping.column || ''}
                  onValueChange={(v) => handleColumnChange(mapping.field, v || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una columna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {availableColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {mapping.column && (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Optional fields */}
      {optionalMappings.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Campos opcionales</h3>
          <div className="space-y-4">
            {optionalMappings.map((mapping) => (
              <div key={mapping.field} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">{mapping.label}</label>
                  <Select
                    value={mapping.column || ''}
                    onValueChange={(v) => handleColumnChange(mapping.field, v || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una columna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {availableColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {mapping.column && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Advanced options */}
      {showAdvanced && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Opciones avanzadas</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(false)}>
              <ChevronDown className="h-4 w-4 rotate-180" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Editor de mapping JSON para usuarios técnicos
          </p>
          <div className="bg-muted p-4 rounded-lg font-mono text-xs">
            {JSON.stringify(
              Object.fromEntries(mappings.filter((m) => m.column).map((m) => [m.field, m.column])),
              null,
              2
            )}
          </div>
        </Card>
      )}
      
      {!showAdvanced && (
        <Button variant="ghost" className="w-full" onClick={() => setShowAdvanced(true)}>
          Mostrar opciones avanzadas
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {requiredComplete ? (
            <span className="text-green-600 font-medium">
              ✓ Todos los campos obligatorios asignados
            </span>
          ) : (
            <span>Asigna los campos obligatorios para continuar</span>
          )}
        </div>
        <Button onClick={onComplete} disabled={!requiredComplete} size="lg">
          Continuar al siguiente paso
        </Button>
      </div>
    </div>
  );
}
