import { useEffect, useState } from "react";

export const useServerTime = (initialServerTime) => {
  const [offset, setOffset] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (initialServerTime) {
      setOffset(initialServerTime - Date.now());
    }
  }, [initialServerTime]);

  useEffect(() => {
    const updateTime = () => {
      setNow(Date.now() + offset);
    };

    const interval = setInterval(updateTime, 1000);
    updateTime(); // initial call

    return () => clearInterval(interval);
  }, [offset]);

  return now;
};
