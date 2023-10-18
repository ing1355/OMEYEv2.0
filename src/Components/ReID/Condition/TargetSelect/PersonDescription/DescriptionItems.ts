import { descriptionColorType, descriptionDataType, descriptionPatternType } from "./DescriptionType"
import manIcon from '../../../../../assets/img/descriptions/man.png'
import womanIcon from '../../../../../assets/img/descriptions/woman.png'
import childIcon from '../../../../../assets/img/descriptions/child.png'
import youngIcon from '../../../../../assets/img/descriptions/young.png'
import oldIcon from '../../../../../assets/img/descriptions/old.png'
import glassesIcon from '../../../../../assets/img/descriptions/glasses.png'
import glassesResultIcon from '../../../../../assets/img/descriptions/ResultImages/glasses.png'
// import { ReactComponent as glassesSVG} from '../../../../../assets/img/descriptions/ResultImages/glasses.svg'
import sunglassesIcon from '../../../../../assets/img/descriptions/sunglasses.png'
import sunglassesResultIcon from '../../../../../assets/img/descriptions/ResultImages/sunglasses.png'
import baldHairIcon from '../../../../../assets/img/descriptions/baldHair.png'
import baldHairResultIcon from '../../../../../assets/img/descriptions/ResultImages/baldHair.png'
import shortHairIcon from '../../../../../assets/img/descriptions/shortHair.png'
import shortHairResultIcon from '../../../../../assets/img/descriptions/ResultImages/shortHair.png'
// import { ReactComponent as shortHairSVG } from '../../../../../assets/img/descriptions/ResultImages/shortHair.svg'
import longHairIcon from '../../../../../assets/img/descriptions/longHair.png'
import longHairResultIcon from '../../../../../assets/img/descriptions/ResultImages/longHair.png'
import mediumHairIcon from '../../../../../assets/img/descriptions/mediumHair.png'
import mediumHairResultIcon from '../../../../../assets/img/descriptions/ResultImages/mediumHair.png'
import hatIcon from '../../../../../assets/img/descriptions/hat.png'
import hatResultIcon from '../../../../../assets/img/descriptions/ResultImages/hat.png'
import helmetIcon from '../../../../../assets/img/descriptions/helmet.png'
import helmetResultIcon from '../../../../../assets/img/descriptions/ResultImages/helmet.png'
import ponytailIcon from '../../../../../assets/img/descriptions/ponytail.png'
import ponytailResultIcon from '../../../../../assets/img/descriptions/ResultImages/ponytail.png'
import shortOuterIcon from '../../../../../assets/img/descriptions/shortOuter.png'
import longOuterIcon from '../../../../../assets/img/descriptions/longOuter.png'
import onepieceIcon from '../../../../../assets/img/descriptions/onepiece.png'
import shirtIcon from '../../../../../assets/img/descriptions/shirt.png'
import sleevelessIcon from '../../../../../assets/img/descriptions/sleeveless.png'
import shortsleeveIcon from '../../../../../assets/img/descriptions/shortsleeve.png'
import longsleeveIcon from '../../../../../assets/img/descriptions/longsleeve.png'
import patternIcon from '../../../../../assets/img/descriptions/pattern.png'
import plainIcon from '../../../../../assets/img/descriptions/plain.png'
import stripeIcon from '../../../../../assets/img/descriptions/stripe.png'
import printingIcon from '../../../../../assets/img/descriptions/printing.png'
import colorBlockingIcon from '../../../../../assets/img/descriptions/colorBlocking.png'
import checkedIcon from '../../../../../assets/img/descriptions/checked.png'
import shortPantsIcon from '../../../../../assets/img/descriptions/shortPants.png'
import shortSkirtIcon from '../../../../../assets/img/descriptions/shortSkirt.png'
import longPantsIcon from '../../../../../assets/img/descriptions/longPants.png'
import longSkirtIcon from '../../../../../assets/img/descriptions/longSkirt.png'
import sneakersIcon from '../../../../../assets/img/descriptions/sneakers.png'
import sneakersResultIcon from '../../../../../assets/img/descriptions/ResultImages/sneakers.png'
// import {ReactComponent as sneakersSVG} from '../../../../../assets/img/descriptions/ResultImages/sneakers.svg'
import bootsIcon from '../../../../../assets/img/descriptions/boots.png'
import bootsResultIcon from '../../../../../assets/img/descriptions/ResultImages/boots.png'
import slipperIcon from '../../../../../assets/img/descriptions/slipper.png'
import slipperResultIcon from '../../../../../assets/img/descriptions/ResultImages/slipper.png'
import maskIcon from '../../../../../assets/img/descriptions/mask.png'
import maskResultIcon from '../../../../../assets/img/descriptions/ResultImages/mask.png'
// import {ReactComponent as maskSVG} from '../../../../../assets/img/descriptions/ResultImages/mask.svg'
import caneIcon from '../../../../../assets/img/descriptions/cane.png'
import crutchIcon from '../../../../../assets/img/descriptions/crutch.png'
import walkingframeIcon from '../../../../../assets/img/descriptions/walkingframe.png'
import wheelchairIcon from '../../../../../assets/img/descriptions/wheelchair.png'
import bagIcon from '../../../../../assets/img/descriptions/bag.png'
import backpackIcon from '../../../../../assets/img/descriptions/backpack.png'
import carrierIcon from '../../../../../assets/img/descriptions/carrier.png'

