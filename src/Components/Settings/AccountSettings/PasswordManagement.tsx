import { useEffect, useState } from "react"
import { setStateType } from "../../../Constants/GlobalTypes"
import Modal from "../../Layout/Modal"
import { Axios } from "../../../Functions/NetworkFunctions"
import { AddPasscodeApi, DeletePasscordApi, GetPasscodesApi } from "../../../Constants/ApiRoutes"
import { LoadableDataType } from "../../../Constants/NetworkTypes"
import Pagination from "../../Layout/Pagination"
import styled from "styled-components"
import { ButtonBackgroundColor, ButtonBorderColor, ButtonInActiveBackgroundColor, InputBackgroundColor, globalStyles } from "../../../styles/global-styled"
import ForLog from "../../Constants/ForLog"
import Button from "../../Constants/Button"
import addIcon from '../../../assets/img/plusIcon.png'
import deleteIcon from '../../../assets/img/delete.png'
import Input from "../../Constants/Input"
import Dropdown, { DropdownItemType } from "../../Layout/Dropdown"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useMessage from "../../../Hooks/useMessage"

const tableColumns = ["초기화 코드", "생성 시간", "만료 시간", "남은 사용 횟수"]
const timeTypeItems: DropdownItemType<number>[] = [
    {
        key: 1,
        value: 1,
        label: '분'
    },
    {
        key: 60,
        value: 60,
        label: '시간'
    },
    {
        key: 60 * 24,
        value: 60 * 24,
        label: '일'
    },
    {
        key: -1,
        value: -1,
        label: '무제한'
    }
]

type PasswordManagementProps = {
    visible: string
    setVisible: setStateType<string>
}

type PasscodeSingleDataType = {
    createdAt: string
    expirationTime: string
    id: number
    issuerUsername: string
    number: string
    recycleCount: number
    validTime: number
}

type PasscodeHistoryDataType = {
    createdAt: string
    passcode: PasscodeSingleDataType
}

type PasscodeDatasType = LoadableDataType<{
    passcodeHistories: {
        passcodeHistories: PasscodeHistoryDataType[]
        totalCount: number
    }
    passcode: PasscodeSingleDataType | null
}>

