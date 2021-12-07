var TipoError;
(function (TipoError) {
    TipoError[TipoError["ERROR_LEXICO"] = 0] = "ERROR_LEXICO";
    TipoError[TipoError["ERROR_SINTACTICO"] = 1] = "ERROR_SINTACTICO";
    TipoError[TipoError["ERROR_SEMANTICO"] = 2] = "ERROR_SEMANTICO";
})(TipoError || (TipoError = {}));
class Nodo_Error {
    constructor(typeError, mensaje, fila, columna) {
        this.typeError = typeError;
        this.mensaje = mensaje;
        this.fila = fila;
        this.columna = columna;
    }
    isErrorLexico() {
        return this.typeError == TipoError.ERROR_LEXICO;
    }
    isErrorSintactico() {
        return this.typeError == TipoError.ERROR_SINTACTICO;
    }
    isErrorSemantico() {
        return this.typeError == TipoError.ERROR_SEMANTICO;
    }
    getTypeError() {
        return this.typeError;
    }
    setTypeError(typeError) {
        this.typeError = typeError;
    }
    getMensaje() {
        return this.mensaje;
    }
    setMensaje(mensaje) {
        this.mensaje = mensaje;
    }
    getFila() {
        return this.fila;
    }
    setFila(fila) {
        this.fila = fila;
    }
    getColumna() {
        return this.columna;
    }
    setColumna(columna) {
        this.columna = columna;
    }
}
