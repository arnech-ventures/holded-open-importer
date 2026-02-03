'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Code } from 'lucide-react';
import ImportWizard from '@/components/imports/import-wizard';

type ImportsTabProps = {
  projectId: string;
  entityType: string;
};

export default function ImportsTab({ projectId, entityType }: ImportsTabProps) {
  const [mode, setMode] = useState<'wizard' | 'technical'>('wizard');

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Importar datos</CardTitle>
              <CardDescription>
                Elige cómo prefieres trabajar: asistente guiado o interfaz técnica
              </CardDescription>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
              <TabsList>
                <TabsTrigger value="wizard">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Asistente
                </TabsTrigger>
                <TabsTrigger value="technical">
                  <Code className="h-4 w-4 mr-2" />
                  Técnico
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* Content based on mode */}
      {mode === 'wizard' ? (
        <ImportWizard projectId={projectId} entityType={entityType} />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Interfaz técnica</p>
              <p className="text-sm">
                Aquí irían las transformaciones, datasets y mapeos avanzados
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setMode('wizard')}>
                Volver al asistente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
