type ServerManagementDataType = {
    id: number // 큐 내에서의 대기열 번호(Auto Increment 형태를 취해야 함, Backend - FrontEnd 유니크 값 필요)
    username: string // 유저 ID
    type: 'REID' | 'SELECTIVE_CONTROL' | 'REALTIME' | 'VIDEO_EXPORT' // 고속분석/선별관제/실시간/영상반출
    tag: string | "SELF" // 로컬 서버 혹은 서울/경기 등 다른 서버 구분
    created_at: string // 2023-11-09 15:43:43
    status: 'WAIT' | 'IN_PROGRESS' | 'COMPLETE' | 'CANCEL' // 대기/진행중/완료/취소됨
    priority: number | string // 숫자로 할지 등급으로 할지 결정필요
}

export default {}