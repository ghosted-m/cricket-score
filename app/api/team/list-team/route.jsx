import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Players";
import { notifyClients } from "../../score/route";

export async function GET(req) {
    await connectDB();
    const players = await Team.find();
    notifyClients(players);
    return Response.json(players, { status: 200 });
}
