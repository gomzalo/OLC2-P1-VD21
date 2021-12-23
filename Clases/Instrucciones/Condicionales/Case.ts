import { Instruccion } from './../../Interfaces/Instruccion';
import { Ast } from "../../Ast/Ast";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { Continuar } from '../Transferencia/Continuar';
import { Return } from '../Transferencia/Return';
import { Errores } from '../../Ast/Errores';
import { Nodo } from '../../Ast/Nodo';

export class Case implements Instruccion{
    public condicion_case : Instruccion;
    public lista_instrucciones : Array<Instruccion>;
    public condicion_sw;
    public fila : number;
    public columna : number;
    arreglo: boolean;
    /**
     * 
     * @param condicion_case Condicion a evaluar en el case
     * @param lista_instrucciones Lista de instrucciones dentro del case
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(condicion_case, lista_instrucciones, fila, columna){
        this.condicion_case = condicion_case;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos(table);
        // console.log("cs valcs: " + this.condicion_case);
        // console.log("cs valorsw: " + this.condicion_sw);
        if(this.condicion_sw == this.condicion_case.ejecutar(table, tree)){
            for(let res of this.lista_instrucciones){
                let ins = res.ejecutar(ts_local, tree);
                if (ins instanceof Errores)
                {
                    tree.getErrores().push(ins);
                    tree.updateConsolaPrintln(ins.toString());
                }
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
        }else{
            return;
        }
    }
    
    translate3d(table: TablaSimbolos, tree: Ast) {
        // let genc3d = tree.generadorC3d;
        let ts_local = new TablaSimbolos(table);
        if(this.condicion_sw == this.condicion_case.translate3d(table, tree)){
            this.lista_instrucciones.forEach(instruccion => {
                let ins = instruccion.translate3d(ts_local, tree);
                if(ins instanceof Detener || ins instanceof Return || ins instanceof Continuar){
                    return ins;
                }
            });
        }
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("CASE","");
        let expresion = new Nodo("EXPRESION","");
        expresion.addChildNode(this.condicion_case.recorrer(table,tree));

        padre.addChildNode(expresion);
        let NodoInstr = new Nodo("INSTRUCCIONES","");
        for(let instr of this.lista_instrucciones)
        {
            NodoInstr.addChildNode(instr.recorrer(table,tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}