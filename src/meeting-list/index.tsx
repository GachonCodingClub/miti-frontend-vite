import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/getApi";
import { IGroup } from "../model/group";
import { RefreshIcon, SearchIcon } from "../components/styles/Icons";
import { TopBar } from "../components/TopBar";
import { useLoginGuard } from "../hooks/useLoginGuard";
import {
  CreateMeetingButton,
  MeetingListScreen,
  PageFrame,
  PageNum,
  PrevNextButton,
  RefreshButton,
} from "./components/meetingListComponents";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { SnackBar } from "../components/styles/Button";
import { ROUTES } from "../routes";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { NewAlert, isNotificationinitialized, SnackBarAtom } from "../atoms";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { PushNotifications } from "@capacitor/push-notifications";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { InLoading } from "../components/InLoading";
import { useQuery } from "react-query";
import { motion } from "framer-motion";

export default function MeetingList() {
  const [token, setToken] = useState<string | null>(null);
  const loginToken = useLocalStorageToken();

  const [isNotificationInitialized, setNotificationInitialized] =
    useRecoilState(isNotificationinitialized);

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
      // console.log("노티피케이션", JSON.stringify(notification));
      setTimeout(() => {
        setNewAlert(false);
      }, 1500);
    });

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        if (
          window.location.toString() !==
            `/meeting-chat-room/${notification.notification?.data?.groupId}` &&
          notification.actionId === "tap" &&
          notification.notification?.data?.groupId
        ) {
          navigate(
            `/meeting-chat-room/${notification.notification?.data?.groupId}`
          );
        }
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

  const { data, refetch } = useQuery(
    ["group", page],
    async () => {
      const res = await getApi({
        link: `/groups?page=${page}&size=7&sort=meetDate`,
      });
      if (res.status === 401) {
        alert("서버 오류가 발생했어요.");
        localStorage.removeItem("token");
        navigate(`${ROUTES.SIGN_IN}`);
        return;
      }
      return res.json();
    },
    {
      keepPreviousData: true, // 이전 페이지 데이터 유지
      staleTime: 60000, // 1분 동안 새로고침하지 않음
      onSuccess: () => {
        // 알림 리스너 1번만 호출
        if (!isNotificationInitialized) {
          addListeners();
          registerNotifications();
          setNotificationInitialized(true);
        }
      },
      onSettled: () => {
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    if (data) {
      setMeetings(data.content);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const loadPage = (pageNumber: number) => {
    setPage(pageNumber);
    sessionStorage.setItem("currentPage", pageNumber.toString());
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
        <RefreshButton
          as={motion.div}
          onClick={() => refetch()}
          whileTap={{ rotate: 360 * 2 }}
          transition={{ duration: 1.5 }}
        >
          <RefreshIcon />
        </RefreshButton>

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
