import { useState } from "react";

export default function useToggle(initialVal: boolean) : [boolean, () => void] {
    const [flipped, setFlipped] = useState(initialVal)
    return [flipped, () => {setFlipped(prev => !prev)}];
}