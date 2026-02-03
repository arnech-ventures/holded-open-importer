import { prisma, Prisma, RunStatus } from '@repo/database';

export type RunImportOptions = {
  importId: string;
  entityType: string;
  data: Record<string, unknown>[];
};

export async function runImport(options: RunImportOptions): Promise<void> {
  const { importId, data } = options;

  try {
    await prisma.importRun.update({
      where: { id: importId },
      data: {
        status: RunStatus.RUNNING,
      },
    });

    // Simulated import process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const summary = {
      totalRecords: data.length,
      successCount: data.length,
      errorCount: 0,
      completedAt: new Date().toISOString(),
    } as Prisma.InputJsonValue;

    await prisma.importRun.update({
      where: { id: importId },
      data: {
        status: RunStatus.SUCCESS,
        summary,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    const errorSummary = {
      error: error instanceof Error ? error.message : 'Unknown error',
      failedAt: new Date().toISOString(),
    } as Prisma.InputJsonValue;

    await prisma.importRun.update({
      where: { id: importId },
      data: {
        status: RunStatus.FAILED,
        summary: errorSummary,
      },
    });
    throw error;
  }
}
