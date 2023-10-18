import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const LongSkirt: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
	return <>
		<defs>
			<style>
				{`
                .longSkirtCls-1{fill:url(#긴치마-8);}.longSkirtCls-1,.longSkirtCls-2,.longSkirtCls-3,.longSkirtCls-4,.longSkirtCls-5,.longSkirtCls-6,.longSkirtCls-7,.longSkirtCls-8{stroke:#0f0e11;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.longSkirtCls-2{fill:url(#긴치마-4);}.longSkirtCls-3{fill:url(#긴치마-5);}.longSkirtCls-4{fill:url(#긴치마-7);}.longSkirtCls-5{fill:url(#긴치마-3);}.longSkirtCls-6{fill:url(#긴치마-6);}.longSkirtCls-7{fill:url(#긴치마);}.longSkirtCls-8{fill:url(#긴치마-2);}
                `}
			</style>
			<linearGradient id="긴치마" gradientUnits="userSpaceOnUse" x1="31.055" x2="147.945" y1="314.754" y2="314.754">
				{colorProps}
			</linearGradient>
			<linearGradient id="긴치마-2" x1="45.453" x2="133.644" y1="243.876" y2="243.876" xlinkHref="#긴치마" />
			<linearGradient id="긴치마-3" x1="124.131" x2="135.101" y1="261.702" y2="261.702" xlinkHref="#긴치마" />
			<linearGradient id="긴치마-4" x1="116.304" x2="124.131" y1="256.049" y2="256.049" xlinkHref="#긴치마" />
			<linearGradient id="긴치마-5" x1="114.85" x2="116.304" y1="248.024" y2="248.024" xlinkHref="#긴치마" />
			<linearGradient id="긴치마-6" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="124.131" x2="135.101" y1="261.702" y2="261.702" xlinkHref="#긴치마" />
			<linearGradient id="긴치마-7" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="116.304" x2="124.131" y1="256.049" y2="256.049" xlinkHref="#긴치마" />
			<linearGradient id="긴치마-8" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="114.85" x2="116.304" y1="248.024" y2="248.024" xlinkHref="#긴치마" />
		</defs>
		<polygon className="longSkirtCls-7" points="147.945 396.346 132.535 233.162 89.55 233.162 89.45 233.162 46.465 233.162 31.055 396.346 147.945 396.346" />
		<line className="longSkirtCls-8" x1="45.453" x2="133.644" y1="243.876" y2="243.876" />
		<path className="longSkirtCls-5" d="m124.131,260.471c2.717,1.566,5.869,2.462,9.23,2.462.587,0,1.168-.027,1.741-.081" />
		<path className="longSkirtCls-2" d="m116.304,251.627c1.578,3.732,4.345,6.838,7.827,8.844" />
		<path className="longSkirtCls-3" d="m114.85,244.421c0,2.556.518,4.991,1.455,7.205" />
		<path className="longSkirtCls-6" d="m54.961,260.471c-2.717,1.566-5.869,2.462-9.23,2.462-.587,0-1.168-.027-1.741-.081" />
		<path className="longSkirtCls-4" d="m62.787,251.627c-1.578,3.732-4.345,6.838-7.827,8.844" />
		<path className="longSkirtCls-1" d="m64.242,244.421c0,2.556-.518,4.991-1.455,7.205" />
	</>
}

export default LongSkirt