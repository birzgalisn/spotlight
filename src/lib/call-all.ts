/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function callAll<T extends (...args: any[]) => void>(
  ...fns: (T | undefined)[]
) {
  return (...args: Parameters<T>) => {
    fns.forEach((fn) => fn?.(...args));
  };
}
