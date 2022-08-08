window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd
let result
let cursor
let datable
let count=1

function start() {
    //Crear Base de Datos
    let request = indexedDB.open("DB_1");
    //Verificar la creación de la base de datos
    request.onsuccess = function (e) {
        //Guardamos la base de datos en una variable (bd)
        bd = e.target.result;
        //Registrar();
        Active();
    }
}

function Active() {
    let transaction = bd.transaction(["active"], "readonly")
    let store = transaction.objectStore("active");
    let cursor = store.openCursor();
    //Si tiene éxito al abrir el cursor . . .
    cursor.addEventListener("success", Confirm, false)
}
function Confirm(e) {
    datable = document.getElementById("user_pays")
    datable.innerHTML = ""
    var cursor = e.target.result
    //Si el cursor está abierto
    if (cursor) {
        id_sesion = cursor.value.id
        //Creamos la transacción
        var transaction = bd.transaction(["pays"], "readwrite")
        var store = transaction.objectStore("pays")
        var index = store.index("id_user");
        var cursor = index.openCursor(id_sesion)
        //Si tiene éxito al abrir el cursor . . .
        cursor.addEventListener("success", showData, false)
        //cursor.continue();	
    }
}
function showData(e) {
    var cursor = e.target.result;
    //Si el cursor está abierto
    if (cursor) {
        datable.innerHTML += `
        <table class="info">
            <th class="id_info">
                <input type="text" value="`+ cursor.value.id_pay + `" readonly>
                <input type="text" value="`+ cursor.value.value + `" readonly>
                <input type="text" value="`+ cursor.value.month + `" readonly>
                <input type="text" value="`+ cursor.value.year + `" readonly>
            </th>
        </table>
			 `
        cursor.continue();
        count = count + 1;
    }
    if (count == 1) {
        datable.innerHTML = `<p> No tienes aún pagos registrados </p>`;
    }
}
window.addEventListener("load", start, false);