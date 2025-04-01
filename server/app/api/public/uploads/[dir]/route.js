import fs from 'fs/promises';
import path from 'path';

export async function GET(req, { params }) {
  const { dir } = params;

  try {
    const filePath = path.join(process.cwd(), 'public', "uploads", dir);

    const data = await fs.readFile(filePath);
    return new Response(data, { status: 200 });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to read file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
