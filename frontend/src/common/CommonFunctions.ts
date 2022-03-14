function isPositiveInteger(props: number) {
  let n = Math.floor(Number(props));
  return n !== Infinity && n >= 0;
}

function debounce<Params extends any[]>(func: (...args: Params) => any, timeout: number): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

function debounceFunction<Params extends any[]>(func: (...args: Params) => any): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, 800);
  };
}

export { isPositiveInteger, debounce, debounceFunction };
