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
###################################################################
###############     Simbolos y palabras reservadas       ################
###################################################################
*/
/*::::::::::::::::::     Palabras reservadas      ::::::::::::::::::*/
/* ..............      Instrucciones      ...............*/
"print"                     { return 'RPRINT' };
"println"                   { return 'RPRINTLN' };
// Condicionales
"if"                        { return 'RIF' };
"else"                      { return 'RELSE' };
"switch"                    { return 'RSWITCH' };
"case"                      { return 'RCASE' };
"default"                   { return 'RDEFAULT' };
// Ciclicas
"while"                     { return 'RWHILE' };
"for"                       { return 'RFOR' };
"do"                        { return 'RDO' };
"in"                        { return 'RIN' };
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
"void"                      { return 'RVOID' };
"main"                      { return 'RMAIN' };
"struct"                      { return 'RSTRUCT' };
/* ..............      Transferencia      ...............*/
"break"                     { return 'RBREAK' };
"continue"                  { return 'RCONTINUE' };
"return"                    { return 'RRETURN' };
/*::::::::::::::::::     Simbolos      ::::::::::::::::::*/
/*..............     Aumento-decremento      ...............*/
"++"                        { return 'INCRE'};
"--"                        { return 'DECRE'};
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
    const { Identificador } = require("../dist/Expresiones/Identificador");
    const { Ternario } = require("../dist/Expresiones/Ternario");
    const { Llamada } = require("../dist/Expresiones/Llamada");
    /*..............     Operaciones      ...............*/
    const { Aritmetica } = require("../dist/Expresiones/Operaciones/Aritmeticas");
    const { Logica } = require("../dist/Expresiones/Operaciones/Logicas");
    const { Relacional } = require("../dist/Expresiones/Operaciones/Relacionales");
    /*::::::::::::::::::     Instrucciones      ::::::::::::::::::*/
    const { Print } = require("../dist/Instrucciones/Print");
    const { Main } = require("../dist/Instrucciones/Metodos/Main");
    const { Funcion } = require("../dist/Instrucciones/Metodos/Funcion");
    
    /*..............     Condicionales      ...............*/
    const { If } = require("../dist/Instrucciones/Condicionales/If");
    const { Ifsinllave } = require("../dist/Instrucciones/Condicionales/Ifsinllave");
    const { Switch } = require("../dist/Instrucciones/Condicionales/Switch");
    const { Case } = require("../dist/Instrucciones/Condicionales/Case");
    /*..............     Transferencia      ...............*/
    const { Detener } = require("../dist/Instrucciones/Transferencia/Break");
    const { Continuar } = require("../dist/Instrucciones/Transferencia/Continuar");
    const { Return } = require("../dist/Instrucciones/Transferencia/Return");
    /*..............     Ciclicas      ...............*/
    const { While } = require("../dist/Instrucciones/Ciclicas/While");
    const { DoWhile } = require("../dist/Instrucciones/Ciclicas/DoWhile");
    const { For } = require("../dist/Instrucciones/Ciclicas/For");
    const { ForIn } = require("../dist/Instrucciones/Ciclicas/ForIn");
    /*..............     Declaracion y asignacion      ...............*/
    const { Declaracion } = require("../dist/Instrucciones/Declaracion");
    const { Asignacion } = require("../dist/Instrucciones/Asignacion");
    const { Simbolo } = require("../dist/TablaSimbolos/Simbolo");
    /*..............     Arreglos      ...............*/
    const { DeclaracionArr } = require("../dist/Instrucciones/Arreglos/DeclaracionArr");

