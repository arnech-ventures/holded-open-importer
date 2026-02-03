import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/features/imports/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const files = await prisma.sourceFile.findMany({
      where: { projectId },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        originalName: true,
        detectedSheets: true,
        uploadedAt: true,
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate file upload and processing
    const sourceFile = await prisma.sourceFile.create({
      data: {
        projectId,
        originalName: file.name,
        storagePath: `/uploads/${Date.now()}-${file.name}`,
        mimeType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        sizeBytes: file.size,
        detectedSheets: ['Hoja1', 'Hoja2'],
      },
    });

    return NextResponse.json(sourceFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
