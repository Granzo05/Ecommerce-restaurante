# Ejecución

Visual Studio:
  - Si es la primera vez que se ejecuta el proyecto, y por única vez, ejecutar el
      comando 'npm install' el que va a descargar todas las dependencias necesarias.

  - Una vez finalizado, ejecutar npm run dev

Intellij: 
  - En application.properties modificar la contraseña con tu contraseña del servidor de MySQL
  - Para crear la base de datos hay 2 opciones:
      1) Crear una base de datos con el nombres 'utn': CREATE DATABASE utn;
      2) Cambiar el nombre de la base de datos de la ruta que apunta el servidor:
        - spring.datasource.url=jdbc:mysql://localhost:3306/utn a => spring.datasource.url=jdbc:mysql://localhost:3306/{NOMBRE DE TU BASE DE DATOS}
  - Ejecutar el main

Una vez finalizados ambos pasos, abrir http://localhost:5173/

Pasos para loguearte como sucursal:
  - Una vez que tengas el Visual e Intellij ejecutándose al mismo tiempo puedes navegar a http://localhost:5173/login-negocio y loguearte:
    - Como empresa => Cuit: 201234566 Contraseña: 123456
    - Como sucursal => Email: a@gmail.com Contraseña: 123 
