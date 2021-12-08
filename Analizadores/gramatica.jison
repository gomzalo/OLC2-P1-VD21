/*
###################################################
###############  Definicion lexica  ###############
###################################################
*/
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
###############     Simbolos y palabras reservadas       ################
###################################################
*/
/*::::::::::::::::::     Palabras reservadas      ::::::::::::::::::*/
/* ..............      Instrucciones      ...............*/
"print"                     { return 'RPRINT' };
"println"                   { return 'RPRINTLN' };
// Condicionales
"if"                        { return 'RIF' };
"else"                      { return 'RELSE' };
/* ..............      Tipos      ...............*/
"null"                      { return 'NULL' };
"true"                      { return 'TRUE' };
"false"                     { return 'FALSE' };
/* ..............      Primitivos      ...............*/
"int"                       { return 'RINT' };
"double"                    { return 'RDOUBLE' };
"boolean"                   { return 'RBOOLEAN' };
"char"                      { return 'RCHAR' };
"String"                    { return 'RSTRING' };
/*::::::::::::::::::     Simbolos      ::::::::::::::::::*/
/* ..............      Aritmeticos      ...............*/
"+"                         { return 'MAS' };
"-"                         { return 'MENOS' };
"*"                         { return 'MULTI' };
"/"                         { return 'DIV' };
"%"                         { return 'PORCENTAJE' };
"^"                         { return 'POTENCIA' };
/*..............      Relacionales      ...............*/
">="                        { return 'MAYORIGUAL' };
"<="                        { return 'MENORIGUAL' };
"<"                         { return 'MENORQUE' };
">"                         { return 'MAYORQUE' };
"!="                        { return 'DIFERENTE' };
"=="                        { return 'IGUALIGUAL' };
"="                         { return 'IGUAL' };
/*..............     Logicos      ...............*/
"&&"                        { return 'AND' };
"||"                        { return 'OR' };
"!"                         { return 'NOT' };
"&"                         { return 'AMPERSON' };
/*..............     Aumento-decremento      ...............*/
"++"                        { return 'INCRE'};
"--"                        { return 'DECRE'};
/*..............     Asociacion      ...............*/
"("                         { return 'PARA' };
")"                         { return 'PARC' };
"["                         { return 'CORA' };
"]"                         { return 'CORC' };
"{"                         { return 'LLAVA' };
"}"                         { return 'LLAVC' };
/*..............     Simbolos      ...............*/
"."                         { return 'PUNTO' };
";"                         { return 'PUNTOCOMA' };
","                         { return 'COMA' };
"?"                         { return 'INTERROGACION' };
":"                         { return 'DOSPUNTOS' };
/*
::::::::::::::::::      Expresiones regulares     ::::::::::::::::::
*/

(([0-9]+"."[0-9]*)|("."[0-9]+))     return 'DECIMAL';
[0-9]+                              return 'ENTERO';
[a-zA-Z_][a-zA-Z0-9_ñÑ]*            return 'ID';
{stringliteral}                     return 'CADENA';
{charliteral}                       return 'CHAR';
/*..............     Error lexico      ...............*/

.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

/*..............     Espacios      ...............*/
[\r\n\t]                  {/* skip whitespace */}

<<EOF>>                     return 'EOF'

/lex

/*
###################################################
###############     Imports        ################
###################################################
*/

%{

    /*::::::::::::::::::     AST      ::::::::::::::::::*/
    const { Ast } = require("../dist/Ast/Ast");

    /*::::::::::::::::::     ENUMs      ::::::::::::::::::*/
    const { TIPO, OperadorAritmetico, OperadorLogico, OperadorRelacional } = require("../dist/TablaSimbolos/Tipo");
    /*::::::::::::::::::     Expresiones      ::::::::::::::::::*/
    const { Primitivo } = require("../dist/Expresiones/Primitivo");
    const {Identificador} = require("../dist/Expresiones/Identificador");
    /*..............     Operaciones      ...............*/
    const { Aritmetica } = require("../dist/Expresiones/Operaciones/Aritmeticas");
    const { Logica } = require("../dist/Expresiones/Operaciones/Logicas");
    const { Relacional } = require("../dist/Expresiones/Operaciones/Relacionales");

    /*::::::::::::::::::     Instrucciones      ::::::::::::::::::*/
    const { Print } = require("../dist/Instrucciones/Print");
    /*..............     Condicionales      ...............*/
    const { If } = require("../dist/Instrucciones/Condicionales/If");
    /*..............     DECLARACION Y ASIGNACION      ...............*/
    const { Declaracion } = require("../dist/Instrucciones/Declaracion");
    const { Simbolo } = require("../dist/TablaSimbolos/Simbolo");

%}

/*
###################################################
###############    Precedencia     ################
###################################################
*/

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
%right  'UMINUS'
%right  'PARA' 'PARC'
// %nonassoc 'IGUAL'

/*
###################################################
###############     Sintaxis      ################
###################################################
*/

/*..............     Produccion inicial      ...............*/
%start start

%%
/*
::::::::::::::::::      Gramatica     ::::::::::::::::::
*//*{ $$ = $1; return $$; }*/
start : 
        instrucciones EOF                   { console.log($1); $$ = new Ast();  $$.instrucciones = $1; return $$; }
    ;
/*
::::::::::::::::::      Instrucciones     ::::::::::::::::::
*/
instrucciones:
        instrucciones instruccion           { $$ = $1; $$.push($2); } //{ $1.push($2); $$ = $1;}
	|   instruccion                         { $$= new Array(); $$.push($1); } /*{ $$ = [$1]; } */
    ;

