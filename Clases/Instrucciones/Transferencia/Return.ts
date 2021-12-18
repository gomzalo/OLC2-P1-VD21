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
            let valor =  this.expresion.ejecutar(table, tree);
            if(valor instanceof Errores)
            {
                return valor;
            }
            this.tipo = this.expresion.tipo;
            this.valor = valor;
            return this;
        }else{
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    
    translate3d(table: TablaSimbolos, tree: Ast) {
        const genc3d = tree.generadorC3d;
        if(table.continue == null){
            return new Errores('Semantico','No se permite el uso de continue en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.continue);
    }

    recorrer(): Nodo {
        let padre = new Nodo("RETURN","");
        padre.addChildNode(new Nodo("return",""));
        if(this.valor != null){
            padre.addChildNode(this.expresion.recorrer());
        }
        return padre;
    }

}