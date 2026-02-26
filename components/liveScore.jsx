'use client';
import {useEffect, useState} from 'react';

const LiveScore = React.memo(function LiveScore() {
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log('LiveScore mounted');
    const es = new EventSource('/api/score');
    es.onmessage = e => {
      console.log('SSE:', e.data);
      setData(JSON.parse(e.data));
    };
    return () => { console.log('LiveScore unmounted'); es.close(); };
  }, []);
});

export default LiveScore;