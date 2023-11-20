import { useRef } from "react"

const useThrottle = () => {
    const timer = useRef<NodeJS.Timer>()

    const throttling = (callback: () => void, time?: number) => {
        if(timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            callback()
            timer.current = undefined
        }, time || 500);
    }

    return throttling
}

export default useThrottle