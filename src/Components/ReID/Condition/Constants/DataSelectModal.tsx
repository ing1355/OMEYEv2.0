import styled, { CSSProperties } from "styled-components"
import { PropsWithChildren, useCallback, useEffect } from "react"
import { SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import ModalCloseIcon from '../../../../assets/img/modalCloseIcon.png'
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
}>

const DataSelectModal = ({ visible, children, title, className, width, close, complete }: DataSelectModalProps) => {

    const c_menu = useRecoilValue(conditionMenu)
    const c_route = useRecoilValue(conditionRoute)
    const menu = useRecoilValue(menuState)

    const escCallback = useCallback((e: KeyboardEvent) => {
        if(e.key === 'Escape') {
            if(close) close()
        }
    },[])

    useEffect(() => {
        if(visible) {
            document.addEventListener('keydown', escCallback)
        } else {
            document.removeEventListener('keydown', escCallback)
        }
    },[visible])

    useEffect(() => {
        close()
    },[c_menu, c_route, menu])
    
    return <Background visible={visible}>
        <Rest onClick={() => {
            close()
        }} />
        <Container style={{
            width: width || '840px'
        }} visible={visible}>
            <Header>
                <TitleContainer>
                    <Title>
                        {title}
                    </Title>
                    <Complete onClick={complete} tabIndex={-1} activate>
                        선택
                    </Complete>
                </TitleContainer>
                <Back onClick={close} tabIndex={-1}>
                    <img src={ModalCloseIcon} style={{
                        height: '28px'
                    }} />
                </Back>
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
    z-index: 9000;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end' })}
    overflow: hidden;
    ${({ visible }) => ({
        visibility: visible ? 'visible' : 'hidden',
    })}
    background-color: rgba(0,0,0,.3);
`

const Rest = styled.div`
    flex: 1;
    height: 100%;
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
    ${globalStyles.flex({flexDirection:'row', justifyContent:'flex-start', gap: '12px'})}
`

const Complete = styled(Button)`
`
const Back = styled(Button)`
    background-color: transparent;
    border: none;
`

const ContentsContainer = styled.div`
    padding: 6px 36px;
    height: calc(100% - 100px);
`