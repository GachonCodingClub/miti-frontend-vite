export const getTimeString = (createdAt: string) => {
  const createdTime = new Date(createdAt);
  let hour = createdTime.getHours() + 9;
  hour = hour >= 24 ? hour - 24 : hour;

  const minute = createdTime.getMinutes();
  let hourValue = hour || 12; // hour가 0인 경우 12로 설정
  const minuteValue = minute < 10 ? `0${minute}` : minute;
  let ampm = "오전";

  if (hour >= 12) {
    ampm = "오후";
    hourValue = hourValue !== 12 ? hourValue - 12 : hourValue;
  }
  const timestamp = `${ampm} ${hourValue} : ${minuteValue}`;

  return timestamp;
};

export const getDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 9);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
};
