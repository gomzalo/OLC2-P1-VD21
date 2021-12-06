import Ast from "../Ast/Ast";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export default class Print implements Instruccion{

    public parametros : any;
    public linea : number;
    public columna : number;

    constructor(parametros, linea, columna) {
        this.parametros =parametros;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        //TODO: verificar que el tipo del valor sea primitivo 
        
        this.parametros.forEach(expresion => {
            let valor = this.parametros.ejecutar(table,tree);
        });

        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        
    }

    // recorrer(): Nodo {
    //     let padre = new Nodo("Print",""); 
    //     padre.AddHijo(new Nodo("print",""));
    //     padre.AddHijo(new Nodo("(",""));

    //     let hijo = new Nodo("exp","");
    //     hijo.AddHijo(this.expresion.recorrer());
        
    //     padre.AddHijo(hijo);
    //     padre.AddHijo(new Nodo(")",""));
        
    //    return padre;
    // }


}