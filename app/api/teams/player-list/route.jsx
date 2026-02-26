import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Players";

export async function GET(req) {
    await connectDB();
    const players = await Team.find().select('players -_id');
    const playerList = players.flatMap(team => team.players);
    return Response.json(playerList, { status: 200 });
}
