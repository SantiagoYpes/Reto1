window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
let datable1
let datable
let count
function start() {
    //Crear Base de Datos
    let request = indexedDB.open("DB_1");
    //Verificar la creación de la base de datos
    request.onsuccess = function (e) {
        //Guardamos la base de datos en una variable (bd)
        bd = e.target.result;
        Load_Users();
    }
}

function Load_Users() {
    datable = document.getElementById("user_table")
    datable1 = document.getElementById("user_table1")
    datable.innerHTML = "";//Incrusta código HTML
    datable1.innerHTML = "";//Incrusta código HTML
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
        if(cursor.value.isactive=="1"){
            datable.innerHTML += `
			<table class="hover">                
				<tr>
					<th class="id_activos">                  
                        <input type="text" placeholder="User" value="` + cursor.value.id + `" id="id" readonly> 
					    <input type="text" placeholder="User" value="` + cursor.value.name + `" id="name" readonly> 
					</th>
				</tr>
			</table>
			<div class ="div_info" id="vision`+ count + `"></div>
			<br> `
        }
        else if(cursor.value.isactive=="0"){
            datable1.innerHTML += `
			<table class="hover">                
				<tr>
					<th class="id_inactivos">                  
                        <input type="text" placeholder="User" value="` + cursor.value.id + `" id="id" readonly> 
					    <input type="text" placeholder="User" value="` + cursor.value.name + `" id="name" readonly> 
					</th>
				</tr>
			</table>
			<div class ="div_info" id="vision`+ count + `"></div>
			<br> `
        }
        cursor.continue();
        count = count + 1;
    }
    if (count == 1) {
        datable.innerHTML = `<p> No tienes aún empleados registrados </p>`
        datable1.innerHTML = `<p> No tienes aún empleados registrados </p>`;
    }
}
window.addEventListener("load", start, false);