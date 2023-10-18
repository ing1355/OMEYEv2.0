import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { ReIDResultData, SingleReIDSelectedData } from "../../../../Model/ReIdResultModel"
import ImageView from "../../Condition/Constants/ImageView"
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions"
import CCTVNameById from "../../../Constants/CCTVNameById"
import LazyVideo from "../LazyVideo"
import { ReIDResultDataResultListDataType } from "../../../../Constants/GlobalTypes"

type ResultcontainerProps = {
    reidId: number
    visible: boolean
}

const ResultContainer = ({ reidId, visible }: ResultcontainerProps) => {
    const data = useRecoilValue(ReIDResultData(reidId))
    const [selectedCondition, setSelectedCondition] = useState(0)
    const [selectedTarget, setSelectedTarget] = useState<number>(data?.data[0].resultList[0].objectId || 0)
    const [selectedData, setSelectedData] = useRecoilState(SingleReIDSelectedData(reidId))

    useEffect(() => {
        setSelectedTarget(data?.data[selectedCondition].resultList[0].objectId || 0)
    },[selectedCondition])
    
    return data ? <Container visible={visible}>
        <ConditionsContainer>
            {data.data.map((_, ind) => <ConditionItem key={ind} activate={selectedCondition === ind} onClick={() => {
                setSelectedCondition(ind)
            }}>
                {_.title}
            </ConditionItem>)}
        </ConditionsContainer>
        {data.data.map((_, ind) => <ResultListContainer key={ind} visible={selectedCondition === ind}>
            <TargetsContainer>
                {
                    _.resultList.map((_, ind) => <TargetContainer key={ind} selected={selectedTarget === _.objectId}>
                        <TargetImageContainer>
                            <TargetImage src={_.objectUrl} />
                        </TargetImageContainer>
                        <TargetSelectBtn activate={selectedTarget === _.objectId} onClick={() => {
                            setSelectedTarget(_.objectId)
                        }}>
                            선택
                        </TargetSelectBtn>
                    </TargetContainer>)
                }
            </TargetsContainer>
            <ResultListGroupContainer>
                <ResultDescriptionContainer>
                    {_.etc}
                </ResultDescriptionContainer>
                <ResultListItemsContainer>
                    {_.resultList.find(__ => __.objectId === selectedTarget)?.timeAndCctvGroup.map((__, _ind) => <TimeGroupContainer key={_ind}>
                        <TimeGroupTitle>
                            {convertFullTimeStringToHumanTimeFormat(__.startTime)} ~ {convertFullTimeStringToHumanTimeFormat(__.endTime)}
                        </TimeGroupTitle>
                        <TimeGroupContents>
                            {
                                Object.keys(__.results).map((___, __ind) => <TimeGroupCCTVRow key={__ind}>
                                    <TimeGroupCCTVRowTitle>
                                        <CCTVNameById cctvId={Number(___)} />
                                    </TimeGroupCCTVRowTitle>
                                    <TimeGroupCCTVRowContentsContainer>
                                        {__.results[Number(___)].map((result, resultInd) => selectedData && <TimeGroupCCTVItemBox key={resultInd} selected={selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId)}>
                                            <ItemMediasContainer>
                                                <ItemMediaContainer>
                                                    <ImageView src={result.imageUrl} />
                                                </ItemMediaContainer>
                                                <ItemMediaContainer>
                                                    <LazyVideo poster={result.frameImageUrl} src={result.searchCameraUrl} />
                                                </ItemMediaContainer>
                                            </ItemMediasContainer>
                                            <SelectBtn activate={selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId)} onClick={() => {
                                                if (selectedData) {
                                                    if (selectedData[selectedCondition][selectedTarget].find(target => target.resultId === result.resultId)) {
                                                        setSelectedData(selectedData.map((sData, sInd) => selectedCondition === sInd ? {
                                                            ...sData,
                                                            [selectedTarget]: sData[selectedTarget].filter(target => target.resultId !== result.resultId)
                                                        } : sData))
                                                    } else {
                                                        setSelectedData(selectedData.map((sData, sInd) => selectedCondition === sInd ? {
                                                            ...sData,
                                                            [selectedTarget]: sData[selectedTarget].concat({...result, cctvId: Number(___)})
                                                        } : sData))
                                                    }
                                                }
                                            }}>
                                                선택(유사율: {result.distance}%)
                                            </SelectBtn>
                                        </TimeGroupCCTVItemBox>)}
                                    </TimeGroupCCTVRowContentsContainer>
                                </TimeGroupCCTVRow>)
                            }
                        </TimeGroupContents>
                    </TimeGroupContainer>)}
                </ResultListItemsContainer>
            </ResultListGroupContainer>
        </ResultListContainer>)}
    </Container> : <></>
}

