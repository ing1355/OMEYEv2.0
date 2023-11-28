import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Button from "../../Constants/Button"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { ContentsBorderColor, InputBackgroundColor, globalStyles } from "../../../styles/global-styled"
import { VideoExportMaskingType, VideoExportRowDataType } from "../../../Model/VideoExportDataModel"
import Input from "../../Constants/Input"
import InfoIcon from '../../../assets/img/infoIcon.png'
import leftClickIcon from '../../../assets/img/leftClickIcon.png'
import rightClickIcon from '../../../assets/img/rightClickIcon.png'
import { Axios } from "../../../Functions/NetworkFunctions"
import { GetThumbnailImageApi } from "../../../Constants/ApiRoutes"
import { CameraDataType, TimeDataType } from "../../../Constants/GlobalTypes"
import useMessage from "../../../Hooks/useMessage"

type OptionSelectProps = {
    defaultValue?: VideoExportRowDataType
    visible: boolean
    complete: (opts: VideoExportRowDataType['options']) => void
    close: () => void
}

type OptionContentsContainerProps = PropsWithChildren & {
    className?: string
}

const OptionContentsContainer = ({ className, children }: OptionContentsContainerProps) => {
    return <ContentsContainer className={className}>
        {children}
    </ContentsContainer>
}

const defaultOptions: VideoExportRowDataType['options'] = {
    masking: [],
    points: [],
    password: '',
    description: ''
}

