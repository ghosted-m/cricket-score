import mongoose from "mongoose";
import Team from './Players'
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    series: {
        type: String,
    },
    teamCount: {
        type: Number,
        default: 0,
    },
    matchDate: {
        type: String,
    },
    teams: {
        type: [Team.schema]
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive', 'completed'],
    }
});

export default mongoose.models.Series || mongoose.model("Series", matchSchema);