import exp from "constants";
import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Copiar } from "../../Expresiones/Arreglos/Copiar";
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
    public arr = Array<any>();
    //tipo lista_dim ID IGUAL lista_exp_arr
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
        if(this.dimensiones != null){
            if(this.dimensiones != this.dimensiones.length){
                return new Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
            }
        }
        // Creando arreglo
        let value;
        if(this.expresiones instanceof Copiar){
            console.log("DECL ARR COPIAR");
            value = this.expresiones.ejecutar(table, tree);
            console.log("DECL ARR COPIAR VAL: " + value);
            if(value == null){
                return new Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
            }
        }else{
            console.log("DECL ARR ");
            this.crearDimensiones(table, tree, this.expresiones[0]); // Devuelve el arreglo de dimensiones
            // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
            value = this.arr;
            console.log("value declArr: " + value);
            // console.log("type declArr: " + typeof(value));
            // console.log("type declArr: " + typeof(this.arr));
            // console.log("tipo declArr: " + this.tipo_arr);
            if(value instanceof Errores){
                return value;
            }
        }
        let nuevo_simb = new Simbolo(this.id.toString(), this.tipo_arr, true, this.fila, this.columna, value);
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
        // console.log("expr crearD arr: " + expresiones);
        while(true){
            if(!(expresiones.length == 0)){
                let dimension = expresiones.shift();
                // console.log("entro crearD");
                // console.log("dim crearD arr: " + dimension);
                if(Array.isArray(dimension)){
                    this.arr.push(this.crearDimensiones(table, tree, dimension) as unknown as Array<any>);
                }else{
                    let num = dimension.ejecutar(table, tree);
                    // console.log("crearArr: num.tipo " + dimension.tipo);
                    // console.log("crearArr: this.tipo_arr " + this.tipo_arr);
                    if(dimension.tipo != this.tipo_arr){
                        // console.log("Tipo distinto al tipo del arreglo");
                        // console.log(tree);
                        let res = new Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }else{
                        this.arr.push(num);
                        this.crearDimensiones(tree, table, expresiones);
                    }
                }
            }else{
                break;
            }
        }
    }

}
