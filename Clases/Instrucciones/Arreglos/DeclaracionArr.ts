import exp from "constants";
import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Copiar } from "../../Expresiones/Arreglos/Copiar";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";

export  class DeclaracionArr implements Instruccion{
    public tipo : TIPO;
    public dimensiones;
    public id;
    public expresiones;
    public fila;
    public columna;
    public arreglo = true;
    public arr = Array<any>();
    //tipo lista_dim ID IGUAL lista_exp_arr
    /**
     * @function DeclaracionArr Declara arreglo.
     * @param tipo Tipo de datos dentro del arreglo.
     * @param dimensiones Dimension del arreglo (siempre sera []).
     * @param id ID del arreglo.
     * @param expresiones Valores a asignar al arreglo.
     * @param fila 
     * @param columna 
     */
    constructor(tipo, dimensiones, id, expresiones, fila, columna){
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // if(this.expresiones != null){
        //     console.log("declArr exp: " + this.expresiones);
        // }
        // Creando arreglo
        let value;
        // ASIGNACION
        if(this.tipo == null && this.dimensiones == null){
            // Asignando variable de tipo arreglo con su valor
            if(table.existe(this.id)){
                // Creando arreglo
                this.tipo = table.getSymbolTabla(this.id).getTipo();
                if(this.expresiones instanceof Copiar){
                    // console.log("AS ARR COPIAR");
                    value = this.expresiones.ejecutar(table, tree);
                    // console.log("AS ARR COPIAR VAL: " + value);
                    if(value == null){
                        return new Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
                    }
                }else{
                    console.log("AS ARR ");
                    console.log(this.expresiones);
                    if(this.expresiones == "[]"){
                        console.log("AS ARR vacio");
                        value = [];
                    }else{
                        value = this.crearDimensiones(table, tree, this.expresiones.slice()); // Devuelve el arreglo de dimensiones
                    }
                    // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                    // value = this.arr;
                    // console.log("value declArr: " + value);
                    // console.log("type declArr: " + typeof(value));
                    // console.log("type declArr: " + typeof(this.arr));
                    // console.log("tipo declArr: " + this.tipo);
                    if(value instanceof Errores){
                        return value;
                    }
                }
                // Creando simbolo
                let nuevo_simb = new Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, value);
                if(nuevo_simb.arreglo){
                    // Obteniendo variable y asignar valor
                    let result = table.updateSymbolTabla(nuevo_simb);
                    if(result instanceof Errores){
                        return result;
                    }
                }else{
                    return new Errores("Semantico", `La variable '${this.id}', no es de tipo arreglo.`, this.fila,this.columna);
                }
            }else{
                return new Errores("Semantico", "Variable no encontrada.", this.fila,this.columna);
            }
        } // DECLARACION
        else if(this.expresiones == null){
            // console.log("DECL ARR ");
            // Verificando dimensiones
            if(this.dimensiones != null){
                if(this.dimensiones != this.dimensiones.length){
                    return new Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
                }
            }
            // Creando variable de tipo arreglo
            let nuevo_simb = new Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, []);
            let result = table.setSymbolTabla(nuevo_simb);
            if(result instanceof Errores){
                return result;
            }
        }// DECLARACION Y ASIGNACION
        else{
            // Verificando dimensiones
            if(this.dimensiones != null){
                if(this.dimensiones != this.dimensiones.length){
                    return new Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
                }
            }
            // Creando arreglo
            if(this.expresiones instanceof Copiar){
                // console.log("DECL Y AS ARR COPIAR");
                value = this.expresiones.ejecutar(table, tree);
                // console.log("DECL ARR COPIAR VAL: " + value);
                if(value == null){
                    return new Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
                }
            }else{
                // console.log("DECL Y AS ARR ");
                value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                // console.log("crearArr value: " + value);
                // console.log("crearArr size: " + value.length);
                // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                // value = this.arr;
                // console.log("value declArr: " + value);
                // console.log("type declArr: " + typeof(value));
                // console.log("type declArr: " + typeof(this.arr));
                // console.log("tipo declArr: " + this.tipo);
                if(value instanceof Errores){
                    return value;
                }
            }
            // Creando variable de tipo arreglo con su valor
            let nuevo_simb = new Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, value);
            let result = table.setSymbolTabla(nuevo_simb);
            if(result instanceof Errores){
                return result;
            }
        }
        return null;
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented DECLARR.");
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        return new Nodo("Modificacion Array","");
    }

    public crearDimensiones(table, tree, expresiones){
        let arr = Array<any>();
        while(true){
            if(!(expresiones.length == 0)){
                let dimension = expresiones.shift();
                // console.log("crearArr dim: " + dimension);
                if(Array.isArray(dimension)){
                    arr.push([this.crearDimensiones(table, tree, dimension.slice())]);
                }else{
                    let num = dimension.ejecutar(table, tree);
                    if(dimension.tipo != this.tipo){
                        let res = new Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }else{
                        dimension.tipo = this.tipo;
                        arr.push(num);
                        this.crearDimensiones(tree, table, expresiones.slice());
                    }
                }
            }else{
                break;
            }
        }
        return arr;
    }

}
