interface PGNButtonSettings {
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
}

interface PGNViewerButtonProps {
    moveButtons: Array<PGNButtonSettings>, 
    onFlipBoard: () => void,
    moveButtonStyles? : string,
    flipButtonStyles? : string,
    moveButtonContainerStyles?: string,
}


const defaultMoveButtonStyle = "cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl";
const defaultFlipButtonStyle = "cursor-pointer text-large hover:text-secondary-dark "
const defaultMoveButtonContainerStyle = "justify-between "

export default function PGNViewerButtons({
    moveButtons, 
    onFlipBoard, 
    moveButtonStyles = defaultMoveButtonStyle, 
    flipButtonStyles = defaultFlipButtonStyle, 
    moveButtonContainerStyles = defaultMoveButtonContainerStyle,
}: PGNViewerButtonProps) {
    /**
     * React component that renders buttons in the format used by PGNViewer.
     * 
     * Has a flip board button, as well as nav buttons with functionality decided by parent
     * 
     * @param moveButtons - The onClick handlers, disabled flag, and html children for each nav button
     * @param onFlipBoard - The function to flip the board
     */

    return (
        <div className="flex justify-between p-1 lg:p-5 pr-0">
            <div className={"flex w-2/3 " + moveButtonContainerStyles}>{
                moveButtons.map((button, i) => (
                    <button 
                        key={`moveButton_${i}`}
                        className={"cursor-pointer " + moveButtonStyles}
                        onClick={button.onClick} 
                        disabled={button.disabled}
                    >
                        {button.children}
                    </button>
                ))
            }</div>
            <button className={"cursor-pointer " + flipButtonStyles} onClick={onFlipBoard}>Flip Board</button>
        </div>
    );
}