'use client'
import React from "react";

function Page() {
  const series = "series 2026 champion";
  const matchName = "desi league";
  const totalTeam = 10;
  const seriesStartDate = "";
  const ground = "any";

  const payload = {
    series: series,
    matchName: matchName,
    teamCount: totalTeam,
    seriesStart: seriesStartDate,
    ground: ground,
  };
const handleSubmit = async () => {
  try {
    const res = await fetch("/api/add-series", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }}
  return <div>
    <button className="px-8 py-4 border bg-pink-600" onClick={handleSubmit} >Submit Button</button>
  </div>;
}

export default Page;
