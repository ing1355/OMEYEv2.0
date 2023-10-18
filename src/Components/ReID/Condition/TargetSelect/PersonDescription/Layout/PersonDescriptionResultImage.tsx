import { useRecoilValue } from "recoil";
import { descriptionData } from "../../../../../../Model/DescriptionDataModel";
import { descriptionColorType, descriptionPatternType } from "../DescriptionType";
import styled from "styled-components";
import { CSSProperties } from "react";
import descriptionSelectItems, { OuterShapeTypes, OuterTypeTypes, PatternItems } from "../DescriptionItems";
import Body from '../../../../../../assets/img/descriptions/ResultImages/body.png'
import OnlyBody from '../../../../../../assets/img/descriptions/ResultImages/onlyBody.png'
import { SectionBackgroundColor, globalStyles } from "../../../../../../styles/global-styled";
import SVGComponentHOC, { WithPatternColorsDescriptionItemWrappedProps } from "../../../../../Constants/SVGComponentHOC";
import ShortOuter from "../../../../../../assets/img/descriptions/ResultImages/ShortOuter";
import OuterLine from '../../../../../../assets/img/descriptions/ResultImages/outerLine.png'
import InnerLine from '../../../../../../assets/img/descriptions/ResultImages/innerLine.png'
import BottomLine from '../../../../../../assets/img/descriptions/ResultImages/bottomLine.png'
import longOuterSleeveless from '../../../../../../assets/img/descriptions/ResultImages/longOuterSleeveless.png'
import longOuterShortSleeve from '../../../../../../assets/img/descriptions/ResultImages/longOuterShortsleeve.png'
import shortOuterSleeveless from '../../../../../../assets/img/descriptions/ResultImages/shortOuterSleeveless.png'
import shortOuterShortSleeve from '../../../../../../assets/img/descriptions/ResultImages/shortOuterShortsleeve.png'
import shirtsSleeveless from '../../../../../../assets/img/descriptions/ResultImages/shirtsSleeveless.png'
import shirtsShortSleeve from '../../../../../../assets/img/descriptions/ResultImages/shirtsShortsleeve.png'
import patternIcon from '../../../../../../assets/img/descriptions/pattern.png'
import LongInner from "../../../../../../assets/img/descriptions/ResultImages/LongInner";
import ShortInner from "../../../../../../assets/img/descriptions/ResultImages/ShortInner";
import OnepieceInner from "../../../../../../assets/img/descriptions/ResultImages/OnepieceInner";
import ShirtInner from "../../../../../../assets/img/descriptions/ResultImages/ShirtInner";

// const PersonDescriptionGeneralImages = ({data}: {data : descriptionDataType['general']['gender']}) => {
//     return <>
//     </>
// }

export type WithPatternColorsDescriptionItemProps = {
    Src?: React.FC<{ colorProps: JSX.Element | JSX.Element[] }>
    colors?: descriptionColorType[]
} & CustomImageProps

const OtherImage = ({ src, height, title }: {
    height: CSSProperties['height']
    src?: string
    title?: string
}) => {
    return <div style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: '1.1rem',
        gap: '30%',
        flex: 1
    }}>
        <img src={src} style={{
            height: '100%'
        }} />
        {title}
    </div>
}

type CustomImageProps = {
    x?: CSSProperties['left']
    y?: CSSProperties['top']
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    z?: CSSProperties['zIndex']
    label?: string
}

const bottomMergedPatternItems = [...PatternItems, {
    title: '패턴',
    key: 'pattern',
    icon: patternIcon
}]

const PatternLineImage = ({ pattern, lineImage, x, y, z, width, height, lineProps, patternProps }: {
    pattern: descriptionPatternType
    patternProps?: CustomImageProps
    lineImage: string
    lineProps?: CustomImageProps
} & CustomImageProps) => {
    return <div style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: z,
        width,
        height,
    }}>
        <div style={{
            position:'absolute',
            left: patternProps?.x,
            top: patternProps?.y,
            height: patternProps?.height,
            width: '100%'
        }}>
            <ResultImage src={bottomMergedPatternItems.find(_ => _.key === pattern)?.icon} z="100" height="100%"/>
            <div style={{
                position:'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)'
            }}>
                {patternProps?.label}
            </div>
        </div>
        <ResultImage src={lineImage} {...lineProps} z="99" />
    </div>
}

