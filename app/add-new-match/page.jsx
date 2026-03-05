'use client'
import { useEffect, useState } from 'react';
export default function page() {
  const [input, setInput] = useState({});
  const [series, setSeries] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    const res = async () => {
      const response = await fetch("/api/series");
      const data = await response.json();
      setSeries(data);
    };
    res();
  }, []);


  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className=" mx-auto mt-10 flex flex-col items-center shadow-lg p-6 gap-4 rounded-lg bg-white">
      <h1 className="text-2xl font-bold">step -4 Add series MATCH</h1>
      <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="series" value={input.series} onChange={(e) => setInput({ ...input, series: e.target.value })}>
        <option value="">Select Series</option>
        {series.map((t) => (
          <option key={t._id} value={t.series}>{t.series}</option>
        ))}
      </select>
      <input className='w-lg border border-gray-300 rounded px-4 py-2 mb-2' type="text" name='matchName' placeholder='matchName' onChange={handleChange} />
      <input className='w-lg border border-gray-300 rounded px-4 py-2 mb-2' type="text" name='ground' placeholder='ground' onChange={handleChange} />
      <input className='w-lg border border-gray-300 rounded px-4 py-2 mb-2' type="text" name='matchDate' placeholder='matchDate' onChange={handleChange} />

      <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="team1" value={input.team1} onChange={(e) => setInput({ ...input, team1: e.target.value })}>
        <option value="">Select Team</option>
        {series.filter((t) => t.series === input.series).map((t) => (
          t.teams.map((team) => (
            <option key={team._id} value={team.teamName}>{team.teamName}</option>
          ))
        ))}
      </select>
      <select className="w-lg border-b border-gray-300 px-4 py-2 mb-2" name="team2" value={input.team2} onChange={(e) => setInput({ ...input, team2: e.target.value })}>
        <option value="">Select Team</option>
        {series.filter((t) => t.series === input.series).map((t) => (
          t.teams.filter((team) => team.teamName !== input.team1).map((team) => (
            <option key={team._id} value={team.teamName}>{team.teamName}</option>
          ))
        ))}
      </select>
      <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600' onClick={handleSubmit}>Submit</button>
    </div>
  )
}
