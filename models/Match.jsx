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
    teams: {
        team1: {
            type: String,
        },
        team2: {
            type: String,
        },
    },
    status: {
        tossWinner: {
            type: String,
        },
        firstPlay: {
            type: String,
        },
        matchWinner: {
            type: String,
        },
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