import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Nodo } from "../Ast/Nodo"
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Struct } from "./Struct/Struct";
import { Return } from "./Transferencia/Return";

export class Print implements Instruccion{

    public parametros : Array<Instruccion | any>;
    public fila : number;
    public columna : number;
    public tipo : boolean;
    public value : string;
    arreglo: boolean;

    constructor(parametros, fila, columna, tipo) {
        this.parametros =parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";

        for (let expresion of this.parametros)
        {
            let valor = expresion.ejecutar(table,tree);
            // console.log("print exp val: " + String(valor));
            // console.log(valor);

            // Validaciones de TIPOS A Imprimir
            if (valor instanceof Errores)
            {
                return valor;
            }
            if (valor instanceof Simbolo && valor.tipo == TIPO.STRUCT)
            {
                let temp : Simbolo;
                temp = valor;
                // console.log("print STRUCT");
                // console.log(valor);
                valor = temp.toStringStruct()
            }
            if (expresion.tipo == TIPO.ARREGLO)
            {
                
            }
            
            if (valor instanceof Return)
            {
                let temp: Return;
                temp = valor;
                valor = temp.valor
                // validar si es un struct
            }
            this.value += valor;
            
            // return null;    
        }
        
        if (this.tipo){
            // this.value += valor.toString() + "\n";
            (this.value != null ) ? tree.updateConsolaPrintln(String(this.value)) : tree.updateConsolaPrintln("null");
            // tree.updateConsolaPrintln(String(valor))
        }else{
            // this.value += valor.toString();
            (this.value != null ) ? tree.updateConsolaPrint(String(this.value)) : tree.updateConsolaPrint("null");
            // tree.updateConsolaPrint(String(valor))
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
        // hijo.addChildNode(this.parametros.recorrer());
        
        padre.addChildNode(hijo);
        padre.addChildNode(new Nodo(")",""));
        
        return padre;
    }


}