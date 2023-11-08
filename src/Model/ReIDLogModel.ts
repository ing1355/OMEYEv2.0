import { selectorFamily, useRecoilValueLoadable } from "recoil";
import { GetReIDLogs } from "../Constants/ApiRoutes";
import { Axios } from "../Functions/NetworkFunctions";
import { BasicLogDataType, CameraDataType, CaptureResultListItemType, ReIDObjectTypeKeys, TimeDataType } from "../Constants/GlobalTypes";

export type ReIDRequestGroupDataType = {
    title: string
    etc: string
    rank: number
    requestEndTime: string
    requestStartTime: string
    status: 'IN_PROGRESS' | 'SUCCESS' | 'CANCEL'
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
}

type ReIDLogApiResponseType = BasicLogDataType<ReIDLogDataType[]>

// const _ReIDLog = atom<SiteDataType[]>({
//     key: "ReIDLog",
//     default: []
// })

export const SearchReIDLogDatas = selectorFamily({
    key: "ReIDLog/selector/search",
    get: (params: ReIDSearchParamsType) => async ({get}) => {
        // return {
        //     results: [],
        //     totalCount: 0
        // }
        const temp = await Axios("GET", GetReIDLogs, {
            size: 10,
            ...params
        }) as ReIDLogApiResponseType
        console.debug("ReID Logs Get Success : ", temp)
        return temp
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent'
    }
})

let tempLogDatas:ReIDLogApiResponseType = {
    results: [],
    totalCount: 0
}

export const useReIDLogDatas = (params: ReIDSearchParamsType): ReIDLogApiResponseType|null => {
    const logs = useRecoilValueLoadable(SearchReIDLogDatas(params))
    let result: ReIDLogApiResponseType|null = tempLogDatas
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