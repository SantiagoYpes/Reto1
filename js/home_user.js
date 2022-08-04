window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

function start() {
    btnDelete = document.getElementById("btn_log");
    btnDelete.addEventListener("click", Load_Id, false);
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
        let tbActive = bd.createObjectStore("active", { keyPath: "id" })
        //Definimos uno o varios índices secundarios
        tbActive.createIndex("id", "id", { unique: true })
    }
}
function Load_Id() {
    let transaction = bd.transaction(["active"], "readonly")
    let store = transaction.objectStore("active")
    let cursor = store.openCursor()
    //Si tiene éxito al abrir el cursor . . .
    cursor.addEventListener("success", DeleteUser, false)
}

function DeleteUser(e) {
    let cursor = e.target.result
    //Si el cursor está abierto
    if (cursor) {
        let id_active= cursor.value.id
        let transaction = bd.transaction(["active"], "readwrite")
        let store = transaction.objectStore("active")
        let request =store.delete(id_active)
        request.onsuccess = function (e) {
            alert("Sesión Cerrada")
            window.open("../html/login_user.html", "_top")
        }
        request.onerror = function (e) {
            alert("Eliminación sin éxito");
        }
    }
}
window.addEventListener("load", start, false);