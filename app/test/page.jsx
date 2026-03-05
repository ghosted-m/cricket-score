'use client'
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const page = () => {
  const [teams, setTeams] = useState([])
  const [team, setTeam] = useState(null)
  const getTeams = async () => {
    const res = await fetch('/api/teams')
    const data = await res.json()
    // const series = data.filter(d => d.series !== undefined && d.series !== null && d.series !== '').map((item) => item?.series)
    // const match = data.filter(d => d.matchName !== undefined && d.matchName !== null && d.matchName !== '').map((item) => item?.matchName)

    const teams = data.filter(d => d.teams !== undefined && d.teams !== null && d.teams !== '').map((item) => item?.teams)
    const d = teams.flatMap((t) => [t.team1, t.team2])
    setTeams(d)
    console.log(d)
  }
  useEffect(() => {
    getTeams()
    setTeam
  }, [])
  return (
    <div className="flex flex-col items-center justify-center h-screen m-auto">
      <Autocomplete
        disablePortal
        options={teams}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Team" />}
        onChange={(event, newValue) => {
          setTeam(newValue);
        }}
      />
      <Autocomplete
        disablePortal
        options={teams}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Team" />}
        onChange={(event, newValue) => {
          setTeam(newValue);
        }}
      />

    </div>
  );
}
export default page 