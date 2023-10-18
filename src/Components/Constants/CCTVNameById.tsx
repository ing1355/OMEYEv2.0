import { useRecoilValue } from "recoil"
import { CameraDataType } from "../../Constants/GlobalTypes"
import { GetCameraById } from "../../Model/SiteDataModel"

const CCTVNameById = ({ cctvId }: {
    cctvId: CameraDataType['cameraId']
}) => {
    const name = useRecoilValue(GetCameraById(cctvId))?.name
    return <>
        {name}
    </>
}

export default CCTVNameById