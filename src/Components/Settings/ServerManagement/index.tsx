import { useEffect, useState } from "react";
import { ButtonBackgroundColor, ButtonBorderColor, InputBackgroundColor } from "../../../styles/global-styled";
import { serverMgmtInfoApi } from "../../../Constants/ApiRoutes";
import { CustomEventSource } from "../../../Constants/GlobalConstantsValues";

type serviceType = 'detect' | 'main' | 'reid' | 'rt' | 'selective' | 'mediaserver' | '';

type GetSSEServerMgmtInfoType = {
  serverInfo: serverInfoType,
  serviceStatus: serviceStatusType[],
  omeyeVersion: omeyeVersionType,
  cpu: CPUType,
  gpu: GPUType[],
  memory: memoryType,
  disk: diskType,
  networkBandwidth: networkBandwidthType,
  time: string,
}

type serverInfoType = {
  uptime: string,
  network: networkType,
}

type networkType = {
  iface: string,
  ip: string,
  netmask: string,
  gateway: string,
  dns: string,
}

type serviceStatusType = {
  serviceName: string,
  serviceStatus: string,
}

type omeyeVersionType = {
  FE: string,
  BE: string,
  AI: string,
}

type CPUType = {
  use: number
}

type GPUType = {
  id: number,
  use: number
}

type memoryType = {
  total: string,
  used: string,
}

type diskType = {
  total: string,
  use: string,
}

type networkBandwidthType = {
  total: string,
  uplink: string,
  downlink: string,
}

const servicesName = [
  'detect',
  'main',
  'rt',
  'selective',
  'reid',
  'mediaserver',
];

const aiServicesName = [  
  'detect',
  'main',
  'selective',
  'rt',
];

let sse: EventSource | null;

const ServerManagement = () => {
  const [serverMgmtInfo, setSeverMgmtInfo] = useState<GetSSEServerMgmtInfoType | null>(null);

  function serviceStatusDiv(serviceName: serviceType) {
    const isService = serverMgmtInfo?.serviceStatus.find(item => item.serviceName.split('.')[1] === serviceName);
    const service = isService?.serviceName;
    const serviceStatus = isService?.serviceStatus;

    return (
      <div style={{display: 'flex'}}>
        <div>{serviceName} </div>
        <div>
          {(serviceStatus === 'active' || serviceStatus === 'activating') && 
            <div style={{backgroundColor: '#42633b', border: '1px solid #44b42b', borderRadius: '10px', marginLeft: '10px', padding: '0 10px'}}>
              {serviceStatus}
            </div>
          }
          {(serviceStatus === 'inactive') && 
            <div style={{backgroundColor: '#726a22', border: '1px solid #ffe600', borderRadius: '10px', marginLeft: '10px', padding: '0 10px'}}>
              {serviceStatus}
            </div>
          } 
          {(serviceStatus === 'deactivating') && 
            <div style={{backgroundColor: '#704223', border: '1px solid #ff7f00', borderRadius: '10px', marginLeft: '10px', padding: '0 10px'}}>
              {serviceStatus}
            </div>
          }   
          {(serviceStatus === 'failed') && 
            <div style={{backgroundColor: '#6b2424', border: '1px solid #bc0000', borderRadius: '10px', marginLeft: '10px', padding: '0 10px'}}>
              {serviceStatus}
            </div>
          }       
        </div>
      </div>
    )
  }

  function uptimeDataFun(uptime: string | undefined) {
    let [days, time] = ['', ''];

    if(uptime) {
      [days, time] = uptime.split('-');
    }

    return (
      <>
        <span>
          {days} days {time}
        </span>
      </>
    )
  }

  useEffect(() => {
    if(sse) {
      sse.close();
    }

    sse = CustomEventSource(serverMgmtInfoApi);

    sse.onopen = () => {
      console.log('server mgmt sse open');
    }

    sse.onmessage = (res: MessageEvent) => {
      const response = JSON.parse(res.data);
      console.log('response', response);
      const { serverInfo, serviceStatus, omeyeVersion, cpu, gpu, memory, disk, networkBandwidth, time } = response as GetSSEServerMgmtInfoType;
      setSeverMgmtInfo(response);
    }

    sse.onerror = (e: any) => {
      e.target.close();
      console.log('server mgmt sse error');
    }
  },[])

  return (
    <div>
      <div style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px'}}>모니터링</div>
      <div style={{display: 'flex', gap: '10px', justifyContent: 'space-between', marginBottom: '15px'}}>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '46%', padding: '10px'}}>
          <div style={{marginBottom: '10px'}}>서비스 정보</div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{width: '30%', backgroundColor: `${InputBackgroundColor}`}}>
              <div style={{backgroundColor: `${ButtonBackgroundColor}`, textAlign: 'center', margin: '5px', borderRadius: '4px', padding: '3px'}}>
                AI
              </div>
              <div>
                {aiServicesName.map((data, index) => {
                  return (
                    <div
                      key={'aiServicesName' + index} 
                      style={{margin: '10px'}}>
                      {serviceStatusDiv(data as serviceType)}
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{width: '30%', backgroundColor: `${InputBackgroundColor}`}}>
              <div style={{backgroundColor: `${ButtonBackgroundColor}`, textAlign: 'center', margin: '5px', borderRadius: '4px', padding: '3px'}}>
                백엔드
              </div>
              <div style={{margin: '10px'}}>
                {serviceStatusDiv('reid' as serviceType)}
              </div>
            </div>
            <div style={{width: '30%', backgroundColor: `${InputBackgroundColor}`}}>
              <div style={{backgroundColor: `${ButtonBackgroundColor}`, textAlign: 'center', margin: '5px', borderRadius: '4px', padding: '3px'}}>
                미디어 서버
              </div>
              <div style={{margin: '10px'}}>
                {serviceStatusDiv('mediaserver' as serviceType)}
              </div>
            </div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%', padding: '15px'}}>
          <div style={{marginBottom: '10px'}}>서버 정보</div>
          <div>
            <div style={{padding: '10px'}}>프론트엔드: {process.env.REACT_APP_VERSION}</div>
            <div style={{padding: '10px'}}>백엔드: {serverMgmtInfo?.omeyeVersion.BE}</div>
            <div style={{padding: '10px'}}>AI: {serverMgmtInfo?.omeyeVersion.AI}</div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%', padding: '15px'}}>
          <div style={{marginBottom: '10px'}}>네트워크 정보</div>
          <div>
            <div style={{padding: '10px'}}>interface name: {serverMgmtInfo?.serverInfo.network.iface}</div>
            <div style={{padding: '10px'}}>netmask: {serverMgmtInfo?.serverInfo.network.netmask}</div>
            <div style={{padding: '10px'}}>gateway: {serverMgmtInfo?.serverInfo.network.gateway}</div>
            <div style={{padding: '10px'}}>ip: {serverMgmtInfo?.serverInfo.network.ip}</div>
            <div style={{padding: '10px'}}>dns: {serverMgmtInfo?.serverInfo.network.dns}</div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%', padding: '15px'}}>
          <div style={{marginBottom: '10px'}}>기타 정보</div>
          <div>
            <div style={{padding: '10px'}}>uptime: {uptimeDataFun(serverMgmtInfo?.serverInfo.uptime)}</div>
          </div>
        </div>
      </div>

      <div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>GPU</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>memory</div>
            <div>
              <div></div>
              <div></div>
            </div>            
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>disk</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>network bandwidth</div>
            <div>
              <div></div>
              <div></div>
            </div>            
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>disk</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ServerManagement;