import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryVariant {
  variantId: mongoose.Types.ObjectId;

  sku: string;

  availableStock: number;

  reservedStock: number;

  incomingStock: number;

  lowStockThreshold: number;
}

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;

  variants: IInventoryVariant[];

  warehouse?: string;

  createdAt: Date;

  updatedAt: Date;
}

const InventoryVariantSchema = new Schema<IInventoryVariant>(
  {
    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    availableStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    incomingStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const InventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    variants: {
      type: [InventoryVariantSchema],
      default: [],
    },

    warehouse: {
      type: String,
      trim: true,
      default: "Main Warehouse",
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// Indexes
// =========================

// Fast product lookup
InventorySchema.index({ productId: 1 });

// Fast SKU lookup
InventorySchema.index({ "variants.sku": 1 });

// Low stock queries
InventorySchema.index({
  "variants.availableStock": 1,
  "variants.lowStockThreshold": 1,
});

// =========================
// Export Model
// =========================

const Inventory: Model<IInventory> =
  mongoose.models.Inventory ||
  mongoose.model<IInventory>("Inventory", InventorySchema);

export default Inventory;