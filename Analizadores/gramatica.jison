/*
###################################################
###############  Definicion lexica  ###############
###################################################
*/
%{
    let errores = [];
    let gramatical = [];
%}

%lex

%options case-sensitive
%x STRING_S

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
"length"                    { return 'RLENGTH' };
"pow"                       { return 'RPOW' };
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
/* {stringliteral}                     return 'CADENA'; */
{charliteral}                       return 'CHAR';
["]                           {    string = ""; this.begin("STRING_S"); }
[']                           {    string = ""; this.begin("STRING_S"); }
<STRING_S>\"                   %{    this.begin('INITIAL'); yytext=""; yytext=string;  return 'CADENA'; %}      
<STRING_S>[\']                 %{    this.begin('INITIAL'); yytext=""; yytext=string;  return 'CADENA'; %}      
<STRING_S>[^\n\r\"\\']+        %{    string+=yytext;  %}
<STRING_S>'\t'                 %{    string+="\t";    %}
<STRING_S>'\n'                 %{    string+="\n";    %}
<STRING_S>'\r'                 %{    string+="\r";    %}
<STRING_S>'\\"'                %{    string+='\"';    %}
<STRING_S>'\\'                 %{    string+='\\';    %}
/*..............     Error lexico      ...............*/
.       {
            // console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
            errores.push(new Errores("Lexico", `Error lexico '${yytext}'.`, yylloc.first_line, yylloc.first_column));
        }
/*..............     Espacios      ...............*/
[ \r\t]+                       {/* skip whitespace */}
\n                            {}

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
    const { Pow } = require("../dist/Instrucciones/Metodos/Nativas/Pow");
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
        instrucciones EOF                   {   $$ = new Ast();  $$.instrucciones = $1; $$.Errores = errores.slice();
        // console.log(gramatical);
                                                gramatical.push("start -> instrucciones");
                                                $$.repGramatical = gramatical;
                                                return $$; 
                                                }
    ;
/*
::::::::::::::::::      Instrucciones     ::::::::::::::::::
*/
instrucciones:
        instrucciones instruccion           { $$ = $1;if($2!=null){ $$.push($2);} gramatical.push("instrucciones -> instrucciones instruccion "); } //{ $1.push($2); $$ = $1;}
	|   instruccion                         { $$= new Array(); if($1!=null){$$.push($1); } gramatical.push("instrucciones -> instruccion "); } /*{ $$ = [$1]; } */
    ;
/*..............     Instruccion      ...............*/
instruccion:
        print_instr PUNTOCOMA               { $$ = $1; gramatical.push("instruccion -> print_instr PUNTOCOMA  "); }
    |   println_instr PUNTOCOMA             { $$ = $1; gramatical.push("instruccion -> println_instr PUNTOCOMA ");  }
    |   main_                               { $$ = $1; gramatical.push("instruccion -> main_ ");  }
    |   funciones                           { $$ = $1; gramatical.push("instruccion -> funciones ");  }
    |   declaracion PUNTOCOMA               { $$ = $1; gramatical.push("instruccion -> declaracion PUNTOCOMA ");  }
    |   asignacion  PUNTOCOMA               { $$ = $1; gramatical.push("instruccion -> asignacion  PUNTOCOMA ");  }
    |   if_llav_instr                       { $$ = $1; gramatical.push("instruccion -> if_llav_instr ");  }
    |   if_instr                            { $$ = $1; gramatical.push("instruccion -> if_instr ");  }
    |   switch_instr                        { $$ = $1; gramatical.push("instruccion -> switch_instr ");  }
    |   break_instr PUNTOCOMA               { $$ = $1; gramatical.push("instruccion -> break_instr PUNTOCOMA  ");  }
    |   continue_instr PUNTOCOMA            { $$ = $1; gramatical.push("instruccion -> continue_instr PUNTOCOMA ");  }
    |   return_instr PUNTOCOMA              { $$ = $1; gramatical.push("instruccion -> return_instr PUNTOCOMA ");  }
    |   while_instr                         { $$ = $1; gramatical.push("instruccion -> while_instr ");  }
    |   for_instr                           { $$ = $1; gramatical.push("instruccion -> for_instr ");  }
    |   dowhile_instr PUNTOCOMA             { $$ = $1; gramatical.push("instruccion -> dowhile_instr PUNTOCOMA ");  }
    |   for_in_instr                        { $$ = $1; gramatical.push("instruccion -> for_in_instr ");  }
    |   decl_arr_instr PUNTOCOMA            { $$ = $1; gramatical.push("instruccion -> decl_arr_instr PUNTOCOMA ");  }
    |   llamada PUNTOCOMA                   { $$ = $1; gramatical.push("instruccion -> llamada PUNTOCOMA ");  }
    |   modif_arr_instr PUNTOCOMA           { $$ = $1; gramatical.push("instruccion -> modif_arr_instr PUNTOCOMA ");  }
    |   structs PUNTOCOMA                   { $$ = $1; gramatical.push("instruccion -> structs PUNTOCOMA ");  }
    |   nat_push_instr PUNTOCOMA            { $$ = $1; gramatical.push("instruccion -> nat_push_instr PUNTOCOMA ");  }
    |   nat_pop PUNTOCOMA                   { $$ = $1; gramatical.push("instruccion -> nat_pop PUNTOCOMA ");  }
    // |   expr                                { $$ = $1 } // SOLO DE PRUEBAAAAAAAAAAAAAAAAAAAA
    |   error                               { 
                                                errores.push(new Errores("Sintactico", `Error sintactico: ${yytext}.`, this._$.first_line, this._$.first_column));
                                                $$ =null; 
                                            }
    ;
/*..............     Declaracion      ...............*/
declaracion: 
        tipo  lista_simbolos                { $$ = new Declaracion($1, $2, @1.first_line, @1.last_column); gramatical.push("declaracion -> tipo  lista_simbolos "); }
    ; 
/*..............     STRUCTS      ...............*/
structs:
        RSTRUCT ID 
        LLAVA instrucciones_struct LLAVC    { $$ = new Struct($2,$4,@1.first_line, @1.last_column); gramatical.push("structs -> RSTRUCT ID  LLAVA instrucciones_struct LLAVC ");  }
    // |   RSTRUCT ID LLAVA  LLAVC                 { $$ = new Struct($2,[].first_line, @1.last_column); }
    ;

instrucciones_struct:
        instrucciones_struct 
        COMA attribute                      { $$ = $1; $$.push($3); gramatical.push("instrucciones_struct -> instrucciones_struct COMA attribute "); } //{ $1.push($2); $$ = $1;}
	|   attribute                           { $$= new Array(); $$.push($1); gramatical.push("instrucciones_struct -> attribute "); } /*{ $$ = [$1]; } */
    ;

//    |   declaracion                { $$ = $1 }
attribute:  ID ID                           {$$ = new StructInStruct($1,$2,@1.first_line, @1.last_column); gramatical.push("attribute -> ID ID   "); }

    |   tipo  attributeDeclaStruct          { $$ = new Declaracion($1, [$2], @1.first_line, @1.last_column); gramatical.push("attribute -> tipo  attributeDeclaStruct  "); }
    ;
    
attributeDeclaStruct: 
        ID                                  { $$=new Simbolo($1,null,null,@1.first_line, @1.first_column,null); gramatical.push("attributeDeclaStruct -> ID "); }
    |   ID IGUAL expr                       { $$=new Simbolo($1,null,null,@1.first_line, @1.first_column,$3); gramatical.push("attributeDeclaStruct -> ID IGUAL expr "); }
    ;

// isComaMaybe :           {$$=null;}
//             |  COMA     {$$=null;}
//                 ;
// Lista simbolos
lista_simbolos:
        lista_simbolos COMA ID              { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,null)); gramatical.push("lista_simbolos -> COMA ID "); }
    |   lista_simbolos COMA ID IGUAL expr   { $$ = $1; $$.push(new Simbolo($3,null,null,@1.first_line, @1.first_column,$5)); gramatical.push("lista_simbolos -> COMA ID IGUAL expr "); }
    |   ID                                  { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,null)); gramatical.push("lista_simbolos -> ID "); }
    |   ID IGUAL expr                       { $$ = new Array(); $$.push(new Simbolo($1,null,null,@1.first_line, @1.first_column,$3)); gramatical.push("lista_simbolos -> ID IGUAL expr "); }
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
                                                gramatical.push("asignacion -> ID IGUAL expr ");
                                            }
    |   ID INCRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); gramatical.push("lista_simbolos -> ID INCRE "); }
    |   ID DECRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); gramatical.push("lista_simbolos -> ID DECRE ");}
    |   ID ID IGUAL expr                    { $$ = new DeclararStruct($1,$2,$4,@1.first_line, @1.last_column); gramatical.push("lista_simbolos -> ID ID IGUAL expr "); }
    
    ;

