//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd
let result
let cursor
function start(){
	btnLogin = document.getElementById("btnLogin");
	btnLogin.addEventListener("click", Login, false);
	//Crear Base de Datos
	let request = indexedDB.open("DB_1");
	//VerificaR la creación de la base de datos
	request.onsuccess = function(e){
		//Guardamos la base de datos en una variable (bd)
		bd = e.target.result;
		//Registrar()
	}
	//Creamos el almacén de objetos (Tabla) -> Pagos - Usuarios - Administrador - Sesión Iniciada
	/*request.onupgradeneeded = function(e){
		bd = e.target.result;
		//Si se requiere crear el almacén -> usuarios
		let tbUsers = bd.createObjectStore("users", {keyPath: "id"});
		let tbPays = bd.createObjectStore("pays", {keyPath: "id_pay"}); 
        let tbAdmin = bd.createObjectStore("admins", {keyPath: "admin"});
		let tbActive = bd.createObjectStore("active", {keyPath: "id"});
		//Definimos uno o varios índices secundarios
		tbUsers.createIndex("id", "id", { unique: true});
		tbPays.createIndex("id_pay", "id_pay", { unique: true});
		tbPays.createIndex("id_user", "id_user", { unique: false});
		tbPays.createIndex("year", "year", { unique: false}); 
        tbAdmin.createIndex("admin", "admin", { unique: true});
		tbActive.createIndex("user", "user", { unique: true});
	}
}
function Registrar(){
	alert("Registrar admin")
	//Función para agregar el admin a la BD
	//Recuperamos y Guardamos en variable los campos del formulario
	var user = "Santi1604"
	var password = "santi1234"
	//Agregamos al almacén de datos los objetos (registros)
	var transaction = bd.transaction(["admins"], "readwrite")
	//Almacenamos en la variable almacen la transacción
	var store = transaction.objectStore("admins");
	//Agregamos los datos del registro a los "campos"
	var agregar = store.add({admin: user, password: password})
	//Si agregar el objeto (registro) es exitoso, se ejecuta --> mostrar 
	alert("Usuario registrado.")
	window.open("home_admin.html", "_top")*/
}

function Login(){
	//alert("Verificando Login");
	let user = document.getElementById("user").value;
	let password = document.getElementById("password").value;
	//Creamos la transacción
	let transaction = bd.transaction(["admins"], "readwrite");
	let store = transaction.objectStore("admins");
	let index = store.index("admin");
	let request = index.openCursor(user);
	request.onsuccess = function(e){
		let cursor = e.target.result;
		if(cursor) {
			//alert("Usuario: " + cursor.value.usuario + "\n\
	               //Contraseña: " + cursor.value.password);
			var dbuser = cursor.value.admin;
			var dbpassword = cursor.value.password;
			//cursor.continue();
		}
		if (user == dbuser && password == dbpassword){
			window.open('../html/home_admin.html','_top')
			//window.open('index.html','_blank');
		}
		if (user !== dbuser || password !== dbpassword){
			alert("Usuario o contraseña inválidos");
		}
	}
}

//Se ejecuta al cargar la página
window.addEventListener("load", start, false)
