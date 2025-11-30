"use client";

import { useEffect } from "react";
import { use } from "react"; // ⬅ REQUIRED to unwrap searchParams
import { SuccessPageComponent } from "@/app/components/SuccessPage";

export default function Success({ searchParams }: { searchParams: Promise<{ payment_intent?: string }> }) {
  // ⬅ Unwrap the Promise using `use()`
  const params = use(searchParams) as { payment_intent?: string };
  const payment_intent = params?.payment_intent;

  useEffect(() => {
    const run = async () => {
      if (!payment_intent) return;

      await fetch("/api/finish-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_intent }),
      });
    };

    run();
  }, [payment_intent]);

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
// pull logic from the send-email to here 