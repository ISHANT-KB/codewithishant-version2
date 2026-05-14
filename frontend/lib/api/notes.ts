import { getJson } from "./client";

export const getNotes = async () => {
  return getJson("/notes", "Failed to fetch notes");
};

export const getNote = async (id: string) => {
  return getJson(`/notes/${id}`, "Failed to fetch note");
};
