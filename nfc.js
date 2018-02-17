function $(id) {
 return document.getElementById(id);
}
function setstatus(text) {
 $("status").innerHTML = text;
}
function setresult(text) {
 $("res").innerHTML = text;
}

function init() {
 if(!window.amiibo) {
  alert("WiiUブラウザからアクセスしてください");
  return;
 }

 window.amiibo.startSearchAmiibo(); //Amiibo検索開始
 setstatus("Amiibo読み込み準備完了");
 window.addEventListener("AmiiboTagDetected", readTag); //イベントハンドラ登録
 window.addEventListener("AmiiboTagLost", tagLost); //イベントハンドラ登録
}

function readTag(e) {
 var tagdata = customEvent.tag;
 if(tagdata.isRead) window.amiibo.playAmiiboSE(); //タグが認識されたら声を再生
 var id_hex = '';
 tagdata.info.id.forEach(function(id, i){
  if (i == 2) return;
  id_hex += ('0'+id.toString(16)%10).slice(-2);
 });
 setstatus("Amiiboを読み込みました");
 setresult("読み込んだタグID:" + id_hex);
}

function tagLost(e) {
 setstatus("タグを見失いました");
}

window.onload = function () {
 if(typeof window.amiibo === "undefined") initAmiiboEmulator(); //WiiUでない場合はAmiiboエミュレータ初期化
 init(); //アプリケーション初期化
}

//Amiibo reader emulate
function initAmiiboEmulator() {
  window.amiibo = function() {
    console.log("Amiibo API is emulated");
  }
  //window.amiiboに同じ関数名を登録
  window.amiibo.startSearchAmiibo = function() {
    //Amiibo検索開始をエミュレート
    //console.log("Amiibo emulator: Start search emulate");
    var cev = document.createEvent("HTMLEvents");
    cev.initEvent("AmiiboTagSearchStart", true, false);
    window.dispatchEvent(cev);
  }
  window.amiibo.endSearchAmiibo = function() {
    //Amiibo検索終了をエミュレート
    var cev = document.createEvent("HTMLEvents");
    cev.initEvent("AmiiboTagSearchCancel", true, false);
    window.dispatchEvent(cev);
  }
  window.amiibo.playAmiiboSE = function() {
    //「アミィーボッ！」をエミュレート
    var snd = new Audio();
    snd.src = "audio/amiibo.mp3";
    snd.load();
    snd.play();
  }
  window.amiibo.emulateAmiiboLoaded = function() {
    var cev = document.createEvent("HTMLEvents");
    cev.initEvent("AmiiboTagDetected", true, false);
    window.customEvent = {
      tag: {
        info: {
          id: ['0x22201','0x20108','0x82177'],
          emulateinfo: 'yes'
        },
        isRead: true
      }
    };
    window.dispatchEvent(cev);
    console.log("Emulate amiibo tag load");
  }
}
