import styled, { CSSProperties } from "styled-components"
import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import { SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import ModalCloseIcon from '../../../../assets/img/modalCloseIcon.png'
import checkIcon from '../../../../assets/img/pointCheckIcon.png'
import { useRecoilValue } from "recoil"
import { conditionMenu } from "../../../../Model/ConditionMenuModel"
import { conditionRoute } from "../../../../Model/ConditionRouteModel"
import { menuState } from "../../../../Model/MenuModel"

type DataSelectModalProps = PropsWithChildren<{
    visible: boolean
    complete: () => void
    close: () => void
    title: React.ReactNode
    className?: string
    width?: CSSProperties['width']
    lowBlur?: boolean
}>

const DataSelectModal = ({ visible, children, title, className, width, close, complete, lowBlur }: DataSelectModalProps) => {
    const c_menu = useRecoilValue(conditionMenu)
    const c_route = useRecoilValue(conditionRoute)
    const menu = useRecoilValue(menuState)
    const callbackRef = useRef<(e: KeyboardEvent) => void>()

    const escCallback = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (close) close()
        }
    }

    useEffect(() => {
        if (visible) {
            if (callbackRef.current) document.removeEventListener('keydown', callbackRef.current)
            callbackRef.current = escCallback
            if (callbackRef.current) document.addEventListener('keydown', callbackRef.current)
        } else {
            if (callbackRef.current) document.removeEventListener('keydown', callbackRef.current)
        }
    }, [visible, escCallback])

    useEffect(() => {
        if (visible) close()
    }, [c_menu, c_route, menu])

    return <Background visible={visible}>
        <Rest onClick={() => {
            close()
        }} lowBlur={lowBlur || false}/>
        <Container style={{
            width: width || '840px'
        }} visible={visible}>
            <Header>
                <TitleContainer>
                    <Title>
                        {title}
                    </Title>
                </TitleContainer>
                <HeaderBtns>
                    <Back onClick={complete} tabIndex={-1}>
                        <img src={checkIcon} style={{
                            height: '28px'
                        }} />
                    </Back>
                    <Back onClick={close} tabIndex={-1}>
                        <img src={ModalCloseIcon} style={{
                            height: '28px'
                        }} />
                    </Back>
                </HeaderBtns>
            </Header>
            {visible && <ContentsContainer className={className}>
                {children}
            </ContentsContainer>}
        </Container>
    </Background>
}

export default DataSelectModal

const Background = styled.div<{ visible: boolean }>`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9000;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end' })}
    overflow: hidden;
    ${({ visible }) => ({
        visibility: visible ? 'visible' : 'hidden',
    })}
    background-color: rgba(0,0,0,.3);
`

const Rest = styled.div<{lowBlur: boolean}>`
    flex: 1;
    height: 100%;
    backdrop-filter: blur(${({lowBlur}) => lowBlur ? 0.5 : 2}px);
`

const Container = styled.div<{ visible: boolean }>`
    height: 100%;
    position: absolute;
    background-color: ${SectionBackgroundColor};
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    transition: all .25s ease-out;
    ${({ visible }) => ({
        right: visible ? 0 : '-100%',
    })}
`

const Header = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    height: 100px;
    padding: 18px 36px;
`

const Title = styled.div`
    color: white;
    font-size: 2rem;
`

const TitleContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px' })}
`

const HeaderBtns = styled.div`
`

const Back = styled(Button)`
    background-color: transparent;
    border: none;
    opacity: 0.5;
    &:hover {
        opacity: 1;
    }
`

const ContentsContainer = styled.div`
    padding: 6px 36px;
    height: calc(100% - 100px);
`