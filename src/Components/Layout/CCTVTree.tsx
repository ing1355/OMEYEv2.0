import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { SitesDataForTreeView } from "../../Model/SiteDataModel"
import { useCallback, useEffect, useRef, useState } from "react"
import { CameraDataType, SiteDataType } from "../../Constants/GlobalTypes"
import { ButtonActiveBackgroundColor, ButtonBackgroundColor, ButtonBorderColor, ContentsBorderColor, globalStyles } from "../../styles/global-styled"
import CCTVIcon from '../../assets/img/treeCCTVIcon.png'
import CollapseArrow from "../Constants/CollapseArrow"
import Button from "../Constants/Button"

const nodeHeight = 32
const depthPadding = 28

type CCTVTreeProps = {
    selectedCCTVs: CameraDataType['cameraId'][]
    selectedChange: (targets: CameraDataType['cameraId'][]) => void
    singleTarget?: boolean
    openedInit?: boolean
    searchCCTVId?: CameraDataType['cameraId']
    visible: boolean
    initEvent?: boolean
}

const getCameraIdsInNode = (node: SiteDataType): CameraDataType['cameraId'][] => {
    let cameras: CameraDataType['cameraId'][] = []
    if (node.cameras) cameras = node.cameras.map(_ => _.cameraId)
    if (node.sites) {
        return [...node.sites.flatMap(_ => getCameraIdsInNode(_)), ...cameras]
    } else {
        return cameras
    }
}

const CCTVTree = ({ selectedCCTVs, selectedChange, singleTarget, openedInit, searchCCTVId, initEvent, visible }: CCTVTreeProps) => {
    const [opened, setOpened] = useState<SiteDataType['fullName'][]>([])
    const sitesData = useRecoilValue(SitesDataForTreeView)
    const lastClickedCCTV = useRef<CameraDataType['cameraId']>(0)
    const shiftKeyClicked = useRef(false)
    
    const keyDownCallback = useCallback((e: KeyboardEvent) => {
        if(e.key === 'Shift') {
            shiftKeyClicked.current = true
        }
    },[])

    const keyUpCallback = useCallback((e: KeyboardEvent) => {
        if(e.key === 'Shift') {
            shiftKeyClicked.current = false
            // lastClickedCCTV.current = 0
        }
    },[])

    useEffect(() => {
        if(visible) {
            document.addEventListener('keydown', keyDownCallback)
            document.addEventListener('keyup', keyUpCallback)
        } else {
            document.removeEventListener('keydown', keyDownCallback)
            document.removeEventListener('keyup', keyUpCallback)
        }
        return () => {
            document.removeEventListener('keydown', keyDownCallback)
            document.removeEventListener('keyup', keyUpCallback)
        }
    },[visible])

    useEffect(() => {
        if (searchCCTVId && searchCCTVId) {
            selectedChange([...selectedCCTVs, searchCCTVId].deduplication())
        }
    }, [searchCCTVId])

    useEffect(() => {
        if (openedInit) setOpened([])
    }, [openedInit])

    useEffect(() => {
        if(initEvent) {
            setOpened([])
            selectedChange([])
        }
    },[initEvent])

    const getSiteNodeHeight = (data: SiteDataType): number => {
        return nodeHeight + ((data.cameras && (data.cameras.length > 0)) ? (data.cameras.length * nodeHeight) : 0) + (data.sites && data.sites.length > 0 ? data.sites.reduce((pre, cur) => pre + getSiteNodeHeight(cur), 0) : 0)
    }

    const createCameraNode = (data: CameraDataType, depth: number, hasBrother: boolean, parent: SiteDataType) => {
        return <NodeContainer depth={depth} opened={true} key={data.cameraId}>
            <NodeContentsContainer isCamera>
                {
                    Array.from({ length: depth }).map((_, ind) => <DepthLine key={ind} bottom={hasBrother || (ind !== depth - 1)} right={(ind + 1) === depth} />)
                }
                <NodeItemContainer isSelected={selectedCCTVs.includes(data.cameraId)} onMouseDown={e => {
                    e.stopPropagation()
                    if (singleTarget) {
                        selectedChange([data.cameraId])
                    } else {
                        if (selectedCCTVs.includes(data.cameraId)) selectedChange(selectedCCTVs.filter(_ => _ !== data.cameraId))
                        else {
                            if(parent.cameras.find(_ => _.cameraId === lastClickedCCTV.current) && shiftKeyClicked.current) {
                                const l_ind = parent.cameras.findIndex(_ => _.cameraId === lastClickedCCTV.current)
                                const s_ind = parent.cameras.findIndex(_ => _.cameraId === data.cameraId)
                                if(l_ind !== -1 && s_ind !== -1) {
                                    if(l_ind > s_ind) {
                                        selectedChange(selectedCCTVs.concat(parent.cameras.filter((_, i) => i <= l_ind && i >= s_ind).map(_ => _.cameraId)).deduplication())
                                    } else {
                                        selectedChange(selectedCCTVs.concat(parent.cameras.filter((_, i) => i >= l_ind && i <= s_ind).map(_ => _.cameraId)).deduplication())
                                    }
                                }
                            } else {
                                selectedChange(selectedCCTVs.concat(data.cameraId))
                            }
                        }
                        lastClickedCCTV.current = data.cameraId
                    }
                }} onClick={(e) => {
                    e.stopPropagation()
                }} style={{
                    maxWidth: `calc(100% - ${depth * depthPadding}px)`
                }}>
                    <NodeIconContainer>
                        <img src={CCTVIcon} />
                    </NodeIconContainer>
                    {data.name}
                </NodeItemContainer>
            </NodeContentsContainer>
        </NodeContainer>
    }

    const createSiteNode = (data: SiteDataType, depth: number, parentHasCameras: boolean) => {
        const allCameraIds = getCameraIdsInNode(data).deduplication()
        return <NodeContainer depth={depth} opened={opened.includes(data.fullName)} key={data.siteId}>
            <NodeContentsContainer isCamera={false}>
                {
                    Array.from({ length: depth }).map((_, ind) => <DepthLine key={ind} bottom={parentHasCameras} right={(ind + 1) === depth} />)
                }
                <NodeItemContainer isSelected={allCameraIds.length > 0 && allCameraIds.every(_ => selectedCCTVs.includes(_))} onMouseDown={e => {
                    e.stopPropagation()
                    if(allCameraIds.length > 0) {
                        if (opened.includes(data.fullName)) setOpened(opened.filter(_ => !_?.includes(data.fullName!)))
                        else setOpened(opened.concat(data.fullName))
                    }
                }} onClick={(e) => {
                    e.stopPropagation()
                }} style={{
                    paddingLeft: nodeHeight + 'px',
                    paddingRight: !singleTarget ? '32px' : '0px'
                }}>
                    {allCameraIds.length > 0 && <ArrowWrapper opened={opened.includes(data.fullName)} onClick={(e) => {
                        e.stopPropagation()
                        if (opened.includes(data.fullName)) setOpened(opened.filter(_ => !_?.includes(data.fullName!)))
                        else setOpened(opened.concat(data.fullName))
                    }} />}
                    <NodeTitleText>
                        {data.siteName}
                    </NodeTitleText>
                    <div style={{
                        fontFamily: 'NanumGothicLight'
                    }}>
                        ({allCameraIds.filter(_ => selectedCCTVs.includes(_)).length}/{allCameraIds.length})
                    </div>
                    {/* {!singleTarget && allCameraIds.length > 0 && <AllSelectBtn activate={allCameraIds.every(_ => selectedCCTVs.includes(_))} hover onMouseDown={e => {
                        e.stopPropagation()
                    }} onClick={e => {
                        e.stopPropagation()
                        if (allCameraIds.every(_ => selectedCCTVs.includes(_))) selectedChange(selectedCCTVs.filter(_ => !allCameraIds.includes(_)))
                        else selectedChange(ArrayDeduplication(selectedCCTVs.concat(allCameraIds)))
                    }}>
                        전체 {allCameraIds.every(_ => selectedCCTVs.includes(_)) ? '해제' : '선택'}
                    </AllSelectBtn>} */}
                </NodeItemContainer>
            </NodeContentsContainer>
            {data.sites && data.sites.length > 0 && opened.includes(data.fullName) && data.sites.map(_ => createSiteNode(_, depth + 1, data.cameras && data.cameras.length > 0))}
            {data.cameras && data.cameras.length > 0 && opened.includes(data.fullName) && data.cameras.map((_, cameraInd, arr) => createCameraNode(_, depth + 1, cameraInd !== arr.length - 1, data))}
        </NodeContainer>
    }

    return <Container>
        {sitesData.map(_ => createSiteNode(_, 0, false))}
    </Container>
}

