import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Table } from "./Table";

interface Row { id: string; name: string; value: number }

const data: Row[] = [
  { id: "1", name: "Alice", value: 10 },
  { id: "2", name: "Bob", value: 20 },
  { id: "3", name: "Charlie", value: 5 },
];

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "value", header: "Value", sortable: true },
];

describe("Table", () => {
  it("renders rows", () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  it("shows empty message when no data", () => {
    render(<Table columns={columns} data={[]} rowKey={(_, i) => String(i)} emptyMessage="Empty" />);
    expect(screen.getByText("Empty")).toBeTruthy();
  });

  it("sorts on column click", () => {
    const { container } = render(<Table columns={columns} data={data} rowKey={(r) => r.id} />);
    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader);
    const cells = container.querySelectorAll("tbody td");
    expect(cells[0].textContent).toBe("Alice");
  });

  it("paginates", () => {
    render(<Table columns={columns} data={data} rowKey={(r) => r.id} pageSize={2} />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
    expect(screen.queryByText("Charlie")).toBeNull();
    expect(screen.getByText("Page 1 of 2")).toBeTruthy();
  });

  it("supports row selection", () => {
    const onChange = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectable
        selectedKeys={new Set()}
        onSelectionChange={onChange}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // first data row
    expect(onChange).toHaveBeenCalled();
  });
});
