"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class Case {
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        if (this.valor_sw == this.valor_case.ejecutar(table, tree)) {
            for (let res of this.lista_instrucciones) {
                let ins = res.ejecutar(ts_local, tree);
                if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    // controlador.graficarEntornos(controlador,ts_local," (case)");
                    return ins;
                }
                else {
                    if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return ins;
                    }
                    else {
                        if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return ins;
                        }
                    }
                }
            }
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
}
exports.Case = Case;