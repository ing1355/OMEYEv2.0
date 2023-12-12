import styled from "styled-components"
import Button from "../../Constants/Button"
import { ButtonBackgroundColor, ButtonBorderColor, ButtonInActiveBackgroundColor, InputBackgroundColor, globalStyles } from "../../../styles/global-styled"
import Input from "../../Constants/Input"
import Dropdown from "../../Layout/Dropdown"
import searchIcon from "../../../assets/img/searchIcon.png"
import edit from "../../../assets/img/edit.png"
import Pagination from "../../Layout/Pagination"
import { useEffect, useState } from "react"
import { Axios } from "../../../Functions/NetworkFunctions"
import { UserAccountApi } from "../../../Constants/ApiRoutes"
import { useRecoilState } from "recoil"
import { IsAddMember, IsModifyMember, ModifySelectMember, UpdateMemeberList, modifySelectMemberInit } from "../../../Model/AccountDataModel"
import Modal from "../../Layout/Modal"
import AddAccount from "./AddAccount"
import ModifyAccount from "./ModifyAccount"
import resetIcon from "../../../assets/img/resetIcon.png"
import { isLogin } from "../../../Model/LoginModel"
import { decodedJwtToken } from "../../Layout/Header/UserMenu"
import { message } from "antd"
import useMessage from "../../../Hooks/useMessage"
import plusIcon from "../../../assets/img/plusIcon.png"
import minusIcon from "../../../assets/img/minusIcon.png"
import PasswordManagement from "./PasswordManagement"

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
  }, 
  {
    key: 'DEVELOPER',
    value: 'DEVELOPER',
    label: 'DEVELOPER'
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
  role: 'USER' | 'ADMIN' | 'DEVELOPER';
  name: string;
  email: string;
  phoneNumber: string;
  monitoringViewCount: number;
  isLock: boolean;
  isAlreadyLoggedIn: boolean;
  organization: string;
}

type ResType = {
  totalCount: number;
  results: usersType[];
}

type AccountSearchValues = 'role' | 'username' | 'name' | 'email' | 'phoneNumber' | 'organization' ;
export type RoleValues = 'USER' | 'ADMIN' | 'DEVELOPER' ;

