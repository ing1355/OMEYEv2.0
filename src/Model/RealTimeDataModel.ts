import { atom } from "recoil";
import { CameraDataType, CaptureResultListItemType, ReIDObjectTypeKeys } from "../Constants/GlobalTypes";
import { PROGRESS_STATUS, ProgressStatusType } from "./ProgressModel";
import { descriptionDataType } from "../Components/ReID/Condition/TargetSelect/PersonDescription/DescriptionType";
import { ObjectTypes } from "../Components/ReID/ConstantsValues";

type RealTimeDataType = {
    type: ReIDObjectTypeKeys
    cameraIdList: CameraDataType['cameraId'][],
    objectId: CaptureResultListItemType['objectId'],
    threshHold: number,
    description?: descriptionDataType
    src?: string
}

export const realTimeData = atom<RealTimeDataType>({
    key: "realTimeData/atom",
    default: {
        type: ReIDObjectTypeKeys[ObjectTypes['PERSON']],
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