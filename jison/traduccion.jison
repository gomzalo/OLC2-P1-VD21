/**
 * Ejemplo mi primer proyecto con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%lex

%options case-sensitive
%x STRING

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas
"String"			return 'STRING_0';
"string"			return 'STRING_1';
"Number"			return 'NUMBER_0';
"number"			return 'NUMBER_1';
"Boolean"			return 'BOOLEAN_0';
"boolean"			return 'BOOLEAN_1';
"void"				return 'VOID';
";"                 return 'PTCOMA';
"let"				return 'LET';
"const"				return 'CONST';
"type"				return 'TYPE';
"true"				return 'TRUE';
"false"				return 'FALSE';
"null"				return 'NULL';
"Array"				return 'ARRAY';
"console"			return 'CONSOLE';
"log"				return 'LOG';
"break"				return 'BREAK';
"continue"			return 'CONTINUE';
"if"				return 'IF';
"else"				return 'ELSE';
"switch"			return 'SWITCH';
"case"				return 'CASE';
"default"			return 'DEFAULT';
"while"				return 'WHILE';
"do"				return 'DO';
"for"				return 'FOR';
"return"			return 'RETURN';
"function"			return 'FUNCTION';
"graficar_ts"		return 'GRAFICAR_TS';
"length"			return 'LENGTH';
"push"				return 'PUSH';
"pop"				return 'POP';

","					return 'COMA';
":"					return 'DOSPUNTOS';
"{"					return 'LLAIZQ';
"}"					return 'LLADER';
"("                 return 'PARIZQ';
")"                 return 'PARDER';
"["                 return 'CORIZQ';
"]"                 return 'CORDER';
"?"					return 'S_TERNARIO';
"."					return 'PUNTO';

"++"				return 'INCREMENTO';
"+"                 return 'MAS';
"--"				return 'DECREMENTO';
"-"                 return 'MENOS';
'**'				return 'EXPONENCIACION';
"*"                 return 'POR';
"/"                 return 'DIVIDIDO';
"%"					return 'MOD';
"||"				return 'OR';
"&&"				return 'AND';
"=="				return 'IGUALDAD';
"="					return 'S_IGUAL';
"!="				return 'DESIGUALDAD';
"!"					return 'NOT';
'<='				return 'MENOR_IGUAL';
"<"					return 'MENOR';
'>='				return 'MAYOR_IGUAL';
'>'					return 'MAYOR';

/* Espacios en blanco */
[ \r\t]+            {}
\n                  {}

