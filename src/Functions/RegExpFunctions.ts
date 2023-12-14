const usernameRegex = /^[a-z0-9]{4,16}$/;
const passwordRegex = /(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W]).{8,16}|(?=.*[a-zA-Z])(?=.*[\d]).{10,16}|(?=.*[a-zA-Z])(?=.*[\W]).{10,16}|(?=.*[\d])(?=.*[\W]).{10,16}/;
const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/;
const phoneNumberRegex = /^\d{9,11}$/;
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const usernameTest = (username: string) => usernameRegex.test(username)
export const passwordTest = (password: string) => passwordRegex.test(password)
export const nameTest = (name: string) => nameRegex.test(name)
export const phoneNumberTest = (phoneNumber: string) => phoneNumberRegex.test(phoneNumber)
export const emailTest = (email: string) => emailRegex.test(email)