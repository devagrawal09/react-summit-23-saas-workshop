import type Stripe from "stripe";

export {};

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      stripe: {
        status: Stripe.Checkout.Session.Status;
        payment: Stripe.Checkout.Session.PaymentStatus;
      };
    };
  }
}
