import { Retorno } from './../../G3D/Retorno';
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    EJECUTAR      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    ejecutar(table: TablaSimbolos, tree: Ast) {
        // let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        // console.log("if cond: " + valor_condicion);
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::    C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    translate3d(table: TablaSimbolos, tree: Ast) {
        const genc3d = tree.generadorC3d;

        let valor_condicion = this.condicion.translate3d(table, tree);
        console.log("valor_condicion valor");
        console.log(valor_condicion.valor);
        console.log("valor_condicion tipo");
        console.log(valor_condicion.tipo);
        console.log("valor_condicion istemp");
        console.log(valor_condicion.istemp);
        if (valor_condicion instanceof Errores)
        {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        let lb_exit;
        if(valor_condicion instanceof Retorno){
            if(this.condicion.tipo == TIPO.BOOLEANO){
                if(valor_condicion.istemp){
                    genc3d.gen_If(valor_condicion.valor, "1", "==", valor_condicion.lblTrue);
                    genc3d.gen_Goto(valor_condicion.lblFalse);
                }
                genc3d.gen_Label(valor_condicion.lblTrue);
                this.lista_ifs.forEach(instruccion => {
                    instruccion.translate3d(table, tree);
                });
            }else{
                if(this.lista_elses != null){
                    lb_exit = genc3d.newLabel();
                    genc3d.gen_Goto(lb_exit);
                    genc3d.gen_Label(valor_condicion.lblFalse);
                    this.lista_elses.forEach(instruccion => {
                        instruccion.translate3d(table, tree);
                    });
                    genc3d.gen_Label(lb_exit);
                }else if(this.lista_ifelse != null){
                    this.lista_ifelse.translate3d(table, tree);
                }
        }
    }
    }

    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("IF","");

        let condicion = new Nodo("CONDICION","");
        condicion.addChildNode(this.condicion.ejecutar(table,tree));

        // LISTA IFS
        let listaIfs = new Nodo("INSTRUCCIONES IFS","");
        for(let instr of this.lista_ifs)
        {
            listaIfs.addChildNode(instr.recorrer(table,tree));
        }
        padre.addChildNode(listaIfs);


        // LISTA IFS
        if (this.lista_elses !=null ){
            let listaElse = new Nodo("INSTRUCCIONES Else","");
            for(let instr of this.lista_elses)
            {
                listaElse.addChildNode(instr.recorrer(table,tree));
            }
            padre.addChildNode(listaElse);
        }

        // LISTA IFS
        if (this.lista_ifelse !=null ){
            
            padre.addChildNode(this.lista_ifelse.recorrer(table,tree));
        }


        return padre;
    }


    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }

}