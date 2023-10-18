import { Fragment, useMemo } from "react"
import { WithPatternColorsDescriptionItemProps } from "../ReID/Condition/TargetSelect/PersonDescription/Layout/PersonDescriptionResultImage"
import { ColorItems } from "../ReID/Condition/TargetSelect/PersonDescription/DescriptionItems"
import { GlobalBackgroundColor, SectionBackgroundColor } from "../../styles/global-styled"

export type WithPatternColorsDescriptionItemWrappedProps = {
    colorProps: JSX.Element | JSX.Element[]
}

const SVGComponentHOC = ({ x, y, z, width, height, colors, Src }: WithPatternColorsDescriptionItemProps) => {

    const colorProps = useMemo(() => {
        if (!colors || colors.length === 0) return <>
            <stop offset='0%' stopColor={SectionBackgroundColor} />
            <stop offset='100%' stopColor={SectionBackgroundColor} />
        </>
        const len = colors.length
        return (colors || ['transparent']).map((_, ind) => {
            return <Fragment key={ind}>
                <stop offset={(100 / len) * ind + '%'} stopColor={ColorItems.find(__ => __.key[0] === _)?.value} />
                <stop offset={(100 / len) * (ind + 1) + '%'} stopColor={ColorItems.find(__ => __.key[0] === _)?.value} />
            </Fragment>
        })
    }, [colors])

    return <svg id="_레이어_1" width={width} height={height} viewBox="0 0 179 442" xmlns="http://www.w3.org/2000/svg" style={{
        position: 'absolute',
        zIndex: z,
        top: y,
        left: x
    }}>
        {Src && <Src colorProps={colorProps} />}
    </svg>
}

export default SVGComponentHOC