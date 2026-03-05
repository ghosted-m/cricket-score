'use client';
import { useState } from "react";
const page = (props) => {
  const headers = ['players', 'runs', 'balls', 'fours', 'sixes', 'sr'];
const data = (!props.data) ? [] : props.data;
  const safeInnings = (item) => item?.innings?.inning1 ?? [];
  // -------------------------------------------
  const getFour = (data, player) => {
    return data.reduce((count, item) => {
      const filteredInnings = safeInnings(item).filter((inning) => inning.strike.run === 4);
      const filteredPlayer = filteredInnings.filter((inning) => inning.strike.player === player)
      return count + filteredPlayer.length;
    }, 0);
  }

  const getSix = (data, player) => {
    return data.reduce((count, item) => {
      const filteredInnings = safeInnings(item).filter((inning) => inning.strike.run === 6);
      const filteredPlayer = filteredInnings.filter((inning) => inning.strike.player === player)
      return count + filteredPlayer.length;
    }, 0);
  }
  // ---------------------------------------------
  const batterRuns = (data, player) => {
    return data.reduce((totalRuns, total) => {
      const players = safeInnings(total).filter((inning) => inning.strike.player === player)
      const runs = players.reduce((count, item) => {
        return count + (item.strike.run || 0);
      }, 0)
      return totalRuns + runs
    }, 0)
  }

  const bowlerRuns = (data, player) => {
    return data.reduce((totalRuns, total) => {
      const players = safeInnings(total).filter((inning) => inning.bowler.player === player)
      const runs = players.reduce((count, item) => {
        return count + (item.bowler.run || 0)
      }, 0)
      return totalRuns + runs
    }, 0)
  }
  // ---------------------------------------------
  const bowlerWickets = (data, player) => {
    return data.reduce((totalWickets, total) => {
      const players = safeInnings(total).filter((inning) => inning.bowler.player === player)
      const wicket = players.reduce((count, item) => {
        return count + (item.bowler.wicket || 0)
      }, 0)
      return totalWickets + wicket
    }, 0)
  }

  // ---------------------------------------------
  const totalWickets = data.reduce((count, item) => {
    const playerWickets = safeInnings(item).filter((inning) => inning.strike.playingStatus === "out" || inning.nonStrike.playingStatus === "out")
    return count + playerWickets.length
  }, 0)
  // ---------------------------------------------
  const extraRuns = data.reduce((count, item) => {
    const extraRun = safeInnings(item).reduce((count, inning) => {
      return count + inning.extraRun.runs
    }, 0)
    return count + extraRun
  }, 0)
  // ---------------------------------------------

  const totalRuns = data.reduce((count, item) => {
    return count + safeInnings(item).reduce((count, item) => {
      return count + (item.run || 0) + (item.extraRun.runs || 0)
    }, 0)
  }, 0)

  // ---------------------------------------------
  const countValidBalls = data.reduce((count, item) => {
    const validBalls = safeInnings(item).filter((inning) => inning.ballStatus === "valid")
    return count + validBalls.length
  }, 0)
  // ---------------------------------------------
  const playedBalls = (data, player) => {
    return data.reduce((count, item) => {
      const validBalls = safeInnings(item).filter((inning) => inning.ballStatus === "valid")
        .filter((inning) => inning.strike.player === player)
      return count + validBalls.length
    }, 0)
  }
  // ---------------------------------------------
  const listPlayers = data.map((item) => {
    return safeInnings(item).flatMap((inning) => [
      inning.strike.player,
      inning.nonStrike.player
    ]);
  });
  const uniquePlayers = [...new Set(listPlayers.flat())];
  // ---------------------------------------------
  const totalRunsTillDelivery = (data, deliveryNumber) => {
    return data.reduce((total, item) => {
      for (let i = 0; i < deliveryNumber; i++) {
        const delivery = safeInnings(item)[i];
        if (delivery) {
          total += (delivery.run || 0) + (delivery.extraRun || 0);
        }
      }
      return total;
    }, 0);
  };
  // ---------------------------------------------
  const overBall = () => {
    const over = Math.floor(countValidBalls / 6);
    const ball = countValidBalls % 6;
    return { over, ball };
  }

  // get details of out players (who got out and who is the bowler)
  const playingStatus = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const innings = safeInnings(data[0]) || [];
    return innings.reduce((outPlayers, inning) => {
      if (inning?.strike?.playingStatus === "out") {
        outPlayers.push({ player: inning.strike.player, bowler: inning.bowler.player });
      }
      if (inning?.nonStrike?.playingStatus === "out") {
        outPlayers.push({ player: inning.nonStrike.player, bowler: inning.bowler.player });
      }
      return outPlayers;
    }, []);
  };

  const outPlayersData = playingStatus(data);
  const outPlayersNames = outPlayersData.map(d => d.player);

  const getWicketInfo = (player) => {
    const info = outPlayersData.find(d => d.player === player);
    return info ? `(out) b ${info.bowler}` : "";
  };

  return (
    <div>
      <table className="table-fixed">
        <thead>
          <tr>
            {headers.map((h, key) => (<th className='border-b px-8 py-4' key={key}>{h.toUpperCase()}</th>))}
          </tr>
        </thead>
        <tbody className="border-b">
          {uniquePlayers.map((player, key) => (
            <tr className="border-b" key={key}>
              <td className="flex flex-row gap-4 px-8 py-4 w-80">
                {player}
                {outPlayersNames.includes(player) ? (
                  <span className="pl-8 text-sm font-thin text-red-500">
                    {getWicketInfo(player)}
                  </span>
                ) : (
                  <span className="pl-8 text-sm font-thin text-green-500">
                    (playing)
                  </span>
                )}
              </td>
              <td className="px-8 py-4">{batterRuns(data, player)}</td>
              <td className="px-8 py-4">{playedBalls(data, player)}</td>
              <td className="px-8 py-4">{getFour(data, player)}</td>
              <td className="px-8 py-4">{getSix(data, player)}</td>
              <td className="px-8 py-4">{playedBalls(data, player) ? (batterRuns(data, player) / playedBalls(data, player) * 100).toFixed(2) : "0.00"}</td>
            </tr>))}
        </tbody>
      </table>
      <br />
      <div className="text-green-800 font-bold w-full px-8 flex flex-row gap-8 justify-end"><div>{totalRuns}/{totalWickets} ({overBall()?.over}.{overBall()?.ball})</div>
        <div> Extras -  {extraRuns} </div>
        <div>RR - {(totalRuns / (overBall()?.over + overBall()?.ball / 6 || 1)).toFixed(2)}</div>
      </div>
    </div>
  );
}
export default page;

//bowlingStatus = ['bowling', 'o', 'm', 'r', 'w', 'econ', 'os', 'wd', 'nb' ]    