//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa

function start() {
    btnAdd = document.getElementById("btn_add");
	btnAdd.addEventListener("click", Add_user, false);
    //Crear Base de Datos
    let request = indexedDB.open("DB_1");
    //Verificar la creación de la base de datos
    request.onsuccess = function (e) {
        //Guardamos la base de datos en una variable (bd)
        bd = e.target.result;
        //Registrar();
    }
    //Creamos el almacén de objetos (Tabla) -> Pagos - Usuarios - Administrador - Sesión Iniciada
    request.onupgradeneeded = function (e) {
        bd = e.target.result;
        //Si se requiere crear el almacén -> usuarios
        let tbUsers = bd.createObjectStore("users", { keyPath: "id" });
        //Definimos uno o varios índices secundarios
        tbUsers.createIndex("id", "id", { unique: true });
    }
}

function Add_user(){
    let name = document.getElementById("name").value
    let id = document.getElementById("id").value
    let salary = document.getElementById("salary").value
    let position = document.getElementById("position").value
    let email= document.getElementById("email").value
    let tel = document.getElementById("tel").value
    let isactive = document.getElementById("status").checked
    let status=""
    if (isactive) {
        status = "1"
    }else{
        status ="0"
    }
    //Agregamos al almacén de datos los objetos (registros)
    var transaction = bd.transaction(["users"], "readwrite");
    //Almacenamos en la variable almacen la transacción
    var store = transaction.objectStore("users");
    //Agregamos los datos del registro a los "campos"
    var agregar = store.add({id: id, name: name, salary:salary,
    email:email,position:position,tel:tel,isactive:status});
    alert("Empleado Registrado")
}

window.addEventListener("load", start, false);