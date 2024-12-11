function doPost(e) {
  //let obj = {"responsavelMovimentacao":"tailon","tipoDespesa":"[\"Comida\",\"Mercado\",\"Farmacia\",\"Combustivel\",\"Roupa\",\"Viagem\",\"Presente\",\"Casa\",\"Outros\"]","tipoPgtoDespesa":"[\"Debito\",\"Crédito\",\"PIX\",\"Dinheiro\"]","valor":"1","descricao":"teste","quantidadeParcercela":"1","formaPagamento":"debito","tipoMovimentacao":"despesa","data":"2026-07-01","tipo":"mercado"};
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
      let sheet = createMainSheet(obj.data, obj);
      let rowSheet = getLastRow(sheet);

      paintRow(sheet, rowSheet);

      sheet.getRange(rowSheet, 1).setValue(firstUpper(obj.tipoMovimentacao));
      sheet.getRange(rowSheet, 2).setValue(firstUpper(obj.tipo));
      sheet.getRange(rowSheet, 3).setValue(obj.data);
      sheet.getRange(rowSheet, 4).setValue(obj.descricao);
      sheet.getRange(rowSheet, 5).setValue(firstUpper(obj.formaPagamento));
      sheet.getRange(rowSheet, 6).setValue("");
      sheet.getRange(rowSheet, 7).setValue(obj.valor);
      
      sheet.getRange(rowSheet, 7).setBackground('#faa5a5');//VERMELHO
      
    }else{
      let dataViradaCartao = '';

      dataViradaCartao = new Date(`${obj.data.getMonth()+1}/01/${obj.data.getFullYear()}`);
      
      if(dataViradaCartao){
        let proxFatura = 1;
        
        let dateLoop = new Date(`${obj.data.getMonth()+1}/01/${obj.data.getFullYear()}`);
        for(let i = 0; i < obj.quantidadeParcercela; i++){
          if(i == 0){
            dateLoop = addMonths(dateLoop, proxFatura)
          }else{
            dateLoop = addMonths(dateLoop, 1)
          }

          sheet = createMainSheet(dateLoop, obj);
          let rowSheetLoop = getLastRow(sheet);
          
          paintRow(sheet, rowSheetLoop);

          sheet.getRange(rowSheetLoop, 1).setValue(firstUpper(obj.tipoMovimentacao));
          sheet.getRange(rowSheetLoop, 2).setValue(firstUpper(obj.tipo));
          sheet.getRange(rowSheetLoop, 3).setValue(obj.data);
          sheet.getRange(rowSheetLoop, 4).setValue(obj.descricao);
          sheet.getRange(rowSheetLoop, 5).setValue("Crédito");
          sheet.getRange(rowSheetLoop, 6).setValue(`${i+1}/${obj.quantidadeParcercela}`);
          sheet.getRange(rowSheetLoop, 7).setValue(obj.valor/obj.quantidadeParcercela);
          sheet.getRange(rowSheetLoop, 7).setBackground('#faa5a5');//VERMELHO
        }
      }
      
    }
  }else{
    let sheet = createMainSheet(obj.data, obj)
    let rowSheet = getLastRow(sheet);
    
    paintRow(sheet, rowSheet);
    
    sheet.getRange(rowSheet, 1).setValue(firstUpper(obj.tipoMovimentacao));
    sheet.getRange(rowSheet, 2).setValue(firstUpper(obj.tipo));
    sheet.getRange(rowSheet, 3).setValue(obj.data);
    sheet.getRange(rowSheet, 4).setValue(obj.descricao);
    sheet.getRange(rowSheet, 5).setValue("");
    sheet.getRange(rowSheet, 6).setValue("");
    sheet.getRange(rowSheet, 7).setValue(obj.valor);

    sheet.getRange(rowSheet, 7).setBackground('#96ffaf');//VERDE
  }
}

