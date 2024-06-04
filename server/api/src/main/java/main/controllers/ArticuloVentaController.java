package main.controllers;

import main.entities.Ingredientes.Categoria;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;
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
public class ArticuloVentaController {
    private final StockArticuloVentaRepository stockArticuloVentaRepository;
    private final ImagenesRepository imagenesRepository;
    private final ArticuloVentaRepository articuloVentaRepository;
    private final SucursalRepository sucursalRepository;
    private final CategoriaRepository categoriaRepository;
    private final MedidaRepository medidaRepository;

    public ArticuloVentaController(StockArticuloVentaRepository stockArticuloVentaRepository, ImagenesRepository imagenesRepository, ArticuloVentaRepository articuloVentaRepository, SucursalRepository sucursalRepository, CategoriaRepository categoriaRepository, MedidaRepository medidaRepository) {
        this.stockArticuloVentaRepository = stockArticuloVentaRepository;
        this.imagenesRepository = imagenesRepository;
        this.articuloVentaRepository = articuloVentaRepository;
        this.sucursalRepository = sucursalRepository;
        this.categoriaRepository = categoriaRepository;
        this.medidaRepository = medidaRepository;
    }

    @GetMapping("/articulos/{idSucursal}")
    public Set<ArticuloVenta> getArticulosDisponibles(@PathVariable("idSucursal") Long idSucursal) {
        List<ArticuloVenta> articulos = articuloVentaRepository.findAllBySucursal(idSucursal);

        for (ArticuloVenta articulo : articulos) {
            articulo.setImagenes(new HashSet<>(imagenesRepository.findByIdArticulo(articulo.getId())));
        }

        return new HashSet<>(articulos);
    }

    @GetMapping("/articulos/tipo/{categoria}/{idSucursal}")
    public Set<ArticuloVenta> getArticulosPorCategoria(@PathVariable("categoria") String categoria, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByNameAndIdSucursal(categoria, idSucursal);

        if (categoriaDB.isPresent()) {
            List<ArticuloVenta> articulos = articuloVentaRepository.findByCategoriaNameAndIdSucursal(categoriaDB.get().getNombre(), idSucursal);

            for (ArticuloVenta menu : articulos) {
                menu.setImagenes(new HashSet<>(imagenesRepository.findByIdMenu(menu.getId())));
            }

            return new HashSet<>(articulos);
        }
        return null;
    }

