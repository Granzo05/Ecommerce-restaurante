const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require('path');
const axios = require('axios');
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.common['Accept'] = 'application/json;charset=UTF-8';
const multer = require('multer');
const fs = require('fs');

var datosCompra = {};

const tokenMP = "TEST-2642740000344645-102113-bb6f272cd7e3415c315beb3586393e11-738770102";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "./src", "html")));

// Configura el enrutamiento para todas las rutas
app.get("/*", function (req, res) {
	res.status(200).sendFile(path.join(__dirname, "./src", "html", "mainMenu.tsx"));
});

app.get("/compra", async (req, res) => {
	try {
		const response = await axios.post(`http://localhost:8080/pago_correcto`, JSON.stringify(datosCompra));

		const idVenta = response.data;

		res.redirect(`/compra.html?idVenta=${idVenta}`);

		//res.status(200).sendFile(path.join(__dirname, "..", "..", "client", "html-js", "compra.html"));

	} catch (error) {
		console.error("Error al manejar el resultado del pago:", error);

		res.status(200).sendFile(path.join(__dirname, "..", "..", "client", "html-js", "compra.html"));
	}
});


let indexImagen = 0;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, '../', '../', 'client', 'html-js', 'imagenes', file.originalname.replace(' ', ''));
		fs.mkdirSync(uploadPath, { recursive: true });
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		var currentIndex = indexImagen++;
		cb(null, file.originalname.replace(' ', '') + currentIndex.toString());
	},
});
const upload = multer({ storage: storage });

app.post('/cargar-producto', upload.none(), async (req, res) => {
	try {
		let categoria = req.body.categoria;
		let nombre = req.body.nombre;
		let precio = req.body.precio;
		let datos = req.body.datos.split(',').map();
		let stock = req.body.stock;

		const productoData = {
			categoria,
			nombre,
			precio,
			datos,
			stock
		};

		await axios.post('http://localhost:8080/producto', productoData);

		res.status(200).json({ mensaje: 'Producto guardado correctamente' });

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al procesar la solicitud' });
	}
});

