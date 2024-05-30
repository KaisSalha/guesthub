"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "../../button";
import { Input } from "../../input";
import { DataTableViewOptions } from "./data-table-view-options";
// import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnsSelector?: boolean;
  toolBarButtons?: React.ReactNode;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  columnsSelector = true,
  toolBarButtons,
  filterValue,
  setFilterValue,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
        {!!toolBarButtons && toolBarButtons}
        {columnsSelector && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
