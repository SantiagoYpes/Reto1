//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB || 
window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd
let result
let cursor
let id_sesion

function iniciar(){
	//Verificamos la creación de la base de datos  
	btnUpdate = document.getElementById("btn_update")
	btnUpdate.addEventListener("click", Update, false)
    btnHome = document.getElementById("home")
	btnHome.addEventListener("click", DeleteUser, false)
	let request = indexedDB.open("DB_1");
	request.onsuccess = function(e){
		//Guardamos la base de datos en una variable (bd)
		bd = e.target.result;
		//alert("La Base de Datos se creó con éxito");
		ViewProfile();
	}
}

function ViewProfile(){
	let transaction = bd.transaction(["active"], "readonly");
	let store = transaction.objectStore("active");
	let cursor = store.openCursor();
	//Si tiene éxito al abrir el cursor . . .
	cursor.addEventListener("success", Confirm, false);
}
function Confirm(e){
	//alert("Mostrar Datos Usuarios");
	var cursor = e.target.result;
	//Si el cursor está abierto
	if(cursor) {
        id_sesion=cursor.value.id
        //Creamos la transacción
	    var transaction = bd.transaction(["users"], "readwrite");
	    var store = transaction.objectStore("users");
	    var index = store.index("id");
	    var cursor = index.openCursor(id_sesion);
	    //Si tiene éxito al abrir el cursor . . .
	    cursor.addEventListener("success", showData, false);
		//cursor.continue();	
	}
}
function showData(e){
	var cursor = e.target.result;
	//Si el cursor está abierto
	if(cursor) {
        document.getElementById("id").value = cursor.value.id
		document.getElementById("name").value = cursor.value.name
		document.getElementById("salary").value = cursor.value.salary
		document.getElementById("position").value = cursor.value.position
        document.getElementById("email").value = cursor.value.email
		document.getElementById("tel").value = cursor.value.tel	
	}
    else{
		alert("Este empleado no existe")
        DeleteUser()
    }
} 
function Update(){
    let id = document.getElementById("id").value  
    let name = document.getElementById("name").value 
    let salary=document.getElementById("salary").value
    let position = document.getElementById("position").value
    let email = document.getElementById("email").value
    let tel = document.getElementById("tel").value
    let isactive = document.getElementById("status").checked
    let status=""
    if (isactive) {
        status = "1"
    }else{
        status ="0"
    }
	//Creamos la transacción
	var transaction = bd.transaction(["users"], "readwrite");
	var store = transaction.objectStore("users");
	var request = store.put({name: name, id: id, salary: salary, position: position,
        email:email, tel:tel,isactive:status});
	request.onsuccess = function (e){
		alert("Los datos se han actualizado correctamente")
        DeleteUser()
	}
	request.onerror = function (e){
	      	alert("Actualización sin éxito");
	}
}
function DeleteUser(){
	//Creamos la transacción
	var transaction = bd.transaction(["active"], "readwrite");
	var store = transaction.objectStore("active");
	var request =store.delete(id_sesion);
	request.onsuccess = function (e){
        window.open("../html/user_man.html", "_top")
	}
	request.onerror = function (e){
	      	alert("Eliminación sin éxito");
    }
}
window.addEventListener("load", iniciar, false);