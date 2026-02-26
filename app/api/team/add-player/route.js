import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Players";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const getTeam = await Team.findById(body.teamID);
  if (getTeam.players.length >= 11) {
    return new Response(
      JSON.stringify({ message: "Team already has 11 players" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
  const data = {
    first_name: body.first_name, 
    last_name: body.last_name, 
    role: body.role, 
    contact: body.contact};
  getTeam.players.push(data);
  await getTeam.save();
  return Response.json(getTeam, { status: 201 });
}
