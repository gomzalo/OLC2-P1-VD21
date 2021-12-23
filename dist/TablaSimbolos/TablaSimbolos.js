"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("./Tipo");
class TablaSimbolos {
    /**
     *
     * @param anterior Entorno anterior
     */
    constructor(anterior) {
        this.anterior = anterior;
        this.tabla = new Map();
        this.size = (anterior === null || anterior === void 0 ? void 0 : anterior.size) || 0;
        this.break = (anterior === null || anterior === void 0 ? void 0 : anterior.break) || null;
        this.continue = (anterior === null || anterior === void 0 ? void 0 : anterior.continue) || null;
        this.return = (anterior === null || anterior === void 0 ? void 0 : anterior.return) || null;
        this.actual_funcion = (anterior === null || anterior === void 0 ? void 0 : anterior.actual_funcion) || null;
    }
    /**
     * @function setSymbolTabla Agrega un nuevo simbolo al entorno actual.
     * @param simbolo Símbolo que se agregara al entorno actual.
     * @returns
     */
    setSymbolTabla(simbolo) {
        if (this.existeEnActual(simbolo.id)) {
            // console.log("Entreeeeee")
            return new Errores_1.Errores("Semantico", `Variable con ID: "${simbolo.getId()}", ya existe.`, simbolo.getFila(), simbolo.getColumna());
        }
        else {
            // this.tabla[simbolo.getId()] = simbolo;
            simbolo.setPosicion(this.size++);
            this.tabla.set(simbolo.getId(), simbolo);
            // this.size++;
            // console.log("size: " + this.size);
            // console.log("set simbolo " +  simbolo.getId() + " " + simbolo.getValor())
            return null;
        }
    }
    /**
     * @function existeEnActual Verifica si el simbolo ya existe en el entorno actual.
     * @param id ID del simbolo a buscar dentro del entorno actual.
     * @returns
     */
    existeEnActual(id) {
        let entorno = this;
        let existe = entorno.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    /**
     * @function setTableFuncion Establece el ambito de una funcion.
     * @param actual_funcion Simbolo de la nueva funcion.
     * @param lblreturn Etiqueta de retorno.
     */
    setTableFuncion(actual_funcion, lblreturn) {
        // if(this.)
        this.size = 1;
        this.return = lblreturn;
        this.actual_funcion = actual_funcion;
    }
    /**
     *
     * @returns Atributos del entorno en String.
     */
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
     * @function getSymbolTabla Obtiene un simbolo, si existe, dentro del entorno actual.
     * @param id ID del simbolo a buscar dentro del entorno actual.
     * @returns existe || null
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
    /**
     * @function imprimirTabla Imprime las variables declaradas en el entorno actual.
     * @param cont Devuelve el html que se agregara a la tabla del reporte de la Tabla de Simbolos.
     * @returns
     */
    imprimirTabla(cont) {
        let content = "";
        // let cont = 1;
        // console.log("printtable");
        for (let [k, v] of this.tabla) {
            let symbol = v;
            if ([k, v] != null || [k, v] != undefined) {
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
                    || (existe.getTipo() == Tipo_1.TIPO.STRUCT && simbolo.getTipo() == Tipo_1.TIPO.NULO)
                    || (existe.getTipo() == Tipo_1.TIPO.DECIMAL && simbolo.getTipo() == Tipo_1.TIPO.ENTERO)) //SI ENTERO VIENE A ASIGNARSE EN DECIMAL
                 {
                    existe.setValor(simbolo.getValor());
                    existe.setTipo(simbolo.getTipo());
                    // AGREGAR STRUCT ACA
                    return null;
                }
                // console.log(`tipoo exp: ${existe.getTipo()} tipo variableSym: ${simbolo.getTipo()}`);
                return new Errores_1.Errores("Semantico", "Tipo de dato diferente en asignacion.", simbolo.getFila(), simbolo.getColumna());
            }
            else {
                tablaActual = tablaActual.anterior;
            }
        }
        return new Errores_1.Errores("Semantico", "Varibale no encontrada en asignacion.", simbolo.getFila(), simbolo.getColumna());
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
