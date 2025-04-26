export function debounce(fn: (...args: unknown[]) => unknown, timeout: number) {
  let id: number;
  return function impl(...args: unknown[]) {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), timeout);
  };
}
