//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd
let id_sesion
let total_in = 0
let total_out = 0
let pays = []
let year
let certi_datain
let certi_dataout
let message
function start() {
    btnLogin = document.getElementById("btn_con")
    btnLogin.addEventListener("click", ConfirmUser, false)
    //Crear Base de Datos
    let request = indexedDB.open("DB_1");
    //VerificaR la creación de la base de datos
    request.onsuccess = function (e) {
        //Guardamos la base de datos en una variable (bd)
        bd = e.target.result;
        //Registrar()
        //ConfirmUser()
    }
    //Creamos el almacén de objetos (Tabla) -> Pagos - Usuarios - Administrador - Sesión Iniciada
    request.onupgradeneeded = function (e) {
        bd = e.target.result;
        //Si se requiere crear el almacén -> usuarios
        let tbUsers = bd.createObjectStore("users", { keyPath: "id" });
        let tbPays = bd.createObjectStore("pays", { keyPath: "id_pay" });
        let tbActive = bd.createObjectStore("active", { keyPath: "id" });
        //Definimos uno o varios índices secundarios
        tbUsers.createIndex("id", "id", { unique: true });
        tbPays.createIndex("id_pay", "id_pay", { unique: true });
        tbPays.createIndex("id_user", "id_user", { unique: false });
        tbPays.createIndex("year", "year", { unique: false });
        tbActive.createIndex("user", "user", { unique: true });
    }
}
function ConfirmUser() {
    document.getElementById('cert').style.display = ''
    document.getElementById('head').style.display = ''
    year = parseInt(document.getElementById("cert_year").value)
    document.getElementById("incerti_date").value = document.getElementById("incerti_date").value + year - 1
    document.getElementById("lastcerti_date").value = document.getElementById("lastcerti_date").value + year
    const time = Date.now()
    const today = new Date(time)
    document.getElementById("current_date").value = today.toLocaleDateString()
    let transaction = bd.transaction(["active"], "readonly")
    let store = transaction.objectStore("active");
    let cursor = store.openCursor();
    //Si tiene éxito al abrir el cursor . . .
    cursor.addEventListener("success", Confirm, false)
}
function Confirm(e) {
    certi_datain = document.getElementById("inner_certin")
    certi_dataout = document.getElementById("inner_certout")
    datable = document.getElementById("user_table")
    //datable.innerHTML = ""
    var cursor = e.target.result
    //Si el cursor está abierto
    if (cursor) {
        id_sesion = cursor.value.id
        //Creamos la transacción
        var transaction = bd.transaction(["users"], "readwrite")
        var store = transaction.objectStore("users")
        var index = store.index("id");
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
                <input type="text" value="`+ cursor.value.id + `" readonly>
                <input type="text" value="`+ cursor.value.name + `" readonly>
                <input type="text" value="`+ cursor.value.position + `" readonly>
            </th>
        </table>
        <br>`
        document.getElementById("id_certi").value = cursor.value.id
        document.getElementById("name_certi").value = cursor.value.name
        document.getElementById('obj').style.display = ''
        var transaction1 = bd.transaction(["pays"], "readwrite")
        var store1 = transaction1.objectStore("pays")
        var index1 = store1.index("id_user");
        var cursor1 = index1.openCursor(id_sesion)
        //Si tiene éxito al abrir el cursor . . .
        cursor1.addEventListener("success", GetPays, false)

    }
}
function GetPays(e) {
    message=document.getElementById("user_mas")
    year = document.getElementById("cert_year").value
    var cursor1 = e.target.result;
    //Si el cursor está abierto
    if (cursor1) {
        if (cursor1.value.year == year) {
            current = parseInt(cursor1.value.value)
            total_in += current
            total_out += current * 0.2
            certi_datain.innerHTML += `
                <tr>
                    <th class="desc1"> `+ cursor1.value.id_pay + `: Pago de Salario Mes
                    `+ cursor1.value.month + `
                    </th>
                    <th class="value1"><input type="text" placeholder="value" value="`+ current + `" readonly></th>
                </tr>
                `
            certi_dataout.innerHTML += `
                <tr>
                    <th class="desc1"> `+ cursor1.value.id_pay + `: Retencion por Pago de Salario Mes
                    `+ cursor1.value.month + `
                    </th>
                    <th class="value1"><input type="text" placeholder="value" value="`+current*0.2 + `" readonly></th>
                </tr>
                `
            document.getElementById("in").value = total_in
            document.getElementById("out").value = total_out
            document.getElementById("total_inp").value = total_in
            document.getElementById("total_outp").value = total_out
            cursor1.continue()
        }
        else{
            cursor1.continue()
        }
    }
}


window.addEventListener("load", start, false)