import styled from "styled-components"
import { useCallback, useEffect, useRef } from "react"
import { CaptureResultListItemType, CaptureResultType, CaptureType, ObjectType, PointType, setStateType } from "../../../../Constants/GlobalTypes"
import ImageView from "./ImageView"
import { ReIDObjectTypeKeys } from "../../ConstantsValues"

type ImageViewProps = {
    src?: string
    style?: React.CSSProperties
    captureType: CaptureType
    captureResult: CaptureResultType[]
    captureCallback?: (val: CaptureResultListItemType[]) => void
}

let targetListId = 0

function autoCaptureAct(target: HTMLImageElement, originalCanvas: HTMLCanvasElement, rectCanvas: HTMLCanvasElement, tempRectCanvas: HTMLCanvasElement, targets: CaptureResultType[]) {
    let ctx = rectCanvas.getContext('2d');
    // rectCanvas.width = target.clientWidth;
    // rectCanvas.height = target.clientHeight;
    const width_resolution = target.clientWidth / originalCanvas.width;
    const height_resolution = target.clientHeight / originalCanvas.height;

    targets.forEach((target, ind) => {
        const { type, points } = target;
        // let Point = points!.map((point, pInd: number) => {
        //     if (pInd % 2 === 0) {
        //         return point * width_resolution;
        //     } else {
        //         return point * height_resolution;
        //     }
        // }) as PointType;
        ctx!.beginPath();
        ctx!.lineWidth = 4;
        drawWithType(rectCanvas, tempRectCanvas, points as PointType, type);
    });
}

function drawWithType(rectCanvas: HTMLCanvasElement, tempRectCanvas: HTMLCanvasElement, Point: PointType, type: ReIDObjectTypeKeys) {
    let width = Point[2] - Point[0];
    let height = Point[3] - Point[1];
    let ctx = rectCanvas.getContext('2d')!;
    const selectColor = '#f07f3c';
    const _isTarget = false
    switch (type) {
        case 'Person':
            ctx.rect(Point[0], Point[1], width, height);
            if (_isTarget) ctx!.strokeStyle = selectColor;
            else ctx.strokeStyle = '#00F6FF';
            ctx.stroke();
            break;
        case 'Face':
            ctx.lineWidth = 3;
            ctx.arc((Point[2] + Point[0]) / 2, (Point[3] + Point[1]) / 2, width > height ? width / 2 : height / 2, 0, Math.PI * 2);
            if (_isTarget) ctx.strokeStyle = selectColor;
            else ctx.strokeStyle = 'yellow';
            ctx.stroke();
            break;
        case 'car_plate':
            ctx.rect(Point[0], Point[1], width, height);
            if (_isTarget) ctx.strokeStyle = selectColor;
            else ctx.strokeStyle = 'green';
            ctx.stroke();
            break;
        default:
            break;
    }
    ctx.drawImage(tempRectCanvas, 0, 0, rectCanvas.width, rectCanvas.height);
}

const ImageViewWithCanvas = ({ src, style, captureResult, captureCallback }: ImageViewProps) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const originalCanvasRef = useRef<HTMLCanvasElement>(null)
    const rectCanvasRef = useRef<HTMLCanvasElement>(null)
    const fullScreenRef = useRef<Node>()
    
    const exitFullscreen = useCallback(() => {
        fullScreenRef.current?.removeEventListener('click', exitFullscreen)
        document.body.removeChild(fullScreenRef.current!);
    }, [])

    const drawRectFunc = useCallback((src: string, targets: CaptureResultType[]) => {
        rectCanvasRef.current!.getContext('2d')!.clearRect(0, 0, rectCanvasRef.current!.width, rectCanvasRef.current!.height);
        let tempRectCanvas = document.createElement('canvas')
        const img_temp = new Image();
        img_temp.src = src;
        img_temp.onload = (e) => {
            tempRectCanvas.width = img_temp.width;
            tempRectCanvas.height = img_temp.height;
            originalCanvasRef.current!.width = img_temp.width;
            originalCanvasRef.current!.height = img_temp.height;
            rectCanvasRef.current!.width = img_temp.width;
            rectCanvasRef.current!.height = img_temp.height;
            let tempCtx = originalCanvasRef.current!.getContext('2d')!;
            tempCtx.drawImage(img_temp, img_temp.width, img_temp.height);
            autoCaptureAct(imgRef.current!, originalCanvasRef.current!, rectCanvasRef.current!, tempRectCanvas, targets);
            let temp: CaptureResultListItemType[] = []
            targets.forEach(_ => {
                const _width = _.points[2] - _.points[0]
                const _height = _.points[3] - _.points[1]
                const start_x = _.points[0]
                const start_y = _.points[1]
                let _canvas = document.createElement('canvas')
                _canvas.width = _width
                _canvas.height = _height
                let _ctx = _canvas.getContext('2d')
                _ctx?.drawImage(img_temp, start_x, start_y, _width, _height, 0, 0, _width, _height)
                temp.push({
                    type: _.type,
                    mask: false,
                    id: targetListId++,
                    src: _canvas.toDataURL()
                })
            })
            if(captureCallback) captureCallback(temp)
        }
    }, [captureCallback])

    useEffect(() => {
        if (captureResult.length > 0) {
            drawRectFunc(src!, captureResult)
        }
    }, [captureResult])

    useEffect(() => {
        if (src) {
            let ctx = rectCanvasRef.current!.getContext('2d');
            ctx!.clearRect(0, 0, rectCanvasRef.current!.width, rectCanvasRef.current!.height);
        }
    }, [src])

    return <ImageView src={src} style={style} ref={imgRef}>
        <CanvasContainer>
            <canvas
                ref={originalCanvasRef}
                style={{ pointerEvents: 'none', display: 'none' }}
            />
            <canvas
                ref={rectCanvasRef}
                style={{ position: 'absolute', zIndex: '1', pointerEvents: 'none', width:'100%' }}
            />
        </CanvasContainer>
    </ImageView>
}

export default ImageViewWithCanvas

const CanvasContainer = styled.div`
    position: absolute;
    z-index: 1002;
    width: 100%;
    height: 100%;
    & > canvas {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`