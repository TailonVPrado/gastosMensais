function doPost(e) {
  //let obj = {"quantidadeParcercela":"1","tipoMovimentacao":"despesa","data":"2024-09-30","descricao":"","responsavelMovimentacao":"tailon","tipo":"comida","formaPagamento":"debito","valor":"10"};
  let obj = e.parameter;
  saveSheetIntegracao(obj);
  
  saveMainSheet(obj);

  return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Dados enviados com sucesso!"})).setMimeType(ContentService.MimeType.JSON);
}

function saveSheetIntegracao(obj){
  let name = 'integracao';
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if(!sheet){
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
  }
  // let sheet = returnSheet('integracao');
  let rowSheet = getLastRow(sheet);
  if(rowSheet == 1){
    sheet.getRange(rowSheet, 1).setValue("Data");
    sheet.getRange(rowSheet, 2).setValue("JSON");
    rowSheet++;
  }
  sheet.getRange(rowSheet, 1).setValue(new Date());
  sheet.getRange(rowSheet, 2).setValue(JSON.stringify(obj));
}

function saveMainSheet(obj){
  if(!obj.data){
    obj.data = new Date();
  }else{
    obj.data = new Date(obj.data);
    obj.data.setDate(obj.data.getDate() + 1)
  }

  if(obj.tipoMovimentacao == 'despesa'){
    if(obj.formaPagamento != 'credito'){
      let sheet = createMainSheet(obj.data);
      let rowSheet = getLastRow(sheet);

      paintRow(sheet, rowSheet);

      sheet.getRange(rowSheet, 1).setValue(firstUpper(obj.responsavelMovimentacao));
      sheet.getRange(rowSheet, 2).setValue(firstUpper(obj.tipoMovimentacao));
      sheet.getRange(rowSheet, 3).setValue(firstUpper(obj.tipo));
      sheet.getRange(rowSheet, 4).setValue(obj.data);
      sheet.getRange(rowSheet, 5).setValue(obj.descricao);
      sheet.getRange(rowSheet, 6).setValue(firstUpper(obj.formaPagamento));
      sheet.getRange(rowSheet, 7).setValue("");
      sheet.getRange(rowSheet, 8).setValue(obj.valor);
      
      sheet.getRange(rowSheet, 8).setBackground('#faa5a5');//VERMELHO
      
    }else{
      let dataViradaCartao = '';
      if(obj.responsavelMovimentacao == 'larissa'){
        dataViradaCartao = new Date(`${obj.data.getMonth()+1}/23/${obj.data.getFullYear()}`);//TODO
      }else if(obj.responsavelMovimentacao == 'tailon'){
        dataViradaCartao = new Date(`${obj.data.getMonth()+1}/01/${obj.data.getFullYear()}`);
      }
      if(dataViradaCartao){
        let proxFatura = 1;
        if(dataViradaCartao.getTime() < obj.data.getTime() && obj.responsavelMovimentacao == 'larissa'){
          proxFatura = 2;
        }

        let dateLoop = new Date(`${obj.data.getMonth()+1}/01/${obj.data.getFullYear()}`);
        for(let i = 0; i < obj.quantidadeParcercela; i++){
          if(i == 0){
            dateLoop = addMonths(dateLoop, proxFatura)
          }else{
            dateLoop = addMonths(dateLoop, 1)
          }

          sheet = createMainSheet(dateLoop);
          let rowSheetLoop = getLastRow(sheet);
          
          paintRow(sheet, rowSheetLoop);

          sheet.getRange(rowSheetLoop, 1).setValue(firstUpper(obj.responsavelMovimentacao));
          sheet.getRange(rowSheetLoop, 2).setValue(firstUpper(obj.tipoMovimentacao));
          sheet.getRange(rowSheetLoop, 3).setValue(firstUpper(obj.tipo));
          sheet.getRange(rowSheetLoop, 4).setValue(obj.data);
          sheet.getRange(rowSheetLoop, 5).setValue(obj.descricao);
          sheet.getRange(rowSheetLoop, 6).setValue("Crédito");
          sheet.getRange(rowSheetLoop, 7).setValue(`${i+1}/${obj.quantidadeParcercela}`);
          sheet.getRange(rowSheetLoop, 8).setValue(obj.valor/obj.quantidadeParcercela);
          sheet.getRange(rowSheetLoop, 8).setBackground('#faa5a5');//VERMELHO
        }
      }
      
    }
  }else{
    let sheet = createMainSheet(obj.data)
    let rowSheet = getLastRow(sheet);
    
    paintRow(sheet, rowSheet);
    
    sheet.getRange(rowSheet, 1).setValue(firstUpper(obj.responsavelMovimentacao));
    sheet.getRange(rowSheet, 2).setValue(firstUpper(obj.tipoMovimentacao));
    sheet.getRange(rowSheet, 3).setValue(firstUpper(obj.tipo));
    sheet.getRange(rowSheet, 4).setValue(obj.data);
    sheet.getRange(rowSheet, 5).setValue(obj.descricao);
    sheet.getRange(rowSheet, 6).setValue("");
    sheet.getRange(rowSheet, 7).setValue("");
    sheet.getRange(rowSheet, 8).setValue(obj.valor);

    sheet.getRange(rowSheet, 8).setBackground('#96ffaf');//VERDE
  }
}

