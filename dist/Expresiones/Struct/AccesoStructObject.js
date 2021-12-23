"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStructObject = void 0;
const Errores_1 = require("../../Ast/Errores");
const Struct_1 = require("../../Instrucciones/Struct/Struct");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Identificador_1 = require("../Identificador");
class AccesoStructObject {
    constructor(idStruct, expresiones, fila, columna) {
        this.idStruct = idStruct;
        // this.expresiones = expresiones;
        this.idAcceso = expresiones;
        this.fila = fila,
            this.columna = columna;
        this.tipo = Tipo_1.TIPO.STRUCT;
    }
    // ejecutar(table: TablaSimbolos, tree: Ast) {
    //     if(!(this.idStruct instanceof Identificador)){
    //         return new Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO ID", this.fila, this.columna);
    //     }
    //     // console.log("acceso")
    //     let simboloStruct = this.idStruct.ejecutar(table,tree);
    //     // this.id= this.idStruct.id; 
    //     if (simboloStruct == null){
    //         return new Errores("Semantico", "AccesoStruct " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
    //     }
    //     // if (simboloStruct.tipo != TIPO.STRUCT)
    //     // {
    //     //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
    //     // }
    //     // Acceso atributos
    //     // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)
    //     // console.log(this.idStruct)
    //     // console.log(this.expresiones);
    //     // console.log(simboloStruct);
    //     if(!(this.expresiones instanceof Identificador || this.expresiones instanceof AccesoStructObject || this.expresiones instanceof Struct )){
    //         return new Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
    //     }
    //     if(!(simboloStruct.valor instanceof TablaSimbolos)){
    //         return new Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
    //     }
    //     let resultAcceso = this.expresiones.ejecutar(simboloStruct.valor,tree);
    //     return resultAcceso;
    //     // let entornoAttributes = simboloStruct.getValor();
    //     // if (this.expresiones.expresiones.length >0)
    //     // {
    //     //     return this.accesoAttribute(this.expresiones.expresiones,entornoAttributes,tree);
    //     // }else{
    //     //     return null;
    //     // }
    //     // let valueId = null;
    //     // for (let expr of this.expresiones)
    //     // {
    //     //     return valueId = expr.ejecutar(entornoAttributes,tree);
    //     // }
    // }
    ejecutar(table, tree) {
        if (!(this.idStruct instanceof Identificador_1.Identificador)) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        }
        // console.log("acceso")
        let simboloStruct = this.idStruct.ejecutar(table, tree);
        // this.id= this.idStruct.id; 
        if (simboloStruct == null) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
        if (!(this.idAcceso instanceof Identificador_1.Identificador || this.idAcceso instanceof AccesoStructObject || this.idAcceso instanceof Struct_1.Struct)) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        // if (this.idAcceso instanceof AsignaVariable)
        // {
        //     this.idAcceso.instruccion = this.instruccion
        // }
        // if (this.instruccion !=null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion && this.idAcceso instanceof Identificador )
        // {
        //     this.instruccion.id =  this.idAcceso.id ;
        //     if (this.idAcceso instanceof Identificador && this.idStruct instanceof Identificador){
        //         let result = this.instruccion.ejecutar(simboloStruct.valor,tree);
        //         if (result instanceof Errores)
        //             return result;
        //         return result;
        //     }
        // }
        let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor, tree); //devuelve un Simbolo
        //retorno el simbolo si este ya fue 
        if (resultAcceso instanceof Simbolo_1.Simbolo && (this.idAcceso instanceof Identificador_1.Identificador || this.idAcceso instanceof AccesoStructObject)) {
            return resultAcceso;
        }
        console.log("");
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented ACCSTRCOBJ.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented ACCSTRCOBJ.");
    }
}
exports.AccesoStructObject = AccesoStructObject;
