import { Struct } from './../Instrucciones/Struct/Struct';
import { DeclararStruct } from './../Instrucciones/Struct/DeclararStruct';
import { Asignacion } from './../Instrucciones/Asignacion';
import { traceDeprecation } from "process";
import { Errores } from "../Ast/Errores";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Funcion } from "../Instrucciones/Metodos/Funcion";
import { Simbolo } from "./Simbolo";
import { TIPO } from "./Tipo";
import { DeclaracionArr } from '../Instrucciones/Arreglos/DeclaracionArr';

export class TablaSimbolos{

    public anterior: TablaSimbolos;
    public tabla: Map<string, Simbolo>;
    public pos3d: string;
    public size: number;

    constructor(anterior : TablaSimbolos){
        this.anterior = anterior;
        this.tabla = new Map<string, Simbolo>();
        this.size = anterior?.size || 0;
    }

    public setSymbolTabla(simbolo: Simbolo){
        
        if (this.existeEnActual(simbolo.id)){
            // console.log("Entreeeeee")
            return new Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }else{
            // this.tabla[simbolo.getId()] = simbolo;
            simbolo.setPosicion(this.size++);
            this.tabla.set(simbolo.getId(),simbolo);
            // console.log("set simbolo " +  simbolo.getId() + " " + simbolo.getValor())
            return null;
        }
    }

    public existeEnActual(id: string): boolean{
        let entorno : TablaSimbolos = this;

        let existe = entorno.tabla.get(id);
        if(existe != null){
            return true;
        }
        return false;
    }

    public toStringTable(){
        let cadena = "";
        if(this.tabla == null)
        {
            return "null";
        }
        JSON.stringify((this.tabla.forEach((key ,value)=>{
            // console.log(value)
            // console.log( key['valor'] +"," )
            if (key != null && key['valor'] instanceof TablaSimbolos)
            {
                    cadena += key.toStringStruct()
            }else{
                cadena +=  key['valor'] +",";
            }
        })));
        return cadena;
    }

    public existe(id: string): boolean{
        let entorno : TablaSimbolos = this;

        while(entorno != null){
            let existe = entorno.tabla.get(id);

            if(existe != null){
                return true;
            }
            entorno = entorno.anterior;
        }
        return false;
    }
    /**
     * @function  getSymbolTabla
     * @param id 
     * @returns 
     */

    public getSymbolTabla(id: string):Simbolo
    {
        let tablaActual: TablaSimbolos = this;
        while(tablaActual != null){
            let existe = tablaActual.tabla.get(id);
            if(existe != null){
                return existe;
            }else{
                tablaActual = tablaActual.anterior;
            }
        }
        return null;
    }

    public imprimirTabla():string{
        let content = "";
        let cont = 1;
        // console.log("printtable");
        for(let [k,v] of this.tabla){
            let symbol = <Simbolo>v;
            /** DECLARACION */
            content += `
                <tr>
                <th scope="row">${cont}</th>
                <td>Declaracion</td>
                <td>Global</td>
                <td>${k}</td>
                <td>${symbol.fila}</td>
                <td>${symbol.columna}</td>
                </tr>
                `
            cont++;
        }
        return content;
    }

    public updateSymbolTabla(simbolo){
        // console.log(`update id: ${simbolo.id}`);
        let tablaActual: TablaSimbolos = this;
        while(tablaActual != null){
            let existe = tablaActual.tabla.get(simbolo.id);
            if(existe != null){
                // validacion DE TIPO
                if(existe.getTipo() == simbolo.getTipo() 
                    || (simbolo.getTipo() == TIPO.STRUCT && simbolo.getTipo() == existe.getTipo())
                    || (existe.getTipo() ==  TIPO.STRUCT && simbolo.getTipo() == TIPO.NULO ))
                {
                    existe.setValor(simbolo.getValor());
                    existe.setTipo(simbolo.getTipo());

                    // AGREGAR STRUCT ACA

                    return null;
                }
                // console.log(`tipoo exp: ${existe.getTipo()} tipo variableSym: ${simbolo.getTipo()}`);
                return new Errores("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }else{
                tablaActual = tablaActual.anterior
            }
        }
        return new Errores("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
    }

    getTipoStr(tipo:TIPO):string{
        switch(tipo){
            case TIPO.ENTERO:
                return "int";
            case TIPO.DECIMAL:
                return "double";
            case TIPO.CADENA:
                return "String";
            case TIPO.CHARACTER:
                return "char";
            case TIPO.ARREGLO:
                return "array";
            case TIPO.STRUCT:
                return "struct";
            case TIPO.BOOLEANO:
                return "boolean";
            default:
                return "invalido";
        }
    }
}