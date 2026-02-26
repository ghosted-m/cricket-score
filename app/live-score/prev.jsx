'use client';
import { useEffect, useState } from "react";
const page = () => {
  const [data, setData] = useState([]);
  const [strikePlayer, setStrikePlayer] = useState('');
  const [nonStrikePlayer, setNonStrikePlayer] = useState('');
  const [bowling, setBowling] = useState('');
  const [runs, setRuns] = useState('');
  const [outPlayer, setOutPlayer] = useState('');
  const [extraRun, setExtraRun] = useState(1);
  const [checked, setChecked] = useState({
    wicket: false,
    wideBall: false,
    noBall: false,
    legByes: false,
  });
const headers = ['players', 'runs', 'balls', 'fours', 'sixes', 'sr'];

const [ballCount,  setBallCount] = useState(1);
const [over, setOver] = useState(0);
const [ball, setBall] = useState(0);

  useEffect(() => {
    const es = new EventSource("/api/score");
    es.onmessage = (e) => {
      setData(JSON.parse(e.data));
    };
    return () => es.close();
  }, []);

  // -------------------------------------------
const getFour = (data, player) => {
  return data.reduce((count, item) => {
    const filteredInnings = item.innings.inning1.filter((inning) => inning.strike.run === 4);
    const filteredPlayer = filteredInnings.filter((inning) => inning.strike.player === player)
    return count + filteredPlayer.length;
  }, 0);
}  

const getSix = (data, player) => {
    return data.reduce((count, item) => {
    const filteredInnings = item.innings.inning1.filter((inning) => inning.strike.run === 6);
    const filteredPlayer = filteredInnings.filter((inning) => inning.strike.player === player)
    return count + filteredPlayer.length;
  }, 0);
}
// ---------------------------------------------
  const batterRuns = (data, player) => {
    return data.map((total) => {
    const playerRuns = total.innings.inning1.filter((inning) => inning.strike.player === player)
    return playerRuns.reduce((count, item) => {
      return count + item.strike.run
    }, 0)
  })}

    const bowlerRuns = (data, player) => {
    return data.map((total) => {
    const playerRuns = total.innings.inning1.filter((inning) => inning.bowler.player === player)
    return playerRuns.reduce((count, item) => {
      return count + item.bowler.run
    }, 0)
  })}
// ---------------------------------------------
  const bowlerWickets = (data, player) => {
    return data.map((total) => {
    const playerWickets = total.innings.inning1.filter((player) => player.bowler.player === player)
    return playerWickets.reduce((count, item) => {
      return count + item.bowler.wicket
    }, 0)
  })}

  // ---------------------------------------------
  const totalWickets = data.reduce((count, item) => {
    const playerWickets = item.innings.inning1.filter((inning) => inning.bowler.wicket)
    return count + playerWickets.length
  }, 0)
// ---------------------------------------------
const totalRuns = data.reduce((count, item) => {
  return count + item.innings.inning1.reduce((count, item) => {
    return count + item.run + item.extraRun
  }, 0)
}, 0)

// ---------------------------------------------
  const countValidBalls = data.reduce((count, item) => {
    const validBalls = item.innings.inning1.filter((inning) => inning.ballStatus === "valid")
    return count + validBalls.length
  }, 0)
// ---------------------------------------------
  const playedBalls = (data, player)=> {
    return data.reduce((count, item) => {
    const validBalls = item.innings.inning1.filter((inning) => inning.ballStatus === "valid")
    .filter((inning) => inning.strike.player === player)
    return count + validBalls.length
  }, 0)
}
// ---------------------------------------------
const listPlayers = data.map((item) => {
  return item.innings.inning1.flatMap((inning) => [
    inning.strike.player,
    inning.nonStrike.player
  ]);
});
  const uniquePlayers = [...new Set(listPlayers.flat())];
// ---------------------------------------------
const totalRunsTillDelivery = (data, deliveryNumber) => {
  return data.reduce((total, item) => {
    for (let i = 0; i < deliveryNumber; i++) {
      const delivery = item.innings.inning1[i];
      if (delivery) {
        total += (delivery.run || 0) + (delivery.extraRun || 0);
      }
    }
    return total;
  }, 0);
};
const total = totalRunsTillDelivery(data, 3);
console.log(total); 
// ---------------------------------------------
   useEffect(() => {
    const over = Math.floor(countValidBalls / 6);
    const ball = countValidBalls % 6;
    setOver(over);
    setBall(ball);
  }, [data]);

  return (
    <div>
      <table className="table-fixed">
        <thead>
          <tr>
            {headers.map((h, key) => (<th className='border-b px-8' key={key}>{h}</th>))}
          </tr>
        </thead>
        <tbody className="border-b">
          {uniquePlayers.map((player, key) => (
            <tr className="border-b" key={key}>
              <td className="px-8">{player}</td>
              <td className="px-8">{batterRuns(data, player)}</td>
              <td className="px-8">{playedBalls(data, player)}</td>
              <td className="px-8">{getFour(data, player)}</td>
              <td className="px-8">{getSix(data, player)}</td>
              <td className="px-8">{(batterRuns(data, player) / playedBalls(data, player) * 100).toFixed(2)}</td>
            </tr>))}
        </tbody>
      </table>
<br/>
<div>{totalRuns}/{totalWickets} ({over}.{ball})</div>
    </div>
  );
}
export default page;

// runs/wickets (overs)
// 40/1 (2.3)
// extras w-5 nb-2 lb-1 b-0 p-0
// 