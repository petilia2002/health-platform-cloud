export const isResultNormal = (value, reference) => {
  if (reference.length < 2) return true;
  if (reference.includes("–")) {
    const [min, max] = reference.split(" – ").map(Number);
    return value >= min && value <= max;
  }
  const refNum = Number(reference.split(" ")[1]);
  if (reference.includes("<")) {
    return value <= refNum;
  } else {
    return value >= refNum;
  }
};