export default CCTVTree

const DepthLine = styled.div<{ bottom: boolean, right: boolean }>`
    flex: 0 0 ${depthPadding}px;
    height: ${nodeHeight}px;
    position: relative;
    &:before {
        content: "";
        width: 1px;
        height: ${({ bottom }) => bottom ? '100%' : '50%'};
        border-right: 2px solid ${ButtonBorderColor};
        position: absolute;
        left: 50%;
    }
    ${({ right }) => right && `
    &:after {
        content: "";
        width: 43%;
        height: 1px;
        border-top: 2px solid ${ButtonBorderColor};
        position: absolute;
        top: 50%;
        left: 55%;
    }
    `}
`

const Container = styled.div`
    overflow: auto;
    height: 100%;
`

const NodeContainer = styled.div<{ depth: number, opened: boolean }>`
    overflow: hidden;
    ${({ depth, opened }) => ({
        height: opened ? 'auto' : `${nodeHeight + 6}px`
    })}}
    transition: height .3s ease-out
`

const NodeContentsContainer = styled.div<{isCamera: boolean}>`
    height: ${({isCamera}) => isCamera ? (nodeHeight + 1) : nodeHeight + 6}px;
    padding: ${({isCamera}) => isCamera ? '0.5px 0' : '1px 0'};
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start' })}
`

const NodeIconContainer = styled.div`
    height: 100%;
    padding: 6px;
    ${globalStyles.flex()}
    & > img {
        height: 100%;
        width: 100%;
    }
`

const NodeItemContainer = styled.div<{ isSelected: boolean }>`
    border: 1px solid black;
    border-radius: 10px;
    width: 100%;
    padding: 0px 6px;
    cursor: pointer;
    color: white;
    height: 100%;    
    position: relative;
    background-color: ${({ isSelected }) => isSelected ? ButtonActiveBackgroundColor : ButtonBackgroundColor};
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '6px' })}
    font-family: NanumGothicLight;
    font-size: .785rem;
`

const NodeTitleText = styled.div`
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: .8rem;
    font-family: NanumGothicLight;
`

const ArrowWrapper = styled(CollapseArrow)`
    position: absolute;
    left: 0;
    padding: 8px;
    width: ${nodeHeight}px;
    height: ${nodeHeight}px;
`

const AllSelectBtn = styled(Button)`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translate(0, -50%);
`