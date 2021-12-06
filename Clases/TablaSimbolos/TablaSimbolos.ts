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
                if(this.tabla[simbolo.id].getTipo() == simbolo.getTipo() || this.tabla[simbolo.id].getTipo() == TIPO.NULO || simbolo.getTipo() == TIPO.NULO){
                    this.tabla[simbolo.id].setValor(simbolo.getValor());
                    this.tabla[simbolo.id].setTipo(simbolo.getTipo());
                    return null;
                }
                return new Excepcion("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }else{
                this.tabla = this.anterior
            }
            return new Excepcion("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
        }
    }
}