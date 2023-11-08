import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { ButtonActiveBackgroundColor, ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import { AddZeroFunc } from "../../../../Functions/GlobalFunctions"

type TimeSelectProps = {
    defaultValue?: number
    onChange?: (val: string) => void
    visible: boolean
    isHour: boolean
}

const nodeHeight = 40

const TimeSelect = ({ defaultValue, onChange, visible, isHour }: TimeSelectProps) => {
    const [selected, setSelected] = useState(defaultValue || 0)
    const selectedRef = useRef(selected)
    const startTimeScrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(startTimeScrollContainerRef.current) {
            startTimeScrollContainerRef.current.scrollTo({
                top: selected * nodeHeight,
                behavior: 'smooth'
            })
        }
        if(selected !== selectedRef.current) {
            if(onChange) onChange(AddZeroFunc(selected).toString())
        }
        selectedRef.current = selected
    },[selected])

    useEffect(() => {
        if(defaultValue || defaultValue === 0) {
            selectedRef.current = defaultValue
            setSelected(defaultValue)
        }
    },[defaultValue])

    return <Container visible={visible} ref={startTimeScrollContainerRef}>
        {Array.from({ length: isHour ? 24 : 60 }).map((_, ind) => <Node key={ind} onClick={(e) => {
            setSelected(ind)
        }} selected={selected === ind}>
            {AddZeroFunc(ind)}
        </Node>)}
    </Container>
}

export default TimeSelect

const Container = styled.div<{visible: boolean}>`
    height: ${({visible}) => visible ? (nodeHeight * 5 + 2) : 0}px;
    transition: height .25s ease-out;
    width: 80px;
    overflow-y: ${({visible}) => visible ? 'scroll' : 'hidden'};
    visibility: ${({visible}) => visible ? 'visible' : 'hidden'};
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    position: absolute;
    left: 0;
    top: 110%;
    border-radius: 12px;
    border: 1px solid ${ContentsBorderColor};
    ${({visible}) => !visible && {
        border: 'none'
    }}
`

const PaddingNode = styled.div`
    height: ${nodeHeight * 2}px;
    scroll-snap-align: start;
`

const Node = styled.div<{selected: boolean}>`
    ${globalStyles.flex()}
    height: ${nodeHeight}px;
    scroll-snap-align: start;
    cursor: pointer;
    background-color: ${({selected}) => selected ? ButtonActiveBackgroundColor : 'transparent'};
    &:not(:first-child) {
        border-top: 1px solid ${ContentsBorderColor};
    }
    &:hover {
        background-color: ${ButtonActiveBackgroundColor};
    }
`