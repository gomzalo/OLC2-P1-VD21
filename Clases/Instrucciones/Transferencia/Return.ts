import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";

export class Return implements Instruccion{
    public valor : Instruccion;
    public tipo : TIPO;
    constructor(valor){
        this.valor = valor;
    }
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        if(this.valor != null){
            return this.valor.ejecutar(table, tree);
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