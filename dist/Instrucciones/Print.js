"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = __importDefault(require("../Ast/Nodo"));
class Print {
    constructor(parametros, fila, columna, tipo) {
        this.parametros = parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }
    ejecutar(table, tree) {
        console.log("entro a print siimmm");
        //TODO: verificar que el tipo del valor sea primitivo 
        this.parametros.forEach(expresion => {
            let valor = expresion.ejecutar(table, tree);
            this.value += valor.toString();
            return valor;
        });
        if (this.tipo) {
            tree.updateConsolaPrintln(this.value.toString());
        }
        else {
            tree.updateConsolaPrint(this.value.toString());
        }
        return null;
    }
    translate3d(table, tree) {
    }
    recorrer() {
        let padre = new Nodo_1.default("Print", "");
        padre.addChildNode(new Nodo_1.default("print", ""));
        padre.addChildNode(new Nodo_1.default("(", ""));
        let hijo = new Nodo_1.default("exp", "");
        hijo.addChildNode(this.parametros.recorrer());
        padre.addChildNode(hijo);
        padre.addChildNode(new Nodo_1.default(")", ""));
        return padre;
    }
}
exports.Print = Print;
