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
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented FUNCION.");
    }
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