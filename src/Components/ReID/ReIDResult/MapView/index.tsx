import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { SitesData } from "../../../../Model/SiteDataModel";
import MapComponent from "../../../Constants/Map"
import styled from "styled-components";
import { ContentsBorderColor, globalStyles } from "../../../../styles/global-styled";
import noImage from '../../../../assets/img/logo.png'
import CCTVIcon from '../../../../assets/img/CCTVIcon.png'
import resultLineImg from '../../../../assets/img/resultLineImg.png'
import { ReIDResultDataResultListDataType } from "../../../../Constants/GlobalTypes";
import ViewTargetSelect from "./ViewTargetSelect";
import { ReIDResultData, SingleReIDSelectedData } from "../../../../Model/ReIdResultModel";
import CCTVNameById from "../../../Constants/CCTVNameById";

type MapViewProps = {
    opened: boolean
    reidId: number
}

const MapView = ({ opened, reidId }: MapViewProps) => {
    const [selectedCondition, setSelectedCondition] = useState<number[]>([])
    const [selectedTarget, setSelectedTarget] = useState<number[][]>([])
    const [detailResult, setDetailResult] = useState<ReIDResultDataResultListDataType | null>(null)
    const resultData = useRecoilValue(ReIDResultData(reidId))
    const selectedData = useRecoilValue(SingleReIDSelectedData(reidId))

    const filteredViewData = useMemo(() => resultData?.data.map((_, index) => ({
        title: _.title,
        index,
        objectIds: _.resultList.map(__ => __.objectId)
    })), [resultData])
    
    const filteredSelectedData = useMemo(() => selectedData ? selectedData.filter((_, ind) => selectedCondition.includes(ind)).flatMap((_, ind) => Object.keys(_).filter(__ => selectedTarget[ind].includes(Number(__))).flatMap(__ => _[Number(__)])).sort((a, b) => a.foundDateTime < b.foundDateTime ? -1 : 1) : [], [selectedData, selectedCondition, selectedTarget])
    const filteredPathCameras = useMemo(() => selectedData ? selectedData.filter((_,ind) => selectedCondition.includes(ind)).map((_, ind) => Object.keys(_).filter(__ => selectedTarget[ind].includes(Number(__))).map(__ => _[Number(__)].map(___ => ___.cctvId!))) : [], [selectedData, selectedCondition, selectedTarget])
    
    const createResultBox = useCallback((_: ReIDResultDataResultListDataType) => <ResultBox key={_.resultId + '1'} onClick={() => {
        setDetailResult(_)
    }}>
        <CCTVImgContainer>
            <CCTVImg src={CCTVIcon} />
        </CCTVImgContainer>
        <ResultBoxMiddleContainer>
            <CCTVName>
                <CCTVNameById cctvId={_.cctvId!} />
            </CCTVName>
            <DetectedTime>
                {_.foundDateTime}
            </DetectedTime>
        </ResultBoxMiddleContainer>
        {_.distance ? <ResultBoxBottomContainer>
            유사율 : {_.distance}%
        </ResultBoxBottomContainer> : <></>}
    </ResultBox>, [])

    useEffect(() => {
        if (opened) {

        }
    }, [opened])

    return <>
        <Container opened={opened}>
            <MapContainer>
                <MapComponent
                    pathCameras={filteredPathCameras}
                    // idForViewChange={detailResult?.cameraId}
                    forAddtraffic>
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
                        <TargetImage src={detailResult ? detailResult.imageUrl : noImage} />
                    </TargetMediaContainer>
                    <TargetMediaContainer>
                        <TargetVideo key={detailResult?.resultId} src={detailResult! && detailResult.searchCameraUrl!} poster={noImage} autoPlay />
                    </TargetMediaContainer>
                </TargetContainer>
                <ResultsContainer>
                    {
                        filteredSelectedData && filteredSelectedData.flatMap((_, ind, arr) => {
                            if (arr.length - 1 > ind) return [createResultBox(_), <ResultLine key={_.resultId + '2'} src={resultLineImg} />]
                            else return createResultBox(_)
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
    width: 100%;
    height: 100%;
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