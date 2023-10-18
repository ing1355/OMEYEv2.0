import { selectorFamily, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from "recoil";
import { GetReIDLogs } from "../Constants/ApiRoutes";
import { Axios } from "../Functions/NetworkFunctions";
import { ReIDObjectTypeKeys } from "../Components/ReID/ConstantsValues";

export type ReIDLogDataType = {
    reidId: number
    description: string
    createdTime: string
    closedTime: string
    status: string
    userId: string
    object: {
        id: number
        imgPath: string
        imgUrl: string
        type: ReIDObjectTypeKeys
    }[]
}

export type ReIDSearchParamsType = {
    type?: ReIDObjectTypeKeys
    desc?: string
    from?: string
    to?: string
    page: number
}

type ReIDApiResponseType = {
    result: ReIDLogDataType[]
    totalCount: number
}

// const _ReIDLog = atom<SiteDataType[]>({
//     key: "ReIDLog",
//     default: []
// })

export const SearchReIDLogDatas = selectorFamily({
    key: "ReIDLog/selector/search",
    get: (params: ReIDSearchParamsType) => async ({get}) => {
        return await Axios("GET", GetReIDLogs, {
            size: 10,
            ...params
        }) as ReIDApiResponseType
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent'
    }
})

let tempLogDatas:ReIDApiResponseType = {
    result: [],
    totalCount: 0
}

export const useReIDLogDatas = (params: ReIDSearchParamsType): ReIDApiResponseType|null => {
    const logs = useRecoilValueLoadable(SearchReIDLogDatas(params))
    let result: ReIDApiResponseType|null = tempLogDatas
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