import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const { series, matchName, matchDate, ground, team1, team2 } = body;
    if (!series || !matchName || !matchDate || !ground || !team1 || !team2) {
        return Response.json({ error: "All fields are required" }, { status: 400 });
    }
    const data = {
        series,
        matchName,
        matchDate,
        ground,
        teams: { team1, team2 }
    }
    const match = await Match.create(data);
    return Response.json(match, { status: 201 });
}

export async function GET(req) {
    await connectDB();
    const teams = await Match.find();
    return Response.json(teams, { status: 200 });
}
