class TablaSimbolos{
    private tabla;
    private anterior:null;

    constructor(anterior){
        this.tabla = {};
        this.anterior = anterior;
    }

    public setTabla(simbolo){
        this.tabla[simbolo.id] = simbolo;
        return null;
    }

    public getTabla(id){
        while(this.tabla != null){
            if(id in this.tabla){
                return this.tabla[id];
            }else{
                this.tabla = this.anterior;
            }
        }
        return null;
    }

    public actualizarTabla(simbolo){
        while(this.tabla != null){
            if(simbolo.id in this.tabla){
                
            }
        }
    }
}