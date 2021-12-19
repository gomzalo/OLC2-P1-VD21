import { TablaSimbolos } from '../TablaSimbolos/TablaSimbolos';
import { TIPO } from "../TablaSimbolos/Tipo";
import { Ast } from "../Ast/Ast";
export interface Instruccion {
    fila:number;
    columna:number;
    arreglo: boolean;

    /**
     * @function ejecutar execute instruccions
     * @param table Maneja el entorno
     * @param tree AST del programa
     */
    ejecutar(table : TablaSimbolos, tree : Ast): any;
    /**
     * @function translate3d translate instruccions to three address code
     * @param table Maneja el entorno
     * @param tree AST del programa
     */
    translate3d(table : TablaSimbolos, tree : Ast): any;
    /**
     * @function recorrer Recorrer nodos para graficar
     * @param table Maneja el entorno
     * @param tree AST del programa
     */
    recorrer(table : TablaSimbolos, tree : Ast): any;

}