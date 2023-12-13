import styled from "styled-components"
import Modal from "../../Layout/Modal"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import { useRecoilState } from "recoil"
import { IsModifyMember, ModifiedName, ModifySelectMember, UpdateMemeberList, modifySelectMemberInit, roleType } from "../../../Model/AccountDataModel"
import { useEffect, useState } from "react"
import { UserAccountApi } from "../../../Constants/ApiRoutes"
import { Axios } from "../../../Functions/NetworkFunctions"
import useMessage from "../../../Hooks/useMessage"
import Dropdown from "../../Layout/Dropdown"
import { AdminRoleSearchDropdownList, RoleSearchDropdownList } from "."
import { ButtonBackgroundColor } from "../../../styles/global-styled"
import { emailRegex, nameRegex, passwordRegex, phoneNumberRegex } from "./AddAccount"
import { isLogin } from "../../../Model/LoginModel"
import { decodedJwtToken } from "../../Layout/Header/UserMenu"
import { async } from "q"
import { OnlyInputNumberFun } from "../../../Functions/GlobalFunctions"

type ModifyAccountType = {
  visible: boolean
  close: () => void
}

const ModifyAccount = ({ visible, close }: ModifyAccountType) => {
  const [modifySelectMember, setModifySelectMember] = useRecoilState(ModifySelectMember)
  const [isModifyMember, setIsModifyMember] = useRecoilState(IsModifyMember)
  const [modifyAccountPassword, setModifyAccountPassword] = useState<string>('')
  const [modifyAccountPasswordConfirm, setModifyAccountPasswordConfirm] = useState<string>('')
  const [updateMemeberList, setUpdateMemeberList] = useRecoilState(UpdateMemeberList)
  const [changeDropdown, setChangeDropdown] = useState<boolean>(false)
  const [login, setIsLogin] = useRecoilState(isLogin)
  const userInfo = decodedJwtToken(login!)
  const [searchRoleValue, setSearchRoleValue] = useState<roleType | null>(null)
  const [modifiedName, setModifiedName] = useRecoilState(ModifiedName)
  const message = useMessage()

  const modifyInit = () => {
    setIsModifyMember(false)
    setUpdateMemeberList(!updateMemeberList)
    setModifySelectMember(modifySelectMemberInit)
    setModifyAccountPassword('')
    setModifyAccountPasswordConfirm('')
    setSearchRoleValue(null)
  }

  const putUsersAccount = async (isPassword: boolean) => {
    const res = await Axios("PATCH", UserAccountApi, isPassword ? {
      id: modifySelectMember.id,
      password: modifyAccountPassword,
      name: modifySelectMember.name,
      email: modifySelectMember.email,
      phoneNumber: modifySelectMember.phoneNumber,
      role: searchRoleValue,
      organization: modifySelectMember.organization
    } : {
      id: modifySelectMember.id,
      name: modifySelectMember.name,
      email: modifySelectMember.email,
      phoneNumber: modifySelectMember.phoneNumber,
      role: searchRoleValue,
      organization: modifySelectMember.organization
    })
    
    if(res !== undefined) {
      if(res) {
        if(modifySelectMember.id === userInfo.user.id) setModifiedName(modifySelectMember.name)
        message.success({ title: '사용자 정보 수정', msg: '사용자의 정보를 수정했습니다' })
        modifyInit()
      } else {
        message.error({ title: '사용자 정보 수정 에러', msg: '사용자 정보 수정에 실패했습니다' })
        modifyInit()
      }
    } else {
      message.error({ title: '사용자 정보 수정 에러', msg: '사용자 정보 수정에 실패했습니다' })
      modifyInit()
    }
  }

  const SelectedRoleValueIndexFun = () => {
    if(userInfo.user.role === 'DEVELOPER') {
      return RoleSearchDropdownList.findIndex((_) => _.key === modifySelectMember.role)
    } else if(userInfo.user.role === 'ADMIN') {
      return AdminRoleSearchDropdownList.findIndex((_) => _.key === modifySelectMember.role)
    }
  }

  const modifyAccountFun = async () => {
    if(!(modifySelectMember.name && modifySelectMember.email &&  modifySelectMember.phoneNumber && modifySelectMember.organization)) {
      message.error({ title: '정보 수정 에러', msg: '소속, 이름, 이메일, 전화번호 항목을 모두 입력해주세요.' })
      return true
    } 
    
    // else if(!passwordRegex.test(modifyAccountPassword)) {
    //   message.error({ title: '정보 수정 에러', msg: '비밀번호는 8자 이상 3가지 조합(영문자, 숫자, 특수문자) 혹은 10자 이상 2가지 조합(영문자, 숫자, 특수문자 중 선택)이어야 합니다' })
    //   return true
    // } else if(modifyAccountPassword !== modifyAccountPasswordConfirm) {
    //   message.error({ title: '정보 수정 에러', msg: '비밀번호가 일치하지 않습니다' })
    //   return true
    // } 
    
    else if(!nameRegex.test(modifySelectMember.name)) {
      message.error({ title: '정보 수정 에러', msg: '이름은 특수문자 및 공백 사용불가합니다' })
      return true
    } else if(!emailRegex.test(modifySelectMember.email)) {
      message.error({ title: '정보 수정 에러', msg: '잘못된 이메일 형식 입니다' })
      return true
    } else if(!phoneNumberRegex.test(modifySelectMember.phoneNumber)) {
      message.error({ title: '정보 수정 에러', msg: '전화번호를 9~11자리 숫자로만 입력해주세요' })
      return true
    } else {
      if(modifyAccountPassword) {
        if (!passwordRegex.test(modifyAccountPassword)){
          message.error({ title: '정보 수정 에러', msg: '비밀번호는 8자 이상 3가지 조합(영문자, 숫자, 특수문자) 혹은 10자 이상 2가지 조합(영문자, 숫자, 특수문자 중 선택)이어야 합니다' })
          return true
        } else if(!modifyAccountPasswordConfirm) {
          message.error({ title: '정보 수정 에러', msg: 'PW 확인란에 비밀번호를 입력해주세요' })
          return true
        } else if(modifyAccountPassword !== modifyAccountPasswordConfirm) {
          message.error({ title: '정보 수정 에러', msg: '비밀번호가 일치하지 않습니다' })
          return true
        } else {
          putUsersAccount(true)
        }
      } else {
        putUsersAccount(false)
      }
    }
  }

  return (
    <Modal
      visible={visible}
      close={() => {
        close()
        setModifyAccountPassword('')
        setModifyAccountPasswordConfirm('')
      }}
      title="정보 수정"   
      complete={modifyAccountFun} 
      noComplete={true} 
    >
      <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'space-between' }}>
        <div style={{ width: '100px' }}>
          ID:
        </div>
        <div style={{ width: '240px', textAlign: 'center' }}>
          {modifySelectMember.username}
        </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'space-between' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          PW:
        </div>
        <div>
          <AccountInput 
            value={modifyAccountPassword}
            type="password"
            onChange={(e) => {
              setModifyAccountPassword(e)
            }}
            onEnter={modifyAccountFun}
          />
        </div>
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
          onEnter={modifyAccountFun}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          소속 :
        </div>
        <AccountInput 
          value={modifySelectMember.organization}
          onChange={(e) => {
            setModifySelectMember((pre) => ({
              ...pre,
              organization: e
            }))
          }}
          onEnter={modifyAccountFun}
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
          onEnter={modifyAccountFun}
        />
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ width: '100px', lineHeight: '30px' }}>
          등급 :
        </div>
        <div>
          {(userInfo.user.role === 'DEVELOPER' || userInfo.user.role === 'ADMIN') ?
            modifySelectMember.role ?
              <RoleDropdown 
                itemList={userInfo.user.role === 'DEVELOPER' ? RoleSearchDropdownList : AdminRoleSearchDropdownList} 
                bodyStyle={{backgroundColor: `${ButtonBackgroundColor}`, zIndex: 1, width: '240px'}}
                onChange={val => {
                  setSearchRoleValue(val.value as roleType)
                }}
                valueIndex={SelectedRoleValueIndexFun()}
                // valueIndex={modifySelectMember.role === 'DEVELOPER' ? 2 : modifySelectMember.role === 'ADMIN' ? 1 : 0}
                // valueIndex={userInfo.user.role === 'DEVELOPER' ? 2 : 1}
              />
              :
              <></>
            :
            <div style={{ width: '240px', textAlign: 'center', lineHeight: '30px' }}>
              USER
            </div>
          }

        </div>
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
          onEnter={modifyAccountFun}
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
            const num = OnlyInputNumberFun(e)
            setModifySelectMember((pre) => ({
              ...pre,
              phoneNumber: num
            }))
          }}
          onEnter={modifyAccountFun}
        />
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
  color: white;
  width: 240px;
`

const AccountButton = styled(Button)`
  height: 30px;
`

const RoleDropdown = styled(Dropdown)`
  height: 30px;
  width: 240px;
`