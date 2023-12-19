import styled from "styled-components"
import Button from "../../Constants/Button"
import { ButtonActiveBackgroundColor, ButtonBackgroundColor, ButtonBorderColor, ButtonInActiveBackgroundColor, InputBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import Dropdown from "../../Layout/Dropdown"
import searchIcon from "../../../assets/img/searchIcon.png"
import edit from "../../../assets/img/edit.png"
import Pagination from "../../Layout/Pagination"
import { useEffect, useRef, useState } from "react"
import { Axios } from "../../../Functions/NetworkFunctions"
import { PasswordVerificationApi, UserAccountApi } from "../../../Constants/ApiRoutes"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { IsAddMember, IsModifyMember, ModifySelectMember, UpdateMemeberList, modifySelectMemberInit, roleType } from "../../../Model/AccountDataModel"
import Modal from "../../Layout/Modal"
import AddAccount from "./AddAccount"
import ModifyAccount from "./ModifyAccount"
import resetIcon from "../../../assets/img/resetIcon.png"
import { isLogin } from "../../../Model/LoginModel"
import useMessage from "../../../Hooks/useMessage"
import plusIcon from "../../../assets/img/plusIcon.png"
import minusIcon from "../../../assets/img/minusIcon.png"
import passcodeIcon from "../../../assets/img/passcodeIcon.png"
import PasswordManagement from "./PasswordManagement"
import { BasicLogDataType } from "../../../Constants/GlobalTypes"
import { decodedJwtToken } from "../../../Functions/GlobalFunctions"

const AccountSearchDropdownList = [
  {
    key: 'username',
    value: 'username',
    label: '아이디'
  },
  {
    key: 'role',
    value: 'role',
    label: '등급'
  },
  {
    key: 'organization',
    value: 'organization',
    label: '소속'
  },
  {
    key: 'name',
    value: 'name',
    label: '이름'
  },
  {
    key: 'email',
    value: 'email',
    label: '이메일'
  },
  {
    key: 'phoneNumber',
    value: 'phoneNumber',
    label: '전화번호'
  }
];

export const RoleSearchDropdownList = [
  {
    key: 'USER',
    value: 'USER',
    label: 'USER'
  },
  {
    key: 'ADMIN',
    value: 'ADMIN',
    label: 'ADMIN'
  }
];

export const AdminRoleSearchDropdownList = [
  {
    key: 'USER',
    value: 'USER',
    label: 'USER'
  },
  {
    key: 'ADMIN',
    value: 'ADMIN',
    label: 'ADMIN'
  }
];

type usersType = {
  id: string;
  username: string;
  role: roleType;
  name: string;
  email: string;
  phoneNumber: string;
  monitoringViewCount: number;
  isLock: boolean;
  isAlreadyLoggedIn: boolean;
  organization: string;
}

type ResType = BasicLogDataType<usersType[]>

type AccountSearchValues = 'role' | 'username' | 'name' | 'email' | 'phoneNumber' | 'organization';

const higherThanOtherRole = (role1: roleType, role2: roleType) => {
  if (role1 === 'DEVELOPER') return true
  else if (role1 === 'SUPER_ADMIN') {
    if (['SUPER_ADMIN', 'DEVELOPER'].includes(role2)) return false
    return true
  } else if (role1 === 'ADMIN') {
    if (['DEVELOPER', 'SUPER_ADMIN', 'ADMIN'].includes(role2)) return false
    return true
  } else {
    return false
  }
}

const AccountSettings = ({ visible }: {
  visible: boolean
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectUsers, setSelectUsers] = useState<string[]>([])
  const [isAddMember, setIsAddMember] = useRecoilState(IsAddMember)
  const [isDeleteMember, setIsDeleteMember] = useState<boolean>(false)
  const [usersAccountRows, setUsersAccountRows] = useState<ResType>({ totalCount: 0, results: [] })
  const setModifySelectMember = useSetRecoilState(ModifySelectMember)
  const [searchValue, setSearchValue] = useState<AccountSearchValues>('username')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [searchRoleValue, setSearchRoleValue] = useState<roleType>('USER')
  const [isOpenPWConfirmModal, setIsOpenPWConfirmModal] = useState<boolean>(false)
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [passcodeTarget, setPasscodeTarget] = useState('')
  const [isModifyMember, setIsModifyMember] = useRecoilState(IsModifyMember)
  const [updateMemeberList, setUpdateMemeberList] = useRecoilState(UpdateMemeberList)
  const login = useRecoilValue(isLogin)
  const userInfo = decodedJwtToken(login!)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const message = useMessage()
  const isSelf = (username: string) => userInfo.user.username === username
  const isUser = userInfo.user.role === 'USER'

  const getUsersAccountList = async () => {
    const res: ResType = await Axios('GET', UserAccountApi, {
      size: 10,
      page: currentPage,
      username: searchValue === 'username' ? searchInputValue === '' ? null : searchInputValue : null,
      role: searchValue === 'role' ? searchRoleValue : null,
      name: searchValue === 'name' ? searchInputValue === '' ? null : searchInputValue : null,
      email: searchValue === 'email' ? searchInputValue === '' ? null : searchInputValue : null,
      phoneNumber: searchValue === 'phoneNumber' ? searchInputValue === '' ? null : searchInputValue : null,
      organization: searchValue === 'organization' ? searchInputValue === '' ? null : searchInputValue : null,
    })
    if (res) setUsersAccountRows(res)
  }

  const getUsersAccountListReset = async () => {
    const res: ResType = await Axios('GET', UserAccountApi, {
      size: 10,
      page: 1,
    })
    if (res) setUsersAccountRows(res)
  }

  const deleteUsersAccount = async () => {
    const res = await Axios('DELETE', UserAccountApi, {
      uuid: selectUsers.join(',')
    })
    setIsDeleteMember(false)
    setUpdateMemeberList(!updateMemeberList)
    setSelectUsers([])

    if(res) {
      message.success({ title: '사용자 삭제', msg: '사용자를 삭제했습니다' })
    } else {
      message.error({ title: '사용자 삭제 에러', msg: '사용자 삭제를 실패했습니다' })
    }
  }

  const PasswordConfirmFun = async () => {
    const res = await Axios('POST', PasswordVerificationApi, {
      password: passwordConfirm,
      uuid: userInfo.user.id
    })

    if(res) {
      message.success({ title: '비밀번호 확인', msg: '비밀번호 확인에 성공했습니다' })
      setIsOpenPWConfirmModal(false)
      setIsModifyMember(true)
      setPasswordConfirm('')
    } else {
      message.error({ title: '비밀번호 확인 에러', msg: '비밀번호 확인에 실패했습니다' })
      setPasswordConfirm('')
    }
  }

  useEffect(() => {
    if (visible) getUsersAccountList()
  }, [currentPage, updateMemeberList])

  useEffect(() => {
    if(isOpenPWConfirmModal) passwordConfirmRef.current?.focus()
  },[isOpenPWConfirmModal])

  return (
    <div>
      {/* top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '15px' }}>
            <TopDropdown
              itemList={AccountSearchDropdownList}
              bodyStyle={{ backgroundColor: `${InputBackgroundColor}` }}
              onChange={val => {
                setSearchValue(val.value as AccountSearchValues)
              }}
            />
          </div>
          {searchValue === 'role' ?
            <RoleDropdown
              itemList={userInfo.user.role === 'DEVELOPER' ? RoleSearchDropdownList : AdminRoleSearchDropdownList}
              bodyStyle={{ backgroundColor: `${InputBackgroundColor}` }}
              onChange={val => {
                setSearchRoleValue(val.value as roleType)
              }}
            />
            :
            <SearchInput
              placeholder={'검색'}
              value={searchInputValue}
              onChange={value => {
                setSearchInputValue(value)
              }}
              onEnter={getUsersAccountList}
            />
          }
          {/* <SearchInput placeholder={'검색'} value={searchInputValue} onChange={value => {
            setSearchInputValue(value);
          }} 
          /> */}
          <div
            style={{ cursor: 'pointer' }}
            onClick={async () => {
              const res: ResType = await Axios('GET', UserAccountApi, {
                size: 10,
                page: 1,
                username: searchValue === 'username' ? searchInputValue === '' ? null : searchInputValue : null,
                role: searchValue === 'role' ? searchRoleValue : null,
                name: searchValue === 'name' ? searchInputValue === '' ? null : searchInputValue : null,
                email: searchValue === 'email' ? searchInputValue === '' ? null : searchInputValue : null,
                phoneNumber: searchValue === 'phoneNumber' ? searchInputValue === '' ? null : searchInputValue : null,
                organization: searchValue === 'organization' ? searchInputValue === '' ? null : searchInputValue : null
              })
              if (res) {
                setUsersAccountRows(res)
                setCurrentPage(1)
              }
            }}
          >
            <img
              src={searchIcon}
              style={{ height: '20px', margin: '8px' }}
            />
          </div>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setSearchInputValue('')
              setCurrentPage(1)
              getUsersAccountListReset()
            }}
          >
            <img
              src={resetIcon}
              style={{ height: '20px', margin: '8px' }}
            />
          </div>
        </div>
        {userInfo.user.role !== 'USER' &&
          <div style={{ display: 'flex', gap: '8px' }}>
            <TopButton
              hover
              disabled={!(selectUsers.length > 0)}
              onClick={() => {
                if (selectUsers.length > 0) setIsDeleteMember(true)
              }}
              icon={minusIcon}
              iconStyle={{ width: '15px', height: '15px' }}
            >
              사용자 삭제
            </TopButton>
            <TopButton
              hover
              onClick={() => {
                setIsAddMember(true)
              }}
              icon={plusIcon}
              iconStyle={{ width: '15px', height: '15px' }}
            >사용자 추가</TopButton>
          </div>
        }
      </div>
      {/* content */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
        <AccountRow isUser={isUser}>
          {usersAccountRows.results.some(_ => !higherThanOtherRole(_.role, userInfo.user.role)) && !isUser &&
            <div onClick={() => {
              let filteredTemp = usersAccountRows.results.filter(_ => higherThanOtherRole(userInfo.user.role, _.role)).map(_ => _.id)
              if (filteredTemp.every(_ => selectUsers.includes(_))) setSelectUsers(filteredTemp.filter(_ => !selectUsers.includes(_)))
              else setSelectUsers(selectUsers.concat(filteredTemp).deduplication())
            }}
            >
              <input type="checkbox" style={{accentColor: ButtonActiveBackgroundColor}} checked={usersAccountRows.results.filter(_ => higherThanOtherRole(userInfo.user.role, _.role)).map(_ => _.id).every(_ => selectUsers.includes(_))} onChange={() => {

              }} />
            </div>}
          <div>아이디</div>
          <div>등급</div>
          <div>소속</div>
          <div>이름</div>
          <div>이메일</div>
          <div>전화번호</div>
          <div>수정</div>
          {userInfo.user.role !== 'USER' && <div>초기화 코드</div>}
        </AccountRow>
        <div>
          {usersAccountRows && usersAccountRows.results.length > 0 ?
            <>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                {usersAccountRows.results.map((data: usersType, index) => {
                  return (
                    <AccountRow
                      isUser={isUser}
                      isSelected={selectUsers.some((_) => _ === data.id)}
                      key={'usersAccountRows' + index}
                      isGranted={higherThanOtherRole(userInfo.user.role, data.role)}
                      onClick={() => {
                        if (higherThanOtherRole(userInfo.user.role, data.role)) {
                          const isDelete = selectUsers.find((_) => _ === data.id)
                          let selectTemp: string[] = []

                          if (isDelete) {
                            selectTemp = selectUsers.filter((_) => _ !== data.id)
                          } else {
                            selectTemp = selectUsers.concat(data.id)
                          }
                          setSelectUsers(selectTemp)
                        }
                      }}
                    >
                      {!isUser && (higherThanOtherRole(userInfo.user.role, data.role) && !isSelf(data.username) ?
                        <div>
                          <input type="checkbox" checked={selectUsers.find((_) => _ === data.id) ? true : false} onChange={() => {

                          }} />
                        </div> : <div/>)
                      }
                      <div>{data.username}</div>
                      <div>{data.role}</div>
                      <div>{data.organization}</div>
                      <div>{data.name}</div>
                      <div>{data.email}</div>
                      <div>{data.phoneNumber}</div>
                      {higherThanOtherRole(userInfo.user.role, data.role) || isSelf(data.username) ?
                        <div style={{ cursor: 'pointer' }} onClick={(e) => {
                          e.stopPropagation()
                          // setIsModifyMember(true);
                          setIsOpenPWConfirmModal(true)
                          setModifySelectMember({
                            id: data.id,
                            username: data.username,
                            role: data.role,
                            name: data.name,
                            email: data.email,
                            phoneNumber: data.phoneNumber,
                            organization: data.organization
                          })
                        }}><img src={edit} style={{ height: '15px' }} /></div> : <div />}
                      {!isUser && data.role === "USER" && !isSelf(data.username) ?
                        <div style={{ cursor: 'pointer' }} onClick={(e) => {
                          e.stopPropagation()
                          setPasscodeTarget(data.id)
                        }}><img src={passcodeIcon} style={{ height: '15px' }} /></div> : <div/>}
                    </AccountRow>
                  )
                })}
              </div>
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={usersAccountRows.totalCount} dataPerPage={10} />
            </>
            :
            <NoDataContentsContainer style={{}}>
              계정 정보가 존재하지 않습니다.
            </NoDataContentsContainer>
          }
        </div>
      </div>
      <AddAccount
        visible={isAddMember}
        close={() => {
          setIsAddMember(false)
          setSearchInputValue('')
        }}
      />
      <ModifyAccount
        visible={isModifyMember}
        close={() => {
          setIsModifyMember(false)
          setModifySelectMember(modifySelectMemberInit)
          setSearchInputValue('')
        }}
      />
      <Modal
        title="비밀번호 확인"
        visible={isOpenPWConfirmModal}
        close={() => {
          setIsOpenPWConfirmModal(false)
        }}
        complete={PasswordConfirmFun}
      >
        <ModalInnerContainer>
          <div style={{ margin: '30px 0px' }}>비밀번호를 입력해주세요.</div>
          <div>
            <AccountInput type="password" value={passwordConfirm} onChange={setPasswordConfirm} inputRef={passwordConfirmRef} onEnter={PasswordConfirmFun}/>
          </div>
        </ModalInnerContainer>
      </Modal>
      <Modal
        visible={isDeleteMember}
        close={() => {
          setIsDeleteMember(false)
          setSearchInputValue('')
        }}
        title="사용자 삭제"
        noFooter={true}
      >
        <ModalInnerContainer>
          <div style={{ margin: '30px 0px' }}>삭제하시겠습니까?</div>
          <div>
            <DeleteModalButton
              hover
              onClick={deleteUsersAccount}
              activate={true}
            >
              삭제
            </DeleteModalButton>
            <DeleteModalButton
              hover
              onClick={() => {
                setIsDeleteMember(false)
              }}
            >
              취소
            </DeleteModalButton>
          </div>
        </ModalInnerContainer>
      </Modal>
      <PasswordManagement visible={passcodeTarget} setVisible={setPasscodeTarget} />
    </div>
  )
}

