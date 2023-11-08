import { CSSProperties } from "react"
import styled from "styled-components"
import { globalStyles } from "../../styles/global-styled"

type ProgressProps = {
    percent: number|string
    color: CSSProperties['color']
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    className?: string
    noString?: boolean
}

const Progress = ({ percent, color, width, height, className, noString=false }: ProgressProps) => {
    return <ProgressContainer width={width} height={height} className={className}>
        <ProgressInner percent={percent} color={percent === -1 ? 'red' : color}/>
        {!noString && <ProgressText>
            {
                percent === -1 ? '실패' : (typeof percent === 'string' ? percent : (percent + '%'))
            }
        </ProgressText>}
    </ProgressContainer>
}

export default Progress

const ProgressContainer = styled.div<{width: CSSProperties['width'], height: CSSProperties['height']}>`
    border-radius: 12px;
    background-color: rgba(255,255,255,.3);
    position: relative;
    overflow: hidden;
    ${globalStyles.flex()}
`

const ProgressInner = styled.div<{ percent: number|string, color: CSSProperties['color'] }>`
    height: 100%;
    background-color: ${({ color }) => color};
    width: ${({ percent }) => typeof percent === 'string' ? 0 : percent}%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    transition: width .5s ease-out;
`

const ProgressText = styled.div`
    position: relative;
    z-index: 2;
`