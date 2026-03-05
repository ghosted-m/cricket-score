'use client'
import { use, useEffect, useState } from "react";

export default function Test() {
    const [series, setSeries] = useState([]);// fetched team
    const [createdTeam, setCreatedTeam] = useState({ seriesID: '', teamName: '' }); // created team

    const addTeam = async () => {
        const payload = {
            seriesID: createdTeam.seriesID,
            teamName: createdTeam.teamName,
        }
        const response = await fetch("/api/add-team", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    };

    useEffect(() => {
        const res = async () => {
            const response = await fetch("/api/series");
            const data = await response.json();
            setSeries(data);
        };
        res();
    }, []);

    const clearFields = () => {
        setCreatedTeam({ teamName: '' });
    }
    return (
        <>
            <div className="text-center mt-10 flex flex-col items-center shadow-lg mx-auto p-6 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">step -2 Create team</h1>
                <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="seriesName" value={createdTeam.seriesID} onChange={(e) => setCreatedTeam({ ...createdTeam, seriesID: e.target.value })}>
                    <option value="">Select Series</option>
                    {series.map((t) => (
                        <option key={t._id} value={t._id}>{t.series}</option>
                    ))}
                </select>
                <input className="w-lg border border-gray-300 rounded px-4 py-2 mb-2" type="text" name="teamName" value={createdTeam.teamName} onChange={(e) => setCreatedTeam({ ...createdTeam, teamName: e.target.value })} placeholder="Team Name" />
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addTeam}>Create Team</button>
            </div>
        </>
    );
}