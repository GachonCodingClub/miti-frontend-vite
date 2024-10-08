export interface IValidationProps {
  selectedDate: string;
  inputPlace: string;
  numericInputMember: number;
  addParticipants: string[];
  setDateError: React.Dispatch<string>;
  setPlaceError: React.Dispatch<string>;
  setMemberError: React.Dispatch<string>;
  setDuplicateBlankErrorDialog: React.Dispatch<boolean>;
}
export const validateForm = ({
  selectedDate,
  inputPlace,
  numericInputMember,
  addParticipants,
  setDateError,
  setPlaceError,
  setMemberError,
  setDuplicateBlankErrorDialog,
}: IValidationProps): boolean => {
  const currentDate = new Date().toISOString().split("T")[0]; // 현재 날짜
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1); // 1년 후의 날짜
  const oneYearFromNowDate = oneYearFromNow.toISOString().split("T")[0];

  let isValid = true;

  if (selectedDate === "") {
    setDateError("날짜를 선택해 주세요");
    isValid = false;
  } else if (selectedDate < currentDate) {
    setDateError("날짜는 오늘 이후여야 해요");
    isValid = false;
  } else if (selectedDate > oneYearFromNowDate) {
    // 1년 이후 날짜 검증 추가
    setDateError("날짜는 1년 이내로 해주세요");
    isValid = false;
  } else {
    setDateError(""); // 오류가 없을 경우 오류 메시지를 비움
  }

  setPlaceError(inputPlace === "" ? "장소를 입력해 주세요" : "");

  if (numericInputMember < 2) {
    setMemberError("인원은 2명 이상이어야 해요");
    isValid = false;
  } else if (numericInputMember > 50) {
    setMemberError("최대 50명을 초과할 수 없어요");
    isValid = false;
  } else {
    setMemberError("");
  }

  // 배열에 빈 문자열이 있는지 검사.
  if (addParticipants.includes("")) {
    setDuplicateBlankErrorDialog(true);
    isValid = false;
  }

  // 모든 검증을 통과했는지 여부 반환
  return (
    isValid &&
    selectedDate >= currentDate &&
    inputPlace !== "" &&
    numericInputMember >= 2 &&
    numericInputMember <= 50 &&
    !addParticipants.includes("")
  );
};
