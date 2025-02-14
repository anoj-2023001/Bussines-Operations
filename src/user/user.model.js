import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, "Can't exceed 25 characters"]
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can't be overcome 25 characters`],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must have at least 8 characters'],
            maxLength: [100, "Can't exceed 100 characters"]
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: ['ADMIN', 'CLIENT'],
            uppercase: true //volver mayuscula
        }
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
};

export default model('User', userSchema);
