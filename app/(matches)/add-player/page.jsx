'use client'
import { use, useEffect, useState } from "react";

export default function Test() {
    const [series, setSeries] = useState([]);// fetched team
    const [player, setPlayer] = useState({
        seriesID: '',
        teamID: '',
        first_name: '',
        last_name: '',
        role: '',
        contact: '',
    });

    const addPlayer = async () => {
        const payload = {
            seriesID: player.seriesID,
            teamID: player.teamID,
            player: {
                first_name: player.first_name,
                last_name: player.last_name,
                role: player.role,
                contact: player.contact,
            }
        }
        const response = await fetch("/api/add-player", {
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

    const handleChange = (e) => {
        setPlayer({ ...player, [e.target.name]: e.target.value });
    };

    const clearFields = () => {
        setPlayer({
            first_name: '',
            last_name: '',
            role: '',
            contact: '',
        });
        setCreatedTeam({ teamName: '' });
    }
    return (
        <>

            <div className=" mx-auto mt-10 flex flex-col items-center shadow-lg p-6 gap-4 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">step -3 Add Player</h1>
                <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="seriesName" value={player.seriesID} onChange={(e) => setPlayer({ ...player, seriesID: e.target.value })}>
                    <option value="">Select Series</option>
                    {series.map((t) => (
                        <option key={t._id} value={t._id}>{t.series}</option>
                    ))}
                </select>

                <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="teamName" value={player.teamID} onChange={(e) => setPlayer({ ...player, teamID: e.target.value })}>
                    <option value="">Select Team</option>
                    {series.filter((t) => t._id === player.seriesID).map((t) => (
                        t.teams.map((team) => (
                            <option key={team._id} value={team._id}>{team.teamName}</option>
                        ))
                    ))}
                </select>
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="first_name" value={player.first_name} onChange={handleChange} placeholder="First Name" />
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="last_name" value={player.last_name} onChange={handleChange} placeholder="Last Name" />
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="role" value={player.role} onChange={handleChange} placeholder="Role" />
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="contact" value={player.contact} onChange={handleChange} placeholder="Contact" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={addPlayer}>Add Player</button>
            </div>
        </>
    );
}