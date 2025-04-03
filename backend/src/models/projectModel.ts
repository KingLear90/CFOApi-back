import { InferSchemaType, model, Schema } from 'mongoose';

const projectSchema = new Schema({
    project: { 
        type: String, 
        required: true,
        trim: true, 
    },
    tribe_id: {
        type: Schema.Types.ObjectId,
        ref: 'Tribe',
        default: null
    },
    collaborator_id: {
        type: [Schema.Types.ObjectId],
        ref: 'Collaborator',
        default: null
    }
})

type Project = InferSchemaType<typeof projectSchema>;

export default model<Project>('Project', projectSchema);