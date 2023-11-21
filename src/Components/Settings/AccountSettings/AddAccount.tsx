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
import Dropdown from "../../Layout/Dropdown"
import { ButtonBackgroundColor, InputBackgroundColor } from "../../../styles/global-styled"
import { AdminRoleSearchDropdownList, RoleSearchDropdownList, RoleValues } from "."
import { isLogin } from "../../../Model/LoginModel"
import { decodedJwtToken } from "../../Layout/Header/UserMenu"

type AddAccountType = {
  visible: boolean
  close: () => void
  noComplete: boolean
}

export const idRegex = /^[a-z0-9]{4,16}$/;
export const passwordRegex = /(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W]).{8,16}|(?=.*[a-zA-Z])(?=.*[\d]).{10,16}|(?=.*[a-zA-Z])(?=.*[\W]).{10,16}|(?=.*[\d])(?=.*[\W]).{10,16}/;
export const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/;
export const phoneNumberRegex = /^\d{9,11}$/;
export const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const AddAccount = ({ visible, close, noComplete }: AddAccountType) => {
  const [newAccountUsername, setNewAccountUsername] = useState<string>('');
  const [newAccountPassword, setNewAccountPassword] = useState<string>('');
  const [newAccountPasswordConfirm, setNewAccountPasswordConfirm] = useState<string>('');
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [newAccountEmail, setNewAccountEmail] = useState<string>('');
  const [newAccountPhoneNumber, setNewAccountPhoneNumber] = useState<string>('');
  const [isAddMember, setIsAddMember] = useRecoilState(IsAddMember);
  const [isSameId, setIsSameId] = useState<boolean | undefined>(undefined);
  const [searchRoleValue, setSearchRoleValue] = useState<RoleValues>('USER');
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
  }

  const newAccountSaveFun = async () => {
    if(!(newAccountUsername && newAccountPassword && newAccountPasswordConfirm && newAccountName && newAccountEmail && newAccountPhoneNumber)) {
      message.error({ title: '계정 생성 에러', msg: '모든 항목을 입력해주세요' })
    } else if(!idRegex.test(newAccountUsername)) {
      message.error({ title: '계정 생성 에러', msg: 'ID는 4~16자의 영소문자 및 숫자만 사용 가능합니다' })
    } else if(!passwordRegex.test(newAccountPassword)) {
      message.error({ title: '계정 생성 에러', msg: '비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합이어야 합니다' })
    } else if(newAccountPassword !== newAccountPasswordConfirm) {
      message.error({ title: '계정 생성 에러', msg: '비밀번호가 일치하지 않습니다' })
    } else if(!nameRegex.test(newAccountName)) {
      message.error({ title: '계정 생성 에러', msg: '이름은 특수문자 및 공백 사용불가합니다' })
    } else if(!emailRegex.test(newAccountEmail)) {
      message.error({ title: '계정 생성 에러', msg: '잘못된 E-MAIL 형식 입니다' })
    } else if(!phoneNumberRegex.test(newAccountPhoneNumber)) {
      message.error({ title: '계정 생성 에러', msg: '9~11자리 숫자로만 입력해주세요' })
    } else if(isSameId) {
      message.error({ title: '계정 생성 에러', msg: '이미 사용중인 아이디입니다' })
    } else {
      const res = await Axios("POST", UserAccountApi, {
        username: newAccountUsername,
        password: newAccountPassword,
        name: newAccountName,
        role: searchRoleValue,
        email: newAccountEmail,
        phoneNumber: newAccountPhoneNumber,
      })
      if(res) {
        resetNewAccountFun();
      } 
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

  return (
    <Modal
      visible={visible}
      close={() => {
        close();
        resetNewAccountFun();
      }}
      title="멤버 추가"
      noComplete={noComplete}
    >
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
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
        <div style={{ width: '100px', lineHeight: '30px' }}>
          PW:
        </div>
        <AccountInput 
          value={newAccountPassword}
          type="password"
          onChange={(e) => {
            setNewAccountPassword(e);
          }}
        />
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
            setNewAccountPasswordConfirm(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
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
        <div style={{ width: '100px', lineHeight: '30px' }}>
          등급 :
        </div>
        <div>
          <RoleDropdown 
            itemList={userInfo.user.role === 'DEVELOPER' ? RoleSearchDropdownList : AdminRoleSearchDropdownList} 
            bodyStyle={{backgroundColor: `${ButtonBackgroundColor}`, zIndex: 1, width: '240px'}}
            onChange={val => {
              setSearchRoleValue(val.value as RoleValues);
            }}
          />
        </div>
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이메일:
        </div>
        <AccountInput 
          value={newAccountEmail}
          maxLength={48}
          onChange={(e) => {
            setNewAccountEmail(e);
          }}
        />
        <div style={{width: '130px'}}></div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          전화번호: 
        </div>
        <AccountInput 
          value={newAccountPhoneNumber}
          maxLength={11}
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
  width: 100px;
  margin-left: 10px;
`

const RoleDropdown = styled(Dropdown)`
  height: 30px;
  width: 240px;
`