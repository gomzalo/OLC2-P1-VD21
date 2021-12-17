import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
// import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { OperadorLogico, TIPO } from "../../TablaSimbolos/Tipo";
import { Errores } from '../../Ast/Errores';
import { Instruccion } from "../../Interfaces/Instruccion";
import { setFlagsFromString } from "v8";

export class Copiar implements Instruccion{
    public tipo: TIPO;
    public id;
    fila: number;
    columna: number;
    arreglo: boolean;
    
    public constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("COPARR: " + this.id);
        let simbolo = table.getSymbolTabla(this.id.toString());
        if(simbolo != null){
            if(simbolo.getArreglo()){
                this.tipo = simbolo.getTipo();
                return simbolo.getValor();
            }else{
                return new Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented COPIAR.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("Copiar","");
        padre.addChildNode(new Nodo(this.id,""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}