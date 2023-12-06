import { DefaultValue, RecoilValueReadOnly, atom, selector, selectorFamily } from "recoil";
import { CameraDataType } from "../Constants/GlobalTypes";
import { Axios, streamingAllStopRequest } from "../Functions/NetworkFunctions";
import { StopAllVMSVideoApi } from "../Constants/ApiRoutes";
import { PROGRESS_STATUS, ProgressStatusType } from "./ProgressModel";
import { TimeModalDataType } from "../Components/ReID/Condition/Constants/TimeModal";

type MonitoringCCTVsDataKeyType = "visible" | "CCTVs" | "status" | "layoutNum"
export type MonitoringCCTVDataType = {
    cctvId: CameraDataType['cameraId'],
    time: TimeModalDataType|undefined
}
export type MonitoringDataType = {
    visible: MonitoringCCTVsDataKeyType|undefined
    cctvs: MonitoringCCTVDataType[]
    status: ProgressStatusType
    layoutNum: number
}

const _MonitoringCCTVsData = atom<MonitoringDataType>({
    key: "MonitoringCCTVs",
    default: {
        visible: undefined,
        cctvs: [],
        status: "IDLE",
        layoutNum: 1
    }
})

export const MonitoringAllData = selector({
    key: "MonitoringCCTVsAllData/selector",
    get: ({get}) => {
        return get(_MonitoringCCTVsData)
    },
    set: ({set}, newValue) => {
        return set(_MonitoringCCTVsData, newValue)
    }
})

export const MonitoringDatas = selectorFamily({
    key: "MonitoringCCTVs/selector",
    get: (key: MonitoringCCTVsDataKeyType) => ({ get }) => {
        const _ = get(_MonitoringCCTVsData)
        if (key === 'visible') return _.visible
        else if(key === "status") return _.status
        else if(key === 'CCTVs') return _.cctvs
        else if(key === 'layoutNum') return _.layoutNum
    },
    set: (key: MonitoringCCTVsDataKeyType) => ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let oldData = get(_MonitoringCCTVsData)
            if (key === "visible") {
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    visible: newValue as MonitoringCCTVsDataKeyType
                })
            }
            else if(key === "status") {
                if(oldData.status === PROGRESS_STATUS['RUNNING'] && newValue === PROGRESS_STATUS['IDLE'] && oldData.cctvs.length !== 0) {
                    Axios('POST', StopAllVMSVideoApi)
                    set(_MonitoringCCTVsData, {
                        ...oldData,
                        cctvs: []
                    })
                }
                if(oldData.status === PROGRESS_STATUS['IDLE'] && newValue === PROGRESS_STATUS['RUNNING']) {
                    window.addEventListener('unload', streamingAllStopRequest)
                }
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    status: newValue as ProgressStatusType
                })
            }
            else if(key === 'CCTVs') {
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    cctvs: newValue as MonitoringDataType['cctvs']
                })
            } else if(key === 'layoutNum') {
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    layoutNum: newValue as number
                })
            }
        }
    }
})