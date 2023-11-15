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
import { IsAddMember, IsModifyMember, ModifySelectMember, modifySelectMemberInit } from "../../../Model/AccountDataModel"
import Modal from "../../Layout/Modal"
import AddAccount from "./AddAccount"
import ModifyAccount from "./ModifyAccount"
import resetIcon from "../../../assets/img/resetIcon.png"

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

const RoleSearchDropdownList = [
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
}

type ResType = {
  totalCount: number;
  results: usersType[];
}

type AccountSearchValues = 'role' | 'username' | 'name' | 'email' | 'phoneNumber' ;
type RoleValues = 'USER' | 'username' | 'name' | 'email' | 'phoneNumber' ;

const AccountSettings = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectUsers, setSelectUsers] = useState<string[]>([]);
  const [isAddMember, setIsAddMember] = useRecoilState(IsAddMember);
  const [isDeleteMember, setIsDeleteMember] = useState<boolean>(false);
  const [usersAccountRows, setUsersAccountRows] = useState<ResType>({totalCount: 0, results: []});
  const [isModifyMember, setIsModifyMember] = useRecoilState(IsModifyMember);
  const [modifySelectMember, setModifySelectMember] = useRecoilState(ModifySelectMember);
  const [searchValue, setSearchValue] = useState<AccountSearchValues>('username');
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [searchRoleValue, setSearchRoleValue] = useState<RoleValues>('USER');

