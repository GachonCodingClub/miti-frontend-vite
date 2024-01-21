import React from "react";
import { MyInputBox, MyInputBoxSVG } from "../../components/MyInputBox";
import { CheckIcon, ModifyIcon } from "../../components/Icons";

interface MeetingDetailsInputsProps {
  selecteDate: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateError: string;
  inputPlace: string;
  onPlaceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeError: string;
  inputMember: string;
  onMemberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  memberError: string;
  inputMemberDisabled: boolean;
  setInputMemberDisabled: React.Dispatch<boolean>;
  setMemberCountModi: React.Dispatch<boolean>;
}

const MeetingDetailsInputs: React.FC<MeetingDetailsInputsProps> = ({
  selecteDate,
  handleDateChange,
  dateError,
  inputPlace,
  onPlaceChange,
  placeError,
  inputMember,
  onMemberChange,
  memberError,
  inputMemberDisabled,
  setInputMemberDisabled,
  setMemberCountModi,
}) => (
  <>
    <MyInputBox
      placeholder="만날 날짜"
      label="미팅 날짜"
      type="datetime-local"
      value={selecteDate}
      onChange={handleDateChange}
      error={dateError}
    />

    <MyInputBox
      placeholder="만날 장소"
      label="첫 만남 장소"
      type="text"
      value={inputPlace}
      onChange={onPlaceChange}
      error={placeError}
    />

    <MyInputBoxSVG
      placeholder="인원을 설정해주세요"
      label="미팅 인원"
      type="number"
      pattern="[0-9]*" // 숫자만 허용
      onClick={() => {
        if (inputMemberDisabled === false) {
          setInputMemberDisabled(true);
        } else {
          setInputMemberDisabled(false);
          setMemberCountModi(true);
        }
      }}
      value={inputMember}
      onChange={onMemberChange}
      error={memberError}
      svg={inputMemberDisabled ? <ModifyIcon /> : <CheckIcon />}
      disable={inputMemberDisabled}
    />
  </>
);

export default MeetingDetailsInputs;
