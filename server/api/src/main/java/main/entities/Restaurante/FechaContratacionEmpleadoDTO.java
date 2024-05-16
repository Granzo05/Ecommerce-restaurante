package main.entities.Restaurante;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FechaContratacionEmpleadoDTO {
    private LocalDateTime fechaContratacion;
}
