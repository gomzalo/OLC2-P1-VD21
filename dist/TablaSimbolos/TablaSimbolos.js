"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
const Errores_1 = require("../Ast/Errores");
class TablaSimbolos {
    constructor(anterior) {
        this.anterior = anterior;
        this.tabla = new Map();
    }
    setSymbolTabla(simbolo) {
        if (this.existeEnActual(simbolo.id)) {
            console.log("Entreeeeee");
            return new Errores_1.Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }
        else {
            // this.tabla[simbolo.getId()] = simbolo;
            this.tabla.set(simbolo.getId(), simbolo);
            console.log("set simbolo " + simbolo.getId() + " " + simbolo.getValor());
        }
        return null;
    }
    existeEnActual(id) {
        let entorno = this;
        let existe = entorno.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    getSymbolTabla(id) {
        let tablaActual = this;
        while (tablaActual != null) {
            let existe = tablaActual.tabla.get(id);
            if (existe != null) {
                return existe;
            }
            else {
                tablaActual = this.anterior;
            }
        }
        return null;
    }
    updateSymbolTabla(simbolo) {
        let tablaActual = this;
        while (tablaActual != null) {
            if (simbolo.id in tablaActual.tabla) {
                // validacion DE TIPO
                if (tablaActual.tabla[simbolo.id].getTipo() == simbolo.getTipo()) {
                    tablaActual.tabla[simbolo.id].setValor(simbolo.getValor());
                    tablaActual.tabla[simbolo.id].setTipo(simbolo.getTipo());
                    // AGREGAR STRUCT ACA
                    return null;
                }
                return new Errores_1.Errores("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }
            else {
                tablaActual = this.anterior;
            }
            return new Errores_1.Errores("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
        }
    }
}
exports.TablaSimbolos = TablaSimbolos;
