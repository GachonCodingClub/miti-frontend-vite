import React from "react";
import { TopBar } from "../../components/TopBar";
import { TabBar } from "../../components/TabBar";
import { PaddingScreen } from "../../components/styles/Screen";

interface ChattingListLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const ChattingListLayout: React.FC<ChattingListLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <>
      <TopBar title={title} />
      <PaddingScreen>{children}</PaddingScreen>
      <TabBar />
    </>
  );
};

export default ChattingListLayout;