const otherImageHeight = '60%'
const bodyHeight = '70%'
const bodyTop = "10%"
const bodyLeft = "32.4%"

const findOuterShapeSrc = (type: OuterTypeTypes, shape: OuterShapeTypes) => {
    if (!shape || shape === 'longsleeve') return '';
    if (type === 'longouter') {
        if (shape === 'shortsleeve') return longOuterShortSleeve
        else if (shape === 'sleeveless') return longOuterSleeveless
    } else if (type === 'shortouter') {
        if (shape === 'shortsleeve') return shortOuterShortSleeve
        else if (shape === 'sleeveless') return shortOuterSleeveless
    } else {
        if (shape === 'shortsleeve') return shirtsShortSleeve
        else if (shape === 'sleeveless') return shirtsSleeveless
    }
}

const defaultOuterSrc = ShortOuter
const findInnerTypeSrc = (type: OuterTypeTypes): React.FC<WithPatternColorsDescriptionItemWrappedProps> => {
    switch (type) {
        case "longouter": return LongInner
        case "onepiece": return OnepieceInner
        case "shirt": return ShirtInner
        case "shortouter":
        default: return ShortInner
    }
}

const outerAndBottomPatternX = "3%"

const PersonDescriptionResultImage = () => {
    const data = useRecoilValue(descriptionData)
    const { general, outer, inner, bottom, shoes, etc } = data
    const hasInner = (inner.color.length > 0 || inner.pattern)
    const hasOuter = (outer.type || outer.pattern || outer.color.length > 0 || outer.shape)
    const hasBottom = (bottom.type || bottom.color.length > 0 || bottom.pattern)
    return <>
        <Title>
            속성 미리보기
        </Title>
        <BodyCanvas>
            <ResultImage src={!general.hair ? Body : OnlyBody} height={bodyHeight} y={bodyTop} z={10} />
            {general.hair && <ResultImage src={descriptionSelectItems.general.hair.items.find(_ => _.key === general.hair)?.resultIcon} height={bodyHeight} y={bodyTop} z={11} />}
            {etc.glasses && <ResultImage src={descriptionSelectItems.etc.glasses.items.find(_ => _.key === etc.glasses)?.resultIcon} height={bodyHeight} y={bodyTop} z={12} />}
            {etc.mask && <ResultImage src={descriptionSelectItems.etc.mask.items.find(_ => _.key === etc.mask)?.resultIcon} height={bodyHeight} y={bodyTop} z={13} />}
            {hasBottom && <SVGComponentHOC Src={descriptionSelectItems.bottom.type.items.find(_ => _.key === bottom.type)?.SvgComponent ?? descriptionSelectItems.bottom.type.items[1].SvgComponent} height={bodyHeight} y={bodyTop} colors={bottom.color} z={19} x={bodyLeft} />}
            {(hasInner || hasOuter) && <SVGComponentHOC Src={findInnerTypeSrc(outer.type)} height={bodyHeight} y={bodyTop} x={bodyLeft} z={99} colors={inner.color} />}
            {/* {(hasInner || hasOuter) && <SvgIcon Src={hasOuter ? findInnerTypeSrc(outer.type) : shortInnerSVG} height={bodyHeight} y={bodyTop} x={bodyLeft} z={99} colors={inner.color} />} */}
            {shoes.type && <ResultImage src={descriptionSelectItems.shoes.type.items.find(_ => _.key === shoes.type)?.resultIcon} height={bodyHeight} y={bodyTop} z={20} />}
            {(hasInner || outer.type || outer.shape || outer.pattern || outer.color.length > 0) && <SVGComponentHOC Src={!outer.type ? defaultOuterSrc : descriptionSelectItems.outer.type.items.find(_ => _.key === outer.type)?.SvgComponent} x={bodyLeft} y={bodyTop} height={bodyHeight} z={20} colors={outer.color} />}
            {outer.shape && outer.shape !== 'longsleeve' && <ResultImage src={findOuterShapeSrc(outer.type, outer.shape)} height={bodyHeight} y={bodyTop} z={99} />}
            {outer.pattern && <PatternLineImage pattern={outer.pattern} lineImage={OuterLine} width="40%" height="30%" z={999} y="8%" x={outerAndBottomPatternX} lineProps={{
                width: '200%',
                height: '200%',
                y: '0%',
                x: '20%'
            }} patternProps={{
                height: '40%',
                x: '-8%',
                y: '18%',
                label: bottomMergedPatternItems.find(_ => _.key === outer.pattern)?.title
            }} />}
            {bottom.pattern && <PatternLineImage pattern={bottom.pattern} lineImage={BottomLine} width="40%" height="30%" z={999} y="53%" x={outerAndBottomPatternX} lineProps={{
                width: '200%',
                height: '200%',
                y: '-125%',
                x: '20%'
            }} patternProps={{
                height: '40%',
                x: '-8%',
                y: '21%',
                label: bottomMergedPatternItems.find(_ => _.key === bottom.pattern)?.title
            }} />}
            {inner.pattern && <PatternLineImage pattern={inner.pattern} lineImage={InnerLine} width="50%" height="30%" z={999} y="20.5%" x="50%" lineProps={{
                width: '200%',
                height: '200%',
                y: '-20%',
                x: '-100%'
            }} patternProps={{
                height: '40%',
                x: '8%',
                y: '49%',
                label: bottomMergedPatternItems.find(_ => _.key === inner.pattern)?.title
            }} />}
        </BodyCanvas>
        <OtherCanvasContainer>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: '30%'
            }}>
                <OtherCategories>
                    {/* 성별·나이 */}
                    성별
                </OtherCategories>
                <OtherCategories>
                    기타
                </OtherCategories>
            </div>
            <OtherCanvas>
                <OtherImage
                    src={descriptionSelectItems.general.gender.items.find(_ => _.key === general.gender)?.icon}
                    title={descriptionSelectItems.general.gender.items.find(_ => _.key === general.gender)?.title}
                    height={otherImageHeight} />
                {/* <OtherImage
                    src={descriptionSelectItems.general.age.items.find(_ => _.key === general.age)?.icon}
                    title={descriptionSelectItems.general.age.items.find(_ => _.key === general.age)?.title}
                    height={otherImageHeight} /> */}
                <OtherImage
                    src={descriptionSelectItems.etc.bag.items.find(_ => _.key === etc.bag)?.icon}
                    title={descriptionSelectItems.etc.bag.items.find(_ => _.key === etc.bag)?.title}
                    height={otherImageHeight} />
                <OtherImage
                    src={descriptionSelectItems.etc.walkingaids.items.find(_ => _.key === etc.walkingaids)?.icon}
                    title={descriptionSelectItems.etc.walkingaids.items.find(_ => _.key === etc.walkingaids)?.title}
                    height={otherImageHeight} />
            </OtherCanvas>
        </OtherCanvasContainer>
    </>
}

export default PersonDescriptionResultImage;

const Title = styled.div`
    width: 100%;
    height: 60px;
    ${globalStyles.flex({ alignItems: 'flex-start' })}
    padding: 16px 16px;
    font-size: 2rem;
`

const OtherCategories = styled.div`
    font-size: 1.4rem;
    flex: 1;
    text-align: center;
    &:last-child {
        flex: 2;
    }
`

const OtherCanvasContainer = styled.div`
    height: calc(100% - 572px - 60px);
    width: 100%;
    padding: 12px 0;
    border-top: 1px solid white;
`
const OtherCanvas = styled.div`
    height: 70%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const BodyCanvas = styled.div`
    position: relative;
    height: 572px;
    width: 100%;
    background-color: ${SectionBackgroundColor};
`

const ResultImage = styled.img<{ x?: CSSProperties['left'], y?: CSSProperties['top'], z?: CSSProperties['zIndex'], width?: CSSProperties['width'], height?: CSSProperties['height'] }>`
    position: absolute;
    left: ${({ x }) => x ?? 0};
    top: ${({ y }) => y ?? 0};
    width: ${({ width }) => width ?? '100%'};
    height: ${({ height }) => height ?? '100%'};
    z-index: ${({ z }) => z ?? 1};
`