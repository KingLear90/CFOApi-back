import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    collab_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        select: false,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        select: false,
        required: true,
        trim: true
    }
})

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);