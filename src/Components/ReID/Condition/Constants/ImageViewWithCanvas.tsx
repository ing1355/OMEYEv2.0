import styled from "styled-components"
import { useCallback, useEffect, useRef, useState } from "react"
import { CaptureResultListItemType, CaptureResultType, CaptureType, PointType, ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import ImageView from "./ImageView"
import { ObjectTypes } from "../../ConstantsValues"
import { useRecoilValue } from "recoil"
import { selectedConditionObjectType } from "../../../../Model/ConditionDataModel"

type ImageViewProps = {
    src?: string
    style?: React.CSSProperties
    containerStyle?: React.CSSProperties
    captureType: CaptureType
    captureResult: CaptureResultType[]
    captureCallback?: (val: CaptureResultListItemType[]) => void
    userCaptureOn: boolean
}

let targetListId = 0

export const getLastTargetListId = () => {
    return targetListId++
}

function autoCaptureAct(rectCanvas: HTMLCanvasElement, targets: CaptureResultType[]) {
    let ctx = rectCanvas.getContext('2d');

    targets.forEach((target, ind) => {
        const { type, points } = target;
        ctx!.beginPath();
        ctx!.lineWidth = 4;
        drawWithType(rectCanvas, points as PointType, type);
    });
}

function drawWithType(rectCanvas: HTMLCanvasElement, Point: PointType, type: ReIDObjectTypeKeys) {
    let width = Point[2] - Point[0];
    let height = Point[3] - Point[1];
    let ctx = rectCanvas.getContext('2d')!;
    const selectColor = '#f07f3c';
    const _isTarget = false
    switch (type) {
        case ReIDObjectTypeKeys[ObjectTypes['PERSON']]:
            ctx.rect(Point[0], Point[1], width, height);
            if (_isTarget) ctx!.strokeStyle = selectColor;
            else ctx.strokeStyle = '#00F6FF';
            ctx.stroke();
            break;
        case ReIDObjectTypeKeys[ObjectTypes['FACE']]:
            ctx.lineWidth = 3;
            ctx.arc((Point[2] + Point[0]) / 2, (Point[3] + Point[1]) / 2, width > height ? width / 2 : height / 2, 0, Math.PI * 2);
            if (_isTarget) ctx.strokeStyle = selectColor;
            else ctx.strokeStyle = 'yellow';
            ctx.stroke();
            break;
        case ReIDObjectTypeKeys[ObjectTypes['PLATE']]:
            ctx.rect(Point[0], Point[1], width, height);
            if (_isTarget) ctx.strokeStyle = selectColor;
            else ctx.strokeStyle = 'green';
            ctx.stroke();
            break;
        default:
            break;
    }
}

const getImageByCanvas = (width: number, height: number, src: CanvasImageSource, x: number, y: number) => {
    let _canvas = document.createElement('canvas')
    _canvas.width = width
    _canvas.height = height
    let _ctx = _canvas.getContext('2d')!
    _ctx.drawImage(src, x, y, width, height, 0, 0, width, height)
    return _canvas.toDataURL()
}

const ImageViewWithCanvas = ({ src, style, captureResult, captureCallback, captureType, userCaptureOn, containerStyle }: ImageViewProps) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const rectCanvasRef = useRef<HTMLCanvasElement>(null)
    const userCanvasRef = useRef<HTMLCanvasElement>(null)
    const fullScreenRef = useRef<Node>()
    const isClicked = useRef(false)
    const downMouseX = useRef(0)
    const downMouseY = useRef(0)
    const mouseX = useRef(0)
    const mouseY = useRef(0)
    const clickTemp = useRef<number[]>([])
    const currentObjectType = useRecoilValue(selectedConditionObjectType)
    const [imgSize, setImgSize] = useState<number[]>([])

    useEffect(() => {
        if (rectCanvasRef.current) {
            const canvas = rectCanvasRef.current
            let ctx = canvas!.getContext('2d')!;
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        if (userCanvasRef.current) {
            const canvas = userCanvasRef.current
            let ctx = canvas!.getContext('2d')!;
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }, [src])

    const exitFullscreen = useCallback(() => {
        fullScreenRef.current?.removeEventListener('click', exitFullscreen)
        document.body.removeChild(fullScreenRef.current!);
    }, [])

    const drawRectFunc = useCallback((targets: CaptureResultType[]) => {
        rectCanvasRef.current!.getContext('2d')!.clearRect(0, 0, rectCanvasRef.current!.width, rectCanvasRef.current!.height);
        autoCaptureAct(rectCanvasRef.current!, targets);
        let temp: CaptureResultListItemType[] = []
        targets.forEach(_ => {
            const _width = _.points[2] - _.points[0]
            const _height = _.points[3] - _.points[1]
            const start_x = _.points[0]
            const start_y = _.points[1]
            temp.push({
                type: _.type,
                mask: false,
                id: getLastTargetListId(),
                src: getImageByCanvas(_width, _height, imgRef.current!, start_x, start_y)
            })
        })
        if (captureCallback) captureCallback(temp)
    }, [captureCallback])

    useEffect(() => {
        if (captureResult.length > 0) {
            drawRectFunc(captureResult)
        }
    }, [captureResult])

    useEffect(() => {
        if (src) {
            let ctx = rectCanvasRef.current!.getContext('2d');
            ctx!.clearRect(0, 0, rectCanvasRef.current!.width, rectCanvasRef.current!.height);
            const img_temp = new Image();
            img_temp.src = src;
            img_temp.onload = (e) => {
                setImgSize([img_temp.width, img_temp.height])
                const userCanvas = userCanvasRef.current!
                const autoCanvas = rectCanvasRef.current!
                userCanvas.width = img_temp.width
                userCanvas.height = img_temp.height
                autoCanvas.width = img_temp.width
                autoCanvas.height = img_temp.height
            }
        }
    }, [src])

    useEffect(() => {
        if (rectCanvasRef.current) {
            let ctx = rectCanvasRef.current.getContext('2d');
            ctx!.clearRect(0, 0, rectCanvasRef.current.width, rectCanvasRef.current.height);
        }
        if (userCanvasRef.current) {
            let ctx = userCanvasRef.current.getContext('2d')!;
            ctx.clearRect(0, 0, userCanvasRef.current.width, userCanvasRef.current.height);
        }
        isClicked.current = false
    }, [captureType])
    
    return <Container style={{...containerStyle, aspectRatio: `${imgSize[0]}/${imgSize[1]}`}}>
        <ImageView src={src} style={{ ...style }} ref={imgRef} />
        <CanvasContainer style={{
            zIndex: captureType === 'auto' ? (captureResult.length > 0 ? 1002 : 1000) : 1002,
            pointerEvents: captureType === 'user' ? 'auto' : 'none'
        }}>
            <canvas
                ref={rectCanvasRef}
                style={{ position: 'absolute', zIndex: '1', pointerEvents: 'none', width: '100%', height: '100%', visibility: captureType === 'auto' ? 'visible' : 'hidden' }}
            />
            <canvas
                ref={userCanvasRef}
                style={{ 
                    position: 'absolute', 
                    zIndex: '1', 
                    pointerEvents: captureType === 'auto' ? 'none' : 'auto', 
                    cursor: 'crosshair', 
                    width: '100%', 
                    height: '100%', 
                    visibility: (userCaptureOn && captureType === 'user') ? 'visible' : 'hidden' 
                }}
                onMouseDown={(e) => {
                    if (userCaptureOn) {
                        const canvas = e.currentTarget
                        const canvasRect = canvas.getBoundingClientRect();
                        const res_x = canvas.width / canvasRect.width
                        const res_y = canvas.height / canvasRect.height
                        clickTemp.current = [e.screenX, e.screenY]
                        downMouseX.current = (e.clientX - canvasRect.left) * res_x;
                        downMouseY.current = (e.clientY - canvasRect.top) * res_y;
                        const div = document.createElement('div')
                        div.style.position = 'absolute'
                        div.style.width = "100%"
                        div.style.height = "100%"
                        div.style.zIndex = "9999"
                        div.style.cursor = 'crosshair'
                        div.style.top = '0'
                        div.style.left = '0'
                        div.onmousemove = (_e) => {
                            const _x = _e.clientX - canvasRect.left
                            const _y = _e.clientY - canvasRect.top 
                            mouseX.current = (_x < 0 ? 0 : (_x > canvasRect.width ? canvasRect.width : _x)) * res_x;
                            mouseY.current = (_y < 0 ? 0 : (_y > canvasRect.height ? canvasRect.height : _y)) * res_y;
                            let ctx = canvas.getContext('2d')!;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath();
                            let width = mouseX.current - downMouseX.current;
                            let height = mouseY.current - downMouseY.current;
                            ctx.rect(downMouseX.current, downMouseY.current, width, height);
                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = 4;
                            ctx.lineJoin = 'round';
                            ctx.stroke();
                        }
                        div.onmouseup = (_e: MouseEvent) => {
                            const _x = mouseX.current > downMouseX.current ? (mouseX.current - downMouseX.current) : (downMouseX.current - mouseX.current)
                            const _y = mouseY.current > downMouseY.current ? (mouseY.current - downMouseY.current) : (downMouseY.current - mouseY.current)
                            const isMoved = !(clickTemp.current[0] === _e.screenX || clickTemp.current[1] === _e.screenY)
                            if (isMoved && captureCallback) {
                                captureCallback([{
                                    type: currentObjectType!,
                                    mask: false,
                                    id: getLastTargetListId(),
                                    src: getImageByCanvas(_x, _y, imgRef.current!, mouseX.current > downMouseX.current ? downMouseX.current : mouseX.current, mouseY.current > downMouseY.current ? downMouseY.current : mouseY.current)
                                }])
                            }
                            div.remove()
                        }
                        document.body.appendChild(div)
                    }
                }}
            />
        </CanvasContainer>
    </Container>
}

export default ImageViewWithCanvas

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

const CanvasContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    & > canvas {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        object-fit: contain;
    }
`