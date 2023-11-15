import { atom } from "recoil";
import { CameraDataType, CaptureResultListItemType, ObjectType } from "../Constants/GlobalTypes";
import { PROGRESS_STATUS, ProgressStatusType } from "./ProgressModel";
import { descriptionDataType } from "../Components/ReID/Condition/TargetSelect/PersonDescription/DescriptionType";

type RealTimeDataType = {
    type?: ObjectType
    cameraIdList: CameraDataType['cameraId'][],
    objectId: CaptureResultListItemType['objectId'],
    threshHold: number,
    description?: descriptionDataType
    src?: string
}

export const realTimeData = atom<RealTimeDataType>({
    key: "realTimeData/atom",
    default: {
        type: undefined,
        cameraIdList: [],
        objectId: 0,
        threshHold: 50,
        description: undefined
    }
})

export const realTimeStatus = atom<ProgressStatusType>({
    key: "realTimeStatus/atom",
    default: PROGRESS_STATUS['IDLE']
})