import { CSSProperties } from "react"
import ShortOuter from "../../../../../assets/img/descriptions/ResultImages/ShortOuter"
import { WithPatternColorsDescriptionItemWrappedProps } from "../../../../Constants/SVGComponentHOC"
import ShortPants from "../../../../../assets/img/descriptions/ResultImages/ShortPants"
import LongOuter from "../../../../../assets/img/descriptions/ResultImages/LongOuter"
import ShortSkirt from "../../../../../assets/img/descriptions/ResultImages/ShortSkirt"
import LongPants from "../../../../../assets/img/descriptions/ResultImages/LongPants"
import LongSkirt from "../../../../../assets/img/descriptions/ResultImages/LongSkirt"
import Onepiece from "../../../../../assets/img/descriptions/ResultImages/Onepiece"
import Shirts from "../../../../../assets/img/descriptions/ResultImages/Shirts"

type descriptionValueType<MainKey extends keyof descriptionDataType, SubKey extends keyof descriptionDataType[MainKey]> = descriptionDataType[MainKey][SubKey];

export type DescriptionColorItemType = {
    title: string;
    key: descriptionColorType[]
    value: string
}

export type DescriptionItemType<MainKey extends keyof descriptionDataType, SubKey extends keyof descriptionDataType[MainKey]> = {
    title: string;
    key: descriptionValueType<MainKey, SubKey>;
    value?: string
    subscription?: string
    icon?: string;
    resultIcon?: string;
    svgIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    SvgComponent?: React.FC<WithPatternColorsDescriptionItemWrappedProps>
};
export const ColorItems: DescriptionColorItemType[] = [
        {
            title: '빨강',
            key: ['red'],
            value: '#E50E0E'
        },
        {
            title: '주황',
            key: ['orange'],
            value: '#EF7726'
        },
        {
            title: '노랑',
            key: ['yellow'],
            value: '#FFD527'
        },
        {
            title: '초록',
            key: ['green'],
            value: '#2EAF2E'
        },
        {
            title: '베이지',
            key: ['beige'],
            value: '#d4b886'
        },
        {
            title: '분홍',
            key: ['pink'],
            value: '#fecfd9'
        },
        {
            title: '파랑',
            key: ['blue'],
            value: '#1B3FEF'
        },
        {
            title: '네이비',
            key: ['navy'],
            value: '#162743'
        },
        {
            title: '갈색',
            key: ['brown'],
            value: '#722F12'
        },
        {
            title: '보라',
            key: ['purple'],
            value: '#7721DB'
        },
        {
            title: '흰색',
            key: ['white'],
            value: '#FFFFFF'
        },
        {
            title: '회색',
            key: ['gray'],
            value: '#727272'
        },
        {
            title: '검정',
            key: ['black'],
            value: '#0C0C0C'
        }
    ]

