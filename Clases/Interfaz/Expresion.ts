import { TablaSimbolos } from './../TablaSimbolos/TablaSimbolos';
import { TIPO } from "../TablaSimbolos/Tipo";
import Ast from "../Ast/Ast";
export interface Expresion {
    fila:number;
    columna: number;

    getTipo(table : TablaSimbolos, tree : Ast): TIPO;
    getValorImplicito(table : TablaSimbolos, tree : Ast): any;
}