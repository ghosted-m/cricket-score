'use client';
import { useEffect, useState } from 'react';

const useData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const es = new EventSource("/api/score");
    es.onmessage = (e) => {
      setData(JSON.parse(e.data));
    };

    return () => es.close(); // Cleanup on unmount
  }, []);

  return data;
}

export default useData;