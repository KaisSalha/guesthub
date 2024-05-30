import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  TableOptions,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { DataTableFacetedFilter } from "./components/data-table-faceted-filter";
import { DataTablePagination } from "./components/data-table-pagination";
import { DataTableRowActions } from "./components/data-table-row-actions";
import { DataTableToolbar } from "./components/data-table-toolbar";
import { DataTableViewOptions } from "./components/data-table-view-options";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Skeleton } from "../skeleton";
import { RowData } from "@tanstack/react-table";
import { cn } from "../../lib";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClass?: string;
    cellClass?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  loading?: boolean;
  columnsSelector?: boolean;
  showRowsPerPage?: boolean;
  showItemsCount?: boolean;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
  pageControls?: {
    pagination: {
      pageIndex: number;
      pageSize: number;
    };
    setPagination: Dispatch<
      SetStateAction<{
        pageIndex: number;
        pageSize: number;
      }>
    >;
  };
  toolBarButtons?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  totalCount,
  loading = false,
  pageInfo = undefined,
  pageControls = undefined,
  columnsSelector = false,
  showRowsPerPage = false,
  showItemsCount = false,
  toolBarButtons,
  onRowClick,
  filterValue,
  setFilterValue,
}: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const serverSidePaginationSettings: Partial<TableOptions<TData>> =
    useMemo(() => {
      return totalCount && pageInfo && pageControls
        ? {
            manualPagination: true,
            pageCount: Math.ceil(totalCount / pageControls.pagination.pageSize),
            state: {
              sorting,
              columnVisibility,
              rowSelection,
              columnFilters,
              pagination: pageControls.pagination,
            },
            onPaginationChange: (pagination) => {
              pageControls.setPagination(pagination);
            },
          }
        : {};
    }, [
      totalCount,
      pageInfo,
      pageControls,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    ]);

  const columnsMemo = useMemo(
    () =>
      loading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="min-w-fit h-8" />,
          }))
        : columns,
    [loading, columns]
  );

  const table = useReactTable({
    data,
    columns: columnsMemo,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...serverSidePaginationSettings,
    enableRowSelection: true,
    manualFiltering: true,
  });

  if (loading)
    return (
      <div className="space-y-4">
        <DataTableToolbar<TData>
          table={table}
          columnsSelector={columnsSelector}
          toolBarButtons={toolBarButtons}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        <div className="rounded-md border border-border-subtle">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-background-surface"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.column.columnDef.meta?.headerClass
                            ? header.column.columnDef.meta.headerClass
                            : ""
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.columnDef.meta?.cellClass
                          ? cell.column.columnDef.meta.cellClass
                          : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} totalCount={0} />
      </div>
    );

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        toolBarButtons={toolBarButtons}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <div className="rounded-md border border-border-subtle">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-background-muted/40">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        header.column.columnDef.meta?.headerClass
                          ? header.column.columnDef.meta.headerClass
                          : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        onRowClick && "cursor-pointer",
                        cell.column.columnDef.meta?.cellClass
                          ? cell.column.columnDef.meta.cellClass
                          : ""
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <div className="flex items-center justify-center h-20 text-body-subtle w-full text-md font-medium">
                    No data available
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        totalCount={totalCount}
        showRowsPerPage={showRowsPerPage}
        showItemsCount={showItemsCount}
      />
    </div>
  );
};

DataTable.DataTableColumnHeader = DataTableColumnHeader;
DataTable.DataTableFacetedFilter = DataTableFacetedFilter;
DataTable.DataTablePagination = DataTablePagination;
DataTable.DataTableViewOptions = DataTableViewOptions;
DataTable.DataTableRowActions = DataTableRowActions;
DataTable.DataTableToolbar = DataTableToolbar;

export { DataTable };
