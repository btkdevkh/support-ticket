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

const getStatusClass = (status: string) => {
  return status === "Open"
    ? "text-green-600 font-bold"
    : "text-red-600 font-bold";
};

const getStatusTranslateFR = (status: string) => {
  return status === "Open" ? "Ouvert" : "Fermé";
};

export {
  getPriorityClass,
  getPriorityTranslateFR,
  getStatusTranslateFR,
  getStatusClass,
};
