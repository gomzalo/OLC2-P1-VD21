import { Errores } from "../Ast/Errores";
import { Simbolo } from "./Simbolo";
import { TIPO } from "./Tipo";

export class TablaSimbolos{

    public anterior: TablaSimbolos;
    public tabla: Map<string, Simbolo>;

    constructor(anterior : TablaSimbolos){
        this.anterior = anterior;
        this.tabla = new Map<string, Simbolo>();
    }

    public setSymbolTabla(simbolo: Simbolo){
        if (this.existeEnActual(simbolo.id)){
            console.log("Entreeeeee")
            return new Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }else{
            // this.tabla[simbolo.getId()] = simbolo;
            this.tabla.set(simbolo.getId(),simbolo);
            console.log("set simbolo " +  simbolo.getId() + " " + simbolo.getValor())
        }
        return null;
    }

    public existeEnActual(id: string): boolean{
        let entorno : TablaSimbolos = this;

        let existe = entorno.tabla.get(id);
        if(existe != null){
            return true;
        }
        return false;
    }

    public getSymbolTabla(id: string): Simbolo{
        let tablaActual: TablaSimbolos = this;
        while(tablaActual != null){
            let existe = tablaActual.tabla.get(id);
            if(existe != null){
                return existe;
            }else{
                tablaActual = this.anterior;
            }
        }
        return null;
    }

    public updateSymbolTabla(simbolo){
        let tablaActual: TablaSimbolos = this;
        while(tablaActual != null){
            if(simbolo.id in tablaActual.tabla){
                // validacion DE TIPO
                if(tablaActual.tabla[simbolo.id].getTipo() == simbolo.getTipo() ){
                    tablaActual.tabla[simbolo.id].setValor(simbolo.getValor());
                    tablaActual.tabla[simbolo.id].setTipo(simbolo.getTipo());

                    // AGREGAR STRUCT ACA

                    return null;
                }
                return new Errores("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }else{
                tablaActual = this.anterior
            }
            return new Errores("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
        }
    }
}