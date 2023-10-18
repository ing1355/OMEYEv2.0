import { DefaultValue, atom, selector } from "recoil"
import { CameraDataType } from "../Constants/GlobalTypes"
import { REIDSTATUS, ReIDRequestParamsType, _reidStatus } from "./ReIdResultModel"
import { DescriptionRequestParamsType, _descriptionStatus } from "./DescriptionDataModel"
import { REALTIMESTATUS, realTimeStatus } from "./RealTimeDataModel"

type ProgressDataParamsType = {
  conditionIndex: number
  timeIndex: number
  cctvId: CameraDataType['cameraId']
}

export type SSEProgressResponseType = ProgressDataPercentType & ProgressDataParamsType

export type ProgressDataPercentType = {
  aiPercent: number
  videoPercent: number
}

export type ProgressDataParamsTimeDataType = {
  [key: number]: ProgressDataPercentType
}

const _progressData = atom<ProgressDataParamsTimeDataType[][]>({
  key: "reidResult/progress/data",
  default: []
})

export const ProgressData = selector({
  key: "reidResult/progress/selector",
  get: ({ get }) => get(_progressData),
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_progressData, newValue)
    }
  }
})

export type ProgressRequestType = 'REID' | 'ATTRIBUTION' | 'REALTIME' | ''

const _progressRequestParamsData = atom<{ type: ProgressRequestType, params: ReIDRequestParamsType[] | DescriptionRequestParamsType }>({
  key: "reidParams/data",
  default: {
    type: '',
    params: []
  }
})

export const ProgressRequestParams = selector({
  key: "reidProgress/selector",
  get: ({ get }) => get(_progressRequestParamsData),
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      set(_progressRequestParamsData, newValue)
      switch (newValue.type) {
        case 'ATTRIBUTION': return set(_descriptionStatus, 'RUNNING');
        case 'REID': return set(_reidStatus, REIDSTATUS['RUNNING']);
        case 'REALTIME': return set(realTimeStatus, REALTIMESTATUS['RUNNING']);
        default: return;
      }
    }
  }
})