/*..............     Print      ...............*/
print_instr:
        RPRINT PARA lista_parametros PARC   { $$ = new Print($3, @1.first_line, @1.first_column, false); gramatical.push("print_instr -> RPRINT PARA lista_parametros PARC "); }
    ;
println_instr:
        RPRINTLN PARA lista_parametros PARC { $$ = new Print($3, @1.first_line, @1.first_column, true); gramatical.push("print_instr -> RPRINTLN PARA lista_parametros PARC "); }
    ;
/*..............     If con llave     ...............*/
if_llav_instr:
    // If
        RIF PARA expr PARC
        LLAVA instrucciones LLAVC           { $$ = new If($3, $6, null,null, @1.first_line, @1.first_column); gramatical.push("if_llav_instr -> RIF PARA expr PARC LLAVA instrucciones LLAVC  "); }
    // If-else
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE LLAVA instrucciones LLAVC     { $$ = new If($3, $6, $10,null, @1.first_line, @1.first_column); gramatical.push("if_llav_instr -> RIF PARA expr PARC LLAVA instrucciones LLAVC RELSE LLAVA instrucciones LLAVC "); }
    // If-elseif
    |   RIF PARA expr PARC
        LLAVA instrucciones LLAVC
        RELSE if_llav_instr                 { $$ = new If($3, $6,null, $9, @1.first_line, @1.first_column); gramatical.push("if_llav_instr -> RIF PARA expr PARC LLAVA instrucciones LLAVC RELSE if_llav_instr"); }
    ;
