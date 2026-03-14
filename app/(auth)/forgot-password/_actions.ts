"use server";

import { requestPasswordReset } from "@/app/(auth)/_actions/recovery";

export type ResetRequestState = {
  error?: string;
  message?: string;
};

export const requestReset = async (
  state: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> => {
  return requestPasswordReset(state, formData);
};
