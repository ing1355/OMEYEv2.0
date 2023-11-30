import styled from "styled-components"
import Button from "../../../Constants/Button"
import Dropdown from "../../../Layout/Dropdown"
import serverRebootIcon from "../../../../assets/img/serverRebootIcon.png"
import { ButtonBorderColor, GlobalBackgroundColor, InputBackgroundColor, TextActivateColor, globalStyles } from "../../../../styles/global-styled";
import { Axios } from "../../../../Functions/NetworkFunctions";
import { StorageMgmtApi, StorageThreshHoldApi, modelFileUploadApi, serverControlApi, serverLogFilesDownloadApi, serverRebootApi } from "../../../../Constants/ApiRoutes";
import Input from "../../../Constants/Input";
import clearIcon from '../../../../assets/img/rankUpIcon.png'
import { OnlyInputNumberFun, convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions";
import { useEffect, useState } from "react";
import TimeModal, { TimeModalDataType } from "../../../ReID/Condition/Constants/TimeModal";
import Modal from "../../../Layout/Modal";
import useMessage from "../../../../Hooks/useMessage";
import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import moment from 'moment';
import uploadIcon from "../../../../assets/img/uploadIcon.png"
import downloadIcon from "../../../../assets/img/downloadIcon.png"

// const ServerControlDropdownList = [
//   {
//     key: 'detect2',
//     value: 'detect2',
//     label: 'detect2'
//   }, 
//   {
//     key: 'main2',
//     value: 'main2',
//     label: 'main2'
//   },  
//   {
//     key: 'rt2',
//     value: 'rt2',
//     label: 'rt2'
//   },  
//   {
//     key: 'reid2',
//     value: 'reid2',
//     label: 'reid2'
//   },
//   {
//     key: 'mediaserver',
//     value: 'mediaserver',
//     label: 'mediaserver'
//   },
// ];

const ServerControlDropdownList = [
  {
    key: 'detect',
    value: 'detect',
    label: 'detect'
  }, 
  {
    key: 'main',
    value: 'main',
    label: 'main'
  },  
  {
    key: 'rt',
    value: 'rt',
    label: 'rt'
  },  
  {
    key: 'back',
    value: 'back',
    label: 'back'
  },
  {
    key: 'mediaserver',
    value: 'mediaserver',
    label: 'mediaserver'
  },
];

const logFileDownloadList = [
  {
    key: 'BE',
    value: 'BE',
    label: '백엔드'
  }, 
  {
    key: 'AI',
    value: 'AI',
    label: 'AI'
  },
];

type commandType = 'start' | 'stop' | 'restart';
type logFileType = 'BE' | 'AI';
type dateType = {
  startDate: string,
  endDate: string,
}

type GetStorageThreshHoldType = {
  threshold: number
}

const dateInit = {
  startDate: '',
  endDate: ''
}

type GetStorageDataType = {
  avail: string;
  availPercent: number;
  used: string;
}

const ServerMgmtSidebar = () => {
  const [timeValue, setTimeValue] = useState<TimeModalDataType | undefined>(undefined);
  const [timeVisible, setTimeVisible] = useState(false);
  const [isOpenRebootModal, setIsOpenRebootModal] = useState<boolean>(false);
  const [isOpenCtrlModal, setIsOpenCtrlModal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('detect2');
  const [isServiceControlling, setIsServiceControlling] = useState<boolean>(false);
  const [serviceCommand, setServiceCommand] = useState<commandType | undefined>(undefined);
  const [selectedLogFile, setSelectedLogFile] = useState<logFileType>('BE');
  const [logFileDate, setLogFileDate] = useState<dateType | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [storageThreshHold, setStorageThreshHold] = useState<number>(0);
  const [deleteStoragePercent, setDeleteStoragePercent] = useState<number>(0);
  const [deleteStorageDate, setDeleteStorageDate] = useState<dateType>(dateInit);
  const [storageData, setStorageData] = useState<GetStorageDataType | undefined>(undefined);

  const message = useMessage();

  const serverRebootFun = async () => {
    const res = await Axios('POST', serverRebootApi,{
      priority: 0,
      schedule: '',
    }, true)
    if(res !== undefined) {
      if (res.data.success) {
        message.success({ title: '서버 재부팅', msg: '서버 재부팅에 성공했습니다' })
      } else {
        message.error({ title: '서버 재부팅 에러', msg: '서버 재부팅에 실패했습니다' })
      }
    } else {
      message.error({ title: '서버 재부팅 에러', msg: '서버 재부팅에 실패했습니다' })
    }
  }

  const serverCtrlFun = async () => {
    setIsOpenCtrlModal(false);

    if(selectedService === 'back' && serviceCommand === 'stop') {
      message.error({ title: '서비스 제어 에러', msg: 'back 서비스는 중지할 수 없습니다' })
    } else if(selectedService === 'back' && serviceCommand === 'restart') {
      message.error({ title: '서비스 제어 에러', msg: 'back 서비스는 재시작할 수 없습니다' })
    } else {
      const res = await Axios('POST', serverControlApi,{
        serviceCtrl: [{
          command: serviceCommand,
          serviceType: selectedService,
        }]
      }, true)
      
      if(res !== undefined) {
        if (res.data.success) {
          message.success({ title: '서비스 제어', msg: '서비스 제어에 성공했습니다' })
        } else {
          message.error({ title: '서비스 제어', msg: '서비스 제어에 실패했습니다' })
        }
      } else {
        message.error({ title: '서비스 제어', msg: '서비스 제어에 실패했습니다' })
      }
    }
  }

  function checkValidDate(value: string) {
    let result = true;
    try {
        let date = value.split("-");
        let y = parseInt(date[0], 10),
            m = parseInt(date[1], 10),
            d = parseInt(date[2], 10);
        
        let dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
        result = dateRegex.test(d+'-'+m+'-'+y);
    } catch (err) {
      result = false;
    }    
      return result;
  }

  const isNumeric = (value: string) => {
    // 숫자 여부를 확인하는 정규 표현식 사용
    return /^[0-9]+$/.test(value);
  };

  const logFileDownloadFun = async () => {
    isNumeric(startDate)
    if(!(isNumeric(startDate) && isNumeric(endDate))) {
      message.error({ title: '로그 파일 날짜 입력 에러', msg: '숫자로 입력해주세요' })
    } else if(!(startDate.length === 8 && endDate.length === 8)) {
      message.error({ title: '로그 파일 날짜 입력 에러', msg: '8자리로 입력해주세요' })
    } else {
      setStartDate('');
      setEndDate('');

      const res = await Axios('POST', serverLogFilesDownloadApi,{
        logData: [{
          logType: selectedLogFile,
          logDate: {
            startDate: startDate,
            endDate: endDate
          }
        }]
      }, true)

      if (res.status === 204) {
        message.error({ title: '로그 파일 다운로드', msg: '해당 날짜의 로그 파일이 없습니다' })
      } else {
        const versionName = res.headers['content-disposition'].split(';').filter((str:any) => str.includes('filename'))[0].match(/filename="([^"]+)"/)[1];
        const fileDownlaoadUrl = URL.createObjectURL(res.data);
        const downloadLink = document.createElement('a');
        downloadLink.href = fileDownlaoadUrl;
        downloadLink.download = versionName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(fileDownlaoadUrl);
      }
    }
  }

  const modelUploadFun = async (file: any) => {
    const res = await Axios('POST', modelFileUploadApi, {
      modelFile: file,
      fileName: fileName
    }, true);

    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: '모델 파일 업로드', msg: '모델 파일 업로드에 성공했습니다' })
        setFileName('');
      } else {
        message.error({ title: '모델 파일 업로드', msg: '모델 파일 업로드에 실패했습니다' })
        setFileName('');
      }
    } else {
      message.error({ title: '모델 파일 업로드', msg: '모델 파일 업로드에 실패했습니다' })
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

  const GetStorageThreshHoldFun = async () => {
    const res:GetStorageThreshHoldType = await Axios('GET', StorageThreshHoldApi)
    if(res) setStorageThreshHold(res.threshold);
  }

  const SaveStorageThreshHoldFun = async () => {
    const res = await Axios('PUT', StorageThreshHoldApi, {
      threshold: storageThreshHold
    }, true)
    if(res !== undefined) {
      if (res.data.success) {
        message.success({ title: '알림 기준 저장공간 사용량 설정', msg: '수정에 성공했습니다' })
        GetStorageThreshHoldFun();
      } else {
        message.error({ title: '알림 기준 저장공간 사용량 설정 에러', msg: '수정에 실패했습니다' })
        GetStorageThreshHoldFun();
      }
    } else {
      message.error({ title: '알림 기준 저장공간 사용량 설정 에러', msg: '수정에 실패했습니다' })
      GetStorageThreshHoldFun();
    }
  }

  const DeleteStorageFun = async (type: string) => {
    const percentPayload = {
      percent: deleteStoragePercent
    }

    const datePayload = {
      from: deleteStorageDate.startDate,
      to: deleteStorageDate.endDate
    }

    const res = await Axios('DELETE', StorageMgmtApi, (type === 'percent' ? percentPayload : datePayload))
    if(type === 'percent') setDeleteStoragePercent(0);
    if(type === 'date') setDeleteStorageDate(dateInit);

    if(res) {
      message.success({ title: '저장공간 정리', msg: '저장공간을 정리했습니다' })
      GetStorageDataFun();
    } else {
      message.error({ title: '저장공간 정리 에러', msg: '저장공간 정리에 실패했습니다' })
    }
    // if(res !== undefined) {
    //   if (res.data.success) {
    //     message.success({ title: '알림 기준 저장공간 사용량 설정', msg: '수정에 성공했습니다' })
    //   } else {
    //     message.error({ title: '알림 기준 저장공간 사용량 설정 에러', msg: '수정에 실패했습니다' })
    //   }
    // } else {
    //   message.error({ title: '알림 기준 저장공간 사용량 설정 에러', msg: '수정에 실패했습니다' })
    // }
  }

  const GetStorageDataFun = async () => {
    const res:GetStorageDataType = await Axios('GET', StorageMgmtApi)
    if(res) setStorageData(res);
  }

  useEffect(() => {
    GetStorageThreshHoldFun();
    GetStorageDataFun();
  },[])

  return (
    <div>
      <div style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px'}}>제어</div>
      <div style={{display: 'flex', marginBottom: '25px'}}>
        <div style={{lineHeight: '35px', fontSize: '1.1rem'}}>서버 재부팅</div>
        <ServerControlButton 
          icon={serverRebootIcon}
          onClick={() => {
            setIsOpenRebootModal(true);
          }}
        >
        </ServerControlButton>
      </div>
      <div style={{marginBottom: '35px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap'}}>
          <div style={{lineHeight: '35px', fontSize: '1.1rem'}}>서비스 제어</div>
          <div>
            <ServerControlButton
              onClick={() => {
                setIsOpenCtrlModal(true);
                setServiceCommand('start');
              }}
            >
              시작
            </ServerControlButton>
            <ServerControlButton
              onClick={() => {
                setIsOpenCtrlModal(true);
                setServiceCommand('stop');
              }}
            >
              종료
            </ServerControlButton>
            <ServerControlButton
              onClick={() => {
                setIsOpenCtrlModal(true);
                setServiceCommand('restart');
              }}
            >
              재시작
            </ServerControlButton>
          </div>
        </div>
        <div>
          <ServerControlDropdown 
            itemList={ServerControlDropdownList} 
            bodyStyle={{backgroundColor: `${InputBackgroundColor}`, zIndex: 1}}
            onChange={val => {
              setSelectedService(val.value as string);
            }}
          />
        </div>
      </div>
      <div style={{marginBottom: '35px', lineHeight: '35px'}}>
        <div style={{marginBottom: '10px', fontSize: '1.1rem'}}>로그 파일 다운로드</div>
        <div style={{marginBottom: '10px'}}>
          {/* <DateSearch onClick={() => {
              setTimeVisible(true)
          }}>
              {timeValue ? `${convertFullTimeStringToHumanTimeFormat(timeValue.startTime)} ~ ${convertFullTimeStringToHumanTimeFormat(timeValue.endTime!)}` : '시간을 입력해주세요.'}
              {timeValue && <ClearBtnContainer onClick={e => {
                  e.stopPropagation()
                  setTimeValue(undefined)
              }}>
                  <ClearBtn src={clearIcon}/>
              </ClearBtnContainer>}
          </DateSearch> */}
          {/* <RangePicker 
            value={logFileDate && [moment(logFileDate?.startDate),moment(logFileDate?.endDate)]} 
            onChange={dateChangeFun} 
            style={{width: '300px'}}
          /> */}
          <div style={{marginBottom: '10px'}}>
            <span style={{marginRight: '10px'}}>
              시작 날짜:
            </span>
            <DateInput 
              placeholder="YYYYMMDD" 
              maxLength={8}
              value={startDate}
              onChange={(e) => {
                const date = OnlyInputNumberFun(e);
                setStartDate(date);
              }}
            />
          </div>
          <div>
            <span style={{marginRight: '10px'}}>
              종료 날짜:
            </span>
            <DateInput 
              placeholder="YYYYMMDD" 
              maxLength={8}
              value={endDate}
              onChange={(e) => {
                const date = OnlyInputNumberFun(e);
                setEndDate(date);
              }}
            />
          </div>          
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
          <div style={{width: '300px'}}>
            <ServerControlDropdown 
              itemList={logFileDownloadList}
              bodyStyle={{backgroundColor: `${InputBackgroundColor}`, zIndex: 1}}
              onChange={val => {
                setSelectedLogFile(val.value as logFileType);
              }}
            />
          </div>
          <div>
            <UploadDownloadButton
              onClick={logFileDownloadFun}
              icon={downloadIcon}
              iconStyle={{width: '15px', height: '15px'}}
            >
              다운로드
            </UploadDownloadButton>
          </div>
        </div>
      </div>

      {/* <TimeModal visible={timeVisible} close={() => {
        setTimeVisible(false)
      }} defaultValue={timeValue} onChange={setTimeValue} title="검색 시간" /> */}

      <div style={{marginBottom: '35px', lineHeight: '35px'}}>
        <div style={{marginBottom: '10px', fontSize: '1.1rem'}}>모델 파일 업로드</div>
        <div>
          <form
            id='fileUpload'
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const { uploadFile } = (e.currentTarget.elements as any);
              const file = uploadFile.files[0];
              const fileExtension = file?.name.split('.').pop();
              const isFileExtensionPth = fileExtension === 'pth' || fileExtension === 'pt';

              if(!file) return message.error({ title: '모델 파일 업로드 에러', msg: '파일을 다시 업로드해주세요' })
              modelUploadFun(file);
              // if(!isFileExtensionPth) {
              //   message.error({ title: '모델 파일 업로드 에러', msg: '파일 형식이 올바르지 않습니다' })
              // }
              // modelUploadFun(file);
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap'}}>
              <div style={{lineHeight: '35px'}}>
                <label 
                  htmlFor='uploadFile'
                  style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px'}}
                >
                  파일 선택
                </label>
                <input
                  id='uploadFile'
                  type='file'
                  accept='.pth, .pt'
                  hidden
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <UploadDownloadButton 
                  hover
                  type='submit'
                  form='fileUpload'
                  icon={uploadIcon}
                  iconStyle={{width: '15px', height: '15px'}}
                >
                  업로드
                </UploadDownloadButton>
              </div>
            </div>              
            <div style={{lineHeight: '30px', wordWrap: 'break-word', marginTop: '10px' }}>
              {fileName}
            </div>
          </form>
        </div>
      </div>
      <div style={{marginBottom: '25px', lineHeight: '30px'}}>
        <div style={{marginBottom: '10px', fontSize: '1.1rem'}}>저장공간 관리</div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', marginBottom: '10px', padding: '10px'}}>
          <div>총 저장공간:
            <span style={{marginLeft: '10px'}}>
            {storageData?.used &&
              storageData?.avail &&
              (
                parseInt(storageData.used.split(" ")[0]) +
                parseInt(storageData.avail.split(" ")[0])
              ).toFixed(2)}{" "}
              {storageData && storageData.avail.split(" ")[1]}
            </span>
          </div>
          <div>잔여 저장공간: 
            <span style={{marginLeft: '10px'}}>
              {storageData?.avail &&
                parseInt(storageData.avail.split(" ")[0]).toFixed(2)}{" "}
              {storageData?.avail && storageData.avail.split(" ")[1]}
            </span>
          </div>
          <div>사용 저장공간: 
            <span style={{marginLeft: '10px'}}>
              {storageData?.used &&
                parseInt(storageData.used.split(" ")[0]).toFixed(2)}{" "}
              {storageData?.used && storageData.used.split(" ")[1]}
            </span>
          </div>
          <div>저장 공간 사용량: 
            <span style={{marginLeft: '10px'}}>
              {100 - storageData?.availPercent!} %
            </span>
          </div>
        </div>
        <div style={{display: 'flex', marginBottom: '10px', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          <div style={{marginRight: '10px', lineHeight: '35px'}}>
            알림 기준 저장공간 사용량 설정 (%) 
          </div>
          <div>
            <StorageInput 
              maxLength={3}
              value={storageThreshHold ? storageThreshHold : 0} 
              onChange={(e) => {
                const num = OnlyInputNumberFun(e);
                setStorageThreshHold(parseInt(num));
              }}
            />
            <ServerControlButton
              onClick={() => {
                if(storageThreshHold > 100) {
                  return message.error({ title: '저장공간 사용량 설정 에러', msg: '100 이하로 입력해주세요' })
                } 
                SaveStorageThreshHoldFun()
              }}
            >
              설정
            </ServerControlButton>
          </div>
        </div>
        <div style={{display: 'flex', marginBottom: '10px', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          <div style={{marginRight: '10px', lineHeight: '35px'}}>용량 기준으로 정리하기 (%)</div>
          <div>
            <StorageInput 
              maxLength={3}
              value={deleteStoragePercent ? deleteStoragePercent : 0} 
              onChange={(e) => {
                const num = OnlyInputNumberFun(e);
                setDeleteStoragePercent(parseInt(num));
              }}
            />
            <ServerControlButton
              onClick={() => {
                if(deleteStoragePercent > 100) {
                  return message.error({ title: '용량 정리하기 에러', msg: '100 이하로 입력해주세요' })
                } else if(deleteStoragePercent > 100-storageData?.availPercent!) {
                  return message.error({ title: '용량 정리하기 에러', msg: '저장 공간 사용량 이하로 입력해주세요' })
                }
                DeleteStorageFun('percent')
              }}
            >
              정리
            </ServerControlButton>
          </div>
        </div>
        <div>
          <div style={{marginBottom: '10px', display: 'flex'}}>
            <div style={{lineHeight: '35px'}}>날짜 기준으로 정리하기</div>
            <div>
              <ServerControlButton
                onClick={() => {
                  DeleteStorageFun('date')
                }}
              >
                정리
              </ServerControlButton>
            </div>
          </div>
          <div style={{marginBottom: '10px', marginLeft: '20px'}}>
            <span style={{marginRight: '10px'}}>
              시작 날짜:
            </span>
            <DateInput 
              placeholder="YYYYMMDD" 
              maxLength={8}
              value={deleteStorageDate.startDate}
              onChange={(e) => {
                const startDate = OnlyInputNumberFun(e)
                setDeleteStorageDate((pre) => ({
                  ...pre,
                  startDate
                }))
              }}
            />
          </div>
          <div style={{marginLeft: '20px'}}>
            <span style={{marginRight: '10px'}}>
              종료 날짜:
            </span>
            <DateInput 
              placeholder="YYYYMMDD" 
              maxLength={8}
              value={deleteStorageDate.endDate}
              onChange={(e) => {
                const endDate = OnlyInputNumberFun(e)
                setDeleteStorageDate((pre) => ({
                  ...pre,
                  endDate
                }))
              }}
            />
          </div> 
        </div>
      </div>

      <Modal 
        visible={isOpenRebootModal}
        close={() => {
          setIsOpenRebootModal(false);
        }}
        title="서버 재부팅"
        noFooter={true}
      >
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%', textAlign: 'center'}}>
          <div style={{margin: '30px 0px'}}>서버를 재부팅하시겠습니까?</div>
          <div>
            <ModalButton 
              hover
              onClick={serverRebootFun}
            >
              재부팅
            </ModalButton>
            <ModalButton 
              hover
              onClick={() => {
                setIsOpenRebootModal(false);
              }}
            >
              취소
            </ModalButton>
          </div>
        </div>
      </Modal>
      <Modal 
        visible={isOpenCtrlModal}
        close={() => {
          setIsOpenCtrlModal(false);
        }}
        title="서비스 제어"
        noFooter={true}
      >
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%', textAlign: 'center'}}>
          {serviceCommand === 'start' && <div style={{margin: '30px 0px'}}>서비스를 시작하시겠습니까?</div>}
          {serviceCommand === 'stop' && <div style={{margin: '30px 0px'}}>서비스를 중지하시겠습니까?</div>}
          {serviceCommand === 'restart' && <div style={{margin: '30px 0px'}}>서비스를 재시작하시겠습니까?</div>}

          <div>
            <ModalButton 
              hover
              onClick={serverCtrlFun}
            >
              {serviceCommand === 'start' && <>시작</>}
              {serviceCommand === 'stop' && <>중지</>}
              {serviceCommand === 'restart' && <>재시작</>}
            </ModalButton>
            <ModalButton 
              hover
              onClick={() => {
                setIsOpenCtrlModal(false);
              }}
            >
              취소
            </ModalButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ServerMgmtSidebar

const ServerControlButton = styled(Button)`
  height: 35px;
  margin-left: 10px;
`

const UploadDownloadButton = styled(Button)`
  height: 35px;
`

const ServerControlDropdown = styled(Dropdown)`
  height: 35px;
  width: 100%;
`

const DateSearch = styled.div`
    color: white;
    border-radius: 10px;
    padding: 4px 12px;
    height: 100%;
    ${globalStyles.flex()}
    width: 100%;
    cursor: pointer;
    background-color: ${GlobalBackgroundColor};
    position: relative;
`

const ClearBtnContainer = styled.div`
    position: absolute;
    top: 50%;
    width: 36px;
    height: 36px;
    right: 0px;
    padding: 8px;
    transform: translateY(-50%);
    border-radius: 50%;
    &:hover {
        border: 1px solid ${TextActivateColor};
    }
`

const ClearBtn = styled.img`
    width: 100%;
    height: 100%;
    transform: rotateZ(45deg);
`

const ModalButton = styled(Button)`
  height: 30px;
  margin: 0 4px;
`

const DateInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  color: white;
`

const StorageInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  color: white;
  width: 60px;
`