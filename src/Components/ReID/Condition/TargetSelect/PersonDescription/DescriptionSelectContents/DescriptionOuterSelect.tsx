import { useRecoilState } from "recoil"
import { descriptionData } from "../../../../../../Model/DescriptionDataModel"
import descriptionSelectItems from "../DescriptionItems"
import { DescriptionCategoryKeyType, descriptionColorType, descriptionOuterType } from "../DescriptionType"
import DescriptionSelectItemContainer from "../Layout/DescriptionSelectItemContainer"
import NormalSelectItem from "../Layout/NormalSelectItem"
import ColorSelectItem from "../Layout/ColorSelectItem"
import { createColorChangedDescription, createValueChangedDescription } from "../Functions"
import outerTypeGuideImg from '../../../../../../assets/img/descriptions/outerTypeGuideImg.png'
import outerShapeGuideImg from '../../../../../../assets/img/descriptions/outerShapeGuideImg.png'

const type: DescriptionCategoryKeyType = 'outer'

const getGuideImage = (type: keyof descriptionOuterType) => {
    if(type === 'type') return outerTypeGuideImg
    else if(type === 'shape') return outerShapeGuideImg
}

const DescriptionOuterSelect = () => {
    const items = descriptionSelectItems[type]
    const itemKeys = Object.keys(items) as (keyof descriptionOuterType)[]
    const [data, setData] = useRecoilState(descriptionData)
    
    return <>
        {itemKeys.map(_ => <DescriptionSelectItemContainer title={items[_].title} key={_} wrap={_ === 'color'} info={_ === 'type' || _ === 'shape'} infoImg={getGuideImage(_)}>
            {
                items[_].items.map((__, ind) => _ === 'color' ? <ColorSelectItem title={__.title} value={__.value!} _key={(__.key as descriptionColorType[])[0]} key={ind} onClick={() => {
                    const pattern = data[type]['pattern']
                    const color = (__.key as descriptionColorType[])[0]
                    setData((prev) => createValueChangedDescription(prev, type, _, createColorChangedDescription(data[type]['color'], pattern, color)))
                }} selected={data[type]['color'].includes((__.key as descriptionColorType[])[0])}/> : 
                <NormalSelectItem<'outer'> item={__} flex={items[_].flex} key={ind} selected={data[type][_] === __.key} onClick={() => {
                    setData((prev) => createValueChangedDescription(prev, type, _, data[type][_] === __.key ? null : __.key as any))
                }}/>)
            }
        </DescriptionSelectItemContainer>)}
    </>
}

export default DescriptionOuterSelect