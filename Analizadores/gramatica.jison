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
    const {TIPO, OperadorAritmetico, OperadorLogico,OperadorRelacional } = require("../dist/TablaSimbolos/Tipo");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
    const {Logica} = require("../dist/Expresiones/Operaciones/Logicas");
    const {Relacional} = require("../dist/Expresiones/Operaciones/Relacionales");


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
%left 'OR'
%left 'AND'
%left 'NOT'
%left 'IGUALIGUAL' 'DIFERENTE' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE'  'MAYORIGUAL' 
%left 'MAS' 'MENOS'
%left 'MULTI' 'DIV' 'PORCENTAJE'
%right 'UMINUS'
// %nonassoc 'POTENCIA'
// %right 'UNARIO'
%right 'PARA' 'CORA'


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

expr: expr MAS expr             { $$ = new Aritmetica($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); }
    | expr MENOS expr           { $$ = new Aritmetica($1,OperadorAritmetico.RESTA,$3, @1.first_line, @1.first_column, false); }
    | expr MULTI expr           { $$ = new Aritmetica($1,OperadorAritmetico.MULTIPLICACION,$3, @1.first_line, @1.first_column, false); }
    | expr DIV expr             { $$ = new Aritmetica($1,OperadorAritmetico.DIVISION,$3, @1.first_line, @1.first_column, false); }
    | expr PORCENTAJE expr      { $$ = new Aritmetica($1,OperadorAritmetico.MODULO,$3, @1.first_line, @1.first_column, false); }
    | MENOS expr %prec UMINUS   { $$ = new Aritmetica($2,OperadorAritmetico.MENOS_UNARIO,$2, @1.first_line, @1.first_column, true); }
    | PARA expr PARC            { $$ = $2;}
    | expr AND expr             {$$ = new Logica($1, OperadorLogico.AND, $3, $1.first_line, $1.last_column, false);}
    | expr OR expr              {$$ = new Logica($1, OperadorLogico.OR, $3, $1.first_line, $1.last_column, false);}//NEW
    | NOT expr                  {$$ = new Logica($2, OperadorLogico.NOT, null, $1.first_line, $1.last_column, true);}*/
    
    | expr MAYORQUE expr        {$$ = new Relacional($1, OperadorRelacional.MAYORQUE, $3, $1.first_line, $1.last_column, false);}
    | expr MAYORIGUAL expr      {$$ = new Relacional($1, OperadorRelacional.MAYORIGUAL, $3, $1.first_line, $1.last_column, false);}
    | expr MENORIGUAL expr      {$$ = new Relacional($1, OperadorRelacional.MENORIGUAL, $3, $1.first_line, $1.last_column, false);}*/ //new
    | expr MENORQUE expr        {$$ = new Relacional($1, OperadorRelacional.MENORQUE, $3, $1.first_line, $1.last_column, false);}
    | expr IGUALIGUAL expr      {$$ = new Relacional($1, OperadorRelacional.IGUALIGUAL, $3, $1.first_line, $1.last_column, false);}
    | expr DIFERENTE expr       {$$ = new Relacional($1, OperadorRelacional.DIFERENTE, $3, $1.first_line, $1.last_column, false);} */ //new


    | ENTERO                    { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); }
    | DECIMAL                   { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); }
    | CADENA                    { $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); }
    | CHAR                      { $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); }
    | NULL                      { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); }
    | TRUE                      { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); }
    | FALSE                     { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); } 

//     /*| e INTERROGACION e DOSPUNTOS e {$$ = new ternario.default($1, $3, $5, @1.first_line, @1.last_column); } */
//     /*| ID INCRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '+', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}
//     | ID DECRE          {$$ = new aritmetica.default(new identificador.default($1, @1.first_line, @1.last_column), '-', new primitivo.default(1, $1.first_line, $1.last_column), $1.first_line, $1.last_column, false);}*/
    ;