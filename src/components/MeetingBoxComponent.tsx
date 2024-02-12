import {
  MeetingBox,
  MeetingTitle,
  MeetingInfo,
  PlaceInfo,
  PeopleInfo,
} from "../meeting-list/components/meetingListComponents";
import { IGroup } from "../model/group";
import { Location1pxIcon, Person1pxIcon } from "./Icons";

interface IMeetingBoxComponent {
  meeting: IGroup;
  isPast?: boolean;
}

export default function MeetingBoxComponent({
  meeting,
  isPast,
}: IMeetingBoxComponent) {
  const meetingDate = new Date(meeting?.meetDate);
  meetingDate.setHours(meetingDate.getHours() + 9);

  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(meetingDate);

  return (
    <MeetingBox to={`/meeting-list/${meeting.id}`}>
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
