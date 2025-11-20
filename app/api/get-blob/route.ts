import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      url: "https://gidpqrp8kmdnhzy1.public.blob.vercel-storage.com/.PRODUCTS/687fa4a7d59f9a593b7dad10.mp3",
      downloadUrl:
        "https://gidpqrp8kmdnhzy1.public.blob.vercel-storage.com/.PRODUCTS/687fa4a7d59f9a593b7dad10.mp3?download=1",
      pathname: ".PRODUCTS/687fa4a7d59f9a593b7dad10.mp3",
      contentType: "audio/mpeg",
      contentDisposition: 'inline; filename="687fa4a7d59f9a593b7dad10.mp3"',
      name: "Short Meditation",
    },
    {
      url: "https://gidpqrp8kmdnhzy1.public.blob.vercel-storage.com/.PRODUCTS/687fa4e9d59f9a593b7dad12.mp3",
      downloadUrl:
        "https://gidpqrp8kmdnhzy1.public.blob.vercel-storage.com/.PRODUCTS/687fa4e9d59f9a593b7dad12.mp3?download=1",
      pathname: ".PRODUCTS/687fa4e9d59f9a593b7dad12.mp3",
      contentType: "audio/mpeg",
      contentDisposition: 'inline; filename="687fa4e9d59f9a593b7dad12.mp3"',
      name: "Relax Meditation",
    },
    {
      url: "https://gidpqrp8kmdnhzy1.public.blob.vercel-storage.com/.PRODUCTS/687fa46ad59f9a593b7dad0e.mp3",
      downloadUrl:
        "https://gidpqrp8kmdnhzy1.public.blob.vercel-storage.com/.PRODUCTS/687fa46ad59f9a593b7dad0e.mp3?download=1",
      pathname: ".PRODUCTS/687fa46ad59f9a593b7dad0e.mp3",
      contentType: "audio/mpeg",
      contentDisposition: 'inline; filename="687fa46ad59f9a593b7dad0e.mp3"',
      name: "Sleep Meditation",
    },
  ]);
}
