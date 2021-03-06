import { subString } from './subString';
import { Primitivo } from './../../../../Expresiones/Primitivo';
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

export class toUpper implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters: Array<any>;
    public instructions: Array<any>;
    arreglo: boolean;
    /**
     * @function toUpperCase Una cadena puede ser convertida a mayusculas con la utilización de la función cadena.toUppercase())
java animal = "Tigre"; println(animal.toUppercase()); //TIGRE
     * @param id ID de la variable, tipo cadena, a convertir a mayusculas.
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
        // console.log(this.id);
        if(this.id instanceof subString){
            // console.log("toupp subs");
            let cadena_primitivo = this.id.ejecutar(table, tree);
            if(typeof cadena_primitivo == "string"){
                this.tipo = TIPO.CADENA;
                if(cadena_primitivo.length > 0){
                    return cadena_primitivo.toUpperCase();
                }else{
                    return new Errores("Semantico", `La cadena con valor: '${this.id}' es vacia.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa 'toUppercase' no puede utilizase en valor '${this.id}', porque no es una cadena.`, this.fila, this.columna);
            }
        }else{
            let cadena = table.getSymbolTabla(this.id);
            if(cadena != null){
                if(cadena.getTipo() == TIPO.CADENA && !cadena.getArreglo()){
                    this.tipo = cadena.getTipo();
                    if(cadena.getValor().length > 0){
                        return cadena.getValor().toUpperCase();
                    }else{
                        return new Errores("Semantico", `La cadena en la variable con ID: '${this.id}' es vacia.`, this.fila, this.columna);
                    }
                }else{
                    return new Errores("Semantico", `Nativa 'toUppercase' no puede utilizase en variable con ID '${this.id}', porque no es una cadena.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `La variable con ID '${this.id}', no existe.`, this.fila, this.columna);
            }
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented TOUPP.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("toLower","");
        padre.addChildNode(new Nodo(this.id,""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
    

}