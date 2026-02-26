import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const { matchName, matchDate, ground, teamA, teamB } = body;
    if (!matchName || !matchDate || !ground || !teamA || !teamB) {
        return Response.json({ error: "All fields are required" }, { status: 400 });
    }   
    const match = await Match.create(body);
    return Response.json(match, { status: 201 });
}

export async function GET(req) {
    await connectDB();
    const teams = await Match.find();
    return Response.json(teams, { status: 200 });
}
