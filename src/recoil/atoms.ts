import { atom } from "recoil";

export const modalOn=atom<boolean>({
    key:'modalOnState',
    default:false
})