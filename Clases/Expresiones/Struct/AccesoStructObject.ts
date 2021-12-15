import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Struct } from "../../Instrucciones/Struct/Struct";
import { Instruccion } from "../../Interfaces/Instruccion";
import { Simbolo } from "../../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { TIPO } from "../../TablaSimbolos/Tipo";
import { Identificador } from "../Identificador";

export class AccesoStructObject implements Instruccion{
    fila: number;
    columna: number;
    arreglo: boolean;
    public id: string;
    public idStruct;
    public tipo : TIPO;
    // public simboloStruct :Simbolo;
    public expresiones: Identificador | AccesoStructObject | Struct; // OBjeto de objetos Identificador
    public idAcceso;
    // { expresiones: [],
    // identificador:
    //  }
    public accesoAttributes: TablaSimbolos;

    constructor(idStruct,expresiones,fila,columna )
    {
        this.idStruct = idStruct;
        // this.expresiones = expresiones;
        this.idAcceso = expresiones;
        this.fila = fila,
        this.columna = columna;
        this.tipo = TIPO.STRUCT
    }
    
    // ejecutar(table: TablaSimbolos, tree: Ast) {
    //     if(!(this.idStruct instanceof Identificador)){
    //         return new Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO ID", this.fila, this.columna);
    //     }
    //     // console.log("acceso")
    //     let simboloStruct = this.idStruct.ejecutar(table,tree);
    //     // this.id= this.idStruct.id; 
    //     if (simboloStruct == null){
    //         return new Errores("Semantico", "AccesoStruct " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
    //     }
    //     // if (simboloStruct.tipo != TIPO.STRUCT)
    //     // {
    //     //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
    //     // }

    //     // Acceso atributos
    //     // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)

    //     // console.log(this.idStruct)
    //     // console.log(this.expresiones);
    //     // console.log(simboloStruct);
    //     if(!(this.expresiones instanceof Identificador || this.expresiones instanceof AccesoStructObject || this.expresiones instanceof Struct )){
    //         return new Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
    //     }
    //     if(!(simboloStruct.valor instanceof TablaSimbolos)){
    //         return new Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
    //     }
    //     let resultAcceso = this.expresiones.ejecutar(simboloStruct.valor,tree);
    //     return resultAcceso;


    //     // let entornoAttributes = simboloStruct.getValor();
        
    //     // if (this.expresiones.expresiones.length >0)
    //     // {
    //     //     return this.accesoAttribute(this.expresiones.expresiones,entornoAttributes,tree);
    //     // }else{
    //     //     return null;
    //     // }



    //     // let valueId = null;
    //     // for (let expr of this.expresiones)
    //     // {
    //     //     return valueId = expr.ejecutar(entornoAttributes,tree);
    //     // }

    // }
    
    ejecutar(table: TablaSimbolos, tree: Ast):any
    {
        if(!(this.idStruct instanceof Identificador)){
            return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        }
        // console.log("acceso")
        let simboloStruct = this.idStruct.ejecutar(table,tree);
        // this.id= this.idStruct.id; 
        if (simboloStruct == null){
            return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
         

        if(!(this.idAcceso instanceof Identificador || this.idAcceso instanceof AccesoStructObject || this.idAcceso instanceof Struct )){
            return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        // if (this.idAcceso instanceof AsignaVariable)
        // {
        //     this.idAcceso.instruccion = this.instruccion
        // }
        

        // if (this.instruccion !=null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion && this.idAcceso instanceof Identificador )
        // {
        //     this.instruccion.id =  this.idAcceso.id ;
        //     if (this.idAcceso instanceof Identificador && this.idStruct instanceof Identificador){
        //         let result = this.instruccion.ejecutar(simboloStruct.valor,tree);
        //         if (result instanceof Errores)
        //             return result;
        //         return result;
        //     }
            
        // }
        let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        //retorno el simbolo si este ya fue 
        if (resultAcceso instanceof Simbolo && (this.idAcceso instanceof Identificador || this.idAcceso instanceof AccesoStructObject)){
            return resultAcceso;
        }  
        console.log("");
    }

    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}