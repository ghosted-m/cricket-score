'use client'
//setting to localStorage
import { useEffect, useState } from "react";

export default function Test() {
    const [series, setSeries] = useState([]);
    const [player, setPlayer] = useState({
        seriesID: '',
        teamID: '',
        teamID2: '',
    });
    useEffect(() => {
        const res = async () => {
            const response = await fetch("/api/series");
            const data = await response.json();
            setSeries(data);
        };
        res();
    }, [player]);
    
    useEffect(() => {
        if(player.seriesID && player.teamID){
        const res = async () => {
            const response = await fetch(`/api/get-players?seriesID=${player.seriesID}&teamID=${player.teamID}`);
            const data = await response.json();};
        res();}
    }, [player]);

    const handleSubmit = async () => {
        localStorage.setItem('players', JSON.stringify({
            seriesID: player.seriesID || '',
            teamID: player.teamID || '',
            teamID2: player.teamID2 || '',
        }));
    };
    return (
        <>
            <div className=" mx-auto mt-10 flex flex-col items-center shadow-lg p-6 gap-4 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">step -5 MATCH BETWEEN TEAMS</h1>
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
                <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="teamName2" value={player.teamID2} onChange={(e) => setPlayer({ ...player, teamID2: e.target.value })}>
                    <option value="">Select Team</option>
                    {series.filter((t) => t._id === player.seriesID).map((t) => (
                        t.teams.filter((team) => team._id !== player.teamID).map((team) => (
                            <option key={team._id} value={team._id}>{team.teamName}</option>
                        ))
                    ))}
                </select>
                <button className="w-lg border-b border-gray-300 px-4 py-2 mb-2 bg-pink-500 rounded-lg" onClick={handleSubmit}>Schedule Match</button>
                {/* <div>
                    {Array.isArray(players) && players.map((player) => (
                        <div className="flex gap-4 text-pink-500" key={player._id}>
                            <p>{player.first_name}</p>
                            <p>{player.last_name}</p>
                            <p>{player.role}</p>
                            <p>{player.contact}</p>
                        </div>
                    ))}
                </div> */}
            </div>
        </>
    );
}
