import { DefaultValue, atom, selector } from "recoil"
import { CameraDataType, ReIDResultDataResultListDataType } from "../Constants/GlobalTypes"
import { AdditionalReIDRequestParamsType, ReIDRequestParamsType } from "./ReIdResultModel"

export type ProgressStatusType = 'IDLE' | 'RUNNING' | 'COMPLETE' | 'CANCELD' | 'ERROR'
export type ProgressRequestType = 'REID' | 'ADDITIONALREID' | ''
export type SSEResponseStatusType = 'SSE_CONNECTION' | 'SSE_DESTROY' | 'REID_START' | 'REID_COMPLETE' | 'REID_CANCEL' | 'UPDATE_THRESHOLD' | 'ADMIN_REID_KILL' | 
'EXPORT_CANCEL' | 'BACKEND_BAD_REQUEST' | 'PYTHON_SERVER_ERROR' | 'COMPLETE' | 'DONE' | 'TIME_DURATION_ERROR' | 'SUCCESS' | 'UKNOWN_DOWNLOAD_FAIL' | 
'LOCAL_DOWNLOAD_FAIL' | 'SOCKET_CONNECTION_FAIL' | 'VIDEO_PATH_NULL' | 'NO_RECORDED_AT_THAT_TIME' | 'SERVER_ALIVE' | 'OMEYE_SERVER_DOWN'
export const SSEResponseErrorMsg: SSEResponseStatusType[] = ['PYTHON_SERVER_ERROR', 'BACKEND_BAD_REQUEST', 'EXPORT_CANCEL', 'ADMIN_REID_KILL', 'TIME_DURATION_ERROR', 'OMEYE_SERVER_DOWN']
export type ProgressDataPercentStatusType = 'WAIT' | 'SUCCESS' | 'FAIL' | 'RUNNING'
export const SSEResponseSingleProgressErrorMsg: SSEResponseStatusType[] = ['LOCAL_DOWNLOAD_FAIL', 'UKNOWN_DOWNLOAD_FAIL', 'SOCKET_CONNECTION_FAIL', 'VIDEO_PATH_NULL', 'NO_RECORDED_AT_THAT_TIME', 'OMEYE_SERVER_DOWN']

export enum SSEResponseMsgTypeKeys {
  REID_START,
  REID_COMPLETE,
  REID_CANCEL,
  SSE_CONNECTION,
  SSE_DESTROY,
  ADMIN_REID_KILL,
  EXPORT_CANCEL,
  BACKEND_BAD_REQUEST,
  PYTHON_SERVER_ERROR,
  TIME_DURATION_ERROR,
  SUCCESS,
  SERVER_ALIVE
}

export const SSEResponseMsgTypes: SSEResponseStatusType[] = ['REID_START', 'REID_COMPLETE', 'REID_CANCEL', 'SSE_CONNECTION', 'SSE_DESTROY', 'ADMIN_REID_KILL', 'EXPORT_CANCEL', 'BACKEND_BAD_REQUEST', 'PYTHON_SERVER_ERROR', 'TIME_DURATION_ERROR', 'SUCCESS', 'SERVER_ALIVE', 'OMEYE_SERVER_DOWN']

type ProgressDataParamsType = {
  conditionIndex: number
  timeIndex: number
  cctvId: CameraDataType['cameraId']
}


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
  status: ProgressDataPercentStatusType
  errReason?: string
}

export type ProgressDataVideoExportPercentType = ProgressDataPercentType & {
  deIdentificationPercent?: number
  encodingPercent?: number
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

export const ReIdRequestFlag = atom<boolean>({
  key: "request/flag",
  default: false
})

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

export const defaultProgressRequestParams: { type: ProgressRequestType, params: ReIDRequestParamsType[] } = {
  type: '',
  params: []
}

export type ProgressrequestParamsDataType = { type: ProgressRequestType, params: ReIDRequestParamsType[] | AdditionalReIDRequestParamsType }

const _progressRequestParamsData = atom<ProgressrequestParamsDataType>({
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