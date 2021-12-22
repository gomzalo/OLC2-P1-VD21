import { DeclararStruct } from './../Instrucciones/Struct/DeclararStruct';
import { Asignacion } from "../Instrucciones/Asignacion";
import { Declaracion } from "../Instrucciones/Declaracion";
import { Main } from "../Instrucciones/Metodos/Main";
import { Funcion } from "../Instrucciones/Metodos/Funcion";
import { Detener } from "../Instrucciones/Transferencia/Break";
import { Continuar } from "../Instrucciones/Transferencia/Continuar";
import { Return } from "../Instrucciones/Transferencia/Return";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { Errores } from "./Errores";
import { Struct } from "../Instrucciones/Struct/Struct";
import { DeclaracionArr } from "../Instrucciones/Arreglos/DeclaracionArr";
import { ModificacionArr } from '../Instrucciones/Arreglos/ModificacionArr';
import { Nodo } from './Nodo';
import { GeneradorC3D } from '../G3D/GeneradorC3D';

export class Ast  {
    public instrucciones:Array<Instruccion>;
    public funciones:Array<any> ;
    public structs ;
    public Errores ;
    public consola: string = "";
    public TSglobal : TablaSimbolos;
    public dot : string = "";
    public contador : number;
    public strEntorno : string = "";
    public generadorC3d : GeneradorC3D;
    public repGramatical : Array<string> ;

