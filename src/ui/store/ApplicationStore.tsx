import { create } from 'zustand';

export interface Store {
    url:Page,
    connections: AddConnectionType[],
    activeOperation:Operation,
    operations: Operation[],
    navigateTo:(url:Page)=>void,
    changeActiveOperation:(operation:Operation)=>void,
    addConnection:(connection:AddConnectionType)=>void,
    addOperation:(operation:Operation)=>void,
    initConnections:(connections:AddConnectionType[])=>void,
    removeConnection:(position:number)=>void,
    removeOperation:(operation:Operation)=>void,
}
export enum Page {
    ADD_CONNECTION = 'ADD_CONNECTION',
    OPERATION = 'OPERATION',
    BLANK = 'BLANK'
}
export const useAppStore = create<Store>((set) => ({
    url: Page.BLANK,
    operations:[],
    activeOperation:{dbLabel:'',container:'',type:'NONE'},
    //llamar y recuperar del fichero
    connections: [],
    navigateTo: (url:Page) => set(()=>({url})),
    changeActiveOperation:(op:Operation)=>set(()=>({activeOperation:op})),
    addOperation: (op:Operation)=>set((state)=>{
        //to avoid multiples equals inserts
        const duplicatedOperation = state.operations.find((element:Operation)=>element.container == op.container && element.dbLabel == op.dbLabel);
        if(duplicatedOperation){
            return{activeOperation:op,url:Page.OPERATION};
        } else {
            return {operations:[...state.operations,op],url:Page.OPERATION,activeOperation:op};
        }
    }
    ),
    removeOperation: (op:Operation)=>set((state)=>{
        const arrayAfterRemove = state.operations.filter((value)=>!(value.container==op.container&&value.dbLabel==op.dbLabel));
        const newActiveOperation:Operation = arrayAfterRemove.length == 0 ? {dbLabel:'',container:'',type:'NONE'} : arrayAfterRemove[0] ;
        return {url:Page.OPERATION,activeOperation:newActiveOperation,operations:arrayAfterRemove}
    }),
    addConnection: (connection:AddConnectionType) => set((state)=>({connections:[...state.connections,connection]})),
    initConnections: (connections:AddConnectionType[]) => set(()=>({connections})),
    removeConnection: (position:number) => set((state)=>{
        const arrayAfterRemove = state.connections.filter((value,index)=>index!=position);
        return {connections:arrayAfterRemove}
    })
  }));