%}
/*
###################################################
###############    Precedencia     ################
###################################################
*/
    %right  'INTERROGACION'
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
    %right  'INCRE' 'DECRE'
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
/*..............     Instruccion      ...............*/
instruccion:
        print_instr PUNTOCOMA               { $$ = $1 }
    |   println_instr PUNTOCOMA             { $$ = $1 }
    |   main_                               { $$ = $1 }
    |   funciones                           { $$ = $1 }
    |   declaracion PUNTOCOMA               { $$ = $1 }
    |   asignacion  PUNTOCOMA               { $$ = $1 }
    |   if_llav_instr                       { $$ = $1 }
    |   if_instr                            { $$ = $1 }
    |   switch_instr                        { $$ = $1 }
    |   break_instr PUNTOCOMA               { $$ = $1 }
    |   continue_instr PUNTOCOMA            { $$ = $1 }
    |   return_instr PUNTOCOMA              { $$ = $1 }
    |   while_instr                         { $$ = $1 }
    |   for_instr                           { $$ = $1 }
    |   dowhile_instr PUNTOCOMA             { $$ = $1 }
    |   for_in_instr                        { $$ = $1 }
    |   decl_arr_instr PUNTOCOMA            { $$ = $1 }
    |   llamada PUNTOCOMA                   { $$ = $1 }
    
    ;
/*..............     Declaracion      ...............*/
declaracion: 
        tipo  lista_simbolos                 { $$ = new Declaracion($1, $2, @1.first_line, @1.last_column); }
    ; 
// Lista simbolos
lista_simbolos:
        lista_simbolos COMA ID              { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,null)); }
    |   lista_simbolos COMA ID IGUAL expr   { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,$5)); }
    |   ID                                  { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,null)); }
    |   ID IGUAL expr                       { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,$3)); }
    ; 
/*..............     Asignacion      ...............*/
asignacion:
        ID IGUAL expr                       { $$ = new Asignacion($1 ,$3, @1.first_line, @1.last_column); }
    |   ID INCRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); }
    |   ID DECRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); }
    ;
/*..............     Print      ...............*/
print_instr:
        RPRINT PARA lista_parametros PARC   { $$ = new Print($3, @1.first_line, @1.first_column, false); }
    ;
println_instr:
        RPRINTLN PARA lista_parametros PARC { $$ = new Print($3, @1.first_line, @1.first_column, true); }
    ;
/*..............     If con llave     ...............*/
if_llav_instr:
    // If
        RIF PARA expr PARC
        LLAVA instrucciones LLAVC           { $$ = new If($3, $6, null, @1.first_line, @1.first_column); }
    // If-else
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE LLAVA instrucciones LLAVC     { $$ = new If($3, $6, $10, @1.first_line, @1.first_column); }
    // If-elseif
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE if_llav_instr                 { $$ = new If($3, $6, [$9], @1.first_line, @1.first_column); }
    ;
/*..............     If sin llave     ...............*/
if_instr:
    // If
        RIF PARA expr PARC
        instruccion                         { $$ = new Ifsinllave($3, $5, null, @1.first_line, @1.first_column); }
    // If-else
    |   RIF PARA expr PARC
        instruccion
        RELSE instruccion                   { $$ = new Ifsinllave($3, $5, $7, @1.first_line, @1.first_column); }
    // If-elseif
    |   RIF PARA expr PARC
        instruccion
        RELSE if_instr                      { $$ = new Ifsinllave($3, $5, [$7], @1.first_line, @1.first_column); }
    ;
/*..............     Switch     ...............*/
switch_instr:
    // SW-CS
        RSWITCH PARA expr PARC
        LLAVA lista_cases LLAVC             { $$ = new Switch($3, $6, [], @1.first_line, @1.first_column); }
    // SW-DF
    |   RSWITCH PARA expr PARC
        LLAVA RDEFAULT DOSPUNTOS
        instrucciones LLAVC                 { $$ = new Switch($3, [], $8, @1.first_line, @1.first_column); }
    // SW-CS-DF
    |   RSWITCH PARA expr PARC
        LLAVA lista_cases             
        RDEFAULT DOSPUNTOS
        instrucciones LLAVC                 { $$ = new Switch($3, $6, $9, @1.first_line, @1.first_column); }
    ;
// ------------ Lista cases
lista_cases:
        lista_cases case                    { $$ = $1; $$.push($2); }
    |   case                                { $$ = new Array(); $$.push($1);}
    ;
// ------------ Case
case:
        RCASE expr DOSPUNTOS
        instrucciones                       { $$ = new Case($2, $4, @1.first_line, @1.first_column); }
    ;
/*..............     Lista parametros      ...............*/
lista_parametros: 
        lista_parametros COMA expr          { $$ = $1; $$.push($3); }
    |   expr                                { $$ = new Array(); $$.push($1);}
    ;
