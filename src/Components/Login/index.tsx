import styled from 'styled-components';
import { SectionBackgroundColor, globalStyles } from '../../styles/global-styled';
import Input from '../Constants/Input';
import Form from '../Constants/Form';
import Button from '../Constants/Button';
import { useRecoilState } from 'recoil';
import { isLogin } from '../../Model/LoginModel';
import Logo from '../Constants/Logo';
import axios from 'axios';
import { LoginApi, duplicateLoginApi } from '../../Constants/ApiRoutes';
import { Axios } from '../../Functions/NetworkFunctions';
import loginSideBackgroundImg from '../../assets/img/loginSideBackgroundImg.jpg'
import logoTextImg from '../../assets/img/logoText.png'

const copyRightText = 'OMEYE v2.0 © 2023. OneMoreSecurity Inc. All Rights Reserved'

const Login = () => {
    const [_, setIsLogin] = useRecoilState(isLogin)
    return <>
        <LoginContainer>
            <WithLogoContainer>
                <LogoContainer>
                    <LogoImg />
                    <LogoTextImgContainer>
                    <img src={logoTextImg}/>
                    </LogoTextImgContainer>
                </LogoContainer>
                <LoginForm onSubmit={async e => {
                    const { userId, password } = e.currentTarget.elements as any;
                    const res = await Axios("POST", LoginApi, {
                        username: userId.value,
                        password: password.value,
                    }, true)
                    if(res) {
                        const { isDuplicatedLogin, action, tempAccessToken } = res.data.rows
                        if(isDuplicatedLogin && action === 'nothing') {
                            const _res = await axios.post(duplicateLoginApi, tempAccessToken)
                            setIsLogin(_res.headers.authorization)
                        } else if(isDuplicatedLogin) {
        
                        } else {
                            setIsLogin(res.headers.authorization)
                        }
                    }
                }}>
                    <LoginTitle>
                        로그인
                    </LoginTitle>
                    <LoginLabel>
                        <LoginLabelText>
                            아이디
                        </LoginLabelText>
                        <LoginInput id="userId" />
                    </LoginLabel>
                    <LoginLabel>
                        <LoginLabelText>
                            비밀번호
                        </LoginLabelText>
                        <LoginInput id="password" type='password' />
                    </LoginLabel>
                    <LoginCompleteButton type='submit' hover>
                        로그인
                    </LoginCompleteButton>
                </LoginForm>
                <VersionText>
                    v{process.env.REACT_APP_VERSION}
                </VersionText>
            </WithLogoContainer>
            <InnerImageContainer>
                <InnerImg alt="test" src={loginSideBackgroundImg} />
            </InnerImageContainer>
        </LoginContainer>
        <CopyRight>
            {copyRightText}
        </CopyRight>
    </>
}

export default Login

const LoginContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    border-radius: 12px;
    overflow: hidden;
    background-color: ${SectionBackgroundColor};
`

const InnerImageContainer = styled.div`
    width: 500px;
    height: 100%;
`

const InnerImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const WithLogoContainer = styled.div`
    width: 500px;
    height: 100%;
    padding: 20px 48px;
    position: relative;
    ${globalStyles.flex({ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px' })}
`

const LogoContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    color: white;
    font-size: 1.6rem;
    font-weight: bold;
`

const LogoImg = styled(Logo)`
    height: 32px;
`

const LogoTextImgContainer = styled.div`
    height: 30%;
    & > img {
        width: 100%;
        height: 100%;
    }
`

const LoginForm = styled(Form)`
    ${globalStyles.flex({alignItems:'flex-start', gap: '30px'})}
    padding: 36px 64px;
    width: 100%;
`

const LoginTitle = styled.div`
    font-size: 2rem;
    color: white;
`

const LoginLabel = styled.label`
    width: 100%;
`

const LoginLabelText = styled.div`
    width: 100%;
    font-size: 1.2rem;
    height: 26px;
    color: white;
`

const LoginInput = styled(Input)`
    height: 40px;
    width: 100%;
    text-align: center;
    border-radius: 8px;
    width: 100%;
`

const LoginCompleteButton = styled(Button)`
    height: 48px;
    width: 100%;
`

const CopyRight = styled.div`
    color: white;
    margin-top: 36px;
    letter-spacing: -1px;
`

const VersionText = styled.div`
    position: absolute;
    right: 8px;
    bottom: 8px;
`