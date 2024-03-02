import styled from "styled-components";

const LoadingText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  color: var(--primary-orangered-800, #ff7152);
  font-size: 24px;
  font-weight: 900;
`;

export function InLoading() {
  return <LoadingText>로딩중이에요...</LoadingText>;
}
