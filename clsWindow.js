/// <reference path="clsGeneric.js" />
/// <reference path="clsAttrData.js" />
/// <reference path="clsTime.js" />
/// <reference path="clsMapdata.js" />
/// <reference path="clsPrint.js" />
/// <reference path="clsDraw.js" />
/// <reference path="main.js" />

var enmSelectMode = {
    noMode: -1,
    ClassPaintMode: 0,
    MarkSizeMode: 1,
    MarkBlockMode: 2,
    ContourMode: 3,
    ClassHatchMode: 4,
    ClassMarkMode: 5,
    ClassODMode: 6,
    MarkTurnMode: 7,
    MarkBarMode: 8,
    StringMode: 9,
    OverLayMode: 11,
    SeriesMode: 12,
    GraphMode: 21,
    LabelMode: 22,
    TripMode: 23
}

var strLayerInfo = function () {
    this.Name;
    this.MapfileName;
    this.UseObjectKind = [];
    this.Time;
    this.Shape;
}

/**設定画面（左側）を保存 */
let settingModeWindow  ;
const picClassBoxHeight = 23;
const picClassBoxWidth = 40;
const picClassBoxLeft = 10;
const picClassBoxTop = 10;
const txtClassValueWidth = 120;
const txtClassValueLeftMergin = 5;
const freqWidth = 50;
const allW = picClassBoxWidth + txtClassValueWidth + freqWidth+txtClassValueLeftMergin;
const pnlGraphEachItemHeight=25;

