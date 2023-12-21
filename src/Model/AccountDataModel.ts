import { atom } from "recoil";

export type roleType = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'DEVELOPER';
export type selectMemberType = {
  id: string;
  username: string;
  role: roleType | null;
  name: string;
  email: string;
  phoneNumber: string;
  organization: string;
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
  // role: 'USER' as roleType,
  role: null,
  name: '',
  email: '',
  phoneNumber: '',
  organization: ''
}

export const ModifySelectMember = atom<selectMemberType>({
  key: 'AccountDataModel/ModifySelectMember',
  default: modifySelectMemberInit
})

export const UpdateMemeberList = atom<boolean>({
  key: 'AccountDataModel/UpdateMemeberList',
  default: false
})