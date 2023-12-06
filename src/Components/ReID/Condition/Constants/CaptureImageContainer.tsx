import { useEffect, useState } from "react"
import { CaptureResultListItemType, CaptureResultType, CaptureType, PointType } from "../../../../Constants/GlobalTypes"
import styled from "styled-components"
import { GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import CaptureOptionDropdown from "../../../ReID/Condition/TargetSelect/CaptureOptionDropdown"
import { Axios } from "../../../../Functions/NetworkFunctions"
import { AutoCaptureApi } from "../../../../Constants/ApiRoutes"
import { ConvertWebImageSrcToServerBase64ImageSrc } from "../../../../Functions/GlobalFunctions"
import ImageViewWithCanvas from "./ImageViewWithCanvas"
import searchIcon from "../../../../assets/img/searchIcon.png"
import { useRecoilState, useRecoilValue } from "recoil"
import useMessage from "../../../../Hooks/useMessage"
import { conditionSelectedType, conditionTargetDatasCCTVTemp, conditionTargetDatasImageTemp } from "../../../../Model/ConditionDataModel"

type CaptureContainerProps = {
    src?: string
    captureCallback?: (val: CaptureResultListItemType[]) => void
    type: "CCTV" | "IMAGE"
}

const CaptureImageContainer = ({ src, captureCallback, type }: CaptureContainerProps) => {
    const [captureType, setCaptureType] = useState<CaptureType>('auto')
    const [userCaptureOn, setUserCaptureOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [globalTargetList, setGlobalTargetList] = useRecoilState(type === 'CCTV' ? conditionTargetDatasCCTVTemp : conditionTargetDatasImageTemp)
    const [captureResults, setCaptureResults] = useState<CaptureResultType[]>([])
    const objType = useRecoilValue(conditionSelectedType)
    const message = useMessage()

    useEffect(() => {
        if (captureType === 'user') setUserCaptureOn(true)
        else setUserCaptureOn(false)
    }, [captureType])

    return <DetailMiddleContainer>
        <ImageViewWithCanvas
            userCaptureOn={userCaptureOn}
            captureType={captureType}
            src={src}
            type={type}
            captureResult={captureResults}
            captureCallback={captureCallback}
            containerStyle={{
                backgroundColor: GlobalBackgroundColor,
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: src ? 'auto' : '300px',
                overflow: 'hidden'
            }} />
        <DetailMiddleCaptureContainer>
            <DetailMiddleCaptureActionContainer>
                <Button hover activate={captureType === 'auto'} onClick={() => {
                    setCaptureType('auto')
                }}>
                    자동 탐지
                </Button>
                <Button hover activate={captureType === 'user'} onClick={() => {
                    setCaptureType('user')
                }}>
                    사용자 지정
                </Button>
            </DetailMiddleCaptureActionContainer>
            <DetailMiddleCaptureDescriptionContainer>
                {
                    captureType === 'auto' ? <DetailMiddleCaptureDescriptionInnerContainer>
                        <DetailMiddleCaptureActionExecuteButton hover disabled={loading} onClick={async () => {
                            if (!src) return message.preset('WRONG_PARAMETER', '캡쳐 이미지가 존재하지 않습니다.')
                            setLoading(true)
                            const result: CaptureResultType[] = await Axios("POST", AutoCaptureApi, { image: ConvertWebImageSrcToServerBase64ImageSrc(src!), type: objType })
                            if (result) {
                                setCaptureResults(result.map(_ => ({
                                    ..._,
                                    isAutoCapture: captureType === 'auto'
                                })))
                            }
                            setLoading(false)
                        }}>
                            <img src={searchIcon} style={{ height: '20px' }} />대상 조회
                        </DetailMiddleCaptureActionExecuteButton>
                        <div>
                            위 버튼을 클릭 후<br />조회할 대상을 선택해주세요.
                        </div>
                    </DetailMiddleCaptureDescriptionInnerContainer> : <DetailMiddleCaptureDescriptionInnerContainer>
                        <div>
                            좌측 캡쳐 이미지에서 드래그 하여<br />대상을 지정해주세요.
                        </div>
                    </DetailMiddleCaptureDescriptionInnerContainer>
                }
            </DetailMiddleCaptureDescriptionContainer>
        </DetailMiddleCaptureContainer>
    </DetailMiddleContainer>
}

export default CaptureImageContainer

const DetailMiddleContainer = styled.div`
    margin-bottom: 16px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    gap: 8px;
`

const DetailMiddleCaptureContainer = styled.div`
    flex: 0 0 50%;
    height: 100%;
    ${globalStyles.flex({ gap: '6px' })}
`

const DetailMiddleCaptureActionContainer = styled.div`
    height: 40px;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    & > button {
        height: 100%;
        flex: 1;
        &:first-child {
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            border-right: none;
        }
        &:last-child {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            border-left: none;
        }
    }
`

const DetailMiddleCaptureDescriptionContainer = styled.div`
    width: 100%;
    height: calc(100% - 40px);
    background-color: ${GlobalBackgroundColor};
    border-radius: 10px;
    padding: 12px 16px;
`

const DetailMiddleCaptureActionExecuteButton = styled(Button)`
    flex: 0 0 40px;
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

const DetailMiddleCaptureDescriptionInnerContainer = styled.div`
    ${globalStyles.flex({ gap: '24px' })}
    height: 100%;
    & > div {
        text-align: center;
        font-size: 1.2rem;
        line-height: 28px;
    }
`