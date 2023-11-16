import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import { useRecoilState } from "recoil"
import { IsModifyMember, ModifySelectMember, modifySelectMemberInit } from "../../../Model/AccountDataModel"
import { useState } from "react"
import { UserAccountApi } from "../../../Constants/ApiRoutes"
import { Axios } from "../../../Functions/NetworkFunctions"
import useMessage from "../../../Hooks/useMessage"

type ModifyAccountType = {
  visible: boolean
  close: () => void
  noComplete: boolean
}

const ModifyAccount = ({ visible, close, noComplete }: ModifyAccountType) => {
  const [modifySelectMember, setModifySelectMember] = useRecoilState(ModifySelectMember);
  const [isModifyMember, setIsModifyMember] = useRecoilState(IsModifyMember);
  const [modifyAccountPassword, setModifyAccountPassword] = useState<string>('');
  const [modifyAccountPasswordConfirm, setModifyAccountPasswordConfirm] = useState<string>('');
  const [modifyAccountName, setModifyAccountName] = useState<string>(modifySelectMember.name);
  const [modifyAccountEmail, setModifyAccountEmail] = useState<string>(modifySelectMember.email);
  const [modifyAccountPhoneNumber, setModifyAccountPhoneNumber] = useState<string>(modifySelectMember.phoneNumber);
  const message = useMessage()

  const putUsersAccount = async () => {
    const res = await Axios("PUT", UserAccountApi, {
      id: modifySelectMember.id,
      password: modifyAccountPassword,
      name: modifyAccountName,
      email: modifyAccountEmail,
      phoneNumber: modifyAccountPhoneNumber,
    })
    if(res) {
      setIsModifyMember(false);
      setModifySelectMember(modifySelectMemberInit);
      setModifyAccountPassword('');
      setModifyAccountPasswordConfirm('');
      setModifyAccountName('');
      setModifyAccountEmail('');
      setModifyAccountPhoneNumber('');
    }
  }

  return (
    <Modal
      visible={visible}
      close={close}
      title="멤버 수정"
      noComplete={noComplete}      
    >
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px' }}>
          ID:
        </div>
        <div style={{ width: '240px', textAlign: 'center' }}>
          {modifySelectMember.username}
        </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          PW:
        </div>
        <AccountInput 
          value={modifyAccountPassword}
          type="password"
          onChange={(e) => {
            setModifyAccountPassword(e);
          }}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          PW 확인: 
        </div>
        <AccountInput 
          value={modifyAccountPasswordConfirm}
          type="password"
          onChange={(e) => {
            setModifyAccountPasswordConfirm(e);
          }}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이름 :
        </div>
        <AccountInput 
          value={modifyAccountName}
          onChange={(e) => {
            setModifyAccountName(e);
          }}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이메일: 
        </div>
        <AccountInput 
          value={modifyAccountEmail}
          onChange={(e) => {
            setModifyAccountEmail(e);
          }}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          전화번호: 
        </div>
        <AccountInput 
          value={modifyAccountPhoneNumber}
          onChange={(e) => {
            setModifyAccountPhoneNumber(e);
          }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <AccountButton hover
          onClick={() => {
            if(!(modifyAccountPassword && modifyAccountPasswordConfirm && modifyAccountName && modifyAccountEmail && modifyAccountPhoneNumber)) {
              message.error({ title: '계정 수정 에러', msg: '모든 항목을 입력해주세요.' })
            } else {
              if(modifyAccountPassword !== modifyAccountPasswordConfirm) {
                message.error({ title: '계정 수정 에러', msg: '비밀번호가 일치하지 않습니다.' })
              } else {
                putUsersAccount();
              }
            }
          }}
        >수정하기</AccountButton>
      </div>
    </Modal>
  )
}

export default ModifyAccount

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
`