'use client'

import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function TeamAutocomplete() {
  const [teams, setTeams] = useState([]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch('/api/teams');
      const data = await res.json();

      const uniqueTeams = [
        ...new Map(data.map((team) => [team.teamName, team])).values(),
      ];

      setTeams(uniqueTeams);
    };

    fetchTeams();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  };

  return (
    <div style={{ width: 300 }} className='mt-64 mx-auto'>
      <Autocomplete
        options={teams}
        getOptionLabel={(option) => option.teamName || ''}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Team" />
        )}
      />
    </div>
  );
}