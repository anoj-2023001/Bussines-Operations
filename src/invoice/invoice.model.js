import { Schema, model } from 'mongoose';

const invoiceSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required']
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1']
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, 'Price must be a positive number']
                }
            }
        ],
        total: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total must be a positive number']
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'completed'
        }
    },
    { timestamps: true }
);

invoiceSchema.methods.toJSON = function() {
    const { __v, _id, ...invoice } = this.toObject();
    invoice.id = _id;
    return invoice;
};

export default model('Invoice', invoiceSchema);
