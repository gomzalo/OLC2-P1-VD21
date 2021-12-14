/*
###################################################
###############  Definicion lexica  ###############
###################################################
*/
%{
    let errores = [];
%}

%lex

%options case-sensitive


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
"struct"                    { return 'RSTRUCT' };
/* ..............      Transferencia      ...............*/
"break"                     { return 'RBREAK' };
"continue"                  { return 'RCONTINUE' };
"return"                    { return 'RRETURN' };
/* ..............      Rango      ...............*/
"begin"                     { return 'RBEGIN' };
"end"                       { return 'REND' };
/* ..............      Nativas      ...............*/
/* -------- Arreglos */
"pop"                       { return 'RPOP' };
"push"                      { return 'RPUSH' };
"lenght"                    { return 'RLENGTH' };
/* -------- Cadenas */
"caracterOfPosition"        { return 'RCHAROFPOS' };
"subString"                 { return 'RSUBSTRING' };
"toUppercase"               { return 'RTOUPPER' };
"toLowercase"               { return 'RTOLOWER' };
/* -------- Matematicas */
/* Trigonometricas */
"sin"                       { return 'RSIN' };
"cos"                       { return 'RCOS' };
"tan"                       { return 'RTAN' };
/* Otras */
"log10"                     { return 'RLOG' };
"sqrt"                      { return 'RSQRT' };
/* -------- Numericas */
"parse"                     { return 'RPARSE' };
"toInt"                     { return 'RTOINT' };
"toDouble"                  { return 'RTODOUBLE' };
/* -------- Generales */
"string"                    { return 'RSTRING_N' };
"typeof"                    { return 'RTYPEOF' };
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
"#"                         { return 'HASH' };
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
    const { Errores } = require("../dist/Ast/Errores");
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
    const { AccesoArr } = require("../dist/Expresiones/Arreglos/AccesoArr");
    const { ModificacionArr } = require("../dist/Instrucciones/Arreglos/ModificacionArr");
    const { Rango } = require("../dist/Expresiones/Arreglos/Rango");
    const { Arreglo } = require("../dist/Expresiones/Arreglos/Arreglo");
    const { Copiar } = require("../dist/Expresiones/Arreglos/Copiar");
    /*..............     Struct      ...............*/
    const { Struct } = require("../dist/Instrucciones/Struct/Struct");
    const { DeclararStruct } = require("../dist/Instrucciones/Struct/DeclararStruct");
    const { AccesoStruct } = require("../dist/Expresiones/Struct/AccesoStruct");
    const { StructInStruct } = require("../dist/Instrucciones/Struct/StructInStruct");
    const { AsignaVariable } = require("../dist/Instrucciones/Struct/AsignaVariable");
    /* ..............      Nativas      ...............*/
    /* -------- Arreglos */
    const { Length } = require("../dist/Instrucciones/Metodos/Nativas/Length");
    const { Pop } = require("../dist/Instrucciones/Metodos/Nativas/Arreglos/Pop");
    const { Push } = require("../dist/Instrucciones/Metodos/Nativas/Arreglos/Push");
    /* -------- Cadenas */
    const { CharOfPos } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/CharOfPos");
    const { subString } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/subString");
    const { toUpper } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/toUpper");
    const { toLower } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/toLower");
    /* -------- Matematicas */
    const { Matematicas } = require("../dist/Instrucciones/Metodos/Nativas/Matematicas");
    /* -------- Numericas */
    const { Parse } = require("../dist/Instrucciones/Metodos/Nativas/Numericas/Parse");
    const { To } = require("../dist/Instrucciones/Metodos/Nativas/Numericas/To");
    /* -------- Generales */
    const { StringN } = require("../dist/Instrucciones/Metodos/Nativas/StringN");
    const { TypeOfN } = require("../dist/Instrucciones/Metodos/Nativas/TypeOfN");

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
    %left   'MAS' 'MENOS' 'AMPERSON' 'PUNTO'
    %left   'MULTI' 'DIV' 'PORCENTAJE'
    %left   'POTENCIA'
    %right  'UMINUS'
    %right  'INCRE' 'DECRE'
    %right 'PARA' 'CORA'
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
        instrucciones EOF                   {   console.log($1); $$ = new Ast();  $$.instrucciones = $1; $$.Errores = errores.slice();
                                                // errores.forEach((error)=>{
                                                //     // $$.Errores.push(error);
                                                //     console.log("eeeerrrrrrrorrrres")
                                                //     console.log(error);
                                                // });
                                                return $$; }
    ;
