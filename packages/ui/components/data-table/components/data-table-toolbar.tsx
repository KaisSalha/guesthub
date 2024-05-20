"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../button";
import { Input } from "../../input";
import { DataTableViewOptions } from "./data-table-view-options";
// import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterable?: boolean;
  columnsSelector?: boolean;
  onCreateButtonClick?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  filterable = false,
  columnsSelector = false,
  onCreateButtonClick,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  if (!filterable && !columnsSelector && !onCreateButtonClick) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterable && (
          <Input
            placeholder="Filter..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {/* {table.getColumn("status") && (
					<DataTableFacetedFilter
						column={table.getColumn("status")}
						title='Status'
						options={statuses}
					/>
				)} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row gap-2">
        {!!onCreateButtonClick && (
          <Button
            size="sm"
            className="ml-auto h-8 flex"
            onClick={onCreateButtonClick}
          >
            + Create
          </Button>
        )}
        {columnsSelector && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
