import { Instruccion } from './../../../../Interfaces/Instruccion';
import { Ast } from "../../../../Ast/Ast";
import { Errores } from "../../../../Ast/Errores";
import { TablaSimbolos } from "../../../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../../../TablaSimbolos/Tipo";
import { Detener } from "../../../../Instrucciones/Transferencia/Break";
import { Continuar } from "../../../../Instrucciones/Transferencia/Continuar";
import { Return } from "../../../../Instrucciones/Transferencia/Return";
import { Funcion } from "../../../../Instrucciones/Metodos/Funcion";

export class Push implements Funcion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id;
    public parameters: Array<any>;
    public instructions: Array<any>;
    expresion;
    arreglo: boolean;

    constructor(id, expresion, fila, columna)
    {
        this.expresion = expresion;
        this.id = id;
        this.fila = fila;
        this.columna =columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // console.log("push id: " + this.id.id);
        let arr = table.getSymbolTabla(this.id.id);
        if(arr != null){
            if(arr.getArreglo()){
                this.tipo = arr.getTipo();
                let val = this.expresion.ejecutar(table, tree);
                if(val == null){
                    return new Errores("Semantico", `No se obtuvo ningun valor a ingresar.`, this.fila, this.columna);
                }
                console.log("push tipo arr: " + arr.getTipo());
                console.log("push tipo val: " + this.expresion);
                if(this.expresion.tipo == arr.getTipo()){
                    return arr.getValor().push(val);
                }else{
                    let res = new Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                    tree.Errores.push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
            }else{
                return new Errores("Semantico", `Nativa PUSH no puede utilizase en variable con ID ${this.id}, porque no es un arreglo.`, this.fila, this.columna);
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