/// <reference path="clsGeneric.js" />
/// <reference path="clsAttrData.js" />
/// <reference path="clsTime.js" />
/// <reference path="clsMapdata.js" />
/// <reference path="clsPrint.js" />
/// <reference path="clsDraw.js" />
/// <reference path="clsWindow.js" />


let clsSettingData;
let attrData;
let Frm_Print;
let propertyWindow;
let divmain;
let TKY2JGD;
let tileMapClass;
let preReadMapFile=[];
const scrMargin = {
    top: 30,
    bottom: 23,
    side:0,
    scrollWidth:0
}

function logX(data) {
    if(logWindow==undefined){
        logWindow=Generic.createNewTextarea(document.body,"","",10,700,10,10,"font-size:15px;width:400px;height:200px")
    }
    tx = "";
    if (typeof data == 'array') {
        for (let i in data) {
            tx += data[i] + " / ";
        }
    } else {
        tx = data;
    }
    // logWindow.value += tx + '\n\n'
    // logWindow.scrollTop = logWindow.scrollHeight;
    console.log(tx)
}
let logWindow;

function init() {
    document.body.addEventListener("contextmenu",contextMenuPrevent);
    clsSettingData =new Setting_Info();
    TKY2JGD = new TKY2JGDInfo();
    tileMapClass=new clsTileMap();
    let testFont=["Yu Gothic UI","Meiryo UI","ヒラギノ角ゴ ProN","Noto Sans CJK","sans-serif"];
    for(let i in testFont){
        if (Generic.checkFontExist(testFont[i])) {
            clsSettingData.SetFont = testFont[i];
            break;
        }
    }
    //設定画面生成
    let divscr=Generic.createNewDiv(document.body,"","","",0,0,50,50,"visibility:hidden;overflow-y:scroll")
    scrMargin.scrollWidth=50-divscr.clientWidth;//div要素の縦スクロールバーの幅を取得
    document.body.removeChild(divscr);
    //出力画面生成
    Frm_Print = Generic.createWindow("frmPrint", "", "", 250, 50, 300, 250,  false,true,FrmprintMenuClick,true,frmPrint.windowClose, true, "printFoot",true,frmPrint.resizeMapWindow);
    Frm_Print.picMap = Generic.createNewCanvas(Frm_Print, "mapArea","", 0, 0, 0, 0, "", "background-color: white");

    Frm_Print.picMap.oncontextmenu= function () {return false;}
    Frm_Print.addEventListener('mousedown', frmPrintFront);
    Frm_Print.addEventListener('touchstart', frmPrintFront);
    Frm_Print.dragBorder(undefined,frmPrint.resizeMapWindow);
    let footer=document.getElementById("printFoot");
    Frm_Print.label1=Generic.createNewSpan(footer,"","","",0,0,"","");
    Frm_Print.label2=Generic.createNewSpan(footer,"","","",0,0,"","");
    Frm_Print.label3=Generic.createNewSpan(footer,"","","",0,0,"","");
    propertyWindow=Generic.createWindow("", "", "プロパティ", 350, 50, 200, 250,  false,false,"",true,frmPrint.propertyWindowClose, false, "",false);
     propertyWindow.dragBorder(undefined,undefined);
    propertyWindow.setTitle("プロパティ");
    propertyWindow.pnlProperty=Generic.createNewDiv(propertyWindow,"","","",0,scrMargin.top,'100%',240,"background-color:#eeeeee;overflow:hidden","");
    propertyWindow.pnlProperty.sizeFixed=true;
    propertyWindow.pnlProperty.relativeSize=new size(0,70);
    propertyWindow.pnlProperty.objInfo=Generic.createNewDiv(propertyWindow.pnlProperty,"","","",0,0,'100%',90,"padding:5px;background-color:white","");
    propertyWindow.pnlProperty.oObject=-1;
    propertyWindow.pnlProperty.oLayer=-1;
    propertyWindow.pnlProperty.oData=-1;
    propertyWindow.copyButton=Generic.createNewButton(propertyWindow,"コピー","",30,0,frmPrint.copyProperty);
    propertyWindow.copyButton.bottomPositionFixed=true;
    propertyWindow.copyButton.relativePosition = new point(0, 30);
    propertyWindow.fixed=false;
    propertyWindow.nextVisible=true;

    let rightDIV = Generic.createNewDiv(footer, "", "FTRight", "", 350, 0, 295, 18, "text-align:center", undefined);
    rightDIV.rightPositionFixed = true;
    rightDIV.relativePosition = new point(325, 0);
    Generic.createNewButton(rightDIV, "データ値表示", "", 0, 0, dataValueShow, "width:90px");
    Generic.createNewButton(rightDIV, "全体表示", "", 90, 0, frmPrint.wholeMapShow, "text-aligh:center;width:75px");
    Frm_Print.backImageButton = Generic.createNewButton(rightDIV, "背景画像", "", 165, 0, backImageButton, "text-aligh:center;width:75px");
    Frm_Print.seriesNextButton = Generic.createNewButton(rightDIV, "◀", "", 240, 0, frmPrint.seriesBefore, "font-weight: 900;width:30px");
    Frm_Print.seriesBeforeButton = Generic.createNewButton(rightDIV, "▶", "", 270, 0, frmPrint.seriesNext, "font-weight: 900;width:30px");
    mapMouse(Frm_Print.picMap, clsPrint.printMapScreen);
    clsDrawMarkFan.init();

    setting(location.search);//設定画面の作成


    function FrmprintMenuClick(pos) {
        let pwchwck = (propertyWindow.getVisibility() == true);
        let popmenu = [
            {caption: "画像", enabled: true, child: [
                { caption: "画像ファイルに保存", event: frmPrint.savePNG },
                { caption: "コピー用画像表示", event: frmPrint.copyImageWindow }
            ]
        },
            {caption: "表示", enabled: true, child: [
                { caption: "ダミーオブジェクト・グループ変更",  event: mnuDummyObjChange },
                { caption: "局地変動モード", checked: attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag, event: mdvf },
                { caption: "プロパティウインドウ", checked: pwchwck, event: pwreverse },
            ]
        },
        { caption: "線種ラインパターン設定", event: frmPrint.linePattern },
        { caption: "投影法変換", event: frmPrintProjection},
        { caption: "オプション", event: frmPrintOptionMenu }
        ];
        Generic.ceatePopupMenu(popmenu, pos);
        function mdvf(){
            let v=!attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag;
            if(v==true){
                Generic.alert(undefined,"局地変動モードは、階級区分モード（分割方法が自由設定の場合を除く）、記号の大きさモード、棒の高さモードで反映され、他の表示モードでは変化しません。");
            }
            attrData.TotalData.ViewStyle.MapLegend.Base.ModeValueInScreenFlag=v;
            clsPrint.printMapScreen(Frm_Print.picMap);
        }
        function pwreverse() {
            if (propertyWindow.getVisibility() == true) {
                propertyWindow.setVisibility(false);
            } else {
                propertyWindow.setVisibility(true);
            }
            frmPrint.propertyWindowClose();
        }
        function mnuDummyObjChange(){
            frmPrint_DummyObjectGroup();
        }
    }     
}

