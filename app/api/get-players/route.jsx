import { connectDB } from "@/lib/mongodb";
import Series from "@/models/Series";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const seriesID = searchParams.get("seriesID");
    const teamID = searchParams.get("teamID");

    if (!seriesID || !teamID || seriesID === "null" || teamID === "null") {
      return Response.json(
        { message: "seriesID and teamID are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(seriesID) || !mongoose.Types.ObjectId.isValid(teamID)) {
      return Response.json(
        { message: "Invalid seriesID or teamID" },
        { status: 400 }
      );
    }

    const teamData = await Series.findOne(
      { _id: seriesID, "teams._id": teamID },
      { "teams.$": 1 }
    );
    if (!teamData) {
      return Response.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    const team = teamData.teams[0];

    if (!team) {
      return Response.json(
        { message: "Team not found" },
        { status: 404 }
      );
    }

    return Response.json(team.players, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}