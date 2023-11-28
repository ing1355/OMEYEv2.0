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
        message.success({ title: '멤버 삭제', msg: '멤버를 삭제했습니다' })
      } else {
        message.error({ title: '멤버 삭제 에러', msg: '멤버 삭제를 실패했습니다' })
      }
    } else {
      message.error({ title: '멤버 삭제 에러', msg: '멤버 삭제를 실패했습니다' })
    }
  }

  const allCheckFun = () => {
    let isAll = false
    let usersAccountAllTemp = usersAccountRows.results

    if(userInfo.user.role === 'ADMIN') {
      usersAccountAllTemp = usersAccountRows.results.filter((_)=>_.role !== 'DEVELOPER')
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
              멤버 삭제
            </TopButton>
            <TopButton 
              hover 
              onClick={() => {
                setIsAddMember(true)
              }}
              icon={plusIcon}
              iconStyle={{width: '15px', height: '15px'}}
            >멤버 추가</TopButton>
          </div>
        }
      </div>
      {/* content */}
      <div style={{width: '100%', textAlign: 'center', marginTop: '15px'}}>
        <div style={{display: 'flex', backgroundColor: `${ButtonBackgroundColor}`, padding: '10px 0'}}>
          {(userInfo.user.role === 'DEVELOPER' || userInfo.user.role === 'ADMIN') ?
            <div style={{width: '2%'}}
              onClick={() => {
                let userUuidAllTemp:string[] = []
  
                if(!allCheckFun()) {
                  if(userInfo.user.role === 'DEVELOPER') userUuidAllTemp = usersAccountRows.results.map((_) => _.id)
                  if(userInfo.user.role === 'ADMIN') userUuidAllTemp = usersAccountRows.results.filter((_) => _.role !== 'DEVELOPER' ).map((_) => _.id)
                }
                
                setSelectUsers(userUuidAllTemp)
              }}
            >
              <input type="checkbox" checked={allCheckFun()}/>
            </div>
          :
            <div style={{width: '2%'}}></div>
          }
          <div style={{width: '15%', lineHeight: '20px'}}>아이디</div>
          <div style={{width: '15%', lineHeight: '20px'}}>등급</div>
          <div style={{width: '13%', lineHeight: '20px'}}>소속</div>
          <div style={{width: '12%', lineHeight: '20px'}}>이름</div>
          <div style={{width: '20%', lineHeight: '20px'}}>이메일</div>
          <div style={{width: '18%', lineHeight: '20px'}}>전화번호</div>
          <div style={{width: '5%', lineHeight: '20px'}}>수정</div>
        </div>
        <div>
          {usersAccountRows && usersAccountRows.results.length > 0 ?
            <>
              <div style={{display: 'flex', flexDirection: 'column', marginBottom: '15px'}}>
                {usersAccountRows.results.map((data:usersType, index) => {
                  return (
                    <div 
                      key={'usersAccountRows' + index}
                      style={{display: 'flex', flexDirection: 'row', borderBottom: `1px solid ${ButtonBorderColor}`, padding: '10px 0', cursor: 'pointer', backgroundColor: selectUsers.find((_) => _ === data.id) ? `${ButtonInActiveBackgroundColor}` : ''}}
                      onClick={() => {
                        if(userInfo.user.role === 'DEVELOPER' || (userInfo.user.role === 'ADMIN' && data.role !== 'DEVELOPER')) {
                          const isDelete = selectUsers.find((_) => _ === data.id)
                          let selectTemp:string[] = []
  
                          if(isDelete) {
                            selectTemp = selectUsers.filter((_) => _ !== data.id)
                          } else {
                            selectTemp = selectUsers.concat(data.id)
                          }
                          setSelectUsers(selectTemp)
                        }
                      }}
                    >
                      <div style={{width: '2%'}}>
                        {(userInfo.user.role === 'DEVELOPER' || (userInfo.user.role === 'ADMIN' && data.role !== 'DEVELOPER')) ?
                          <input type="checkbox" checked={selectUsers.find((_) => _ === data.id) ? true : false}/>
                        :
                          <></>
                        }
                      </div>
                      <div style={{width: '15%', lineHeight: '20px'}}>{data.username}</div>
                      <div style={{width: '15%', lineHeight: '20px'}}>{data.role}</div>
                      <div style={{width: '13%', lineHeight: '20px'}}>{data.organization}</div>
                      <div style={{width: '12%', lineHeight: '20px'}}>{data.name}</div>
                      <div style={{width: '20%', lineHeight: '20px'}}>{data.email}</div>
                      <div style={{width: '18%', lineHeight: '20px'}}>{data.phoneNumber}</div>
                      {(userInfo.user.role === 'DEVELOPER' || (userInfo.user.role === 'ADMIN' && data.role !== 'DEVELOPER') || (userInfo.user.role === 'USER' && data.username === userInfo.user.username)) ?
                      <div style={{width: '5%', lineHeight: '20px'}} onClick={() => {
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
                      }}><img src={edit} style={{height: '15px'}}/></div>
                      :
                      <div style={{width: '5%'}}></div>
                      }
                    </div>
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
        title="멤버 삭제"
        noFooter={true}
      >
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%', textAlign: 'center'}}>
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
        </div>
      </Modal>
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
