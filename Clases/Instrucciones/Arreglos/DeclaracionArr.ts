import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";

export  class DeclaracionArr implements Instruccion{
    public tipo = TIPO.ARREGLO;
    public tipo_arr : TIPO;
    public dimensiones;
    public id;
    public expresiones;
    public fila;
    public columna;
    public arreglo = true;
    public arr = [];

    constructor(tipo_arr, dimensiones, id, expresiones, fila, columna){
        this.tipo_arr = tipo_arr;
        this.dimensiones = dimensiones;
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // Verificando dimensiones
        if(this.dimensiones != this.dimensiones.length){
            return new Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
        }
        // Creando arreglo
        this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
        let value = this.arr;
        console.log("value declArr: " + value);
        if(value instanceof Errores){
            return value;
        }
        let nuevo_simb = new Simbolo(this.id.toString(), this.tipo_arr, null, this.fila, this.columna, value);
        let result = table.setSymbolTabla(nuevo_simb);
        if(result instanceof Errores){
            return result;
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

    public crearDimensiones(table, tree, expresiones){
        if(expresiones.length == 0){
            return;
        }else{
        console.log("entro crearD");
        let dimension = expresiones.pop();
        // alert("expr crearD arr: " + expresiones);
        // alert("expr crearD arr size: " + expresiones.length);
        let num = dimension.ejecutar(table, tree);
        this.arr.push(num);
        // alert("num arr: " + num);
        // if(num instanceof Errores){
        //     return num;
        // }
        // if(expresiones > 0){
            
        this.crearDimensiones(tree, table, expresiones.slice());
        // }s
        }
        // return this.arr;
    }

}
