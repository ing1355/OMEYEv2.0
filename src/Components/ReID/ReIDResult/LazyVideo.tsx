import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import NoVideoIcon from '../../../assets/img/emptyVideoIcon.png'

type LazyVideoProps = {
    src: string
    poster: string
}

const LazyVideo = ({ src, poster }: LazyVideoProps) => {
    const targetVideo = useRef<HTMLVideoElement>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(false)
    },[src])
    
    return loaded ? <TargetResultItemCCTVListItemMediaVideo ref={targetVideo} preload="" src={src} autoPlay controls/> :
        <NoLoadedIcon src={NoVideoIcon} onClick={() => {
            setLoaded(true)
        }} style={{
            pointerEvents: 'auto'
        }}/>
}

const TargetResultItemCCTVListItemMediaVideo = styled.video`
    width: 100%;
    height: 100%;
`

const NoLoadedIcon = styled.img`
    cursor: pointer;
    width: 100%;
    height: 100%;
`

export default LazyVideo