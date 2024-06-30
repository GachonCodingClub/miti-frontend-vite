import { useNavigate } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { PaddingScreen } from "../../components/styles/Screen";
import { Linkify } from "../../utils/linkify";
import { useState } from "react";
import { Dialog } from "../../components/Dialog";

export default function Notice() {
  const navigate = useNavigate();
  // 외부 링크 이동 다이얼로그
  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    url: string | null;
  }>({ open: false, url: null });

  const handleLinkClick = (url: string) => {
    setLinkDialog({ open: true, url });
  };

  return (
    <>
      <TopBar
        title="문의하기"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <PaddingScreen>
        <div className="mt-7 px-6">
          <div className="font-bold text-lg">오픈채팅 링크</div>
          <p className="mt-7">
            미티 1:1문의 :{" "}
            <Linkify
              text="https://open.kakao.com/o/sNCuzzcg"
              onLinkClick={handleLinkClick}
            />
          </p>
        </div>
        <div className="mt-7 px-6">
          <div className="font-bold text-lg">이메일</div>
          <p className="mt-7">kjyse2@naver.com</p>
        </div>
        <div className="mt-7 px-6">
          <div className="font-bold text-lg">인스타그램</div>
          <p className="mt-7">가천대_미티(gachon_miti)</p>
        </div>

        {linkDialog.open && (
          <Dialog
            title="외부 링크로 이동하시겠어요?"
            left="취소"
            onLeftClick={() => setLinkDialog({ open: false, url: null })}
            right="예"
            onRightClick={() => {
              if (linkDialog.url) {
                window.open(linkDialog.url, "_blank"); // 새 탭에서 url 열기
                setLinkDialog({ open: false, url: null });
              }
            }}
          />
        )}
      </PaddingScreen>
    </>
  );
}
