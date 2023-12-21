import axios, { AxiosHeaderValue, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { GetAuthorizationToken } from "../Constants/GlobalConstantsValues";
import { CameraDataType, CaptureResultListItemType, ReIDResultType, SiteDataType } from "../Constants/GlobalTypes";
import { CCTVIconUploadApi, CancelManagementExportVideoApi, CancelManagementReIDApi, CancelManagementRealTimeApi, GetAllSitesDataApi, GetCCTVVideoInfoUrl, GetManagementListApi, GetReidDataApi, GetUserProfileApi, PatchFileUploadApi, RefreshApi, ServerControlApi, ServerLogFilesDownloadApi, StackManagementExportVideoApi, StackManagementReIDApi, StackManagementRealTimeApi, StartReIdApi, StopAllVMSVideoApi, StopVMSVideoApi, StorageMgmtApi, SubmitCarVrpApi, SubmitPersonDescriptionInfoApi, SubmitTargetInfoApi, VideoExportCancelApi, VmsExcelUploadApi, mapFileUploadApi } from "../Constants/ApiRoutes";
import { ReIDLogDataType } from "../Model/ReIDLogModel";
import { DescriptionRequestParamsType } from "../Model/DescriptionDataModel";
import { convertFromClientToServerFormatObjectData } from "./GlobalFunctions";
import { ReIDRequestParamsType } from "../Model/ReIdResultModel";
import { ManagementServerSingleDataType } from "../Model/ServerManagementModel";
import { UserDataType } from "../Components/Settings/AccountSettings";

type AxiosMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export const getLocalIp = async (url: string) => {
    const conn = new RTCPeerConnection()
    conn.createDataChannel('')
    conn.setLocalDescription(await conn.createOffer())
    return await new Promise((resolve, reject) => {
        conn.onicecandidate = ice => {
            if (ice && ice.candidate && ice.candidate.candidate) {
                const ip = ice.candidate.candidate.split(' ')[4]
                resolve(ip)
                conn.close()
            } else {
                reject('ip connection fail')
            }
        }
    })
}

export async function Axios(method: AxiosMethodType, url: CreateAxiosDefaults['url'], bodyOrParams?: CreateAxiosDefaults['data'] | CreateAxiosDefaults['params'], isFullResponse?: boolean, Authorization?: AxiosHeaderValue): Promise<any> {
    const options: AxiosRequestConfig<any> = {
        method,
        url,
        responseType: ([ServerLogFilesDownloadApi].includes(url!)) ? 'blob' : 'json',
        timeout: ([StartReIdApi, SubmitPersonDescriptionInfoApi, ServerControlApi, PatchFileUploadApi, StorageMgmtApi].includes(url!) || url?.startsWith("/test")) ? 999999999 : 5000,
        headers: {
            "Content-Type": ([VmsExcelUploadApi, PatchFileUploadApi, mapFileUploadApi, CCTVIconUploadApi].includes(url!)) ? 'multipart/form-data' : "application/json",
            'Authorization': GetAuthorizationToken(),
        }
    }
    if(Authorization) {
        options.headers!.Authorization = Authorization
    }
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        options.data = bodyOrParams
    } else {
        options.params = bodyOrParams
    }
    return axios(options).then(res => {
        if (res) {
            if (isFullResponse) return res
            if(res.data && res.data.success) return res.data.rows
            else return res.data
        }
    }).catch(err => {
        console.error(err)
    })
}

export type VideoInfoByCameraIdType = {
    channel: number
    uuid: string
    url: string
}

export async function GetVideoInfoByCCTVId(cctvId: CameraDataType['cameraId']): Promise<VideoInfoByCameraIdType> {
    return await Axios('GET', GetCCTVVideoInfoUrl(cctvId))
}

export async function GetReIDResultById(reidId: ReIDLogDataType['reidId']): Promise<ReIDResultType> {
    return await Axios('GET', GetReidDataApi(reidId))
}

