import { Retorno } from './../../G3D/Retorno';
import { Instruccion } from './../../Interfaces/Instruccion';
import { OperadorLogico } from './../../TablaSimbolos/Tipo';
import { Nodo } from "../../Ast/Nodo";
import { Ast } from "../../Ast/Ast"
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Detener } from '../Transferencia/Break';
import { Return } from '../Transferencia/Return';
import { Case } from './Case';
import { Errores } from '../../Ast/Errores';

export class Switch implements Instruccion{

    public condicion_sw : Instruccion;
    public lista_case : Array<Case>;
    public lista_default : Array<Instruccion>;
    public fila : number;
    public columna : number;
    arreglo: boolean;
    /**
     * 
     * @param condicion_sw Condicion del switch
     * @param lista_case Lista instrucciones de cases dentro del switch
     * @param lista_default Lista instrucciones en default
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(condicion_sw, lista_case, lista_default, fila, columna) {
        this.condicion_sw = condicion_sw;
        this.lista_case = lista_case;
        this.lista_default = lista_default;
        this.columna = columna;
        this.fila = fila;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let ts_local = new TablaSimbolos(table);
        for(let case_temp of this.lista_case){
            case_temp.condicion_sw = this.condicion_sw.ejecutar(ts_local, tree);
            if (case_temp.condicion_case instanceof Errores)
            {
                tree.getErrores().push(case_temp.condicion_case);
                tree.updateConsolaPrintln(case_temp.condicion_case.toString());
            }
        }
        let x=0;
        let index_cases = 0;
        for(let ins of this.lista_case){
            let res=ins.ejecutar(ts_local, tree);
            if (res instanceof Errores)
            {
                tree.getErrores().push(res);
                tree.updateConsolaPrintln(res.toString());
            }
            if( ins instanceof Detener || res instanceof Detener){
                // controlador.graficarEntornos(controlador,ts_local," (switch)");
                x=1;
                break;
            }else{
                if( ins instanceof Return || res instanceof Return){
                    // controlador.graficarEntornos(controlador,ts_local," (switch)");
                    return res; 
                }
            }
            let cond_sw = this.condicion_sw.ejecutar(table, tree);
            let cond_cs = ins.condicion_case.ejecutar(ts_local, tree);
            // console.log("cond_sw");
            // console.log(cond_sw);
            // console.log("ins.condicion_case");
            // console.log(ins.condicion_case.ejecutar(ts_local, tree));
            // console.log(cond_sw != ins.condicion_case);
            // console.log("index_cases");
            // console.log(index_cases);
            // console.log("this.lista_case.length - 1");
            // console.log(this.lista_case.length - 1);
            // console.log(index_cases == (this.lista_case.length - 1));
            
            if((cond_sw != cond_cs) && (index_cases == (this.lista_case.length - 1))){
                for(let ins of this.lista_default){
                    let res=ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores)
                    {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    if( ins instanceof Detener || res instanceof Detener){
                        // controlador.graficarEntornos(controlador,ts_local," (switch)");
                        break;
                    }else{
                        if( ins instanceof Return || res instanceof Return){
                            // controlador.graficarEntornos(controlador,ts_local," (switch)");
                            return res; 
                        }
                    }
                }
            }
            index_cases++;
        }

        if(x==0){
            for(let ins of this.lista_default){
                let res=ins.ejecutar(ts_local, tree);
                if (res instanceof Errores)
                {
                    tree.getErrores().push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
                if( ins instanceof Detener || res instanceof Detener){
                    // controlador.graficarEntornos(controlador,ts_local," (switch)");
                    break;
                }else{
                    if( ins instanceof Return || res instanceof Return){
                        // controlador.graficarEntornos(controlador,ts_local," (switch)");
                        return res; 
                    }
                }
            }
        }
    }
    /**
     * Traduce a codigo de tres direcciones
     * @param table 
     * @param tree 
     */
    translate3d(table: TablaSimbolos, tree: Ast) {
        // console.log("this.lista_case");
        // console.log(this.lista_case);
        // console.log("this.lista_default");
        // console.log(this.lista_default);
        const genc3d = tree.generadorC3d;
        let ts_local = new TablaSimbolos (table);
        const lb_exit = genc3d.newLabel();
        let tempBool = '';
        genc3d.gen_Comment('--------- INICIA SWITCH ---------');
        
        const condicion = this.condicion_sw.translate3d(table, tree);
        // console.log("condicion.tipo");
        // console.log(condicion.tipo);
        if(condicion.tipo === TIPO.BOOLEANO){
            // console.log("CONDICION BOOLEANA");
            const lbljump = genc3d.newLabel();
            const temp = genc3d.newTemp();
            genc3d.gen_Label(condicion.lblTrue);
            genc3d.genAsignaTemp(temp, '1');
            genc3d.gen_Goto(lbljump);
            genc3d.gen_Label(condicion.lblFalse);
            genc3d.genAsignaTemp(temp, '0');
            genc3d.gen_Label(lbljump);
            tempBool = temp;
        }
        // if(condicion.tipo !== TIPO.ENTERO && condicion.tipo !== TIPO.DECIMAL && condicion.tipo !== TIPO.BOOLEANO){
        //     return new Errores('Semantico', 'Tipo de condicion incorrecta.', this.fila, this.columna);
        // }
        genc3d.gen_Comment('--------- INICIAN CASES ');
        // this.lista_case.forEach(case_temp => {
        //     case_temp.condicion_sw = this.condicion_sw.translate3d(ts_local, tree);
        // });
        
        let num_default = false;
        
        let lb_case_true = genc3d.newLabel();
        let lb_case_false = genc3d.newLabel();
            
        let index_cases = 0;
        let index_default = 0;
        if(this.lista_case != null){
            this.lista_case.forEach(ins_case => {
                ts_local.break = lb_exit;
                let res_case = ins_case.condicion_case.translate3d(ts_local, tree);
                if(res_case.tipo == TIPO.BOOLEANO){
                    genc3d.gen_Label(res_case.lblTrue);
                    genc3d.gen_If(tempBool, '1', '==', lb_case_true);
                    genc3d.gen_Goto(lb_case_false);
                    genc3d.gen_Label(res_case.lblFalse);
                    genc3d.gen_If(tempBool, '0', '==', lb_case_true);
                    genc3d.gen_Goto(lb_case_false);
                }else{
                    let valor_sw = condicion.translate3d();
                    let valor_cs = res_case.translate3d();
                    const temp = genc3d.newTemp();
                    if(condicion.tipo == TIPO.CADENA){
                        const tempAux = genc3d.newTemp();
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_sw);
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_cs);
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natCompararIgualStr');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);

                        lb_case_true = lb_case_true == '' ? genc3d.newLabel() : lb_case_true;
                        // console.log(this.lblTrue)
                        lb_case_false = lb_case_false == '' ? genc3d.newLabel() : lb_case_false;
                        // console.log(this.lblFalse)
                        genc3d.gen_If(temp, '1', '==', lb_case_true);
                        genc3d.gen_Goto(lb_case_false);
                        const retorno = new Retorno(temp, true, TIPO.BOOLEANO,null,ts_local,tree);
                        retorno.lblTrue = lb_case_true;
                        retorno.lblFalse = lb_case_false;
                    }else if(condicion.tipo == TIPO.CHARACTER){
                        genc3d.gen_If(valor_sw, valor_cs, '==', lb_case_true);
                        genc3d.gen_Goto(lb_case_false);
                    }else{
                        genc3d.gen_If(valor_sw, valor_cs, '==', lb_case_true);
                        genc3d.gen_Goto(lb_case_false);
                    }
                }
                
                genc3d.gen_Label(lb_case_true);
                ins_case.lista_instrucciones.forEach(ins_case => {
                    ins_case.translate3d(ts_local, tree);
                });
                // genc3d.gen_Goto(lb_exit);
                // console.log(Number(ins_case.lista_instrucciones));
                if (index_cases < this.lista_case.length) {
                    // console.log("Number(ins_case) < this.lista_case.length - 1")
                    lb_case_true = genc3d.newLabel();
                    genc3d.gen_Goto(lb_case_true);
                    genc3d.gen_Label(lb_case_false);
                    lb_case_false = genc3d.newLabel();
                }else{
                    // console.log("ELSE Number(ins_case) < this.lista_case.length - 1")
                    genc3d.gen_Label(lb_case_false);
                }
                // if(ins_case instanceof Detener || res_case instanceof Detener){
                //     x = 1;
                //     break;
                // }
                index_cases++;
            });
        }
        if(this.lista_default != null){
            genc3d.gen_Comment('--------- INICIA DEFAULT ');
            if(num_default){
                return new Errores('Semantico', 'Solamente se acepta una instruccion defaul.', this.fila, this.columna);
            }
            num_default = true;
            ts_local.break == lb_exit;
            genc3d.gen_Label(lb_case_true);
            // console.log("entro a else: ");
            // console.log(this.lista_default);
            this.lista_default.forEach(ins_default => {
                // console.log("recorriendo ins else: " + index_default);
                ins_default.translate3d(ts_local, tree);
                // if (index_default < this.lista_default.length) {
                //     lb_case_true = genc3d.newLabel();
                //     genc3d.gen_Goto(lb_case_true);
                //     lb_case_false = genc3d.newLabel();
                // }
                index_default++;
            });
        }
        
        genc3d.gen_Label(lb_exit);
        genc3d.gen_Comment('--------- FINALIZA SWITCH ---------');
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("SWITCH", "");

        let condicion = new Nodo("CONDICION","");
        condicion.addChildNode(this.condicion_sw.ejecutar(table,tree));
        
        let listaCase = new Nodo("LISTA CASE","");
        for(let instr of this.lista_case)
        {
            listaCase.addChildNode(instr.recorrer(table,tree));
        }

        let listaDefault = new Nodo("LISTA DEFAULT","");
        if (this.lista_default != null)
        {
            for(let instr of this.lista_default)
            {
                listaDefault.addChildNode(instr.recorrer(table,tree));
            }
        }


        return padre;
    }

}