import styled from "styled-components"
import { CaptureResultListItemType, ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import { convertFullTimeStringToHumanTimeFormat, getMethodNameByKey } from "../../../../Functions/GlobalFunctions"
import { ObjectTypes } from "../../ConstantsValues"
import CCTVNameById from "../../../Constants/CCTVNameById"
import { descriptionItemLabels, descriptionItemLabelsKeyType } from "../TargetSelect/PersonDescription/DescriptionItems"
import { DescriptionCategories, DescriptionCategoryKeyType, descriptionDataSingleType, descriptionSubDataKeys } from "../TargetSelect/PersonDescription/DescriptionType"

type TargetDescriptionByTypeProps = {
    data: CaptureResultListItemType
}

type DescriptionGeneralRowProps<T extends DescriptionCategoryKeyType> = {
    data: descriptionDataSingleType<T>
    type: DescriptionCategoryKeyType
}

const DescriptionGeneralRow = <T extends DescriptionCategoryKeyType>({ data, type }: DescriptionGeneralRowProps<T>) => {
    return <>
        <ItemDescriptionContentText>
            {DescriptionCategories.find(_ => _.key === type)?.title} : {(Object.keys(data) as descriptionSubDataKeys<T>[]).map(_ => descriptionItemLabels[data[_] as descriptionItemLabelsKeyType]).join(',')}
        </ItemDescriptionContentText>
    </>
}

const TargetDescriptionByType = ({ data }: TargetDescriptionByTypeProps) => {
    const { cctvName, cctvId, time, accuracy, type, mask, method, description } = data

    return <>
        {
            method && <ItemDescriptionContentText>
                대상 추가 방법 : {getMethodNameByKey(method!)}
            </ItemDescriptionContentText>
        }
        {
            description && <>
                {
                    description.general && <DescriptionGeneralRow<'general'> data={description.general} type="general"/>
                }
                {
                    description.outer && <DescriptionGeneralRow<'outer'> data={description.outer} type="outer"/>
                }
                {
                    description.shoes && <DescriptionGeneralRow<'inner'> data={description.inner} type="inner"/>
                }
                {
                    description.shoes && <DescriptionGeneralRow<'bottom'> data={description.bottom} type="bottom"/>
                }
                {
                    description.shoes && <DescriptionGeneralRow<'shoes'> data={description.shoes} type="shoes"/>
                }
                {
                    description.etc && <DescriptionGeneralRow<'etc'> data={description.etc} type="etc"/>
                }
            </>
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
        {
            type === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <ItemDescriptionContentText>
                마스크 착용 여부 : {mask ? '착용' : '미착용'}
            </ItemDescriptionContentText>
        }
    </>
}

export default TargetDescriptionByType

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
`