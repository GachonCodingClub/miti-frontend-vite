import styled from "styled-components";
import { Screen } from "../../components/Screen";
import { FixedButtonBox } from "../../components/Button";

export const DetailScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 112px;
`;

export const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
`;

export const DetailTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 24px;
`;

export const DetailContents = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const DetailInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DetailInfo = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;
  span {
    color: #2f2a28;
  }
`;

export const DetailMember = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MemberInfo = styled(DetailMember)``;

export const MemberDetail = styled.div`
  display: flex;
  gap: 8px;
  span {
    font-size: 14px;
    font-weight: 400;
    color: #767170;
  }
`;

export const JoinButtonBox = styled(FixedButtonBox)`
  padding: 16px 16px 24px 16px;
  box-shadow: 0px -2px 4px 0px rgba(18, 22, 26, 0.04);
`;
