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

export const MyHeightSheet = ({
  show,
  onClose,
  onSelected,
  title,
  rangeStart,
}: SheetProps) => {
  const getOptionValue = (value: number): string => {
    if (value >= 120 && value <= 129) return "A";
    if (value >= 130 && value <= 139) return "B";
    if (value >= 140 && value <= 149) return "C";
    if (value >= 150 && value <= 159) return "D";
    if (value >= 160 && value <= 169) return "E";
    if (value >= 170 && value <= 179) return "F";
    if (value >= 180 && value <= 189) return "G";
    if (value >= 190 && value <= 199) return "H";
    if (value >= 200 && value <= 209) return "I";
    if (value >= 210 && value <= 219) return "J";
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
