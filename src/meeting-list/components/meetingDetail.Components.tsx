import styled from "styled-components";
import { Screen } from "../../components/styles/Screen";
import { FixedButtonBox } from "../../components/styles/Button";

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

  span:last-of-type {
    white-space: break-spaces;
  }
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
`;

export const MemberInfo = styled(DetailMember)``;

export const MemberDetail = styled.div`
  display: flex;
  margin-bottom: 16px;
  padding-bottom: 8px;
  gap: 8px;
  span {
    font-size: 14px;
    font-weight: 400;
    color: #767170;
  }
  border-bottom: 1px solid #f2f0ef;
  white-space: nowrap;
`;

export const JoinButtonBox = styled(FixedButtonBox)`
  padding: 16px 16px 48px 16px;
  box-shadow: 0px -2px 4px 0px rgba(18, 22, 26, 0.04);
`;
