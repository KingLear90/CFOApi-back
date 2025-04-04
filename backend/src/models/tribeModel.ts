import { InferSchemaType, model, Schema } from 'mongoose';

const tribeSchema = new Schema({
    tribe: {
        type: String,
        required: true,
        trim: true
    },
    collaborator_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Collaborator',
        default: null
    }]
})

type Tribe = InferSchemaType<typeof tribeSchema>;

export default model<Tribe>('Tribe', tribeSchema)