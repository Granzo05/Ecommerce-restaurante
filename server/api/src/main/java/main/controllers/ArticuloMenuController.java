package main.controllers;

import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloMenuDTO;
import main.entities.Productos.EnumTipoArticuloComida;
import main.entities.Productos.ImagenesProducto;
import main.repositories.ArticuloMenuRepository;
import main.repositories.ImagenesProductoRepository;
import main.repositories.IngredienteMenuRepository;
import main.repositories.IngredienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class ArticuloMenuController {
    private final ArticuloMenuRepository articuloMenuRepository;

    private final IngredienteMenuRepository ingredienteMenuRepository;
    private final IngredienteRepository ingredienteRepository;

    private final ImagenesProductoRepository imagenesProductoRepository;

    public ArticuloMenuController(ArticuloMenuRepository articuloMenuRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository, ImagenesProductoRepository imagenesProductoRepository) {
        this.articuloMenuRepository = articuloMenuRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.imagenesProductoRepository = imagenesProductoRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus")
    public Set<ArticuloMenuDTO> getMenusDisponibles() {
        List<ArticuloMenuDTO> menus = articuloMenuRepository.findAllByNotBorrado();

        for (ArticuloMenuDTO menu : menus) {
            menu.setImagenesDTO(new HashSet<>(imagenesProductoRepository.findByIdMenu(menu.getId())));
            menu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(menu.getId())));
        }

        return new HashSet<>(menus);
    }

    @Transactional
    @PostMapping("/menu/create")
    public ResponseEntity<String> crearMenu(@RequestBody ArticuloMenu articuloMenu) {
        Optional<ArticuloMenu> menuDB = articuloMenuRepository.findByName(articuloMenu.getNombre());
        if (menuDB.isEmpty()) {
            for (IngredienteMenu ingredienteMenu : articuloMenu.getIngredientesMenu()) {
                Ingrediente ingredienteDB = ingredienteRepository.findByName(ingredienteMenu.getIngrediente().getNombre()).get();
                ingredienteMenu.setIngrediente(ingredienteDB);
                ingredienteMenu.setCantidad(ingredienteMenu.getCantidad());
                ingredienteMenu.setArticuloMenu(articuloMenu);
                ingredienteMenu.setMedida(ingredienteMenu.getMedida());
            }

            articuloMenuRepository.save(articuloMenu);

            return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.OK);

        } else {
            return new ResponseEntity<>("Hay un menú creado con ese nombre", HttpStatus.FOUND);
        }
    }

    @Transactional
    @PostMapping("/menu/imagenes")
    public ResponseEntity<String> crearImagen(@RequestParam("file") MultipartFile file, @RequestParam("nombreMenu") String nombreMenu) {
        HashSet<ImagenesProducto> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "images" + File.separator + nombreMenu.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(nombreMenu.replaceAll(" ", "") + "/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();

            ImagenesProducto imagen = new ImagenesProducto();
            imagen.setNombre(fileName.replaceAll(" ", ""));
            imagen.setRuta(downloadUrl);
            imagen.setFormato(file.getContentType());

            listaImagenes.add(imagen);

            try {
                for (ImagenesProducto imagenProducto : listaImagenes) {
                    // Asignamos el menu a la imagen
                    Optional<ArticuloMenu> menu = articuloMenuRepository.findByName(nombreMenu);
                    if (menu.isEmpty()) {
                        return new ResponseEntity<>("Menu vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setArticuloMenu(menu.get());

                    imagenesProductoRepository.save(imagen);
                }

            } catch (Exception e) {
                System.out.println("Error al insertar la ruta en el menu: " + e);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("Error al crear la imagen: " + e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PutMapping("/menu/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagen(@PathVariable("id") Long id) {
        Optional<ImagenesProducto> imagen = imagenesProductoRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagen.get().setBorrado("SI");
                imagenesProductoRepository.save(imagen.get());
                return new ResponseEntity<>("Imagen creada correctamente", HttpStatus.OK);
            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/menu/tipo/{tipoMenu}")
    public Set<ArticuloMenuDTO> getMenusPorTipo(@PathVariable("tipoMenu") String tipo) {
        String tipoMenu = tipo.toUpperCase().replace(" ", "_");
        Set<ArticuloMenuDTO> articuloMenus = (new HashSet<>(articuloMenuRepository.findByType(EnumTipoArticuloComida.valueOf(tipoMenu))));

        for (ArticuloMenuDTO articuloMenu : articuloMenus) {
            articuloMenu.setImagenesDTO(new HashSet<>(imagenesProductoRepository.findByIdMenu(articuloMenu.getId())));
            articuloMenu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(articuloMenu.getId())));
        }
        return articuloMenus;
    }

    @Transactional
    @PutMapping("/menu/update")
    public ResponseEntity<String> actualizarMenu(@RequestBody ArticuloMenu articuloMenuDetail) {
        Optional<ArticuloMenu> menuEncontrado = articuloMenuRepository.findById(articuloMenuDetail.getId());

        if (menuEncontrado.isEmpty()) {
            return new ResponseEntity<>("El menu no se encuentra", HttpStatus.NOT_FOUND);
        }

        ArticuloMenu articuloMenu = menuEncontrado.get();

        ingredienteMenuRepository.deleteAllByIdArticuloMenu(articuloMenu.getId());

        articuloMenu.setPrecioVenta(articuloMenuDetail.getPrecioVenta());

        for (IngredienteMenu ingredienteMenu : articuloMenuDetail.getIngredientesMenu()) {
            ingredienteMenu.setArticuloMenu(articuloMenu);

            ingredienteMenu.setIngrediente(ingredienteRepository.findByName(ingredienteMenu.getIngrediente().getNombre()).get());
        }

        articuloMenu.setIngredientesMenu(articuloMenuDetail.getIngredientesMenu());
        articuloMenu.setTiempoCoccion(articuloMenuDetail.getTiempoCoccion());
        articuloMenu.setDescripcion(articuloMenuDetail.getDescripcion());
        articuloMenu.setNombre(articuloMenuDetail.getNombre());
        articuloMenu.setTipo(articuloMenuDetail.getTipo());
        articuloMenu.setComensales(articuloMenuDetail.getComensales());

        articuloMenuRepository.save(articuloMenu);

        return new ResponseEntity<>("El menu ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/menu/{nombre}/delete")
    public ResponseEntity<String> borrarMenu(@PathVariable("nombre") String nombre) {
        Optional<ArticuloMenu> menu = articuloMenuRepository.findByName(nombre);
        if (menu.isEmpty()) {
            return new ResponseEntity<>("El menu ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        menu.get().setBorrado("SI");
        articuloMenuRepository.save(menu.get());
        return new ResponseEntity<>("El menu ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
