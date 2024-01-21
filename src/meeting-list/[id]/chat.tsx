import { useNavigate } from "react-router-dom";
import { ArrowbackIcon } from "../../components/Icons";
import { TopBar } from "../../components/TopBar";
import { Screen } from "../../components/Screen";

export default function Chat() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="서초구에서 술 드실분"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <Screen></Screen>
    </>
  );
}
