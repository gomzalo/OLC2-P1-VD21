# **MANUAL TÉCNICO**

Quetzal-OLC2 es una herramienta muy util para el usuario que desea ejecutar, o interpretar, código quetzal. O bien traducir codigo a tres direcciones, para luego ser ejecutado en C.

A continuación se muestra de una forma bastante general, la forma en que este interprete y traductor se programo, para futuras referencias.

## **Tabla de contenido**

- [**Lenguaje**](#lenguaje)
  - [**Tipos**](#tipos)
  - [**Expresiones**](#expr)
  - [**Instruciones**](#instr)
- [**Interfaces**](#interfaces)
   - [Intrucciones](#intrucciones)
 - [**Tabla de simbolos**](#tsimbolos)
   - [Simbolo](#simbolo)
 - [**AST**](#ast)
 - [**Herramientas**](#herramientas)
   - [**Levantar localmente**](#run)

## Lenguaje <a name="lenguaje"></a>
El lenguaje Quetzal-OLC2, acepta distintos tipos de datos, tanto primitivos, como también compuestos.
- ### **Tipos** <a name="tipos"></a>
  - **Primitivos**
    - null
    - int
    - double
    - boolean
    - char
    - String
  - **Compuestos**
    - Arreglos
    - Structs
- ### **Expresiones** <a name="expr"></a>

    El lenguaje acepta los siguientes tipos de expresiones:

    1. Aritméticas
    2. Relacionales
    3. Lógicas
- ### **Instrucciones** <a name="instr"></a>

    Entre las distintas instrucciones que acepta el lenguaje, se pueden mencionar las siguientes:

  1. Impresión
  2. Declaración y Asignación
  3. Llamada a Funciones
  4. Distintas Funciones Nativas
  5. Funciones
  6. Condicionales
      1. If con llaves
      2. If sin llaves
      3. Switch
  7. Loops
       1. While
       2. Do While
       3. For
## Interfaces <a name="interfaces"></a>

Una parte muy importante del programa, pues será implementada en cada una de las clases de este.

- ### Instrucción <a name="intrucciones"></a>
    La interfaz instrucción es la mas importante y la mas utilizada en todo el flujo del programa, pues representa una de las tantas instrucciones y expresiones que acepta el lenguaje Quetzal-OLC2.

    La interfaz *instrucción* tiene los siguientes métodos y atributos:
    ```typescript

        fila: number; // Atributo que guarda la posición de la fila o línea actual.
        columna: number; // Atributo que guarda la posición de la columna actual.
        arreglo: boolean; // Atributo utilizado para verificar si un símbolo es un arreglo o no.

        /**
        * @function ejecutar Ejecuta las intrucciones.
        * @param table Maneja el entorno.
        * @param tree AST del programa.
        */

        ejecutar(table : TablaSimbolos, tree : Ast): any;
        /**
        * @function translate3d Traduce las instrucciones a código de tres direcciones.
        * @param table Maneja el entorno.
        * @param tree AST del programa.
        */

        translate3d(table : TablaSimbolos, tree : Ast): any;
        /**
        * @function recorrer Recorrer nodos para graficar AST.
        * @param table Maneja el entorno.
        * @param tree AST del programa.
        */
        recorrer(table : TablaSimbolos, tree : Ast): any;

    ```

- ### Tabla de símbolos <a name="tsimbolos"></a>
    Esta clase representa el entorno actual de un instrucción.
    Se comporta como una lista enlazada, con nodos de tipo símbolo.
    Cuenta con los siguientes atributos y métodos.

    ```typescript

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
            // code...
        }

        /**
         * @function existeEnActual Verifica si el simbolo ya existe en el entorno actual.
         * @param id ID del simbolo a buscar dentro del entorno actual.
         * @returns 
         */
        public existeEnActual(id: string): boolean{
            // code...
        }

        /**
         * @function getSymbolTabla Obtiene un simbolo, si existe, dentro del entorno actual.
         * @param id ID del simbolo a buscar dentro del entorno actual.
         * @returns simbolo || null
         */
        public getSymbolTabla(id: string):Simbolo
        {
            // code...
        }

    ```

- ### Símbolo <a name="simbolo"></a>
    Esta clase es utilizada por la tabla de simbolos, un símbolo almacena los atributos mas importantes de las variables, funciones, arreglos y structs.

    Al representar un nodo, solamente se tienen los gets y sets de los siguientes atributos.

    ```typescript

        /**
         * 
         * @param id Identificador del simbolos
         * @param tipo Tipo del simbolo
         * @param arreglo Booleano para verificar si es arreglo
         * @param fila Numero de fila
         * @param columna Numero de columna
         * @param valor Valor del simbolo | if(tipo==TIPO.STRUCT)= tablaSimbolos
         * @param structEnv 
         */
        constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false){
            // code
        }

    ```

- ### AST <a name="ast"></a>

    Representa el árbol de análisis sintáctico, generado a partir del uso de la herramienta Jison.

    ```typescript

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
            // code
        }

        /**
         * @function traducir traduce las instrucciones, realiza las pasadas para verificar que no vengan instrucciones donde no son permitidas.
         * @returns 
         */
        public traducir(){
            // code
        }

    ```

- ### Herramientas <a name="herramientas"></a>

    Entre las distintas herramientas utilizadas se encuentran:

  - **TypeScript:** Para aprovechar el manejo que tiene de sus clases e interfaces se programa en este lenguaje, luego se transpila a JavaScript.
    - *Instalación*:
    ```typescript

    npm install -g tsc

    ```
  - **NodeJS:** Utilizado para realizar el empaquetado de las clases generadas luego de la transpilación.
    - *Instalación*: Varia segun el sistema que se este utilizando.
  - **Jison:** Es la herramienta que realiza el analisis lexico y sintactico, a partir del resultado de este se procede a interpretar (análisis semántico) y traducir el código.
    - *Instalación*:
    ```typescript
    npm install -g jison
    ```
  - **Browserify:** Realiza el empaquetado de las clases generadas luego de la transpilación, esta genera una sola clase llamada ***bundle***, que será la única a importarse como script desde nuestro index.html.
    - *Instalación*:
    ```typescript
    npm install -g browserify
    ```
  - **Viz:** Se encarga de generar el reporte de grafos a partir de un código ***.dot***, utilizada para el reporte del AST.
  *Instalación*: Varia segun el sistema que se este utilizando.

- ### Correr de forma local <a name="run"></a>
  
    Para levantar el proyecto se debe de asegurar de tener instaladas las herramientas descritas anterirormete. Luego se siguen los siguientes pasos.
    
    **Por defecto se tienen los archivos compilados, transpilados y generados de la última modificacicón, a menos que se haya editado el código fuente llevar a cabo los siguientes pasos:**
  
  1. Navegar a la carpeta /Analizadores y correr el siguiente comando:

        ```typescript
        jison gramatica.jison
        ```
        Esto generará un archivo con el mismo nombre con extensión ***.js***.
  
  2. Luego, se procederá a transpilar las clases de TypeScript (.tsc) a JavaScript (.js), con el siguiente comando:
        ```typescript
        tsc
        ```
        Este último comando generará las clases transpiladas en .js en la carpeta /*Dist*.
  3. Por ultimo se empaquetan las clases generadas, con Browserify. En el archivo **packaje.json**, se encuentra un script que realiza esto. Por lo tanto solamente es necesario correr el siguiente comando:
        ```typescript
        npm run build
        ```
        Este generará un archivo ***bundle.js***, que contiene todo el código empaquetado.
  4. Luego de realizar los pasos anteriores, se procede a levantar la página ***index.html***, en nuestro caso se utiliza la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) de Visual Code que realiza esto por nosotros. Esta extensión por defecto levanta el servidor local en el puerto 5500. Por lo que solamente nos queda acceder a la dirección [localhost:5500](http://127.0.0.1:5500/index.html).