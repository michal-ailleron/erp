# syntax=docker/dockerfile:1

# Kontekst budowania to korzeń repo (docker-compose: context "."), bo generator
# OpenAPI czyta contract/openapi.yaml, który leży poza backend/netting.
FROM eclipse-temurin:25-jdk AS build
WORKDIR /repo
COPY contract contract
COPY backend/netting backend/netting
WORKDIR /repo/backend/netting
RUN chmod +x mvnw && ./mvnw -B -q package

FROM eclipse-temurin:25-jre AS run
WORKDIR /app
COPY --from=build /repo/backend/netting/target/netting-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
