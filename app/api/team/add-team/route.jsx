import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Players";
import { notifyClients } from "../../score/route";

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const getTeam = await Team.find({ teamName: body.teamName });
    if (getTeam.length > 0) {
        return new Response(JSON.stringify({ message: "Team already exists" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    const data = { teamName: body.teamName, players: [] }
    const player = await Team.create(data);
    const teams = await Team.find();
    notifyClients(teams);
    return Response.json(player, { status: 201 });
}

export async function GET(req) {
    await connectDB();
    const players = await Team.find();
    notifyClients(players);
    return Response.json(players, { status: 200 });
}
