'use client';
import { useEffect, useState } from 'react';

// share a single EventSource across multiple hook users so that navigation
// between pages doesn't spawn/tear down a connection repeatedly.
let sharedEventSource = null;
let subscribers = [];

function startEventSource() {
  if (sharedEventSource) return;

  sharedEventSource = new EventSource('/api/score');
  sharedEventSource.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      // notify each subscriber of the fresh data
      subscribers.forEach((fn) => fn(parsed));
    } catch (err) {
      console.error('failed to parse SSE data', err);
    }
  };
  sharedEventSource.onerror = (err) => {
    // error events fire when the connection closes or can't be established
    console.error('score SSE error', err);
  };
}

function stopEventSource() {
  if (subscribers.length === 0 && sharedEventSource) {
    sharedEventSource.close();
    sharedEventSource = null;
  }
}

/**
 * Custom hook that returns an array of `match` objects emitted by the
 * /api/score server‑sent‑events endpoint.  The underlying EventSource is
 * shared between all components that call the hook, so navigation between
 * pages does **not** tear down the connection.  When the last subscriber
 * unmounts the connection is closed automatically.
 */
export function useScoreSSE() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // add listener & ensure the EventSource is running
    subscribers.push(setData);
    startEventSource();

    return () => {
      // cleanup when this component unmounts
      subscribers = subscribers.filter((fn) => fn !== setData);
      stopEventSource();
    };
  }, []);

  return data;
}
