import mongoose from "mongoose";

async function main() {
    await mongoose.connect("mongodb://root:root@localhost/json-rpc?authSource=admin");

    try {
        const existingProduct = await Product.findOne({ product_id: process.env.DEFAULT_PRODUCT_ID });

        if (!existingProduct) {
            const product = new Product({
                product_id: process.env.DEFAULT_PRODUCT_ID || "91f2f7d6-4e3d-4ba3-b674-1168d0096755",
                name: "Product Test",
                stock: Number(process.env.DEFAULT_PRODUCT_STOCK) || 35000,
                created_at: new Date(),
                updated_at: new Date(),
            });

            await product.save();
            console.log("\n\n...Seeded product successfully!");
        } else {
            console.log("\n\n...Product already exists, skipping seeding");
        }
    } catch (error) {
        if (error.code === 11000) {
            console.log("\n\n...Product already exists, skipping seeding");
        } else {
            console.error("\n\n...Error seeding product:", error);
        }
    }
}

main().catch((err) => console.log(err));

const mongodb = mongoose.connection;

mongodb.on("error", console.error.bind(console, "\n\n...ERROR to connect to MongoDB: "));

mongodb.once("open", () => {
    console.log("\n\n...Connected to mongodb!");
});

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        id: { type: String, default: () => new mongoose.Types.ObjectId(), unique: true },
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        jwt_token: { type: String, unique: true, default: "" },
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "users" },
);

const User = mongoose.model("User", UserSchema);

const ProductSchema = new Schema(
    {
        id: { type: String, default: () => new mongoose.Types.ObjectId(), unique: true },
        product_id: { type: String, unique: true, required: true },
        name: { type: String, unique: true, default: "Test Product" },
        stock: { type: Number, default: 35000 },
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "products" },
);

const Product = mongoose.model("Product", ProductSchema);

const CheckoutLogSchema = new Schema(
    {
        id: { type: String, default: () => new mongoose.Types.ObjectId(), unique: true },
        user_id: { type: String, required: true },
        user_email: { type: String, required: true },
        product_id: { type: String, required: true },
        product_sku: { type: String, unique: true, required: true },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "checkout_logs" },
);

const CheckoutLog = mongoose.model("CheckoutLog", CheckoutLogSchema);

export { User, Product, CheckoutLog };
