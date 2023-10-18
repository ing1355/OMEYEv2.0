import { useEffect, useState } from "react"
import styled from "styled-components"
import { CameraDataType } from "../../Constants/GlobalTypes"
import CCTVTree from "../Layout/CCTVTree"
import MapComponent from './Map'
import MapIcon from '../../assets/img/MapIcon.png'
import TreeIcon from '../../assets/img/TreeIcon.png'
import { ContentsBorderColor, SectionBackgroundColor } from "../../styles/global-styled"

type TreeAndMapComponentProps = {
    onChange: (selected: CameraDataType['cameraId'][]) => void
    defaultValue?: CameraDataType['cameraId'][]
}

const TreeAndMapComponent = ({onChange, defaultValue}: TreeAndMapComponentProps) => {
    const [isTreeView, setIsTreeView] = useState(true)
    const [selectedCCTVs, setSelectedCCTVs] = useState<CameraDataType['cameraId'][]>([])

    useEffect(() => {
        onChange(selectedCCTVs)
    },[selectedCCTVs])

    useEffect(() => {
        if(defaultValue && (JSON.stringify(defaultValue) !== JSON.stringify(selectedCCTVs))) setSelectedCCTVs(defaultValue)
    },[defaultValue])

    return <CCTVSelectContainer>
        <ToggleBtn onClick={() => {
            setIsTreeView(!isTreeView)
        }}>
            <ToggleIcon src={isTreeView ? MapIcon : TreeIcon}/>
        </ToggleBtn>
        <CCTVSelectInnerContainer isView={isTreeView}>
            <TreeContainer>
                <CCTVTree selectedCCTVs={selectedCCTVs} selectedChange={targets => {
                    setSelectedCCTVs(targets)
                }} />
            </TreeContainer>
        </CCTVSelectInnerContainer>
        <CCTVSelectInnerContainer isView={!isTreeView}>
            <MapComponent selectedCCTVs={selectedCCTVs} selectedChange={targets => {
                setSelectedCCTVs(targets)
            }} />
        </CCTVSelectInnerContainer>
    </CCTVSelectContainer>
}

export default TreeAndMapComponent

const CCTVSelectContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
`

const ToggleBtn = styled.div`
    width: 48px;
    height: 48px;
    padding: 4px;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 2;
    border-radius: 10px
    border: 1px solid ${ContentsBorderColor};
    cursor: pointer;
    background-color: transparent;
`

const ToggleIcon = styled.img`
    height: 100%;
    width: 100%;
`

const CCTVSelectInnerContainer = styled.div<{ isView: boolean }>`
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: ${SectionBackgroundColor};
    border-radius: 10px;
    ${({ isView }) => `
        opacity: ${isView ? 1 : 0};
        z-index: ${isView ? 1 : 0};
    `}
`

const TreeContainer = styled.div`
    height: 100%;
    padding: 68px 16px 16px 16px;
    overflow: hidden;
`