/*..............     Transferencia      ...............*/
// ------------     Break
break_instr:
        RBREAK                              { $$ = new Detener(@1.first_line, @1.first_column); }
    ;
// ------------      Continue
continue_instr:
        RCONTINUE                           { $$ = new Continuar(@1.first_line, @1.first_column); }
    ;
// ------------     Return
return_instr:
        RRETURN expr                        { $$ = new Return($2,@1.first_line, @1.first_column); }
    ;
/*..............     While      ...............*/
while_instr:
        RWHILE PARA expr PARC
        LLAVA instrucciones LLAVC           { $$ = new While($3, $6, @1.first_line, @1.first_column); }
    ;
/*..............     Do While      ...............*/
dowhile_instr : 
        RDO LLAVA instrucciones LLAVC
        RWHILE PARA expr PARC               { $$ = new DoWhile($7, $3, @1.first_line, @1.last_column); }
    ;
/*..............     For      ...............*/
for_instr:
        RFOR PARA asignacion PUNTOCOMA
        expr PUNTOCOMA actualizacion PARC
        LLAVA instrucciones LLAVC           { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); }
    |   RFOR PARA declaracion PUNTOCOMA
        expr PUNTOCOMA actualizacion PARC
        LLAVA instrucciones LLAVC           { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); }
    ;
// ------------     Actualizacion
actualizacion:
        ID IGUAL expr                       { $$ = new Asignacion($1 ,$3, @1.first_line, @1.last_column); }
    |   ID INCRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); }
    |   ID DECRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); }
    ;
/*..............     For in      ...............*/
for_in_instr:
        RFOR ID RIN expr
        LLAVA instrucciones LLAVC           { $$ = new ForIn($2, $4, $6, @1.first_line, @1.first_column); }
    ;
/*..............     Main      ...............*/
main_ :
        RVOID RMAIN PARA PARC 
        LLAVA instrucciones LLAVC           {$$ = new Main($6,@1.first_line, @1.first_column); }
    |   RVOID RMAIN PARA PARC 
        LLAVA LLAVC                         {$$ = new Main([],@1.first_line, @1.first_column); }
    ;
/*..............     Funciones      ...............*/
funciones : tipo ID PARA PARC LLAVA instrucciones LLAVC     { $$ = new Funcion($2, $1, [], $6, @1.first_line, @1.last_column ); }
        | tipo ID PARA lista_parametros_func PARC LLAVA instrucciones LLAVC  { $$ = new Funcion($2, $1, $4, $7, @1.first_line, @1.last_column ); }
        ;
/*..............     Lista parametros      ...............*/
lista_parametros_func: 
        lista_parametros_func COMA parametro_func     { $$ = $1; $$.push($3); }
    |   parametro_func                                { $$ = new Array(); $$.push($1); }
    ;
//------   Parametros Funcion 
parametro_func:
        tipo ID     { $$ = {"tipo" : $1, "arreglo": false, "id": $2}; } // EN MEDIO $2 - LISTA DIM
    |   ID          { $$ = {"tipo" : TIPO.ANY, "arreglo": false, "id": $1}; }
    ;  


/*..............     Llamada      ...............*/
llamada : ID PARA PARC              { $$ = new Llamada($1 , [], @1.first_line, @1.last_column ); }
        | ID PARA lista_parametros PARC    { $$ = new Llamada($1 , $3 , @1.first_line, @1.last_column ); }
        ;

/*..............     Arreglos      ...............*/
// ------------     Declaracion array
decl_arr_instr:
        tipo lista_dim ID
        IGUAL lista_exp_arr                 { $$ = new DeclaracionArr($1, $2, $3, $5, @1.first_line, @1.last_column ); }
    ;
// ------------     Dimensiones
lista_dim:
        lista_dim CORA CORC                 { $$ = $1; $$.push($2+1); }
    |   CORA CORC                           { $$ = new Array(); $$.push(1); }
    ;
// ------------     Lista expresiones
lista_exp_arr:
        lista_exp_arr CORA lista_exp_arr_c CORC         { $$ = $1; $$.push($3); }
    |   CORA lista_exp_arr_c CORC                       { $$ = new Array(); $$.push($2); }
    ;
