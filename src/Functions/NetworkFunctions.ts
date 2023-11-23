import axios, { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { AuthorizationKey, GetAuthorizationToken } from "../Constants/GlobalConstantsValues";
import { CameraDataType, CaptureResultListItemType, ReIDObjectTypeKeys, ReIDResultType } from "../Constants/GlobalTypes";
import { CCTVIconUploadApi, GetCCTVVideoInfoUrl, GetReidDataApi, ReidCancelApi, StartReIdApi, StopAllVMSVideoApi, StopVMSVideoApi, SubmitCarVrpApi, SubmitPersonDescriptionInfoApi, SubmitTargetInfoApi, VideoExportCancelApi, VmsExcelUploadApi, mapFileUploadApi, modelFileUploadApi, serverControlApi, serverLogFilesDownloadApi } from "../Constants/ApiRoutes";
import { ReIDLogDataType } from "../Model/ReIDLogModel";
import { DescriptionRequestParamsType } from "../Model/DescriptionDataModel";
import { ObjectTypes } from "../Components/ReID/ConstantsValues";

type AxiosMethodType = "GET" | "POST" | "PUT" | "DELETE"

export async function Axios(method: AxiosMethodType, url: CreateAxiosDefaults['url'], bodyOrParams?: CreateAxiosDefaults['data'] | CreateAxiosDefaults['params'], isFullResponse?: boolean): Promise<any> {
    const options: AxiosRequestConfig<any> = {
        method,
        url,
        responseType: ([serverLogFilesDownloadApi].includes(url!)) ? 'blob' : 'json',
        timeout: ([StartReIdApi, SubmitPersonDescriptionInfoApi, serverControlApi, modelFileUploadApi].includes(url!) || url?.startsWith("/test")) ? 999999999 : 5000,
        headers: {
            "Content-Type": ([VmsExcelUploadApi, modelFileUploadApi, mapFileUploadApi, CCTVIconUploadApi].includes(url!)) ? 'multipart/form-data' : "application/json",
            'Authorization': GetAuthorizationToken()
        }
    }
    if (method === 'POST' || method === 'PUT') {
        options.data = bodyOrParams
    } else {
        options.params = bodyOrParams
    }
    return axios(options).then(res => {
        if(res) {
            if (isFullResponse) return res
            return res.data.rows
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

export function StartPersonDescription(param: DescriptionRequestParamsType): Promise<{uuid: string}> {
    return Axios('POST', SubmitPersonDescriptionInfoApi, param)
}

export async function GetObjectIdByImage(targets: {
    type: CaptureResultListItemType['type']
    image: CaptureResultListItemType['src']
    mask?: CaptureResultListItemType['mask']
    ocr?: CaptureResultListItemType['ocr']
    attribution?: CaptureResultListItemType['description']
}[]): Promise<number[]> {
    return await Axios("POST", SubmitTargetInfoApi, targets.map(_ => {
        let temp: {
            type: CaptureResultListItemType['type']
            image: string
            mask?: CaptureResultListItemType['mask']
            ocr?: CaptureResultListItemType['ocr']
            attribution?: CaptureResultListItemType['description']
        } = {
            type: _.type,
            image: _.image.split(',')[1],
            mask: _.mask,
            ocr: _.ocr,
            attribution: _.attribution
        }
        if (_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']]) {
            temp['mask'] = _.mask
        }
        return temp
    }))
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

export const streamingStopRequest = async (uuids: string[]) => {
    return await Axios("POST", StopVMSVideoApi, {
        uuids
    })
}