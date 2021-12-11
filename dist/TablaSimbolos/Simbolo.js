"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
const TablaSimbolos_1 = require("./TablaSimbolos");
class Simbolo {
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false) {
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
        console.log("simbolor: " + this.valor);
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getTipo() {
        return this.tipo;
    }
    getTipoStruct() {
        return this.id;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
    getValor() {
        return this.valor;
    }
    setValor(valor) {
        this.valor = valor;
    }
    getFila() {
        return this.fila;
    }
    getColumna() {
        return this.columna;
    }
    getArreglo() {
        return this.arreglo;
    }
    toStringStruct() {
        // return this.id + " - " + this.descripcion + " [" + String(this.fila) + "," + String(this.columna) + "]";
        console.log("entre a to string struct");
        let cadena = "";
        if (this.valor instanceof TablaSimbolos_1.TablaSimbolos) {
            console.log(this.valor.tabla);
            cadena = this.valor.toStringTable();
        }
        return this.id + "(" + `${cadena}` + ")";
    }
}
exports.Simbolo = Simbolo;
