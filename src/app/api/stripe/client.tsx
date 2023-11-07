"use client";

import { Stripe as StripeClient, loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import type S from "stripe";

let stripePromise: Promise<StripeClient | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export function CheckoutButton(props: {
  createStripeSession(): Promise<S.Response<S.Checkout.Session> | undefined>;
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        const session = await props.createStripeSession();

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
      className={`rounded bg-blue-300 p-2 px-4 ${props.className}`}
    >
      {props.children ?? "Upgrade"}
    </button>
  );
}
