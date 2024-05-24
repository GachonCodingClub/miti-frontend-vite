export function formatDate(dateString: string | undefined) {
  if (!dateString) return "";

  const date = new Date(dateString);
  date.setHours(date.getHours() + 9);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "2-digit",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// tailwind의 className에서 조건부 사용
export function cls(...classnames: string[]) {
  return classnames.join(" ");
}
