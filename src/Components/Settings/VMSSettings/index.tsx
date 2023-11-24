import styled from "styled-components"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"
import Dropdown, { DropdownItemType } from "../../Layout/Dropdown"
import { useEffect, useState } from "react"
import { Axios, GetAllSitesData } from "../../../Functions/NetworkFunctions"
import { GetVmsInfoApi, GetVmsListApi, PutVmsInfoApi, SyncVmsApi, VmsExcelUploadApi } from "../../../Constants/ApiRoutes"
import { InputBackgroundColor } from "../../../styles/global-styled"
import useMessage from "../../../Hooks/useMessage"
import { SitesState } from "../../../Model/SiteDataModel"
import { useRecoilState } from "recoil"

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
  installSite: string;
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
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [sitesState, setSitesState] = useRecoilState(SitesState);
  const message = useMessage();

  const GetVmsList = async () => {
    const res:getVmsListType = await Axios('GET', GetVmsListApi)
    if (res) {
      setVmsList(res.siteList);
      VmsDropdownListFun(res.siteList);
    } else {
      message.error({ title: 'vms 설정 사이트 리스트', msg: 'vms 설정 사이트 정보를 가져오지 못했습니다' })
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
      // console.log('res', res);
      const resTemp = {...res, installSite: selectedSiteName}
      setVmsInfo(resTemp);
    }
  }

  const PutVmsInfoFun = async () => {
    const res = await Axios('PUT', PutVmsInfoApi, vmsInfo, true);

    if(res.data.success) {
      message.success({ title: '사이트 정보 수정', msg: '사이트 정보 수정에 성공했습니다' })
    } else {
      message.error({ title: '사이트 정보 수정 에러', msg: '사이트 정보 수정에 실패했습니다' })
    }
    GetVmsInfoFun()
  }

  const VmsExcelUploadFun = async (file: any) => {
    const res = await Axios('POST', VmsExcelUploadApi, {
      file: file,
      installSite: selectedSiteName
    }, true);

    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: '엑셀 파일 업로드', msg: '엑셀 파일 업로드에 성공했습니다' })
        setFileName('');
      } else {
        message.error({ title: '엑셀 파일 업로드 에러', msg: '엑셀 파일 업로드에 실패했습니다' })
        setFileName('');
      }
    } else {
      message.error({ title: '엑셀 파일 업로드 에러', msg: '엑셀 파일 업로드에 실패했습니다' })
      setFileName('');
    }
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName('');
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const name = fileInput.files[0].name;
      setFileName(name);
    }
  };

  const SyncVmsApiFun = async () => {
    const res = await Axios('GET', SyncVmsApi,{},true)
    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: '동기화', msg: '동기화에 성공했습니다' })
        GetAllSitesData().then(res => {
          setSitesState({
              state: 'IDLE',
              data: res
          })
        })
      } else {
        message.error({ title: '동기화 에러', msg: '동기화에 실패했습니다' })
      }
    } else {
      message.error({ title: '동기화 에러', msg: '동기화에 실패했습니다' })
    }
  }

  useEffect(() => {
    GetVmsList();
  },[])

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', lineHeight: '30px'}}>사이트 이름</div>
        <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
          <SiteDropdown 
            itemList={vmsDropdownList}
            bodyStyle={{backgroundColor: `${InputBackgroundColor}`, zIndex: 1, width: '120px'}}
            onChange={val => {
              setSelectedSiteName(val.value as string);
            }}
          />
          <div>
            <VMSButton 
              hover
              onClick={GetVmsInfoFun}
            >
              조회
            </VMSButton>
          </div>
          {vmsInfo &&
            <div>
              <VMSButton 
                hover
                onClick={PutVmsInfoFun}
              >
                저장
              </VMSButton>
            </div>
          }
        </div>
      </div>

      {vmsInfo ?
        <>
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>VMS 타입</div>
            <div style={{lineHeight: '30px'}}>{vmsInfo.vmsType}</div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>API 서버 IP</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {vmsInfo.vmsServerIp.map((data, index) => (
                <IPInput 
                  key={'vurix_vmsServerIp' + index}
                  value={data}
                  onChange={(e) => {
                    const ipTemp = [...vmsInfo.vmsServerIp];
                    ipTemp[index] = e;

                    setVmsInfo((pre) => ({
                      ...pre!,
                      vmsServerIp: ipTemp,
                    }))
                  }}
                />
              ))}
            </div>
            <div style={{marginLeft: '15px'}}>
              <VMSButton 
                hover
                onClick={() => {
                  setVmsInfo((pre) => ({
                    ...pre!,
                    vmsServerIp: vmsInfo.vmsServerIp.concat('')
                  }))
                }}
              >
                추가
              </VMSButton>
            </div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>ID</div>
            <SiteInput 
              value={vmsInfo.vmsId} 
              onChange={(e) => {
                setVmsInfo((pre) => ({
                  ...pre!,
                  vmsId: e
                }))
              }}
            />
          </div>     
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>PW</div>
            <SiteInput 
              value={vmsInfo.vmsPw}
              onChange={(e) => {
                setVmsInfo((pre) => ({
                  ...pre!,
                  vmsPw: e
                }))
              }}
            />
          </div> 
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>최대 저장 기간</div>
            <SiteInput 
              value={vmsInfo.maxStoredDay}
              onChange={(e) => {
                setVmsInfo((pre) => ({
                  ...pre!,
                  maxStoredDay: parseInt(e)
                }))
              }}                  
            />
          </div> 

         {vmsInfo?.vmsType === 'vurix' &&
            <>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>그룹 ID</div>
                <SiteInput 
                  value={vmsInfo.vmsGroup}
                  onChange={(e) => {
                    setVmsInfo((pre) => ({
                      ...pre!,
                      vmsGroup: e
                    }))
                  }}        
                />
              </div>
              <div style={{display: 'flex'}}>
                <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>라이센스</div>
                <SiteInput 
                  maxLength={48}
                  value={vmsInfo.vmsLic}
                  onChange={(e) => {
                    setVmsInfo((pre) => ({
                      ...pre!,
                      vmsLic: e
                    }))
                  }} 
                />
              </div> 
            </>
          }
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>엑셀 업로드</div>
            <div>
              <form
                id='fileUpload'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { uploadFile } = (e.currentTarget.elements as any);
                  const file = uploadFile.files[0];
                  const fileExtension = file?.name.split('.').pop();
                  const isFileExtensionPth = fileExtension === 'xlsx';
                  if(!file) return message.error({ title: '엑셀 파일 업로드 에러', msg: '파일을 다시 업로드해주세요' })
                  if(!isFileExtensionPth) {
                     return message.error({ title: '엑셀 파일 업로드 에러', msg: '파일 형식이 올바르지 않습니다' })
                  } 

                  VmsExcelUploadFun(file);
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px'}}>
                  <div style={{lineHeight: '30px'}}>
                    <label 
                      htmlFor='uploadFile'
                      style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px'}}
                    >
                      파일 선택
                    </label>
                    <input
                      id='uploadFile'
                      type='file'
                      accept='.xlsx'
                      hidden
                      onChange={handleFileChange}
                    />
                  </div>
                  <div style={{lineHeight: '30px'}}>
                    {fileName}
                  </div>
                  <div>
                    <VMSButton 
                      hover
                      type='submit'
                      form='fileUpload'
                    >
                      업로드
                    </VMSButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{width: '9%', paddingLeft: '15px', lineHeight: '30px'}}>
              <div>동기화</div>
              {/* <div>아이콘</div> */}
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
                  <input type="checkbox" 
                    checked={isAgree} 
                    onChange={() => {setIsAgree(!isAgree)}}
                  />
                  예, 동의합니다. 
                </div>
                <VMSButton 
                  hover
                  onClick={() => {
                    if(!isAgree) {
                      message.error({ title: '동기화 에러', msg: '동기화 동의를 체크해주세요.' })
                    } else {
                      SyncVmsApiFun();
                    }
                  }}  
                >
                  동기화
                </VMSButton>
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

const IPInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 30px;
  color: white;
  width: 480px;
`

