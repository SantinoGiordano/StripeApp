import { SuccessPageComponent } from "@/app/components/SuccessPage";
import { Product } from "@/types/types";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

// payment_intent
// payment_intent_client_secret
// redirect_status
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined | null }>;
}) {
  const { payment_intent, payment_intent_client_secret, redirect_status } =
    await searchParams;
    
  const intent = await stripe.paymentIntents.retrieve(
    payment_intent as string,
    {
      client_secret: payment_intent_client_secret!,
      expand: []
    }
  );
  const status = intent.status
  const cart = JSON.parse(intent.metadata.cart || '[]') as Product[]
  const email = intent.receipt_email
  console.log({ status, cart, email})
  
  if (status === "succeeded" && email) {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, cart }),
    });
  }
  
  return <SuccessPageComponent />;
}
// check if status is succeeded
// read db for list of cart items by ObjecId
// calculate total proce by db item price entries
// get file name of each db cart item 

// loop through the cart, get IDS
// map ids by file name
// RETRIEVE from BLOB STORAGE
// \https://vercel.com/docs/vercel-blob
// map items from blob into memopry
// build email with attachments
// send email to recipient