export type OuterShapeTypes = DescriptionItemType<"outer","shape">['key']
export type OuterTypeTypes = DescriptionItemType<"outer","type">['key']

export const PatternItems: {
    title: string;
    key: descriptionPatternType
    icon?: string;
}[] = [
        {
            title: '무지',
            key: 'plain',
            icon: plainIcon
        },
        {
            title: '체크',
            key: 'checked',
            icon: checkedIcon
        },
        {
            title: '스트라이프',
            key: 'stripe',
            icon: stripeIcon
        },
        {
            title: '프린팅',
            key: 'printing',
            icon: printingIcon
        },
        {
            title: '컬러블러킹',
            key: 'colorblocking',
            icon: colorBlockingIcon
        }
    ]

const descriptionSelectItems: {
    [mainKey in keyof descriptionDataType]: {
        [subKey in keyof descriptionDataType[mainKey]]: {
            title: string
            flex?: CSSProperties['flex']
            items: DescriptionItemType<mainKey, subKey>[]
        }
    }
} = {
    general: {
        gender: {
            title: '성별',
            flex: '25%',
            items: [
                {
                    title: '남자',
                    key: 'male',
                    icon: manIcon
                },
                {
                    title: '여자',
                    key: 'female',
                    icon: womanIcon
                }
            ]
        },
        // age: {
        //     title: '나이',
        //     flex: '16%',
        //     items: [
        //         {
        //             title: '유아·어린이',
        //             key: 'child',
        //             icon: childIcon
        //         },
        //         {
        //             title: '청소년·성인',
        //             key: 'young',
        //             icon: youngIcon
        //         },
        //         {
        //             title: '노인',
        //             key: 'old',
        //             icon: oldIcon
        //         }
        //     ]
        // },
        hair: {
            title: '헤어',
            flex: '14%',
            items: [
                {
                    title: '짧은 머리',
                    key: 'shorthair',
                    icon: shortHairIcon,
                    resultIcon: shortHairResultIcon
                },
                {
                    title: '단발 머리',
                    key: 'bobbedhair',
                    icon: mediumHairIcon,
                    resultIcon: mediumHairResultIcon
                },
                {
                    title: '긴 머리',
                    key: 'longhair',
                    icon: longHairIcon,
                    resultIcon: longHairResultIcon
                },
                {
                    title: '묶은 머리',
                    key: 'ponytail',
                    icon: ponytailIcon,
                    resultIcon: ponytailResultIcon
                },
                {
                    title: '민머리',
                    key: 'bald',
                    icon: baldHairIcon,
                    resultIcon: baldHairResultIcon
                },
                {
                    title: '헬멧',
                    key: 'helmet',
                    icon: helmetIcon,
                    resultIcon: helmetResultIcon
                },
                {
                    title: '모자',
                    key: 'hat',
                    icon: hatIcon,
                    resultIcon: hatResultIcon
                }
            ]
        }
    },
    outer: {
        type: {
            title: '종류',
            items: [
                {
                    title: '짧은 외투',
                    key: 'shortouter',
                    icon: shortOuterIcon,
                    SvgComponent: ShortOuter
                },
                {
                    title: '긴 외투',
                    key: 'longouter',
                    icon: longOuterIcon,
                    SvgComponent: LongOuter
                },
                {
                    title: '원피스',
                    key: 'onepiece',
                    icon: onepieceIcon,
                    SvgComponent: Onepiece
                },
                {
                    title: '셔츠·티셔츠',
                    key: 'shirt',
                    icon: shirtIcon,
                    SvgComponent: Shirts
                }
            ]
        },
        shape: {
            title: '소매 길이',
            items: [
                {
                    title: '긴소매',
                    key: 'longsleeve',
                    icon: longsleeveIcon
                },
                {
                    title: '반소매',
                    key: 'shortsleeve',
                    icon: shortsleeveIcon
                },
                {
                    title: '민소매',
                    key: 'sleeveless',
                    icon: sleevelessIcon
                }
            ]
        },
        pattern: {
            title: '패턴',
            items: PatternItems
        },
        color: {
            title: '색상',
            items: ColorItems
        }
    },
    inner: {
        pattern: {
            title: '패턴',
            items: PatternItems
        },
        color: {
            title: '색상',
            items: ColorItems
        }
    },
    bottom: {
        type: {
            title: '종류',
            items: [
                {
                    title: '짧은 바지',
                    key: 'shortpants',
                    icon: shortPantsIcon,
                    SvgComponent: ShortPants
                },
                {
                    title: '긴 바지',
                    key: 'longpants',
                    icon: longPantsIcon,
                    SvgComponent: LongPants
                },
                {
                    title: '짧은 치마',
                    key: 'shortskirt',
                    icon: shortSkirtIcon,
                    SvgComponent: ShortSkirt
                },
                {
                    title: '긴 치마',
                    key: 'longskirt',
                    icon: longSkirtIcon,
                    SvgComponent: LongSkirt
                },
            ]
        },
        pattern: {
            title: '패턴',
            items: [
                {
                    title: '무지',
                    key: 'plain',
                    icon: plainIcon
                },
                {
                    title: '패턴',
                    key: 'pattern',
                    icon: patternIcon
                }
            ]
        },
        color: {
            title: '색상',
            items: ColorItems
        }
    },
    shoes: {
        type: {
            title: '종류',
            items: [
                {
                    title: '운동화·구두',
                    subscription: '(발목 아래)',
                    key: 'sneakers',
                    icon: sneakersIcon,
                    resultIcon: sneakersResultIcon
                },
                {
                    title: '운동화·부츠',
                    subscription: '(발목 위)',
                    key: 'boots',
                    icon: bootsIcon,
                    resultIcon: bootsResultIcon
                },
                {
                    title: '슬리퍼',
                    key: 'slipper',
                    icon: slipperIcon,
                    resultIcon: slipperResultIcon
                }
            ]
        }
    },
    etc: {
        mask: {
            title: '마스크 착용 여부',
            items: [
                {
                    title: '마스크 착용',
                    key: 'mask',
                    icon: maskIcon,
                    resultIcon: maskResultIcon
                }
            ]
        },
        glasses: {
            title: '안경 종류',
            items: [
                {
                    title: '안경',
                    key: 'glasses',
                    icon: glassesIcon,
                    resultIcon: glassesResultIcon
                },
                {
                    title: '선글라스',
                    key: 'sunglasses',
                    icon: sunglassesIcon,
                    resultIcon: sunglassesResultIcon
                }
            ]
        },
        bag: {
            title: '가방 종류',
            items: [
                {
                    title: '백팩',
                    key: 'backpack',
                    icon: backpackIcon
                },
                {
                    title: '캐리어',
                    key: 'carrier',
                    icon: carrierIcon
                },
                {
                    title: '그 외 가방',
                    key: 'bag',
                    icon: bagIcon
                }
            ]
        },
        walkingaids: {
            title: '보행 보조기구',
            items: [
                {
                    title: '지팡이',
                    key: 'cane',
                    icon: caneIcon
                },
                {
                    title: '목발',
                    key: 'crutch',
                    icon: crutchIcon
                },
                {
                    title: '보행기',
                    key: 'walkingframe',
                    icon: walkingframeIcon
                },
                {
                    title: '휠체어',
                    key: 'wheelchair',
                    icon: wheelchairIcon
                }
            ]
        }
    }
}

