'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import step components
import StepUploadFiles from './steps/step-upload-files';
import StepPrepareTables from './steps/step-prepare-tables';
import StepAssignFields from './steps/step-assign-fields';
import StepReviewData from './steps/step-review-data';
import StepExportImport from './steps/step-export-import';

export type WizardStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
  isLocked: boolean;
};

type ImportWizardProps = {
  projectId: string;
  entityType: string;
};

export default function ImportWizard({ projectId, entityType }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WizardStep[]>([
    {
      id: 'upload',
      title: '1) Subir archivos del cliente',
      description: 'Sube los archivos Excel que te haya proporcionado el cliente',
      status: 'active',
      isLocked: false,
    },
    {
      id: 'prepare',
      title: '2) Preparar tablas',
      description: 'Selecciona la tabla que contiene los datos reales',
      status: 'pending',
      isLocked: true,
    },
    {
      id: 'mapping',
      title: '3) Asignar campos',
      description: 'Indica qué columna corresponde a cada campo',
      status: 'pending',
      isLocked: true,
    },
    {
      id: 'review',
      title: '4) Revisar datos',
      description: 'Revisa los datos antes de generar la salida final',
      status: 'pending',
      isLocked: true,
    },
    {
      id: 'export',
      title: '5) Exportar / Importar',
      description: 'Genera archivos o importa directamente a Holded',
      status: 'pending',
      isLocked: true,
    },
  ]);

  const updateStepStatus = (stepIndex: number, status: WizardStep['status']) => {
    setSteps((prev) =>
      prev.map((step, idx) => {
        if (idx === stepIndex) {
          return { ...step, status };
        }
        if (idx === stepIndex + 1 && status === 'complete') {
          return { ...step, isLocked: false };
        }
        return step;
      })
    );
  };

  const goToStep = (stepIndex: number) => {
    const targetStep = steps[stepIndex];
    if (!targetStep || targetStep.isLocked) return;
    
    setSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === stepIndex ? 'active' : step.status === 'complete' ? 'complete' : 'pending',
      }))
    );
    setCurrentStep(stepIndex);
  };

  const completeCurrentStep = () => {
    updateStepStatus(currentStep, 'complete');
    if (currentStep < steps.length - 1) {
      setTimeout(() => goToStep(currentStep + 1), 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardHeader>
          <CardTitle>Asistente de Importación</CardTitle>
          <CardDescription>
            Sigue los pasos para importar datos a Holded de forma guiada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                disabled={step.isLocked}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                  step.status === 'active' && 'bg-primary/10 border-2 border-primary',
                  step.status === 'complete' && 'bg-green-50 border border-green-200',
                  step.status === 'pending' && !step.isLocked && 'hover:bg-muted',
                  step.isLocked && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="shrink-0">
                  {step.status === 'complete' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle
                      className={cn(
                        'h-5 w-5',
                        step.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{step.description}</div>
                </div>
                {step.status === 'active' && (
                  <ChevronRight className="h-5 w-5 text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]?.title}</CardTitle>
          <CardDescription>{steps[currentStep]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <StepUploadFiles
              projectId={projectId}
              onComplete={completeCurrentStep}
            />
          )}
          {currentStep === 1 && (
            <StepPrepareTables
              projectId={projectId}
              entityType={entityType}
              onComplete={completeCurrentStep}
            />
          )}
          {currentStep === 2 && (
            <StepAssignFields
              projectId={projectId}
              entityType={entityType}
              onComplete={completeCurrentStep}
            />
          )}
          {currentStep === 3 && (
            <StepReviewData
              projectId={projectId}
              entityType={entityType}
              onComplete={completeCurrentStep}
            />
          )}
          {currentStep === 4 && (
            <StepExportImport
              projectId={projectId}
              entityType={entityType}
              onComplete={completeCurrentStep}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
