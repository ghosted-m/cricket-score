import { connectDB } from "@/lib/mongodb";
import Series from "@/models/Series";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const { seriesID, teamID, player } = body;

        if (!seriesID || !teamID || !player) {
            return Response.json(
                { message: "seriesID, teamID and player are required" },
                { status: 400 }
            );
        }

        const updatedSeries = await Series.findOneAndUpdate(
            {
                _id: seriesID,
                "teams._id": teamID
            },
            {
                $push: {
                    "teams.$.players": player
                }
            },
            { new: true }
        );

        if (!updatedSeries) {
            return Response.json(
                { message: "Series or Team not found" },
                { status: 404 }
            );
        }

        return Response.json(updatedSeries, { status: 201 });

    } catch (error) {
        return Response.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}