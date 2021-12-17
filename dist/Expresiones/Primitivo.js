"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
class Primitivo {
    constructor(valor, tipo, fila, columna) {
        this.valor = valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this.valor;
    }
    translate3d(table, tree) {
        let valor = this.ejecutar(table, tree);
        const generator = tree.generadorC3d;
        if (typeof valor == 'number') {
            return new Retorno_1.Retorno(this.valor, false, Tipo_1.TIPO.DECIMAL);
        }
        else if (typeof valor == 'string') {
            const temp = generator.newTemp();
            generator.genAsignaTemp(temp, 'h');
            for (let i = 0; i < valor.length; i++) {
                generator.gen_SetHeap('h', valor.charCodeAt(i));
                generator.nextHeap();
            }
            generator.gen_SetHeap('h', '-1');
            generator.nextHeap();
            return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
        }
        else if (typeof valor == 'boolean') {
            this.tipo = Tipo_1.TIPO.BOOLEANO;
            return Tipo_1.TIPO.BOOLEANO;
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("PRIMITIVO", "");
        padre.addChildNode(new Nodo_1.Nodo(this.valor.toString(), ""));
        return padre;
    }
}
exports.Primitivo = Primitivo;
