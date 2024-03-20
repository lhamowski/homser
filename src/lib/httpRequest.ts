export async function sendRequest<T = undefined>(
  url: string,
  method: string,
  data?: any
): Promise<T | undefined> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method: method,
    headers: headers,
    body: JSON.stringify(data),
    cache: "no-cache"
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error (Status: ${response.status})`);
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Request failed:", error.message);
      throw error;
    } else {
      console.error("Request failed with unknown error:", error);
      throw new Error("Request failed with unknown error");
    }
  }
}
