import { DefaultValue, atom, selector, selectorFamily } from "recoil";
import { CameraDataType, ReIDResultDataResultListDataType, ReIDResultType } from "../Constants/GlobalTypes";
import { ConditionDataSingleType } from "./ConditionDataModel";

type ReIDStatusType = 'IDLE' | 'RUNNING'


export type ReIDRequestParamsType = {
  title: ConditionDataSingleType['name']
  timeAndArea: {
    startTime: string
    endTime: string
    cctvs: CameraDataType['cameraId'][]
  }[]
  rank: ConditionDataSingleType['rank']
  etc: ConditionDataSingleType['etc']
  objectIds: number[]
}

export const REIDSTATUS: {
  [key in ReIDStatusType]: ReIDStatusType
} = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING'
}

export const _reidStatus = atom<ReIDStatusType>({
  key: "reidResult",
  default: 'IDLE'
})

const _reidResultDatas = atom<ReIDResultType[]>({
  key: "reidResult/data",
  default: []
})

const _reidSelectedDatas = atom<{
  resultId: number
  datas: {
    [key: number]: ReIDResultDataResultListDataType[]
  }[]
}[]>({
  key: "reidResult/selected/data",
  default: []
})

export const ReIDStatus = selector({
  key: "reidResult/selector",
  get: ({ get }) => get(_reidStatus),
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_reidStatus, newValue)
    }
  }
})

// export const ReIDResultData = selector({
//   key: "reidResult/data/selector",
//   get: ({ get }) => get(_reidResultDatas),
//   set: ({ set }, newValue) => {
//     if (!(newValue instanceof DefaultValue)) {
//       return set(_reidResultDatas, newValue)
//     }
//   }
// })

export const ReIDResultDataKeys = selector({
  key: 'reidResult/key/selector',
  get: ({ get }) => get(_reidResultDatas).map(_ => _.resultId)
})

export const AllReIDResultData = selector({
  key: 'reidResult/all/selector',
  get: ({ get }) => get(_reidResultDatas),
  set: ({ get, set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      const sDatas = get(_reidSelectedDatas)
      newValue.forEach(_ => {
        if(!sDatas.find(__ => __.resultId === _.resultId)) {
          set(_reidSelectedDatas, sDatas.concat({
            resultId: _.resultId,
            datas: Array.from({length: _.data.length}).map((__, ind) => _.data[ind].resultList.reduce((pre, cur) => ({
              ...pre, [cur.objectId]: []
            }), {}))
          }))
        }
      })
      return set(_reidResultDatas, newValue)
    }
  }
})

export const ReIDSelectedData = selector({
  key: 'reidResult/selected/selector',
  get: ({ get }) => get(_reidSelectedDatas),
  set: ({ set }, newValue) => {
    return set(_reidSelectedDatas, newValue)
  }
})

export const SingleReIDSelectedData = selectorFamily({
  key: 'reidResult/selected/single/selector',
  get: (key: number) => ({ get }) => get(_reidSelectedDatas).find(_ => _.resultId === key)?.datas,
  set: (key: number) => ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_reidSelectedDatas, prev => prev.map((_) => _.resultId === key ? {
        ..._,
        datas: newValue!
      } : _))
    }
  }
})

export const ReIDResultData = selectorFamily({
  key: 'reidResult/data/selectorFamily',
  get: (key: number) => ({ get }) => {
    return get(_reidResultDatas).find(_ => _.resultId === key)
  },
  set: (key: number) => ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_reidResultDatas, prev => prev.map(_ => _.resultId === key ? newValue! : _))
    }
  }
})