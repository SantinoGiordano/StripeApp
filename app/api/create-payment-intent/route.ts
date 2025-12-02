import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    type CartItem = { _id: string };
    const { amount, cart } = (await request.json()) as { amount: number; cart: CartItem[] };

    console.log("Creating payment intent with amount:", amount);
    console.log("Cart:", cart);

    // Only send small metadata (IDs only)
    const cartIds = cart.map((item: CartItem) => item._id).join(",");

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart_ids: cartIds, // 🔥 FIX: Tiny metadata
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

    // VALDATE CART OBJECT EXISTS
    // TOD DO NOT TRUST AMOUNT FROM FRONtENT 
    // LOOP OVER CART ITEMS AND ADD THEM UP YOURSELF
    // MAKE DB REQUEST, LIST ALL ITEMS FROM DB -> GET PRICCES -> CALCULATE TOTAL