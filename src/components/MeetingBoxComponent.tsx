import {
  MeetingBox,
  MeetingTitle,
  MeetingInfo,
  PlaceInfo,
  PeopleInfo,
  AlertMessage,
} from "../meeting-list/components/meetingListComponents";
import { IGroup } from "../model/group";
import { ReqAlertDiv } from "../profile/styles/profileStyle";

import { formatDate } from "../utils";
import {
  Location1pxIcon,
  OrangeCrownIcon,
  Person1pxIcon,
} from "./styles/Icons";

interface IMeetingBoxComponent {
  meeting: IGroup;
  isPast?: boolean;
  onClick?: () => void;
  isLeader?: boolean;
  isWaitingParty?: boolean;
}

export default function MeetingBoxComponent({
  meeting,
  isPast,
  onClick,
  isLeader,
  isWaitingParty,
}: IMeetingBoxComponent) {
  const formattedDate = formatDate(meeting?.meetDate);

  return (
    <MeetingBox onClick={onClick}>
      {isWaitingParty && (
        <ReqAlertDiv>
          <AlertMessage>새로운 참여 요청이 있어요!</AlertMessage>
        </ReqAlertDiv>
      )}
      <div className="flex flex-col gap-2">
        <MeetingTitle>
          <span className="text-base font-medium text-gray-800 flex">
            {meeting.title} {isLeader && <OrangeCrownIcon />}
          </span>
          <span className="text-xs font-normal text-gray-300">
            {formattedDate}
          </span>
        </MeetingTitle>
        {!isPast && (
          <div className="text-xs font-normal text-gray-500">
            {meeting.description}
          </div>
        )}
      </div>
      <MeetingInfo>
        <PlaceInfo>
          <Location1pxIcon />
          <span className="text-xs font-normal text-gray-700">
            {meeting.meetPlace}
          </span>
        </PlaceInfo>
        <PeopleInfo>
          <Person1pxIcon />
          <span className="text-xs font-normal text-gray-700">{`${meeting.nowUsers}/${meeting.maxUsers}`}</span>
        </PeopleInfo>
      </MeetingInfo>
    </MeetingBox>
  );
}
