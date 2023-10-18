import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const Shirts: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
	return <>
		<defs>
			<style>
				{`
                .shirtsCls-1{fill:url(#셔츠-8);}.shirtsCls-1,.shirtsCls-2,.shirtsCls-3,.shirtsCls-4,.shirtsCls-5,.shirtsCls-6,.shirtsCls-7,.shirtsCls-8,.shirtsCls-9,.shirtsCls-10,.shirtsCls-11,.shirtsCls-12,.shirtsCls-13,.shirtsCls-14,.shirtsCls-15,.shirtsCls-16{stroke:#0f0e11;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.shirtsCls-2{fill:url(#셔츠-4);}.shirtsCls-3{fill:url(#셔츠-5);}.shirtsCls-4{fill:url(#셔츠-7);}.shirtsCls-5{fill:url(#셔츠-16);}.shirtsCls-6{fill:url(#셔츠-9);}.shirtsCls-7{fill:url(#셔츠-12);}.shirtsCls-8{fill:url(#셔츠-10);}.shirtsCls-9{fill:url(#셔츠-3);}.shirtsCls-10{fill:url(#셔츠-11);}.shirtsCls-11{fill:url(#셔츠-14);}.shirtsCls-12{fill:url(#셔츠-13);}.shirtsCls-13{fill:url(#셔츠-6);}.shirtsCls-14{fill:url(#셔츠);}.shirtsCls-15{fill:url(#셔츠-2);}.shirtsCls-16{fill:url(#셔츠-15);}
                `}
			</style>
			<linearGradient id="셔츠" gradientUnits="userSpaceOnUse" x1="0" x2="178.992" y1="186" y2="186">
				{colorProps}
			</linearGradient>
			<linearGradient id="셔츠-2" x1="46.644" x2="46.83" y1="195.64" y2="195.64" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-3" x1="132.169" x2="132.373" y1="198.029" y2="198.029" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-4" x1="106.706" x2="107.029" y1="184.93" y2="184.93" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-5" x1="106.706" x2="107.029" y1="162.414" y2="162.414" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-6" x1="106.706" x2="107.029" y1="211.869" y2="211.869" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-7" x1="10.697" x2="36.874" y1="234.465" y2="234.465" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-8" x1="142.055" x2="168.145" y1="234.465" y2="234.465" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-9" x1="57.141" x2="76.755" y1="133.962" y2="133.962" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-10" x1="76.755" x2="79.508" y1="137.139" y2="137.139" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-11" x1="99.508" x2="102.262" y1="137.139" y2="137.139" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-12" x1="102.262" x2="121.875" y1="133.962" y2="133.962" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-13" x1="77.441" x2="79.508" y1="126.732" y2="126.732" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-14" x1="79.508" x2="79.508" y1="194.805" y2="194.805" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-15" x1="99.472" x2="101.54" y1="126.732" y2="126.732" xlinkHref="#셔츠" />
			<linearGradient id="셔츠-16" x1="99.472" x2="99.472" y1="194.805" y2="194.805" xlinkHref="#셔츠" />
		</defs>
		<path className="shirtsCls-14" d="m121.418,123.514l-14.46-11.514-3.602,3.764-1.796,6.754.009-.064c-3.476,1.031-7.598,1.826-12.058,1.826h-.02c-4.457,0-8.575-.793-12.05-1.823l-1.78-6.693-3.602-3.764-14.444,11.501c-27.785,10.58-47.607,37.68-47.607,69.393l.074,51.038h27.48v-51.038c0-10.335,3.453-19.791,9.081-27.526.063-.087.123-.177.187-.263,0,0-.092,32.817-.187,61.067v26.299s6.287,7.528,32.865,7.528v-1.828h20v1.828c26.577,0,32.865-7.528,32.865-7.528v-21.52c-.101-29.181-.204-65.846-.204-65.846.07.094.135.192.204.287,5.619,7.731,9.065,17.178,9.065,27.502v51.038h27.496l.058-51.038c0-31.701-19.806-58.792-47.574-69.381Zm-14.55,110.951c-.089,0-.161-.072-.161-.161s.072-.161.161-.161.161.072.161.161-.072.161-.161.161Zm0-22.435c-.089,0-.161-.072-.161-.161s.072-.161.161-.161.161.072.161.161-.072.161-.161.161Zm0-27.02c-.089,0-.161-.036-.161-.081s.072-.081.161-.081.161.036.161.081-.072.081-.161.081Zm0-22.435c-.089,0-.161-.072-.161-.161s.072-.161.161-.161.161.072.161.161-.072.161-.161.161Z" />
		<path className="shirtsCls-15" d="m46.644,165.369v60.804c.095-28.25.187-61.067.187-61.067-.064.086-.123.176-.187.263Z" />
		<path className="shirtsCls-9" d="m132.373,230.953v-65.559c-.069-.095-.134-.193-.204-.287,0,0,.103,36.665.204,65.846Z" />
		<path className="shirtsCls-3" d="m106.868,162.253c-.089,0-.161.072-.161.161s.072.161.161.161.161-.072.161-.161-.072-.161-.161-.161Z" />
		<ellipse className="shirtsCls-2" cx="106.868" cy="184.93" rx=".161" ry=".081" />
		<circle className="shirtsCls-13" cx="106.868" cy="211.869" r=".161" />
		<line className="shirtsCls-4" x1="10.697" x2="36.874" y1="234.465" y2="234.465" />
		<line className="shirtsCls-1" x1="168.145" x2="142.055" y1="234.465" y2="234.465" />
		<line className="shirtsCls-6" x1="57.141" x2="76.755" y1="123.879" y2="144.045" />
		<line className="shirtsCls-8" x1="76.755" x2="79.508" y1="144.045" y2="130.232" />
		<line className="shirtsCls-10" x1="99.508" x2="102.262" y1="130.232" y2="144.045" />
		<line className="shirtsCls-7" x1="102.262" x2="121.875" y1="144.045" y2="123.879" />
		<line className="shirtsCls-12" x1="77.441" x2="79.508" y1="122.457" y2="131.007" />
		<line className="shirtsCls-11" x1="79.508" x2="79.508" y1="131.439" y2="258.172" />
		<line className="shirtsCls-16" x1="101.54" x2="99.472" y1="122.457" y2="131.007" />
		<line className="shirtsCls-5" x1="99.472" x2="99.472" y1="131.439" y2="258.172" />
	</>
}

export default Shirts