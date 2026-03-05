"use client";
import Page from "../live-score/page";
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
  const [desimisal, setDesimisal] = useState('');
  const [options, setOptions] = useState([]);
  const [bowlerOptions, setBowlerOptions] = useState([]);
  const [outPlayersState, setOutPlayersState] = useState([]);
  const [seriesID, setSeriesID] = useState(null);
  const [teamID, setTeamID] = useState(null);
  const [teamID2, setTeamID2] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [playersList, setPlayersList] = useState([]);
  const [checked, setChecked] = useState({
    wicket: false,
    runOut: false,
    wideBall: false,
    noBall: false,
    legByes: false,
  });
  const dataFromHook = useData('/api/score');
  useEffect(() => {
    if (!dataFromHook || dataFromHook.length === 0) return;
    const outs = playingStatus(dataFromHook);
    if (JSON.stringify(outs) !== JSON.stringify(outPlayersState)) {
      setOutPlayersState(outs);
    }

    if (isInitialLoad) {
      const match = dataFromHook[0];
      const innings = match.innings?.inning1 || [];
      if (innings.length > 0) {
        const lastBall = innings[innings.length - 1];
        if (lastBall.strike?.playingStatus === "playing") {
          setStrike(lastBall.strike.player);
        }
        if (lastBall.nonStrike?.playingStatus === "playing") {
          setNonStrike(lastBall.nonStrike.player);
        }
        if (lastBall.bowler?.player) {
          setBowling(lastBall.bowler.player);
        }
      }
      setIsInitialLoad(false);
    }
  }, [dataFromHook, isInitialLoad]);


  useEffect(() => {
    const stored = localStorage.getItem("players");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSeriesID(parsed?.seriesID);
      setTeamID(parsed?.teamID);
      setTeamID2(parsed?.teamID2);
    }
  }, []);
  const playingStatus = (data) => {
    if (!data || data.length === 0) return [];
    const match = data[0];
    const innings = match.innings?.inning1 || [];
    return innings.reduce((allPlayers, inning) => {
      if (inning?.strike?.playingStatus === "out") {
        allPlayers.push(inning.strike.player);
      }
      if (inning?.nonStrike?.playingStatus === "out") {
        allPlayers.push(inning.nonStrike.player);
      }
      return allPlayers;
    }, []);
  };


  useEffect(() => {
    const filtered = playersList.filter(
      (name) =>
        !outPlayersState.includes(name) &&
        name !== strike &&
        name !== nonStrike,
    );
    const outfiltered = playersList.filter(
      (name) => name === strike || name === nonStrike,
    );
    setOptions(filtered);
    setOutPlayerOptions(outfiltered);
  }, [playersList, outPlayersState, strike, nonStrike]);

  const fetchPlayers = async () => {
    if (!seriesID && !teamID) return;
    const res = await fetch(`/api/get-players?seriesID=${seriesID}&teamID=${teamID}`);
    const data = await res.json();
    const allNames = Array.isArray(data) ? data.map((p) => `${p.first_name} ${p.last_name}`) : [];
    setPlayersList(allNames);
  };
  const fetchBowlerPlayers = async () => {
    if (!seriesID && !teamID2) return;
    const res = await fetch(`/api/get-players?seriesID=${seriesID}&teamID=${teamID2}`);
    const playersList = await res.json();
    const allNames = Array.isArray(playersList) ? playersList.map((p) => `${p.first_name} ${p.last_name}`) : [];
    setBowlerOptions(allNames);
  };
  const safeInnings = (item) => item?.innings?.inning1 ?? [];
  const countValidBalls = dataFromHook.reduce((count, item) => {
    const validBalls = safeInnings(item).filter((inning) => inning.ballStatus === "valid")
    return count + validBalls.length + 1
  }, 0)

  const getOver = () => {
    const over = Math.floor(countValidBalls / 6);
    return over;
  }

  useEffect(() => {
    fetchPlayers();
    fetchBowlerPlayers();
    setSelectedOutPlayer(null);
  }, [seriesID, teamID, teamID2]);

  const defaultProps = {
    options: options,
    getOptionLabel: (option) => option,
  };
  const bowlerDefaultProps = {
    options: bowlerOptions,
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
      strikePlayer: {
        player: strike,
        run: runs?.title,
        playingStatus: selectedOutPlayer === strike ? "out" : "playing",
        ...(checked.wicket || checked.runOut && selectedOutPlayer === strike ? { outType: desimisal } : ''),
      },
      nonStrikePlayer: {
        player: nonStrike,
        playingStatus: selectedOutPlayer === nonStrike ? "out" : "playing",
        ...(checked.wicket || checked.runOut && selectedOutPlayer === nonStrike ? { outType: desimisal } : ''),
      },
      bowling: {
        player: bowling,
        run: runs?.title,
        wicket: checked.wicket ? 1 : 0,
        over: getOver(),
      },
      runs: runs?.title,
      // extraRun:
      // checked.wideBall || checked.noBall || checked.legByes ? extraRun : 0,
      wicket: checked.wicket,
      extraRun: {
        wideBall: checked.wideBall ? 'wide' : '',
        noBall: checked.noBall ? 'no-ball' : '',
        legByes: checked.legByes ? 'leg-bye' : '',
        runs: checked.wideBall || checked.noBall || checked.legByes ? extraRun : 0,
      },
      ballStatus: checked.noBall ? "no" : checked.wideBall ? "wide" : "valid",

    };
    if (!data.strikePlayer.player || !data.nonStrikePlayer.player || !data.bowling.player || data.runs == null) {
      alert("Please fill all the fields");
      return;
    }
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
        if (selectedOutPlayer) {
          if (selectedOutPlayer === strike) setStrike(null);
          if (selectedOutPlayer === nonStrike) setNonStrike(null);
          setSelectedOutPlayer(null);
          setChecked((prev) => ({ ...prev, wicket: false }));
        }
        setRuns(null);
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
              {...bowlerDefaultProps}
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
        <Page data={dataFromHook} />
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
              name="runOut"
              className="border outline p-4 m-4"
              checked={checked.runOut}
              onChange={handleCheckboxChange}
            />
            run out
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
          {checked.wicket || checked.runOut ? (
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
              <TextField label="Dismissal Type" variant="standard" value={desimisal} onChange={(e) => setDesimisal(e.target.value)} />
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
