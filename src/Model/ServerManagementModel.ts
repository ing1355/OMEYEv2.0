import { atom } from "recoil"

export type ManagementServerSingleDataType = {
  id: number // 큐 내에서의 대기열 번호(Auto Increment 형태를 취해야 함, Backend - FrontEnd 유니크 값 필요)
  username: string // 유저 ID
  type: 'REID' | 'SELECTIVE_CONTROL' | 'REALTIME' | 'VIDEO_EXPORT' // 고속분석/선별관제/실시간/영상반출
  tag: "SEOUL" | "OMEYE1" | "OMEYE2" // 로컬 서버 혹은 서울/경기 등 다른 서버 구분
  createdAt: string // 20231109154343
  status: 'WAIT' | 'IN_PROGRESS' | 'COMPLETE' | 'CANCEL' // 대기/진행중/완료/취소됨
  priority: 'NORMAL' | 'EMERGENCY' // 숫자로 할지 등급으로 할지 결정필요
  params?: any
}

export const currentManagementId = atom<number>({
  key: 'managementId/current',
  default: 0
})

export const managementServerStatus = atom<'ON' | 'OFF'>({
  key: 'management/status',
  default: 'ON'
})