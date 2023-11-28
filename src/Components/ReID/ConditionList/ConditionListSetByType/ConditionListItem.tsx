import styled from "styled-components"
import { ConditionListType } from "../../../../Model/ConditionDataModel"
import { ButtonBackgroundColor, ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import ImageView from "../../Condition/Constants/ImageView"
import { useState } from "react"
import ArrowIcon from '../../../../assets/img/downArrowIcon.png'
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions"
import Button from "../../../Constants/Button"
import cctvIcon from '../../../../assets/img/treeCCTVIcon.png'
import startTimeIcon from '../../../../assets/img/startTimeIcon.png'
import endTimeIcon from '../../../../assets/img/endTimeIcon.png'
import TargetDescriptionByType from "../../Condition/Constants/TargetDescriptionByType"

type ConditionListItemProps = {
    data: ConditionListType
    setData: (index: number, data: ConditionListType) => void
    deleteAction: (index: number) => void
    index: number
}

const ConditionListItem = ({ data, setData, deleteAction, index }: ConditionListItemProps) => {
    const [imageIndex, setImageIndex] = useState(0)
    const { targets, selected, cctv, time, rank, etc, title } = data

    return <Container selected={selected || false}>
        <Header>
            {title}
        </Header>
        <ContentsContainer>
            <TargetContainer>
                <ETCTitle>
                    대상 이미지
                </ETCTitle>
                <TargetDescriptionContainer>
                    <TargetImageContainer>
                        <TargetImage src={targets[imageIndex] && targets[imageIndex].src} />
                    </TargetImageContainer>
                </TargetDescriptionContainer>
                <TargetImageIndexChangeContainer>
                    <Arrow src={ArrowIcon} disabled={imageIndex === 0} onClick={() => {
                        if (imageIndex > 0) setImageIndex(imageIndex - 1)
                    }} />
                    <TargetImageIndexChangeTextContainer>
                        {imageIndex + 1} / {targets.length}
                    </TargetImageIndexChangeTextContainer>
                    <Arrow src={ArrowIcon} disabled={imageIndex === targets.length - 1} onClick={() => {
                        if (imageIndex < targets.length - 1) setImageIndex(imageIndex + 1)
                    }} />
                </TargetImageIndexChangeContainer>
            </TargetContainer>
            <DescriptionContainer>
                <ETCTitle>
                    대상 설명
                </ETCTitle>
                <CCTVContents>
                    <TargetDescriptionInnerContainer>
                        <TargetDescriptionByType data={targets[imageIndex] || {}} />
                    </TargetDescriptionInnerContainer>
                </CCTVContents>
            </DescriptionContainer>
            <CCTVsContainer>
                <ETCTitle>
                    CCTV
                </ETCTitle>
                <CCTVContents>
                    {cctv.map((_, ind) => <CCTVRow key={ind}>
                        <CCTVIcon src={cctvIcon} />
                        x
                        <CCTVNum>
                            {_.cctvList.length}
                        </CCTVNum>
                    </CCTVRow>)}
                </CCTVContents>
            </CCTVsContainer>
            <TimesContainer>
                <ETCTitle>
                    시간
                </ETCTitle>
                <CCTVContents>
                    {time.map((_, ind) => <TimeRow key={ind}>
                        <TimeCol>
                            <TimeIcon>
                                <img src={startTimeIcon}/>
                            </TimeIcon>
                            {convertFullTimeStringToHumanTimeFormat(_.time[0])}
                        </TimeCol>
                        <TimeCol>
                            <TimeIcon>
                                <img src={endTimeIcon}/>
                            </TimeIcon>
                            {convertFullTimeStringToHumanTimeFormat(_.time[1])}
                        </TimeCol>
                    </TimeRow>)}
                </CCTVContents>
            </TimesContainer>
            <LastContainer>
                <RankContainer>
                    후보: {rank}
                </RankContainer>
                <ETCContainer>
                    <ETCText>
                        {etc || '설명 없음'}
                    </ETCText>
                </ETCContainer>
                <BtnsContainer>
                    <LastBtn hover activate={selected} onClick={() => {
                        setData(index, { ...data, selected: !selected })
                    }}>
                        {data.selected ? '해제' : '선택'}
                    </LastBtn>
                    <LastBtn hover onClick={() => {
                        deleteAction(index)
                    }}>
                        삭제
                    </LastBtn>
                </BtnsContainer>
            </LastContainer>
        </ContentsContainer>
    </Container>
}

export default ConditionListItem

const Container = styled.div<{ selected: boolean }>`
    border: 1.5px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    border-radius: 12px;
    padding: 6px;
    height: 300px;
    flex: 0 0 49.5%;
    margin-bottom: 1%;
    ${globalStyles.flex({ justifyContent: 'space-between', gap: '6px' })}
`

const Header = styled.div`
    height: 40px;
    padding: 4px 0;
    font-size: 1.2rem;
    ${globalStyles.flex()}
    background-color: ${ButtonBackgroundColor};
    border-radius: 10px;
    width: 100%;
    user-select: text;
`
const ContentsContainer = styled.div`
    height: calc(100% - 40px);
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '6px' })}
`

const TargetContainer = styled.div`
    flex: 0 0 200px;
    height: 100%;
`

const TargetImageIndexChangeContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '8px' })}
    height: 10%;
