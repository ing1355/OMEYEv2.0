import React from 'react'

import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const OnepieceInner: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
    return <>
        <defs>
            <linearGradient id="원피스이너" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="130" y2="165">
                {colorProps}
            </linearGradient>
        </defs>
        <path style={{ "fill": "url(#원피스이너)", "stroke": "#0f0e11", "strokeLinecap": "round", "strokeLinejoin": "round", "strokeWidth": "2px" }} d="m118.07,127.468c-.26-.097-.526-.18-.788-.274h-55.582c-.261.094-.528.177-.787.273l28.579,42.621,28.579-42.621Z" />
    </>
}

export default OnepieceInner
