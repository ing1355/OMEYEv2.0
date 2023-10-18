import styled from "styled-components"
import DataSelectModal from "../Constants/DataSelectModal"
import { useRecoilState } from "recoil"
import MapComponent from "../../../Constants/Map"
import { useEffect, useState } from "react"
import { AreaSelectIndex, AreaSelectVisible } from "../../../../Model/ConditionParamsModalModel"
import CCTVTree from "../../../Layout/CCTVTree"
import { CameraDataType } from "../../../../Constants/GlobalTypes"
import { conditionAreaDatas } from "../../../../Model/ConditionDataModel"
import { globalStyles } from "../../../../styles/global-styled"

const AreaSelect = () => {
    const [visible, setVisible] = useRecoilState(AreaSelectVisible)
    const [selectedCCTVs, setSelectedCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const [areaIndex, setAreaIndex] = useRecoilState(AreaSelectIndex)
    const [areaData, setAreaData] = useRecoilState(conditionAreaDatas)
    
    useEffect(() => {
        if (!visible) {
            setSelectedCCTVs([])
            setAreaIndex(-1)
        } else {
            if(areaIndex !== -1) setSelectedCCTVs(areaData[areaIndex].cctvList || [])
        }
    }, [visible])

    return <ModalWrapper width={'1200px'} visible={visible} title={`검색 그룹${areaIndex === -1 ? ((areaData.length && areaData.length + 1)||1) : (areaIndex + 1)}`} close={() => {
        setVisible(false)
    }} complete={() => {
        if (selectedCCTVs.length === 0) return;
        if (areaIndex === -1) {
            setAreaData(areaData.concat({
                cctvList: selectedCCTVs,
                selected: false
            }))
        } else {
            setAreaData(areaData.map((_,ind) => ind === areaIndex ? {
                cctvList: selectedCCTVs,
                selected: _.selected || false
            } : _))
        }
        setVisible(false)
    }}>
        <Container>
            <CCTVTree selectedCCTVs={selectedCCTVs} selectedChange={targets => {
                setSelectedCCTVs(targets)
            }} />
        </Container>
        <Container>
            <MapComponent selectedCCTVs={selectedCCTVs} selectedChange={targets => {
                setSelectedCCTVs(targets)
            }} />
        </Container>
    </ModalWrapper>
}

export default AreaSelect

const ModalWrapper = styled(DataSelectModal)`
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const Container = styled.div`
    width: 100%;
    height: 100%;
`