const AccountSettings = ({visible}: {
  visible: boolean
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectUsers, setSelectUsers] = useState<string[]>([])
  const [isAddMember, setIsAddMember] = useRecoilState(IsAddMember)
  const [isDeleteMember, setIsDeleteMember] = useState<boolean>(false)
  const [usersAccountRows, setUsersAccountRows] = useState<ResType>({totalCount: 0, results: []})
  const [isModifyMember, setIsModifyMember] = useRecoilState(IsModifyMember)
  const [modifySelectMember, setModifySelectMember] = useRecoilState(ModifySelectMember)
  const [searchValue, setSearchValue] = useState<AccountSearchValues>('username')
  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [searchRoleValue, setSearchRoleValue] = useState<RoleValues>('USER')
  const [updateMemeberList, setUpdateMemeberList] = useRecoilState(UpdateMemeberList)
  const [login, setIsLogin] = useRecoilState(isLogin)
  const [passcodeTarget, setPasscodeTarget] = useState('')
  const userInfo = decodedJwtToken(login!)
  const message = useMessage()

  const getUsersAccountList = async () => {
    const res:ResType = await Axios('GET', UserAccountApi, {
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
    const res:ResType = await Axios('GET', UserAccountApi, {
      size: 10,
      page: 1,
    })
    if (res) setUsersAccountRows(res)
  }

  const deleteUsersAccount = async () => {
    const res = await Axios('DELETE', UserAccountApi, {
      uuid: selectUsers.join(',')
    }, true)
    setIsDeleteMember(false)
    setUpdateMemeberList(!updateMemeberList)
    setSelectUsers([])

    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: '사용자 삭제', msg: '사용자를 삭제했습니다' })
      } else {
        message.error({ title: '사용자 삭제 에러', msg: '사용자 삭제를 실패했습니다' })
      }
    } else {
      message.error({ title: '사용자 삭제 에러', msg: '사용자 삭제를 실패했습니다' })
    }
  }

  const allCheckFun = () => {
    let isAll = false
    let usersAccountAllTemp = usersAccountRows.results.filter((_)=>!(_.username === 'admin' || _.username === 'omeye'))

    if(userInfo.user.role === 'ADMIN') {
      usersAccountAllTemp = usersAccountRows.results.filter((_)=>!(_.username === 'admin' || _.username === 'omeye')).filter((_) => (_.role === 'ADMIN' && _.username === userInfo.user.username) || _.role === 'USER' )
    }
    if(usersAccountAllTemp.length > 0) {
      isAll = usersAccountAllTemp.every((_) => selectUsers.includes(_.id))
    } else {
      isAll = false
    }
    
    return isAll
  }

  useEffect(() => {
    if(visible) getUsersAccountList()
  },[currentPage, updateMemeberList])

  return (
    <div>
      {/* top */}
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '30px'}}>
        <div style={{display: 'flex'}}>
          <div style={{marginRight: '15px'}}>
            <TopDropdown 
              itemList={AccountSearchDropdownList} 
              bodyStyle={{backgroundColor: `${InputBackgroundColor}`}}
              onChange={val => {
                setSearchValue(val.value as AccountSearchValues)
              }}
            />
          </div>
          {searchValue === 'role' ?
            <RoleDropdown 
              itemList={userInfo.user.role === 'DEVELOPER' ? RoleSearchDropdownList : AdminRoleSearchDropdownList} 
              bodyStyle={{backgroundColor: `${InputBackgroundColor}`}}
              onChange={val => {
                setSearchRoleValue(val.value as RoleValues)
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
              const res:ResType = await Axios('GET', UserAccountApi, {
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
        {(userInfo.user.role === 'DEVELOPER' || userInfo.user.role === 'ADMIN') &&
          <div style={{display: 'flex', gap: '8px'}}>
            <TopButton 
              hover 
              disabled={!(selectUsers.length > 0)}
              onClick={() => {
                if(selectUsers.length > 0) setIsDeleteMember(true)
              }}
              icon={minusIcon}
              iconStyle={{width: '15px', height: '15px'}}
            >
              사용자 삭제
            </TopButton>
            <TopButton 
              hover 
              onClick={() => {
                setIsAddMember(true)
              }}
              icon={plusIcon}
              iconStyle={{width: '15px', height: '15px'}}
            >사용자 추가</TopButton>
          </div>
        }
      </div>
      {/* content */}
      <div style={{width: '100%', textAlign: 'center', marginTop: '15px'}}>
        <AccountRow>
          {(userInfo.user.role === 'DEVELOPER' || userInfo.user.role === 'ADMIN') ?
            <div onClick={() => {
                let userUuidAllTemp:string[] = []
                let filtedTemp = usersAccountRows.results.filter((_) =>!(_.username === 'admin' || _.username === 'omeye'))
  
                if(!allCheckFun()) {
                  if(userInfo.user.role === 'DEVELOPER') userUuidAllTemp = filtedTemp.map((_) => _.id)
                  if(userInfo.user.role === 'ADMIN') {
                    if(userInfo.user.username === 'admin') {
                      userUuidAllTemp = filtedTemp.filter((_) => _.role !== 'DEVELOPER').map((_) => _.id)
                    } else {
                      userUuidAllTemp = filtedTemp.filter((_) => _.role !== 'DEVELOPER').filter((_) => (_.role === 'ADMIN' && _.username === userInfo.user.username) || _.role === 'USER' ).map((_) => _.id)
                    }
                    
                  }
                }
                
                setSelectUsers(userUuidAllTemp)
              }}
            >
              <input type="checkbox" checked={allCheckFun()} onChange={() => {

              }}/>
            </div>
          :
            <div/>
          }
          <div>아이디</div>
          <div>등급</div>
          <div>소속</div>
          <div>이름</div>
          <div>이메일</div>
          <div>전화번호</div>
          <div>수정</div>
          <div>패스코드</div>
        </AccountRow>
        <div>
          {usersAccountRows && usersAccountRows.results.length > 0 ?
            <>
              <div style={{display: 'flex', flexDirection: 'column', marginBottom: '15px'}}>
                {usersAccountRows.results.map((data:usersType, index) => {
                  return (
                    <AccountRow 
                      isSelected={selectUsers.some((_) => _ === data.id)}
                      key={'usersAccountRows' + index}
                      style={{cursor: (userInfo.user.role === 'DEVELOPER' || userInfo.user.username === 'admin' || userInfo.user.username === 'omeye' || (userInfo.user.role === 'ADMIN' && data.role === 'USER') || (userInfo.user.role === 'ADMIN' && data.username === userInfo.user.username)) || !(data.username === 'admin' || data.username === 'omeye') ? 'default' : 'pointer'}}
                      onClick={() => {
                        if(userInfo.user.role === 'DEVELOPER' || userInfo.user.username === 'admin' || userInfo.user.username === 'omeye' || (userInfo.user.role === 'ADMIN' && data.role === 'USER') || (userInfo.user.role === 'ADMIN' && data.username === userInfo.user.username)) {
                          if(!(data.username === 'admin' || data.username === 'omeye')) {
                            const isDelete = selectUsers.find((_) => _ === data.id)
                            let selectTemp:string[] = []
    
                            if(isDelete) {
                              selectTemp = selectUsers.filter((_) => _ !== data.id)
                            } else {
                              selectTemp = selectUsers.concat(data.id)
                            }
                            setSelectUsers(selectTemp)
                          }
                        }
                      }}
                    >
                      <div>
                        {(userInfo.user.role === 'DEVELOPER' || userInfo.user.username === 'admin' || userInfo.user.username === 'omeye' || (userInfo.user.role === 'ADMIN' && data.role === 'USER') || (userInfo.user.role === 'ADMIN' && data.username === userInfo.user.username)) ?
                            !(data.username === 'admin' ||data.username === 'omeye') ?
                              <input type="checkbox" checked={selectUsers.find((_) => _ === data.id) ? true : false} onChange={() => {
                                
                              }}/>
                            : <></>
                        :
                          <></>
                        }
                      </div>
                      <div>{data.username}</div>
                      <div>{data.role}</div>
                      <div>{data.organization}</div>
                      <div>{data.name}</div>
                      <div>{data.email}</div>
                      <div>{data.phoneNumber}</div>
                      {(userInfo.user.role === 'DEVELOPER' || userInfo.user.username === 'admin' || (userInfo.user.role === 'ADMIN' && data.username === userInfo.user.username) || (userInfo.user.role === 'ADMIN' && data.role === 'USER') || (userInfo.user.role === 'USER' && data.username === userInfo.user.username)) ?
                      <div style={{cursor: 'pointer'}} onClick={(e) => {
                        e.stopPropagation()
                        setIsModifyMember(true);
                        setModifySelectMember({
                          id: data.id,
                          username: data.username,
                          role: data.role,
                          name: data.name,
                          email: data.email,
                          phoneNumber: data.phoneNumber,
                          organization: data.organization
                        })
                      }}><img src={edit} style={{height: '15px'}}/></div>:<div/>}
                      {(userInfo.user.role === 'DEVELOPER' || userInfo.user.username === 'admin' || (userInfo.user.role === 'ADMIN' && data.username === userInfo.user.username) || (userInfo.user.role === 'ADMIN' && data.role === 'USER') || (userInfo.user.role === 'USER' && data.username === userInfo.user.username)) ?
                      <div style={{cursor: 'pointer'}} onClick={(e) => {
                        e.stopPropagation()
                        setPasscodeTarget(data.username)
                      }}><img src={edit} style={{height: '15px'}}/></div>:<div/>}
                    </AccountRow>
                  )
                })}
              </div>
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={usersAccountRows.totalCount} dataPerPage={10}/> 
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
        visible={isDeleteMember}
        close={() => {
          setIsDeleteMember(false)
          setSearchInputValue('')
        }}
        title="사용자 삭제"
        noFooter={true}
      >
        <ModalInnerContainer>
          <div style={{margin: '30px 0px'}}>삭제하시겠습니까?</div>
          <div>
            <DeleteModalButton 
              hover
              onClick={deleteUsersAccount}
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
      <PasswordManagement visible={passcodeTarget} setVisible={setPasscodeTarget} targetId={usersAccountRows.totalCount > 0 ? usersAccountRows.results.find(_ => _.username === passcodeTarget)?.id! : ''}/>
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
  height: ${TopContainerHeight-20}px;
  width: 120px;
`

const RoleDropdown = styled(Dropdown)`
  height: ${TopContainerHeight-20}px;
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

const AccountRow = styled.div<{isSelected?: boolean}>`
  ${globalStyles.flex({flexDirection:'row'})}
  background-color: ${({isSelected}) => isSelected === undefined ? ButtonBackgroundColor : (isSelected ? ButtonInActiveBackgroundColor : 'transparent')};
  padding: 10px 0;
  border-bottom: 1px solid ${ButtonBorderColor};
  & > div {
    line-height: 20px;
    &:first-child {
      width: 3%;
    }
    &:nth-child(2) {
      width: 13%;
    }
    &:nth-child(3) {
      width: 10%;
    }
    &:nth-child(4) {
      width: 15%;
    }
    &:nth-child(5) {
      width: 10%;
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
      width: 10%;
    }
  }
`

const ModalInnerContainer = styled.div`
  ${globalStyles.flex({justifyContent: 'space-evenly'})}
  height: 100%;
  text-align: center;
`