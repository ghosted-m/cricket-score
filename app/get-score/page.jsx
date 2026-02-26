'use client';
import { useEffect, useState } from "react";
import useData from "@/components/getData";
const page = () => {
  const headers = ['players', 'runs', 'balls', 'fours', 'sixes', 'sr'];

  const data = useData();
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
    return data.map((total) => {
      const playerRuns = safeInnings(total).filter((inning) => inning.strike.player === player)
      return playerRuns.reduce((count, item) => {
        return count + item.strike.run
      }, 0)
    })
  }

  const bowlerRuns = (data, player) => {
    return data.map((total) => {
      const playerRuns = safeInnings(total).filter((inning) => inning.bowler.player === player)
      return playerRuns.reduce((count, item) => {
        return count + item.bowler.run
      }, 0)
    })
  }
  // ---------------------------------------------
  const bowlerWickets = (data, player) => {
    return data.map((total) => {
      const playerWickets = safeInnings(total).filter((player) => player.bowler.player === player)
      return playerWickets.reduce((count, item) => {
        return count + item.bowler.wicket
      }, 0)
    })
  }

  // ---------------------------------------------
  const totalWickets = data.reduce((count, item) => {
    const playerWickets = safeInnings(item).filter((inning) => inning.bowler.wicket)
    return count + playerWickets.length
  }, 0)
  // ---------------------------------------------
  const extraRuns = data.reduce((count, item) => {
    const extraRun = safeInnings(item).reduce((count, inning) => {
      return count + inning.extraRun
    }, 0)
    return count + extraRun
  }, 0)
  // ---------------------------------------------

  const totalRuns = data.reduce((count, item) => {
    return count + safeInnings(item).reduce((count, item) => {
      return count + item.run + item.extraRun
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

  return (
    <div>
      <table className="table-fixed">
        <thead>
          <tr>
            {headers.map((h, key) => (<th className='border-b px-8 py-4' key={key}>{h}</th>))}
          </tr>
        </thead>
        <tbody className="border-b">
          {uniquePlayers.map((player, key) => (
            <tr className="border-b" key={key}>
              <td className="px-8 py-4">{player}</td>
              <td className="px-8 py-4">{batterRuns(data, player)}</td>
              <td className="px-8 py-4">{playedBalls(data, player)}</td>
              <td className="px-8 py-4">{getFour(data, player)}</td>
              <td className="px-8 py-4">{getSix(data, player)}</td>
              <td className="px-8 py-4">{(batterRuns(data, player) / playedBalls(data, player) * 100).toFixed(2)}</td>
            </tr>))}
        </tbody>
      </table>
      <br />
      <div className=" w-full flex flex-row justify-self-end"><div>{totalRuns}/{totalWickets} ({overBall()?.over}.{overBall()?.ball})  Extras -  {extraRuns}</div></div>
    </div>
  );
}
export default page;

//bowlingStatus = ['bowling', 'o', 'm', 'r', 'w', 'econ', 'os', 'wd', 'nb' ]    