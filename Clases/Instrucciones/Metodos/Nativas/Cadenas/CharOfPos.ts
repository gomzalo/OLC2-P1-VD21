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

export class CharOfPos implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters: Array<any>;
    public instructions: Array<any>;
    expresion;
    arreglo: boolean;
    /**
     * @function caracterOfPosition El acceso a un elemento de una cadena se define de la siguiente manera: string.caracterOfPosition(posición), el cual devolvera el caracter correspondiente a esa posición.
     * @param id ID de la variable de la cual se desea obtener la posicion de cierto caracter.
     * @param expresion Posicion que se desea obtener.
     * @param fila 
     * @param columna 
     */
    constructor(id, expresion, fila, columna)
    {
        this.id = id;
        this.expresion = expresion;
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
                if(!(cadena.getValor().length > 0)){
                    return new Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
                let pos = this.expresion.ejecutar(table, tree);
                if(pos == null){
                    return new Errores("Semantico", `No se obtuvo una posicion ${pos}.`, this.fila, this.columna);
                }
                // console.log("charofpos tipo cadena: " + cadena.getTipo());
                // console.log("charofpos tipo pos: " + this.expresion);
                let tam = cadena.getValor().length;
                if(this.expresion.tipo == TIPO.ENTERO){
                    if(pos < tam){
                        return cadena.getValor().charAt(pos);
                    }else{
                        return new Errores("Semantico", `La posicion ${pos} no se encuentra dentro de ${this.id}.`, this.fila, this.columna);
                    }
                }else{
                    return new Errores("Semantico", `La posicion ${pos} no es un entero.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa 'caracterOfPosition' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented CHAROFPOS.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("CharOfPos","");
        padre.addChildNode(new Nodo(this.id,""));
        let instruccion =  new Nodo("INSTRUCCION","");
        instruccion.addChildNode(this.expresion.recorrer(table,tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(instruccion);
        return padre;
    }

}