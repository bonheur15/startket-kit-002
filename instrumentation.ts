const getServerFetchFamily = () => {
  const configured = process.env.SERVER_FETCH_FAMILY;

  if (configured === "4" || configured === "6") {
    return Number.parseInt(configured, 10) as 4 | 6;
  }

  // Local OAuth flows are commonly affected by broken IPv6 routing on dev machines.
  if (process.env.NODE_ENV === "development") {
    return 4;
  }

  return undefined;
};

export async function register() {
  const family = getServerFetchFamily();

  if (!family) {
    return;
  }

  const { Agent, setGlobalDispatcher } = await import("undici");

  setGlobalDispatcher(
    new Agent({
      connect: {
        family,
      },
    }),
  );
}
