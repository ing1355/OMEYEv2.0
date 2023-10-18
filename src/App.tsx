import './App.css';
import Login from './Components/Login';
import Main from './Components/Main';
import styled from 'styled-components';
import { globalStyles } from './styles/global-styled';
import { useRecoilValue } from 'recoil';
import { isLogin } from './Model/LoginModel';
import Layout from './Components/Layout';
import ErrorHandleComponent from './ErrorHandleComponent';
import { useEffect } from 'react';
import useMessage from './Hooks/useMessage';
import axios, { HttpStatusCode } from 'axios';

// console.log(Array.from({length: 6000}).map((_,ind) => {
//   return `('testCamera${ind}', '99', ${37.856993 + ((ind * (-1)**ind) / 10000) + (Math.random() * ((-1)**ind))}, ${126.866792 + ((ind * (-1)**ind) / 10000) + (Math.random() * ((-1)**ind))}, 'rtsp://admin:admin@naiz.re.kr:554/13/stream1', 'admin:admin@naiz.re.kr:80', '80', 'VMS', '2023-07-10 19:00:50', null, null, 'naiz.re.kr:8002', 'admin', 'admin')`
// }).join(','))

// console.log(Array.from({length: 6000}).map((_,ind) => {
//   return `(278, ${43127 + ind})`
// }).join(','))

const preventTabKeyCallback = (e: KeyboardEvent) => {
  if(e.key === 'Tab') e.preventDefault()
}

const serverErrorTitleByStatusCode = (code: HttpStatusCode) => {
  switch(code) {
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

const App = () => {
  const loginState = useRecoilValue(isLogin)
  const message = useMessage()
  useEffect(() => {
    if(loginState) {
      window.addEventListener('keydown', preventTabKeyCallback)
    } else {
      window.removeEventListener('keydown', preventTabKeyCallback)
    }
  },[loginState])

  useEffect(() => {
    axios.interceptors.response.use(res => {
      return res;
    }, err => {
      if(err.response) {
        const {status, data} = err.response
        message.error({
          title: serverErrorTitleByStatusCode(err.response.status),
          msg: status !== 502 ? (data.errorCode || err.message) : '서버 상태를 확인해주세요.'
        })
      }
      return Promise.reject(err)
    })
  },[])
  
  return (<ErrorHandleComponent>
    <MainContainer>
      {
        loginState ? <Layout>
          <Main />
        </Layout> : <Login />
      }
    </MainContainer>
  </ErrorHandleComponent>
  );
}

export default App;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  ${globalStyles.flex({})}
  padding: 0 8px 8px;
`