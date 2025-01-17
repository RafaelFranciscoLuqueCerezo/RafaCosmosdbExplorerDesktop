import { create } from 'zustand';

export interface Store {
    url:Page,
    connections: AddConnectionType[],
    navigateTo:(url:Page)=>void
}
export enum Page {
    ADD_CONNECTION = 'ADD_CONNECTION',
    BLANK = 'BLANK'
}
export const ApplicationStore = create<Store>((set) => ({
    url: Page.BLANK,
    //llamar y recuperar del fichero
    connections: [],
    navigateTo: (url:Page) => set(()=>({url}))
  }));