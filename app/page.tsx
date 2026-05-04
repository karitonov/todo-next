"use client";

import { useTodos } from "@/hooks/useTodos";
import TaskForm from "@/components/TaskForm";
import TaskFilter from "@/components/TaskFilter";
import TaskList from "@/components/TaskList";

export default function Home() {
  const {
    tasks,
    isLoading,
    showCompleted,
    setShowCompleted,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
  } = useTodos();

  if (isLoading && typeof window !== "undefined") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <TaskForm onAddTask={addTask} />
          <TaskFilter
            showCompleted={showCompleted}
            onToggleShowCompleted={setShowCompleted}
          />
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </main>
  );
}
