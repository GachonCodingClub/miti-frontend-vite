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
  const getOptionValue = (value: number): string => {
    if (value >= 30 && value <= 39) return "A";
    if (value >= 40 && value <= 49) return "B";
    if (value >= 50 && value <= 59) return "C";
    if (value >= 60 && value <= 69) return "D";
    if (value >= 70 && value <= 79) return "E";
    if (value >= 80 && value <= 89) return "F";
    if (value >= 90 && value <= 99) return "G";
    if (value >= 100 && value <= 109) return "H";
    if (value >= 110 && value <= 119) return "I";
    if (value >= 120 && value <= 129) return "J";
    return "HIDDEN";
  };

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
                              onSelected(getOptionValue(leftValue))
                            }
                          >
                            {`${leftValue} ~ ${leftValue + 9}`}
                          </SheetText>
                          <SheetText
                            onClick={() =>
                              onSelected(getOptionValue(rightValue))
                            }
                          >
                            {`${rightValue} ~ ${rightValue + 9}`}
                          </SheetText>
                        </SheetElement>
                      </SheetBodyRow>
                    );
                  } else {
                    return (
                      <SheetBodyRow key="private">
                        <SheetElement>
                          <SheetText onClick={() => onSelected("HIDDEN")}>
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
