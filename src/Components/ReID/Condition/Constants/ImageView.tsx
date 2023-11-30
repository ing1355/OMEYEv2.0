import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import noImage from '../../../../assets/img/logo.png'
import React, { PropsWithChildren, forwardRef, useCallback, useEffect, useRef, useState } from "react"

type ImageViewProps = PropsWithChildren & {
    src?: string
    subSrc?: string
    style?: React.CSSProperties
    className?: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>
    onError?: React.ReactEventHandler<HTMLImageElement>
}

const ImageWithRetry = forwardRef<HTMLImageElement, ImageViewProps>((props, ref) => {
    const [imageSrc, setImageSrc] = useState(noImage);
    const [retryCount, setRetryCount] = useState(0);
    const [error, setError] = useState(true)

    useEffect(() => {
        if(props.src) setImageSrc(props.src)
    }, [props.src])
    
    return <ImageContent width="100%" height="100%" ref={ref} {...props} style={{
        ...props.style,
        width: error ? '50%' : '100%',
        height: error ? '50%' : '100%',
    }} src={imageSrc} onError={(e) => {
        if (imageSrc !== noImage) {
            setRetryCount(retryCount + 1)
            setImageSrc(noImage)
            if (retryCount < 3) {
                setTimeout(() => {
                    if(props.src) setImageSrc(props.src)
                }, 700);
            }
        }
        if (props.onError) {
            props.onError(e)
        }
    }} onLoad={(e) => {
        if(props.src) {
            if(e.currentTarget.src.includes(props.src!)) {
                setError(false)
            }
        }
    }} loading="lazy"/>
})

const ImageView = forwardRef<HTMLImageElement, ImageViewProps>(({ src, style, children, className, subSrc }, ref) => {
    const [subOpen, setSubOpen] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)
    const fullScreenRef = useRef<Node>()

    const exitFullscreen = useCallback(() => {
        fullScreenRef.current?.removeEventListener('click', exitFullscreen)
        document.body.removeChild(fullScreenRef.current!);
        setSubOpen(false)
    }, [])

    useEffect(() => {
        if (subSrc && subOpen) {
            const _ref = ref as any
            fullScreenRef.current = (_ref || imgRef).current?.cloneNode(true)
            let fullscreenImage = fullScreenRef.current as HTMLImageElement
            fullscreenImage.src = subSrc
            fullscreenImage.style.position = 'fixed';
            fullscreenImage.style.top = '0';
            fullscreenImage.style.left = '0';
            fullscreenImage.style.width = '100vw';
            fullscreenImage.style.height = '100vh';
            fullscreenImage.style.objectFit = 'contain';
            fullscreenImage.style.zIndex = '9999';
            fullscreenImage.style.backgroundColor = 'rgba(0,0,0,.3)';
            fullscreenImage.style.cursor = 'zoom-out';
            fullscreenImage.style.userSelect = 'none'
            fullscreenImage.style.pointerEvents = 'auto';
            document.body.appendChild(fullscreenImage);
            fullscreenImage.addEventListener('click', exitFullscreen)
        }
    },[subOpen, subSrc])

    return <ImageContainer
        key={src}
        isSrc={src !== undefined}
        onMouseOver={(e) => {
            e.stopPropagation()
        }}
        onMouseEnter={e => {
            e.stopPropagation()
        }}
        className={className}
        style={{
            ...style
        }}
        onClick={(e) => {
            e.stopPropagation()
            if (src) {
                const _ref = ref as any
                fullScreenRef.current = (_ref || imgRef).current?.cloneNode(true)
                let fullscreenImage = fullScreenRef.current as HTMLImageElement
                fullscreenImage.style.position = 'fixed';
                fullscreenImage.style.top = '0';
                fullscreenImage.style.left = '0';
                fullscreenImage.style.width = '100vw';
                fullscreenImage.style.height = '100vh';
                fullscreenImage.style.objectFit = 'contain';
                fullscreenImage.style.zIndex = '9999';
                fullscreenImage.style.backgroundColor = 'rgba(0,0,0,.3)';
                fullscreenImage.style.cursor = 'zoom-out';
                fullscreenImage.style.userSelect = 'none'
                fullscreenImage.style.pointerEvents = 'auto';
                fullscreenImage.oncontextmenu = (e) => {
                    e.preventDefault()
                }
                fullscreenImage.addEventListener('click', exitFullscreen)
                document.body.appendChild(fullscreenImage);
            }
        }} onContextMenu={(e) => {
            e.preventDefault()
            setSubOpen(true)
        }}>
        <ImageWithRetry ref={ref || imgRef} src={src || noImage} />
        {children}
    </ImageContainer>
})

export default ImageView

const ImageContainer = styled.div<{ isSrc: boolean }>`
    ${({ isSrc }) => isSrc && 'cursor: zoom-in;'}
    position: relative;
    z-index: 1001;
    width: ${({isSrc}) => isSrc ? 100 : 50}%;
    height: ${({isSrc}) => isSrc ? 100 : 50}%;
    max-width: ${({isSrc}) => isSrc ? '100%' : '100px'};
    max-height: ${({isSrc}) => isSrc ? '100%' : '60px'};
    ${globalStyles.flex()}
`

const ImageContent = styled.img`
    width: 100%;
    height: 100%;
    z-index: 1;
`