import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    role: String,
    contact: String,
}
)
const teamSchema = new mongoose.Schema({
    teamName: String,
    players: [playerSchema],
}, {
    collection: "teams",
    timestamps: true
})

export default mongoose.models.Team || mongoose.model("Team", teamSchema);