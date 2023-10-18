import styled, { CSSProperties } from "styled-components"
import { PropsWithChildren, useCallback, useEffect } from "react"
import { GlobalBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import ModalCloseIcon from '../../../../assets/img/modalCloseIcon.png'

type DataSelectModalProps = PropsWithChildren<{
    visible: boolean
    complete: () => void
    close: () => void
    title: string
    className?: string
    width?: CSSProperties['width']
}>

const DataSelectModal = ({ visible, children, title, className, width, close, complete }: DataSelectModalProps) => {
    const escCallback = useCallback(() => {
        if(close) close()
    },[])
    useEffect(() => {
        if(visible) {
            document.addEventListener('keydown', escCallback)
        } else {
            document.removeEventListener('keydown', escCallback)
        }
    },[visible])

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
                    <Complete onClick={complete}>
                        저장
                    </Complete>
                </TitleContainer>
                <Back onClick={close}>
                    <img src={ModalCloseIcon} style={{
                        height: '28px'
                    }} />
                </Back>
            </Header>
            <ContentsContainer className={className}>
                {children}
            </ContentsContainer>
        </Container>
    </Background>
}

export default DataSelectModal

const Background = styled.div<{ visible: boolean }>`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: transparent;
    z-index: 9999;
    transition: right .25s ease-out;
    ${({ visible }) => ({
        right: visible ? 0 : '-100%'
    })}
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end' })}
`

const Rest = styled.div`
    flex: 1;
    height: 100%;
`

const Container = styled.div<{ visible: boolean }>`
    height: 100%;
    background-color: ${SectionBackgroundColor};
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
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