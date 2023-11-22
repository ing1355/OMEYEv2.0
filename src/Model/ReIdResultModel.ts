import { DefaultValue, atom, selector, selectorFamily } from "recoil";
import { CameraDataType, ReIDObjectTypeKeys, ReIDResultDataResultListDataType, ReIDResultType, TimeDataType } from "../Constants/GlobalTypes";
import { ConditionDataSingleType } from "./ConditionDataModel";
import { TimeModalDataType } from "../Components/ReID/Condition/Constants/TimeModal";
import { ReIDResultTestData } from "./TestDatas";

export type ReIDRequestParamsType = {
  title: ConditionDataSingleType['name']
  timeGroups: TimeDataType[]
  cctvIds: CameraDataType['cameraId'][][]
  rank: ConditionDataSingleType['rank']
  etc: ConditionDataSingleType['etc']
  objects: {
    id: number
    type: ReIDObjectTypeKeys
    src: string
  }[]
}

export type AdditionalReIDRequestParamsType = ReIDRequestParamsType & {
  reIdId?: number
}

export const _reidResultDatas = atom<ReIDResultType[]>({
  key: "reidResult/data",
  default: []
  // default: ReIDResultTestData
})

const _reidSelectedDatas = atom<{
  reIdId: number
  datas: {
    [key: number]: ReIDResultDataResultListDataType[]
  }[]
}[]>({
  key: "reidResult/selected/data",
  default: []
})

const _reidResultSelctedView = atom<number[]>({
  key: "reid/selectedView",
  default: [0]
})

const _reidResultSelctedCondition = atom<number>({
  key: "reid/selectedCondition",
  default: 0
})

const _additionalReidTimeValue = atom<TimeModalDataType | undefined>({
  key: "reid/additional/timevalue",
  default: undefined
})

export const globalCurrentReidId = atom<number>({
  key: "reid/currentId",
  default: 0
})

export const ReIDResultDataKeys = selector({
  key: 'reidResult/key/selector',
  get: ({ get }) => get(_reidResultDatas).map(_ => _.reIdId)
})

export const AllReIDSelectedResultData = selector({
  key: 'reidResult/all/selector',
  get: ({ get }) => get(_reidResultDatas),
  set: ({ get, set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      const sDatas = get(_reidSelectedDatas)
      newValue.forEach(_ => {
        if (!sDatas.find(__ => __.reIdId === _.reIdId)) {
          set(_reidSelectedDatas, sDatas.concat({
            reIdId: _.reIdId,
            datas: Array.from({ length: _.data.length }).map((__, ind) => _.data[ind].resultList.reduce((pre, cur) => ({
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
  get: (key: number) => ({ get }) => get(_reidSelectedDatas).find(_ => _.reIdId === key)?.datas,
  set: (key: number) => ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_reidSelectedDatas, prev => prev.map((_) => _.reIdId === key ? {
        ..._,
        datas: newValue!
      } : _))
    }
  }
})

export const ReIDResultData = selectorFamily({ // 추가 동선 때 사용 할 selector
  key: 'reidResult/data/selectorFamily',
  get: (key: number | null) => ({ get }) => {
    return get(_reidResultDatas).find(_ => _.reIdId === key)
  },
  set: (key: number | null) => ({ get, set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      const temp = get(_reidResultDatas).find(_ => _.reIdId === key)
      if (temp?.data.length !== newValue?.data.length) {
        const selectedTemp = get(_reidSelectedDatas)
        set(_reidSelectedDatas, selectedTemp.map(_ => _.reIdId === key ? ({
          reIdId: _.reIdId,
          datas: _.datas.concat(newValue!.data[newValue!.data.length - 1].resultList.reduce((acc, val) => ({ ...acc, [val.objectId]: [] }), {}))
        }) : _))
      }
      return set(_reidResultDatas, prev => prev.map(_ => _.reIdId === key ? newValue! : _))
    }
  }
})

export const ReIDAllResultData = selector({ // reid 결과 받아서 결과 추가할 때 사용할 selector
  key: 'reidResult/data/all/selector',
  get: ({ get }) => {
    return get(_reidResultDatas)
  },
  set: ({ get, set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      const temp = get(_reidResultDatas)
      const tempValueIds = temp.map(_ => _.reIdId)
      const newValueIds = newValue.map(_ => _.reIdId)
      const selectedTemp = get(_reidSelectedDatas)
      const needAddedReId = newValue.find(_ => !tempValueIds.includes(_.reIdId))
      const needDeletedReId = temp.find(_ => !newValueIds.includes(_.reIdId))
      if (temp.length === 0 && newValue.length > 0) {
        set(_reidResultSelctedView, [newValue[0].reIdId])
      }
      if (needAddedReId) { // 새로 분석 요청 했을 시
        set(_reidSelectedDatas, [...selectedTemp, {
          reIdId: needAddedReId.reIdId,
          datas: needAddedReId.data.map(_ => _.resultList.reduce((acc, val) => ({
            ...acc, [val.objectId]: []
          }), {}))
        }])
      } else if (needDeletedReId) {
        set(_reidSelectedDatas, selectedTemp.filter(_ => _.reIdId !== needDeletedReId.reIdId))
      } else if (temp.length === newValue.length) {
        const targetInd = temp.findIndex((_, ind) => _.data.length !== newValue[ind].data.length) // 결과 바로보기로 본 데이터와 기존 보고있던 데이터가 다를 때(다른 사용자가 추가 동선 등)
        if (targetInd !== -1) {
          set(_reidSelectedDatas, [...selectedTemp, {
            reIdId: newValue[targetInd].reIdId,
            datas: newValue[targetInd].data.map(_ => _.resultList.reduce((acc, val) => ({ // 기존 선택하던건 날리고 새로 갱신
              ...acc, [val.objectId]: []
            }), {}))
          }])
        }
      }
      return set(_reidResultDatas, newValue)
    }
  }
})

export const ReIDResultByObjectType = selectorFamily({
  key: 'reidResult/objectType/selectorFamily',
  get: (key: ReIDObjectTypeKeys) => ({ get }) => get(_reidResultDatas).filter(_ => _.data[0].resultList[0].objectType === key)
})

export const ReIDResultSelectedView = selector({
  key: 'reidResult/selectedView/selector',
  get: ({ get }) => {
    return get(_reidResultSelctedView)
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_reidResultSelctedView, newValue)
    }
  }
})

export const ReIDResultSelectedCondition = selector({
  key: 'reidResult/selectedCondition/selector',
  get: ({ get }) => {
    return get(_reidResultSelctedCondition)
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_reidResultSelctedCondition, newValue)
    }
  }
})

export const AdditionalReIDTimeValue = selector({
  key: "reid/additional/timevalue/selector",
  get: ({ get }) => {
    return get(_additionalReidTimeValue)
  },
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      return set(_additionalReidTimeValue, newValue)
    }
  }
})
