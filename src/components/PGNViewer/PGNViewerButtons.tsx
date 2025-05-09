import { PGNButtonSettings } from "@/lib/types/types";

/**
 * Properties that can be passed to PGNViewerButtons component.
 * Includes buttons to show and styling info. Styling is set to a reasonable
 * default if not provided.
 *
 * @property leftButtons - Array of buttons to display (left-justified)
 * @property rightButtons - Array of buttons to display (right-justified)
 * @property leftButtonStyle - Tailwind classes for leftButtons
 * @property rightButtonStyle - Tailwind classes for rightButtons
 * @property leftContainerStyle - Tailwind classes for flex container holding leftButtons
 * @property rightContainer - Tailwind classes for flex container holding rightButtons
 */
export interface PGNViewerButtonProps {
  leftButtons?: Array<PGNButtonSettings>;
  rightButtons?: Array<PGNButtonSettings>;
  leftButtonStyle?: string;
  rightButtonStyle?: string;
  leftContainerStyle?: string;
  rightContainerStyle?: string;
}

const defaultButtonStyle =
  "text-lg md:text-xl hover:text-secondary-dark ring-1 px-1 sm:px-2 md:rounded-2xl";
const defaultFlipButtonStyle =
  "text-sm sm:text-base md:text-lg hover:text-secondary-dark ";
const defaultFlexStyle = "justify-between items-center ";

/**
 * Component that holds buttons for interacting with a chessboard.
 *
 * @param props - PGN button props to describe which buttons to show along with custom styles
 * @returns React Element containing specified buttons
 */
export function PGNViewerButtons({
  leftButtons = [],
  rightButtons = [],
  leftButtonStyle = defaultButtonStyle,
  rightButtonStyle = defaultFlipButtonStyle,
  leftContainerStyle = defaultFlexStyle,
  rightContainerStyle = defaultFlexStyle,
}: PGNViewerButtonProps) {
  const getButtons = (left: boolean) => {
    // eslint-disable-next-line react/display-name
    return (button: PGNButtonSettings, i: number) => {
      const buttonStyle = left ? leftButtonStyle : rightButtonStyle;
      return (
        <button
          key={`moveButton_${i}`}
          className={"cursor-pointer " + buttonStyle}
          onClick={button.onClick}
          disabled={!!button.disabled}
        >
          {button.children}
        </button>
      );
    };
  };

  return (
    <div className="flex justify-between p-1 lg:p-5 pr-0 w-full">
      <div className={"flex " + leftContainerStyle}>
        {leftButtons.map(getButtons(true))}
      </div>
      <div className={"flex " + rightContainerStyle}>
        {rightButtons.map(getButtons(false))}
      </div>
    </div>
  );
}
