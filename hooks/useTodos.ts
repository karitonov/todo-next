"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Task } from "@/types/task";
import { loadTasks, saveTasks } from "@/utils/storage";

export const useTodos = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const loaded = loadTasks();
      setTasks(loaded);
      setIsLoading(false);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((title: string, dueDate?: string) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      dueDate,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const editTask = useCallback(
    (id: string, title: string, dueDate?: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, title, dueDate, updatedAt: new Date().toISOString() }
            : task
        )
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  const filteredTasks = useMemo(() => {
    if (showCompleted) return tasks;
    return tasks.filter((task) => !task.completed);
  }, [tasks, showCompleted]);

  return {
    tasks: filteredTasks,
    isLoading,
    showCompleted,
    setShowCompleted,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
  };
};