/*..............     If sin llave     ...............*/
if_instr:
    // If
        RIF PARA expr PARC
        instruccion                         { $$ = new Ifsinllave($3, $5, [], @1.first_line, @1.first_column); gramatical.push("if_instr -> RIF PARA expr PARC instruccion "); }
    // If-else
    |   RIF PARA expr PARC
        instruccion
        RELSE instruccion                   { $$ = new Ifsinllave($3, $5, $7, @1.first_line, @1.first_column); gramatical.push("if_instr -> RIF PARA expr PARC instruccion  RELSE instruccion "); }
    // If-elseif
    |   RIF PARA expr PARC
        instruccion
        RELSE if_instr                      { $$ = new Ifsinllave($3, $5, [$7], @1.first_line, @1.first_column); gramatical.push("if_instr -> RIF PARA expr PARC instruccion RELSE if_instr  ");  }
    ;
/*..............     Switch     ...............*/
switch_instr:
    // SW-CS
        RSWITCH PARA expr PARC
        LLAVA lista_cases LLAVC             { $$ = new Switch($3, $6, [], @1.first_line, @1.first_column); gramatical.push("switch_instr -> RSWITCH PARA expr PARC LLAVA lista_cases LLAVC "); }
    // SW-DF
    |   RSWITCH PARA expr PARC
        LLAVA RDEFAULT DOSPUNTOS
        instrucciones LLAVC                 { $$ = new Switch($3, [], $8, @1.first_line, @1.first_column); gramatical.push("switch_instr -> RSWITCH PARA expr PARC LLAVA RDEFAULT DOSPUNTOS instrucciones LLAVC "); }
    // SW-CS-DF
    |   RSWITCH PARA expr PARC
        LLAVA lista_cases             
        RDEFAULT DOSPUNTOS
        instrucciones LLAVC                 { $$ = new Switch($3, $6, $9, @1.first_line, @1.first_column); gramatical.push("switch_instr -> RSWITCH PARA expr PARC LLAVA lista_cases RDEFAULT DOSPUNTOS instrucciones LLAVC instrucciones LLAVC  "); }
    ;
// ------------ Lista cases
lista_cases:
        lista_cases case                    { $$ = $1; $$.push($2);  gramatical.push("lista_cases -> lista_cases case  ");  }
    |   case                                { $$ = new Array(); $$.push($1); gramatical.push("lista_cases -> case ");  }
    ;
// ------------ Case
case:
        RCASE expr DOSPUNTOS
        instrucciones                       { $$ = new Case($2, $4, @1.first_line, @1.first_column); gramatical.push("case -> RCASE expr DOSPUNTOS instrucciones "); }
    ;
/*..............     Lista parametros      ...............*/
lista_parametros: 
        lista_parametros COMA expr          { $$ = $1; $$.push($3); gramatical.push("lista_parametros -> lista_parametros COMA expr ");  }
    |   expr                                { $$ = new Array(); $$.push($1); gramatical.push("lista_parametros -> expr ");  }
    ;
/*..............     Transferencia      ...............*/
// ------------     Break
break_instr:
        RBREAK                              { $$ = new Detener(@1.first_line, @1.first_column); gramatical.push("break_instr -> RBREAK "); }
    ;
// ------------      Continue
continue_instr:
        RCONTINUE                           { $$ = new Continuar(@1.first_line, @1.first_column); gramatical.push("continue_instr -> RCONTINUE "); }
    ;
