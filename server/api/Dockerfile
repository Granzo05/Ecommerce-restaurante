FROM alpine:latest as build

RUN apk update
RUN apk add openjdk17

COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

FROM openjdk:17-alpine
EXPOSE 9000
COPY --from=build ./build/libs/api/SNAPSHOT.jar ./app.jar
COPY src/main/resources/localidades.csv /app/localidades.csv

ENTRYPOINT ["java", "-jar","app.jar"]