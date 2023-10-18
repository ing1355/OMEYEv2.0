import styled from "styled-components"
import { globalStyles, loadingAIAnalysisColor, loadingVideoDownloadColor } from "../../styles/global-styled"
import { useEffect, useState } from "react"
import Button from "../Constants/Button"
import { ReidCancelApi } from "../../Constants/ApiRoutes"
import Progress from "./Progress"

type LoadingProps = {
    isLoading: boolean
    sseUrl: string
}



const testCCTVs = [52, 53, 54, 55, 307, 308, 309, 310]

let sse: EventSource | null;



const getLoadingTimeString = (time: number) => {
    const hour = Math.floor(time / 3600)
    const minute = Math.floor(time / 60) % 60
    const second = time % 60
    let str = ""
    if (hour) str += `${hour}시간 `
    if (minute) str += `${minute}분 `
    str += `${second}초 경과`
    return str
}


let intervalId: NodeJS.Timer

const Loading = ({ isLoading, sseUrl }: LoadingProps) => {
    const [videoPercent, setVideoPercent] = useState(0)
    const [aiPercent, setAiPercent] = useState(0)
    const [loadingTime, setLoadingTime] = useState(0)

    useEffect(() => {
        if (isLoading) {
            intervalId = setInterval(() => {
                setLoadingTime(time => time + 1)
            }, 1000)
        } else {
            setVideoPercent(0)
            setAiPercent(0)
            if (intervalId) clearInterval(intervalId)
            setLoadingTime(0)
        }
    }, [isLoading])

    function sseSetting() {
        sse = new EventSource(sseUrl);
        sse.onopen = (e) => {
            console.log('open : ', e)
        };
        sse.onmessage = (res: MessageEvent) => {
            const { percent, statusCode, error } = JSON.parse(res.data.replace(/\\/gi, ''));
            console.log(percent, statusCode, error)
            if (statusCode === 0) {
                setVideoPercent(percent.toFixed(0))
            } else if (statusCode === 1) {
                setAiPercent(percent.toFixed(0))
            }
        };
        sse.onerror = (e: any) => {
            e.target.close();
        };
    }

    useEffect(() => {
        if (isLoading) {
            sseSetting()
        } else {
            if (sse) {
                sse.close()
                sse = null
            }
        }
    }, [isLoading])

    return <Continer isLoading={isLoading}>
        <Header>
            <LoadingText>
                {getLoadingTimeString(loadingTime)}
            </LoadingText>
            <ColorsDescriptionContainer>
                {/* <ColorsDescription title="영상 다운로드" color={loadingVideoDownloadColor} />
                <ColorsDescription title="AI 분석" color={loadingAIAnalysisColor} /> */}
            </ColorsDescriptionContainer>
            <CancelBtn onClick={() => {
                navigator.sendBeacon(
                    ReidCancelApi,
                    localStorage.getItem("Authorization")
                );
            }}>
                분석 취소
            </CancelBtn>
        </Header>
        <Contents>
            <Progress percent={videoPercent} color={loadingVideoDownloadColor} />
            영상 다운로드 중...
            <Progress percent={aiPercent} color={loadingAIAnalysisColor} />
            ai 분석 중...

        </Contents>

    </Continer>
}

export default Loading

const Continer = styled.div<{ isLoading: boolean }>`
    width: 100%;
    height: 100%;
    padding: 8px 12px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    ${globalStyles.flex({ justifyContent: 'flex-start', alignItems: 'flex-start' })}
    display: ${({ isLoading }) => isLoading ? 'flex' : 'none'};
`

const Header = styled.div`
    width: 100%;
    border-bottom: 1px solid white;
    padding: 0 0 2px 0;
    height: 52px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const ColorsDescriptionContainer = styled.div`
    height: 100%;
    flex: 1 1 400px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const Contents = styled.div`

`

const CancelBtn = styled(Button)`
    flex: 0 0 100px;
`

const LoadingText = styled.div`
    flex: 1;
`