import { Instruccion } from './../../Interfaces/Instruccion';
import { Ast } from "../../Ast/Ast";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { Continuar } from '../Transferencia/Continuar';
import { Return } from '../Transferencia/Return';

export class Case implements Instruccion{
    public lista_instrucciones : Array<Instruccion>;
    public valor_case: Instruccion;
    public valor_sw;

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos(table);
        if(this.valor_sw==this.valor_case.ejecutar(table,tree)){
            for(let res of this.lista_instrucciones){
                let ins =res.ejecutar(ts_local, tree);
                if( ins instanceof Detener || res instanceof Detener){
                    // controlador.graficarEntornos(controlador,ts_local," (case)");
                    return ins;
                }else{
                    if(ins instanceof Continuar || res instanceof Continuar){
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return ins;
                    }else{
                        if( ins instanceof Return || res instanceof Return){
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return ins;
                        }
                    }
                }
            }
        }
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
}