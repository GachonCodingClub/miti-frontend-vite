import React from "react";
import { InstaIcon } from "../components/styles/Icons";

interface LinkifyProps {
  text: string | undefined;
  onLinkClick: (url: string) => void;
}

export const Linkify: React.FC<LinkifyProps> = ({ text, onLinkClick }) => {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  return (
    <span>
      {text?.split(urlPattern).map((part, index) => {
        if (urlPattern.test(part)) {
          const url = part.startsWith("http") ? part : `https://${part}`;
          const isInstagram = url.includes("instagram.com");
          // 인스타그램 아이디 추출 및 쿼리스트링 제거
          let instagramId = null;
          if (isInstagram) {
            instagramId = url.split("instagram.com/")[1].split("?")[0];
          }

          return (
            <a
              key={index}
              className="flex gap-2 items-center break-all break-words whitespace-pre-wrap"
              onClick={() => onLinkClick(url)}
            >
              {isInstagram ? instagramId : part}
              {isInstagram ? (
                <InstaIcon />
              ) : (
                <p className="bg-[#EBE8E7] px-[6px] py-[1px] text-xs rounded-3xl font-bold whitespace-nowrap">
                  이동
                </p>
              )}
            </a>
          );
        }
        return part; // url 패턴과 일치하지 않은 경우 그냥 반환
      })}
    </span>
  );
};
