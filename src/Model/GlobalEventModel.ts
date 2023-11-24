import { atom } from "recoil";

export const AllMenuStateInitEvent = atom<boolean>({
  key: 'allMenu/event',
  default: false
})