function createMainSheet(date, obj){
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
    sheet.getRange(rowSheet, 1).setValue("Tipo da Mov.");
    sheet.setColumnWidth(1, 80);
    sheet.getRange('A:A').setHorizontalAlignment('center');
    
    sheet.getRange(rowSheet, 2).setValue("Tipo");
    sheet.getRange('B:B').setHorizontalAlignment('center');

    sheet.getRange(rowSheet, 3).setValue("Data");
    sheet.getRange('C:C').setHorizontalAlignment('center');

    sheet.getRange(rowSheet, 4).setValue("Descrição");
    sheet.getRange('D:D').setHorizontalAlignment('left');
    sheet.setColumnWidth(4, 200);

    sheet.getRange(rowSheet, 5).setValue("Forma de Pgto");
    sheet.getRange('E:E').setHorizontalAlignment('center');
    
    sheet.getRange(rowSheet, 6).setValue("Parc.");
    sheet.setColumnWidth(6, 60);
    sheet.getRange('F:F').setHorizontalAlignment('center');

    sheet.getRange(rowSheet, 7).setValue("Valor");
    sheet.setColumnWidth(7, 120);
    sheet.getRange('G:G').setHorizontalAlignment('right');
    sheet.getRange('G2:G').setNumberFormat('R$ #,##0.00');

    sheet.getRange('A1:G1').setFontWeight('bold');
    sheet.getRange('A1:G1').setBackground('#D9D9D9');//CINZA ESCURO

    createSumMainSheet(sheet, obj);
  }
  return sheet;
}

function createSumMainSheet(sheet, obj){
  sheet.getRange(1, 12).setValue("Receitas");
  sheet.getRange(1, 13).setValue("Despesas");
  sheet.getRange(1, 14).setValue("Líquido");
  
  
  sheet.getRange(2, 11).setValue("Total Geral");
  sheet.getRange(2, 12).setFormula('=SUMIFS(G2:G; A2:A; "Receita")');
  sheet.getRange(2, 13).setFormula('=SUMIFS(G2:G; A2:A; "Despesa")');
  sheet.getRange(2, 14).setValue("=L2-M2");
  sheet.setColumnWidth(11, 80);
  sheet.getRange('L1:L1').setHorizontalAlignment('right');
  sheet.getRange('M1:M1').setHorizontalAlignment('right');
  sheet.getRange('N1:N1').setHorizontalAlignment('right');
  
  sheet.getRange('K2:K4').setFontWeight('bold');
  sheet.getRange('N2:N4').setFontWeight('bold');
  sheet.getRange('L1:N1').setFontWeight('bold');

  sheet.getRange('L2:N4').setNumberFormat('R$ #,##0.00');

  sheet.getRange('L1:L2').setBackground('#96ffaf');//VERDE
  sheet.getRange('M1:M2').setBackground('#faa5a5');//VERMELHO
  sheet.getRange('N1:N2').setBackground('#a8c4ff');//AZUL


  let lastRow = 4;
  sheet.getRange(lastRow, 11).setValue("Total Por Forma de Pgto");
  sheet.getRange(`K${lastRow}:K${lastRow}`).setFontWeight('bold');
  sheet.getRange(`K${lastRow}:L${lastRow}`).setBackground('#D9D9D9');//CINZA ESCURO

  let tipoPgtoDespesa = JSON.parse(obj.tipoPgtoDespesa)

  for(let i = 0; i < tipoPgtoDespesa.length; i++){
    lastRow++;
    sheet.getRange(lastRow, 11).setValue(tipoPgtoDespesa[i]);
    sheet.getRange(`K${lastRow}:K${lastRow}`).setFontWeight('bold');
    sheet.getRange(`L${lastRow}:L${lastRow}`).setFormula(`=SUMIFS(G2:G; E2:E; "${tipoPgtoDespesa[i]}")`);
    sheet.getRange('L2:L').setNumberFormat('R$ #,##0.00');
  }

  lastRow = lastRow+2;

  sheet.getRange(lastRow, 11).setValue("Total Por Tipo de Despesa");
  sheet.getRange(`K${lastRow}:K${lastRow}`).setFontWeight('bold');
  sheet.getRange(`K${lastRow}:L${lastRow}`).setBackground('#D9D9D9');//CINZA ESCURO

  let tipoDespesa = JSON.parse(obj.tipoDespesa)

  for(let i = 0; i < tipoDespesa.length; i++){
    lastRow++;
    sheet.getRange(lastRow, 11).setValue(tipoDespesa[i]);
    sheet.getRange(`K${lastRow}:K${lastRow}`).setFontWeight('bold');
    sheet.getRange(`L${lastRow}:L${lastRow}`).setFormula(`=SUMIFS(G2:G; B2:B; "${tipoDespesa[i]}")`);
    sheet.getRange('L2:L').setNumberFormat('R$ #,##0.00');
  }
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