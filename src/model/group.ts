export interface IGroups {
  totalPages: number;
  totalElements: number;
  size: number;
  content: IGroup[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface IGroup {
  id: number;
  description: string;
  maxUsers: number;
  nowUsers: number;
  meetDate: string;
  meetPlace: string;
  title: string;
  leaderUserId: string;
  groupStatus: string;
  unreadMessagesCount: number | undefined;
  leaderUserSummaryDto: {
    userId: string;
  };
}
