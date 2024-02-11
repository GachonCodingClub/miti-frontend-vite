import styled from "styled-components";
import { Screen } from "../../components/Screen";

export const RequestListScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 64px;
`;

export const RequestBox = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: #f2f0ef;
`;

export const UserInfo = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const UserName = styled.div`
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -2%;
`;

export const UserDetail = styled.div`
  display: flex;
  gap: 8px;
  span {
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -1.6%;
    color: #767170;
  }
`;