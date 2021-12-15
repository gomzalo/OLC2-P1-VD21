// const { TablaSimbolos } = require("./Clases/TablaSimbolos/TablaSimbolos");

// import Nodo from "../../Ast/Nodo";

var myTab = document.getElementById('myTab');
var itemAbrir = document.getElementById('itemAbrir');
let result;
let astTraduccion;
let entornoAnalizar;
// let listaErrores = Lista_Error.getInstancia();
const { Ast } = require("./dist/Ast/Ast");
const gramatica = require("./Analizadores/gramatica");
const { Primitivo } = require("./dist/Expresiones/Primitivo");
const { TablaSimbolos } = require("./dist/TablaSimbolos/TablaSimbolos");
const { Instruccion } = require("./dist/Interfaces/Instruccion");
const { Declaracion } = require("./dist/Instrucciones/Declaracion");
const { Funcion } = require("./dist/Instrucciones/Metodos/Funcion");
const { Main } = require("./dist/Instrucciones/Metodos/Main");
const { Asignacion } = require("./dist/Instrucciones/Asignacion");
const { DeclaracionArr } = require("./dist/Instrucciones/Arreglos/DeclaracionArr");
const { Struct } = require("./dist/Instrucciones/Struct/Struct");
// const Lista_Imprimir = require("./dist/Lista_imprimir");

const compilar = document.getElementById('compilarProyecto');

var text = CodeMirror.fromTextArea(document.getElementById("textAreaEntrada"),{
    mode: "javascript",
    theme:"ttcn",
    lineNumbers:true,
    autoCloseBrackets: true
});
text.setSize(null,520);

var cantTabs = 1;
var editor = new Editor(text);
var editores = [];
editores.push(editor);

function Editor(codeEditor){    
    this.codeEditor = codeEditor;
}


itemAbrir.addEventListener('click', async () => {

    const { value: file } = await Swal.fire({
        title: 'Abrir Archivo',
        input: 'file',
        inputAttributes: {
            'accept': '*',
            'aria-label': 'Selected File'
        }
    })

    if (file) {
        var reader = new FileReader()
        reader.onload = (e) => {

            var myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

            var currentTab = undefined;
            var indexTab = 1;
            var auxiliar = 1;

            myTabs.forEach(element => {

                var itemA = element.querySelector("a");

                var bandera = itemA.getAttribute('aria-selected')

                if (bandera == 'true') {
                    currentTab = itemA.id;
                    indexTab = auxiliar;
                }

                auxiliar = auxiliar + 1;
            });

            var contents = e.target.result;
            editores[indexTab-1].codeEditor.setValue(contents);
            
        }
        reader.readAsText(file);
    }
    else{
        alert('Error al cargar Archivo.');
    }

});

function agregarNuevoTab() {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementById('#myTab');
    tablinks = document.getElementById('#myTabContent');
    cantTabs = cantTabs + 1;

    $('#myTab').append('<li class = "nav-item"> <a class="nav-link" id = "tab' + cantTabs + '" data-toggle="tab" href="#panel' + cantTabs + '" role="tab" aria-controls="panel' + cantTabs + '" aria-selected="false" >Tab ' + cantTabs + '</a>   </li>');
    $('#myTabContent').append('<div class="tab-pane fade" id="panel' + cantTabs + '" role="tabpanel" aria-labelledby="tab"' + cantTabs + '>  <div> <textarea class="form-control" rows="21" id="text' + cantTabs + '" > </textarea>  </div> </div>');

    var editorActual = CodeMirror.fromTextArea(document.getElementById('text' + cantTabs), {
        mode: "javascript",
        theme: "ttcn",
        lineNumbers: true
    });
    editorActual.setSize(null, 520);
    var nuevoEditor = new Editor(editorActual);
    editores.push(nuevoEditor);
    
}

function eliminarTab() {


    if( cantTabs == 1 ){
        alert('No se puede eliminar todas las pestañas de trabajo.')
        return;
    }

    var myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    var currentTab = undefined;
    var indexTab = 0;
    var auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });

    var tabSeleccionado = document.getElementById(currentTab);
    var idPanelTab = tabSeleccionado.getAttribute('aria-controls');
    var panelTab = document.getElementById(idPanelTab);
    
    var padre = tabSeleccionado.parentElement;
    padre.remove()

    var panelTabSeleccionado = document.getElementById(panelTab.id);
    var padre = panelTabSeleccionado.parentElement
    padre.removeChild(panelTabSeleccionado);

    editores.splice(indexTab,1);
    cantTabs = cantTabs - 1;

}

function limpiarTab(){

    var myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    var indexTab = 0;
    var auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });

    editores[indexTab].codeEditor.setValue('');
    
}

