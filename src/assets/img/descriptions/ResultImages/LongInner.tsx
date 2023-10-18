import React from 'react'

import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const LongInner: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
    return <>
        <defs>
            <linearGradient id="롱이너" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="120" y2="240">
                {colorProps}
            </linearGradient>
        </defs>
        <path style={{ "fill": "url(#롱이너)", "stroke": "#0f0e11", "strokeLinecap": "round", "strokeLinejoin": "round", "strokeWidth": "2px" }} d="m109.429,233.001l-.343-112.513.108-.458.086-.368c-1.029-.225-1.647-.339-1.647-.339,0,0-7.981,5.169-18.154,5.169h-.016s-.016,0-.016,0c-10.174,0-18.154-5.169-18.154-5.169,0,0-.618.113-1.647.339l.086.368.108.458-.343,112.513h39.932Z" />
    </>
}

export default LongInner
