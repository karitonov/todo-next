"use client";

import { useState, useRef } from "react";

type FilterType = "all" | "active" | "completed";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Next.jsを学ぶ", completed: false },
    { id: 2, text: "TODOアプリを作る", completed: true },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const nextId = useRef(3);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: nextId.current++, text: trimmed, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: number) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
    }
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  const filterLabels: { key: FilterType; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "active", label: "未完了" },
    { key: "completed", label: "完了済み" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8 tracking-tight">
          TODOリスト
        </h1>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
          <button
            onClick={addTodo}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-sm transition-colors"
          >
            追加
          </button>
        </div>

        {/* フィルター */}
        <div className="flex gap-1 mb-4 bg-white dark:bg-gray-700 rounded-xl p-1 shadow-sm">
          {filterLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? "bg-indigo-500 text-white shadow"
                  : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TODOリスト */}
        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-10 text-sm">
              タスクがありません
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-600">
              {filtered.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 accent-indigo-500 cursor-pointer flex-shrink-0"
                  />

                  {editingId === todo.id ? (
                    <input
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(todo.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => saveEdit(todo.id)}
                      className="flex-1 px-2 py-1 text-sm border border-indigo-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => startEdit(todo)}
                      className={`flex-1 text-sm cursor-text select-none ${
                        todo.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-700 dark:text-gray-100"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  <button
                    onClick={() => startEdit(todo)}
                    title="編集"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-500 transition-opacity text-sm px-1"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    title="削除"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-sm px-1"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* フッター */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{activeCount}件の未完了タスク</span>
            {todos.some((t) => t.completed) && (
              <button
                onClick={clearCompleted}
                className="hover:text-red-500 transition-colors"
              >
                完了済みを削除
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