export default ResultContainer

const etcDescriptionHeight = 60

const Container = styled.div<{ visible: boolean }>`
    width: 100%;
    height: 100%;
    display: ${({ visible }) => visible ? 'block' : 'none'};
`

const ConditionsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '8px' })}
    max-width: 100%;
    overflow: auto;
    height: 24px;
`

const ConditionItem = styled(Button)`
    word-break: keep-all;
    height: 100%;
`

const ResultListContainer = styled.div<{ visible: boolean }>`
    height: calc(100% - 32px);
    margin-top: 8px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    display: ${({ visible }) => visible ? 'flex' : 'none'};
`

const TargetsContainer = styled.div`
    flex: 0 0 260px;
    height: 100%;
    overflow: auto;
    background-color: ${SectionBackgroundColor};
    border-radius: 12px;
    padding: 8px;
`

const ResultListGroupContainer = styled.div`
    flex: 1;
    height: 100%;
    background-color: ${SectionBackgroundColor};
    padding: 12px;
    border-radius: 12px;
`

const ResultDescriptionContainer = styled.div`
    background-color: ${GlobalBackgroundColor};
    padding: 12px 16px;
    border-radius: 12px;
    height: ${etcDescriptionHeight}px;
    margin-bottom: 8px;
`

const TargetContainer = styled.div<{ selected: boolean }>`
    height: 420px;
    padding: 8px;
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    border-radius: 12px;
    &:not(:first-child) {
        margin-top: 8px;
    }
`

const TargetImageContainer = styled.div`
    height: calc(100% - 40px);
`

const TargetImage = styled(ImageView)`
`

const TargetSelectBtn = styled(Button)`
    width: 100%;
    margin-top: 8px;
    height: 32px;
`

const ResultListItemsContainer = styled.div`
    height: calc(100% - ${etcDescriptionHeight + 8}px);
    overflow: auto;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
    padding: 6px 12px;
`

const TimeGroupContainer = styled.div`
    height: auto;
    max-height: 600px;
    &:not(:first-child) {
        margin-top: 8px;
    }
`

const TimeGroupTitle = styled.div`
    height: 26px;
    ${globalStyles.flex()}
`

const TimeGroupContents = styled.div`
    ${globalStyles.flex({ gap: '8px' })}
    height: calc(100% - 48px);
`

const TimeGroupCCTVRow = styled.div`
    width: 100%;
    height: 240px;
`

const TimeGroupCCTVRowTitle = styled.div`
    height: 32px;
    background-color: ${ContentsBorderColor};
    border-radius: 12px;
    ${globalStyles.flex()}
`

const TimeGroupCCTVRowContentsContainer = styled.div`
    height: calc(100% - 40px);
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px' })}
    width: 100%;
    margin: 8px 0;
    overflow: auto;
`

const TimeGroupCCTVItemBox = styled.div<{ selected: boolean }>`
    height: 100%;
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    border-radius: 12px;
    flex: 0 0 450px;
    padding: 8px 12px;
`

const ItemMediasContainer = styled.div`
    width:100%;
    height: calc(100% - 28px);
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
    padding-bottom: 8px;
`

const ItemMediaContainer = styled.div`
    &:first-child {
        flex: 0 0 35%;
    }
    &:nth-child(2) {
        flex: 0 0 65%;
    }
    height: 100%;
`

const SelectBtn = styled(Button)`
    width: 100%;
    height: 28px;
`