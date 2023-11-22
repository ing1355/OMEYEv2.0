import styled from "styled-components"
import { SectionBackgroundColor, TextActivateColor, globalStyles } from "../../styles/global-styled"
import Button from "../Constants/Button"
import { useState } from "react"
import AccountSettings from "./AccountSettings";
import VMSSettings from "./VMSSettings";
import OMEYESettings from "./OMEYESettings";
import ServerManagement from "./ServerManagement";
import OMEYESidebar from "./OMEYESettings/OMEYESidebar/OMEYESidebar";
import ServerMgmtSidebar from "./ServerManagement/ServerMgmtSidebar/ServerMgmtSidebar";

type settingsCategoryType = 'account' | 'vms' | 'omeye' | 'server';

const ViewByCategory = ({ type }: {
  type: settingsCategoryType
}) => {
  return <>
    <ChangedView selected={type === 'account'}>
      <AccountSettings />
    </ChangedView>
    <ChangedView selected={type === 'vms'}>
      <VMSSettings />
    </ChangedView>
    {type === 'omeye' &&
      <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
        <ChangedView selected={type === 'omeye'} style={{width:'49.5%', marginRight: '0.5%'}}>
          <OMEYESettings />
        </ChangedView>
        <ChangedView selected={type === 'omeye'} style={{width: '49.5%', marginLeft: '0.5%'}}>
          <OMEYESidebar />
        </ChangedView>
      </div>
    }
    {type === 'server' && 
      <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
        <ChangedView selected={type === 'server'} style={{width:'77%', marginRight: '0.5%'}}>
          <ServerManagement />
        </ChangedView>
        <ChangedView selected={type === 'server'} style={{width:'22%', marginRight: '0.5%'}}>
          <ServerMgmtSidebar />
        </ChangedView>
      </div>
    }
  </>
}

const Settings = () => {
  const [category, setCategory] = useState<settingsCategoryType>('account')
  return (
    <Container>
      <Header>
        <CategoryBtn selected={category === 'account'} onClick={() => {
          setCategory('account')
        }}>
          계정 설정
        </CategoryBtn>
        <CategoryBtn selected={category === 'vms'} onClick={() => {
          setCategory('vms')
        }}>
          VMS 설정
        </CategoryBtn>
        <CategoryBtn selected={category === 'omeye'} onClick={() => {
          setCategory('omeye')
        }}>
          OMEYE 설정
        </CategoryBtn>
        <CategoryBtn selected={category === 'server'} onClick={() => {
          setCategory('server')
        }}>
          서버 관리
        </CategoryBtn>
      </Header>
      <Contents>
        <ViewByCategory type={category} />
      </Contents>
    </Container>
  )
}

export default Settings

const Container = styled.div`
    ${globalStyles.flex({ gap: '12px' })}
    height: 100%;
    width: 100%;
    padding: 12px 24px;
`

const Header = styled.div`
    width: 100%;
    height: 40px;
    position: relative;
    ${globalStyles.flex({ flexDirection: 'row', gap: '12px' })}
`

const CategoryBtn = styled.div<{ selected: boolean }>`
    padding: 8px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    color: ${({ selected }) => selected ? TextActivateColor : 'white'}
`

const AllExportBtn = styled(Button)`
    position: absolute;
    height: 100%;
    right: 0px;
    top: 0px;
`

const Contents = styled.div`
    width: 100%;
    height: calc(100% - 52px);
`

const ChangedView = styled.div<{ selected: boolean }>`
    width: 100%;
    height: 100%;
    display: ${({ selected }) => selected ? 'block' : 'none'};
    ${globalStyles.fadeOut()}
    padding: 24px;
    border-radius: 10px;
    background-color: ${SectionBackgroundColor};
    overflow: auto;
`