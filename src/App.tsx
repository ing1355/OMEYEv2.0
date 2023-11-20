import './App.css';
import Login from './Components/Login';
import Main from './Components/Main';
import styled from 'styled-components';
import { globalStyles } from './styles/global-styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLogin } from './Model/LoginModel';
import Layout from './Components/Layout';
import ErrorHandleComponent from './ErrorHandleComponent';
import { useEffect, useLayoutEffect, useState } from 'react';
import useMessage from './Hooks/useMessage';
import axios, { HttpStatusCode } from 'axios';
import { IS_PRODUCTION } from './Constants/GlobalConstantsValues';

type ServerErrorDataType = {
  code: number
  errorCode: string
  extraData: any
  message: string
  success: boolean
}

const serverErrorTitleByStatusCode = (code: HttpStatusCode) => {
  switch (code) {
    case 502:
      return '서버 접속 불가'
    case 500:
      return '서버 에러'
    case 400:
      return '올바르지 않은 파라미터'
    case 401:
      return '인증 실패'
    default: return '에러'
  }
}

const getLocalIp = async () => {
  const conn = new RTCPeerConnection()
  conn.createDataChannel('')
  conn.setLocalDescription(await conn.createOffer())
  return await new Promise((resolve, reject) => {
    conn.onicecandidate = ice => {
      if (ice && ice.candidate && ice.candidate.candidate) {
        resolve(ice.candidate.candidate.split(' ')[4])
        conn.close()
      } else {
        reject('ip connection fail')
      }
    }
  })
}

const App = () => {
  const [loginState, setLoginState] = useRecoilState(isLogin)
  const [handlerComplete, setHandlerComplete] = useState(false)
  const _message = useMessage()

  useEffect(() => {
    if (loginState) {
      if(IS_PRODUCTION) {
        window.addEventListener('beforeunload', e => {
          e.preventDefault()
          e.returnValue = ''
        })
      }
    }
    return () => {

    }
  }, [loginState])

  useLayoutEffect(() => {
    axios.interceptors.request.use(async req => {
      req.headers['X-Forwarded-For'] = await getLocalIp()
      return req
    })
    axios.interceptors.response.use(res => {
      return res;
    }, err => {
      console.error(err)
      if (err.response) {
        const { status, data } = err.response
        const { code, errorCode, extraData, message, success } = data as ServerErrorDataType
        _message.error({
          title: serverErrorTitleByStatusCode(status),
          msg: status !== 502 ? (errorCode || message) : '서버 상태를 확인해주세요.'
        })
        if (code === 401 || status === 502) {
          setLoginState(null)
        }
      }
      return Promise.reject(err)
    })
    setHandlerComplete(true)
  }, [])

  return handlerComplete ? <ErrorHandleComponent>
    <MainContainer>
      {
        loginState ? <Layout>
          <Main />
        </Layout> : <Login />
      }
    </MainContainer>
  </ErrorHandleComponent> : <></>;
}

export default App;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  ${globalStyles.flex({})}
  padding: 0 8px 8px;
  overflow: hidden;
`