const PasswordManagement = ({ visible, setVisible }: PasswordManagementProps) => {
    const [datas, setDatas] = useState<PasscodeDatasType>({
        state: 'RUNNING',
        data: {
            passcodeHistories: {
                passcodeHistories: [],
                totalCount: 0
            },
            passcode: null
        }
    })
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputTime, setInputTime] = useState(1)
    const [inputTimeType, setInputTimeType] = useState(1)
    const [inputCount, setInputCount] = useState(1)
    const message = useMessage()

    const initValues = () => {
        setInputCount(1)
        setInputTime(1)
        setInputTimeType(1)
    }

    const getPasscodes = async () => {
        const res = await Axios('GET', GetPasscodesApi, {
            size: 10,
            page: currentPage,
            userId: visible
        })

        if (res) setDatas({
            state: 'IDLE',
            data: res
        })
    }

    useEffect(() => {
        if (visible) {
            getPasscodes()
        } else {
            setDatas({
                state: 'RUNNING',
                data: {
                    passcodeHistories: {
                        passcodeHistories: [],
                        totalCount: 0
                    },
                    passcode: null
                }
            })
            setRefresh(false)
            initValues()
        }
    }, [visible, currentPage])

    useEffect(() => {
        if (refresh) {
            getPasscodes()
            setRefresh(false)
            initValues()
        }
    }, [refresh])

    return <Modal
        visible={visible !== '' && datas.state === 'IDLE'}
        close={() => {
            setVisible('')
        }}
        noFooter
        title="초기화 코드 관리"
    >
        <Container>
            <Title>
                현재 초기화 코드
            </Title>
            <CurrentPasscodeContainer>
                {!datas.data.passcode ? <>
                    {/* <AddCol>
                        <AddLabel>
                            유효 시간 :
                        </AddLabel>
                        <Input onlyNumber maxLength={3} value={inputTime} onChange={value => {
                            setInputTime(Number(value))
                        }} disabled={inputTimeType === -1} />
                        <Dropdown<number> itemList={timeTypeItems} onChange={({ value }) => {
                            setInputTimeType(value)
                        }} value={inputTimeType} debug />
                    </AddCol>
                    <AddCol>
                        <AddLabel>
                            사용 횟수 :
                        </AddLabel>
                        <Dropdown<number> itemList={[1, 5, 10, '무제한'].map(_ => ({
                            key: typeof _ === 'string' ? -1 : _,
                            value: typeof _ === 'string' ? -1 : _,
                            label: _
                        }))} onChange={({ value }) => {
                            setInputCount(value)
                        }} value={inputCount} />
                    </AddCol> */}
                    <AddBtn
                        hover
                        activate
                        icon={addIcon}
                        onClick={async () => {
                            const res = await Axios('POST', AddPasscodeApi, {
                                userId: visible,
                                validTime: 30,
                                recycleCount: 1
                                // validTime: inputTime * inputTimeType,
                                // recycleCount: inputCount
                            })

                            if (res) setRefresh(true)
                        }}>
                        추가
                    </AddBtn>
                </> : <>
                    <AddCol>
                        <AddLabel>
                            초기화 코드 :
                        </AddLabel>
                        <CopyToClipboard text={datas.data.passcode.number} onCopy={() => {
                            message.success({ title: "복사 성공", msg: "초기화 코드가 클립보드에 저장되었습니다." })
                        }}>
                            <PasscodeContainer style={{
                                cursor: 'pointer'
                            }}>
                                {datas.data.passcode.number}
                            </PasscodeContainer>
                        </CopyToClipboard>
                    </AddCol>
                    <AddCol>
                        <AddLabel>
                            생성 시간 :
                        </AddLabel>
                        <PasscodeContainer>
                            {datas.data.passcode.createdAt}
                        </PasscodeContainer>
                    </AddCol>
                    <AddCol>
                        <AddLabel>
                            만료 시간 :
                        </AddLabel>
                        <PasscodeContainer>
                            {datas.data.passcode.expirationTime || '무제한'}
                        </PasscodeContainer>
                    </AddCol>
                    <AddCol>
                        <AddLabel>
                            남은 사용 횟수 :
                        </AddLabel>
                        <PasscodeContainer>
                            {datas.data.passcode.recycleCount === -1 ? '무제한' : datas.data.passcode.recycleCount}
                        </PasscodeContainer>
                    </AddCol>
                    <AddCol style={{
                        cursor: 'pointer',
                        padding: '4px'
                    }} onClick={async () => {
                        const res = await Axios('DELETE', DeletePasscordApi(datas.data.passcode!.id))
                        if (res) setRefresh(true)
                    }}>
                        <img src={deleteIcon} />
                    </AddCol>
                </>}
            </CurrentPasscodeContainer>
            <Title>
                초기화 코드 이력
            </Title>
            <HeaderRow>
                {tableColumns.map((_, ind) => <Col key={ind}>
                    {_}
                </Col>)}
            </HeaderRow>
            <ContentsContainer>
                {
                    datas.data.passcodeHistories.passcodeHistories.map((_, ind) => <ContentRow key={ind} isCurrent={datas.data.passcode ? datas.data.passcode.id === _.passcode.id : false}>
                        <Col>{_.passcode.number}</Col>
                        <Col>{_.createdAt}</Col>
                        <Col>{_.passcode.expirationTime || '무제한'}</Col>
                        <Col>{_.passcode.recycleCount === -1 ? '무제한' : _.passcode.recycleCount}</Col>
                    </ContentRow>)
                }
            </ContentsContainer>
            <Pagination dataPerPage={10} currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={datas.data.passcodeHistories.totalCount} />
        </Container>
    </Modal>
}

export default PasswordManagement

const Container = styled.div`
    width: 1000px;
`

const Title = styled.div`
    margin-bottom: 6px;
    font-size: 1.1rem;
`

const HeaderRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    background-color: ${ButtonBackgroundColor};
`

const ContentsContainer = styled.div`
    margin-bottom: 12px;
`

const ContentRow = styled.div<{ isCurrent: boolean }>`
    ${globalStyles.flex({ flexDirection: 'row' })}
    border-bottom: 1px solid ${ButtonBorderColor};
`

const Col = styled.div`
    height: 40px;
    ${globalStyles.flex()}
    padding: 10px;
    &:first-child {
        width: 15%;
    }
    &:nth-child(2) {
        width: 25%;
    }
    &:nth-child(3) {
        width: 25%;
    }
    &:nth-child(4) {
        width: 20%;
    }
    & > img {
        width: 100%;
        height: 100%;
    }
`

const AddRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
    height: 64px;
    background-color: ${ButtonInActiveBackgroundColor};
`

const AddBtn = styled(Button)`
    padding: 8px 16px;
    height: 32px;
`

const AddCol = styled.div`
    height: 32px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
    & > img {
        width: 100%;
        height: 100%;
    }
`

const AddLabel = styled.div`
    min-width: 60px;
`

const CurrentPasscodeContainer = styled.div`
    border: 1px solid ${ButtonBorderColor};
    padding: 8px 16px;
    border-radius: 12px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '16px' })}
    margin-bottom: 24px;
    & input {
        height: 32px;
    }
`

const PasscodeContainer = styled.div`  
    background-color: ${InputBackgroundColor};
    height: 32px;
    padding: 6px 24px;
    border-radius: 10px;
    ${globalStyles.flex()}
`