export function StartPersonDescription(param: DescriptionRequestParamsType): Promise<{ uuid: string }> {
    return Axios('POST', SubmitPersonDescriptionInfoApi, param)
}

export type ServerObjectDataType = {
    id?: number
    type: CaptureResultListItemType['type']
    image: string
    isMask?: CaptureResultListItemType['mask']
    ocr?: CaptureResultListItemType['ocr']
    attribution?: CaptureResultListItemType['description']
    method?: CaptureResultListItemType['method']
    detectTime?: CaptureResultListItemType['time']
    accuracy?: CaptureResultListItemType['accuracy']
    cctvId?: CaptureResultListItemType['cctvId']
    isAutoCapture?: CaptureResultListItemType['isAutoCapture']
}

export async function GetObjectIdByImage(targets: CaptureResultListItemType[]): Promise<number[]> {
    return await Axios("POST", SubmitTargetInfoApi, targets.map(_ => convertFromClientToServerFormatObjectData(_)))
}

export async function SubmitCarVrp(vrpInfo: {
    id: number
    image: string
    type: "register" | "modify"
    ocr: string
}[]) {
    return await Axios("POST", SubmitCarVrpApi, vrpInfo)
}

export const ManagementCancelFunc = (type: ManagementServerSingleDataType['type'], id: ManagementServerSingleDataType['id'], callback?: () => void): void => {
    console.debug(`Management Cancel Request : (${type},${id})`)
    // Axios('POST', type === 'REID' ? CancelManagementReIDApi : (type === 'REALTIME' ? CancelManagementRealTimeApi : CancelManagementExportVideoApi), id).then(_ => {
    //     if(callback) callback()
    // })
    navigator.sendBeacon(type === 'REID' ? CancelManagementReIDApi : (type === 'REALTIME' ? CancelManagementRealTimeApi : CancelManagementExportVideoApi), id.toString());
}

// export const videoExportCancelFunc = (): void => {
//     console.debug("ReIdCancelFunc Request!!")
//     navigator.sendBeacon(VideoExportCancelApi, GetAuthorizationToken());
// }

export const streamingAllStopRequest = () => {
    navigator.sendBeacon(StopAllVMSVideoApi, GetAuthorizationToken());
};

export const refreshFunction = () => {
    navigator.sendBeacon(RefreshApi, GetAuthorizationToken());
};

export const streamingStopRequest = async (uuids: string[]) => {
    return await Axios("POST", StopVMSVideoApi, {
        uuids
    })
}

export const GetAllSitesData = async () => {
    const res = (await Axios("GET", GetAllSitesDataApi)) as SiteDataType[] || []
    console.debug('Sites Data Get Success : ', res)
    return res
}

export const GetProfileData = async () => {
    const res = (await Axios("GET", GetUserProfileApi)) as UserDataType
    console.debug('Profile Get Success : ', res)
    return res
}

export const ReIDStartApi = async (params: ReIDRequestParamsType[]): Promise<{ reIdId: number, storageExceeded: boolean }> => {
    const res = await Axios('POST', StartReIdApi, params.map(_ => ({
        etc: _.etc,
        objectIds: _.objects.map(__ => __.id),
        timeGroups: _.timeGroups,
        cctvIds: _.cctvIds,
        title: _.title,
        rank: _.rank
    })))
    return res
}

export const GetManagementList = async (): Promise<ManagementServerSingleDataType[]> => {
    const res = await Axios('GET', GetManagementListApi)
    return res
}

export const RequestToManagementServer = async (type: ManagementServerSingleDataType['type'], params: any, callback?: (params: any) => void) => {
    let url = ''
    if(type === 'REALTIME') url = StackManagementRealTimeApi
    if(type === 'REID') url = StackManagementReIDApi
    if(type === 'VIDEO_EXPORT') url = StackManagementExportVideoApi
    const res = await Axios('POST', url, params)
    if(res) {
        if(callback) callback(res)
    }
}