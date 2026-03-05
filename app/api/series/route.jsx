import { connectDB } from "@/lib/mongodb";
import Series from "@/models/Series";

export async function POST(req) {
    await connectDB();
    const body = await req.json();
    const getTeam = await Series.find({series:body.series});
    if (getTeam.length > 0) {
        return new Response(JSON.stringify({ message: "Series already exists" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    const data = {series: body.series, matchName: body.matchName, teamCount: body.teamCount, seriesStart:body.seriesStart, ground: body.ground};
    const player = await Series.create(data);
    return Response.json(player, { status: 201 });
}

export async function GET(req) {
    await connectDB();
    const players = await Series.find();
    return Response.json(players, { status: 200 });
}
