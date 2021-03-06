import { Ast } from "../../../Ast/Ast";
import { Errores } from "../../../Ast/Errores";
import { Nodo } from "../../../Ast/Nodo";
import { Instruccion } from "../../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../TablaSimbolos/Tipo";
import { Detener } from "../../Transferencia/Break";
import { Continuar } from "../../Transferencia/Continuar";
import { Return } from "../../Transferencia/Return";
import { Funcion } from "../Funcion";

export class Length implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id : string;
    public parameters: Array<any>;
    public instructions : Array<Instruccion>;
    arreglo: boolean;
    public tipoStruct: any;


    /**
     * @function Length Devuele el tamaño de un arreglo o una cadena.
     * @param id ID de la variable que se quiere saber el tamaño
     * @param fila 
     * @param columna 
     */
    constructor(id, fila, columna)
    {
        this.id = id;
        this.fila = fila;
        this.columna =columna;
    }
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        let arr = table.getSymbolTabla(this.id);
        // console.log("pop type: " + arr.tipo);
        if(arr != null){
            if(arr.getArreglo() || arr.getTipo() == TIPO.CADENA ){
                if(arr.getValor().length > 0){
                    this.tipo = TIPO.ENTERO;
                    return arr.getValor().length;
                }else{
                    return new Errores("Semantico", `El arreglo con ID ${this.id}, esta vacio.`, this.fila, this.columna);
                }
            }else{
                return new Errores("Semantico", `Nativa LENGTH no puede utilizase en variable con ID ${this.id}, porque no es un arreglo o string.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented LENGTH.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("Length","");
        padre.addChildNode(new Nodo(this.id,""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }

}