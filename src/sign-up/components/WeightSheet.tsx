import {
  Overlay,
  HeightSheet,
  SheetAnimation,
  SheetTitleFrame,
  SheetTitle,
  SheetXIcon,
  SheetBodyFrame,
  SheetBodyRow,
  SheetElement,
  SheetText,
} from "../styles/detailComponents";
import { XIcon } from "../../components/styles/Icons";

interface SheetProps {
  show: boolean;
  onClose: () => void;
  onSelected: (selected: string) => void;
  title: string;
  rangeStart: number;
  rangeEnd: number;
}

export const MyWeightSheet = ({
  show,
  onClose,
  onSelected,
  title,
  rangeStart,
}: SheetProps) => {
  return (
    <>
      {show && (
        <>
          <Overlay />
          <HeightSheet
            initial="hidden"
            animate={show ? "visible" : "hidden"}
            variants={SheetAnimation}
          >
            <SheetTitleFrame>
              <SheetTitle>{title}</SheetTitle>
              <SheetXIcon onClick={onClose}>
                <XIcon />
              </SheetXIcon>
            </SheetTitleFrame>

            <SheetBodyFrame>
              {Array(6)
                .fill(undefined)
                .map((_, index) => {
                  if (index < 5) {
                    const leftValue = rangeStart + index * 20;
                    const rightValue = rangeStart + 10 + index * 20;
                    return (
                      <SheetBodyRow key={leftValue}>
                        <SheetElement>
                          <SheetText
                            onClick={() =>
                              onSelected(`${leftValue}~${leftValue + 9}`)
                            }
                          >
                            {`${leftValue}~${leftValue + 9}`}
                          </SheetText>
                          <SheetText
                            onClick={() =>
                              onSelected(`${rightValue}~${rightValue + 9}`)
                            }
                          >
                            {`${rightValue}~${rightValue + 9}`}
                          </SheetText>
                        </SheetElement>
                      </SheetBodyRow>
                    );
                  } else {
                    return (
                      <SheetBodyRow key="private">
                        <SheetElement>
                          <SheetText onClick={() => onSelected("비공개")}>
                            비공개
                          </SheetText>
                        </SheetElement>
                      </SheetBodyRow>
                    );
                  }
                })}
            </SheetBodyFrame>
          </HeightSheet>
        </>
      )}
    </>
  );
};
