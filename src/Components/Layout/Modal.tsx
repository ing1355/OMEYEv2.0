import styled from "styled-components"
import { ContentsBorderColor, ModalBoxShadow, SectionBackgroundColor, globalStyles } from "../../styles/global-styled"
import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import ModalCloseIcon from '../../assets/img/modalCloseIcon.png'
import Button from "../Constants/Button"

type ModalProps = PropsWithChildren & {
    visible: boolean
    complete?: (data?: any) => void | boolean | Promise<unknown>
    close: () => void
    title: string
    noComplete?: boolean
    isConfirm?: boolean
    completeText?: string
    noFooter?: boolean
}

const Modal = ({ children, visible, close, title, complete, noComplete, isConfirm, completeText, noFooter=false }: ModalProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const callbackRef = useRef<(e: KeyboardEvent) => void>()
    const completeRef = useRef(false)
    const completeFuncRef = useRef(complete)

    useEffect(() => {
        completeFuncRef.current = complete
    },[complete])

    const escKeydownCallback = async (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            close()
        } else if (e.key === 'Enter') {
            if (!noComplete) {
                if (completeFuncRef.current && completeRef.current === false) {
                    completeRef.current = true
                    if (!(await completeFuncRef.current())) {
                        close()
                    }
                    completeRef.current = false
                }
            }
        }
    }

    const mouseDownCallback = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            if (e.target === containerRef.current) close()
        }
    }, [])

    useEffect(() => {
        if (visible) {
            if (containerRef.current) containerRef.current.focus()
            callbackRef.current = escKeydownCallback
            document.addEventListener('keydown', callbackRef.current)
        } else {
            if (callbackRef.current) document.removeEventListener('keydown', callbackRef.current)
            callbackRef.current = undefined
        }
    }, [visible])

    return <Container visible={visible} ref={containerRef} onMouseDown={e => {
        mouseDownCallback(e)
    }}>
        <ContentsContainer onMouseDown={e => {
            e.stopPropagation()
        }}>
            <Header>
                {/* {!noComplete && <CompleteBtn activate onClick={async () => {
                    if (complete) {
                        if (complete && completeRef.current === false) {
                            completeRef.current = true
                            if (!(await complete())) {
                                close()
                            }
                            completeRef.current = false
                        }
                    } else {
                        close()
                    }
                }}>
                    {completeText ? completeText : (isConfirm ? '확인' : '완료')}
                </CompleteBtn>} */}
                {title}
                <CloseIcon src={ModalCloseIcon} onClick={close} />
            </Header>
            <Contents noFooter={noFooter}>
                {children}
            </Contents>
            {!noFooter &&
                <Footer>
                    <FooterBtn hover onClick={async () => {
                        if (completeFuncRef.current) {
                            if (completeFuncRef.current && completeRef.current === false) {
                                completeRef.current = true
                                if (!(await completeFuncRef.current())) {
                                    close()
                                }
                                completeRef.current = false
                            }
                        } else {
                            close()
                        }
                    }}>
                        {completeText ? completeText : (isConfirm ? '확인' : '완료')}
                    </FooterBtn>
                    <FooterBtn hover onClick={close}>
                        닫기
                    </FooterBtn>
                </Footer>
            }
        </ContentsContainer>
    </Container>
}

export default Modal

const Container = styled.div<{ visible: boolean }>`
    z-index: 9001;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
    background-color: rgba(0,0,0,.4);
    ${globalStyles.flex()}
    display: ${({ visible }) => visible ? 'flex' : 'none'};
    ${globalStyles.fadeOut({ animationDuration: '.1s' })}
`

const ContentsContainer = styled.div`
    box-shadow: ${ModalBoxShadow};
    background-color: ${SectionBackgroundColor};
    border-radius: 8px;
    min-width: 300px;
    min-height: 200px;
`

const Header = styled.div`
    ${globalStyles.flex({alignItems:'flex-start'})}
    height: 56px;
    padding: 12px 16px;
    font-size: 1.3rem;
    font-weight: bold;
    position: relative;
`

const CompleteBtn = styled(Button)`
    position: absolute;
    height: 70%;
    left: 10px;
`

const CloseIcon = styled.img`
    height: 100%;
    padding: 12px;
    cursor: pointer;
    position: absolute;
    right: 0;
    pointer-events: auto;
`

const Contents = styled.div<{noFooter: boolean}>`
    padding: 12px 16px 24px 16px;
    ${globalStyles.flex()}
`

const Footer = styled.div`
    height: 48px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-end', gap: '6px' })}
    padding: 12px 6px;
`

const FooterBtn = styled(Button)`
`