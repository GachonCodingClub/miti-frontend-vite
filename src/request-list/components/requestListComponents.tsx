import styled from "styled-components";

export const RequestBox = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: #f2f0ef;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const UserInfo = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
`;

export const UserName = styled.div`
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -2%;
`;

export const UserDescription = styled.span`
  font-size: 14px;
  white-space: pre-wrap;
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
