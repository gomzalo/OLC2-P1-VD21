var TipoError;
(function (TipoError) {
    TipoError[TipoError["ERROR_LEXICO"] = 0] = "ERROR_LEXICO";
    TipoError[TipoError["ERROR_SINTACTICO"] = 1] = "ERROR_SINTACTICO";
    TipoError[TipoError["ERROR_SEMANTICO"] = 2] = "ERROR_SEMANTICO";
})(TipoError || (TipoError = {}));
var Nodo_Error = /** @class */ (function () {
    function Nodo_Error(typeError, mensaje, fila, columna) {
        this.typeError = typeError;
        this.mensaje = mensaje;
        this.fila = fila;
        this.columna = columna;
    }
    Nodo_Error.prototype.isErrorLexico = function () {
        return this.typeError == TipoError.ERROR_LEXICO;
    };
    Nodo_Error.prototype.isErrorSintactico = function () {
        return this.typeError == TipoError.ERROR_SINTACTICO;
    };
    Nodo_Error.prototype.isErrorSemantico = function () {
        return this.typeError == TipoError.ERROR_SEMANTICO;
    };
    Nodo_Error.prototype.getTypeError = function () {
        return this.typeError;
    };
    Nodo_Error.prototype.setTypeError = function (typeError) {
        this.typeError = typeError;
    };
    Nodo_Error.prototype.getMensaje = function () {
        return this.mensaje;
    };
    Nodo_Error.prototype.setMensaje = function (mensaje) {
        this.mensaje = mensaje;
    };
    Nodo_Error.prototype.getFila = function () {
        return this.fila;
    };
    Nodo_Error.prototype.setFila = function (fila) {
        this.fila = fila;
    };
    Nodo_Error.prototype.getColumna = function () {
        return this.columna;
    };
    Nodo_Error.prototype.setColumna = function (columna) {
        this.columna = columna;
    };
    return Nodo_Error;
}());
