import styled from "styled-components"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import Dropdown, { DropdownItemType } from "../../Layout/Dropdown"
import { useEffect, useState } from "react"
import { Axios } from "../../../Functions/NetworkFunctions"
import { GetVmsInfoApi, GetVmsListApi } from "../../../Constants/ApiRoutes"
import { InputBackgroundColor } from "../../../styles/global-styled"

type getVmsListType = {
  siteList: string[];
}

type vmsType = 'vurix' | 'milestone' | 'emstone' | 'naize';

const vurixKey = ['vmsType', 'vmsServerIp', 'vmsId', 'vmsPw', 'maxStoredDay'];
const exceptVurixKey = ['vmsType', 'vmsServerIp', 'vmsId', 'vmsPw', 'maxStoredDay', 'vmsGroup', 'vmsLic'];

type vmsInfoType = {
  vmsType: vmsType;
  vmsServerIp: string[];
  vmsId: string;
  vmsPw: string;
  maxStoredDay: number;
  vmsGroup: string;
  vmsLic: string;
}

const VMSSettings = () => {
  const [vmsList, setVmsList] = useState<string[]>([]);
  const [vmsDropdownList, setVmsDropdownList] = useState<DropdownItemType<string>[]>([{
    key: '',
    value: '',
    label: ''
  }]);
  const [selectedSiteName, setSelectedSiteName] = useState<string>('');
  const [vmsInfo, setVmsInfo] = useState<vmsInfoType | null>(null);
console.log('vmsInfo',vmsInfo)

  const GetVmsList = async () => {
    const res:getVmsListType = await Axios('GET', GetVmsListApi)
    if (res) {
      setVmsList(res.siteList);
      VmsDropdownListFun(res.siteList);
    }
  }

  const VmsDropdownListFun = (res: string[]) => {
    let vmsTemp = res.map((data) => ({
      key: data,
      value: data,
      label: data
    }))

    setVmsDropdownList(vmsTemp);
  }

  const GetVmsInfoFun = async () => {
    const res = await Axios('GET', GetVmsInfoApi(selectedSiteName))
    if (res) {
      console.log('res', res);
      setVmsInfo(res);
    }
  }

  useEffect(() => {
    GetVmsList();
  },[])

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%'}}>사이트 이름</div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <SiteDropdown 
            itemList={vmsDropdownList}
            bodyStyle={{backgroundColor: `${InputBackgroundColor}`, zIndex: 1, width: '120px'}}
            onChange={val => {
              setSelectedSiteName(val.value as string);
            }}
          />
          <VMSButton 
            hover
            onClick={GetVmsInfoFun}
          >
            확인
          </VMSButton>
        </div>

        {/* <SiteInput placeholder="사이트 이름을 입력해주세요."/> */}
        {/* <div style={{marginLeft: '15px'}}>
          <VMSButton hover>확인</VMSButton>
        </div> */}
      </div>

      {vmsInfo ?
        <>
         {vmsInfo?.vmsType === 'vurix' ?
            <>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>VMS 타입</div>
                <div>{vmsInfo.vmsType}</div>
              </div>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>API 서버 IP</div>
                {vmsInfo.vmsServerIp.map((data) => (
                  <SiteInput value={data}/>
                ))}
                <div style={{marginLeft: '15px'}}>
                  <VMSButton hover>추가</VMSButton>
                </div>
              </div>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>ID</div>
                <SiteInput value={vmsInfo.vmsId}/>
              </div>     
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>PW</div>
                <SiteInput value={vmsInfo.vmsPw}/>
              </div> 
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>최대 저장 기간</div>
                <SiteInput value={vmsInfo.maxStoredDay}/>
              </div> 
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>그룹 ID</div>
                <SiteInput value={vmsInfo.vmsGroup}/>
              </div>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>라이센스</div>
                <SiteInput value={vmsInfo.vmsLic}/>
              </div> 
            </>
          :
            <>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>VMS 타입</div>
                <div>{vmsInfo.vmsType}</div>
              </div>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>API 서버 IP</div>
                {vmsInfo.vmsServerIp.map((data) => (
                  <SiteInput value={data}/>
                ))}
                <div style={{marginLeft: '15px'}}>
                  <VMSButton hover>추가</VMSButton>
                </div>
              </div>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>ID</div>
                <SiteInput value={vmsInfo.vmsId}/>
              </div>     
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>PW</div>
                <SiteInput value={vmsInfo.vmsPw}/>
              </div>  
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px'}}>최대 저장 기간</div>
                <SiteInput value={vmsInfo.maxStoredDay}/>
              </div> 
            </>
          }
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px'}}>엑셀 업로드</div>
            <VMSButton hover>업로드</VMSButton>
            {/* <div>text.xsl</div> */}
          </div>
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px'}}>
              <div>동기화</div>
              <div>아이콘</div>
            </div>
            <div>
              연동될 VMS 내의 사이트 및 CCTV 정보를 원모어아이의 데이터베이스에 동기화하는 과정입니다. 
              <br />
              동기화하는 경우, 현재 진행하고 있는 서비스에 영향을 미칠 수 있습니다. 
              <br />
              동기화를 진행하시겠습니까?
              <br />
              <br />

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{marginBottom: '15px'}}>
                  <input type="checkbox" />
                  예, 동의합니다. 
                </div>
                <VMSButton hover>동기화</VMSButton>
              </div>
            </div>
          </div>
        </>
        :
        <></>
      }
     
    </div>
  )
}

export default VMSSettings

const SiteDropdown = styled(Dropdown)`
  height: 30px;
  width: 120px;
`

const SiteInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 480px;
  color: white;
  width: 500px;
`

const VMSButton = styled(Button)`
  height: 30px;
  width: 100px;
`

