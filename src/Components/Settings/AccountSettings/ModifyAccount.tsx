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
import Dropdown from "../../Layout/Dropdown"
import { AdminRoleSearchDropdownList, RoleSearchDropdownList, RoleValues } from "."
import { ButtonBackgroundColor } from "../../../styles/global-styled"
import { emailRegex, nameRegex, passwordRegex, phoneNumberRegex } from "./AddAccount"
import { isLogin } from "../../../Model/LoginModel"
import { decodedJwtToken } from "../../Layout/Header/UserMenu"

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
  const [login, setIsLogin] = useRecoilState(isLogin);
  const userInfo = decodedJwtToken(login!);
  const [searchRoleValue, setSearchRoleValue] = useState<RoleValues>('USER');
  const message = useMessage()

  const putUsersAccount = async () => {
    if(!(modifyAccountPassword && modifyAccountPasswordConfirm && modifyAccountName && modifyAccountEmail && modifyAccountPhoneNumber)) {
      message.error({ title: '계정 생성 에러', msg: '모든 항목을 입력해주세요' })
    } else if(!passwordRegex.test(modifyAccountPassword)) {
      message.error({ title: '계정 생성 에러', msg: '비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합이어야 합니다' })
    } else if(modifyAccountPassword !== modifyAccountPasswordConfirm) {
      message.error({ title: '계정 생성 에러', msg: '비밀번호가 일치하지 않습니다' })
    } else if(!nameRegex.test(modifyAccountName)) {
      message.error({ title: '계정 생성 에러', msg: '이름은 특수문자 및 공백 사용불가합니다' })
    } else if(!emailRegex.test(modifyAccountEmail)) {
      message.error({ title: '계정 생성 에러', msg: '잘못된 E-MAIL 형식 입니다' })
    } else if(!phoneNumberRegex.test(modifyAccountPhoneNumber)) {
      message.error({ title: '계정 생성 에러', msg: '9~11자리 숫자로만 입력해주세요' })
    } else {
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
        setSearchRoleValue('USER');
        setModifyAccountName('');
        setModifyAccountEmail('');
        setModifyAccountPhoneNumber('');
      }
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
          등급 :
        </div>
        <div>
          {(userInfo.user.role === 'DEVELOPER' || userInfo.user.role === 'ADMIN') ?
            <RoleDropdown 
              itemList={userInfo.user.role === 'DEVELOPER' ? RoleSearchDropdownList : AdminRoleSearchDropdownList} 
              bodyStyle={{backgroundColor: `${ButtonBackgroundColor}`, zIndex: 1, width: '240px'}}
              onChange={val => {
                setSearchRoleValue(val.value as RoleValues);
              }}
            />
            :
            <div style={{ width: '240px', textAlign: 'center', lineHeight: '30px' }}>
              USER
            </div>
          }

        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이메일: 
        </div>
        <AccountInput 
          value={modifyAccountEmail}
          maxLength={48}
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

const RoleDropdown = styled(Dropdown)`
  height: 30px;
  width: 240px;
`