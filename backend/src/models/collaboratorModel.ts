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
        ref: 'Profile' 
    },
    tribe_id: { 
        type: Schema.Types.ObjectId,
        ref: 'Tribe'
    },
    project_id: {
        type: [Schema.Types.ObjectId],
        ref: 'Project'
    }
}, { timestamps: true });

type Collaborator = InferSchemaType<typeof collaboratorSchema>; // crea un tipo Collaborator a partir del schema.

export default model<Collaborator>("Collaborator", collaboratorSchema);