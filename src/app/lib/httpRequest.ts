export const httpRequest = async (url: string, method: string, data?: any) => {
  const token = process.env.NEXT_PUBLIC_CHIMONEY_API_KEY;
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["X-API-KEY"] = token;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (method !== "GET" && data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);

  return await response.json();
};
