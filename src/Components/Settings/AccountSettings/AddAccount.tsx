import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import { useState } from "react"
import { Axios } from "../../../Functions/NetworkFunctions"
import { IdCheckApi, UserAccountApi } from "../../../Constants/ApiRoutes"
import { IsAddMember, UpdateMemeberList } from "../../../Model/AccountDataModel"
import { useRecoilState } from "recoil"
import useMessage from "../../../Hooks/useMessage"
import Dropdown from "../../Layout/Dropdown"
import { ButtonBackgroundColor, InputBackgroundColor } from "../../../styles/global-styled"
import { AdminRoleSearchDropdownList, RoleSearchDropdownList, RoleValues } from "."
import { isLogin } from "../../../Model/LoginModel"
import { decodedJwtToken } from "../../Layout/Header/UserMenu"
import { OnlyInputNumberFun } from "../../../Functions/GlobalFunctions"

type AddAccountType = {
  visible: boolean
  close: () => void
}

export const idRegex = /^[a-z0-9]{4,16}$/;
export const passwordRegex = /(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W]).{8,16}|(?=.*[a-zA-Z])(?=.*[\d]).{10,16}|(?=.*[a-zA-Z])(?=.*[\W]).{10,16}|(?=.*[\d])(?=.*[\W]).{10,16}/;
export const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/;
export const phoneNumberRegex = /^\d{9,11}$/;
export const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const AddAccount = ({ visible, close }: AddAccountType) => {
  const [newAccountUsername, setNewAccountUsername] = useState<string>('');
  const [newAccountPassword, setNewAccountPassword] = useState<string>('');
  const [newAccountPasswordConfirm, setNewAccountPasswordConfirm] = useState<string>('');
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountEmail, setNewAccountEmail] = useState<string>('');
  const [newAccountPhoneNumber, setNewAccountPhoneNumber] = useState<string>('');
  const [newAccountOrg, setNewAccountOrg] = useState<string>('');
  const [isAddMember, setIsAddMember] = useRecoilState(IsAddMember);
  const [isSameId, setIsSameId] = useState<boolean | undefined>(undefined);
  const [searchRoleValue, setSearchRoleValue] = useState<RoleValues>('USER');
  const [updateMemeberList, setUpdateMemeberList] = useRecoilState(UpdateMemeberList);
  const [login, setIsLogin] = useRecoilState(isLogin);
  const userInfo = decodedJwtToken(login!);
  const message = useMessage();

  const resetNewAccountFun = () => {
    setIsAddMember(false);
    setNewAccountUsername('');
    setNewAccountPassword('');
    setNewAccountPasswordConfirm('');
    setNewAccountName('');
    setSearchRoleValue('USER');
    setNewAccountEmail('');
    setNewAccountPhoneNumber('');
    setNewAccountOrg('');
  }

  const newAccountSaveFun = async () => {
    const res = await Axios("POST", UserAccountApi, {
      username: newAccountUsername,
      password: newAccountPassword,
      name: newAccountName,
      role: searchRoleValue,
      email: newAccountEmail,
      phoneNumber: newAccountPhoneNumber,
      organization: newAccountOrg
    })
    resetNewAccountFun();

    if(res !== undefined) {
      if(res) {
        message.success({ title: '사용자 추가', msg: '사용자를 추가했습니다' })
        setUpdateMemeberList(!updateMemeberList);
      } else {
        message.error({ title: '사용자 추가 에러', msg: '사용자 추가를 실패했습니다' })
      }
    } else {
      message.error({ title: '사용자 추가 에러', msg: '사용자 추가를 실패했습니다' })
    }
  }

  const checkIdFun = async () => {
    if(!newAccountUsername) {
      message.error({ title: '아이디 중복 확인', msg: '아이디를 입력해주세요.' })
    } else {
      const res = await Axios("GET", IdCheckApi(newAccountUsername))
      setIsSameId(res);
      if(res) {
        message.error({ title: '아이디 중복 확인', msg: '사용 불가능한 아이디 입니다.' })
      } else {
        message.success({ title: '아이디 중복 확인', msg: '사용 가능한 아이디 입니다.' })
      }
    }
  }

  const addAccountFun = async () => {
    if (!(newAccountUsername && newAccountPassword && newAccountPasswordConfirm && newAccountName && newAccountEmail && newAccountPhoneNumber && newAccountOrg)) {
      message.error({ title: '사용자 추가 에러', msg: '모든 항목을 입력해주세요.' })
      return true
    } else if(isSameId === undefined) {
      message.error({ title : '사용자 추가 에러', msg: '아이디 중복 검사를 해주세요.' })
      return true
    } else if(isSameId) {
      message.error({ title: '사용자 추가 에러', msg: '사용 불가능한 아이디 입니다.' })
      return true
    } else if(newAccountPassword !== newAccountPasswordConfirm) {
      message.error({ title: '사용자 추가 에러', msg: '비밀번호가 일치하지 않습니다.' })
      return true
    } else if(!idRegex.test(newAccountUsername)) {
      message.error({ title: '사용자 추가 에러', msg: 'ID는 4~16자의 영소문자 및 숫자만 사용 가능합니다' })
      return true
    } else if(!idRegex.test(newAccountUsername)) {
      message.error({ title: '사용자 추가 에러', msg: 'ID는 4~16자의 영소문자 및 숫자만 사용 가능합니다' })
      return true
    } else if(!passwordRegex.test(newAccountPassword)) {
      message.error({ title: '사용자 추가 에러', msg: '비밀번호는 8자 이상 3가지 조합(영문자, 숫자, 특수문자) 혹은 10자 이상 2가지 조합(영문자, 숫자, 특수문자 중 선택)이어야 합니다' })
      return true
    } else if(newAccountPassword !== newAccountPasswordConfirm) {
      message.error({ title: '사용자 추가 에러', msg: '비밀번호가 일치하지 않습니다' })
      return true
    } else if(!nameRegex.test(newAccountName)) {
      message.error({ title: '사용자 추가 에러', msg: '이름은 특수문자 및 공백 사용불가합니다' })
      return true
    } else if(!emailRegex.test(newAccountEmail)) {
      message.error({ title: '사용자 추가 에러', msg: '잘못된 이메일 형식 입니다' })
      return true
    } else if(!phoneNumberRegex.test(newAccountPhoneNumber)) {
      message.error({ title: '사용자 추가 에러', msg: '전화번호를 9~11자리 숫자로만 입력해주세요' })
      return true
    } else if(isSameId) {
      message.error({ title: '사용자 추가 에러', msg: '이미 사용중인 아이디입니다' })
      return true
    } else {
      newAccountSaveFun()
    }
  }

  return (
    <Modal
      visible={visible}
      close={() => {
        close()
        resetNewAccountFun()
      }}
      title="사용자 추가"
      isConfirm = {false}
      complete={addAccountFun}
    >
      <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'space-between' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          ID:
        </div>
        <div>
          <AccountInput 
            value={newAccountUsername} 
            onChange={(e) => {
              setNewAccountUsername(e)
              setIsSameId(undefined)
            }} 
            onEnter={addAccountFun}
          />
        </div>
        <div>
          <AccountButton
            hover
            onClick={checkIdFun}
          >
            중복 확인
          </AccountButton>
        </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          PW:
        </div>
        <div>
          <AccountInput 
            value={newAccountPassword}
            type="password"
            onChange={(e) => {
              setNewAccountPassword(e)
            }}
            onEnter={addAccountFun}
          />
        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          PW 확인: 
        </div>
        <AccountInput 
          value={newAccountPasswordConfirm}
          type="password"
          onChange={(e) => {
            setNewAccountPasswordConfirm(e)
          }}
          onEnter={addAccountFun}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          소속 :
        </div>
        <div>
          <AccountInput 
            value={newAccountOrg}
            onChange={(e) => {
              setNewAccountOrg(e)
            }}
            onEnter={addAccountFun}
          />
        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이름 :
        </div>
        <div>
          <AccountInput 
            value={newAccountName}
            onChange={(e) => {
              setNewAccountName(e)
            }}
            onEnter={addAccountFun}
          />
        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          등급 :
        </div>
        <div>
          <RoleDropdown 
            itemList={userInfo.user.role === 'DEVELOPER' ? RoleSearchDropdownList : AdminRoleSearchDropdownList} 
            bodyStyle={{backgroundColor: `${ButtonBackgroundColor}`, zIndex: 1, width: '240px'}}
            onChange={val => {
              setSearchRoleValue(val.value as RoleValues)
            }}
          />
        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이메일:
        </div>
        <div>
          <AccountInput 
            value={newAccountEmail}
            maxLength={48}
            onChange={(e) => {
              setNewAccountEmail(e)
            }}
            onEnter={addAccountFun}
          />
        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          전화번호: 
        </div>
        <div>
          <AccountInput 
            value={newAccountPhoneNumber}
            maxLength={11}
            onChange={(e) => {
              const num = OnlyInputNumberFun(e)
              setNewAccountPhoneNumber(num)
            }}
            onEnter={addAccountFun}
          />
        </div>
        <div style={{width: '130px'}}></div>
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
  color: white;
  width: 240px;
`

const AccountButton = styled(Button)`
  height: 30px;
  width: 110px;
  margin-left: 20px;
`

const RoleDropdown = styled(Dropdown)`
  height: 30px;
  width: 240px;
`