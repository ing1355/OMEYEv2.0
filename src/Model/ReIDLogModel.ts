import { atom, useRecoilState, useRecoilValue } from "recoil";
import { GetReIDLogs } from "../Constants/ApiRoutes";
import { Axios } from "../Functions/NetworkFunctions";
import { BasicLogDataType, CameraDataType, CaptureResultListItemType, ReIDObjectTypeKeys, TimeDataType } from "../Constants/GlobalTypes";
import { LoadableDataType } from "../Constants/NetworkTypes";
import { useEffect, useState } from "react";
import { ReIDMenuKeys } from "../Components/ReID/ConstantsValues";
import { conditionMenu } from "./ConditionMenuModel";

export type ReIDRequestGroupDataType = {
    title: string
    etc: string
    rank: number
    requestEndTime: string
    requestStartTime: string
    status: 'IN_PROGRESS' | 'SUCCESS' | 'CANCEL' | 'EMPTY'
    targetObjects: {
        id: number
        imgUrl: string
        type: ReIDObjectTypeKeys
        ocr: CaptureResultListItemType['ocr']
    }[]
    timeGroups: TimeDataType[]
    cameraGroups: CameraDataType['cameraId'][][]
}

export type ReIDLogDataType = {
    reidId: number
    description: string
    createdTime: string
    closedTime: string
    requestGroups: ReIDRequestGroupDataType[]
    userId: string
    // status: string
    // object: {
    //     id: number
    //     imgPath: string
    //     imgUrl: string
    //     type: ReIDObjectTypeKeys
    // }[]
}

export type ReIDSearchParamsType = {
    type?: ReIDObjectTypeKeys
    desc?: string
    from?: string
    to?: string
    page: number
    size?: number
}

type ReIDLogApiResponseType = BasicLogDataType<ReIDLogDataType[]>

const _ReIDLogDatas = atom({
    key: "ReID/Logs",
    default: {
        state: 'IDLE',
        data: {
            totalCount: 0,
            results: []
        }
    } as LoadableDataType<ReIDLogApiResponseType>
})

export const useReIDLogDatas = (params: ReIDSearchParamsType) => {
    const [logs, setLogs] = useRecoilState(_ReIDLogDatas)
    const menu = useRecoilValue(conditionMenu)
    const [_params, _setParams] = useState<ReIDSearchParamsType>(params)

    useEffect(() => {
        if (menu === ReIDMenuKeys['REIDLOGS']) refresh()
    },[_params])

    const refresh = async () => {
        setLogs({
            ...logs,
            state: 'RUNNING'
        })
        const res = await Axios("GET", GetReIDLogs, {
            ..._params,
            size: _params.size || 10
        }) as ReIDLogApiResponseType
        setLogs({
            state: 'IDLE',
            data: res || logs.data
        })
    }

    const setParams = (params: ReIDSearchParamsType) => {
        _setParams(params)
    }

    return {logs, setParams, refresh}
}