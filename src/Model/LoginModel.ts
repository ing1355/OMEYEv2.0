import { DefaultValue, atom, selector } from "recoil";
import { AuthorizationKey } from "../Constants/GlobalConstantsValues";
import { menuState } from "./MenuModel";
import { conditionRoute } from "./ConditionRouteModel";
import { AreaSelectIndex, AreaSelectVisible, TimeSelectIndex, TimeSelectVisible, _areaIndex, _areaVisible, _timeIndex, _timeVisible } from "./ConditionParamsModalModel";
import { conditionData, conditionListDatas, conditionTargetDatasCCTVTemp, conditionTargetDatasImageTemp, createDefaultConditionData } from "./ConditionDataModel";
import { conditionMenu } from "./ConditionMenuModel";
import { ObjectTypes, ReIDMenuKeys } from "../Components/ReID/ConstantsValues";
import { descriptionData, descriptionInitialData } from "./DescriptionDataModel";
import { GlobalSettingType, globalSettings } from "./GlobalSettingsModel";
import { MonitoringAllData } from "./MonitoringDataModel";
import { PROGRESS_STATUS, ProgressData, ProgressRequestParams, ProgressRequestType, ProgressStatus, ProgressStatusType, defaultProgressRequestParams } from "./ProgressModel";
import { realTimeData, realTimeStatus } from "./RealTimeDataModel";
import { AdditionalReIDTimeValue, ReIDResultSelectedCondition, ReIDResultSelectedView, ReIDSelectedData, _reidResultDatas, globalCurrentReidId } from "./ReIdResultModel";
import { SitesState } from "./SiteDataModel";
import { ReIDObjectTypeKeys } from "../Constants/GlobalTypes";
import { GlobalEvents } from "./GlobalEventsModel";
import { UserDataType } from "../Components/Settings/AccountSettings";
import { LoadableDataType } from "../Constants/NetworkTypes";

const loginToken = atom<string | null>({
    key: "isLogin",
    default: localStorage.getItem(AuthorizationKey)
})

export const isLogin = selector<string | null>({
    key: "isLogin/get",
    get: ({ get }) => get(loginToken),
    set: ({ set }, newValue) => {
        if (!(newValue instanceof DefaultValue)) {
            if (!newValue) { // 로그아웃 - 모든 데이터 초기화

                localStorage.removeItem(AuthorizationKey)

                set(conditionTargetDatasImageTemp, [])
                set(conditionTargetDatasCCTVTemp, [])
                set(conditionData, createDefaultConditionData())
                // 검색 조건 설정 데이터 초기화

                set(AreaSelectVisible, false)
                set(AreaSelectIndex, -1)
                set(TimeSelectIndex, -1)
                set(TimeSelectVisible, false)
                // 검색 조건 설정 부가 설정 데이터 초기화

                set(conditionMenu, ReIDMenuKeys['CONDITION'])
                // 고속 분석 사이드바 메뉴 선택 초기화

                set(conditionRoute, [])
                // 검색 조건 설정 라우팅 초기화

                set(descriptionData, descriptionInitialData)
                // 인상착의 대상 추가 데이터 설정 초기화

                set(conditionListDatas, [])
                // 검색 조건 목록 데이터 초기화

                set(globalSettings, {
                    mapPlatformType: 'ol',
                    maxStoredDay: 365
                } as GlobalSettingType)
                // 전역 설정 데이터 초기화

                set(menuState, null)
                // 메뉴 선택 초기화

                set(MonitoringAllData, {
                    visible: undefined,
                    cctvs: [],
                    status: "IDLE",
                    layoutNum: 1,
                    titleVisible: false
                })
                // 모니터링 데이터 초기화

                set(ProgressData, [])
                set(ProgressStatus, {
                    type: '',
                    status: PROGRESS_STATUS['IDLE']
                } as {
                    type: ProgressRequestType
                    status: ProgressStatusType
                })
                set(ProgressRequestParams, defaultProgressRequestParams)
                // 진행상황 데이터 초기화

                set(realTimeData, {
                    type: ReIDObjectTypeKeys[ObjectTypes['PERSON']],
                    cameraIdList: [],
                    objectId: 0,
                    threshHold: 50,
                    description: undefined
                })
                set(realTimeStatus, PROGRESS_STATUS['IDLE'])
                // 실시간 분석 데이터 초기화

                // 분석 로그 데이터 초기화 - 어차피 계속 Get Api 호출 및 수정이 없으므로 초기화 필요 X

                set(globalCurrentReidId, 0)
                set(_reidResultDatas, [])
                set(ReIDSelectedData, [])
                set(ReIDResultSelectedView, [0])
                set(ReIDResultSelectedCondition, 0)
                set(AdditionalReIDTimeValue, undefined)
                // 분석 결과 데이터 초기화

                set(SitesState, {
                    state: 'IDLE',
                    data: []
                })
                // 사이트 데이터 초기화 - 분석 로그 데이터랑 동일

                // 영상 반출 데이터 초기화 - 반출 이력 제외 로컬 데이터라 초기화 필요 X

                set(GlobalEvents, {
                    key: ''
                })
                // 전역 이벤트 데이터 초기화
            } else {
                localStorage.setItem(AuthorizationKey, newValue)
            }
            return set(loginToken, newValue)
        }
    }
})

export const userProfile = atom<LoadableDataType<UserDataType|undefined>>({
    key: 'profile',
    default: {
        state: 'RUNNING',
        data: undefined
    }
  })