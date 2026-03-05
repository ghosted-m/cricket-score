import { connectDB } from "@/lib/mongodb";
import Series from "@/models/Series";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        if (!body) {
            return new Response(JSON.stringify({ message: "Please provide series details" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const getSeries = await Series.find({ series: body.series });
        if (getSeries.length > 0) {
            return new Response(JSON.stringify({ message: "Series already exists" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const data = { series: body.series, teamCount: body.teamCount, matchDate: body.matchDate };
        const player = await Series.create(data);
        return Response.json(player, { status: 201, message: "Series added successfully" });
    }
    catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    await connectDB();
    const series = await Series.find();
    return Response.json(series, { status: 200 });
}
