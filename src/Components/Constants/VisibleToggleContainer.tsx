import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import styled from "styled-components"

type VisibleToggleContainerProps = PropsWithChildren & {
    visible: boolean
    setVisible: (visible: boolean) => void
    className?: string
    callback?: () => void
}

const VisibleToggleContainer = ({
    visible, setVisible, className, children, callback
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
            containerRef.current &&
            !containerRef.current.contains(e.target as Node)
        ) {
            e.preventDefault()
            e.stopPropagation()
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setVisible(false);
                if(callback) callback()
            }
        }
    }, [visible])

    useEffect(() => {
        if (visible) {
            document.addEventListener('mousedown', blurClickCallback)
            visibleRef.current = blurClickCallback
        } else {
            if(visibleRef.current) document.removeEventListener('mousedown', visibleRef.current)
            visibleRef.current = undefined
        }
    }, [visible])

    return <Container ref={containerRef} className={className}>
        {children}
    </Container>
}

export default VisibleToggleContainer

const Container = styled.div`
`