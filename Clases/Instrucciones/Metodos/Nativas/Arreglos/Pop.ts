import { Ast } from "../../../../Ast/Ast";
import { Errores } from "../../../../Ast/Errores";
import { Instruccion } from "../../../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../../TablaSimbolos/Tipo";
import { Detener } from "../../../../Instrucciones/Transferencia/Break";
import { Continuar } from "../../../../Instrucciones/Transferencia/Continuar";
import { Return } from "../../../../Instrucciones/Transferencia/Return";
import { Funcion } from "../../../../Instrucciones/Metodos/Funcion";

export class Pop implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id : string;
    public parameters: Array<any>;
    public instructions : Array<Instruccion>;
    arreglo: boolean;

    constructor(id, fila, columna)
    {
        this.id = id;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let arr = table.getSymbolTabla(this.id);
        console.log("pop type: " + arr.tipo);
        if(arr != null){
            if(arr.getArreglo()){
                this.tipo = arr.getTipo();
                return arr.getValor().pop();
            }else{
                return new Errores("Semantico", `Nativa POP no puede utilizase en variable con ID ${this.id}, porque no es un arreglo.`, this.fila, this.columna);
            }
        }else{
            return new Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}