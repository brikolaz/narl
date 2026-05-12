export const padArray = <T>(arr: T[], targetLength: number): T[] => {
  return [...arr.slice(0, targetLength), ...Array(targetLength)].slice(
    0,
    targetLength,
  );
};
