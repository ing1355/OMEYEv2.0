import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import { useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { ReIDResultData, ReIDResultSelectedCondition, ReIDResultSelectedView, SingleReIDSelectedData, globalCurrentReidId } from "../../../../Model/ReIdResultModel"
import ImageView from "../../Condition/Constants/ImageView"
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions"
import CCTVNameById from "../../../Constants/CCTVNameById"
import LazyVideo from "../LazyVideo"
import { ReIDObjectTypeKeys, ReIDResultDataResultListDataType } from "../../../../Constants/GlobalTypes"
import { contextMenuVisible } from "../../../../Model/ContextMenuModel"
import ForLog from "../../../Constants/ForLog"
import { PROGRESS_STATUS, ProgressData, ProgressDataParamsTimesDataType, ProgressDataType, ProgressStatus } from "../../../../Model/ProgressModel"
import { ObjectTypes } from "../../ConstantsValues"
import timeIcon from '../../../../assets/img/ProgressTimeIcon.png'
import similarityIcon from '../../../../assets/img/similarityIcon.png'
import Progress from "../../../Layout/Progress"
import { GetObjectIdByImage } from "../../../../Functions/NetworkFunctions"
import { getLastTargetListId } from "../../Condition/Constants/ImageViewWithCanvas"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Condition/Constants/Params"
import { conditionAllData } from "../../../../Model/ConditionDataModel"
import useMessage from "../../../../Hooks/useMessage"

type ResultcontainerProps = {
    reidId: number
    visible: boolean
}

type ResultImageViewProps = {
    src: string
    subSrc: string
}

const GetCoordByUrl = (url: string): Array<any> => {
    return url.match(/_\d{1,4}_\d{1,4}_\d{1,4}_\d{1,4}/g)![0].slice(1,).split('_') || []
}

const getConditionPercent = (data: ProgressDataType['times']) => {
    return Math.floor(data.reduce((pre, cur) => pre + Number(getTimeGroupPercent(cur)), 0) / data.length)
}

const getTimeGroupPercent = (data: ProgressDataParamsTimesDataType) => {
    const cctvIds = Object.keys(data.data)
    return Math.floor(cctvIds.reduce((pre, cur) => (data.data[Number(cur)].aiPercent + data.data[Number(cur)].videoPercent) / 2 + pre, 0) / cctvIds.length)
}

const ResultImageView = ({ src, subSrc }: ResultImageViewProps) => {
    // const setContextMenuVisible = useSetRecoilState(contextMenuVisible)
    const [frameImage, setFrameImage] = useState('')

    return <ItemMediaContainer onContextMenu={(e) => {
        e.preventDefault()
        const image = new Image();
        image.crossOrigin = "Anonymous";
        console.debug("load start")
        image.onload = () => {
            console.debug("load end")
            const canvas = document.createElement("canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx!.drawImage(
                image,
                0,
                0,
                image.width,
                image.height
            );
            console.debug("draw end")
            ctx!.beginPath();
            const coord = GetCoordByUrl(subSrc);
            let width = coord[2] - coord[0];
            let height = coord[3] - coord[1];
            ctx!.rect(
                coord[0],
                coord[1],
                width,
                height
            );
            ctx!.strokeStyle = "red";
            ctx!.lineWidth = 4;
            ctx!.lineJoin = "round";
            ctx!.stroke();
            ctx!.globalCompositeOperation =
                "destination-over";
                console.debug("draw path")
            setFrameImage(canvas.toDataURL())
            image.src = '';
        }
        image.src = subSrc;
        // if (type === ReIDObjectTypeKeys[ObjectTypes['PLATE']]) return;
        // const { innerWidth, innerHeight } = window
        // setContextMenuVisible({
        //     left: e.clientX + 110 > innerWidth ? e.clientX - 110 : e.clientX + 10,
        //     top: e.clientY,
        //     data,
        //     type
        // })
    }}>
        <ImageView src={src} subSrc={frameImage} />
    </ItemMediaContainer>
}

const ResultContainer = ({ reidId, visible }: ResultcontainerProps) => {
    const data = useRecoilValue(ReIDResultData(reidId))
    const [selectedCondition, setSelectedCondition] = useRecoilState(ReIDResultSelectedCondition)
    const [selectedTarget, setSelectedTarget] = useState<number>(0)
    const [selectedData, setSelectedData] = useRecoilState(SingleReIDSelectedData(reidId))
    const [conditionDatas, setConditionDatas] = useRecoilState(conditionAllData)
    const selectedView = useRecoilValue(ReIDResultSelectedView)
    const progressStatus = useRecoilValue(ProgressStatus)
    const progressData = useRecoilValue(ProgressData)
    const globalCurrentReIdId = useRecoilValue(globalCurrentReidId)
    const message = useMessage()

    // useEffect(() => {
    //     console.debug("Resultcontainer data Change : ", data)
    // },[data])

    useEffect(() => {
        if (selectedView[0] === reidId) {
            setSelectedTarget((data?.data[selectedCondition].resultList && data?.data[selectedCondition].resultList[0] && data?.data[selectedCondition].resultList[0].objectId) || 0)
        }
    }, [selectedView, selectedCondition])

    return data ? <Container visible={visible}>
        <ConditionsContainer>
            {data.data.map((_, ind) => <ConditionItem hover key={ind} activate={selectedCondition === ind} onClick={() => {
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
                {globalCurrentReIdId === data.reIdId && progressStatus.status === PROGRESS_STATUS['RUNNING'] && <ProgressContainer>
                    <ProgressItem percent={Math.floor(getConditionPercent(progressData[selectedCondition].times))} color={ContentsActivateColor} />
                </ProgressContainer>}
                <ResultDescriptionContainer>
                    <DescriptionReIdIdTextContainer>
                        분석번호 : {data.reIdId}
                    </DescriptionReIdIdTextContainer>
                    <DescriptionEtcTextContainer>
                        {_.etc || '설명 없음'}
                    </DescriptionEtcTextContainer>
                </ResultDescriptionContainer>
                <ResultListItemsContainer isProgress={globalCurrentReIdId === data.reIdId && progressStatus.status === PROGRESS_STATUS['RUNNING']}>
                    {!_.resultList.find(__ => __.objectId === selectedTarget)?.timeAndCctvGroup.some(__ => Array.from(__.results).some(([key, val]) => val.length > 0)) && <NoDataContainer>
                        {
                            (globalCurrentReIdId === reidId && progressStatus.status === PROGRESS_STATUS['RUNNING']) ? <>
                                현재 분석중입니다.
                            </> : <>
                                데이터가 존재하지 않습니다.
                            </>
                        }
                    </NoDataContainer>}
                    {_.resultList.find(__ => __.objectId === selectedTarget)?.timeAndCctvGroup.filter(__ => Array.from(__.results).some(([key, val]) => val.length > 0)).map((__, _ind) => <TimeGroupContainer key={_ind}>
                        <TimeGroupTitle>
                            {convertFullTimeStringToHumanTimeFormat(__.startTime)} ~ {convertFullTimeStringToHumanTimeFormat(__.endTime)}
                        </TimeGroupTitle>
                        <TimeGroupContents>
                            {
                                Array.from(__.results).filter(([key, val]) => val.length > 0).map(([key, val]) => <TimeGroupCCTVRow key={key}>
                                    <TimeGroupCCTVRowTitle>
                                        <CCTVNameById cctvId={key} />
                                    </TimeGroupCCTVRowTitle>
                                    <TimeGroupCCTVRowContentsContainer>
                                        {val.map((result, resultInd) => <TimeGroupCCTVItemBox key={resultInd} selected={selectedData && selectedData[selectedCondition] && selectedData[selectedCondition][selectedTarget] && selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId) || false}>
                                            <ItemMediasContainer>
                                                <ResultImageView src={result.imgUrl} subSrc={result.frameImgUrl} />
                                                <ItemMediaContainer>
                                                    <LazyVideo poster={result.frameImgUrl} src={result.searchCameraUrl} />
                                                </ItemMediaContainer>
                                            </ItemMediasContainer>
                                            <SelectBtnsContainer>
                                                <SelectBtn hover onClick={async () => {
                                                    let type = _.resultList.find(r => r.objectId === selectedTarget)?.objectType!
                                                    type = type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? ReIDObjectTypeKeys[ObjectTypes['PERSON']] : type
                                                    console.debug("result : ", result)
                                                    const res = await GetObjectIdByImage([{
                                                        type: type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? ReIDObjectTypeKeys[ObjectTypes['PERSON']] : type,
                                                        image: result.imgUrl
                                                    }])
                                                    if (res) {
                                                        const { cctvId, imgUrl, accuracy } = { ...result, cctvId: key }
                                                        setConditionDatas({
                                                            ...conditionDatas,
                                                            [type]: {
                                                                ...conditionDatas[type],
                                                                targets: [
                                                                    ...conditionDatas[type]['targets'],
                                                                    {
                                                                        type: type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? ReIDObjectTypeKeys[ObjectTypes['PERSON']] : type,
                                                                        cctvId,
                                                                        selected: false,
                                                                        src: imgUrl,
                                                                        objectId: res[0],
                                                                        accuracy,
                                                                        id: getLastTargetListId(),
                                                                        method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['REIDRESULT']]
                                                                    }
                                                                ]
                                                            }
                                                        })
                                                        message.success({ title: "등록 성공", msg: "현재 결과를 대상으로 추가 성공하였습니다." })
                                                    }
                                                }}>
                                                    대상으로 추가
                                                </SelectBtn>
                                                <SelectBtn hover activate={selectedData && selectedData[selectedCondition] && selectedData[selectedCondition][selectedTarget] && selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId)} onClick={() => {
                                                    if (selectedData) {
                                                        if (selectedData[selectedCondition][selectedTarget].find(target => target.resultId === result.resultId)) {
                                                            setSelectedData(selectedData.map((sData, sInd) => selectedCondition === sInd ? {
                                                                ...sData,
                                                                [selectedTarget]: sData[selectedTarget].filter(target => target.resultId !== result.resultId)
                                                            } : sData))
                                                        } else {
                                                            setSelectedData(selectedData.map((sData, sInd) => selectedCondition === sInd ? {
                                                                ...sData,
                                                                [selectedTarget]: sData[selectedTarget].concat({ ...result, cctvId: key })
                                                            } : sData))
                                                        }
                                                    }
                                                }}>
                                                    <SelectBtnInnerIconContainer>
                                                        <SelectBtnInnerIcon src={timeIcon} />
                                                    </SelectBtnInnerIconContainer> {convertFullTimeStringToHumanTimeFormat(result.foundDateTime)}&nbsp;&nbsp;{_.resultList[0].objectType !== ReIDObjectTypeKeys[ObjectTypes['PLATE']] && <SelectBtnInnerIconContainer>
                                                        <SelectBtnInnerIcon src={similarityIcon} />
                                                    </SelectBtnInnerIconContainer>} {result.accuracy}%
                                                    &nbsp;&nbsp;{selectedData && selectedData[selectedCondition] && selectedData[selectedCondition][selectedTarget] && selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId) ? '해제' : '선택'}
                                                </SelectBtn>
                                            </SelectBtnsContainer>
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
    width: 260px;
    height: 100%;
    overflow: auto;
    background-color: ${SectionBackgroundColor};
    border-radius: 12px;
    padding: 8px;
`

const ResultListGroupContainer = styled.div`
    width: calc(100% - 268px);
    height: 100%;
    background-color: ${SectionBackgroundColor};
    padding: 12px;
    border-radius: 12px;
`

const ResultDescriptionContainer = styled.div`
    background-color: ${GlobalBackgroundColor};
    padding: 6px;
    border-radius: 12px;
    height: ${etcDescriptionHeight}px;
    margin-bottom: 8px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '0.5%' })}
    & > div {
        height: 100%;
        ${globalStyles.flex()}
        border: 1px solid ${ContentsBorderColor};
        border-radius: 6px;
    }
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

const ResultListItemsContainer = styled.div<{ isProgress: boolean }>`
    height: calc(100% - ${({ isProgress }) => isProgress ? (etcDescriptionHeight + 8 + 40) : (etcDescriptionHeight + 8)}px);
    overflow: auto;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
    padding: 6px 12px;
`

const TimeGroupContainer = styled.div`
    height: auto;
    max-height: 100%;
    overflow: auto;
    &:not(:first-child) {
        margin-top: 8px;
    }
`

const TimeGroupTitle = styled.div`
    height: 48px;
    font-size: 1.4rem;
    font-weight: 700;
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
    font-size: 1.2rem;
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
        flex: 0 0 50%;
    }
    &:nth-child(2) {
        flex: 0 0 50%;
    }
    border: 1px solid ${ContentsBorderColor};
    height: 100%;
`

const SelectBtn = styled(Button)`
    flex: 1;
    &:first-child {
        flex: 0 0 140px;
    }
    height: 28px;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const NoDataContainer = styled.div`
    ${globalStyles.flex()}
    height: 100%;
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
`

const SelectBtnInnerIconContainer = styled.div`
    ${globalStyles.flex()}
    flex: 0 0 16px;
    padding: 1px;
    margin-right: 3px;
`

const SelectBtnInnerIcon = styled.img`
    width: 100%;
    height: 100%;
`

const DescriptionEtcTextContainer = styled.div`
    flex: 1 auto;
    padding: 4px 8px;
    overflow-wrap: anywhere;
    overflow: auto;
`

const DescriptionReIdIdTextContainer = styled.div`
    flex: 0 0 150px;
`

const ProgressContainer = styled.div`
    height: 40px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start' })}
`

const ProgressItem = styled(Progress)`
    width: 100%;
`

const SelectBtnsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
`