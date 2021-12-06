import Ast from "../Ast/Ast";
import Nodo from "../Ast/Nodo"
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export default class Print implements Instruccion{

    public parametros : any;
    public fila : number;
    public columna : number;
    public tipo : boolean;
    value : String;

    constructor(parametros, fila, columna, tipo) {
        this.parametros =parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        //TODO: verificar que el tipo del valor sea primitivo 
        this.parametros.forEach(expresion => {
            let valor = expresion.ejecutar(table,tree);
            this.value += valor.toString();
            return valor;
        });

        if(this.tipo){
            tree.updateConsolaPrintln(this.value.toString())
        }else{
            tree.updateConsolaPrint(this.value.toString())
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        
    }

    recorrer(): Nodo {
        let padre = new Nodo("Print",""); 
        padre.addChildNode(new Nodo("print",""));
        padre.addChildNode(new Nodo("(",""));

        let hijo = new Nodo("exp","");
        hijo.addChildNode(this.expresion.recorrer());
        
        padre.addChildNode(hijo);
        padre.addChildNode(new Nodo(")",""));
        
        return padre;
    }


}