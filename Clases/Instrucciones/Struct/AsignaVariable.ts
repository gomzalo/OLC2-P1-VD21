import { Ast } from "../../Ast/Ast";
import { Errores } from "../../Ast/Errores";
import { Identificador } from "../../Expresiones/Identificador";
import { AccesoStruct } from "../../Expresiones/Struct/AccesoStruct";
import { Instruccion } from "../../Interfaces/Instruccion";
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

    constructor( idStruct, idAcceso, fila, columna){
        this.idStruct = idStruct;
        this.idAcceso =idAcceso;
        this.fila = fila;
        this.columna =columna;
        this.instruccion = null;
    }
    ejecutar(table: TablaSimbolos, tree: Ast) {
        if(!(this.idStruct instanceof Identificador)){
            return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        }
        // console.log("acceso")
        let simboloStruct = this.idStruct.ejecutar(table,tree);
        // this.id= this.idStruct.id; 
        if (simboloStruct == null){
            return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
        // if (simboloStruct.tipo != TIPO.STRUCT)
        // {
        //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
        // }

        // Acceso atributos
        // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)

        // console.log(this.idStruct)
        // console.log(this.expresiones);
        // console.log(simboloStruct);
        if(!(this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable || this.idAcceso instanceof Struct )){
            return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        if (this.idAcceso instanceof AsignaVariable)
        {
            this.idAcceso.instruccion = this.instruccion
        }
        // if(!(simboloStruct.valor instanceof TablaSimbolos)){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO /Struct ", this.fila, this.columna);
        // }else{

        // }
        
        if (this.instruccion !=null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion && this.idAcceso instanceof Identificador )
        {
            this.instruccion.id =  this.idAcceso.id ;
            if (this.idAcceso instanceof Identificador && this.idStruct instanceof Identificador){
                let result = this.instruccion.ejecutar(simboloStruct.valor,tree);
                if (result instanceof Errores)
                    return result;
                return result;
            }
            
        }
        let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree);
        return resultAcceso;
    }
    translate3d(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }
    recorrer(table: TablaSimbolos, tree: Ast) {
        throw new Error("Method not implemented.");
    }

}