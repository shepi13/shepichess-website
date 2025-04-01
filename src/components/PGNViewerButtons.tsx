interface PGNButtonSettings {
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
}

interface PGNViewerButtonProps {
    moveButtons: Array<PGNButtonSettings>, 
    onFlipBoard: () => void,
}

export default function PGNViewerButtons({moveButtons, onFlipBoard}: PGNViewerButtonProps) {
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
            <div className="flex justify-between w-2/3">{
                moveButtons.map((button, i) => (
                    <button 
                        key={`moveButton_${i}`}
                        className="cursor-pointer text-xl hover:text-secondary-dark ring-1 px-2 md:rounded-2xl" 
                        onClick={button.onClick} 
                        disabled={button.disabled}
                    >
                        {button.children}
                    </button>
                ))
            }</div>
            <button className="cursor-pointer text-large hover:text-secondary-dark" onClick={onFlipBoard}>Flip Board</button>
        </div>
    );
}