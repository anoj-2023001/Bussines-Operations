import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            maxLength: [50, "Category name can't exceed 50 characters"],
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        }
    },
    { timestamps: true }
);

categorySchema.methods.toJSON = function() {
    const { __v, _id, ...category } = this.toObject();
    category.id = _id;
    return category;
};

export default model('Category', categorySchema);
