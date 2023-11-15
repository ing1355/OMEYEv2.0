import { selectorFamily, useRecoilValueLoadable } from "recoil";
import { Axios } from "../Functions/NetworkFunctions";
import { BasicLogDataType, CameraDataType, TimeDataType } from "../Constants/GlobalTypes";
import { TimeModalDataType } from "../Components/ReID/Condition/Constants/TimeModal";
import { GetVideoHistoryApi } from "../Constants/ApiRoutes";
import { ProgressDataPercentType, SSEResponseStatusType } from "./ProgressModel";

export type VideoExportStatusType = 'canDownload' | 'downloading' | 'complete' | 'none' | 'wait' | 'cancel' | 'downloadComplete'

export type VideoExportCategoryType = "영역 비식별화" | "얼굴 비식별화" | "번호판 비식별화"

export type VideoExportSearchParamsType = {
    type?: VideoExportCategoryType
    page: number
}

export type VideoExportMaskingType = "head" | "area" | "carplate"

export type VideoExportRowDataType = {
    videoUUID?: string
    status?: VideoExportStatusType
    cctvId?: CameraDataType['cameraId']
    time?: TimeModalDataType
    thumnailImage?: string
    options: {
        masking: VideoExportMaskingType[]
        points: number[][][]
        password: string
        description: string
    }
    path?: string
    progress: ProgressDataPercentType
}

export type VideoExoprtHistoryDataType = {
    id: number
    data: TimeDataType & {
        cctvId: CameraDataType['cameraId']
        options: VideoExportRowDataType['options']
    }
    thumbnailPath: string
    videoPath: string
    username: string
    createdTime: string
    videoSize: number
    videoType: string
}

export type VideoExportApiParameterType = {
    cameraInfo: TimeDataType & {
        id: CameraDataType['cameraId']
    }
    options: VideoExportRowDataType['options'] & {
        points: number[][]
    }
}

export type VideoExportSseResponseType = ProgressDataPercentType & {
    videoUUID: string
    path?: string
    type: 'complete' | 'done'
    status?: SSEResponseStatusType
}

type VideoExportHistoryApiResponseType = BasicLogDataType<VideoExoprtHistoryDataType[]>

export const VideoExportHistories = selectorFamily({
    key: "ReIDLog/selector/search",
    get: (params: VideoExportSearchParamsType) => async ({get}) => {
        // return {
        //     results: testLogs,
        //     totalCount: testLogs.length
        // }
        return await Axios("GET", GetVideoHistoryApi, {
            size: 9,
            ...params
        })
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent'
    }
})

let tempLogDatas:VideoExportHistoryApiResponseType = {
    results: [],
    totalCount: 0
}

export const useVideoExportLogDatas = (params: VideoExportSearchParamsType): VideoExportHistoryApiResponseType|null => {
    const logs = useRecoilValueLoadable(VideoExportHistories(params))
    let result: VideoExportHistoryApiResponseType|null = tempLogDatas
    switch(logs.state) {
        case 'hasValue':
            tempLogDatas = logs.contents
            result = logs.contents
            break;
        case 'hasError':
        case 'loading':
            result = tempLogDatas
            break;
        default:
            result = null
    }
    return result
}