import styled from "styled-components"
import { CaptureResultListItemType, ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import { convertFullTimeStringToHumanTimeFormat, getMethodNameByKey } from "../../../../Functions/GlobalFunctions"
import { ObjectTypes } from "../../ConstantsValues"
import CCTVNameById from "../../../Constants/CCTVNameById"

type TargetDescriptionByTypeProps = {
    data: CaptureResultListItemType
}

const TargetDescriptionByType = ({ data }: TargetDescriptionByTypeProps) => {
    const { cctvName, cctvId, time, accuracy, type, mask, method } = data
    return <>
        {
            method && <ItemDescriptionContentText>
                대상 추가 방법 : {getMethodNameByKey(method!)}
            </ItemDescriptionContentText>
        }
        {
            cctvName && <ItemDescriptionContentText>
                CCTV 이름 : {cctvName}
            </ItemDescriptionContentText>
        }
        {
            cctvId && <ItemDescriptionContentText>
                CCTV 이름 : <CCTVNameById cctvId={cctvId} />
            </ItemDescriptionContentText>
        }
        {
            time && <ItemDescriptionContentText>
                발견 시각 : {convertFullTimeStringToHumanTimeFormat(time)}
            </ItemDescriptionContentText>
        }
        {
            accuracy && <ItemDescriptionContentText>
                유사율 : {accuracy}%
            </ItemDescriptionContentText>
        }
        {type === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <ItemDescriptionContentText>
            마스크 착용 여부 : {mask ? '착용' : '미착용'}
        </ItemDescriptionContentText>}
    </>
}

export default TargetDescriptionByType

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
`