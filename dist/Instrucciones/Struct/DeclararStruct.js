"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclararStruct = void 0;
const Errores_1 = require("../../Ast/Errores");
const Llamada_1 = require("../../Expresiones/Llamada");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclararStruct {
    constructor(tipoStruct, id, llamada, fila, columna) {
        this.tipoStruct = tipoStruct;
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.llamada = llamada;
    }
    ejecutar(table, tree) {
        //1 Obtenemos Struct
        let struct = tree.getStruct(this.tipoStruct); // Struct
        if (struct == null) {
            return new Errores_1.Errores("Semantico", "Struct " + this.tipoStruct + ": NO coincide con la busqueda", this.fila, this.columna);
        }
        //2 Ejecutamos struct
        struct.idSimbolo = this.id;
        let resultStruct = struct.ejecutar(table, tree);
        if (resultStruct instanceof Errores_1.Errores)
            return resultStruct;
        if (!(this.llamada instanceof Llamada_1.Llamada))
            return new Errores_1.Errores("Semantico", "Struct  " + this.tipoStruct + ": Expresion no es de tipo Llamada", this.fila, this.columna);
        // Ejecutando parametros
        let newTable = struct.attributes;
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.llamada.parameters.length == struct.instructions.length) {
            let count = 0;
            for (let expr of this.llamada.parameters) {
                let valueExpr = expr.ejecutar(newTable, tree);
                if (valueExpr instanceof Errores_1.Errores) {
                    return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.llamada.fila, this.llamada.columna);
                }
                if (struct.variables[count].tipo == expr.tipo || struct.variables[count].tipo == Tipo_1.TIPO.ANY) //Valida Tipos
                 {
                    let symbol;
                    if (struct.variables[count].tipo == Tipo_1.TIPO.ANY) {
                        symbol = new Simbolo_1.Simbolo(String(struct.variables[count].id), expr.tipo, false, this.llamada.fila, this.llamada.columna, valueExpr); // seteo para variables nativas
                    }
                    else if (struct.variables[count].tipo == Tipo_1.TIPO.STRUCT) {
                        symbol = new Simbolo_1.Simbolo(String(struct.variables[count].id), expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr); // seteo para variables nativas
                    }
                    else {
                        symbol = new Simbolo_1.Simbolo(String(struct.variables[count].id), struct.variables[count].tipo, false, this.llamada.fila, this.llamada.columna, valueExpr);
                    }
                    console.log(struct);
                    console.log(symbol);
                    let resultTable = newTable.updateSymbolTabla(symbol);
                    if (resultTable instanceof Errores_1.Errores)
                        return resultTable;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                }
                count++;
            }
        }
        else {
            console.log(`tam param call: ${this.llamada.parameters.length} func ${struct.instructions.length}`);
            return new Errores_1.Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
        }
    }
    getTipoStruct() {
        throw new Error("Method not implemented.");
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.DeclararStruct = DeclararStruct;
