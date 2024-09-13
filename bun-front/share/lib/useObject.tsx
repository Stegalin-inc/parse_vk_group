import { useState } from "preact/hooks";

export const useObject = <T,>(initial: T) => {
  const [obj, setObj] = useState(initial);
  const set = (newObj: Partial<T>) => setObj({ ...obj, ...newObj });
  return [obj, set] as const;
};
