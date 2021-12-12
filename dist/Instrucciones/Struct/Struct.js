"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const Errores_1 = require("../../Ast/Errores");
const DeclaracionArr_1 = require("../Arreglos/DeclaracionArr");
const Asignacion_1 = require("../Asignacion");
const Declaracion_1 = require("../Declaracion");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const DeclararStruct_1 = require("./DeclararStruct");
class Struct {
    constructor(id, instructions, fila, columna) {
        this.id = id;
        this.idSimbolo = "";
        this.fila = fila;
        this.columna = columna;
        this.attributes = new TablaSimbolos_1.TablaSimbolos(null);
        this.instructions = instructions;
        this.tipo = Tipo_1.TIPO.STRUCT;
        this.variables = new Array();
    }
    ejecutar(table, tree) {
        console.log(this.instructions);
        for (let instr of this.instructions) {
            let result = null;
            // Validando Declaraciones Asignaciones 
            if (instr instanceof Declaracion_1.Declaracion /*|| instr instanceof Asignacion */ || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof DeclararStruct_1.DeclararStruct /**AGREGAR DECLA STRUCT */) {
                console.log(instr);
                result = instr.ejecutar(this.attributes, tree);
                if (instr instanceof Declaracion_1.Declaracion) {
                    for (let simbolo of instr.simbolos) {
                        tree.updateConsolaPrintln(" simbolo: " + simbolo.id);
                        this.variables.push({ "tipo": instr.tipo, "arreglo": false, "id": simbolo.id });
                    }
                }
                if (instr instanceof DeclararStruct_1.DeclararStruct) {
                }
            }
            // Validando Errores
            if (result instanceof Errores_1.Errores) {
                let error = new Errores_1.Errores("Semantico", "Struct - Error en Atributos Struct ", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrint(error.toString() + "/n/t->/t");
                return result;
            }
            if (result instanceof Break_1.Detener) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Continuar_1.Continuar) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Return_1.Return) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodo/Funciones/Controlador", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
                // this.tipo = result.tipo;
                // return result.valor;
            }
        }
        // Guardo Simbolo: id, tipoStruct(el Struct que es), TIPO.STRUCT, variables, Attributes: TablaSimbolos(null)
        let nuevo_simb = new Simbolo_1.Simbolo(this.idSimbolo, this.tipo, false, this.fila, this.columna, this.attributes);
        nuevo_simb.tipoStruct = this.id;
        nuevo_simb.variables = this.variables;
        tree.updateConsolaPrintln(" tamano variables: struct; " + this.variables.length);
        tree.updateConsolaPrintln(" tamano instruccines: struct; " + this.instructions.length);
        table.setSymbolTabla(nuevo_simb);
        return nuevo_simb;
    }
    ejecutarUpdate(table, tree) {
        for (let instr of this.instructions) {
            let result = null;
            // Validando Declaraciones Asignaciones 
            if (instr instanceof Declaracion_1.Declaracion || instr instanceof Asignacion_1.Asignacion || instr instanceof DeclaracionArr_1.DeclaracionArr || DeclararStruct_1.DeclararStruct /**AGREGAR DECLA STRUCT */) {
                result = instr.ejecutar(this.attributes, tree);
                if (instr instanceof Declaracion_1.Declaracion) {
                    for (let simbolo of instr.simbolos) {
                        this.variables.push({ "tipo": instr.tipo, "arreglo": false, "id": simbolo.id });
                    }
                }
            }
            // Validando Errores
            if (result instanceof Errores_1.Errores) {
                let error = new Errores_1.Errores("Semantico", "Struct - Error en Atributos Struct ", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrint(error.toString() + "/n/t->/t");
                return result;
            }
            if (result instanceof Break_1.Detener) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Continuar_1.Continuar) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Return_1.Return) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodo/Funciones/Controlador", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
                // this.tipo = result.tipo;
                // return result.valor;
            }
        }
        // Guardo Simbolo: id, tipoStruct(el Struct que es), TIPO.STRUCT, variables, Attributes: TablaSimbolos(null)
        let nuevo_simb = new Simbolo_1.Simbolo(this.idSimbolo, this.tipo, false, this.fila, this.columna, this.attributes);
        nuevo_simb.tipoStruct = this.id;
        nuevo_simb.variables = this.variables;
        table.setSymbolTabla(nuevo_simb);
    }
    getTipoStruct() {
        return this.id;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Struct = Struct;
