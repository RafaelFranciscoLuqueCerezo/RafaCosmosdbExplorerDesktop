type BackupOperation = {
    sql:string,
    result:any[],
    import:string,
    count: number
}

export class CntOpMap {
    static map:Map<string,BackupOperation> = new Map();

    private static getId(op:Operation):string{
        return op.dbLabel+op.container;
    }

    static innitVariables(id:Operation):void{
        if(this.map.has(this.getId(id))){
            return;
        }
        this.map.set(this.getId(id),{sql:'SELECT * FROM c',result:[],import:'[]',count:0});
    }
    static getSql(id:Operation):string{
        const retrieved = this.map.get(this.getId(id));
        if(retrieved==undefined){
            return '';
        }
        return retrieved.sql;
    }

    static getCount(id:Operation):number{
        const retrieved = this.map.get(this.getId(id));
        if(retrieved==undefined){
            return 0;
        }
        return retrieved.count;
    }

    static getResult(id:Operation):any[]{
        const retrieved = this.map.get(this.getId(id));
        if(retrieved==undefined){
            return [];
        }
        return retrieved.result;
    }

    static getImport(id:Operation):string{
        const retrieved = this.map.get(this.getId(id));
        if(retrieved==undefined){
            return '';
        }
        return retrieved.import;
    }

    static addSql(id:Operation,value:string):void{
        if(this.map.has(this.getId(id))){
            //@ts-ignore
            this.map.get(this.getId(id)).sql = value;
        }
    }

    static addCount(id:Operation,value:number):void{
        if(this.map.has(this.getId(id))){
            //@ts-ignore
            this.map.get(this.getId(id)).count = value;
        }
    }

    static addResult(id:Operation,value:any[]):void{
        if(this.map.has(this.getId(id))){
            //@ts-ignore
            this.map.get(this.getId(id)).result = value;
        }
    }

    static addImport(id:Operation,value:string):void{
        if(this.map.has(this.getId(id))){
            //@ts-ignore
            this.map.get(this.getId(id)).import = value;
        }
    }
}