import { useRecoilValue } from "recoil"
import { CameraDataType } from "../../Constants/GlobalTypes"
import { GetCameraById } from "../../Model/SiteDataModel"

const CCTVNameById = ({ cctvId }: {
    cctvId: CameraDataType['cameraId']
}) => {
    const name = useRecoilValue(GetCameraById(Number(cctvId)))?.name
    
    return <>
        {name || '정보 없음'}
    </>
}

export default CCTVNameById