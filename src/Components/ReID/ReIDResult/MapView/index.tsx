import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import MapComponent from "../../../Constants/Map"
import styled from "styled-components";
import { ContentsBorderColor, globalStyles } from "../../../../styles/global-styled";
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
    },[selectedData, selectedCondition, selectedTarget])
    
    const filteredSelectedData = useMemo(() => (selectedData && selectedCondition.length > 0) ? selectedCondition.map(_ => Object.keys(selectedData[_]).filter(__ => selectedTarget[_].includes(Number(__))).flatMap(__ => selectedData[_][Number(__)])).flat().sort((a, b) => a.foundDateTime < b.foundDateTime ? -1 : 1) : [], [selectedData, selectedCondition, selectedTarget])
    const filteredPathCameras = useMemo(() => filteredSelectedData.length > 0 ? filteredSelectedData.map(_ => _.cctvId!) : [], [filteredSelectedData])
    
    const createResultBox = useCallback((_: ReIDResultDataResultListDataType, isStart: boolean, isEnd: boolean) => <ResultBox key={_.resultId + '1'} onClick={() => {
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
        </ResultBoxMiddleContainer>
        {_.accuracy ? <ResultBoxBottomContainer>
            유사율 : {_.accuracy}%
        </ResultBoxBottomContainer> : <></>}
    </ResultBox>, [])

    useEffect(() => {
        setDetailResult(null)
    }, [opened])

    useEffect(() => {
        if(detailResult) {
            
        }
    },[detailResult])

    return <>
        <Container opened={opened}>
            <MapContainer>
                <MapComponent
                    pathCameras={filteredPathCameras}
                    viewChangeForPath={detailResult ? [detailResult[0].cctvId!] : undefined}
                    forAddtraffic
                    reIdId={reIdId}
                    onlyMap>
                </MapComponent>
                <ViewTargetSelect datas={filteredViewData || []} conditionChange={conditions => {
                    setSelectedCondition(conditions)
                }} targetChange={targets => {
                    setSelectedTarget(targets)
                }} />
            </MapContainer>
            <ShowContainer>
                <TargetContainer>
                    <TargetMediaContainer>
                        <ImageView src={detailResult ? detailResult[0].imgUrl : undefined} style={{
                            width: detailResult ? '100%' : '50%',
                            height: detailResult ? '100%' : '50%'
                        }}/>
                    </TargetMediaContainer>
                    <TargetMediaContainer>
                        <Video src={detailResult ? detailResult[0].searchCameraUrl : undefined}/>
                    </TargetMediaContainer>
                </TargetContainer>
                <ResultsContainer>
                    {
                        filteredSelectedData && filteredSelectedData.flatMap((_, ind, arr) => {
                            if (arr.length - 1 > ind) return [createResultBox(_, ind === 0, ind === arr.length - 1), <ResultLine key={_.resultId + '2'} src={resultLineImg} />]
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
    ${({ opened }) => opened ? globalStyles.flex({ gap: '32px' }) : `display: none;`}
    ${globalStyles.fadeOut()}
`

const MapContainer = styled.div`
    width: 100%;
    flex: 1;
    position: relative;
`

const ShowContainer = styled.div`
    width: 100%;
    height: 320px;
    border-radius: 12px;
    padding: 18px 28px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '80px' })}
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

const TargetImage = styled.img`
`

const TargetVideo = styled.video`
    width: 100%;
    height: 100%;
`

const ResultsContainer = styled.div`
    flex: 1;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}
    overflow: auto;
`

const ResultBox = styled.div`
    flex: 0 0 200px;
    padding: 16px 0;
    cursor: pointer;
    height: 100%;
    ${globalStyles.flex({ gap: '32px' })}
`

const CCTVImgContainer = styled.div`
    height: 100px;
`

const CCTVImg = styled.img`
    width: 100%;
    height: 100%;
`

const ResultBoxMiddleContainer = styled.div`
    flex: 1 1 60px;
    ${globalStyles.flex()}
`

const CCTVName = styled.div`
    text-align: center;
    font-size: 1.6rem;
`

const DetectedTime = styled.div`
    text-align: center;
    font-size: 1.1rem;
`

const ResultBoxBottomContainer = styled.div`
    flex: 1 1 40px;
    font-size: 1.3rem;
`

const ResultLine = styled.img`
    width: 200px;
    align-self: flex-start;
    padding-top: 50px;
`