import { useRecoilState } from "recoil"
import { descriptionData } from "../../../../../../Model/DescriptionDataModel"
import descriptionSelectItems from "../DescriptionItems"
import { DescriptionCategoryKeyType, descriptionColorType, descriptionInnerType } from "../DescriptionType"
import DescriptionSelectItemContainer from "../Layout/DescriptionSelectItemContainer"
import NormalSelectItem from "../Layout/NormalSelectItem"
import ColorSelectItem from "../Layout/ColorSelectItem"
import { createColorChangedDescription, createValueChangedDescription } from "../Functions"
import innerGuideImg from '../../../../../../assets/img/descriptions/innerGuideImg.png'

const type: DescriptionCategoryKeyType = 'inner'

const DescriptionInnerSelect = () => {
    const items = descriptionSelectItems[type]
    const itemKeys = Object.keys(items) as (keyof descriptionInnerType)[]
    const [data, setData] = useRecoilState(descriptionData)
    
    return <>
        {itemKeys.map(_ => <DescriptionSelectItemContainer title={items[_].title} key={_} wrap={_ === 'color'} info={_ === 'pattern'} infoImg={innerGuideImg}>
            {
                items[_].items.map((__, ind) => _ === 'color' ? <ColorSelectItem key={ind} title={__.title} value={__.value!} _key={(__.key as descriptionColorType[])[0]} onClick={() => {
                    const pattern = data[type]['pattern']
                    const color = (__.key as descriptionColorType[])[0]
                    setData((prev) => createValueChangedDescription(prev, type, _, createColorChangedDescription(data[type]['color'], pattern, color)))
                }} selected={data[type]['color'].includes((__.key as descriptionColorType[])[0])}/> : 
                <NormalSelectItem<'inner'> item={__} flex={items[_].flex} selected={data[type][_] === __.key} key={ind} onClick={() => {
                    setData((prev) => createValueChangedDescription(prev, type, _, data[type][_] === __.key ? null : __.key as any))
                }}/>)
            }
        </DescriptionSelectItemContainer>)}
    </>
}

export default DescriptionInnerSelect