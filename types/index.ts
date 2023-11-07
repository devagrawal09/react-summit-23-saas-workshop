export {};

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      plan?: "free" | "paid";
    };
    orgMetadata: {
      plan?: "free" | "paid";
    };
  }
  interface UserPublicMetadata {
    plan?: "free" | "paid";
  }

  interface OrganizationPublicMetadata {
    plan?: "free" | "paid";
  }
}
