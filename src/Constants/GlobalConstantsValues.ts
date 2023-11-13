import { EventSourcePolyfill } from "event-source-polyfill"

const EventSource = EventSourcePolyfill

// Data Keys
export const AuthorizationKey = 'Authorization'

// Menu Keys
// type MainMenuKeyType = 'MAINMENU'
type ReIdMenuKeyType = 'REIDMENU'
type MonitoringMenuKeyType = 'MONITORINGMENU'
type VideoExportMenuKeyType = 'VIDEOEXPORTMENU'
type AreaAnalyzeMenuKeyType = 'AREAANALAYZE'
type SettingsMenuKeyType = 'SETTINGSMENU'
export type MenuKeys = ReIdMenuKeyType | MonitoringMenuKeyType | VideoExportMenuKeyType | AreaAnalyzeMenuKeyType | SettingsMenuKeyType| null
// export const MainMenuKey: MainMenuKeyType = 'MAINMENU'
export const ReIdMenuKey: ReIdMenuKeyType = 'REIDMENU'
export const MonitoringMenuKey: MonitoringMenuKeyType = 'MONITORINGMENU'
export const VideoExportMenuKey: VideoExportMenuKeyType = 'VIDEOEXPORTMENU'
export const AreaAnalyzeMenuKey: AreaAnalyzeMenuKeyType = 'AREAANALAYZE'
export const SettingsMenuKey: SettingsMenuKeyType = 'SETTINGSMENU'

export const GetAuthorizationToken = () => localStorage.getItem('Authorization')

export const CustomEventSource = (url: string) => new EventSource(url, {
    headers: {
        Authorization: GetAuthorizationToken()!
    },
    heartbeatTimeout: 3600000
})

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Global Data Form

// 커스텀 에러 객체 생성(Http 에러, Validation 에러, Route 에러 - 잘못된 페이지 접근, 그 외 에러...)

// export class NetworkError extends Error {
//     code: number
//     errorCode: string
//     extraData: any
//     constructor(origin: Error, {code, message, errorCode, extraData}: {
//         code: number
//         errorCode: string
//         message: string
//         extraData: any
//     }) {
//         super();
//         this.code = code
//         this.errorCode = errorCode
//         this.extraData = extraData
//     }
// }