import { DefaultValue, atom, selectorFamily } from "recoil";
import { CameraDataType } from "../Constants/GlobalTypes";
import { Axios, streamingAllStopRequest } from "../Functions/NetworkFunctions";
import { StopAllVMSVideoApi } from "../Constants/ApiRoutes";

type MonitoringCCTVsDataKeyType = "visible" | "CCTVs" | "status"
type MonitoringStatusType = "IDLE" | "RUNNING"

const _MonitoringCCTVsData = atom<{
    visible: boolean
    cctvs: CameraDataType['cameraId'][]
    status: MonitoringStatusType
}>({
    key: "MonitoringCCTVs",
    default: {
        visible: false,
        cctvs: [],
        status: "IDLE"
    }
})

let statusChanging = false

export const MonitoringDatas = selectorFamily({
    key: "MonitoringCCTVs/selector",
    get: (key: MonitoringCCTVsDataKeyType) => ({ get }) => {
        const _ = get(_MonitoringCCTVsData)
        if (key === 'visible') return _.visible
        else if(key === "status") return _.status
        else return _.cctvs
    },
    set: (key: MonitoringCCTVsDataKeyType) => ({ get, set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            let oldData = get(_MonitoringCCTVsData)
            if (key === "visible") {
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    visible: newValue as boolean
                })
            }
            else if(key === "status") {
                if(oldData.status === 'RUNNING' && newValue === 'IDLE') {
                    Axios('POST', StopAllVMSVideoApi)
                }
                if(oldData.status === 'IDLE' && newValue === 'RUNNING') {
                    window.addEventListener('unload', streamingAllStopRequest)
                }
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    status: newValue as MonitoringStatusType
                })
            }
            else {
                return set(_MonitoringCCTVsData, {
                    ...oldData,
                    cctvs: newValue as CameraDataType['cameraId'][]
                })
            }
        }
    }
})