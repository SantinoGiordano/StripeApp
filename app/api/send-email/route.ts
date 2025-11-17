import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, cart } = await req.json();

    console.log("API /send-email called with:");
    console.log("Email:", email);
    console.log("Cart:", cart);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const cartDetails = cart
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => `${item.name} - $${item.price}`)
      .join("\n");

    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: "santinogiordano13@gmail.com",
      subject: `New Checkout from ${email}`,
      text: `Customer Email: ${email}\n\nCart Items:\n${cartDetails}`,
    };

    const mailOptionsCustomer = {
      from: process.env.EMAIL_USER,
      to: email, // send to customer
      subject: "Your Meditation Shop Purchase",
      text: `Thank you for your purchase!\n\nCart Items:\n${cartDetails}`,
    };

    console.log("Prepared email details (admin):", mailOptionsAdmin);
    console.log("Prepared email details (customer):", mailOptionsCustomer);

    const infoAdmin = await transporter.sendMail(mailOptionsAdmin);
    const infoCustomer = await transporter.sendMail(mailOptionsCustomer);

    console.log("Email sent to admin:", infoAdmin);
    console.log("Email sent to customer:", infoCustomer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
