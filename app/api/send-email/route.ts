import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BLOB_PRODUCTS } from "../.blob-product/blob-products";

interface CartItem {
  _id: string;
  id: string;
  name?: string;
}

export async function POST(req: Request) {
  try {
    const { email, cart } = await req.json();

    console.log("CART RECEIVED:", cart);

    const purchasedDownloads = (cart as CartItem[])
      .map((item) => {
        const match = BLOB_PRODUCTS.find((p) => p.id === item._id);
        return match
          ? `${match.name}\nDownload: ${match.downloadUrl}\n`
          : `NO MATCH FOUND for item._id="${item._id}"\n`;
      })
      .join("\n");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Meditation Downloads",
      text:
        `Thank you for your purchase!\n\nHere are your downloads:\n\n` +
        purchasedDownloads,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
