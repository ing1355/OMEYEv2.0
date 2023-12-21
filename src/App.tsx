import './App.css';
import Login from './Components/Login';
import Main from './Components/Main';
import styled from 'styled-components';
import { globalStyles } from './styles/global-styled';
import { useRecoilState } from 'recoil';
import { isLogin } from './Model/LoginModel';
import Layout from './Components/Layout';
import ErrorHandleComponent from './ErrorHandleComponent';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AxiosController from './AxiosContoller';
import { refreshFunction } from './Functions/NetworkFunctions';

const App = () => {
  const [loginState, setLoginState] = useRecoilState(isLogin)
  const [handlerComplete, setHandlerComplete] = useState(false)
  const timerId = useRef<NodeJS.Timer>()

  useLayoutEffect(() => {
    setHandlerComplete(true)
  }, [])

  const timerFunc = () => {
    refreshFunction()
    console.debug("refreshFuntion!")
    timerId.current = setTimeout(() => {
      timerFunc()
    }, 10000);
  }

  useEffect(() => {
    if (loginState) {
      timerFunc()
    } else {
      if (timerId.current) clearTimeout(timerId.current)
    }
  }, [loginState])

  return handlerComplete ? <ErrorHandleComponent>
    <AxiosController />
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