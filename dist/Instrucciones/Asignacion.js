"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class Asignacion {
    constructor(id, expresion, fila, columna) {
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (table.existe(this.id)) {
            let valor = this.expresion.ejecutar(table, tree);
            console.log(valor);
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            /**
             * Agregar struct y arreglos aca
             */
            let result = table.updateSymbolTabla(new Simbolo_1.Simbolo(this.id, this.expresion.tipo, null, this.fila, this.columna, valor));
            if (result instanceof Errores_1.Errores) {
                console.log(`tipoo exp: ${this.expresion.tipo} `);
                console.log(`error en updateSymbol ${this.id} `);
                return result;
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "Variable no encontrada en asignacion", this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Asignacion = Asignacion;
