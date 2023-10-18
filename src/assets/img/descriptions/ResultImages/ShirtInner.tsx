import React from 'react'
import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const ShirtInner: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
    return <>
        <defs>
        <linearGradient id="셔츠이너" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="115" y2="250">
                {colorProps}
            </linearGradient>
        </defs>
        <path style={{"fill":"url(#셔츠이너)","stroke":"#0f0e11","strokeLinecap":"round","strokeLinejoin":"round","strokeWidth":"2px"}} d="m101.568,122.454c-3.476,1.031-7.598,1.826-12.058,1.826h-.02c-4.461,0-8.582-.794-12.058-1.826l2.068,7.778v127.939h20v-127.939l2.068-7.778Z"/>
    </>
}

export default ShirtInner