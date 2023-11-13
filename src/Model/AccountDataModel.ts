import { atom } from "recoil";

export type selectMemberType = {
  id: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export const IsAddMember = atom<boolean>({
  key: 'AccountDataModel/IsAddMember',
  default: false
})

export const IsModifyMember = atom<boolean>({
  key: 'AccountDataModel/IsModifyMember',
  default: false
})

export const modifySelectMemberInit = {
  id: '',
  username: '',
  name: '',
  email: '',
  phoneNumber: '',
}

export const ModifySelectMember = atom<selectMemberType>({
  key: 'AccountDataModel/ModifySelectMember',
  default: modifySelectMemberInit
})