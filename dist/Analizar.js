"use strict";
// import * as sintactico from '../Analizadores/gramatica'
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analizador = void 0;
const sintactico = __importStar(require("../Analizadores/gramatica.js"));
// import Controlador from './Controlador';
// import { TablaSimbolos } from './TablaSimbolos/TablaSimbolos';
/**
 * @class Analiza la entrada
 */
class Analizador {
    recorrer(input) {
        try {
            let ast = sintactico.parse(input);
            // let nodo_ast = ast.recorrer();
            // return nodo_ast;
        }
        catch (error) {
        }
    }
    ejecutar(input) {
        console.log("Analizando la entrada");
        try {
            let ast = sintactico.parse(input);
            // let controlado = new Controlador();
            // let ts_global = new TablaSimbolos(null);
            // ast.ejecutar(controlado, ts_global);
            // // TS HTML
            // let ts_html = controlado.graficar_ts(controlado,ts_global);
            // let retorno = { "errores" : controlado.errores, "ts" : ts_html, "consola" : controlado.consola}
            // return retorno;
            /// PRUEBAAAAA JKSDFJKASDJKADF
            // return salida;
            console.log(ast);
        }
        catch (error) {
            console.log("Error Exist");
            return "Error Exist";
        }
    }
}
exports.Analizador = Analizador;