`

const TargetImageIndexChangeTextContainer = styled.div`
    font-size: .9rem;
`

const Arrow = styled.img<{ disabled: boolean }>`
    height: 100%;
    rotate: 90deg;
    &:last-child {
        rotate: 270deg;
    }
    pointer-events: auto;
    opacity: ${({ disabled }) => disabled ? 0 : 1};
    cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`

const TargetDescriptionContainer = styled.div`
    height: calc(100% - 40px);
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
`

const TargetImageContainer = styled.div`
    height: 100%;
    padding: 2px;
`

const TargetImage = styled(ImageView)`
    height: 100%;
`

const TargetDescriptionInnerContainer = styled.div`
    height: 100%;
    overflow: auto;
`

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
    font-size: .8rem;
`

const CCTVsContainer = styled.div`
    height: 100%;
    flex: 0 0 10%;
`

const ETCTitle = styled.div`
    height: 20px;
    ${globalStyles.flex()}
    font-size: .8rem;
    font-weight: bold;
`

const CCTVContents = styled.div`
    height: calc(100% - 20px);
    width: 100%;
    overflow: auto;
    ${globalStyles.flex({ gap: '8px', justifyContent: 'flex-start' })}
    ${globalStyles.contentsBorder}
    padding: 8px 12px;
    overflow-wrap: anywhere;
`

const CCTVRow = styled.div`
    height: 28px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}
`

const CCTVIcon = styled.img`
    height: 80%;
    flex: 0 0 20px;
`

const CCTVNum = styled.div`
    
`

const TimesContainer = styled.div`
    height: 100%;
    flex: 0 0 22%;
`

const TimeRow = styled.div`
    ${globalStyles.flex({gap: '4px'})}
    width: 100%;
    text-align: center;
    font-size: .9rem;
    padding: 4px;
    background-color: ${GlobalBackgroundColor};
    border-radius: 8px;
`

const TimeCol = styled.div`
    ${globalStyles.flex({flexDirection:'row', gap: '8px'})}
    font-size: 1.1rem;
    height: 22px;
    font-family: NanumGothicLight;
`

const TimeIcon = styled.div`
    height: 100%;
    & > img {
        width: 100%;
        height: 100%;
    }
`

const LastContainer = styled.div`
    flex: 1;
    height: 100%;
`

const RankContainer = styled.div`
    height: 20px;
    font-size: .8rem;
    font-weight: bold;
    ${globalStyles.flex()}
`

const ETCContainer = styled.div`
    ${globalStyles.flex()}
    height: calc(100% - 54px);
    ${globalStyles.contentsBorder}
    padding: 4px;
    margin-bottom: 6px;
    user-select: text;
`

const ETCText = styled.div`
    max-height: 100%;
    width: 100%;
    overflow: auto;
    height: auto;
    text-align: center;
    word-break: break-all;
    white-space: pre-wrap;
    user-select: text;
`

const BtnsContainer = styled.div`
    height: 28px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '6px' })}
`

const LastBtn = styled(Button)`
    height: 100%;
    width: 100%;
    margin: 0;
    padding-block: 0;
    padding-inline: 0;
`

const DescriptionContainer = styled.div`
    flex: 0 0 25%;
    height: 100%;
`