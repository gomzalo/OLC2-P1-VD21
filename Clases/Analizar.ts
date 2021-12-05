// import * as sintactico from '../Analizadores/gramatica'

// import * as sintactico_interprete from '../Analizadores/A_interprete'
// import Controlador from './Controlador';
// import { TablaSimbolos } from './TablaSimbolos/TablaSimbolos';


/**
 * @class Analiza la entrada
 */

export class Analizador{
    public recorrer(input){
        try {
            // let ast = sintactico_interprete.parse(input);
            // let nodo_ast = ast.recorrer();

            // return nodo_ast;
            
        } catch (error) {
            
        }
    }

    public ejecutar(input):any{
        console.log("Analizando la entrada");

        try {
            // let ast = sintactico_interprete.parse(input);
            // let controlado = new Controlador();
            // let ts_global = new TablaSimbolos(null);

            // ast.ejecutar(controlado, ts_global);

            // // TS HTML
            // let ts_html = controlado.graficar_ts(controlado,ts_global);

            // let retorno = { "errores" : controlado.errores, "ts" : ts_html, "consola" : controlado.consola}
            // return retorno;
        } catch (error) {
            console.log("Error Exist");
            return "Error Exist"
        }
    }
}