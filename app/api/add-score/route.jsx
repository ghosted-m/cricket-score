import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";
import { notifyClients } from "../score/route";

export async function POST(req) {
    await connectDB();
    const match = await Match.findById('699b482ff24003946c5f5e21');
    const body = await req.json();


    const runs = body.runs;
    const extraRun = body.extraRun;
    const ballStatus = body.ballStatus;

    match.innings.inning1.push({ strike: body.strikePlayer, nonStrike: body.nonStrikePlayer, bowler: body.bowling, run: runs, extraRun: extraRun, ballStatus: ballStatus });
    await match.save();

    const allMatches = await Match.find();
    notifyClients(allMatches);

    return new Response(JSON.stringify({ message: "Score added successfully" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });

}

export async function GET() {
    await connectDB();
    const match = await Match.find();
    return new Response(JSON.stringify(match), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}