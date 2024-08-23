FROM alpine:latest as build

RUN apk update && apk add openjdk17

COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

FROM openjdk:17-alpine
EXPOSE 9000
COPY --from=build ./build/libs/Buen-sabor-0.0.1-SNAPSHOT.jar ./app.jar
COPY --from=build ./src/main/resources/Wallet_BuenSabor /app/src/main/resources/Wallet_BuenSabor
COPY --from=build ./src/main/webapp/WEB-INF/imagesArticuloVenta /app/src/main/webapp/WEB-INF/imagesArticuloVenta
COPY --from=build ./src/main/webapp/WEB-INF/imagesCategoria /app/src/main/webapp/WEB-INF/imagesCategoria
COPY --from=build ./src/main/webapp/WEB-INF/imagesEmpleados /app/src/main/webapp/WEB-INF/imagesEmpleados
COPY --from=build ./src/main/webapp/WEB-INF/imagesEmpresas /app/src/main/webapp/WEB-INF/imagesEmpresas
COPY --from=build ./src/main/webapp/WEB-INF/imagesMenu /app/src/main/webapp/WEB-INF/imagesMenu
COPY --from=build ./src/main/webapp/WEB-INF/imagesPromocion /app/src/main/webapp/WEB-INF/imagesPromocion
COPY --from=build ./src/main/webapp/WEB-INF/imagesSucursales /app/src/main/webapp/WEB-INF/imagesSucursales
COPY --from=build ./src/main/resources/localidades.csv /app/src/main/resources/localidades.csv

ENTRYPOINT ["java", "-jar", "app.jar"]