const OptionSelect = ({ visible, close, defaultValue, complete }: OptionSelectProps) => {
    const [options, setOptions] = useState<VideoExportRowDataType['options']>(defaultOptions)
    const [passwordSet, setPasswordSet] = useState(false)
    const [thumbnailSrc, setThumbnailSrc] = useState('')
    const [thumbnailInfo, setThumbnailInfo] = useState<null | {
        width: number
        height: number
    }>(null)
    const [submitPoints, setSubmitPoints] = useState<number[][][]>([])
    const [clickPoints, setClickPoints] = useState<number[][]>([])
    const imgRef = useRef<HTMLImageElement>(null)
    const rectCanvasRef = useRef<HTMLCanvasElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const message = useMessage()

    const { masking, points } = options!

    const getThumbnailImage = async (cctvId: CameraDataType['cameraId'], startTime: TimeDataType['startTime']) => {
        const res = await Axios('GET', GetThumbnailImageApi, {
            cameraId: cctvId,
            startTime
        })
        if (res) setThumbnailSrc(res)
    }

    useEffect(() => {
        if (options) {
            // if (options.masking === 'area') { // 영역 비식별화 선택 시

            // }
        }
    }, [options])

    useEffect(() => {
        if (thumbnailSrc) {
            imgRef.current!.onload = () => {
                const { width, height, clientWidth, clientHeight, naturalWidth, naturalHeight } = imgRef.current!
                console.debug("썸네일 영상 사이즈(width, height): ", naturalWidth, naturalHeight)
                setThumbnailInfo({
                    width: naturalWidth,
                    height: naturalHeight
                })
                if (imgRef.current && rectCanvasRef.current) {
                    rectCanvasRef.current.width = naturalWidth
                    rectCanvasRef.current.height = naturalHeight
                }
            }
        }
    }, [thumbnailSrc])

    useEffect(() => {
        console.debug("Option Select Defaultvalue : ", defaultValue)
        if (visible) {
            if (defaultValue) {
                if(defaultValue.cctvId && defaultValue.time) getThumbnailImage(defaultValue.cctvId!, defaultValue.time!.startTime)
                if (defaultValue.options) {
                    setOptions(defaultValue.options)
                    if (defaultValue.options.password) setPasswordSet(true)
                    if (defaultValue.options.points) setSubmitPoints(defaultValue.options.points)
                }
            }
        } else {
            setClickPoints([])
            setSubmitPoints([])
            setPasswordSet(false)
            setOptions(defaultOptions)
        }
    }, [visible, defaultValue])

    const maskingOptionChange = (type: VideoExportMaskingType) => {
        if (masking.includes(type)) setOptions({ ...options, masking: masking.filter(_ => _ !== type) })
        else setOptions({ ...options, masking: masking.concat(type) })
    }

    useEffect(() => {
        if (rectCanvasRef.current) {
            const canvas = rectCanvasRef.current
            const ctx = canvas.getContext('2d')!;
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            if (clickPoints.length > 0) {
                ctx.beginPath()
                ctx.lineWidth = 8;
                ctx.strokeStyle = "black"
                clickPoints.forEach(_ => {
                    ctx.arc(_[0], _[1], 5, 0, 2 * Math.PI, true)
                })
                ctx.stroke()
                ctx.closePath()
            }
            if (submitPoints.length > 0) {
                ctx.beginPath()
                ctx.fillStyle = "black"
                submitPoints.forEach(_ => {
                    _.forEach((__, ind) => {
                        if (ind === 0) {
                            ctx.moveTo(__[0], __[1])
                        } else {
                            ctx.lineTo(__[0], __[1])
                        }
                    })
                })
                ctx.fill()
                ctx.closePath()
            }
        }
    }, [clickPoints, submitPoints])
    
    return <Modal complete={() => {
        if(options.masking.includes('area') && submitPoints.length === 0) {
            message.error({title: "입력값 에러", msg:"비식별화 할 영역이 선택되지 않았습니다.\n영역을 지정하거나 영역 비식별화를 해제해주세요."})
            return true
        }
        let temp = { ...options }
        if (!passwordSet) temp['password'] = ""
        if (masking.includes('area')) {
            temp['points'] = submitPoints
            // temp['points'] = submitPoints.map(_ => _.flatMap(__ => __.map((___, ind) => {
            //     if(ind === 0) {
            //         const x = ___
            //         return x > width ? width : (x < 0 ? 0 : x)
            //     } else {
            //         const y = ___
            //         return y > height ? height : (y < 0 ? 0 : y)
            //     }
            // })))
        }
        // else if (temp['points']) delete temp['points']
        complete(temp)
    }} visible={visible} close={close} title="옵션 선택">
        <OptionsModalContainer>
            <OptionsTitle>
                비식별화
                <MaskingInfoIcon src={InfoIcon} />
            </OptionsTitle>
            <OptionContentsContainer>
                <MaskingBtnContainer>
                    <MaskingBtn hover disabled={!defaultValue?.cctvId && !defaultValue?.time} activate={masking.includes("area")} onClick={() => {
                        maskingOptionChange("area")
                    }}>
                        영역 비식별화
                    </MaskingBtn>
                    <MaskingBtn hover activate={masking.includes("head")} onClick={() => {
                        maskingOptionChange("head")
                    }}>
                        얼굴 비식별화
                    </MaskingBtn>
                    <MaskingBtn hover activate={masking?.includes("carplate")} onClick={() => {
                        maskingOptionChange("carplate")
                    }}>
                        번호판 비식별화
                    </MaskingBtn>
                </MaskingBtnContainer>
                <AreaMaskingImgContainer visible={options?.masking.includes('area') || false}>
                    <ImgContainer>
                    <RectCanvas ref={rectCanvasRef} onClick={(e) => {
                        const {left, top, width, height} = e.currentTarget.getBoundingClientRect()
                        const mouseX = e.clientX - left
                        const mouseY = e.clientY - top
                        const resolution_x = rectCanvasRef.current!.width / width
                        const resolution_y = rectCanvasRef.current!.height / height
                        setClickPoints(clickPoints.concat([[mouseX * resolution_x, mouseY * resolution_y]]))
                    }} onContextMenu={e => {
                        e.preventDefault()
                        if(clickPoints.length < 3) return message.error({title: "입력값 에러", msg:"3개 이상의 영역 지정이 필요합니다."})
                        setSubmitPoints(submitPoints.concat([clickPoints]))
                        setClickPoints([])
                    }} />
                    {thumbnailSrc && <img ref={imgRef} src={"data:image/jpeg;base64," + thumbnailSrc} width="100%" height="100%" style={{
                        aspectRatio: '16/9',
                    }}/>}
                    </ImgContainer>
                    <AreaMaskingETCContainer>
                        <MouseImgContainer>
                            <img src={leftClickIcon} />
                            <MouseImgLabel>
                                : 영역 지정
                            </MouseImgLabel>
                        </MouseImgContainer>
                        <MouseImgContainer>
                            <img src={rightClickIcon} />
                            <MouseImgLabel>
                                : 영역 결정
                            </MouseImgLabel>
                        </MouseImgContainer>
                        <ClearBtn hover onClick={() => {
                            setClickPoints([])
                            setSubmitPoints([])
                        }}>
                            초기화
                        </ClearBtn>
                    </AreaMaskingETCContainer>
                </AreaMaskingImgContainer>
            </OptionContentsContainer>
            <OptionsTitle>
                암호화(비밀번호 설정)
            </OptionsTitle>
            <EncryptContentsContainer>
                비밀번호 :
                <EncryptInput value={options.password} maxLength={20} onChange={val => {
                    setOptions({ ...options!, password: val })
                }} type="password" disabled={passwordSet} />
                <EncryptBtn activate={!passwordSet} onClick={() => {
                    if(!options.password) return message.error({title: "입력값 에러", msg:"비밀번호를 입력해주세요."})
                    setPasswordSet(!passwordSet)
                }}>
                    {passwordSet ? "해제" : "적용"}
                </EncryptBtn>
            </EncryptContentsContainer>
            <OptionsTitle>
                비고
            </OptionsTitle>
            <DescriptionContainer onClick={() => {
                if(inputRef.current) inputRef.current.focus()
            }}>
                <DescriptionInput value={options.description} maxLength={100} onChange={val => {
                    setOptions({ ...options!, description: val })
                }} type="textarea" placeholder="설명을 입력해주세요. (100자 이내)" inputRef={inputRef}
                style={{
                    pointerEvents: 'all'
                }}/>
            </DescriptionContainer>
        </OptionsModalContainer>
    </Modal>
}

