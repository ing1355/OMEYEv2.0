import axios from "axios"
import { useLayoutEffect, useRef } from "react"
import { getLocalIp } from "./Functions/NetworkFunctions"
import useMessage from "./Hooks/useMessage"
import { useRecoilValue } from "recoil"
import { CurrentLang } from "./Model/LanguageModel"

type ServerErrorDataType = {
    code: number
    errorCode: string
    extraData: any
    message: string
    success: boolean
  }

const AxiosController = () => {
    const lang = useRecoilValue(CurrentLang)
    const langRef = useRef(lang)
    const _message = useMessage()

    useLayoutEffect(() => {
        langRef.current = lang
    },[lang])

    useLayoutEffect(() => {
        axios.interceptors.request.use(async req => {
            req.headers['X-Forwarded-For'] = await getLocalIp(req.url!)
            req.headers['Service-Language'] = langRef.current
            return req
        })
        axios.interceptors.response.use(res => {
            return res;
        }, async err => {
            console.error('Axios error : ', err)
            if (err.response) {
                const { status, data } = err.response
                if (data instanceof Blob) {
                    try {
                        const pyResponse = JSON.parse(await data.text())
                        const { code, errorCode, extraData, message, success } = pyResponse as ServerErrorDataType
                        _message.error({
                            title: errorCode,
                            msg: message
                        })
                    } catch (e) {
                        console.debug(e)
                    }
                } else {
                    const { code, errorCode, extraData, message, success } = data as ServerErrorDataType
                    if (!success) {
                        _message.error({
                            title: errorCode,
                            msg: message
                        })
                    }
                    if (code === 401 || status === 502) {
                        // setLoginState(null)
                    }
                }
            }
            return Promise.reject(err)
        })
    }, [])
    return <></>
}

export default AxiosController