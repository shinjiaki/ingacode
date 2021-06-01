window.addEventListener('load', carregado);

const db = openDatabase("myDB", "1.0", "IngaCode Database", 2 * 1024 * 1024);

  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS dbAlarms ( id INTEGER PRIMARY KEY,description TEXT, type TEXT, related TEXT, date TEXT)");
  });

function carregado() {
  document.getElementById('btnAlarmEnviar').addEventListener('click', salvar);
  mostrar();
  relatedEquipmentOptions();
}

function salvar() {
  const alarmDescription = document.getElementById('alarmDescription').value;
  const alarmType = document.getElementById('alarmType').value;
  const alarmRelated = document.getElementById('alarmRelated').value;
  const alarmDate = document.getElementById('alarmDate').value.split('-');
  const formatedAlarmDate = (`${alarmDate[2]}-${alarmDate[1]}-${alarmDate[0]}`);

  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO dbAlarms (description, type, related, date) VALUES(?,?,?,?)',
    [alarmDescription, alarmType, alarmRelated, formatedAlarmDate])
  });

  mostrar();
}

function mostrar() {
  const alarmTable = document.getElementById('alarm-tbody-register');

  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM dbAlarms', [], function(tx, resultado){
      const rows = resultado.rows;
      let tr = '';
      for (let i = 0; i < rows.length; i++) {
        tr += '<tr>';
        tr += '<td>' + rows[i].description +'</td>';
        tr += '<td>' + rows[i].type +'</td>';
        tr += '<td>' + rows[i].related +'</td>';
        tr += '<td>' + rows[i].date +'</td>';
        tr += '</tr>';
      }
      
      alarmTable.innerHTML = tr;
    });
  });
}

function relatedEquipmentOptions() {
  const alarmRelated = document.getElementById('alarmRelated');

  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM dbEquipment', [], function(tx, resultado){
      const rows = resultado.rows;
      let equipmentOptions = '';
      equipmentOptions = '<option value="Nenhum">Nenhum</option>'
      for (let i = 0; i < rows.length; i++) {
        equipmentOptions += `<option value="${rows[i].nome}">${rows[i].nome}</option>`
      }
      
      alarmRelated.innerHTML = equipmentOptions;
    });
  });
}