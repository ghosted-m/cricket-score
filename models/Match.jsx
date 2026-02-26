import mongoose from "mongoose";
import Delivery from "./test";
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    series: {
        type: String,
    },
    matchName: {
        type: String,
    },
    matchDate: {
        type: String,
    },
    ground: {
        type: String,
    },
    teamA: {
        type: String,
    },
    teamB: {
        type: String,
    },
    innings: {
        inning1: {
            type: [Delivery.schema],
        },
        inning2: {
            type: [Delivery.schema],
        }
    },
});

export default mongoose.models.Match || mongoose.model("Match", matchSchema);