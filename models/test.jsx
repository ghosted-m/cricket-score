const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    ballStatus: {
        type: String,
        enum: ['valid', 'wide', 'no'],
        default: 'valid'
    },
    strike: {
        player: {
            type: String
        },
        run: {
            type: Number
        },
        playingID: {
            type: Number,
        },
        playingStatus: {
            type: String,
            enum: ['playing', 'out'],
            default: 'playing'
        },
        outType: {
            type: String,
        }
    },
    nonStrike: {
        player: {
            type: String
        },
        playingID: {
            type: Number,
        },
        playingStatus: {
            type: String,
            enum: ['playing', 'out'],
            default: 'playing'
        },
        outType: {
            type: String,
        }
    },
    bowler: {
        player: {
            type: String
        },
        run: {
            type: Number,
        },
        wicket: {
            type: Number,
            default: 0
        },
        over: {
            type: Number,
            default: 0
        },
    },
    run: {
        type: Number
    },
    extraRun: {
        wide: {
            type: String,
        },
        noBall: {
            type: String,
        },
        legByes: {
            type: String,
        },
        runs:{
            type: Number,
            default: 0
        }
    },
    additional: {
        type: String,
        default: ''
    }
});

export default mongoose.models.Delivery || mongoose.model("Delivery", deliverySchema);

// ballStatus
// strike:{player, run, playingID, playingStatus}
// nonStrike:{player}
// bowler:{player, run, wicket}
// run
// extraRun
// additional