import styled from "styled-components"
import { GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../../styles/global-styled"
import { useEffect, useState } from "react"
import { CameraDataType } from "../../../../../Constants/GlobalTypes"
import SelectedCCTVListItem from "./SelectedCCTVListItem"
import SelectedCCTVDetailContainer from "./SelectedCCTVDetailContainer"
import { useSetRecoilState } from "recoil"
import { conditionTargetDatasCCTVTemp } from "../../../../../Model/ConditionDataModel"
import TreeAndMapComponent from "../../../../Constants/TreeAndMapComponent"

const CCTVVideo = () => {
    const [selectedCCTVs, setSelectedCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const [selectedVideo, setSelectedVideo] = useState<CameraDataType | null>(null)
    const setCctvDatasTemp = useSetRecoilState(conditionTargetDatasCCTVTemp)

    useEffect(() => {
        setCctvDatasTemp([])
    }, [selectedVideo])

    return <Container>
        <TreeMapComponentContainer>
            <TreeAndMapComponent onChange={cctvs => {
                setSelectedCCTVs(cctvs)
            }} />
        </TreeMapComponentContainer>
        <SelectedCCTVListContainer selected={selectedVideo !== null}>
            <FlexContainer>
                {
                    selectedCCTVs.map(_ => <SelectedCCTVListItem key={_} cctvId={_} selectedCCTVs={selectedCCTVs} setSelectedCCTVs={setSelectedCCTVs} selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />)
                }
            </FlexContainer>
        </SelectedCCTVListContainer>
        <SelectedCCTVDetailContainer selected={selectedVideo} setSelected={setSelectedVideo} />
    </Container>
}

export default CCTVVideo

const Container = styled.div`
    width: 100%;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '1%' })}
    overflow: hidden;
    position: relative;
`

const TreeMapComponentContainer = styled.div`
    height: 100%;
    flex: 0 0 49%;
    position: relative;
    border: 1px solid black;
    overflow: auto;
    transition: left .25s ease-out;
    z-index: 10;
`

const SelectedCCTVListContainer = styled.div<{ selected: boolean }>`
    height: 100%;
    flex: 0 0 49%;
    border: 1px solid black;
    position: relative;
    transition: left .25s ease-out;
    overflow: auto;
    z-index: 11;
    background-color: ${SectionBackgroundColor};
    border-radius: 10px;
    padding: 12px 16px;
    ${({ selected }) => `left: ${selected ? -50 : 0}%;`}
`

const FlexContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'flex-start' })}
`