compilar.addEventListener('click', () => {

    // let listaImprimir = Lista_Imprimir.getInstance();
    // alert("dsfasdfa");
    let myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    let indexTab = 0;
    let auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });
    
    //parse(editores[indexTab].codeEditor.getValue());
    
    var txtConsola = document.getElementById("textAreaConsola");
    $("#textAreaConsola").val("");

    try{
        result = gramatica.parse(editores[indexTab].codeEditor.getValue()); // return ast
        // result.Errores = gramatica.errores.slice()
        console.log(result);
        result.ejecutar();
        entornoAnalizar = result.TSglobal;
        let texto = "::::::::::::::::::::::::::::::::::::::::::::::::    SALIDA CONSOLA  ::::::::::::::::::::::::::::::::::::::::::::::::\n";
        
        texto += result.getConsola();
        // $("#textAreaConsola").val(texto);
        // txtConsola.append(texto);
        // Swal.fire(
        //     '¡Gramatica correcta!'
        // );
    }catch(e){
        Swal.fire(
            'Gramatica incorrecta\n:' + e
        );
        // alert(e);
    }


});

reporteAST.addEventListener('click', () => {  

    let arbol = new Arbol();
    
    //parse(editores[indexTab].codeEditor.getValue());
    let result = arbol.generarDot(result);
    //console.log(result);

    var clickedTab = document.getElementById("clickedTab");
    clickedTab.innerHTML = "";
    clickedTab.innerHTML = "<h3>Reporte AST</h3>"
    var viz = new Viz();
    viz.renderSVGElement(result).then(function (element) {
        clickedTab.appendChild(element);
    })
    .catch((error) => {
        console.error(error);
    });
});

function traducirProyecto(){

    let myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    let indexTab = 0;
    let auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });

    try{
        //listaImprimir.length = 0;
        listaErrores.length = 0;
        astTraduccion = traduccion.parse(editores[indexTab].codeEditor.getValue());
        let entorno = new Entorno(null);
        entorno.setGlobal(entorno);
        entorno.setPadre(null);
        //astTraduccion.entornoGlobal.setGlobal(result.entornoGlobal);
        //astTraduccion.entornoGlobal.setPadre(null);
        let textoTraduccion = astTraduccion.traducir(entorno);
    
        agregarNuevoTab();
        let tam =  editores.length;
        editores[tam-1].codeEditor.setValue(textoTraduccion);
        //txtConsola.append(texto);
        //listaImprimir = [];
        

        

        alert('Gramatica Correcta');
    }catch(e){
        alert('Grmatica Incorrecta');
        alert(e);
    }

}

