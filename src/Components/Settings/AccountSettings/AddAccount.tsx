import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import { useState } from "react"
import { Axios } from "../../../Functions/NetworkFunctions"
import { IdCheckApi, UserAccountApi } from "../../../Constants/ApiRoutes"
import { IsAddMember } from "../../../Model/AccountDataModel"
import { useRecoilState } from "recoil"
import useMessage from "../../../Hooks/useMessage"

type AddAccountType = {
  visible: boolean
  close: () => void
  noComplete: boolean
}

type accountInfoType = {
  username: string
  password: string
  name: string
  email: string
  phoneNumber: string
}

const AddAccount = ({ visible, close, noComplete }: AddAccountType) => {
  const [newAccountUsername, setNewAccountUsername] = useState<string>('');
  const [newAccountPassword, setNewAccountPassword] = useState<string>('');
  const [newAccountPasswordConfirm, setNewAccountPasswordConfirm] = useState<string>('');
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountEmail, setNewAccountEmail] = useState<string>('');
  const [newAccountPhoneNumber, setNewAccountPhoneNumber] = useState<string>('');
  const [isAddMember, setIsAddMember] = useRecoilState(IsAddMember);
  const [isSameId, setIsSameId] = useState<boolean | undefined>(undefined);
  const message = useMessage()

  const newAccountSaveFun = async () => {
    const res = await Axios("POST", UserAccountApi, {
      username: newAccountUsername,
      password: newAccountPassword,
      name: newAccountName,
      email: newAccountEmail,
      phoneNumber: newAccountPhoneNumber,
    })
    if(res) {
      setIsAddMember(false);
      setNewAccountUsername('');
      setNewAccountPassword('');
      setNewAccountPasswordConfirm('');
      setNewAccountName('');
      setNewAccountEmail('');
      setNewAccountPhoneNumber('');
    } 
  }

  const checkIdFun = async () => {
    const res = await Axios("GET", IdCheckApi(newAccountUsername))
    setIsSameId(res);
    if(res) {
      message.error({ title: '아이디 중복 확인', msg: '사용 불가능한 아이디 입니다.' })
    } else {
      message.success({ title: '아이디 중복 확인', msg: '사용 가능한 아이디 입니다.' })
    }
  }

  return (
    <Modal
      visible={visible}
      close={close}
      title="멤버 추가"
      noComplete={noComplete}
    >
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          ID:
        </div>
        <AccountInput 
          value={newAccountUsername} 
          onChange={(e) => {
            setNewAccountUsername(e);
            setIsSameId(undefined);
          }} 
        />
        <AccountButton
          hover
          onClick={checkIdFun}
        >
          중복 확인
        </AccountButton>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          PW:
        </div>
        <AccountInput 
          value={newAccountPassword}
          onChange={(e) => {
            setNewAccountPassword(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          PW 확인: 
        </div>
        <AccountInput 
          value={newAccountPasswordConfirm}
          onChange={(e) => {
            setNewAccountPasswordConfirm(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          이름 :
        </div>
        <AccountInput 
          value={newAccountName}
          onChange={(e) => {
            setNewAccountName(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          이메일:
        </div>
        <AccountInput 
          value={newAccountEmail}
          onChange={(e) => {
            setNewAccountEmail(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          전화번호: 
        </div>
        <AccountInput 
          value={newAccountPhoneNumber}
          onChange={(e) => {
            setNewAccountPhoneNumber(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{textAlign: 'center'}}>
        <AccountButton hover
          onClick={() => {
            if (!(newAccountUsername && newAccountPassword && newAccountPasswordConfirm && newAccountName && newAccountEmail && newAccountPhoneNumber)) {
              message.error({ title: '계정 추가 에러', msg: '모든 항목을 입력해주세요.' })
            } else {
              if(isSameId === undefined) {
                message.error({ title : '계정 추가 에러', msg: '아이디 중복 검사를 해주세요.' })
              } else {
                if(isSameId) {
                  message.error({ title: '계정 추가 에러', msg: '사용 불가능한 아이디 입니다.' })
                } else if(newAccountPassword !== newAccountPasswordConfirm) {
                  message.error({ title: '계정 추가 에러', msg: '비밀번호가 일치하지 않습니다.' })
                } else {
                  newAccountSaveFun();
                }
              }
            }
          }}
        >
          추가하기
        </AccountButton>
      </div>
    </Modal>
  )
}

export default AddAccount

const AccountInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 240px;
  color: white;
`

const AccountButton = styled(Button)`
  height: 30px;
  width: 120px;
`