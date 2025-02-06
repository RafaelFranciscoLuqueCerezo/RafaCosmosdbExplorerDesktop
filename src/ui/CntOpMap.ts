type BackupOperation = {
    sql:string,
    result:string,
    import:string
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
        this.map.set(this.getId(id),{sql:'SELECT * FROM c',result:'',import:''});
    }
    static getSql(id:Operation):string{
        const retrieved = this.map.get(this.getId(id));
        if(retrieved==undefined){
            return '';
        }
        return retrieved.sql;
    }

    static getResult(id:Operation):string{
        const retrieved = this.map.get(this.getId(id));
        if(retrieved==undefined){
            return '';
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

    static addResult(id:Operation,value:string):void{
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