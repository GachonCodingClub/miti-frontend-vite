// API의 날짜를 yyyy-MM-dd (요일) HH:mm 형식으로 반환
export const getDate = (fullDate: string) => {
  const getYMD = fullDate?.split("-");
  const [getFullDate, getTime] = fullDate?.split("T");
  const date = getYMD[2].slice(0, 2);
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const day = new Date(getFullDate).getDay();
  // 시, 분까지 가져오게 추가
  const [hours, minutes] =
    getTime?.split(":").map((part) => parseInt(part, 10)) || [];
  const time = `${String(hours).padStart(2, "0")}시 ${String(minutes).padStart(
    2,
    "0"
  )}분`;

  /* API의 meetDate에 날짜가 ISO8601 이런 형식으로 저장이 됨.
          이거 때문에 사용자가 선택한 시간과 실제로 저장되는 시간이 차이가 나는데,
          API를 수정하거나, 아니면 실제로 저장되는 값은 그대로 두고 화면에 보이는
          시간은 +9시간을 직접 더해서 보여주어야 할 것 같음 */

  return `${getYMD[0]}-${getYMD[1]}-${date} (${week[day]}) ${time}`;
};

// tailwind의 className에서 조건부 사용
export function cls(...classnames: string[]) {
  return classnames.join(" ");
}
