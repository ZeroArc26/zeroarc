import mongoose, {
  Schema,
  models,
  model,
  type InferSchemaType,
} from "mongoose";

/* ----------------------------------------
   Image Schema
----------------------------------------- */

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      default: "Default",
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    isCover: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   Variant Schema
----------------------------------------- */

const VariantSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    colorHex: {
      type: String,
      default: "",
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    barcode: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   Basic Info Schema
----------------------------------------- */

const BasicInfoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
},

    description: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    audience: {
      type: String,
      enum: ["men", "women", "unisex"],
      required: true,
      default: "unisex",
    },

    fitType: {
      type: String,
      enum: ["slim", "regular", "oversized"],
    },

    fabric: {
      type: String,
      trim: true,
    },

    sleeveType: {
      type: String,
      trim: true,
    },

    neckType: {
      type: String,
      trim: true,
    },

    printType: {
      type: String,
      trim: true,
    },

    washCare: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   Pricing Schema
----------------------------------------- */

const PricingSchema = new Schema(
  {
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    comparePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    taxClass: {
      type: String,
      default: "GST 18%",
    },

    discountType: {
      type: String,
      enum: ["none", "percentage", "fixed"],
      default: "none",
    },

    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   Inventory Schema
----------------------------------------- */

const InventorySchema = new Schema(
  {
    sku: {
  type: String,
  required: true,
  trim: true,
  uppercase: true,
},

    barcode: {
      type: String,
      default: "",
      trim: true,
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },

    allowBackorders: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   SEO Schema
----------------------------------------- */

const SEOSchema = new Schema(
  {
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    index: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   Publish Schema
----------------------------------------- */

const PublishSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* ----------------------------------------
   Product Schema
----------------------------------------- */

const ProductSchema = new Schema(
  {
    basicInfo: {
      type: BasicInfoSchema,
      required: true,
    },

    pricing: {
      type: PricingSchema,
      required: true,
    },

    inventory: {
      type: InventorySchema,
      required: true,
    },

    images: {
      type: [ImageSchema],
      default: [],
    },

    variants: {
      type: [VariantSchema],
      default: [],
    },

    seo: {
      type: SEOSchema,
      required: true,
    },

    publish: {
      type: PublishSchema,
      required: true,
    },

    /* ---------------- Analytics ---------------- */

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* ----------------------------------------
   Indexes
----------------------------------------- */

ProductSchema.index(
  {
    "basicInfo.slug": 1,
  },
  {
    unique: true,
  }
);

ProductSchema.index(
  {
    "inventory.sku": 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

ProductSchema.index(
  {
    "inventory.barcode": 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

ProductSchema.index({
  "publish.status": 1,
});

ProductSchema.index({
  "publish.featured": 1,
});

/* ----------------------------------------
   Types
----------------------------------------- */

export type ProductDocument =
  InferSchemaType<typeof ProductSchema>;

/* ----------------------------------------
   Model
----------------------------------------- */

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

export default Product;