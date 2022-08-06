//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let db_salary=0

function start() {
    btnAdd = document.getElementById("btn_pay");
    btnAdd.addEventListener("click", Add_pay, false);
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
        let tbPays = bd.createObjectStore("pays", { keyPath: "id_pay" })
        let tbUsers = bd.createObjectStore("users", { keyPath: "id" })
        //Definimos uno o varios índices secundarios
        tbUsers.createIndex("id", "id", { unique: true })
        tbPays.createIndex("id_pay", "id_pay", { unique: true })
    }
}

function Add_pay() {
    let id_user = document.getElementById("id_user").value
    let month = document.getElementById("month_pay").value
    let year = document.getElementById("year_pay").value
    alert(year)
    let bank = document.getElementById("bank").value
    let id_pay= "128"
    //Creamos la transacción
    let transaction = bd.transaction(["users"], "readwrite");
    let store = transaction.objectStore("users");
    let index = store.index("id")
    let request = index.openCursor(id_user)
    request.onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            let db_id = cursor.value.id
            db_salary = cursor.value.salary
            if (id_user == db_id) {
                let transaction1 = bd.transaction(["pays"], "readwrite");
                //Almacenamos en la variable almacen la transacción
                let store1 = transaction1.objectStore("pays")
                //Agregamos los datos del registro a los "campos"
                let add1 = store1.add({id_pay: id_pay, id_user: id_user, year:year,
                    month:month,bank:bank,value:db_salary});
                Info()
            }
        }
        else {
                alert("Error de Pago, Usuario No Encontrado")
        }
    }
}
function Info(){
    alert("Pago Registrado")
}
window.addEventListener("load", start, false);