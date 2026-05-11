export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const getTopics = async () => {
  const res = await fetch(`${API_BASE_URL}/topics`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
};

export const getTopicFull = async (slug: string) => {
  const urls = [
    `${API_BASE_URL}/topics/${slug}/full`,
    `${API_BASE_URL}/topics/${slug}`,
  ];
  let lastError = new Error("Failed to fetch topic");

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
      lastError = new Error(
        `Failed to fetch topic from ${url}: ${res.status} ${res.statusText}`,
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError;
};
