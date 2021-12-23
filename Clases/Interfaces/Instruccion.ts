import { TablaSimbolos } from '../TablaSimbolos/TablaSimbolos';
import { TIPO } from "../TablaSimbolos/Tipo";
import { Ast } from "../Ast/Ast";
export interface Instruccion {
    fila:number;
    columna:number;
    arreglo: boolean;

    /**
     * @function ejecutar Ejecuta las intrucciones.
     * @param table Maneja el entorno.
     * @param tree AST del programa.
     */
    ejecutar(table : TablaSimbolos, tree : Ast): any;
    /**
     * @function translate3d Traduce las instrucciones a código de tres direcciones.
     * @param table Maneja el entorno.
     * @param tree AST del programa.
     */
    translate3d(table : TablaSimbolos, tree : Ast): any;
    /**
     * @function recorrer Recorrer nodos para graficar AST.
     * @param table Maneja el entorno.
     * @param tree AST del programa.
     */
    recorrer(table : TablaSimbolos, tree : Ast): any;

}