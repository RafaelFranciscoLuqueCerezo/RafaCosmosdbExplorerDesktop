import { create } from 'zustand';

export interface Store {
    url:Page,
    connections: AddConnectionType[],
    navigateTo:(url:Page)=>void,
    addConnection:(connection:AddConnectionType)=>void,
    initConnections:(connections:AddConnectionType[])=>void,
    removeConnection:(position:number)=>void,
}
export enum Page {
    ADD_CONNECTION = 'ADD_CONNECTION',
    BLANK = 'BLANK'
}
export const useAppStore = create<Store>((set) => ({
    url: Page.BLANK,
    //llamar y recuperar del fichero
    connections: [],
    navigateTo: (url:Page) => set(()=>({url})),
    addConnection: (connection:AddConnectionType) => set((state)=>({connections:[...state.connections,connection]})),
    initConnections: (connections:AddConnectionType[]) => set(()=>({connections})),
    removeConnection: (position:number) => set((state)=>{
        const arrayAfterRemove = state.connections.filter((value,index)=>index!=position);
        return {connections:arrayAfterRemove}
    })
  }));