app.post('/cargar-producto/imagenes', upload.single('imagen'), async (req, res) => {
	try {
		indexImagen = 0;
		res.status(200).json({ mensaje: 'Imágenes del producto cargadas correctamente' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Error interno del servidor al cargar imágenes del producto' });
	}
});

app.get('/mostrar-productos', async (req, res) => {
	try {
		const response = await axios.get('http://localhost:8080/productos');
		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/mostrar-productos-recomendados', async (req, res) => {
	try {
		const response = await axios.get('http://localhost:8080/productos/recomendados');
		console.log(response.data)
		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/pedidos/tipo', async (req, res) => {
	try {
		const tipo = req.query.tipo;
		const response = await axios.get('http://localhost:8080/pedidos/estado/' + tipo);

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/buscar_producto', async (req, res) => {
	try {
		const nombre = req.query.nombre;
		const response = await axios.get('http://localhost:8080/productos/condicion/' + nombre);

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.delete('/eliminar_producto', async (req, res) => {
	try {
		const nombre = req.query.nombre;
		const response = await axios.delete('http://localhost:8080/productos/eliminar/' + nombre);

		const basePath = path.join(__dirname, './src/', 'imagenes', nombre.replace(' ', ''));

		if (fs.existsSync(basePath)) {
			// Eliminar todas las imágenes asociadas con el producto
			fs.readdirSync(basePath).forEach(file => {
				const filePath = path.join(basePath, file);
				fs.unlinkSync(filePath); // Eliminar la imagen del servidor de archivos
			});

			// Eliminar la carpeta base del producto
			fs.rmdirSync(basePath);
		}

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.put('/pedidos/rechazar', async (req, res) => {
	try {
		const id = req.query.id;
		const motivo = req.query.motivo;
		const response = await axios.put('http://localhost:8080/pedidos/rechazar/' + id + '/' + motivo);

		res.status(200).json({ mensaje: response.data });
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.put('/pedidos/aceptar', async (req, res) => {
	try {
		const id = req.query.id;
		const motivo = req.query.motivo;
		const response = await axios.put('http://localhost:8080/pedidos/aceptar/' + id);

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.put('/pedidos/entregar', async (req, res) => {
	try {
		const id = req.query.id;
		const motivo = req.query.motivo;
		const response = await axios.put('http://localhost:8080/pedidos/entregar/' + id);

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.put('/pago/reembolsar', async (req, res) => {
	try {
		const idPago = req.query.idPago;
		fetch('https://api.mercadopago.com/v1/payments/' + idPago, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': tokenMP
			},
			body: JSON.stringify({
				status: 'cancelled'
			})
		})

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/mostrar-producto', async (req, res) => {
	try {
		const id = req.query.id;
		const response = await axios.get('http://localhost:8080/producto/' + id);

		let productoData = {};

		try {
			let nombre = agregarAcentos(response.data.nombre);
			let precio = agregarAcentos(response.data.precio);
			let categoria = agregarAcentos(response.data.categoria);
			let subcategoria = agregarAcentos(response.data.subcategoria);
			let datos = response.data.datos.map(agregarAcentos);
			let stock = agregarAcentos(response.data.stock);
			let titulosDescripciones = response.data.tituloD.map(agregarAcentos);
			let descripciones = response.data.descripcion.map(agregarAcentos);
			let titulosInformaciones = response.data.tituloI.map(agregarAcentos);
			let informaciones = response.data.informacion.map(agregarAcentos);

			const rutaImagen = '../../client/html-js/imagenes/' + nombre.replace(/\s/g, "");

			archivos = fs.readdirSync(rutaImagen);

			productoData = {
				nombre,
				precio,
				categoria,
				subcategoria,
				datos,
				stock,
				tituloD: titulosDescripciones,
				descripcion: descripciones,
				tituloI: titulosInformaciones,
				informacion: informaciones,
				cantidadImagenes: archivos.length
			};
		} catch (error) {
			console.log(error.message);
		}

		res.json(productoData);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/mostrar-producto-categoria', async (req, res) => {
	try {
		const categoria = req.query.categoria;
		const response = await axios.get('http://localhost:8080/producto/categoria/' + categoria);
		let productoData = {
			productos: []
		};

		cargarProductoData(productoData, response);

		res.json(productoData);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/mostrar-producto-nombre', async (req, res) => {
	try {
		var nombreBuscar = req.query.nombre;
		nombreBuscar = quitarAcentosYEnie(nombreBuscar);
		const response = await axios.get('http://localhost:8080/producto/nombre/' + nombreBuscar);

		let id = response.data.id;
		let nombre = agregarAcentos(response.data.nombre);
		let precio = agregarAcentos(response.data.precio);
		let datos = response.data.datos.map(agregarAcentos);
		let stock = agregarAcentos(response.data.stock);
		let titulosDescripciones = response.data.tituloD.map(agregarAcentos);
		let descripciones = response.data.descripcion.map(agregarAcentos);
		let titulosInformaciones = response.data.tituloI.map(agregarAcentos);
		let informaciones = response.data.informacion.map(agregarAcentos);

		const rutaImagen = '../../client/html-js/imagenes/' + nombre.replace(/\s/g, '');

		archivos = fs.readdirSync(rutaImagen);

		let producto = {
			id,
			nombre,
			precio,
			datos,
			stock,
			tituloD: titulosDescripciones,
			descripcion: descripciones,
			tituloI: titulosInformaciones,
			informacion: informaciones,
			cantidadImagenes: archivos.length
		};

		res.json(producto);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.get('/buscar-nombres', async (req, res) => {
	try {
		const response = await axios.get('http://localhost:8080/nombres');

		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

app.put('/actualizar-producto', upload.none(), async (req, res) => {
	try {
		let id = req.body.id;
		console.log(id)

		let categoria = req.body.categoria;
		let subcategoria = req.body.subcategoria;
		let nombre = quitarAcentosYEnie(req.body.nombre);
		let precio = quitarAcentosYEnie(req.body.precio);
		let datos = req.body.datos.split(',').map(quitarAcentosYEnie);
		let stock = quitarAcentosYEnie(req.body.stock);
		let titulosDescripciones = req.body.tituloD.split(',').map(quitarAcentosYEnie);
		let descripciones = req.body.descripcion.split(',').map(quitarAcentosYEnie);
		let titulosInformaciones = req.body.tituloI.split(',').map(quitarAcentosYEnie);
		let informaciones = req.body.informacion.split(',').map(quitarAcentosYEnie);

		const productoData = {
			categoria,
			subcategoria,
			nombre,
			precio,
			datos,
			stock,
			tituloD: titulosDescripciones,
			descripcion: descripciones,
			tituloI: titulosInformaciones,
			informacion: informaciones,
		};

		await axios.put('http://localhost:8080/producto/actualizar/' + id, productoData);

		res.status(200).json({ mensaje: 'Producto guardado correctamente' });

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al procesar la solicitud' });
	}
});

function cargarProductoData(productoData, response) {
	response.data.forEach(response => {
		try {
			let nombre = agregarAcentos(response.nombre);
			let precio = agregarAcentos(response.precio);
			let datos = response.datos.map(agregarAcentos);
			let stock = agregarAcentos(response.stock);
			let titulosDescripciones = response.tituloD.map(agregarAcentos);
			let descripciones = response.descripcion.map(agregarAcentos);
			let titulosInformaciones = response.tituloI.map(agregarAcentos);
			let informaciones = response.informacion.map(agregarAcentos);

			let producto = {
				nombre,
				precio,
				datos,
				stock,
				tituloD: titulosDescripciones,
				descripcion: descripciones,
				tituloI: titulosInformaciones,
				informacion: informaciones,
			};

			productoData.productos.push(producto);
		} catch (error) {
			console.log(error.message);
		}
	});
	return productoData;
}


app.get('/revisar_stock', async (req, res) => {
	try {
		const url = `http://localhost:8080/revisar_stock/${req.query.nombre}/${req.query.cantidad}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// Espera a que se resuelva la promesa antes de continuar
		const responseBody = await response.text();
		// Devuelvo el status y el cuerpo del mensaje
		res.status(response.status).send(responseBody);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Ocurrio un error al procesar el pedido, espere un momento");
	}
});

app.get('/venta/id', async (req, res) => {
	try {
		const id = req.query.id;
		const response = await axios.get('http://localhost:8080/venta/id/' + id);
		res.json(response.data);
	} catch (error) {
		console.error('Error al enviar la solicitud a la API:', error.message);
		res.status(500).send('Error interno del servidor.');
	}
});

// MERCADOPAGO

/*
mercadopago.configure({
	access_token: tokenMP,
});
*/
app.post("/create_preference", async (req, res) => {
	const items = [];

	for (let i = 0; i < req.body.requestBody.items.length; i++) {
		const item = req.body.requestBody.items[i];

		if (item.title && item.unit_price && item.quantity) {
			items.push({
				title: item.title,
				unit_price: Number(item.unit_price),
				quantity: Number(item.quantity),
			});
		}
	}

	var preference = {
		items: items,
		back_urls: {
			"success": "http://localhost:3000/compra",
			"failure": "http://localhost:3000/pago_error"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			// Devuelvo el id de la preferencia para crear el boton de MP
			res.json({
				id: response.body.id
			});
			// Almaceno los datos del cliente y de la compra
			datosCompra = {
				id: response.body.id,
				nombre: req.body.requestBody.items.map(item => item.title),
				cantidad: req.body.requestBody.items.map(item => item.quantity),
				precio: req.body.requestBody.items.map(item => item.unit_price),
				metodoPago: 'mercadopago',
				email: req.body.requestBody.cliente.email,
				celular: req.body.requestBody.cliente.celular,
				nombreCliente: req.body.requestBody.cliente.nombreCliente,
			};
		})
		.catch(function (error) {
			console.error("Error al crear la preferencia de pago:", error);
			res.status(500).json({ error: "Error al crear la preferencia de pago" });
		});
});

// Envio de consulta por gmail
const sendMail = require('./gmail');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const EMAIL_EMISOR = 'facu.granzotto5@gmail.com';
const EMAIL_RECEPTOR = 'facugranzotto05@gmail.com';

app.post('/enviar-email', async (req, res) => {
	try {
		const { nombre, email, celular, mensaje, servicio } = req.body;

		const options = {
			to: EMAIL_RECEPTOR,
			from: EMAIL_EMISOR,
			subject: servicio,
			text: `Nombre: ${nombre}\nEmail: ${email}\nCelular: ${celular}\nMensaje: ${mensaje}`,
			textEncoding: 'base64'
		};

		const messageId = await sendMail(options);
		console.log('Correo enviado');
		return messageId;
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al enviar el correo' });
	}
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
	console.log("The server is now running on Port 3000");
});
