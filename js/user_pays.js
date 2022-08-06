window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd;
let result;
let cursor;
let datable;

function start() {
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
        let tbPays = bd.createObjectStore("pays", { keyPath: "id_pay" });
        let tbActive = bd.createObjectStore("active", { keyPath: "id" });
        //Definimos uno o varios índices secundarios
        tbUsers.createIndex("id", "id", { unique: true });
        tbPays.createIndex("id_pay", "id_pay", { unique: true });
        tbPays.createIndex("id_user", "id_user", { unique: false });
    }
}
function GetInfo(e) {
    var cursor = e.target.result;
    //Si el cursor está abierto
    if (cursor) {
        datable.innerHTML += `
			<table class="hover">
				<tr>
					<th class="id_info">
                        <input type="text" placeholder="User `+ count + `" value="` + cursor.value.id + `" id="paymentDay` + count + `" readonly> 
					    <input type="text" placeholder="User `+ count + `" value="` + cursor.value.name + `" id="pay` + count + `" readonly> 
					</th>
				</tr>
			</table>
			<div class ="div_info" id="vision`+ count + `"></div>
			<br> `
        cursor.continue();
        count = count + 1;
    }
    if (count == 1) {
        datable.innerHTML = `<p> No tienes aún pagos registrados </p>`;
    }
}
window.addEventListener("load", start, false);