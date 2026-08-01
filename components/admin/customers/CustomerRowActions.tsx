"use client";

import { useState } from "react";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { ICustomer } from "@/models/Customer";

import ViewCustomerDialog from "./dialogs/ViewCustomerDialog";
import EditCustomerDialog from "./dialogs/EditCustomerDialog";
import DeleteCustomerDialog from "./dialogs/DeleteCustomerDialog";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerRowActionsProps {
  customer: ICustomer;
}

export default function CustomerRowActions({
  customer,
}: CustomerRowActionsProps) {
  const [viewOpen, setViewOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>

        <DropdownMenuTrigger asChild>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 rounded-2xl"
        >
                      <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => setViewOpen(true)}
          >
            <Eye className="h-4 w-4" />
            View Customer
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="h-4 w-4" />
            Edit Customer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Customer
          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

            <ViewCustomerDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        customer={customer}
      />

      <EditCustomerDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        customer={customer}
      />

      <DeleteCustomerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        customer={customer}
      />
    </>
  );
}