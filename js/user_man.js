//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd;
let result;
let cursor;
let datable;

function start() {
    btnAdd = document.getElementById("btn_add");
	btnAdd.addEventListener("click", Redirect_Add, false);
    btnDelete = document.getElementById("btn_delete");
	btnDelete.addEventListener("click", DeleteUser, false);
    //Crear Base de Datos
    let request = indexedDB.open("DB_1");
    //Verificar la creación de la base de datos
    request.onsuccess = function (e) {
        //Guardamos la base de datos en una variable (bd)
        bd = e.target.result;
        //Registrar();
        Load_Users();
    }
    //Creamos el almacén de objetos (Tabla) -> Pagos - Usuarios - Administrador - Sesión Iniciada
    request.onupgradeneeded = function (e) {
        bd = e.target.result;
        //Si se requiere crear el almacén -> usuarios
        var tbUsers = bd.createObjectStore("users", { keyPath: "id" });
        //Definimos uno o varios índices secundarios
        tbUsers.createIndex("id", "id", { unique: true });
    }
}
/*
function Registrar(){
    //alert("Registrar usuario")
    //Función para agregar el admin a la BD
    //Recuperamos y Guardamos en variable los campos del formulario
    let name = "Santiago Yepes Zuleta"
    let id = "1193119431"
    let salary = 3000000
    let position = "Mercadeo"
    let email="santiyezu8@hotmail.com"
    let tel = "3193903929"
    let isactive = "Yes"
    //Agregamos al almacén de datos los objetos (registros)
    var transaction = bd.transaction(["users"], "readwrite");
    //Almacenamos en la variable almacen la transacción
    var store = transaction.objectStore("users");
    //Agregamos los datos del registro a los "campos"
    var agregar = store.add({id: id, name: name, salary:salary,
        email:email,position:position,tel:tel,isactive:isactive});
    //Si agregar el objeto (registro) es exitoso, se ejecuta --> mostrar 
    //alert("Usuario registrado.")
}
*/

function Load_Users() {
    datable = document.getElementById("user_table")
    count = 1;
    datable.innerHTML = "";//Incrusta código HTML
    //alert(bd)
    var transaction = bd.transaction(["users"], "readonly");
    var store = transaction.objectStore("users");
    var cursor = store.openCursor();
    //Si tiene éxito al abrir el cursor . . .
    cursor.addEventListener("success", UserTable, false);

}

function UserTable(e) {
    var cursor = e.target.result;
    //Si el cursor está abierto
    if (cursor) {
        datable.innerHTML += `
			<table class="hover">
				<tr>
					<th class="id_info">
                        <input type="text" placeholder="User `+ count + `" value="` + cursor.value.id + `" id="id` + count + `" readonly> 
					    <input type="text" placeholder="User `+ count + `" value="` + cursor.value.name + `" id="name` + count + `" readonly> 
					    <input type="text" placeholder="User `+ count + `" value="` + cursor.value.position + `" id="position` + count + `" readonly> 
                        <input type="text" placeholder="User `+ count + `" value="` + cursor.value.salary + `" id="salary` + count + `" readonly> 
                        <input type="text" placeholder="User `+ count + `" value="` + cursor.value.email + `" id="email` + count + `" readonly> 
					</th>
				</tr>
			</table>
			<div class ="div_info" id="vision`+ count + `"></div>
			<br> `
        cursor.continue();
        count = count + 1;
    }
    if (count == 1) {
        datable.innerHTML = `<p> No tienes aún empleados registrados </p>`;
    }
}
function Redirect_Add(){
    window.open('../html/add_user.html','_top')
}
function DeleteUser(){
    var id_delete = document.getElementById("current_id").value
	//Creamos la transacción
	var transaction = bd.transaction(["users"], "readwrite");
	var store = transaction.objectStore("users");
	var request =store.delete(id_delete);
	request.onsuccess = function (e){
		alert("Empleado eliminado"); 
        window.open("../html/user_man.html", "_top")
	}
	request.onerror = function (e){
	      	alert("Eliminación sin éxito");
    }
}
window.addEventListener("load", start, false);
