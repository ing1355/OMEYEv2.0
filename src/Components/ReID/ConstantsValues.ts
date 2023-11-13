import peopleObjectIcon from '../../assets/img/peopleObjectIcon.png'
import faceObjectIcon from '../../assets/img/faceObjectIcon.png'
import plateObjectIcon from '../../assets/img/plateObjectIcon.png'
import DescriptionMethodIcon from '../../assets/img/DescriptionMethodIcon.png'
import plateEmptyIcon from '../../assets/img/emptyPlateObjectIcon.png'
import faceEmptyIcon from '../../assets/img/FaceEmptyIcon.png'
import personEmptyIcon from '../../assets/img/PersonEmptyIcon.png'
import DescriptionEmptyIcon from '../../assets/img/DescriptionEmptyIcon.png'
import { ReIDObjectTypeKeys } from '../../Constants/GlobalTypes'

export enum ObjectTypes {
    PERSON,
    FACE,
    ATTRIBUTION,
    PLATE
}

export enum ReIDMenuKeys {
  CONDITION,
  CONDITIONLIST,
  REIDRESULT,
  REIDLOGS,
  REALTIMEREID
}

export const ReIDObjectTypeEmptyIcons = [personEmptyIcon, faceEmptyIcon, DescriptionEmptyIcon, plateEmptyIcon]

export const ReIDObjectTypes: {
    key: ReIDObjectTypeKeys
    title: string
    icon: string
}[] = [
    {
        key: ReIDObjectTypeKeys[ObjectTypes['PERSON']],
        title: '사람(전신)',
        icon: peopleObjectIcon
    },
    {
        key: ReIDObjectTypeKeys[ObjectTypes['FACE']],
        title: '사람(얼굴)',
        icon: faceObjectIcon
    },
    {
        key: ReIDObjectTypeKeys[ObjectTypes['ATTRIBUTION']],
        title: '인상착의',
        icon: DescriptionMethodIcon
    },
    {
        key: ReIDObjectTypeKeys[ObjectTypes['PLATE']],
        title: '번호판',
        icon: plateObjectIcon
    }
]

export const ConditionDataFormColumnTitleHeight = 36