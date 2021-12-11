import { TablaSimbolos } from '../TablaSimbolos/TablaSimbolos';
import { TIPO } from "../TablaSimbolos/Tipo";
import { Ast } from "../Ast/Ast";
export interface Instruccion {
    fila:number;
    columna:number;
    arreglo: boolean;

    /**
     * @function ejecutar execute instruccions
     * @param ast llevamos el control de todo el programa
     * @param ts accede a la tabla de simbolos
     */
    ejecutar(table : TablaSimbolos, tree : Ast): any;

    translate3d(table : TablaSimbolos, tree : Ast): any;

    recorrer(table : TablaSimbolos, tree : Ast): any;

}