export default AccountSettings

const TopContainerHeight = 60

const TopInputAndButtonsContainer = styled.div`
    height: ${TopContainerHeight}px;
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px' })}
`

const TopDropdown = styled(Dropdown)`
  height: ${TopContainerHeight - 20}px;
  width: 120px;
`

const RoleDropdown = styled(Dropdown)`
  height: ${TopContainerHeight - 20}px;
  width: 150px;
`

const SearchInput = styled(Input)`
  height: 40px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 480px;
  color: white;
`

const TopButton = styled(Button)`
  height: 40px;
`

const NoDataContentsContainer = styled.div`
  ${globalStyles.flex()}
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 10%;
`
const DeleteModalButton = styled(Button)`
  height: 30px;
  margin: 0 4px;
`

const AccountRow = styled.div<{ isSelected?: boolean, isGranted?: boolean, isUser: boolean }>`
  ${globalStyles.flex({ flexDirection: 'row' })}
  background-color: ${({ isSelected }) => isSelected === undefined ? ButtonBackgroundColor : (isSelected ? ButtonInActiveBackgroundColor : 'transparent')};
  height: 44px;
  border-bottom: 1px solid ${ButtonBorderColor};
  ${({ isGranted, isSelected }) => isGranted && `
    cursor: pointer;
    &:hover {
      ${!isSelected && `
        background-color: ${ButtonBorderColor};
    `}
    }
  `}
  & > div {
    height: 100%;
    ${globalStyles.flex()}
    ${({ isUser }) => isUser ? `
    &:first-child {
      width: 15%;
    }
    &:nth-child(2) {
      width: 10%;
    }
    &:nth-child(3) {
      width: 15%;
    }
    &:nth-child(4) {
      width: 15%;
    }
    &:nth-child(5) {
      width: 20%;
    }
    &:nth-child(6) {
      width: 20%;
    }
    &:nth-child(7) {
      width: 5%;
    }
    ` : `
    &:first-child {
      width: 3%;
    }
    &:nth-child(2) {
      width: 15%;
    }
    &:nth-child(3) {
      width: 10%;
    }
    &:nth-child(4) {
      width: 15%;
    }
    &:nth-child(5) {
      width: 11%;
    }
    &:nth-child(6) {
      width: 17%;
    }
    &:nth-child(7) {
      width: 17%;
    }
    &:nth-child(8) {
      width: 5%;
    }
    &:nth-child(9) {
      width: 7%;
    }
    `}
  }
`

const ModalInnerContainer = styled.div`
  ${globalStyles.flex({ justifyContent: 'space-evenly' })}
  height: 100%;
  text-align: center;
`

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