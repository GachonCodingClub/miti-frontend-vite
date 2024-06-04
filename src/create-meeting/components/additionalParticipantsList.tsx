import React from "react";
import {
  AddMemberContainer,
  DeleteMemberButton,
  AddedNicknameText,
  AddMemberList,
} from "../styles/createMeetingDetailComponents";
import { XIcon } from "../../components/styles/Icons";

interface AddParticipantsListProps {
  participants: string[];
  onRemoveNicknameClick: (index: number) => void;
}

export const AdditionalParticipantsList: React.FC<AddParticipantsListProps> = ({
  participants,
  onRemoveNicknameClick,
}) => (
  <AddMemberList>
    <ul>
      {participants.map((nickname, index) => (
        <li key={index}>
          <AddMemberContainer>
            <DeleteMemberButton onClick={() => onRemoveNicknameClick(index)}>
              <XIcon size={20} />
            </DeleteMemberButton>
            <AddedNicknameText>{nickname}</AddedNicknameText>
          </AddMemberContainer>
        </li>
      ))}
    </ul>
  </AddMemberList>
);

export default AdditionalParticipantsList;