// ------------     Return
return_instr:
        RRETURN expr                        { $$ = new Return($2,@1.first_line, @1.first_column); gramatical.push("return_instr -> RRETURN expr  "); }
    |   RRETURN                             { $$ = new Return(new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column),@1.first_line, @1.first_column); gramatical.push("return_instr -> RRETURN "); }
    ;
/*..............     While      ...............*/
while_instr:
        RWHILE PARA expr PARC
        LLAVA instrucciones LLAVC           { $$ = new While($3, $6, @1.first_line, @1.first_column); gramatical.push("while_instr -> RWHILE PARA expr PARC LLAVA instrucciones LLAVC "); }
    ;
/*..............     Do While      ...............*/
dowhile_instr:
        RDO LLAVA instrucciones LLAVC
        RWHILE PARA expr PARC               { $$ = new DoWhile($7, $3, @1.first_line, @1.last_column); gramatical.push("while_instr -> RWHILE PARA expr PARC LLAVA instrucciones LLAVC "); }
    ;
/*..............     For      ...............*/
for_instr:
        RFOR PARA asignacion PUNTOCOMA
        expr PUNTOCOMA actualizacion PARC
        LLAVA instrucciones LLAVC           { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); gramatical.push("for_instr -> RFOR PARA asignacion PUNTOCOMA expr PUNTOCOMA actualizacion PARC LLAVA instrucciones LLAVC   ");  }
    |   RFOR PARA declaracion PUNTOCOMA
        expr PUNTOCOMA actualizacion PARC
        LLAVA instrucciones LLAVC           { $$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column); gramatical.push("for_instr -> RFOR PARA declaracion PUNTOCOMA expr PUNTOCOMA actualizacion PARC LLAVA instrucciones LLAVC"); }
    ;
// ------------     Actualizacion
actualizacion:
        ID IGUAL expr                       { $$ = new Asignacion($1 ,$3, @1.first_line, @1.last_column);  gramatical.push("actualizacion -> ID IGUAL expr "); }
    |   ID INCRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); 
                                                gramatical.push("actualizacion -> ID INCRE "); }
    |   ID DECRE                            { $$ = new Asignacion($1 ,new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false), @1.first_line, @1.last_column); 
                                                gramatical.push("actualizacion -> ID DECRE ");  }
    ;
/*..............     For in      ...............*/
for_in_instr:
        RFOR ID RIN expr
        LLAVA instrucciones LLAVC           { $$ = new ForIn($2, $4, $6, @1.first_line, @1.first_column); gramatical.push("for_in_instr -> RFOR ID RIN expr LLAVA instrucciones LLAVC   ");  }
    ;
/*..............     Main      ...............*/
main_:
        RVOID RMAIN PARA PARC 
        LLAVA instrucciones LLAVC           { $$ = new Main($6,@1.first_line, @1.first_column); gramatical.push("main_ -> RVOID RMAIN PARA PARC LLAVA instrucciones LLAVC ");  }
    |   RVOID RMAIN PARA PARC 
        LLAVA LLAVC                         { $$ = new Main([],@1.first_line, @1.first_column); gramatical.push("main_ -> RVOID RMAIN PARA PARC  LLAVA LLAVC  "); }
    |   error                               {   errores.push(new Errores("Sintactico", "No hay instrucciones dentro de Main.", this._$.first_line, this._$.first_column));
                                                $$=null;
                                            }
    ;
    
/*..............     Funciones      ...............*/
funciones:
        tipo ID PARA PARC
        LLAVA instrucciones LLAVC           { $$ = new Funcion($2, $1, [], $6, @1.first_line, @1.last_column); gramatical.push("funciones -> tipo ID PARA PARC LLAVA instrucciones LLAVC  ");  }
    |   tipo ID
        PARA lista_parametros_func
        PARC LLAVA instrucciones LLAVC      { $$ = new Funcion($2, $1, $4, $7, @1.first_line, @1.last_column); gramatical.push("funciones ->  tipo ID PARA lista_parametros_func PARC LLAVA instrucciones LLAVC ");  }
    |   ID ID  PARA lista_parametros_func
        PARC LLAVA instrucciones LLAVC      {   $$ = new Funcion($2, TIPO.STRUCT, $4, $7, @1.first_line, @1.last_column);
                                                $$.tipoStruct = $1;
                                                gramatical.push("funciones ->  ID ID  PARA lista_parametros_func PARC LLAVA instrucciones LLAVC "); 
                                            }
    | error                                 {   errores.push(new Errores("Sintactico", `No hay instrucciones en la funcion.`, this._$.first_line, this._$.first_column));
                                                $$=null;
                                            }
    ;
