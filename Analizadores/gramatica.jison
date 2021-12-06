
/* Definicion lexica */
%lex
%options case-insensitive
%option yylineno

/* Expresiones regulares */
num     [0-9]+
id      [a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*
//--> Cadena
escapechar  [\'\"\\ntr]
escape      \\{escapechar}
aceptacion  [^\"\\]+
cadena      (\"({escape} | {aceptacion})*\")

//--> Caracter
escapechar2  [\\ntr]
escape2      \\{escapechar2}
aceptada2    [^\'\\]
caracter     (\'({escape2}|{aceptada2})\')

%%

/* Comentarios */
"//".*              {/* Ignoro los comentarios simples */}
"/*"((\*+[^/*])|([^*]))*\**"*/"     {/*Ignorar comentarios con multiples lneas*/}  


/*
###################################################
###############     Simbolos       ################
###################################################
*/

"++"                   { console.log("Reconocio : "+ yytext); return 'INCRE'}
"--"                   { console.log("Reconocio : "+ yytext); return 'DECRE'}
"("                    { console.log("Reconocio : "+ yytext); return 'PARA'}
")"                    { console.log("Reconocio : "+ yytext); return 'PARC'}
"["                    { console.log("Reconocio : "+ yytext); return 'CORA'}
"]"                    { console.log("Reconocio : "+ yytext); return 'CORC'}
"."                    { console.log("Reconocio : "+ yytext); return 'PUNTO'}
";"                    { console.log("Reconocio : "+ yytext); return 'PUNTOCOMA'}
","                    { console.log("Reconocio : "+ yytext); return 'COMA'}
"=="                   { console.log("Reconocio : "+ yytext); return 'IGUALIGUAL'}
"="                    { console.log("Reconocio : "+ yytext); return 'IGUAL'}
"?"                    { console.log("Reconocio : "+ yytext); return 'INTERROGACION'}
":"                    { console.log("Reconocio : "+ yytext); return 'DOSPUNTOS'}
"{"                    { console.log("Reconocio : "+ yytext); return 'LLAVA'}
"}"                    { console.log("Reconocio : "+ yytext); return 'LLAVC'}
"%"                    { console.log("Reconocio : "+ yytext); return 'PORCENTAJE'}

/* ..............      Aritmeticos      ...............*/
"+"                   { console.log("Reconocio : "+ yytext); return 'MAS'}
"-"                   { console.log("Reconocio : "+ yytext); return 'MENOS'}
"*"                   { console.log("Reconocio : "+ yytext); return 'MULTI'}
"/"                   { console.log("Reconocio : "+ yytext); return 'DIV'}

/*..............      Relacionales      ...............*/
"<"                   { console.log("Reconocio : "+ yytext); return 'MENORQUE'}
">="                  { console.log("Reconocio : "+ yytext); return 'MAYORIGUAL'}
">"                   { console.log("Reconocio : "+ yytext); return 'MAYORQUE'}
"!="                  { lista.push({F: yylloc.first_line, C: yylloc.first_column,T: 'DIFERENTE', L: yytext}); return 'DIFERENTE'; }
"<="                  { lista.push({F: yylloc.first_line, C: yylloc.first_column,T: 'MENORIGUAL', L: yytext}); return 'MENORIGUAL'; }

/*..............     Logicos      ...............*/
"&&"                  { console.log("Reconocio : "+ yytext); return 'AND'}
"||"                  { lista.push({F: yylloc.first_line, C: yylloc.first_column,T: 'OR', L: yytext}); console.log("Reconocio : "+ yytext); return 'OR'; }
"!"                   { lista.push({F: yylloc.first_line, C: yylloc.first_column,T: 'NEGACION', L: yytext}); console.log("Reconocio : "+ yytext);return 'NEGACION'; }
"^"                   { lista.push({F: yylloc.first_line, C: yylloc.first_column,T: 'POTENCIA', L: yytext}); console.log("Reconocio : "+ yytext); return 'POTENCIA'; }

/* 
###################################################
##############     Reservadas       ###############
###################################################
 */
 //..............      Primitivos      ...............
"int"               { console.log("Reconocio : "+ yytext); return 'INT'}
"double"            { console.log("Reconocio : "+ yytext); return 'DOUBLE'}
"String"            { console.log("Reconocio : "+ yytext); return 'STRING'}
"char"              { console.log("Reconocio : "+ yytext); return 'CHAR'}
"boolean"           { console.log("Reconocio : "+ yytext); return 'BOOLEAN'}
"null"              { console.log("Reconocio : "+ yytext); return 'NULO'}
//..............      Compuestos      ...............
"struct"            { console.log("Reconocio : "+ yytext); return 'STRUCT'}
//..............      Sentencias      ...............
//....    Control
"if"                { console.log("Reconocio : "+ yytext); return 'IF'}
"else"              { console.log("Reconocio : "+ yytext); return 'ELSE'}
"elseif"            { console.log("Reconocio : "+ yytext); return 'ELSEIF'}
"switch"            { console.log("Reconocio : "+ yytext); return 'SWITCH'}
"case"              { console.log("Reconocio : "+ yytext); return 'CASE'}
"default"           { console.log("Reconocio : "+ yytext); return 'DEFAULT'}
//....    Ciclicas
"while"             { console.log("Reconocio : "+ yytext); return 'WHILE'}
"do"                { console.log("Reconocio : "+ yytext); return 'DO'}
"for"               { console.log("Reconocio : "+ yytext); return 'FOR'}
//....    Transferencia
"break"             { console.log("Reconocio : "+ yytext); return 'BREAK'}
"continue"          { console.log("Reconocio : "+ yytext); return 'CONTINUE'}
"return"            { console.log("Reconocio : "+ yytext); return 'RETURN'}
//..............      Funciones      ...............
"print"             { console.log("Reconocio : "+ yytext); return 'PRINT'}
"println"           { console.log("Reconocio : "+ yytext); return 'PRINTLN'}
"void"              { console.log("Reconocio : "+ yytext); return 'VOID'}
//....    Nativas
"sin"               { console.log("Reconocio : "+ yytext); return 'SIN'}
"cos"               { console.log("Reconocio : "+ yytext); return 'COS'}
"tan"               { console.log("Reconocio : "+ yytext); return 'TAN'}
"log10"             { console.log("Reconocio : "+ yytext); return 'LOG10'}
"sqrt"              { console.log("Reconocio : "+ yytext); return 'SQRT'}
"parse"             { console.log("Reconocio : "+ yytext); return 'PARSE'}
"toInt"             { console.log("Reconocio : "+ yytext); return 'TOINT'}
"toDouble"          { console.log("Reconocio : "+ yytext); return 'TODOUBLE'}
"typeof"            { console.log("Reconocio : "+ yytext); return 'TYPEOF'}
"push"              { console.log("Reconocio : "+ yytext); return 'PUSH'}
"pop"               { console.log("Reconocio : "+ yytext); return 'POP'}
"caracterOfPosition" { console.log("Reconocio : "+ yytext); return 'CHAROFPOS'}
"subString"         { console.log("Reconocio : "+ yytext); return 'SUBSTRING'}
"length"            { console.log("Reconocio : "+ yytext); return 'LENGTH'}
"toLowercase"       { console.log("Reconocio : "+ yytext); return 'TOLOWERCASE'}
"toUppercase"       { console.log("Reconocio : "+ yytext); return 'TOUPPERCASE'}

"true"              { console.log("Reconocio : "+ yytext); return 'TRUE'}
"false"             { console.log("Reconocio : "+ yytext); return 'FALSE'}

/* SIMBOLOS ER */
[0-9]+("."[0-9]+)?\b            { console.log("Reconocio : "+ yytext); return 'DECIMAL'}
{num}                           { console.log("Reconocio : "+ yytext); return 'ENTERO'}
{id}                            { console.log("Reconocio : "+ yytext); return 'ID'}
{cadena}                        { console.log("Reconocio : "+ yytext); return 'CADENA'}
{caracter}                      { console.log("Reconocio : "+ yytext); return 'CHAR'}

/* Espacios */
[\s\r\n\t]                  {/* skip whitespace */}


<<EOF>>               return 'EOF'

/* Errores lexicos */
.                     { console.log("Error Lexico "+yytext
                        +" linea "+yylineno
                        +" columna "+(yylloc.last_column+1));

                        new errores.default('Lexico', 'El caracter ' + yytext 
                                + ' no forma parte del lenguaje', 
                                yylineno+1, 
                                yylloc.last_column+1); 
                        }

/lex

/* Area de imports */
%{
    // const aritmetica = require('../Clases/Expresiones/Operaciones/Aritmetica');
    // const logica = require('../Clases/Expresiones/Operaciones/Logica');
    // const relacional = require('../Clases/Expresiones/Operaciones/Relacional');
    // const primitivo = require('../Clases/Expresiones/Primitivo');


    // const ast = require('../Clases/Ast/Ast');
    // const declaracion = require('../Clases/Instrucciones/Declaracion');
    // const asignacion = require('../Clases/Instrucciones/Asignacion');
    // const simbolo = require('../Clases/TablaSimbolos/Simbolos');
    // const tipo = require('../Clases/TablaSimbolos/Tipo');

    // const identificador = require('../Clases/Expresiones/Identificador');
    // const ternario = require('../Clases/Expresiones/Ternario');

    // const Print = require('../Clases/Instrucciones/Print');
    // const Ifs = require('../Clases/Instrucciones/SentenciaControl/Ifs');
    // const While = require('../Clases/Instrucciones/SentenciaCiclica/While');

    // const funcion = require('../Clases/Instrucciones/Funcion');
    // const llamada = require('../Clases/Instrucciones/Llamada');

    // const ejecutar = require('../Clases/Instrucciones/Ejecutar');

    // const detener = require('../Clases/Instrucciones/SentenciaTransferencia/Break');
    // const errores = require('../Clases/Ast/Errores');

    // let lista =[];

%}

/* Precedencia de operadores de mayor a menor */

//AGREGAR DECREMENTO E INCREMENTO

%right 'INTERROGACION'
%left 'OR'
%left 'AND'
%right 'NOT'
%left 'IGUALIGUAL' 'DIFERENTE' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE'  'MAYORIGUAL' 
%left 'MAS' 'MENOS'
%left 'MULTI' 'DIV' 'PORCENTAJE'
%nonassoc 'POTENCIA'
%right 'UNARIO'
%right 'PARA' 'CORA'

%start inicio

%% /* Gramatica */


inicio
    : instrucciones EOF { console.log($1); $$= new ast.default($1);  return $$; }
    ;
// -- INSTRUCCIOENS

instrucciones : instrucciones instruccion   { $$ = $1; $$.push($2); }
            | instruccion                   {$$= new Array(); $$.push($1); }
            ;


instruccion : declaracion   {$$ = $1; }
            | asignacion    { $$ = $1; }
            | print         { $$ = $1; }
            | sent_if       { $$ = $1; }
            | sent_while    { $$ = $1; } 
            | dowhile_statement { $$ = $1; } 
            | funciones     { $$ = $1; }
            | llamada PUNTOCOMA   { $$ = $1; }
            | EJECUTAR llamada PUNTOCOMA { $$ = new ejecutar.default($2, @1.first_line, @1.last_column); }
            | BREAK PUNTOCOMA     { $$ = new detener.default(); }
            | error         { console.log("Error Sintactico" + yytext 
                                    + "linea: " + this._$.first_line 
                                    + "columna: " + this._$.first_column); 
                        
                                new errores.default("Lexico", "No se esperaba el caracter "+ yytext , 
                                                this._$.first_line ,this._$.first_column);            
                            }
            ;

// -- DECLARACIONES

declaracion : tipo lista_simbolos PUNTOCOMA   { $$ = new declaracion.default($1, $2, @1.first_line, @1.last_column); }
            ; 

// -- TIPO
tipo : INT      { $$ = new tipo.default('ENTERO'); }
    | DOUBLE    { $$ = new tipo.default('DOBLE'); }
    | STRING    { $$ = new tipo.default('STRING'); }
    | CHAR      { $$ = new tipo.default('CHAR'); }
    | BOOLEAN   { $$ = new tipo.default('BOOLEAN'); }
    ;

// -- LISTA SIMBOLOS
lista_simbolos : lista_simbolos COMA ID          { $$ = $1; $$.push(new simbolo.default(1,null,$3, null)); }
            | lista_simbolos COMA ID IGUAL e    { $$ = $1; $$.push(new simbolo.default(1,null,$3, $5)); }
            | ID               { $$ = new Array(); $$.push(new simbolo.default(1,null,$1, null)); }
            | ID IGUAL e      { $$ = new Array(); $$.push(new simbolo.default(1,null,$1, $3)); }
            ;

// -- ASIGNACION
asignacion : ID IGUAL e PUNTOCOMA   { $$ = new asignacion.default($1,$3, @1.first_line, @1.last_column); }
            ; 


// -- IF
sent_if : IF PARA e PARC LLAVA instrucciones LLAVC { $$ = new Ifs.default($3, $6, [], @1.first_line, @1.last_column); }
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE LLAVA instrucciones LLAVC { $$ = new Ifs.default($3, $6, $10, @1.first_line, @1.last_column); }
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE sent_if { $$ = new Ifs.default($3, $6, [$9], @1.first_line, @1.last_column); }
        ;

// -- WHILE
sent_while : WHILE PARA e PARC LLAVA instrucciones LLAVC { $$ = new While.default($3, $6, @1.first_line, @1.last_column); }
            ; 

// -- DO WHILE STATMENT
dowhile_statement : DO LLAVEIZQ instrucciones LLAVEDER WHILE PARIZQ expresion PARC                 
                //{ $$ =  new DoWhile.default($3, $7, @1.first_line, @1.last_column); }
                  ;

// -- PRINT
print : PRINT PARA e PARC PUNTOCOMA  {$$ = new Print.default($3, @1.first_line, @1.last_column); }
    ; 

// -- FUNCIONES
funciones : VOID ID PARA PARC LLAVA instrucciones LLAVC     { $$ = new funcion.default(3, new tipo.default('VOID'), $2, [], true, $6, @1.first_line, @1.last_column ); }
        | VOID ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  { $$ = new funcion.default(3, new tipo.default('VOID'), $2, $4, true, $7, @1.first_line, @1.last_column ); }
        ;

// -- LISTA DE PARAMETROS
lista_parametros : lista_parametros COMA tipo ID    { $$ = $1; $$.push(new simbolo.default(6,$3, $4, null)); }
                | tipo ID                           { $$ = new Array(); $$.push(new simbolo.default(6,$1,$2, null)); }
                ;

// -- LLAMADAS A METODOS

llamada : ID PARA PARC              { $$ = new llamada.default($1, [],@1.first_line, @1.last_column ); }
        | ID PARA lista_exp PARC    { $$ = new llamada.default($1, $3 ,@1.first_line, @1.last_column ); }
        ;

// -- LISTA DE EXPRECSIONES
lista_exp : lista_exp COMA e        { $$ = $1; $$.push($3); }
        | e                         { $$ = new Array(); $$.push($1); }
        ;

e :   e MAS e             {$$ = new aritmetica.default($1, '+', $3, $1.first_line, $1.last_column, false);}
    | e MENOS e         {$$ = new aritmetica.default($1, '-', $3, $1.first_line, $1.last_column, false);}
    | e MULTI e         {$$ = new aritmetica.default($1, '*', $3, $1.first_line, $1.last_column, false);}
    | e DIV e           {$$ = new aritmetica.default($1, '/', $3, $1.first_line, $1.last_column, false);}
    | e POTENCIA e           {$$ = new aritmetica.default($1, 'pot', $3, $1.first_line, $1.last_column, false);} //new PORCENTAJE
    | e PORCENTAJE e           {$$ = new aritmetica.default($1, '%', $3, $1.first_line, $1.last_column, false);} //new PORCENTAJE
    | e AND e           {$$ = new logica.default($1, '&&', $3, $1.first_line, $1.last_column, false);}
    | e OR e           {$$ = new logica.default($1, '||', $3, $1.first_line, $1.last_column, false);}//NEW
    | NOT e             {$$ = new logica.default($2, '!', null, $1.first_line, $1.last_column, true);}
    | e MAYORQUE e      {$$ = new relacional.default($1, '>', $3, $1.first_line, $1.last_column, false);}
    | e MAYORIGUAL e      {$$ = new relacional.default($1, '>=', $3, $1.first_line, $1.last_column, false);}
    | e MENORIGUAL e      {$$ = new relacional.default($1, '<=', $3, $1.first_line, $1.last_column, false);} //new
    | e MENORQUE e      {$$ = new relacional.default($1, '<', $3, $1.first_line, $1.last_column, false);}
    | e IGUALIGUAL e      {$$ = new relacional.default($1, '==', $3, $1.first_line, $1.last_column, false);}
    | e DIFERENTE e      {$$ = new relacional.default($1, '!=', $3, $1.first_line, $1.last_column, false);} //new
    | MENOS e %prec UNARIO {$$ = new aritmetica.default($2, 'UNARIO', null, $1.first_line, $1.last_column, true);}
    | PARA e PARC       {$$ = $2;}
    | DECIMAL           {$$ = new primitivo.default(Number(yytext), $1.first_line, $1.last_column);}
    | ENTERO            {$$ = new primitivo.default(Number(yytext), $1.first_line, $1.last_column);}
    | CADENA            {$1 = $1.slice(1, $1.length-1); $$ = new primitivo.default($1, $1.first_line, $1.last_column);}
    | CHAR              {$1 = $1.slice(1, $1.length-1); $$ = new primitivo.default($1, $1.first_line, $1.last_column);}
    | TRUE              {$$ = new primitivo.default(true, $1.first_line, $1.last_column);}
    | FALSE             {$$ = new primitivo.default(false, $1.first_line, $1.last_column);}
    | ID                {$$ = new identificador.default($1, @1.first_line, @1.last_column); }
    | e INTERROGACION e DOSPUNTOS e {$$ = new ternario.default($1, $3, $5, @1.first_line, @1.last_column); } 
    | ID INCRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '+', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}
    | ID DECRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '-', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}
    ;

