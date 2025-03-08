import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxLength: [100, "Product name can't exceed 100 characters"]
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive number']
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: [0, 'Stock must be a positive number']
        },
        sold: {
            type: Number,
            default: 0,
            min: [0, 'Sold count must be a positive number']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required']
        },
        image: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

productSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();
    product.id = _id;
    return product;
};

export default model('Product', productSchema);
