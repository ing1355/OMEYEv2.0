import { atom } from "recoil";

export type roleType = 'USER' | 'ADMIN' | 'DEVELOPER';
export type selectMemberType = {
  id: string;
  username: string;
  role: roleType;
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
  role: 'USER' as roleType,
  name: '',
  email: '',
  phoneNumber: '',
}

export const ModifySelectMember = atom<selectMemberType>({
  key: 'AccountDataModel/ModifySelectMember',
  default: modifySelectMemberInit
})