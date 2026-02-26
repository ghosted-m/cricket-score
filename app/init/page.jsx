'use client'
import { useState } from 'react';
export default function page() {
const [input, setInput] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    console.log(input);
    
}
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
  }}
  return (
    <div>
      <input type="text" name='matchName' placeholder='matchName' onChange={handleChange} />
      <input type="text" name='ground' placeholder='ground' onChange={handleChange} />
      <input type="text" name='matchDate' placeholder='matchDate' onChange={handleChange} />
      <input type="text" name='teamA' placeholder='teamA' onChange={handleChange} />
      <input type="text" name='teamB' placeholder='teamB' onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button> 
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
