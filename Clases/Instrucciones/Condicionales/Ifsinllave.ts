import { Primitivo } from './../../Expresiones/Primitivo';
import { Logica } from './../../Expresiones/Operaciones/Logicas';
import { Relacional } from './../../Expresiones/Operaciones/Relacionales';
import { Aritmetica } from './../../Expresiones/Operaciones/Aritmeticas';
import { Expresion } from './../../Interfaces/Expresion';
import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico, TIPO } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { Detener } from '../Transferencia/Break';
import { Continuar } from '../Transferencia/Continuar';
import { Return } from '../Transferencia/Return';

export class Ifsinllave implements Instruccion{

    public condicion : any;
    public ins_ifs : Instruccion;
    public ins_elses : Instruccion;
    public fila : number;
    public columna : number;

    constructor(condicion, ins_ifs, ins_elses, fila, columna) {
        this.condicion = condicion;
        this.ins_ifs = ins_ifs;
        this.ins_elses = ins_elses;
        this.columna = columna;
        this.fila = fila;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if(this.condicion.tipo == TIPO.BOOLEANO){
            if(valor_condicion){
                let res = this.ins_ifs.ejecutar(ts_local, tree);
                //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                if(this.ins_ifs instanceof Detener || res instanceof Detener  ){
                    return res;
                }else{
                    if(this.ins_ifs instanceof Continuar || res instanceof Continuar){
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return this.ins_ifs;
                    }else{
                        if( this.ins_ifs instanceof Return || res instanceof Return){
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return this.ins_ifs;
                        }
                    }
                }
            }else{
                if(this.ins_elses instanceof Array){
                    this.ins_elses.forEach(ins => {
                        let res = ins.ejecutar(ts_local, tree);
                        if(ins instanceof Detener || res instanceof Detener){
                            return res;
                        }else{
                            if(ins instanceof Continuar || res instanceof Continuar){
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return ins;
                            }else{
                                if(ins instanceof Return || res instanceof Return){
                                    // controlador.graficarEntornos(controlador,ts_local," (case)");
                                    return ins;
                                }
                            }
                        }
                    });
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                }else{
                    let res = this.ins_elses.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                    if(this.ins_elses instanceof Detener || res instanceof Detener){
                        return res;
                    }else{
                        if(this.ins_elses instanceof Continuar || res instanceof Continuar){
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return this.ins_elses;
                        }else{
                            if(this.ins_elses instanceof Return || res instanceof Return){
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return this.ins_elses;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }

}