// Se usa para la traducción (\"[^\"]*\"|\'[^\']*\'|[`][^\`]*[`]) { return 'cadena'; }
[0-9]+("."[0-9]+)?\b    			return 'DECIMAL';
[0-9]+\b                			return 'ENTERO';
(_?[a-zA-Z])[a-zA-Z0-9_]*  	     	return 'id';
["]                           {    string = ""; this.begin("STRING"); }
[']                           {    string = ""; this.begin("STRING"); }
<STRING>\"                   %{    this.begin('INITIAL'); yytext=""; yytext=string;  return 'cadena'; %}      
<STRING>[\']                 %{    this.begin('INITIAL'); yytext=""; yytext=string;  return 'cadena'; %}      
<STRING>[^\n\r\"\\']+        %{    string+=yytext;  %}
<STRING>'\t'                 %{    string+="\t";    %}
<STRING>'\n'                 %{    string+="\n";    %}
<STRING>'\r'                 %{    string+="\r";    %}
<STRING>'\\"'                %{    string+='\"';    %}
<STRING>'\\'                 %{    string+='\\';    %}

<<EOF>>                 return 'EOF';

.                       {
							let listaError = Lista_Error.getInstancia();
							listaError.push(new Nodo_Error(TipoError.ERROR_LEXICO,'Este es un error léxico: ' + yytext +'.', yylloc.first_line,yylloc.first_column));
							console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
						}
/lex

%{
	let raiz;
	//let arbol = new Arbol();
	//let exp = new Expresion("E",null,-1,-1);
	//console.log(arbol);
	let string = "";
	
	//const nodo = require('./AST/Nodo');
	//const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	//const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	//const TIPO_DATO			= require('./tabla_simbolos').TIPO_DATO; //para jalar el tipo de dato
	//const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
%}

/* Asociación de operadores y precedencia */
%right 'S_IGUAL'										//1
%right 'S_TERNARIO' 'DOSPUNTOS'							//2
%left 'OR' 												//3
%left 'AND'												//4
%left 'IGUALDAD' 'DESIGUALDAD'							//5
%nonassoc 'MAYOR' 'MENOR' 'MAYOR_IGUAL' 'MENOR_IGUAL' 	//6
%left 'MAS' 'MENOS'										//7
%left 'POR' 'DIVIDIDO' 'MOD'							//8
%left 'EXPONENCIACION'									//9
%right 'UMENOS' 'NOT'									//10
%nonassoc 'INCREMENTO' 'DECREMENTO'						//11
%right 'CORIZQ' 'CORDER' PARIZQ' 'PARDER'				//12
//%nonassoc '								//0
//
//%left 'CALLPARIZQ' 'CALLPARDER'							//2
//3
//%nonassoc 'INCREMENTO' 'DECREMENTO'						//4
//
//

//%left 8
//
//%left 'COMA'											//14

%start ini

%% /* Definición de la gramática */

/*ini	: gramatica_proyecto EOF { }
;*/

ini : gramatica_proyecto EOF { raiz = $$; return raiz; }
;


gramatica_proyecto 	: gramatica_proyecto definicion_types PTCOMA 		{ 
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto declaracion_variables PTCOMA	{ 
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto llamadaMetodo PTCOMA			{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto decremento PTCOMA				{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto incremento PTCOMA				{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto sentencia_if					{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto sentencia_switch				{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto asignacion_var PTCOMA			{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto sentencia_while				{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto sentencia_do_while				{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto sentencia_for					{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| gramatica_proyecto declaracion_funcion			{
																			$$ = $1; 
																			$$.getHijos().push($2);
																		}
					| declaracion_variables PTCOMA						{ 
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}					
					| definicion_types PTCOMA							{ 
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| llamadaMetodo PTCOMA								{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| decremento PTCOMA									{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| incremento PTCOMA									{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| sentencia_if										{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| sentencia_switch									{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| asignacion_var									{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}													
					| sentencia_while									{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| sentencia_do_while								{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| sentencia_for										{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| declaracion_funcion								{
																			$$ = new S("S",null,-1,-1);
																			$$.getHijos().push($1);
																		}
					| E
					| error PTCOMA{
									Lista_Error.getInstancia().push(new Nodo_Error(TipoError.ERROR_SINTACTICO,'No se esperaba el símbolo: ' + yytext +'.',@1.first_line,@1.first_column));
					}
					| error LLADER
					{
						Lista_Error.getInstancia().push(new Nodo_Error(TipoError.ERROR_SINTACTICO,'No se esperaba el símbolo: ' + yytext +'.',@1.first_line,@1.first_column));
					}
;

/* TYPES */
definicion_types : TYPE id S_IGUAL bloque_type	{
													$$ = new Declaracion_Types();
													let identificadorType = new Identificador("Identificador",$2,@2.first_line,@2.first_column);
													$$.getHijos().push(identificadorType);
													$$.getHijos().push($4);
												}
;

bloque_type	: LLAIZQ cuerpo_bloque_type LLADER	{ $$ = $2; }
;

cuerpo_bloque_type : cuerpo_bloque_type opcion_separacion sentencia_type	{
																				$$ = $1;
																				$$.getHijos().push($3);
																			}
				   | sentencia_type							{
					   											$$ = new Bloque_Type();
																$$.getHijos().push($1);
				   											}
;

opcion_separacion: COMA
				| PTCOMA
;

sentencia_type : id DOSPUNTOS tipo_dato {
											$$ = new Sentencia_Type();
											let identificadoSentenciaType = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
											$$.getHijos().push(identificadoSentenciaType);
											$$.getHijos().push($3);
										}
;

tipo_dato : STRING_0	{ $$ = new Tipo_Dato("TIPO_DATO","String",@1.first_line,@1.first_column); }
	| STRING_1			{ $$ = new Tipo_Dato("TIPO_DATO","String",@1.first_line,@1.first_column); }
	| NUMBER_0			{ $$ = new Tipo_Dato("TIPO_DATO","Number",@1.first_line,@1.first_column); }
	| NUMBER_1			{ $$ = new Tipo_Dato("TIPO_DATO","Number",@1.first_line,@1.first_column); }
	| BOOLEAN_0			{ $$ = new Tipo_Dato("TIPO_DATO","Boolean",@1.first_line,@1.first_column); }
	| BOOLEAN_1			{ $$ = new Tipo_Dato("TIPO_DATO","Boolean",@1.first_line,@1.first_column); }
	| VOID				{ $$ = new Tipo_Dato("TIPO_DATO","Void",@1.first_line,@1.first_column); }
	| id				{ $$ = new Identificador("Identificador",$1,@1.first_line,@1.first_column); }
	| STRING_0 dim		{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1);
							let nodoTipoDato1 = new Tipo_Dato("TIPO_DATO","String",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato1);
							$$.getHijos().push($2);
						}
	| STRING_1 dim		{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1); 
							let nodoTipoDato2 = new Tipo_Dato("TIPO_DATO","String",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato2);
							$$.getHijos().push($2);
						}
	| NUMBER_0 dim		{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1); 
							let nodoTipoDato3 = new Tipo_Dato("TIPO_DATO","Number",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato3);
							$$.getHijos().push($2);
						}
	| NUMBER_1 dim		{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1); 
							let nodoTipoDato4 = new Tipo_Dato("TIPO_DATO","Number",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato4);
							$$.getHijos().push($2);
						}
	| BOOLEAN_0 dim 	{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1); 
							let nodoTipoDato5 = new Tipo_Dato("TIPO_DATO","Boolean",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato5);
							$$.getHijos().push($2);
						}
	| BOOLEAN_1 dim		{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1);
							let nodoTipoDato6 = new Tipo_Dato("TIPO_DATO","Boolean",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato6);
							$$.getHijos().push($2);
						}
	| VOID dim			{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1);
							let nodoTipoDato7 = new Tipo_Dato("TIPO_DATO","Void",@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato7);
							$$.getHijos().push($2);
						}
	| id dim			{ 
							$$ = new Tipo_Arreglo("ARREGLO",null,-1,-1);
							let nodoTipoDato8 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
							$$.getHijos().push(nodoTipoDato8);
							$$.getHijos().push($2);
						}
	| ARRAY MENOR tipo_dato MAYOR 	{
										$$ = new Tipo_Arreglo("ARRAY",null,-1,-1);
										$$.getHijos().push($3);
									}
	| bloque_type		{  }
;

dim : dim CORIZQ CORDER {
							let nodo = new Tipo_Arreglo("[]",null,-1,-1);
							$$ = $1;
							$$.getHijos().push(nodo);
						}
	| CORIZQ CORDER		{
							$$ = new Tipo_Arreglo("DIMENSIONES",null,-1,-1); 
							let nodo1 = new Tipo_Arreglo("[]",null,-1,-1);
							$$.getHijos().push(nodo1);
						}
;

/* DECLARACIÓN DE VARIABLES*/
declaracion_variables : tipo_variable lista_id 	{
													$$ = new DECLARACION_VARIABLES("DECLARACION_VARIABLE",null,-1,-1);
													$$.getHijos().push($1);
													$$.getHijos().push($2);
												}
;

tipo_variable : LET { $$ = new Tipo_Variable("LET",null,@1.first_line,@1.first_column); }
			| CONST	{ $$ = new Tipo_Variable("CONST",null,@1.first_line,@1.first_column); }
;

lista_id : lista_id COMA opcion_id	{ 
										$$ = $1;
										$$.getHijos().push($3);
									}
		| opcion_id					{ 
										$$ = new Lista_Variables("LISTA_VARIABLES");
										$$.getHijos().push($1);
		 							}
;

opcion_id : id								{ 
												$$ = new Variable();
												let identificador = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
												$$.getHijos().push(identificador);
											}
		| id DOSPUNTOS tipo_dato			{
												$$ = new Variable();
												let identificador1 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
												$$.getHijos().push(identificador1);
												$$.getHijos().push($3);
											}
		| id asignacion_variable								{
																	$$ = new Variable();
																	let identificador2 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
																	$$.getHijos().push(identificador2);
																	$$.getHijos().push($2);

																}
		| id DOSPUNTOS tipo_dato asignacion_variable			{
																	$$ = new Variable();
																	let identificador3 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
																	$$.getHijos().push(identificador3);
																	$$.getHijos().push($3);
																	$$.getHijos().push($4);
																}
;

asignacion_variable : S_IGUAL E { $$ = $2; }
;

E : E MAS E					{
								$$ = new Expresion("E",null,-1,-1); 
								$$.getHijos().push($1);
								let operador = new Operador("+",null,@2.first_line,@2.first_column);
								$$.getHijos().push(operador);
								$$.getHijos().push($3);
							}
	| E MENOS E				{
								$$ = new Expresion("E",null,-1,-1); 
								$$.getHijos().push($1);
								let operador1 = new Operador("-",null,@2.first_line,@2.first_column);
								$$.getHijos().push(operador1);
								$$.getHijos().push($3);
							}
	| E POR E				{
								$$ = new Expresion("E",null,-1,-1); 
								$$.getHijos().push($1);
								let operador2 = new Operador("*",null,@2.first_line,@2.first_column);
								$$.getHijos().push(operador2);
								$$.getHijos().push($3);
							}
	| E DIVIDIDO E			{ 
								$$ = new Expresion("E",null,-1,-1); 
								$$.getHijos().push($1);
								let operador3 = new Operador("/",null,@2.first_line,@2.first_column);
								$$.getHijos().push(operador3);
								$$.getHijos().push($3);
							}
	| MENOS E %prec UMENOS			{ 
										$$ = new Expresion("E",null,-1,-1); 
										let negativo = new Numero_Negativo("Numero Negativo",null,@1.first_line,@1.first_column);
										negativo.getHijos().push($2);
										$$.getHijos().push(negativo);
									}
	| E MOD E						{
										$$ = new Expresion("E",null,-1,-1); 
										$$.getHijos().push($1);
										let operador4 = new Operador("%",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador4);
										$$.getHijos().push($3);
									}
	| E EXPONENCIACION E			{
										$$ = new Expresion("E",null,-1,-1); 
										$$.getHijos().push($1);
										let operador5 = new Operador("**",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador5);
										$$.getHijos().push($3);
									}
	| E IGUALDAD E				{
									$$ = new Expresion("E",null,-1,-1); 
									$$.getHijos().push($1);
									let operador6 = new Operador("==",null,@2.first_line,@2.first_column);
									$$.getHijos().push(operador6);
									$$.getHijos().push($3);
								}
	| E DESIGUALDAD E			{ 
									$$ = new Expresion("E",null,-1,-1); 
									$$.getHijos().push($1);
									let operador7 = new Operador("!=",null,@2.first_line,@2.first_column);
									$$.getHijos().push(operador7);
									$$.getHijos().push($3);
								}
	| E MAYOR E						{ 
										$$ = new Expresion("E",null,-1,-1); 
										$$.getHijos().push($1);
										let operador8 = new Operador(">",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador8);
										$$.getHijos().push($3);
									}
	| E MENOR E						{ 
										$$ = new Expresion("E",null,-1,-1);
										$$.getHijos().push($1);
										let operador9 = new Operador("<",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador9);
										$$.getHijos().push($3);
									}
	| E MAYOR_IGUAL E				{ 
										$$ = new Expresion("E",null,-1,-1); 
										$$.getHijos().push($1);
										let operador10 = new Operador(">=",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador10);
										$$.getHijos().push($3);
									}
	| E MENOR_IGUAL E				{
										$$ = new Expresion("E",null,-1,-1); 
										$$.getHijos().push($1);
										let operador11 = new Operador("<=",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador11);
										$$.getHijos().push($3);
									}
	| E S_TERNARIO E DOSPUNTOS E 	{ 
										$$ = new Expresion("E",null,-1,-1); 
										$$.getHijos().push($1);
										let operador12 = new Operador("?",null,@2.first_line,@2.first_column);
										$$.getHijos().push(operador12);
										$$.getHijos().push($3);
										$$.getHijos().push($5);
									}
	| E OR E				{ 
								$$ = new Expresion("E",null,-1,-1); 
								let operador13 = new Operador("||",null,@2.first_line,@2.first_column);
								$$.getHijos().push($1);
								$$.getHijos().push(operador13);
								$$.getHijos().push($3);
							}
	| E AND E				{ 
								$$ = new Expresion("E",null,-1,-1); 
								let operador14 = new Operador("&&",null,@2.first_line,@2.first_column);
								$$.getHijos().push($1);
								$$.getHijos().push(operador14);
								$$.getHijos().push($3);
							}
	| NOT E					{ 
								$$ = new Expresion("E",null,-1,-1); 
								let not = new Operador("!",null,@1.first_line,@1.first_column);
								$$.getHijos().push(not);
								$$.getHijos().push($2);
							}
	| incremento			{
								$$ = new Expresion("E",null,-1,-1);
								$$.getHijos().push($1);
							}
	| decremento 			{

								$$ = new Expresion("E",null,-1,-1);
								$$.getHijos().push($1);
							}
	| PARIZQ E PARDER { $$ = $2; }
	| DECIMAL	{ 
					$$ = new Expresion("E",null,-1,-1); 
					let decimal = new Dato_Primitivo("Number",Number($1),@1.first_line,@1.first_column);
					$$.getHijos().push(decimal);
				}
	| ENTERO	{ 
					$$ = new Expresion("E",null,-1,-1);
					let entero = new Dato_Primitivo("Number",Number($1),@1.first_line,@1.first_column);
					$$.getHijos().push(entero);
				}
	| TRUE		{ 
					$$ = new Expresion("E",null,-1,-1); 
					let booleano1 = new Dato_Primitivo("Boolean",Boolean(1),@1.first_line,@1.first_column);
					$$.getHijos().push(booleano1);
				}
	| FALSE		{ 
					$$ = new Expresion("E",null,-1,-1); 
					let booleano2 = new Dato_Primitivo("Boolean",Boolean(0),@1.first_line,@1.first_column);
					$$.getHijos().push(booleano2);
				}
	| NULL		{ 
					$$ = new Expresion("E",null,-1,-1);  
					let typeNull = new Dato_Primitivo("Null",null,@1.first_line,@1.first_column);
					$$.getHijos().push(typeNull);
				}
	| id		{ 
					$$ = new Expresion("E",null,-1,-1); 
					let identificador4 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
					$$.getHijos().push(identificador4);
				}
	| creacion_type 	{ 
							$$ = new Expresion("E",null,-1,-1);
							$$.getHijos().push($1);
						}
	| llamadaMetodo 	{ 
							$$ = new Expresion("E",null,-1,-1); 
							$$.getHijos().push($1);
						}
	| VOID 		{
					$$ = new Expresion("E",null,-1,-1);
					let cad = new Dato_Primitivo("Void",$1,@1.first_line,@1.first_column);
					$$.getHijos().push(cad);
				}
	| cadena 	{		
					$$ = new Expresion("E",null,-1,-1);
					let cad1 = new Dato_Primitivo("String",$1,@1.first_line,@1.first_column);
					$$.getHijos().push(cad1);
				}
	| creacion_arreglo	{
							$$ = new Expresion("E",null,-1,-1);
							$$.getHijos().push($1);
						}
	| acceso_arreglo	{  
							$$ = new Expresion("E",null,-1,-1);
							$$.getHijos().push($1);
						}
	| id PUNTO LENGTH 	{
							$$ = new Expresion("E",null,-1,-1);
							let tamArreglo = new Length();
							let varId = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
							tamArreglo.getHijos().push(varId);
							$$.getHijos().push(tamArreglo);
						}

;

creacion_type : LLAIZQ cuerpo_creacion_type LLADER { $$ = $2; }
;

cuerpo_creacion_type : cuerpo_creacion_type opcion_separacion declaracion_type	{
																					$$ = $1;
																					$$.getHijos().push($3);
																				}
					| declaracion_type 								{
																		$$ = new Type();
																		$$.getHijos().push($1);
																	}
;

declaracion_type : id DOSPUNTOS E	{
										$$ = new Atributo_Type();
										let identificadorDeclaracionType = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
										$$.getHijos().push(identificadorDeclaracionType);
										$$.getHijos().push($3);
									}
;

creacion_arreglo : CORIZQ CORDER { $$ = new Cuerpo_Arreglo("CUERPO_ARRAY"); }
				| CORIZQ cuerpo_arreglo CORDER { $$ = $2; }
;




cuerpo_arreglo: cuerpo_arreglo COMA E	{

											if( $3.getHijos()[0].getNombreNodo() == "CUERPO_ARRAY" ){
												$$.getHijos().push($3.getHijos()[0]);
											}
											else{
												$$.getHijos().push($3); 
											}

										}
				| E						{ 
											$$ = new Cuerpo_Arreglo("CUERPO_ARRAY"); 

											if( $1.getHijos()[0].getNombreNodo() == "CUERPO_ARRAY" ){
												$$.getHijos().push($1.getHijos()[0]);
											}
											else{
												$$.getHijos().push($1); 
											}
											
										}
;

llamadaMetodo : id PARIZQ PARDER						{
															$$ = new Llamada_Metodo(-1,-1);
															let id = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
															let listaParametros = new Lista_Parametros();
															$$.getHijos().push(id);
															$$.getHijos().push(listaParametros);
														}
			| id PARIZQ cuerpo_parametro PARDER			{
															$$ = new Llamada_Metodo(-1,-1);
															let id1 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
															$$.getHijos().push(id1);
															$$.getHijos().push($3);
														}
			| CONSOLE PUNTO LOG PARIZQ cuerpo_parametro PARDER 	{
																	$$ = new LOG(@1.first_line,@1.first_column);
																	$$.getHijos().push($5);
																}
			| GRAFICAR_TS PARIZQ PARDER							{
																	$$ = new GRAFICAR_TS(@1.first_line,@1.first_column);
																}
;

cuerpo_parametro : cuerpo_parametro COMA E			{
														$$ = $1;
														$$.getHijos().push($3);
													}
				| E									{
														$$ = new Lista_Parametros();
														$$.getHijos().push($1);
													}
;

decremento : id DECREMENTO   { 
								$$ = new Decremento("Decremento",null,@2.first_line,@2.first_column);
								let identificador5 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
								$$.getHijos().push(identificador5);
							}
			| acceso_arreglo DECREMENTO	{
											$$ = new Decremento("Decremento",null,@2.first_line,@2.first_column);
											$$.getHijos().push($1);
										}
;

incremento : id INCREMENTO	{								
								$$ = new Incremento("Incremento",null,@2.first_line,@2.first_column);
								let identificador6 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
								$$.getHijos().push(identificador6);
							}
			| acceso_arreglo INCREMENTO	{
											$$ = new Incremento("Incremento",null,@2.first_line,@2.first_column);
											$$.getHijos().push($1);
										}
;

acceso_arreglo: id dim2 { 
							$$ = new Acceso_Arreglos();
							let identificador7 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
							$$.getHijos().push(identificador7);
							$$.getHijos().push($2);
						}
;

dim2: dim2 CORIZQ E CORDER	{  
								$$ = $1;
								$$.getHijos().push($3);
							}
	| CORIZQ E CORDER		{ 
								$$ = new Tipo_Arreglo("DIMENSIONES",null,-1,-1); 
								$$.getHijos().push($2);
							}
;

sentencia_if : IF PARIZQ E PARDER bloque	{
												$$ = new Sentencia_If(@1.first_line,@1.first_column);
												$$.getHijos().push($3);
												$$.getHijos().push($5);
											}
			| IF PARIZQ E PARDER bloque else_if	{
													$$ = new Sentencia_If(@1.first_line,@1.first_column);
													$$.getHijos().push($3);
													$$.getHijos().push($5);
													$$.getHijos().push($6);
												}
;

else_if : s_else									{ $$ = $1; }
		| ELSE IF PARIZQ E PARDER bloque			{
														$$ = new Sentencia_Else_If(@1.first_line,@1.first_column);
														$$.getHijos().push($4);
														$$.getHijos().push($6);
													}
		| ELSE IF PARIZQ E PARDER bloque else_if	{
														$$ = new Sentencia_Else_If(@1.first_line,@1.first_column);
														$$.getHijos().push($4);
														$$.getHijos().push($6);
														$$.getHijos().push($7);
													}
;

s_else: ELSE bloque	{
						$$ = new Sentencia_Else(@1.first_line,@1.first_column);
						$$.getHijos().push($2);
					}
;

sentencia_switch: SWITCH PARIZQ E PARDER LLAIZQ LLADER				{
																		$$ = new Sentencia_Switch(@1.first_line,@1.first_column);
																		$$.getHijos().push($3);
																	}
				| SWITCH PARIZQ E PARDER LLAIZQ lista_case LLADER	{
																		$$ = new Sentencia_Switch(@1.first_line,@1.first_column);
																		$$.getHijos().push($3);
																		$$.getHijos().push($6);
																	}
				| SWITCH PARIZQ E PARDER LLAIZQ lista_case sentencia_default LLADER	{
																						$$ = new Sentencia_Switch(@1.first_line,@1.first_column);
																						$$.getHijos().push($3);
																						$$.getHijos().push($6);
																						$$.getHijos().push($7);
																					}
				| SWITCH PARIZQ E PARDER LLAIZQ sentencia_default LLADER			{
																						$$ = new Sentencia_Switch(@1.first_line,@1.first_column);
																						$$.getHijos().push($3);
																						$$.getHijos().push($6);
																					}
;

lista_case : lista_case sentencia_case	{
											$$ = $1;
											$$.getHijos().push($2);
										}
			| sentencia_case			{
											$$ = new Lista_Case();
											$$.getHijos().push($1);
										}
;

sentencia_case : CASE E DOSPUNTOS cuerpo_bloque	{
													$$ = new Case(@1.first_line,@1.first_column);
													$$.getHijos().push($2);
													$$.getHijos().push($4);
												}
				| CASE E DOSPUNTOS bloque		{
													$$ = new Case(@1.first_line,@1.first_column);
													$$.getHijos().push($2);
													$$.getHijos().push($4);
												}
				| CASE E DOSPUNTOS				{
													$$ = new Case(@1.first_line,@1.first_column);
													let bloqueSentencias = new Bloque_Sentencia();
													$$.getHijos().push($2);
													$$.getHijos().push(bloqueSentencias);
												}
;

sentencia_default : DEFAULT DOSPUNTOS cuerpo_bloque	{
														$$ = new Default(@1.first_line,@1.first_column);
														$$.getHijos().push($3);
													}
				| DEFAULT DOSPUNTOS bloque			{
														$$ = new Default(@1.first_line,@1.first_column);
														$$.getHijos().push($3);
													}
				| DEFAULT DOSPUNTOS					{
														$$ = new Default(@1.first_line,@1.first_column);
														let bloqueSentencias1 = new Bloque_Sentencia();
														$$.getHijos().push(bloqueSentencias1);
													}
;

sentencia_return : RETURN	{ 
								$$ = new Sentencia_Return(@1.first_line,@1.first_column); 
								let nodoVoid = new Dato_Primitivo("Void",undefined,@1.first_line,@1.first_column);
								$$.getHijos().push(nodoVoid);
							}
				| RETURN E	{
								$$ = new Sentencia_Return(@1.first_line,@1.first_column);
								$$.getHijos().push($2);
							}
;

sentencia_while : WHILE PARIZQ E PARDER bloque 	{
													$$ = new Sentencia_While(@1.first_line,@1.first_column);
													$$.getHijos().push($3);
													$$.getHijos().push($5);
												}
;

sentencia_do_while : DO bloque WHILE PARIZQ E PARDER PTCOMA	{
																$$ = new Sentencia_Do_While(@3.first_line,@3.first_column);
																$$.getHijos().push($2);
																$$.getHijos().push($5);
															}
;

sentencia_for : FOR PARIZQ inicializacion PTCOMA E PTCOMA actualizacion PARDER bloque 	{   
																							$$ = new Sentencia_For_Indices(@1.first_line,@1.first_column);
																							$$.getHijos().push($3);
																							$$.getHijos().push($5);
																							$$.getHijos().push($7);
																							$$.getHijos().push($9);
																						}
			| FOR PARIZQ tipo_variable id OF E PARDER bloque {
																	$$ = new Sentencia_For_Of(@1.first_line,@1.first_column);
																	let idFor = new Identificador("Identificador",$4,@4.first_line,@4.first_column);
																	$$.getHijos().push($3);
																	$$.getHijos().push(idFor);
																	$$.getHijos().push($6);
																	$$.getHijos().push($8);
			}
			| FOR PARIZQ tipo_variable id IN E PARDER bloque {
																	$$ = new Sentencia_For_In(@1.first_line,@1.first_column);
																	let idFor1 = new Identificador("Identificador",$4,@4.first_line,@4.first_column);
																	$$.getHijos().push($3);
																	$$.getHijos().push(idFor1);
																	$$.getHijos().push($6);
																	$$.getHijos().push($8);
			}
;

inicializacion : declaracion_variables	{ $$ = $1; }
				| asignacion_var		{ $$ = $1; }
;

actualizacion : incremento			{ $$ = $1; }
				| decremento		{ $$ = $1; }
				| asignacion_var	{ $$ = $1; }
;

bloque : LLAIZQ LLADER					{ $$ = new Bloque_Sentencia();  }
		| LLAIZQ cuerpo_bloque LLADER	{ $$ = $2; }
;


cuerpo_bloque: cuerpo_bloque declaracion_variables PTCOMA	{
																$$ = $1;
																$$.getHijos().push($2);
															}
			| cuerpo_bloque incremento PTCOMA		{
														$$ = $1;
														$$.getHijos().push($2);
													}
			| cuerpo_bloque decremento PTCOMA		{
														$$ = $1;
														$$.getHijos().push($2);
													}
			| cuerpo_bloque sentencia_if			{
														$$ = $1;
														$$.getHijos().push($2);
													}
			| cuerpo_bloque sentencia_switch		{
														$$ = $1;
														$$.getHijos().push($2);
													}
			| cuerpo_bloque llamadaMetodo PTCOMA	{
														$$ = $1;
														$$.getHijos().push($2);
													}
			| cuerpo_bloque BREAK PTCOMA	{ 
												$$ = $1;
												let sentBreak = new Sentencia_Break(@1.first_line,@1.first_column);
												$$.getHijos().push(sentBreak);
											}
			| cuerpo_bloque CONTINUE PTCOMA	{
												$$ = $1;
												let sentCont = new Sentencia_Continue(@1.first_line,@1.first_column); 
												$$.getHijos().push(sentCont);
											}
			| cuerpo_bloque asignacion_var PTCOMA 	{
														$$ = $1;
														$$.getHijos().push($2);
													}
			| cuerpo_bloque sentencia_while		{
													$$ = $1;
													$$.getHijos().push($2);
												}
			| cuerpo_bloque sentencia_do_while	{
													$$ = $1;
													$$.getHijos().push($2);
												}
			| cuerpo_bloque sentencia_for		{
													$$ = $1;
													$$.getHijos().push($2);
												}
			| cuerpo_bloque sentencia_return PTCOMA	{
														$$ = $1;
														$$.getHijos().push($2);
													}
            | cuerpo_bloque declaracion_funcion {
                                                    $$ = $1;
                                                    $$.getHijos().push($2);
            }
			| incremento PTCOMA				{
												$$ = new Bloque_Sentencia();
												$$.getHijos().push($1);
											}
			| declaracion_variables PTCOMA	{
												$$ = new Bloque_Sentencia();
												$$.getHijos().push($1);
											}
			| sentencia_if			{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| llamadaMetodo PTCOMA	{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| decremento PTCOMA		{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| BREAK PTCOMA			{ 
										$$ = new Bloque_Sentencia();
										let sentBreak1 = new Sentencia_Break(@1.first_line,@1.first_column); 
										$$.getHijos().push(sentBreak1);
									}
			| CONTINUE PTCOMA		{ 	
										$$ = new Bloque_Sentencia();
										let sentCont1 = new Sentencia_Continue(@1.first_line,@1.first_column);
										$$.getHijos().push(sentCont1);
									}
			| sentencia_switch		{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| asignacion_var PTCOMA	{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| sentencia_while 		{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| sentencia_do_while	{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| sentencia_for			{
										$$ = new Bloque_Sentencia();
										$$.getHijos().push($1);
									}
			| sentencia_return PTCOMA	{
											$$ = new Bloque_Sentencia();
											$$.getHijos().push($1);
										}
            | declaracion_funcion   {
                                        $$ = new Bloque_Sentencia();
                                        $$.getHijos().push($1);
                                    }
			| error PTCOMA	{
								Lista_Error.getInstancia().push(new Nodo_Error(TipoError.ERROR_SINTACTICO,'No se esperaba el símbolo: ' + yytext +'.',@1.first_line,@1.first_column));
							}
			| error LLADER	{
								Lista_Error.getInstancia().push(new Nodo_Error(TipoError.ERROR_SINTACTICO,'No se esperaba el símbolo: ' + yytext +'.',@1.first_line,@1.first_column));
							}
;

asignacion_var : id S_IGUAL E 	{
									$$ = new Asignacion_Variable();
									let identificador8 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
									$$.getHijos().push(identificador8);
									$$.getHijos().push($3);
								}
				| acceso_arreglo S_IGUAL E 	{
												$$ = new Asignacion_Variable();
												$$.getHijos().push($1);
												$$.getHijos().push($3);
											}
;

declaracion_funcion : FUNCTION  id PARIZQ PARDER DOSPUNTOS tipo_dato bloque { 
																				$$ = new Declaracion_Funcion();
																				let id3 = new Identificador("Identificador",$2,@2.first_line,@2.first_column);
																				let listaParametros1 = new Lista_Parametros();
																				$$.getHijos().push(id3);
																				$$.getHijos().push(listaParametros1);
																				$$.getHijos().push($6);
																				$$.getHijos().push($7);
																			}
					| FUNCTION  id PARIZQ lista_parametros PARDER DOSPUNTOS tipo_dato bloque { 
																								$$ = new Declaracion_Funcion();
																								let id4 = new Identificador("Identificador",$2,@2.first_line,@2.first_column);
																								$$.getHijos().push(id4);
																								$$.getHijos().push($4);
																								$$.getHijos().push($7);
																								$$.getHijos().push($8);
																							}
					| FUNCTION  id PARIZQ PARDER bloque 					{ 
																				$$ = new Declaracion_Funcion();
																				let id5 = new Identificador("Identificador",$2,@2.first_line,@2.first_column);
																				let listaParametros2 = new Lista_Parametros();
																				let tipoDato = new Tipo_Dato("TIPO_DATO","Void",-1,-1);
																				$$.getHijos().push(id5);
																				$$.getHijos().push(listaParametros2);
																				$$.getHijos().push(tipoDato);
																				$$.getHijos().push($5);
																			}																							
					| FUNCTION  id PARIZQ lista_parametros PARDER bloque 	{ 
																				$$ = new Declaracion_Funcion();
																				let id6 = new Identificador("Identificador",$2,@2.first_line,@2.first_column);
																				let tipoDato_1 = new Tipo_Dato("TIPO_DATO","Void",-1,-1);
																				$$.getHijos().push(id6);
																				$$.getHijos().push($4);
																				$$.getHijos().push(tipoDato_1);
																				$$.getHijos().push($6);
																			}																			
;

lista_parametros : lista_parametros COMA parametro 	{
														$$ = $1;
														$$.getHijos().push($3);
													}
				| parametro						{
													$$ = new Lista_Parametros();
													$$.getHijos().push($1);
												}
;

parametro : id DOSPUNTOS tipo_dato	{
										$$ = new Parametro();
										let id7 = new Identificador("Identificador",$1,@1.first_line,@1.first_column);
										$$.getHijos().push(id7);
										$$.getHijos().push($3);
									}
;

