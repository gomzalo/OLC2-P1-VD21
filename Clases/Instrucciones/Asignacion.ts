import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { Return } from "./Transferencia/Return";

export class Asignacion implements Instruccion{
    public id: string;
    public expresion : Expresion|any;
    public fila : number;
    public columna : number;
    arreglo = false;
    
    constructor(id:string, expresion, fila, columna){
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna =columna;
    }
    
    ejecutar(table: TablaSimbolos, tree: Ast) {
        if (table.existe(this.id)){
            let valor = this.expresion.ejecutar(table,tree );
            // console.log(valor)

            if (valor instanceof Errores)
            {
                return valor;
            }
            if (valor instanceof Return)
            {
                let temp : Return;
                temp = valor;
                // // validacion struct
                /**
                 * Agregar struct y arreglos aca
                 */
                // if (temp.valor instanceof Struct){

                // }
                valor = temp.valor;
            }
            /**
             * Agregar struct y arreglos aca
             */
            // console.log(`Existe id: ${this.id} ${table.existe(this.id)}`);
            let result = table.updateSymbolTabla(new Simbolo(this.id, this.expresion.tipo, null, this.fila,this.columna,valor))
            
            
            if (result instanceof Errores){
                // console.log(result);
                // console.log(`tipoo exp: ${this.expresion.tipo} `)
                // console.log(`error en updateSymbol ${this.id} `)
                return result;
            }
        }else{
            return new Errores("Semantico", "Variable no encontrada en asignacion", this.fila,this.columna);
        }
        return null
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}