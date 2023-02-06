exports.default = async (text, fields) => {
  if (!text) return [];
  return Array.from([...fields], (f) => {
    return {
      [f]: {
        $regex: text,
        $options: "i",
      },
    };
  });
};
