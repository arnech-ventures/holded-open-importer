export type ResolverContext = {
  entityType: string;
  data: Record<string, unknown>[];
};

export type ResolverResult = {
  data: Record<string, unknown>[];
  meta?: Record<string, unknown>;
};

export async function applyResolvers(
  context: ResolverContext
): Promise<ResolverResult> {
  const { data } = context;

  // Simple pass-through for now
  const meta: Record<string, unknown> = {
    totalRows: data.length,
    processedAt: new Date().toISOString(),
  };

  return {
    data,
    meta,
  };
}