/*
::::::::::::::::::      Instrucciones     ::::::::::::::::::
*/
instrucciones:
        instrucciones instruccion           { $$ = $1;if($2!=null){ $$.push($2);} } //{ $1.push($2); $$ = $1;}
	|   instruccion                         { $$= new Array(); if($1!=null){$$.push($1); }} /*{ $$ = [$1]; } */
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
    |   modif_arr_instr PUNTOCOMA           { $$ = $1 }
    |   structs PUNTOCOMA                   { $$ = $1 }
    
    |   nat_push_instr PUNTOCOMA            { $$ = $1 }
    | error         { console.log("Error Sintactico" + yytext 
                                    + "linea: " + this._$.first_line 
                                    + "columna: " + this._$.first_column); 
                                    
                        errores.push(new Errores("Sintactico ", yytext + " <-- Error Sintactico ", this.fila,this.columna));
                        $$ =null;
                                // new errores.default("Lexico", "No se esperaba el caracter "+ yytext , 
                                //                 this._$.first_line ,this._$.first_column);            
                            }
    ;
/*..............     Declaracion      ...............*/
declaracion: 
        tipo  lista_simbolos                 { $$ = new Declaracion($1, $2, @1.first_line, @1.last_column); }
    ; 
/*..............     STRUCTS      ...............*/
structs:
        RSTRUCT ID LLAVA instrucciones_struct LLAVC    { $$ = new Struct($2,$4,@1.first_line, @1.last_column); }
    // |   RSTRUCT ID LLAVA  LLAVC                 { $$ = new Struct($2,[].first_line, @1.last_column); }
    ;

instrucciones_struct:
        instrucciones_struct COMA attribute      { $$ = $1; $$.push($3); } //{ $1.push($2); $$ = $1;}
	|   attribute                            { $$= new Array(); $$.push($1); } /*{ $$ = [$1]; } */
    ;

//    |   declaracion                { $$ = $1 }
attribute:  ID ID                       {$$ = new StructInStruct($1,$2,@1.first_line, @1.last_column); }

    |   tipo  attributeDeclaStruct      { $$ = new Declaracion($1, [$2], @1.first_line, @1.last_column); }
    ;
    
attributeDeclaStruct: 
        ID                                  { $$=new Simbolo($1,null,null,@1.first_line, @1.first_column,null); }
    |   ID IGUAL expr                       { $$=new Simbolo($1,null,null,@1.first_line, @1.first_column,$3); }
    ;

// isComaMaybe :           {$$=null;}
//             |  COMA     {$$=null;}
//                 ;
// Lista simbolos
lista_simbolos:
        lista_simbolos COMA ID              { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,null)); }
    |   lista_simbolos COMA ID IGUAL expr   { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,$5)); }
    |   ID                                  { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,null)); }
    |   ID IGUAL expr                       { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,$3)); }
    ; 
/*..............     Asignacion      ...............*/
//    ID IGUAL expr                       { $$ = new Asignacion($1 ,$3, @1.first_line, @1.last_column); }
asignacion:
        ID IGUAL expr                       {
                                                if($3 instanceof Array){
                                                    // console.log("asignacion arreglo");
                                                    $$ = new DeclaracionArr(null, null, $1, $3, @1.first_line, @1.last_column);
                                                }else{
                                                    // console.log("asignacion normal");
                                                    $$ = new Asignacion($1 ,$3, @1.first_line, @1.last_column);
                                                }
                                            }
    |   ID INCRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); }
    |   ID DECRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); }
    |   ID ID IGUAL expr                    { $$ = new DeclararStruct($1,$2,$4,@1.first_line, @1.last_column); }
    
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
        LLAVA instrucciones LLAVC           { $$ = new If($3, $6, null,null, @1.first_line, @1.first_column); }
    // If-else
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE LLAVA instrucciones LLAVC     { $$ = new If($3, $6, $10,null, @1.first_line, @1.first_column); }
    // If-elseif
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE if_llav_instr                 { $$ = new If($3, $6,null, $9, @1.first_line, @1.first_column); }
    ;
/*..............     If sin llave     ...............*/
if_instr:
    // If
        RIF PARA expr PARC
        instruccion                         { $$ = new Ifsinllave($3, $5, [], @1.first_line, @1.first_column); }
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
    |   RRETURN                             { $$ = new Return(new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column),@1.first_line, @1.first_column); }
    ;
/*..............     While      ...............*/
while_instr:
        RWHILE PARA expr PARC
        LLAVA instrucciones LLAVC           { $$ = new While($3, $6, @1.first_line, @1.first_column); }
    ;
