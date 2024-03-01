import React from "react";
import {
  AddMemberContainer,
  DeleteMemberButton,
  AddedNicknameText,
  AddMemberList,
} from "../styles/createMeetingDetailComponents";

interface IAdditionalParticipantsListProps {
  participants: string[];
  onRemoveNicknameClick: (index: number) => void;
}

export const AdditionalParticipantsList: React.FC<
  IAdditionalParticipantsListProps
> = ({ participants, onRemoveNicknameClick }) => (
  <AddMemberList>
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
  </AddMemberList>
);

export default AdditionalParticipantsList;
