import { useRef } from "react"
import { HealthCheckTimerDuration } from "../Constants/GlobalConstantsValues";
import { useSetRecoilState } from "recoil";
import { isLogin } from "../Model/LoginModel";
import useMessage from "./useMessage";
import { LogoutApi } from "../Constants/ApiRoutes";
import { Axios } from "../Functions/NetworkFunctions";

const useServerConnection = () => {
    const timer = useRef<NodeJS.Timer>()
    const setIsLogin = useSetRecoilState(isLogin)
    const message = useMessage()

    const healthCheckTimerRegister = (callback?: (params?: any) => void) => {
        // if (timer.current) clearTimeout(timer.current)
        // timer.current = setTimeout(() => {
        //     if (callback) callback()
        //     message.preset('SERVER_CONNECTION_ERROR')
        //     Axios("POST", LogoutApi)
        //     setIsLogin(null)
        // }, HealthCheckTimerDuration);
    }

    const healthCheckClear = () => {
        // if (timer.current) clearTimeout(timer.current)
    }

    return { healthCheckTimerRegister, healthCheckClear }
}

export default useServerConnection