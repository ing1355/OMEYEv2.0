import { useEffect, useState } from "react"
import styled from "styled-components"
import { CameraDataType, setStateType } from "../../Constants/GlobalTypes"
import CCTVTree from "../Layout/CCTVTree"
import MapComponent from './Map'
import clearIcon from '../../assets/img/resetIcon.png'
import MapIcon from '../../assets/img/MapIcon.png'
import TreeIcon from '../../assets/img/TreeIcon.png'
import { ContentsBorderColor, SectionBackgroundColor } from "../../styles/global-styled"
import CCTVDropdownSearch from "./CCTVDropdownSearch"
import Button from "./Button"
import useMessage from "../../Hooks/useMessage"

type TreeAndMapComponentProps = {
    selectedCCTVs: CameraDataType['cameraId'][]
    setSelectedCCTVs: (cameraIds: CameraDataType['cameraId'][]) => void
    validFunc?: () => boolean
    singleSelect?: boolean
    visible?: boolean
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

const TreeAndMapComponent = ({ setSelectedCCTVs, selectedCCTVs, singleSelect, visible }: TreeAndMapComponentProps) => {
    const [isTreeView, setIsTreeView] = useState(true)
    const [searchCCTV, setSearchCCTV] = useState<CameraDataType['cameraId'] | undefined>(undefined)
    const [initEvent, setInitEvent] = useState(false)
    const _setSelectedCCTVs = throttle(setSelectedCCTVs, 10)
    const message = useMessage()

    useEffect(() => {
        if (initEvent) setInitEvent(false)
    }, [initEvent])

    return <CCTVSelectContainer>
        <ToggleBtn hover onClick={() => {
            setIsTreeView(!isTreeView)
        }}>
            <ToggleIcon src={isTreeView ? MapIcon : TreeIcon} />
        </ToggleBtn>
        <ClearBtn hover disabled={selectedCCTVs.length === 0} onClick={() => {
            if (selectedCCTVs.length === 0) return message.error({ title: "입력값 에러", msg: "선택한 CCTV 목록이 존재하지 않습니다." })
            message.success({ title: "초기화", msg: "선택한 CCTV 목록이 초기화되었습니다." })
            setInitEvent(true)
        }}>
            <ToggleIcon src={clearIcon} />
        </ClearBtn>
        <CCTVSelectInnerContainer isView={isTreeView}>
            <TreeContainer>
                <CCTVTree
                    selectedCCTVs={selectedCCTVs}
                    selectedChange={_setSelectedCCTVs}
                    singleTarget={singleSelect}
                    searchCCTVId={searchCCTV ? searchCCTV : undefined}
                    visible={isTreeView && (visible || false)}
                    initEvent={initEvent} />
            </TreeContainer>
        </CCTVSelectInnerContainer>
        <CCTVSelectInnerContainer isView={!isTreeView}>
            <MapComponent
                selectedCCTVs={selectedCCTVs}
                forSingleCamera={singleSelect}
                selectedChange={(cctvs) => {
                    _setSelectedCCTVs(cctvs)
                }}
                idForViewChange={searchCCTV ? searchCCTV : undefined} />
        </CCTVSelectInnerContainer>
        <CCTVDropdownSearch onChange={(target) => {
            setSearchCCTV(target.cameraId)
        }} />
    </CCTVSelectContainer>
}

export default TreeAndMapComponent

const CCTVSelectContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
`

const ToggleBtn = styled(Button)`
    width: 48px;
    height: 48px;
    padding: 12px;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 2;
    border-radius: 50%;
    border: 1px solid ${ContentsBorderColor};
    cursor: pointer;
    background-color: ${SectionBackgroundColor};
`

const ClearBtn = styled(Button)`
    width: 48px;
    height: 48px;
    padding: 12px;
    position: absolute;
    left: 66px;
    top: 10px;
    z-index: 2;
    border-radius: 50%;
    border: 1px solid ${ContentsBorderColor};
    cursor: pointer;
    background-color: ${SectionBackgroundColor};
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