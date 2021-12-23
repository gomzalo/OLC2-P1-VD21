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

        // validacion si es una asignacion de Struct
        if (resultFunc == null)
        {
            let resultStruct = tree.getStruct(this.id);
            if (resultStruct != null)
            {
                return this.ejecutarCreateStruct(table,tree);
            }
            
        }

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
                    // }else if(expr instanceof Identificador && valueExpr instanceof Array && resultFunc.parameters[count].tipo == TIPO.STRUCT){ // ARRAY
                    }else if(expr instanceof Identificador && valueExpr instanceof Array){ // ARRAY
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),resultFunc.parameters[count].tipo, true, this.fila, this.columna, valueExpr );
                    }else if(valueExpr instanceof Simbolo && valueExpr.tipo == TIPO.STRUCT && resultFunc.parameters[count].tipo == TIPO.STRUCT){
                        symbol = new Simbolo(String(resultFunc.parameters[count].id),resultFunc.parameters[count].tipo, false, this.fila, this.columna, valueExpr.valor );
                        symbol.tipoStruct = resultFunc.parameters[count].tipoStruct;
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
        if (valor instanceof Simbolo && valor.tipo == TIPO.STRUCT)
        {
            this.tipo = valor.tipo;
            return valor;
        }
        this.tipo = resultFunc.tipo;
        return valor;

    }

    ejecutarCreateStruct(table: TablaSimbolos, tree: Ast)
    {
        // SI NO, ES ASIGNACION CON DECLARACION=
            //1 Obtenemos Struct
            let struct = tree.getStruct(this.id); // Struct
            // console.log(struct);
            if (struct == null){
                return new Errores("Semantico", "Llamada - Struct " + this.id + ": NO coincide con la busqueda", this.fila, this.columna);
            }


            //2 EJECUTAMOS  STRUCT
            // struct.idSimbolo =this.id;
            let SymbolStructNow = new Simbolo(this.id, TIPO.STRUCT, false, this.fila, this.columna, new TablaSimbolos(null));
            // nuevo_simb.tipoStruct = this.id;
            
            // tree.updateConsolaPrintln(" tamano variables: struct; " + this.variables.length);
            // tree.updateConsolaPrintln(" tamano instruccines: struct; " + this.instructions.length);
            
            /**
             * GUARDAMOS SIMBOLO STRUCT
             */
            let entornoAttributes = new TablaSimbolos(null);
            let varSTemps = [];
            let resultStruct = struct.executeEnvironment(entornoAttributes,tree,varSTemps); // retorna variables
            if (resultStruct instanceof Errores)
                return resultStruct
            // table.setSymbolTabla(nuevo_simb);
            
            
            // 
            // console.log(table.getSymbolTabla(this.id));
            // 2.1 if es nulo, solo declara
            

            

            
            // Ejecutando parametros
            // let SymbolStructNow = table.getSymbolTabla(this.id);
            SymbolStructNow.valor =  new TablaSimbolos(null);
            SymbolStructNow.valor = entornoAttributes;
            SymbolStructNow.variables = varSTemps;
            // tree.updateConsolaPrintln(`to strinng Struct: ${SymbolStructNow.valor.toStringTable()}`);

            // let newTable = nuevo_simb.getValor();
            // console.log("STRUCTTTTTTTTTTTTTTTTTTTTTTT")
            // console.log(SymbolStructNow)
            // valido tama;o de   parametros parameters de funcion y parametros de llamada
            if (this.parameters.length == SymbolStructNow.variables.length)
            {
                let count=0;
                for (let expr of this.parameters) 
                {
                    let valueExpr = expr.ejecutar(table,tree);

                    if( valueExpr instanceof Errores ){
                        return new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                    }
                    if (SymbolStructNow.variables[count].tipo == expr.tipo || SymbolStructNow.variables[count].tipo == TIPO.ANY || expr.tipo == TIPO.NULO)  //Valida Tipos
                    {
                        let symbol;
                        if (SymbolStructNow.variables[count].tipo == TIPO.ANY)
                        {
                            symbol = new Simbolo(String(SymbolStructNow.variables[count].id),expr.tipo, false, this.fila, this.columna, valueExpr ); // seteo para variables nativas
                            
                        }else if (SymbolStructNow.variables[count].tipo == TIPO.STRUCT)
                        {
                            // Dos formas 1: struct intanciado|| null
                            // IF el nuevo parametro es de tipo struct
                            if(expr.tipo == TIPO.STRUCT && expr.tipoStruct == this.id)
                            {
                                symbol = new Simbolo(SymbolStructNow.variables[count].id,TIPO.STRUCT, false, this.fila, this.columna, valueExpr.valor);
                                symbol.variables = valueExpr.variables;
                                symbol.tipoStruct = this.id;
                            }
                            if(expr.tipo == TIPO.NULO )
                            {
                                symbol = new Simbolo(SymbolStructNow.variables[count].id,TIPO.STRUCT, false, this.fila, this.columna, null);
                                // symbol.variables = valueExpr.variables;
                                symbol.variables = [];
                                symbol.tipoStruct = this.id
                            }
                            // symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                            
                        }else{
                            symbol = new Simbolo(SymbolStructNow.variables[count].id,SymbolStructNow.variables[count].tipo, false, this.fila, this.columna, valueExpr );
                        }
                        // console.log(struct)
                        // console.log(symbol)
                        let resultTable = SymbolStructNow.valor.updateSymbolTabla(symbol)
                        if (resultTable instanceof Errores)
                            return resultTable
                    }else{
                        return new Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                    }

                    count++;
                }
                // let resultStruct = table.updateSymbolTabla(SymbolStructNow); // Update Struct Actual
                // if (resultStruct instanceof Errores)
                //     return resultStruct
                // return null;
            }else{
                console.log(`tam param call: ${this.parameters.length} func ${struct.instructions.length}`);
                return new Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
            }
            return SymbolStructNow.valor;
            
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