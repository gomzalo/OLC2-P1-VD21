"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignaVariable = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class AsignaVariable {
    constructor(idStruct, idAcceso, fila, columna) {
        this.idStruct = idStruct; // Acceso | ID
        this.instruccion = idAcceso; // Acceso | ID
        this.fila = fila;
        this.columna = columna;
        // this.instruccion = null;
    }
    ejecutar(table, tree) {
        let resultAcceso = null;
        resultAcceso = this.idStruct.ejecutar(table, tree);
        if (resultAcceso instanceof Errores_1.Errores)
            return resultAcceso;
        if (this.idStruct instanceof Simbolo_1.Simbolo) {
            resultAcceso = this.idStruct;
        }
        // let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        // //retorno el simbolo si este ya fue 
        // EJCUTANDO CAMBIO 
        // if (this.instruccion instanceof Asignacion){
        let valorExpr = this.instruccion.ejecutar(table, tree); // Ejecutando ID, o Primitivo, Acceso
        console.log("llegue aqui");
        console.log(valorExpr);
        if (valorExpr instanceof Errores_1.Errores)
            return valorExpr;
        if (valorExpr instanceof Simbolo_1.Simbolo) // es un id (struct, o Variable normal)
         {
            /**
             * Puede venir:
             * struct -> struct
             * struct -> nulo
             * var -> primitivo
             * --- tipo = tipo
             */
            if (resultAcceso.tipo == Tipo_1.TIPO.STRUCT && this.instruccion.tipo == resultAcceso.tipo && (valorExpr.tipoStruct == resultAcceso.tipoStruct)) // validando Simbolo struct = struct
             {
                resultAcceso.valor = valorExpr.valor;
                resultAcceso.arreglo = valorExpr.valor;
            }
            else if (this.instruccion.expresion.tipo == Tipo_1.TIPO.NULO) {
                resultAcceso.valor = null;
            }
            else if (resultAcceso.tipo == this.instruccion.tipo) {
                resultAcceso.valor = valorExpr;
            }
            else {
                return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " Error en asignacion ", this.fila, this.columna);
            }
        }
        // }
        return resultAcceso;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented ASIGNVARSTRC.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("AsignaVariableStruct", "");
        padre.addChildNode(this.idStruct.ejecutar(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
    queondaaparte() {
        // if(!(this.idStruct instanceof Identificador)){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        // }
        // // console.log("acceso")
        // let simboloStruct = this.idStruct.ejecutar(table,tree);
        // // this.id= this.idStruct.id; 
        // if (simboloStruct == null){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        // }
        // if(!(this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable || this.idAcceso instanceof Struct )){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        // }
        // // if (this.idAcceso instanceof AsignaVariable)
        // // {
        // //     this.idAcceso.instruccion = this.instruccion
        // // }
        // // if (this.instruccion !=null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion && this.idAcceso instanceof Identificador )
        // // {
        // //     this.instruccion.id =  this.idAcceso.id ;
        // //     if (this.idAcceso instanceof Identificador && this.idStruct instanceof Identificador){
        // //         let result = this.instruccion.ejecutar(simboloStruct.valor,tree);
        // //         if (result instanceof Errores)
        // //             return result;
        // //         return result;
        // //     }
        // // }
        // let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        // //retorno el simbolo si este ya fue 
        // if (resultAcceso instanceof Simbolo && (this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable)){
        //     return resultAcceso;
        // }  
        console.log("");
    }
}
exports.AsignaVariable = AsignaVariable;
