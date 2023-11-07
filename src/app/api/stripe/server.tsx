import { headers } from "next/headers";
import Stripe from "stripe";
import { CheckoutButton } from "./client";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export function StripeCheckout({
  membership_price,
  className,
  children,
  metadata,
}: {
  membership_price: number;
  className?: string;
  children?: React.ReactNode;
  metadata: {
    [name: string]: string | number | null;
  };
}) {
  async function createStripeSession() {
    "use server";
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
              unit_amount: membership_price,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata,
        mode: "subscription",
        success_url: `${headersList.get("origin")}/dashboard`,
        cancel_url: `${headersList.get("origin")}/dashboard`,
      });

      return JSON.parse(
        JSON.stringify(session),
      ) as Stripe.Response<Stripe.Checkout.Session>;
    } catch (error) {
      console.error(`createStripeSession()`, error);
    }
  }

  return (
    <CheckoutButton
      createStripeSession={createStripeSession}
      className={className}
      children={children}
    />
  );
}
