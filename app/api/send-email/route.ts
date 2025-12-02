import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BLOB_PRODUCTS } from "../../../lib/.blob-product/blobProducts";

interface CartItem {
  _id: string;
  id: string;
  name?: string;
}

export async function POST(req: Request) {
  try {
    const { email, cart } = await req.json();

    console.log("CART RECEIVED:", cart);

    const attachments = [];

    // Fetch each blob file and create attachment
    for (const item of cart as CartItem[]) {
      const match = BLOB_PRODUCTS.find((p) => p.id === item._id);

      if (!match) {
        console.error(`NO MATCH FOUND for item._id="${item._id}"`);
        continue;
      }

      console.log("FETCHING MP3:", match.downloadUrl);

      // Fetch the MP3 bytes from Vercel Blob
      const response = await fetch(match.downloadUrl);

      if (!response.ok) {
        console.error("Failed to fetch blob:", match.downloadUrl);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      attachments.push({
        filename: match.name + ".mp3",
        content: buffer,
        contentType: "audio/mpeg",
      });
    }

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email with attachments
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Meditation Downloads",
      text: `Thank you for your purchase!\n\nYour audio files are attached to this email.\n`,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
