import { Task } from "@/types/task";

const MIGRATION_VERSION_KEY = "todos_version";
const CURRENT_VERSION = 1;

export const migrateData = (data: unknown[]): Task[] => {
  if (typeof window === "undefined") return [];

  const storedVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
  const version = storedVersion ? parseInt(storedVersion, 10) : 0;

  let migratedData = data;

  if (version < 1) {
    migratedData = data.map((item) => {
      const obj = item as Record<string, unknown>;
      const now = new Date().toISOString();
      return {
        id: obj.id || crypto.randomUUID(),
        title: obj.title || obj.name || "Untitled Task",
        completed: obj.completed ?? obj.done ?? false,
        dueDate: obj.dueDate || obj.deadline || undefined,
        createdAt: obj.createdAt || obj.created || now,
        updatedAt: obj.updatedAt || obj.updated || now,
      };
    });
  }

  localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION.toString());

  return migratedData as Task[];
};
