import { useRecoilState, useRecoilValue } from "recoil"
import { descriptionData } from "../../../../../../Model/DescriptionDataModel"
import descriptionSelectItems, { DescriptionItemType } from "../DescriptionItems"
import { DescriptionCategoryKeyType, descriptionGeneralType } from "../DescriptionType"
import DescriptionSelectItemContainer from "../Layout/DescriptionSelectItemContainer"
import NormalSelectItem from "../Layout/NormalSelectItem"
import { createValueChangedDescription } from "../Functions"

const type: DescriptionCategoryKeyType = 'general'

const DescriptionGeneralSelect = () => {
    const items = descriptionSelectItems[type]
    const itemKeys = Object.keys(items) as (keyof descriptionGeneralType)[]
    const [data, setData] = useRecoilState(descriptionData)
    
    return <>
        {itemKeys.map(_ => <DescriptionSelectItemContainer title={items[_].title} key={_}>
            {
                items[_].items.map(__ => <NormalSelectItem<'general'> key={__.key} item={__} flex={items[_].flex} selected={data[type][_] === __.key} onClick={() => {
                    setData((prev) => createValueChangedDescription(prev, type, _, data[type][_] === __.key ? null : __.key))
                }}/>)
            }
        </DescriptionSelectItemContainer>)}
    </>
}

export default DescriptionGeneralSelect