import { Ast } from "../Ast/Ast";
import { Errores } from "../Ast/Errores";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../TablaSimbolos/Tipo";
import { Funcion } from "../Instrucciones/Metodos/Funcion";

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

                if( valueExpr instanceof Errores ){
                    return new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (resultFunc.parameters[count].tipo == expr.tipo || resultFunc.parameters[count].tipo == TIPO.ANY)  //Valida Tipos
                {
                    let symbol;
                    if (resultFunc.parameters[count].tipo == TIPO.ANY)
                    {
                        // alert("valexp ll: " + valueExpr);
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),expr.tipo, this.arreglo, this.fila, this.columna, valueExpr ); // seteo para variables nativas
                    }else{
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),resultFunc.parameters[count].tipo, this.arreglo, this.fila, this.columna, valueExpr );
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
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}