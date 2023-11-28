import {memo} from 'react'
import { CSSProperties, useEffect, useRef, useState } from "react"
import { Axios, GetVideoInfoByCCTVId, VideoInfoByCameraIdType } from "../../Functions/NetworkFunctions"
import RtspPlayer from "../../Functions/StreamingControls"
import { CameraDataType } from "../../Constants/GlobalTypes"
import noImage from '../../assets/img/logo.png'
import styled from "styled-components"
import { globalStyles } from "../../styles/global-styled"
import { TimeModalDataType } from '../ReID/Condition/Constants/TimeModal'
import { GetCameraVideoUrlApi } from '../../Constants/ApiRoutes'

type VideoProps = {
    info?: VideoInfoByCameraIdType | null
    cctvId?: CameraDataType['cameraId']
    objectFit?: CSSProperties['objectFit']
    isTime?: boolean
    timeValue?: TimeModalDataType|undefined
    src?: string
    noLogo?: boolean
}

const Video = memo(({ info, cctvId, objectFit, isTime, timeValue, src, noLogo }: VideoProps) => {
    const [_src, setSrc] = useState<string|undefined>(undefined)
    const rtspPlayer = useRef<RtspPlayer>()
    const videoRef = useRef<HTMLVideoElement>(null)
    
    useEffect(() => {
        setSrc(src)
    },[src])

    const playVideoByInfo = (videoInfo: VideoInfoByCameraIdType) => {
        const { url, channel, uuid } = videoInfo
        if (!uuid) {
            setSrc(url)
        } else {
            if (rtspPlayer.current && videoRef.current) {
                rtspPlayer.current?.changeStream(uuid, videoRef.current!)
            }
            else if(videoRef.current) {
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
        console.debug("here11 : " , cctvId, timeValue)
        if(cctvId && timeValue) {
            Axios('GET', GetCameraVideoUrlApi(cctvId, timeValue.startTime)).then(({uuid, url}) => {
                if(uuid) {
                    if(rtspPlayer.current) {
                        rtspPlayer.current.changeStream(uuid, videoRef.current!)
                    } else {
                        rtspPlayer.current = new RtspPlayer(videoRef.current!, RtspPlayer.types.HLS, uuid)
                    }
                } else {
                    if(videoRef.current) setSrc(url)
                }
            })
        } else if (cctvId && !isTime) {
            GetVideoInfoByCCTVId(cctvId).then(_ => {
                playVideoByInfo(_)
            }).catch(err => {
                console.error(err)
            })
        } else {
            if(rtspPlayer.current) rtspPlayer.current?.destroy()
            else if(videoRef?.current) setSrc("")
        }
    }, [cctvId, timeValue])
    
    return <Container>
        <VideoWrapper objectFit={objectFit} src={_src || ""} ref={videoRef} autoPlay crossOrigin="anonymous" width="100%" height="100%" controls={!(!_src)}/>
        {(((!_src && !info && !cctvId) || (!src && isTime && !timeValue))) && !noLogo && <Poster src={noImage}/>}
    </Container>
},(pre, next) => {
    if(pre.cctvId !== next.cctvId) return false
    if(pre.src !== next.src) return false
    if(JSON.stringify(pre.info) !== JSON.stringify(next.info)) return false
    if(JSON.stringify(pre.timeValue) !== JSON.stringify(next.timeValue)) return false
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
    max-width: 100px;
    max-height: 60px;
`