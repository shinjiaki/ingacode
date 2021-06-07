window.addEventListener('load', carregado);

const db = openDatabase("myDB", "1.0", "IngaCode Database", 2 * 1024 * 1024);

db.transaction(function(tx) {
  tx.executeSql("CREATE TABLE IF NOT EXISTS dbEquipment ( id INTEGER PRIMARY KEY,nome TEXT, numero TEXT, tipo TEXT, data TEXT)");
});

function carregado() {
  const btnEquipmentEnviar = document.getElementById('btnEquipmentEnviar');
  
  btnEquipmentEnviar.addEventListener('click', salvar);
  mostrar();
}

function salvar() {
  const equipmentId = document.getElementById('equipmentId').value;
  const equipmentName = document.getElementById('equipmentName').value;
  const equipmentNumber = document.getElementById('equipmentNumber').value;
  const equipmentType = document.getElementById('equipmentType').value;
  const equipmentDate = document.getElementById('equipmentDate').value.split('-');
  const formatedEquipmentDate = (`${equipmentDate[2]}-${equipmentDate[1]}-${equipmentDate[0]}`);

  db.transaction(function(tx) {
    if (equipmentId) {
      tx.executeSql('UPDATE dbEquipment SET nome=?, numero=?, tipo=?, data=? WHERE id=?',
      [equipmentName, equipmentNumber, equipmentType, formatedEquipmentDate, equipmentId]);
    } else {
    tx.executeSql('INSERT INTO dbEquipment (nome, numero, tipo, data) VALUES(?,?,?,?)',
    [equipmentName, equipmentNumber, equipmentType, formatedEquipmentDate])
    }
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
        tr += '<td><button onClick="atualizar(' + rows[i].id + ')" class="button">Edit</button></td>';
        tr += '<td><button onClick="deletar(' + rows[i].id + ')" class="button">Delete</button></td>';
        tr += '</tr>';
      }
      
      equipmentTable.innerHTML = tr;
    });
  });
}

function atualizar(rowId) {
  const id = document.getElementById('equipmentId');
  const name = document.getElementById('equipmentName');
  const number = document.getElementById('equipmentNumber');
  const type = document.getElementById('equipmentType');
  const date = document.getElementById('equipmentDate');
  const btnAtualizar = document.getElementById('btnEquipmentEnviar');

  id.value = rowId;

  db.transaction(function(tx) {
    tx.executeSql('SELECT * FROM dbEquipment WHERE id=?', [rowId], function(tx, resultado) {
      const rows = resultado.rows[0];
      const parsedRowsDate = rows.data.split('-');
      const formatedRowsDate = (`${parsedRowsDate[2]}-${parsedRowsDate[1]}-${parsedRowsDate[0]}`);

      name.value = rows.nome;
      number.value = rows.numero;
      type.value = rows.tipo;
      date.value = formatedRowsDate;
    });
  });

  btnAtualizar.innerHTML = 'Atualizar';
  window.scrollTo(0,0); //In case the page is too long, go to the top.

}

function deletar(rowId) {
  db.transaction(function(tx) {
    tx.executeSql('DELETE FROM dbEquipment WHERE id=?', [rowId]);
  });

  mostrar();
  location.reload();
}

enableDisable();

function enableDisable() {
  const btnEquipmentEnviar = document.getElementById('btnEquipmentEnviar');
  const equipmentName = document.getElementById('equipmentName').value;
  const equipmentNumber = document.getElementById('equipmentNumber').value;
  const equipmentDate = document.getElementById('equipmentDate').value;
  if (equipmentName.trim() != "" && equipmentNumber.trim() != "" && equipmentDate.trim() != "") {
    btnEquipmentEnviar.disabled = false;
  } else {
    btnEquipmentEnviar.disabled = true;
  }
};