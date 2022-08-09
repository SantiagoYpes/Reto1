window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
let datable1
let datable2
let count
let salario_maximo=0
let salario_minimo=1200000000000000000000000000000000000000
let id_mayor_salario
let id_menor_salario
let nombre_mayor_salario
let nombre_menor_salario
let max
let min
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
    datable1 = document.getElementById("user_table1")
    datable2 = document.getElementById("user_table2")
    count = 1;
    datable1.innerHTML = "";//Incrusta código HTML
    datable2.innerHTML = "";//Incrusta código HTML
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
        let salario=(parseInt(cursor.value.salary))
        if(salario>=salario_maximo){
            salario_maximo=salario
            id_mayor_salario=cursor.value.id
            nombre_mayor_salario=cursor.value.name
            max=salario
            datable1.innerHTML = ""
            datable1.innerHTML += `
			<table class="hover">                
				<tr>
					<th class="id_mayor">                  
                        <input type="text" placeholder="User `+ count + `" value="` + id_mayor_salario + `" id="id` + count + `" readonly> 
					    <input type="text" placeholder="User `+ count + `" value="` + nombre_mayor_salario + `" id="name` + count + `" readonly> 
                        <input type="text" placeholder="User `+ count + `" value="` + max + `" id="salary` + count + `" readonly>  
					</th>
				</tr>
			</table>
			<div class ="div_info" id="vision`+ count + `"></div>
			<br> `
        }
        else if(salario<=salario_minimo){
            salario_minimo=salario
            id_menor_salario=cursor.value.id
            nombre_menor_salario=cursor.value.name
            min=salario
            datable2.innerHTML = ""
            datable2.innerHTML += `
			<table class="hover">                
				<tr>
					<th class="id_mayor">                  
                        <input type="text" placeholder="User `+ count + `" value="` + id_menor_salario + `" id="id` + count + `" readonly> 
					    <input type="text" placeholder="User `+ count + `" value="` + nombre_menor_salario + `" id="name` + count + `" readonly> 
                        <input type="text" placeholder="User `+ count + `" value="` + min + `" id="salary` + count + `" readonly>  
					</th>
				</tr>
			</table>
			<div class ="div_info" id="vision`+ count + `"></div>
			<br> `
        }
        cursor.continue();
        count = count + 1;
    }
}
window.addEventListener("load", start, false);