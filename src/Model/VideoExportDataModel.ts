import { atom, selectorFamily, useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { Axios } from "../Functions/NetworkFunctions";
import { BasicLogDataType, CameraDataType, TimeDataType } from "../Constants/GlobalTypes";
import { TimeModalDataType } from "../Components/ReID/Condition/Constants/TimeModal";
import { GetVideoHistoryApi } from "../Constants/ApiRoutes";
import { ProgressDataPercentType, SSEResponseStatusType } from "./ProgressModel";
import { useEffect, useState } from "react";
import { LoadableDataType } from "../Constants/NetworkTypes";
import { menuState } from "./MenuModel";
import { VideoExportMenuKey } from "../Constants/GlobalConstantsValues";

export type VideoExportStatusType = 'canDownload' | 'downloading' | 'complete' | 'none' | 'wait' | 'cancel' | 'downloadComplete'

export type VideoExportCategoryType = "영역 비식별화" | "얼굴 비식별화" | "번호판 비식별화"

export type VideoExportSearchParamsType = {
    type?: VideoExportCategoryType
    page: number
    size: number
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

const _videoExportHistories = atom({
    key: "VideoExport/Logs",
    default: {
        state: 'IDLE',
        data: {
            totalCount: 0,
            results: []
        }
    } as LoadableDataType<VideoExportHistoryApiResponseType>
})

export const useVideoExportHistories = (params: VideoExportSearchParamsType) => {
    const [logs, setLogs] = useRecoilState(_videoExportHistories)
    const menu = useRecoilValue(menuState)
    const [_params, _setParams] = useState<VideoExportSearchParamsType>(params)

    useEffect(() => {
        if (menu === VideoExportMenuKey) refresh()
    },[_params])

    const refresh = async () => {
        setLogs({
            ...logs,
            state: 'RUNNING'
        })
        const res = await Axios("GET", GetVideoHistoryApi, {
            ..._params,
            size: _params.size
        }) as VideoExportHistoryApiResponseType
        setLogs({
            state: 'IDLE',
            data: res
        })
    }

    const setParams = (params: VideoExportSearchParamsType) => {
        _setParams(params)
    }

    return {logs, setParams, refresh}
}