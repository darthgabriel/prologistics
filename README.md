### agregar en el json e instalar linter de vscode

  `"editor.formatOnSave": false, 
  "editor.codeActionsOnSave": { 
    "source.fixAll.eslint": true 
  }, 
  "eslint.alwaysShowStatus": true,`



### problemas con el git ignore */
`git rm -r --cached .
git add .
git commit -m ".gitignore is now working"`

## TODOS
1. modulo de preguntas
2. modulo de encuestas
  2.1 se pide titulo
  2.2 se piden las preguntas que se usaran y se van agregando a la vista
  2.3 no dejar que se agreguen preguntas repetidas
  2.4 cuando es una cadena no se puede elegir como preguntas madres
  2.3 guardar toda la info en la bdd
3. modulo de cuestionarios
  3.1 dependiendo las encuestas aprecen en el menu
  3.2 al entrar al encuesta siempre se piden los datos del cliente pero se pide por allen o por pasaporte
  3.4 se despliegan las preguntas de las encuestan
  3.5 mucha atencion a las preguntas encadenadas
4. modulo clientes
  4.1 se cargan los cuestionarios contestados por cliente y se ve un resumen de los resultados
  4.2 si el cliente esta errado tener la opcion de editar o enviar al cliente la encuesta para que la corrija
