"use client";

import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { createStripeSession } from "./action";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        const session = await createStripeSession({
          quantity: 1,
          unit_amount: 100,
        });
        console.log({ session });

        if (!session) {
          alert("Could not create session");
          return;
        }

        const stripe = await getStripe();
        if (!stripe) {
          alert("Could not load stripe");
          return;
        }
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) {
          alert(error.message);
        }
      }}
      disabled={loading}
    >
      {loading ? "Loading..." : "Checkout"}
    </button>
  );
}
