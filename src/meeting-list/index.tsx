import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/getApi";
import { IGroup } from "../model/group";
import { SearchIcon } from "../components/styles/Icons";
import { TopBar } from "../components/TopBar";
import { useLoginGuard } from "../hooks/useLoginGuard";
import {
  CreateMeetingButton,
  MeetingListScreen,
  PageFrame,
  PageNum,
  PrevNextButton,
} from "./components/meetingListComponents";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { SnackBar } from "../components/styles/Button";
import { ROUTES } from "../routes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { NewAlert, SnackBarAtom } from "../atoms";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { PushNotifications } from "@capacitor/push-notifications";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { InLoading } from "../components/InLoading";

export default function MeetingList() {
  const [token, setToken] = useState<string | null>(null);
  const loginToken = useLocalStorageToken();

  const setNewAlert = useSetRecoilState(NewAlert);

  const addListeners = async () => {
    await PushNotifications.addListener("registration", (token) => {
      console.info("Registration token: ", token.value);
      setToken(token.value);
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error: ", err.error);
    });

    await PushNotifications.addListener("pushNotificationReceived", () => {
      setNewAlert(true);
      setTimeout(() => {
        setNewAlert(false);
      }, 1500);
    });

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log(
          "Push notification action performed",
          notification.actionId,
          notification.inputValue
        );
      }
    );
  };

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      throw new Error("User denied permissions!");
    }

    await PushNotifications.register();
  };

  const putToken = (tokenValue: string | null) => {
    const headers = getHeaders(loginToken);
    const bodyData = {
      token: tokenValue,
    };

    const PutURL = `${import.meta.env.VITE_BASE_URL}/notification/token`;

    fetch(PutURL, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(bodyData),
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류: ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (token && loginToken) {
      putToken(token); // 두 토큰이 모두 유효할 때 PUT 요청 실행
    }
  }, [token, loginToken]); // token과 loginToken 상태에 의존

  useLoginGuard();
  const isRoomDeleted = useRecoilValue(SnackBarAtom);
  const navigate = useNavigate();

  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
  }, []);

  const [meetings, setMeetings] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(() => {
    const storedPage = sessionStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage, 10) : 0; // 저장된 페이지 없으면 0부터 시작
  });
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const res = await getApi({
          link: `/groups?page=${page}&size=7&sort=meetDate`,
        });
        const data = await res.json();
        setMeetings(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("미팅 불러오기 실패:", error);
      } finally {
        addListeners();
        registerNotifications();
        setLoading(false);
      }
    };

    fetchMeetings();
    sessionStorage.setItem("currentPage", page.toString());
  }, [page]);

  const loadPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const renderPageNumbers = () => {
    // totalPages 만큼의 배열을 생성하고, 각 요소에 페이지 번호 부여
    return [...Array(totalPages).keys()].map((pageNumber) => (
      <PageNum
        key={pageNumber}
        isActive={pageNumber === page}
        onClick={() => loadPage(pageNumber)}
      >
        {pageNumber + 1}
      </PageNum>
    ));
  };

  return (
    <>
      <TopBar
        title="모집중인 미팅"
        rightIcon={<SearchIcon />}
        onRightIconClick={() => {
          navigate(`/search`);
        }}
      />
      <MeetingListScreen>
        <CreateMeetingButton
          onClick={() => {
            navigate(`${ROUTES.CREATE_MEETING}`);
          }}
        >
          +
        </CreateMeetingButton>
        <div className="divide-y-[1px]">
          {meetings?.map((meeting, index) => {
            const isLeaderForGroup =
              decodedToken?.sub === meeting?.leaderUserSummaryDto.userId;
            return (
              <MeetingBoxComponent
                onClick={() => {
                  navigate(`/meeting-list/${meeting?.id}`);
                }}
                meeting={meeting}
                key={index}
                isLeader={isLeaderForGroup}
              />
            );
          })}
        </div>
        {loading && <InLoading />}
        {/* 미팅 삭제하기를 통해 미팅리스트로 이동했을 경우 */}
        {isRoomDeleted && (
          <SnackBar text="미팅을 나왔어요." onClick={() => {}} />
        )}

        {/* 페이징 버튼 */}
        <PageFrame>
          <PrevNextButton
            onClick={() => loadPage(page - 1)}
            disabled={page === 0}
          >
            이전
          </PrevNextButton>
          {renderPageNumbers()}
          <PrevNextButton
            onClick={() => loadPage(page + 1)}
            disabled={page === totalPages - 1}
          >
            다음
          </PrevNextButton>
        </PageFrame>
      </MeetingListScreen>
    </>
  );
}
