import { useRecoilState } from "recoil"
import { descriptionData, descriptionSingleData } from "../../../../../../Model/DescriptionDataModel"
import descriptionSelectItems from "../DescriptionItems"
import { DescriptionCategoryKeyType, descriptionETCType } from "../DescriptionType"
import DescriptionSelectItemContainer from "../Layout/DescriptionSelectItemContainer"
import NormalSelectItem from "../Layout/NormalSelectItem"
import { createValueChangedDescription } from "../Functions"

const type: DescriptionCategoryKeyType = 'etc'

const DescriptionETCSelect = () => {
    const items = descriptionSelectItems[type]
    const itemKeys = Object.keys(items) as (keyof descriptionETCType)[]
    const [data, setData] = useRecoilState(descriptionData)
    
    return <>
        {itemKeys.map(_ => <DescriptionSelectItemContainer title={items[_].title} key={_}>
            {
                items[_].items.map(__ => <NormalSelectItem<'etc'> key={__.key} item={__} flex={items[_].flex} selected={data[type][_] === __.key} onClick={() => {
                    setData((prev) => createValueChangedDescription(prev, type, _, data[type][_] === __.key ? null : __.key))
                }}/>)
            }
        </DescriptionSelectItemContainer>)}
    </>
}

export default DescriptionETCSelect