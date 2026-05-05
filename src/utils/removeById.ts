export const removeById = <T extends { id: string }>(arr: T[], id: string) => {
  const index = arr.findIndex((el) => el.id === id);
  if (index !== -1) {
    arr.splice(index, 1);
  }
};
