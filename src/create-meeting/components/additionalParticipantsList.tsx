import React from "react";
import {
  AddMemberContainer,
  DeleteMemberButton,
  AddedNicknameText,
} from "../styles/createMeetingDetailComponents";

interface IAdditionalParticipantsListProps {
  participants: string[];
  onRemoveNicknameClick: (index: number) => void;
}

export const AdditionalParticipantsList: React.FC<
  IAdditionalParticipantsListProps
> = ({ participants, onRemoveNicknameClick }) => (
  <div style={{ overflowY: "scroll", maxHeight: "15vh" }}>
    <ul>
      {participants.map((nickname, index) => (
        <li key={index}>
          <AddMemberContainer>
            <DeleteMemberButton onClick={() => onRemoveNicknameClick(index)}>
              X
            </DeleteMemberButton>
            <AddedNicknameText>{nickname}</AddedNicknameText>
          </AddMemberContainer>
        </li>
      ))}
    </ul>
  </div>
);

export default AdditionalParticipantsList;
