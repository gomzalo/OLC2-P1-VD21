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

"print"                     return 'print';
"null"                      return 'null';
"true"                      return 'true';
"false"                     return 'false';

"+"                         return 'plus';
"-"                         return 'minus';
"*"                         return 'times';
"/"                         return 'div';
"%"                         return 'mod';

"<="                        return 'lte';
">="                        return 'gte';
"<"                         return 'lt';
">"                         return 'gt';
"="                         return 'asig';
"=="                        return 'equal';
"!="                        return 'nequal';

"&&"                        return 'and';
"||"                        return 'or';
"!"                         return 'not';

";"                         return 'semicolon';
"("                         return 'lparen';
")"                         return 'rparen';

"&&"                        return 'and';
"||"                        return 'or';
"!"                         return 'not';

/* Number literals */
(([0-9]+"."[0-9]*)|("."[0-9]+))     return 'DoubleLiteral';
[0-9]+                              return 'IntegerLiteral';

[a-zA-Z_][a-zA-Z0-9_ñÑ]*            return 'identifier';

{stringliteral}                     return 'StringLiteral'
{charliteral}                       return 'CharLiteral'

//error lexico
.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

<<EOF>>                     return 'EOF'

/lex

//SECCION DE IMPORTS
%{
    const {Print} = require("../dist/Instrucciones/Print");
    const {Aritmeticas} = require("../dist/Expresiones/Operaciones/Aritmeticas");
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
%start START

%%


/* Definición de la gramática */
START : RAICES EOF         { $$ = $1; return $$; }
    ;

RAICES:
    RAICES RAIZ           { $1.push($2); $$ = $1;}
	| RAIZ                { $$ = [$1]; } ;

RAIZ:
    PRINT semicolon       { $$ = $1 }
;

PRINT:
    print lparen EXPR rparen            { $$ = new Print($3, @1.first_line, @1.first_column); } ;

EXPR:
    PRIMITIVA                           { $$ = $1 }
    | OP_ARITMETICAS                    { $$ = $1 };


OP_ARITMETICAS:
    EXPR plus EXPR                      { $$ = new Aritmeticas($1,OperadorAritmetico.MAS,$3, @1.first_line, @1.first_column, false); }
    | EXPR minus EXPR                   { $$ = new Aritmeticas($1,OperadorAritmetico.RESTA,$3, @1.first_line, @1.first_column, false); }
    | EXPR times EXPR                   { $$ = new Aritmeticas($1,OperadorAritmetico.MULTIPLICACION,$3, @1.first_line, @1.first_column, false); }
    | EXPR div EXPR                     { $$ = new Aritmeticas($1,OperadorAritmetico.DIVISION,$3, @1.first_line, @1.first_column, false); }
    | EXPR mod EXPR                     { $$ = new Aritmeticas($1,OperadorAritmetico.MODULO,$3, @1.first_line, @1.first_column, false); }
    | minus EXPR %prec UMINUS           { $$ = new Aritmeticas($2,OperadorAritmetico.MENOS_UNARIO,$2, @1.first_line, @1.first_column, true); }
    | lparen EXPR rparen                { $$ = $2 }
;

PRIMITIVA:
    IntegerLiteral                      { $$ = new Primitivo(Number($1), TIPO.ENTERO, @1.first_line, @1.first_column); }
    | DoubleLiteral                     { $$ = new Primitivo(Number($1), TIPO.DECIMAL, @1.first_line, @1.first_column); }
    | StringLiteral                     { $$ = new Primitivo($1, TIPO.CADENA, @1.first_line, @1.first_column); }
    | charliteral                       { $$ = new Primitivo($1, TIPO.CHARACTER, @1.first_line, @1.first_column); }
    | null                              { $$ = new Primitivo(null, TIPO.NULO, @1.first_line, @1.first_column); }
    | true                              { $$ = new Primitivo(true, TIPO.BOOLEANO, @1.first_line, @1.first_column); }
    | false                             { $$ = new Primitivo(false, TIPO.BOOLEANO, @1.first_line, @1.first_column); } ;