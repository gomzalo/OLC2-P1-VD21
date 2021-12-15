import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Nodo } from "../Ast/Nodo";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";

export class Ternario implements Instruccion{
    public condicion : Instruccion| any;
    public instTrue : Instruccion | any;
    public instFalse : Instruccion | any;
    public tipo :TIPO;
    public fila : number;
    public columna : number;
    arreglo: boolean;

    constructor(condicion,True, False, fila, columna){
        this.condicion = condicion;
        this.instTrue = True;
        this.instFalse = False;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        let valor_condicion = this.condicion.ejecutar(table,tree);

        if(this.condicion.tipo == TIPO.BOOLEANO ){
            this.tipo = TIPO.BOOLEANO;
            if (valor_condicion)
            {
                let result = this.instTrue.ejecutar(table,tree);
                this.tipo = this.instTrue.tipo;
                return result
            }else{
                let result = this.instFalse.ejecutar(table,tree);
                this.tipo = this.instFalse.tipo;
                return result
            }
            // return valor_condicion ? this.instTrue.ejecutar(table,tree): this.instFalse.ejecutar(table,tree); 
        }else{
            let error = new Errores('Semantico', `La condicion del ternario no es booleana.`, this.fila, this.columna);
            return(error);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("TERNARIO","");
        padre.addChildNode(this.condicion.recorrer(table, tree));
        padre.addChildNode(new Nodo("?",""));
        padre.addChildNode(this.instTrue.recorrer(table, tree));
        padre.addChildNode(new Nodo(":",""));
        padre.addChildNode(this.instFalse.recorrer(table, tree));
        return padre;
    }
}