/* eslint-disable prettier/prettier */
"use client";

import { UseQueryResult } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { FC, ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataFormat = {
  name: string;
  price: number;
  totalSales: number;
};

export const DataTable: FC<{
  isSubTable: boolean; // used to indicate if its inside a sheet, so not recursive

  columns: ColumnDef<DataFormat>[];

  header?: ReactNode;

  // set
  setActivePage: (page: number) => void;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;

  columnFilters: ColumnFiltersState;
  currentPageData: UseQueryResult<
    {
      data: DataFormat[];
      totalPages: number;
    },
    Error
  >;
}> = ({
  header,
  isSubTable,
  columns,
  setActivePage,
  setColumnFilters,
  columnFilters,
  currentPageData,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // reset page when filters change
  useEffect(() => {
    setActivePage(1);
  }, [columnFilters, setActivePage]);

  const table = useReactTable({
    data: currentPageData.data?.data || [],
    columns: columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // events
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 1,
      },
    },

    enableColumnResizing: true,
    columnResizeMode: "onChange",
    manualPagination: true,
    pageCount: -1,
  });

  return (
    <Card className={cn(isSubTable && "border-0")}>
      <CardContent className={cn(isSubTable && "p-0", "flex flex-col gap-2")}>
        {!isSubTable && (
          <div className="flex justify-between items-end gap-2">
            <div className="p-6 flex flex-col gap-3 mt-4">{header}</div>

            {/* <Filter table={table} /> */}
          </div>
        )}

        <div className="bg-white rounded-md border text-xs max-h-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.getCanSort() &&
                          "cursor-pointer select-none",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width: header.column.getSize(),
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="flex gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}

                        <div className="text-sm">
                          {!header.column.getIsSorted() && (
                            <ChevronsUpDown className="text-sm w-4" />
                          )}

                          {header.column.getIsSorted() === "desc" && (
                            <ChevronDown className="text-sm w-4" />
                          )}

                          {header.column.getIsSorted() === "asc" && (
                            <ChevronUp className="text-sm w-4" />
                          )}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {currentPageData.isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-xs"
                  >
                    Loading data, please wait...
                  </TableCell>
                </TableRow>
              ) : (table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-xs"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <strong>
            {(table.getState().pagination.pageIndex - 1) * 10}-
            {table.getState().pagination.pageIndex * 10}
          </strong>{" "}
          of <strong>{currentPageData.data?.totalPages}</strong> rows
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const previousPage = Math.max(
                table.getState().pagination.pageIndex - 1,
                1,
              );

              setActivePage(previousPage); // will auto refetch as we have it as dependency

              table.setPageIndex(previousPage);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const nextPage = Math.max(
                table.getState().pagination.pageIndex + 1,
                1,
              );

              setActivePage(nextPage); // will auto refetch as we have it as dependency

              table.setPageIndex(nextPage);
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
