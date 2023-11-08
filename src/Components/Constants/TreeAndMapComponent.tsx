import { useEffect, useState } from "react"
import styled from "styled-components"
import { CameraDataType, setStateType } from "../../Constants/GlobalTypes"
import CCTVTree from "../Layout/CCTVTree"
import MapComponent from './Map'
import MapIcon from '../../assets/img/MapIcon.png'
import TreeIcon from '../../assets/img/TreeIcon.png'
import { ContentsBorderColor, SectionBackgroundColor } from "../../styles/global-styled"
import CCTVDropdownSearch from "./CCTVDropdownSearch"

type TreeAndMapComponentProps = {
    selectedCCTVs: CameraDataType['cameraId'][]
    setSelectedCCTVs: setStateType<CameraDataType['cameraId'][]>
    validFunc?: () => boolean
    singleSelect?: boolean
}

let isThrottled = false;

function throttle(func: Function, delay: number) {

    return function (...args: any[]) {
        if (!isThrottled) {
            func(...args)
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, delay);
        }
    };
}

const TreeAndMapComponent = ({ setSelectedCCTVs, selectedCCTVs , singleSelect}: TreeAndMapComponentProps) => {
    const [isTreeView, setIsTreeView] = useState(true)
    const [searchCCTV, setSearchCCTV] = useState<CameraDataType['cameraId'][]|undefined>(undefined)
    const _setSelectedCCTVs = throttle(setSelectedCCTVs, 10)

    return <CCTVSelectContainer>
        <ToggleBtn onClick={() => {
            setIsTreeView(!isTreeView)
        }}>
            <ToggleIcon src={isTreeView ? MapIcon : TreeIcon} />
        </ToggleBtn>
        <CCTVSelectInnerContainer isView={isTreeView}>
            <TreeContainer>
                <CCTVTree selectedCCTVs={selectedCCTVs} selectedChange={_setSelectedCCTVs} singleTarget={singleSelect} searchCCTVId={searchCCTV ? searchCCTV : undefined}/>
            </TreeContainer>
        </CCTVSelectInnerContainer>
        <CCTVSelectInnerContainer isView={!isTreeView}>
            <MapComponent selectedCCTVs={selectedCCTVs} selectedChange={_setSelectedCCTVs} forSingleCamera={singleSelect} idForViewChange={searchCCTV ? searchCCTV : undefined}/>
        </CCTVSelectInnerContainer>
        <CCTVDropdownSearch onChange={(target) => {
            setSearchCCTV([target.cameraId])
        }}/>
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