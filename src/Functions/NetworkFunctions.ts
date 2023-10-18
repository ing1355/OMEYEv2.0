import axios, { AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { AuthorizationKey } from "../Constants/GlobalConstantsValues";
import { CameraDataType, CaptureResultListItemType, ReIDResultDataType } from "../Constants/GlobalTypes";
import { GetCCTVVideoInfoUrl, GetReidDataApi, ReidCancelApi, StartReIdApi, StopAllVMSVideoApi, StopVMSVideoApi, SubmitCarVrpApi, SubmitPersonDescriptionInfoApi, SubmitTargetInfoApi } from "../Constants/ApiRoutes";
import { ReIDLogDataType } from "../Model/ReIDLogModel";
import { PersonDescriptionResultType, descriptionDataType } from "../Components/ReID/Condition/TargetSelect/PersonDescription/DescriptionType";
import { DescriptionRequestParamsType } from "../Model/DescriptionDataModel";

type AxiosMethodType = "GET" | "POST" | "PUT" | "DELETE"

export async function Axios(method: AxiosMethodType, url: CreateAxiosDefaults['url'], bodyOrParams?: CreateAxiosDefaults['data'] | CreateAxiosDefaults['params'], isFullResponse?: boolean): Promise<any> {
    const options: AxiosRequestConfig<any> = {
        method,
        url,
        responseType: 'json',
        timeout: ([StartReIdApi, SubmitPersonDescriptionInfoApi].includes(url!) || url?.startsWith("/test")) ? 999999999 : 5000,
        headers: {
            "Content-Type": "application/json",
            'Authorization': localStorage.getItem(AuthorizationKey)
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
        console.log(err)
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

export async function GetReIDResultById(reidId: ReIDLogDataType['reidId']): Promise<ReIDResultDataType> {
    return await Axios('GET', GetReidDataApi(reidId))
}

export function StartPersonDescription(param: DescriptionRequestParamsType): Promise<{uuid: string}> {
    return Axios('POST', SubmitPersonDescriptionInfoApi, param)
}

export async function GetObjectIdByImage(targets: {
    type: CaptureResultListItemType['type']
    image: CaptureResultListItemType['src']
    mask?: CaptureResultListItemType['mask']
    vrp?: CaptureResultListItemType['vrp']
}[]): Promise<number[]> {
    return await Axios("POST", SubmitTargetInfoApi, targets.map(_ => {
        let temp: {
            type: CaptureResultListItemType['type']
            image: string
            mask?: CaptureResultListItemType['mask']
            vrp?: CaptureResultListItemType['vrp']
        } = {
            type: _.type,
            image: _.image.split(',')[1],
            mask: _.mask,
            vrp: _.vrp
        }
        if (_.type === 'Face') {
            temp['mask'] = _.mask
        }
        return temp
    }))
}

export async function SubmitCarVrp(vrpInfo: {
    id: number
    image: string
    type: "register" | "modify"
    vrp: string
}[]) {
    return await Axios("POST", SubmitCarVrpApi, vrpInfo)
}

export const reidCancelFunc = (): void => {
    navigator.sendBeacon(ReidCancelApi, localStorage.getItem('Authorization'));
}

export const streamingAllStopRequest = () => {
    navigator.sendBeacon(StopAllVMSVideoApi, localStorage.getItem('Authorization'));
};

export const streamingStopRequest = async (uuids: string[]) => {
    return await Axios("POST", StopVMSVideoApi, {
        uuids
    })
}