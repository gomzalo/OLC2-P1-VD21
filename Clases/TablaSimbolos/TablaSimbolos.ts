import Simbolo from "./Simbolo";
import { TIPO } from "./Tipo";

export class TablaSimbolos{

    public anterior: TablaSimbolos;
    public tabla: Map<string, Simbolo>;

    constructor(anterior : TablaSimbolos){
        this.anterior = anterior;
        this.tabla = new Map<string, Simbolo>();
    }

    public setTabla(simbolo: Simbolo){
        this.tabla[simbolo.getId()] = simbolo;
        return null;
    }

    public getTabla(id: string){
        let tablaActual: TablaSimbolos = this;
        while(tablaActual != null){
            let existe = tablaActual.tabla.get(id);
            if(existe != null){
                return tablaActual.tabla[id];
            }else{
                tablaActual = this.anterior;
            }
        }
        return null;
    }

    public actualizarTabla(simbolo){
        let tablaActual: TablaSimbolos = this;
        while(tablaActual != null){
            if(simbolo.id in tablaActual.tabla){
                if(tablaActual.tabla[simbolo.id].getTipo() == simbolo.getTipo() || this.tabla[simbolo.id].getTipo() == TIPO.NULO || simbolo.getTipo() == TIPO.NULO){
                    tablaActual.tabla[simbolo.id].setValor(simbolo.getValor());
                    tablaActual.tabla[simbolo.id].setTipo(simbolo.getTipo());
                    return null;
                }
                return new Excepcion("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }else{
                tablaActual = this.anterior
            }
            return new Excepcion("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
        }
    }
}