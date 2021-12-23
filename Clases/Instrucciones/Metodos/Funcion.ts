import { Simbolo } from './../../TablaSimbolos/Simbolo';
import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Struct } from "../Struct/Struct";
import { Detener } from "../Transferencia/Break";
import { Continuar } from "../Transferencia/Continuar";
import { Return } from "../Transferencia/Return";

export class Funcion implements Instruccion{
    public fila: number;
    public columna: number;
    public tipo : TIPO;
    public id : string;
    public parameters: Array<any>;
    public instructions : Array<Instruccion>;
    public tipoStruct: any;
    arreglo: boolean;
    /**
     * @function Funcion 
     * @param id ID de la funcion a crear
     * @param tipo Tipo de la funcion: todos menos null.
     * @param parameters Parametros que recibe la funcion.
     * @param instructions Instrucciones dentro de la funcion
     * @param fila 
     * @param columna 
     */
    constructor(id, tipo, parameters, instructions, fila, columna)
    {
        this.tipo =tipo;
        this.id = id;
        this.parameters =parameters;
        this.instructions = instructions;
        this.fila = fila;
        this.columna =columna;
        this.tipoStruct = null;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let newTable = new TablaSimbolos(table);
        if(this.instructions.length > 0){
            for(let instr of this.instructions)
            {
                let result = instr.ejecutar(newTable,tree);
                if (result instanceof Errores)
                {
                    tree.getErrores().push(result);
                    tree.updateConsolaPrintln(result.toString());
                }
                if( result instanceof Detener ){
                    let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                    tree.getErrores().push(error);
                    tree.updateConsolaPrintln(error.toString());
                }
                if( result instanceof Continuar){
                    let error = new Errores("Semantico", "Sentencia Continuar fuera de Instruccion Ciclo", this.fila, this.columna);
                    tree.getErrores().push(error);
                    tree.updateConsolaPrintln(error.toString());
                }
                if( result instanceof Return){
                    this.tipo = result.tipo;
                    if (result instanceof Struct)
                    {
                        return result
                    }
                    return result.valor;
                }
                if (result instanceof Struct)
                {
                    return result
                }
            }
        }
        return null;
    }
    /**
     * @function translate3d Traduce a C3D
     * @param table 
     * @param tree 
     */
    translate3d(table: TablaSimbolos, tree: Ast) {
        // this.validarParametros(table, tree);
        // tree.

        let funcion = tree.getFunction(this.id);
        if( funcion !== undefined && funcion !== null){
            let genc3d = tree.generadorC3d;
            let newTabla = new TablaSimbolos(table);
            let returnLbl = genc3d.newLabel();
            let tempStorage = genc3d.getTempStorage();
            let codeActual =  genc3d.getOnlyCode();
            
            newTabla.setTableFuncion(funcion, returnLbl);
            this.parameters.forEach((param) => {
                newTabla.setSymbolTabla(new Simbolo(param["id"], param["tipo"], false, this.fila, this.columna, null));
            });
            genc3d.clearTempStorage();
            genc3d.clearCode();

            genc3d.isFunc = '\t';
            genc3d.gen_Funcion(funcion.id);
            genc3d.newLabel();
            this.instructions.forEach((instr) => {
                instr.translate3d(newTabla, tree);
            });
            genc3d.gen_Label(returnLbl);
            genc3d.gen_Code('return;');
            genc3d.gen_EndFunction();
            genc3d.isFunc = '';
            genc3d.agregarFuncion(genc3d.getOnlyCode());
            genc3d.setOnlyCode(codeActual);
            genc3d.setTempStorage(tempStorage);
        }
    }
    // /**
    //  * @function validarParametros valida los parametros en la funcion.
    //  * @param table 
    //  * @param tree 
    //  */
    // validarParametros(table: TablaSimbolos, tree: Ast){
    //     const set = new Set<string>();
    //     this.parameters.forEach((param) => {
    //         if(set.has(param["id"])){
    //             let error = new Errores("Semantico", `Parametro con nombre "${param["id"]}" repetiod en la función.`, this.fila, this.columna);
    //             tree.getErrores().push(error);
    //             tree.updateConsolaPrintln(error.toString());
    //         }
    //         set.add(param["id"]);
    //     });
    // }
    // /**
    //  * @function validarTipo valida los tipos en la funcion.
    //  * @param table 
    //  * @param tree 
    //  */
    // validarTipo(table: TablaSimbolos, tree: Ast){
    //     if(this.tipo == )
    // }
    /**
     * @function recorrer Grafica el nodo del AST
     * @param table 
     * @param tree 
     * @returns 
     */
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("FUNCION","");
        
        padre.addChildNode( new Nodo(this.id,""));
        let params = new Nodo("PARAMETROS","");
        for(let par of this.parameters)
        {
            let parametro = new Nodo("PARAMETRO","");
            parametro.addChildNode(par["tipo"]);
            parametro.addChildNode(par["id"]);
            params.addChildNode(parametro);
        }
        padre.addChildNode(params);

        let NodoInstr = new Nodo("INSTRUCCIONES","");
        for(let instr of this.instructions)
        {
            NodoInstr.addChildNode(instr.recorrer(table,tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }

}