/*..............     Do While      ...............*/
dowhile_instr:
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
main_:
        RVOID RMAIN PARA PARC 
        LLAVA instrucciones LLAVC           {$$ = new Main($6,@1.first_line, @1.first_column); }
    |   RVOID RMAIN PARA PARC 
        LLAVA LLAVC                         {$$ = new Main([],@1.first_line, @1.first_column); }
    | error         { console.log("Error Sintactico" + yytext 
                                    + "linea: " + this._$.first_line 
                                    + "columna: " + this._$.first_column); 
                        $$=null;
                                // new errores.default("Lexico", "No se esperaba el caracter "+ yytext , 
                                //                 this._$.first_line ,this._$.first_column);            
                            }
    ;
    
/*..............     Funciones      ...............*/
funciones:
        tipo ID PARA PARC
        LLAVA instrucciones LLAVC           { $$ = new Funcion($2, $1, [], $6, @1.first_line, @1.last_column); }
    |   tipo ID
        PARA lista_parametros_func
        PARC LLAVA instrucciones LLAVC      { $$ = new Funcion($2, $1, $4, $7, @1.first_line, @1.last_column); }
    | error         { console.log("Error Sintactico" + yytext 
                                    + "linea: " + this._$.first_line 
                                    + "columna: " + this._$.first_column); 
                        $$=null;
                                // new errores.default("Lexico", "No se esperaba el caracter "+ yytext , 
                                //                 this._$.first_line ,this._$.first_column);            
                            }
    ;
/*..............     Lista parametros      ...............*/
lista_parametros_func: 
        lista_parametros_func
        COMA parametro_func                 { $$ = $1; $$.push($3); }
    |   parametro_func                      { $$ = new Array(); $$.push($1); }
    ;
//------   Parametros Funcion 
parametro_func:
        tipo ID                             { $$ = {"tipo" : $1, "arreglo": false, "id": $2}; } // EN MEDIO $2 - LISTA DIM
    |   ID                                  { $$ = {"tipo" : TIPO.ANY, "arreglo": false, "id": $1}; }
    ;
/*..............     Llamada      ...............*/
llamada :
        ID PARA PARC                        { $$ = new Llamada($1 , [], @1.first_line, @1.last_column); }
    |   ID PARA lista_parametros PARC       { $$ = new Llamada($1 , $3 , @1.first_line, @1.last_column); }
    ;
/*..............     Arreglos      ...............*/
// ------------     Declaracion array
decl_arr_instr:
        tipo lista_dim ID
        IGUAL lista_exp_arr                 { $$ = new DeclaracionArr($1, $2, $3, $5, @1.first_line, @1.last_column); }
    |   ID IGUAL lista_exp_arr              { $$ = new DeclaracionArr(null, null, $1, $2, @1.first_line, @1.last_column); }
    |   tipo lista_dim ID                   { $$ = new DeclaracionArr($1, $2, $3, null, @1.first_line, @1.last_column); }
    ;
// ------------     Dimensiones
lista_dim:
        lista_dim CORA CORC                 { $$ = $1; $$.push($2+1); }
    |   CORA CORC                           { $$ = new Array(); $$.push(1); }
    ;
// ------------     Lista expresiones arr
lista_exp_arr:
        lista_exp_arr 
        CORA lista_exp_arr_c CORC           { $$ = $1; $$.push($3); }
    |   CORA lista_exp_arr_c CORC           { $$ = new Array(); $$.push($2); }
    |   HASH ID                             { $$ = new Copiar($2, @1.first_line, @1.first_column); }
    ;
// ------------     Lista expresiones arr c
lista_exp_arr_c:
        lista_exp_arr_c COMA expr           { $$ = $1; $$.push($3); }
    |   expr                                { $$ = new Array(); $$.push($1); }
    ;
// ------------     Lista expresiones
lista_exp:
        lista_exp CORA expr CORC            { $$ = $1; $$.push($3); }
    |   CORA expr CORC                      { $$ = new Array(); $$.push($2); }
    ;
// ------------     Modificacion de arreglos
modif_arr_instr:
        ID lista_exp IGUAL expr             { $$ = new ModificacionArr($1, $2, $4, @1.first_line, @1.last_column); }
    ;
// ------------     Rango
rango:
        expr DOSPUNTOS expr                 { $$ = {"inicio": $1, "fin": $3}; }
    |   RBEGIN DOSPUNTOS REND               { $$ = {"inicio": $1, "fin": $3}; }
    |   expr DOSPUNTOS REND                 { $$ = {"inicio": $1, "fin": $3}; }
    |   RBEGIN DOSPUNTOS expr               { $$ = {"inicio": $1, "fin": $3}; }
    ;
    /*..............     Nativas      ...............*/
