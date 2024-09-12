import { useEffect, useState } from "preact/hooks";

const cache = new Map();

export const useFetched = <T>(apiMethod: () => Promise<T>, initial: T, cached = false) => {
  const [data, setData] = useState(initial);

  useEffect(() => {
    if (cached && cache.has(apiMethod)) {
      setData(cache.get(apiMethod));
      return;
    }
    apiMethod().then((data) => {
      cache.set(apiMethod, data);
      setData(data);
    });
  }, []);

  return data;
};
