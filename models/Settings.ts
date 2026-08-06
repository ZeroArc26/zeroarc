import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  singleton: string;

  store: {
    name: string;
    tagline: string;
    logo: string;
    email: string;
    phone: string;
    website: string;
  };

  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  tax: {
    gstin: string;
    pan: string;
    companyState: string;
    defaultGstRate: number;
    pricesIncludeTax: boolean;
  };

  shipping: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
    codCharge: number;
    codAvailable: boolean;
  };

  notifications: {
    newOrderEmail: boolean;
    lowStockEmail: boolean;
    globalLowStockThreshold: number;
    notifyEmail: string;
  };

  social: {
    instagram: string;
    facebook: string;
    twitter: string;
  };

  seo: {
    metaTitle: string;
    metaDescription: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    singleton: {
      type: String,
      default: "main",
      unique: true,
    },

    store: {
      name: { type: String, default: "ZEROARC CO." },
      tagline: { type: String, default: "WEAR YOUR NEXT ARC" },
      logo: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" },
    },

    tax: {
      gstin: { type: String, default: "" },
      pan: { type: String, default: "" },
      companyState: { type: String, default: "West Bengal" },
      defaultGstRate: { type: Number, default: 18 },
      pricesIncludeTax: { type: Boolean, default: true },
    },

    shipping: {
      freeShippingThreshold: { type: Number, default: 999 },
      standardShippingRate: { type: Number, default: 0 },
      expressShippingRate: { type: Number, default: 149 },
      codCharge: { type: Number, default: 99 },
      codAvailable: { type: Boolean, default: true },
    },

    notifications: {
      newOrderEmail: { type: Boolean, default: true },
      lowStockEmail: { type: Boolean, default: true },
      globalLowStockThreshold: { type: Number, default: 5 },
      notifyEmail: { type: String, default: "" },
    },

    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;