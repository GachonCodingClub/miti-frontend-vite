import styled from "styled-components";
import { Screen } from "../../components/Screen";

export const PasswordSetScreen = styled(Screen)`
  padding-top: 56px;
  padding-bottom: 112px;
`;

export const TitleFrame = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 24px;
`;

export const Title = styled.span`
  color: var(--grey-grey-800, #2f2a28);

  font-size: 24px;
  font-weight: 500;
  line-height: 30px;
`;

export const SubTitle = styled.span`
  color: var(--grey-grey-500, #767170);
  font-size: 14px;
  letter-spacing: -0.224px;
`;

export const PassWordFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  margin-top: 40px;
  width: 100%;
`;
