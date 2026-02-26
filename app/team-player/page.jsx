'use client'
import { use, useEffect, useState } from "react";

export default function Test() {
    const [team, setTeam] = useState([]);// fetched team
    const [teamID, setTeamID] = useState([]); //selected team id
    const [createdTeam, setCreatedTeam] = useState({teamName: ''}); // created team
    const [player, setPlayer] = useState({
        first_name: '',
        last_name: '',
        role: '',
        contact: '',
    });

    const addPlayer = async () => {
        const payload = {
            first_name: player.first_name,
            last_name: player.last_name,
            role: player.role,
            contact: player.contact,
            teamID: teamID.teamName
        }
        const response = await fetch("/api/team/add-player", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log(data);
        clearFields();

    };

    const addTeam = async () => {
        const payload = {
            teamName: createdTeam.teamName
        }
        const response = await fetch("/api/team/add-team", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log(data);
        clearFields();
    };


useEffect(() => {
    const es = new EventSource("/api/team/list-team");
    es.onmessage = (e) => {
        console.log("RAW:", e.data);
        const parsed = JSON.parse(e.data);
        console.log("PARSED:", parsed);
        setTeam(parsed);
    };
    return () => es.close();
}, []);

useEffect(() => {
    const res = async () => {
        const response = await fetch("/api/team/list-team");
        const data = await response.json();
        setTeam(data);
    };
    res();
}, []);

    const handleChange = (e) => {
        setPlayer({ ...player, [e.target.name]: e.target.value });
    };

    const handleSelect = (e) => {
        setTeamID({ ...teamID, [e.target.name]: e.target.value });
        console.log(teamID);
    }
    const clearFields = () => {
        setPlayer({
            first_name: '',
            last_name: '',
            role: '',
            contact: '',
        });
        setCreatedTeam({teamName: ''});
    }
    return (
        <>
            <div className="text-center mt-10 flex flex-col items-center shadow-lg mx-auto p-6 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">Create team</h1>
                <input className="w-lg border border-gray-300 rounded px-4 py-2 mb-2" type="text" name="teamName" value={createdTeam.teamName} onChange={(e) => setCreatedTeam({...createdTeam, teamName: e.target.value})} placeholder="Team Name" />
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addTeam}>Create Team</button>
            </div>
            <div className=" mx-auto mt-10 flex flex-col items-center shadow-lg p-6 gap-4 rounded-lg bg-white">
                <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="teamName" value={teamID.teamName} onChange={handleSelect}>
                    <option value="">Select Team</option>
                    {team.map((t) => (
                        <option key={t._id} value={t._id}>{t.teamName}</option>
                    ))}
                </select>
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="first_name" value={player.first_name} onChange={handleChange} placeholder="First Name" />
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="last_name" value={player.last_name} onChange={handleChange} placeholder="Last Name" />
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="role" value={player.role} onChange={handleChange} placeholder="Role" />
                <input className="w-lg border-b border-gray-300 px-4 py-2 mb-2" type="text" name="contact" value={player.contact} onChange={handleChange} placeholder="Contact" />
                {/* <input className="w-lg border border-gray-300 rounded px-4 py-2 mb-2" type="text" name="teamName" value={player.teamName} onChange={handleChange} placeholder="Team Name" /> */}

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={addPlayer}>Add Player</button>
            </div>
        </>
    );
}