### agregar en el json e instalar linter de vscode
```
"editor.formatOnSave": false, 
  "editor.codeActionsOnSave": { 
    "source.fixAll.eslint": true 
  }, 
  "eslint.alwaysShowStatus": true,
```



### problemas con el git ignore */
```
git rm -r --cached .
git add .
git commit -m ".gitignore is now working"
```

## TODOS
- [x] 1 modulo de preguntas
- [] 2 modulo de encuestas
- se pide titulo
- se piden las preguntas que se usaran y se van agregando a la vista
- no dejar que se agreguen preguntas repetidas
- cuando es una cadena no se puede elegir como preguntas madres
- guardar toda la info en la bdd
- [] 3 modulo de cuestionarios
- dependiendo las encuestas aprecen en el menu
- al entrar al encuesta siempre se piden los datos del cliente pero se pide por allen o por pasaporte
- se despliegan las preguntas de las encuestan
- mucha atencion a las preguntas encadenadas
- [] 4 modulo clientes
- se cargan los cuestionarios contestados por cliente y se ve un resumen de los resultados
- si el cliente esta errado tener la opcion de editar o enviar al cliente la encuesta para que la corrija