/*..............     Lista parametros      ...............*/
lista_parametros_func: 
        lista_parametros_func
        COMA parametro_func                 { $$ = $1; $$.push($3); gramatical.push("lista_parametros_func -> lista_parametros_func  COMA parametro_func  ");  }
    |   parametro_func                      { $$ = new Array(); $$.push($1); gramatical.push("lista_parametros_func -> parametro_func ");  }
    ;
//------   Parametros Funcion 
parametro_func:
        tipo ID                             { $$ = {"tipo" : $1, "arreglo": false, "id": $2}; gramatical.push("parametro_func -> tipo ID ");  } // EN MEDIO $2 - LISTA DIM
    |   tipo lista_dim ID                   { $$ = {"tipo" : $1, "arreglo": true, "id": $3};  gramatical.push("parametro_func -> tipo lista_dim ID ");  }
    |   ID                                  { $$ = {"tipo" : TIPO.ANY, "arreglo": false, "id": $1}; gramatical.push("parametro_func -> ID ");  }
    |   ID ID                               { $$ = {"tipo" : TIPO.STRUCT, "arreglo": false, "id": $2, "tipoStruct": $1}; gramatical.push("parametro_func -> ID ID ");  }
    ;
/*..............     Llamada      ...............*/
llamada :
        ID PARA PARC                        { $$ = new Llamada($1 , [], @1.first_line, @1.last_column); gramatical.push("llamada -> ID ");  }
    |   ID PARA lista_parametros PARC       { $$ = new Llamada($1 , $3 , @1.first_line, @1.last_column); gramatical.push("llamada -> ID ");  }
    ;
/*..............     Arreglos      ...............*/
// ------------     Declaracion array
decl_arr_instr:
        tipo lista_dim ID
        IGUAL lista_exp_arr                 { $$ = new DeclaracionArr($1, $2, $3, $5, @1.first_line, @1.last_column); gramatical.push("decl_arr_instr -> tipo lista_dim ID IGUAL lista_exp_arr ");  }
    |   ID IGUAL lista_exp_arr              { $$ = new DeclaracionArr(null, null, $1, $3, @1.first_line, @1.last_column); gramatical.push("decl_arr_instr -> ID IGUAL lista_exp_arr ");  }
    |   tipo lista_dim ID                   { $$ = new DeclaracionArr($1, $2, $3, null, @1.first_line, @1.last_column); gramatical.push("decl_arr_instr -> tipo lista_dim ID  ");  }
    ;
// ------------     Dimensiones
lista_dim:
        lista_dim CORA CORC                 { $$ = $1; $$.push($2+1); gramatical.push("lista_dim -> lista_dim CORA CORC    ");  }
    |   CORA CORC                           { $$ = new Array(); $$.push(1); gramatical.push("lista_dim -> CORA CORC ");  }
    ;
// ------------     Lista expresiones arr
lista_exp_arr:
        lista_exp_arr 
        CORA lista_exp_arr_c CORC           { $$ = $1; $$.push($3); gramatical.push("lista_exp_arr -> lista_exp_arr  CORA lista_exp_arr_c CORC ");  }
    |   CORA lista_exp_arr_c CORC           { $$ = new Array(); $$.push($2); gramatical.push("lista_exp_arr -> CORA lista_exp_arr_c CORC ");  }
    |   HASH ID                                            { $$ = new Copiar($2, @1.first_line, @1.first_column); gramatical.push("lista_exp_arr -> HASH ID "); }
    |   CORA CORC                                     { $$ = "[]"; gramatical.push("lista_exp_arr -> CORA CORC"); }
    ;
// ------------     Lista expresiones arr c
lista_exp_arr_c:
        lista_exp_arr_c COMA expr           { $$ = $1; $$.push($3); gramatical.push("lista_exp_arr -> lista_exp_arr_c COMA expr "); }
    |   expr                                { $$ = new Array(); $$.push($1); gramatical.push("lista_exp_arr -> expr "); }
    ;
// ------------     Lista expresiones
lista_exp:
        lista_exp CORA expr CORC            { $$ = $1; $$.push($3); gramatical.push("lista_exp -> lista_exp CORA expr CORC "); }
    |   CORA expr CORC                      { $$ = new Array(); $$.push($2); gramatical.push("lista_exp -> CORA expr CORC  "); }
    ;
// ------------     Modificacion de arreglos
modif_arr_instr:
        ID lista_exp IGUAL expr             { $$ = new ModificacionArr($1, $2, $4, @1.first_line, @1.last_column); gramatical.push("modif_arr_instr -> ID lista_exp IGUAL expr  "); }
    ;
