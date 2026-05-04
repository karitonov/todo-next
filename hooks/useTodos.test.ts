import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTodos } from "./useTodos";

vi.mock("@/utils/storage", () => ({
  loadTasks: vi.fn(() => []),
  saveTasks: vi.fn(),
}));

describe("useTodos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態は空のタスクリスト", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.tasks).toEqual([]);
  });

  it("addTaskでタスクを追加できる", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.addTask("新しいタスク");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("新しいタスク");
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("addTaskで期限付きタスクを追加できる", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.addTask("期限付きタスク", "2024-12-31");
    });

    expect(result.current.tasks[0].dueDate).toBe("2024-12-31");
  });

  it("toggleCompleteでタスクの完了状態を切り替えられる", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.addTask("タスク");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleComplete(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(true);

    act(() => {
      result.current.toggleComplete(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("editTaskでタスクを編集できる", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.addTask("元のタスク");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.editTask(taskId, "編集後のタスク", "2024-12-31");
    });

    expect(result.current.tasks[0].title).toBe("編集後のタスク");
    expect(result.current.tasks[0].dueDate).toBe("2024-12-31");
  });

  it("deleteTaskでタスクを削除できる", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.addTask("削除するタスク");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("showCompletedがfalseの場合、完了済みタスクはフィルタされる", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.addTask("未完了タスク");
      result.current.addTask("完了タスク");
    });

    const completedId = result.current.tasks[1].id;

    act(() => {
      result.current.toggleComplete(completedId);
    });

    act(() => {
      result.current.setShowCompleted(false);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("未完了タスク");
  });
});