function createMainSheet(date){
  let nameSheet = (date).getMonth()+ 1 +'/'+ (date).getFullYear().toString().substring(2,4);
  if(nameSheet.split('/')[0].length == 1){
    nameSheet = '0'+nameSheet;
  }
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nameSheet)
  if(!sheet){
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(nameSheet);
    // sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nameSheet)
  }  

  let rowSheet = getLastRow(sheet);


  if(rowSheet == 1){
    sheet.getRange(rowSheet, 1).setValue("Responsável");

    sheet.getRange(rowSheet, 2).setValue("Tipo da Mov.");
    sheet.setColumnWidth(2, 80);
    sheet.getRange('B:B').setHorizontalAlignment('center');
    
    sheet.getRange(rowSheet, 3).setValue("Tipo");
    sheet.getRange('C:C').setHorizontalAlignment('center');

    sheet.getRange(rowSheet, 4).setValue("Data");
    sheet.getRange('D:D').setHorizontalAlignment('center');

    sheet.getRange(rowSheet, 5).setValue("Descrição");
    sheet.getRange('E:E').setHorizontalAlignment('left');
    sheet.setColumnWidth(5, 200);

    sheet.getRange(rowSheet, 6).setValue("Forma de Pgto");
    sheet.getRange('F:F').setHorizontalAlignment('center');
    
    sheet.getRange(rowSheet, 7).setValue("Parc.");
    sheet.setColumnWidth(7, 60);
    sheet.getRange('G:G').setHorizontalAlignment('center');

    sheet.getRange(rowSheet, 8).setValue("Valor");
    sheet.setColumnWidth(8, 120);
    sheet.getRange('H:H').setHorizontalAlignment('right');
    sheet.getRange('H2:H').setNumberFormat('R$ #,##0.00');

    sheet.getRange('A1:H1').setFontWeight('bold');
    sheet.getRange('A1:H1').setBackground('#D9D9D9');//CINZA ESCURO

    createSumMainSheet(sheet);
  }
  return sheet;
}

function createSumMainSheet(sheet){
  sheet.getRange(1, 13).setValue("Receitas");
  sheet.getRange(1, 14).setValue("Despesas");
  sheet.getRange(1, 15).setValue("Total");
  
  
  sheet.getRange(2, 12).setValue("Larissa");
  sheet.getRange(2, 13).setFormula('=SUMIFS(H2:H; A2:A; "Larissa"; B2:B; "Receita")');
  sheet.getRange(2, 14).setFormula('=SUMIFS(H2:H; A2:A; "Larissa"; B2:B; "Despesa")');
  sheet.getRange(2, 15).setValue("=M2-N2");
  sheet.setColumnWidth(12, 80);
  sheet.getRange('M1:M1').setHorizontalAlignment('right');
  
  sheet.getRange(3, 12).setValue("Tailon");
  sheet.getRange(3, 13).setFormula('=SUMIFS(H2:H; A2:A; "Tailon"; B2:B; "Receita")');
  sheet.getRange(3, 14).setFormula('=SUMIFS(H2:H; A2:A; "Tailon"; B2:B; "Despesa")');
  sheet.getRange(3, 15).setValue("=M3-N3");
  sheet.getRange('N1:N1').setHorizontalAlignment('right');

  sheet.getRange(4, 12).setValue("Tatal Geral");
  sheet.getRange(4, 13).setFormula('=M2+M3');
  sheet.getRange(4, 14).setFormula('=N2+N3');
  sheet.getRange(4, 15).setValue("=M4-N4");
  sheet.getRange('O1:O1').setHorizontalAlignment('right');
  
  sheet.getRange('L2:L4').setFontWeight('bold');
  sheet.getRange('02:O4').setFontWeight('bold');
  sheet.getRange('M1:O1').setFontWeight('bold');

  sheet.getRange('M2:O4').setNumberFormat('R$ #,##0.00');

  sheet.getRange('M1:M4').setBackground('#96ffaf');//VERDE
  sheet.getRange('N1:N4').setBackground('#faa5a5');//VERMELHO
  sheet.getRange('O1:O4').setBackground('#a8c4ff');//AZUL
}

function getLastRow(sheet){
  let i = 0;
  while(true){
    i++;    
    if(!sheet.getRange(i, 1).getValue()){
      return i;
    }
    if(i > 500){
      break;
    }
  }
  return 1;
}

function firstUpper(value) {
  if(value){
    return value.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
  }
}

function addMonths(value, incremento) {
  value.setMonth(value.getMonth() + incremento);
  return value;
}

function paintRow(sheet, row, color = '#F3F3F3'){
  if(row%2 == 0){
    sheet.getRange(row, 1).setBackground(color);
    sheet.getRange(row, 2).setBackground(color);
    sheet.getRange(row, 3).setBackground(color);
    sheet.getRange(row, 4).setBackground(color);
    sheet.getRange(row, 5).setBackground(color);
    sheet.getRange(row, 6).setBackground(color);
    sheet.getRange(row, 7).setBackground(color);
  }
}