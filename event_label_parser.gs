function getCondition(binVal) {
  
  // 配列の順番はfacilityfilter.jsのgaEventValオブジェクトと同じであること
  var typeObj = [
   '公立認可保育所',
   '私立認可保育所',
   '認可外保育施設',
   '横浜保育室',
   '幼稚園',
   '小規模・事業所内保育事業',
   '障害児通所支援事業'
  ];

  // 配列の順番はfacilityfilter.jsのgaEventValオブジェクトと同じであること
  var filterObj = [
   '開園',
   '終園',
   '24時間',
   '一時保育',
   '夜間',
   '休日',
   '延長保育'
  ];
  
  var condition = {};
  var toStr = ""; 
  
  for (var i = 0;i<binVal.length;i++) {
    if (binVal[i] && binVal[i] !== "0" ) {
      var type = typeObj[Math.floor(i/typeObj.length)];
      var filter = filterObj[i%filterObj.length];
      if (condition[type]) {
        condition[type].push(filter);
      } else {
        condition[type] = [filter];
      }
    }  
  }
  
  Object.keys(condition).forEach(function(i) {
    toStr += i + " : " + condition[i].toString() + String.fromCharCode(10);
  });

  return [condition, toStr];
}



function anaylizeEventLabel() {
  
  var sheet = SpreadsheetApp.getActiveSheet();
  // シート状でデータが入力された範囲を読み込んで検索や変換処理を実行する
  var dataRange = sheet.getDataRange().getValues();
  var endCol =dataRange[0].length;
  var labelStr = 'イベント ラベル';
  var lableAdd;
  var rowN;
  var colN;
  var output = []; // 最終的に書き込まれるrange(多重配列)のオブジェクト
  var binVal;
  var condition = {};
  var toStr; 
  var errMsg;  
  
  // イベントラベルの項目を特定する
  for(var i = 0; i<dataRange.length;i++){
    for(var j = 0; j<endCol;j++){
      if (dataRange[i][j] === labelStr){
        [rowN, colN] = [i, j];
        break;
      }
    }
  }
  // アクティブシートでイベントラベルの項目が見つからなかった場合
  if (!rowN) {
    errMsg = "アクティブなシートで「" + labelStr + "」の項目が見つかりませんでした。\\n";
    errMsg += "イベントラベルの集計シートが選択されているか確認ください。";
    Browser.msgBox(errMsg); 
    return; 
  }
  
  
  // 10進数のラベルを2進数に変換した値と絞り込み条件の組み合わせを生成
  output[0] = ["二進数値", "絞り込み条件"];
  i = 0;
  while (dataRange[rowN+(++i)][colN] !== ""){
    binVal = dataRange[rowN+i][colN].toString(2);
    [condition, toStr] = getCondition(binVal);
    output[i] = [binVal, toStr];
  }
  
    sheet.getRange(rowN+1, endCol+1, Object.keys(output).length, output[0].length).setValues(output);
}
