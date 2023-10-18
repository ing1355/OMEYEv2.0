import React from 'react'
import { WithPatternColorsDescriptionItemWrappedProps } from '../../../../Components/Constants/SVGComponentHOC'

const Onepiece: React.FC<WithPatternColorsDescriptionItemWrappedProps> = ({ colorProps }: WithPatternColorsDescriptionItemWrappedProps) => {
    return <>
        <defs>
            <style>
                {`
                .onepieceCls-1{fill:url(#원피스-4);}.onepieceCls-1,.onepieceCls-2,.onepieceCls-3,.onepieceCls-4,.onepieceCls-5,.onepieceCls-6{stroke:#0f0e11;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}.onepieceCls-2{fill:url(#원피스-5);}.onepieceCls-3{fill:url(#원피스-3);}.onepieceCls-4{fill:url(#원피스-6);}.onepieceCls-5{fill:url(#원피스);}.onepieceCls-6{fill:url(#원피스-2);}
                `}
            </style>
            <linearGradient id="원피스" gradientUnits="userSpaceOnUse" x1="10.008" x2="168.992" y1="211.999" y2="211.999">
                {colorProps}
            </linearGradient>
            <linearGradient id="원피스-2" x1="89.5" x2="118.079" y1="148.778" y2="148.778" xlinkHref="#원피스" />
            <linearGradient id="원피스-3" x1="60.921" x2="89.5" y1="148.778" y2="148.778" xlinkHref="#원피스" />
            <linearGradient id="원피스-4" x2="37.563" y1="230.459" y2="230.459" xlinkHref="#원피스" />
            <linearGradient id="원피스-5" x1="141.437" x2="168.992" y1="230.459" y2="230.459" xlinkHref="#원피스" />
            <linearGradient id="원피스-6" x1="46.66" x2="132.341" y1="205.151" y2="205.151" xlinkHref="#원피스" />
        </defs>
        <path className="onepieceCls-5" d="m120.873,123.3l-2.611,3.894h-57.524l-2.611-3.894c-28.055,10.44-48.118,37.686-48.118,69.595v48.731c0,.788.081,1.555.208,2.306h27.138c.127-.752.208-1.519.208-2.306v-48.731c0-10.451,3.527-20.006,9.268-27.789,0,0-.082,13-.171,40.045,0,0-3.748,21.579-7.579,51.976-3.831,30.396-2.338,36.842-2.338,36.842,0,0-.57.768,3.965,1.784,7.014,1.571,19.088,3.734,35.081,4.581,4.298.228,8.869.364,13.712.364s9.414-.136,13.712-.364c15.993-.848,28.067-3.01,35.081-4.582,4.534-1.016,3.964-1.783,3.964-1.783,0,0,1.493-6.445-2.338-36.842-3.831-30.397-7.579-51.976-7.579-51.976h0c-.089-27.044-.172-40.045-.172-40.045,5.741,7.783,9.268,17.338,9.268,27.789v48.731c0,.788.081,1.555.208,2.306h27.138c.127-.752.208-1.519.208-2.306v-11.168h0v-37.564c0-31.909-20.064-59.155-48.119-69.595Zm-53.625,101.806c1.661-9.745,7.198-19.955,7.198-19.955l-7.198,19.955Zm37.306-19.955s5.538,10.21,7.198,19.955l-7.198-19.955Z" />
        <line className="onepieceCls-6" x1="89.5" x2="118.079" y1="170.088" y2="127.468" />
        <line className="onepieceCls-3" x1="60.921" x2="89.5" y1="127.468" y2="170.088" />
        <line className="onepieceCls-1" x1="37.563" x2="10.008" y1="230.459" y2="230.459" />
        <line className="onepieceCls-2" x1="141.437" x2="168.992" y1="230.459" y2="230.459" />
        <line className="onepieceCls-4" x1="46.66" x2="132.341" y1="205.151" y2="205.151" />
    </>
}

export default Onepiece