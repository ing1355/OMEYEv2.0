import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"

type TimeSelectProps = {
    defaultValue?: number
    onChange?: (val: number) => void
}

const nodeHeight = 40

const TimeSelect = ({ defaultValue, onChange }: TimeSelectProps) => {
    const [selected, setSelected] = useState(0)
    const selectedRef = useRef(selected)
    const startTimeScrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(startTimeScrollContainerRef.current) {
            startTimeScrollContainerRef.current?.scrollTo({
                top: selected * nodeHeight,
                behavior: 'smooth'
            })
        }
        if(selected !== selectedRef.current) {
            if(onChange) onChange(selected)
        }
    },[selected])

    return <Container onScroll={() => {

    }} ref={startTimeScrollContainerRef}>
        {Array.from({ length: 24 }).map((_, ind) => <Node key={ind} onClick={() => {
            setSelected(ind)
        }}>
            {ind}
        </Node>)}
        <PaddingNode/>
    </Container>
}

export default TimeSelect

const Container = styled.div`
    height: 300px;
    width: 100px;
    overflow-y: scroll;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory
`

const PaddingNode = styled.div`
    height: ${nodeHeight * 2}px;
    scroll-snap-align: start;
    border: 1px solid white;
`

const Node = styled.div`
    ${globalStyles.flex()}
    height: ${nodeHeight}px;
    border: 1px solid white;
    scroll-snap-align: start;
    cursor: pointer;
    &:nth-child(2n) {
        border-top: none;
        border-bottom: none;
    }
    &:last-child {
        border-bottom: none;
    }
`