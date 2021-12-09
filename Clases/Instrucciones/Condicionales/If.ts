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

export class If implements Instruccion{

    public condicion : any;
    public lista_ifs : Array<Instruccion>;
    public lista_elses : Array<Instruccion>;
    public fila : number;
    public columna : number;

    constructor(condicion, lista_ifs, lista_elses, fila, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.columna = columna;
        this.fila = fila;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if(this.condicion.tipo == TIPO.BOOLEANO){
            if(valor_condicion){
                // this.lista_ifs.forEach(ins => {
                for(let ins of this.lista_ifs){
                    let res = ins.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if(ins instanceof Detener || res instanceof Detener  ){
                        return res;
                    }else{
                        if(ins instanceof Continuar || res instanceof Continuar){
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return res;
                        }else{
                            if( ins instanceof Return || res instanceof Return){
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return res;
                            }
                        }
                    }
                };
            }else{
                for(let ins of this.lista_elses){
                    let res = ins.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                    if(ins instanceof Detener || res instanceof Detener  ){
                        return res;
                    }else{
                        if(ins instanceof Continuar || res instanceof Continuar){
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return res;
                        }else{
                            if( ins instanceof Return || res instanceof Return){
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return res;
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