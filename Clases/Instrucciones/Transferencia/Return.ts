import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Errores } from "../../Ast/Errores";

export class Return implements Instruccion{
    public expresion : Instruccion | any;
    public valor : any;
    public tipo : TIPO;
    public fila: number;
    public columna: number;
    public arreglo: boolean;

    constructor(expresion,fila,columna){
        this.expresion = expresion;
        this.fila = fila;
        this.columna =columna;
    }
    

    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        if(this.expresion != null){
            this.valor =  this.expresion.ejecutar(table, tree);
            if(this.valor instanceof Errores)
            {
                return this.valor;
            }
            this.tipo = this.expresion.tipo;
            return this;
        }else{
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    recorrer(): Nodo {
        let padre = new Nodo("RETURN","");
        padre.addChildNode(new Nodo("return",""));
        if(this.valor != null){
            // padre.addChildNode(this.valor.recorrer());
        }
        return padre;
    }

}