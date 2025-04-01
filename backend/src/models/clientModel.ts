import { InferSchemaType, model, Schema } from "mongoose";

const clientSchema = new Schema({
    client: {
        type: String,
        required: [true, "Client name is required"],
        unique: true, 
        maxlength: 70,
        minlength: 2,
        trim: true,
    },
    project_id: {
        type: [Schema.Types.ObjectId],
        ref: 'Project',
    },
})

type Client = InferSchemaType<typeof clientSchema>;

export default model<Client>('Client', clientSchema);