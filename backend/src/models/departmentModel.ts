import { InferSchemaType, model, Schema } from "mongoose";

const departmentSchema = new Schema({
    department: { type: String, required: true, trim: true }
})

type Department = InferSchemaType<typeof departmentSchema>;

export default model<Department>('Department', departmentSchema);