    @Transactional
    @PostMapping("/articulo/create/{idSucursal}")
    public ResponseEntity<String> crearArticulo(@RequestBody ArticuloVenta articuloVenta, @PathVariable("idSucursal") Long idSucursal) {
        Optional<ArticuloVenta> articuloDB = articuloVentaRepository.findByNameArticuloAndIdSucursal(articuloVenta.getNombre(), idSucursal);

        if (articuloDB.isEmpty()) {
            if (idSucursal == 1) {
                List<Sucursal> sucursales = sucursalRepository.findAll();
                for (Sucursal sucursal : sucursales) {
                    Optional<ArticuloVenta> articuloSucursal = articuloVentaRepository.findByNameArticuloAndIdSucursal(articuloVenta.getNombre(), sucursal.getId());
                    if (articuloSucursal.isEmpty()) {
                        sucursal.getArticulosVenta().add(articuloVenta);
                        articuloVenta.getSucursales().add(sucursal);
                    }
                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    if (!sucursal.getArticulosVenta().contains(articuloVenta)) {
                        Optional<ArticuloVenta> articuloSucursal = articuloVentaRepository.findByNameArticuloAndIdSucursal(articuloVenta.getNombre(), sucursal.getId());
                        if (articuloSucursal.isEmpty()) {
                            sucursal.getArticulosVenta().add(articuloVenta);
                            articuloVenta.getSucursales().add(sucursal);
                        }
                    }
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }

            ArticuloVenta articulo = articuloVentaRepository.save(articuloVenta);

            if (idSucursal == 1) {
                StockArticuloVenta stockArticuloVenta = new StockArticuloVenta();
                stockArticuloVenta.setCantidadActual(0);
                stockArticuloVenta.setCantidadMinima(0);
                stockArticuloVenta.setCantidadMaxima(0);
                stockArticuloVenta.setPrecioCompra(0);
                stockArticuloVenta.setArticuloVenta(articulo);
                stockArticuloVenta.setBorrado("NO");

                StockArticuloVenta stock = stockArticuloVentaRepository.save(stockArticuloVenta);

                for (Sucursal sucursal : sucursalRepository.findAll()) {
                    stock.getSucursales().add(sucursal);
                    sucursal.getStocksArticulo().add(stock);
                    sucursalRepository.save(sucursal); // Save the changes to the sucursales
                }
            }

            return new ResponseEntity<>("El artículo ha sido añadido correctamente", HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest().body("Hay un artículo existente con ese nombre");
        }
    }


    @Transactional
    @PostMapping("/articulo/imagenes/{idSucursal}")
    public ResponseEntity<String> crearImagenArticulo(@RequestParam("file") MultipartFile file, @RequestParam("nombreArticulo") String nombreArticulo, @PathVariable("idSucursal") Long idSucursal) {
        HashSet<Imagenes> listaImagenes = new HashSet<>();
        // Buscamos el nombre de la foto
        String fileName = file.getOriginalFilename().replaceAll(" ", "");
        try {
            String basePath = new File("").getAbsolutePath();
            String rutaCarpeta = basePath + File.separator + "src" + File.separator + "main" + File.separator + "webapp" + File.separator + "WEB-INF" + File.separator + "imagesArticuloVenta" + File.separator + nombreArticulo.replaceAll(" ", "") + File.separator;

            // Verificar si la carpeta existe, caso contrario, crearla
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) {
                carpeta.mkdirs();
            }

            String rutaArchivo = rutaCarpeta + fileName;
            file.transferTo(new File(rutaArchivo));

            String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("imagesArticuloVenta/")
                    .path(nombreArticulo.replaceAll(" ", "") + "/")
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
                    Optional<ArticuloVenta> articuloVenta = articuloVentaRepository.findByNameArticuloAndIdSucursal(nombreArticulo, idSucursal);
                    if (articuloVenta.isEmpty()) {
                        return new ResponseEntity<>("articuloVenta vacio", HttpStatus.NOT_FOUND);
                    }
                    imagenProducto.setArticuloVenta(articuloVenta.get());
                    imagenProducto.setSucursal(sucursalRepository.findById(idSucursal).get());
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

    @jakarta.transaction.Transactional
    @PutMapping("/articulo/imagen/{id}/delete")
    public ResponseEntity<String> eliminarImagenArticulo(@PathVariable("id") Long id) {
        Optional<Imagenes> imagen = imagenesRepository.findById(id);

        if (imagen.isPresent()) {
            try {
                imagenesRepository.delete(imagen.get());
                return new ResponseEntity<>(HttpStatus.ACCEPTED);

            } catch (Exception e) {
                System.out.println("Error al crear la imagen: " + e);
            }
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/articulo/tipo/{tipoArticulo}/{idSucursal}")
    public Set<ArticuloVenta> getArticulosPorTipo(@PathVariable("tipoArticulo") String categoria, @PathVariable("idSucursal") Long id) {
        Optional<Categoria> categoriaDB = categoriaRepository.findByNameAndIdSucursal(categoria, id);

        if (categoriaDB.isPresent()) {
            Set<ArticuloVenta> articuloVentas = (new HashSet<>(articuloVentaRepository.findByCategoriaNameAndIdSucursal(categoriaDB.get().getNombre(), id)));

            for (ArticuloVenta articuloVenta : articuloVentas) {
                articuloVenta.setImagenes(new HashSet<>(imagenesRepository.findByIdArticulo(articuloVenta.getId())));
            }
            return articuloVentas;
        }
        return null;
    }

    @PutMapping("/articulo/update/{idSucursal}")
    public ResponseEntity<String> actualizarArticulo(@RequestBody ArticuloVenta articuloVentaDetail, @PathVariable("idSucursal") Long id) {
        Optional<ArticuloVenta> articuloEncontrado = articuloVentaRepository.findByIdArticuloAndIdSucursal(articuloVentaDetail.getId(), id);

        if (articuloEncontrado.isPresent() && articuloEncontrado.get().getBorrado().equals(articuloVentaDetail.getBorrado())) {
            Optional<ArticuloVenta> articuloMenuDB = articuloVentaRepository.findByNameArticuloAndIdSucursal(articuloVentaDetail.getNombre(), id);

            if (articuloMenuDB.isPresent() && articuloMenuDB.get().getId() != articuloEncontrado.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe un articulo con ese nombre");
            }

            ArticuloVenta articuloVenta = articuloEncontrado.get();
            articuloVenta.setPrecioVenta(articuloVentaDetail.getPrecioVenta());
            articuloVenta.setNombre(articuloVentaDetail.getNombre());
            articuloVenta.setCategoria(categoriaRepository.findByNameAndIdSucursal(articuloVentaDetail.getCategoria().getNombre(), id).get());
            articuloVenta.setMedida(medidaRepository.findByDenominacionAndIdSucursal(articuloVentaDetail.getMedida().getNombre(), id).get());
            articuloVenta.setCantidadMedida(articuloVentaDetail.getCantidadMedida());

            articuloVentaRepository.save(articuloVenta);

            return ResponseEntity.ok("El articulo ha sido actualizado correctamente");

        } else if (articuloEncontrado.isPresent() && !articuloEncontrado.get().getBorrado().equals(articuloVentaDetail.getBorrado())) {
            ArticuloVenta articuloVenta = articuloEncontrado.get();

            articuloVenta.setBorrado(articuloVentaDetail.getBorrado());

            articuloVentaRepository.save(articuloVenta);

            Optional<StockArticuloVenta> stock = stockArticuloVentaRepository.findByIdArticuloAndIdSucursal(articuloVenta.getId(), id);

            if (stock.isPresent()) {
                stock.get().setBorrado("SI");
            }

            return ResponseEntity.ok("El articulo ha sido actualizado correctamente");
        }

        return ResponseEntity.badRequest().body("El articulo no existe");
    }

}
