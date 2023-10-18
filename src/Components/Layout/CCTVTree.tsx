import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { SitesDataForTreeView } from "../../Model/SiteDataModel"
import { useState } from "react"
import { CameraDataType, SiteDataType } from "../../Constants/GlobalTypes"
import { ButtonActiveBackgroundColor, ButtonBackgroundColor, ButtonBorderColor, ContentsBorderColor, globalStyles } from "../../styles/global-styled"
import CCTVIcon from '../../assets/img/treeCCTVIcon.png'
import { ArrayDeduplication } from "../../Functions/GlobalFunctions"
import CollapseArrow from "../Constants/CollapseArrow"

type CCTVTreeProps = {
    selectedCCTVs: CameraDataType['cameraId'][]
    selectedChange: (targets: CameraDataType['cameraId'][]) => void
    singleTarget?: boolean
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

const CCTVTree = ({ selectedCCTVs, selectedChange, singleTarget }: CCTVTreeProps) => {
    const [opened, setOpened] = useState<SiteDataType['fullName'][]>([])
    const sitesData = useRecoilValue(SitesDataForTreeView)

    const getSiteNodeHeight = (data: SiteDataType): number => {
        return nodeHeight + ((data.cameras && (data.cameras.length > 0)) ? (data.cameras.length * nodeHeight) : 0) + (data.sites && data.sites.length > 0 ? data.sites.reduce((pre, cur) => pre + getSiteNodeHeight(cur), 0) : 0)
    }

    const createCameraNode = (data: CameraDataType, depth: number, hasBrother: boolean) => {
        return <NodeContainer depth={depth} opened={true} key={data.cameraId}>
            <NodeContentsContainer>
                {
                    Array.from({ length: depth }).map((_, ind) => <DepthLine key={ind} bottom={hasBrother || (ind !== depth - 1)} right={(ind + 1) === depth} />)
                }
                <NodeItemContainer isSelected={selectedCCTVs.includes(data.cameraId)} onClick={() => {
                    if (singleTarget) {
                        selectedChange([data.cameraId])
                    } else {
                        if (selectedCCTVs.includes(data.cameraId)) selectedChange(selectedCCTVs.filter(_ => _ !== data.cameraId))
                        else selectedChange(selectedCCTVs.concat(data.cameraId))
                    }
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
        const allCameraIds = ArrayDeduplication(getCameraIdsInNode(data))
        return <NodeContainer depth={depth} opened={opened.includes(data.fullName)} key={data.siteId}>
            <NodeContentsContainer>
                {
                    Array.from({ length: depth }).map((_, ind) => <DepthLine key={ind} bottom={parentHasCameras} right={(ind + 1) === depth} />)
                }
                <NodeItemContainer isSelected={allCameraIds.some(_ => selectedCCTVs.includes(_))} onClick={() => {
                    if (allCameraIds.every(_ => selectedCCTVs.includes(_))) selectedChange(selectedCCTVs.filter(_ => !allCameraIds.includes(_)))
                    else selectedChange(ArrayDeduplication(selectedCCTVs.concat(allCameraIds)))
                }} style={{
                    paddingLeft: nodeHeight + 'px'
                }}>
                    <ArrowWrapper opened={opened.includes(data.fullName)} onClick={(e) => {
                        e.stopPropagation()
                        if (opened.includes(data.fullName)) setOpened(opened.filter(_ => !_?.includes(data.fullName!)))
                        else setOpened(opened.concat(data.fullName))
                    }} />
                    <NodeTitleText>
                        {data.siteName}
                    </NodeTitleText>
                    <div>
                        ({allCameraIds.filter(_ => selectedCCTVs.includes(_)).length})
                    </div>
                </NodeItemContainer>
            </NodeContentsContainer>
            {data.sites && data.sites.length > 0 && data.sites.map(_ => createSiteNode(_, depth + 1, data.cameras && data.cameras.length > 0))}
            {data.cameras && data.cameras.length > 0 && data.cameras.map((_, cameraInd, arr) => createCameraNode(_, depth + 1, cameraInd !== arr.length - 1))}
        </NodeContainer>
    }

    return <Container>
        {sitesData.map(_ => createSiteNode(_, 0, false))}
    </Container>
}

export default CCTVTree

const nodeHeight = 36
const depthPadding = 28

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
        height: opened ? 'auto' : `${nodeHeight}px`
    })}}
    transition: height .3s ease-out
`

const NodeContentsContainer = styled.div`
    height: ${nodeHeight}px;
    padding: 1px 0;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start' })}
`

const NodeIconContainer = styled.div`
    height: 100%;
    padding: 8px;
    ${globalStyles.flex()}
    & > img {
        height: 100%;
        width: 100%;
    }
`

const NodeItemContainer = styled.div<{ isSelected: boolean }>`
    border: 1px solid black;
    border-radius: 10px;
    min-width: 100%;
    padding: 0px 6px;
    cursor: pointer;
    color: white;
    height: 100%;    
    position: relative;
    background-color: ${({ isSelected }) => isSelected ? ButtonActiveBackgroundColor : ButtonBackgroundColor};
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '6px' })}
`

const NodeTitleText = styled.div`
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: .8rem;
`

const ArrowWrapper = styled(CollapseArrow)`
    position: absolute;
    left: 0;
    padding: 8px;
    width: ${nodeHeight}px;
    height: ${nodeHeight}px;
`