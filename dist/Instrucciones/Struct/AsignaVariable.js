"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignaVariable = void 0;
const Errores_1 = require("../../Ast/Errores");
const Identificador_1 = require("../../Expresiones/Identificador");
const Asignacion_1 = require("../Asignacion");
const Struct_1 = require("./Struct");
class AsignaVariable {
    constructor(idStruct, idAcceso, fila, columna) {
        this.idStruct = idStruct;
        this.idAcceso = idAcceso;
        this.fila = fila;
        this.columna = columna;
        this.instruccion = null;
    }
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
        // if (simboloStruct.tipo != TIPO.STRUCT)
        // {
        //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
        // }
        // Acceso atributos
        // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)
        // console.log(this.idStruct)
        // console.log(this.expresiones);
        // console.log(simboloStruct);
        if (!(this.idAcceso instanceof Identificador_1.Identificador || this.idAcceso instanceof AsignaVariable || this.idAcceso instanceof Struct_1.Struct)) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        if (this.idAcceso instanceof AsignaVariable) {
            this.idAcceso.instruccion = this.instruccion;
        }
        // if(!(simboloStruct.valor instanceof TablaSimbolos)){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO /Struct ", this.fila, this.columna);
        // }else{
        // }
        if (this.instruccion != null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion_1.Asignacion && this.idAcceso instanceof Identificador_1.Identificador) {
            this.instruccion.id = this.idAcceso.id;
            if (this.idAcceso instanceof Identificador_1.Identificador && this.idStruct instanceof Identificador_1.Identificador) {
                let result = this.instruccion.ejecutar(simboloStruct.valor, tree);
                if (result instanceof Errores_1.Errores)
                    return result;
                return result;
            }
        }
        let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor, tree);
        return resultAcceso;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.AsignaVariable = AsignaVariable;