let setting = function (locSearch) {
    let man_Data=enmDataSource.NoData;
    let totalh = 680;
    let overlayListView;//重ね合わせデータセットりリストビュー
    let seriesListView;//連続表示データセットりリストビュー
    let lstLabelDataItem;//ラベルデータセットのデータ項目
    let lstcontourSeparateValue;//等値線モードの個別設定のリストボックス
    let popmenu = [{
        caption: "ファイル",enabled:true, child: [
            { caption: "白地図・初期属性データ表示", event: mnuMapViewer },
            { caption: "属性データ読み込み", event: menuReadData },
            { caption: "シェープファイル読み込み", event: mnuOpenShapeFile },
            { caption: "-" },
            { caption: "属性データ保存", event: menuSaveData  },
            { caption: "地図データ付属形式属性データ保存", event: menuSaveMDRMJData },
            { caption: "-" },
            { caption: "データ挿入(既存属性データから)", enabled: false,event:menuInsertDataFile},
            { caption: "データ挿入(シェープファイルから)", enabled: false,event:menuInsertShapefile},
            { caption: "データ挿入(白地図・初期属性データ表示から)", enabled: false,event:menuInsertMapViewer},
            { caption: "-" },
            { caption: "プロパティ",event: mnuProperty},
        ]
    },
        { caption: "編集",enabled:true , child: [
            {caption:"属性データ編集",event:mnuPropertyEdit} ,
            {caption:"属性データ新規作成",event:mnuNewPropertyEdit} ,
            {caption:"非表示オブジェクトの削除",event:mnuDeleteInvisibleObject}]} ,
        { caption: "分析",enabled:false , child: [
            { caption: "空間検索", event: mnuSpatialSearch },
            { caption: "面積・周長取得", event: mnuAreaPeripheri },
            { caption: "データ計算", event: mnuCulc },
            { caption: "距離測定", event: mnuMeasureDistance },
            { caption: "属性検索設定", event: mnuConditionSettings },
        ]},
        {
            caption: "ツール", enabled: false, child: [
                { caption: "データ項目設定コピー", event: mnuCopyDataSettings },
                { caption: "連続表示モードにまとめて設定", event: mnuSetSeriesMode },
                { caption: "記号表示位置等操作", event:mnuMarkPosition}
            ]
        },
        { caption: "本サイトについて", event: mnuAbout }
    ];
    //設定画面生成
    divmain = Generic.createWindow("setting", "", "", 10, 10, 400, totalh, true,true,menuClick, false,undefined, false,"",false,undefined);
    divmain.style.userSelect='none';
    divmain.style.backgroundColor="#ffffdc";
    divmain.addEventListener('click', settingFront);

    frmSettingMode();
    if (locSearch != "") {
        let locData_v = locSearch.mid(1,undefined).split("&");
        for (let i = 0; i < locData_v.length; i++) {
            let datav2 = locData_v[i].split("=");
            switch (datav2[0]) {
                case "file":
                    //最初に読み込むファイルが指定されている
                    getFirstFile(datav2[1]);
                    
                    break;
            }
        }
    }

    function menuClick(pos) {
        let dataExist=(man_Data != enmDataSource.NoData);
        switch (man_Data){
            case enmDataSource.NoData:
                break;
            case enmDataSource.MDRMJ:
            case enmDataSource.Shapefile:
            case enmDataSource.Shapefile:
                break;
        }
        Generic.getPopMenuObj(popmenu, "caption", "属性データ保存").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "地図データ付属形式属性データ保存").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "データ挿入(既存属性データから)").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "データ挿入(シェープファイルから)").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "データ挿入(白地図・初期属性データ表示から)").enabled = dataExist;

        Generic.getPopMenuObj(popmenu, "caption", "属性データ編集").enabled = dataExist;
        Generic.getPopMenuObj(popmenu, "caption", "非表示オブジェクトの削除").enabled = dataExist;

        Generic.getPopMenuObj(popmenu, "caption", "プロパティ").enabled = dataExist;
       Generic.getPopMenuObj(popmenu, "caption", "分析").enabled = dataExist;
   
        Generic.getPopMenuObj(popmenu, "caption", "ツール").enabled = dataExist;
   
        Generic.ceatePopupMenu(popmenu, pos);
    }
   
    let firstPanelAbout = AbountInner(divmain, 45, 50);

    let divpanel = Generic.createNewDiv(divmain, "", "SettingPanel", "", 0o0, scrMargin.top, divmain.style.width.removePx(), divmain.style.height.removePx(), "border-solid 1px;", "");
    divpanel.style.visibility = 'hidden';

    Generic.createNewButton(divpanel, "描画開始", "btnDraw", 150, 15, drawMap, "width:115px;height:30px;font-size:17px;font-weight:bold")
    Generic.createNewImageButton(divpanel, "settingWindowBtnPrintError", "image/Warning_yellow_7231_20x20.png", 290, 20, 20, 20, function (e) {
        //エラーボタン
        let retV=attrData.Get_PrintError();
        if(retV.Print_Enable != enmPrint_Enable.Printable ){
            Generic.alert(new point(e.clientX,e.clientY),retV.message);
            return;
        }
    }, "padding:2px");

    Generic.createNewImageButton(divpanel, "settingWindowBtnConditionInfo", "image/Find_VS.png", 315, 20, 20, 20, function (e) {
        //属性検索設定ボタン
        let at = attrData.TotalData;
        let Check_Lay = new Array(at.LV1.Lay_Maxn).fill(false);
        let ST = "";
        switch (at.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                let L = at.LV1.SelectedLayer;
                ST = attrData.Get_Condition_Info(L);
                ST += attrData.Get_Condition_Ok_Num_Info(L);
                ST += "\n" + "適合オブジェクト一覧" +"\n" +"\n";
                for (let i = 0; i < attrData.Get_ObjectNum(L); i++) {
                    if (attrData.Check_Condition(L, i) == true) {
                        ST += attrData.Get_KenObjName(L, i) ;
                        ST += "\n";
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                let s = at.TotalMode.OverLay.SelectedIndex;
                for (let i = 0; i < at.TotalMode.OverLay.DataSet[s].DataItem.length; i++) {
                    let L = at.TotalMode.OverLay.DataSet[s].DataItem[i].Layer;
                    if (Check_Lay[L] == false) {
                        ST += attrData.Get_Condition_Info(L);
                        ST += attrData.Get_Condition_Ok_Num_Info(L);
                        Check_Lay[L] = true;
                    }
                }
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                let s = at.TotalMode.Series.SelectedIndex
                for (let i = 0; i < at.TotalMode.Series.DataSet[s].DataItem.length; i++) {
                    let L = at.TotalMode.Series.DataSet[s].DataItem[i].Layer
                    if (Check_Lay[L] == false) {
                        ST += attrData.Get_Condition_Info(L);
                        ST += attrData.Get_Condition_Ok_Num_Info(L);
                        Check_Lay[L] = true;
                    }
                }
                break;
            }
        }
        Generic.createMsgBox("属性検索条件", ST,true);
    }, "padding:2px");


    Generic.createNewDiv(divpanel, "■データ表示モード", "", "", 20, 50, 352, 25, "background-color:#8080ff;color:white;font-size:16px;padding-left:10px;padding-top:6px;font-weight:bold", "");
    let divDataView = Generic.createNewDiv(divpanel, "", "SettingDataView", "grayFrame", 30, 85, 350, 445, "", "");
    let selectLayer = Generic.createNewWordSelect(divDataView,"対象レイヤ", undefined, -1, "selectLayer", 10, 10,90,200,0,  changeLayer,"font-size:16px", "height:22px;font-size:15px");

    let divsolo = Generic.createNewDiv(divDataView, "", "SettingSolo", "", 20, 40, 310, 300, "", "");
    Generic.createNewDiv(divsolo, "■単独表示モード", "", "", 0, 0, 300, 22, "background-color:#00c000;color:white;font-size:15px;padding-left:10px;padding-top:4px;font-weight:bold", "");
    let selectDataItem = Generic.createNewWordSelect(divsolo,"データ項目", undefined, -1, "selectDataItem", 0, 28,90,200,0,  changeDataItem,"font-size:16px", "height:22px;font-size:15px");

    Generic.createNewButton(divsolo, "データ値表示", "", 130, 55, showObjectData, "");
    Generic.createNewButton(divsolo, "統計値表示", "", 230, 55, showStatistics, "");

    let divclass = Generic.createNewDiv(divsolo, "", "SettingClass", "", 0, 85, 310, 90, "", "");
    Generic.createNewDiv(divclass, "階級区分モード", "", "", 0, 0, 200, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-top:2px", "");
    let divClassPaint = Generic.createNewDiv(divclass, "", "divClassPaint", "modeDivIcon", 20, 30, 50, 65, "background-color:white;border:solid 1px", "");
    divClassPaint.tooltip = "ペイントモード";
    divClassPaint.selected = false;
    Generic.createNewDiv(divClassPaint, "ペイント", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divClassPaint, "image/paint_mode.png", "ペイントモード", "", "", 5, 5, "", "");
    
    let divClassMark = Generic.createNewDiv(divclass, "", "divClassMark", "modeDivIcon", 80, 30, 50, 65, "background-color:white;border:solid 1px", "");
    divClassMark.tooltip = "階級記号モード";
    divClassMark.selected = false;
    Generic.createNewDiv(divClassMark, "階級記号", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divClassMark, "image/classmark_Mode.png", "階級記号モード", "", "", 5, 5, "", "");

    let divClassOD = Generic.createNewDiv(divclass, "", "divClassOD", "modeDivIcon", 140, 30, 50, 65, "background-color:white;border:solid 1px", "");
    divClassOD.tooltip = "線モード";
    divClassOD.selected = false;
    Generic.createNewDiv(divClassOD, "線", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divClassOD, "image/od.png", "線モード", "", "", 5, 5, "", "");

    Generic.createNewDiv(divclass, "等値線モード", "", "", 220, 0, 80, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-right:10px;padding-top:2px", "");
    let divContour = Generic.createNewDiv(divclass, "", "divContour", "modeDivIcon", 240, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divContour.tooltip = "等値線モード"
    divContour.selected = false;
    Generic.createNewDiv(divContour, "等値線", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divContour, "image/contour_mode.png", "等値線モード", "", "", 5, 5, "", "");


    let divMark = Generic.createNewDiv(divsolo, "", "SettingMark", "", 0, 190, 310, 90, "", "");
    Generic.createNewDiv(divMark, "記号モード", "", "", 0, 0, 200, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-top:2px", "");
    let divMarkSize = Generic.createNewDiv(divMark, "", "divMarkSize", "modeDivIcon", 20, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divMarkSize.tooltip = "記号の大きさモード"
    divMarkSize.selected = false;
    Generic.createNewDiv(divMarkSize, "大きさ", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divMarkSize, "image/mark_mode.png", "記号の大きさモード", "", "", 5, 5, "", "");

    let divMarkBlock = Generic.createNewDiv(divMark, "", "divMarkBlock", "modeDivIcon", 80, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divMarkBlock.tooltip = "記号の数モード"
    divMarkBlock.selected = false;
    Generic.createNewDiv(divMarkBlock, "数", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divMarkBlock, "image/marknum_mode.png", "記号の数モード", "", "", 5, 5, "", "");

    let divMarkBar = Generic.createNewDiv(divMark, "", "divMarkBar", "modeDivIcon", 140, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divMarkBar.tooltip = "棒の高さモード"
    divMarkBar.selected = false;
    Generic.createNewDiv(divMarkBar, "棒の高さ", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divMarkBar, "image/mark_bar.png", "棒の高さモード", "", "", 5, 5, "", "");


    Generic.createNewDiv(divMark, "文字モード", "", "", 220, 0, 80, 22, "background-color:#ffe0c0;font-size:15px;padding-left:10px;padding-right:10px;padding-top:2px", "");
    let divString = Generic.createNewDiv(divMark, "", "divString", "modeDivIcon", 240, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divString.tooltip = "文字モード"
    divString.selected = false;
    Generic.createNewDiv(divString, "文字", "modeclass", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divString, "image/label_mode.png", "文字モード", "", "", 5, 5, "", "");

    let divMulti = Generic.createNewDiv(divDataView, "", "SettingMulti", "", 20, 340, 50, totalh - 120, "", "");
    Generic.createNewDiv(divMulti, "■複数表示モード", "", "", 0, 0,300 , 22, "background-color:#00c000;color:white;font-size:15px;padding-left:10px;padding-top:4px;font-weight:bold", "");
    let divGraph = Generic.createNewDiv(divMulti, "", "divGraph", "modeDivIcon", 20, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divGraph.tooltip = "グラフモード"
    divGraph.selected = false;
    Generic.createNewDiv(divGraph, "グラフ", "modeGraph", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divGraph, "image/graph_mode.png", "グラフモード", "", "", 5, 5, "", "");

    let divLabel = Generic.createNewDiv(divMulti, "", "divLabel", "modeDivIcon", 80, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divLabel.tooltip = "ラベルモード"
    divLabel.selected = false;
    Generic.createNewDiv(divLabel, "ラベル", "modeLabel", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divLabel, "image/label_mode.png", "ラベルモード", "", "", 5, 5, "", "");
    Generic.createNewButton(divMulti,"重ね合わせセット","btnOverlaySet",190,70,overlaySet,"width:120px");

    let divComplex = Generic.createNewDiv(divpanel, "", "SettingComplex", "", 0, 540, 50, totalh - 120, "", "");
    Generic.createNewDiv(divComplex, "■複合表示モード", "", "", 20, 0,352 , 25, "background-color:#8080ff;color:white;font-size:16px;padding-left:10px;padding-top:6px;font-weight:bold", "");
    let divOverlay = Generic.createNewDiv(divComplex, "", "divOverlay", "modeDivIcon", 70, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divOverlay.tooltip = "重ね合わせモード"
    divOverlay.selected = false;
    Generic.createNewDiv(divOverlay, "重ね合わせ", "", "", 0, 48, 50, 16, "font-size:10px;text-align: center", "");
    Generic.createNewImage(divOverlay, "image/overlay_Mode.png", "重ね合わせモード", "", "", 5, 5, "", "");

    let divSeries = Generic.createNewDiv(divComplex, "", "divSeries", "modeDivIcon", 130, 30, 50, 65, "background-color:white;border:solid 1px;", "");
    divSeries.tooltip = "連続表示モード"
    divSeries.selected = false;
    Generic.createNewDiv(divSeries, "連続表示", "", "", 0, 48, 50, 16, "font-size:11px;text-align: center", "");
    Generic.createNewImage(divSeries, "image/series_Mode.png", "連続表示モード", "", "", 5, 5, "", "");
    Generic.createNewButton(divComplex,"連続表示セット","btnSeriesSet",240,70,seriesSet,"width:120px");
 
    let SelectedCategoryIndex=-1;

    //モードのdivにenter
    function modeEnter(e) {
        if(this.selected == false) {
            this.style.backgroundColor = "#ffdcdc";
        }
        Generic.createNewDiv(this, this.tooltip, "", "", e.offsetX, e.offsetY - 10, 80, undefined, "z-index:1000;font-size:12px;border: solid 1px; border-radius:3px; background-color:white;text-align:center","");
    }
    function modeLeave(e) {
        if(this.selected == false) {
            this.style.backgroundColor = "white";
        }
        this.removeChild(this.lastChild);
    }

    /**複数表示モードをクリック */
    function multiModeClick(){
        clearModeIcon();
        let selDiv;
        attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let al=attrData.LayerData[Layernum];
        switch (this.id) {
            case "divGraph":
                al.Print_Mode_Layer=enmLayerMode_Number.GraphMode;
                selDiv=divGraph;
                break;
            case "divLabel":
                al.Print_Mode_Layer=enmLayerMode_Number.LabelMode;
                selDiv=divLabel;
                break;
        }
        selDiv.selected = true;
        selDiv.style.backgroundColor = '#ff6464';
        settingModeWindow.setTitle(selDiv.tooltip);
        rightSettingWindowControlVisibilitySet();
        Check_Print_err();
        switch (this.id) {
            case "divGraph":
                setSettingGraphModeWindow();
                break;
            case "divLabel":
                setSettingLabelModeWindow();
                break;
        }
    }
    /**複合表示モードをクリック */
    function ComplexModeClick(){
        clearModeIcon();
        let selDiv;
        switch (this.id) {
            case "divOverlay":
                attrData.TotalData.LV1.Print_Mode_Total=enmTotalMode_Number.OverLayMode;
                selDiv=divOverlay;
                break;
            case "divSeries":
                attrData.TotalData.LV1.Print_Mode_Total=enmTotalMode_Number.SeriesMode;
                document.getElementById("btnSeriesSet").disabled=true;
                selDiv=divSeries;
                break;
        }
        document.getElementById("btnOverlaySet").disabled=true;
        selDiv.selected = true;
        selDiv.style.backgroundColor = '#ff6464';
        settingModeWindow.setTitle(selDiv.tooltip);
        rightSettingWindowControlVisibilitySet();
        Check_Print_err();
        switch (this.id) {
            case "divOverlay":
                setSettingOverlayModeWindow();
                break;
            case "divSeries":
                setSettingSeriesModeWindow();
                break;
        }
    }
    //モードのdivをクリック
    function modeClick() {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.DataViewMode
        attrData.LayerData[Layernum].Print_Mode_Layer=enmLayerMode_Number.SoloMode;
        let mode;
        switch (this.id) {
            case "divClassPaint":
                mode = enmSoloMode_Number.ClassPaintMode;
                break;
            case "divClassMark":
                mode = enmSoloMode_Number.ClassMarkMode;
                break;
            case "divClassOD":
                mode = enmSoloMode_Number.ClassODMode;
                break;
            case "divMarkSize":
                mode = enmSoloMode_Number.MarkSizeMode;
                break;
            case "divMarkBlock":
                mode = enmSoloMode_Number.MarkBlockMode;
                break;
            case "divMarkBar":
                mode = enmSoloMode_Number.MarkBarMode;
                break;
            case "divString":
                mode = enmSoloMode_Number.StringMode;
                break;
            case "divContour":
                mode = enmSoloMode_Number.ContourMode;
                break;
            case "divMarkTurn":
                mode = enmSoloMode_Number.MarkTurnMode;
                break;
        }
        attrData.setSoloMode(Layernum, DataNum, mode);
        setDataMode();
        setSettingSoloModeWindow();
    }

    //シェープファイル読み込み
    function mnuOpenShapeFile() {
        openShapeFile(okButton);
        function okButton(mapdata, layerdata) {
            attrData = new clsAttrData();
            attrData.SetMapViewerData(mapdata, layerdata, false);
            attrData.TotalData.LV1.DataSourceType = enmDataSource.Shapefile;
            man_Data=attrData.TotalData.LV1.DataSourceType
            initAfterGetData(false);
        }
    }

    //属性データ読み込み
    function menuReadData() {
        readData(okButton);
        function okButton(mapdata, attrText, filename, ext) {
            attrData = new clsAttrData();
            let retv = attrData.OpenNewMandaraFile(mapdata, attrText, filename, ext);
            if(retv.emes != "") {
                Generic.createMsgBox("読み込みエラー", retv.emes, true);
            }
            if(retv.ok == false) {
                Generic.alert(undefined,"MANDARAデータとして読み込めませんでした。");
                Frm_Print.setVisibility(false);
                propertyWindow.nextVisible = true;
                propertyWindow.setVisibility(false);
                divpanel.style.visibility = 'hidden';
                settingModeWindow.setVisibility (false);
                man_Data = enmDataSource.NoData;
        
            } else {
                let non_clearf = false;
                man_Data = attrData.TotalData.LV1.DataSourceType;
                if((man_Data == enmDataSource.MDRJ) ||((man_Data == enmDataSource.MDRMJ) )){
                    non_clearf = true;
                }
                initAfterGetData(non_clearf);
            }
        }
    }

    /**データ挿入(既存属性データから) */
    function menuInsertDataFile(){
        readData(okButton);
        function okButton(mapdata, attrText, filename, ext) {
            let newAttrData = new clsAttrData();
            let retv = newAttrData.OpenNewMandaraFile(mapdata, attrText, filename, ext);            
            if(retv.emes != "") {
                Generic.createMsgBox("読み込みエラー", retv.emes, true);
            }
            if(retv.ok == false) {
                Generic.alert(undefined,"MANDARAデータとして読み込めませんでした。");
            } else {
                let retV=attrData.ADD_AttrData(newAttrData, true);
                if(retV.ok==true){
                    Init_Screen_Set(true);
                    attrData.Set_LayerName_to(selectLayer,attrData.TotalData.LV1.SelectedLayer);
                }
            }
        }
    }
    /**データ挿入(シェープファイルから) */
    function menuInsertShapefile() {
        openShapeFile(okButton);
        function okButton(mapdata, layerdata) {
            let newAttrData = new clsAttrData();
            newAttrData.SetMapViewerData(mapdata, layerdata, false);
            newAttrData.TotalData.LV1.DataSourceType = enmDataSource.Shapefile;
            
            let retV = attrData.ADD_AttrData(newAttrData, true);
            if (retV.ok == true) {
                Init_Screen_Set(true);
                attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
            }
        }
    } 
    
    /**データ挿入(白地図・初期属性データ表示から) */
    function menuInsertMapViewer(){
        mapViewer(okButton);
        function okButton(mapdata, layerdata) {
            let newAttrData = new clsAttrData();
            newAttrData.SetMapViewerData(mapdata, layerdata, false);

            let retV = attrData.ADD_AttrData(newAttrData, true);
            if (retV.ok == true) {
                Init_Screen_Set(true);
                attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
            }
        }
    }
    
    /**プロパティ */
    function mnuProperty(){
        const backDiv = Generic.set_backDiv("", "プロパティ", 650, 360, true, true, buttonOK, 0.2, true);
        let layn=attrData.TotalData.LV1.Lay_Maxn
        let data = Generic.Array2Dimension(2, layn*10+4,"");
        data[0][0] = "項目";
        data[1][0] = "値";
        data[0][1] = "地図ファイル数";
        data[1][1] = attrData.MapData.GetNumOfMapFile();
        data[0][2] = "地図ファイル";
        data[1][2] = attrData.MapData.GetMapFileName().join(",");
        data[0][3] = "レイヤ数";
        data[1][3] = layn;
        let n=4;
        for (let i = 0; i <layn ; i++) {
            let lay = attrData.LayerData[i];
            data[0][n + 0] = " ";
            data[1][n + 0] = " ";
            data[0][n + 1] = "レイヤ名";
            data[1][n + 1] = lay.Name;
            data[0][n + 2] = "使用地図ファイル";
            data[1][n + 2] = lay.MapFileName;
            data[0][n + 3] = "種類";
            data[1][n + 3] = Generic.getLayerTypeName(lay.Type);
            data[0][n + 4] = "形状";
            data[1][n + 4] =Generic.ConvertShapeEnumString(lay.Shape) ;
            data[0][n + 5] = "時間";
            data[1][n + 5] =lay.Time.toString();
            data[0][n + 6] = "コメント";
            data[1][n + 6] = lay.Comment;
            data[0][n + 7] = "オブジェクト数";
            data[1][n + 7] = lay.atrObject.ObjectNum;
            data[0][n + 8] = "データ項目数";
            data[1][n + 8] = lay.atrData.Count;
            data[0][n + 9] = "ダミーオブジェクト数";
            data[1][n + 9] = lay.Dummy.length;
            n += 10;
        }
        Generic.createNewSpan(backDiv,"データ","","",15,40,"",undefined);
        Generic.createNewSpan(backDiv,"データのコメント","","",330,40,"",undefined);
        Generic.createNewGrid(backDiv,"","","grayFrame","",data,15,60,300,250,'100%',"","font-size:13px",1,"background-color:#aaffaa;","","","");
        let txComment=Generic.createNewTextarea(backDiv,attrData.TotalData.LV1.Comment,"",330,60,20,50,"resize:none;width:300px;height:250px");
        function buttonOK(){
            Generic.clear_backDiv();
            attrData.TotalData.LV1.Comment=txComment.value;
        }

    }

    /**非表示オブジェクトの削除 */
    function mnuDeleteInvisibleObject() {
        let ObjLive = [];
        let LayMax = attrData.TotalData.LV1.Lay_Maxn;
        let delN = 0;
        let DelNum = new Array(LayMax).fill(0);
        for (let i = 0; i < LayMax; i++) {
            let objn = attrData.Get_ObjectNum(i);
            let obn = new Array(objn).fill(false);
            if (attrData.LayerData[i].atrObject.NumOfSyntheticObj == 0) {
                for (let j = 0; j < objn; j++) {
                    if (attrData.Check_Condition(i, j) == false) {
                        obn[j] = true;
                        DelNum[i]++;
                        delN++;
                    }
                }
            }
            if (objn == DelNum[i]) {
                Generic.alert(undefined, attrData.LayerData[i].Name + "は全てのオブジェクトが非表示なので、削除できません。");
                return;
            }
            ObjLive.push(obn);
        }

        if (delN == 0) {
            Generic.alert(undefined, "非表示オブジェクトはありません。");
        } else {
            Generic.confirm(undefined, "非表示の " + delN + " オブジェクトを削除します。", function () {
                attrData.DeleteObjects(DelNum, ObjLive);
                attrData.Check_Vector_Object();
                attrData.PrtObjectSpatialIndex();
                setSettingSoloModeWindow();
                setFrequencyLabel();
            }, undefined);
        }
    }

    /**属性データ新規作成 */
    function mnuNewPropertyEdit() {
        Check_EraseSettei_OK(function () {
            clsGrid(true, buttonOK);
        })
        function buttonOK(newAttr) {
            man_Data=enmDataSource.DataEdit;
            settingModeWindow.setVisibility(true);
            attrData = new clsAttrData();
            attrData = newAttr;
            initAfterGetData(false);
        }

    }

    /**属性データ編集 */
    function mnuPropertyEdit(){
        clsGrid(false,buttonOK);
        function buttonOK(newAttr){
            attrData = new clsAttrData();
            attrData=newAttr;
            Init_Screen_Set(true);
            initFirtScreen();
        }
    }

    /**空間検索メニュー */
    function mnuSpatialSearch(e){
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let oldData = attrData.LayerData[Layernum].atrData.Count;
        frmMain_Buffer(function (e) {
            let newData = attrData.LayerData[Layernum].atrData.Count;
            let lst = [];
            for (let i = oldData; i < newData; i++) {
                lst.push({ value: oldData, text: attrData.Get_DataTitle(Layernum, i, true) });
            }
            selectDataItem.addSelectList(lst, undefined, false, true);
            Generic.clear_backDiv();
            Generic.alert(new point(e.clientX, e.clientY), "空間検索が終了しました。");
            if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
                if (attrData.LayerData[Layernum].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    selectDataItem.selectedIndex = oldData;
                    changeDataItem(0, oldData, 0);
                }
            }
        })
    }

    function Check_EraseSettei_OK(okCall){
        if (man_Data != enmDataSource.NoData) {
            Generic.confirm(undefined, "現在のデータは破棄されます。よろしいですか？", function(){
                man_Data = enmDataSource.NoData;
                Frm_Print.setVisibility(false);
                propertyWindow.nextVisible = true;
                propertyWindow.setVisibility(false);
                divpanel.style.visibility = 'hidden';
                settingModeWindow.setVisibility (false);
                okCall ();
            },undefined);
        }else{
            okCall();
        }
    }

    /**面積・周長取得メニュー */
    function mnuAreaPeripheri(e) {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let shape = attrData.LayerData[Layernum].Shape;
        if ((shape == enmShape.PointShape) || (shape == enmShape.NotDeffinition)) {
            Generic.alert(new point(e.clientX, e.clientY), "線または面形状のレイヤでないと、この機能は使えません。");
            return;
        }
        if (attrData.LayerData[Layernum].MapFileData.Map.Detail.DistanceMeasurable == false) {
            Generic.alert(new point(e.clientX, e.clientY), "使用する地図ファイルで面積・距離測定はできない設定になっています。");
            return;
        }

        frmMain_AreaPeripheri(function (e) {
            addNewDataItem(e);
        });
    }

    /**データ計算メニュー */
    function mnuCulc(e){
        frmMain_Culc(function (e) {
            addNewDataItem(e);
        });
    }

    function addNewDataItem(e){
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let newN = attrData.Get_DataNum(Layernum);
        selectDataItem.addSelectList([{ value: newN - 1, text: attrData.Get_DataTitle(Layernum, newN - 1, true) }], undefined, false, true);
        Generic.alert(new point(e.clientX, e.clientY), "データ項目：" + attrData.Get_DataTitle(Layernum, newN - 1, false) + " を取得しました。");
        if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
            if (attrData.LayerData[Layernum].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                selectDataItem.selectedIndex = newN - 1;
                changeDataItem(0, newN - 1, 0);
            }
        }
    }


    /**距離測定メニュー */
    function mnuMeasureDistance(e){
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        if (attrData.LayerData[Layernum].MapFileData.Map.Detail.DistanceMeasurable == false) {
            Generic.alert(new point(e.clientX, e.clientY), "使用する地図ファイルで面積・距離測定はできない設定になっています。");
            return;
        }
        let  oldN = attrData.Get_DataNum(Layernum);
        frmMain_GetDistance(function (e) {
            Generic.alert(new point(e.clientX, e.clientY), "距離を取得しました。");
            let  newN = attrData.Get_DataNum(Layernum);
            for(let i=oldN;i<newN;i++){
                selectDataItem.addSelectList([{ value: i, text: attrData.Get_DataTitle(Layernum, i, true) }], undefined, false, true);
            }
            if (attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.DataViewMode) {
                if (attrData.LayerData[Layernum].Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    selectDataItem.selectedIndex = oldN;
                    changeDataItem(0, oldN, 0);
                }
            }
        });
    }

    /**属性検索設定 */
    function mnuConditionSettings(){
        frmMain_ConditionSettings(function () {
            Check_Print_err();
        });
    }

    /**データ項目設定コピー */
    function mnuCopyDataSettings(){
        frmMainCopyDataSettings(function () {
            setDataMode();
            setSettingSoloModeWindow();
        });
    }


    /**連続表示モードにまとめて設定 */
    function mnuSetSeriesMode() {
        frmMain_SetSeriesMode(function (selIndex) {
            attrData.TotalData.LV1.Print_Mode_Total = enmTotalMode_Number.SeriesMode;
            attrData.TotalData.TotalMode.Series.SelectedIndex = selIndex;
            clearModeIcon();
            divSeries.selected = true;
            divSeries.style.backgroundColor = '#ff6464';
            settingModeWindow.setTitle(divSeries.tooltip);
            rightSettingWindowControlVisibilitySet();
            setSettingSeriesModeWindow();
            Frm_Print.setVisibility(false);
            propertyWindow.nextVisible = (propertyWindow.getVisibility() == true);
            propertyWindow.setVisibility(false);
        })

    }

    /**記号表示位置等操作 */
    function mnuMarkPosition(){
        frmMain_MarkPosition(function(mode,x,y){          
            switch (mode){
                 case 0: 
                case 1:
                case 5: {
                    let Data_Val_STRX = [];
                    let Data_Val_STRY = [];
                    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
                    let Objn = attrData.Get_ObjectNum(LayerNum);
                    let newN = attrData.Get_DataNum(LayerNum);
                    for (let i = 0; i < Objn; i++) {
                        let P;
                        switch (mode) {
                            case 0:
                                P = attrData.Get_CenterP(LayerNum, i);
                                break;
                            case 1:
                                P = attrData.LayerData[LayerNum].atrObject.atrObjectData[i].Symbol;
                                break;
                            case 5:
                                P = attrData.LayerData[LayerNum].atrObject.atrObjectData[i].Label;
                                break;
                        }    
                        let P2 = spatial.Get_Reverse_XY(P, attrData.TotalData.ViewStyle.Zahyo);
                        Data_Val_STRX[i] = P2.x;
                        Data_Val_STRY[i] = P2.y;
                    }
                    let title = "";
                    switch (mode) {
                        case 0:
                            title = "代表点";
                            break;
                        case 1:
                            title = "記号表示位置";
                            break;
                        case 5:
                            title = "ラベル表示位置";
                            break;
                    }   
                    let TTL = "";
                    switch (attrData.TotalData.ViewStyle.Zahyo.Mode) {
                        case enmZahyo_mode_info.Zahyo_No_Mode:
                            TTL = title + "Ｘ";
                            break;
                        case enmZahyo_mode_info.Zahyo_Ido_Keido:
                            TTL = title + "経度";
                            break;
                        case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                            TTL = title + "Ｙ";
                            break;
                    }
                    attrData.Add_One_Data_Value(LayerNum, TTL, "", "", Data_Val_STRX, false);

                    switch (attrData.TotalData.ViewStyle.Zahyo.Mode) {
                        case enmZahyo_mode_info.Zahyo_No_Mode:
                            TTL = title + "Ｙ";
                            break;
                        case enmZahyo_mode_info.Zahyo_Ido_Keido:
                            TTL = title + "緯度";
                            break;
                        case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                            TTL = title + "Ｘ";
                            break;
                    }
                    attrData.Add_One_Data_Value(LayerNum, TTL, "", "", Data_Val_STRY, false);
                    selectDataItem.addSelectList([{ value: newN, text: attrData.Get_DataTitle(LayerNum, newN, true) }, { value: newN + 1, text: attrData.Get_DataTitle(LayerNum, newN + 1, true) }], undefined, false, true);
                    Generic.alert(undefined, title + "を取得しました。");
                    selectDataItem.selectedIndex = newN;
                    changeDataItem(0, newN, 0);
                    break;
                }
            }
        });
    
    }
    /**本サイトについて */
    function mnuAbout(){
        const backDiv = Generic.set_backDiv("", "本サイトについて", 330, 285, true, false, buttonOK, 0.2, true);
        AbountInner(backDiv,15,50);
        function buttonOK() {
            Generic.clear_backDiv();
        }
    }
    function AbountInner(parent,x,y){
        let frame=Generic.createNewFrame(parent,"","",x,y,300,185);
        frame.style.backgroundColor="#ffffff";
        let tx1="ブラウザGIS MANDARA JS";
        let tx2="バージョン 1.003";
        let tx3="<b>左上のメニューから始めてください</b>"
        let tx4='<a href="http://ktgis.net/lab" target="_blank">谷 謙二（埼玉大学教育学部人文地理学研究室）</a>';
        let tx5='<a href="index.html" target="_blank">本サイトのページ</a>'
        let tx6='<a href="http://ktgis.net/mandara/" target="_blank">Windows版MANDARA10のページ</a>'
        Generic.createNewSpan(frame,tx1,"","",15,15,"",undefined);
        Generic.createNewSpan(frame,tx2,"","",100,40,"",undefined);
        Generic.createNewSpan(frame,tx3,"","",50,70,"",undefined);
        Generic.createNewSpan(frame,tx4,"","",15,100,"",undefined);
        Generic.createNewSpan(frame,tx5,"","",70,150,"",undefined);
        Generic.createNewSpan(frame,tx6,"","",70,125,"",undefined);
        return frame;
    }

    //属性データ保存
    function menuSaveData(){
        switch(attrData.TotalData.LV1.DataSourceType){
            case enmDataSource.MDRMJ:
                Generic.alert(undefined,"地図ファイル付属形式で保存して下さい。");
                return;
                break;
            case enmDataSource.Shapefile:
                Generic.alert(undefined,"シェープファイルは地図ファイル付属形式で保存して下さい。");
                return;
                break;
        }
        let fname=Generic.getFilenameWithoutExtension(attrData.TotalData.LV1.FileName)+".mdrj";
        Generic.prompt(undefined,"属性データファイル名",fname,function(v){
            fname=Generic.getFilenameWithoutExtension(v)+".mdrj";
            attrData.saveAsMDRJ(fname,false);
        })
    }

    /**地図ファイル付属形式 */
    function menuSaveMDRMJData(){
        let fname=Generic.getFilenameWithoutExtension(attrData.TotalData.LV1.FileName)+".mdrmj";
        Generic.prompt(undefined,"地図データ付属形式属性データファイル名",fname,function(v){
            fname=Generic.getFilenameWithoutExtension(v)+".mdrmj";
            attrData.saveAsMDRJ(fname,true);
        })
    }

    //白地図初期属性データ
    function mnuMapViewer() {
        mapViewer(okButton);
        function okButton(mapdata, layerdata) {
            attrData = new clsAttrData();
            attrData.SetMapViewerData(mapdata, layerdata, false);
            attrData.TotalData.LV1.DataSourceType = enmDataSource.Viwer;
            man_Data=attrData.TotalData.LV1.DataSourceType
            initAfterGetData(false);
        }
    }

    function SetODModeOriginObject() {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let ldd = attrData.nowDataSolo().ClassODMD;
        let tx = "";
        if (ldd.o_Layer != Layernum) {
            tx += "レイヤ:" + attrData.LayerData[ldd.o_Layer].Name + '\n';
        }
        if (ldd.Dummy_ObjectFlag == false) {
            tx += attrData.LayerData[ldd.o_Layer].atrObject.atrObjectData[ldd.O_object].Name;
        } else {
            tx += attrData.LayerData[ldd.o_Layer].Dummy[ldd.O_object].Name;
        }
        document.getElementById("ODOriginObjectDiv").innerHTML = tx;
    }
    
    /**重ね合わせセットボタン */
    function overlaySet(e){

        let retV=attrData.Get_PrintError();
        if(retV.Print_Enable == enmPrint_Enable.UnPrintable ){
            Generic.alert(new point(e.clientX,e.clientY),retV.message);
            return;
        }
        
        let OverLayDataSetNum = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
        let ovdn = attrData.TotalData.TotalMode.OverLay.DataSet.length;
        let ovttl = [];
        for (let i = 0; i < ovdn; i++) {
            ovttl[i] =attrData.TotalData.TotalMode.OverLay.DataSet[i].title;
            if(ovttl[i] == "") {
                ovttl[i] = "重ね合わせデータセット" + (i + 1).toString();
            }
        }
        if(ovdn > 1) {
            Generic.createNewDropdownSelect("重ね合わせデータセット選択", ovttl, e.clientX, e.clientY, 220,
                function ( sel) {
                    OverLayDataSetNum = sel;
                    setOverlay();
                });
        }else{
            setOverlay();
        }

        function setOverlay() {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let al = attrData.LayerData[Layernum];
            let DataNum = al.atrData.SelectedIndex;
            let ad = al.atrData.Data[DataNum];
            let MDLayer = al.Print_Mode_Layer;

            let SoloMd;
            let MultiDataSetIndex
            switch (MDLayer) {
                case enmLayerMode_Number.SoloMode:
                    SoloMd = ad.ModeData;
                    break;
                case enmLayerMode_Number.GraphMode:
                    MultiDataSetIndex = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                    break;
                case enmLayerMode_Number.LabelMode:
                    MultiDataSetIndex = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                    break;
            }
            let DataSet = attrData.TotalData.TotalMode.OverLay.DataSet[OverLayDataSetNum];
            let Num = DataSet.DataItem.length;
            let Index = Num;
            for (let i = 0; i < Num; i++) {
                let di = DataSet.DataItem[i];
                switch (MDLayer) {
                    case enmLayerMode_Number.SoloMode:
                        if(di.Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                            i = Num;
                        }
                        break;
                    case enmLayerMode_Number.GraphMode: {
                        if((di.Layer == Layernum)&&(di.Print_Mode_Layer == enmLayerMode_Number.GraphMode)) {
                            let PresentGraphMode = al.LayerModeViewSettings.GraphMode.DataSet[MultiDataSetIndex].GraphMode;
                            let StackedGraphMode = attrData.LayerData[di.Layer].LayerModeViewSettings.GraphMode.DataSet[di.DataNumber].GraphMode;
                            if(di.DataNumber == MultiDataSetIndex) {
                                Index = -2;
                                i = Num;
                            } else if(((StackedGraphMode == enmGraphMode.BarGraph)&&(PresentGraphMode == enmGraphMode.LineGraph)) || (
                                (StackedGraphMode == enmGraphMode.LineGraph)&&(PresentGraphMode == enmGraphMode.BarGraph))) {
                            } else {
                                if(window.confirm("同一レイヤのグラフモードで重ね合わせ可能な組み合わせは、折れ線グラフと棒グラフのみです。置換します。") == true) {
                                    Index = -1;
                                    i = Num;
                                } else {
                                    Index = i;
                                    i = Num;
                                }
                            }
                        }
                        break;
                    }
                    case enmLayerMode_Number.LabelMode:
                        if((di.Layer == Layernum)&&(di.DataNumber == MultiDataSetIndex)&&(di.Print_Mode_Layer == enmLayerMode_Number.LabelMode)) {
                            Index = -2;
                            i = Num;
                        }
                        break;
                    case enmLayerMode_Number.TripMode:
                        if((di.Layer == Layernum)&&(di.DataNumber == MultiDataSetIndex)&&(di.Print_Mode_Layer == enmLayerMode_Number.TripMode)) {
                            Index = -2;
                            i = Num;
                        }
                        break;
                }
            }

            if(Index == -2) {
                Generic.alert(undefined,"このデータセットはすでに重ね合わせモードに設定してあります。");
            } else if(Index == -1) {
            } else {

                let d = new strOverLay_DataSet_Item_Info();
                //d.TileMapf = false;
                d.Layer = Layernum;
                d.Print_Mode_Layer = MDLayer;
                let lpf = false;
                switch (MDLayer) {
                    case enmLayerMode_Number.SoloMode:
                        d.DataNumber = DataNum;
                        d.Mode = SoloMd;
                        lpf = true;
                        switch (d.Mode) {
                            case enmSoloMode_Number.ContourMode:
                                let alc = ad.SoloModeViewSettings.ContourMD;
                                if((alc.Interval_Mode == enmContourIntervalMode.RegularInterval) || (
                                    alc.Interval_Mode == enmContourIntervalMode.SeparateSettings)) {
                                    lpf = false;
                                }
                                break;
                            case enmSoloMode_Number.MarkTurnMode:
                                //記号の回転モードは、内部データがある場合のみ凡例を表示
                                // if(ald.SoloModeViewSettings.MarkCommon.Inner_Data.Flag == false ){
                                //     lpf = false
                                // }
                                break;
                        }
                        break;
                    case enmLayerMode_Number.GraphMode:
                        d.DataNumber = MultiDataSetIndex;
                        lpf = true;
                        break;
                    case enmLayerMode_Number.LabelMode:
                        d.DataNumber = MultiDataSetIndex;
                        lpf = false;
                        break;
                    case enmLayerMode_Number.TripMode:
                        //     d.DataNumber = MultiDataSetIndex;
                        // lpf = false;
                        break;
                }
                d.Legend_Print_Flag = lpf;
                if(Index == Num) {
                    DataSet.DataItem.push(d);
                } else {
                    DataSet.DataItem[Index] = d;
                }
                attrData.Sort_OverLay_Data(OverLayDataSetNum);
                Generic.alert(new point(e.clientX, e.clientY),"「" + ovttl[OverLayDataSetNum] + "」にセットしました。");
                if(OverLayDataSetNum != attrData.TotalData.TotalMode.OverLay.SelectedIndex) {
                    attrData.TotalData.TotalMode.OverLay.SelectedIndex = OverLayDataSetNum;
                }
            }
        }
    }

    /**連続表示セットボタン */
    function seriesSet(e) {

        let retV=attrData.Get_PrintError();
        if(retV.Print_Enable == enmPrint_Enable.UnPrintable ){
            Generic.alert(new point(e.clientX,e.clientY),retV.message);
            return;
        }

        let ats = attrData.TotalData.TotalMode.Series;
        let sedn = ats.DataSet.length;
        let ttl = [];
        for (let i = 0; i < sedn; i++) {
            ttl[i] = ats.DataSet[i].title;
            if (ttl[i] == "") {
                ttl[i] = "連続表示データセット" + (i + 1).toString();
            }
        }
        if (sedn > 1) {
            Generic.createNewDropdownSelect("連続表示データセット選択", ttl, e.clientX, e.clientY, 220,
                function (sel) {
                    setSeries(sel);
                });
        } else {
            setSeries(ats.SelectedIndex);
        }

        function setSeries(DataSetNum) {
            let ats = attrData.TotalData.TotalMode.Series;
            let atsd = ats.DataSet[DataSetNum];
            let Layernum;
            let DataNum;
            let ModeData;
            let Print_Mode_Layer;
            let Print_Mode_Total = attrData.TotalData.LV1.Print_Mode_Total;
            switch (Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    Layernum = attrData.TotalData.LV1.SelectedLayer;
                    let al = attrData.LayerData[Layernum];
                    Print_Mode_Layer = al.Print_Mode_Layer
                    switch (Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode:
                            DataNum = al.atrData.SelectedIndex
                            ModeData = al.atrData.Data[DataNum].ModeData;
                            break;
                        case enmLayerMode_Number.GraphMode:
                            DataNum = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                            break;
                        case enmLayerMode_Number.LabelMode:
                            DataNum = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                            break;
                        case enmLayerMode_Number.TripMode:
                            break;
                    }
                    break;
                }
                case enmTotalMode_Number.OverLayMode:
                    DataNum = attrData.TotalData.TotalMode.OverLay.SelectedIndex
                    break;
            }
            atsd.AddData(Layernum, DataNum, Print_Mode_Total, Print_Mode_Layer, ModeData);
            Generic.alert(new point(e.clientX, e.clientY),"「" + ttl[DataSetNum] + "」にセットしました。");
            if (DataSetNum != ats.SelectedIndex) {
                ats.SelectedIndex = DataSetNum;
            }
        }
    }

    //データ値表示
    function showObjectData() {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        let laydata = attrData.LayerData[Layernum];
        let data = Generic.Array2Dimension(3, laydata.atrObject.ObjectNum+1);
        data[0][0] = "";
        data[1][0] = "オブジェクト名";
        data[2][0] = "値"+attrData.Get_DataUnit_With_Kakko(Layernum, DataNum);
        for (let i = 0; i < laydata.atrObject.ObjectNum; i++) {
            data[0][i+1] = i+1;
            data[1][i+1] = attrData.Get_KenObjName(Layernum, i);
            data[2][i+1] = attrData.Get_Data_Value(Layernum, DataNum, i, attrData.TotalData.ViewStyle.Missing_Data.Text);
        }
        Generic.createMsgTableBox(attrData.Get_DataTitle(Layernum, DataNum,false), data,300,500,true);
    }

    //統計値表示
    function showStatistics() {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        let laydata = attrData.LayerData[Layernum];
        let ddata = laydata.atrData.Data[DataNum];
        let txt = "レイヤ：" + laydata.Name + "\n"
            + "データ項目：" + ddata.Title + "\n"
            + "データの種類：" + Generic.ConvertAttDataTypeString(ddata.DataType) + "\n";
        if(ddata.DataType == enmAttDataType.Normal) {
            txt += "単位：" + ddata.Unit + '\n'
                + "最大値：" + ddata.Statistics.Max + '\n'
                + "最小値：" + ddata.Statistics.Min + '\n'
                + "合計値：" + ddata.Statistics.Sum + '\n'
                + "平均値：" + ddata.Statistics.Ave + '\n'
                + "中央値：" + attrData.Get_MedianValue(Layernum, DataNum) + '\n'
                + "標準偏差：" + ddata.Statistics.STD + '\n'
                + "分散：" + (ddata.Statistics.STD ** 2) + '\n';
        }
        txt += '\n'
            + "非欠損値オブジェクト：" + ddata.EnableValueNum + '\n'
            + "欠損値オブジェクト：" + ddata.MissingValueNum + '\n';
        Generic.createMsgBox("統計値表示", txt,true);
    }
    //レイヤの変更
    function changeLayer(obj,sel,v) {
        attrData.TotalData.LV1.SelectedLayer =sel;
        setDataItemList();
    }

    //データ項目の変更(obj, sel, v)は、セレクトボックスからの戻り値
    function changeDataItem(obj, sel, v) {
        let LayerNum = attrData.TotalData.LV1.SelectedLayer;
        attrData.LayerData[LayerNum].atrData.SelectedIndex = sel;
        for (let k in enmSoloMode_Number) {
            let n = enmSoloMode_Number[k];
            SetPicPnlSoloDataEnabled(n, LayerNum, sel);
        }
        setDataMode();
        setSettingSoloModeWindow();
        setFrequencyLabel();
    }


    //読み込み直後の初期表示
    function initFirtScreen() {
        firstPanelAbout.setVisibility(false);
        divpanel.style.visibility = 'visible';
        attrData.Set_LayerName_to(selectLayer,attrData.TotalData.LV1.SelectedLayer);
        setDataItemList();
        let pmt=attrData.TotalData.LV1.Print_Mode_Total;

        let multiMode=['divGraph','divLabel'];
        for(let i in multiMode){
            let ele = document.getElementById(multiMode[i]);
            ele.addEventListener("mouseenter", modeEnter, false);
            ele.addEventListener("mouseleave", modeLeave, false);
            ele.addEventListener("click", multiModeClick, false);
        }
        let complexMode=['divOverlay','divSeries'];
        for(let i in complexMode){
            let ele = document.getElementById(complexMode[i]);
            ele.addEventListener("mouseenter", modeEnter, false);
            ele.addEventListener("mouseleave", modeLeave, false);
            ele.addEventListener("click", ComplexModeClick, false);
        }
        switch (pmt) {
            case enmTotalMode_Number.DataViewMode:
                switch (attrData.nowLayer().Print_Mode_Layer) {
                    case enmLayerMode_Number.GraphMode:
                        clearModeIcon();
                        divGraph.selected = true;
                        divGraph.style.backgroundColor = '#ff6464';
                        settingModeWindow.setTitle(divGraph.tooltip);
                        rightSettingWindowControlVisibilitySet();
                        setSettingGraphModeWindow();
                        break;
                    case enmLayerMode_Number.LabelMode:
                        clearModeIcon();
                        divLabel.selected = true;
                        divLabel.style.backgroundColor = '#ff6464';
                        settingModeWindow.setTitle(divLabel.tooltip);
                        rightSettingWindowControlVisibilitySet();
                        setSettingLabelModeWindow();
                        break;
                }
                break;
            case enmTotalMode_Number.OverLayMode:
                clearModeIcon();
                attrData.TotalData.LV1.Print_Mode_Total=pmt;
                divOverlay.selected = true;
                divOverlay.style.backgroundColor = '#ff6464';
                settingModeWindow.setTitle(divOverlay.tooltip);
                rightSettingWindowControlVisibilitySet();
                setSettingOverlayModeWindow();
                break;
            case enmTotalMode_Number.SeriesMode:
                clearModeIcon();
                attrData.TotalData.LV1.Print_Mode_Total = pmt;
                divSeries.selected = true;
                divSeries.style.backgroundColor = '#ff6464';
                settingModeWindow.setTitle(divSeries.tooltip);
                rightSettingWindowControlVisibilitySet();
                setSettingSeriesModeWindow();
                break;

        }
    }

    //データ項目のリストを設定
    function setDataItemList() {
        let LayerNum = attrData.TotalData.LV1.SelectedLayer;
        let al = attrData.LayerData[LayerNum].atrData;
        attrData.Set_DataTitle_to_cboBox(selectDataItem, LayerNum, al.SelectedIndex);
        for (let k in enmSoloMode_Number) {
            let n = enmSoloMode_Number[k];
            SetPicPnlSoloDataEnabled(n, LayerNum, al.SelectedIndex);
        }
        setDataMode();
        setSettingSoloModeWindow();
    }

    //度数分布の表示
    function setFrequencyLabel() {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        let data = attrData.LayerData[Layernum].atrData.Data[DataNum];
        let div_num = data.SoloModeViewSettings.Div_Num;
        let retv = attrData.Get_ClassFrequency(Layernum, DataNum, false);

        for (let j = 0; j < div_num; j++) {
            let fbox = document.getElementById("freqBox" + j);
            if(retv.ok == true) {
                fbox.innerHTML = String(retv.frequency[j]);
            } else {
                fbox.innerHTML = "--";
            }
        }
        Check_Print_err();
    }


    //データ項目が変更された際に、単独表示モードの可否を調べ、コントロールを設定
    //solomode:enmSoloMode_Number
    function SetPicPnlSoloDataEnabled(solomode, LayerNum, DataNum) {
        let f = attrData.Check_Enable_SoloMode(solomode, LayerNum, DataNum);
        SetPicPnlDataEnabled(GetSelectModeFromSoloMode(solomode), f);
    }

    //表示モードセレクタのEnabel設定
    //Mode:enmSelectMode
    function SetPicPnlDataEnabled(Mode, Flag) {
        let name = GetModeControlName(Mode);
        let ele = document.getElementById(name);
        if(ele != undefined) {
            Generic.setDisabled(ele, !Flag);
            if(Flag == true) {
                ele.addEventListener("mouseenter", modeEnter, false);
                ele.addEventListener("mouseleave", modeLeave, false);
                ele.addEventListener("click", modeClick, false);
                ele.disabled=false;
                ele.style.backgroundColor="#ffffff"
            } else {
                ele.removeEventListener("mouseenter", modeEnter, false);
                ele.removeEventListener("mouseleave", modeLeave, false);
                ele.removeEventListener("click", modeClick, false);
                ele.disabled=true;
            }
        }
    }

    //表示モード列挙型からコントロール名を取得
    //sm:enmSelectMode
    function GetModeControlName(sm) {
        switch (sm) {
            case enmSelectMode.ClassPaintMode:
                return "divClassPaint";
                break;
            case enmSelectMode.ClassHatchMode:
                return "ClassHatch";
                break;
            case enmSelectMode.ClassMarkMode:
                return "divClassMark";
                break;
            case enmSelectMode.ClassODMode:
                return "divClassOD";
                break;
            case enmSelectMode.MarkSizeMode:
                return "divMarkSize";
                break;
            case enmSelectMode.MarkBlockMode:
                return "divMarkBlock";
                break;
            case enmSelectMode.MarkTurnMode:
                return "divMarkTurn";
                break;
            case enmSelectMode.MarkBarMode:
                return "divMarkBar";
                break;
            case enmSelectMode.ContourMode:
                return "divContour";
                break;
            case enmSelectMode.StringMode:
                return "divString";
                break;

            case enmSelectMode.GraphMode:
                return "divGraph";
                break;
            case enmSelectMode.LabelMode:
                return "divLabel";
                break;
            case enmSelectMode.TripMode:
                return "Trip";
                break;

            case enmSelectMode.OverLayMode:
                return "divOverlay";
                break;
            case enmSelectMode.SeriesMode:
                return "divSeries";
                break;
        }
    }

    //単独表示モードから選択モードを取得noModeの場合はラベルモードを返す
    function GetSelectModeFromSoloMode(SoloMode) {
        switch (SoloMode) {
            case enmSoloMode_Number.ClassPaintMode:
                return enmSelectMode.ClassPaintMode;
                break;
            case enmSoloMode_Number.ClassHatchMode:
                return enmSelectMode.ClassHatchMode;
                break;
            case enmSoloMode_Number.ClassMarkMode:
                return enmSelectMode.ClassMarkMode;
                break;
            case enmSoloMode_Number.ClassODMode:
                return enmSelectMode.ClassODMode;
                break;
            case enmSoloMode_Number.MarkSizeMode:
                return enmSelectMode.MarkSizeMode;
                break;
            case enmSoloMode_Number.MarkBlockMode:
                return enmSelectMode.MarkBlockMode;
                break;
            case enmSoloMode_Number.MarkTurnMode:
                return enmSelectMode.MarkTurnMode;
                break;
            case enmSoloMode_Number.ContourMode:
                return enmSelectMode.ContourMode;
                break;
            case enmSoloMode_Number.MarkBarMode:
                return enmSelectMode.MarkBarMode;
                break;
            case enmSoloMode_Number.StringMode:
                return enmSelectMode.StringMode;
                break;
            case enmSoloMode_Number.noMode:
                //文字列データの場合
                return enmSelectMode.noMode;
                break;
        }
    }

    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**グラフ表示モードの設定画面の要素設定 */
    function setSettingGraphModeWindow(){
        graphDatasetSelectSet();
        graphDatasetDataItem();
        Check_Print_err();
    }
    function graphDatasetSelectSet(){
        let graph=attrData.layerGraph();
        let graphDataSetList = attrData.getGraphTitle(attrData.TotalData.LV1.SelectedLayer);
        document.getElementById("graphDataSetList").addSelectList(graphDataSetList, graph.SelectedIndex, true,false);
        pnlGraphEachItem(0);
    }

    /**グラフ表示モードのデータセットの内容を表示 */
    function graphDatasetDataItem() {
        let selGraph = attrData.nowGraph();
        document.getElementById("graphDatasetTitle").value = selGraph.title;
        Generic.checkRadioByValue("graphShape",selGraph.GraphMode);
        picGraphLinePat();

    }
    /**グラフ表示モードの「線種」 */
    function picGraphLinePat() {
        let selGraph = attrData.nowGraph();
        switch (selGraph.GraphMode) {
            case enmGraphMode.PieGraph:
            case enmGraphMode.StackedBarGrap:
                attrData.Draw_Sample_LineBox(document.getElementById("graphLinePat"), selGraph.En_Obi.BoaderLine);
                break;
            case enmGraphMode.BarGraph:
            case enmGraphMode.LineGraph:
                attrData.Draw_Sample_LineBox(document.getElementById("graphLinePat"), selGraph.Oresen_Bou.Line);
                break;
        }
    }

    /**グラフモードの表示データ項目を設定 */
    function pnlGraphEachItem(newRow){
        let pnl = document.getElementById("pnlGraphItem");
        let selGraph = attrData.nowGraph();
        let datan = selGraph.Data.length;
        let w = pnl.offsetWidth - scrMargin.scrollWidth - 10;
        for (let i = pnl.inPanel; i < datan; i++) {
            let ele = Generic.createNewDiv(pnl, "", "pnlGraphIteminPanel" + String(i), "", 5, pnlGraphEachItemHeight * i, w, pnlGraphEachItemHeight, "border:solid 1px white;",eleClick);
            ele.tag = i;
            let eleText=Generic.createNewDiv(ele,"","pnlGraphIteminPanelTextBox"+ String(i),"",0,2,w-30,pnlGraphEachItemHeight-3,"overflow:hidden;text-overflow:ellipsis;white-space:nowrap",eleClick)
            eleText.tag=i;
            let eleTile = Generic.createNewTileBox(ele, "pnlGraphIteminPanelTileBox" + String(i), "", clsBase.Tile(), w-30, 0,undefined,
                function (e) {
                    let tsel = attrData.nowGraph();
                    let i = Number(this.tag)
                    let tile = tsel.Data[i].Tile;
                    clsTileSet(e, tile,
                        function (retTile) { tsel.Data[i].Tile = retTile });
                },30);
            eleTile.tag = i;
        }
        for (let i = datan; i < pnl.inPanel; i++) {
            let delele = document.getElementById("pnlGraphIteminPanel" + String(i));
            pnl.removeChild(delele);
        }
        pnl.style.height = (datan * pnlGraphEachItemHeight+2).px();
        for (let i = 0; i < datan; i++) {
            let tbox = document.getElementById("pnlGraphIteminPanelTileBox" + String(i));
            tbox.setVisibility(selGraph.GraphMode != enmGraphMode.LineGraph);
            Generic.setTileDiv(tbox, selGraph.Data[i].Tile);
            let ele = document.getElementById("pnlGraphIteminPanelTextBox" + String(i));
            ele.innerText = attrData.Get_DataTitle(attrData.TotalData.LV1.SelectedLayer, selGraph.Data[i].DataNumber, true);
            document.getElementById("pnlGraphIteminPanel" + String(i)).style.borderColor = 'white';
        }
        pnl.inPanel = datan;
        selItemBorder(newRow);
        document.getElementById("btmBarGraphColorSetting").setVisibility(selGraph.GraphMode == enmGraphMode.BarGraph);
        Check_Print_err();

        function eleClick(){
            if (pnl.selectedRow != -1) {
                document.getElementById("pnlGraphIteminPanel" + String(pnl.selectedRow)).style.borderColor = 'white';
            }
            let newSelRow = Number(this.tag)
            pnl.selectedRow = newSelRow;
            if (newSelRow < datan) {
                document.getElementById("pnlGraphIteminPanel" + String(newSelRow)).style.borderColor = '#666666';
            }
        }
        function selItemBorder(newSelRow) {
            if (pnl.selectedRow != -1) {
                document.getElementById("pnlGraphIteminPanel" + String(pnl.selectedRow)).style.borderColor = 'white';
            }
            if ((newSelRow < datan) && (newSelRow != -1)) {
                pnl.selectedRow = newRow;
                document.getElementById("pnlGraphIteminPanel" + String(newSelRow)).style.borderColor = '#666666';
            }
        }
        graphCulculateRmaxRmin();
    }

    /**グラフモードの選択データの最大値・最小値を求める */
    function graphCulculateRmaxRmin() {
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let selGraph = attrData.nowGraph();
        if (selGraph.Data.length == 0) {
            return;
        }
        for (let j = 0; j < attrData.LayerData[Layernum].atrObject.ObjectNum; j++) {
            let s = 0;
            for (let i = 0; i < selGraph.Data.length; i++) {
                let str = attrData.Get_Data_Value(Layernum, selGraph.Data[i].DataNumber, j, "")
                if (str != "") {
                    s += Number( str);
                }
            }
            if (j == 0) {
                selGraph.En_Obi.RMAX = s;
                selGraph.En_Obi.RMIN = s;
            } else {
                selGraph.En_Obi.RMAX = Math.max(selGraph.En_Obi.RMAX, s);
                selGraph.En_Obi.RMIN = Math.min(selGraph.En_Obi.RMIN, s);
            }
        }
        let Max = selGraph.En_Obi.RMAX;
        let min = selGraph.En_Obi.RMIN;
        let retV = Generic.WIC(10, Max, min);
        let zn = [];
        for (let k = retV.min; k <= retV.max; k += retV.step) {
            if ((selGraph.En_Obi.RMIN < k) && (k < selGraph.En_Obi.RMAX)) {
                zn.push(k);
            }
        }
        let DVN = zn.length;
        let h1, h2, h3;
        switch (DVN) {
            case 1:
                h1 = 1; h2 = -1; h3 = -1;
                break;
            case 2:
                h1 = 1; h2 = 0; h3 = -1;
                break;
            case 3:
                h1 = 2; h2 = 1; h3 = 0;
                break;
            case 4:
                h1 = 3; h2 = 1; h3 = 0;
                break;
            case 5:
                h1 = 4; h2 = 2; h3 = 0;
                break;
            case 6:
                h1 = 5; h2 = 2; h3 = 0;
                break;
            default:
                h1 = DVN - 1;
                h2 = parseInt(DVN / 2) - 1;
                h3 = 0;
                break;
        }
        selGraph.En_Obi.Value1 = zn[h1];
        if (h2 == -1) {
            selGraph.En_Obi.Value2 = 0;
        } else {
            selGraph.En_Obi.Value2 = zn[h2];
        }
        if (h3 == -1) {
            selGraph.En_Obi.Value3 = 0;
        } else {
            selGraph.En_Obi.Value3 = zn[h3];
        }
        if (selGraph.En_Obi.MaxValueMode == enmMarkMaxValueType.SelectedDataMax) {
            selGraph.En_Obi.MaxValue = selGraph.En_Obi.RMAX;
        }


        if (selGraph.Oresen_Bou.YmaxMinMode == enmBarLineMaxMinMode.Auto) {
            let YMax;
            let Ymin;
            for (let i = 0; i < selGraph.Data.length; i++) {
                let dn = selGraph.Data[i].DataNumber;
                let lad = attrData.LayerData[Layernum].atrData.Data[dn];
                if (i == 0) {
                    YMax = lad.Statistics.Max;
                    Ymin = lad.Statistics.Min;
                } else {
                    YMax = Math.max(YMax, lad.Statistics.Max);
                    Ymin = Math.min(Ymin, lad.Statistics.Min);
                }
            }
            if (selGraph.GraphMode == enmGraphMode.BarGraph) {
                if (Ymin > 0) {
                    Ymin = 0;
                }
            }
            let retV = Generic.WIC(5, YMax, Ymin);
            selGraph.Oresen_Bou.YMax = retV.max
            selGraph.Oresen_Bou.Ymin = retV.min
            selGraph.Oresen_Bou.Ystep = retV.step;
        }
    }

        //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**ラベル表示モードの設定画面の要素設定 */
    function setSettingLabelModeWindow(){
        labelDatasetSelectSet();
        labelDatasetDataItem();
    }

    function labelDatasetSelectSet(){
        let lbl=attrData.layerLabel();
        let lblDataSetList =attrData.getLabelTitle(attrData.TotalData.LV1.SelectedLayer);
        document.getElementById("labelDataSetList").addSelectList(lblDataSetList, lbl.SelectedIndex, true,false);
    }
    function labelDatasetDataItem() {
        let selLabel = attrData.nowLabel();
        document.getElementById("labelDatasetTitle").value = selLabel.title;
        document.getElementById("chkLblObjectName").checked = selLabel.ObjectName_Print_Flag;
        document.getElementById("chkLblObjectNameReturn").checked = selLabel.ObjectName_Turn_Flag;
        document.getElementById("txtLabelSizeChange").setNumberValue(selLabel.Width);
        document.getElementById("chkLblDataName_Print_Flag").checked = selLabel.DataName_Print_Flag;
        document.getElementById("chkLblDataValue_Unit_Flag").checked = selLabel.DataValue_Unit_Flag;
        document.getElementById("chkLblDataValue_TurnFlag").checked = selLabel.DataValue_TurnFlag;
        let adList=[];
        let Layernum=attrData.TotalData.LV1.SelectedLayer;
        for (let i = 0; i < selLabel.DataItem.length; i++) {
            adList.push({value:selLabel.DataItem[i],text:attrData.Get_DataTitle(Layernum,selLabel.DataItem[i],true)});
        }
        lstLabelDataItem.removeAll();
        lstLabelDataItem.addList(adList,0);
        attrData.Draw_Sample_LineBox(document.getElementById("labelFrame"), selLabel.BorderLine);
        Generic.setTileDiv(document.getElementById("labelObjectNameColor"),selLabel.BorderObjectTile);
        Generic.setTileDiv(document.getElementById("labelDataColor"),selLabel.BorderDataTile);
    }


    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**連続表示モードの設定画面の要素設定 */
    function setSettingSeriesModeWindow(){
        seriesDatasetSelectSet();
        seriesDatasetDataItem();
    }
    function seriesDatasetSelectSet() {
        let series = attrData.TotalData.TotalMode.Series;
        let seriesDataSetList = attrData.getSeriesDataSetName();
        document.getElementById("seriesDataSetList").addSelectList(seriesDataSetList, series.SelectedIndex, true,false);
    }

    /**連続表示モードのデータセットの内容を表示 */
    function seriesDatasetDataItem() {
        let series = attrData.TotalData.TotalMode.Series;
        let seriesSelD = series.DataSet[series.SelectedIndex];
        document.getElementById("seriesDatasetTitle").value = seriesSelD.title;
        document.getElementById("gbSeriesItemData").setVisibility(seriesSelD.DataItem.length > 0);
        attrData.SeriesMode_to_ListViewData(seriesListView,seriesSelD.DataItem);
        Check_Print_err();
    }

    /**連続表示モードのリストビュー左端の順番を再設定*/ 
    function resetSeriesListOrderNumber(){
        let n=seriesListView.getRowNumber();
        for(let i=0;i<n;i++){
            seriesListView.setValue(0,i,(i+1).toString());
        }
    }

    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**重ね合わせ表示モードの設定画面の要素設定*/
    function setSettingOverlayModeWindow() {
        overlayDatasetSelectSet();
        overlayDatasetDataItem();
        }
    
        /**重ね合わせ表示モードのデータセットセレクトボックス*/
    function overlayDatasetSelectSet(){
        let over = attrData.TotalData.TotalMode.OverLay;
        let overlayDataSetList = attrData.getOverlayTitle();
        document.getElementById("overlayDataSetList").addSelectList(overlayDataSetList,over.SelectedIndex, true,false);
    }

    /**重ね合わせ表示モードのデータセットの内容を表示 */
    function overlayDatasetDataItem(){
        let over = attrData.TotalData.TotalMode.OverLay;
        let overSelD = over.DataSet[over.SelectedIndex];

        document.getElementById("overlayAlwaysOver").checked = (over.Always_Overlay_Index == over.SelectedIndex);
        document.getElementById("overlayDatasetTitle").value = overSelD.title;
        let overData = [4];
        document.getElementById("gbOverlayItemData").setVisibility(overSelD.DataItem.length>0);
        overlayListView.clear();
        for (let i = 0; i < overSelD.DataItem.length; i++) {
            let di = overSelD.DataItem[i];
            overData[0] = attrData.LayerData[di.Layer].Name;
            switch (di.Print_Mode_Layer) {
                case enmLayerMode_Number.SoloMode: {
                    overData[1] = attrData.Get_DataTitle(di.Layer, di.DataNumber, false);
                    overData[2] = Generic.getSolomodeStrings(di.Mode);
                    break;
                }
                case enmLayerMode_Number.GraphMode: {
                    overData[1] = "グラフ表示";
                    let T = attrData.LayerData[di.Layer].LayerModeViewSettings.GraphMode.DataSet[di.DataNumber].title;
                    if (T == "") {
                        T = "データセット" + String(di.DataNumber + 1);
                    }
                    overData[2] =T;
                    break;
                }
                case enmLayerMode_Number.LabelMode: {
                    overData[1] = "ラベル表示";
                    let T = attrData.LayerData[di.Layer].LayerModeViewSettings.LabelMode.DataSet[di.DataNumber].title;
                    if (T == "") {
                        T = "データセット" + String(di.DataNumber + 1);
                    }
                    overData[2] =T;
                    break;
                }
                case enmLayerMode_Number.TripMode:
                    break;
            }
            overData[3] =  (di.Legend_Print_Flag ==  true) ? "表示" : "非表示";
            overlayListView.insertRow(1,overData);
        }
        overlayDatasetDataItemEach();
        Check_Print_err();

    }

    /**重ね合わせモードのデータセットの個別アイテムの情報をgbOverlayItemData内に表示 */
    function overlayDatasetDataItemEach() {
        let over = attrData.TotalData.TotalMode.OverLay;
        let overSelD = over.DataSet[over.SelectedIndex];
        let n = overlayListView.selectedRow;
        if (n != -1) {
            let d = overSelD.DataItem[n];
            document.getElementById("overlayItemDataLegendPrint").checked = d.Legend_Print_Flag;
        }
    }

    //●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
    /**単独表示モードの設定画面の要素設定*/
    function setSettingSoloModeWindow() {

        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        let data = attrData.LayerData[Layernum].atrData.Data[DataNum];
        let md = attrData.getSoloMode(Layernum, DataNum);
        let layShape=attrData.LayerData[Layernum].Shape;

        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.ClassPaintMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●ペイントモード
            switch (layShape) {
                case enmShape.PointShape:
                    let md = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape;
                    let ele = document.getElementById("picPointMarkSize");
                    attrData.Draw_Sample_Mark_Box(ele, md.PointMark);
                        break;
                case enmShape.LineShape:
                    document.getElementById("cboPaintLineSize").value=attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineWidth;
                    break;
                case enmShape.PolygonShape:
                    break;
            }
            document.getElementById("cboDivisionMethod").value = data.SoloModeViewSettings.Div_Method;
            //面以外は面積分位数を選べない
            document.getElementById("cboDivisionMethod").setAstarisk(enmDivisionMethod.AreaQuantile, (layShape != enmShape.PolygonShape));
            document.getElementById("cboDivisionCount").value = data.SoloModeViewSettings.Div_Num;
            Generic.checkRadioByValue("PaintColorSettingMode", data.SoloModeViewSettings.ClassPaintMD.Color_Mode);
            let div_num = data.SoloModeViewSettings.Div_Num;
            let pnlClassDiv = document.getElementById("pnlClassDiv");
            let ph = picClassBoxHeight;
            pnlClassDiv.style.height = (ph * div_num + 2).px();
            //不足するpicClassBoxを追加
            for (let i = pnlClassDiv.inPic; i < div_num; i++) {
                let cbox = Generic.createNewCanvas(pnlClassDiv,  "picClassBox" + i,"", 0, i * picClassBoxHeight, picClassBoxWidth, picClassBoxHeight,undefined, "border:solid 1px");
                cbox.tag = i;
                cbox.onclick = function (e) {
                    switch (attrData.nowData().ModeData) {
                        case enmSoloMode_Number.ClassPaintMode: {
                            if(cbox.style.cursor == 'crosshair') { clsColorPicker(e, colorChange); }
                            break;
                        }
                        case enmSoloMode_Number.ClassMarkMode: {
                            let md = attrData.nowDataSolo().Class_Div[e.target.tag].ClassMark;
                            clsMarkSet(e, mkChange, md, attrData)
                            function mkChange(newMark) {
                                attrData.nowDataSolo().Class_Div[e.target.tag].ClassMark = newMark.Clone();
                                attrData.Draw_Sample_Mark_Box(e.target, newMark);
                            }
                            break;
                        }
                        case enmSoloMode_Number.ClassODMode: {
                            let md = attrData.nowDataSolo().Class_Div[e.target.tag].ODLinePat;
                            clsLinePatternSet(e,md,lineChange)
                            function lineChange(newPat) {
                                attrData.nowDataSolo().Class_Div[e.target.tag].ODLinePat = newPat.Clone();
                                attrData.Draw_Sample_LineBox(e.target,newPat);
                            }
                            break
                        }
                    }
                };
                Generic.createNewSpan(pnlClassDiv, "()", "freqBox" + i, "", picClassBoxWidth + 2 + txtClassValueWidth + 10, i * picClassBoxHeight, freqWidth - 10, "", "");
            }
            //不足するtxtClassValueを追加
            let txtNum = div_num;
            if(attrData.Get_DataType(Layernum, DataNum) != enmAttDataType.Category) {
                txtNum--;
            }
            const txtStyle = "border:solid 1px;height:" + picClassBoxHeight.px();
            for (let i = pnlClassDiv.inTxt; i < txtNum; i++) {
                let txele=Generic.createNewNumberInput(pnlClassDiv,0,"txtClassValue" + i,picClassBoxWidth + 2, i * picClassBoxHeight, txtClassValueWidth,txeleOnChange,txtStyle);
                txele.ondragstart = function (e) { event.dataTransfer.setData('abc', event.target.tag) };
                txele.ondrop = function (e) {
                    //カテゴリーデータの場合、他のカテゴリーをドロップ
                    let oele = document.getElementById("txtClassValue" + String(event.dataTransfer.getData('abc')));
                    let dragN = oele.tag;
                    let dropN = e.target.tag;
                    if(dropN == dragN) { return; }
                    let Layernum = attrData.TotalData.LV1.SelectedLayer;
                    let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                    let ldd = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
                    let ddata = ldd.Class_Div[dragN].Clone();
                    if(dragN < dropN) {
                        for (let i = dragN; i < dropN; i++) {
                            ldd.Class_Div[i] = ldd.Class_Div[i + 1];
                        }
                    } else {
                        for (let i = dragN; i > dropN; i--) {
                            ldd.Class_Div[i] = ldd.Class_Div[i - 1];
                        }
                    }
                    ldd.Class_Div[dropN] = ddata;
                    SetPictureBox();
                    SetClassDivValueTextBox();
                    setFrequencyLabel();
                };
                txele.setAttribute("ondragover", "return false;");
                txele.tag = i;
                function txeleOnChange (obj,v) {
                    //階級区分値を変更設定
                    let n = obj.tag;
                    let L = attrData.TotalData.LV1.SelectedLayer;
                    let D = attrData.LayerData[L].atrData.SelectedIndex;
                    let ld = attrData.LayerData[L];
                    let ldd = ld.atrData.Data[D].SoloModeViewSettings;
                    if(attrData.Get_DataType(L, D) != enmAttDataType.Category) {
                        ldd.Class_Div[n].Value = v;
                    } else {
                        let oldTx = ldd.Class_Div[n].Value;
                        let newTx =v.trim();
                        if((newTx == "")&&(ldd.MissingF == true)) {
                            Generic.alert(undefined,"欠損値設定があるので空白にはできません。")
                            //e.target.value = oldTx;
                            obj.value = oldTx;
                            return;
                        }
                        for (let i = 0; i < ldd.Div_Num; i++) {
                            if((ldd.Class_Div[i].Value == newTx)&&(i != n)) {
                                Generic.alert(undefined,newTx + "は既に存在しているので設定できません。");
                                obj.value = oldTx;
                                return;
                            }
                        }
                        //カテゴリーの元を新名称に書き換える
                        for (let i = 0; i < ld.atrObject.ObjectNum; i++) {
                            if(ld.atrData.Data[D].Value[i] == oldTx) {
                                ld.atrData.Data[D].Value[i] = newTx;
                            }
                        }
                        ldd.Class_Div[n].Value = newTx;
                    }
                    setFrequencyLabel();
                }
            }
            //余ったpicClassBoxとtxtClassValueを削除
            for (let i = div_num; i < pnlClassDiv.inPic; i++) {
                let cbox = document.getElementById( "picClassBox" + i);
                cbox.parentNode.removeChild(cbox);
                let fbox = document.getElementById("freqBox" + i);
                fbox.parentNode.removeChild(fbox);
            }
            for (let i = txtNum; i < pnlClassDiv.inTxt; i++) {
                let txele = document.getElementById( "txtClassValue" + i);
                txele.parentNode.removeChild(txele);
            }
            pnlClassDiv.inPic = div_num;
            pnlClassDiv.inTxt = txtNum;

            SetPictureBox();
            SetPicClassBoxCursol();
            SetClassDivValueTextBox();
            setFrequencyLabel();

            /**ペイントモードのクリックして色変更*/
            function colorChange(e) {
                let n =parseInt( e.target.tag);
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
                let DivNum = data.Div_Num;
                let col = Generic.RGBAfromElement(e.target);
                data.Class_Div[n].PaintColor = col;
                switch (data.ClassPaintMD.Color_Mode) {
                    case enmPaintColorSettingModeInfo.twoColor:
                            SelectedCategoryIndex = -1;
                        if(n == 0) {
                            data.ClassPaintMD.color1 = col;
                        } else {
                            data.ClassPaintMD.color2 = col;
                        }
                        attrData.Twocolort(Layernum, DataNum);
                        break;
                    case enmPaintColorSettingModeInfo.threeeColor:
                            SelectedCategoryIndex = -1;
                        switch (n) {
                            case 0:
                                data.ClassPaintMD.color1 = col;
                                attrData.Twocolort(Layernum, DataNum);
                                break;
                            case DivNum - 1:
                                data.ClassPaintMD.color2 = col;
                                attrData.Twocolort(Layernum, DataNum);
                                break;
                            default:
                                data.ClassPaintMD.color3 = col;
                                attrData.Threecolor(Layernum, DataNum, n);
                                break;
                        }
                        break;
                    case enmPaintColorSettingModeInfo.multiColor:
                        switch (n) {
                            case 0:
                                data.ClassPaintMD.color1 = col;
                                attrData.Twocolort(Layernum, DataNum);
                                SelectedCategoryIndex = -1;
                                break;
                            case DivNum - 1:
                                data.ClassPaintMD.color2 = col;
                                attrData.Twocolort(Layernum, DataNum);
                                SelectedCategoryIndex = -1;
                                break;
                            default://中間
                                if(SelectedCategoryIndex == -1) {
                                    SelectedCategoryIndex = n;
                                    data.ClassPaintMD.color3 = col;
                                    attrData.Threecolor(Layernum, DataNum, n);
                                } else {
                                    attrData.FourColor(Layernum, DataNum, n, SelectedCategoryIndex, col);
                                    SelectedCategoryIndex = n;
                                    data.ClassPaintMD.color3 = col;
                                }
                                break;
                        }
                        break;
                    case enmPaintColorSettingModeInfo.SoloColor:
                            SelectedCategoryIndex = -1;
                        switch (n) {
                            case 0:
                                data.ClassPaintMD.color1 = col;
                                break;
                            case DivNum - 1:
                                data.ClassPaintMD.color2 = col;
                                break;
                        }
                        break;
                }
                SetPictureBox();
            }
        }

        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.ClassODMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●線モード
            SetODModeOriginObject();
        }

        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.ContourMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●等値線モード
            const datam = data.SoloModeViewSettings.ContourMD;
            Generic.checkRadioByValue("contourInterval_Mode",datam.Interval_Mode);
            document.getElementById("contourDraw_in_Polygon_F").checked=datam.Draw_in_Polygon_F;
            document.getElementById("contourSpline_flag").checked=datam.Spline_flag;
            document.getElementById("contourDetailed").setSelectValue(datam.Detailed);
            document.getElementById("gbContourLineLpat").setVisibility(datam.Interval_Mode==enmContourIntervalMode.ClassPaint);
            attrData.Draw_Sample_LineBox(document.getElementById("contourLinePat"),datam.Regular.Line_Pat);

            document.getElementById("gbRegularInterval").setVisibility(datam.Interval_Mode==enmContourIntervalMode.RegularInterval);
            document.getElementById("contourRegulerMinValue").setNumberValue(datam.Regular.bottom);
            document.getElementById("contourRegulerMaxValue").setNumberValue(datam.Regular.top);
            document.getElementById("contourRegulerInterval").setNumberValue(datam.Regular.Interval);
            attrData.Draw_Sample_LineBox(document.getElementById("contourRegulerLinePat"),datam.Regular.Line_Pat);
            document.getElementById("contourRegulerSPMinValue").setNumberValue(datam.Regular.SP_Bottom);
            document.getElementById("contourRegulerSPMaxValue").setNumberValue(datam.Regular.SP_Top);
            document.getElementById("contourRegulerSPInterval").setNumberValue(datam.Regular.SP_interval);
            attrData.Draw_Sample_LineBox(document.getElementById("contourRegulerSPLinePat"),datam.Regular.SP_Line_Pat);
            document.getElementById("contourRegulerExCheck").checked=datam.Regular.EX_Value_Flag
            document.getElementById("contourRegulerExValue").setNumberValue(datam.Regular.EX_Value);
            attrData.Draw_Sample_LineBox(document.getElementById("contourRegulerExLine"),datam.Regular.EX_Line_Pat);

            document.getElementById("gbSeparateSettings").setVisibility(datam.Interval_Mode==enmContourIntervalMode.SeparateSettings);
            lstcontourSeparateValue.removeAll();
            if(datam.IrregularNum > 0) {
                document.getElementById("gbContourSepaData").setVisibility(true);
                let conValList = [];
                for (let i = 0; i < datam.IrregularNum; i++) {
                    conValList.push({ value: datam.Irregular[i].Value, text: datam.Irregular[i].Value });
                }
                lstcontourSeparateValue.addList(conValList,0);
                
                setContourSepaDataValue();
            } else {
                document.getElementById("gbContourSepaData").setVisibility(false);
            }
        }

        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.MarkSizeMode, Layernum, DataNum) == true) {

            //●●●●●●●●●●●●●●●●記号の大きさモード
            const datam = data.SoloModeViewSettings.MarkSizeMD;
            if(layShape==enmShape.LineShape){
                document.getElementById("gbMark").style.display='none';
                document.getElementById("gbMarkLine").style.display='inline';
                document.getElementById("cboMarkLineSize").value=datam.LineShape.LineWidth;
                document.getElementById("markLineColor").style.backgroundColor=datam.LineShape.Color.toRGBA();
            }else{
                document.getElementById("gbMark").setVisibility(true);
                document.getElementById("gbMarkLine").style.display='none';
                let picMark = document.getElementById("picMarkSize");
                attrData.Draw_Sample_Mark_Box(picMark, datam.Mark);
            }
            for (let i = 0; i < 5; i++) {
                document.getElementById("txtMarkSizeValue" + String(i + 1)).setNumberValue(datam.Value[i]);
            }
            Generic.checkRadioByValue("markSizeMaxValueSetting", datam.MaxValueMode);
            document.getElementById("markSizeUserMaxValue").setNumberValue (datam.MaxValue );
            const markSizeView = document.getElementById("markSizeView");
            if(attrData.Get_DataMin(Layernum, DataNum) < 0) {
                document.getElementById("gbMarkSizeMinusValueCase").setVisibility(true);
                const mkc = data.SoloModeViewSettings.MarkCommon;
                document.getElementById("gbMarkSizeMinusValueCase_txtMarkSizePlusValue").value = mkc.LegendPlusWord;
                document.getElementById("gbMarkSizeMinusValueCase_txtMarkSizeMinusValue").value = mkc.LegendMinusWord;
                Generic.setTileDiv(document.getElementById("gbMarkSizeMinusValueCase_minusColorBox"), mkc.MinusTile);
            } else {
                document.getElementById("gbMarkSizeMinusValueCase").setVisibility(false);
            }
        }
        
        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.MarkBlockMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●記号の数モード
            const datam = data.SoloModeViewSettings.MarkBlockMD;
            let picMark = document.getElementById("picMarkBlockSize");
            attrData.Draw_Sample_Mark_Box(picMark, datam.Mark);
            Generic.checkRadioByValue("blockArrange",datam.ArrangeB);
            Generic.enableRadioByValue("blockArrange",enmMarkBlockArrange.Random,(layShape==enmShape.PolygonShape));
            document.getElementById("markBlockValue").setNumberValue(datam.Value);
            document.getElementById("markBlockWord").value=datam.LegendBlockModeWord;
            document.getElementById("markBlockHasu").checked=datam.HasuVisible;
            document.getElementById("markBlockOverlap").setSelectValue(datam.Overlap);
            if(attrData.Get_DataMin(Layernum, DataNum) < 0) {
                document.getElementById("gbMarBlockMinusValueCase").setVisibility(true);
                const mkc = data.SoloModeViewSettings.MarkCommon;
                document.getElementById("gbMarBlockMinusValueCase_txtMarkSizePlusValue").value = mkc.LegendPlusWord;
                document.getElementById("gbMarBlockMinusValueCase_txtMarkSizeMinusValue").value = mkc.LegendMinusWord;
                Generic.setTileDiv(document.getElementById("gbMarBlockMinusValueCase_minusColorBox"), mkc.MinusTile);
            } else {
                document.getElementById("gbMarBlockMinusValueCase").setVisibility(false);
            }
        }
   
        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.MarkBarMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●棒の高さモード
            const datam = data.SoloModeViewSettings.MarkBarMD;
            document.getElementById("cboMarkBarHeightSize").setNumberValue(datam.MaxHeight);
            Generic.checkRadioByValue("markBarmaxValueSetting",datam.MaxValueMode);
            document.getElementById("markBarUserMaxValue").setNumberValue(datam.MaxValue);
            document.getElementById("cboMarkBarWidth").setNumberValue(datam.Width)
            Generic.setTileDiv(document.getElementById("markBarInnerColor"),datam.InnerTile);
            attrData.Draw_Sample_LineBox(document.getElementById("markBarFrame"), datam.FrameLinePat);
            document.getElementById("markBarView").checked=datam.ThreeD;
            document.getElementById("markBarScaleCheck").checked=datam.ThreeD;
            document.getElementById("markBarScaleInterval").setNumberValue(datam.ScaleLineInterval);
            attrData.Draw_Sample_LineBox(document.getElementById("markBarScaleLine"), datam.scaleLinePat);
            Generic.checkRadioByValue("markBarShape",datam.BarShape);
        }

        if(attrData.Check_Enable_SoloMode(enmSoloMode_Number.StringMode, Layernum, DataNum) == true) {
            //●●●●●●●●●●●●●●●●文字モード
            document.getElementById("txtStringSizeChange").setNumberValue(  data.SoloModeViewSettings.StringMD.maxWidth);
            document.getElementById("chkStringReturn").checked = data.SoloModeViewSettings.StringMD.WordTurnF;
        }
    }


    //階級区分の区分ボックスを設定
    function SetPictureBox() {
        let ldd = attrData.nowDataSolo();
        let md = attrData.nowData().ModeData;
        for (let i = 0; i < ldd.Div_Num; i++) {
            let p = document.getElementById("picClassBox" + i);
            let ctx = p.getContext("2d");
            switch (md) {
                case enmSoloMode_Number.ClassPaintMode: {
                    ctx.fillStyle = ldd.Class_Div[i].PaintColor.toRGBA();
                    ctx.fillRect(0, 0, p.offsetWidth, p.offsetHeight);
                    break;
                }
                case enmSoloMode_Number.ClassMarkMode: {
                    attrData.Draw_Sample_Mark_Box(p,ldd.Class_Div[i].ClassMark);
                    break;
                }
                case enmSoloMode_Number.ClassODMode: {
                    attrData.Draw_Sample_LineBox(p,ldd.Class_Div[i].ODLinePat);
                    break;
                }
            }
        }
    }
    //階級区分の区分テキストボックスを設定
    function SetClassDivValueTextBox() {
        let DDType=attrData.nowData().DataType;
        let ldd = attrData.nowDataSolo();
        for (let i = 0; i < ldd.Div_Num; i++) {
            if((i != ldd.Div_Num - 1) || (DDType == enmAttDataType.Category)){
                let t = document.getElementById("txtClassValue" + i);
                let df = false;
                let ttop = picClassBoxHeight * i;
                if(DDType == enmAttDataType.Category) {
                    t.value = ldd.Class_Div[i].Value;
                    t.numberCheck=false;
                    t.style.textAlign = 'left';
                    t.draggable = true;
                } else {
                    if(ldd.Div_Method != enmDivisionMethod.Free) {
                        df = true;
                    }
                    t.setNumberValue( ldd.Class_Div[i].Value);
                    ttop += + picClassBoxHeight / 2;
                    t.numberCheck=true;
                    t.style.textAlign = 'right';
                    t.draggable = false ;
                }
                t.disabled = df;
                t.style.top = ttop.px();
            }
        }
    }

    /**等値線モードの個別設定の値セット */
    function setContourSepaDataValue(){
        let n=lstcontourSeparateValue.selectedIndex;
        let d=attrData.nowDataSolo().ContourMD.Irregular[n];
        document.getElementById("contourSepaValue").setNumberValue(d.Value);
        attrData.Draw_Sample_LineBox(document.getElementById("contourSepaLine"), d.Line_Pat);
    }

    /**モードアイコンをすべて白にする */
    function clearModeIcon(){
        let modeDiv = document.getElementsByClassName("modeDivIcon");
        for (let i = 0; i < modeDiv.length; i++) {
            modeDiv[i].selected = false;
            if(modeDiv[i].disabled==true){//アイコンが利用可能かどうかはSetPicPnlDataEnabledで設定
                modeDiv[i].style.backgroundColor = "#cccccc";
            }else{
                modeDiv[i].style.backgroundColor="#ffffff"
            }
        }
        document.getElementById("btnSeriesSet").disabled=false;
        document.getElementById("btnOverlaySet").disabled=false;
    }

    /**右側パネルの表示非表示の設定 */
    function rightSettingWindowControlVisibilitySet(){
        if(settingModeWindow.getVisibility()== false) {
            settingModeWindow.setVisibility (true);
        }
        let settingControl=document.getElementsByClassName("rightSettingWindowControlBase");
        for (let i = 0; i < settingControl.length; i++) {
            settingControl[i].setVisibility(false);
        }

        switch(attrData.TotalData.LV1.Print_Mode_Total){
            case enmTotalMode_Number.OverLayMode:{
                document.getElementById("overlayView").setVisibility(true);
                break;
            }
            case enmTotalMode_Number.SeriesMode:{
                document.getElementById("seriesView").setVisibility(true);
                break;
            }
            case enmTotalMode_Number.DataViewMode:{
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                switch (attrData.LayerData[Layernum].Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                        let md = attrData.getSoloMode(Layernum, DataNum);
                        let classViewF=false;
                        switch (md) {
                            case enmSoloMode_Number.ClassPaintMode:
                            case enmSoloMode_Number.ClassMarkMode:
                            case enmSoloMode_Number.ClassODMode:
                                classViewF = true;
                                break;
                        }
                        if (classViewF == true) {
                            let shape = attrData.LayerData[Layernum].Shape;
                            document.getElementById("classView").setVisibility(true);
                            if (attrData.Get_DataType(Layernum, DataNum) == enmAttDataType.Category) {
                                document.getElementById("gbDivNum").setVisibility(false);
                            } else {
                                document.getElementById("gbDivNum").setVisibility(true);
                            }
                            document.getElementById("gbClassPaint").setVisibility(md == enmSoloMode_Number.ClassPaintMode);
                            document.getElementById("btnClassMarkSettings").setVisibility(md == enmSoloMode_Number.ClassMarkMode);
                            document.getElementById("gbODPanel").setVisibility(md == enmSoloMode_Number.ClassODMode);
                            document.getElementById("gbPaintLine").setVisibility((md == enmSoloMode_Number.ClassPaintMode) && (shape == enmShape.LineShape));
                            document.getElementById("gbPointMark").setVisibility((md == enmSoloMode_Number.ClassPaintMode) && (shape == enmShape.PointShape));
                            if (md == enmSoloMode_Number.ClassODMode) {
                                switch (shape) {
                                    case enmShape.PointShape:
                                    case enmShape.PolygonShape: {
                                        document.getElementById("gbODOriginObject").setVisibility(true);
                                        break;
                                    }
                                    case enmShape.LineShape: {
                                        document.getElementById("gbODOriginObject").setVisibility(false);
                                        break;
                                    }
                                }
                            }
                        } else {
                            document.getElementById("classView").setVisibility(false);
                        }
                        document.getElementById("markSizeView").setVisibility(md == enmSoloMode_Number.MarkSizeMode);
                        document.getElementById("markBlockView").setVisibility(md == enmSoloMode_Number.MarkBlockMode);
                        document.getElementById("markBarView").setVisibility(md == enmSoloMode_Number.MarkBarMode);
                        document.getElementById("stringView").setVisibility(md == enmSoloMode_Number.StringMode);
                        document.getElementById("contourView").setVisibility(md == enmSoloMode_Number.ContourMode);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        document.getElementById("graphView").setVisibility(true);
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        document.getElementById("labelView").setVisibility(true);
                        break;
                    }
                }
                break;
            }
        }
    }

    /**
     *単独表示モードの指定
     */
    function setDataMode() {
        clearModeIcon();
        attrData.TotalData.LV1.Print_Mode_Total=enmTotalMode_Number.DataViewMode;
        let Layernum = attrData.TotalData.LV1.SelectedLayer;
        let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
        let selDiv;
        let md = attrData.getSoloMode(Layernum, DataNum);
        switch (md) {
            case enmSoloMode_Number.ClassPaintMode: {
                selDiv = divClassPaint;
                break;
            }
            case enmSoloMode_Number.ClassMarkMode: {
                selDiv = divClassMark;
                break;
            }
            case enmSoloMode_Number.ClassODMode: {
                selDiv = divClassOD;
                break;
            }
            case enmSoloMode_Number.MarkSizeMode: {
                selDiv = divMarkSize;
                break;
            }
            case enmSoloMode_Number.MarkBlockMode: {
                selDiv = divMarkBlock;
                break;
            }
            case enmSoloMode_Number.MarkBarMode: {
                selDiv = divMarkBar;
                break;
            }
            case enmSoloMode_Number.MarkTurnMode: {
                break;
            }
            case enmSoloMode_Number.ContourMode: {
                selDiv = divContour;
                break;
            }
            case enmSoloMode_Number.StringMode: {
                selDiv = divString;
                break;
            }
        }
        selDiv.selected = true;
        selDiv.style.backgroundColor = '#ff6464';
        settingModeWindow.setTitle(attrData.getSolomodeWord(md));
        rightSettingWindowControlVisibilitySet();
        Check_Print_err();
    }

    /**データ取得後の共通処理 */
    function initAfterGetData(non_clearf){
        
        Frm_Print.setVisibility(false);
        propertyWindow.nextVisible = true;
        propertyWindow.setVisibility(false);
        Init_Screen_Set(non_clearf);
        initFirtScreen();
        divmain.setTitle( attrData.TotalData.LV1.FileName);
    }

    /**
    * 画面の初期設定 出力画面の位置サイズを新しく設定する場合はfalse
    */
    function Init_Screen_Set(Non_Clear_Flag) {

        let sc = attrData.TotalData.ViewStyle.ScrData;
        if(Non_Clear_Flag == false) {
            frmPrint.Init_FrmPrint();
            frmPrint.set_frmPrint_Window_Size();
            let FpicRect = sc.frmPrint_FormSize;
            let sz = new size(FpicRect.width(), FpicRect.height())
            sc.init(sz, sc.Screen_Margin, sc.MapRectangle, sc.Accessory_Base, true);
            attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage = true;
            attrData.TempData.frmPrint_Temp.LabelPointFirstMessage = true;
            attrData.Set_Acc_First_Position();
        } else {
            frmPrint.set_frmPrint_Window_Size();
            sc.init(sc.frmPrint_FormSize.size(), sc.Screen_Margin, sc.MapRectangle, sc.Accessory_Base, false);
        }
    }


/**
* 描画開始
*/
    function drawMap(e) {
        let retV=attrData.Get_PrintError();
        if(retV.Print_Enable == enmPrint_Enable.UnPrintable ){
            Generic.alert(new point(e.clientX,e.clientY),retV.message);
            return;
        }

        e.stopPropagation();
         Frm_Print.setVisibility(true);
        frmPrintFront();

        if (propertyWindow.nextVisible == true) {
            propertyWindow.setVisibility(true);
            propertyWindow.nextVisible = false;
        }
        clsPrint.setData(Frm_Print.picMap, attrData);
    }

    //階級区分のピクチャボックス、テキストボックスの可否
    function SetPicClassBoxCursol() {
        let data = attrData.nowDataSolo();
        let DivNum = data.Div_Num;
        for (let i = 0; i < DivNum; i++) {
            let p = document.getElementById("picClassBox" + i);
            p.style.cursor = 'crosshair';
        }
        if (attrData.nowData().ModeData == enmSoloMode_Number.ClassPaintMode) {
            switch (data.ClassPaintMD.Color_Mode) {
                case enmPaintColorSettingModeInfo.twoColor:
                    for (let i = 1; i < DivNum - 1; i++) {
                        let p = document.getElementById("picClassBox" + i);
                        p.style.cursor = 'default';
                    }
                    break;
            }
        }
    }


    //各設定モードの画面作成
    function frmSettingMode() {
        const sw = 400;
        const sh = 450;
        let xpos = divmain.style.left.removePx() + divmain.style.width.removePx() + 10;
        settingModeWindow = Generic.createWindow("", "", "", xpos, 10, sw, sh, false, false, "", false, false, "", false, undefined);
        settingModeWindow.style.backgroundColor = "#f0f0f0";
        settingModeWindow.style.userSelect = 'none';
        settingModeWindow.addEventListener('click', settingFront)

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■階級区分モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let classView = Generic.createNewDiv(settingModeWindow, "", "classView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        classView.style.backgroundColor = "#f0f0f0";
        //階級区分方法
        let gbDivNum = Generic.createNewFrame(classView, "gbDivNum", "", 0, 0, 140, 100, "階級区分方法");
        const cboDivisionMethodList = [{ value: enmDivisionMethod.Free, text: '自由設定' },
        { value: enmDivisionMethod.Quantile, text: '分位数' },
        { value: enmDivisionMethod.AreaQuantile, text: '面積分位数' },
        { value: enmDivisionMethod.StandardDeviation, text: '標準偏差' },
        { value: enmDivisionMethod.EqualInterval, text: '等間隔' }
        ]
        Generic.createNewWordSelect(gbDivNum, "区分方法", cboDivisionMethodList, 0, "cboDivisionMethod", 10, 10, 90, 100, 1, cboDivisionMethodChange, "", "", true);
        let cboDivisionCountMethodList = [];
        for (let i = 0; i < 19; i++) {
            cboDivisionCountMethodList.push({ value: i + 2, text: (i + 2).toString() });
        }
        Generic.createNewWordSelect(gbDivNum, "分割数", cboDivisionCountMethodList, 0, "cboDivisionCount", 10, 53, 90, 50, 1, cboDivisionCountChange, "", "", true);

        //階級区分

        let pnlClassDivBase = Generic.createNewDiv(classView, "", "pnlClassDivBase", "", 150, 20, allW + 20, 350, "background-color:#f0f0f0;overflow-y: scroll", "");
        let pnlClassDiv = Generic.createNewDiv(pnlClassDivBase, "", "pnlClassDiv", "", 0, 0, allW, 300, "overflow:hidden", "");
        pnlClassDiv.inPic = 0;//pnlClassDiv内部の色と息栖とボックスの数を記録
        pnlClassDiv.inTxt = 0;
        //ペイントモード：色設定方法
        let gbClassPaint = Generic.createNewFrame(classView, "gbClassPaint", "", 0, 115, 140, 160, "色設定方法");
        const PaintColorSettingModeList = [{ value: enmPaintColorSettingModeInfo.twoColor, text: "2色グラデーション" },
        { value: enmPaintColorSettingModeInfo.threeeColor, text: "3色グラデーション" },
        { value: enmPaintColorSettingModeInfo.multiColor, text: "複数グラデーション" },
        { value: enmPaintColorSettingModeInfo.SoloColor, text: " 単独設定" }
        ];
        Generic.createNewRadioButtonList(gbClassPaint, "PaintColorSettingMode", PaintColorSettingModeList, 10, 10, 100, 25, undefined, PaintColorSettingModeChange, "");
        Generic.createNewButton(gbClassPaint, "カラーチャート", "btColorPattern", 20, 108, colorChart, "width:100px;padding-top:0;padding-bottom:0");
        Generic.createNewButton(gbClassPaint, "上下色反転", "btnReverseColor", 20, 133, reverseColor, "width:100px;padding-top:0;padding-bottom:0");
        //ペイントモード点オブジェクトの記号
        let gbPointMark = Generic.createNewFrame(classView, "gbPointMark", "", 0, 290, 140, 50, "表示記号設定");
        Generic.createNewCanvas(gbPointMark, "picPointMarkSize", "imgButton", 53, 10, 30, 30, picPointMark_Click, "");
        //ペイントモード線オブジェクト
        let gbPaintLine = Generic.createNewFrame(classView, "gbPaintLine", "", 0, 280, 140, 60, "線サイズ");
        Generic.createNewSizeSelect(gbPaintLine, 0, "cboPaintLineSize", "線幅", 15, 10, 40, 1, cboPaintLineSizeChange);
        Generic.createNewButton(gbPaintLine, "線端設定", "", 30, 35, btnPaintLineEdge);
        //■■■■■階級記号モードの記号設定ボタン■■■■■
        Generic.createNewButton(classView, "記号設定", "btnClassMarkSettings", 25, 140, classMarkButton, "width:100px");
        //■■■■■線モード■■■■■
        let gbODPanel = Generic.createNewDiv(classView, "", "gbODPanel", "", 0, 115, 140, 100, "", undefined);
        Generic.createNewButton(gbODPanel, "線設定", "btnClassODLineSettings", 20, 10, btnClassODSettings, "width:100px");
        let gbODOriginObject = Generic.createNewFrame(gbODPanel, "gbODOriginObject", "", 0, 40, 140, 110, "起点オブジェクト");
        Generic.createNewDiv(gbODOriginObject, "", "ODOriginObjectDiv", "grayFrame", 10, 10, 120, 50, ";background-color:white", undefined);
        Generic.createNewButton(gbODOriginObject, "起点オブジェクト設定", "btnClassODOriginSettings", 5, 80, btnClassODOriginSettings, "font-size:11px");


        function btnClassODSettings(e) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let lshape = attrData.LayerData[Layernum].Shape;
            let popmenu = [{ caption: "全線種変更", event: LpatChange },
            { caption: "全色変更", event: LColorChange },
            { caption: "ペイントモードの色をコピー", event: copyPaintColor },
            { caption: "線幅自動設定", event: LWidthAuto }
            ];
            if (lshape != enmShape.LineShape) {
                popmenu.push({ caption: "矢印設定", event: LArrow })
            }
            Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));

            function LArrow(data, e) {
                let ldd = attrData.nowDataSolo().ClassODMD;
                clsArrow(e, ldd.Arrow, "起点方向", "終点方向", function (newArrow) { ldd.Arrow = newArrow });
            }
            function LpatChange(data, e) {
                let ldd = attrData.nowDataSolo();
                clsLinePatternSet(e, ldd.Class_Div[0].ODLinePat, function (newLpat) {
                    for (let i = 0; i < ldd.Div_Num; i++) {
                        ldd.Class_Div[i].ODLinePat = newLpat.Clone();
                    }
                    SetPictureBox();
                })
            }
            function LColorChange(data, e) {
                let ldd = attrData.nowDataSolo();
                clsColorPicker(new point(e.clientX, e.clientY),
                    function (newColor) {
                        for (let i = 0; i < ldd.Div_Num; i++) {
                            ldd.Class_Div[i].ODLinePat.Color = newColor.Clone();
                        }
                        SetPictureBox();
                    })
            }
            function copyPaintColor() {
                let ldd = attrData.nowDataSolo();
                for (let i = 0; i < ldd.Div_Num; i++) {
                    ldd.Class_Div[i].ODLinePat.Color = ldd.Class_Div[i].PaintColor.Clone();
                }
                SetPictureBox();
            }
            function LWidthAuto() {
                let ldd = attrData.nowDataSolo();
                let w1 = ldd.Class_Div[0].ODLinePat.Width;
                let n = ldd.Div_Num - 1;
                if (ldd.Class_Div[ldd.Div_Num - 1].ODLinePat.BlankF == true) {
                    n--;
                }
                let w2 = ldd.Class_Div[n].ODLinePat.Width;
                let stp = (w1 - w2) / n;
                for (let i = 0; i < n; i++) {
                    ldd.Class_Div[i].ODLinePat.Width = w1 - stp * i;
                }
                SetPictureBox();
            }
        }

        function btnClassODOriginSettings(e) {
            let ldd = attrData.nowDataSolo().ClassODMD;
            frmMain_LayeObjectSelectOne(true, ldd.o_Layer, ldd.O_object, ldd.Dummy_ObjectFlag, function (lay, obnum, dumF) {
                ldd.Dummy_ObjectFlag = dumF;
                ldd.o_Layer = lay;
                ldd.O_object = obnum;
                SetODModeOriginObject();
            })
        }

        


        //階級記号モードの記号設定ボタン
        function classMarkButton(e) {
            let sv = attrData.nowDataSolo();
            let popmenu = [
                { caption: "同一記号に設定", event: setSameMark },
                { caption: "ペイントモードの色を内部色に設定", event: setSamePaintColor },
                { caption: "内部データの設定", event: innerDataSet }
            ];
            Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
            function setSameMark(data, e) {
                let md = sv.Class_Div[0].ClassMark;
                clsMarkSet(e, mkChange, md, attrData)
                function mkChange(newMark) {
                    for (let i = 0; i < sv.Div_Num; i++) {
                        sv.Class_Div[i].ClassMark = newMark.Clone();
                    }
                    SetPictureBox();
                }
            }
            function setSamePaintColor() {
                for (let i = 0; i < sv.Div_Num; i++) {
                    sv.Class_Div[i].ClassMark.Tile.Color = sv.Class_Div[i].PaintColor.Clone();
                    sv.Class_Div[i].ClassMark.WordFont.Color = sv.Class_Div[i].PaintColor.Clone();
                }
                SetPictureBox();
            }
            function innerDataSet(data, e) {
                clsInnerDataSet(e, attrData);
            }
        }

        //ペイントモード点オブジェクトの記号選択クリック
        function picPointMark_Click(e) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let md = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape;
            clsMarkSet(e, picMarkChange, md.PointMark, attrData);
            function picMarkChange(newMark) {
                md.PointMark = newMark;
                attrData.Draw_Sample_Mark_Box(e.target, newMark);
            }
        }
        //ペイントモード線オブジェクトのサイズ設定
        function cboPaintLineSizeChange(obj, v) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineWidth = v;
        }
        //ペイントモード線オブジェクトの線端設定
        function btnPaintLineEdge(e) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let edge = attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineEdge;
            clsLineEdgePattern(e, edge, okButton);
            function okButton(retEdge) {
                attrData.LayerData[Layernum].LayerModeViewSettings.PointLineShape.LineEdge = retEdge;
            }
        }

        //ペイントモードカラーチャート
        function colorChart(e) {
            let sv = attrData.nowDataSolo();
            let DivNum = sv.Div_Num;
            clsColorChart(e, DivNum, okButton);
            function okButton(col) {
                for (let i = 0; i < DivNum; i++) {
                    sv.Class_Div[i].PaintColor = col[i];
                }
                sv.color1 = col[0].Clone();
                sv.color2 = col[DivNum - 1].Clone();
                setSettingSoloModeWindow();
            }
        }
        //ペイントモード上下色反転ボタンクリック
        function reverseColor() {
            let data = attrData.nowDataSolo();
            let DivNum = data.Div_Num;
            let scol = [];
            for (let i = 0; i < DivNum; i++) {
                scol.push(data.Class_Div[i].PaintColor.Clone());
            }
            for (let i = 0; i < DivNum; i++) {
                data.Class_Div[i].PaintColor = scol[DivNum - i - 1]
            }
            setSettingSoloModeWindow();
        }

        //色設定方法ボタンクリック
        function PaintColorSettingModeChange(v) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.ClassPaintMD.Color_Mode = v;
            switch (v) {
                case enmPaintColorSettingModeInfo.twoColor:
                    attrData.Twocolort(Layernum, DataNum);
                    break;
                case enmPaintColorSettingModeInfo.threeeColor:
                    break;
                case enmPaintColorSettingModeInfo.multiColor:
                    attrData.Twocolort(Layernum, DataNum);
                    break;
                case enmPaintColorSettingModeInfo.SoloColor:
                    break;

            }
            setSettingSoloModeWindow();
            SetPicClassBoxCursol();
        }

        //階級区分方法クリック
        function cboDivisionMethodChange(obj, sel, v) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
            let dc = document.getElementById("cboDivisionCount");
            let lshape = attrData.LayerData[Layernum].Shape;
            dc.disabled = false;
            switch (v) {
                case enmDivisionMethod.AreaQuantile:
                    if (lshape != enmShape.PolygonShape) {
                        Generic.alert(undefined,"レイヤの形状が" + Generic.ConvertShapeEnumString(lshape) + "なので面積分位数は使えません。");
                        return;
                    }
                    break;
                case enmDivisionMethod.StandardDeviation:
                    dc.selectedIndex = 2;
                    dc.disabled = true;
                    let oldDivNum = data.Div_Num;
                    data.Div_Num = 6;
                    data.Class_Div.length = 6;
                    if (6 > oldDivNum) {
                        for (let i = oldDivNum; i < 6; i++) {
                            data.Class_Div[i] = new strClass_Div_data();
                        }
                        attrData.Set_Class_Div(Layernum, DataNum, oldDivNum);
                    }
                    if (data.ClassPaintMD.Color_Mode != enmPaintColorSettingModeInfo.SoloColor) {
                        attrData.Twocolort(Layernum, DataNum);
                    }
                    break;
            }
            data.Div_Method = v;
            attrData.Set_Div_Value(Layernum, DataNum);
            setSettingSoloModeWindow();
            setFrequencyLabel();
        }
        //階級分割数クリック
        function cboDivisionCountChange(obj, sel, v) {
            let Layernum = attrData.TotalData.LV1.SelectedLayer;
            let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
            let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
            let oldDivNum = data.Div_Num;
            if (oldDivNum == v) {
                return;
            }
            data.Div_Num = v;
            data.Class_Div.length = v;
            if (v > oldDivNum) {
                for (let i = oldDivNum; i < v; i++) {
                    data.Class_Div[i] = new strClass_Div_data();
                }
                attrData.Set_Class_Div(Layernum, DataNum, oldDivNum);
            }
            switch (data.ClassPaintMD.Color_Mode) {
                case enmPaintColorSettingModeInfo.SoloColor:
                    for (let i = oldDivNum; i < v; i++) {
                        data.Class_Div[i].PaintColor = data.Class_Div[oldDivNum - 1].PaintColor.Clone();
                    }
                    data.ClassPaintMD.color2 = data.Class_Div[v - 1].PaintColor.Clone();
                    break;
                default:
                    attrData.Twocolort(Layernum, DataNum);
            }
            switch (data.Div_Method) {
                case enmDivisionMethod.Free:
                    for (let i = oldDivNum - 1; i < v; i++) {
                        data.Class_Div[i].Value = 0;
                    }
                    break;
                default:
                    attrData.Set_Div_Value(Layernum, DataNum);
            }
            setSettingSoloModeWindow();
            setFrequencyLabel();
        }

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■等値線モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        const contourView = Generic.createNewDiv(settingModeWindow, "", "contourView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        contourView.style.backgroundColor = "#f0f0f0";
        const gbContourMode = Generic.createNewFrame(contourView, "", "", 0, 0, 170, 100, "等値線の設定方法");
        const contourIntervalList = [{ value: enmContourIntervalMode.ClassPaint, text: 'ペイントモードで塗り分け' },
        { value: enmContourIntervalMode.RegularInterval, text: '等間隔' },
        { value: enmContourIntervalMode.SeparateSettings, text: '個別設定' }];
        Generic.createNewRadioButtonList(gbContourMode, "contourInterval_Mode", contourIntervalList, 10, 10, undefined, 30, undefined,
            function (v) {
                attrData.nowDataSolo().ContourMD.Interval_Mode = v;
                document.getElementById("gbContourLineLpat").setVisibility(v == enmContourIntervalMode.ClassPaint);
                document.getElementById("gbRegularInterval").setVisibility(v == enmContourIntervalMode.RegularInterval);
                document.getElementById("gbSeparateSettings").setVisibility(v == enmContourIntervalMode.SeparateSettings);
                Check_Print_err();
            }, "");

        const gbContourDrawMethod = Generic.createNewFrame(contourView, "", "", 0, 125, 170, 100, "等値線の描き方");
        Generic.createNewCheckBox(gbContourDrawMethod, "ポリゴン内部のみ描画", "contourDraw_in_Polygon_F", true, 10, 20, undefined,
            function (obj) { attrData.nowDataSolo().ContourMD.Draw_in_Polygon_F = obj.checked }, "");
        Generic.createNewCheckBox(gbContourDrawMethod, "等値線を曲線で近似", "contourSpline_flag", true, 10, 45, undefined,
            function (obj) { attrData.nowDataSolo().ContourMD.Spline_flag = obj.checked }, "");
        const cboDetailedList = [{ value: 0, text: '非常に細かい' }, { value: 1, text: '細かい' },
        { value: 2, text: '少し細かい' }, { value: 3, text: '普通' }, { value: 4, text: '粗い' }];

        Generic.createNewWordSelect(gbContourDrawMethod, "密度", cboDetailedList, 0, "contourDetailed", 10, 70, 40, 80, 0,
            function (obj, sel, v) { attrData.nowDataSolo().ContourMD.Detailed = v }, "", "", true);
        const gbContourLineLpat = Generic.createNewFrame(contourView, "gbContourLineLpat", "", 190, 0, 90, 55, "等値線線種");
        Generic.createNewCanvas(gbContourLineLpat, "contourLinePat", "imgButton", 20, 15, 50, 30, function (e) {
            clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.Line_Pat,
                function (Lpat) {
                    attrData.nowDataSolo().ContourMD.Regular.Line_Pat = Lpat;
                    attrData.Draw_Sample_LineBox(document.getElementById("contourLinePat"), Lpat);
                }
            );
        }, "");
        const gbRegularInterval = Generic.createNewFrame(contourView, "gbRegularInterval", "", 185, 0, 190, 390, "等値線間隔設定");
        const gbRegularNormal = Generic.createNewFrame(gbRegularInterval, "", "", 10, 10, 170, 125, "通常の等値線");
        Generic.createNewWordNumberInput(gbRegularNormal, "下限値", "", 0, "contourRegulerMinValue", 10, 15, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.bottom = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordNumberInput(gbRegularNormal, "上限値", "", 0, "contourRegulerMaxValue", 10, 40, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.top = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordNumberInput(gbRegularNormal, "間隔　", "", 0, "contourRegulerInterval", 10, 65, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.Interval = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordDivCanvas(gbRegularNormal, "contourRegulerLinePat", "線種", 10, 90, 40,
            function (e) {
                clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.Line_Pat,
                    function (Lpat) {
                        attrData.nowDataSolo().ContourMD.Regular.Line_Pat = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );

        const gbRegularSP = Generic.createNewFrame(gbRegularInterval, "", "", 10, 155, 170, 125, "上のうち強調する等値線");
        Generic.createNewWordNumberInput(gbRegularSP, "下限値", "", 0, "contourRegulerSPMinValue", 10, 15, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.SP_Bottom = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordNumberInput(gbRegularSP, "上限値", "", 0, "contourRegulerSPMaxValue", 10, 40, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.SP_Top = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordNumberInput(gbRegularSP, "間隔　", "", 0, "contourRegulerSPInterval", 10, 65, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.SP_interval = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordDivCanvas(gbRegularSP, "contourRegulerSPLinePat", "線種", 10, 90, 40,
            function (e) {
                clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.SP_Line_Pat,
                    function (Lpat) {
                        attrData.nowDataSolo().ContourMD.Regular.SP_Line_Pat = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );
        const gbRegularEx = Generic.createNewFrame(gbRegularInterval, "", "", 10, 295, 170, 70, "1本だけ強調する等値線");
        Generic.createNewCheckBox(gbRegularEx, "", "contourRegulerExCheck", true, 10, 15, undefined,
            function (obj) {
                attrData.nowDataSolo().ContourMD.Regular.EX_Value_Flag = obj.checked
            }, "")
        Generic.createNewWordNumberInput(gbRegularEx, "強調値", "", 0, "contourRegulerExValue", 40, 15, undefined, 80,
            function (obj, v) {
                attrData.nowDataSolo().ContourMD.Regular.EX_Value = v;
                Check_Print_err();
            }, "");
        Generic.createNewWordDivCanvas(gbRegularEx, "contourRegulerExLine", "線種", 10, 40, 40,
            function (e) {
                clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Regular.EX_Line_Pat,
                    function (Lpat) {
                        attrData.nowDataSolo().ContourMD.Regular.EX_Line_Pat = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );

        const gbSeparateSettings = Generic.createNewFrame(contourView, "gbSeparateSettings", "", 185, 0, 190, 360, "個別設定");
        lstcontourSeparateValue = new ListBox(gbSeparateSettings, "", [], 15, 15, 120, 150, function () { setContourSepaDataValue(); }, "");

        const gbContourSepaData = Generic.createNewFrame(gbSeparateSettings, "gbContourSepaData", "", 15, 175, 150, 100, "");
        Generic.createNewWordNumberInput(gbContourSepaData, "値", "", 0, "contourSepaValue", 10, 10, undefined, 80,
            function (obj, v) {
                let n = lstcontourSeparateValue.selectedIndex;
                attrData.nowDataSolo().ContourMD.Irregular[n].Value = v;
                sortContourSepaValue();
            }, "");
        Generic.createNewWordDivCanvas(gbContourSepaData, "contourSepaLine", "線種", 10, 40, 40,
            function (e) {
                let n = lstcontourSeparateValue.selectedIndex;
                clsLinePatternSet(e, attrData.nowDataSolo().ContourMD.Irregular[n].Line_Pat,
                    function (Lpat) {
                        attrData.nowDataSolo().ContourMD.Irregular[n].Line_Pat = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );
        gbContourSepaData.setVisibility(false);
        Generic.createNewButton(gbContourSepaData, "削除", "", 80, 70,
            function () {
                let n = lstcontourSeparateValue.selectedIndex;
                attrData.nowDataSolo().ContourMD.Irregular.splice(n, 1);
                attrData.nowDataSolo().ContourMD.IrregularNum--;
                lstcontourSeparateValue.removeList(n, 1);
                if (lstcontourSeparateValue.selectedIndex == -1) {
                    document.getElementById("gbContourSepaData").setVisibility(false);
                } else {
                    setContourSepaDataValue();
                }
                Check_Print_err();
            }, "width:60px");
        Generic.createNewButton(gbSeparateSettings, "追加", "", 10, 295,
            function () {
                document.getElementById("gbContourSepaData").setVisibility(true);
                lstcontourSeparateValue.addList([{ value: 0, text: "0" }], lstcontourSeparateValue.length);
                attrData.nowDataSolo().ContourMD.IrregularNum++;
                let dt = new strContour_Data_Irregular_interval()
                dt.Line_Pat = clsBase.Line();
                dt.Value = 0;
                attrData.nowDataSolo().ContourMD.Irregular.push(dt);
                setContourSepaDataValue();
            }, "width:60px");
        Generic.createNewButton(gbSeparateSettings, "すべて削除", "", 80, 295,
            function () {
                attrData.nowDataSolo().ContourMD.IrregularNum = 0;
                attrData.nowDataSolo().ContourMD.Irregular = [];
                lstcontourSeparateValue.removeAll();
                document.getElementById("gbContourSepaData").setVisibility(false);
            }, "width:100px");
        Generic.createNewButton(gbSeparateSettings, "階級区分の値を設定", "", 10, 325,
            function () {
                let ns = attrData.nowDataSolo();
                let n = ns.Div_Num - 1;
                ns.ContourMD.IrregularNum = n;
                ns.ContourMD.Irregular = [];
                let lst = [];
                for (let i = 0; i < n; i++) {
                    let dt = new strContour_Data_Irregular_interval()
                    dt.Line_Pat = clsBase.Line();
                    dt.Value = ns.Class_Div[i].Value;
                    ns.ContourMD.Irregular.push(dt);
                    lst.push({ value: dt.Value, text: dt.Value });
                }
                document.getElementById("gbContourSepaData").setVisibility(true);
                lstcontourSeparateValue.removeAll();
                lstcontourSeparateValue.addList(lst, 0);
                setContourSepaDataValue();
            }, "");
        function sortContourSepaValue() {
            //等値線数値の大きい順に並べ替える
            let n = lstcontourSeparateValue.selectedIndex;
            let nsc = attrData.nowDataSolo().ContourMD;
            let sort = new clsSortingSearch();
            let stac = [];
            let lst = [];
            for (let i = 0; i < nsc.IrregularNum; i++) {
                sort.Add(nsc.Irregular[i].Value);
                stac.push(nsc.Irregular[i].Clone());
            }
            sort.AddEnd();
            for (let i = 0; i < nsc.IrregularNum; i++) {
                let dt = stac[sort.DataPositionRev(i)];
                nsc.Irregular[i] = dt;
                lst.push({ value: dt.Value, text: String(dt.Value) });
            }
            let newn = sort.getAfterSortPositionRev(n);
            lstcontourSeparateValue.removeAll();
            lstcontourSeparateValue.addList(lst, 0);
            lstcontourSeparateValue.setSelectedIndex(newn);
            Check_Print_err();
        }

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■記号の大きさモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        const markSizeView = Generic.createNewDiv(settingModeWindow, "", "markSizeView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        markSizeView.style.backgroundColor = "#f0f0f0";
        const gbMark = Generic.createNewFrame(markSizeView, "gbMark", "", 0, 0, 115, 95, "表示記号設定");
        Generic.createNewCanvas(gbMark, "picMarkSize", "imgButton", 25, 17, 65, 65, picMark_Click, "");
        const gbMarkLine = Generic.createNewFrame(markSizeView, "gbMarkLine", "", 0, 0, 125, 95, "線の設定");
        Generic.createNewSizeSelect(gbMarkLine, 0, "cboMarkLineSize", "最大幅", 15, 10, 40, 1,
            function (obj, v) { attrData.nowDataSolo().MarkSizeMD.LineShape.LineWidth = v });
        Generic.createNewColorBox(gbMarkLine, "markLineColor", "色", "", 15, 35, MarkLineColor);
        Generic.createNewButton(gbMarkLine, "線端設定", "", 30, 70, btnMarkLineEdge, "");

        Generic.createNewButton(markSizeView, "内部データ", "", 20, 120, innerDataSet, "");
        const pnlMarkSizeLegend = Generic.createNewDiv(markSizeView, "", "pnlMarkSizeLegend", "", 0, 140, 280, 150, "", "");
        const gbLegendValue = Generic.createNewFrame(pnlMarkSizeLegend, "", "", 0, 15, 125, 160, "凡例");
        for (let i = 0; i < 5; i++) {
            Generic.createNewWordNumberInput(gbLegendValue, "値" + String(i + 1), "", 0, "txtMarkSizeValue" + String(i + 1), 10, i * 30 + 10, undefined, 80,
                function (obj, v) {
                    const n = Number(obj.id.right(1)) - 1;
                    attrData.nowDataSolo().MarkSizeMD.Value[n] = v;
                }, "");
        }

        const gbMarksizeLegendMaxValue = Generic.createNewFrame(pnlMarkSizeLegend, "", "", 140, 15, 150, 95, "最大サイズの値");
        const maxValuesetting = [{ value: enmMarkSizeValueMode.inDataItem, text: "データ項目の最大値" },
        { value: enmMarkSizeValueMode.UserDefinition, text: "ユーザ設定" }];
        Generic.createNewRadioButtonList(gbMarksizeLegendMaxValue, "markSizeMaxValueSetting", maxValuesetting, 10, 10, undefined, 30, undefined,
            function (v) { attrData.nowDataSolo().MarkSizeMD.MaxValueMode = v }, "");
        Generic.createNewNumberInput(gbMarksizeLegendMaxValue, 0, "markSizeUserMaxValue", 40, 63, 90,
            function (obj, v) { attrData.nowDataSolo().MarkSizeMD.MaxValue = v; }, "");
        setMinusValueCase(markSizeView, "gbMarkSizeMinusValueCase");

        //記号の大きさモード線オブジェクトの線端設定
        function btnMarkLineEdge(e) {
            let edge = attrData.nowDataSolo().MarkSizeMD.LineShape.LineEdge;
            clsLineEdgePattern(e, edge, okButton);
            function okButton(retEdge) {
                attrData.nowDataSolo().MarkSizeMD.LineShape.LineEdge = retEdge;
            }
        }
        //記号の大きさモード線オブジェクトの色設定
        function MarkLineColor(e) {
            let col = Generic.RGBAfromElement(e.target);
            attrData.nowDataSolo().MarkSizeMD.LineShape.Color = col;
        }


        //内部データボタンクリック
        function innerDataSet(e) {
            clsInnerDataSet(e, attrData, undefined);
        }

        //記号選択クリック(記号大きさ・記号の数共通)
        function picMark_Click(e) {
            let md;
            switch (attrData.nowData().ModeData) {
                case enmSoloMode_Number.MarkSizeMode:
                    md = attrData.nowDataSolo().MarkSizeMD;
                    break;
                case enmSoloMode_Number.MarkBlockMode:
                    md = attrData.nowDataSolo().MarkBlockMD;
                    break;
            }
            clsMarkSet(e, picMarkChange, md.Mark, attrData);
            function picMarkChange(newMark) {
                md.Mark = newMark;
                attrData.Draw_Sample_Mark_Box(e.target, newMark);
            }
        }
        //負の場合の内部色（記号の大きさ・数共通）
        function setMinusValueCase(parent, ID) {
            const gbBlockMinusValueCase = Generic.createNewFrame(parent, ID, "", 140, 0, 150, 120, "負の値の場合");
            Generic.createNewTileBox(gbBlockMinusValueCase, ID + "_minusColorBox", "負の値の内部", clsBase.Tile(), 10, 15, undefined,
                function (e) {
                    let mkc = attrData.nowDataSolo().MarkCommon;
                    clsTileSet(e, mkc.MinusTile,
                        function (retTile) { mkc.MinusTile = retTile });
                }
            );
            Generic.createNewSpan(gbBlockMinusValueCase, "凡例文字", "", "", 10, 45, "", "");
            Generic.createNewWordTextInput(gbBlockMinusValueCase, "正の値", "", "", ID + "_txtMarkSizePlusValue", 20, 62, undefined, 80,
                function (e) { attrData.nowDataSolo().MarkCommon.LegendPlusWord = e.target.value }, "text-align:left");
            Generic.createNewWordTextInput(gbBlockMinusValueCase, "負の値", "", "", ID + "_txtMarkSizeMinusValue", 20, 92, undefined, 80,
                function (e) { attrData.nowDataSolo().MarkCommon.LegendMinusWord = e.target.value }, "text-align:left");

        }
        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■記号の数モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let markBlockView = Generic.createNewDiv(settingModeWindow, "", "markBlockView", "rightSettingWindowControlBase", 10, scrMargin.top + 10, sw - 20, sh - 20, "", "");
        markBlockView.style.backgroundColor = "#f0f0f0";
        const gbBlockMark = Generic.createNewFrame(markBlockView, "", "", 0, 0, 115, 85, "表示記号設定");
        Generic.createNewCanvas(gbBlockMark, "picMarkBlockSize", "imgButton", 30, 17, 55, 55, picMark_Click, "");
        Generic.createNewButton(markBlockView, "内部データ", "", 20, 110, innerDataSet, "");
        const gbBlockMarkArrange = Generic.createNewFrame(markBlockView, "", "", 0, 140, 120, 95, "記号配置");
        const arrangeList = [{ value: enmMarkBlockArrange.Block, text: 'ブロック' },
        { value: enmMarkBlockArrange.Vertical, text: '縦' },
        { value: enmMarkBlockArrange.Horizontal, text: '横' },
        { value: enmMarkBlockArrange.Random, text: 'ランダム' }];
        Generic.createNewRadioButtonList(gbBlockMarkArrange, "blockArrange", arrangeList, 10, 10, undefined, 22, undefined,
            function (v) { attrData.nowDataSolo().MarkBlockMD.ArrangeB = v }, "");
        Generic.createNewWordNumberInput(markBlockView, "1記号あたりの値", "", 0, "markBlockValue", 0, 260, undefined, 100,
            function (obj, v) { attrData.nowDataSolo().MarkBlockMD.Value = v }, "");
        Generic.createNewWordTextInput(markBlockView, "凡例文字", "（空白は既定値）", "", "markBlockWord", 0, 285, undefined, 80,
            function (e) { attrData.nowDataSolo().MarkBlockMD.LegendBlockModeWord = e.target.value }, "text-align:left");
        Generic.createNewCheckBox(markBlockView, "端数表示", "markBlockHasu", false, 0, 310, undefined,
            function (obj) { attrData.nowDataSolo().MarkBlockMD.HasuVisible = obj.checked }, "text-align:left");
        const cboOverlapList = [{ value: 0, text: '少し離す' }, { value: 1, text: 'ぴったり' },
        { value: 2, text: '1/4重ねる' }, { value: 3, text: '1/2重ねる' }, { value: 4, text: '3/4重ねる' }];
        Generic.createNewWordSelect(markBlockView, "記号の重なり", cboOverlapList, 0, "markBlockOverlap", 0, 335, undefined, 100, 0,
            function (obj, sel, v) { attrData.nowDataSolo().MarkBlockMD.Overlap = v }, "", "", false);
        setMinusValueCase(markBlockView, "gbMarBlockMinusValueCase");

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■棒の高さモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let markBarView = Generic.createNewDiv(settingModeWindow, "", "markBarView", "rightSettingWindowControlBase", 20, scrMargin.top, sw - 20, sh - 20, "", "");
        Generic.createNewSizeSelect(markBarView, 0, "cboMarkBarHeightSize", "最大高さ", 0, 30, 60, 3,
            function (obj, v) { attrData.nowDataSolo().MarkBarMD.MaxHeight = v });

        const gbMarkBarLegendMaxValue = Generic.createNewFrame(markBarView, "", "", 0, 55, 150, 100, "最大高さの値");
        Generic.createNewRadioButtonList(gbMarkBarLegendMaxValue, "markBarmaxValueSetting", maxValuesetting, 10, 15, undefined, 30, undefined,
            function (v) { attrData.nowDataSolo().MarkBarMD.MaxValueMode = v }, "");
        Generic.createNewNumberInput(gbMarkBarLegendMaxValue, 0, "markBarUserMaxValue", 40, 70, 90,
            function (obj, v) { attrData.nowDataSolo().MarkBarMD.MaxValue = v; }, "");
        Generic.createNewSizeSelect(markBarView, 0, "cboMarkBarWidth", "幅", 0, 185, 40, 2,
            function (obj, v) { attrData.nowDataSolo().MarkBarMD.Width = v });
        Generic.createNewTileBox(markBarView, "markBarInnerColor", "内部色", clsBase.Tile(), 0, 215, 40,
            function (e) {
                let mkc = attrData.nowDataSolo().MarkBarMD.InnerTile;
                clsTileSet(e, mkc,
                    function (retTile) { attrData.nowDataSolo().MarkBarMD.InnerTile = retTile });
            }
        );
        Generic.createNewWordDivCanvas(markBarView, "markBarFrame", "輪郭線", 0, 245, 40,
            function (e) {
                clsLinePatternSet(e, attrData.nowDataSolo().MarkBarMD.FrameLinePat,
                    function (Lpat) {
                        attrData.nowDataSolo().MarkBarMD.FrameLinePat = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );
        Generic.createNewButton(markBarView, "内部データ", "", 0, 280, innerDataSet, "");

        const gbMarkBarShape= Generic.createNewFrame(markBarView, "", "", 180, 30, 150, 70, "形状");
        const MarkBarShapeList = [{ value: enmMarkBarShape.bar, text: "縦棒" },
        { value: enmMarkBarShape.triangle, text: "三角" }];
        Generic.createNewRadioButtonList(gbMarkBarShape, "markBarShape", MarkBarShapeList, 10, 15, undefined, 25, undefined,
            function (v) { attrData.nowDataSolo().MarkBarMD.BarShape = v }, "");

        const gbMarkBarScale = Generic.createNewFrame(markBarView, "", "", 180, 120, 150, 150, "縦棒設定");
        Generic.createNewCheckBox(gbMarkBarScale, "立体表示", "", true, 10, 20, undefined,
            function (obj) { attrData.nowDataSolo().MarkBarMD.ThreeD = obj.checked }, "");
        Generic.createNewCheckBox(gbMarkBarScale, "目盛り線表示", "markBarScaleCheck", true, 10, 50, undefined,
            function (obj) { attrData.nowDataSolo().MarkBarMD.ScaleLineVisible = obj.checked }, "");
        Generic.createNewWordNumberInput(gbMarkBarScale, "間隔", "", 0, "markBarScaleInterval", 15, 80, undefined, 80,
            function (obj, v) { attrData.nowDataSolo().MarkBarMD.ScaleLineInterval = v }, "");
        Generic.createNewWordDivCanvas(gbMarkBarScale, "markBarScaleLine", "パターン", 15, 110, 60,
            function (e) {
                clsLinePatternSet(e, attrData.nowDataSolo().MarkBarMD.scaleLinePat,
                    function (Lpat) {
                        attrData.nowDataSolo().MarkBarMD.scaleLinePat = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );


        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■文字モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let stringView = Generic.createNewDiv(settingModeWindow, "", "stringView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        stringView.style.backgroundColor = "#f0f0f0";
        Generic.createNewButton(stringView, "フォント", "", 30, 30, function (e) {
            let md = attrData.nowDataSolo().StringMD;
            clsFontSet(e, md.Font, function (newFont) { md.Font = newFont }, attrData);
        }, "");

        Generic.createNewSizeSelect(stringView, 0, "txtStringSizeChange", "最大幅", 30, 70, 40, 3,
            function (obj, v) { attrData.nowDataSolo().StringMD.maxWidth = v; });
        Generic.createNewCheckBox(stringView, "最大幅を超えたら折り返す", "chkStringReturn", false, 30, 110, undefined,
            function (obj) { attrData.nowDataSolo().StringMD.WordTurnF = obj.checked }, "");
        Generic.createNewButton(stringView, "内部データ", "", 30, 150, innerDataSet, "");

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■重ね合わせモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let overlayView = Generic.createNewDiv(settingModeWindow, "", "overlayView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gbOverlayDataSet = Generic.createNewFrame(overlayView, "gbOverlayDataSet", "", 0, 10, 380, 80, "重ね合わせデータセット");
        Generic.createNewSelect(gbOverlayDataSet, [], -1, "overlayDataSetList", 15, 15, false,
            function (obj, selectedIndex, value) {
                attrData.TotalData.TotalMode.OverLay.SelectedIndex = selectedIndex;
                overlayDatasetDataItem();
            }, "width:185px", 1, false);
        Generic.createNewButton(gbOverlayDataSet, "追加", "", 205, 15,
            function () {
                let ov = attrData.TotalData.TotalMode.OverLay;
                ov.AddDataSet();
                ov.SelectedIndex = ov.DataSet.length - 1;
                setSettingOverlayModeWindow();
            },  "font-size:12px");
        Generic.createNewButton(gbOverlayDataSet, "データセット削除", "", 260, 15,
            function (e) {
                let ov = attrData.TotalData.TotalMode.OverLay;
                if (ov.DataSet.length == 1) {
                    Generic.alert(new point(e.clientX, e.clientY),"これ以上削除できません。");
                    return;
                }
                ov.DataSet.splice(ov.SelectedIndex, 1);
                ov.SelectedIndex = Math.min(ov.SelectedIndex, ov.DataSet.length - 1);
                let aoi = ov.Always_Overlay_Index;
                if (aoi == ov.SelectedIndex) {
                    aoi = -1
                } else {
                    if (aoi > ov.SelectedIndex) {
                        aoi--;
                    }
                }
                ov.Always_Overlay_Index = aoi;
                setSettingOverlayModeWindow();
            }, "font-size:12px");
        Generic.createNewWordTextInput(gbOverlayDataSet, "タイトル", "", "", "overlayDatasetTitle", 15, 45, undefined, 200,
            function (e) {
                let ov = attrData.TotalData.TotalMode.OverLay;
                let ttl = e.target.value;
                attrData.nowOverlay().title = ttl;
                document.getElementById("overlayDataSetList").setSelectData(ov.SelectedIndex, ov.SelectedIndex, ttl);
            }, "");
        Generic.createNewCheckBox(gbOverlayDataSet, "常に重ねる", "overlayAlwaysOver", false, 290, 50, undefined,
            function (obj) {
                attrData.TotalData.TotalMode.OverLay.Always_Overlay_Index = (obj.checked == true) ? attrData.TotalData.TotalMode.OverLay.SelectedIndex : -1;
            }, "");

        let gbOverlayDataSetItem = Generic.createNewFrame(overlayView, "gbOverlayDataSetItem", "", 0, 110, 380, 290, "重ね合わせデータ");

        let overHdata = Generic.Array2Dimension(4, 1);
        overHdata[0][0] = "レイヤ";
        overHdata[1][0] = "データ";
        overHdata[2][0] = "表示モード";
        overHdata[3][0] = "凡例";
        let borderStyle = "border:solid 1px;background-Color:#ffffff"
        overlayListView = new ListViewTable(gbOverlayDataSetItem, "", "", "", overHdata, [], 15, 15, 350, 200, borderStyle, "font-size:13px;",
            "background-Color:#dddddd;text-align:center", "", ["", "", "", "width:10%"], "", true,
            function (row) { overlayDatasetDataItemEach() });

        let gbOverlayItemData = Generic.createNewFrame(gbOverlayDataSetItem, "gbOverlayItemData", "", 15, 230, 230, 50, "");
        Generic.createNewImageButton(gbOverlayItemData, "", "image/112_UpArrowLong_Grey_24x24_72.png", 8, 13, 24, 24, function () {
            let n = overlayListView.selectedRow;
            overlayListView.rowUp();
            let dest = n - 1;
            let d1 = attrData.nowOverlay().DataItem[n].Clone();
            if (dest == -1) {
                attrData.nowOverlay().DataItem.shift();
                attrData.nowOverlay().DataItem.push(d1);
            } else {
                let d2 = attrData.nowOverlay().DataItem[dest].Clone();
                attrData.nowOverlay().DataItem[n] = d2;
                attrData.nowOverlay().DataItem[dest] = d1;
            }

        }, "padding:2px");
        Generic.createNewImageButton(gbOverlayItemData, "", "image/112_DownArrowLong_Grey_24x24_72.png", 43, 13, 24, 24,
            function () {
                let n = overlayListView.selectedRow;
                overlayListView.rowDown();
                let dest = n + 1;
                let d1 = attrData.nowOverlay().DataItem[n].Clone();
                if (dest == attrData.nowOverlay().DataItem.length) {
                    dest = 0;
                    attrData.nowOverlay().DataItem.splice(0, 0, d1);
                    attrData.nowOverlay().DataItem.pop();
                } else {
                    let d2 = attrData.nowOverlay().DataItem[dest].Clone();
                    attrData.nowOverlay().DataItem[n] = d2;
                    attrData.nowOverlay().DataItem[dest] = d1;
                }
            }, "padding:2px");
        Generic.createNewCheckBox(gbOverlayItemData, "凡例を表示", "overlayItemDataLegendPrint", false, 75, 18, undefined,
            function (obj) {
                let n = overlayListView.selectedRow;
                attrData.nowOverlay().DataItem[n].Legend_Print_Flag = obj.checked;
                let tx = (obj.checked == true) ? "表示" : "非表示";
                overlayListView.setValue(3, n, tx);
            }, "");
        Generic.createNewButton(gbOverlayItemData, "削除", "", 170, 15,
            function () {
                if (attrData.nowOverlay().DataItem.length > 0) {
                    let n = overlayListView.selectedRow;
                    attrData.nowOverlay().DataItem.splice(n, 1);
                    overlayListView.deleteRow();
                    if (attrData.nowOverlay().DataItem.length == 0) {
                        gbOverlayItemData.setVisibility(false);
                    }
                }
            }, "width:50px");
        Generic.createNewButton(gbOverlayDataSetItem, "注", "", 260, 230,
            function () {

            }, "width:50px");
        Generic.createNewButton(gbOverlayDataSetItem, "すべて削除", "", 260, 260,
            function () {
                attrData.nowOverlay().DataItem = [];
                overlayListView.clear();
                gbOverlayItemData.setVisibility(false);
            }, "width:100px");

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■連続表示モード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let seriesView = Generic.createNewDiv(settingModeWindow, "", "seriesView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gbseriesDataSet = Generic.createNewFrame(seriesView, "gbSeriesDataSet", "", 0, 10, 380, 80, "連続表示データセット");
        Generic.createNewSelect(gbseriesDataSet, [], -1, "seriesDataSetList", 15, 15, false,
            function (obj, selectedIndex, value) {
                attrData.TotalData.TotalMode.Series.SelectedIndex = selectedIndex;
                seriesDatasetDataItem();
            }, "width:185px", 1, false);
        Generic.createNewButton(gbseriesDataSet, "追加", "", 205, 15,
            function () {
                let ov = attrData.TotalData.TotalMode.Series;
                ov.AddDataSet();
                ov.SelectedIndex = ov.DataSet.length - 1;
                setSettingSeriesModeWindow();
            }, "font-size:12px");
        Generic.createNewButton(gbseriesDataSet, "データセット削除", "", 260, 15,
            function (e) {
                let ov = attrData.TotalData.TotalMode.Series;
                if (ov.DataSet.length == 1) {
                    Generic.alert(new point(e.clientX, e.clientY),"これ以上削除できません。");
                    return;
                }
                ov.DataSet.splice(ov.SelectedIndex, 1);
                ov.SelectedIndex = Math.min(ov.SelectedIndex, ov.DataSet.length - 1);
                setSettingSeriesModeWindow();
            }, "font-size:12px");
        Generic.createNewWordTextInput(gbseriesDataSet, "タイトル", "", "", "seriesDatasetTitle", 15, 45, undefined, 200,
            function (e) {
                let ov = attrData.TotalData.TotalMode.Series;
                let ttl = e.target.value;
                attrData.nowSeries().title = ttl;
                document.getElementById("seriesDataSetList").setSelectData(ov.SelectedIndex, ov.SelectedIndex, ttl);
            }, "");

        let gbSeriesDataSetItem = Generic.createNewFrame(seriesView, "gbSeriesDataSetItem", "", 0, 110, 380, 290, "連続表示データ");

        let seriesHdata = Generic.Array2Dimension(4, 1);
        seriesHdata[0][0] = "順番";
        seriesHdata[1][0] = "レイヤ";
        seriesHdata[2][0] = "データ";
        seriesHdata[3][0] = "表示モード";
        let slborderStyle = "border:solid 1px;background-Color:#ffffff"
        seriesListView = new ListViewTable(gbSeriesDataSetItem, "", "", "", seriesHdata, [], 15, 15, 350, 200, slborderStyle, "font-size:13px;",
            "background-Color:#dddddd;text-align:center", "", ["width:10%"], ["text-align:center"], true, undefined);

        let gbSeriesItemData = Generic.createNewFrame(gbSeriesDataSetItem, "gbSeriesItemData", "", 15, 230, 150, 50, "");
        Generic.createNewImageButton(gbSeriesItemData, "", "image/112_UpArrowLong_Grey_24x24_72.png", 10, 13, 24, 24, function () {
            let n = seriesListView.selectedRow;
            seriesListView.rowUp();
            resetSeriesListOrderNumber();
            let dest = n - 1;
            let d1 = attrData.nowSeries().DataItem[n].Clone();
            if (dest == -1) {
                attrData.nowSeries().DataItem.shift();
                attrData.nowSeries().DataItem.push(d1);
            } else {
                let d2 = attrData.nowSeries().DataItem[dest].Clone();
                attrData.nowSeries().DataItem[n] = d2;
                attrData.nowSeries().DataItem[dest] = d1;
            }

        }, "padding:2px");
        Generic.createNewImageButton(gbSeriesItemData, "", "image/112_DownArrowLong_Grey_24x24_72.png", 45, 13, 24, 24,
            function () {
                let n = seriesListView.selectedRow;
                seriesListView.rowDown();
                resetSeriesListOrderNumber();
                let dest = n + 1;
                let d1 = attrData.nowSeries().DataItem[n].Clone();
                if (dest == attrData.nowSeries().DataItem.length) {
                    dest = 0;
                    attrData.nowSeries().DataItem.splice(0, 0, d1);
                    attrData.nowSeries().DataItem.pop();
                } else {
                    let d2 = attrData.nowSeries().DataItem[dest].Clone();
                    attrData.nowSeries().DataItem[n] = d2;
                    attrData.nowSeries().DataItem[dest] = d1;
                }
            }, "padding:2px");

        Generic.createNewButton(gbSeriesItemData, "削除", "", 90, 15,
            function () {
                if (attrData.nowSeries().DataItem.length > 0) {
                    let n = seriesListView.selectedRow;
                    attrData.nowSeries().DataItem.splice(n, 1);
                    seriesListView.deleteRow();
                    resetSeriesListOrderNumber();
                    if (attrData.nowSeries().DataItem.length == 0) {
                        gbSeriesItemData.setVisibility(false);
                    }
                }
            }, "width:50px");
        Generic.createNewButton(gbSeriesDataSetItem, "反転", "", 190, 245,
            function () {
                if (attrData.nowSeries().DataItem.length < 2) {
                    return;
                }
                let series = attrData.TotalData.TotalMode.Series;
                let seriesSelD = series.DataSet[series.SelectedIndex];
                let n = seriesSelD.DataItem.length;
                for (let i = 0; i < parseInt(n / 2); i++) {
                    [seriesSelD.DataItem[i], seriesSelD.DataItem[n - 1 - i]] = [seriesSelD.DataItem[n - 1 - i], seriesSelD.DataItem[i]];
                }
                seriesListView.reverse();
                resetSeriesListOrderNumber();
            }, "width:50px");
        Generic.createNewButton(gbSeriesDataSetItem, "すべて削除", "", 260, 245,
            function () {
                attrData.nowSeries().DataItem = [];
                seriesListView.clear();
                gbSeriesItemData.setVisibility(false);
            }, "width:100px");

        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■グラフモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let graphView = Generic.createNewDiv(settingModeWindow, "", "graphView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gbgraphDataSet = Generic.createNewFrame(graphView, "gbgraphDataSet", "", 0, 10, 380, 80, "グラフデータセット");
        Generic.createNewSelect(gbgraphDataSet, [], -1, "graphDataSetList", 15, 15, false,
            function (obj, selectedIndex, value) {
                attrData.layerGraph().SelectedIndex = selectedIndex;
                pnlGraphItem.selectedRow = -1;
                pnlGraphEachItem(0);
                graphDatasetDataItem();
            }, "width:185px", 1, false);
        Generic.createNewButton(gbgraphDataSet, "追加", "", 205, 15,
            function () {
                let gv = attrData.layerGraph();
                gv.AddDataSet();
                gv.SelectedIndex = gv.DataSet.length - 1;
                pnlGraphItem.selectedRow = -1;
                setSettingGraphModeWindow();
            }, "font-size:12px");
        Generic.createNewButton(gbgraphDataSet, "データセット削除", "", 260, 15,
            function (e) {
                let gv = attrData.layerGraph();
                if (gv.DataSet.length == 1) {
                    Generic.alert(new point(e.clientX, e.clientY),"これ以上削除できません。");
                    return;
                }
                gv.DataSet.splice(gv.SelectedIndex, 1);
                gv.SelectedIndex = Math.min(gv.SelectedIndex, gv.DataSet.length - 1);
                setSettingGraphModeWindow();
            }, "font-size:12px");
        Generic.createNewWordTextInput(gbgraphDataSet, "タイトル", "", "", "graphDatasetTitle", 15, 45, undefined, 200,
            function (e) {
                let ttl = e.target.value;
                attrData.nowGraph().title = ttl;
                 document.getElementById("graphDataSetList").setSelectData(attrData.layerGraph().SelectedIndex, attrData.layerGraph().SelectedIndex, ttl);
            }, "");

        let gbGraphDataSetItem = Generic.createNewFrame(graphView, "gbGraphDataSetItem", "", 0, 110, 250, 290, "表示データ項目");
        let pnlGraphItemBase = Generic.createNewDiv(gbGraphDataSetItem, "", "pnlGraphItemBase", "grayFrame", 10, 15, 230, 200, "overflow-y:scroll;overflow-x:hidden;background-Color:#ffffff", undefined);
        let pnlGraphItem = Generic.createNewDiv(pnlGraphItemBase, "", "pnlGraphItem", "", 0, 0, 230, 200 - scrMargin.scrollWidth, "overflow:hidden", undefined);
        pnlGraphItem.inPanel = 0;
        pnlGraphItem.selectedRow = -1;
        Generic.createNewImageButton(gbGraphDataSetItem, "", "image/112_UpArrowLong_Grey_24x24_72.png", 10, 225, 24, 24, function () {
            let n = pnlGraphItem.selectedRow;
            let selGraph = attrData.nowGraph();
            let dest = n - 1;
            let d1 = selGraph.Data[n].Clone();
            if (dest == -1) {
                selGraph.Data.shift();
                selGraph.Data.push(d1);
            } else {
                let d2 = selGraph.Data[dest].Clone();
                selGraph.Data[n] = d2;
                selGraph.Data[dest] = d1;
            }
            pnlGraphEachItem(dest);
        }, "padding:2px");
        Generic.createNewImageButton(gbGraphDataSetItem, "", "image/112_DownArrowLong_Grey_24x24_72.png", 45, 225, 24, 24,
            function () {
                let n = pnlGraphItem.selectedRow;
                let dest = n + 1;
                let selGraph = attrData.nowGraph();
                let d1 = selGraph.Data[n].Clone();
                if (dest == selGraph.Data.length) {
                    dest = 0;
                    selGraph.Data.splice(0, 0, d1);
                    selGraph.Data.pop();
                } else {
                    let d2 = selGraph.Data[dest].Clone();
                    selGraph.Data[n] = d2;
                    selGraph.Data[dest] = d1;
                }
                pnlGraphEachItem(dest);
            }, "padding:2px");
        Generic.createNewButton(gbGraphDataSetItem, "追加", "", 85, 230,
            function (e) {
                let selGraph = attrData.nowGraph();
                let preAsta = [];
                for (let i = 0; i < selGraph.Data.length; i++) {
                    preAsta.push(selGraph.Data[i].DataNumber);
                }
                clsSelectData(e, attrData, attrData.TotalData.LV1.SelectedLayer,
                    function (selectedStatus, selectedNumber) {
                        let colorPat = [];
                        colorPat.push(new colorRGBA([255, 40, 0]));
                        colorPat.push(new colorRGBA([0, 0o0, 0xbf]));
                        colorPat.push(new colorRGBA([255, 255, 0xbf]));
                        colorPat.push(new colorRGBA([0xbf, 255, 0xbf]));
                        colorPat.push(new colorRGBA([0xbf, 255, 255]));
                        colorPat.push(new colorRGBA([255, 0xbf, 255]));
                        colorPat.push(new colorRGBA([255, 0xbf, 0xbf]));
                        colorPat.push(new colorRGBA([0xbf, 0xbf, 255]));
                        colorPat.push(new colorRGBA([255, 255, 255]));
                        colorPat.push(new colorRGBA([0xdb, 0xdb, 0xdb]));
                        let n = selGraph.Data.length;
                        for (let i = 0; i < selectedNumber.length; i++) {
                            let d = new GraphModeDataItem();
                            d.DataNumber = selectedNumber[i];
                            d.Tile = clsBase.Tile();
                            d.Tile.Color = colorPat[(n + i) % colorPat.length].Clone();
                            d.Tile.Color = Generic.GetColorArrange(d.Tile.Color, -parseInt((n + i) / colorPat.length) * 50);
                            selGraph.Data.push(d);
                        }
                        pnlGraphEachItem(n);
                    }, preAsta, true, true, false, false);
            }, "width:70px");
        Generic.createNewButton(gbGraphDataSetItem, "削除", "", 170, 230,
            function () {
                let n = pnlGraphItem.selectedRow;
                if (n != -1) {
                    attrData.nowGraph().Data.splice(n, 1);
                    let mxn = attrData.nowGraph().Data.length;
                    pnlGraphItem.selectedRow = -1;
                    pnlGraphEachItem(Math.min(n, mxn - 1));
                }
            }, "width:70px");

        Generic.createNewButton(gbGraphDataSetItem, "すべて削除", "", 160, 260,
            function () {
                attrData.nowGraph().Data = [];
                pnlGraphItem.selectedRow = -1;
                pnlGraphEachItem(-1);
            }, "width:80px");

        Generic.createNewButton(gbGraphDataSetItem, "同一色に設定", "btmBarGraphColorSetting", 40, 260,
            function (e) {
                let selGraph = attrData.nowGraph();
                clsTileSet(e, selGraph.Data[0].Tile,
                    function (retTile) {
                        for (let i = 0; i < selGraph.Data.length; i++) {
                            selGraph.Data[i].Tile = retTile.Clone();
                            let tbox = document.getElementById("pnlGraphIteminPanelTileBox" + String(i));
                            Generic.setTileDiv(tbox, retTile);
                        }
                    });
            }, "width:110px");

        let gbGraphShape = Generic.createNewFrame(graphView, "gbGraphShape", "", 260, 110, 120, 130, "グラフの形式");
        let gslist = [{ value: enmGraphMode.PieGraph, text: "円グラフ" }, { value: enmGraphMode.StackedBarGraph, text: "帯グラフ" }, { value: enmGraphMode.LineGraph, text: "折れ線グラフ" }, { value: enmGraphMode.BarGraph, text: "棒グラフ" }];
        Generic.createNewRadioButtonList(gbGraphShape, "graphShape", gslist, 10, 15, undefined, 25, undefined,
            function (v) {
                let selGraph = attrData.nowGraph();
                selGraph.GraphMode = v;
                for (let i = 0; i < selGraph.Data.length; i++) {
                    let tbox = document.getElementById("pnlGraphIteminPanelTileBox" + String(i));
                    tbox.setVisibility(v != enmGraphMode.LineGraph);
                }
                document.getElementById("btmBarGraphColorSetting").setVisibility(v == enmGraphMode.BarGraph);
                Check_Print_err();
            }, "");
        const gbGraphLineLpat = Generic.createNewFrame(graphView, "gbGraphLineLpat", "", 260, 260, 120, 45, "線種");
        Generic.createNewCanvas(gbGraphLineLpat, "graphLinePat", "imgButton", 35, 10, 50, 25, function (e) {
            let selGraph = attrData.nowGraph();
            switch (selGraph.GraphMode) {
                case enmGraphMode.PieGraph:
                case enmGraphMode.StackedBarGrap:
                    clsLinePatternSet(e, selGraph.En_Obi.BoaderLine,
                        function (Lpat) {
                            selGraph.En_Obi.BoaderLine = Lpat;
                            picGraphLinePat();
                        });
                    break;
                case enmGraphMode.BarGraph:
                case enmGraphMode.LineGraph:
                    clsLinePatternSet(e, selGraph.Oresen_Bou.Line,
                        function (Lpat) {
                            selGraph.Oresen_Bou.Line = Lpat;
                            picGraphLinePat();
                        });
                    break;
            }
        }, "");

        Generic.createNewButton(graphView, "サイズ等設定", "", 260, 335, function () {
            if (attrData.nowGraph().Data.length > 0) {
                let selGraph = attrData.nowGraph();
                switch (selGraph.GraphMode) {
                    case enmGraphMode.PieGraph:
                    case enmGraphMode.StackedBarGraph:
                        graphModeEn_Obi();
                        break;
                    case enmGraphMode.BarGraph:
                    case enmGraphMode.LineGraph:
                        graphModeOresen_Bou();
                        break;
                }
            } else {
                Generic.alert(undefined,"表示データ項目を選択して下さい。")
            }
        }, "width:120;font-size:15px;font-weight:bold");


        //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ラベルモード■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
        let labelView = Generic.createNewDiv(settingModeWindow, "", "labelView", "rightSettingWindowControlBase", 10, scrMargin.top, sw - 20, sh - 20, "", "");
        let gblabelDataSet = Generic.createNewFrame(labelView, "gblabelDataSet", "", 0, 10, 380, 80, "ラベルデータセット");
        Generic.createNewSelect(gblabelDataSet, [], -1, "labelDataSetList", 15, 15, false,
            function (obj, selectedIndex, value) {
                attrData.layerLabel().SelectedIndex = selectedIndex;
                labelDatasetDataItem();
            }, "width:185px", 1, false);
        Generic.createNewButton(gblabelDataSet, "追加", "", 205, 15,
            function () {
                let ov = attrData.layerLabel();
                ov.AddDataSet();
                ov.SelectedIndex = ov.DataSet.length - 1;
                setSettingLabelModeWindow();
            }, "font-size:12px");
        Generic.createNewButton(gblabelDataSet, "データセット削除", "", 260, 15,
            function (e) {
                let ov = attrData.layerLabel();
                if (ov.DataSet.length == 1) {
                    Generic.alert(new point(e.clientX, e.clientY),"これ以上削除できません。");
                    return;
                }
                ov.DataSet.splice(ov.SelectedIndex, 1);
                ov.SelectedIndex = Math.min(ov.SelectedIndex, ov.DataSet.length - 1);
                setSettingLabelModeWindow();
            }, "font-size:12px");
        Generic.createNewWordTextInput(gblabelDataSet, "タイトル", "", "", "labelDatasetTitle", 15, 45, undefined, 200,
            function (e) {
                let ttl = e.target.value;
                attrData.nowLabel().title = ttl;
                document.getElementById("labelDataSetList").setSelectData(attrData.layerLabel().SelectedIndex, attrData.layerGraph().SelectedIndex, ttl);
            }, "");

        let gbLabelObjName = Generic.createNewFrame(labelView, "gbLabelDataSetItem", "", 0, 110, 230, 70, "オブジェクト名");
        Generic.createNewCheckBox(gbLabelObjName, "オブジェクト名表示", "chkLblObjectName", false, 15, 15, undefined,
            function (obj) { attrData.nowLabel().ObjectName_Print_Flag = obj.checked; })
        Generic.createNewCheckBox(gbLabelObjName, "最大幅を超えたら折り返す", "chkLblObjectNameReturn", false, 15, 42, undefined,
            function (obj) { attrData.nowLabel().ObjectName_Turn_Flag = obj.checked }, "");
        Generic.createNewButton(gbLabelObjName, "フォント", "", 155, 12, function (e) {
            clsFontSet(e, attrData.nowLabel().ObjectName_Font, function (newFont) { attrData.nowLabel().ObjectName_Font = newFont }, attrData);
        }, "");

        let gbLabelMaxSize = Generic.createNewFrame(labelView, "gbLabelDataSetItem", "", 240, 110, 110, 70, "最大幅");
        Generic.createNewSizeSelect(gbLabelMaxSize, 0, "txtLabelSizeChange", "", 15, 30, 40, 3,
            function (obj, v) { attrData.nowLabel().Width = v; });

        let gbLabelDataItem = Generic.createNewFrame(labelView, "gbLabelDataSetItem", "", 0, 195, 350, 155, "データ項目");
        lstLabelDataItem = new ListBox(gbLabelDataItem, "", [], 15, 15, 180, 80, undefined, "");
        Generic.createNewImageButton(gbLabelDataItem, "", "image/112_UpArrowLong_Grey_24x24_72.png", 200, 15, 24, 24, function () {
            let n = lstLabelDataItem.selectedIndex;
            if (n == -1) { return };
            let selLabel = attrData.nowLabel();
            let dest = n - 1;
            let d1 = selLabel.DataItem[n];
            if (dest == -1) {
                selLabel.DataItem.shift();
                selLabel.DataItem.push(d1);
                dest = selLabel.DataItem.length - 1;
            } else {
                let d2 = selLabel.DataItem[dest];
                selLabel.DataItem[n] = d2;
                selLabel.DataItem[dest] = d1;
            }
            lstLabelDataItem.rowUp(n);
        }, "padding:2px");
        Generic.createNewImageButton(gbLabelDataItem, "", "image/112_DownArrowLong_Grey_24x24_72.png", 200, 60, 24, 24,
            function () {
                let n = lstLabelDataItem.selectedIndex;
                if (n == -1) { return };
                let dest = n + 1;
                let selLabel = attrData.nowLabel();
                let d1 = selLabel.DataItem[n];
                if (dest == selLabel.DataItem.length) {
                    dest = 0;
                    selLabel.DataItem.splice(0, 0, d1);
                    selLabel.DataItem.pop();
                } else {
                    let d2 = selLabel.DataItem[dest];
                    selLabel.DataItem[n] = d2;
                    selLabel.DataItem[dest] = d1;
                }
                lstLabelDataItem.rowDown(n);
            }, "padding:2px");
        Generic.createNewButton(gbLabelDataItem, "追加", "", 250, 15,
            function (e) {
                let selLabel = attrData.nowLabel();
                let preAsta = [];
                for (let i = 0; i < selLabel.DataItem.length; i++) {
                    preAsta.push(selLabel.DataItem[i]);
                }
                clsSelectData(e, attrData, attrData.TotalData.LV1.SelectedLayer,
                    function (selected, selectedNumber) {
                        let adList = [];
                        let selN = lstLabelDataItem.length;
                        selN = (selN == -1) ? 0 : selN;
                        let Layernum = attrData.TotalData.LV1.SelectedLayer;
                        for (let i = 0; i < selectedNumber.length; i++) {
                            selLabel.DataItem.push(selectedNumber[i]);
                            adList.push({ value: selectedNumber[i], text: attrData.Get_DataTitle(Layernum, selectedNumber[i], true) });
                        }
                        lstLabelDataItem.addList(adList, selN);
                    }, preAsta, true, true, true, true);
            }, "width:70px");
        Generic.createNewButton(gbLabelDataItem, "削除", "", 250, 45,
            function () {
                let n = lstLabelDataItem.selectedIndex;
                if (n != -1) {
                    attrData.nowLabel().DataItem.splice(n, 1);
                    lstLabelDataItem.removeList(n, 1);
                }
            }, "width:70px");
        Generic.createNewButton(gbLabelDataItem, "すべて削除", "", 250, 75,
            function () {
                attrData.nowLabel().DataItem = [];
                lstLabelDataItem.removeAll();
            }, "width:80px");
        Generic.createNewCheckBox(gbLabelDataItem, "データ項目名の表示", "chkLblDataName_Print_Flag", false, 15, 105, 110,
            function (obj) { attrData.nowLabel().DataName_Print_Flag = obj.checked; })
        Generic.createNewCheckBox(gbLabelDataItem, "単位の表示", "chkLblDataValue_Unit_Flag", false, 150, 105, undefined,
            function (obj) { attrData.nowLabel().DataValue_Unit_Flag = obj.checked; })
        Generic.createNewCheckBox(gbLabelDataItem, "最大幅を超えたら折り返す", "chkLblDataValue_TurnFlag", false, 15, 130, undefined,
            function (obj) { attrData.nowLabel().DataValue_TurnFlag = obj.checked }, "");
        Generic.createNewButton(gbLabelDataItem, "フォント", "", 230, 125, function (e) {
            clsFontSet(e, attrData.nowLabel().DataValue_Font, function (newFont) { attrData.nowLabel().DataValue_Font = newFont }, attrData);
        }, "");

        let gbLabelFrame = Generic.createNewFrame(labelView, "gbLabelFrame", "", 0, 365, 350, 40, "枠");
        Generic.createNewWordDivCanvas(gbLabelFrame, "labelFrame", "輪郭線", 10, 10, 40,
            function (e) {
                clsLinePatternSet(e, attrData.nowLabel().BorderLine,
                    function (Lpat) {
                        attrData.nowLabel().BorderLine = Lpat;
                        attrData.Draw_Sample_LineBox(e.target, Lpat);
                    }
                );
            }
        );
        Generic.createNewTileBox(gbLabelFrame, "labelObjectNameColor", "オブジェクト名背景", clsBase.Tile(), 120, 10, 60,
            function (e) {
                let mkc = attrData.nowLabel().BorderObjectTile;
                clsTileSet(e, mkc,
                    function (retTile) { attrData.nowLabel().BorderObjectTile = retTile });
            }
        );
        Generic.createNewTileBox(gbLabelFrame, "labelDataColor", "データ項目背景", clsBase.Tile(), 240, 10, 50,
            function (e) {
                let mkc = attrData.nowLabel().BorderDataTile;
                clsTileSet(e, mkc,
                    function (retTile) { attrData.nowLabel().BorderDataTile = retTile });
            }
        );
    }

    /**設定のエラーをチェックして確認ボタンを表示 */
    Check_Print_err = function () {
        let errButton = document.getElementById("settingWindowBtnPrintError");
        let retV = attrData.Get_PrintError();
        switch (retV.Print_Enable) {
            case enmPrint_Enable.Printable:
                errButton.setVisibility(false);
                break;
            case enmPrint_Enable.Printable_with_Error:
                errButton.setVisibility(true);
                errButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                break;
            case enmPrint_Enable.UnPrintable:
                errButton.setVisibility(true);
                errButton.style.backgroundColor = 'rgba(255, 0, 0, 200)';
                break;
        }

        //属性検索設定の有無
        let f = false;
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                f = attrData.Check_Condition_UMU(attrData.TotalData.LV1.SelectedLayer);
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                let n = attrData.TotalData.TotalMode.OverLay.SelectedIndex
                for (i = 0; i < attrData.TotalData.TotalMode.OverLay.DataSet[n].DataItem.length; i++) {
                    f = attrData.Check_Condition_UMU(attrData.TotalData.TotalMode.OverLay.DataSet[n].DataItem[i].Layer);
                    if (f == true) {
                        break;
                    }
                }
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                let n = attrData.TotalData.TotalMode.Series.SelectedIndex
                for (i = 0; i < attrData.TotalData.TotalMode.Series.DataSet[n].DataItem.length; i++) {
                    let ad = attrData.TotalData.TotalMode.Series.DataSet[n].DataItem[i];
                    switch (attrData.Print_Mode_Total) {
                        case enmTotalMode_Number.DataViewMode: {
                            f = attrData.Check_Condition_UMU(ad.Layer);
                            if (f == true) {
                                break;
                            }
                            break;
                        }
                        case enmTotalMode_Number.OverLayMode: {
                            for (let j = 0; j < attrData.TotalData.TotalMode.OverLay.DataSet[ad.Data].DataItem.length; j++) { }
                            f = attrData.Check_Condition_UMU(attrData.TotalData.TotalMode.OverLay.DataSet(ad.Data).DataItem[j].Layer);
                            if (f == true) {
                                break;
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
        document.getElementById("settingWindowBtnConditionInfo").setVisibility(f);
    }
    /**最初に読み込むファイルがURLパラメータに指定されている */
    function getFirstFile(url){
        let filename=Generic.getFilename(url);
        let ext=Generic.getExtension(url).toLowerCase();
        if((ext!="mdrj")&&(ext!="mdrmj")){
            Generic.alert(undefined,filename +"読み込めません。最初に読み込めるのはmdrj、mdrmjファイルのみです。");
            return;
        }
        Generic.readingIcon(filename +"データ読み込み");
        Generic.getMapfileByHttpRequest(url, function (getData) {
            attrData = new clsAttrData();
            let mapdata = [];
            let retv = attrData.OpenNewMandaraFile(mapdata, getData, filename, ext);
            if (retv.emes != "") {
                Generic.createMsgBox("読み込みエラー", retv.emes, true);
            }
            if (retv.ok == false) {
                Generic.clear_backDiv();
                Generic.alert(undefined, "MANDARAデータとして読み込めませんでした。");
            } else {
                Generic.clear_backDiv();
                initAfterGetData(true);
                man_Data = attrData.TotalData.LV1.DataSourceType;
            }

        });
    }
}

//属性データ読み込み
function readData(okCall) {
    document.body.removeEventListener("contextmenu",contextMenuPrevent);
    let mapList = {};
    let bbox = Generic.set_backDiv("", "属性データ読み込み", 490, 550, true, true, buttonOK, 0.2, false,true,buttonCancel);
    let mapFileFrame = Generic.createNewFrame(bbox, "mapFile", "", 15, scrMargin.top+5, 450, 140, "使用地図ファイル");
    Generic.createNewSpan(mapFileFrame, "<b>下に地図ファイル(MPFJ)をドロップしてください</b>", "", "", 15, 15, "", "");
    let mapFileList = new ListBox(mapFileFrame, "", [], 15, 35, 200, 55, undefined, "");
    Generic.createNewButton(mapFileFrame, "地図ファイル追加", "", 230, 50, addMapOn, "");
    Generic.createNewButton(mapFileFrame, "削除", "", 360, 50, deleteMap, "");
    Generic.createNewDiv(mapFileFrame,"※以下の地図ファイルは、読み込み済みのため設定不要です。<br>JAPAN、WORLD、日本緯度経度","","",15,95,430,50,"","");
    mapFileList.frame.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    mapFileList.frame.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        var file = files[0];
        let ext=Generic.getExtension(file.name).toLowerCase() ;
        if(ext=="mpfj"){
            dropMapFile(file);
        }else{
            Generic.alert(undefined,"MANDARAの地図ファイルではありません。拡張子mpfjのファイルをドロップしてください。");
        }
        
    }, false);
    let dropMapFile = function (file) {
        Generic.readingIcon("地図ファイル読み込み中");
        Generic.unzipFile(file, unzipOk, unzipError);
        function unzipOk(data) {
            let key = Object.keys(data)[0];
            getMapFile(JSON.parse(Generic.utf8ArrayToStr(data[key])), file.name);
            Generic.clear_backDiv();
        }
        function unzipError(err) {
            getMapFile(undefined);
            Generic.clear_backDiv();
        }
    }
    let dataFileFrame = Generic.createNewFrame(bbox, "dataFile", "", 15, 195, 450, 300, "属性データ");
    let fileIn = Generic.createNewInput(dataFileFrame, "file", "", "", 15, 15, "", "");
    fileIn.accept=".csv,.mdrj,.mdrmj";
    const cboCodeList = [{ value: 'shift-jis', text: 'シフトJIS' },
    { value: 'utf-8', text: 'UTF-8' }];
    let cboCode = Generic.createNewWordSelect(dataFileFrame,"CSVファイル文字コード", cboCodeList, 0,  "cboCode", 270, 8,undefined,100,1,  undefined,"", "font-size:12px",false);

    let ext="clipboard";
    let filename="";
    let mdrjString;

    Generic.createNewSpan(dataFileFrame, "<b>下に属性データを貼り付ける（ctrl+v）、Excelで範囲選択してドラッグ&ドロップ、またはCSV、MDRJ、MDRMJファイルをドロップしてください</b>", "", "", 10, 55, "", "");
    let dataTextArea = Generic.createNewTextarea(dataFileFrame, "", "tArea", 15, 85, 42, 24,"font-size:12px;width:420px;height:170px;resize: none;overflow-x: scroll")
    dataTextArea.wrap = "off";


    // let pasteBtn=Generic.createNewButton(dataFileFrame, "クリップボードから貼り付け", "", 120,270,function(){
    //     navigator.clipboard.readText().then(
    //         clipText => dataTextArea.value= clipText);
                  
    // }, "width:200px");
    // if(navigator.clipboard.readText != undefined){//httpsサイトでないと動作しない
    //     pasteBtn.setVisibility(true);
    // }else{
    //     pasteBtn.setVisibility(false);
    // }

    Generic.createNewButton(dataFileFrame, "クリア", "", 350,270,btnClear, "width:80px");
    function btnClear(){
        dataTextArea.value = "";
        ext="clipboard";
    }

    fileIn.addEventListener("change", function (e) {
        var file = e.target.files[0];
        readAttrData(file);
    }, false);
    dataTextArea.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    dataTextArea.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        if(files.length>0){
            var file = files[0];
            let ext=Generic.getExtension(file.name).toLowerCase() ;
            if((ext=="csv")||(ext=="mdrj")||(ext=="mdrmj")){
                readAttrData(file);
            }else{
                Generic.alert(undefined,"MANDARAの属性データファイルではありません。拡張子csv,mdrj,mdrmjのファイルをドロップしてください。");
            }
        }else{
            //文字列
            dataTextArea.value=e.dataTransfer.getData("text");
        }
    }, false);

    function readAttrData(file) {
        //ファイル読み込み（ボタン、ドロップ共通）

        Generic.readingIcon("データ読み込み");

        filename=file.name;
        ext=Generic.getExtension(file.name).toLowerCase();
        if((ext=="mdrj")||(ext=="mdrmj")){
            Generic.unzipFile(file,unzipOk,unzipError);
            function unzipOk(data){
                Generic.clear_backDiv();
                let key=Object.keys(data)[0];
                mdrjString=Generic.utf8ArrayToStr(data[key]);
                dataTextArea.value = ext.toUpperCase() + "ファイル: "+file.name;
            }
            function unzipError(err){
                Generic.clear_backDiv();
                Generic.alert(undefined,"読み込めませんでした。")
            }
        }else{
            //CSVファイルの読込が終了した時の処理
            Generic.clear_backDiv();
            let reader = new FileReader();
            let wcode=cboCode.value;
            reader.readAsText(file, wcode);//文字コード重要
            reader.onload = function (evt) {
                dataTextArea.value = reader.result;
            }
        }
    }
    //地図ファイル追加
    function addMapOn() {
        openMapFile(getMapFile);
    }

    function getMapFile(jsonMapData, mapFilename) {
        if(jsonMapData==undefined){
            Generic.alert(undefined,"読み込めませんでした。");
            return;
        }
        let key = Object.keys(mapList);
        let fu = mapFilename.toUpperCase();
        if(key.indexOf(fu) != -1) {
            Generic.alert(undefined,mapFilename + "は既に読み込まれています。")
            return;
        }
        let mapdata = new clsMapdata();
        mapdata.openJsonMapData(jsonMapData);
        mapdata.Map.filename = mapFilename;
        if(key.length > 0) {
            let z = mapList[key[0]].Map.Zahyo;
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
            if(retv.ok == false) {
                Generic.alert(undefined,mapFilename + "は既存の読み込み地図ファイルと座標系が異なります。");
                return
            }
        }
        mapList[mapFilename.toUpperCase()] = mapdata;
        mapFileList.addList([{ value: fu, text: mapFilename }], mapFileList.length,false,false);
    }
    //選択した地図ファイル削除
    function deleteMap() {
        let n = mapFileList.selectedIndex;
        if(n == -1) {
            return;
        }
        delete mapList[mapFileList.getValue()];
        mapFileList.removeList(n,1);
    }

    function buttonCancel(){
        document.body.addEventListener("contextmenu",contextMenuPrevent);
    }

    function buttonOK() {
        if(mapList.length == 0) {
            Generic.alert(undefined,"地図ファイルを設定してください。");
            return;
        }
        let attrText = dataTextArea.value;
        if(attrText == "") {
            Generic.alert(undefined,"属性データを設定してください。");
            return;
        }

        let mdata = [];
        for (let i in mapList) {
            mdata.push(mapList[i]);
        } 
        Generic.clear_backDiv();
        if((ext=="mdrj")||(ext=="mdrmj")){
            okCall(mdata, mdrjString,filename,ext);
        }else{
            okCall(mdata, attrText,filename,ext);
        }
        document.body.addEventListener("contextmenu",contextMenuPrevent);
    }
}

//シェープファイル読み込み
function openShapeFile(okCall){
    let shapeFiles = [];//clsShapefile
    var bbox = Generic.set_backDiv("", "シェープファイル読み込み", 630, 320, true, true, buttonOK, 0.2, false);
    let fileFrame = Generic.createNewFrame(bbox, "", "", 15, scrMargin.top + 5, 340, 200, "読み込むシェープファイル");
    const cboCodeList = [{ value: 'shift-jis', text: 'シフトJIS' },
    { value: 'utf-8', text: 'UTF-8' }];
    let cboCode = Generic.createNewWordSelect(fileFrame,"dbfファイル文字コード", cboCodeList, 0,  "cboCode",15, 15,140,100,0,  undefined,"", "",false);

    Generic.createNewDiv(fileFrame, "<b>下にシェープファイル1式（shp,shx,dbf,prjファイル）ずつ（またはzip圧縮ファイル）ドロップしてください</b>", "", "", 15, 45, 310, 50, "", "");
    let fileList = new ListBox(fileFrame, "", [], 15, 90, 220, 95, setShapeFileInfo, "");
    Generic.createNewButton(fileFrame, "削除", "", 250, 120, deleteFile, "");
    Generic.createNewButton(fileFrame, "全削除", "", 250, 150, deleteAllFile, "");

    let infoFrame = Generic.createNewFrame(bbox, "", "", 370, scrMargin.top + 5, 245, 220, "シェープファイル情報");
    let infoFileName = Generic.createNewDiv(infoFrame, "ファイル名", "", "", 15, 10, 215,20,"overflow:hidden;text-overflow:ellipsis;white-space:nowrap;");
    let relatedFile = Generic.createNewDiv(infoFrame, "関連ファイル", "", "grayFrame", 15, 30, 200, 50, "padding:5px;");
    let zahyoModeFrame = Generic.createNewFrame(infoFrame, "", "", 15, 100, 100, 100, "座標系");
    const ZahyoSystemList = [{ value: enmZahyo_mode_info.Zahyo_Ido_Keido, text: "緯度経度" },
    { value: enmZahyo_mode_info.Zahyo_HeimenTyokkaku, text: "平面直角" },
    { value: enmZahyo_mode_info.Zahyo_No_Mode, text: "その他" }];
    Generic.createNewRadioButtonList(zahyoModeFrame, "zahyoMode", ZahyoSystemList, 10, 10,undefined, 22,undefined, zahyoModeFrameChange, "");
    let lst = document.getElementById("radiozahyoMode2");
    lst.style.top = (lst.offsetTop + 17).px();
    let lsts = document.getElementById("divradiozahyoMode2");
    lsts.style.top = (lsts.offsetTop + 20).px();
    let keiNo = [];
    for (let i = 1; i <= 19; i++) {
        keiNo.push({ value: i, text: i.toString() });
    }
    let cboKeiNo = Generic.createNewSelect(zahyoModeFrame, keiNo, 0, "cboKeiNo", 50, 50, false, keiChange, "");

    let zahyoSystemFrame = Generic.createNewFrame(infoFrame, "", "", 125, 100, 110, 100, "測地系");
    const ZahyoModeList = [{ value: enmZahyo_System_Info.Zahyo_System_tokyo, text: "日本測地系" },
    { value: enmZahyo_System_Info.Zahyo_System_World, text: "世界測地系" },
    { value: enmZahyo_System_Info.Zahyo_System_No, text: "その他・不明" }];
    Generic.createNewRadioButtonList(zahyoSystemFrame, "zahyoSystem", ZahyoModeList, 10, 10,undefined, 22,undefined, zahyoSystemFrameChange, "");
    infoFrame.setVisibility(false);
    let chkTopology=Generic.createNewCheckBox(bbox,"位相構造化","",false,30,260,120,undefined,"");
    let cboProjection = Generic.createNewWordSelect(bbox,"読み込み後の投影法", Generic.getProjectionList(), 0,  "cboProjection",150, 260,undefined,150,1,  undefined,"", "",false);

    function keiChange(obj,sel,v){
        let fileKey = fileList.getValue();   
        let zahyo=shapeFiles[fileKey].shape.getMapZahyo();  
        zahyo.HeimenTyokkaku_KEI_Number=v;
        shapeFiles[fileKey].shape.setMapZahyo(zahyo);
    }

    function zahyoModeFrameChange(v) {
        let fileKey = fileList.value;   
        let zahyo=shapeFiles[fileKey].shape.getMapZahyo();  
        zahyo.Mode=v;
        shapeFiles[fileKey].shape.setMapZahyo(zahyo);
    }

    function zahyoSystemFrameChange(v) {
        let fileKey = fileList.value;   
        let zahyo=shapeFiles[fileKey].shape.getMapZahyo();  
        zahyo.System=v;
        shapeFiles[fileKey].shape.setMapZahyo(zahyo);
    }
    fileList.frame.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    fileList.frame.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        let files = e.dataTransfer.files; // FileList object.
        dropShapeFiles(files);
    }, false);

    let dropShapeFiles = function (files) {
        //ファイル読み込み（ドロップ）
        let sFiles = [];
        let er = "";
        let er_sub = "";
        let encode = cboCode.getValue();
        let firstSel = fileList.length;
        let n=0;
        for(let i = 0; i < files.length; i++) {
            if(Generic.getExtension(files[i].name).toLowerCase()=="zip"){
                n++;
            }
        }
        if(n>=2){
            Generic.alert(undefined,"ZIPファイルは1つずつドラッグしてください。")
            return;
        } else if(n==1) {
            zipShape(files[0]);
            return;
        }
        for (let i = 0; i < files.length; i++) {
            checkSFiles(files[i],false);
        }
        checkSFiles2();
        if(er != '') {
            return;
        }

        let key = Object.keys(sFiles)[0];
        sFiles[key].shape.fileRead(sFiles[key].files, encode,key, onOk, onError);
        function onOk(tag) {//読み込めた
            let lst=[{ value: tag, text: tag + ".shp"  }];
            fileList.addList(lst, firstSel);
            shapeFiles[tag] = sFiles[tag];
            setShapeFileInfo();
        }
        function onError(tag) {
            Generic.alert(undefined,tag + "は読み込めませんでした。")
        }
        /**zipされたシェープファイル */
        function zipShape(zipFile) {
            Generic.unzipFile(zipFile, zipSOK, zipSErr)
            function zipSOK(unZipData) {
                for (let filename in unZipData) {
                    checkSFiles(filename,true);
                }
                checkSFiles2();
                if (er != '') {
                    return;
                }
                let key = Object.keys(sFiles)[0];
                sFiles[key].shape.fileReadZip(unZipData, encode, key, onOk);

            }
            function zipSErr(){
                Generic.alert(undefined,zipFile.name + "は読み込めませんでした。")
            }
        }
        function checkSFiles(file,zipF) {
            let ext =(zipF==true ? Generic.getExtension(file).toLowerCase():Generic.getExtension(file.name).toLowerCase());
            let fname =(zipF==true ? Generic.getFilenameWithoutExtension(file): Generic.getFilenameWithoutExtension(file.name));
            switch (ext) {
                case 'shp':
                case 'shx':
                case 'prj':
                case 'dbf':
                    if (sFiles[fname] == undefined) {
                        sFiles[fname] = { shp: false, prj: false, dbf: false, shx: false, files: [], shape: new clsShapefile };
                    }
                    switch (ext) {
                        case 'shp':
                            sFiles[fname].shp = true;
                            sFiles[fname].files.push(file);
                            break;
                        case 'shx':
                            sFiles[fname].shx = true;
                            sFiles[fname].files.push(file);
                            break;
                        case 'prj':
                            sFiles[fname].prj = true;
                            sFiles[fname].files.push(file);
                            break;
                        case 'dbf':
                            sFiles[fname].dbf = true;
                            sFiles[fname].files.push(file);
                            break;
                    }
                    break;
                default:
                    let fn = (zipF == true ? file : file.name);
                    er_sub += fn + "は読み込めません。" + '\n';
                    break;
            }
        }
        function checkSFiles2() {
            for (let i in sFiles) {
                let s = sFiles[i];
                if (s.shp == false) {
                    er += i + "はshpファイルがありません。" + '\n';
                }
                if (s.shx == false) {
                    er += i + "はshxファイルがありません。" + '\n';
                }
                if (s.dbf == false) {
                    er += i + "はdbfファイルがありません。" + '\n';
                }
            }
            if (Object.keys(sFiles).length > 1) {
                er += "シェープファイルは1セットずつ追加して下さい。" + '\n';
            }
            if (shapeFiles[Object.keys(sFiles)[0]]) {
                er += Object.keys(sFiles)[0] + "は設定済みです。" + '\n';
            }
            if((er != '') ||(er_sub != '')){
                Generic.createMsgBox("エラー", er+er_sub, false);
            }
        }
    }

    //シェープファイル情報
    function setShapeFileInfo() {
        let fileKey = fileList.value;
        if(fileKey == undefined) {
            infoFrame.setVisibility(false);
            return;
        } else {
            infoFrame.setVisibility(true);
        }
        let data=shapeFiles[fileKey];
        infoFileName.innerHTML=fileKey+".shp";
        let tx="";
        if(data.shp == true){tx+="shpファイル：あり　"}else{tx+="shpファイル：なし　"};
        if(data.shx == true){tx+="shxファイル：あり　"}else{tx+="shxファイル：なし　"};
        if(data.dbf == true){tx+="<br>dbfファイル：あり　"}else{tx+="<br>dbfファイル：なし"　};
        if(data.prj == true){tx+="prj ファイル：あり"}else{tx+="prj ファイル：なし"};
        relatedFile.innerHTML=tx;
        let  zahyo;
        let zahyoGet=data.shape.getZahyoSettingFlag();
        Generic.setDisabled(zahyoModeFrame,zahyoGet);
        Generic.setDisabled(zahyoSystemFrame,zahyoGet);
        zahyo = data.shape.getMapZahyo();
        Generic.checkRadioByValue('zahyoSystem',zahyo.System);
        Generic.checkRadioByValue('zahyoMode',zahyo.Mode);
        cboKeiNo.setSelectValue(zahyo.HeimenTyokkaku_KEI_Number);
    }

    function getFile(jsonMapData, filename) {
        let key = Object.keys(mapList);
        let fu = filename.toUpperCase();
        if(key.indexOf(fu) != -1) {
            Generic.alert(undefined,filename + "は既に読み込まれています。")
            return;
        }
        let mapdata = new clsMapdata();
        mapdata.openJsonMapData(jsonMapData);
        mapdata.Map.filename = filename;
        if(key.length > 0) {
            let z = mapList[key[0]].Map.Zahyo;
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
            if(retv.ok == false) {
                Generic.alert(undefined,filename + "は既存の読み込み地図ファイルと座標系が異なります。");
                return
            }
        }
        mapList[filename.toUpperCase()] = mapdata;
        fileList.addSelectList([{ value: fu, text: filename }], fileList.options.length);
        useMapList.addSelectList([{ value: fu, text: filename }], useMapList.options.length,false,false)
        Generic.setDisabled(layerFrame, false);
        AddLayer();
    }
    function deleteFile() {
        delete shapeFiles[fileList.value];
        let n=fileList.selectedIndex;
        fileList.removeList(n, 1);
        setShapeFileInfo();
    }
    function deleteAllFile() {
        fileList.removeAll();
        shapeFiles = [];
        setShapeFileInfo();
    }
    function buttonOK() {

        let mapList = {};
        let LayerData = []; //strLayerInfo
        let prj=parseInt(cboProjection.getValue());
        for (let i in shapeFiles) {
            let sfile = shapeFiles[i];
            let newMapData = sfile.shape.convertToMapfile(prj, true);
            newMapData.init_Compass_First();
            if(chkTopology.checked==true){
                newMapData.TopologyStructure_SameLine();
            }
            let key = i.toUpperCase();
            mapList[key] = newMapData;
            let d = new strLayerInfo();
            d.Time = clsTime.GetYMD(new Date());
            d.Shape = sfile.shape.getShape();
            d.MapfileName = i;
            d.Name = "レイヤ" + d.MapfileName
            let okn = mapList[key].Map.OBKNum;
            d.UseObjectKind = (new Array(okn)).fill(false);
            d.UseObjectKind[0] = true;
            LayerData.push(d);
        }
        let mdata = [];
        for (let i in mapList) {
            mdata.push(mapList[i]);
        }
        Generic.clear_backDiv();
        okCall(mdata, LayerData);
    }
}

/** 白地図・初期属性データ表示 */
function mapViewer(okCall) {
    let mapList = {};
    let LayerData = []; //strLayerInfo
    var bbox = Generic.set_backDiv("", "白地図・初期属性データ表示", 600, 410, true, true, buttonOK, 0.2,false);

    let fileFrame=Generic.createNewFrame(bbox, "file", "", 15, scrMargin.top+5, 450, 100, "地図ファイル");
    Generic.createNewSpan(fileFrame, "<b>下に地図ファイル(MPFJ)をドロップしてください</b>", "", "", 15, 15, "", "");
    let fileList =new ListBox(fileFrame, "", [], 15, 35, 200, 55, undefined, "");
    Generic.createNewButton(fileFrame, "地図ファイル追加", "", 230, 50, addMapOn,"");
    Generic.createNewButton(fileFrame, "削除", "", 360, 50, deleteMap, "");

    let layerFrame = Generic.createNewFrame(bbox, "", "", 15, 150, 560, 205, "レイヤ");
    let layerList =new ListBox(layerFrame, "", [], 15, 15, 200, 130, layerListOnChange, "");
    Generic.createNewButton(layerFrame, "レイヤ追加", "", 15, 160, AddLayer, "width:90px");
    Generic.createNewButton(layerFrame, "削除", "", 120, 160, deleteLayer, "width:80px");

    let eachLayerFrame = Generic.createNewFrame(layerFrame, "", "", 225, 5,320,  180, "レイヤごとの設定");
    Generic.createNewSpan(eachLayerFrame, "レイヤ名", "", "", 15, 15, "", "");
    let layerNameBox = Generic.createNewInput(eachLayerFrame, "text", "", "", 15, 35, "", "width:150px");
    layerNameBox.onchange = layerNameChange;
    Generic.createNewWordWidthDiv(eachLayerFrame, "","表示するオブジェクトグループ", 15,63,22,150,undefined);
    let objGList=new CheckedListBox(eachLayerFrame,"",[],15,90,150,80,false,objGListChange,"")
    Generic.createNewSpan(eachLayerFrame, "使用する地図ファイル", "", "", 180, 15, "", "");
    let useMapList = Generic.createNewSelect(eachLayerFrame, undefined, 0, "", 180, 35, false, useMapListChange, "width:130px;");
    Generic.createNewSpan(eachLayerFrame, "時期設定", "", "", 180, 60, "", "");
    let layerTime = Generic.createNewInput(eachLayerFrame, "date", "", "", 180, 80, "", "width:130px");
    layerTime.onchange = layerTimeChange;
    Generic.setDisabled(layerFrame, true);

    fileList.frame.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    fileList.frame.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        var file = files[0];
        if (Generic.getExtension(file.name).toLowerCase() != "mpfj") {
            Generic.alert(undefined,"地図ファイルではありません。拡張子mpfjのファイルをドロップしてください。");
        }else{
            dropMapFile(file);
        }
    }, false);
    let dropMapFile = function (file) {
        Generic.readingIcon("地図ファイル読み込み中");
        Generic.unzipFile(file, unzipOk, unzipError);
        function unzipOk(data) {
            let key = Object.keys(data)[0];
            let tx = JSON.parse(Generic.utf8ArrayToStr(data[key]));
            getFile(tx, file.name);
            Generic.clear_backDiv();
        }
        function unzipError(err) {
            getFile(undefined);
            Generic.clear_backDiv();
        }
    }
    function addMapOn() {
        openMapFile(getFile);
    }

    function getFile(jsonMapData, filename) {
        if(jsonMapData==undefined){
            Generic.alert(undefined,"読み込めませんでした。");
            return;
        }
        let key = Object.keys(mapList);
        let fu = filename.toUpperCase();
        if(key.indexOf(fu) != -1) {
            Generic.alert(undefined,filename + "は既に読み込まれています。")
            return;
        }
        let mapdata = new clsMapdata();
        mapdata.openJsonMapData(jsonMapData);
        mapdata.Map.FileName = filename;
        if(key.length > 0) {
            let z = mapList[key[0]].Map.Zahyo;
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
            if(retv.ok== false) {
                Generic.alert(undefined,filename + "は既存の読み込み地図ファイルと座標系が異なります。");
                return
            }
        }
        mapList[filename.toUpperCase()]=mapdata;
        fileList.addList([{ value: fu, text: filename }], fileList.length);
        useMapList.addSelectList([{ value: fu, text: filename }], useMapList.options.length,false,false)
        Generic.setDisabled(layerFrame, false);
        AddLayer();
    }
    function AddLayer() {
        let n = LayerData.length;
        let d = new strLayerInfo();
        d.Time = clsTime.GetYMD(new Date());
        d.MapfileName = fileList.getText();
        d.Name = "レイヤ" + d.MapfileName
        let key = d.MapfileName.toUpperCase();
        let okn = mapList[key].Map.OBKNum;
        d.UseObjectKind = (new Array(okn)).fill(false);
        d.UseObjectKind[0] = true;
        Generic.setDisabled(eachLayerFrame, false);
        layerList.addList([{ value: "", text: d.Name }], n,false,false);
        LayerData[n ] = d;
        layerListOnChange();
    }
    //レイヤの選択変更
    function layerListOnChange() {
        let n = layerList.selectedIndex;
        if(n == -1) {
            if(layerList.length == 0) {
                Generic.setDisabled(eachLayerFrame, true);
                return;
            } else {
                layerList.setSelectedIndex(0) ;
                n = 0;
            }
        }
        let d = LayerData[n];
        useMapList.setSelectText(d.MapfileName);
        layerNameBox.value = d.Name;
        checkTime();
        resetObjKind();
    }

    //レイヤの地図ファイルが時間モードか
    function checkTime() {
        let n = layerList.selectedIndex;
        if(n == -1) { return }
        let d = LayerData[n];
        if(mapList[d.MapfileName.toUpperCase()].Map.Time_Mode == true) {
            layerTime.disabled = false;
            layerTime.value = d.Time.toInputDate();
        } else {
            layerTime.disabled = true;
        }
    }

       //レイヤのオブジェクトグループのリスト設定
    function resetObjKind() {
        let n = layerList.selectedIndex;
        if(n == -1) { return }
        let d = LayerData[n];
        let key = d.MapfileName.toUpperCase();
        let okn = mapList[key].Map.OBKNum;
        let tx = [];
        for (let i = 0; i < okn; i++) {
            let str = mapList[key].ObjectKind[i].Name;
            str += "(" + Generic.ConvertShapeEnumString(mapList[key].ObjectKind[i].Shape) + ")"
            tx.push({ text: str,checked:d.UseObjectKind[i] });          
        }
        objGList.removeAll();
        objGList.addList(tx, 0);
    }

    //選択した地図ファイル削除
    function deleteMap() {
        let n = fileList.selectedIndex;
        if(n == -1) {
            return;
        }
        let delMapfile = fileList.getText();
        for (let i in LayerData) {
            if(LayerData[i].MapfileName == delMapfile) {
                Generic.alert(undefined,delMapfile + "は使用されています。");
                return
            }
        }
        delete mapList[fileList.getValue()];
        fileList.removeList(n,1);
        useMapList.remove(n);
    }

    //レイヤ削除
    function deleteLayer() {
        let n = layerList.selectedIndex;
        if(n == -1) { return }
        LayerData.splice(n,1);
        layerList.removeList(n,1);
        // Generic.ListIndex_Reset(layerList, n);
        layerListOnChange();
    }

    //レイヤ名の変更
    function layerNameChange(e) {
        let n = layerList.selectedIndex;
        LayerData[n].Name = e.target.value;
        layerList.setText(n,e.target.value);
    }

    //レイヤのオブジェクトグループ変更
    function objGListChange(obj, checkList, checkArray) {
        let n = layerList.selectedIndex;
        LayerData[n].UseObjectKind.fill(false);
        for (let i = 0; i < checkArray.length; i++) {
            LayerData[n].UseObjectKind[checkArray[i]] = true;
        }
    }

    //レイヤの地図ファイル変更
    function useMapListChange(obj,sel,v) {
        let n = layerList.selectedIndex;
        LayerData[n].MapfileName = useMapList.getText();
        let key = useMapList.getText().toUpperCase();
        let okn = mapList[key].Map.OBKNum;
        LayerData[n].UseObjectKind = (new Array(okn)).fill(false);
        checkTime();
        resetObjKind();
    }

    //レイヤの時間変更
    function layerTimeChange() {
        let n = layerList.selectedIndex;
        LayerData[n].Time = clsTime.GetFromInputDate(layerTime.value);

    }

    function buttonOK() {
        if(LayerData.length==0){
            Generic.alert(undefined,"レイヤが設定されていません。");
            return; 
        }
        for (let i in LayerData) {
            let LD = LayerData[i];
            let key = LD.MapfileName.toUpperCase();
            let f1 = false;
            for (let j in LD.UseObjectKind) {
                if(LD.UseObjectKind[j] == true) {
                    LD.Shape = mapList[key].ObjectKind[j].Shape;
                    f1 = true;
                    break;
                }
            }
            if(f1 == false) {
                Generic.alert(undefined,"レイヤ" + LD.Name + "で表示するオブジェクトクループが設定されていません。");
                    return;
            }
            let emes = mapList[key].Check_Selected_ObjectGroup_Same(LD.UseObjectKind, false, false);
            if(emes != "") {
                Generic.alert(undefined,emes);
                return;
            }
            if(mapList[key].Map.Time_Mode == false) {
                LD.Time = clsTime.GetNullYMD();
            }
        }
        let mdata = [];
        for (let i in mapList) {
            mdata.push(mapList[i]);
        }
        Generic.clear_backDiv();
        okCall(mdata, LayerData);

    }
}

