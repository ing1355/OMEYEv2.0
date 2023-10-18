import { useState } from "react"
import { CaptureResultListItemType, CaptureResultType, CaptureType } from "../../../../Constants/GlobalTypes"
import styled from "styled-components"
import { SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import CaptureOptionDropdown from "../../../ReID/Condition/TargetSelect/CaptureOptionDropdown"
import { Axios } from "../../../../Functions/NetworkFunctions"
import { AutoCaptureApi } from "../../../../Constants/ApiRoutes"
import { ConvertWebImageSrcToServerBase64ImageSrc } from "../../../../Functions/GlobalFunctions"
import ImageViewWithCanvas from "./ImageViewWithCanvas"
import searchIcon from "../../../../assets/img/searchIcon.png"

type CaptureContainerProps = {
    src?: string
    captureCallback?: (val: CaptureResultListItemType[]) => void
}

const CaptureImageContainer = ({src, captureCallback}: CaptureContainerProps) => {
    const [captureType, setCaptureType] = useState<CaptureType>('auto')
    const [captureResults, setCaptureResults] = useState<CaptureResultType[]>([])
    
    return <DetailMiddleContainer>
        <ImageViewWithCanvas captureType={captureType} src={src} style={{
            flex: 1,
            height: '100%',
            backgroundColor: SectionBackgroundColor
        }} captureResult={captureResults} captureCallback={captureCallback}/>
        <DetailMiddleCaptureContainer>
            <DetailMiddleCaptureActionContainer>
                <CaptureOptionDropdown onChange={(val) => {
                    setCaptureType(val)
                }} />
                <DetailMiddleCaptureActionExecuteButton onClick={async () => {
                    if(!src) return console.log('이미지 없음!!')
                    if(captureType === 'auto') {
                        const result = await Axios("POST", AutoCaptureApi, {image: ConvertWebImageSrcToServerBase64ImageSrc(src!)})
                        if(result) setCaptureResults(result)
                    }
                }}>
                    <>
                        <img src={searchIcon} style={{height: '20px'}}/>{captureType === 'auto' ? '대상 조회' : '직접 선택'}
                    </>
                </DetailMiddleCaptureActionExecuteButton>
            </DetailMiddleCaptureActionContainer>
            <DetailMiddleCaptureDescriptionContainer>
                <DetailMiddleCaptureDescriptionRow>
                    <DetailMiddleCaptureDescriptionCol>
                        &#183;
                    </DetailMiddleCaptureDescriptionCol>
                    <DetailMiddleCaptureDescriptionCol>
                        자동탐지 시
                    </DetailMiddleCaptureDescriptionCol>
                </DetailMiddleCaptureDescriptionRow>
                <DetailMiddleCaptureDescriptionRow>
                    <DetailMiddleCaptureDescriptionCol>

                    </DetailMiddleCaptureDescriptionCol>
                    <DetailMiddleCaptureDescriptionCol style={{
                        paddingLeft: '8px',
                        fontSize: '.9rem',
                        wordBreak: 'keep-all'
                    }}>
                        AI 분석 서버가 이미지를 분석하여 객체를 자동으로 탐지합니다.
                    </DetailMiddleCaptureDescriptionCol>
                </DetailMiddleCaptureDescriptionRow>
                <DetailMiddleCaptureDescriptionRow>
                    <DetailMiddleCaptureDescriptionCol>
                        &#183;
                    </DetailMiddleCaptureDescriptionCol>
                    <DetailMiddleCaptureDescriptionCol>
                        사용자 지정 시
                    </DetailMiddleCaptureDescriptionCol>
                </DetailMiddleCaptureDescriptionRow>
                <DetailMiddleCaptureDescriptionRow>
                    <DetailMiddleCaptureDescriptionCol>

                    </DetailMiddleCaptureDescriptionCol>
                    <DetailMiddleCaptureDescriptionCol style={{
                        paddingLeft: '8px',
                        fontSize: '.9rem',
                        wordBreak: 'keep-all'
                    }}>
                        사용자가 직접 대상을 추측하여 선택합니다.
                    </DetailMiddleCaptureDescriptionCol>
                </DetailMiddleCaptureDescriptionRow>
            </DetailMiddleCaptureDescriptionContainer>
        </DetailMiddleCaptureContainer>
    </DetailMiddleContainer>
}

export default CaptureImageContainer

const DetailMiddleContainer = styled.div`
    height: 350px;
    margin-bottom: 16px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const DetailMiddleCaptureContainer = styled.div`
    flex: 0 0 55%;
    height: 100%;
`

const DetailMiddleCaptureActionContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-around' })}
`

const DetailMiddleCaptureDescriptionContainer = styled.div`
`

const DetailMiddleCaptureActionExecuteButton = styled(Button)`
    flex: 0 0 45%;
    height: 40px;
    font-size: 1.1rem;
    ${globalStyles.flex({flexDirection:'row', gap:'8px'})}
`

const DetailMiddleCaptureDescriptionRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-around' })}
`

const DetailMiddleCaptureDescriptionCol = styled.div`
    &:first-child {
        font-size: 2rem;
        flex: 0 0 10%;
        text-align: center;
    }
    &:last-child {
        font-size: 1.4rem;
        flex: 0 0 90%;
    }
`