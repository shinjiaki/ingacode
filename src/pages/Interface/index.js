const db = openDatabase("myDB", "1.0", "IngaCode Database", 2 * 1024 * 1024);


mostrarAlarmes();

function mostrarAlarmes() {
  const alarmDisplay = document.getElementById('displayAlarms');
  
  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM dbEquipment', [], function(tx, resultadoEquip){
      const rowsEquip = resultadoEquip.rows;

      db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM dbAlarms', [], function(tx, resultado){
          const rowsAlarms = resultado.rows;
          alarmDisplay.innerHTML = '';
          for (let i = 0; i < rowsAlarms.length; i++) {
            let equipIndex = 0;
            for (let x = 0; x < rowsEquip.length; x++) {
              if (rowsEquip[x].nome == rowsAlarms[i].related) {
                equipIndex = x;
              }
            }
            alarmDisplay.innerHTML +=
            `
            <button type="button" class="collapsible">
            <img src="../../assets/down-arrow.png" alt="down-arrow" class="downArrow">
            ${rowsAlarms[i].name}
            <span id="dateIn">Entrada: ${rowsAlarms[i].dateIn}</span>
            <span>Saida: ${rowsAlarms[i].dateOut}</span>
            <span>Tempo Decorrido: ${rowsAlarms[i].elapsed}</span>
            <div>
            <img src="../../assets/on-off.png" alt="on-off" class="onOff">
            </div>
            </button>
            
            <div class="content">
            <p>${rowsAlarms[i].description}</p>
            <p>Classificação: ${rowsAlarms[i].type}</p>
            <p>Data de cadastro: ${rowsAlarms[i].date}</p>
            <h2>Equipamento ${rowsEquip[equipIndex].nome}</h2>
            <p>Número de série: ${rowsEquip[equipIndex].numero}</p>
            <p>Tipo: ${rowsEquip[equipIndex].tipo}</p>
            <p>Data de cadastro: ${rowsEquip[equipIndex].data}</p>
            </div>
            `
          }
        });
      });
    });
  });  
}

function dbEquipamentos(row, equipment) {
  const result = {}

  db.transaction(function(tx) {
    tx.executeSql(`SELECT ${row} FROM dbEquipment WHERE nome='${equipment}'`, [], function(tx, resultado){
      const rowsEquipment = resultado.rows;
      result.equipment = rowsEquipment[0][row];
    });
  });
  return result.equipment;
  
}

window.setTimeout(collapsibleHandle, 50); //need to wait some seconds to execute this function because of the database read

function collapsibleHandle() {
  const coll = document.getElementsByClassName("collapsible");

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
          content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }
}
