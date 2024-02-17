import { Link } from "react-router-dom";
import styled from "styled-components";

export const SettingScreen = styled.div`
  padding: 0 16px;
  padding-top: 56px;
`;

export const SettingButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 16px;
  gap: 7px;
`;

export const SettingButton = styled(Link)`
  padding: 16px 24px;
  font-weight: 500;
  text-decoration: none;
`;

export const LogoutFrame = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  max-width: 36rem;
  bottom: 88px;
  margin: auto;
`;

export const LogoutButton = styled.div`
  color: var(--Grey-grey500, #767170);
  font-size: 14px;
  line-height: 14px;
  letter-spacing: -0.12px;
`;
