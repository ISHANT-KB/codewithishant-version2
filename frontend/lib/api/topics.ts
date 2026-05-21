import { API_BASE_URL, getJson } from "./client";
import { Note } from "@/types/note";
import { Topic } from "@/types/topic";

type TopicFullResponse = {
  topic: Topic;
  notes: Note[];
};

export const getTopics = async (): Promise<Topic[]> => {
  return getJson<Topic[]>("/topics", "Failed to fetch topics");
};

export const getTopicFull = async (slug: string): Promise<TopicFullResponse> => {
  const urls = [`/topics/${slug}/full`, `/topics/${slug}`];
  let lastError = new Error("Failed to fetch topic");

  for (const path of urls) {
    const url = `${API_BASE_URL}${path}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        return res.json() as Promise<TopicFullResponse>;
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
