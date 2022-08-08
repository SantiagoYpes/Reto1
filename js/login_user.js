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
	}
}

function Login(){
	//alert("Verificando Login");
	let user = document.getElementById("user").value;
	//Creamos la transacción
	let transaction = bd.transaction(["users"], "readwrite");
	let store = transaction.objectStore("users");
	let index = store.index("id")
	let request = index.openCursor(user);
	request.onsuccess = function(e){
		let cursor = e.target.result;
		if(cursor) {
			//alert("Usuario: " + cursor.value.usuario + "\n\
	               //Contraseña: " + cursor.value.password);
			var dbuser = cursor.value.id;
			var dbactive = cursor.value.isactive
			//cursor.continue();
		}
		if (user == dbuser && dbactive=="1"){
            Add_sesion(user)
			window.open('../html/home_user.html','_top')
            

		}
		else{
			alert("Usuario incorrecto o sesión inactiva")
		}
	}
}


function Add_sesion(user){
    //Agregamos al almacén de datos los objetos (registros)
    var transaction = bd.transaction(["active"], "readwrite");
    //Almacenamos en la variable almacen la transacción
    
    var store = transaction.objectStore("active");
    //Agregamos los datos del registro a los "campos"
    var add = store.add({id: user});
}

//Se ejecuta al cargar la página
window.addEventListener("load", start, false);