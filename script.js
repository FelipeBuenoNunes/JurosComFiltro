const [nameOfClient, dueDate, valuePur] = document.querySelector("form:first-of-type");

const accountOfClient = [];

function createAccount(nameClient, date, value){
    return { nameClient: nameClient, dueDate: date, valuePur: value, days: "", fee: "", all: "" };
}

function printCadaster(){
    let nameClient = nameOfClient.value;
    let date = dueDate.value;
    let value = valuePur.value;
    document.querySelector("form:first-of-type").reset();
    if(nameClient && date && value){
        accountOfClient.push(new createAccount(nameClient, date, value)); 
        print(accountOfClient);
        return;
    }
    window.alert("Conta não cadastrada. Digite tudo corretamente");
}

function print(accClient){
    const group = document.querySelector("tbody");
    group.innerHTML = `<tr id="headerTable">
    <th>Nome do cliente</th>
    <th>Data do vencimento</th>
    <th>Valor da compra</th>
    <th>Dias</th>
    <th>Juros</th>
    <th>Total</th>
    </tr>`;
    accClient.forEach(element => {
        let tr = document.createElement("tr");
        Object.values(element).forEach(
            (elem) => {
                let td = document.createElement("td");
                td.innerText = elem;
                tr.appendChild(td);
                (elem);
            }
        );
        group.appendChild(tr);
    });
}

function calcDate(){
    const allDate = accountOfClient.map(
        (element) => {
            let mili = Date.parse(element.dueDate);
            mili = new Date(mili);
            let mile = new Date(Date.now());
            let dif = parseInt((mile - mili)/86400000)
            element.days = dif;
            return (dif < 0 ? 0 : dif);
        }
    );
    return allDate;
}

function calc(){
    const allDate = calcDate();
    accountOfClient.forEach(
        (elem, index) => {
            let value = parseInt(elem.valuePur);
            value += (value * 0.02)
            value += (value * (0.001 * allDate[index]));
            if(allDate[index] == 0)
                value = parseInt(elem.valuePur);
            elem.fee = (value - elem.valuePur).toFixed(2);
            elem.all = value.toFixed(2);
        }
    );
    print(accountOfClient);
}

function listForDate(){
    const listOfClient = accountOfClient.slice();
    listOfClient.sort( (elem0, elem1) => (elem0.days < elem1.days ? -1 : elem0.days > elem1.days ? 1 : 0));
    printTableForClient(listOfClient);
    print(listOfClient);
}

function listClient(){
    const listOfClient = accountOfClient.slice();
    listOfClient.sort(sortFunc);
    printTableForClient(listOfClient);
    print(listOfClient);
}
function sortFunc(itenA, itenB){
    itenA = itenA.nameClient.toUpperCase();
    itenB = itenB.nameClient.toUpperCase();
    return itenA < itenB ? -1 : itenA > itenB ? 1 : 0;
}

function printTableForClient(listOfClients){
    const newTable = listOfClients.reduce(tableForClient, {}); 

    let table = document.querySelector(".tableLast");
    if(!table){
        table = document.createElement("table");
        table.className = "tableLast";
        document.querySelector("main").appendChild(table);
    }
    table.innerHTML = `<tr id="headerTable">
    <th>Nome do cliente</th>
    <th>Valor a pagar</th>
    </tr>
    `;
    Object.values(newTable).forEach(
        (elem) => {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.innerText = elem.nameClient;
            let td2 = document.createElement("td");
            td2.innerText = elem.cont.toFixed(2);
            tr.appendChild(td);
            tr.appendChild(td2);
            document.querySelector(".tableLast > tbody").appendChild(tr);
        }
    );
}

function tableForClient(acc, cur){
    const key = cur.nameClient;
    if(!acc[key])
        acc[key] = {nameClient: key, cont: 0};
    acc[key].cont += parseFloat(cur.all);

    return acc;
}

function filter(){
    let [startDate, lastDate, valueMin, valueMax] = document.querySelectorAll(".filterClass");
    valueMin = !valueMin.value ? 0 : parseFloat(valueMin.value);
    valueMax = !valueMax.value ? Infinity : parseFloat(valueMax.value);
    startDate = !startDate.value ? "0" : startDate.value;
    lastDate = !lastDate.value ? Infinity + "a" : lastDate.value;

    const lastFirstFilter = accountOfClient.filter( value => {
        return parseFloat(value.valuePur) <= valueMax && parseFloat(value.valuePur) >= valueMin;
    });
    const lastFilters = lastFirstFilter.filter(
        value => {
            return value.dueDate >= startDate && value.dueDate <= lastDate;
        }
    );
    print(lastFilters);
}