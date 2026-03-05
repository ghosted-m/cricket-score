'use client'
import { use, useEffect, useState } from "react";

export default function Test() {
    const [createSeries, setCreateSeries] = useState({ series: '', teamCount: '', matchDate: '' });

    const addSeries = async () => {
        const payload = {
            series: createSeries.series,
            teamCount: createSeries.teamCount,
            matchDate: createSeries.matchDate
        }
        const response = await fetch("/api/add-series", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        clearFields();
    };

    const clearFields = () => {
        setCreateSeries({
            series: '',
            teamCount: '',
            matchDate: '',
        });
    }
    return (
        <>
            <div className="text-center mt-10 flex flex-col items-center shadow-lg mx-auto p-6 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">step -1 Create Series</h1>
                <input className="w-lg border border-gray-300 rounded px-4 py-2 mb-2" type="text" name="series" value={createSeries.series} onChange={(e) => setCreateSeries({ ...createSeries, series: e.target.value })} placeholder="Series Name" />
                <input className="w-lg border border-gray-300 rounded px-4 py-2 mb-2" type="text" name="teamCount" value={createSeries.teamCount} onChange={(e) => setCreateSeries({ ...createSeries, teamCount: e.target.value })} placeholder="Number of Teams" />
                <input className="w-lg border border-gray-300 rounded px-4 py-2 mb-2" type="text" name="matchDate" value={createSeries.matchDate} onChange={(e) => setCreateSeries({ ...createSeries, matchDate: e.target.value })} placeholder="Start Date" />
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={addSeries}>Create Series</button>
            </div>

        </>
    );
}