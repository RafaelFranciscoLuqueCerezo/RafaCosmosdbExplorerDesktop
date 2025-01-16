import { create } from 'zustand';

export interface Store {
    url:Page,
    navigateTo:(url:Page)=>void
}
export enum Page {
    ADD_CONNECTION = 'ADD_CONNECTION',
    BLANK = 'BLANK'
}
export const ApplicationStore = create<Store>((set) => ({
    url: Page.BLANK,
    navigateTo: (url:Page) => set(()=>({url}))
  }));