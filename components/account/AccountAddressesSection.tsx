"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Address {
  _id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface Props {
  initialAddresses: Address[];
}

const EMPTY_FORM = {
  label: "",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

export default function AccountAddressesSection({ initialAddresses }: Props) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(addr: Address) {
    setEditingId(addr._id);
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.label || !form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all fields.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/account/addresses/${editingId}`
        : "/api/account/addresses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to save address.");
        return;
      }

      setAddresses(data.addresses);
      setFormOpen(false);
      toast.success(editingId ? "Address updated." : "Address added.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to delete address.");
        return;
      }

      setAddresses(data.addresses);
      toast.success("Address removed.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-black">Saved Addresses</h2>
      </div>

      {addresses.length === 0 && !formOpen && (
        <p className="mb-4 text-sm text-zinc-500">No saved addresses yet.</p>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-black">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-700">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500">{addr.name}</p>
                <p className="text-xs text-zinc-500">{addr.address}</p>
                <p className="text-xs text-zinc-500">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs text-zinc-500">{addr.phone}</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-1 text-zinc-400">
              <button
                onClick={() => openEdit(addr)}
                className="rounded-lg p-1.5 hover:bg-zinc-100 hover:text-violet-600"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="rounded-lg p-1.5 hover:bg-zinc-100 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen ? (
        <div className="mt-4 space-y-3 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-black">
              {editingId ? "Edit Address" : "New Address"}
            </p>
            <button onClick={() => setFormOpen(false)} className="text-zinc-400 hover:text-black">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Label (e.g. Home)"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="col-span-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500 sm:col-span-1"
            />
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="col-span-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <label className="col-span-2 flex items-center gap-2 text-xs text-zinc-600">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              />
              Set as default address
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
          </button>
        </div>
      ) : (
        <button
          onClick={openAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </button>
      )}
    </div>
  );
}