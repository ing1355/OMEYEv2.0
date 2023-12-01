import { CSSProperties, createElement, useCallback } from 'react'
import ReactDOM from 'react-dom/client';
import { HeaderHeight } from '../Constants/CSSValues';
import styled from 'styled-components';
import { ModalBoxShadow, SectionBackgroundColor, globalStyles } from '../styles/global-styled';
import closeIconImg from '../assets/img/closeIcon.png'
import infoIcon from '../assets/img/infoIcon.png'
import successIcon from '../assets/img/successIcon.png'
import warningIcon from '../assets/img/warningIcon.png'
import errorIcon from '../assets/img/errorIcon.png'
import Button from '../Components/Constants/Button';
import { conditionMenu } from '../Model/ConditionMenuModel';
import { useSetRecoilState } from 'recoil';
import { ReIDMenuKeys } from '../Components/ReID/ConstantsValues';

export const globalMessageContainerId = 'global-notification-container'
const renderJsxToContainer = (container: HTMLElement, node: React.ReactNode, options?: ReactDOM.RootOptions) => {
    const root = ReactDOM.createRoot(container, options)
    root.render(node)
    return container
}

let globalContainer: HTMLElement | undefined = undefined

type MessageThemeType = 'info' | 'warning' | 'error' | 'success'
type MessagePresetType = 'REIDCOMPLETE' | 'REIDSTART' | 'WRONG_PARAMETER' | 'REIDCANCEL' | 'REIDERROR' | 'SERVER_CONNECTION_ERROR'

const mainColorByTheme = (theme: MessageThemeType): CSSProperties['color'] => {
    if(theme === 'info') return '#007BD6'
    if(theme === 'warning') return '#F4B434'
    if(theme === 'error') return '#EF3030'
    if(theme === 'success') return '#20BA2F'
}

const iconByTheme = (theme: MessageThemeType) => {
    if(theme === 'info') return infoIcon
    if(theme === 'warning') return warningIcon
    if(theme === 'error') return errorIcon
    if(theme === 'success') return successIcon
}

export class Message {
    private readonly _container: HTMLElement
    private readonly _timerId: NodeJS.Timeout
    constructor(title: string, msg: string, theme: MessageThemeType, timer?: number, callback?: () => void) {
        const container = document.createElement('div')
        renderJsxToContainer(container, <MessageContainer>
            <MessageHeaderLine concept={theme}/>
            <MessageHeader>
                <MessageTitle>
                    <MessageHeaderIcon src={iconByTheme(theme)} />
                    {title}
                </MessageTitle>
                <CloseIconContainer onClick={this.deleteMessage}>
                    <img src={closeIconImg} />
                </CloseIconContainer>
            </MessageHeader>
            <MessageContents>
                {msg}
            </MessageContents>
            <MessageFooter>
                {callback && <MessageOkBtn concept='activate' onClick={() => {
                    callback()
                    this.deleteMessage()
                }}>
                    확인
                </MessageOkBtn>}
            </MessageFooter>
        </MessageContainer>)
        this._container = container
        this._timerId = setTimeout(() => {
            this.deleteMessage()
        }, timer || (callback && 3600000) || 5000);
    }

    deleteContainer() {
        if (globalContainer) globalContainer.remove()
    }

    deleteMessage = () => {
        this.container.className = 'closed'
        clearTimeout(this.timerId)
        setTimeout(() => {
            this.container.remove()
            if (globalContainer) {
                if (!globalContainer.hasChildNodes()) {
                    this.deleteContainer()
                }
            }
        }, 350);
    }

    get container() {
        return this._container;
    }

    get timerId() {
        return this._timerId;
    }
}

const getContainer = () => document.getElementById(globalMessageContainerId)

const isCreatedContainer = (): boolean => getContainer() !== null

const createContainer = () => {
    const container = document.createElement('div')
    container.id = globalMessageContainerId
    document.body.appendChild(container)
    globalContainer = container
}

type MessageParamsType = {
    title: string,
    msg: string,
    timer?: number,
    theme?: MessageThemeType
    callback?: () => void
}

