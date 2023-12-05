import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { ReIDResultData, ReIDResultSelectedCondition, ReIDResultSelectedView, SingleReIDSelectedData, globalCurrentReidId } from "../../../../Model/ReIdResultModel"
import ImageView from "../../Condition/Constants/ImageView"
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions"
import CCTVNameById from "../../../Constants/CCTVNameById"
import LazyVideo from "../LazyVideo"
import { CameraDataType, ReIDObjectTypeKeys, ReIDResultConditionDataType, ReIDResultDataResultListDataType } from "../../../../Constants/GlobalTypes"
import ForLog from "../../../Constants/ForLog"
import { PROGRESS_STATUS, ProgressData, ProgressDataParamsTimesDataType, ProgressDataType, ProgressRequestParams, ProgressStatus } from "../../../../Model/ProgressModel"
import { ObjectTypes } from "../../ConstantsValues"
import timeIcon from '../../../../assets/img/ProgressTimeIcon.png'
import similarityIcon from '../../../../assets/img/similarityIcon.png'
import checkIcon from '../../../../assets/img/emptyCheckIcon.png'
import Progress from "../../../Layout/Progress"
import { GetObjectIdByImage } from "../../../../Functions/NetworkFunctions"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Condition/Constants/Params"
import { conditionTargetDatas } from "../../../../Model/ConditionDataModel"
import useMessage from "../../../../Hooks/useMessage"

type ResultcontainerProps = {
    reIdId: number
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
    return Math.floor(cctvIds.reduce((pre, cur) => (data.data[Number(cur)].aiPercent! + data.data[Number(cur)].videoPercent) / 2 + pre, 0) / cctvIds.length)
}

