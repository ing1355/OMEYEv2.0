import { useEffect, useState } from "react"
import { CaptureResultListItemType, CaptureResultType, CaptureType, PointType } from "../../../../Constants/GlobalTypes"
import styled from "styled-components"
import { SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import CaptureOptionDropdown from "../../../ReID/Condition/TargetSelect/CaptureOptionDropdown"
import { Axios } from "../../../../Functions/NetworkFunctions"
import { AutoCaptureApi } from "../../../../Constants/ApiRoutes"
import { ConvertWebImageSrcToServerBase64ImageSrc } from "../../../../Functions/GlobalFunctions"
import ImageViewWithCanvas from "./ImageViewWithCanvas"
import searchIcon from "../../../../assets/img/searchIcon.png"
import { useRecoilValue } from "recoil"
import useMessage from "../../../../Hooks/useMessage"
import { conditionSelectedType, conditionTargetDatasCCTVTemp, conditionTargetDatasImageTemp } from "../../../../Model/ConditionDataModel"

type CaptureContainerProps = {
    src?: string
    captureCallback?: (val: CaptureResultListItemType[]) => void
    type: "CCTV" | "IMAGE"
}

const isSamePoint = (p1: PointType, p2: PointType) => {
    return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2] && p1[3] === p2[3]
}

const CaptureImageContainer = ({ src, captureCallback, type }: CaptureContainerProps) => {
    const [captureType, setCaptureType] = useState<CaptureType>('auto')
    const [userCaptureOn, setUserCaptureOn] = useState(false)
    const [captureResults, setCaptureResults] = useState<CaptureResultType[]>([])
    const [loading, setLoading] = useState(false)
    const globalTargetList = useRecoilValue(type === 'CCTV' ? conditionTargetDatasCCTVTemp : conditionTargetDatasImageTemp)
    const objType = useRecoilValue(conditionSelectedType)
    const message = useMessage()

    useEffect(() => {
        if(captureResults.length > 0) {
            const selectedTargetList = globalTargetList.filter(_ => _.selected)
            setCaptureResults(captureResults.map(_ => ({
                ..._,
                isSelected: selectedTargetList.some(__ => isSamePoint(__.points || [0,0,0,0], _.points as PointType))
            })))
        }
    },[globalTargetList])
    
    return <DetailMiddleContainer>
        <ImageViewWithCanvas
            userCaptureOn={userCaptureOn}
            captureType={captureType}
            src={src}
            type={type}
            captureResult={captureResults}
            captureCallback={captureCallback}
            containerStyle={{
                backgroundColor: SectionBackgroundColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '50%',
                height: src ? 'auto' : '300px'
            }} />
        <DetailMiddleCaptureContainer>
            <DetailMiddleCaptureActionContainer>
                <CaptureOptionDropdown onChange={(val) => {
                    setCaptureType(val)
                }} />
                <DetailMiddleCaptureActionExecuteButton hover disabled={loading} onClick={async () => {
                    if (!src) return message.preset('WRONG_PARAMETER', '캡쳐 이미지가 존재하지 않습니다.')
                    if (captureType === 'auto') {
                        setLoading(true)
                        const result = await Axios("POST", AutoCaptureApi, { image: ConvertWebImageSrcToServerBase64ImageSrc(src!), type: objType })
                        if (result) setCaptureResults(result)
                        setLoading(false)
                    } else {
                        setUserCaptureOn(true)
                    }
                }}>
                    <img src={searchIcon} style={{ height: '20px' }} />{captureType === 'auto' ? '대상 조회' : '직접 선택'}
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
    margin-bottom: 16px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' })}
`

const DetailMiddleCaptureContainer = styled.div`
    flex: 0 0 50%;
    height: 100%;
`

const DetailMiddleCaptureActionContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const DetailMiddleCaptureDescriptionContainer = styled.div`
`

const DetailMiddleCaptureActionExecuteButton = styled(Button)`
    flex: 0 0 50%;
    height: 40px;
    font-size: 1.1rem;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
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