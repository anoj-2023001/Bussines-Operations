import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            maxLength: [50, "Username can't exceed 50 characters"]
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ['ADMIN', 'CLIENT'],
            default: 'CLIENT'
        }
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function() {
    const { __v, _id, password, ...user } = this.toObject();
    user.id = _id;
    return user;
};

export default model('User', userSchema);
