import styled from "styled-components"
import { CaptureResultListItemType, ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"
import { convertFullTimeStringToHumanTimeFormat, getMethodNameByKey } from "../../../../Functions/GlobalFunctions"
import { ObjectTypes, ReIDObjectTypes } from "../../ConstantsValues"
import CCTVNameById from "../../../Constants/CCTVNameById"
import { descriptionItemLabels, descriptionItemLabelsKeyType } from "../TargetSelect/PersonDescription/DescriptionItems"
import { DescriptionCategories, DescriptionCategoryKeyType, descriptionColorType, descriptionDataSingleType, descriptionSubDataKeys } from "../TargetSelect/PersonDescription/DescriptionType"
import { globalStyles } from "../../../../styles/global-styled"
import targetIcon from '../../../../assets/img/targetIcon.png'
import timeIcon from '../../../../assets/img/ProgressTimeIcon.png'
import cctvIcon from '../../../../assets/img/treeCCTVIcon.png'
import descriptionIcon from '../../../../assets/img/DescriptionEmptyIcon.png'
import maskIcon from '../../../../assets/img/maskIcon.png'
import methodAddIcon from '../../../../assets/img/methodAddIcon.png'
import { PropsWithChildren } from "react"

type TargetDescriptionByTypeProps = {
    data: CaptureResultListItemType
}

type DescriptionGeneralRowProps<T extends DescriptionCategoryKeyType> = {
    data: descriptionDataSingleType<T>
    type: DescriptionCategoryKeyType
}

type TargetDescriptionHeaderProps = {
    icon: string
    title: string
}

const DescriptionGeneralRow = <T extends DescriptionCategoryKeyType>({ data, type }: DescriptionGeneralRowProps<T>) => {
    return <>
        {Object.keys(data).some((_) => {
            const item = data[_ as descriptionSubDataKeys<T>]
            if (Array.isArray(item)) return item.length > 0
            else return item
        }) && <ItemDescriptionContentText>
                {DescriptionCategories.find(_ => _.key === type)?.title} : {(Object.keys(data) as descriptionSubDataKeys<T>[]).map(_ => {
                    const item = data[_] as descriptionItemLabelsKeyType
                    if (typeof (item) === 'string') return descriptionItemLabels[item]
                    else if (Array.isArray(item)) {
                        const _item = item as descriptionColorType[]
                        if (_item.length > 0) return _item.map(_ => descriptionItemLabels[_]).join(',')
                        else return null
                    }
                }).filter(_ => _).join(',')}
            </ItemDescriptionContentText>}
    </>
}

const TargetDescriptionHeader = ({ icon, title }: {
    icon: string
    title: string
}) => {
    return <ItemDescriptionHeaderContainer>
        <ItemDEscriptionHeaderIcon>
            <img src={icon} />
        </ItemDEscriptionHeaderIcon>
        <ItemDescriptionHeaderTitle>
            {title}
        </ItemDescriptionHeaderTitle>
    </ItemDescriptionHeaderContainer>
}

const TargetDescriptionItem = ({ icon, title, children }: PropsWithChildren<TargetDescriptionHeaderProps>) => {
    return <ItemDescriptionContents>
        <TargetDescriptionHeader icon={icon} title={title}/>
        <ItemDescriptionContentsInnerContainer>
            {children}
        </ItemDescriptionContentsInnerContainer>
    </ItemDescriptionContents>
}

const TargetDescriptionByType = ({ data }: TargetDescriptionByTypeProps) => {
    const { cctvName, cctvId, time, accuracy, type, mask, method, description, ocr } = data

    return <>
        {
            method && <TargetDescriptionItem icon={methodAddIcon} title="대상 추가 방법">
                {getMethodNameByKey(method)}
            </TargetDescriptionItem>
        }
        {
            type && <TargetDescriptionItem icon={targetIcon} title="대상 유형">
                {ReIDObjectTypes.find(_ => _.key === type)?.title}
            </TargetDescriptionItem>
        }
        {
            time && <TargetDescriptionItem icon={timeIcon} title="발견 시각">
                {convertFullTimeStringToHumanTimeFormat(time)}
            </TargetDescriptionItem>
        }
        {
            (cctvName || cctvId) && <TargetDescriptionItem icon={cctvIcon} title="CCTV">
                {cctvName || <CCTVNameById cctvId={cctvId || 0}/>}
            </TargetDescriptionItem>
        }
        {
            description && <TargetDescriptionItem icon={descriptionIcon} title="인상착의 정보">
                {
                    description.general && <DescriptionGeneralRow<'general'> data={description.general} type="general" />
                }
                {
                    description.outer && <DescriptionGeneralRow<'outer'> data={description.outer} type="outer" />
                }
                {
                    description.shoes && <DescriptionGeneralRow<'inner'> data={description.inner} type="inner" />
                }
                {
                    description.shoes && <DescriptionGeneralRow<'bottom'> data={description.bottom} type="bottom" />
                }
                {
                    description.shoes && <DescriptionGeneralRow<'shoes'> data={description.shoes} type="shoes" />
                }
                {
                    description.etc && <DescriptionGeneralRow<'etc'> data={description.etc} type="etc" />
                }
            </TargetDescriptionItem>
        }
        {
            type === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <TargetDescriptionItem icon={maskIcon} title="마스크 착용 여부">
                {mask ? '착용' : '미착용'}
            </TargetDescriptionItem>
        }
        {/* {
            accuracy && <ItemDescriptionContentText>
                유사율 : {accuracy}%
            </ItemDescriptionContentText>
        } */}
        {/* {
            ocr && <ItemDescriptionContentText>
                번호판 : {ocr}
            </ItemDescriptionContentText>
        } */}
    </>
}

export default TargetDescriptionByType

const ItemDescriptionContentText = styled.div`
    color: white;
    width: 100%;
`

const ItemDescriptionContents = styled.div`
    width: 100%;
    ${globalStyles.flex({justifyContent:'flex-start', gap: '6px'})}
`

const ItemDescriptionHeaderContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px', justifyContent: 'flex-start' })}
    height: 20px;
`

const ItemDEscriptionHeaderIcon = styled.div`
    width: 24px;
    height: 100%;
    & > img {
        width: 100%;
        height: 100%;
    }
`

const ItemDescriptionHeaderTitle = styled.div`
    font-size: 1.1rem;
`

const ItemDescriptionContentsInnerContainer = styled.div`
    font-size: .9rem;
    padding-left: 30px;
    width: 100%;
    line-height: 18px;
`