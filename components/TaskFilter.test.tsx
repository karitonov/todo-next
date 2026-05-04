import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskFilter from "./TaskFilter";

describe("TaskFilter", () => {
  it("完了済み表示中はチェックボックスがオン", () => {
    render(
      <TaskFilter showCompleted={true} onToggleShowCompleted={vi.fn()} />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("完了済み非表示中はチェックボックスがオフ", () => {
    render(
      <TaskFilter showCompleted={false} onToggleShowCompleted={vi.fn()} />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("チェックボックスをクリックするとonToggleShowCompletedが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    render(<TaskFilter showCompleted={true} onToggleShowCompleted={mockToggle} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith(false);
  });

  it("ラベルテキストが表示される", () => {
    render(
      <TaskFilter showCompleted={true} onToggleShowCompleted={vi.fn()} />
    );

    expect(screen.getByText("完了済みのタスクを表示")).toBeInTheDocument();
  });
});
