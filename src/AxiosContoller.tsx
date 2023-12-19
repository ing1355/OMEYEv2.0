import axios from "axios"
import { useLayoutEffect, useRef } from "react"
import { getLocalIp } from "./Functions/NetworkFunctions"
import useMessage from "./Hooks/useMessage"
import { useRecoilValue } from "recoil"
import { CurrentLang } from "./Model/LanguageModel"

type ServerErrorDataType = {
    code: number
    errorTitle: string
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
        document.documentElement.lang = lang
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
                        console.debug("Patch Error : ", pyResponse)
                        _message.error({
                            title: errorCode,
                            msg: message
                        })
                    } catch (e) {
                        console.debug(e)
                    }
                } else {
                    console.debug("Backend Error : ", data)
                    const { code, errorTitle, errorCode, extraData, message, success } = data as ServerErrorDataType
                    if (!success) {
                        if(errorCode && errorTitle) {
                            _message.error({
                                title: `${errorCode} - ${errorTitle}`,
                                msg: message
                            })
                        } else {
                            _message.error({
                                title: '서버 연결 실패',
                                msg: '서버와의 연결이 종료되었습니다.\n관리자에게 문의하세요.'
                            })
                        }
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