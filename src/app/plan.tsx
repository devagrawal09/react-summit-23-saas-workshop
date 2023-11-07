"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

export const CustomUserButton = (props: { PlanPage?: React.ReactNode }) => {
  return (
    <UserButton afterSignOutUrl="/">
      <UserButton.UserProfilePage
        label="Plan"
        url="custom"
        labelIcon={<PlanIcon />}
      >
        {props.PlanPage}
      </UserButton.UserProfilePage>
    </UserButton>
  );
};

export const CustomOrganizationSwitcher = (props: {
  PlanPage?: React.ReactNode;
}) => {
  return (
    <OrganizationSwitcher>
      <OrganizationSwitcher.OrganizationProfilePage
        label="Plan"
        url="custom"
        labelIcon={<PlanIcon />}
      >
        {props.PlanPage}
      </OrganizationSwitcher.OrganizationProfilePage>
    </OrganizationSwitcher>
  );
};

export function DowngradeHandler(props: {
  className?: string;
  downgradeUser(): Promise<boolean>;
}) {
  const [done, downgradeUser] = useFormState(props.downgradeUser, false);

  useEffect(() => {
    if (done) {
      window.location.href = window.location.href;
    }
  }, [done]);

  return (
    <form action={downgradeUser}>
      <DowngradeSubmit className={props.className} />
    </form>
  );
}

function DowngradeSubmit(props: { className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={props.className} disabled={pending}>
      {pending ? "Downgrading..." : "Downgrade"}
    </button>
  );
}

function PlanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a7 7 0 00-7 7v3h14v-3a7 7 0 00-7-7zm-7 9a5 5 0 0110 0v2H3v-2zm12 0a3 3 0 00-6 0v2h6v-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
