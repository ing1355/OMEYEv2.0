import peopleObjectIcon from '../../assets/img/peopleObjectIcon.png'
import faceObjectIcon from '../../assets/img/faceObjectIcon.png'
import plateObjectIcon from '../../assets/img/plateObjectIcon.png'

export enum ReIDMenuKeys {
    CONDITION,
    CONDITIONLIST,
    REIDRESULT,
    REIDLOGS,
    REALTIMEREID
}

export type ReIDMenuKeysType = keyof typeof ReIDMenuKeys
export type ReIDObjectTypeKeys = 'Person' | 'Face' | 'car_plate'

export const ReIDObjectTypeKeys: ReIDObjectTypeKeys[] = ["Person", "Face", "car_plate"]

export const ReIDObjectTypes: {
    key: ReIDObjectTypeKeys
    title: string
    icon: string
}[] = [
    {
        key: 'Person',
        title: '사람(전신)',
        icon: peopleObjectIcon
    },
    {
        key: 'Face',
        title: '사람(얼굴)',
        icon: faceObjectIcon
    },
    {
        key: 'car_plate',
        title: '번호판',
        icon: plateObjectIcon
    }
]

export const ConditionDataFormColumnTitleHeight = 36