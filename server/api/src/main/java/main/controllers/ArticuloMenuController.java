package main.controllers;

import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockIngredientes;
import main.repositories.*;
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
    private final ImagenesRepository imagenesRepository;
    private final SucursalRepository sucursalRepository;
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;
    private final StockIngredientesRepository stockIngredientesRepository;


    public ArticuloMenuController(ArticuloMenuRepository articuloMenuRepository, IngredienteMenuRepository ingredienteMenuRepository, IngredienteRepository ingredienteRepository, ImagenesRepository imagenesRepository, SucursalRepository sucursalRepository, CategoriaRepository categoriaRepository, SubcategoriaRepository subcategoriaRepository, StockIngredientesRepository stockIngredientesRepository) {
        this.articuloMenuRepository = articuloMenuRepository;
        this.ingredienteMenuRepository = ingredienteMenuRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.imagenesRepository = imagenesRepository;
        this.sucursalRepository = sucursalRepository;
        this.categoriaRepository = categoriaRepository;
        this.subcategoriaRepository = subcategoriaRepository;
        this.stockIngredientesRepository = stockIngredientesRepository;
    }

    // Busca por id de menu
    @GetMapping("/menus/{idSucursal}")
    @CrossOrigin
    public Set<ArticuloMenu> getMenusDisponibles(@PathVariable("idSucursal") Long idSucursal) {
        List<ArticuloMenu> menus = articuloMenuRepository.findAllBySucursal(idSucursal);

        for (ArticuloMenu menu : menus) {
            menu.setImagenes(new HashSet<>(imagenesRepository.findByIdMenu(menu.getId())));
            menu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(menu.getId())));
        }

        return new HashSet<>(menus);
    }

    @Transactional
    @CrossOrigin
    @PostMapping("/menu/create/{idSucursal}")
    public ResponseEntity<String> crearMenu(@RequestBody ArticuloMenu articuloMenu, @PathVariable("idSucursal") Long idSucursal) {
        Optional<ArticuloMenu> menuDB = articuloMenuRepository.findByName(articuloMenu.getNombre());
        if (menuDB.isEmpty()) {
            try {
                for (IngredienteMenu ingredienteMenu : articuloMenu.getIngredientesMenu()) {
                    ingredienteMenu.setArticuloMenu(articuloMenu);
                }

                articuloMenu.setBorrado("NO");

                // Si la sucursal coincide con los privilegios del admin o de la empresa que agregue todas las sucursales al menu
                if (idSucursal == 0) {
                    List<Sucursal> sucursales = sucursalRepository.findAll();
                    for (Sucursal sucursal : sucursales) {
                        sucursal.getArticulosMenu().add(articuloMenu);
                        articuloMenu.getSucursales().add(sucursal);
                        sucursalRepository.save(sucursal);
                    }
                } else {
                    Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                    if (sucursalOpt.isPresent()) {
                        Sucursal sucursal = sucursalOpt.get();
                        sucursal.getArticulosMenu().add(articuloMenu);
                        articuloMenu.getSucursales().add(sucursal);
                        sucursalRepository.save(sucursal);
                    } else {
                        return ResponseEntity.badRequest().body("Sucursal no encontrada");
                    }
                }

                articuloMenu.setCategoria(categoriaRepository.findById(articuloMenu.getCategoria().getId()).get());
                articuloMenu.setSubcategoria(subcategoriaRepository.findById(articuloMenu.getSubcategoria().getId()).get());

                articuloMenuRepository.save(articuloMenu);

                return new ResponseEntity<>("El menú ha sido añadido correctamente", HttpStatus.OK);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Hubo un error al cargar el menú");

            }
        } else {
            return ResponseEntity.badRequest().body("Hay un menú existente con ese nombre");
        }
    }

    @Transactional
    @CrossOrigin
    @PostMapping("/menu/imagenes/{idSucursal}")
    public ResponseEntity<String> crearImagenMenu(@RequestParam("file") MultipartFile file, @RequestParam("nombreMenu") String nombreMenu, @PathVariable("idSucursal") Long idSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesMenu" + File.separator + nombreMenu.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesMenu/")
                    .path(nombreMenu.replaceAll(" ", "") + "/")
                    .path(fileName.replaceAll(" ", ""))
                    .toUriString();

            Imagenes imagen = new Imagenes();
            imagen.setNombre(fileName.replaceAll(" ", ""));
            imagen.setRuta(downloadUrl);
            imagen.setFormato(file.getContentType());

            listaImagenes.add(imagen);

            try {
                for (Imagenes imagenProducto : listaImagenes) {
                    // Asignamos el menu a la imagen
                    Optional<ArticuloMenu> menu = articuloMenuRepository.findByNameMenuAndIdSucursal(nombreMenu, idSucursal);
                    if (menu.isEmpty()) {
                        return new ResponseEntity<>("menu vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.getArticulosMenu().add(menu.get());
                    imagenProducto.getSucursales().add(sucursalRepository.findById(idSucursal).get());
                    imagenesRepository.save(imagenProducto);
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
    @CrossOrigin
    @PutMapping("/menu/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenMenu(@PathVariable("id") Long id) {
        Optional<Imagenes> imagen = imagenesRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagen.get().setBorrado("SI");
                imagenesRepository.save(imagen.get());
                return new ResponseEntity<>(HttpStatus.ACCEPTED);

            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @CrossOrigin
    @GetMapping("/menu/tipo/{categoria}/{idSucursal}")
    public Set<ArticuloMenu> getMenusPorTipo(@PathVariable("categoria") String categoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByNameAndIdSucursal(categoria, idSucursal);

        Set<ArticuloMenu> menus = new HashSet<>();
        if (categoriaDB.isPresent()) {
            List<ArticuloMenu> articuloMenus = articuloMenuRepository.findByIdCategoriaAndIdSucursal(categoriaDB.get().getId(), idSucursal);

            for (ArticuloMenu menu : articuloMenus) {
                boolean hayStock = true;

                menu.setIngredientesMenu(new HashSet<>(ingredienteMenuRepository.findByMenuId(menu.getId())));

                for (IngredienteMenu ingredienteMenu : menu.getIngredientesMenu()) {
                    Optional<StockIngredientes> stock = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingredienteMenu.getId(), idSucursal);

                    // Verificamos si hay stock
                    if (stock.isPresent() && stock.get().getCantidadActual() < stock.get().getCantidadMinima()) {
                        System.out.println("no hay stock de " + ingredienteMenu.getIngrediente().getNombre());
                        hayStock = false;
                    }
                }

                if (hayStock) {
                    menu.setImagenes(new HashSet<>(imagenesRepository.findByIdMenu(menu.getId())));
                    menus.add(menu);
                }
            }

            return menus;
        }

        return null;
    }

    @Transactional
    @CrossOrigin
    @PutMapping("/menu/update/{idSucursal}")
    public ResponseEntity<String> actualizarMenu(@RequestBody ArticuloMenu articuloMenuDetail, @PathVariable("idSucursal") Long id) {
        Optional<ArticuloMenu> menuEncontrado = articuloMenuRepository.findByIdMenuAndIdSucursal(articuloMenuDetail.getId(), id);

        if (menuEncontrado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El menú no se encontró");
        }

        if (menuEncontrado.isPresent() && menuEncontrado.get().getBorrado().equals(articuloMenuDetail.getBorrado())) {
            Optional<ArticuloMenu> articuloMenuDB = articuloMenuRepository.findByNameMenuAndIdSucursal(articuloMenuDetail.getNombre(), id);

            if (articuloMenuDB.isPresent() && articuloMenuDB.get().getId() != menuEncontrado.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe un menú con ese nombre");
            }

            ArticuloMenu articuloMenu = menuEncontrado.get();

            ingredienteMenuRepository.deleteAllByIdArticuloMenu(articuloMenu.getId());

            articuloMenu.setPrecioVenta(articuloMenuDetail.getPrecioVenta());

            for (IngredienteMenu ingredienteMenuDTO : articuloMenuDetail.getIngredientesMenu()) {
                IngredienteMenu ingredienteMenu = new IngredienteMenu();
                ingredienteMenu.setArticuloMenu(articuloMenu);
                ingredienteMenu.setMedida(ingredienteMenuDTO.getMedida());
                ingredienteMenu.setCantidad(ingredienteMenuDTO.getCantidad());
                ingredienteMenu.setIngrediente(ingredienteRepository.findByNameAndIdSucursal(ingredienteMenuDTO.getIngrediente().getNombre(), id).get());

                articuloMenu.getIngredientesMenu().add(ingredienteMenu);
            }

            articuloMenu.setTiempoCoccion(articuloMenuDetail.getTiempoCoccion());
            articuloMenu.setDescripcion(articuloMenuDetail.getDescripcion());
            articuloMenu.setNombre(articuloMenuDetail.getNombre());
            articuloMenu.setCategoria(categoriaRepository.findByNameAndIdSucursal(articuloMenuDetail.getCategoria().getNombre(), id).get());
            articuloMenu.setComensales(articuloMenuDetail.getComensales());

            articuloMenuRepository.save(articuloMenu);

            return ResponseEntity.ok("El menu ha sido actualizado correctamente");

        } else if (menuEncontrado.isPresent() && !menuEncontrado.get().getBorrado().equals(articuloMenuDetail.getBorrado())) {
            ArticuloMenu articuloMenu = menuEncontrado.get();
            articuloMenu.setBorrado(articuloMenuDetail.getBorrado());

            articuloMenuRepository.save(articuloMenu);

            return ResponseEntity.ok("El menu ha sido actualizado correctamente");
        }

        return ResponseEntity.badRequest().body("El menu no existe existe");
    }

}