export const descriptionItemLabels = {
    red: ColorItems[0].title,
    orange: ColorItems[1].title,
    yellow: ColorItems[2].title,
    green: ColorItems[3].title,
    beige: ColorItems[4].title,
    pink: ColorItems[5].title,
    blue: ColorItems[6].title,
    navy: ColorItems[7].title,
    brown: ColorItems[8].title,
    purple: ColorItems[9].title,
    white: ColorItems[10].title,
    gray: ColorItems[11].title,
    black: ColorItems[12].title,
    checked: PatternItems[1].title,
    stripe: PatternItems[2].title,
    printing: PatternItems[3].title,
    colorblocking: PatternItems[4].title,
    male: descriptionSelectItems['general']['gender']['items'][0]['title'],
    female: descriptionSelectItems['general']['gender']['items'][0]['title'],
    // child: descriptionSelectItems['general']['age']['items'][0]['title'],
    // young: descriptionSelectItems['general']['age']['items'][1]['title'],
    // old: descriptionSelectItems['general']['age']['items'][2]['title'],
    shorthair: descriptionSelectItems['general']['hair']['items'][0]['title'],
    bobbedhair: descriptionSelectItems['general']['hair']['items'][1]['title'],
    longhair: descriptionSelectItems['general']['hair']['items'][2]['title'],
    ponytail: descriptionSelectItems['general']['hair']['items'][3]['title'],
    bald: descriptionSelectItems['general']['hair']['items'][4]['title'],
    helmet: descriptionSelectItems['general']['hair']['items'][5]['title'],
    hat: descriptionSelectItems['general']['hair']['items'][6]['title'],
    shortouter: descriptionSelectItems['outer']['type']['items'][0]['title'],
    longouter: descriptionSelectItems['outer']['type']['items'][1]['title'],
    onepiece: descriptionSelectItems['outer']['type']['items'][2]['title'],
    shirt: descriptionSelectItems['outer']['type']['items'][3]['title'],
    longsleeve: descriptionSelectItems['outer']['shape']['items'][0]['title'],
    shortsleeve: descriptionSelectItems['outer']['shape']['items'][1]['title'],
    sleeveless: descriptionSelectItems['outer']['shape']['items'][2]['title'],
    longskirt: descriptionSelectItems['bottom']['type']['items'][3]['title'],
    shortskirt: descriptionSelectItems['bottom']['type']['items'][2]['title'],
    longpants: descriptionSelectItems['bottom']['type']['items'][1]['title'],
    shortpants: descriptionSelectItems['bottom']['type']['items'][0]['title'],
    plain: descriptionSelectItems['bottom']['pattern']['items'][0]['title'],
    pattern: descriptionSelectItems['bottom']['pattern']['items'][1]['title'],
    sneakers: descriptionSelectItems['shoes']['type']['items'][0]['title'],
    boots: descriptionSelectItems['shoes']['type']['items'][1]['title'],
    slipper: descriptionSelectItems['shoes']['type']['items'][2]['title'],
    mask: descriptionSelectItems['etc']['mask']['items'][0]['title'],
    glasses: descriptionSelectItems['etc']['glasses']['items'][0]['title'],
    sunglasses: descriptionSelectItems['etc']['glasses']['items'][1]['title'],
    backpack: descriptionSelectItems['etc']['bag']['items'][0]['title'],
    carrier: descriptionSelectItems['etc']['bag']['items'][1]['title'],
    bag: descriptionSelectItems['etc']['bag']['items'][2]['title'],
    cane: descriptionSelectItems['etc']['walkingaids']['items'][0]['title'],
    crutch: descriptionSelectItems['etc']['walkingaids']['items'][1]['title'],
    walkingframe: descriptionSelectItems['etc']['walkingaids']['items'][2]['title'],
    wheelchair: descriptionSelectItems['etc']['walkingaids']['items'][3]['title'],
}

export type descriptionItemLabelsKeyType = keyof typeof descriptionItemLabels

export default descriptionSelectItems