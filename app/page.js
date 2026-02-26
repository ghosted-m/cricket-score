"use client";
import Page from "./live-score/page";
import useData from "@/components/getData";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
export default function Home() {
  const [strike, setStrike] = useState(null);
  const [nonStrike, setNonStrike] = useState(null);
  const [bowling, setBowling] = useState(null);
  const [runs, setRuns] = useState(null);
  const [outPlayerOptions, setOutPlayerOptions] = useState([]);
  const [selectedOutPlayer, setSelectedOutPlayer] = useState(null);
  const [extraRun, setExtraRun] = useState(1);
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [outPlayersState, setOutPlayersState] = useState([]);
  const [checked, setChecked] = useState({
    wicket: false,
    wideBall: false,
    noBall: false,
    legByes: false,
  });
const dataFromHook = useData();
  useEffect(() => {
      const parsed = dataFromHook;
      const outs = playingStatus(parsed).map((p) => p.player);
      if (outs.length > 0 && JSON.stringify(outs) !== JSON.stringify(outPlayersState)) {
        setOutPlayersState(outs);
      }
      setData(parsed);
    }, [dataFromHook]);
  const playingStatus = (data) => {
  if (!data || data.length === 0) return [];
  const match = data[0];
  const innings = match.innings?.inning1 || [];
  return innings.reduce((allPlayers, inning) => {
    if (inning?.strike?.playingStatus === "out") {
      allPlayers.push(inning.strike);
    }
    if (inning?.nonStrike?.playingStatus === "out") {
      allPlayers.push(inning.nonStrike);
    }
    return allPlayers;
  }, []);
};  
  const fetchPlayers = async () => {
    const res = await fetch("/api/team/list-player");
    const playersList = await res.json();
    const allNames = playersList.map((p) => `${p.first_name} ${p.last_name}`);
    const filtered = allNames.filter(
      (name) => !outPlayersState.includes(name) && name !== strike && name !== nonStrike
    );
    const outfiltered = allNames.filter(
      (name) => name === strike || name === nonStrike
    );
    setOptions(filtered);
    setOutPlayerOptions(outfiltered);
  };

  useEffect(() => {
    fetchPlayers();
    setSelectedOutPlayer(null);
  }, [strike, nonStrike, outPlayersState]);

  const defaultProps = {
    options: options,
    getOptionLabel: (option) => option,
  };

  const runsOptions = {
    options: [0, 1, 2, 3, 4, 6].map((option) => ({ title: option })),
    getOptionLabel: (option) => option.title.toString(),
  };

  const wicketOptions = {
    options: outPlayerOptions,
    getOptionLabel: (option) => option.toString(),
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
      strikePlayer: {player: strike, run:runs?.title, playingStatus: selectedOutPlayer === strike ? 'out' : 'playing'},
      nonStrikePlayer: {player: nonStrike, playingStatus: selectedOutPlayer === nonStrike ? 'out' : 'playing'},
      bowling: {player: bowling, run:runs?.title, wicket: checked.wicket ? 1 : 0},
      runs: runs?.title,
      extraRun:
        checked.wideBall || checked.noBall || checked.legByes ? extraRun : 0,
      wicket: checked.wicket,
      wideBall: checked.wideBall ? "wide" : "",
      noBall: checked.noBall ? "no" : "",
      legByes: checked.legByes ? "legByes" : "",
      ballStatus: checked.noBall ? "no" : checked.wideBall ? "wide" : "valid",
    };
    try {
      const response = await fetch("/api/add-score", {
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
                <TextField {...params} label="On Strike" variant="standard" />
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
                <TextField {...params} label="Bowling" variant="standard" />
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
                <TextField {...params} label="RUNS" variant="standard" />
              )}
            />
          </div>
        </div>
      </div>

      <div className="row-span-2 w-full p-8">
        <Page data={dataFromHook}/>
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
                {...wicketOptions}
                id="outPlayer"
                value={selectedOutPlayer}
                onChange={(event, newValue) => {
                  setSelectedOutPlayer(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Out Player"
                    variant="standard"
                  />
                )}
              />
              <TextField label="Dismissal Type" variant="standard" />
            </div>
          ) : null}

          {checked.wideBall || checked.noBall || checked.legByes ? (
            <div className="flex flex-col gap-4 space-4">
              <TextField
                label="Extra Runs"
                variant="standard"
                value={extraRun}
                onChange={handleNumberChange}
              />
            </div>
          ) : null}
        </div>
        <button
          onClick={handleSubmit}
          className="w-32 border outline p-4 m-4 rounded-md bg-green-500 hover:bg-green-700 text-white"
        >
          Submit
        </button>
        <button
          className="w-32 border outline p-4 m-4 rounded-md bg-yellow-500 hover:bg-yellow-700 text-white"
          onClick={() => {
            setStrike(null);
            setNonStrike(null);
            setBowling(null);
            setRuns(null);
            setSelectedOutPlayer(null);
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
