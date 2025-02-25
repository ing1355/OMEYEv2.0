import { DefaultValue, atom, selector } from "recoil"
import { CameraDataType, ReIDResultDataResultListDataType } from "../Constants/GlobalTypes"
import { AdditionalReIDRequestParamsType, ReIDRequestParamsType } from "./ReIdResultModel"

type ProgressDataParamsType = {
  conditionIndex: number
  timeIndex: number
  cctvId: CameraDataType['cameraId']
}

export type SSEResponseStatusType = 'SSE_CONNECTION' | 'SSE_DESTROY' | 'REID_START' | 'REID_COMPLETE' | 'REID_CANCEL' | 'UPDATE_THRESHOLD' | 'ADMIN_REID_KILL' | 'EXPORT_CANCEL'

export type SSEProgressResponseType = ProgressDataPercentType & ProgressDataParamsType & {
  reIdId?: number
  results?: ReIDResultDataResultListDataType[]
  objectId?: number
  status?: SSEResponseStatusType
  errorCode?: string
}

export type ProgressDataPercentType = {
  aiPercent: number
  videoPercent: number
}

export type ProgressDataParamsTimesDataType = {
  time: string
  data: {
    [key: number]: ProgressDataPercentType
  }
}

export type ProgressDataType = {
  title: string,
  times: ProgressDataParamsTimesDataType[]
}

const _progressData = atom<ProgressDataType[]>({
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

export type ProgressStatusType = 'IDLE' | 'RUNNING' | 'COMPLETE' | 'CANCELD' | 'ERROR'
export type ProgressRequestType = 'REID' | 'REALTIME' | 'ADDITIONALREID' | ''

export const defaultProgressRequestParams: { type: ProgressRequestType, params: ReIDRequestParamsType[] } = {
  type: '',
  params: []
}

const _progressRequestParamsData = atom<{ type: ProgressRequestType, params: ReIDRequestParamsType[] | AdditionalReIDRequestParamsType }>({
  key: "reidParams/data",
  default: defaultProgressRequestParams
})

export const PROGRESS_STATUS: {
  [key in ProgressStatusType]: ProgressStatusType
} = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  COMPLETE: 'COMPLETE',
  CANCELD: 'CANCELD',
  ERROR: 'ERROR'
}

const _status = atom<{
  type: ProgressRequestType
  status: ProgressStatusType
}>({
  key: "progress/status",
  default: {
    type: '',
    status: PROGRESS_STATUS['IDLE']
  }
})

export const ProgressRequestParams = selector({
  key: "reidProgress/selector",
  get: ({ get }) => get(_progressRequestParamsData),
  set: ({ get, set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      set(_progressRequestParamsData, newValue)
    }
  }
})

export const ProgressStatus = selector({
  key: "progress/status/selector",
  get: ({ get }) => {
    return get(_status)
  },
  set: ({ set }, newValue) => {
    return set(_status, newValue)
  }
})