import { Identificador } from './Identificador';
import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Funcion } from "../Instrucciones/Metodos/Funcion";
import { Nodo } from "../Ast/Nodo";
import { Struct } from '../Instrucciones/Struct/Struct';

export class Llamada implements Instruccion{
    public id: string;
    public parameters : Array<any>;
    public fila : number;
    public columna : number;
    arreglo = false;
    public tipo : TIPO;

    constructor(id,parameters, fila, columna, arreglo =false)
    {
        this.id = id;
        this.parameters =parameters;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = arreglo;
    }

    ejecutar(table: TablaSimbolos, tree: Ast) {
        let resultFunc = tree.getFunction(this.id) ;
        if (resultFunc == null ){
            return new Errores("Semantico", "Funcion no encontrada en asignacion", this.fila,this.columna); 
        }

        // Ejecutando parametros
        let newTable = new TablaSimbolos(tree.getTSGlobal());
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.parameters.length == resultFunc.parameters.length)
        {
            let count=0;
            for (let expr of this.parameters)
            {
                let valueExpr = expr.ejecutar(table,tree);
                // console.log("expr: ");
                // console.log(expr);
                // console.log("valueExpr: " + valueExpr);
                // console.log("resultFunc.parameters[count]: ");
                // console.log(resultFunc.parameters[count]);
                if( valueExpr instanceof Errores ){
                    return new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (resultFunc.parameters[count].tipo == expr.tipo || resultFunc.parameters[count].tipo == TIPO.ANY || (expr instanceof Identificador && expr.symbol.arreglo) 
                    || typeof valueExpr == "number" )  //Valida Tipos
                {
                    let symbol;
                    // console.log(resultFunc.parameters[count]);
                    if (resultFunc.parameters[count].tipo == TIPO.ANY)
                    {
                        // alert("valexp ll: " + valueExpr);
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),expr.tipo, this.arreglo, this.fila, this.columna, valueExpr ); // seteo para variables nativas
                    }else if(expr instanceof Identificador && valueExpr instanceof Array && resultFunc.parameters[count].tipo == TIPO.STRUCT){ // ARRAY
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),resultFunc.parameters[count].tipo, true, this.fila, this.columna, valueExpr );
                    }else if(valueExpr instanceof Simbolo && valueExpr.tipo == TIPO.STRUCT && resultFunc.parameters[count].tipo == TIPO.STRUCT){
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),resultFunc.parameters[count].tipo, false, this.fila, this.columna, valueExpr.valor );
                        symbol.tipoStruct = valueExpr.tipo;
                    }else{
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),resultFunc.parameters[count].tipo, this.arreglo, this.fila, this.columna, valueExpr );
                        if(!Number.isInteger(valueExpr) && symbol.tipo ==TIPO.DECIMAL)
                        {
                            symbol.valor = Math.round(symbol.valor);
                        }
                    }
                    let resultTable = newTable.setSymbolTabla(symbol)
                    if (resultTable instanceof Errores)
                        return resultTable
                }else{
                    return new Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                }

                count++;
            }
        }else{
            console.log(`tam param call: ${this.parameters.length} func ${resultFunc.parameters.length}`);
            return new Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
        }
        let valor = resultFunc.ejecutar(newTable,tree);
        if( valor instanceof Errores ){
            return valor;
        }
        this.tipo = resultFunc.tipo;
        return valor;

    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented LLAMADA.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre = new Nodo("LLAMADA FUNCION","");
        padre.addChildNode(new Nodo(this.id.toString(),""));
        let params = new Nodo("PARAMETROS","");
        for (let param of this.parameters)
        {   
            params.addChildNode(new Nodo(param.id,""))
        }
        padre.addChildNode(params);
        return padre;
    }

}