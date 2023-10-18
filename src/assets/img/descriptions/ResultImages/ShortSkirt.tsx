import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const ShortSkirt: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
	return <>
		<defs>
			<style>
				{`
                .shortSkirtCls-1{fill:url(#짧은치마-4);}.shortSkirtCls-1,.shortSkirtCls-2,.shortSkirtCls-3,.shortSkirtCls-4,.shortSkirtCls-5,.shortSkirtCls-6,.shortSkirtCls-7{stroke:#0f0e11;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.shortSkirtCls-2{fill:url(#짧은치마-5);}.shortSkirtCls-3{fill:url(#짧은치마-7);}.shortSkirtCls-4{fill:url(#짧은치마-3);}.shortSkirtCls-5{fill:url(#짧은치마-6);}.shortSkirtCls-6{fill:url(#짧은치마);}.shortSkirtCls-7{fill:url(#짧은치마-2);}
                `}
			</style>
			<linearGradient id="짧은치마" gradientUnits="userSpaceOnUse" x1="39.635" x2="139.365" y1="269.814" y2="269.814">
				{colorProps}
			</linearGradient>
			<linearGradient id="짧은치마-2" x1="124.131" x2="135.101" y1="261.179" y2="261.179" xlinkHref="#짧은치마" />
			<linearGradient id="짧은치마-3" x1="116.304" x2="124.131" y1="255.526" y2="255.526" xlinkHref="#짧은치마" />
			<linearGradient id="짧은치마-4" x1="114.85" x2="116.304" y1="247.501" y2="247.501" xlinkHref="#짧은치마" />
			<linearGradient id="짧은치마-5" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="124.131" x2="135.101" y1="261.179" y2="261.179" xlinkHref="#짧은치마" />
			<linearGradient id="짧은치마-6" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="116.304" x2="124.131" y1="255.526" y2="255.526" xlinkHref="#짧은치마" />
			<linearGradient id="짧은치마-7" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="114.85" x2="116.304" y1="247.501" y2="247.501" xlinkHref="#짧은치마" />
		</defs>
		<path className="shortSkirtCls-6" d="m45.539,243.898h86.898m-92.803,62.524l6.914-73.217h85.902l6.914,73.217H39.635Z" />
		<path className="shortSkirtCls-7" d="m124.131,259.948c2.717,1.566,5.869,2.462,9.23,2.462.587,0,1.168-.027,1.741-.081" />
		<path className="shortSkirtCls-4" d="m116.304,251.104c1.578,3.732,4.345,6.838,7.827,8.844" />
		<path className="shortSkirtCls-1" d="m114.85,243.898c0,2.556.518,4.991,1.455,7.205" />
		<path className="shortSkirtCls-2" d="m54.961,259.948c-2.717,1.566-5.869,2.462-9.23,2.462-.587,0-1.168-.027-1.741-.081" />
		<path className="shortSkirtCls-5" d="m62.787,251.104c-1.578,3.732-4.345,6.838-7.827,8.844" />
		<path className="shortSkirtCls-3" d="m64.242,243.898c0,2.556-.518,4.991-1.455,7.205" />
	</>
}

export default ShortSkirt