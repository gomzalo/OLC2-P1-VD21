import { Ast } from "../Ast/Ast";
import { Nodo } from "../Ast/Nodo"
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";

export class Print implements Instruccion{

    public parametros : Array<Instruccion>;
    public fila : number;
    public columna : number;
    public tipo : boolean;
    public value : string;

    constructor(parametros, fila, columna, tipo) {
        this.parametros =parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("print params: " + this.parametros.toString());
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";
        this.parametros.forEach((expresion: Instruccion) => {
            let valor = expresion.ejecutar(table,tree);
            console.log("print exp val: " + String(valor));
            console.log(valor);
            
            if (this.tipo){
                this.value += valor.toString() + "\n";
                // tree.updateConsolaPrintln(String(this.value))
            }else{
                this.value += valor.toString();
                // tree.updateConsolaPrint(String(this.value))
            }
            return valor;
        });

        // if(this.tipo){
        //     tree.updateConsolaPrintln(this.value.toString())
        // }else{
        tree.updateConsolaPrint(this.value.toString())
        // }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        
    }

    recorrer(): Nodo {
        let padre = new Nodo("Print",""); 
        padre.addChildNode(new Nodo("print",""));
        padre.addChildNode(new Nodo("(",""));

        let hijo = new Nodo("exp","");
        // hijo.addChildNode(this.parametros.recorrer());
        
        padre.addChildNode(hijo);
        padre.addChildNode(new Nodo(")",""));
        
        return padre;
    }


}