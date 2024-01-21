import { useState } from "react";
import styled from "styled-components";
import {
  FixedButtonBoxWithShadow,
  LongWhiteBtn,
  LongOrangeBtn,
  Dialog,
} from "../../components/Button";
import Profile from "../../profile";

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2f2a28cc;
  z-index: 10;
`;

export default function ViewProfile() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  console.log(isButtonClicked, isAccepted);
  return (
    <>
      <Profile />
      <FixedButtonBoxWithShadow>
        <LongWhiteBtn
          text="거절"
          onClick={() => {
            setIsButtonClicked((prev) => !prev);
          }}
        />
        <LongOrangeBtn
          text="참여 수락"
          onClick={() => {
            setIsButtonClicked((prev) => !prev);
            setIsAccepted((prev) => !prev);
          }}
        />
      </FixedButtonBoxWithShadow>
      {isButtonClicked && (
        <Overlay
          onClick={() => {
            setIsButtonClicked((prev) => !prev);
            setIsAccepted(false);
          }}
        />
      )}
      {isButtonClicked &&
        (isAccepted ? (
          <Dialog
            title="참여 수락하기"
            contents="쿵야어드벤처 님과 미팅을 시작합니다."
            left="취소"
            right="참여 수락"
            onLeftClick={() => {
              setIsButtonClicked((prev) => !prev);
              setIsAccepted((prev) => !prev);
            }}
            onRightClick={() => {
              setIsButtonClicked((prev) => !prev);
              setIsAccepted((prev) => !prev);
            }}
          />
        ) : (
          <Dialog
            title="참여 거절하기"
            contents="쿵야어드벤처 님의 참여를 거절합니다."
            left="취소"
            right="거절"
            onLeftClick={() => {
              setIsButtonClicked((prev) => !prev);
            }}
            onRightClick={() => {
              setIsButtonClicked((prev) => !prev);
            }}
          />
        ))}
    </>
  );
}
