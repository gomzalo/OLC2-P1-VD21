import { Struct } from './../Instrucciones/Struct/Struct';
import { DeclararStruct } from './../Instrucciones/Struct/DeclararStruct';
import { Asignacion } from './../Instrucciones/Asignacion';
import { Errores } from "../Ast/Errores";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Funcion } from "../Instrucciones/Metodos/Funcion";
import { Simbolo } from "./Simbolo";
import { TIPO } from "./Tipo";
import { DeclaracionArr } from '../Instrucciones/Arreglos/DeclaracionArr';
import { Simbolo_funcion } from './Simbolo_funcion';

export class TablaSimbolos{

    public anterior: TablaSimbolos;
    public tabla: Map<string, Simbolo>;
    public pos3d: string;
    public size: number;
    public break: string | null;
    public continue: string | null;
    public return: string | null;
    public actual_funcion: Simbolo_funcion;
    /**
     * 
     * @param anterior Entorno anterior
     */
    constructor(anterior : TablaSimbolos){
        this.anterior = anterior;
        this.tabla = new Map<string, Simbolo>();
        this.size = anterior?.size || 0;
        this.break = anterior?.break || null;
        this.continue = anterior?.continue || null;
        this.return = anterior?.return || null;
        this.actual_funcion = anterior?.actual_funcion || null;
    }
    /**
     * @function setSymbolTabla Agrega un nuevo simbolo al entorno actual.
     * @param simbolo Símbolo que se agregara al entorno actual.
     * @returns 
     */
    public setSymbolTabla(simbolo: Simbolo){
        
        if (this.existeEnActual(simbolo.id)){
            // console.log("Entreeeeee")
            return new Errores("Semantico", `Variable con ID: "${simbolo.getId()}", ya existe.`, simbolo.getFila(), simbolo.getColumna());
        }else{
            // this.tabla[simbolo.getId()] = simbolo;
            
            simbolo.setPosicion(this.size++);
            this.tabla.set(simbolo.getId(),simbolo);
            // this.size++;
            // console.log("size: " + this.size);
            // console.log("set simbolo " +  simbolo.getId() + " " + simbolo.getValor())
            return null;
        }
    }
    /**
     * @function existeEnActual Verifica si el simbolo ya existe en el entorno actual.
     * @param id ID del simbolo a buscar dentro del entorno actual.
     * @returns 
     */
    public existeEnActual(id: string): boolean{
        let entorno : TablaSimbolos = this;

        let existe = entorno.tabla.get(id);
        if(existe != null){
            return true;
        }
        return false;
    }
    /**
     * @function setTableFuncion Establece el ambito de una funcion.
     * @param actual_funcion Simbolo de la nueva funcion.
     * @param lblreturn Etiqueta de retorno.
     */
    setTableFuncion(actual_funcion: Simbolo_funcion, lblreturn){
        // if(this.)
        this.size = 1;
        this.return = lblreturn;
        this.actual_funcion = actual_funcion;
    }
    /**
     * 
     * @returns Atributos del entorno en String.
     */
    public toStringTable(){
        let cadena = "";
        if(this.tabla == null)
        {
            return "null";
        }
        this.tabla.forEach((key ,value)=>{
            // console.log(value)
            // console.log( key['valor'] +"," )
            if (key != null && key['valor'] instanceof Simbolo)
            {
                    cadena += key.toStringStruct()
            } else if (key != null && key['valor'] instanceof TablaSimbolos)
            {
                    cadena += key.toStringStruct()
            }
            else{
                cadena +=  key['valor'] +",";
            }
        });
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
     * @function getSymbolTabla Obtiene un simbolo, si existe, dentro del entorno actual.
     * @param id ID del simbolo a buscar dentro del entorno actual.
     * @returns existe || null
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
    /**
     * @function imprimirTabla Imprime las variables declaradas en el entorno actual.
     * @param cont Devuelve el html que se agregara a la tabla del reporte de la Tabla de Simbolos.
     * @returns 
     */
    public imprimirTabla(cont: number):string{
        let content = "";
        // let cont = 1;
        // console.log("printtable");
        for(let [k,v] of this.tabla){
            let symbol = <Simbolo>v;
            if([k,v] != null || [k,v] != undefined){
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
                    || (existe.getTipo() ==  TIPO.STRUCT && simbolo.getTipo() == TIPO.NULO )
                    || (existe.getTipo() ==  TIPO.DECIMAL && simbolo.getTipo() == TIPO.ENTERO )) //SI ENTERO VIENE A ASIGNARSE EN DECIMAL
                {
                    existe.setValor(simbolo.getValor());
                    existe.setTipo(simbolo.getTipo());

                    // AGREGAR STRUCT ACA

                    return null;
                }
                // console.log(`tipoo exp: ${existe.getTipo()} tipo variableSym: ${simbolo.getTipo()}`);
                return new Errores("Semantico", "Tipo de dato diferente en asignacion.", simbolo.getFila(), simbolo.getColumna());
            }else{
                tablaActual = tablaActual.anterior
            }
        }
        return new Errores("Semantico", "Varibale no encontrada en asignacion.", simbolo.getFila(), simbolo.getColumna());
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