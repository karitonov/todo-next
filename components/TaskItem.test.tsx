import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "./TaskItem";
import { Task } from "@/types/task";

const baseTask: Task = {
  id: "test-id-1",
  title: "テストタスク",
  completed: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("TaskItem", () => {
  const mockOnToggleComplete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnToggleComplete.mockClear();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    vi.restoreAllMocks();
  });

  it("タスクタイトルが表示される", () => {
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("テストタスク")).toBeInTheDocument();
  });

  it("未完了タスクのチェックボックスはオフ", () => {
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("完了済みタスクのチェックボックスはオン", () => {
    const completedTask = { ...baseTask, completed: true };
    render(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("チェックボックスをクリックするとonToggleCompleteが呼ばれる", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith("test-id-1");
  });

  it("期限なしの場合は期限表示なし", () => {
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/期限:/)).not.toBeInTheDocument();
  });

  it("期限が未来の場合はデフォルト色で表示される", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const taskWithFutureDue = {
      ...baseTask,
      dueDate: futureDate.toISOString().split("T")[0],
    };

    render(
      <TaskItem
        task={taskWithFutureDue}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const dueDateEl = screen.getByText(/期限:/);
    expect(dueDateEl).toHaveClass("text-gray-500");
  });

  it("期限が過去の場合は赤色で表示される", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const taskWithOverdue = {
      ...baseTask,
      dueDate: pastDate.toISOString().split("T")[0],
    };

    render(
      <TaskItem
        task={taskWithOverdue}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const dueDateEl = screen.getByText(/期限:/);
    expect(dueDateEl).toHaveClass("text-red-500");
  });

  it("編集ボタンをクリックすると編集モードになる", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByRole("button", { name: "編集" });
    await user.click(editButton);

    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "キャンセル" })
    ).toBeInTheDocument();
  });

  it("編集後に保存するとonEditが呼ばれる", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "編集" }));

    const titleInput = screen.getByLabelText("タスク名を編集");
    await user.clear(titleInput);
    await user.type(titleInput, "編集後のタスク");

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(mockOnEdit).toHaveBeenCalledWith(
      "test-id-1",
      "編集後のタスク",
      undefined
    );
  });

  it("キャンセルすると元のタイトルに戻る", async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "編集" }));
    const titleInput = screen.getByLabelText("タスク名を編集");
    await user.clear(titleInput);
    await user.type(titleInput, "変更後");
    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(screen.getByText("テストタスク")).toBeInTheDocument();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("削除ボタンをクリックして確認するとonDeleteが呼ばれる", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(mockOnDelete).toHaveBeenCalledWith("test-id-1");
  });

  it("削除ボタンをクリックしてキャンセルするとonDeleteが呼ばれない", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <TaskItem
        task={baseTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
