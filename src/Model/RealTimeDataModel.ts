import { atom } from "recoil";
import { CameraDataType, CaptureResultListItemType } from "../Constants/GlobalTypes";

type RealTimeStatusType = 'IDLE' | 'RUNNING'

export const REALTIMESTATUS: {
    [key in RealTimeStatusType]: RealTimeStatusType
} = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING'
}

type RealTimeDataType = {
    cameraIdList: CameraDataType['cameraId'][],
    objectId: CaptureResultListItemType['objectId'],
    threshHold: number,
}

export const realTimeData = atom<RealTimeDataType>({
    key: "realTimeData/atom",
    default: {
        cameraIdList: [],
        objectId: 0,
        threshHold: 50
    }
})

export const realTimeStatus = atom<RealTimeStatusType>({
    key: "realTimeStatus/atom",
    default: REALTIMESTATUS['IDLE']
})