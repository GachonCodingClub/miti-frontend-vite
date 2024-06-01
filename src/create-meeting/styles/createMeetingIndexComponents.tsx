import styled from "styled-components";

export const InputWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  margin-top: 114px;
`;

export const TitleArea = styled.textarea`
  width: 100%;
  color: black;

  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.32px;
  resize: none;
  &::placeholder {
    color: var(--grey-grey-300, #c9c5c5);
  }
`;

export const DescriptionArea = styled(TitleArea)`
  height: 96px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.224px;
  border-bottom: 1px solid #c9c5c5;
`;
