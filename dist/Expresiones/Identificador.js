"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errores_1 = __importDefault(require("../Ast/Errores"));
const Nodo_1 = __importDefault(require("../Ast/Nodo"));
class Identicador {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.tipo = null;
    }
    ejecutar(table, tree) {
        this.symbol = table.getSymbolTabla(this.id);
        if (this.symbol == null) {
            return new Errores_1.default("Semantico", "Variable " + this.id + " NO coincide con la busqueda", this.fila, this.columna);
        }
        this.tipo = this.symbol.getTipo();
        return this.symbol.getValor();
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.default("IDENTIFICADOR", "");
        padre.addChildNode(new Nodo_1.default(this.id.toString(), ""));
        return padre;
    }
}
exports.default = Identicador;
