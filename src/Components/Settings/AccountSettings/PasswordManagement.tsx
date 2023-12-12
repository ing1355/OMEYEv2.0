import { useEffect, useState } from "react"
import { BasicLogDataType, setStateType } from "../../../Constants/GlobalTypes"
import Modal from "../../Layout/Modal"
import { Axios } from "../../../Functions/NetworkFunctions"
import { AddPasscodeApi, GetPasscodesApi } from "../../../Constants/ApiRoutes"
import { LoadableDataType } from "../../../Constants/NetworkTypes"
import Pagination from "../../Layout/Pagination"
import styled from "styled-components"
import { ButtonBackgroundColor, ButtonInActiveBackgroundColor, globalStyles } from "../../../styles/global-styled"
import ForLog from "../../Constants/ForLog"
import Button from "../../Constants/Button"
import addIcon from '../../../assets/img/plusIcon.png'
import Input from "../../Constants/Input"
import Dropdown from "../../Layout/Dropdown"

const tableColumns = ["행동", "패스코드", "일시", "유효 시간", "남은 사용 횟수"]

const actionLabels = {
    CREATE: '생성',
    DELETE: '삭제'
}

type PasswordManagementProps = {
    visible: string
    setVisible: setStateType<string>
    targetId: string
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
    action: "CREATE" | "DELETE"
    createdAt: string
    passcode: PasscodeSingleDataType
}

type PasscodeDatasType = LoadableDataType<{
    passcodeHistories: {
        passcodeHistories: PasscodeHistoryDataType[]
        totalCount: number
    }
    passcodeResponse: PasscodeSingleDataType | null
}>

const PasswordManagement = ({ visible, setVisible, targetId }: PasswordManagementProps) => {
    const [datas, setDatas] = useState<PasscodeDatasType>({
        state: 'RUNNING',
        data: {
            passcodeHistories: {
                passcodeHistories: [],
                totalCount: 0
            },
            passcodeResponse: null
        }
    })
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputTime, setInputTime] = useState(1)
    const [inputCount, setInputCount] = useState(1)

    const getPasscodes = async () => {
        const res = await Axios('GET', GetPasscodesApi, {
            size: 10,
            page: currentPage,
            username: visible
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
                    passcodeResponse: null
                }
            })
            setRefresh(false)
        }
    }, [visible])

    useEffect(() => {
        if (refresh) {
            getPasscodes()
            setRefresh(false)
        }
    }, [refresh])

    return <Modal
        visible={visible !== ''}
        close={() => {
            setVisible('')
        }}
        noFooter
        title="패스코드 관리"
    >
        <Container>
            <HeaderRow>
                {tableColumns.map((_, ind) => <Col key={ind}>
                    {_}
                </Col>)}
            </HeaderRow>
            <AddRow>
                <AddCol>
                    <AddLabel>
                        유효 시간(분) :
                    </AddLabel>
                    <Input onlyNumber maxLength={6} value={inputTime} onChange={value => {
                        setInputTime(Number(value))
                    }}/>
                </AddCol>
                <AddCol>
                    <AddLabel>
                        사용 횟수 :
                    </AddLabel>
                    <Dropdown<number> defaultValue={1}
                        itemList={[1, 5, 10].map(_ => ({
                            key: _,
                            value: _,
                            label: _
                        }))} onChange={({ value }) => {
                            setInputCount(value)
                        }} />
                </AddCol>
                <AddBtn hover icon={addIcon} onClick={async () => {
                    const res = await Axios('POST', AddPasscodeApi, {
                        userId: targetId,
                        validTime: inputTime,
                        recycleCount: inputCount
                    })

                    if(res) setRefresh(true)
                }}>
                    추가
                </AddBtn>
            </AddRow>
            {
                datas.data.passcodeHistories.passcodeHistories.map((_, ind) => <ContentRow key={ind} isCurrent={datas.data.passcodeResponse ? datas.data.passcodeResponse.id === _.passcode.id : false}>
                    <Col>{actionLabels[_.action]}</Col>
                    <Col>{_.passcode.number}</Col>
                    <Col>{_.createdAt}</Col>
                    <Col>{_.passcode.expirationTime}</Col>
                    <Col>{_.passcode.recycleCount}</Col>
                </ContentRow>)
            }
            <Pagination dataPerPage={10} currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={datas.data.passcodeHistories.totalCount} />
        </Container>
    </Modal>
}

export default PasswordManagement

const Container = styled.div`
    width: 800px;
`

const HeaderRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    background-color: ${ButtonBackgroundColor};
`

const ContentRow = styled.div<{isCurrent:boolean}>`
    ${globalStyles.flex({ flexDirection: 'row' })}
    
`

const Col = styled.div`
    height: 40px;
    ${globalStyles.flex()}
    &:first-child {
        width: 15%;
    }
    &:nth-child(2) {
        width: 10%;
    }
    &:nth-child(3) {
        width: 25%;
    }
    &:nth-child(4) {
        width: 25%;
    }
    &:nth-child(5) {
        width: 25%;
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
`

const AddLabel = styled.div`
    min-width: 60px;
`