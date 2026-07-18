import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShippingDetails {
  fullName: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  instructions: string;
}

interface ShippingStore {
  shipping: ShippingDetails;

  setShipping: (data: ShippingDetails) => void;

  clearShipping: () => void;
}

const initialShipping: ShippingDetails = {
  fullName: "",
  phone: "",
  email: "",
  house: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  instructions: "",
};

export const useShippingStore = create<ShippingStore>()(
  persist(
    (set) => ({
      shipping: initialShipping,

      setShipping: (data) =>
        set({
          shipping: data,
        }),

      clearShipping: () =>
        set({
          shipping: initialShipping,
        }),
    }),
    {
      name: "zeroarc-shipping",
    }
  )
);