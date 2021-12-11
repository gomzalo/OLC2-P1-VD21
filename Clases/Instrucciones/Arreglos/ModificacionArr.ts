import exp from "constants";
import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";

export  class ModificacionArr implements Instruccion{
    public id;
    public expresiones;
    public valor;
    public fila;
    public columna;
    public arreglo = true;

    //tipo lista_dim ID IGUAL lista_exp_arr
    constructor(id, expresiones, valor, fila, columna){
        this.id = id;
        this.expresiones = expresiones;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let value = this.valor.ejecutar(table, tree);
        if(value instanceof Errores){
            return value;
        }
        let simbolo = table.getSymbolTabla(this.id.toString());
        if(simbolo == null){
            return new Errores("Semantico", "Variable: \'" + this.id.toString() + "\', no encontrada.", this.fila, this.columna);
        }
        if(!simbolo.getArreglo()){
            return new Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
        }
        if(simbolo.getTipo() != this.valor.tipo){
            return new Errores("Semantico", "Tipos de datos diferentes en modificacion de arreglo: \'" + this.id + "\'.", this.fila, this.columna);
        }
        let result = this.modificarDimensiones(table, tree, this.expresiones, simbolo.getValor(), value); // Devuelve el arreglo de dimensiones
        
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

    public modificarDimensiones(table, tree, expresiones, arreglo, valor){
        let value = null;
        if(expresiones.length == 0){
            if(arreglo instanceof Array){
                return new Errores("Semantico", "Modificacion de arreglo incompleto.", this.fila, this.columna);
            }
            return valor;
        }
        if(!(arreglo instanceof Array)){
            return new Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let dimension = expresiones.pop();
        let num = dimension.ejecutar(table, tree)    ;
        if(num instanceof Errores){
            return num;
        }
        if(dimension.tipo != TIPO.ENTERO){
            return new Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        value = this.modificarDimensiones(tree, table, expresiones, arreglo[num], valor);
        if(value instanceof Errores){
            return value;
        }
        if(value != null){
            arreglo[num] = value;
        }
        return null;
    }
    
}
