import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const LongPants: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
	return <>
		<defs>
			<style>
				{`
                .longPantsCls-1{fill:url(#긴바지-4);}.longPantsCls-1,.longPantsCls-2,.longPantsCls-3,.longPantsCls-4,.longPantsCls-5,.longPantsCls-6,.longPantsCls-7{stroke:#0f0e11;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.longPantsCls-2{fill:url(#긴바지-5);}.longPantsCls-3{fill:url(#긴바지-7);}.longPantsCls-4{fill:url(#긴바지-3);}.longPantsCls-5{fill:url(#긴바지-6);}.longPantsCls-6{fill:url(#긴바지);}.longPantsCls-7{fill:url(#긴바지-2);}
                `}
			</style>
			<linearGradient id="긴바지" gradientUnits="userSpaceOnUse" x1="29.898" x2="149.102" y1="322.581" y2="322.581">
			{colorProps}
		</linearGradient>
		<linearGradient id="긴바지-2" x1="124.131" x2="135.101" y1="260.974" y2="260.974" xlinkHref="#긴바지"/>
		<linearGradient id="긴바지-3" x1="116.304" x2="124.131" y1="255.321" y2="255.321" xlinkHref="#긴바지"/>
		<linearGradient id="긴바지-4" x1="114.85" x2="116.304" y1="247.297" y2="247.297" xlinkHref="#긴바지"/>
		<linearGradient id="긴바지-5" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="124.131" x2="135.101" y1="260.974" y2="260.974" xlinkHref="#긴바지"/>
		<linearGradient id="긴바지-6" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="116.304" x2="124.131" y1="255.321" y2="255.321" xlinkHref="#긴바지"/>
		<linearGradient id="긴바지-7" gradientTransform="translate(179.092) rotate(-180) scale(1 -1)" x1="114.85" x2="116.304" y1="247.297" y2="247.297" xlinkHref="#긴바지"/>
		</defs>
		<path className="longPantsCls-6" d="m89.55,233.162h42.664s16.888,178.838,16.888,178.838h-37.738s-21.814-133.329-21.814-133.329h-.1s-21.814,133.329-21.814,133.329H29.898l16.888-178.838h42.664m-43.668,10.634h87.532m-43.769,0v34.354"/>
	<path className="longPantsCls-7" d="m124.131,259.743c2.717,1.566,5.869,2.462,9.23,2.462.587,0,1.168-.027,1.741-.081"/>
	<path className="longPantsCls-4" d="m116.304,250.899c1.578,3.732,4.345,6.838,7.827,8.844"/>
	<path className="longPantsCls-1" d="m114.85,243.694c0,2.556.518,4.991,1.455,7.205"/>
	<path className="longPantsCls-2" d="m54.961,259.743c-2.717,1.566-5.869,2.462-9.23,2.462-.587,0-1.168-.027-1.741-.081"/>
	<path className="longPantsCls-5" d="m62.787,250.899c-1.578,3.732-4.345,6.838-7.827,8.844"/>
	<path className="longPantsCls-3" d="m64.242,243.694c0,2.556-.518,4.991-1.455,7.205"/>
	</>
}

export default LongPants