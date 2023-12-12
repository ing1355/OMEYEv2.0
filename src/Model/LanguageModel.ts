import { atom } from "recoil";

export type LanguageType = "KR" | "ENG"

export const CurrentLang = atom<LanguageType>({
  key: 'lang',
  default: localStorage.getItem('lang') as LanguageType || 'KR',
  effects: [
    ({onSet}) => {
        onSet((newValue, oldValue) => {
            localStorage.setItem('lang', newValue)
            console.debug(`lang state 변화 : (${oldValue} -> ${newValue})`)
        })
    }
  ]
})