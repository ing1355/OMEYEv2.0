import styled from "styled-components"
import { InputBackgroundColor, InputTextColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import { useRecoilState, useRecoilValue } from "recoil"
import { conditionETCData, conditionIsRealTimeData, conditionRankData } from "../../../../Model/ConditionDataModel"
import { useRef, useState } from "react"
import Input from "../../../Constants/Input"
import Button from "../../../Constants/Button"
import { ConditionDataFormColumnTitleHeight } from "../../ConstantsValues"
import conditionDataAddIcon from '../../../../assets/img/conditionDataAddIcon.png'
import conditionDataAddHoverIcon from '../../../../assets/img/conditionDataAddHoverIcon.png'
import conditionDataMinusIcon from '../../../../assets/img/conditionDataMinusIcon.png'
import conditionDataMinusHoverIcon from '../../../../assets/img/conditionDataMinusHoverIcon.png'

const RankComponent = () => {
    const [rank, setRank] = useRecoilState(conditionRankData)
    const [isUpHover, setIsUpHover] = useState(false)
    const [isDownHover, setIsDownHover] = useState(false)
    return <RankContainer>
        <TitleContainer>
            <Title>
                후보 수
            </Title>
        </TitleContainer>
        <RankInputContainer>
            <RankInputInnerContainer>
                <RankInput maxLength={3} value={rank.toString()} onChange={value => {
                    if (!value) {
                        return setRank(0)
                    }
                    setRank(parseInt(value))
                }} onBlur={e => {
                    if (rank === 0) setRank(10)
                }} />
            </RankInputInnerContainer>
            <RankInputButtonsContainer>
                <RankInputButton onClick={() => {
                    setRank(_ => _ === 99 ? _ : _ + 1)
                }} icon={isUpHover ? conditionDataAddHoverIcon : conditionDataAddIcon} onMouseEnter={() => {
                    setIsUpHover(true)
                }} onMouseLeave={() => {
                    setIsUpHover(false)
                }}/>
                <RankInputButton onClick={() => {
                    setRank(_ => _ === 1 ? _ : _ - 1)
                }} onMouseEnter={() => {
                    setIsDownHover(true)
                }} onMouseLeave={() => {
                    setIsDownHover(false)
                }} icon={isDownHover ? conditionDataMinusHoverIcon : conditionDataMinusIcon}/>
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
            <Title>
                비고
            </Title>
        </TitleContainer>
        <DescriptionInputContainer onClick={() => {
            if (inputRef.current && !isRealTime) inputRef.current.focus()
        }}>
            <DescriptionInput type="textarea" inputRef={inputRef} value={description} onChange={str => {
                setDescription(str)
            }} disabled={isRealTime} placeholder="설명을 입력해주세요. (100자 이내)"/>
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

const RankInputContainer = styled.div`
    width: 100%;
    flex: 1 1 auto;
    border: 1px solid black;
    padding: 12px 36px;
    border-radius: 10px;
    background-color: ${SectionBackgroundColor};
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

const RankInput = styled(Input)`
    outline: none;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    font-size: 1.5rem;
    color: white;
    height: 100%;
`

const RankInputButtonsContainer = styled.div`
    flex: 0 0 25%;
    ${globalStyles.flex({flexDirection:'row'})}
`

const RankInputButton = styled(Button)`
    background-color: transparent;
    border: none;
    padding: 4px 6px;
    flex: 0 0 40px;
`

const DescriptionContainer = styled.div`
    width: 100%;
    flex: 1 1 auto;
    ${globalStyles.flex({ gap: '2px' })}
`

const DescriptionInputContainer = styled.div`
    width: 100%;
    flex: 1 1 auto;
    padding: 12px 36px;
    cursor: pointer;
    background-color: ${SectionBackgroundColor};
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

const Title = styled.div`
    color: white;
    font-size: 1.5rem;
`