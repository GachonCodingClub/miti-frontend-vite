import { useNavigate } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { PaddingScreen } from "../../components/styles/Screen";

export default function Notice() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="문의하기"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <PaddingScreen>
        <div className="mt-7 px-6">
          <div className="font-bold text-lg">오픈채팅 링크</div>
          <p className="mt-7">https://open.kakao.com/o/sNCuzzcg</p>
        </div>
        <div className="mt-7 px-6">
          <div className="font-bold text-lg">이메일</div>
          <p className="mt-7">kjyse2@naver.com</p>
        </div>
      </PaddingScreen>
    </>
  );
}
