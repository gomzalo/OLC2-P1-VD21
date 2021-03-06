"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorC3D = void 0;
const Nativas_1 = require("./Nativas");
class GeneradorC3D {
    /**
     * SINGLETON
     */
    constructor() {
        this.isFunc = '';
        this.temporal = this.label = 0;
        this.code = [];
        this.codeFuncion = [];
        this.tempStorage = new Set();
    }
    agregarFuncion(funcion) {
        funcion.forEach((fun) => {
            this.codeFuncion.push(fun);
        });
    }
    /**
     * @method static gET INSTANCIA
     * @returns Retorna esta misma intanca (SINGLETON)
     */
    static getInstancia() {
        return this.generador || (this.generador = new this());
    }
    /**
     *
     * @returns Retorna Temp Storage, temporales usados
     */
    getTempStorage() {
        return this.tempStorage;
    }
    /**
     * limpia todos los temporales
     * @method clearTempStorage
     */
    clearTempStorage() {
        this.tempStorage.clear();
    }
    /**
     * Asinacion del set al set local de temporales
     * @param tempStorage lista :Set<string>   se asigna al set local
     */
    setTempStorage(tempStorage) {
        this.tempStorage = tempStorage;
    }
    /**
     * @method clearCode
     * Borra todo el C3D
     * Se borra temporalses, code, code de FUnciones, y el TempSotarage
     */
    clearCode() {
        this.temporal = this.label = 0;
        this.code = [];
        this.codeFuncion = [];
        this.tempStorage = new Set();
    }
    /**
     * @method clearSoloCode
     * Borra todo el codigo guardado en this.code
     */
    clearSoloCode() {
        this.code = [];
    }
    /**
     * @method GenerarCode genCode
     * Ingresa en el C3D el valor que se asigna como parametro
     * @param code se inserta en el array code[]
     */
    gen_Code(code) {
        this.code.push(this.isFunc + code);
    }
    /**
     * Retorna el C3D que se haya generado en la clase singleton
     */
    /**
     * @method ObtenerCode
     * @returns Devuelve un String con  todo el c3d
     */
    getCode() {
        let nativas = new Nativas_1.Nativas();
        let encabezado = '#include <stdio.h>\n#include <math.h>\ndouble Stack[60000]; double Heap[60000];\nint p; int h;\n';
        let main = `\nint main() {\n${this.code.join('\n')}\n\nreturn 0;\n}\n`;
        const funciones = this.codeFuncion.join('\n');
        this.code = [];
        let strNativas = nativas.generarNativas();
        //strNativas = ''; // comentar despues de terminar
        let c3d = `${encabezado}${this.getTemps()};\n${strNativas}\n${funciones}\n${main}`;
        return c3d;
    }
    /**
     * @method getOnlyCode
     * @returns  obtiene solo el code
     */
    getOnlyCode() {
        return this.code;
    }
    /**
     * @method setOnlyCode
     * @param codeA obtieen string[]
     */
    setOnlyCode(codeA) {
        this.code = codeA;
    }
    /**
     * @method getCodeNativas getNativas
     * @returns  el codigo como string,. concatenado
     */
    getCodeNativas() {
        return this.code.join('\n');
    }
    /**
     * @method getTemps getTemporales
     * @returns todas las temporales concatenadas String
     */
    getTemps() {
        let lista = 'double ';
        for (let i = 0; i < this.temporal; i++) {
            lista += 'T' + i;
            lista += i < this.temporal - 1 ? ',' : '';
        }
        return lista;
    }
    /**
     * @method newTemp newTemporal
     * @returns Crea un nuevo temporal : String
     */
    newTemp() {
        const temp = 'T' + this.temporal++;
        this.tempStorage.add(temp);
        return temp;
    }
    /**
     * @method newLabel
     * @returns Nuevo label : string
     */
    newLabel() {
        return 'L' + this.label++;
    }
    /**
     * @method gen_Label genLabel
     * agrega una nueva etiqueta el C3D
     * @param label : string > se agrega etiqueta al c3d
     */
    gen_Label(label) {
        // si es funcion lo agrega con el label
        this.code.push(`${this.isFunc}${label}:`);
    }
    /**
     * @method gen_Exp genExpresion
     * Genera una nueva expresion y la agrega al C3D
     * @param tem Temporal al que se le asignara la expresion
     * @param izq Expresion izquierda que se asignara al temporal
     * @param der Expresion derecha que se asignara al temporal
     * @param operator Operador de la expresion
     */
    gen_Exp(tem, iqz, der = '', operator = '') {
        this.code.push(`${this.isFunc}${tem} = ${iqz} ${operator} ${der};`);
    }
    /**
     * @method genAsignaTemp genAsignacion
     * Asigna un valor a un temporal
     * @param tem variable que recibira el parametro valor
     * @param val valor a asignar
     */
    genAsignaTemp(tem, val) {
        this.code.push(`${this.isFunc}${tem} = ${val};`);
    }
    /**
     * @method gen_Goto genGoto
     * genera un goto con el valor de label
     * Agrega al c3d
     * @param label etiqueta a donde redirigira el goto
     */
    gen_Goto(label) {
        this.code.push(`${this.isFunc}goto ${label};`);
    }
    /**
     * @method gen_If genIf
     * Genera  if -> lo agrega al C3D
     * @param izq EXPR izq de la condicion if
     * @param der EXPR der de la condicion if
     * @param op Operador boleano -> condicion
     * @param label Etiqueta de salto si la condicion es TRUE
     */
    gen_If(izq, der, op, label) {
        this.code.push(`${this.isFunc}if (${izq} ${op} ${der}) goto ${label};`);
    }
    /**
     * @method nextHeap avanzarHeap
     * Avanza el puntero heap a la posicion sigujiente
     */
    nextHeap() {
        this.code.push(this.isFunc + 'h = h + 1;');
    }
    /**
     * @method gen_GetHeap genGetHeap
     * genera /> acceso al heap en la posicion index
     * asigna al tem
     * @param temp temporal que recibira el valor del heap
     * @param index posicion del heap al cual se accedera
     */
    gen_GetHeap(temp, index) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}${temp} = Heap[${index}];`);
    }
    /**
     * @method gen_SetHeap genSetHeap
     * genera una asignacion de valor al heap en la posicion index
     * @param index posicion del heap al cual se desea acceder
     * @param valor valor que se asignara a la posicion del heap
     */
    gen_SetHeap(index, valor) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}Heap[${index}] = ${valor};`);
    }
    /**
     * @method gen_GetStack genGetStack
     * genera una asignacion a tem del valor del stack en la posicion index
     * @param temp temporal al cual se asignara el valor del stack
     * @param index posicion del stack al cual se desea acceder
     */
    gen_GetStack(temp, index) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}${temp} = Stack[${index}];`);
    }
    /**
     * @method gen_SetStack genSetStack
     * genera una asignacion al stack en la posicion index
     * @param index posicion del stack al cual se desea acceder
     * @param value valor que sera asignado al stack
     */
    gen_SetStack(index, value) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}Stack[${index}] = ${value};`);
    }
    /**
     * @method gen_NextEnv genNextEnv
     * genera un desplazamiento del stack para generar un nuevo ambito
     * @param size posiciones que se desplazara el stack
     */
    gen_NextEnv(size) {
        this.code.push(`${this.isFunc}p = p + ${size};`);
    }
    /**
     * @method gen_AntEnv genAntEnv
     * genera un desplazamiento del stack para volver a un ambito anterios
     * @param size posiciones que se desplazara el stack
     */
    gen_AntEnv(size) {
        this.code.push(`${this.isFunc}p = p - ${size};`);
    }
    /**
     * @method gen_call genCall
     * genera una llamada a una funcion
     * @param id nombre de la funcion
     */
    gen_call(id) {
        this.code.push(`${this.isFunc}${id}();`);
    }
    /**
     * @method gen_Funcion genFuncion
     * Genera el encabezado de una funcion
     * @param id nombre de la funcion
     */
    gen_Funcion(id) {
        this.code.push(`\nvoid ${id}() {`);
    }
    /**
     * @method gen_EndFunction  genEndFuncion
     * Genera el cierre de la definicion de una funcion
     */
    gen_EndFunction() {
        this.code.push('}');
    }
    /**
     * @method gen_Print genPrint
     * genera un printf con el tipo de dato y el valor
     * @param formato tipo de dato que se va a imprimir
     * @param valor valor que se va a imprimir
     */
    gen_Print(formato, valor) {
        valor = valor[0] === 'T' && formato !== 'f' ? '(int)' + valor : valor;
        this.code.push(`${this.isFunc}printf("%${formato}",${valor});`);
    }
    /**
     * @method gen_PrintTrue genPrintTrue
     * genera un print del valor true
     */
    gen_PrintTrue() {
        this.gen_Print('c', 't'.charCodeAt(0));
        this.gen_Print('c', 'r'.charCodeAt(0));
        this.gen_Print('c', 'u'.charCodeAt(0));
        this.gen_Print('c', 'e'.charCodeAt(0));
    }
    /**
     * @method gen_PrintFalse gen_PrintFalse
     * genera un print del valor false
     */
    gen_PrintFalse() {
        this.gen_Print('c', 'f'.charCodeAt(0));
        this.gen_Print('c', 'a'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
        this.gen_Print('c', 's'.charCodeAt(0));
        this.gen_Print('c', 'e'.charCodeAt(0));
    }
    /**
     * @method gen_PrintNull gen_PrintNull
     * genera un print del valor null
     */
    gen_PrintNull() {
        this.gen_Print('c', 'n'.charCodeAt(0));
        this.gen_Print('c', 'u'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
    }
    /**
     * @method gen_Comment genComentario
     *
     * @param comment  comentario
     */
    gen_Comment(comment) {
        this.code.push(`${this.isFunc}// ----- ${comment} -----`);
    }
    /**
     * @method freeTemp freeTemp
     * libera temp del storage
     * @param temp temporal a liberar
     */
    freeTemp(temp) {
        if (this.tempStorage.has(temp)) {
            this.tempStorage.delete(temp);
        }
    }
    /**
     * @method gen_Temp genTemp
     * agrega un temporal al storage
     * @param temp temporal que se agregara al storage
     */
    gen_Temp(temp) {
        if (!this.tempStorage.has(temp))
            this.tempStorage.add(temp);
    }
}
exports.GeneradorC3D = GeneradorC3D;
