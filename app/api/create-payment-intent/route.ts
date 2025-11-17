import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, cart } = await request.json();
    console.log("Creating payment intent with amount:", amount);
    console.log("Creating payment intent with amount:", cart);

    // VALDATE CART OBJECT EXISTS
    // TOD DO NOT TRUST AMOUNT FROM FRONtENT 
    // LOOP OVER CART ITEMS AND ADD THEM UP YOURSELF
    // MAKE DB REQUEST, LIST ALL ITEMS FROM DB -> GET PRICCES -> CALCULATE TOTAL

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      
      metadata: {
        cart,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
