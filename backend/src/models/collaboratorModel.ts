import { InferSchemaType, model, Schema } from "mongoose"; 

const collaboratorSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profile_id: { 
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        default: null
    },
    tribe_id: { 
        type: [Schema.Types.ObjectId],
        ref: 'Tribe',
        default: null
    },
    project_id: {
        type: [Schema.Types.ObjectId],
        ref: 'Project',
        default: null
    }
}, { timestamps: true });

type Collaborator = InferSchemaType<typeof collaboratorSchema>; // crea un tipo Collaborator a partir del schema.

export default model<Collaborator>("Collaborator", collaboratorSchema);