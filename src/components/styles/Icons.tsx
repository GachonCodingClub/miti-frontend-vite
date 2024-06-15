import { ReactNode } from "react";

interface IconProps {
  children: ReactNode;
  width?: number;
  height?: number;
  viewBox?: string;
  fill?: string;
}

interface IconSizeClickProps {
  size?: number;
  onClick?: () => void;
}

const Icon = ({
  children,
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  fill = "none",
}: IconProps) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
    >
      {children}
    </svg>
  </div>
);

// 달력 아이콘
export const DateIcon = () => {
  return (
    <Icon>
      <path
        d="M3 8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V8Z"
        stroke="#2F2A28"
        strokeWidth="1.5"
      />
      <path
        d="M8.75 1.75V6.25"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.25 1.75V6.25"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M2.25 10H21.75" stroke="#2F2A28" strokeWidth="1.5" />
    </Icon>
  );
};

// 종이 네행기
export const SendIcon = ({ active }: { active: boolean }) => {
  return (
    <div>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.94772 4.53473L19.3377 11.1169C20.0455 11.4929 20.0455 12.5071 19.3377 12.8831L6.94772 19.4653C6.18874 19.8685 5.3083 19.1897 5.50515 18.3531L7 12L5.50515 5.64688C5.3083 4.81029 6.18874 4.13152 6.94772 4.53473Z"
          fill={active ? "#FF7152" : "#DEDBD9"}
        />
        <path
          d="M7 12L5.50515 5.64688C5.3083 4.81029 6.18874 4.13152 6.94772 4.53473L19.3377 11.1169C20.0455 11.4929 20.0455 12.5071 19.3377 12.8831L6.94772 19.4653C6.18874 19.8685 5.3083 19.1897 5.50515 18.3531L7 12ZM7 12H14"
          stroke="white"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// 장소 아이콘 1px
export const Location1pxIcon = () => {
  return (
    <div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 13.1936C12.6628 13.1936 13.2985 12.9303 13.7673 12.4616C14.2361 11.9929 14.4997 11.3572 14.5 10.6942C14.5 10.031 14.2366 9.39498 13.7678 8.92602C13.2989 8.45706 12.663 8.1936 12 8.1936C11.337 8.1936 10.7011 8.45706 10.2322 8.92602C9.76339 9.39498 9.5 10.031 9.5 10.6942C9.50033 11.3572 9.76387 11.9929 10.2327 12.4616C10.7015 12.9303 11.3372 13.1936 12 13.1936Z"
          stroke="#2F2A28"
          strokeLinecap="square"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.5 10.5712C20.5 17.7144 13.4167 22 12 22C10.5833 22 3.5 17.7144 3.5 10.5712C3.50113 8.29735 4.3972 6.11702 5.99118 4.50969C7.58516 2.90235 9.74653 1.99962 12 2C16.6934 2 20.5 5.83818 20.5 10.5712Z"
          stroke="#2F2A28"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
};

// 장소 아이콘
export const LocationIcon = () => {
  return (
    <Icon>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 13.1936C12.6628 13.1936 13.2985 12.9303 13.7673 12.4616C14.2361 11.9929 14.4997 11.3572 14.5 10.6942C14.5 10.031 14.2366 9.39498 13.7678 8.92602C13.2989 8.45706 12.663 8.1936 12 8.1936C11.337 8.1936 10.7011 8.45706 10.2322 8.92602C9.76339 9.39498 9.5 10.031 9.5 10.6942C9.50033 11.3572 9.76387 11.9929 10.2327 12.4616C10.7015 12.9303 11.3372 13.1936 12 13.1936Z"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5 10.5712C20.5 17.7144 13.4167 22 12 22C10.5833 22 3.5 17.7144 3.5 10.5712C3.50113 8.29735 4.3972 6.11702 5.99118 4.50969C7.58516 2.90235 9.74653 1.99962 12 2C16.6934 2 20.5 5.83818 20.5 10.5712Z"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </Icon>
  );
};

// 햄버거 아이콘
export const HamburgerIcon = ({ onClick }: IconSizeClickProps) => {
  return (
    <div onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M18 12H6"
          stroke="#2F2A28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 6H6"
          stroke="#2F2A28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 18H6"
          stroke="#2F2A28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// 애로우 백 아이콘
export const ArrowbackIcon = ({ onClick }: IconSizeClickProps) => {
  return (
    <div onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M11 5L4.70711 11.2929C4.31658 11.6834 4.31658 12.3166 4.70711 12.7071L11 19M4.5 12H18.5"
          stroke="#2F2A28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// 사람1px 아이콘
export const Person1pxIcon = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M11.9998 14.8C8.37493 14.8 4.69591 16.6 4.0151 19.9975C3.93302 20.407 4.19051 20.8 4.66674 20.8H19.3328C19.8095 20.8 20.067 20.407 19.9849 19.9975C19.3037 16.6 15.6247 14.8 11.9998 14.8Z"
          stroke="#2F2A28"
          strokeMiterlimit="10"
        />
        <circle cx="12" cy="7.60002" r="4.2" stroke="#2F2A28" />
      </svg>
    </div>
  );
};

// 사람 아이콘
export const PersonIcon = () => {
  return (
    <Icon>
      <path
        d="M11.9998 14.8C8.37493 14.8 4.69591 16.6 4.0151 19.9975C3.93302 20.407 4.19051 20.8 4.66674 20.8H19.3328C19.8095 20.8 20.067 20.407 19.9849 19.9975C19.3037 16.6 15.6247 14.8 11.9998 14.8Z"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <circle cx="12" cy="7.60002" r="4.2" stroke="#2F2A28" strokeWidth="1.5" />
    </Icon>
  );
};

// 수정 아이콘
export const ModifyIcon = () => {
  return (
    <Icon>
      <path
        d="M19.5 19.5H8.52857M8.52857 19.5H4.5C3.94772 19.5 3.5 19.0523 3.5 18.5V14.8856C3.5 14.6204 3.60536 14.3661 3.79289 14.1785L11.8393 6.13217M8.52857 19.5L16.8678 11.1607M11.8393 6.13217L13.7643 4.20711C14.1548 3.81658 14.788 3.81658 15.1785 4.20711L18.7929 7.82147C19.1834 8.21199 19.1834 8.84515 18.7929 9.23568L16.8678 11.1607M11.8393 6.13217L16.8678 11.1607"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Icon>
  );
};

// 옵션 아이콘

export const SettingIcon = ({ onClick }: IconSizeClickProps) => {
  return (
    <div onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.8 4.1421C13.8 3.5112 13.2888 3 12.6579 3H11.343C10.7112 3 10.2 3.5112 10.2 4.1421C10.2 4.6623 9.8436 5.1087 9.3585 5.2995C9.282 5.3301 9.2055 5.3625 9.1308 5.3949C8.6529 5.6019 8.085 5.5389 7.716 5.1708C7.50184 4.95679 7.21146 4.83657 6.9087 4.83657C6.60594 4.83657 6.31556 4.95679 6.1014 5.1708L5.1708 6.1014C4.95679 6.31556 4.83657 6.60594 4.83657 6.9087C4.83657 7.21146 4.95679 7.50184 5.1708 7.716C5.5398 8.085 5.6028 8.652 5.394 9.1308C5.36119 9.20615 5.32969 9.28206 5.2995 9.3585C5.1087 9.8436 4.6623 10.2 4.1421 10.2C3.5112 10.2 3 10.7112 3 11.3421V12.6579C3 13.2888 3.5112 13.8 4.1421 13.8C4.6623 13.8 5.1087 14.1564 5.2995 14.6415C5.3301 14.718 5.3625 14.7945 5.394 14.8692C5.6019 15.3471 5.5389 15.915 5.1708 16.284C4.95679 16.4982 4.83657 16.7885 4.83657 17.0913C4.83657 17.3941 4.95679 17.6844 5.1708 17.8986L6.1014 18.8292C6.31556 19.0432 6.60594 19.1634 6.9087 19.1634C7.21146 19.1634 7.50184 19.0432 7.716 18.8292C8.085 18.4602 8.652 18.3972 9.1308 18.6051C9.2055 18.6384 9.282 18.6699 9.3585 18.7005C9.8436 18.8913 10.2 19.3377 10.2 19.8579C10.2 20.4888 10.7112 21 11.3421 21H12.6579C13.2888 21 13.8 20.4888 13.8 19.8579C13.8 19.3377 14.1564 18.8913 14.6415 18.6996C14.718 18.6699 14.7945 18.6384 14.8692 18.606C15.3471 18.3972 15.915 18.4611 16.2831 18.8292C16.3892 18.9353 16.5151 19.0195 16.6537 19.0769C16.7923 19.1343 16.9408 19.1639 17.0908 19.1639C17.2409 19.1639 17.3894 19.1343 17.528 19.0769C17.6666 19.0195 17.7925 18.9353 17.8986 18.8292L18.8292 17.8986C19.0432 17.6844 19.1634 17.3941 19.1634 17.0913C19.1634 16.7885 19.0432 16.4982 18.8292 16.284C18.4602 15.915 18.3972 15.348 18.6051 14.8692C18.6384 14.7945 18.6699 14.718 18.7005 14.6415C18.8913 14.1564 19.3377 13.8 19.8579 13.8C20.4888 13.8 21 13.2888 21 12.6579V11.343C21 10.7121 20.4888 10.2009 19.8579 10.2009C19.3377 10.2009 18.8913 9.8445 18.6996 9.3594C18.6694 9.28295 18.6379 9.20704 18.6051 9.1317C18.3981 8.6538 18.4611 8.0859 18.8292 7.7169C19.0432 7.50274 19.1634 7.21236 19.1634 6.9096C19.1634 6.60684 19.0432 6.31646 18.8292 6.1023L17.8986 5.1717C17.6844 4.95769 17.3941 4.83747 17.0913 4.83747C16.7885 4.83747 16.4982 4.95769 16.284 5.1717C15.915 5.5407 15.348 5.6037 14.8692 5.3958C14.7939 5.36269 14.7179 5.33088 14.6415 5.3004C14.1564 5.1087 13.8 4.6623 13.8 4.143V4.1421Z"
          stroke="#2F2A28"
          strokeWidth="1.5"
        />
        <path
          d="M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12V12Z"
          stroke="#2F2A28"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

// 검색 아이콘
export const SearchIcon = () => {
  return (
    <Icon>
      <g clipPath="url(#clip0_44_1570)">
        <circle cx="10.5" cy="11" r="6.25" stroke="#2F2A28" strokeWidth="1.5" />
        <path
          d="M15.24 15.2401L18.7755 18.7758"
          stroke="#2F2A28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_44_1570">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  );
};

// 아래 화살표 아이콘
export const ArrowdropIcon = () => {
  return (
    <Icon>
      <path
        d="M5 9L11.2929 15.2929C11.6834 15.6834 12.3166 15.6834 12.7071 15.2929L19 9"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

// 주황 체크 아이콘
export const CheckIcon = () => {
  return (
    <Icon>
      <path
        d="M5 11.375L9.36799 16.6166C9.37175 16.6211 9.37858 16.6214 9.38274 16.6173L19 7"
        stroke="#FF7152"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Icon>
  );
};

// 주황색 북마크 아이콘
export const FrameIcon = () => {
  return (
    <Icon>
      <path
        d="M6 18.4813V5C6 4.44772 6.44772 4 7 4H17C17.5523 4 18 4.44772 18 5V18.4813C18 19.1998 17.2649 19.6838 16.6049 19.4L12.3951 17.5893C12.1429 17.4808 11.8571 17.4808 11.6049 17.5893L7.39511 19.4C6.7351 19.6838 6 19.1998 6 18.4813Z"
        fill="#FF7152"
        stroke="#FF7152"
        strokeWidth="1.5"
      />
    </Icon>
  );
};

// 주황색 왕관 아이콘
export const OrangeCrownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.58397 5.62404C9.78189 5.32717 10.2181 5.32717 10.416 5.62404L13.0308 9.54623C13.1935 9.79022 13.5302 9.8425 13.7592 9.65931L16.4282 7.52413C16.7926 7.2326 17.3223 7.55501 17.2308 8.01262L15.9137 14.5981C15.867 14.8318 15.6618 15 15.4234 15H4.57657C4.33823 15 4.13302 14.8318 4.08628 14.5981L2.76919 8.01262C2.67767 7.55501 3.20742 7.2326 3.57183 7.52413L6.24081 9.65931C6.46979 9.8425 6.80652 9.79022 6.96918 9.54623L9.58397 5.62404Z"
        fill="#FF7152"
      />
    </svg>
  );
};

// X 버튼
export const XIcon = ({ size }: IconSizeClickProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M17 17L7 7M7 17L17 7L7 17Z"
        stroke="#2F2A28"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 아래화살표
export const ScrollDownIcon = () => {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6z" />
    </svg>
  );
};

// 신고 아이콘
export const ReportIcon = () => {
  return (
    <svg
      data-slot="icon"
      fill="red"
      width="18"
      height="18"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
      />
    </svg>
  );
};

// 새로고침 아이콘
export const RefreshIcon = () => {
  return (
    <svg
      data-slot="icon"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
      ></path>
    </svg>
  );
};

// 플러스 아이콘
export const PlusIcon = () => {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      stroke-width="3"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      ></path>
    </svg>
  );
};

// 인스타그램 아이콘
export const InstaIcon = () => {
  return (
    <svg
      fill="#000000"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="16"
      height="16"
      viewBox="0 0 169.063 169.063"
      xmlSpace="preserve"
    >
      <g>
        <path
          d="M122.406,0H46.654C20.929,0,0,20.93,0,46.655v75.752c0,25.726,20.929,46.655,46.654,46.655h75.752
		c25.727,0,46.656-20.93,46.656-46.655V46.655C169.063,20.93,148.133,0,122.406,0z M154.063,122.407
		c0,17.455-14.201,31.655-31.656,31.655H46.654C29.2,154.063,15,139.862,15,122.407V46.655C15,29.201,29.2,15,46.654,15h75.752
		c17.455,0,31.656,14.201,31.656,31.655V122.407z"
        />
        <path
          d="M84.531,40.97c-24.021,0-43.563,19.542-43.563,43.563c0,24.02,19.542,43.561,43.563,43.561s43.563-19.541,43.563-43.561
		C128.094,60.512,108.552,40.97,84.531,40.97z M84.531,113.093c-15.749,0-28.563-12.812-28.563-28.561
		c0-15.75,12.813-28.563,28.563-28.563s28.563,12.813,28.563,28.563C113.094,100.281,100.28,113.093,84.531,113.093z"
        />
        <path
          d="M129.921,28.251c-2.89,0-5.729,1.17-7.77,3.22c-2.051,2.04-3.23,4.88-3.23,7.78c0,2.891,1.18,5.73,3.23,7.78
		c2.04,2.04,4.88,3.22,7.77,3.22c2.9,0,5.73-1.18,7.78-3.22c2.05-2.05,3.22-4.89,3.22-7.78c0-2.9-1.17-5.74-3.22-7.78
		C135.661,29.421,132.821,28.251,129.921,28.251z"
        />
      </g>
    </svg>
  );
};
