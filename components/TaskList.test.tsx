import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";
import { Task } from "@/types/task";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "タスク1",
    completed: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "タスク2",
    completed: true,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
];

describe("TaskList", () => {
  const mockProps = {
    onToggleComplete: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it("タスクが空の場合は空状態メッセージを表示する", () => {
    render(<TaskList tasks={[]} {...mockProps} />);

    expect(
      screen.getByText("タスクがありません。新しいタスクを追加してください。")
    ).toBeInTheDocument();
  });

  it("タスクリストが表示される", () => {
    render(<TaskList tasks={mockTasks} {...mockProps} />);

    expect(screen.getByText("タスク1")).toBeInTheDocument();
    expect(screen.getByText("タスク2")).toBeInTheDocument();
  });

  it("タスク数分のアイテムが表示される", () => {
    render(<TaskList tasks={mockTasks} {...mockProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });
});
