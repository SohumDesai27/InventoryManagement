import { ImageAnnotatorClient } from '@google-cloud/vision';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const client = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const [result] = await client.objectLocalization({
      image: { content: Buffer.from(body.image) },
    });

    return NextResponse.json({ responses: [result] });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}