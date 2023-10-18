import React from 'react'

import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const ShortInner: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
    return <>
        <defs>
            <linearGradient id="숏이너" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="115" y2="250">
                {colorProps}
            </linearGradient>
        </defs>
        <polyline style={{"fill":"url(#숏이너)","stroke":"#0f0e11","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"2px"}} points="99.989 121.671 79.011 121.671 83.969 127.854 82.13 144.638 80.027 163.427 70 253.869 109 253.869 98.644 161.045 96.796 144.638 95.031 127.854 100.09 121.671"/>
    </>
}

export default ShortInner
