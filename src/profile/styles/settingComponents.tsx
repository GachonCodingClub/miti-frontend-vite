import { Link } from "react-router-dom";
import styled from "styled-components";

export const SettingScreen = styled.div`
  padding: 0 16px;
  padding-top: 56px;
`;

export const SettingButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 7px;
`;

export const SettingButton = styled(Link)`
  padding: 16px 24px;
  font-weight: 500;
  color: #000000;
  text-decoration: none;
`;
