import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Button from "../../Constants/Button"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { ContentsBorderColor, globalStyles } from "../../../styles/global-styled"
import { VideoExportMaskingType, VideoExportRowDataType } from "../../../Model/VideoExportDataModel"
import Input from "../../Constants/Input"
import InfoIcon from '../../../assets/img/infoIcon.png'
import { Axios } from "../../../Functions/NetworkFunctions"
import { GetThumbnailImageApi } from "../../../Constants/ApiRoutes"
import { CameraDataType, TimeDataType } from "../../../Constants/GlobalTypes"

type OptionSelectProps = {
    defaultValue?: VideoExportRowDataType
    visible: boolean
    complete: (opts: VideoExportRowDataType['options']) => void
    close: () => void
}

type OptionContentsContainerProps = PropsWithChildren & {
    className?: string
}

type minMaxCoordType = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};

type XYCoordsType = [number, number];
type CanvasCoordsType = Array<XYCoordsType>;

let currentAreaCoord: CanvasCoordsType = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
];

const targetCornerDistance = 15;
var isMovable = false;
var isMoveClicked = false;
var isResizeClicked = false;
var isResizePoint = 0;
var tempX = 0;
var tempY = 0;

const checkCrossPoint = (
    AP1: XYCoordsType,
    AP2: XYCoordsType,
    BP1: XYCoordsType,
    BP2: XYCoordsType
) => {
    // 두 선의 교점 찾기 true일 시 교점 존재 false일 시 교점 없음
    const under =
        (BP2[1] - BP1[1]) * (AP2[0] - AP1[0]) -
        (BP2[0] - BP1[0]) * (AP2[1] - AP1[1]);
    if (under === 0) return false; // 평행
    const _t =
        (BP2[0] - BP1[0]) * (AP1[1] - BP1[1]) -
        (BP2[1] - BP1[1]) * (AP1[0] - BP1[0]);
    const _s =
        (AP2[0] - AP1[0]) * (AP1[1] - BP1[1]) -
        (AP2[1] - AP1[1]) * (AP1[0] - BP1[0]);
    const t = _t / under;
    const s = _s / under;
    if (t < 0 || t > 1 || s < 0 || s > 1) {
        return false; // 교점 없음
    }
    return true; // 교점 있음
};

const getDistanceTwoPoint = (p1: XYCoordsType, p2: XYCoordsType) => {
    const result = Math.sqrt(
        Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)
    );
    return result;
};

const getFourPointsByCurrentAreaCoord = () => {
    const left = currentAreaCoord[0][0]
    const top = currentAreaCoord[0][1]
    const right = currentAreaCoord[1][0]
    const bottom = currentAreaCoord[2][1]
    return { left, top, right, bottom }
}

const OptionContentsContainer = ({ className, children }: OptionContentsContainerProps) => {
    return <ContentsContainer className={className}>
        {children}
    </ContentsContainer>
}

const defaultOptions: VideoExportRowDataType['options'] = {
    masking: [],
    points: undefined,
    password: ''
}

const centerBoxDistance = 100

const drawRectToCavnasByWidthHeight = (canvas: HTMLCanvasElement, left: number, top: number, width: number, height: number) => {
    currentAreaCoord = [[left, top], [left + width, top], [left + width, top + height], [left, top + height]]
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.rect(left, top, width, height)
    ctx.stroke();
}

const drawRectToCanvasByPoints = (canvas: HTMLCanvasElement, points: CanvasCoordsType) => {
    currentAreaCoord = points
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
    ctx.strokeStyle = "red"
    points.forEach((coord, ind, arr) => {
        if (ind === 0) {
            ctx.moveTo(coord[0], coord[1]);
        } else if (ind === arr.length - 1) {
            ctx.lineTo(coord[0], coord[1]);
            ctx.lineTo(arr[0][0], arr[0][1]);
        } else {
            ctx.lineTo(coord[0], coord[1]);
        }
    });
    ctx.stroke();
}

