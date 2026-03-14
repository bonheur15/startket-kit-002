import { getAuth } from "@/auth";

const handleRequest = async (request: Request) =>
  (await getAuth(request)).handler(request);

export const GET = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