    /**
     * @class AST
     * Almacena instrucciones, funciones y structs.
     */
    constructor(){
        this.instrucciones = new Array<Instruccion>();
        this.funciones =  new Array();
        this.structs =  new Array();
        this.Errores = new Array();
        this.consola = "";
        // this.TSglobal =  null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno= "";
        this.TSglobal = new TablaSimbolos(null);
        this.generadorC3d=GeneradorC3D.getInstancia();
        this.repGramatical = new Array<string>();
    }
    /**
     * @function ejecutar interpreta las instrucciones, realiza las pasadas para verificar que no vengan instrucciones donde no son permitidas.
     */
    public ejecutar(){
        let tree = this;
        tree.setTSGlobal(this.TSglobal);
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        for(let instr of this.instrucciones){
            // let value = null;
            if(instr instanceof Funcion)
            {
                this.addFunction(instr);
            }
            if(instr instanceof Struct)
            {
                this.addStruct(instr);
            }
            if(instr instanceof Declaracion || instr instanceof Asignacion || instr instanceof DeclaracionArr || instr instanceof DeclararStruct || instr instanceof ModificacionArr)
            {
                let value = instr.ejecutar(this.TSglobal,tree);
                if (value instanceof Errores)
                {
                    this.getErrores().push(value);
                    this.updateConsolaPrintln(value.toString());
                }
                if( value instanceof Detener ){
                    let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if( value instanceof Continuar){
                    let error = new Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if( value instanceof Return){
                    let error = new Errores("Semantico", "Sentencia Return fuera de Metodos/Control/Ciclos", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
        }

        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for(let instr of this.instrucciones){
            let countMain = 0;
            if (instr instanceof Main)
            {
                countMain++;
                if (countMain == 2)
                {
                    let error = new Errores("Semantico", "Existe mas de un metodo main", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                    break;
                }
                let value = instr.ejecutar(this.TSglobal,tree);   
                if( value instanceof Detener ){
                    let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if( value instanceof Continuar){
                    let error = new Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
            // instr.ejecutar(this.TSglobal, this);
        };

        // 3RA PASADA
        // VALIDACION FUERA DE MAIN
        for( let instr of this.instrucciones){
            if (!(instr instanceof Declaracion || instr instanceof Asignacion || instr instanceof Main || instr instanceof Funcion || instr instanceof Struct || instr instanceof DeclaracionArr || instr instanceof ModificacionArr))
            {
                let error = new Errores("Semantico", "Sentencia Fuera de main", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
        }

    }
    /**
     * @function traducir traduce las instrucciones, realiza las pasadas para verificar que no vengan instrucciones donde no son permitidas.
     * @returns 
     */
    public traducir(){
        let tree = this;
        tree.generadorC3d.clearCode();
        tree.setTSGlobal(this.TSglobal);
        // console.log("ENTRO A TRANSLATE AST: ");
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        for(let instr of this.instrucciones){
            // let value = null;
            if(instr instanceof Funcion)
            {
                this.addFunction(instr);
            }
            if(instr instanceof Struct)
            {
                this.addStruct(instr);
            }
            if(instr instanceof Declaracion || instr instanceof Asignacion || instr instanceof DeclaracionArr || instr instanceof DeclararStruct || instr instanceof ModificacionArr)
            {
                console.log("ENTRO A DECLARACION GLOBAL: ");

                let value = instr.translate3d(this.TSglobal,tree);
                console.log(value);
                if (value instanceof Errores)
                {
                    this.getErrores().push(value);
                    this.updateConsolaPrintln(value.toString());
                }
                if( value instanceof Detener ){
                    let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if( value instanceof Continuar){
                    let error = new Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if( value instanceof Return){
                    let error = new Errores("Semantico", "Sentencia Return fuera de Metodos/Control/Ciclos", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
        }

        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for(let instr of this.instrucciones){
            let countMain = 0;
            if (instr instanceof Main)
            {
                countMain++;
                if (countMain == 2)
                {
                    let error = new Errores("Semantico", "Existe mas de un metodo main", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                    break;
                }
                console.log("ENTRO A DECLARACION GLOBAL: ");
                let value = instr.translate3d(this.TSglobal,tree);   
                // if( value instanceof Detener ){
                //     let error = new Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                //     this.getErrores().push(error);
                //     this.updateConsolaPrintln(error.toString());
                // }
                // if( value instanceof Continuar){
                //     let error = new Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                //     this.getErrores().push(error);
                //     this.updateConsolaPrintln(error.toString());
                // }
            }
            // instr.ejecutar(this.TSglobal, this);
        };

        // 3RA PASADA
        // VALIDACION FUERA DE MAIN
        for( let instr of this.instrucciones){
            if (!(instr instanceof Declaracion || instr instanceof Asignacion || instr instanceof Main || instr instanceof Funcion || instr instanceof Struct || instr instanceof DeclaracionArr || instr instanceof ModificacionArr))
            {
                let error = new Errores("Semantico", "Sentencia Fuera de main", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
        }
        // this.instrucciones.forEach(instr => {
        //     instr.translate3d(this.TSglobal, tree)
        // });
        let txtC3d = this.generadorC3d.getCode();
        // console.log(txtC3d)
        this.printInHtmlC3d(txtC3d);
        // this.generadorC3d.clearCode();
        return txtC3d;
    }

    public printInHtmlC3d(cadena)
    {
        let textarea = <HTMLInputElement>document.querySelector('#textAreaC3d');
        let value = "";
        value += cadena;
        textarea.value = value;
    }

    public getInstrucciones(){
        return this.instrucciones;
    }

    public setInstrucciones(instrucciones){
        this.instrucciones = instrucciones;
    }

    public getErrores(){
        return this.Errores;
    }

    public setErrores(excepciones){
        this.Errores = excepciones;
    }

    public addError(error){
        this.Errores.concat(error);
        // this.updateConsola(error.toString());
    }

    public getConsola(){
        return this.consola;
    }

    public setConsola(consola){
        this.consola = consola;
    }

    public updateConsolaPrintln(cadena: string){
        // console.log("cad println: " + cadena);
        
        this.consola += cadena + '\n';
        this.printInHtml(cadena + '\n');
        
    }

    public updateConsolaPrint(cadena: string){
        // console.log("cad print: " + cadena);
        // document.getElementById("textAreaConsola")
        this.consola += cadena;
        this.printInHtml(cadena);
    }

    public printInHtml(cadena)
    {
        let textarea = <HTMLInputElement>document.querySelector('#textAreaConsola');
        let value = textarea.value;
        value += cadena;
        textarea.value = value;
    }

    public getTSGlobal(){
        return this.TSglobal;
    }

    public setTSGlobal(TSglobal){
        this.TSglobal = TSglobal;
    }

    public getFunction(name){
        let tree =this;
        // console.log(name);
        // console.log(this.funciones);
        // this.funciones.forEach(function (func) {
        for(let func of tree.funciones){
            // console.log(func);
            if (func.id == name){
                return func;
            }
        }
        return null;
    }

    public addFunction(funcion){
        // console.log(funcion.id);
        this.funciones.push(funcion);
        // console.log(this.funciones)
        // console.log("entre funciont add");
    }

    public getStruct(name){
        let tree =this;
        // this.structs.forEach(struct => {
        for(let struct of tree.structs){
            if (struct.id == name){
                return struct;
            }
        }
        return null;
    }

    public addStruct(struct){
        this.structs.push(struct);
    }

    graphAst():string {

        /**
         * ----AGREGANDO---- 
         * INSTRUCCIONES
         * START
         */
        let raiz = new Nodo("START","");
        let instrucciones = new Nodo("INSTRUCCIONES","");

        for(let inst of this.instrucciones){
            instrucciones.addChildNode(inst.recorrer(this.TSglobal,this));
        }
        raiz.addChildNode(instrucciones);

        /**
         * -----RECORRIENDO---- 
         * >>> GRAFICANDO
         */
        this.dot = ""
        this.dot += "digraph {\n"
        this.dot += `\nbgcolor="mistyrose";`
        this.dot += `\ngraph[color = "lightcyan:mistyrose", fontcolor = "darkslateblue", fontname = serif, style = filled, label = "AST"];`
        this.dot += `\nnode[shape = egg, style = filled, color = "gray9", fillcolor = navyblue, fontcolor = white];`
        this.dot += `\nedge[color = "deeppink"];`
        this.dot += "\n"
        this.dot += "\n"
        this.dot += "n0[label=\"" +raiz.getToken().replace("\"","")  + "\"];\n";
        this.contador = 1;
        console.log(raiz);
        this.recorrer("n0", raiz);
        this.dot += "}"

        let textarea = <HTMLInputElement>document.querySelector('#textAreaConsola');
        let value = "";
        value += this.dot;
        textarea.value = value;

        return this.dot;    
    }

    public recorrer(idPadre, nodoPadre)
    {
        for(let nodo of nodoPadre.getChilds())
        {
            // console.log(nodo);
            if(nodo instanceof Nodo &&  nodo.getToken() != null){
                let nameHijo = "n" + this.contador.toString();
                let token = nodo.getToken().toString().replace("\"","")
                // console.log(token)
                this.dot += nameHijo + "[label=\"" + token + "\"];\n";
                this.dot += idPadre + "->" + nameHijo + ";\n"
                this.contador++;
                this.recorrer(nameHijo, nodo)
            }
        }
    }

        

}