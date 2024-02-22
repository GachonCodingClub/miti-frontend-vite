import {
  MeetingBox,
  MeetingTitle,
  MeetingInfo,
  PlaceInfo,
  PeopleInfo,
} from "../meeting-list/components/meetingListComponents";
import { IGroup } from "../model/group";
import { formatDate } from "../utils";
import { Location1pxIcon, Person1pxIcon } from "./styles/Icons";

interface IMeetingBoxComponent {
  meeting: IGroup;
  isPast?: boolean;
  onClick?: () => void;
}

export default function MeetingBoxComponent({
  meeting,
  isPast,
  onClick,
}: IMeetingBoxComponent) {
  const formattedDate = formatDate(meeting?.meetDate);

  return (
    <MeetingBox onClick={onClick}>
      <div className="flex flex-col gap-2">
        <MeetingTitle>
          <span className="text-base font-medium text-gray-800">
            {meeting.title}
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
