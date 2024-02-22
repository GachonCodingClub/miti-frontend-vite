export interface IValidationProps {
  selecteDate: string;
  inputPlace: string;
  numericInputMember: number;
  additionalParticipants: string[];
  setDateError: React.Dispatch<string>;
  setPlaceError: React.Dispatch<string>;
  setMemberError: React.Dispatch<string>;
  setDuplicateBlankErrorDialog: React.Dispatch<boolean>;
}

export const validateForm = ({
  selecteDate,
  inputPlace,
  numericInputMember,
  additionalParticipants,
  setDateError,
  setPlaceError,
  setMemberError,
  setDuplicateBlankErrorDialog,
}: IValidationProps): boolean => {
  setDateError(selecteDate === "" ? "날짜를 선택해 주세요." : "");
  setPlaceError(inputPlace === "" ? "장소를 입력해 주세요." : "");
  setMemberError(numericInputMember < 2 ? "인원은 2 이상이어야 합니다." : "");

  // 배열에 빈 문자열이 있는지 검사.
  if (additionalParticipants.includes("")) {
    setDuplicateBlankErrorDialog(true);
  }

  return (
    selecteDate !== "" &&
    inputPlace !== "" &&
    numericInputMember >= 2 &&
    !additionalParticipants.includes("")
  );
};