const OptionSelect = ({ visible, close, defaultValue, complete }: OptionSelectProps) => {
    const [options, setOptions] = useState<VideoExportRowDataType['options']>(defaultOptions)
    const [passwordSet, setPasswordSet] = useState(false)
    const [thumbnailSrc, setThumbnailSrc] = useState('')
    const [thumbnailInfo, setThumbnailInfo] = useState<null | {
        width: number
        height: number
    }>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const rectCanvasRef = useRef<HTMLCanvasElement>(null)

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
                setThumbnailInfo({
                    width: naturalWidth,
                    height: naturalHeight
                })
                if (imgRef.current && rectCanvasRef.current) {
                    rectCanvasRef.current.width = width
                    rectCanvasRef.current.height = height
                    const center_x = width / 2
                    const center_y = height / 2
                    const initWidthHeight = centerBoxDistance / 2
                    drawRectToCavnasByWidthHeight(rectCanvasRef.current, center_x - initWidthHeight, center_y - initWidthHeight, centerBoxDistance, centerBoxDistance)
                }
            }
        }
    }, [thumbnailSrc])

    useEffect(() => {
        if (visible) {
            if (defaultValue) {
                getThumbnailImage(defaultValue.cctvId!, defaultValue.time!.startTime)
                if (defaultValue.options) {
                    setOptions(defaultValue.options)
                    if (defaultValue.options.password) setPasswordSet(true)
                }
            }
        } else {
            setOptions(defaultOptions)
        }
    }, [visible, defaultValue])

    const onMouseOutEventCallback = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isResizeClicked) {
            let temp = [...currentAreaCoord];
            let result_temp: CanvasCoordsType = [];
            temp.sort((a, b) => a[1] - b[1]);
            if (temp[0][0] < temp[1][0]) {
                result_temp.push(temp[0]);
                result_temp.push(temp[1]);
            } else {
                result_temp.push(temp[1]);
                result_temp.push(temp[0]);
            }
            if (temp[2][0] < temp[3][0]) {
                result_temp.push(temp[3]);
                result_temp.push(temp[2]);
            } else {
                result_temp.push(temp[2]);
                result_temp.push(temp[3]);
            }
            drawRectToCanvasByPoints(rectCanvasRef.current!, [...result_temp]);
        }
        isMoveClicked = false;
        isResizeClicked = false;
        e.currentTarget.style.cursor = "default";
        isMovable = false;
    };

    const maskingOptionChange = (type: VideoExportMaskingType) => {
        if (masking.includes(type)) setOptions({ ...options, masking: masking.filter(_ => _ !== type) })
        else setOptions({ ...options, masking: masking.concat(type) })
    }

    return <Modal complete={() => {
        let temp = { ...options! }
        if (!passwordSet) temp['password'] = undefined
        if (masking.includes('area')) {
            const { width, height } = thumbnailInfo!
            const resolution_x = width / rectCanvasRef.current!.width
            const resolution_y = height / rectCanvasRef.current!.height
            // temp['points'] = currentAreaCoord.flatMap(_ => [_[0] * resolution_x > width ? width : (_[0] * resolution_x < 0 ? 0 : _[0] * resolution_x), _[1] * resolution_y > height ? height : (_[1] * resolution_y < 0 ? 0 : _[1] * resolution_y)])
        }
        // else if (temp['points']) delete temp['points']
        console.debug("video export option select : ", temp)
        complete(temp)
    }} visible={visible} close={close} title="옵션 선택">
        <OptionsModalContainer>
            <OptionsTitle>
                비식별화
                <MaskingInfoIcon src={InfoIcon} />
            </OptionsTitle>
            <OptionContentsContainer>
                <MaskingBtnContainer>
                    <MaskingBtn hover activate={masking.includes("area")} onClick={() => {
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
                    <RectCanvas ref={rectCanvasRef}
                        onMouseDown={e => {
                            let canvasRect = e.currentTarget.getBoundingClientRect();
                            tempX = e.clientX - canvasRect.left;
                            tempY = e.clientY - canvasRect.top;
                            if (e.currentTarget.style.cursor.includes("resize")) {
                                isResizeClicked = true;
                            } else if (isMovable) {
                                isMoveClicked = true;
                            }
                        }}
                        onMouseUp={onMouseOutEventCallback}
                        onMouseLeave={onMouseOutEventCallback}
                        onMouseMove={e => {
                            const canvas = e.currentTarget;
                            let canvasRect = canvas.getBoundingClientRect();
                            const mouseX = e.clientX - canvasRect.left;
                            const mouseY = e.clientY - canvasRect.top;
                            const mousePoint: XYCoordsType = [mouseX, mouseY];
                            const { width, height } = canvasRect;
                            if (mouseX > width || mouseX < 0) return onMouseOutEventCallback;
                            if (isMoveClicked) {
                                let changeTempX = mouseX - tempX;
                                let changeTempY = mouseY - tempY;
                                tempX = mouseX;
                                tempY = mouseY;
                                let { left, top, right, bottom } = getFourPointsByCurrentAreaCoord()
                                left = left + changeTempX < 0 ? 0 : left + changeTempX
                                top = top + changeTempY < 0 ? 0 : top + changeTempY
                                right = right + changeTempX > width ? width : right + changeTempX
                                bottom = bottom + changeTempY > height ? height : bottom + changeTempY
                                drawRectToCavnasByWidthHeight(canvas, left, top, right - left, bottom - top);
                            } else if (isResizeClicked) {
                                const _x = mouseX - tempX
                                const _y = mouseY - tempY
                                tempX = mouseX;
                                tempY = mouseY;
                                drawRectToCanvasByPoints(canvas, currentAreaCoord.map((_, ind) => ind === isResizePoint ? [
                                    _[0] + _x < 0 ? 0 : (_[0] + _x > width ? width : _[0] + _x),
                                    _[1] + _y < 0 ? 0 : (_[1] + _y > height ? height : _[1] + _y),
                                ] : _))
                            }
                            if (!isMoveClicked) {
                                if (
                                    getDistanceTwoPoint(mousePoint, currentAreaCoord[0]) <
                                    targetCornerDistance
                                ) {
                                    canvas.style.cursor = "nw-resize";
                                    isResizePoint = 0;
                                } else if (
                                    getDistanceTwoPoint(mousePoint, currentAreaCoord[1]) <
                                    targetCornerDistance
                                ) {
                                    canvas.style.cursor = "ne-resize";
                                    isResizePoint = 1;
                                } else if (
                                    getDistanceTwoPoint(mousePoint, currentAreaCoord[2]) <
                                    targetCornerDistance
                                ) {
                                    canvas.style.cursor = "se-resize";
                                    isResizePoint = 2;
                                } else if (
                                    getDistanceTwoPoint(mousePoint, currentAreaCoord[3]) <
                                    targetCornerDistance
                                ) {
                                    canvas.style.cursor = "sw-resize";
                                    isResizePoint = 3;
                                } else {
                                    const { minX, minY, maxX, maxY } =
                                        currentAreaCoord.reduce(
                                            (pre: minMaxCoordType, cur: XYCoordsType) => {
                                                const result: minMaxCoordType = {
                                                    minX: 0,
                                                    minY: 0,
                                                    maxX: 0,
                                                    maxY: 0,
                                                };
                                                result.minX =
                                                    pre.minX < cur[0] ? pre.minX : cur[0];
                                                result.maxX =
                                                    pre.maxX > cur[0] ? pre.maxX : cur[0];
                                                result.minY =
                                                    pre.minY < cur[1] ? pre.minY : cur[1];
                                                result.maxY =
                                                    pre.maxY > cur[1] ? pre.maxY : cur[1];
                                                return result;
                                            },
                                            { minX: 9999, maxX: 0, minY: 9999, maxY: 0 }
                                        );
                                    if (
                                        mouseX < maxX &&
                                        mouseX > minX &&
                                        mouseY < maxY &&
                                        mouseY > minY
                                    ) {
                                        const tempLine: CanvasCoordsType = [
                                            [mouseX, mouseY],
                                            [canvasRect.right, mouseY],
                                        ];
                                        const result = checkCrossPoint(
                                            currentAreaCoord[0],
                                            currentAreaCoord[3],
                                            tempLine[0],
                                            tempLine[1]
                                        ); // 왼쪽선
                                        const result2 = checkCrossPoint(
                                            currentAreaCoord[1],
                                            currentAreaCoord[2],
                                            tempLine[0],
                                            tempLine[1]
                                        ); // 오른쪽선
                                        if (!result && result2) {
                                            canvas.style.cursor = "move";
                                            if (!isMovable) isMovable = true;
                                        } else {
                                            canvas.style.cursor = "default";
                                            isMovable = false;
                                        }
                                    } else {
                                        canvas.style.cursor = "default";
                                        isMovable = false;
                                    }
                                }
                            }
                        }} />
                    {thumbnailSrc && <img ref={imgRef} src={"data:image/jpeg;base64," + thumbnailSrc} width="100%" height="100%" />}
                <ClearBtn hover>
                    초기화
                </ClearBtn>
                </AreaMaskingImgContainer>
            </OptionContentsContainer>
            <OptionsTitle>
                암호화(비밀번호 설정)
            </OptionsTitle>
            <EncryptContentsContainer>
                비밀번호 :
                <EncryptInput value={options?.password || ''} maxLength={24} onChange={val => {
                    setOptions({ ...options!, password: val })
                }} type="password" disabled={passwordSet} />
                <EncryptBtn activate={!passwordSet} onClick={() => {
                    setPasswordSet(!passwordSet)
                }}>
                    {passwordSet ? "해제" : "적용"}
                </EncryptBtn>
            </EncryptContentsContainer>
        </OptionsModalContainer>
    </Modal>
}

export default OptionSelect

const OptionsModalContainer = styled.div`
    width: 600px;
    height: 540px;
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

const MaskingInfoIcon = styled.img`
    height: 80%;
    cursor: pointer;
`

const AreaMaskingImgContainer = styled.div<{ visible: boolean }>`
    transition: height .25s ease-out;
    height: ${({ visible }) => visible ? 363 : 0}px;
    margin-top: 8px;
    & > img {
        height: 330px;
    }
    overflow: hidden;
    position: relative;
    ${globalStyles.flex()}
`

const RectCanvas = styled.canvas`
    position: absolute;
`

const ClearBtn = styled(Button)`
    width: 100%;
    margin-top: 8px;
`