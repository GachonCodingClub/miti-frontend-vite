import { useNavigate } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/styles/Icons";

export default function Notice() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="공지사항"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
    </>
  );
}