const ResultImageView = ({ src, subSrc }: ResultImageViewProps) => {
    // const setContextMenuVisible = useSetRecoilState(contextMenuVisible)
    const [frameImage, setFrameImage] = useState('')

    return <ItemMediaContainer onContextMenu={(e) => {
        e.preventDefault()
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = () => {
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
            ctx!.strokeStyle = "rgb(0,255,0)";
            ctx!.lineWidth = 4;
            ctx!.lineJoin = "round";
            ctx!.stroke();
            ctx!.globalCompositeOperation =
                "destination-over";
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

const CCTVRowContainer = ({ conditionData, data, selectedTarget, reIdId, cctvId }: {
    conditionData: ReIDResultConditionDataType
    data: ReIDResultDataResultListDataType[]
    selectedTarget: number
    reIdId: number
    cctvId: CameraDataType['cameraId']
}) => {
    const selectedCondition = useRecoilValue(ReIDResultSelectedCondition)
    const [selectedData, setSelectedData] = useRecoilState(SingleReIDSelectedData(reIdId))
    const [globalTargetDatas, setGlobalTargetDatas] = useRecoilState(conditionTargetDatas)
    const [isDown, setIsDown] = useState(false)
    const [isMove, setIsMove] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const isDownRef = useRef(isDown)
    const isDownPoint = useRef({
        x: 0,
        y: 0
    })
    const message = useMessage()

    const moveCallback = useCallback((e: MouseEvent) => {
        if (isDownRef.current && containerRef.current) {
            const distance = Math.sqrt((e.screenX - isDownPoint.current.x)**2 + (e.screenY - isDownPoint.current.y)**2)
            if(distance > 10) {
                setIsMove(true)
            }
            containerRef.current.scrollBy({
                left: e.movementX * -1
            })
        }
    }, [])

    const upCallback = useCallback((e: MouseEvent) => {
        setIsDown(false)
        setTimeout(() => {
            setIsMove(false)
        }, 300);
    }, [])

    useEffect(() => {
        if (isDown) {
            document.addEventListener('mousemove', moveCallback)
            document.addEventListener('mouseup', upCallback)
        } else {
            document.removeEventListener('mousemove', moveCallback)
            document.removeEventListener('mouseup', upCallback)
        }
        isDownRef.current = isDown
        return () => {
            document.removeEventListener('mousemove', moveCallback)
            document.removeEventListener('mouseup', upCallback)
        }
    }, [isDown])

    return <TimeGroupCCTVRowContentsContainer isDown={isDown} onMouseDown={(e) => {
        isDownPoint.current = {
            x: e.screenX,
            y: e.screenY
        }
        setIsDown(true)
    }} ref={containerRef}>
        {data.map((result, resultInd) => <TimeGroupCCTVItemBox key={resultInd} selected={selectedData && selectedData[selectedCondition] && selectedData[selectedCondition][selectedTarget] && selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId) || false}>
            <ItemMediasContainer>
                <ResultImageView src={result.imgUrl} subSrc={result.frameImgUrl} />
                <ItemMediaContainer>
                    <LazyVideo poster={result.frameImgUrl} src={result.searchCameraUrl} />
                </ItemMediaContainer>
            </ItemMediasContainer>
            <SelectBtnsContainer>
                <SelectBtn disabled={globalTargetDatas.some(_ => _.resultId === result.resultId)} hover onClick={async () => {
                    if (!isMove) {
                        let type = conditionData.resultList.find(r => r.objectId === selectedTarget)?.objectType!
                        type = type === ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']] ? ReIDObjectTypeKeys[ObjectTypes['PERSON']] : type
                        const { imgUrl, accuracy, resultId, foundDateTime } = { ...result }
                        const res = await GetObjectIdByImage([{
                            type,
                            src: imgUrl,
                            accuracy,
                            cctvId,
                            time: foundDateTime,
                            method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['REIDRESULT']],
                            resultId
                        }])
                        if (res) {
                            setGlobalTargetDatas([...globalTargetDatas, {
                                type,
                                cctvId,
                                selected: false,
                                src: imgUrl,
                                objectId: res[0],
                                accuracy,
                                time: foundDateTime,
                                resultId,
                                method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['REIDRESULT']]
                            }])
                            message.success({ title: "등록 성공", msg: "현재 결과 이미지를 검색 대상으로 추가하였습니다." })
                        }
                    }
                }}>
                    검색 대상 추가
                </SelectBtn>
                <SelectBtn
                    hover
                    activate={selectedData && selectedData[selectedCondition] && selectedData[selectedCondition][selectedTarget] && selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId)}
                    onClick={() => {
                        console.time("click Select")
                        if (!isMove) {
                            if (selectedData) {
                                if (selectedData[selectedCondition][selectedTarget].find(target => target.resultId === result.resultId)) {
                                    setSelectedData(selectedData.map((sData, sInd) => selectedCondition === sInd ? {
                                        ...sData,
                                        [selectedTarget]: sData[selectedTarget].filter(target => target.resultId !== result.resultId)
                                    } : sData))
                                } else {
                                    setSelectedData(selectedData.map((sData, sInd) => selectedCondition === sInd ? {
                                        ...sData,
                                        [selectedTarget]: sData[selectedTarget].concat({ ...result, cctvId })
                                    } : sData))
                                }
                            }
                        }
                        console.timeEnd("click Select")
                    }}>
                    <SelectBtnInnerIconContainer>
                        <SelectBtnInnerIcon src={timeIcon} />
                    </SelectBtnInnerIconContainer> 
                    {convertFullTimeStringToHumanTimeFormat(result.foundDateTime)}
                    &nbsp;&nbsp;
                    {conditionData.resultList[0].objectType !== ReIDObjectTypeKeys[ObjectTypes['PLATE']] && <SelectBtnInnerIconContainer>
                        <SelectBtnInnerIcon src={similarityIcon} />
                    </SelectBtnInnerIconContainer>} 
                    {conditionData.resultList[0].objectType !== ReIDObjectTypeKeys[ObjectTypes['PLATE']] && `${result.accuracy}%`}
                    <CheckIconContainer checked={selectedData && selectedData[selectedCondition] && selectedData[selectedCondition][selectedTarget] && selectedData[selectedCondition][selectedTarget].some(target => target.resultId === result.resultId) || false}>
                        <img src={checkIcon} />
                    </CheckIconContainer>
                </SelectBtn>
            </SelectBtnsContainer>
        </TimeGroupCCTVItemBox>)}
    </TimeGroupCCTVRowContentsContainer>
}

