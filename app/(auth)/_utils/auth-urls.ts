import { baseURL } from "@/lib/app-config";

export const getBaseUrl = () => baseURL;

export const getAppOrigin = () => new URL(getBaseUrl()).origin;
