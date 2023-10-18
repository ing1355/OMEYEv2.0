import {memo} from 'react'
import { CSSProperties, useEffect, useRef, useState } from "react"
import { GetVideoInfoByCCTVId, VideoInfoByCameraIdType } from "../../Functions/NetworkFunctions"
import RtspPlayer from "../../Functions/StreamingControls"
import { CameraDataType } from "../../Constants/GlobalTypes"
import noImage from '../../assets/img/logo.png'
import styled from "styled-components"
import { globalStyles } from "../../styles/global-styled"

type VideoProps = {
    info?: VideoInfoByCameraIdType | null
    cctvId?: CameraDataType['cameraId']
    objectFit?: CSSProperties['objectFit']
}

const Video = memo(({ info, cctvId, objectFit }: VideoProps) => {
    const [src, setSrc] = useState("")
    const rtspPlayer = useRef<RtspPlayer>()
    const videoRef = useRef<HTMLVideoElement>(null)
    const playVideoByInfo = (videoInfo: VideoInfoByCameraIdType) => {
        const { url, channel, uuid } = videoInfo
        if (!uuid) {
            setSrc(url)
        }
        else {
            if (rtspPlayer.current) rtspPlayer.current?.changeStream(uuid, videoRef.current!)
            else {
                rtspPlayer.current = new RtspPlayer(
                    videoRef.current!,
                    RtspPlayer.types.WEBRTC,
                    uuid)
            }
        }
    }

    useEffect(() => {
        if (info) {
            playVideoByInfo(info)
        } else {
            if (rtspPlayer.current) rtspPlayer.current.destroy()
        }
        return () => {
            if (rtspPlayer.current) rtspPlayer.current.destroy()
        }
    }, [info])

    useEffect(() => {
        if (cctvId) {
            GetVideoInfoByCCTVId(cctvId).then(_ => {
                console.log(_)
                playVideoByInfo(_)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if(rtspPlayer.current) rtspPlayer.current?.destroy()
            else if(videoRef.current) setSrc("")
        }
    }, [cctvId])
    
    return <Container>
        <VideoWrapper objectFit={objectFit} src={src} ref={videoRef} autoPlay crossOrigin="anonymous" width="100%" height="100%"/>
        {!src && <Poster src={noImage}/>}
    </Container>
},(pre, next) => {
    if(pre.cctvId !== next.cctvId) return false
    if(JSON.stringify(pre.info) !== JSON.stringify(next.info)) return false
    return true
})

export default Video

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    ${globalStyles.flex()}
`

const VideoWrapper = styled.video<{objectFit?: CSSProperties['objectFit']}>`
    object-fit: ${({objectFit}) => objectFit ?? "fill"};
`

const Poster = styled.img`
    object-fit: contain;
    width: 50%;
    height: 50%;
    position: absolute;
    z-index: 99;
`