// ------------     Rango
rango:
        expr DOSPUNTOS expr                 { $$ = {"inicio": $1, "fin": $3};  gramatical.push("rango -> expr DOSPUNTOS expr  "); }
    |   RBEGIN DOSPUNTOS REND               { $$ = {"inicio": $1, "fin": $3}; gramatical.push("rango -> RBEGIN DOSPUNTOS REND ");  }
    |   expr DOSPUNTOS REND                 { $$ = {"inicio": $1, "fin": $3}; gramatical.push("rango -> expr DOSPUNTOS REND ");  }
    |   RBEGIN DOSPUNTOS expr               { $$ = {"inicio": $1, "fin": $3}; gramatical.push("rango -> RBEGIN DOSPUNTOS expr ");  }
    ;
    /*..............     Nativas      ...............*/
// ------------     ARR -> [Push]
nat_push_instr:
        ID PUNTO RPUSH
        PARA expr PARC                      { $$ = new Push(new Identificador($1 , @1.first_line, @1.last_column), $5, @1.first_line, @1.first_column); gramatical.push("nat_push_instr -> ID PUNTO RPUSH PARA expr PARC "); }
    |   ID PUNTO
        accesoAsignaStruct IGUAL expr       {  
                                                gramatical.push("nat_push_instr -> ID PUNTO accesoAsignaStruct IGUAL expr ");
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
// ------------     ARR -> [Pop]
nat_pop:
    ID PUNTO RPOP PARA PARC                 { $$ = new Pop($1, @1.first_line, @1.first_column); gramatical.push("nat_pop ->  ID PUNTO RPOP PARA PARC   "); }
    ;
    // |   accesoAsignaStruct IGUAL  expr  {}
accesoAsignaStruct:
        accesoAsignaStruct PUNTO ID         { $$ = new AccesoStruct($1,new Identificador($3 , @1.first_line, @1.last_column),@1.first_line, @1.first_column); gramatical.push("accesoAsignaStruct ->  accesoAsignaStruct PUNTO ID  "); }
    |   ID                                  { $$ = new Identificador($1 , @1.first_line, @1.last_column); gramatical.push("accesoAsignaStruct ->  ID   "); }
    ;

// ------------     Matematicas
nat_matematicas:
        RSIN                                { $$ = $1;  gramatical.push("nat_matematicas ->  RSIN ");}
    |   RCOS                                { $$ = $1;  gramatical.push("nat_matematicas ->  RCOS ");}
    |   RTAN                                { $$ = $1;  gramatical.push("nat_matematicas ->  RTAN "); }
    |   RSQRT                               { $$ = $1;  gramatical.push("nat_matematicas ->  RSQRT ");}
    |   RLOG                                { $$ = $1;  gramatical.push("nat_matematicas ->  RLOG "); }
    ;
// ------------     Numericas -> [PARSE]
nat_parse:
        tipo PUNTO RPARSE
        PARA expr PARC                      { $$ = new Parse($1, $5, @1.first_line, @1.last_column); gramatical.push("nat_parse ->  tipo PUNTO RPARSE PARA expr PARC ");}
    ;
// ------------     Numericas -> [toInt - toDouble]
nat_conversion:
        nat_conversion_tipos
        PARA expr PARC                      { $$ = new To($1, $3, @1.first_line, @1.last_column); gramatical.push("nat_conversion ->  nat_conversion_tipos PARA expr PARC ");}
    ;
// Tipos
nat_conversion_tipos:
        RTOINT                              { $$ = $1; gramatical.push("nat_conversion_tipos ->  RTOINT "); }
    |   RTODOUBLE                           { $$ = $1; gramatical.push("nat_conversion_tipos ->  RTODOUBLE  "); }
    ;
/*..............     Tipos      ...............*/
tipo : 
        RINT                        { $$ = TIPO.ENTERO; gramatical.push("tipo ->  RINT ");}
    |   RDOUBLE                     { $$ = TIPO.DECIMAL; gramatical.push("tipo ->   RDOUBLE ");}
    |   RSTRING                     { $$ = TIPO.CADENA; gramatical.push("tipo -> RSTRING ");}
    |   RCHAR                       { $$ = TIPO.CHARACTER; gramatical.push("tipo ->  RCHAR  ");}
    |   RBOOLEAN                    { $$ = TIPO.BOOLEANO; gramatical.push("tipo -> RBOOLEAN ");}
    |   RVOID                       { $$ = TIPO.VOID; gramatical.push("tipo -> RVOID  ");}
    |   RSTRUCT                     { $$ = TIPO.STRUCT; gramatical.push("tipo -> RSTRUCT   "); }
    ;
/*..............     Expresiones      ...............*/
expr: 
        expr MAS expr               { $$ = new Aritmetica($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); gramatical.push("expr ->  expr MAS expr "); }
    |   expr MENOS expr             { $$ = new Aritmetica($1,OperadorAritmetico.MENOS,$3, @1.first_line, @1.first_column, false); gramatical.push("expr ->  expr MENOS expr "); }
    |   expr MULTI expr             { $$ = new Aritmetica($1,OperadorAritmetico.POR,$3, @1.first_line, @1.first_column, false); gramatical.push("expr -> expr MULTI expr "); }
    |   expr DIV expr               { $$ = new Aritmetica($1,OperadorAritmetico.DIV,$3, @1.first_line, @1.first_column, false); gramatical.push("expr ->  expr DIV expr ");}
    |   expr PORCENTAJE expr        { $$ = new Aritmetica($1,OperadorAritmetico.MOD,$3, @1.first_line, @1.first_column, false); gramatical.push("expr ->  expr PORCENTAJE expr  "); }
    |   expr POTENCIA expr          { $$ = new Aritmetica($1,OperadorAritmetico.POT,$3, @1.first_line, @1.first_column, false); gramatical.push("expr ->  expr POTENCIA expr "); }
    |   expr AMPERSON expr          { $$ = new Aritmetica($1,OperadorAritmetico.AMPERSON,$3, @1.first_line, @1.first_column, false); gramatical.push("expr -> expr AMPERSON expr   "); }
    |   MENOS expr %prec UMINUS     { $$ = new Aritmetica($2,OperadorAritmetico.UMENOS,$2, @1.first_line, @1.first_column, true); gramatical.push("expr ->  MENOS expr %prec UMINUS  "); }
    |   PARA expr PARC              { $$ = $2; gramatical.push("expr ->  PARA expr PARC "); }
    |   expr AND expr               { $$ = new Logica($1, OperadorLogico.AND, $3, $1.first_line, $1.last_column, false); gramatical.push("expr -> expr AND expr    ");}
    |   expr OR expr                { $$ = new Logica($1, OperadorLogico.OR, $3, $1.first_line, $1.last_column, false); gramatical.push("expr -> expr OR expr  "); }
    |   NOT expr                    { $$ = new Logica($2, OperadorLogico.NOT, null, $1.first_line, $1.last_column, true); gramatical.push("expr -> NOT expr  "); }
    |   expr MAYORQUE expr          { $$ = new Relacional($1, OperadorRelacional.MAYORQUE, $3, $1.first_line, $1.last_column, false); gramatical.push("expr ->  expr MAYORQUE expr "); }
    |   expr MAYORIGUAL expr        { $$ = new Relacional($1, OperadorRelacional.MAYORIGUAL, $3, $1.first_line, $1.last_column, false); gramatical.push("expr -> expr MAYORIGUAL expr "); }
    |   expr MENORIGUAL expr        { $$ = new Relacional($1, OperadorRelacional.MENORIGUAL, $3, $1.first_line, $1.last_column, false); gramatical.push("expr -> expr MENORIGUAL expr "); }
    |   expr MENORQUE expr          { $$ = new Relacional($1, OperadorRelacional.MENORQUE, $3, $1.first_line, $1.last_column, false); gramatical.push("expr ->  expr MENORQUE expr  "); }
    |   expr IGUALIGUAL expr        { $$ = new Relacional($1, OperadorRelacional.IGUALIGUAL, $3, $1.first_line, $1.last_column, false); gramatical.push("expr -> expr IGUALIGUAL expr   "); }
    |   expr DIFERENTE expr         { $$ = new Relacional($1, OperadorRelacional.DIFERENTE, $3, $1.first_line, $1.last_column, false); gramatical.push("expr ->  expr DIFERENTE expr "); }
    |   ENTERO                      { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); gramatical.push("expr -> ENTERO  "); }
    |   DECIMAL                     { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); gramatical.push("expr ->  DECIMAL "); }
    |   CADENA                      { /**$1 = $1.slice(1, $1.length-1);*/  $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); gramatical.push("expr ->  CADENA "); }
    |   CHAR                        { $1 = $1.slice(1, $1.length-1); $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); gramatical.push("expr -> CHAR "); }
    |   NULL                        { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); gramatical.push("expr ->  NULL "); }
    |   TRUE                        { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); gramatical.push("expr ->  TRUE "); }
    |   FALSE                       { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); gramatical.push("expr ->  FALSE "); } 
    |   ID                          { $$ = new Identificador($1 , @1.first_line, @1.last_column); gramatical.push("expr -> ID "); }
    |   expr INTERROGACION expr DOSPUNTOS expr {$$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column); gramatical.push("expr -> expr INTERROGACION expr DOSPUNTOS expr "); } 
    |   ID INCRE                    { $$ = new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false); gramatical.push("expr ->  ID INCRE "); }
    |   ID DECRE                    { $$ = new Aritmetica(new Identificador($1, @1.first_line, @1.last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $1.first_line, $1.last_column), $1.first_line, $1.last_column, false); gramatical.push("expr -> ID DECRE "); }
    |   CORA lista_exp_arr_c CORC   { $$ = $2; gramatical.push("expr -> CORA lista_exp_arr_c CORC  ");  }
    |   llamada                     { $$ = $1; gramatical.push("expr -> llamada ");  }
    |   ID lista_exp                { $$ = new AccesoArr($1, $2, @1.first_line, @1.first_column); gramatical.push("expr -> ID lista_exp "); }
    |   rango                       { $$ = new Rango(TIPO.RANGO, [$1.inicio, $1.fin], @1.first_line, @1.last_column); gramatical.push("expr -> rango "); }
    |   ID PUNTO expr               { gramatical.push("expr -> ID PUNTO expr "); 
                                        if( $3 instanceof Length || $3 instanceof CharOfPos
                                            || $3 instanceof subString || $3 instanceof toUpper || $3 instanceof toLower){
                                            $$ = $3;
                                            let identifica =new Identificador($1 , @1.first_line, @1.last_column);
                                            $$.id = identifica.id;
                                        }else{
                                            $$ = new AccesoStruct(new Identificador($1 , @1.first_line, @1.last_column),$3,@1.first_line, @1.first_column);
                                        }
                                    }
    |   lista_exp_arr               { $$ = new Arreglo(TIPO.ARREGLO, $1, @1.first_line, @1.first_column); gramatical.push("expr -> lista_exp_arr "); }
    |   nat_pop                     { $$ = $1; gramatical.push("expr -> nat_pop "); }
    |   RPOW PARA expr COMA expr PARC { $$ = new Pow($3,$5, @1.first_line, @1.first_column); gramatical.push("expr -> RPOW PARA expr COMA expr PARC  "); }
    |   RLENGTH PARA PARC           { $$ = new Length(null, @1.first_line, @1.first_column); gramatical.push("expr ->  RLENGTH PARA PARC  "); }
    |   RCHAROFPOS PARA expr PARC   { $$ = new CharOfPos(null, $3, @1.first_line, @1.first_column); gramatical.push("expr -> RCHAROFPOS PARA expr PARC "); }
    |   RSUBSTRING PARA expr COMA expr PARC { $$ = new subString(null, $3, $5, @1.first_line, @1.first_column); gramatical.push("expr -> RSUBSTRING PARA expr COMA expr PARC  "); }
    // |   expr PUNTO RSUBSTRING PARA expr COMA expr PARC { $$ = new subString($1, $3, $5, @1.first_line, @1.first_column); gramatical.push("expr -> RSUBSTRING PARA expr COMA expr PARC  "); }
    |   expr PUNTO RTOUPPER PARA PARC          { $$ = new toUpper($1, @1.first_line, @1.first_column); gramatical.push("expr -> RTOUPPER PARA PARC  "); }
    |   expr PUNTO RTOLOWER PARA PARC          { $$ = new toLower($1, @1.first_line, @1.first_column); gramatical.push("expr -> RTOLOWER PARA PARC "); }
    |   RTOUPPER PARA PARC   { $$ = new toUpper(null, @1.first_line, @1.first_column); gramatical.push("expr -> RTOUPPER PARA PARC  "); }
    |   RTOLOWER PARA PARC   { $$ = new toLower(null, @1.first_line, @1.first_column); gramatical.push("expr -> RTOLOWER PARA PARC "); }
    |   nat_matematicas PARA expr PARC { $$ = new Matematicas($1, $3, @1.first_line, @1.first_column); gramatical.push("expr -> nat_matematicas PARA expr PARC "); }
    |   nat_parse                   { $$ = $1; gramatical.push("expr -> nat_parse "); }
    |   nat_conversion              { $$ = $1; gramatical.push("expr -> nat_conversion "); }
    |   RSTRING_N PARA expr PARC    { $$ = new StringN($3, @1.first_line, @1.first_column); gramatical.push("expr -> RSTRING_N PARA expr PARC "); }
    |   RTYPEOF PARA expr PARC      { $$ = new TypeOfN($3, @1.first_line, @1.first_column); gramatical.push("expr -> RTYPEOF PARA expr PARC  "); }
    ;