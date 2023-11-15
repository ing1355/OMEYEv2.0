import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../styles/global-styled"
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"

type SliderProps = {
    min: number
    max: number
    value: number
    onChange: (val: number) => void
    step?: number
}

const Slider = ({ min, max, value, onChange, step }: SliderProps) => {
    const [currValue, setCurrValue] = useState(value);
    // const [clicked, setClicked] = useState(false)

    // const mouseUpCallback = useCallback(() => {
    //     setClicked(false)
    // }, [])

    // const mouseMoveCallback = useCallback((e: MouseEvent) => {
    //     const ratio = (max-min+1) / containerRef.current!.clientWidth
    //     const distance = (e.screenX - mouseX.current) * ratio
    //     console.debug('distance : ' ,distance, Math.floor(valueRef.current + distance > max ? max : (valueRef.current + distance < min ? min : valueRef.current + distance)))
    //     setValue(_ => _ + distance > max ? max : (_ + distance < min ? min : _ + distance))
    //     mouseX.current = e.screenX
    // }, [])

    // useEffect(() => {
    //     if (clicked) {
    //         document.addEventListener('mouseup', mouseUpCallback)
    //         document.addEventListener('mousemove', mouseMoveCallback)
    //     } else {
    //         document.removeEventListener('mouseup', mouseUpCallback)
    //         document.removeEventListener('mousemove', mouseMoveCallback)
    //     }
    // }, [clicked])

    useEffect(() => {
        setCurrValue(value)
    },[value])

    return <Container>
        <SliderContainer>
            <SliderRail />
            <SliderFillTrack fill={
                `${((currValue / (max - min)) * 100 - 1) > 100 ? 100 : (currValue / (max - min)) * 100 - 1}%`
            } />
            <RangeInput
                type={'range'}
                value={value}
                min={min}
                max={max}
                onChange={e => {
                    const newValue = parseInt(e.target.value);
                    setCurrValue(newValue);
                    onChange(newValue);
                }}
            />
        </SliderContainer>
        {/* <MinNumber>
            {min}
        </MinNumber>
        <RangeInput type="range" min={min} max={max} step={step || 1} value={value} onChange={(e) => {
            onChange(Number(e.target.value))
        }}/> */}
        {/* <InnerContainer ref={containerRef}>
            <Background value={_value}>
                <Circle onMouseDown={(e) => {
                    setClicked(true)
                    mouseX.current = e.screenX
                }} />
            </Background>
        </InnerContainer> */}
        {/* <MaxNumber>
            {max}
        </MaxNumber> */}
    </Container>
}

export default Slider

const containerHeight = 12

const Container = styled.div`
    width: 300px;
    height: ${containerHeight}px;
    ${globalStyles.flex()}
    position: relative;
`

const RangeInput = styled.input`
    width: 100%;
    height: ${containerHeight}px;
    -webkit-appearance: none;
    margin: 0;
    background-color: transparent;
    &:active {
        cursor: grabbing;
      }
    &:focus {
        outline: none;
    }
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: white;
        width: ${containerHeight*2}px;
        height: ${containerHeight*2}px;
        border-radius: 50%;
        z-index: 1;
        position: relative;
        cursor: pointer;
        top: 50%;
    };
`

const InnerContainer = styled.div`
    height: 100%;
    background-color: ${ContentsActivateColor};
    border-radius: 8px;
    flex: 1;
    position: relative;
`

const MinNumber = styled.div`
    font-size: 1.1rem;
    position: absolute;
    top: 130%;
    left: 8px;
    text-align: center;
`

const MaxNumber = styled.div`
    font-size: 1.1rem;
    position: absolute;
    top: 130%;
    right: 0px;
    text-align: center;
`

const Circle = styled.div`
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    height: ${containerHeight + 10}px;
    width: ${containerHeight + 10}px;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
`

const Background = styled.div<{ value: number }>`
    background-color: ${ContentsBorderColor};
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    max-width: 100%;
    border-radius: 8px;
    width: calc(${({ value }) => value}% + 10px);
    transition: width .1s ease;
`

// left: ${({ value }) => value}%;
//     transition: left .1s ease;

const SliderContainer = styled.div`
  width: 100%;
  height: ${containerHeight}px;
  position: relative;
`;

const SliderRail = styled.div`
  width: 99%;
  height: ${containerHeight}px;
  border-radius: 6px;
  background-color: ${ContentsBorderColor};
  position: absolute;
`;

const SliderFillTrack = styled.div<{ fill: CSSProperties['width'] }>`
  width: ${props => props.fill};
  height: ${containerHeight}px;
  border-radius: 6px;
  background-color: ${ContentsActivateColor};
  position: absolute;
`;