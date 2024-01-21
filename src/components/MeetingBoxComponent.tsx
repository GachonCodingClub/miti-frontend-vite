import {
  MeetingBox,
  MeetingTitle,
  MeetingInfo,
  PlaceInfo,
  PeopleInfo,
} from "../meeting-list/components/meetingListComponents";
import { IGroup } from "../model/group";
import { getDate } from "../utils";
import { Location1pxIcon, Person1pxIcon } from "./Icons";

interface IMeetingBoxComponent {
  meeting: IGroup;
  isPast?: boolean;
}

export default function MeetingBoxComponent({
  meeting,
  isPast,
}: IMeetingBoxComponent) {
  return (
    <MeetingBox to={`/meeting-list/${meeting.id}`}>
      <div className="flex flex-col gap-2">
        <MeetingTitle>
          <span className="text-base font-medium text-gray-800">
            {meeting.title}
          </span>
          <span className="text-xs font-normal text-gray-300">
            {getDate(meeting.meetDate)}
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
