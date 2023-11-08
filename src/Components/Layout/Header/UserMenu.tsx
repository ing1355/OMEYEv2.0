import styled from "styled-components"
import { SectionBackgroundColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import { HeaderHeight } from "../../../Constants/CSSValues"
import UserIcon from '../../../assets/img/UserIcon.png'
import ArrowIcon from '../../../assets/img/downArrowIcon.png'
import { useRecoilState } from "recoil"
import { isLogin } from "../../../Model/LoginModel"
import jwtDecode from "jwt-decode"
import { Axios } from "../../../Functions/NetworkFunctions"
import { LogoutApi } from "../../../Constants/ApiRoutes"
import { useCallback, useEffect, useRef, useState } from "react"

const decodedJwtToken = (token: string) => {
    return jwtDecode(token) as {
        user: {
            email: string
            id: string
            isAlreadyLoggedIn: boolean
            isLock: boolean
            name: string
            phoneNumber: string
            role: 'ADMIN'
            username: string
        }
    }
}

const UserMenu = () => {
    const [login, setIsLogin] = useRecoilState(isLogin)
    const userInfo = decodedJwtToken(login!)
    const [menuOpen, setMenuOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const containerClickHandler = useCallback((ev: MouseEvent) => {
        if(!containerRef.current?.contains(ev.target as Node)) setMenuOpen(false)
    },[])

    useEffect(() => {
        if(menuOpen) {
            document.addEventListener('click', containerClickHandler)
            
        } else {
            document.removeEventListener('click', containerClickHandler)
        }
    },[menuOpen])
    
    return <Container ref={containerRef} onClick={(e) => {
        setMenuOpen(!menuOpen)
    }}>
        <UserMenuIcon src={UserIcon} />
        {userInfo.user.name} 님
        <UserArrowIcon src={ArrowIcon} />
        <UserDetailContainer opened={menuOpen}>
            <UserDetailItem onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
            }}>
                설정
            </UserDetailItem>
            <UserDetailItem onClick={async () => {
                await Axios("POST", LogoutApi)
                setIsLogin(null)
            }}>
                로그아웃
            </UserDetailItem>
        </UserDetailContainer>
    </Container>
}

export default UserMenu

const Container = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px' })}
    font-size: .8rem;
    cursor: pointer;
    position: relative;
`

const UserMenuIcon = styled.img`
    width: ${HeaderHeight / 2}px;
    height: ${HeaderHeight / 2}px;
`

const UserArrowIcon = styled.img`
    width: ${HeaderHeight / 1.5}px;
    height: ${HeaderHeight / 1.5}px;
`

const UserDetailContainer = styled.div<{opened: boolean}>`
    position: absolute;
    background-color: ${SectionBackgroundColor};
    top: 100%;
    width: 100px;
    height: 90px;
    z-index: 100;
    border-radius: 8px;
    display: ${({opened}) => opened ? 'block' : 'none'};
`

const UserDetailItem = styled.div`
    &:hover {
        color: ${TextActivateColor};
    }
    font-size: .9rem;
    height: 50%;
    cursor: pointer;
    ${globalStyles.flex()}
`