const getPriorityClass = (priority: string) => {
  return priority === "High"
    ? "text-red-600 font-bold"
    : priority === "Medium"
    ? "text-yellow-600 font-bold"
    : "text-green-600 font-bold";
};

const getPriorityTranslateFR = (priority: string) => {
  return priority === "High"
    ? "Haute"
    : priority === "Medium"
    ? "Moyenne"
    : "Normal";
};

export { getPriorityClass, getPriorityTranslateFR };
