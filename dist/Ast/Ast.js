"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ast {
    constructor() {
        this.consola = "";
        this.TSglobal = null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno = "";
        this.instrucciones = new Array();
        this.funciones = new Array();
        this.structs = new Array();
        this.Errores = new Array();
        this.consola = "";
        this.TSglobal = null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno = "";
    }
    ejecutar(table, tree) {
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        // for( let instr of this.instrucciones){
        // }
        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for (let instr of this.instrucciones) {
            instr.ejecutar(table, tree);
        }
    }
    getInstrucciones() {
        return this.instrucciones;
    }
    setInstrucciones(instrucciones) {
        this.instrucciones = instrucciones;
    }
    getErrores() {
        return this.Errores;
    }
    setErrores(excepciones) {
        this.Errores = excepciones;
    }
    addError(error) {
        this.Errores.concat(error);
        // this.updateConsola(error.toString());
    }
    getConsola() {
        return this.consola;
    }
    setConsola(consola) {
        this.consola = consola;
    }
    updateConsolaPrintln(cadena) {
        this.consola += cadena + '\n';
    }
    updateConsolaPrint(cadena) {
        this.consola += cadena;
    }
    getTSGlobal() {
        return this.TSglobal;
    }
    setTSGlobal(TSglobal) {
        this.TSglobal = TSglobal;
    }
    getFunction(name) {
        this.funciones.forEach(function (func) {
            // console.log(func);
            if (func.name == name) {
                return func;
            }
        });
        return null;
    }
    addFunction(funcion) {
        this.funciones.concat(funcion);
    }
    getStruct(name) {
        this.structs.forEach(struct => {
            if (struct.id = name) {
                return struct;
            }
        });
        return null;
    }
    addStruct(struct) {
        this.structs.concat(struct);
    }
    getDot(raiz) {
    }
}
exports.default = Ast;
