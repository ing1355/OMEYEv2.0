import styled from "styled-components"
import icon from '../../../assets/img/ProgressAIIcon.png'
import loadingIcon from '../../../assets/img/reidLoadingIcon.png'
import userIcon from '../../../assets/img/UserIcon.png'
import timeIcon from '../../../assets/img/ProgressTimeIcon.png'
import locationIcon from '../../../assets/img/ProgressLocationIcon.png'
import selfUsingIcon from '../../../assets/img/selfUsingIcon.png'
import otherUsingIcon from '../../../assets/img/otherUsingIcon.png'
import infoIcon from '../../../assets/img/etcIcon.png'
import disconnectIcon from '../../../assets/img/disconnectIcon.png'
import VisibleToggleContainer from "../../Constants/VisibleToggleContainer"
import { useEffect, useRef, useState } from "react"
import { ButtonBackgroundColor, DisconnectColor, ModalBoxShadow, ProgressErrorColor, SectionBackgroundColor, TextActivateColor, globalStyles } from "../../../styles/global-styled"
import { Axios, GetManagementList } from "../../../Functions/NetworkFunctions"
import Button from "../../Constants/Button"
import { ManagementServerSingleDataType, currentManagementId, managementServerStatus } from "../../../Model/ServerManagementModel"
import { convertFullTimeStringToHumanTimeFormat, decodedJwtToken } from "../../../Functions/GlobalFunctions"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { isLogin } from "../../../Model/LoginModel"
import { GlobalEvents } from "../../../Model/GlobalEventsModel"
import { CancelManagementExportVideoApi, CancelManagementReIDApi, CancelManagementRealTimeApi } from "../../../Constants/ApiRoutes"
import useMessage from "../../../Hooks/useMessage"

const getTypeLabelByData = (type: ManagementServerSingleDataType['type']) => {
    let label = ''
    if (type === 'REALTIME') label = '실시간 영상 분석'
    else if (type === 'REID') label = '과거 영상 분석'
    else if (type === 'VIDEO_EXPORT') label = '영상 반출'
    else label = '알 수 없음'
    return label
}

const getTitleByData = (data: ManagementServerSingleDataType[], username: string) => {
    if (data.length === 0 || data.every(_ => _.status !== 'IN_PROGRESS')) return '사용가능'
    else {
        const target = data.find(_ => _.status === 'IN_PROGRESS')
        if (target) {
            if (target.tag === 'OMEYE2' && target.username === username) return '분석중'
            else return '사용중'
        } else {
            return '사용중'
        }
    }
}

const getIconByData = (data: ManagementServerSingleDataType[], username: string) => {
    if (data.length === 0 || data.every(_ => _.status !== 'IN_PROGRESS')) return icon
    else {
        const target = data.find(_ => _.status === 'IN_PROGRESS')
        if (target) {
            if (target.tag === 'OMEYE2' && target.username === username) return selfUsingIcon
            else return otherUsingIcon
        } else {
            return otherUsingIcon
        }
    }
}

const getTagLabelByData = (tag: ManagementServerSingleDataType['tag']) => {
    if (tag === 'OMEYE1') return 'v1.2'
    if (tag === 'OMEYE2') return 'v2.0'
    if (tag === 'SEOUL') return '서울시'
}

const getColorByData = (data: ManagementServerSingleDataType[], username: string) => {
    if (data.length === 0 || data.every(_ => _.status !== 'IN_PROGRESS')) return 'white'
    else {
        const target = data.find(_ => _.status === 'IN_PROGRESS')
        if (target) {
            if (target.tag === 'OMEYE2' && target.username === username) return TextActivateColor
            else return ProgressErrorColor
        } else {
            return ProgressErrorColor
        }
    }
}

