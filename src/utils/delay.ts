export const delay = (timeInMs = 300) => {
  return setTimeout(Promise.resolve, timeInMs)
}