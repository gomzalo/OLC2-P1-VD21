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

"print"                     { return 'PRINT' };
"println"                   { return 'PRINTLN' };
"null"                      { return 'NULL' };
"true"                      { return 'TRUE' };
"false"                     { return 'FALSE' };

/* ..............      Aritmeticos      ...............*/
"+"                         { return 'MAS'}
"-"                         { return 'MENOS'}
"*"                         { return 'MULTI'}
"/"                         { return 'DIV'}
"%"                         { return 'PORCENTAJE'}
"^"                         { return 'POTENCIA'; }


/*..............      Relacionales      ...............*/
">="                        { return 'MAYORIGUAL' };
"<="                        { return 'MENORIGUAL' };
"<"                         { return 'MENORQUE' };
">"                         { return 'MAYORQUE' };
"!="                        { return 'DIFERENTE' };
"=="                        { return 'IGUALIGUAL' };
"="                         { return 'IGUAL' };

/*..............     LOGICOS      ...............*/
"&&"                        { console.log("Reconocio : "+ yytext); return 'AND' };
"||"                        { return 'OR' };
"!"                         { return 'NOT' };
"&"                         { console.log("Reconocio : "+ yytext); return 'AMPERSON' };

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

{stringliteral}                     return 'CADENA';
{charliteral}                       return 'CHAR';

//error lexico
.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

/* Espacios */
[\r\n\t]                  {/* skip whitespace */}

<<EOF>>                     return 'EOF'

/lex

//SECCION DE IMPORTS
%{

    const {Print} = require("../dist/Instrucciones/Print");
    const {Aritmetica} = require("../dist/Expresiones/Operaciones/Aritmeticas");
    const {TIPO, OperadorAritmetico, OperadorLogico, OperadorRelacional } = require("../dist/TablaSimbolos/Tipo");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
    const {Logica} = require("../dist/Expresiones/Operaciones/Logicas");
    const {Relacional} = require("../dist/Expresiones/Operaciones/Relacionales");

    const {Ast} = require("../dist/Ast/Ast");

%}

// DEFINIMOS PRESEDENCIA DE OPERADORES
// %left 'or'
// %left 'and'
// %left 'lt' 'lte' 'gt' 'gte' 'equal' 'nequal'
// %left 'plus' 'minus'
// %left 'times' 'div' 'mod'
// %left 'pow'
// %left 'not'
// %left UMINUS

// %left 'lparen' 'rparen'
// %right 'INTERROGACION'
%left   'OR'
%left   'AND'
%right  'NOT'
%left   'IGUALIGUAL' 'DIFERENTE'
%left   'MENORQUE' 'MAYORQUE' 'MENORIGUAL' 'MAYORIGUAL' 
// %left 'AMPERSON' 
%left   'MAS' 'MENOS' 'AMPERSON'
%left   'MULTI' 'DIV' 'PORCENTAJE'
%left   'POTENCIA'
// %right 'UNARIO'
%right  'UMINUS'
%right  'PARA' 'PARC'
// %nonassoc 'IGUAL'
// %right 'INTERROGACION'
// %left 'OR'
// %left 'AND'
// %right 'NOT'
// %left 'IGUALIGUAL' 'DIFERENTE' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE'  'MAYORIGUAL' 
// %left 'MAS' 'MENOS'
// %left 'MULTI' 'DIV' 'MODULO'
// %nonassoc 'POT'
// %right 'UNARIO'
// %right 'PARA' 'CORA'


// DEFINIMOS PRODUCCIÓN INICIAL
%start start

%%


/* Definición de la gramática */
start : 
    instrucciones EOF         /*{ $$ = $1; return $$; }*/
    { console.log($1); $$ = new Ast();  $$.instrucciones = $1; return $$; }
    ;

// --------- LISTADO INSTRUCCIONES --------
instrucciones:
    instrucciones instruccion           { $$ = $1; $$.push($2); } //{ $1.push($2); $$ = $1;}
	| instruccion                       { $$= new Array(); $$.push($1); } /*{ $$ = [$1]; } */
    ;

