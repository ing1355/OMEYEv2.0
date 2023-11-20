import { CSSProperties } from "react"
import styled from "styled-components"
import { globalStyles } from "../../styles/global-styled"

type ProgressProps = {
    percent: number | string
    color: CSSProperties['color']
    className?: string
    noString?: boolean
    outString?: boolean
    icon?: string
}

const Progress = ({ percent, color, className, noString = false, outString, icon }: ProgressProps) => {
    return <Container className={className}>
        {icon && <IconContainer>
            <Icon src={icon}/>
        </IconContainer>}
        <ProgressContainer>
            <ProgressInner percent={percent} color={percent === -1 ? 'red' : color} />
            {(!noString && !outString) ? <ProgressText>
                {
                    percent === -1 ? '실패' : (typeof percent === 'string' ? percent : (percent + '%'))
                }
            </ProgressText> : <>
            &nbsp;</>}
        </ProgressContainer>
        {outString && <OuterText>
            {
                percent === -1 ? '실패' : (typeof percent === 'string' ? percent : (percent + '%'))
            }
        </OuterText>}
    </Container>
}

export default Progress

const Container = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    `
    
const ProgressContainer = styled.div`
    flex: 1;
    background-color: rgba(255,255,255,.3);
    ${globalStyles.flex()}
    border-radius: 12px;
    overflow: hidden;
    height: 100%;
    position: relative;
`

const OuterText = styled.div`
    ${globalStyles.flex({alignItems:'flex-start'})}
    flex: 0 0 40px;
    height: 100%;
`

const ProgressInner = styled.div<{ percent: number | string, color: CSSProperties['color'] }>`
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

const IconContainer = styled.div`
    ${globalStyles.flex()}
    flex: 0 0 18px;
`

const Icon = styled.img`
    width: 100%;
    height: 100%;
`