function contextMenuPrevent(e){
    e.preventDefault();
}


/** */
function frmPrintProjection() {
    if (attrData.TotalData.ViewStyle.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido) {
        alert("緯度経度座標系ではありません。");
        return;
    }
    let av = attrData.TotalData.ViewStyle;
    frmProjectionConvert(av.Zahyo, av.ScrData.MapRectanglem, okButton);
    function okButton(newZahyo) {
        let centerLon = newZahyo.CenterXY.x;
        if ((newZahyo.Projection != attrData.TotalData.ViewStyle.Zahyo.Projection) || (centerLon != attrData.TotalData.ViewStyle.Zahyo.CenterXY.x)) {
            attrData.Convert_Zahyo(newZahyo);
            let MapFileList = attrData.GetMapFileName();
            for (let i = 0; i < MapFileList.length; i++) {
                attrData.SetMapFile(MapFileList[i]).Convert_ZahyoMode(newZahyo);
            }
            attrData.TotalData.ViewStyle.Zahyo = newZahyo;
            attrData.Check_Vector_Object();
            attrData.PrtObjectSpatialIndex();
            attrData.TotalData.ViewStyle.ScrData.ScrView = attrData.TotalData.ViewStyle.ScrData.MapRectangle.Clone();
            clsPrint.printMapScreen(Frm_Print.picMap);
            Generic.alert(undefined,"投影法を" + Generic.getStringProjectionEnum(newZahyo.Projection) +"に変換しました。")

        }
    }
}
/**オブション */
function frmPrintOptionMenu(){
    frmPrintOption(0);
}
//データ値表示ボタン
function dataValueShow(e){
    frmPrint_ObjectValue(attrData,function(){ clsPrint.printMapScreen(Frm_Print.picMap)});
}

/**背景画像ボタン */
function backImageButton() {
    let avt = attrData.TotalData.ViewStyle.TileMapView;
    if (avt.Visible == true) {
        avt.Visible = false;
        clsPrint.printMapScreen(Frm_Print.picMap)
    } else {
        avt.Visible = true;
        frmPrint_backImageSet(attrData, function () { clsPrint.printMapScreen(Frm_Print.picMap) });
    }
}
function settingFront() {
    divmain.style.zIndex = 2;
    settingModeWindow.style.zIndex = 2;
    Frm_Print.style.zIndex=1;
    propertyWindow.style.zIndex = 1;
}

function frmPrintFront() {
    divmain.style.zIndex = 1;
    settingModeWindow.style.zIndex = 1;
    Frm_Print.style.zIndex = 2;
    propertyWindow.style.zIndex = 3;
}








