import { RecoilState, useRecoilState } from "recoil"

function useRecoilStateWithType<T>(recoilState: RecoilState<T>) {
    return useRecoilState(recoilState)
}

export {useRecoilStateWithType}