package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.mail.MessagingException;
import java.io.IOException;
import java.security.GeneralSecurityException;

@SpringBootApplication
@EntityScan("main.entities")
@ComponentScan(basePackages = {"main.controllers", "main.repositories", "main.*"})
public class Main {
    public static void main(String[] args) throws GeneralSecurityException, IOException, MessagingException {
        SpringApplication.run(Main.class, args);

        // Query para añadir una empresa

        /*
        INSERT INTO empresa(id, cuit, razon_social)
        VALUES (1, 201234560, "El buen sabor");

        INSERT INTO `utn`.`sucursales`
        (`id`,
        `borrado`,
        `contraseña`,
        `email`,
        `horario_apertura`,
        `horario_cierre`,
        `privilegios`,
        `telefono`,
        `id_empresa`)
        VALUES
        (1,"NO",123,"ABC@gmail.com", "17:00", "22:00","negocio", 261358111,1);
         */
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:5173/")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("Origin", "Content-Type", "Accept", "Authorization")
                        .allowCredentials(true);

            }
        };
    }

}
