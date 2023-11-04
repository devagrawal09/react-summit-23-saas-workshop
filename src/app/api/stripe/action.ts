"use server";

import { auth } from "@clerk/nextjs";
import { headers } from "next/headers";
import { stripe } from "./server";
import type Stripe from "stripe";

export async function createStripeSession({
  unit_amount,
  quantity,
}: {
  unit_amount: number;
  quantity: number;
}) {
  const { userId } = auth();
  const headersList = headers();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Membership",
            },
            unit_amount,
          },
          quantity,
        },
      ],
      metadata: { userId },
      mode: "payment",
      success_url: `${headersList.get("origin")}/dashboard`,
      cancel_url: `${headersList.get("origin")}/`,
    });

    return JSON.parse(
      JSON.stringify(session),
    ) as Stripe.Response<Stripe.Checkout.Session>;
  } catch (error) {
    console.error(`createStripeSession()`, error);
  }
}