instruccion:
    print PUNTOCOMA                     { $$ = $1 }
    | println PUNTOCOMA                 { $$ = $1 }
    ;

// ---------  INSTRUCCIONES --------
print:
    PRINT PARA lista_parametros PARC    { $$ = new Print($3, @1.first_line, @1.first_column, false); }
    ;

println:
    PRINTLN PARA lista_parametros PARC    { $$ = new Print($3, @1.first_line, @1.first_column, true); }
    ;


lista_parametros: 
    lista_parametros COMA expr     { $$ = $1; $$.push($3); }
    | expr                         { $$ = new Array(); $$.push($1);}
    ;

// declaracion : tipo lista_simbolos PUNTOCOMA   { $$ = new declaracion.default($1, $2, @1.first_line, @1.last_column); }
//             ; 


// ---------  EXPRESIONES --------
expr: expr MAS expr             { $$ = new Aritmetica($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); }
    | expr MENOS expr           { $$ = new Aritmetica($1,OperadorAritmetico.MENOS,$3, @1.first_line, @1.first_column, false); }
    | expr MULTI expr           { $$ = new Aritmetica($1,OperadorAritmetico.POR,$3, @1.first_line, @1.first_column, false); }
    | expr DIV expr             { $$ = new Aritmetica($1,OperadorAritmetico.DIV,$3, @1.first_line, @1.first_column, false); }
    | expr PORCENTAJE expr      { $$ = new Aritmetica($1,OperadorAritmetico.MOD,$3, @1.first_line, @1.first_column, false); }
    | expr POTENCIA expr        { $$ = new Aritmetica($1,OperadorAritmetico.POT,$3, @1.first_line, @1.first_column, false); }
    | expr AMPERSON expr        { $$ = new Aritmetica($1,OperadorAritmetico.AMPERSON,$3, @1.first_line, @1.first_column, false); }
    | MENOS expr %prec UMINUS   { $$ = new Aritmetica($2,OperadorAritmetico.UMENOS,$2, @1.first_line, @1.first_column, true); }
    | PARA expr PARC            { $$ = $2;}
    | expr AND expr             {$$ = new Logica($1, OperadorLogico.AND, $3, $1.first_line, $1.last_column, false);}
    | expr OR expr              {$$ = new Logica($1, OperadorLogico.OR, $3, $1.first_line, $1.last_column, false);}
    | NOT expr                  {$$ = new Logica($2, OperadorLogico.NOT, null, $1.first_line, $1.last_column, true);}
    | expr MAYORQUE expr        {$$ = new Relacional($1, OperadorRelacional.MAYORQUE, $3, $1.first_line, $1.last_column, false);}
    | expr MAYORIGUAL expr      {$$ = new Relacional($1, OperadorRelacional.MAYORIGUAL, $3, $1.first_line, $1.last_column, false);}
    | expr MENORIGUAL expr      {$$ = new Relacional($1, OperadorRelacional.MENORIGUAL, $3, $1.first_line, $1.last_column, false);}
    | expr MENORQUE expr        {$$ = new Relacional($1, OperadorRelacional.MENORQUE, $3, $1.first_line, $1.last_column, false);}
    | expr IGUALIGUAL expr      {$$ = new Relacional($1, OperadorRelacional.IGUALIGUAL, $3, $1.first_line, $1.last_column, false);}
    | expr DIFERENTE expr       {$$ = new Relacional($1, OperadorRelacional.DIFERENTE, $3, $1.first_line, $1.last_column, false);}
    | ENTERO                    { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); }
    | DECIMAL                   { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); }
    | CADENA                    { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); }
    | CHAR                      { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); }
    | NULL                      { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); }
    | TRUE                      { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); }
    | FALSE                     { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); } 
//     /*| e INTERROGACION e DOSPUNTOS e {$$ = new ternario.default($1, $3, $5, @1.first_line, @1.last_column); } */
//     /*| ID INCRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '+', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}
//     | ID DECRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '-', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}*/
    ;