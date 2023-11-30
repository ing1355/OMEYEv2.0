import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import MapComponent from "../../../Constants/Map"
import styled from "styled-components";
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../styles/global-styled";
import CCTVIcon from '../../../../assets/img/CCTVSelectedIcon.png'
import CCTVStartIcon from '../../../../assets/img/CCTVStartIcon.png'
import CCTVEndIcon from '../../../../assets/img/CCTVEndIcon.png'
import resultLineImg from '../../../../assets/img/resultLineImg.png'
import { ReIDResultDataResultListDataType } from "../../../../Constants/GlobalTypes";
import ViewTargetSelect from "./ViewTargetSelect";
import { ReIDResultData, SingleReIDSelectedData } from "../../../../Model/ReIdResultModel";
import CCTVNameById from "../../../Constants/CCTVNameById";
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions";
import ImageView from "../../Condition/Constants/ImageView";
import Video from "../../../Constants/Video";
import ForLog from "../../../Constants/ForLog";

type MapViewProps = {
    opened: boolean
    reIdId: number
}

const ResultItemWidth = 220
const ResultItemHeight = 160

const MapView = ({ opened, reIdId }: MapViewProps) => {
    const [selectedCondition, setSelectedCondition] = useState<number[]>([])
    const [selectedTarget, setSelectedTarget] = useState<number[][]>([])
    const [detailResult, setDetailResult] = useState<ReIDResultDataResultListDataType[] | null>(null)
    const resultData = useRecoilValue(ReIDResultData(reIdId))
    const selectedData = useRecoilValue(SingleReIDSelectedData(reIdId))

    const filteredViewData = useMemo(() => resultData?.data.map((_, index) => ({
        title: _.title,
        index,
        objectIds: _.resultList.map(__ => __.objectId)
    })), [resultData])

    useEffect(() => {
        console.debug("mapView useEffect Data : ", selectedData, selectedCondition, selectedTarget)
    }, [selectedData, selectedCondition, selectedTarget])

    const filteredSelectedData = useMemo(() => (selectedData && selectedCondition.length > 0 && selectedTarget.length > 0) ? selectedCondition.map(_ =>{
        return (selectedData[_] ? Object.keys(selectedData[_]) : []).filter(__ => {
            return selectedTarget[_].includes(Number(__))
            }).flatMap(__ => selectedData[_][Number(__)])}).flat().sort((a, b) => {
                    return a.foundDateTime < b.foundDateTime ? -1 : 1
                }) : [], [selectedData, selectedCondition, selectedTarget])
    const filteredPathCameras = useMemo(() => filteredSelectedData.length > 0 ? filteredSelectedData.map(_ => _.cctvId!) : [], [filteredSelectedData])

    const createResultBox = useCallback((_: ReIDResultDataResultListDataType, isStart: boolean, isEnd: boolean) => <ResultBox
        key={_.resultId + '1'}
        onClick={() => {
            setDetailResult([_])
        }}>
        <CCTVImgContainer>
            <CCTVImg src={isStart ? CCTVStartIcon : (isEnd ? CCTVEndIcon : CCTVIcon)} />
        </CCTVImgContainer>
        <ResultBoxMiddleContainer>
            <CCTVName>
                <CCTVNameById cctvId={_.cctvId!} />
            </CCTVName>
            <DetectedTime>
                {convertFullTimeStringToHumanTimeFormat(_.foundDateTime)}
            </DetectedTime>
            {_.accuracy ? <ResultBoxBottomContainer>
                유사율 : {_.accuracy}%
            </ResultBoxBottomContainer> : <></>}
        </ResultBoxMiddleContainer>
    </ResultBox>, [])

    const createResultLine = () => <LineContainer>
        <ResultLine />
        <ResultLine />
        <ResultLine />
        <ResultLine />
    </LineContainer>

    useEffect(() => {
        setDetailResult(null)
    }, [opened])

    return <>
        <Container opened={opened}>
            <MapContainer>
                <MapComponent
                    pathCameras={filteredPathCameras}
                    viewChangeForPath={detailResult ? [detailResult[0].cctvId!] : undefined}
                    forAddtraffic
                    reIdId={reIdId}
                    visible={opened}
                    onlyMap>
                </MapComponent>
                <ViewTargetSelect datas={filteredViewData || []} conditionChange={conditions => {
                    setSelectedCondition(conditions)
                }} targetChange={targets => {
                    setSelectedTarget(targets)
                }} opened={opened} />
            </MapContainer>
            <ShowContainer>
                <TargetContainer>
                    <TargetMediaContainer>
                        <ImageView src={detailResult ? detailResult[0].imgUrl : undefined} style={{
                            width: detailResult ? '100%' : '50%',
                            height: detailResult ? '100%' : '50%'
                        }} />
                    </TargetMediaContainer>
                    <TargetMediaContainer>
                        <Video src={detailResult ? detailResult[0].searchCameraUrl : undefined} />
                    </TargetMediaContainer>
                </TargetContainer>
                <ResultsContainer>
                    {
                        filteredSelectedData && filteredSelectedData.flatMap((_, ind, arr) => {
                            if (arr.length - 1 > ind) return [createResultBox(_, ind === 0, ind === arr.length - 1), <LineContainer key={_.resultId + '2'} >
                                {createResultLine()}
                                {/* <ResultLine key={_.resultId + '2'} src={resultLineImg} /> */}
                            </LineContainer>]
                            else return createResultBox(_, ind === 0 && arr.length !== 1, ind === arr.length - 1 || arr.length === 1)
                        })
                    }
                </ResultsContainer>
            </ShowContainer>
        </Container>
    </>
}

export default MapView

const Container = styled.div<{ opened: boolean }>`
    height: 100%;
    ${globalStyles.flex({gap: '12px'})}
    visibility: ${({ opened }) => opened ? 'visible' : `hidden`};
    ${globalStyles.fadeOut()}
`

const MapContainer = styled.div`
    width: 100%;
    flex: 1;
`

const ShowContainer = styled.div`
    width: 100%;
    height: 360px;
    border-radius: 12px;
    padding: 6px 12px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '40px' })}
    `

const TargetContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '24px' })}
    height: 284px;
    flex: 0 0 640px;
`

const TargetMediaContainer = styled.div`
    height: 100%;
    ${globalStyles.flex()}
    flex: 1;
    border: 1px solid ${ContentsBorderColor};
`

const ResultsContainer = styled.div`
    flex: 1;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '16px', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap' })}
    overflow: auto;
`

const ResultBox = styled.div`
    flex: 0 0 ${ResultItemWidth}px;
    padding: 16px 0;
    cursor: pointer;
    height: ${ResultItemHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const CCTVImgContainer = styled.div`
    height: 60px;
`

const CCTVImg = styled.img`
    width: 100%;
    height: 100%;
`

const ResultBoxMiddleContainer = styled.div`
    flex: 1 1 60px;
    ${globalStyles.flex({ gap: '8px' })}
`

const CCTVName = styled.div`
    text-align: center;
    font-size: 1rem;
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical
`

const DetectedTime = styled.div`
    text-align: center;
    font-size: 1rem;
`

const ResultBoxBottomContainer = styled.div`
    flex: 1;
    font-size: 1rem;
`

const LineContainer = styled.div`
    width: ${ResultItemWidth - 130}px;
    height: ${ResultItemHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const ResultLine = styled.div`
    flex: 1;
    border-top: 2px solid ${ContentsActivateColor};
`

// const ResultLine = styled.img`
//     width: 100px;
// `