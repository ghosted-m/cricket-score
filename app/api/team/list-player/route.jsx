import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Players";

export async function GET(req) {
    await connectDB();
    const players = (await Team.find()).flatMap(team => team.players).map(p => ({ first_name: p.first_name, last_name: p.last_name, role: p.role, contact: p.contact, _id: p._id }));
    return Response.json(players, { status: 200 });
}
