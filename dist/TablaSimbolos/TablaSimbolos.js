"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("./Tipo");
class TablaSimbolos {
    constructor(anterior) {
        this.anterior = anterior;
        this.tabla = new Map();
        this.size = (anterior === null || anterior === void 0 ? void 0 : anterior.size) || 0;
        this.break = (anterior === null || anterior === void 0 ? void 0 : anterior.break) || null;
        this.continue = (anterior === null || anterior === void 0 ? void 0 : anterior.continue) || null;
        this.return = (anterior === null || anterior === void 0 ? void 0 : anterior.return) || null;
    }
    setSymbolTabla(simbolo) {
        if (this.existeEnActual(simbolo.id)) {
            // console.log("Entreeeeee")
            return new Errores_1.Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }
        else {
            // this.tabla[simbolo.getId()] = simbolo;
            simbolo.setPosicion(this.size++);
            this.tabla.set(simbolo.getId(), simbolo);
            // console.log("set simbolo " +  simbolo.getId() + " " + simbolo.getValor())
            return null;
        }
    }
    existeEnActual(id) {
        let entorno = this;
        let existe = entorno.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    toStringTable() {
        let cadena = "";
        if (this.tabla == null) {
            return "null";
        }
        JSON.stringify((this.tabla.forEach((key, value) => {
            // console.log(value)
            // console.log( key['valor'] +"," )
            if (key != null && key['valor'] instanceof TablaSimbolos) {
                cadena += key.toStringStruct();
            }
            else {
                cadena += key['valor'] + ",";
            }
        })));
        return cadena;
    }
    existe(id) {
        let entorno = this;
        while (entorno != null) {
            let existe = entorno.tabla.get(id);
            if (existe != null) {
                return true;
            }
            entorno = entorno.anterior;
        }
        return false;
    }
    /**
     * @function  getSymbolTabla
     * @param id
     * @returns
     */
    getSymbolTabla(id) {
        let tablaActual = this;
        while (tablaActual != null) {
            let existe = tablaActual.tabla.get(id);
            if (existe != null) {
                return existe;
            }
            else {
                tablaActual = tablaActual.anterior;
            }
        }
        return null;
    }
    imprimirTabla() {
        let content = "";
        let cont = 1;
        // console.log("printtable");
        for (let [k, v] of this.tabla) {
            let symbol = v;
            /** DECLARACION */
            content += `
                <tr>
                <th scope="row">${cont}</th>
                <td>Declaracion</td>
                <td>Global</td>
                <td>${k}</td>
                <td>${symbol.fila}</td>
                <td>${symbol.columna}</td>
                </tr>
                `;
            cont++;
        }
        return content;
    }
    updateSymbolTabla(simbolo) {
        // console.log(`update id: ${simbolo.id}`);
        let tablaActual = this;
        while (tablaActual != null) {
            let existe = tablaActual.tabla.get(simbolo.id);
            if (existe != null) {
                // validacion DE TIPO
                if (existe.getTipo() == simbolo.getTipo()
                    || (simbolo.getTipo() == Tipo_1.TIPO.STRUCT && simbolo.getTipo() == existe.getTipo())
                    || (existe.getTipo() == Tipo_1.TIPO.STRUCT && simbolo.getTipo() == Tipo_1.TIPO.NULO)) {
                    existe.setValor(simbolo.getValor());
                    existe.setTipo(simbolo.getTipo());
                    // AGREGAR STRUCT ACA
                    return null;
                }
                // console.log(`tipoo exp: ${existe.getTipo()} tipo variableSym: ${simbolo.getTipo()}`);
                return new Errores_1.Errores("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }
            else {
                tablaActual = tablaActual.anterior;
            }
        }
        return new Errores_1.Errores("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
    }
    getTipoStr(tipo) {
        switch (tipo) {
            case Tipo_1.TIPO.ENTERO:
                return "int";
            case Tipo_1.TIPO.DECIMAL:
                return "double";
            case Tipo_1.TIPO.CADENA:
                return "String";
            case Tipo_1.TIPO.CHARACTER:
                return "char";
            case Tipo_1.TIPO.ARREGLO:
                return "array";
            case Tipo_1.TIPO.STRUCT:
                return "struct";
            case Tipo_1.TIPO.BOOLEANO:
                return "boolean";
            default:
                return "invalido";
        }
    }
}
exports.TablaSimbolos = TablaSimbolos;
