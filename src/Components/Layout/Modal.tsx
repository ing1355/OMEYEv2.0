import styled from "styled-components"
import { ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../styles/global-styled"
import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import ModalCloseIcon from '../../assets/img/modalCloseIcon.png'
import Button from "../Constants/Button"

type ModalProps = PropsWithChildren & {
    visible: boolean
    complete?: (data?: any) => void|boolean
    close: () => void
    title: string
    noComplete?: boolean
    isConfirm?: boolean
}

const Modal = ({ children, visible, close, title, complete, noComplete, isConfirm }: ModalProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const escKeydownCallback = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            close()
        } else if(e.key === 'Enter') {
            if(isConfirm) {
                if(complete) {
                    if(!complete()) {
                        close()
                    }
                }
            }
        }
    }, [complete])

    const mouseDownCallback = useCallback((e: MouseEvent) => {
        if (containerRef.current) {
            if (e.target === containerRef.current) close()
        }
    }, [])

    useEffect(() => {
        if (visible) {
            document.addEventListener('keydown', escKeydownCallback)
            if (containerRef.current) containerRef.current.addEventListener('mousedown', mouseDownCallback)
        } else {
            document.removeEventListener('keydown', escKeydownCallback)
            if (containerRef.current) containerRef.current.removeEventListener('mousedown', mouseDownCallback)
        }
    }, [visible])

    return <Container visible={visible} ref={containerRef}>
        <ContentsContainer onMouseDown={e => {
            e.stopPropagation()
        }}>
            <Header>
                {!noComplete && <CompleteBtn activate onClick={() => {
                    if(complete) {
                        if(!complete()) {
                            close()
                        }
                    } else {
                        close()
                    }
                }}>
                    {isConfirm ? '확인' : '완료'}
                </CompleteBtn>}
                {title}
                <CloseIcon src={ModalCloseIcon} onClick={close}/>
            </Header>
            <Contents>
                {children}
            </Contents>
        </ContentsContainer>
    </Container>
}

export default Modal

const Container = styled.div<{ visible: boolean }>`
    z-index: 1004;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    ${globalStyles.flex()}
    display: ${({ visible }) => visible ? 'flex' : 'none'};
    ${globalStyles.fadeOut({animationDuration: '.1s'})}
`

const ContentsContainer = styled.div`
    background-color: ${SectionBackgroundColor};
    border-radius: 8px;
    min-width: 300px;
    min-height: 200px;
`

const Header = styled.div`
    ${globalStyles.flex()}
    height: 40px;
    padding: 4px 10px;
    font-size: 1.1rem;
    border-bottom: 1px solid ${ContentsBorderColor};
    position: relative;
`

const CompleteBtn = styled(Button)`
    position: absolute;
    height: 70%;
    left: 10px;
`

const CloseIcon = styled.img`
    height: 100%;
    padding: 10px;
    cursor: pointer;
    position: absolute;
    right: 0;
    pointer-events: auto;
`

const Contents = styled.div`
    height: calc(100% - 32px);
    padding: 12px;
`