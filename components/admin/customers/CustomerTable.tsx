"use client";

import { ICustomer } from "@/models/Customer";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import CustomerRowActions from "./CustomerRowActions";
import CustomerPagination from "./CustomerPagination";

interface CustomerTableProps {
  customers: ICustomer[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function CustomerTable({
  customers,
  pagination,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>Customer</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Phone</TableHead>

            <TableHead>Location</TableHead>

            <TableHead>Total Orders</TableHead>

            <TableHead>Total Spent</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="w-[80px] text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>
                      {customers.length === 0 ? (
            <TableRow>

              <TableCell
                colSpan={8}
                className="py-12 text-center text-muted-foreground"
              >
                No customers found.
              </TableCell>

            </TableRow>
          ) : (
            customers.map((customer) => {
              const initials = customer.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <TableRow key={customer._id.toString()}>

                  {/* Customer */}

                  <TableCell>

                    <div className="flex items-center gap-4">

                      <Avatar className="h-11 w-11">

                        <AvatarImage src={customer.avatar} />

                        <AvatarFallback>
                          {initials}
                        </AvatarFallback>

                      </Avatar>

                      <div>

                        <p className="font-medium">
                          {customer.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Customer
                        </p>

                      </div>

                    </div>

                  </TableCell>

                  {/* Email */}

                  <TableCell>
                    {customer.email}
                  </TableCell>

                  {/* Phone */}

                  <TableCell>
                    {customer.phone}
                  </TableCell>

                  {/* Location */}

                  <TableCell>

                    {customer.address.city || "-"}

                    {customer.address.state
                      ? `, ${customer.address.state}`
                      : ""}

                  </TableCell>
                                    {/* Total Orders */}

                  <TableCell>
                    {customer.totalOrders}
                  </TableCell>

                  {/* Total Spent */}

                  <TableCell className="font-medium">
                    ₹{customer.totalSpent.toLocaleString("en-IN")}
                  </TableCell>

                  {/* Status */}

                  <TableCell>

                    <Badge
                      variant={
                        customer.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {customer.status === "active"
                        ? "Active"
                        : "Blocked"}
                    </Badge>

                  </TableCell>

                  {/* Actions */}

                  <TableCell className="text-right">

                    <CustomerRowActions
                      customer={customer}
                    />

                  </TableCell>

                </TableRow>
              );
            })
          )}
                  </TableBody>

      </Table>

      <CustomerPagination
  page={pagination.page}
  totalPages={pagination.totalPages}
  total={pagination.total}
  limit={pagination.limit}
/>

    </div>
  );
}