"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { applySetCookie } from "@/app/(auth)/_utils/auth-cookies";

export const signOutAction = async () => {
  const result = await auth.api.signOut({
    headers: new Headers(await headers()),
    returnHeaders: true,
  });

  await applySetCookie(result.headers);
  redirect("/");
};
