export const getNameInitial = (name: string) => {
  return (name.split(" ")?.map((word) => word.charAt(0)) || [])
    .slice(0, 2)
    .join("");
};