const ManagementComponent = () => {
    const [visible, setVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [datas, setDatas] = useState<ManagementServerSingleDataType[]>([])
    const [globalEvents, setGlobalEvents] = useRecoilState(GlobalEvents)
    const [managementId, setManagementId] = useRecoilState(currentManagementId)
    const [managementStatus, setManagementStatus] = useRecoilState(managementServerStatus)
    const login = useRecoilValue(isLogin)
    const userInfo = decodedJwtToken(login!)
    const timerId = useRef<NodeJS.Timer>()
    const message = useMessage()
    const datasRef = useRef(datas)

    const getList = async (id?: ManagementServerSingleDataType['id'], addedParams?: any) => {
        if (timerId.current) clearTimeout(timerId.current)
        const res = await GetManagementList()
        if (res) {
            const result = res.map(_ => {
                const target = datasRef.current.find(__ => __.id === _.id)
                return target ? {...target, ..._} : {..._, params: addedParams}
            })
            setDatas(result)
            console.debug("Get Management Server Data List : ", result)
            setManagementStatus('ON')
        } else {
            setManagementStatus('OFF')
        }
        timerId.current = setTimeout(() => {
            getList()
        }, 5000);
    }

    useEffect(() => {
        getList()
        return () => {
            if (timerId.current) clearTimeout(timerId.current)
        }
    }, [])

    useEffect(() => {
        if (globalEvents.key === 'StackManagementServer' || globalEvents.key === 'Cancel' || globalEvents.key === 'Refresh') {
            if (globalEvents.key === 'StackManagementServer') {
                message.info({ title: "작업 등록 성공", msg: "요청한 작업이 매니지먼트 서버에 정상적으로 등록되었습니다." })
            }
            getList(globalEvents.data, globalEvents.params)
        }
        console.debug("Global Events Data : ", globalEvents)
    }, [globalEvents])

    useEffect(() => {
        if (datas.length > 0) {
            const { type, status, username, tag, id, params } = datas[0]
            if (status === 'WAIT' && userInfo.user.username === username && tag === 'OMEYE2' && id !== managementId) {
                setManagementId(id)
                setGlobalEvents({
                    key: type === 'REID' ? 'ReIDStart' : (type === 'REALTIME' ? 'RealTimeStart' : 'VideoExportStart'),
                    data: id,
                    params
                })
            }
        }
        datasRef.current = datas
    }, [datas])

    return <Container visible={visible} setVisible={(v) => {
        setVisible(v)
    }}>
        <OuterContainer>
            <Icon>
                <img src={managementStatus === 'ON' ? getIconByData(datas, userInfo.user.username) : disconnectIcon} />
            </Icon>
            <Title style={{
                color: managementStatus === 'ON' ? getColorByData(datas, userInfo.user.username) : DisconnectColor
            }}>
                {managementStatus === 'ON' ? getTitleByData(datas, userInfo.user.username) : '연결끊김'}
            </Title>
        </OuterContainer>
        <PopUpContainer visible={visible}>
            <ContentsContainer>
                <ContentsTitle>
                    AI 분석 및 대기 현황
                </ContentsTitle>
                <RowsContainer>
                    {datas.map((_, ind) => <Row key={ind}>
                        <Index>
                            {ind + 1}
                        </Index>
                        <TitleIcon isLoading={_.status === 'IN_PROGRESS'}>
                            <img src={loadingIcon} />
                        </TitleIcon>
                        <ItemsContainer>
                            <Item>
                                <img src={userIcon} />
                                <div>{_.username}</div>
                            </Item>
                            <Item>
                                <img src={locationIcon} />
                                <div>{getTagLabelByData(_.tag)}</div>
                            </Item>
                            <Item>
                                <img src={timeIcon} />
                                <div>{convertFullTimeStringToHumanTimeFormat(_.createdAt)}</div>
                            </Item>
                            <Item>
                                <img src={infoIcon} />
                                <div>{getTypeLabelByData(_.type)}</div>
                            </Item>
                        </ItemsContainer>
                        {userInfo.user.username === _.username && _.tag === 'OMEYE2' ? <Button hover style={{
                            width: '80px'
                        }} onClick={async () => {
                            setIsLoading(true)
                            const res = await Axios('POST', _.type === 'REID' ? CancelManagementReIDApi : (_.type === 'REALTIME' ? CancelManagementRealTimeApi : CancelManagementExportVideoApi), _.id)
                            if (res && _.status !== 'IN_PROGRESS') {
                                message.success({ title: "취소 성공", msg: "매니지먼트 서버에 등록했던 요청을 취소하였습니다." })
                            }
                            getList()
                            setIsLoading(false)
                        }} disabled={isLoading}>
                            분석 취소
                        </Button> : <div style={{
                            width: '80px'
                        }}></div>}
                    </Row>)}
                </RowsContainer>
            </ContentsContainer>
        </PopUpContainer>
    </Container>
}

export default ManagementComponent

const RowDefaultHeight = 44

const Container = styled(VisibleToggleContainer)`
    background-color: ${ButtonBackgroundColor};
    border-radius: 14px;
    border: none;
    padding: 4px 12px;
    position: relative;
    cursor: pointer;
`

const OuterContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 24px;
    padding: 1px 8px;
    pointer-events: none;
`

const Icon = styled.div`
    height: 100%;
    & > img {
        width: 100%;
        height: 100%;
    }
`

const Title = styled.div`
    font-size: 1rem;
    width: 80px;
    ${globalStyles.flex()}
`

const PopUpContainer = styled.div<{ visible: boolean }>`
    display: ${({ visible }) => visible ? 'block' : 'none'};
    position: absolute;
    right: 0px;
    width: 800px;
    height: 720px;
    background-color: ${SectionBackgroundColor};
    z-index: 9998;
    top: calc(100% + 14px);
    box-shadow: ${ModalBoxShadow};
    ${globalStyles.zoomIn()}
    cursor: default;
    &:after {
        width: 0;
        height: 0;
        border-bottom: 10px solid ${SectionBackgroundColor};
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        position: absolute;
        top: -10px;
        right: 30px;
        content: " ";
    }
`

const ContentsContainer = styled.div`
    padding: 16px;
    height: 100%;
`

const ContentsTitle = styled.div`   
    font-size: 1.3rem;
    margin-bottom: 10px;
`

const RowsContainer = styled.div`
    ${globalStyles.flex({ gap: '8px', justifyContent: 'flex-start' })}
`

const Row = styled.div`
    height: ${RowDefaultHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    border: 1px solid white;
    border-radius: 10px;
    padding: 4px 12px;
    width: 100%;
`

const Index = styled.div`
    flex: 0 0 32px;
    text-align: center;
`

const TitleIcon = styled.div<{ isLoading: boolean }>`
    height: 100%;
    padding: 4px 0;
    flex: 0 0 24px;
    & > img {
        width: 100%;
        height: 100%;
    }
    ${({ isLoading }) => isLoading && globalStyles.rotation({ animationIterationCount: 'infinite', animationDuration: '2.5s', animationTimingFunction: 'linear' })}
`

const ItemsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px', justifyContent: 'flex-start' })}
    height: 100%;
    flex: 1;
`

const Item = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    height: 100%;
    & > img {
        width: 22px;
        height: 22px;
    }
    padding: 6px 0;
    & > div {
        flex: 1;
    }
    &:first-child {
        flex: 1;
    }
    &:nth-child(2) {
        width: 72px;
    }
    &:nth-child(3) {
        width: 164px;
    }
    &:nth-child(4) {
        width: 124px;
    }
`