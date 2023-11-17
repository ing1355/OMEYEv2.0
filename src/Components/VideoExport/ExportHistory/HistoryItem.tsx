import styled from "styled-components"
import { VideoExoprtHistoryDataType } from "../../../Model/VideoExportDataModel"
import { ButtonActiveBackgroundColor, ButtonInActiveBackgroundColor, ContentsBorderColor, globalStyles } from "../../../styles/global-styled"
import testPng from '../../../assets/test1.png'
import closeIcon from '../../../assets/img/closeIcon.png'
import ImageView from "../../ReID/Condition/Constants/ImageView"
import Button from "../../Constants/Button"
import CCTVNameById from "../../Constants/CCTVNameById"
import { FileDownloadByUrl, convertFullTimeStringToHumanTimeFormat } from "../../../Functions/GlobalFunctions"
import { OptionTags } from "../Constants"

type SubContentsRowProps = {
    title: string
    content: React.ReactNode
}

const SubContentsRow = ({ title, content }: SubContentsRowProps) => {
    return <SubContentRowContainer>
        <SubContentTitle>{title}</SubContentTitle>
        <SubContentSeparator>:</SubContentSeparator>
        <SubContentContent>{content}</SubContentContent>
    </SubContentRowContainer>
}

const getSizeByNumber = (size:number) => {
    if(size < 1024) return size + 'B'
    else if(size < 1024 ** 2) return (size / 1024).toFixed(2) + 'KB'
    else if(size < 1024 ** 3) return (size / (1024 ** 2)).toFixed(2) + 'MB'
    else if(size < 1024 ** 4) return (size / (1024 ** 3)).toFixed(2) + 'GB'
}

const HistoryItem = ({ item }: {
    item: VideoExoprtHistoryDataType
}) => {
    const { data, username, createdTime, videoSize, videoPath, videoType, thumbnailPath } = item
    const { cctvId, startTime, endTime, options } = data
    
    return <Container>
        <ThumbnailContainer>
            <ImageView src={thumbnailPath} />
        </ThumbnailContainer>
        <ContentsContainer>
            <TagsContainer>
                <OptionTags options={options}/>
            </TagsContainer>
            <SubContentsContainer>
                <SubContentsRow title="CCTV 이름" content={<CCTVNameById cctvId={cctvId!}/>} />
                <SubContentsRow title="반출 대상 시간" content={`${convertFullTimeStringToHumanTimeFormat(startTime)} ~ ${convertFullTimeStringToHumanTimeFormat(endTime!)}`} />
                <SubContentsRow title="반출자" content={username} />
                <SubContentsRow title="요청 시간" content={convertFullTimeStringToHumanTimeFormat(createdTime)} />
                <SubContentsRow title="영상 사이즈" content={getSizeByNumber(videoSize)} />
                <SubContentsRow title="영상 타입" content={videoType} />
            </SubContentsContainer>
            {/* <DownloadBtn hover onClick={() => {
                try {
                    fetch(videoPath).then(res => res.blob()).then(file => {
                        let tempUrl = URL.createObjectURL(file);
                        FileDownloadByUrl(tempUrl)
                        URL.revokeObjectURL(tempUrl)
                    })
                } catch(e) {
                    console.error(e)
                }
            }}>
                다시 내려받기
            </DownloadBtn> */}
        </ContentsContainer>
        {/* <CloseIconContainer>
            <CloseIcon src={closeIcon} />
        </CloseIconContainer> */} 
    </Container>
}

export default HistoryItem

const Container = styled.div`
    flex: 0 0 32%;
    min-height: 250px;
    border: 1px solid ${ContentsBorderColor};
    border-radius: 12px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '1%' })}
    position: relative;
    margin-bottom: 1%;
`

const CloseIconContainer = styled.div`
    position: absolute;
    right: 4px;
    top: 0;
    width: 30px;
    height: 30px;
    padding: 6px;
    cursor: pointer;
`

const CloseIcon = styled.img`
    width: 100%;
    height: 100%;
`

const ThumbnailContainer = styled.div`
    border: 1px solid ${ContentsBorderColor};
    flex: 0 0 250px;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    & img {
        object-fit: fill;
    }
    ${globalStyles.flex()}
`

const ContentsContainer = styled.div`
    flex: 1;
    height: 100%;
    padding: 18px 0 0 0;
    ${globalStyles.flex({gap: '8px'})}
`

const TagsContainer = styled.div`
    flex: 0 0 28px;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const Tag = styled.div`
    background-color: ${ButtonInActiveBackgroundColor};
    padding: 2px 10px;
    border: 0.5pt solid ${ButtonActiveBackgroundColor};
    border-radius: 16px;
`

const SubContentsContainer = styled.div`
    width: 100%;
    flex: 1;
    ${globalStyles.flex({justifyContent:'flex-start', alignItems:'flex-start', gap: '6px'})}
`

const SubContentRowContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}

`

const SubContentTitle = styled.div`
    flex: 0 0 100px;
    text-align: end;
`
const SubContentSeparator = styled.div`
    flex: 0 0 2px;
`
const SubContentContent = styled.div`
    flex: 1;
`

const DownloadBtn = styled(Button)`
    width: 100%;
`