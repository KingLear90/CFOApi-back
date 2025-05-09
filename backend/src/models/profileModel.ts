import { InferSchemaType, model, Schema } from "mongoose"; 

const profileSchema = new Schema({
    profile: { 
        type: String, 
        required: true,
        unique: true, 
    },
    collaborator_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Collaborator',
        default: null
    }]
});

type Profile = InferSchemaType<typeof profileSchema>; // tipo Profile a partir del schema.

export default model<Profile>("Profile", profileSchema);