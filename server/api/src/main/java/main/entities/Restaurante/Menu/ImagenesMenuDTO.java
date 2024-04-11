package main.entities.Restaurante.Menu;

import org.springframework.web.multipart.MultipartFile;

public class ImagenesMenuDTO {
    private String nombre;

    private MultipartFile archivo;
    private Menu menu;

    public ImagenesMenuDTO() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public MultipartFile getArchivo() {
        return archivo;
    }

    public void setArchivo(MultipartFile archivo) {
        this.archivo = archivo;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }
}
