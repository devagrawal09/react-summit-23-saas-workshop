import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "./server";

const webhookSecret = `whsec_3ed2c09fd58634dc23cb1c191cb1ed1f507aaf2f0d20f1708e8ac3fd4b62a461`;

export async function POST(req: NextRequest) {
  if (req === null)
    throw new Error(`Missing userId or request`, { cause: { req } });
  // Stripe sends this for us 🎉
  const stripeSignature = req.headers.get("stripe-signature");
  // If we don't get it, we can't do anything else!
  if (stripeSignature === null) throw new Error("stripeSignature is null");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      stripeSignature,
      webhookSecret,
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        },
      );
  }

  if (event === undefined) throw new Error(`event is undefined`);

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`Payment successful for session ID: ${session.id}`);
      const user = await clerkClient.users.updateUserMetadata(
        event.data.object.metadata?.userId as string,
        {
          publicMetadata: {
            stripe: {
              status: session.status,
              payment: session.payment_status,
            },
          },
        },
      );
      console.log(`Updated user metadata: ${user.publicMetadata}`);
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ status: 200, message: "success" });
}
