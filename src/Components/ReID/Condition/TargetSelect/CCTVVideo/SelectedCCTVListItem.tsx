import styled from "styled-components"
import { CameraDataType, setStateType } from "../../../../../Constants/GlobalTypes"
import { useRecoilValue } from "recoil"
import { GetCameraById } from "../../../../../Model/SiteDataModel"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../../styles/global-styled"
import closeIcon from '../../../../../assets/img/closeIcon.png'
import Video from "../../../../Constants/Video"

type SelectedCCTVListItemProps = {
    cctvId: CameraDataType['cameraId']
    selectedCCTVs: CameraDataType['cameraId'][]
    setSelectedCCTVs: setStateType<CameraDataType['cameraId'][]>
    selectedVideo: CameraDataType | null
    setSelectedVideo: setStateType<CameraDataType | null>
}

const SelectedCCTVListItem = ({ cctvId, selectedCCTVs, setSelectedCCTVs, selectedVideo, setSelectedVideo }: SelectedCCTVListItemProps) => {
    const cctvInfo = useRecoilValue(GetCameraById(cctvId))
    return <Container onClick={() => {
        setSelectedVideo(cctvInfo!)
    }} selected={cctvInfo !== undefined && selectedVideo !== undefined && selectedVideo !== null && (selectedVideo.cameraId === cctvInfo.cameraId)}>
        <Header>
            <Title>
                <TitleText>
                    {cctvInfo?.name}
                </TitleText>
                <DeleteBtn onClick={(e) => {
                    e.stopPropagation()
                    if (selectedVideo?.cameraId === cctvInfo?.cameraId) setSelectedVideo(null)
                    setSelectedCCTVs(selectedCCTVs.filter(_ => _ !== cctvId))
                }}>
                    <img src={closeIcon} />
                </DeleteBtn>
            </Title>
        </Header>
        <VideoContainer>
            <Video cctvId={cctvInfo?.cameraId} />
        </VideoContainer>
    </Container>
}

export default SelectedCCTVListItem

const Container = styled.div<{ selected: boolean }>`
    flex: 0 0 calc(100%/3);
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    height: 200px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
`

const Header = styled.div`
    width: 100%;
    height: 30px;
    line-height: 30px;
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 0px;
`

const Title = styled.div`
    ${globalStyles.flex({ flex: 1, flexDirection: 'row', justifyContent: 'space-between' })}
`

const TitleText = styled.div`
    padding: 0 8px;
    flex: calc(100% - 30px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-height: 30px;
`

const DeleteBtn = styled.div`
    width: 30px;
    height: 30px;
    padding: 8px;
    cursor: pointer;
    & > img {
        width: 100%;
        height: 100%;
    }
    ${globalStyles.flex()}
`

const VideoContainer = styled.div`
    width: 100%;
    height: 100%;
    ${globalStyles.flex()}
`