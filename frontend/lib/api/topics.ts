import { API_BASE_URL, getJson } from "./client";

export const getTopics = async () => {
  return getJson("/topics", "Failed to fetch topics");
};

export const getTopicFull = async (slug: string) => {
  const urls = [`/topics/${slug}/full`, `/topics/${slug}`];
  let lastError = new Error("Failed to fetch topic");

  for (const path of urls) {
    const url = `${API_BASE_URL}${path}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        return res.json();
      }
      lastError = new Error(
        `Failed to fetch topic from ${url}: ${res.status} ${res.statusText}`,
      );
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError;
};