reporteErrores.addEventListener('click', () => {
    
    CuerpoTablaErrores.innerHTML = '';
    numero = 1     
    
    let aux = 1;
    //alert("Tam: "+listaErrores.length);
    result.Errores.forEach(
        element =>{
            let textoAuxilarTipo = "";
            if( element.tipo == "Lexico" ){
                textoAuxilarTipo = "Lexico";
                //texto += "\n--Error Lexico "+"Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }else if(element.tipo == "Sintactico"){
                textoAuxilarTipo = "Sintactico";
                //texto += "\n--Error Sintactico "+"Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }
            else{
                textoAuxilarTipo = "Semantico";
                //texto += "\n--Error Semántico "+" Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }

            CuerpoTablaErrores.innerHTML += `
            <tr>
            <th scope="row">${aux}</th>
            <td>${textoAuxilarTipo}</td>
            <td>${element.descripcion}</td>
            <td>${element.fila}</td>
            <td>${element.columna}</td>
            </tr>
            `
            aux++;
            
        }
    );

});

reporteTablaSimbolos.addEventListener('click', () => {
    CuerpoTablaSimbolos.innerHTML = '';
    let content = "";
    let contador = 1;
    result.instrucciones.forEach(instruccion => {
        // :::::::::::::::::::  FUNCIONES    :::::::::::::::::::
        if(instruccion instanceof Funcion){
            content += `
            <tr>
            <th scope="row">${contador}</th>
            <td>Función</td>
            <td>Global</td>
            <td>${instruccion.id}</td>
            <td>${instruccion.fila}</td>
            <td>${instruccion.columna}</td>
            </tr>
            `
            contador++;
            // ________     Parametros main  ________
            if(instruccion.parameters != null){
                instruccion.parameters.forEach(parametros_funcion => {
                    // .........    Arreglo de parametros     .........
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Parametro</td>
                        <td>Funcion ${instruccion.id}</td>
                        <td>${parametros_funcion.id}</td>
                        <td>${instruccion.fila}</td>
                        <td>${instruccion.columna}</td>
                        </tr>
                        `
                        contador++;
                });
            }
            // ________     Instrucciones funciones  ________
            if(instruccion.instructions != null){
                instruccion.instructions.forEach(instrucciones_funcion => {
                    // .........    Declaracion     .........
                    if(instrucciones_funcion instanceof Declaracion){
                        instrucciones_funcion.simbolos.forEach(simbolo_decl =>{
                            content += `
                            <tr>
                            <th scope="row">${contador}</th>
                            <td>Declaracion</td>
                            <td>Funcion ${instruccion.id}</td>
                            <td>${simbolo_decl.id}</td>
                            <td>${simbolo_decl.fila}</td>
                            <td>${simbolo_decl.columna}</td>
                            </tr>
                            `
                            contador++;
                        });
                    } // .........    Asignacion     .........
                    else if(instrucciones_funcion instanceof Asignacion){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Asignacion</td>
                        <td>Funcion ${instruccion.id}</td>
                        <td>${instrucciones_funcion.id}</td>
                        <td>${instrucciones_funcion.fila}</td>
                        <td>${instrucciones_funcion.columna}</td>
                        </tr>
                        `
                        contador++;
                    } // .........    Declaracion arreglo     .........
                    else if(instrucciones_funcion instanceof DeclaracionArr){
                            content += `
                            <tr>
                            <th scope="row">${contador}</th>
                            <td>Arreglo</td>
                            <td>Funcion ${instruccion.id}</td>
                            <td>${instrucciones_funcion.id}</td>
                            <td>${instrucciones_funcion.fila}</td>
                            <td>${instrucciones_funcion.columna}</td>
                            </tr>
                            `
                            contador++;
                    }
                });
            }
        }
        // :::::::::::::::::::      STRUCTS    :::::::::::::::::::
        else if(instruccion instanceof Struct){
            content += `
            <tr>
            <th scope="row">${contador}</th>
            <td>Struct</td>
            <td>${instruccion.id}</td>
            <td>${instruccion.fila}</td>
            <td>${instruccion.columna}</td>
            </tr>
            `
            contador++; 
            // ________     Instrucciones structs  ________
            if(instruccion.instructions != null){
                instruccion.instructions.forEach(instrucciones_struct => {
                    // .........    Declaracion     .........
                    if(instrucciones_struct instanceof Declaracion){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Declaracion</td>
                        <td>Struct ${instruccion.id}</td>
                        <td>${instrucciones_struct.simbolos[0].id}</td>
                        <td>${instrucciones_struct.fila}</td>
                        <td>${instrucciones_struct.columna}</td>
                        </tr>
                        `
                        contador++;
                    } // .........    Declaracion arreglo     .........
                    else if(instrucciones_struct instanceof DeclaracionArr){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Arreglo</td>
                        <td>Struct ${instruccion.id}</td>
                        <td>${instrucciones_struct.id}</td>
                        <td>${instrucciones_struct.fila}</td>
                        <td>${instrucciones_struct.columna}</td>
                        </tr>
                        `
                        contador++;
                }
                });
            }
        }
        // :::::::::::::::::::      MAIN    :::::::::::::::::::
        else if(instruccion instanceof  Main){
            // ________     Instrucciones main  ________
            instruccion.instructions.forEach(instruccion_main => {
                // .........    Declaracion     .........
                if(instruccion_main instanceof Declaracion){
                    instruccion_main.simbolos.forEach(simbolo_decl =>{
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Declaracion</td>
                        <td>Main</td>
                        <td>${simbolo_decl.id}</td>
                        <td>${simbolo_decl.fila}</td>
                        <td>${simbolo_decl.columna}</td>
                        </tr>
                        `
                        contador++;
                    });
                } // .........    Asignacion     .........
                else if(instruccion_main instanceof Asignacion){
                    content += `
                    <tr>
                    <th scope="row">${contador}</th>
                    <td>Asignacion</td>
                    <td>Main</td>
                    <td>${instruccion_main.id}</td>
                    <td>${instruccion_main.fila}</td>
                    <td>${instruccion_main.columna}</td>
                    </tr>
                    `
                    contador++;
                } // .........    Declaracion arreglo     .........
                else if(instruccion_main instanceof DeclaracionArr){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Arreglo</td>
                        <td>Main</td>
                        <td>${instruccion_main.id}</td>
                        <td>${instruccion_main.fila}</td>
                        <td>${instruccion_main.columna}</td>
                        </tr>
                        `
                        contador++;
                }
            });
        }
    });
    content += entornoAnalizar.imprimirTabla();

    // let texto = entornoAnalizar.imprimirEntorno();
    CuerpoTablaSimbolos.innerHTML += content;
});

function reporteAST_Traduccion(){
    let arbol = new Arbol();
    
    //parse(editores[indexTab].codeEditor.getValue());
    let result = arbol.generarDot(astTraduccion);
    //console.log(result);

    var clickedTab = document.getElementById("clickedTab");
    clickedTab.innerHTML = "";
    clickedTab.innerHTML = "<h3>Reporte AST Traduccion</h3>"
    var viz = new Viz();
    viz.renderSVGElement(result).then(function (element) {
        clickedTab.appendChild(element);
    })
    .catch((error) => {
        console.error(error);
    });
}
/*var viz = new Viz();
viz.renderSVGElement(text).then(function (element) {
        div.appendChild(element);
    })
    .catch((error) => {
        viz = new Viz();
        console.error(error);
    });*/
//