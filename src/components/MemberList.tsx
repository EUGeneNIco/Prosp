"use client"

import * as React from "react"
import { TOKEN_NAME } from "./Globals";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { MessageCircleMore } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export type Member = {
    id: number
    isOnline?: boolean
    name: string
    email: string
    role: string
}

export const columns: ColumnDef<Member>[] = [
    {
        accessorKey: "isOnline",
        header: "Online",
        cell: ({ row }) => (
            <Checkbox disabled
                checked={row.getValue("isOnline")}
                aria-label="IsActive"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const member = row.original;

            return (
                <DropdownMenu>
                    <Link to={`/chat/${member.id}`}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <MessageCircleMore className="h-6 w-6" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Chat now</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Button>
                    </Link>
                </DropdownMenu >
            )
        },
    },
]

type MemberListProps = {
    onlineUserIds: number[]
}

export function MemberList({ onlineUserIds }: MemberListProps) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(0);
    const [data, setMembers] = useState<Member[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        getUserIdFromLocalStorage();
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7036/api/users/otherUsers/' + userId);

                if (!response.ok) throw new Error('Failed fetching...');

                const jsonData: Member[] = await response.json();

                onlineUserIds.forEach(userId => {
                    const data = jsonData.find((jd) => jd.id == userId);
                    if (data) data.isOnline = true;
                });

                setMembers(jsonData);
            } catch (error) {
                console.log('Error', error);
            }
        };
        if (userId > 0) fetchData();
    }, [userId, onlineUserIds])

    function getUserIdFromLocalStorage() {
        const tokenFromLocalStorage = localStorage.getItem(TOKEN_NAME);
        if (!tokenFromLocalStorage) {
            navigate('/login', { replace: true })
            return
        }

        const payLoad = JSON.parse(window.atob(tokenFromLocalStorage.split('.')[1]));

        if (!payLoad) navigate('/login', { replace: true });

        setUserId(payLoad.UserGuid);
    }

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search for a member ..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