const ResultContainer = ({ reIdId, visible }: ResultcontainerProps) => {
    const data = useRecoilValue(ReIDResultData(reIdId))
    const [selectedCondition, setSelectedCondition] = useRecoilState(ReIDResultSelectedCondition)
    const [selectedTarget, setSelectedTarget] = useState<number>(0)
    const requestParams = useRecoilValue(ProgressRequestParams)
    const selectedView = useRecoilValue(ReIDResultSelectedView)
    const progressStatus = useRecoilValue(ProgressStatus)
    const progressData = useRecoilValue(ProgressData)
    const globalCurrentReIdId = useRecoilValue(globalCurrentReidId)
    const message = useMessage()

    // useEffect(() => {
    //     console.debug("Resultcontainer data Change : ", data)
    // },[data])

    useEffect(() => {
        if (selectedView[0] === reIdId) {
            setSelectedTarget((data?.data[selectedCondition] && data?.data[selectedCondition].resultList && data?.data[selectedCondition].resultList[0] && data?.data[selectedCondition].resultList[0].objectId) || 0)
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
                {/* <ForLog data={globalCurrentReIdId}/>
                <ForLog data={requestParams.type}/>
                <ForLog data={data.data}/> */}
                {/* <ForLog data={progressData}/>
                <ForLog data={selectedCondition}/> */}
                {globalCurrentReIdId === data.reIdId && progressStatus.status === PROGRESS_STATUS['RUNNING'] && (requestParams.type === 'ADDITIONALREID' ? (data.data.length - 1 === selectedCondition) : true) && <ProgressContainer>
                    <ProgressItem percent={progressData[requestParams.type === 'ADDITIONALREID' ? 0 : selectedCondition] ? Math.floor(getConditionPercent(progressData[requestParams.type === 'ADDITIONALREID' ? 0 : selectedCondition].times)) : 0} color={ContentsActivateColor} />
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
                    {!_.resultList.find(__ => {
                        return __.objectId === selectedTarget
                    })?.timeAndCctvGroup.some(__ => {
                        return Array.from(__.results).some(([key, val]) => {
                            return val.length > 0
                        })
                    }) && <NoDataContainer>
                            {
                                (globalCurrentReIdId === reIdId && progressStatus.status === PROGRESS_STATUS['RUNNING']) ? <>
                                    현재 분석중입니다.
                                </> : <>
                                    데이터가 존재하지 않습니다.
                                </>
                            }
                        </NoDataContainer>}
                    {_.resultList.find(__ => __.objectId === selectedTarget)?.timeAndCctvGroup.filter(__ => Array.from(__.results).some(([key, val]) => val.length > 0)).map((__, _ind) => <TimeGroupContainer key={_ind} rowNums={Array.from(__.results).length}>
                        <TimeGroupTitle>
                            {convertFullTimeStringToHumanTimeFormat(__.startTime)} ~ {convertFullTimeStringToHumanTimeFormat(__.endTime)}
                        </TimeGroupTitle>
                        <TimeGroupContents>
                            {
                                Array.from(__.results).filter(([key, val]) => val.length > 0).map(([key, val]) => <TimeGroupCCTVRow key={key}>
                                    <TimeGroupCCTVRowTitle>
                                        <CCTVNameById cctvId={key} />
                                    </TimeGroupCCTVRowTitle>
                                    <CCTVRowContainer cctvId={key} conditionData={_} data={val} selectedTarget={selectedTarget} reIdId={reIdId} />
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

const TimeGroupContainer = styled.div<{rowNums: number}>`
    height: ${({rowNums}) => rowNums * 248 + 48}px;
    &:not(:first-child) {
        margin-top: 8px;
    }
`

const TimeGroupTitle = styled.div`
    height: 48px;
    font-size: 1.4rem;
    font-weight: 700;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
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
    font-size: 1rem;
    ${globalStyles.flex()}
`

const TimeGroupCCTVRowContentsContainer = styled.div<{ isDown: boolean }>`
    height: calc(100% - 40px);
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px' })}
    width: 100%;
    margin: 8px 0;
    overflow: auto;
    cursor: ${({ isDown }) => isDown ? 'grabbing' : 'grab'};
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

const CheckIconContainer = styled.div<{ checked: boolean }>`
    ${globalStyles.flex()}
    flex: 0 0 24px;
    padding-left: 8px;
    & > img {
        width: 100%;
        height: 100%;
        opacity: ${({ checked }) => checked ? 1 : 0.5};
    }
`