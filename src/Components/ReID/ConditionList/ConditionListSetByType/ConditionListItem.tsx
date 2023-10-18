import styled from "styled-components"
import { ConditionListType, ObjectTypes } from "../../../../Model/ConditionDataModel"
import { ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import ImageView from "../../Condition/Constants/ImageView"
import { useState } from "react"
import ArrowIcon from '../../../../assets/img/downArrowIcon.png'
import { convertFullTimeStringToHumanTimeFormat, getMethodNameByKey } from "../../../../Functions/GlobalFunctions"
import CCTVNameById from "../../../Constants/CCTVNameById"
import { ReIDObjectTypeKeys } from "../../ConstantsValues"
import Button from "../../../Constants/Button"
import cctvIcon from '../../../../assets/img/treeCCTVIcon.png'

type ConditionListItemProps = {
    data: ConditionListType
    setData: (data: ConditionListType) => void
    deleteAction: (id: ConditionListType['id']) => void
}

const ConditionListItem = ({ data, setData, deleteAction }: ConditionListItemProps) => {
    const [imageIndex, setImageIndex] = useState(0)
    const { id, targets, selected, cctv, time, rank, etc } = data

    return <Container selected={selected || false}>
        <TargetContainer>
            <TargetDescriptionContainer>
                <TargetImageContainer>
                    <TargetImage src={targets[imageIndex].src} />
                </TargetImageContainer>
                <TargetDescriptionInnerContainer>
                    <ItemDescriptionContentText>
                        선택 방법 : {getMethodNameByKey(targets[imageIndex].method!)}
                    </ItemDescriptionContentText>
                    {
                        targets[imageIndex].cctvName && <ItemDescriptionContentText>
                            CCTV 이름 : {targets[imageIndex].cctvName}
                        </ItemDescriptionContentText>
                    }
                    {
                        targets[imageIndex].cctvId && <ItemDescriptionContentText>
                            CCTV 이름 : <CCTVNameById cctvId={targets[imageIndex].cctvId!} />
                        </ItemDescriptionContentText>
                    }
                    {
                        targets[imageIndex].time && <ItemDescriptionContentText>
                            발견 시각 : {targets[imageIndex].time}
                        </ItemDescriptionContentText>
                    }
                    {
                        targets[imageIndex].occurancy && <ItemDescriptionContentText>
                            유사율 : {(targets[imageIndex].occurancy! * 100).toFixed(0)}%
                        </ItemDescriptionContentText>
                    }
                    {targets[imageIndex].type === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <ItemDescriptionContentText>
                        마스크 착용 여부 : 미착용
                    </ItemDescriptionContentText>}
                </TargetDescriptionInnerContainer>
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
        <CCTVsContainer>
            <ETCTitle>
                검색 그룹
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
                시간 그룹
            </ETCTitle>
            <CCTVContents>
                {time.map((_, ind) => <TimeRow key={ind}>
                    {convertFullTimeStringToHumanTimeFormat(_.time[0])}<br />~<br />{convertFullTimeStringToHumanTimeFormat(_.time[1])}
                </TimeRow>)}
            </CCTVContents>
        </TimesContainer>
        <LastContainer>
            <RankContainer>
                후보: {rank}
            </RankContainer>
            <ETCContainer>
                <ETCText>
                    {etc}
                </ETCText>
            </ETCContainer>
            <BtnsContainer>
                <LastBtn activate={selected} onClick={() => {
                    setData({ ...data, selected: !selected })
                }}>
                    {data.selected ? '해제' : '선택'}
                </LastBtn>
                <LastBtn onClick={() => {
                    deleteAction(id)
                }}>
                    삭제
                </LastBtn>
            </BtnsContainer>
        </LastContainer>
    </Container>
}

export default ConditionListItem

const Container = styled.div<{ selected: boolean }>`
    border: 1.5px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    border-radius: 12px;
    padding: 6px;
    height: 260px;
    flex: 0 0 49.5%;
    margin-bottom: 1%;
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
    opacity: ${({ disabled }) => disabled ? 0 : 1};
    cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`

const TargetDescriptionContainer = styled.div`
    height: 90%;
`

const TargetImageContainer = styled.div`
    height: 75%;
    padding: 2px;
`

const TargetImage = styled(ImageView)`
    height: 100%;
`

const TargetDescriptionInnerContainer = styled.div`
    height: 25%;
    text-align: center;
    padding: 4px 8px;
    overflow: auto;
`

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
    font-size: .8rem;
`

const CCTVsContainer = styled.div`
    height: 100%;
    flex: 0 0 15%;
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
    padding: 8px;
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
    ${globalStyles.flex()}
    width: 100%;
    text-align: center;
    font-size: .9rem;
    padding: 4px;
    background-color: ${GlobalBackgroundColor};
    border-radius: 8px;
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
`

const ETCText = styled.div`
    max-height: 100%;
    overflow: auto;
    height: auto;
    text-align: center;
    word-break: break-all;
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