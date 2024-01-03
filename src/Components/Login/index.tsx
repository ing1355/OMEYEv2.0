import styled from 'styled-components';
import { SectionBackgroundColor, globalStyles } from '../../styles/global-styled';
import Input from '../Constants/Input';
import Form from '../Constants/Form';
import Button from '../Constants/Button';
import { useRecoilState } from 'recoil';
import { isLogin } from '../../Model/LoginModel';
import Logo from '../Constants/Logo';
import axios from 'axios';
import { LoginApi, PasscodeValidationApi, UserAccountApi, duplicateLoginApi } from '../../Constants/ApiRoutes';
import { Axios } from '../../Functions/NetworkFunctions';
import loginSideBackgroundImg from '../../assets/img/loginSideBackgroundImg.jpg'
import logoTextImg from '../../assets/img/logoText.png'
import { useEffect, useRef, useState } from 'react';
import Modal from '../Layout/Modal';
import useMessage from '../../Hooks/useMessage';
import { passwordTest } from '../../Functions/RegExpFunctions';

const copyRightText = 'OMEYE v2.0 © 2023. OneMoreSecurity Inc. All Rights Reserved'

const Login = () => {
    const [_, setIsLogin] = useRecoilState(isLogin)
    const [initOpen, setInitOpen] = useState(false)
    const [initUserId, setInitUserId] = useState('')
    const [initPassword, setInitPassword] = useState('')
    const [initToken, setInitToken] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [passwodConfirm, setPasswordConfirm] = useState('')
    const userIdRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const message = useMessage()

    useEffect(() => {
        if (initOpen) {
            setInitUserId('')
            setInitPassword('')
            userIdRef.current?.focus()
        }
    }, [initOpen])

    useEffect(() => {
        if (initToken) {
            setPasswordInput('')
            setPasswordConfirm('')
            passwordRef.current?.focus()
        }
    }, [initToken])

    const PasscodeValidateFunc = async () => {
        const res = await Axios('POST', PasscodeValidationApi, {
            username: initUserId,
            initCode: initPassword
        }, true)

        if (res) {
            message.success({ title: "초기화 코드 인증 성공", msg: "새로운 비밀번호를 지정해주세요." })
            setInitOpen(false)
            setInitToken(res.headers.authorization)
        }
    }

    const initPasswordFunc = async () => {
        if(passwodConfirm !== passwordInput) {
            passwordRef.current?.focus()
            return message.error({title: "비밀번호 입력 에러", msg : "입력하신 비밀번호가 일치하지 않습니다."})
        }
        if(!passwordTest(passwordInput)) {
            return message.error({title: "비밀번호 입력 에러", msg : "비밀번호는 8자 이상 3가지 조합(영문자, 숫자, 특수문자) 혹은 10자 이상 2가지 조합(영문자, 숫자, 특수문자 중 선택)이어야 합니다"})
        }
        const res = await Axios('PATCH', UserAccountApi, {
            password: passwordInput
        }, false, initToken)
        
        if(res) {
            message.success({title: "비밀번호 초기화 성공", msg: "새로운 비밀번호로 로그인 하실 수 있습니다."})
            setInitToken('')
        }
    }

    return <>
        <LoginContainer>
            <WithLogoContainer>
                <LogoContainer>
                    <LogoImg />
                    <LogoTextImgContainer>
                        <img src={logoTextImg} />
                    </LogoTextImgContainer>
                </LogoContainer>
                <LoginForm onSubmit={async e => {
                    const { userId, password } = e.currentTarget.elements as any;
                    const res = await Axios("POST", LoginApi, {
                        username: userId.value,
                        password: password.value,
                    }, true)
                    if (res) {
                        const { isDuplicatedLogin, action, tempAccessToken, storageExceeded } = res.data.rows
                        if (isDuplicatedLogin && action === 'nothing') {
                            const _res = await axios.post(duplicateLoginApi, tempAccessToken)
                            setIsLogin(_res.headers.authorization)
                        } else if (isDuplicatedLogin) {

                        } else {
                            setIsLogin(res.headers.authorization)
                        }
                        if(storageExceeded) {
                            message.warning({title: "스토리지 사용량 경고", msg: "서버 스토리지가 한계치에 임박하였습니다.\n관리자에게 문의하세요."})
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
                        <LoginInput id="userId" autoFocus />
                    </LoginLabel>
                    <LoginLabel>
                        <LoginLabelText>
                            비밀번호
                        </LoginLabelText>
                        <LoginInput id="password" type='password' />
                        <PasswordInitLabel onClick={() => {
                            setInitOpen(true)
                        }}>
                            비밀번호 초기화
                        </PasswordInitLabel>
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
                <InnerImg src={loginSideBackgroundImg} />
            </InnerImageContainer>
        </LoginContainer>
        <CopyRight>
            {copyRightText}
        </CopyRight>
        <Modal visible={initOpen && !initToken} close={() => {
            setInitOpen(false)
        }} title="초기화 코드 입력" noFooter>
            <Initform onSubmit={PasscodeValidateFunc}>
                <PasswordInitRow>
                    <PasswordInitRowTitle>
                        <div>
                            아이디 :
                        </div>
                        <Input value={initUserId} inputRef={userIdRef} onChange={value => {
                            setInitUserId(value)
                        }} />
                    </PasswordInitRowTitle>
                </PasswordInitRow>
                <PasswordInitRow>
                    <PasswordInitRowTitle>
                        <div>
                            초기화 코드 :
                        </div>
                        <Input value={initPassword} onChange={value => {
                            setInitPassword(value)
                        }} maxLength={6} onlyNumber/>
                    </PasswordInitRowTitle>
                </PasswordInitRow>
                <InitButtonsContainer>
                    <InitButton hover type='submit'>
                        확인
                    </InitButton>
                    <InitButton hover onClick={() => {
                        setInitOpen(false)
                    }} type='button'>
                        닫기
                    </InitButton>
                </InitButtonsContainer>
            </Initform>
        </Modal>
        <Modal visible={initToken !== ''} close={() => {
            setInitToken('')
        }} title="비밀번호 초기화" noFooter>
            <Form onSubmit={initPasswordFunc}>
                <PasswordConfirmRow>
                    <PasswordConfirmTitle>
                        <div>
                            새로운 패스워드 :
                        </div>
                        <Input value={passwordInput} inputRef={passwordRef} onChange={value => {
                            setPasswordInput(value)
                        }} type="password"/>
                    </PasswordConfirmTitle>
                </PasswordConfirmRow>
                <PasswordConfirmRow>
                    <PasswordConfirmTitle>
                        <div>
                            패스워드 확인 :
                        </div>
                        <Input value={passwodConfirm} onChange={value => {
                            setPasswordConfirm(value)
                        }} type="password" />
                    </PasswordConfirmTitle>
                </PasswordConfirmRow>
                <InitButtonsContainer>
                    <InitButton hover type='submit'>
                        초기화
                    </InitButton>
                    <InitButton hover onClick={() => {
                        setInitToken('')
                    }} type='button'>
                        닫기
                    </InitButton>
                </InitButtonsContainer>
            </Form>
        </Modal>
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
    ${globalStyles.flex({ alignItems: 'flex-start', gap: '30px' })}
    padding: 36px 64px;
    width: 100%;
`

const LoginTitle = styled.div`
    font-size: 2rem;
    color: white;
`

const LoginLabel = styled.div`
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

const BottomContainer = styled.div`
    width: 100%;
`

const PasswordInitLabel = styled.div`
    text-align: right;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
    margin-top: 12px;
`

const PasswordInitRow = styled.div`
    height: 32px;
    padding: 4px 0;
`

const PasswordInitRowTitle = styled.label`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    & > div {
        flex: 0 0 80px;
        text-align: right;
    }
    & > input {
        height: 100%;
        flex: 1;
    }
`

const InitButtonsContainer = styled.div`
    margin-top: 24px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const InitButton = styled(Button)`
`

const PasswordConfirmRow = styled.div`
    height: 32px;
    padding: 4px 0;
    width: 400px;
`

const PasswordConfirmTitle = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    & > div {
        flex: 0 0 120px;
        text-align: right;
    }
    & > input {
        height: 100%;
        flex: 1;
    }
`

const Initform = styled(Form)`
    width: 320px;
`