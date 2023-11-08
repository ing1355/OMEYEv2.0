import { atom } from "recoil";
import { CameraDataType, CaptureResultListItemType } from "../Constants/GlobalTypes";
import { PROGRESS_STATUS, ProgressStatusType } from "./ProgressModel";

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

export const realTimeStatus = atom<ProgressStatusType>({
    key: "realTimeStatus/atom",
    default: PROGRESS_STATUS['IDLE']
})