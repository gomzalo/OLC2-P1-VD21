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
        const genc3d = tree.generadorC3d;
        if (typeof valor == 'number') {
            // genc3d.gen_Comment('--------- INICIA RECORRE NUMERO ---------');
            return new Retorno_1.Retorno(this.valor, false, Tipo_1.TIPO.DECIMAL);
        }
        else if (typeof valor == 'string') {
            const temp = genc3d.newTemp();
            genc3d.genAsignaTemp(temp, 'h');
            genc3d.gen_Comment('--------- INICIA RECORRE CADENA ---------');
            for (let i = 0; i < valor.length; i++) {
                genc3d.gen_SetHeap('h', valor.charCodeAt(i));
                genc3d.nextHeap();
            }
            genc3d.gen_Comment('--------- FIN RECORRE CADENA ---------');
            genc3d.gen_SetHeap('h', '-1');
            genc3d.nextHeap();
            return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
        }
        else if (typeof valor == 'boolean') {
            // genc3d.gen_Comment('--------- INICIA RECORRE BOOL ---------');
            return new Retorno_1.Retorno("", false, Tipo_1.TIPO.BOOLEANO);
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("PRIMITIVO", "");
        padre.addChildNode(new Nodo_1.Nodo(this.valor.toString(), ""));
        return padre;
    }
}
exports.Primitivo = Primitivo;