// ------------     ARR -> [Push]
nat_push_instr:
        ID PUNTO RPUSH
        PARA expr PARC                      { $$ = new Push(new Identificador($1 , @1.first_line, @1.last_column), $5, @1.first_line, @1.first_column); }
    |   ID PUNTO
        accesoAsignaStruct IGUAL expr       {  
                                                // let first = $1;
                                                // if (first instanceof Identificador)
                                                // {
                                                //     $$ = new Asignacion(first.id ,$3, @1.first_line, @1.last_column);
                                                // }else{
                                                    let accesoPadre = new AccesoStruct(new Identificador($1 , @1.first_line, @1.last_column),$3,@1.first_line, @1.first_column);
                                                    $$ = new AsignaVariable(accesoPadre,$5, @1.first_line, @1.last_column);
                                                    // $$ = $1;
                                                    // $$.instruccion = new Asignacion(null ,$5, @1.first_line, @1.last_column); 
                                                // }
                                            }
    ;

    // |   accesoAsignaStruct IGUAL  expr  {}
accesoAsignaStruct:
        accesoAsignaStruct PUNTO ID     {   $$ = new AccesoStruct($1,new Identificador($3 , @1.first_line, @1.last_column),@1.first_line, @1.first_column); }
    |   ID                              {   $$ = new Identificador($1 , @1.first_line, @1.last_column);}
    ;

// ------------     Matematicas
nat_matematicas:
        RSIN                                { $$ = $1; }
    |   RCOS                                { $$ = $1; }
    |   RTAN                                { $$ = $1; }
    |   RSQRT                               { $$ = $1; }
    |   RLOG                                { $$ = $1; }
    ;
// ------------     Numericas -> [PARSE]
nat_parse:
        tipo PUNTO RPARSE
        PARA expr PARC                      { $$ = new Parse($1, $5, @1.first_line, @1.last_column); }
    ;
// ------------     Numericas -> [toInt - toDouble]
nat_conversion:
        nat_conversion_tipos
        PARA expr PARC                      { $$ = new To($1, $3, @1.first_line, @1.last_column); }
    ;
// Tipos
nat_conversion_tipos:
        RTOINT                              { $$ = $1; }
    |   RTODOUBLE                           { $$ = $1; }
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
    |   CORA lista_exp_arr_c CORC   { $$ = $2; }
    |   llamada                     { $$ = $1; }
    |   ID lista_exp                { $$ = new AccesoArr($1, $2, @1.first_line, @1.first_column); }
    |   rango                       { $$ = new Rango(TIPO.RANGO, [$1.inicio, $1.fin], @1.first_line, @1.last_column); }
    |   ID PUNTO expr               {   if( $3 instanceof Pop || $3 instanceof Length || $3 instanceof CharOfPos ||
                                            $3 instanceof subString || $3 instanceof toUpper || $3 instanceof toLower){
                                            $$ = $3;
                                            let identifica =new Identificador($1 , @1.first_line, @1.last_column);
                                            $$.id = identifica.id;
                                        }else{
                                            $$ = new AccesoStruct(new Identificador($1 , @1.first_line, @1.last_column),$3,@1.first_line, @1.first_column);
                                        }
                                    }
    |   lista_exp_arr               { $$ = new Arreglo(TIPO.ARREGLO, $1, @1.first_line, @1.first_column); }
    |   RPOP PARA PARC              { $$ = new Pop(null, @1.first_line, @1.first_column); }
    |   RLENGTH PARA PARC           { $$ = new Length(null, @1.first_line, @1.first_column); }
    |   RCHAROFPOS PARA expr PARC   { $$ = new CharOfPos(null, $3, @1.first_line, @1.first_column); }
    |   RSUBSTRING PARA expr COMA expr PARC   { $$ = new subString(null, $3, $5, @1.first_line, @1.first_column); }
    |   RTOUPPER PARA PARC          { $$ = new toUpper(null, @1.first_line, @1.first_column); }
    |   RTOLOWER PARA PARC          { $$ = new toLower(null, @1.first_line, @1.first_column); }
    |   nat_matematicas PARA expr PARC { $$ = new Matematicas($1, $3, @1.first_line, @1.first_column); }
    |   nat_parse                   { $$ = $1; }
    |   nat_conversion              { $$ = $1; }
    |   RSTRING_N PARA expr PARC    { $$ = new StringN($3, @1.first_line, @1.first_column); }
    |   RTYPEOF PARA expr PARC      { $$ = new TypeOfN($3, @1.first_line, @1.first_column); }
    ;