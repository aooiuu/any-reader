export function timeoutWith(tasks: any, t = 6000) {
  const delay = () =>
    new Promise((_, reject) => {
      setTimeout(reject, t);
    });

  return Promise.race([tasks, delay()]);
}
