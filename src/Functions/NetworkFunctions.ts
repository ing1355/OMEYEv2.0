import axios, { AxiosHeaderValue, AxiosHeaders, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { GetAuthorizationToken } from "../Constants/GlobalConstantsValues";
import { CameraDataType, CaptureResultListItemType, ReIDObjectTypeKeys, ReIDResultType, SiteDataType } from "../Constants/GlobalTypes";
import { CCTVIconUploadApi, GetAllSitesDataApi, GetCCTVVideoInfoUrl, GetReidDataApi, PatchFileUploadApi, RefreshApi, ReidCancelApi, ServerControlApi, ServerLogFilesDownloadApi, StartReIdApi, StopAllVMSVideoApi, StopVMSVideoApi, StorageMgmtApi, SubmitCarVrpApi, SubmitPersonDescriptionInfoApi, SubmitTargetInfoApi, VideoExportCancelApi, VmsExcelUploadApi, mapFileUploadApi } from "../Constants/ApiRoutes";
import { ReIDLogDataType } from "../Model/ReIDLogModel";
import { DescriptionRequestParamsType } from "../Model/DescriptionDataModel";
import { convertFromClientToServerFormatObjectData } from "./GlobalFunctions";
import { ReIDRequestParamsType } from "../Model/ReIdResultModel";

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

export const reidCancelFunc = (): void => {
    console.debug("ReIdCancelFunc Request!!")
    navigator.sendBeacon(ReidCancelApi, GetAuthorizationToken());
}

export const videoExportCancelFunc = (): void => {
    console.debug("ReIdCancelFunc Request!!")
    navigator.sendBeacon(VideoExportCancelApi, GetAuthorizationToken());
}

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

export const ReIDStartApi = async (params: ReIDRequestParamsType[]): Promise<{ reIdId: number, storageAlert: boolean }> => {
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