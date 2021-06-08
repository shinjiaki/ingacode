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
            <div class="alarmAndOnOff">
            <button class="btnOnOff"><img src="../../assets/on-off.png" alt="on-off" class="onOff"></button>
            <button><span class="material-icons">arrow_drop_up</span></button></button>
            <button><span class="material-icons">arrow_drop_down</span></button></button>
            <div type="button" class="collapsible">
            <img src="../../assets/down-arrow.png" alt="down-arrow" class="downArrow">
            ${rowsAlarms[i].name}
            <span class="dateIn">Entrada: ${rowsAlarms[i].dateIn}</span>
            <span class="dateOut">Saida: ${rowsAlarms[i].dateOut}</span>
            <span class="timer">Tempo Decorrido: ${rowsAlarms[i].elapsed}</span>
            <span>Ocorrências: ${rowsAlarms[i].occurrences}</span>
            <div>
            </div>
            </div>
            
            <div class="content">
            <p class="alarmsDescription">${rowsAlarms[i].description}</p>
            <p>Classificação: ${rowsAlarms[i].type}</p>
            <p>Data de cadastro: ${rowsAlarms[i].date}</p>
            <h2>Equipamento ${rowsEquip[equipIndex].nome}</h2>
            <p>Número de série: ${rowsEquip[equipIndex].numero}</p>
            <p>Tipo: ${rowsEquip[equipIndex].tipo}</p>
            <p>Data de cadastro: ${rowsEquip[equipIndex].data}</p>
            </div>
            </div>
            `
          }
          const btnOnOff = document.getElementsByClassName("btnOnOff");
          const timers = document.getElementsByClassName("timer");
          const dateIn = document.getElementsByClassName("dateIn");
          const dateOut = document.getElementsByClassName("dateOut");
          const alarmActived = [];
          for (let z = 0; z < btnOnOff.length; z++) {
            alarmActived.push(false)
          }

          for (let y = 0; y < btnOnOff.length; y++) {
            btnOnOff[y].addEventListener("click", () => {
              alarmActived[y] = !(alarmActived[y]);
              console.log('clickou')
              btnOnOff[y].firstChild.classList.toggle("active");

              let hour = 0;
              let minute = 0;
              let second = 0;
              let millisecond = 0;
              let cron;

              if(alarmActived[y] == true) {
                start();
                updateDateIn();
              } else if (alarmActived[y] == false) {
                clearInterval(cron);
                updateDateOut();
              }

              function start() {
                pause();
                cron = setInterval(() => { timer(); }, 10);
              }
              function pause() {
                clearInterval(cron);
              }
              function timer() {
                if ((millisecond += 10) == 1000) {
                  millisecond = 0;
                  second++;
                }
                if (second == 60) {
                  second = 0;
                  minute++;
                }
                if (minute == 60) {
                  minute = 0;
                  hour++;
                }
                timers[y].innerHTML = `
                  Tempo Decorrido: ${returnData(hour)}:${returnData(minute)}:${returnData(second)}
                `;
                if (alarmActived[y] == false) {
                  pause();
                }
              }
              function returnData(input) {
                return input > 9 ? input : `0${input}`
              }

              function currentDate(sp){
                today = new Date();
                let dd = today.getDate();
                let mm = today.getMonth()+1;
                let yyyy = today.getFullYear();
                
                if(dd<10) dd='0'+dd;
                if(mm<10) mm='0'+mm;
                return (dd+sp+mm+sp+yyyy);
              };

              function updateDateIn(){
                dateIn[y].innerHTML = `Entrada: ${currentDate('/')}`;
                dateOut[y].innerHTML = `Saída: dd/mm/aaaa`;
              }

              function updateDateOut(){
                dateOut[y].innerHTML = `Saída: ${currentDate('/')}`;
              }
              
  
            });
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

// const btnOnOff = document.getElementById("hi");

// btnOnOff[0].addEventListener("click", () => {
//   console.log('clickou')
// });

function searchFilter() {
  const input = document.getElementById('myInput');
  const filter = input.value.toUpperCase();
  const alarms = document.getElementsByClassName('alarmAndOnOff')
  const description = document.getElementsByClassName('alarmsDescription')

  for (i = 0; i < alarms.length; i++) {
    const txtValue = description[i].textContent || description[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      alarms[i].style.display = "";
    } else {
      alarms[i].style.display = "none";
    }
  }
}

const btnTop3 = document.getElementById('top3');

btnTop3.addEventListener("click", () => {
  const alarms = document.getElementsByClassName('alarmAndOnOff')
  const elapsed = document.getElementsByClassName('timer')
  const arrayAlarmsIndex = [];

  for (let i = 0; i < alarms.length; i++) {
    const timeSplited = elapsed[i].textContent.split(':');
    timeSplited[1].trim();
    timeSplited[3].replace('\n','')

    const hour = parseInt(timeSplited[1].trim());
    const min = parseInt(timeSplited[2]);
    const sec = parseInt(timeSplited[3].replace('\n',''));

    const totalTimeSeconds = sec + min*60 + hour*3600;

    arrayAlarmsIndex.push(totalTimeSeconds);
  }

  let top1 = 0;
  let top2 = 0;
  let top3 = 0;
  for (let i = 0; i < arrayAlarmsIndex.length; i++) {
    if (arrayAlarmsIndex[i] >= top1) {
      top1 = arrayAlarmsIndex[i]
    }    
  }
  const top2Array = [];
  for (let i = 0; i < arrayAlarmsIndex.length; i++) {
    top2Array.push(arrayAlarmsIndex[i])
  }
  top2Array.splice(arrayAlarmsIndex.indexOf(top1), 1);
  for (let i = 0; i < top2Array.length; i++) {
    if (top2Array[i] >= top2) {
      top2 = top2Array[i]
    }    
  }
  const top3Array = [];
  for (let i = 0; i < top2Array.length; i++) {
    top3Array.push(top2Array[i])
  }
  top3Array.splice(top2Array.indexOf(top2), 1)
  for (let i = 0; i < top3Array.length; i++) {
    if (top3Array[i] >= top3) {
      top3 = top3Array[i]
    }    
  }

  const top1Index = arrayAlarmsIndex.indexOf(top1)
  const top2Index = arrayAlarmsIndex.indexOf(top2)
  const top3Index = arrayAlarmsIndex.indexOf(top3)
  
  if(btnTop3.checked == true) {
    console.log('checked!')
    for (i = 0; i < alarms.length; i++) {
      if (top1Index == i || top2Index == i || top3Index == i) {
        alarms[i].style.display = "";
      } else {
        alarms[i].style.display = "none";
      }
    }
  } else if(btnTop3.checked == false) {
    for (i = 0; i < alarms.length; i++) {
      alarms[i].style.display = "";
    }
  }
});

