// 텍스트에서 링크를 감지하여 JSX 요소로 변환하는 함수
export const linkify = (text: string): (string | JSX.Element)[] => {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  return text.split(urlPattern).map((part, index) => {
    if (urlPattern.test(part)) {
      const url = part.startsWith("http") ? part : `https://${part}`;
      return (
        <div className="flex gap-2 items-center">
          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
          <div className="bg-[#EBE8E7] px-[6px] py-[1px] text-sm rounded-3xl font-bold">
            이동
          </div>
        </div>
      );
    }
    return part;
  });
};
