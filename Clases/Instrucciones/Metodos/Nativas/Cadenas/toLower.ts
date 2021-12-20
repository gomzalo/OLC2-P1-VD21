import { Instruccion } from '../../../../Interfaces/Instruccion';
import { Ast } from "../../../../Ast/Ast";
import { Errores } from "../../../../Ast/Errores";
import { TablaSimbolos } from "../../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../../TablaSimbolos/Tipo";
import { Detener } from "../../../Transferencia/Break";
import { Continuar } from "../../../Transferencia/Continuar";
import { Return } from "../../../Transferencia/Return";
import { Funcion } from "../../Funcion";
import { Nodo } from '../../../../Ast/Nodo';

export class toLower implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters: Array<any>;
    public instructions: Array<any>;
    arreglo: boolean;
    /**
     * @function toLowerCase Una cadena puede ser convertida a minusculas con la utilización de la función cadena.toLowercase())
java animal = "Tigre"; println(animal.toLowercase()); //tigre
     * @param id ID de variable a convertir en minusculas.
     * @param fila 
     * @param columna 
     */
    constructor(id,fila, columna)
    {
        this.id = id;
        this.fila = fila;
        this.columna =columna;
    }
    public tipoStruct: any;

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if(cadena != null){
            if(cadena.getTipo() == TIPO.CADENA && !cadena.getArreglo()){
                this.tipo = cadena.getTipo();
                if(cadena.getValor().length > 0){
                    return cadena.getValor().toLowerCase();
                }else{
                    return new Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa 'toLowercase' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented TOLOW.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("toLower","");
        padre.addChildNode(new Nodo(this.id,""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }

}