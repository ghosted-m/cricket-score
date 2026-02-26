"use client";
import Page from '../live-score/page'
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
export default function Home() {
  const [strike, setStrike] = useState(null);
  const [nonStrike, setNonStrike] = useState(null);
  const [bowling, setBowling] = useState(null);
  const [runs, setRuns] = useState(null);
  const [outPlayer, setOutPlayer] = useState(null);
  const [extraRun, setExtraRun] = useState(1);
  const [checked, setChecked] = useState({
    wicket: false,
    wideBall: false,
    noBall: false,
    legByes: false,
  });
const defaultProps = {
    options: [],
    getOptionLabel: (option) => option.title,
  };
  
  const fetchPlayer = async () =>{
    const res = await fetch('/api/team/list-player');
    const data = await res.json();
    console.log();
    
      const playerOptions = data.filter((option) => {
        const fullName = option.first_name + " " + option.last_name;
        return fullName !== strike && fullName !== nonStrike;
      });
      defaultProps.options = playerOptions.map((option) => ({
        title: option.first_name + " " + option.last_name,
      }));
    }
  fetchPlayer(); // Call fetchPlayer on component mount



  const runsOptions = {
    options: [0, 1, 2, 3, 4, 6].map((option) => ({ title: option })),
    getOptionLabel: (option) => option.title.toString(),
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecked((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const swapInputs = () => {
    setStrike(nonStrike);
    setNonStrike(strike);
  };
  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value === "" || Number(value) <= 6) {
        setExtraRun(value);
      }
    }
  };
const handleSubmit = async () => {
    const data = {
      strikePlayer: strike?.title,
      nonStrikePlayer: nonStrike?.title,
      bowling: bowling?.title,
      runs: runs?.title,
      outPlayer: outPlayer?.title,
      extraRun: checked.wideBall || checked.noBall || checked.legByes ? extraRun : 0,
      wicket: checked.wicket,
      wideBall: (checked.wideBall ? 'wide' : ''),
      noBall: (checked.noBall ? 'no' : ''),
      legByes: (checked.legByes ? 'legByes' : ''),
      ballStatus: (checked.noBall ? 'no' : checked.wideBall ? 'wide' : 'valid')
    };
    try {
      const response = await fetch("/api/matches/add-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("Data submitted successfully");
      } else {
        console.error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  return (
    <div className="grid grid-cols-2 grid-flow-row gap-4 px-4 py-8">

      <div className="px-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Autocomplete
              {...defaultProps}
              id="strike-batter"
              value={strike}
              onChange={(event, newValue) => {
                setStrike(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="On Strike" 
                  variant="standard" 
                  />
              )}
            />
            <Button
              variant="text"
              color="error"
              size="medium"
              onClick={swapInputs}
            >
              &#8645;
            </Button>
            <Autocomplete
              {...defaultProps}
              id="non-strike-batter"
              value={nonStrike}
              onChange={(event, newValue) => {
                setNonStrike(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="On Non Strike"
                  variant="standard"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-8 space-4">
            <Autocomplete
              {...defaultProps}
              id="bowler"
              value={bowling}
              onChange={(event, newValue) => {
                setBowling(newValue);
              }}
              renderInput={(params) => (
                <TextField
                 {...params}
                 label="Bowling"
                 variant="standard"
                  />
              )}
            />
            <Autocomplete
              {...runsOptions}
              id="runs"
              value={runs}
              onChange={(event, newValue) => {
                setRuns(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="RUNS"
                  variant="standard"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="row-span-2 w-full p-8">
        {/* <Page /> */}
      </div>

      <div className="px-16 py-8">
        <div className="flex flex-row gap-8 p-2 border-b border-t">
          <label id="" className="">
            <input
              type="checkbox"
              id=""
              name="wicket"
              className="border outline p-4 m-4"
              checked={checked.wicket}
              onChange={handleCheckboxChange}
            />
            wicket
          </label>
          <label id="" className="">
            <input
              type="checkbox"
              id=""
              name="wideBall"
              className="border outline p-4 m-4"
              checked={checked.wideBall}
              onChange={handleCheckboxChange}
            />
            wide ball
          </label>
          <label id="" className="">
            <input
              type="checkbox"
              id=""
              name="noBall"
              className="border outline p-4 m-4"
              checked={checked.noBall}
              onChange={handleCheckboxChange}
            />
            no ball
          </label>
          <label id="" className="">
            <input
              type="checkbox"
              id=""
              name="legByes"
              className="border outline p-4 m-4"
              checked={checked.legByes}
              onChange={handleCheckboxChange}
            />
            leg byes
          </label>
        </div>
        <div className="flex flex-col py-8 gap-8 space-4">
          {checked.wicket ? (
            <div className="flex flex-col gap-8 space-4">
              <Autocomplete
                {...defaultProps}
                id="outPlayer"
                value={outPlayer}
                onChange={(event, newValue) => {
                  setOutPlayer(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Out Player" variant="standard" />
                )}
              />
              <TextField label="Dismissal Type" variant="standard" />
            </div>
          ) : null}

          {checked.wideBall || checked.noBall || checked.legByes ? (
            <div className="flex flex-col gap-4 space-4">
              <TextField label="Extra Runs" variant="standard" value={extraRun} onChange={handleNumberChange} />
            </div>
          ) : null}
        </div>
        <button onClick={handleSubmit} className="w-32 border outline p-4 m-4 rounded-md bg-green-500 hover:bg-green-700 text-white">
          Submit
        </button>
        <button
          className="w-32 border outline p-4 m-4 rounded-md bg-yellow-500 hover:bg-yellow-700 text-white"
          onClick={() => {
            setStrike(null);
            setNonStrike(null);
            setBoller(null);
            setRuns(null);
            setChecked({
              wicket: false,
              wideBall: false,
              noBall: false,
              legByes: false,
            });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
