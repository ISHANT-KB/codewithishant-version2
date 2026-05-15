import { API_BASE_URL, getJson } from "./client";
import { Cheatsheet } from "@/types/cheatsheet";

export const getCheatsheets = async (): Promise<Cheatsheet[]> => {
  return getJson("/cheatsheets", "Failed to fetch cheatsheets");
};

export const getCheatsheet = async (slug: string): Promise<Cheatsheet> => {
  const url = `${API_BASE_URL}/cheatsheets/${slug}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch cheatsheet "${slug}": ${res.status} ${res.statusText}`);
  }
  return res.json();
};
