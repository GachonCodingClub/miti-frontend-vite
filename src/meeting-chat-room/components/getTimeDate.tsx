export const getTimeString = (createdAt: string) => {
  const createdTime = new Date(createdAt);
  const hour = createdTime.getHours() + 21;
  const minute = createdTime.getMinutes();
  const hourValue = hour % 12 || 12;
  const minuteValue = minute < 10 ? `0${minute}` : minute;
  const ampm = hourValue >= 12 ? "오전" : "오후";
  const timestamp = `${ampm} ${hourValue} : ${minuteValue}분`;

  return timestamp;
};

export const getDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};
