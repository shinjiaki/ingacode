window.addEventListener('load', carregado);

const db = openDatabase("myDB", "1.0", "IngaCode Database", 2 * 1024 * 1024);

  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS dbEquipment ( id INTEGER PRIMARY KEY,nome TEXT, numero TEXT, tipo TEXT, data TEXT)");
  });

function carregado() {
  document.getElementById('btnEquipmentEnviar').addEventListener('click', salvar);
  mostrar();
}

function salvar() {
  const equipmentName = document.getElementById('equipmentName').value;
  const equipmentNumber = document.getElementById('equipmentNumber').value;
  const equipmentType = document.getElementById('equipmentType').value;
  const equipmentDate = document.getElementById('equipmentDate').value.split('-');
  const formatedEquipmentDate = (`${equipmentDate[2]}-${equipmentDate[1]}-${equipmentDate[0]}`);

  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO dbEquipment (nome, numero, tipo, data) VALUES(?,?,?,?)',
    [equipmentName, equipmentNumber, equipmentType, formatedEquipmentDate])
  });

  mostrar();
}

function mostrar() {
  const equipmentTable = document.getElementById('equipment-tbody-register');

  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM dbEquipment', [], function(tx, resultado){
      const rows = resultado.rows;
      let tr = '';
      for (let i = 0; i < rows.length; i++) {
        tr += '<tr>';
        tr += '<td>' + rows[i].nome +'</td>';
        tr += '<td>' + rows[i].numero +'</td>';
        tr += '<td>' + rows[i].tipo +'</td>';
        tr += '<td>' + rows[i].data +'</td>';
        tr += '</tr>';
      }
      
      equipmentTable.innerHTML = tr;
    });
  });
}
