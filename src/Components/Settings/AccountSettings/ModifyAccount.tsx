import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import { useRecoilState } from "recoil"
import { IsModifyMember, ModifySelectMember, UpdateMemeberList, modifySelectMemberInit } from "../../../Model/AccountDataModel"
import { useEffect, useState } from "react"
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
  const [updateMemeberList, setUpdateMemeberList] = useRecoilState(UpdateMemeberList);
  const [login, setIsLogin] = useRecoilState(isLogin);
  const userInfo = decodedJwtToken(login!);
  const [searchRoleValue, setSearchRoleValue] = useState<RoleValues>('USER');
  const message = useMessage();

  const putUsersAccount = async () => {
    if(!passwordRegex.test(modifyAccountPassword)) {
      message.error({ title: '계정 생성 에러', msg: '비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합이어야 합니다' })
    } else if(modifyAccountPassword !== modifyAccountPasswordConfirm) {
      message.error({ title: '계정 생성 에러', msg: '비밀번호가 일치하지 않습니다' })
    } else if(!nameRegex.test(modifySelectMember.name)) {
      message.error({ title: '계정 생성 에러', msg: '이름은 특수문자 및 공백 사용불가합니다' })
    } else if(!emailRegex.test(modifySelectMember.email)) {
      message.error({ title: '계정 생성 에러', msg: '잘못된 E-MAIL 형식 입니다' })
    } else if(!phoneNumberRegex.test(modifySelectMember.phoneNumber)) {
      message.error({ title: '계정 생성 에러', msg: '전화번호를 9~11자리 숫자로만 입력해주세요' })
    } else {
      const res = await Axios("PUT", UserAccountApi, {
        id: modifySelectMember.id,
        password: modifyAccountPassword,
        name: modifySelectMember.name,
        email: modifySelectMember.email,
        phoneNumber: modifySelectMember.phoneNumber,
        role: searchRoleValue,
        organization: modifySelectMember.organization
      })
      if(res) {
        setIsModifyMember(false);
        setUpdateMemeberList(!updateMemeberList);
        setModifySelectMember(modifySelectMemberInit);
        setModifyAccountPassword('');
        setModifyAccountPasswordConfirm('');
        setSearchRoleValue('USER');
      }
    }
  }

  const SelectedRoleValueIndexFun = () => {
    console.log('modifySelectMember.role',modifySelectMember.role)
    console.log(RoleSearchDropdownList.findIndex((_) => _.key === modifySelectMember.role))
    if(userInfo.user.role === 'DEVELOPER') {
      return RoleSearchDropdownList.findIndex((_) => _.key === modifySelectMember.role)
    } else if(userInfo.user.role === 'ADMIN') {
      return AdminRoleSearchDropdownList.findIndex((_) => _.key === modifySelectMember.role)
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
          조직 :
        </div>
        <AccountInput 
          value={modifySelectMember.organization}
          onChange={(e) => {
            setModifySelectMember((pre) => ({
              ...pre,
              organization: e
            }))
          }}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          이름 :
        </div>
        <AccountInput 
          value={modifySelectMember.name}
          onChange={(e) => {
            setModifySelectMember((pre) => ({
              ...pre,
              name: e
            }))
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
              // valueIndex={SelectedRoleValueIndexFun()}
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
          value={modifySelectMember.email}
          maxLength={48}
          onChange={(e) => {
            setModifySelectMember((pre) => ({
              ...pre,
              email: e
            }))
          }}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          전화번호: 
        </div>
        <AccountInput 
          maxLength={11}
          value={modifySelectMember.phoneNumber}
          onChange={(e) => {
            setModifySelectMember((pre) => ({
              ...pre,
              phoneNumber: e
            }))
          }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <AccountButton hover
          onClick={() => {
            if(!(modifyAccountPassword && modifyAccountPasswordConfirm && modifySelectMember.name && modifySelectMember.email &&  modifySelectMember.phoneNumber && modifySelectMember.organization)) {
              message.error({ title: '계정 수정 에러', msg: '모든 항목을 입력해주세요.' })
            } else {
              putUsersAccount();
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