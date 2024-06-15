import React from "react";

interface LinkifyProps {
  text: string;
  onLinkClick: (url: string) => void;
}

export const Linkify: React.FC<LinkifyProps> = ({ text, onLinkClick }) => {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  return (
    <span>
      {text.split(urlPattern).map((part, index) => {
        if (urlPattern.test(part)) {
          const url = part.startsWith("http") ? part : `https://${part}`;
          return (
            <a
              key={index}
              className="flex gap-2 items-center"
              onClick={() => onLinkClick(url)}
            >
              {part}
              <p className="bg-[#EBE8E7] px-[6px] py-[1px] text-sm rounded-3xl font-bold">
                이동
              </p>
            </a>
          );
        }
        return part; // url 패턴과 일치하지 않은 경우 그냥 반환
      })}
    </span>
  );
};
