//Model Cart

import { schema, model } from 'mongoose';

const cartSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't exceed 25 characters`],
            default: 'KINAL STORE',
            uppercase: true
        },
        product: {
            type: Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        }
    },
    { timestamps: true }
);

cartSchema.methods.toJSON = function(){
    const { __v, ...cart } = this.toObject();
    return cart;
};

export default model('Cart', cartSchema)
