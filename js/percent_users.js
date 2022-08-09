//JavaScript Document

//Para que IndexedDB funcione en todos los navegadores
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
//Definimos las variables generales del Programa
let bd
let count = 0
let pays = []
let users = []
let year
let dec = 0
function start() {
    btnLogin = document.getElementById("btn_con")
    btnLogin.addEventListener("click", Percent, false)
    datable = document.getElementById("user_table1")
    datable.innerHTML = ""
    //Crear Base de Datos
    let request = indexedDB.open("DB_1");
    //VerificaR la creación de la base de datos
    request.onsuccess = function (e) {
        //Guardamos la base de datos en una variable (bd)
        bd = e.target.result
        ConfirmUser()
        Confirmpay()
    }
}
function ConfirmUser() {
    let transaction = bd.transaction(["users"], "readonly")
    let store = transaction.objectStore("users")
    let cursor = store.openCursor()
    //Si tiene éxito al abrir el cursor . . .
    cursor.addEventListener("success", Confirm1, false)
}
function Confirm1(e) {
    datable = document.getElementById("user_table1")
    var cursor = e.target.result
    //Si el cursor está abierto
    if (cursor) {
        users.push(
            {
                id: cursor.value.id,
            }
        )
        cursor.continue()
    }
}

function Confirmpay() {
    let transaction = bd.transaction(["pays"], "readonly")
    let store = transaction.objectStore("pays")
    let cursor = store.openCursor()
    //Si tiene éxito al abrir el cursor . . .
    cursor.addEventListener("success", Confirm, false)
}
function Confirm(e) {
    var cursor = e.target.result
    //Si el cursor está abierto
    if (cursor) {
        pays.push(
            {
                id_user: cursor.value.id_user,
                value: cursor.value.value,
                year: cursor.value.year
            }
        )
        cursor.continue()
    }
}

function Percent() {
    year = document.getElementById("cert_year").value
    users.forEach(function (user) {
        pays.forEach(function (pay) {
            if (user.id == pay.id_user && pay.year == year) {
                dec += parseInt(pay.value)

            }
        })
        if (dec >= 50000000) {
            count += 1
            dec = 0
        }
    })
    let total = parseInt(users.length)
    let nodecla = total-count
    let decla = count * 100 / total
    let declano = 100 - decla
    datable.innerHTML = `
    <table class="hover">                
        <tr>
            <th class="id_mayor">                  
                <input type="text"" value="` + count + `" id="si" readonly> 
                <input type="text"" value="` + nodecla + `" id="no" readonly>   
            </th>
        </tr>
    </table>
    <table class="hover">                
        <tr>
            <th class="id_mayor">                  
                <input type="text"" value="` + decla + `%" id="si" readonly> 
                <input type="text"" value="` + declano + `%" id="no" readonly>   
            </th>
        </tr>
    </table>
    <div class ="div_info" id="vision`+ count + `"></div>
    <br> `
}


window.addEventListener("load", start, false)