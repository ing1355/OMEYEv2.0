import { atom } from "recoil";

type GlobalEventKeysType = 'StackManagementServer' | 'ReIDStart' | 'RealTimeStart' | 'RealTimeStack' | 'AllMenuStateInit' | 'VideoExportStart' | 'Cancel' | 'Refresh' | ''

export const GlobalEvents = atom<{
    key: GlobalEventKeysType,
    data?: any
    params?: any
}>({
    key: "events",
    default: {
        key: '',
        data: undefined
    },
})