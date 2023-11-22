import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../styles/global-styled"
import { CSSProperties } from "react"

type SliderProps = {
    min: number
    max: number
    value: number
    onChange: (val: number) => void
    step?: number
}

const Slider = ({ min, max, value, onChange, step }: SliderProps) => {
    const tick = 100 / (max - min)
    const percent = value === max ? 100 : (tick * (value - 1))

    return <Container>
        <SliderContainer>
            <SliderRail />
            <SliderFillTrack fill={
                `${percent}%`
            } />
            <RangeInput
                type={'range'}
                value={value}
                step={step || 1}
                min={min}
                max={max}
                onChange={e => {
                    const newValue = parseInt(e.target.value);
                    onChange(newValue);
                }}
            />
        </SliderContainer>
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