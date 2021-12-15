import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Nodo } from "../../Ast/Nodo";
import { Identificador } from "../../Expresiones/Identificador";
import { AccesoStruct } from "../../Expresiones/Struct/AccesoStruct";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Asignacion } from "../Asignacion";
import { Struct } from "./Struct";

export class AsignaVariable implements Instruccion{
    fila: number;
    columna: number;
    arreglo: boolean;

    // public id: string;
    public idStruct;
    public idAcceso :Identificador | AsignaVariable |Instruccion;
    public tipo : TIPO;
    // public ultimo : boolean;
    // public simboloStruct :Simbolo;
    public instruccion: Instruccion | Asignacion ;
    public entornoPadre;

    constructor( idStruct, idAcceso, fila, columna){
        this.idStruct = idStruct; // Acceso | ID
        this.instruccion =idAcceso;    // Acceso | ID
        this.fila = fila;
        this.columna =columna;
        // this.instruccion = null;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        let resultAcceso = null;
        resultAcceso =  this.idStruct.ejecutar(table,tree);
        if (resultAcceso instanceof Errores)
                return resultAcceso;
        if (this.idStruct instanceof Simbolo)
        {
            resultAcceso = this.idStruct;
        }
          // let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        // //retorno el simbolo si este ya fue 

        
        // EJCUTANDO CAMBIO 
        if (this.instruccion instanceof Asignacion){
            let valorExpr = this.instruccion.expresion.ejecutar(table,tree); // Ejecutando ID, o Primitivo, Acceso
            if (valorExpr instanceof Errores)
                return valorExpr;
            if (valorExpr instanceof Simbolo) // es un id (struct, o Variable normal)
            {
                /**
                 * Puede venir:
                 * struct -> struct
                 * struct -> nulo
                 * var -> primitivo
                 * --- tipo = tipo
                 */
                if (resultAcceso.tipo =TIPO.STRUCT && this.instruccion.expresion.tipo == resultAcceso.tipo && (valorExpr.tipoStruct == resultAcceso.tipoStruct)) // validando Simbolo struct = struct
                {
                    resultAcceso.valor = valorExpr;
                }else if (this.instruccion.expresion.tipo  == TIPO.NULO)
                {
                    resultAcceso.valor = null;
                }else if (resultAcceso.tipo == this.instruccion.expresion.tipo )
                {
                    resultAcceso.valor = valorExpr
                }else{
                    return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " Error en asignacion ", this.fila, this.columna);
                }
            }
        }
        return resultAcceso;
    }


    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        let padre =  new Nodo("AsignaVariableStruct","");
        padre.addChildNode(this.idStruct.ejecutar(table,tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }

    
    queondaaparte():any
    {
        // if(!(this.idStruct instanceof Identificador)){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        // }
        // // console.log("acceso")
        // let simboloStruct = this.idStruct.ejecutar(table,tree);
        // // this.id= this.idStruct.id; 
        // if (simboloStruct == null){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        // }
         

        // if(!(this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable || this.idAcceso instanceof Struct )){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        // }
        // // if (this.idAcceso instanceof AsignaVariable)
        // // {
        // //     this.idAcceso.instruccion = this.instruccion
        // // }
        

        // // if (this.instruccion !=null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion && this.idAcceso instanceof Identificador )
        // // {
        // //     this.instruccion.id =  this.idAcceso.id ;
        // //     if (this.idAcceso instanceof Identificador && this.idStruct instanceof Identificador){
        // //         let result = this.instruccion.ejecutar(simboloStruct.valor,tree);
        // //         if (result instanceof Errores)
        // //             return result;
        // //         return result;
        // //     }
            
        // // }
        // let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        // //retorno el simbolo si este ya fue 
        // if (resultAcceso instanceof Simbolo && (this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable)){
        //     return resultAcceso;
        // }  
        console.log("");
    }

}