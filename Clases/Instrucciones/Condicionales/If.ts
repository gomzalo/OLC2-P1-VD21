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
import { Errores } from '../../Ast/Errores';

export class If implements Instruccion{

    public condicion : any;
    public lista_ifs : Array<Instruccion>;
    public lista_elses : Array<Instruccion>;
    public lista_ifelse :  Instruccion;
    public fila : number;
    public columna : number;
    arreglo: boolean;

    constructor(condicion, lista_ifs, lista_elses, lista_ifelse, fila, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.lista_ifelse = lista_ifelse;
        this.columna = columna;
        this.fila = fila;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        // let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        console.log("if cond: " + valor_condicion);
        if (valor_condicion instanceof Errores)
            {
                tree.getErrores().push(valor_condicion);
                tree.updateConsolaPrintln(valor_condicion.toString());
            }
        if(this.condicion.tipo == TIPO.BOOLEANO){
            if(valor_condicion == true){
                // if(this.lista_ifs != null){
                    let ts_local = new TablaSimbolos(table);
                    // this.lista_ifs.forEach(ins => {
                    for(let ins of this.lista_ifs){
                        let res = ins.ejecutar(ts_local, tree);
                        if (res instanceof Errores)
                        {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                        if(ins instanceof Detener || res instanceof Detener  ){
                            return res;
                        }else if(ins instanceof Continuar || res instanceof Continuar){
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                break;
                        }else if( ins instanceof Return || res instanceof Return){
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return res;
                        }
                    }
                // }
            }else{
                if (this.lista_elses != null)
                {
                    let ts_local = new TablaSimbolos(table);
                    for(let ins of this.lista_elses){
                        let res = ins.ejecutar(ts_local, tree);
                        //TODO verificar si res es de tipo CONTINUE, RETORNO
                        if (res instanceof Errores)
                        {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        if(res instanceof Detener ){
                            return res;
                        }
                        if(res instanceof Continuar ){
                            break;
                        }
                        if(res instanceof Return ){
                            return res;
                        }
                    }
                }else if(this.lista_ifelse != null)
                {
                    let result = this.lista_ifelse.ejecutar( table, tree);
                    if(result instanceof Errores ){
                        return result;
                    }
                    if(result instanceof Detener ){
                        return result;
                    }
                    if(result instanceof Continuar ){
                        return null;
                    }
                    if(result instanceof Return ){
                        return result;
                    }
                }
                
            }
        }else{
            return new Errores("Semantico", "Tipo de dato no booleano en IF", this.fila, this.columna);
        }
        // return null;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error('Method not implemented.');
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }

}