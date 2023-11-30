import { useEffect, useRef, useState } from "react";
import { ButtonBackgroundColor, ButtonBorderColor, InputBackgroundColor } from "../../../styles/global-styled";
import { GetServerInfoApi, serverMgmtInfoApi } from "../../../Constants/ApiRoutes";
import { CustomEventSource } from "../../../Constants/GlobalConstantsValues";
import { Progress } from "antd";
import { LineChart } from "@mui/x-charts";
import { useRecoilState } from "recoil";
import { isLogin } from "../../../Model/LoginModel";
import { decodedJwtToken } from "../../Layout/Header/UserMenu";
import { Axios } from "../../../Functions/NetworkFunctions";

// type serviceType = 'detect2' | 'main2' | 'reid2' | 'rt2' | 'mediaserver' | '';
type serviceType = 'detect' | 'main' | 'back' | 'rt' | 'mediaserver' | '';

type SSEServerMgmtInfoType = {
  monitorVersion: string,
  upTime: string,
  serviceStatus: serviceStatusType[],
  omeyeVersion: omeyeVersionType,
  cpu: string,
  gpu: GPUType[],
  memory: memoryType,
  disk: string,
  networkBandwidth: networkBandwidthType,
  time: string,
}

type GetSSEServerMgmtInfoType = {
  monitorVersion: string,
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

type GetServerInfoType = {
  monitorVersion: string,
  hardwareInfos: hardwareInfosType,
  networkInfo: networkInfoType
}

type hardwareInfosType = {
  cpu: string,
  cpu_sockets: string,
  cpu_threads: string,
  gpu: string,
  gpu_sockets: string,
  mem: string,
  disk: string,
  network_speed: string
}

type networkInfoType = {
  iface: string,
  ip: string,
  netmask: string,
  gateway: string,
  dns: string
}

// const servicesName = [
//   'detect2',
//   'main2',
//   'rt2',
//   'reid2',
//   'mediaserver',
// ];


// const aiServicesName = [  
//   'detect2',
//   'main2',
//   'rt2',
// ];

const servicesName = [
  'detect',
  'main',
  'rt',
  'back',
  'mediaserver',
];


const aiServicesName = [  
  'detect',
  'main',
  'rt',
];

// let sse: EventSource | null;
const init = [0,0,0,0,0,0,0,0];

const ServerManagement = ({visible}: {
  visible: boolean
}) => {
  const sseRef = useRef<EventSource>()
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [serverMgmtInfo, setSeverMgmtInfo] = useState<SSEServerMgmtInfoType | null>(null);
  const [fixedServerMgmtInfo, setFixedServerMgmtInfo] = useState<GetServerInfoType | null>(null);
  const [xLabels, setXLabels] = useState([
    '00:00:00',
    '00:00:00',
    '00:00:00',
    '00:00:00',
    '00:00:00',
    '00:00:00',
    '00:00:00',
    '00:00:00',
  ]);
  const [cpuData, setCpuData] = useState(init);
  const [mData, setMData] = useState(init);
  const [diskData, setDiskData] = useState(init);
  const [totalData, setTotalData] = useState(init);
  const [uplinkData, setUplinkData] = useState(init);
  const [downlinkData, setDownlinkData] = useState(init);
  const [gpuData1, setGpuData1] = useState(init);
  const [gpuData2, setGpuData2] = useState(init);
  const [gpuData3, setGpuData3] = useState(init);
  const [gpuData4, setGpuData4] = useState(init);  
  const [login, setIsLogin] = useRecoilState(isLogin);
  const userInfo = decodedJwtToken(login!);

  function serviceStatusDiv(serviceName: serviceType) {
    const isService = serverMgmtInfo?.serviceStatus.find(item => item.serviceName.split('.')[1] === serviceName);
    const service = isService?.serviceName;
    const serviceStatus = isService?.serviceStatus;

    return (
      <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
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

  function memoryPercent(total: string | undefined, used: string | undefined) {
    let totalData = 0;
    let usedData = 0;
    let percent = 0;

    if(total && used) {
      if(total.slice(-2) === 'GB') {
        totalData = Number(total.slice(0,-2)) * 1024 * 1024;
      } else if(total.slice(-2) === 'MB') {
        totalData = Number(total.slice(0,-2)) * 1024;
      } else if(total.slice(-2) === 'KB') {
        totalData = Number(total.slice(0,-2));
      }

      if(used.slice(-2) === 'GB') {
        usedData = Number(used.slice(0,-2)) * 1024 * 1024;
      } else if(total.slice(-2) === 'MB') {
        usedData = Number(used.slice(0,-2)) * 1024;
      } else if(total.slice(-2) === 'KB') {
        usedData = Number(used.slice(0,-2));
      }
    }

    percent = Math.round(usedData/totalData * 100);

    return percent;
  }

  function bandwidthLabel(data: string | undefined) {
    if(data) {
      const matches = data.match(/^([\d.]+)([A-Za-z]+)$/);
      if(matches)
      return 'bandwidth (' + matches[2] + ')'
    } else {
      return undefined
    }
  }

  const deletePercent = (data: string | undefined) => {
    let percent = 0;

    if(data) {
      percent = Number(data.replace('%', ''));
    }

    return percent
  }

  function networkBandwidthTotalUnit(total: string | undefined, bw: string | undefined) {
    let bandwidthTotalUnit = separateUnit(total);
    let bandwidthNum = 0;
    let bandwidthReturn = 0;

    if(bw) {
      const num = separateNumber(bw);
      const unit = separateUnit(bw);
      if(num && unit) {
        if(bandwidthTotalUnit === unit) {
          return Number(num)
        } else {
          if(unit === 'bps') {
            bandwidthNum = Number(num);
          } else if(unit === 'Kbps' || unit === 'kbps') {
            bandwidthNum = Number(num) * 1000;
          } else if(unit === 'Mbps' || unit === 'mbps') {
            bandwidthNum = Number(num) * 1000 * 1000;
          } else if(unit === 'Gbps' || unit === 'gbps') {
            bandwidthNum = Number(num) * 1000 * 1000 * 1000;
          }

          if(bandwidthTotalUnit === 'bps') {
            bandwidthReturn = bandwidthNum;
          } else if(bandwidthTotalUnit === 'Kbps' || bandwidthTotalUnit === 'kbps') {
            bandwidthReturn = bandwidthNum / 1000;
          } else if(bandwidthTotalUnit === 'Mbps' || bandwidthTotalUnit === 'mbps') {
            bandwidthReturn = bandwidthNum / (1000 * 1000);
          } else if(bandwidthTotalUnit === 'Gbps' || bandwidthTotalUnit === 'gbps') {
            bandwidthReturn = bandwidthNum / (1000 * 1000 * 1000);
          }

          return bandwidthReturn
        }
      }
    }

    return 0
  }

  function separateNumber(data: string | undefined) {
    if(data) {
      const matches = data.match(/^([\d.]+)([A-Za-z]+)$/);
      if(matches)
      return matches[1]
    } else {
      return undefined
    }
  }

  function separateUnit(data: string | undefined) {
    if(data) {
      const matches = data.match(/^([\d.]+)([A-Za-z]+)$/);
      if(matches)
      return matches[2]
    } else {
      return undefined
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  async function sseSetting() {
    if(sseRef.current) {
      sseRef.current.close();
    }

    sseRef.current = await CustomEventSource(serverMgmtInfoApi);

    sseRef.current.onopen = () => {
      console.log('server mgmt sse open');
    }

    sseRef.current.onmessage = (res: MessageEvent) => {
      const response = JSON.parse(res.data);
      // console.log('response', response);
      const { monitorVersion, serviceStatus, omeyeVersion, cpu, gpu, memory, disk, networkBandwidth, time } = response as SSEServerMgmtInfoType;
      console.log('serviceStatus', serviceStatus)
      setSeverMgmtInfo(response);

      setXLabels(prevLabels => {
        const newXLabels = [...prevLabels];
        const newTime = time;
        newXLabels.shift();
        newXLabels.push(newTime);
        return newXLabels;
      }); 
      setCpuData(prevLabels => {
        const newXLabels = [...prevLabels];
        const newCpu = deletePercent(cpu);
        newXLabels.shift();
        newXLabels.push(newCpu);
        return newXLabels;
      });
      setMData(prevLabels => {
        const newXLabels = [...prevLabels];
        const newM = Math.round(memoryPercent(memory.total, memory.used));
        newXLabels.shift();
        newXLabels.push(newM);
        return newXLabels;
      });
      setDiskData(prevLabels => {
        const newXLabels = [...prevLabels];
        const newDisk = deletePercent(disk);
        newXLabels.shift();
        newXLabels.push(newDisk);
        return newXLabels;
      });
      setTotalData(prevLabels => {
        const newXLabels = [...prevLabels];
        const newTotal = networkBandwidthTotalUnit(networkBandwidth.total, networkBandwidth.total);
        newXLabels.shift();
        newXLabels.push(newTotal);
        return newXLabels;
      });
      setUplinkData(prevLabels => {
        const newXLabels = [...prevLabels];
        const newUplink = networkBandwidthTotalUnit(networkBandwidth.total, networkBandwidth.uplink);
        newXLabels.shift();
        newXLabels.push(newUplink);
        return newXLabels;
      });
      setDownlinkData(prevLabels => {
        const newXLabels = [...prevLabels];
        const newDownlink = networkBandwidthTotalUnit(networkBandwidth.total, networkBandwidth.downlink);
        newXLabels.shift();
        newXLabels.push(newDownlink);
        return newXLabels;
      });
      if(gpu[0]) {
        setGpuData1(prevLabels => {
          const newXLabels = [...prevLabels];
          const newGpu = Math.round(gpu[0].use);
          newXLabels.shift();
          newXLabels.push(newGpu);
          return newXLabels;
        });
      }
      if(gpu[1]) {
        setGpuData2(prevLabels => {
          const newXLabels = [...prevLabels];
          const newGpu = Math.round(gpu[1].use);
          newXLabels.shift();
          newXLabels.push(newGpu);
          return newXLabels;
        });
      }
      if(gpu[2]) {
        setGpuData3(prevLabels => {
          const newXLabels = [...prevLabels];
          const newGpu = Math.round(gpu[2].use);
          newXLabels.shift();
          newXLabels.push(newGpu);
          return newXLabels;
        });
      }
      if(gpu[3]) {
        setGpuData4(prevLabels => {
          const newXLabels = [...prevLabels];
          const newGpu = Math.round(gpu[3].use);
          newXLabels.shift();
          newXLabels.push(newGpu);
          return newXLabels;
        });
      }
    }
    // sse.onerror = (e: any) => {
      // e.target.close();
      // console.log('server mgmt sse error');
    // }
  }

  const GetGetServerInfo = async () => {
    const res:GetServerInfoType = await Axios('GET', GetServerInfoApi)
    if(res) setFixedServerMgmtInfo(res)
  }

  useEffect(() => {
    if(visible) {
      sseSetting()
      GetGetServerInfo()
    }
  },[visible])

  return (
    <div>
      <div style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px'}}>모니터링 <span>v{serverMgmtInfo?.monitorVersion}</span></div>
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
                {/* {serviceStatusDiv('reid2' as serviceType)} */}
                {serviceStatusDiv('back' as serviceType)}
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
          <div style={{marginBottom: '10px'}}>네트워크 정보</div>
          <div>
            <div style={{padding: '10px'}}>Interface name: {fixedServerMgmtInfo?.networkInfo.iface}</div>
            <div style={{padding: '10px'}}>IP: {fixedServerMgmtInfo?.networkInfo.ip}</div>
            <div style={{padding: '10px'}}>Netmask: {fixedServerMgmtInfo?.networkInfo.netmask}</div>
            <div style={{padding: '10px'}}>Gateway: {fixedServerMgmtInfo?.networkInfo.gateway}</div>
            <div style={{padding: '10px'}}>DNS: {fixedServerMgmtInfo?.networkInfo.dns}</div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%', padding: '15px'}}>
          {/* <div style={{marginBottom: '10px'}}>기타 정보</div>
          <div>
            <div style={{padding: '10px'}}>Uptime: {uptimeDataFun(serverMgmtInfo?.upTime)}</div>
          </div> */}
          <div style={{marginBottom: '10px'}}>하드웨어 정보</div>
          <div>
            <div style={{padding: '10px'}}>Cpu: {fixedServerMgmtInfo?.hardwareInfos.cpu}</div>
            <div style={{padding: '10px'}}>Cpu sockets: {fixedServerMgmtInfo?.hardwareInfos.cpu_sockets}</div>
            <div style={{padding: '10px'}}>Cpu threads: {fixedServerMgmtInfo?.hardwareInfos.cpu_threads}</div>
            <div style={{padding: '10px'}}>Gpu: {fixedServerMgmtInfo?.hardwareInfos.gpu}</div>
            <div style={{padding: '10px'}}>Gpu sockets: {fixedServerMgmtInfo?.hardwareInfos.gpu_sockets}</div>
            <div style={{padding: '10px'}}>Memory: {fixedServerMgmtInfo?.hardwareInfos.mem}</div>
            <div style={{padding: '10px'}}>Disk: {fixedServerMgmtInfo?.hardwareInfos.disk}</div>
            <div style={{padding: '10px'}}>Network speed: {Number(separateNumber(fixedServerMgmtInfo?.hardwareInfos.network_speed)).toFixed(0)}{separateUnit(fixedServerMgmtInfo?.hardwareInfos.network_speed)}</div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%', padding: '15px'}}>
          <div style={{marginBottom: '10px'}}>버전 정보</div>
          <div style={{marginBottom: '20px'}}>
            <div style={{padding: '10px'}}>프론트엔드: {process.env.REACT_APP_VERSION}</div>
            <div style={{padding: '10px'}}>백엔드: {serverMgmtInfo?.omeyeVersion.BE}</div>
            <div style={{padding: '10px'}}>AI: {serverMgmtInfo?.omeyeVersion.AI}</div>
          </div>

          <div style={{marginBottom: '10px'}}>기타 정보</div>
          <div>
            <div style={{padding: '10px'}}>Uptime: {uptimeDataFun(serverMgmtInfo?.upTime)}</div>
          </div>
        </div>
      </div>

      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%', padding: '10px'}}>
            <div style={{marginBottom: '10px'}}>GPU</div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                {serverMgmtInfo?.gpu && serverMgmtInfo?.gpu.map((data, index) => (
                  <div key={'gpu' + index}>
                    GPU{data.id + 1} 사용률: {data.use}%
                  </div>
                ))}
              </div>
              <div style={{backgroundColor: 'white'}}>
                <LineChart
                  width={userInfo.user.role === 'USER' ? windowDimensions.width/3 : windowDimensions.width/4}
                  height={271}
                  series={[
                    { data: gpuData1, label: 'GPU1', showMark: false, color: '#FE8968' },
                    { data: gpuData2, label: 'GPU2', showMark: false, color: '#857DB7' },
                    { data: gpuData3, label: 'GPU3', showMark: false, color: '#4E7FEA' },
                    { data: gpuData4, label: 'GPU4', showMark: false, color: '#F5C527' },
                  ].slice(0, serverMgmtInfo?.gpu.length || 0)}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                  yAxis={[{ label: 'GPU (%)', min: 0, max: 100 }]}
                />
              </div>
            </div>
          </div>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%', padding: '10px'}}>
            <div style={{marginBottom: '10px'}}>CPU</div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <div>
                  <div>사용률: {serverMgmtInfo?.cpu ? serverMgmtInfo?.cpu : '0%'}</div>
                </div>
                {/* <div>
                  <Progress type="circle" percent={memoryPercent(serverMgmtInfo?.memory.total, serverMgmtInfo?.memory.used)} width={75} strokeWidth={10} trailColor='#ccc' strokeColor='#4AA372' format={(percent) => `${percent}%`} />
                </div> */}
              </div>
              <div style={{backgroundColor: 'white'}}>
                <LineChart
                  width={userInfo.user.role === 'USER' ? windowDimensions.width/3 : windowDimensions.width/4}
                  height={271}
                  series={[
                    { data: cpuData, label: 'CPU', showMark: false, color: '#4ADAE5' },
                  ]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                  yAxis={[{ label: 'CPU (%)', min: 0, max: 100 }]}
                />
              </div>
            </div>          
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%', padding: '10px'}}>
            <div style={{marginBottom: '10px'}}>Memory</div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <div>
                  <div><span>총량 : </span><span>{serverMgmtInfo?.memory.total}</span></div>
                  <div><span>사용량 : </span><span>{serverMgmtInfo?.memory.used}</span></div>
                  <div>사용률: {memoryPercent(serverMgmtInfo?.memory.total, serverMgmtInfo?.memory.used)}%</div>
                </div>
                {/* <div>
                  <Progress type="circle" percent={memoryPercent(serverMgmtInfo?.memory.total, serverMgmtInfo?.memory.used)} width={75} strokeWidth={10} trailColor='#ccc' strokeColor='#4AA372' format={(percent) => `${percent}%`} />
                </div> */}
              </div>
              <div style={{backgroundColor: 'white'}}>
                <LineChart
                  width={userInfo.user.role === 'USER' ? windowDimensions.width/3 : windowDimensions.width/4}
                  height={271}
                  series={[
                    { data: mData, label: 'memory', showMark: false, color: '#4AA372' },
                  ]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                  yAxis={[{ label: 'memory (%)', min: 0, max: 100 }]}
                />
              </div>
            </div>           
          </div>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%', padding: '10px'}}>
            <div style={{marginBottom: '10px'}}>Network bandwidth</div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <div>
                  <div><span>Total : </span><span>{serverMgmtInfo?.networkBandwidth.total}</span></div>
                  <div><span>Uplink : </span><span>{serverMgmtInfo?.networkBandwidth.uplink}</span></div>
                  <div><span>Downlink : </span><span>{serverMgmtInfo?.networkBandwidth.downlink}</span></div>
                </div>
              </div>
              <div style={{backgroundColor: 'white'}}>
                <LineChart
                  width={userInfo.user.role === 'USER' ? windowDimensions.width/3 : windowDimensions.width/4}
                  height={271}
                  series={[
                    { data: totalData, label: 'total', showMark: false, color: '#A8A8A8' },
                    { data: uplinkData, label: 'uplink', showMark: false, color: '#4D94AA' },
                    { data: downlinkData, label: 'downlink', showMark: false, color: '#F9DB5D' },
                  ]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                  yAxis={[{ label: bandwidthLabel(serverMgmtInfo?.networkBandwidth.total) }]}
                  // slotProps={{
                  //   legend: {
                  //     labelStyle: {
                  //       fill: '#ccc'
                  //     }
                  //   }
                  // }}
                />
              </div>
            </div>          
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%', padding: '10px'}}>
            <div style={{marginBottom: '10px'}}>Disk</div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div className='server_management_monitoring_information_card_progress_info'>
                <div>
                  {/* <div><span>총량 : </span><span>{serverMgmtInfo?.disk.total}</span></div> */}
                  <div><span>사용률 : </span><span>{serverMgmtInfo?.disk}</span></div>
                </div>
              </div>
              <div style={{backgroundColor: 'white'}}>
                <LineChart
                  width={userInfo.user.role === 'USER' ? windowDimensions.width/3 : windowDimensions.width/4}
                  height={271}
                  series={[
                    { data: diskData, label: 'disk', showMark: false, color: '#ED77C0' },
                  ]}
                  xAxis={[{ scaleType: 'point', data: xLabels }]}
                  yAxis={[{ label: 'disk (%)', min: 0, max: 100 }]}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ServerManagement;