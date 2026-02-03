import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { projectId } = await context.params;
  const { entityType } = await request.json();

  if (!entityType) {
    return NextResponse.json(
      { error: 'entityType is required' },
      { status: 400 }
    );
  }

  try {
    const result = await buildUnifiedDataset(projectId, entityType);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects/[projectId]/datasets/unified?entityType=CONTACTS&skip=0&take=10
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { projectId } = await context.params;
  const { searchParams } = request.nextUrl;
  const entityType = searchParams.get('entityType') as ReturnType<typeof searchParams.get>;
  const skip = parseInt(searchParams.get('skip') ?? '0');
  const take = parseInt(searchParams.get('take') ?? '10');

  if (!entityType) {
    return NextResponse.json(
      { error: 'entityType is required' },
      { status: 400 }
    );
  }

  const [rows, total] = await Promise.all([
    prisma.$queryRaw`SELECT * FROM "unified_datasets" WHERE "projectId" = ${projectId} ${entityType ? `AND "entityType" = '${entityType}'` : ''} ORDER BY "createdAt" DESC LIMIT ${take} OFFSET ${skip}`,
    prisma.$queryRaw`SELECT COUNT(*) as count FROM "unified_datasets" WHERE "projectId" = ${projectId} ${entityType ? `AND "entityType" = '${entityType}'` : ''}`,
  ]).then(([rows, countResult]) => {
    const count = Array.isArray(countResult) && countResult[0] ? (countResult[0] as Record<string, number>).count : 0;
    return [rows, count];
  });

  return NextResponse.json({
    rows,
    total,
    skip,
    take,
  });
}

async function buildUnifiedDataset(projectId: string, entityType: string) {
  // Placeholder implementation
  return {
    projectId,
    entityType,
    status: 'processing',
  };
}
