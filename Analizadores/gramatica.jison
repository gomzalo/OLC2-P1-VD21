/* Definición Léxica */
%lex

%options case-insensitive

escapechar                          [\'\"\\bfnrtv]
escape                              \\{escapechar}
acceptedcharsdouble                 [^\"\\]+
stringdouble                        {escape}|{acceptedcharsdouble}
stringliteral                       \"{stringdouble}*\"

acceptedcharssingle                 [^\'\\]
stringsingle                        {escape}|{acceptedcharssingle}
charliteral                         \'{stringsingle}\'

BSL                                 "\\".
%s                                  comment
%%

"//".*                              /* skip comments */
"/*"                                this.begin('comment');
<comment>"*/"                       this.popState();
<comment>.                          /* skip comment content*/
\s+                                 /* skip whitespace */

/*
###################################################
###############     Simbolos       ################
###################################################
*/

"print"                     return 'PRINT';
"null"                      return 'NULL';
"true"                      return 'TRUE';
"false"                     return 'FALSE';

/* ..............      Aritmeticos      ...............*/
"+"                         { return 'MAS'}
"-"                         { return 'MENOS'}
"*"                         { return 'MULTI'}
"/"                         { return 'DIV'}
"%"                         { return 'PORCENTAJE'}
"^"                         { return 'POTENCIA'; }

/*..............      Relacionales      ...............*/
"<"                         { return 'MENORQUE'}
">="                        { return 'MAYORIGUAL'}
">"                         { return 'MAYORQUE'}
"!="                        { return 'DIFERENTE'; }
"<="                        { return 'MENORIGUAL'; }
"=="                        return 'IGUALIGUAL';
"="                         return 'IGUAL';

/*..............     LOGICOS      ...............*/
"&&"                        return 'AND';
"||"                        return 'OR';
"!"                         return 'NOT';

/*..............     OTROS      ...............*/
"++"                   { return 'INCRE'}
"--"                   { return 'DECRE'}
"("                    { return 'PARA'}
")"                    { return 'PARC'}
"["                    { return 'CORA'}
"]"                    { return 'CORC'}
"."                    { return 'PUNTO'}
";"                    { return 'PUNTOCOMA'}
","                    { return 'COMA'}
"?"                    { return 'INTERROGACION'}
":"                    { return 'DOSPUNTOS'}
"{"                    { return 'LLAVA'}
"}"                    { return 'LLAVC'}

/* Number literals */
(([0-9]+"."[0-9]*)|("."[0-9]+))     return 'DECIMAL';
[0-9]+                              return 'ENTERO';

[a-zA-Z_][a-zA-Z0-9_ñÑ]*            return 'ID';

{stringliteral}                     return 'CADENA'
{charliteral}                       return 'CHAR'

//error lexico
.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

<<EOF>>                     return 'EOF'

/lex

//SECCION DE IMPORTS
%{
    const {Print} = require("../dist/Instrucciones/Print");
    const {Aritmetica} = require("../dist/Expresiones/Operaciones/Aritmeticas");
    const {TIPO, OperadorAritmetico} = require("../dist/TablaSimbolos/Tipo");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
%}

// DEFINIMOS PRESEDENCIA DE OPERADORES
%left 'or'
%left 'and'
%left 'lt' 'lte' 'gt' 'gte' 'equal' 'nequal'
%left 'plus' 'minus'
%left 'times' 'div' 'mod'
%left 'pow'
%left 'not'
%left UMINUS

%left 'lparen' 'rparen'


// DEFINIMOS PRODUCCIÓN INICIAL
%start start

%%


/* Definición de la gramática */
start : instrucciones EOF         { $$ = $1; return $$; }
    ;

instrucciones:
    instrucciones instruccion           { $1.push($2); $$ = $1;}
	| instruccion                { $$ = [$1]; } ;

instruccion:
    print PUNTOCOMA       { $$ = $1 }
;

print:
    PRINT PARA expr PARC            { $$ = new Print($3, @1.first_line, @1.first_column); } ;

expr: expr MAS expr                      { $$ = new Aritmetica($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); }
    | expr MENOS expr                   { $$ = new Aritmetica($1,OperadorAritmetico.RESTA,$3, @1.first_line, @1.first_column, false); }
    | expr MULTI expr                   { $$ = new Aritmetica($1,OperadorAritmetico.MULTIPLICACION,$3, @1.first_line, @1.first_column, false); }
    | expr DIV expr                     { $$ = new Aritmetica($1,OperadorAritmetico.DIVISION,$3, @1.first_line, @1.first_column, false); }
    | expr PORCENTAJE expr                     { $$ = new Aritmetica($1,OperadorAritmetico.MODULO,$3, @1.first_line, @1.first_column, false); }
    | MENOS expr %prec UMINUS           { $$ = new Aritmetica($2,OperadorAritmetico.MENOS_UNARIO,$2, @1.first_line, @1.first_column, true); }
    | PARA expr PARC                { $$ = $2 }

    | ENTERO                      { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); }
    | DECIMAL                     { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); }
    | CADENA                     { $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); }
    | CHAR                       { $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); }
    | NULL                              { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); }
    | TRUE                              { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); }
    | FALSE                             { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); } 
    ;