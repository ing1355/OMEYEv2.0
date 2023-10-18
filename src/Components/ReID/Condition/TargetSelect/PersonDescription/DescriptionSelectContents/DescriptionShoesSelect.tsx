import { useRecoilState } from "recoil"
import { descriptionData, descriptionSingleData } from "../../../../../../Model/DescriptionDataModel"
import descriptionSelectItems from "../DescriptionItems"
import { DescriptionCategoryKeyType, descriptionShoesType } from "../DescriptionType"
import DescriptionSelectItemContainer from "../Layout/DescriptionSelectItemContainer"
import NormalSelectItem from "../Layout/NormalSelectItem"
import { createValueChangedDescription } from "../Functions"

const type: DescriptionCategoryKeyType = 'shoes'

const DescriptionShoesSelect = () => {
    const items = descriptionSelectItems[type]
    const itemKeys = Object.keys(items) as (keyof descriptionShoesType)[]
    const [data, setData] = useRecoilState(descriptionData)
    
    return <>
        {itemKeys.map(_ => <DescriptionSelectItemContainer title={items[_].title} key={_}>
            {
                items[_].items.map(__ => <NormalSelectItem<'shoes'> item={__} flex={items[_].flex} key={__.key} selected={data[type][_] === __.key} onClick={() => {
                    setData((prev) => createValueChangedDescription(prev, type, _, data[type][_] === __.key ? null : __.key))
                }}/>)
            }
        </DescriptionSelectItemContainer>)}
    </>
}

export default DescriptionShoesSelect