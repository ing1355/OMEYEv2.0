import { atom, selector, selectorFamily, useRecoilState } from "recoil";
import { CameraDataType, SiteDataType } from "../Constants/GlobalTypes";
import { GetAllSitesData } from "../Functions/NetworkFunctions";
import { MakeVMSCameraSitesForTreeView } from "../Functions/GlobalFunctions";
import { LoadableDataType } from "../Constants/NetworkTypes";

const _SitesData = atom({
    key: "SiteData",
    default: {
        state: 'IDLE',
        data: []
    } as LoadableDataType<SiteDataType[]>
})

export const SitesState = selector({
    key: "SiteState/selector",
    get: ({get}) => get(_SitesData),
    set: ({set}, newValue) => {
        set(_SitesData, newValue)
    }
})

export const SitesData = selector({
    key: "SiteData/selector",
    get: ({get}) => {
        return get(_SitesData).data
    }
})

export const SitesDataForTreeView = selector({
    key: "SiteData/selector/tree",
    get: ({get}) => {
        return MakeVMSCameraSitesForTreeView(get(SitesData))
    }
})

export const GetAllSiteCameras = selector({
    key: "SiteData/selector/cameras",
    get: ({get}) => {
        return get(SitesData).flatMap(_ => _.cameras)
    }
})

export const GetCameraById = selectorFamily({
    key: "SiteData/selector/camera/id",
    get: (cctvId: CameraDataType['cameraId']) => ({get}) => {
        return get(SitesData).flatMap(_ => _.cameras).find(_ => _.cameraId === cctvId)
    }
})

export const useSites = () => {
    const [sites, setSites] = useRecoilState(SitesState)
    const refresh = async () => {
        setSites({
            state: 'RUNNING',
            data: []
        })
        const res = await GetAllSitesData()
        setSites({
            state: 'IDLE',
            data: res || sites.data
        })
    }

    return {refresh, sitesData: sites.data}
}