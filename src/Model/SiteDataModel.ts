import { atom, selector, selectorFamily } from "recoil";
import { GetAllSitesDataApi } from "../Constants/ApiRoutes";
import { CameraDataType, SiteDataType } from "../Constants/GlobalTypes";
import { Axios } from "../Functions/NetworkFunctions";
import { MakeVMSCameraSitesForTreeView } from "../Functions/GlobalFunctions";

const _SitesData = selector<SiteDataType[]>({
    key: "SiteData/selector",
    get: async ({get}) => {
        const res = await Axios("GET", GetAllSitesDataApi) as SiteDataType[] || []
        console.debug('Sites Data Get Success : ', res)
        return res
    }
})

export const SitesData = atom<SiteDataType[]>({
    key: "SiteData",
    default: _SitesData
})

export const SitesDataForTreeView = selector({
    key: "SiteData/selector/tree",
    get: ({get}) => {
        return MakeVMSCameraSitesForTreeView(get(SitesData))
    }
})

export const GetCameraById = selectorFamily({
    key: "SiteData/selector/camera/id",
    get: (cctvId: CameraDataType['cameraId']) => ({get}) => {
        return get(SitesData).flatMap(_ => _.cameras).find(_ => _.cameraId === cctvId)
    }
})