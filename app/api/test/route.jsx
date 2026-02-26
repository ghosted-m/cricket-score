import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Players";

export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const teamId = searchParams.get('teamName');
    const role = searchParams.get('role');

    // Example query
    let query = {};
    if (teamId) query.teamName = teamId;
    if (role) query["players.role"] = role;

    const teams = await Team.find(query).select('players -_id').lean();

    const players = teams.flatMap(team => team.players);

    return Response.json(players, { status: 200 });
}
