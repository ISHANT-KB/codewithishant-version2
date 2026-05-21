import { getJson } from "./client";
import { Note } from "@/types/note";

export const getNotes = async (): Promise<Note[]> => {
  return getJson<Note[]>("/notes", "Failed to fetch notes");
};

export const getNote = async (id: string): Promise<Note> => {
  return getJson<Note>(`/notes/${id}`, "Failed to fetch note");
};
