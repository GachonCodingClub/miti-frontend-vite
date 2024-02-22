export type RangeType = "height" | "weight";
export type RangeValue =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "HIDDEN"
  | "UNKNOWN";

export const rangeToAlphabet = (value: string, type: RangeType): RangeValue => {
  const ranges: {
    [key in RangeType]: { [key: string]: RangeValue };
  } = {
    height: {
      "120~129": "A",
      "130~139": "B",
      "140~149": "C",
      "150~159": "D",
      "160~169": "E",
      "170~179": "F",
      "180~189": "G",
      "190~199": "H",
      "200~209": "I",
      "210~219": "J",
      비공개: "HIDDEN",
    },
    weight: {
      "30~39": "A",
      "40~49": "B",
      "50~59": "C",
      "60~69": "D",
      "70~79": "E",
      "80~89": "F",
      "90~99": "G",
      "100~109": "H",
      "110~119": "I",
      "120~129": "J",
      비공개: "HIDDEN",
    },
  };
  return ranges[type][value] || "UNKNOWN";
};
