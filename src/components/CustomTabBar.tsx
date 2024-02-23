import { useLocation } from "react-router-dom";
import { TabBar } from "./TabBar";

// CustomTabBar 컴포넌트 정의
export const CustomTabBar = () => {
  const location = useLocation();
  const showTabBar = ["/meeting-list", "/chat-list", "/profile"].includes(
    location.pathname
  );

  return showTabBar ? <TabBar /> : null;
};
