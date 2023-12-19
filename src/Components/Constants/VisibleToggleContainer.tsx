import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import styled from "styled-components"

type VisibleToggleContainerProps = PropsWithChildren & {
    visible: boolean
    setVisible: (visible: boolean) => void
    className?: string
    callback?: () => void
    otherRef?: React.RefObject<any>
}

const VisibleToggleContainer = ({
    visible, setVisible, className, children, callback, otherRef
}: VisibleToggleContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const visibleRef = useRef<(e: MouseEvent) => void>()
    const callbackRef = useRef<(e: KeyboardEvent) => void>()

    const close = () => {
        setVisible(false)
    }

    const escCallback = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (close) close()
        }
    }

    useEffect(() => {
        if (visible) {
            if (callbackRef.current) document.removeEventListener('keydown', callbackRef.current)
            callbackRef.current = escCallback
            if (callbackRef.current) document.addEventListener('keydown', callbackRef.current)
        } else {
            if (callbackRef.current) document.removeEventListener('keydown', callbackRef.current)
        }
    }, [visible, escCallback])

    const blurClickCallback = useCallback((e: MouseEvent) => {
        if (
            (otherRef && otherRef.current && !otherRef.current.contains(e.target as Node)) ||
            containerRef.current && !containerRef.current.contains(e.target as Node)
        ) {
            e.preventDefault()
            e.stopPropagation()
            if (otherRef && otherRef.current) {
                if (otherRef.current && !otherRef.current.contains(e.target as Node)) {
                    setVisible(false);
                    if (callback) callback()
                }
            } else if (containerRef.current === e.target) {
                setVisible(false);
                if (callback) callback()
            } else {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setVisible(false);
                    if (callback) callback()
                }
            }
        }
    }, [visible, otherRef])

    useEffect(() => {
        if (visible) {
            if (visibleRef.current) document.removeEventListener('click', visibleRef.current)
            document.addEventListener('click', blurClickCallback)
            visibleRef.current = blurClickCallback
        } else {
            if (visibleRef.current) document.removeEventListener('click', visibleRef.current)
            visibleRef.current = undefined
        }
    }, [visible, otherRef])

    return <Container ref={containerRef} className={className} onClick={(e) => {
        if (e.target === containerRef.current && !visibleRef.current) setVisible(true)
        else if (e.target === containerRef.current) setVisible(false)
    }}>
        {children}
    </Container>
}

export default VisibleToggleContainer

const Container = styled.div`
`