instruccion:
        print_instr PUNTOCOMA               { $$ = $1 }
    |   println_instr PUNTOCOMA             { $$ = $1 }
    |   declaracion                         { $$ = $1 }
    |   if_instr                            { $$ = $1 }
    ;
/*..............     Declaraciones      ...............*/

declaracion : 
        tipo lista_simbolos PUNTOCOMA       { $$ = new Declaracion($1, $2, @1.first_line, @1.last_column,$2); }
    ; 

lista_simbolos :
        lista_simbolos COMA ID              { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,null)); }
    |   lista_simbolos COMA ID IGUAL e      { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,null)); }
    |   ID                                  { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,null)); }
    |   ID IGUAL e                          { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,$3)); }
    ; 

/*..............     Print      ...............*/
print_instr:
        RPRINT PARA lista_parametros PARC   { $$ = new Print($3, @1.first_line, @1.first_column, false); }
    ;

println_instr:
        RPRINTLN PARA lista_parametros PARC { $$ = new Print($3, @1.first_line, @1.first_column, true); }
    ;

/*..............     If      ...............*/
if_instr:
        RIF PARA expr PARC
        LLAVA instrucciones LLAVC           { $$ = new If($3, $6, null, @1.first_line, @1.first_column); }
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE LLAVA instrucciones LLAVC     { $$ = new If($3, $6, $10, @1.first_line, @1.first_column); }
    ;

/*..............     Lista parametros      ...............*/

lista_parametros: 
        lista_parametros COMA expr          { $$ = $1; $$.push($3); }
    |   expr                                { $$ = new Array(); $$.push($1);}
    ;

// ------------ TIPO
tipo : 
        RINT        { $$ = TIPO.ENTERO; }
    |   RDOUBLE     { $$ = TIPO.DECIMAL; }
    |   RSTRING     { $$ = TIPO.CADENA; }
    |   RCHAR       { $$ = TIPO.CHARACTER; }
    |   RBOOLEAN    { $$ = TIPO.BOOLEANO; }
    ;


/*..............     Expresiones      ...............*/
expr: 
        expr MAS expr             { $$ = new Aritmetica($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); }
    |   expr MENOS expr           { $$ = new Aritmetica($1,OperadorAritmetico.MENOS,$3, @1.first_line, @1.first_column, false); }
    |   expr MULTI expr           { $$ = new Aritmetica($1,OperadorAritmetico.POR,$3, @1.first_line, @1.first_column, false); }
    |   expr DIV expr             { $$ = new Aritmetica($1,OperadorAritmetico.DIV,$3, @1.first_line, @1.first_column, false); }
    |   expr PORCENTAJE expr      { $$ = new Aritmetica($1,OperadorAritmetico.MOD,$3, @1.first_line, @1.first_column, false); }
    |   expr POTENCIA expr        { $$ = new Aritmetica($1,OperadorAritmetico.POT,$3, @1.first_line, @1.first_column, false); }
    |   expr AMPERSON expr        { $$ = new Aritmetica($1,OperadorAritmetico.AMPERSON,$3, @1.first_line, @1.first_column, false); }
    |   MENOS expr %prec UMINUS   { $$ = new Aritmetica($2,OperadorAritmetico.UMENOS,$2, @1.first_line, @1.first_column, true); }
    |   PARA expr PARC            { $$ = $2; }
    |   expr AND expr             { $$ = new Logica($1, OperadorLogico.AND, $3, $1.first_line, $1.last_column, false); }
    |   expr OR expr              { $$ = new Logica($1, OperadorLogico.OR, $3, $1.first_line, $1.last_column, false); }
    |   NOT expr                  { $$ = new Logica($2, OperadorLogico.NOT, null, $1.first_line, $1.last_column, true); }
    |   expr MAYORQUE expr        { $$ = new Relacional($1, OperadorRelacional.MAYORQUE, $3, $1.first_line, $1.last_column, false); }
    |   expr MAYORIGUAL expr      { $$ = new Relacional($1, OperadorRelacional.MAYORIGUAL, $3, $1.first_line, $1.last_column, false); }
    |   expr MENORIGUAL expr      { $$ = new Relacional($1, OperadorRelacional.MENORIGUAL, $3, $1.first_line, $1.last_column, false); }
    |   expr MENORQUE expr        { $$ = new Relacional($1, OperadorRelacional.MENORQUE, $3, $1.first_line, $1.last_column, false); }
    |   expr IGUALIGUAL expr      { $$ = new Relacional($1, OperadorRelacional.IGUALIGUAL, $3, $1.first_line, $1.last_column, false); }
    |   expr DIFERENTE expr       { $$ = new Relacional($1, OperadorRelacional.DIFERENTE, $3, $1.first_line, $1.last_column, false); }
    |   ENTERO                    { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); }
    |   DECIMAL                   { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); }
    |   CADENA                    { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); }
    |   CHAR                      { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); }
    |   NULL                      { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); }
    |   TRUE                      { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); }
    |   FALSE                     { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); } 
    |   ID                        { $$ = new Identificador($1 , @1.first_line, @1.last_column); }
//     /*| e INTERROGACION e DOSPUNTOS e {$$ = new ternario.default($1, $3, $5, @1.first_line, @1.last_column); } */
//     /*| ID INCRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '+', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}
//     | ID DECRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '-', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}*/
    ;