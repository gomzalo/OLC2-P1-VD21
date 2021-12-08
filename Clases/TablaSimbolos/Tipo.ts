/**
 * @enum de Tipo nos permite enumerar los tipos del lenguaje
 */

export enum TIPO{
    ENTERO,
    DECIMAL,
    BOOLEANO,
    CHARACTER,
    CADENA,
    NULO,
    ARREGLO,
    ANY,
    RANGO,
    STRUCT,
    VOID
}

export enum OperadorAritmetico{
    MAS,
    MENOS,
    POR,
    DIV,
    POT,
    MOD,
    UMENOS,
    UMENOSMENOS,
    UMASMAS
}

export enum OperadorRelacional{
    MENORQUE,
    MAYORQUE,
    MENORIGUAL,
    MAYORIGUAL,
    IGUALIGUAL,
    DIFERENTE
}

export enum OperadorLogico{
    NOT,
    AND,
    OR
}