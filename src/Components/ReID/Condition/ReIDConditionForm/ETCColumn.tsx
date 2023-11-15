import styled from "styled-components"
import { ContentsDisableColor, InputBackgroundColor, InputTextColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import { useRecoilState, useRecoilValue } from "recoil"
import { conditionETCData, conditionIsRealTimeData, conditionRankData } from "../../../../Model/ConditionDataModel"
import { useCallback, useEffect, useRef, useState } from "react"
import Input from "../../../Constants/Input"
import Button from "../../../Constants/Button"
import { ConditionDataFormColumnTitleHeight } from "../../ConstantsValues"
import conditionDataAddIcon from '../../../../assets/img/conditionDataAddIcon.png'
import conditionDataAddHoverIcon from '../../../../assets/img/conditionDataAddHoverIcon.png'
import conditionDataMinusIcon from '../../../../assets/img/conditionDataMinusIcon.png'
import conditionDataMinusHoverIcon from '../../../../assets/img/conditionDataMinusHoverIcon.png'
import rankIcon from '../../../../assets/img/rankIcon.png'

const RankBtn = ({ callback, hoverIcon, icon }: {
    callback: () => void
    hoverIcon: string
    icon: string
}) => {
    const [isHover, setIsHover] = useState(false)
    const isRealTime = useRecoilValue(conditionIsRealTimeData)
    const timer1 = useRef<NodeJS.Timeout>()
    const timer2 = useRef<NodeJS.Timer>()

    const onLongClickProgress = (duration: number, callback: Function) => {
        const _callback = () => {
            timer2.current = setInterval(() => {
                callback()
            }, 50)
        }
        timer1.current = setTimeout(_callback, duration);
        document.addEventListener('mouseup', mouseUpCallback, {
            once: true
        });
    }

    const mouseUpCallback = useCallback(() => {
        clearTimeout(timer1.current)
        clearInterval(timer2.current)
    }, [])

    return <RankInputButton
        disabled={isRealTime}
        onMouseDown={(e) => {
            if(!isRealTime) {
                callback()
                onLongClickProgress(400, callback)
            }
        }}
        onMouseEnter={() => {
            if(!isRealTime) {
                setIsHover(true)
            }
        }}
        onMouseLeave={() => {
            if(!isRealTime) {
                setIsHover(false)
            }
        }}
        icon={isHover ? hoverIcon : icon}
    />
}

const RankComponent = () => {
    const [rank, setRank] = useRecoilState(conditionRankData)
    const isRealTime = useRecoilValue(conditionIsRealTimeData)

    const rankUpCallback = useCallback(() => {
        setRank(_ => _ === 99 ? _ : _ + 1)
    }, [])
    const rankDownCallback = useCallback(() => {
        setRank(_ => _ === 0 ? _ : _ - 1)
    }, [])

    return <RankContainer>
        <TitleContainer>
            <TitleInnerContainer>
                <TitleIconContainer>
                    <TitleIcon src={rankIcon} />
                </TitleIconContainer>
                <TitleText>
                    분석 결과 후보 수
                </TitleText>
            </TitleInnerContainer>
        </TitleContainer>
        <RankInputContainer disabled={isRealTime}>
            <RankInputInnerContainer>
                <RankInput isRealTime={isRealTime} maxLength={3} onlyNumber maxNumber={100} value={rank.toString()} onChange={value => {
                    if (!value) {
                        return setRank(0)
                    }
                    setRank(parseInt(value))
                }} onBlur={e => {
                    if (rank === 0) setRank(10)
                }} />
            </RankInputInnerContainer>
            <RankInputButtonsContainer>
                <RankBtn icon={conditionDataAddIcon} hoverIcon={conditionDataAddHoverIcon} callback={rankUpCallback} />
                <RankBtn icon={conditionDataMinusIcon} hoverIcon={conditionDataMinusHoverIcon} callback={rankDownCallback} />
            </RankInputButtonsContainer>
        </RankInputContainer>
    </RankContainer>
}

const ReIDDescriptionComponent = () => {
    const [description, setDescription] = useRecoilState(conditionETCData)
    const inputRef = useRef<HTMLInputElement>(null)
    const isRealTime = useRecoilValue(conditionIsRealTimeData)

    return <DescriptionContainer>
        <TitleContainer>
            <TitleText>
                비고
            </TitleText>
        </TitleContainer>
        <DescriptionInputContainer disabled={isRealTime} onClick={() => {
            if (inputRef.current && !isRealTime) inputRef.current.focus()
        }}>
            <DescriptionInput type="textarea" inputRef={inputRef} value={description} onChange={str => {
                setDescription(str)
            }} disabled={isRealTime} placeholder="설명을 입력해주세요. (100자 이내)" />
        </DescriptionInputContainer>
    </DescriptionContainer>
}

const ETCColumn = () => {
    return <Container style={{
        gap: '24px'
    }}>
        <RankComponent />
        <ReIDDescriptionComponent />
    </Container>
}

export default ETCColumn

const Container = styled.div`
    flex: 0 0 23%;
    height: 100%;
    ${globalStyles.flex({ justifyContent: 'space-between' })}
`

const RankContainer = styled.div`
    width: 100%;
    flex: 0 0 120px;
    ${globalStyles.flex({ gap: '2px' })}
`

const RankInputContainer = styled.div<{disabled: boolean}>`
    width: 100%;
    flex: 1 1 auto;
    border: 1px solid black;
    padding: 12px 36px;
    border-radius: 10px;
    background-color: ${({disabled}) => disabled ? ContentsDisableColor : SectionBackgroundColor};
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '4px' })}
`

const RankInputInnerContainer = styled.div`
    height: 42px;
    position: relative;
    ${globalStyles.flex()}
    &:after {
        content: '개';
        position: absolute;
        top: 53%;
        right: 18px;
        transform: translateY(-50%);
        font-size: 1.5rem;
        color: white;
    }
`

const RankInput = styled(Input)<{isRealTime: boolean}>`
    outline: none;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    font-size: 1.5rem;
    color: white;
    height: 100%;
    background-color: ${({isRealTime}) => isRealTime ? 'transparent' : InputBackgroundColor};
    pointer-events: ${({isRealTime}) => isRealTime ? 'none' : 'all'};
`

const RankInputButtonsContainer = styled.div`
    flex: 0 0 25%;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const RankInputButton = styled(Button)`
    background-color: transparent;
    border: none;
    padding: 4px 6px;
    flex: 0 0 40px;
    & > img {
        pointer-events: none;
    }
`

const DescriptionContainer = styled.div`
    width: 100%;
    flex: 1 1 auto;
    ${globalStyles.flex({ gap: '2px' })}
`

const DescriptionInputContainer = styled.div<{disabled: boolean}>`
    width: 100%;
    flex: 1 1 auto;
    padding: 12px 36px;
    cursor: pointer;
    border-radius: 6px;
    pointer-events: ${({disabled}) => disabled ? 'none' : 'all'};
    background-color: ${({disabled}) => disabled ? ContentsDisableColor : SectionBackgroundColor};

`

const DescriptionInput = styled(Input)`
    color: white;
    border: none;
    width: 100%;
    text-align: center;
    outline: none;
    height: auto;
    font-size: 1rem;
    padding: 4px 8px;
    ${globalStyles.flex()}
    background-color: ${InputBackgroundColor};
`

const TitleContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    flex: 0 0 ${ConditionDataFormColumnTitleHeight}px;
    width: 100%;
    margin-bottom: 8px;
`

const TitleInnerContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start' })}
    flex: 1;
`

const TitleIconContainer = styled.div`
    flex: 0 0 26px;
    margin-right: 6px;
    height: 100%;
    ${globalStyles.flex()}
`

const TitleIcon = styled.img`
    width: 100%;
    height: 100%;
`

const TitleText = styled.div`
    font-size: 1.3rem;
    color: white;
`