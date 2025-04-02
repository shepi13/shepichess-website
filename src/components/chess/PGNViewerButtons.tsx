interface PGNButtonSettings {
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
}

interface PGNViewerButtonProps {
    leftButtons?: Array<PGNButtonSettings>, 
    rightButtons?: Array<PGNButtonSettings>, 
    leftButtonStyle? : string,
    rightButtonStyle?: string,
    leftContainerStyle?: string,
    rightContainerStyle?: string,
}


const defaultButtonStyle = "text-lg md:text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl";
const defaultFlipButtonStyle = "text-base md:text-lg hover:text-secondary-dark "
const defaultFlexStyle = "justify-between "

export default function PGNViewerButtons({
    leftButtons = [], 
    rightButtons = [], 
    leftButtonStyle = defaultButtonStyle,
    rightButtonStyle = defaultFlipButtonStyle,
    leftContainerStyle = defaultFlexStyle, 
    rightContainerStyle = defaultFlexStyle,
}: PGNViewerButtonProps) {
    /**
     * React component that renders buttons in the format used by PGNViewer.
     * 
     * Has a flip board button, as well as nav buttons with functionality decided by parent
     * 
     * @param moveButtons - The onClick handlers, disabled flag, and html children for each nav button
     * @param onFlipBoard - The function to flip the board
     */

    function getButtons(left: boolean) {
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
    }

    return (
        <div className="flex justify-between p-1 lg:p-5 pr-0">
            <div className={"flex " + leftContainerStyle}>{
                leftButtons.map(getButtons(true))
            }</div>
            <div className={"flex " + rightContainerStyle}>{
                rightButtons.map(getButtons(false))
            }</div>
        </div>
    );
}