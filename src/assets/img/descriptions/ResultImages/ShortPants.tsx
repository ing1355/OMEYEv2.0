import { WithPatternColorsDescriptionItemWrappedProps } from "../../../../Components/Constants/SVGComponentHOC"

const ShortPants: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {

    return <>
        <defs>
            <style>
                {`
                .shortPantsCls-1{fill:url(#짧은바지-4);}.shortPantsCls-1,.shortPantsCls-2,.shortPantsCls-3,.shortPantsCls-4,.shortPantsCls-5,.shortPantsCls-6,.shortPantsCls-7{stroke:#0f0e11;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.shortPantsCls-2{fill:url(#짧은바지-5);}.shortPantsCls-3{fill:url(#짧은바지-7);}.shortPantsCls-4{fill:url(#짧은바지-3);}.shortPantsCls-5{fill:url(#짧은바지-6);}.shortPantsCls-6{fill:url(#짧은바지);}.shortPantsCls-7{fill:url(#짧은바지-2);}
                `}
            </style>
            <linearGradient id="짧은바지" gradientUnits="userSpaceOnUse" x1="49.635" x2="129.365" y1="269.609" y2="269.609">
                {colorProps}
            </linearGradient>
            <linearGradient id="짧은바지-2" x1="124.131" x2="135.101" y1="260.974" y2="260.974" xlinkHref="#짧은바지" />
            <linearGradient id="짧은바지-3" x1="116.304" x2="124.131" y1="255.321" y2="255.321" xlinkHref="#짧은바지" />
            <linearGradient id="짧은바지-4" x1="114.85" x2="116.304" y1="247.297" y2="247.297" xlinkHref="#짧은바지" />
            <linearGradient id="짧은바지-5" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="124.131" x2="135.101" y1="260.974" y2="260.974" xlinkHref="#짧은바지" />
            <linearGradient id="짧은바지-6" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="116.304" x2="124.131" y1="255.321" y2="255.321" xlinkHref="#짧은바지" />
            <linearGradient id="짧은바지-7" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="114.85" x2="116.304" y1="247.297" y2="247.297" xlinkHref="#짧은바지" />
        </defs>
        <path className="shortPantsCls-6" d="m45.539,243.694h86.898m-42.892,0v34.545m-49.911,27.979l6.914-73.217h85.902l6.914,73.217h-45.323l-4.492-27.455h-.1l-4.492,27.455h-45.323Z" />
        <path className="shortPantsCls-7" d="m124.131,259.743c2.717,1.566,5.869,2.462,9.23,2.462.587,0,1.168-.027,1.741-.081" />
        <path className="shortPantsCls-4" d="m116.304,250.899c1.578,3.732,4.345,6.838,7.827,8.844" />
        <path className="shortPantsCls-1" d="m114.85,243.694c0,2.556.518,4.991,1.455,7.205" />
        <path className="shortPantsCls-2" d="m54.961,259.743c-2.717,1.566-5.869,2.462-9.23,2.462-.587,0-1.168-.027-1.741-.081" />
        <path className="shortPantsCls-5" d="m62.787,250.899c-1.578,3.732-4.345,6.838-7.827,8.844" />
        <path className="shortPantsCls-3" d="m64.242,243.694c0,2.556-.518,4.991-1.455,7.205" />
    </>
}

export default ShortPants