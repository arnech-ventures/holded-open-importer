import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; fileId: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const sheet = searchParams.get('sheet');
    const headerRow = parseInt(searchParams.get('headerRow') || '1');

    // Simulated preview data
    const preview = {
      headers: ['NIF', 'Nombre', 'Email', 'Teléfono', 'Dirección', 'Ciudad', 'CP'],
      rows: Array.from({ length: 5 }, (_, i) => ({
        NIF: `B${12345678 + i}`,
        Nombre: `Cliente ${i + 1}`,
        Email: `cliente${i + 1}@example.com`,
        Teléfono: '600123456',
        Dirección: `Calle Principal ${i + 1}`,
        Ciudad: 'Madrid',
        CP: '28001',
      })),
    };

    return NextResponse.json(preview);
  } catch (error) {
    console.error('Error fetching preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview' },
      { status: 500 }
    );
  }
}
