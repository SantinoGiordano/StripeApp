import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { BLOB_PRODUCTS } from "../../../lib/blob-product/blobProducts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: Request) {
  try {
    const { payment_intent } = await req.json();

    if (!payment_intent) {
      return NextResponse.json(
        { error: "Missing payment_intent" },
        { status: 400 }
      );
    }

    // Retrieve payment intent
    const intent = await stripe.paymentIntents.retrieve(payment_intent);

    const email = intent.receipt_email;
    const status = intent.status;

    if (!email) {
      return NextResponse.json(
        { error: "No email found in payment intent" },
        { status: 400 }
      );
    }

    if (status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not successful" },
        { status: 400 }
      );
    }

    // Retrieve IDs only (tiny metadata)
    const cartIds = intent.metadata.cart_ids?.split(",") || [];

    console.log("FINISH CHECKOUT CART IDS:", cartIds);

    const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];

    // Find matching products by ID and attach files
    for (const id of cartIds) {
      const match = BLOB_PRODUCTS.find((p) => p.id === id);

      if (!match) {
        console.error(`NO MATCH for id=${id}`);
        continue;
      }

      console.log("FETCHING:", match.downloadUrl);

      const file = await fetch(match.downloadUrl);

      if (!file.ok) {
        console.error("Failed fetching blob:", match.downloadUrl);
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());

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

    // Send email with all audio attachments
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Meditation Downloads",
      text: `Thank you for your purchase!\n\nYour audio files are attached.`,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FINISH CHECKOUT ERROR:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