const useMessage = () => {
    const setReIDMenu = useSetRecoilState(conditionMenu)
    const createMessage = useCallback(({ title, msg, timer, theme="info", callback }: MessageParamsType) => {
        if (!isCreatedContainer()) {
            createContainer()
        }
        if (!globalContainer) createContainer()
        let messageInstance = new Message(title, msg, theme, timer, callback)
        globalContainer?.appendChild(messageInstance.container)
        return messageInstance
    }, [])

    const createMessageByPreset = useCallback((preset: MessagePresetType, msg?: string, callback?: () => void) => {
        if(preset === 'REIDCOMPLETE') {
            createMessage({
                title: '분석 종료',
                msg: 'ReID 분석이 종료되었습니다.\n아래 확인 버튼을 눌러 결과를 확인하세요.',
                theme:'success',
                callback: callback ? callback : () => {
                    setReIDMenu(ReIDMenuKeys['REIDRESULT'])
                }
            })
        } else if(preset === 'REIDCANCEL') {
            createMessage({
                title: '요청이 취소됨',
                msg: '분석 요청이 취소되었습니다.\n다시 요청해주세요.',
                callback: () => {

                }
            })
        } else if(preset === 'REIDSTART') {
            createMessage({
                title: '분석 시작',
                msg: 'ReID 분석이 시작되었습니다.\n우측 상단 메뉴에서 현재 진행 상황을 확인하실 수 있습니다.'
            })
        } else if(preset === 'REIDERROR') {
            createMessage({
                title: "분석 실패",
                msg: msg!,
                theme: 'error',
                callback: () => {
                    
                }
            })
        } else if(preset === 'WRONG_PARAMETER') {
            createMessage({
                title: "입력값 에러",
                msg: msg || "입력값이 잘못되었습니다.",
                theme: 'error'
            })
        } else if(preset === 'SERVER_CONNECTION_ERROR') {
            createMessage({
                title: "서버 에러",
                msg: msg || "서버와의 연결이 종료되었습니다.\n서버 상태를 확인해주세요.",
                theme: 'error'
            })
        }
    },[])

    const preset = useCallback((preset: MessagePresetType, msg?: string, callback?: () => void) => {
        createMessageByPreset(preset, msg, callback)
    },[])
    const info = useCallback((params: MessageParamsType) => {
        createMessage({...params, theme: 'info'})
    },[])
    const success = useCallback((params: MessageParamsType) => {
        createMessage({...params, theme: 'success'})
    },[])
    const warning = useCallback((params: MessageParamsType) => {
        createMessage({...params, theme: 'warning'})
    },[])
    const error = useCallback((params: MessageParamsType) => {
        createMessage({...params, theme: 'error'})
    },[])

    const message = {
        preset,
        info,
        success,
        warning,
        error
    }

    return message
}

export default useMessage

const MessageContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 8px 16px;
    position: relative;
    z-index: 9999
    &:not(:first-child) {

    }
    box-shadow: ${ModalBoxShadow};
    background-color: ${SectionBackgroundColor};
    ${globalStyles.slideToLeft()}
`

const MessageHeaderLine = styled.div<{concept: MessageThemeType}>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${({concept}) => mainColorByTheme(concept)};
`

const MessageHeader = styled.div`
    color: white;
    height: 40px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const MessageTitle = styled.div`
    ${globalStyles.flex({flexDirection:'row', gap: '4px'})}
    font-size: 1.3rem;
`

const MessageHeaderIcon = styled.img`
    height: 100%;
    width: 26px;
`

const CloseIconContainer = styled.div`
    height: 100%;
    flex: 0 0 32px;
    & > img {
        width: 100%;
        height: 100%;
    }
    cursor: pointer;
    padding: 8px;
`

const MessageContents = styled.div`
    color: white;
    height: calc(100% - 72px);
    ${globalStyles.flex({alignItems:'flex-start'})}
    white-space: pre-wrap;
`

const MessageFooter = styled.div`
    height: 32px;
`

const MessageOkBtn = styled(Button)`

`