console.log('searchInputValue',searchInputValue)

  const getUsersAccountList = async () => {
    const res:ResType = await Axios('GET', UserAccountApi, {
      size: 10,
      page: currentPage,
      username: searchValue === 'username' ? searchInputValue === '' ? null : searchInputValue : null,
      role: searchValue === 'role' ? searchRoleValue : null,
      name: searchValue === 'name' ? searchInputValue === '' ? null : searchInputValue : null,
      email: searchValue === 'email' ? searchInputValue === '' ? null : searchInputValue : null,
      phoneNumber: searchValue === 'phoneNumber' ? searchInputValue === '' ? null : searchInputValue : null,
    })
    if (res) setUsersAccountRows(res);
  }

  const getUsersAccountListReset = async () => {
    const res:ResType = await Axios('GET', UserAccountApi, {
      size: 10,
      page: 0,
    })
    if (res) setUsersAccountRows(res);
  }

  const deleteUsersAccount = async () => {
    const res = await Axios('DELETE', UserAccountApi, {
      uuid: selectUsers.join(',')
    })
    if(res && res === null) {
      setIsDeleteMember(false);
      setSelectUsers([]);
    }
  }

  const allCheckFun = () => {
    let isAll = false;
    if(usersAccountRows.results.length > 0) {
      isAll = usersAccountRows.results.every((_) => selectUsers.includes(_.id));
    } else {
      isAll = false
    }
    
    return isAll
  }

  useEffect(() => {
    getUsersAccountList();
  },[isAddMember, isModifyMember, currentPage, isDeleteMember])

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
                setSearchValue(val.value as AccountSearchValues);
              }}
            />
          </div>
          {searchValue === 'role' ?
            <RoleDropdown 
              itemList={RoleSearchDropdownList} 
              bodyStyle={{backgroundColor: `${InputBackgroundColor}`}}
              onChange={val => {
                setSearchRoleValue(val.value as RoleValues);
              }}
            />
          :
            <SearchInput placeholder={'검색'} value={searchInputValue} onChange={value => {
              setSearchInputValue(value);
            }} 
            />
          }
          {/* <SearchInput placeholder={'검색'} value={searchInputValue} onChange={value => {
            setSearchInputValue(value);
          }} 
          /> */}
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              getUsersAccountList();
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
              setSearchInputValue('');
              setCurrentPage(0);
              getUsersAccountListReset();
            }}
          >
            <img 
              src={resetIcon} 
              style={{ height: '20px', margin: '8px' }}
            />
          </div>
        </div>
        <div style={{display: 'flex', gap: '8px'}}>
          <TopButton 
            hover 
            disabled={!(selectUsers.length > 0)}
            onClick={() => {
              if(selectUsers.length > 0) setIsDeleteMember(true);
            }}
          >
            멤버 삭제
          </TopButton>
          <TopButton hover onClick={() => {
            setIsAddMember(true);
          }}>멤버 추가</TopButton>
        </div>
      </div>
      {/* content */}
      <div style={{width: '100%', textAlign: 'center', marginTop: '15px'}}>
        <div style={{display: 'flex', backgroundColor: `${ButtonBackgroundColor}`, padding: '10px 0'}}>
          <div style={{width: '5%'}}
            onClick={() => {
              let userUuidAllTemp:string[] = [];

              if(!allCheckFun()) {
                userUuidAllTemp = usersAccountRows.results.map((_) => _.id);
              }
              
              setSelectUsers(userUuidAllTemp);
            }}
          >
            <input type="checkbox" checked={allCheckFun()}/>
          </div>
          <div style={{width: '15%'}}>아이디</div>
          <div style={{width: '15%'}}>등급</div>
          <div style={{width: '15%'}}>이름</div>
          <div style={{width: '25%'}}>이메일</div>
          <div style={{width: '20%'}}>전화번호</div>
          <div style={{width: '5%'}}>수정</div>
        </div>
        <div>
          {usersAccountRows && usersAccountRows.results.length > 0 ?
            <>
              <div style={{display: 'flex', flexDirection: 'column', marginBottom: '15px'}}>
                {usersAccountRows.results.map((data:usersType) => {
                  return (
                    <div 
                      style={{display: 'flex', flexDirection: 'row', borderBottom: `1px solid ${ButtonBorderColor}`, padding: '10px 0', cursor: 'pointer', backgroundColor: selectUsers.find((_) => _ === data.id) ? `${ButtonInActiveBackgroundColor}` : ''}}
                      onClick={() => {
                        const isDelete = selectUsers.find((_) => _ === data.id);
                        let selectTemp:string[] = [];

                        if(isDelete) {
                          selectTemp = selectUsers.filter((_) => _ !== data.id);
                        } else {
                          selectTemp = selectUsers.concat(data.id)
                        }

                        setSelectUsers(selectTemp);
                      }}
                    >
                      <div style={{width: '5%'}}><input type="checkbox" checked={selectUsers.find((_) => _ === data.id) ? true : false}/></div>
                      <div style={{width: '15%'}}>{data.username}</div>
                      <div style={{width: '15%'}}>{data.role}</div>
                      <div style={{width: '15%'}}>{data.name}</div>
                      <div style={{width: '25%'}}>{data.email}</div>
                      <div style={{width: '20%'}}>{data.phoneNumber}</div>
                      <div style={{width: '5%'}} onClick={() => {
                        setIsModifyMember(true);
                        setModifySelectMember({
                          id: data.id,
                          username: data.username,
                          name: data.name,
                          email: data.email,
                          phoneNumber: data.phoneNumber,
                        })
                      }}><img src={edit} style={{height: '15px'}}/></div>
                    </div>
                  )
                })}
              </div>
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} datas={usersAccountRows}/> 
            </>
          :
            <NoDataContentsContainer style={{}}>
              서버에 저장된 분석 결과가 존재하지 않습니다.
            </NoDataContentsContainer>
          }
        </div>
      </div>
      <AddAccount 
        visible={isAddMember} 
        close={() => {
          setIsAddMember(false);
        }}
        noComplete={true}
      />
      <ModifyAccount 
        visible={isModifyMember} 
        close={() => {
          setIsModifyMember(false);
          setModifySelectMember(modifySelectMemberInit);
        }}
        noComplete={true}
      />
      <Modal 
        visible={isDeleteMember}
        close={() => {
          setIsDeleteMember(false);
        }}
        title="멤버 삭제"
        noComplete={true}
      >
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%', textAlign: 'center'}}>
          <div>삭제하시겠습니까?</div>
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
                setIsDeleteMember(false);
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
