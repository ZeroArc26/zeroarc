import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerAddress {
  _id?: mongoose.Types.ObjectId;
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

export interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;

  name: string;
  email: string;
  phone: string;
  avatar?: string;

  // Latest shipping address auto-synced from the most recent order —
  // kept separate from the user-managed addresses[] book below.
  address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  addresses: mongoose.Types.DocumentArray<ICustomerAddress>;

  status: "active" | "blocked";

  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<ICustomerAddress>(
  {
    label: { type: String, required: true, trim: true, maxlength: 40 },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    address: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" },
    },

    addresses: {
      type: [AddressSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true,
    },

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastOrderAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CustomerSchema.index({ createdAt: -1 });
CustomerSchema.index({ totalSpent: -1 });
CustomerSchema.index({ totalOrders: -1 });

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;