// ------------     Lista expresiones
lista_exp_arr_c:
        lista_exp_arr_c COMA expr           { $$ = $1; $$.push($3); }
    |   expr                                { $$ = new Array(); $$.push($1); }
    ;
/*..............     Tipos      ...............*/
tipo : 
        RINT                        { $$ = TIPO.ENTERO; }
    |   RDOUBLE                     { $$ = TIPO.DECIMAL; }
    |   RSTRING                     { $$ = TIPO.CADENA; }
    |   RCHAR                       { $$ = TIPO.CHARACTER; }
    |   RBOOLEAN                    { $$ = TIPO.BOOLEANO; }
    |   RVOID                       { $$ = TIPO.VOID; }
    |   RSTRUCT                     { $$ = TIPO.STRUCT; }
    ;

/*..............     Expresiones      ...............*/
expr: 
        expr MAS expr               { $$ = new Aritmetica($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); }
    |   expr MENOS expr             { $$ = new Aritmetica($1,OperadorAritmetico.MENOS,$3, @1.first_line, @1.first_column, false); }
    |   expr MULTI expr             { $$ = new Aritmetica($1,OperadorAritmetico.POR,$3, @1.first_line, @1.first_column, false); }
    |   expr DIV expr               { $$ = new Aritmetica($1,OperadorAritmetico.DIV,$3, @1.first_line, @1.first_column, false); }
    |   expr PORCENTAJE expr        { $$ = new Aritmetica($1,OperadorAritmetico.MOD,$3, @1.first_line, @1.first_column, false); }
    |   expr POTENCIA expr          { $$ = new Aritmetica($1,OperadorAritmetico.POT,$3, @1.first_line, @1.first_column, false); }
    |   expr AMPERSON expr          { $$ = new Aritmetica($1,OperadorAritmetico.AMPERSON,$3, @1.first_line, @1.first_column, false); }
    |   MENOS expr %prec UMINUS     { $$ = new Aritmetica($2,OperadorAritmetico.UMENOS,$2, @1.first_line, @1.first_column, true); }
    |   PARA expr PARC              { $$ = $2; }
    |   expr AND expr               { $$ = new Logica($1, OperadorLogico.AND, $3, $1.first_line, $1.last_column, false); }
    |   expr OR expr                { $$ = new Logica($1, OperadorLogico.OR, $3, $1.first_line, $1.last_column, false); }
    |   NOT expr                    { $$ = new Logica($2, OperadorLogico.NOT, null, $1.first_line, $1.last_column, true); }
    |   expr MAYORQUE expr          { $$ = new Relacional($1, OperadorRelacional.MAYORQUE, $3, $1.first_line, $1.last_column, false); }
    |   expr MAYORIGUAL expr        { $$ = new Relacional($1, OperadorRelacional.MAYORIGUAL, $3, $1.first_line, $1.last_column, false); }
    |   expr MENORIGUAL expr        { $$ = new Relacional($1, OperadorRelacional.MENORIGUAL, $3, $1.first_line, $1.last_column, false); }
    |   expr MENORQUE expr          { $$ = new Relacional($1, OperadorRelacional.MENORQUE, $3, $1.first_line, $1.last_column, false); }
    |   expr IGUALIGUAL expr        { $$ = new Relacional($1, OperadorRelacional.IGUALIGUAL, $3, $1.first_line, $1.last_column, false); }
    |   expr DIFERENTE expr         { $$ = new Relacional($1, OperadorRelacional.DIFERENTE, $3, $1.first_line, $1.last_column, false); }
    |   ENTERO                      { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); }
    |   DECIMAL                     { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); }
    |   CADENA                      { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); }
    |   CHAR                        { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); }
    |   NULL                        { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); }
    |   TRUE                        { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); }
    |   FALSE                       { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); } 
    |   ID                          { $$ = new Identificador($1 , @1.first_line, @1.last_column); }
    |   expr INTERROGACION expr DOSPUNTOS expr {$$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column);} 
    |   ID INCRE                    { $$ = new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false); }
    |   ID DECRE                    { $$ = new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false); }
    |   CORA lista_exp_arr_c CORC   { $$ = $2;}
    |   llamada                     { $$ = $1 }
    ;