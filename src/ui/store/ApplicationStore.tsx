import { create } from 'zustand';

export interface Store {
    url:Page,
    connections: AddConnectionType[],
    operations: Operation[],
    navigateTo:(url:Page)=>void,
    addConnection:(connection:AddConnectionType)=>void,
    addOperation:(operation:Operation)=>void,
    initConnections:(connections:AddConnectionType[])=>void,
    removeConnection:(position:number)=>void,
}
export enum Page {
    ADD_CONNECTION = 'ADD_CONNECTION',
    OPERATION = 'OPERATION',
    BLANK = 'BLANK'
}
export const useAppStore = create<Store>((set) => ({
    url: Page.BLANK,
    operations:[],
    //llamar y recuperar del fichero
    connections: [],
    navigateTo: (url:Page) => set(()=>({url})),
    addOperation: (op:Operation)=>set((state)=>({operations:[...state.operations,op],url:Page.OPERATION})),
    removeOperation: (op:Operation)=>set((state)=>{
        const arrayAfterRemove = state.operations.filter((value)=>value.container!=op.container&&value.dbLabel!=op.dbLabel);
        return {operations:arrayAfterRemove,url:Page.OPERATION}
    }),
    addConnection: (connection:AddConnectionType) => set((state)=>({connections:[...state.connections,connection]})),
    initConnections: (connections:AddConnectionType[]) => set(()=>({connections})),
    removeConnection: (position:number) => set((state)=>{
        const arrayAfterRemove = state.connections.filter((value,index)=>index!=position);
        return {connections:arrayAfterRemove}
    })
  }));