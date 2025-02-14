import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            maxLength: [100, "Can't exceed 100 characters"]
        },
        description: {
            type: String,
            required: [true, 'Product description is required']
        },
        price: {
            type: String,
            required: [true, 'Product price is required']
        },
        category: {
            type: Schema.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required']
        },
        inventory: {
            type: Number,
            required: [true, 'Inventory count is required'],
            default: 0
        }
    },
    { timestamps: true }
);

productSchema.methods.toJSON = function() {
    const { __v, ...product } = this.toObject();
    return product;
};

export default model('Product', productSchema);