export default OptionSelect

const OptionsModalContainer = styled.div`
    width: 600px;
    height: 740px;
    overflow-y: auto;
`

const OptionsTitle = styled.div`
    padding: 0 12px 4px 0;
    border-bottom: 1px solid ${ContentsBorderColor};
    height: 32px;
    font-size: 1.1rem;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent: 'flex-start' })}
`

const ContentsContainer = styled.div`
    padding: 16px 12px;
`

const MaskingBtnContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const MaskingBtn = styled(Button)`
    flex: 0 0 33%;
`

const EncryptContentsContainer = styled(OptionContentsContainer)`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 58px;
`

const EncryptInput = styled(Input)`
    height: 100%;
    color: white;
    flex: 1;
`

const EncryptBtn = styled(Button)`
    flex: 0 0 80px;
`

const DescriptionContainer = styled.div`
    width: 100%;
    max-height: 140px;
    height: 140px;
    background-color: ${InputBackgroundColor};
    border-radius: 12px;
    ${globalStyles.flex({flexDirection:'row'})}
    margin-top: 8px;
    cursor: pointer;
`

const DescriptionInput = styled(Input)`
    height: 100%;
    flex: 1;
    pointer-events: none;
`

const MaskingInfoIcon = styled.img`
    height: 80%;
    cursor: pointer;
`

const AreaMaskingImgContainer = styled.div<{ visible: boolean }>`
    transition: height .25s ease-out;
    height: ${({ visible }) => visible ? 363 : 0}px;
    margin-top: 8px;
    overflow: hidden;
    position: relative;
    ${globalStyles.flex()}
`

const ImgContainer = styled.div`
    position: relative;
    height: 330px;
`

const RectCanvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    aspectRatio: 16/9
`

const AreaMaskingETCContainer = styled.div`
    height: 36px;
    margin-top: 8px;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const ClearBtn = styled(Button)`
    width: 100%;
    flex: 1;
`

const MouseImgContainer = styled.div`
    height: 100%;
    flex: 0 0 100px;
    padding: 2px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
    & > img {
        flex: 1;
        height: 100%;
    }
`

const MouseImgLabel = styled.div`
    flex: 0 0 72px;
    font-size: 0.9rem;
`