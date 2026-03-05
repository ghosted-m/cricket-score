import { connectDB } from "@/lib/mongodb";
import Series from "@/models/Series";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.seriesID || !body.teamName) {
            return Response.json(
                { message: "seriesID and teamName are required" },
                { status: 400 }
            );
        }

        const getSeries = await Series.findById(body.seriesID);

        if (!getSeries) {
            return Response.json(
                { message: "Series not found" },
                { status: 404 }
            );
        }

        getSeries.teams.push({ teamName: body.teamName });
        await getSeries.save();

        return Response.json(getSeries, { status: 201 });

    } catch (error) {
        return Response.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const series = await Series.find();
        return Response.json(series, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}