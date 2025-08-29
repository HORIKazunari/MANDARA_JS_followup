function clsGrid(newDataFlag,buttonOK){
    const Layer_Data_Info = function () {
        this.Data; // Integer
        this.Layer; // Integer
    }
    const Layer_Data_InfoCheck = function () {
        this.Data; // Integer
        this.Layer; // Integer
        this.Value; // Double
    }
    const GridLayerData_Info = function () {
        this.MapFile; // String
        this.Type; // String
        this.Shape; // String
        this.Time; // String
        this.OldIndex; // String
        this.Mesh; // String
        this.SyntheticObjF; // String
        this.Comment; // String
        this.ReferenceSystem; // String
    }

    let GridLayerData = new GridLayerData_Info();
    let Change_Data;
    let ZahyoOk; // Boolean
    let newAttrData=new clsAttrData();;
    let SearchSTR=""; // String
    let D_CheckDataValue; // List(Of Double())
    let oldAttr=attrData; // clsAttrData
    let gridTopY=150;
    let layerDataWidth=200;
    let gScreenWidth =( Generic.getBrowserWidth()-50*2);
    let gScreenHeight = (Generic.getBrowserHeight() - 100);
    const backDiv = Generic.set_backDiv("", "属性データ編集", gScreenWidth, gScreenHeight, false, false, buttonOK, 0.2, false, false);
    const picTop = Generic.createNewDiv(backDiv, "", "", "", 0, 30, gScreenWidth, 100, "", undefined);
    Generic.createNewButton(picTop, "OK", "", 480, 20, okButton, "width:70px;height:25px");
    Generic.createNewButton(picTop, "Cancel", "", 480, 50, cancelButton, "width:70px;height:25px");
    const gbMapFile=Generic.createNewFrame(picTop,"","",10,10,220,90,"地図ファイル");
    const lstMapFile = new ListBox(gbMapFile, "", [], 10, 10, 120, 70, undefined, "");
    const btnReplaceMapFile =Generic.createNewButton(gbMapFile, "差し替え", "", 140, 10, btnReplaceMapfileClick, "width:70px;font-size:10.5px");
    const btnRemoveMapfile = Generic.createNewButton(gbMapFile, "削除", "", 140, 35, btnRemoveMapfileClick, "width:70px;font-size:10.5px");
    Generic.createNewButton(gbMapFile, "追加", "", 140, 60,  btnAddMapfile, "width:70px;font-size:10.5px");
    const gbSearch=Generic.createNewFrame(picTop,"","",240,10,190,40,"検索");
    Generic.createNewButton(gbSearch, "検索", "", 10, 10, function(e){
        ktGrid.removeEventlister();
        Generic.prompt(e,"検索文字列",SearchSTR,function(v){
            ktGrid.addEventlister();
            SearchSTR = v;
            if (v != "") {
                ktGrid.Find(SearchSTR, enmMatchingMode.PartialtMatching);
            }
        },'left',function(){ktGrid.addEventlister();})
    }, "width:70px;");
    Generic.createNewButton(gbSearch, "前", "", 90, 10, function () {
        if (SearchSTR != "") {
            ktGrid.FindRev(SearchSTR, enmMatchingMode.PartialtMatching);
        }
    }, "width:40px;");
    Generic.createNewButton(gbSearch, "次", "", 140, 10, function(){
        if (SearchSTR != "") {
            ktGrid.Find(SearchSTR, enmMatchingMode.PartialtMatching);
        } 
    }, "width:40px;");
    const btnAddDefAttr=Generic.createNewButton(picTop, "初期属性追加", "", 240, 70, function(){
        alert("この機能は作成中です")}, "width:100px;");
    const btnObjectNameCopy = Generic.createNewButton(picTop, "オブジェクト名\nコピーパネル", "", 350, 70, function () {
        ktGrid.removeEventlister();
        let mp = newAttrData.SetMapFile(ktGrid.getLayerData(ktGrid.getLayer(), GridLayerData.MapFile));
        let init_para = new strFrmCopyObjectName_init_parameter_data();
        init_para.Time = ktGrid.getLayerData(ktGrid.getLayer(), GridLayerData.Time);
        init_para.ObjectGroupChecked.length = mp.Map.OBKNum;
        init_para.ObjectGroupChecked.fill(true);
        init_para.TimeChangeEnabled=!init_para.Time.nullFlag();
        frmCopyObjectName(mp,init_para,function (copyData) {
            Generic.copyText(copyData);
            ktGrid.setCopyText(copyData);
            ktGrid.addEventlister();
        },
            function () { ktGrid.addEventlister(); })
    }, "width:100px;font-size:10.5px");
    
    let sideLeft = (gScreenWidth - layerDataWidth - 10);
    const gbLayerData=Generic.createNewFrame(backDiv,"","",sideLeft,gridTopY,layerDataWidth,gScreenHeight - gridTopY-20,"");
    gbLayerData.style.overflow='auto';
    Generic.createNewSpan(gbLayerData,"レイヤコメント","","",10,15,"",undefined);
    let txtLayerComment=Generic.createNewTextarea(gbLayerData,"","",20,35,10,10,"font-size:12px;width:140px;height:100px;resize:none;")
    const cboLayerMapFile=Generic.createNewWordSelect(gbLayerData,"レイヤで使用する地図ファイル",[],0,"",10,150,undefined,140,1,function(){},"","",false);
    const cboLayerType=Generic.createNewWordSelect(gbLayerData,"レイヤの種類",[],0,"",10,205,undefined,140,1,function(obj, sel, ltype){
        let lay=ktGrid.getLayer();
        ktGrid.setLayerData(lay, GridLayerData.Type, ltype);
        Check_DataKind(lay);
        ktGrid.setLayerData(lay, GridLayerData.MapFile,cboLayerMapFile.getText());
        switch (ltype) {
            case enmLayerType.DefPoint:
                ktGrid.setLayerData(lay, GridLayerData.Shape, enmShape.PointShape);
                break;
            case enmLayerType.Mesh:
                ktGrid.setLayerData(lay, GridLayerData.Shape, enmShape.PolygonShape);
                if (ktGrid.getLayerData(lay, GridLayerData.Mesh) == enmMesh_Number.mhNonMesh) {
                    ktGrid.setLayerData(lay, GridLayerData.Mesh, enmMesh_Number.mhThird);
                }
                break;
        }
        Set_LayerTypeShape()
        ktGrid.refresh();
        ErrorCheck();
    }, "", "", false);
    const cboLayerShape = Generic.createNewWordSelect(gbLayerData, "レイヤの形状", [], 0, "", 10, 260, undefined, 100, 1, function (obj, sel, v) {
        ktGrid.setLayerData(ktGrid.getLayer(), GridLayerData.Shape, v);
        ErrorCheck();
    }, "", "", false);
    const cboMesh = Generic.createNewWordSelect(gbLayerData, "メッシュ", [], 0, "", 10, 315, undefined, 100, 1, function (obj, sel, v) {
        ktGrid.setLayerData(ktGrid.getLayer(), GridLayerData.Mesh, v);
        ErrorCheck();
    }, "", "", false);
    Generic.createNewSpan(gbLayerData, "時期設定", "", "", 10, 370, "", "");
    const DateTimePickerLayer = Generic.createNewInput(gbLayerData, "date", "", "", 20, 390, "", "width:130px");
    DateTimePickerLayer.onchange = function () {
        ktGrid.setLayerData(ktGrid.getLayer(), GridLayerData.Time, clsTime.GetFromInputDate(DateTimePickerLayer.value));
        ErrorCheck();
    }
    //layerTime.onchange = layerTimeChange;
    let zahyoSystemFrame = Generic.createNewFrame(gbLayerData, "", "", 10, 415, 140, 60, "測地系");
    const ZahyoModeList = [{ value: enmZahyo_System_Info.Zahyo_System_tokyo, text: "日本測地系" },
    { value: enmZahyo_System_Info.Zahyo_System_World, text: "世界測地系" }];
    Generic.createNewRadioButtonList(zahyoSystemFrame, "zahyoSystem", ZahyoModeList, 10, 10,undefined, 22,undefined, undefined, "");

    const errorBox=Generic.createNewDiv(picTop,"エラー情報","","",sideLeft,20,layerDataWidth,20,"",undefined);
    const errorInfo=Generic.createNewTextarea(picTop,"","",sideLeft,40,10,10,"font-size:12px;width:200px;height:70px;resize:none")
    errorInfo.readOnly=true;
    
    const ktGrid = new gridControl(backDiv, 10, gridTopY, gScreenWidth-layerDataWidth-30, gScreenHeight - gridTopY-10,clsSettingData.SetFont);
    let opeEnable= {
        RightClickEnabled:true, //  'グリッド上の右クリックでコピー以外は使えなくする
        RightClickAllEnabled:true, //  '右クリックメニューの使用可否
        InputEnabled:true, //  '入力の可否
        GridRowEnabled:true, //  '行削除・挿入
        GridColEnabled:true, //  '列削除・挿
        FixedXSEnabled:true, //  '左固定領域の変更
        FixedYSEnabled:true, //  '上固定領域の変更
        FixedUpperLeftEnabeld:false, //  '左上固定領域の変更
        TABvisible:true, //'レイヤタブを表示
        TabClickEnabled:true //'タブで右クリックメニュー利用
    };
    let eventCall={
        evtChange_Data:eventChange_Data,//データがどこか変更された場合に発生
        evtAdd_Layer:Add_Layer,//レイヤの追加メニューを選択した場合に発生
        evtChange_LayerSelect:Change_LayerSelect,//表示レイヤを変更した場合に発生
        evtClick_FixedYS2:Click_FixedYS2,//上部の固定部分の枠２行目をクリックした場合に発生
        evtClick_DataGrid:Click_DataGrid,//データ部分をクリックした場合に発生
        evtChange_FixedYS:Change_FixedYS,//上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生
        evtChange_FixedXS:Change_FixedXS,//左部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生
        evtChange_FixedUpperLeft:Change_FixedUpperLeft,//左上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生
        evtChange_Layer:Change_Layer//レイヤ名の変更、レイヤの移動などで発生
      }
    setIniform();
    ktGrid.init("レイヤ", "オブジェクト", "属性データ",  2, 1, 6, 3, opeEnable, eventCall);
    if (newDataFlag == true) {
        ktGrid.addLayer("新しいレイヤ", 0, 5, 50);
        ktGrid.setLayerData(0, GridLayerData.Shape, enmShape.NotDeffinition);
        ktGrid.setLayerData(0, GridLayerData.Time, clsTime.GetNullYMD());
        ktGrid.setLayerData(0, GridLayerData.OldIndex, -1);
        ktGrid.setLayerData(0, GridLayerData.Type, enmLayerType.Normal);
        ktGrid.setLayerData(0, GridLayerData.Mesh, enmMesh_Number.mhNonMesh);
        ktGrid.setLayerData(0, GridLayerData.SyntheticObjF, false);
        ktGrid.setLayerData(0, GridLayerData.ReferenceSystem, enmZahyo_System_Info.Zahyo_System_World);
        ktGrid.setLayerData(0, GridLayerData.Comment, "");
        for (let i = 0; i < ktGrid.getXsize(0); i++) {
            ktGrid.setFixedYSData(0, i, 2, Generic.ConvertMissingValueFromBool(false));
        }
        set_First_GridCellWidthHeight(0);
        let newTL = newAttrData.TotalData.LV1;
        newTL.DataSourceType = enmDataSource.DataEdit;
        newTL.FileName = "DataEditor";
        newTL.FullPath = "DataEditor";
        btnRemoveMapfile.disabled = true
        btnReplaceMapFile.disabled = true
        btnObjectNameCopy.disabled = true
        btnAddDefAttr.disabled = true
        //  ktGrid.Visible = false
        gbSearch.disabled = true
    } else {
        let Mapfiles = attrData.GetMapFileName();
        if (Mapfiles.length > 0) {
            let adLst = [];
            for (let i = 0; i < Mapfiles.length; i++) {
                adLst.push({ text: Mapfiles[i], value: i });
            }
            lstMapFile.addList(adLst, 0);
            for (let i = 0; i < Mapfiles.length; i++) {
                newAttrData.AddExistingMapData(attrData.SetMapFile(Mapfiles[i]), Mapfiles[i]);
            }
            lstMapFile.setSelectedIndex(0);
        }
        D_CheckDataValue = [];

        for (let i = 0; i < attrData.TotalData.LV1.Lay_Maxn; i++) {
            let al = attrData.LayerData[i];
            let Datan = al.atrData.Count;
            let URLMax = attrData.Get_MaxURLNum(i);
            let DefPointPlus = 0;
            if (al.Type == enmLayerType.DefPoint) {
                DefPointPlus = 2;
            }
            let d = [];
            for (let j = 0; j < al.atrData.length; j++) {
                d[j] = Get_Data_Property_Value(attrData, i, j);
            }
            D_CheckDataValue.push(d);
            let SideE = true;
            let SyntheticObjF = false;
            if (al.atrObject.NumOfSyntheticObj > 0) {
                //合成オブジェクトはオブジェクト名を変更しない
                SyntheticObjF = true;
                SideE = false;
            }
            let layOpeEnable = {
                RightClickEnabled: true, //  'グリッド上の右クリックでコピー以外は使えなくする
                RightClickAllEnabled: true, //  '右クリックメニューの使用可否
                InputEnabled: true, //  '入力の可否
                GridRowEnabled: SideE, //  '行削除・挿入
                GridColEnabled: true, //  '列削除・挿
                FixedXSEnabled: SideE, //  '左固定領域の変更
                FixedYSEnabled: true, //  '上固定領域の変更
                FixedUpperLeftEnabeld: false, //  '左上固定領域の変更
            };
            ktGrid.addLayer(al.Name, i, Math.max(1, al.atrData.Count) + DefPointPlus + URLMax * 2, Math.max(al.atrObject.ObjectNum, 1), layOpeEnable);
            if (al.Type == enmLayerType.DefPoint) {
                ktGrid.setFixedYSData(i, 0, 3, "LON");
                ktGrid.setFixedYSData(i, 1, 3, "LAT");
            }
            for (let j = 0; j < Datan; j++) {
                let ald = al.atrData.Data[j];
                ktGrid.setFixedYSData(i, DefPointPlus + j, 2, Generic.ConvertMissingValueFromBool(ald.MissingF));
                ktGrid.setFixedYSData(i, DefPointPlus + j, 3,ald.Title);
                ktGrid.setFixedYSData(i, DefPointPlus + j, 4, ald.Unit);
                ktGrid.setFixedYSData(i, DefPointPlus + j, 5, ald.Note);
            }
            for (let k = 0; k < al.atrObject.ObjectNum; k++) {
                ktGrid.setFixedXSData(i, 1, k, attrData.Get_KenObjName(i, k));
                let alo = al.atrObject.atrObjectData[k];
                if (al.Type == enmLayerType.DefPoint) {
                    ktGrid.setGridData(i, 0, k,String( alo.defPoint.lon));
                    ktGrid.setGridData(i, 1, k,String( alo.defPoint.lat));
                }
                for (let j = 0; j < al.atrData.Count; j++) {
                    ktGrid.setGridData(i, DefPointPlus + j, k, String(al.atrData.Data[j].Value[k]));
                }
                for (let j = 0; j < alo.HyperLinkNum; j++) {
                    ktGrid.setGridData(i, DefPointPlus + Datan + j * 2, k, alo.HyperLink[j].Name);
                    ktGrid.setGridData(i, DefPointPlus + Datan + j * 2 + 1, k, alo.HyperLink[j].Address);
                }
            }
            for (let j = 0; j < URLMax; j++) {
                ktGrid.setFixedYSData(i, Datan + j * 2, 3, "URL_NAME");
                ktGrid.setFixedYSData(i, Datan + j * 2 + 1, 3, "URL");
            }
            check_DataKind_and_Allignment(i);
            ktGrid.setLayerData(i, GridLayerData.MapFile, al.MapFileName);
            ktGrid.setLayerData(i, GridLayerData.Shape, al.Shape);
            ktGrid.setLayerData(i, GridLayerData.Time, al.Time);
            ktGrid.setLayerData(i, GridLayerData.OldIndex, i);
            ktGrid.setLayerData(i, GridLayerData.Type, al.Type);
            ktGrid.setLayerData(i, GridLayerData.Mesh, al.MeshType);
            ktGrid.setLayerData(i, GridLayerData.SyntheticObjF, SyntheticObjF);
            ktGrid.setLayerData(i, GridLayerData.ReferenceSystem, al.ReferenceSystem);
            ktGrid.setLayerData(i, GridLayerData.Comment, al.Comment);
            set_First_GridCellWidthHeight(i);
            let atl = attrData.TotalData.LV1;
            newAttrData.TotalData.LV1.DataSourceType = atl.DataSourceType;
            newAttrData.TotalData.LV1.FileName = atl.FileName;
            newAttrData.TotalData.LV1.FullPath = atl.FullPath;
            newAttrData.TotalData.LV1.Comment = atl.Comment;
            }
    }
    ktGrid.show();
    window.addEventListener('resize',windowResize );
    SetMapFileList_to_CboBox();
    Check_DataKind(0);
    Set_LayerTypeShape();
    ErrorCheck();

    /**ブラウザのリサイズイベントでサイズ変更 */
    function windowResize(){
        gScreenWidth = (Generic.getBrowserWidth() - 50 * 2);
        gScreenHeight = (Generic.getBrowserHeight() - 100);
        let sideLeft = (gScreenWidth - layerDataWidth - 10).px();
        backDiv.style.width = gScreenWidth.px();
        backDiv.style.height = gScreenHeight.px();
        gbLayerData.style.left = sideLeft;
        gbLayerData.style.height = (gScreenHeight - gridTopY - 20).px();
        ktGrid.changeSize(gScreenWidth - layerDataWidth - 30, gScreenHeight - gridTopY - 10);
        errorBox.style.left = sideLeft;
        errorInfo.style.left = sideLeft;
    }
    function okButton(){
        if( ErrorCheck() == true){
            Generic.alert(undefined, "エラーがあります");
            return;
        }
        let retv = Get_E_Data();
        if (retv.ok == false) {
            Generic.alert(undefined,retv.emes);
            return;
        }
        newAttrData.Check_LayerShape();
        if(newDataFlag == true ){
            newAttrData.initTotalData_andOther();
            newAttrData.attrGridZahyoSet();
        }else{
            newAttrData.TotalData.ViewStyle = oldAttr.TotalData.ViewStyle.Clone();
            newAttrData.attrGridZahyoSet();
            if(newAttrData.TotalData.ViewStyle.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido ){
                newAttrData.TotalData.ViewStyle.TileMapView.Visible = false;
            }
            let retV=  spatial.Check_Zahyo_Projection_Convert_Enabled(newAttrData.TotalData.ViewStyle.Zahyo, oldAttr.TotalData.ViewStyle.Zahyo);
            ZahyoOk=retV.ok ;
            if(ZahyoOk == true ){
                oldAttr.Convert_Zahyo(newAttrData.TotalData.ViewStyle.Zahyo);
            }
            Check_Data();
            Reset_SCRView_Size();
            newAttrData.LinePatternCheck();
            newAttrData.PrtObjectSpatialIndex();
        }
        ktGrid.removeEventlister();
        window.removeEventListener('resize',windowResize);
        Generic.clear_backDiv();
        buttonOK(newAttrData);
    }
    function cancelButton(){
        ktGrid.removeEventlister();
        window.removeEventListener('resize',windowResize);
        Generic.clear_backDiv();
    }

    /**データがどこか変更された場合に発生 */
    function eventChange_Data() {
        console.log("Change_Data");
        ErrorCheck();
    }
    /**レイヤの追加メニューを選択した場合に発生 */
    function Add_Layer(InsertPoint) {
        let w=[];
        for(let i  = 0;i< ktGrid.getLayerMax ;i++){
            w.push(ktGrid.getLayerName(i));
        }

        ktGrid.setLayerData(InsertPoint, GridLayerData.Shape,enmShape.NotDeffinition);
        ktGrid.setLayerData(InsertPoint, GridLayerData.Time, clsTime.GetYMD(new Date()));
        ktGrid.setLayerData(InsertPoint, GridLayerData.OldIndex, -1);
        ktGrid.setLayerData(InsertPoint, GridLayerData.Type, enmLayerType.Normal);
        ktGrid.setLayerData(InsertPoint, GridLayerData.Mesh, enmMesh_Number.mhNonMesh);
        ktGrid.setLayerData(InsertPoint, GridLayerData.ReferenceSystem, enmZahyo_System_Info.Zahyo_System_World);
        ktGrid.setLayerData(InsertPoint, GridLayerData.SyntheticObjF, false);
        if(lstMapFile.length > 0){
            ktGrid.setLayerData(InsertPoint, GridLayerData.MapFile, lstMapFile.getAllText()[0]);
        }
        let datan  = ktGrid.getXsize(InsertPoint);
        for(let i  = 0 ;i< datan;i++){
            ktGrid.setFixedYSData(InsertPoint, i, 2,Generic.ConvertMissingValueFromBool(false))
        }
        ktGrid.setLayerData(InsertPoint, GridLayerData.Comment, "");
       set_First_GridCellWidthHeight(InsertPoint);
        ktGrid.setLayer ( InsertPoint);
        Check_DataKind(InsertPoint);
        ktGrid.refresh();
        Set_LayerTypeShape();
        ErrorCheck();
    }
    /**表示レイヤを変更した場合に発生 */
    function Change_LayerSelect(Layer, PreviousLayer) {
        Set_LayerTypeShape();
        ErrorCheck();
    }
    /**上部の固定部分の枠２行目をクリックした場合に発生 */
    function Click_FixedYS2(cbl, cbx, cby, Value, Top, Left, Width, Height,e) {
        switch (cby) {
            case 1: {
                let popmenu = [{ caption: Generic.ConvertAttDataTypeString(enmAttDataType.Normal), value: enmAttDataType.Normal, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.Category), value: enmAttDataType.Category, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.Strings), value: enmAttDataType.Strings, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.URL), value: enmAttDataType.URL, event: dtype },
                { caption: Generic.ConvertAttDataTypeString(enmAttDataType.URL_Name), value: enmAttDataType.URL_Name, event: dtype }
                ];
                Generic.ceatePopupMenu(popmenu, e);
                break;
            }
            case 2: {
                let popmenu = [{ caption: Generic.ConvertMissingValueFromBool(true), event: dMissing },
                    { caption: Generic.ConvertMissingValueFromBool(false),  event: dMissing }
                    ];
                    Generic.ceatePopupMenu(popmenu, e);
                break;
            }
        }
        function dMissing(e){
            ktGrid.setFixedYSData(cbl, cbx, cby,e.caption);
            ktGrid.refresh();
        }
        function dtype(e) {
            ktGrid.setFixedYSData(cbl, cbx, cby,e.caption);
            let Title = ktGrid.getFixedYSData(cbl, cbx, 3);
            let Unit = ktGrid.getFixedYSData(cbl, cbx, 4);
            let retV = Generic.SetTitleUnit_from_AttDataType(e.value, Title, Unit);
            ktGrid.setFixedYSData(cbl, cbx, 3, retV.title);
            ktGrid.setFixedYSData(cbl, cbx, 4, retV.unit);
            switch (e.value) {
                case enmAttDataType.Normal:
                case enmAttDataType.Lat:
                case enmAttDataType.Lon:
                    ktGrid.setGridAlligntment(cbl, cbx, enmHorizontalAlignment.Right);
                    break;
                default:
                    ktGrid.setGridAlligntment(cbl, cbx, enmHorizontalAlignment.Left);
                    break;
            }
            ktGrid.refresh();
            ErrorCheck();
        }
    }

    /**データ部分をクリックした場合に発生 */
    function Click_DataGrid(Layer, X, Y, Value, Top, Left, Width, Height) {
        console.log("Click_DataGrid", Layer, X, Y, Value, Top, Left, Width, Height);
    }
    /**上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生 */
    function Change_FixedYS() {
        console.log("Change_FixedYS");
        check_DataKind_and_Allignment(ktGrid.getLayer());
        ktGrid.refresh()
        ErrorCheck();
    }
    /**左部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生 */
    function Change_FixedXS() {
        console.log("Change_FixedXS");
        ErrorCheck();
    }
    /** 左上部の固定部分かつ枠でない部分がコントロール内で変更された場合に発生*/
    function Change_FixedUpperLeft() {
        console.log("Change_FixedUpperLeft");
    }
    /**レイヤ名の変更、レイヤの移動などで発生 */
    function Change_Layer(LayerNameChange, LayerMove, LayerDelete) {
        console.log("Change_Layer", LayerNameChange, LayerMove, LayerDelete);
        if(LayerDelete==true){
            Set_LayerTypeShape();
        }
    }

    /**既存データの編集の場合、グリッド上中のデータと以前のデータを比較 */
    function Check_Data() {
        let R_Conv = [];// Layer_Data_Info())
        let r_md = 0;
        for (let i = 0; i < oldAttr.TotalData.LV1.Lay_Maxn; i++) {
            let datan = oldAttr.LayerData[i].atrData.Count;
            let d = [];
            for (let j = 0; j < datan; j++) {
                d[j] = new Layer_Data_Info();
                d[j].Layer = -1;
                d[j].Data = -1;
            }
            R_Conv.push(d);
        }

        //グリッド上のデータに対応する旧データを設定
        let Conv = Get_Data_Refference();// List(Of Layer_Data_Info()) 
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < newAttrData.LayerData[i].atrData.Count; j++) {
                let cv = Conv[i][j];
                if (cv.Layer != -1) {
                    let d = R_Conv[cv.Layer];
                    d[cv.Data].Layer = i;
                    d[cv.Data].Data = j;
                }
            }
        }

        let R_Layer_Convert = new Array(oldAttr.TotalData.LV1.Lay_Maxn).fill(-1);
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            let L = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            if (L != -1) {
                R_Layer_Convert[L] = i;
            }
        }

        //新しいデータの凡例をD_、D2にセット

        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            let newAL = newAttrData.LayerData[i];
            let L = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            let oldAL = oldAttr.LayerData[L];
            if (L == -1) {
                newAL.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                //新しいレイヤの場合
            } else {
                newAL.Print_Mode_Layer = oldAttr.LayerData[L].Print_Mode_Layer;
                //グリッドのレイヤに対応する旧レイヤがある場合
                //グラフモードの凡例をもってくる
                switch (newAL.Type) {
                    case enmLayerType.DefPoint:
                        break;
                    case enmLayerType.Mesh:
                        if (newAL.ReferenceSystem == oldAttr.LayerData[L].ReferenceSystem) {
                            Check_Kencode_XY(i, L);
                        }
                        break;
                    case enmLayerType.Normal:
                        Check_Kencode_XY(i, L);
                        break;
                }

                //.Shape = oldAttr.LayerData[L].Shape
                newAL.LayerModeViewSettings.PointLineShape = oldAL.LayerModeViewSettings.PointLineShape;

                if ((newAL.MapFileName == oldAL.MapFileName) && (newAL.Time.Equals(oldAL.Time))) {
                    newAL.Dummy = Generic.Array2Clone(oldAL.Dummy);
                } else {
                    let dumn = oldAL.Dummy.length;
                    if (dumn > 0) {
                        newAL.Dummy = [];
                        for (let j = 0; j < dumn; j++) {
                            let ocode = newAttrData.Get_ObjectCode_from_ObjName(i, oldAL.Dummy[j].Name);
                            if (ocode != -1) {
                                let d = new strDummyObjectName_and_Code();
                                d.code = ocode;
                                d.Name = oldAL.Dummy[dumn - 1].Name;
                                newAL.Dummy.push(d);
                            }
                        }
                    }
                }
                if (newAL.MapFileName == oldAL.MapFileName) {
                    newAL.DummyGroup = oldAL.DummyGroup.concat()
                } else {
                    newAL.DummyGroup = [];
                }
                //グラフモードの設定
                let oldALG = oldAL.LayerModeViewSettings.GraphMode;
                let newALG = newAL.LayerModeViewSettings.GraphMode;
                newALG.SelectedIndex = oldALG.SelectedIndex;
                let dsetCount = oldALG.DataSet.length;
                for (let k = 0; k < dsetCount; k++) {
                    let oldALGD = oldALG.DataSet[k];
                    newALG.DataSet[k] = oldALGD.Clone();
                    let newALD = newALG.DataSet[k];
                    newALD.Data = [];
                    let dn = 0;
                    for (let j = 0; j < oldALGD.Data.length; j++) {
                        let a = oldALGD.Data[j].DataNumber;
                        let b = R_Conv[L][a].Data;
                        if (b != -1) {
                            newALD.Data[dn] = oldALGD.Data[j].Clone();
                            newALD.Data[dn].DataNumber = b;
                            dn++;
                        }
                    }
                }
                //ラベルデータ
                let oldALL = oldAL.LayerModeViewSettings.LabelMode;
                let newALL = newAL.LayerModeViewSettings.LabelMode;
                let lblDatan = oldALL.DataSet.length;
                newALL.DataSet = [];
                for (let k = 0; k < lblDatan; k++) {
                    let oldALGD = oldALL.DataSet[k];
                    newALL.DataSet[k] = oldALGD.Clone()
                    let newALLD = newALL.DataSet[k];
                    newALLD.DataItem = [];
                    for (let j = 0; j < oldALGD.DataItem.length; j++) {
                        let kk = R_Conv[L][oldALGD.DataItem[j]].Data;
                        if (kk != -1) {
                            newALLD.DataItem.push(kk);
                        }
                    }
                }
            }

            let shapeNoChange = true;
            if (L != -1) {
                if (newAL.Shape != oldAL.Shape) {
                    shapeNoChange = false;
                }
            }

            for (let j = 0; j < newAL.atrData.Count; j++) {
                if ((Conv[i][j].Data == -1) || (newAttrData.Get_DataType(i, j) == enmAttDataType.Strings)) {
                    //グリッドのデータに対応する旧データがない場合、または文字モード
                } else {
                    //グリッドのデータに対応する旧データがある場合、
                    //旧データの凡例を持ってくる
                    let DD = Conv[i][j].Data;
                    let dL = Conv[i][j].Layer;

                    let O_Data = oldAttr.LayerData[dL].atrData.Data[DD];
                    if (newAttrData.Check_Enable_SoloMode(O_Data.ModeData, i, j) == true) {
                        newAL.atrData.Data[j].ModeData = O_Data.ModeData;
                    }

                    newAttrData.Set_Legend(i, j, O_Data, true, shapeNoChange, shapeNoChange, true, shapeNoChange, true, shapeNoChange, true, true, true, (i == dL));

                    if (newAL.MapFileName != oldAttr.LayerData[dL].MapFileName) {
                        //地図ファイルが変更された場合に線モードのチェック
                        let newALD = newAL.atrData.Data[j];
                        newALD.SoloModeViewSettings.ClassODMD.O_object = 0;
                        newALD.SoloModeViewSettings.ClassODMD.o_Layer = i;
                        for (let kk = 0; kk < newAttrData.TotalData.LV1.Lay_Maxn; kk++) {
                            for (let k = 0; k < newAttrData.LayerData[kk].atrObject.ObjectNum; k++) {
                                if (newALD.Title.indexOf(newAttrData.Get_KenObjName(kk, k)) != -1) {
                                    newALD.SoloModeViewSettings.ClassODMD.O_object = k;
                                    newALD.SoloModeViewSettings.ClassODMD.o_Layer = kk;
                                    kk = newAttrData.TotalData.LV1.Lay_Maxn;
                                    break;
                                }
                            }
                        }
                    } else {
                        //地図ファイルが変更されていない場合の線モードのチェック
                        let aOD = O_Data.SoloModeViewSettings.ClassODMD;
                        let odl = aOD.o_Layer;
                        let odo = aOD.O_object;
                        let oob = oldAttr.Get_KenObjCode(odl, odo); // D_Kencode(odo + D_Layer(odl).Object.Stac).Object.code
                        let newALOD = newAL.atrData.Data[j].SoloModeViewSettings.ClassODMD;
                        if (R_Layer_Convert[odl] != -1) {
                            newALOD.o_Layer = R_Layer_Convert[odl];
                            newALOD.O_object = 0;
                            if (newALOD.Dummy_ObjectFlag == false) {
                                for (let k = 0; k < newAttrData.Get_ObjectNum(newALOD.o_Layer); k++) {
                                    if (newAttrData.Get_KenObjCode(newALOD.o_Layer, k) == oob) {
                                        newALOD.O_object = k;
                                        break;
                                    }
                                }
                            }
                        } else {
                            newALOD.o_Layer = i;
                            newALOD.O_object = 0;
                        }
                    }
                    //記号の大きさモードの内部塗りつぶしデータ項目のチェック
                    let newALS = newAL.atrData.Data[j].SoloModeViewSettings;
                    let newALSMI = newALS.MarkCommon.Inner_Data;
                    if (L == -1) {
                        newALSMI.Data = j;
                        newALSMI.Flag = false;
                    } else {
                        newALSMI.Data = O_Data.SoloModeViewSettings.MarkCommon.Inner_Data.Data;
                        newALSMI.Flag = O_Data.SoloModeViewSettings.MarkCommon.Inner_Data.Flag;
                        let k = R_Conv[L][newALSMI.Data].Data;
                        if (k == -1) {
                            newALSMI.Data = j;
                            newALSMI.Flag = false;
                        } else {
                            newALSMI.Data = k;
                        }
                    }
                }
            }
        }

        console.log(newAttrData.LayerData[0].atrData.Data)
        //---------------------線モードのベジェ曲線をチェック
        for(let L  = 0 ;L< oldAttr.TotalData.LV1.Lay_Maxn ; L++) {
            let oldAL=oldAttr.LayerData[L];
            if((oldAL.Type == enmLayerType.Normal)||(oldAL.Type == enmLayerType.Mesh )){
                for(let i  = 0 ;i< oldAL.ODBezier_DataStac.length ;i++){
                    let d  = oldAL.ODBezier_DataStac[i].Clone();
                    if(ZahyoOk == true ){
                        let aD  = R_Conv[L][d.Data].Data;
                        let aL  = R_Conv[L][d.Data].Layer;
                        if((aD != -1)&&(aL != -1 )){
                            let oldObj  = oldAttr.Get_KenObjName(L, d.ObjectPos);
                            let newObj  = newAttrData.Search_ObjName(aL, oldObj);
                            if((aD != -1)&&(aL != -1)&&(newObj != -1 )){
                                d.Data = aD;
                                d.ObjectPos = newObj;
                            }
                            newAttrData.LayerData[aL].ODBezier_DataStac.push(d);
                        }
                    }
                }
            }
        }

        //---------------------図形のデータ項目番号をチェック
        // for(let i  = 0 ;i< oldAttr.TotalData.FigureStac.Count ; i++) {
        //     let FigStac As Object = oldAttr.TotalData.FigureStac[i]
        //     let PrintData strFigure_data
        //     switch( true
        //         case TypeOf FigStac Is strFig_Word_Data
        //             let FigData strFig_Word_Data = DirectCast(FigStac, strFig_Word_Data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_Line_Data
        //             let FigData strFig_Line_Data = DirectCast(FigStac, strFig_Line_Data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_Circle_data
        //             let FigData strFig_Circle_data = DirectCast(FigStac, strFig_Circle_data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_Point_Data
        //             let FigData strFig_Point_Data = DirectCast(FigStac, strFig_Point_Data)
        //             PrintData = FigData.Data
        //         case TypeOf FigStac Is strFig_gazo_data
        //             let FigData strFig_gazo_data = DirectCast(FigStac, strFig_gazo_data)
        //             PrintData = FigData.Data
        //     }
        //     if(ZahyoOk = true ){
        //         let dl  = PrintData.Layer - 1
        //         let DD  = PrintData.Data - 1
        //         let ddl  = 0
        //         let ddd  = 0
        //         if(dl != -1 ){
        //             ddl = R_Layer_Convert(dl) + 1
        //             if(DD != -1 ){
        //                 if(DD = oldAttr.Get_DataNum(dl) + 1 ){
        //                     ddd = newAttrData.Get_DataNum(dl) + 1
        //                 }else{
        //                     ddd = R_Conv(dl)(DD).Data + 1
        //                 }
        //             }
        //         }
        //         PrintData.Layer = ddl
        //         PrintData.Data = ddd
        //         switch( true
        //             case TypeOf FigStac Is strFig_Word_Data
        //                 let FigData strFig_Word_Data = DirectCast(FigStac, strFig_Word_Data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_Line_Data
        //                 let FigData strFig_Line_Data = DirectCast(FigStac, strFig_Line_Data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_Circle_data
        //                 let FigData strFig_Circle_data = DirectCast(FigStac, strFig_Circle_data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_Point_Data
        //                 let FigData strFig_Point_Data = DirectCast(FigStac, strFig_Point_Data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //             case TypeOf FigStac Is strFig_gazo_data
        //                 let FigData strFig_gazo_data = DirectCast(FigStac, strFig_gazo_data)
        //                 FigData.Data = PrintData
        //                 newAttrData.TotalData.FigureStac.Add(FigData)
        //         }
        //     }
        // }

        //重ね合わせモードのデータをチェック
        let newATO = newAttrData.TotalData.TotalMode.OverLay;
        let oldATO = oldAttr.TotalData.TotalMode.OverLay;
        newATO.initDataSet();
        newATO.Always_Overlay_Index = oldATO.Always_Overlay_Index;
        newATO.SelectedIndex = oldATO.SelectedIndex;
        if (oldATO.DataSet.length != 0) {
            newATO.DataSet = [];
        }

        for (let i = 0; i < oldATO.DataSet.length; i++) {
            let OverDataset = new strOverLay_Dataset_Info();
            OverDataset.initData();
            OverDataset.title = oldATO.DataSet[i].title;
            let f;
            for (let j = 0; j < oldATO.DataSet[i].DataItem.Count; j++) {
                let overDt = oldATO.DataSet[i].DataItem[j].Clone();
                f = false;
                switch (overDt.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        let aD = R_Conv[overDt.Layer][overDt.DataNumber].Data;
                        let aL = R_Conv[overDt.Layer][overDt.DataNumber].Layer;
                        if ((aD == -1) || (aL == -1)) {
                            f = false;
                        } else {
                            overDt.DataNumber = aD;
                            overDt.Layer = aL;
                            f = true;
                        }
                        break;
                    }
                    case enmLayerMode_Number.GraphMode:
                    case enmLayerMode_Number.LabelMode: {
                        let aL = R_Layer_Convert[overDt.Layer];
                        if (aL == -1) {
                            f = false;
                        } else {
                            overDt.Layer = aL;
                            f = true;
                        }
                        break;
                    }
                }
                if (f == true) {
                    OverDataset.DataItem.push(overDt);
                }
            }
            newATO.SelectedIndex = Math.min(oldATO.DataSet[i].SelectedIndex, OverDataset.DataItem.length - 1)
            newATO.DataSet.push(OverDataset);
        }
        newATO.SelectedIndex = oldATO.SelectedIndex;

        //連続表示モードのデータをチェック
        let newATS = newAttrData.TotalData.TotalMode.Series;
        let oldATS = oldAttr.TotalData.TotalMode.Series;
        newATS.initDataSet();
        if (oldATS.DataSet.length != 0) {
            newATS.DataSet = [];
        }
        newATS.SelectedIndex = oldATS.SelectedIndex;
        for(let i  = 0 ;i< oldATS.DataSet.length ; i++) {
            let SeriesDataset = new strSeries_Dataset_Info();
            SeriesDataset.initData()
            SeriesDataset.title = oldATS.DataSet[i].title;
            for (let j = 0; j < oldATS.DataSet[i].DataItem.length; j++) {
                let seriesDt = oldATS.DataSet[i].DataItem[j].Clone();
                let f = false;
                switch (seriesDt.Print_Mode_Total) {
                    case enmTotalMode_Number.DataViewMode: {
                        switch (seriesDt.Print_Mode_Layer) {
                            case enmLayerMode_Number.SoloMode: {
                                let aD = R_Conv[seriesDt.Layer][seriesDt.Data].Data;
                                let aL = R_Conv[seriesDt.Layer][seriesDt.Data].Layer;
                                if ((aD == -1) || (aL == -1)) {
                                    f = false;
                                } else {
                                    seriesDt.Data = aD;
                                    seriesDt.Layer = aL;
                                    f = true;
                                }
                                break;
                            }
                            case enmLayerMode_Number.GraphMode:
                            case enmLayerMode_Number.LabelMode: {
                                let aL = R_Layer_Convert[seriesDt.Layer];
                                if (aL == -1) {
                                    f = false;
                                } else {
                                    seriesDt.Layer = aL;
                                    f = true;
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case enmTotalMode_Number.OverLayMode:
                }
                if (f == true) {
                    SeriesDataset.DataItem.push(seriesDt);
                }
            }
            SeriesDataset.SelectedIndex = Math.min(oldATS.DataSet[i].SelectedIndex, SeriesDataset.DataItem.length - 1);
            newATS.DataSet.push(SeriesDataset);
        }
        newATS.SelectedIndex = oldATS.SelectedIndex

        //ProgressLabel.SetValue TotalData.LV1.Lay_Maxn * 2 + 3
        //属性検索データをチェック
        newAttrData.TotalData.Condition =[];// New List(Of strCondition_DataSet_Info)
        for(let i  = 0 ;i< oldAttr.TotalData.Condition.length ; i++) {
            let oldATC = oldAttr.TotalData.Condition[i];
            let oldL = oldATC.Layer;
            let L = R_Layer_Convert[oldL];
            //レイヤが削除された場合は属性検索は削除
            if(L != -1 ){
                let conDataset = new strCondition_DataSet_Info();
                conDataset.Enabled = oldATC.Enabled;
                conDataset.Layer = L;
                conDataset.Name = oldATC.Name;
                conDataset.Condition_Class = []; //New List(Of strCondition_Data_Info)
                for (let j = 0; j < oldATC.Condition_Class.length; j++) {
                    let dt = new strCondition_Data_Info();
                    let oldATCC = oldATC.Condition_Class[j];
                    dt.And_OR = oldATCC.And_OR
                    dt.Condition = [];// New List(Of strCondition_Limitation_Info)
                    for (let k = 0; k < oldATCC.Condition.Count; k++) {
                        let dtItem = oldATCC.Condition[k].Clone();
                        let D = R_Conv[oldL][dtItem.Data].Data;
                        if (D != -1) {
                            dtItem.Data = D;
                            dt.Condition.push(dtItem);
                        }
                    }
                    //データが無くなった場合でも、コレクションは残す
                    conDataset.Condition_Class.push(dt);
                }
                newAttrData.TotalData.Condition.push(conDataset);
            }
        }

        //選択するデータ項目をチェックする
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            let L = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            let d = 0;
            if (L != -1) {
                d = R_Conv[L][oldAttr.LayerData[L].atrData.SelectedIndex].Data;
                if (d == -1) {
                    d = 0;
                }
            }
            newAttrData.LayerData[i].atrData.SelectedIndex = d;
        }

        //選択するレイヤをチェックする
        let Layn  = R_Layer_Convert[oldAttr.TotalData.LV1.SelectedLayer];
        if(Layn == -1 ){
            newAttrData.TotalData.LV1.SelectedLayer = 0;
        }else{
            newAttrData.TotalData.LV1.SelectedLayer = Layn;
        }
        newAttrData.TotalData.LV1.Print_Mode_Total = oldAttr.TotalData.LV1.Print_Mode_Total;

    }

    /**古いシンボル位置・ラベル位置で変更してあるものがあったら新しい箇所にコピーする */
    function Check_Kencode_XY(NewL,OldL){
        let newAL = newAttrData.LayerData[NewL];
        let oldAL = oldAttr.LayerData[OldL];
        let time = newAL.Time;
        if (newAL.Type == enmLayerType.Normal) {
            if (newAL.MapFileName != oldAL.MapFileName) {
                for (let i = 0; i < newAL.atrObject.ObjectNum; i++) {
                    let newALA = newAL.atrObject.atrObjectData[i];
                    newALA.CenterPoint = newAL.MapFileData.Get_Enable_CenterP(newALA.MpObjCode, time);
                    newALA.Symbol = newALA.CenterPoint.Clone();
                    newALA.Label = newALA.CenterPoint.Clone();
                    newALA.Visible = true;
                }
                return;
            }
        }

        let oldObjn = oldAttr.Get_ObjectNum(OldL);
        let sortoldObjName = new clsSortingSearch();
        for (let i = 0; i < oldObjn; i++) {
            sortoldObjName.Add(oldAttr.Get_KenObjName(OldL, i));
        }
        sortoldObjName.AddEnd();

        for (let i = 0; i < newAttrData.Get_ObjectNum(NewL); i++) {
            let objName = newAttrData.Get_KenObjName(NewL, i);
            let oldN = sortoldObjName.SearchData_One(objName);
            let naa = newAL.atrObject.atrObjectData[i];
            let oldALA = oldAL.atrObject.atrObjectData[oldN];
            switch (newAL.Type) {
                case enmLayerType.Normal: {
                    if ((oldN == -1) || (ZahyoOk == false)) {
                        naa.CenterPoint = newAL.MapFileData.Get_Enable_CenterP(naa.MpObjCode, time);
                        naa.Symbol = naa.CenterPoint.Clone();
                        naa.Label = naa.CenterPoint.Clone();
                        naa.Visible = true;
                    } else {
                        naa.CenterPoint = oldALA.CenterPoint.Clone();
                        naa.Symbol = oldALA.Symbol.Clone();
                        naa.Label = oldALA.Label.Clone();
                        naa.Visible = oldALA.Visible;
                    }
                    break;
                }
                case enmLayerType.Mesh: {
                    if ((oldN == -1) || (ZahyoOk == false)) {
                    } else {
                        naa.CenterPoint = oldALA.CenterPoint.Clone();
                        naa.Symbol = oldALA.Symbol.Clone();
                        naa.Label = oldALA.Label.Clone();
                        naa.MeshRect = oldALA.MeshRect.Clone();
                        naa.MeshPoint = Generic.ArrayClone(oldALA.MeshPoint);
                        naa.Visible = oldALA.Visible;
                    }
                    break;
                }
                case enmLayerType.DefPoint: {
                    if ((oldN == -1) || (ZahyoOk == false)) {
                    } else {
                        if (naa.defPoint.Equals(oldALA.defPoint)) {
                            naa.CenterPoint = oldALA.CenterPoint.Clone();
                            naa.Symbol = oldALA.Symbol.Clone();
                            naa.Label = oldALA.Label.Clone();
                            naa.Visible = oldALA.Visible;
                        }
                    }
                    break;
                }
            }
        }
    }

    /**グリッド上のデータに対応する旧データを設定 */
    function  Get_Data_Refference(){
        let D_LayerNum = oldAttr.TotalData.LV1.Lay_Maxn;

        let CheckedData=[]// As New List(Of Boolean())
        for(let i  = 0 ;i< D_LayerNum  ;i++){
            let d=new Array(oldAttr.LayerData[i].atrData.Count) ;
            CheckedData.push(d);
        }

        let Conv = [];//As New List(Of Layer_Data_Info())
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            let Dconv = [];//(datn - 1) As Layer_Data_Info
            for (let j = 0; j < newAttrData.LayerData[i].atrData.Count; j++) {
                Dconv[j] = Check_Data2(i, j, 1, CheckedData);
            }
            Conv.push(Dconv);
        }
        for (let i = 0; i < newAttrData.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < newAttrData.LayerData[i].atrData.Count; j++) {
                if (Conv[i][j].Layer == -1) {
                    Conv[i][j] = Check_Data2(i, j, 2, CheckedData);
                }
            }
        }
        return Conv;
    }

    /**平均値・合計値などがグリッド上のデータと同じ旧データを探す */
    function Check_Data2( L ,  D ,  CheckLevel ,  CheckedData ){

        let CheckDataRet = new Layer_Data_Info();
        let G_DTA = newAttrData.LayerData[L].atrData.Data[D];
   
        let Old_Lay = ktGrid.getLayerData(L, GridLayerData.OldIndex);
        if (Old_Lay == -1) {
            CheckDataRet.Layer = -1;
            CheckDataRet.Data = -1;
            return CheckDataRet;
        }

        //同一名称・単位のデータ項目をチェック
        let KouhoTitle = [];// As New List(Of Layer_Data_Info)
        for (let i = 0; i < oldAttr.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < oldAttr.LayerData[i].atrData.Count; j++) {
                let O_DTA = oldAttr.LayerData[i].atrData.Data[j];
                if ((O_DTA.Title == G_DTA.Title) && (O_DTA.Unit == G_DTA.Unit)) {
                    let dt = new Layer_Data_Info();
                    dt.Layer = i;
                    dt.Data = j;
                    KouhoTitle.push(dt);
                }
            }
        }
        if (KouhoTitle.length >= 1) {
            let j = 0;
            let n = 0;
            for (let i = 0; i < KouhoTitle.length; i++) {
                if (Old_Lay == KouhoTitle[i].Layer) {
                    n = i;
                    j++;
                }
            }
            if (j == 1) {
                //過去同一レイヤだった候補が１つある場合は確定
                let BeL = KouhoTitle[n].Layer;
                let BeD = KouhoTitle[n].Data;
                CheckDataRet.Layer = BeL;
                CheckDataRet.Data = BeD;
                CheckedData[BeL][BeD] = true;
                return CheckDataRet
            }
        }
        if (CheckLevel == 1) {
            CheckDataRet.Layer = -1;
            CheckDataRet.Data = -1;
            return CheckDataRet;
        }

        let Data_Prop_Value = Get_Data_Property_Value(newAttrData, L, D);

        let Kouho = [];// New List(Of Layer_Data_InfoCheck)
        let Sort_KouhoV = new clsSortingSearch()

        for (let i = 0; i < oldAttr.TotalData.LV1.Lay_Maxn; i++) {
            for (let j = 0; j < oldAttr.LayerData[i].atrData.Count; j++) {
                let O_DTA = oldAttr.LayerData[i].atrData.Data[j]
                if (O_DTA.DataType == G_DTA.DataType) {
                    let OV = D_CheckDataValue[i][j];
                    let GV = Data_Prop_Value;
                    if (GV == 0) {
                        GV++;
                        OV++;
                    }
                    let av = Math.abs(OV / GV - 1);
                    if (av <= 0.3) {
                        let dt = new Layer_Data_InfoCheck();
                        dt.Layer = i;//レイヤ
                        dt.Data = j; //データ項目
                        dt.Value = av;
                        Kouho.push(dt);
                    }
                }
            }
        } 
        let BL;
        let BD;
        switch (Kouho.length) {
            case 0:
                BL = -1;
                BD = -1;
                break;
            case 1:
                BL = Kouho[0].Layer;
                BD = Kouho[0].Data;
                break;
            default:
                BD = -1;
                BL = -1;
                let i2 = 0;
                for (let i = 0; i < Kouho.length; i++) {
                    Sort_KouhoV.add(Kouho[i].Value);
                }
                Sort_KouhoV.AddEnd();
                do {
                    i2++;
                    if (i2 == Kouho.length) {
                        break;
                    }
                } while (Sort_KouhoV.DataPositionValue(i2) == Sort_KouhoV.DataPositionValue(0));

                if (i2 == 1) {
                    BL = Kouho[Sort_KouhoV.DataPosition(0)].Layer;
                    BD = Kouho[Sort_KouhoV.DataPosition(0)].Data;
                } else {
                        for(let j  = 0 ;j<  i2 ;j++){
                            let kj=Kouho[j];
                            let O_DTA = oldAttr.LayerData[kj.Layer].atrData.Data[kj.Data];
                            if((O_DTA.Title == G_DTA.Title)&&(O_DTA.Unit == G_DTA.Unit) ){
                                BL = kj.Layer;
                                BD = kj.Data;
                                break;
                            }
                        }
                        if(BD == -1 ){
                                BL = Kouho[Sort_KouhoV.DataPosition(0)].Layer;
                                BD =Kouho[Sort_KouhoV.DataPosition(0)] .Data;
                        }
                        break;
                    }
            }
            if(BL != -1 ){
                if(CheckedData[BL][BD]  == true ){
                    BD = -1;
                    BL = -1;
                }else{
                    CheckedData[BL][BD] = true;
                }
            }
            CheckDataRet.Layer = BL;
            CheckDataRet.Data = BD;
            return CheckDataRet
    }

    function Reset_SCRView_Size(){

        newAttrData.Check_Vector_Object();
        //ダミー点オブジェクトの記号
        newAttrData.initDummuyPointObjectMark();
        let newTV = newAttrData.TotalData.ViewStyle;
        let oldTV = oldAttr.TotalData.ViewStyle;
        let oldDummy = oldTV.DummyObjectPointMark;
        if (newTV.DummyObjectPointMark.length > 0) {
            let newMapfile = newAttrData.GetMapFileName();
            let oldMapfile = oldAttr.GetMapFileName();
            for (let i = 0; i < newMapfile.length; i++) {
                let n = oldMapfile.indexOf(newMapfile[i]);
                if (n != -1) {
                    if (newTV.DummyObjectPointMark[newMapfile[i]]) {
                        let d = newTV.DummyObjectPointMark[newMapfile[i]];
                        for (let j = 0; j < d.Length; j++) {
                            d[j].ObjectKindName = oldDummy[newMapfile[i]][j].ObjectKindName;
                            d[j].Mark = oldDummy[newMapfile[i]][j].Mark.Clone();
                        }
                    }
                }
            }
        }

        let oldTTS  = oldTV.ScrData;
        let newTTS=newTV.ScrData;
        if(oldTTS.MapRectangle.Equals(newTTS.MapRectangle) == true ){
            newTTS.ScrData = oldTTS.Clone();
            //地図領域が同じ場合はここまで
            return;
        }

        if(ZahyoOk == false ){
            newTTS.ScrView = newTTS.MapRectangle.Clone();
        }else{
            let newTTSV = newTTS.ScrView;
            let O_SCRView = oldTTS.ScrView;
            let OP1 = O_SCRView.topLeft();
            let OP2 = O_SCRView.bottomRight();
            if (OP1.x < newTTSV.left) {
                OP1.x = newTTSV.left;
            }
            if (OP2.x > newTTSV.right) {
                OP2.x = newTTSV.right;
            }
            if (OP1.y < newTTSV.top) {
                OP1.y = newTTSV.top;
            }
            if (OP2.y > newTTSV.bottom) {
                OP2.y = newTTSV.bottom;
            }
            if (OP2.x - OP1.x <= 0) {
                OP2.x = newTTSV.right;
                OP1.x = newTTSV.left;
            }
            if (OP2.y - OP1.y <= 0) {
                OP1.y = newTTSV.top;
                OP2.y = newTTSV.bottom;
            }
            newTTS.ScrView = new rectangle(OP1.x, OP2.x,OP1.y,  OP2.y);

            if(newTTS.Accessory_Base == enmBasePosition.Map ){
                let MapRect = newTTS.MapRectangle;
                let WAKU = newTTS.MapRectangle.Clone();
                let sz = newTTS.MapRectangle.size();
                 WAKU.inflate(sz.width * 0.1, sz.height * 0.1);
                let mlb = newTV.MapLegend.Base;
                for (let i = 0; i < mlb.Legend_Num; i++) {
                    if ((mlb.LegendXY[i].x < WAKU.left) || (mlb.LegendXY[i].x > WAKU.right) || (
                        mlb.LegendXY[i].y < WAKU.top) || (mlb.LegendXY[i].y > WAKU.bottom)) {
                        mlb.LegendXY[i].x = MapRect.right + (1 - i) * WAKU.width / 50;
                        mlb.LegendXY[i].y = (MapRect.top + MapRect.bottom) / 2 + (1 - i) * sz.height / 50; // + wy2) / 2 + (1 - i) * h / 50
                    }
                }

                let mlt = newTV.MapTitle.Position;
                if ((mlt.x < WAKU.left) || (mlt.x > WAKU.right) || (
                    mlt.y < WAKU.top) || (mlt.y > WAKU.bottom)) {
                    mlt.x = (MapRect.left + MapRect.right) / 2;
                    mlt.y = MapRect.bottom + sz.height / 20;
                }
                let mls = newTV.MapScale.Position;
                if ((mls.x < WAKU.left) || (mls.x > WAKU.right) || (
                    mls.y < WAKU.top) || (mls.y > WAKU.bottom)) {
                    mls.x = MapRect.left + sz.width * 4 / 5;
                    mls.y = MapRect.bottom + sz.height / 30;
                }
                let mlc = newTV.AttMapCompass.Position
                if ((mlc.x < WAKU.left) || (mlc.x > WAKU.right) || (
                    mlc.y < WAKU.top) || (mlc.y > WAKU.bottom)) {
                    if (mlc.x >= MapRect.right + sz.width * 0.3) { mlc.x = MapRect.right - sz.width * 0.1 }
                    if (mlc.x <= MapRect.left - sz.width * 0.3) { mlc.x = MapRect.left + sz.width * 0.1 }
                    if (mlc.y >= MapRect.bottom + sz.height * 0.3) { mlc.y = MapRect.bottom - sz.height * 0.1 }
                    if (mlc.y <= MapRect.top - sz.height * 0.3) { mlc.y = MapRect.top + sz.height * 0.1 }
                }
            }
        }
    }

    /**グリッド上のデータを取得 */
    function Get_E_Data(){
        let L = ktGrid.getLayerMax();
        newAttrData.TotalData.LV1.Lay_Maxn = 0
        for (let i = 0; i < L; i++) {
            let LayYMax = ktGrid.getYsize(i);
            let LayXMax = ktGrid.getXsize(i);
            let YChange = new Array(LayYMax - 1);
            let LayYMaxReal = 0;
            for (let j = 0; j < LayYMax; j++) {
                if (ktGrid.getFixedXSData(i, 1, j) == "") {
                    YChange[j] = -1;
                } else {
                    YChange[j] = LayYMaxReal;
                    LayYMaxReal++;
                }
            }
            let LType = ktGrid.getLayerData(i, GridLayerData.Type);
            let LSP = ktGrid.getLayerData(i, GridLayerData.Shape);
            let Lmesh = ktGrid.getLayerData(i, GridLayerData.Mesh);
            let Lmapfile = ktGrid.getLayerData(i, GridLayerData.MapFile);
            let LTime = ktGrid.getLayerData(i, GridLayerData.Time);
            let OldLay = ktGrid.getLayerData(i, GridLayerData.OldIndex);
            let SyntheticObjF = ktGrid.getLayerData(i, GridLayerData.SyntheticObjF);
            let RefSystem = ktGrid.getLayerData(i, GridLayerData.ReferenceSystem);
            let LayComment = ktGrid.getLayerData(i, GridLayerData.Comment);

            let Get_Obj = new Array(LayYMaxReal);
            for (let i = 0; i < LayYMaxReal; i++) {
                Get_Obj[i] = new strObject_Data_Info();
            }
            if (SyntheticObjF == true) {
                //時系列集計したレイヤの場合は，変更前のオブジェクトコード・合成オブジェクトデータを設定する

                for (let j = 0; j < oldAttr.LayerData[OldLay].atrObject.ObjectNum; j++) {
                    let gob = Get_Obj[j];
                    gob.Objectstructure = oldAttr.LayerData[OldLay].atrObject.atrObjectData[j].Objectstructure;
                    gob.MpObjCode = oldAttr.LayerData[OldLay].atrObject.atrObjectData[j].MpObjCode;
                    gob.Name = oldAttr.LayerData[OldLay].atrObject.atrObjectData[j].Name;
                }
            } else {
                for (let j = 0; j < LayYMax; j++) {
                    if (YChange[j] != -1) {
                        let tx = ktGrid.getFixedXSData(i, 1, j);
                        let UseMap = newAttrData.SetMapFile(Lmapfile);
                        let gobj = Get_Obj[YChange[j]];
                        switch (LType) {
                            case enmLayerType.Mesh:
                                gobj.Objectstructure = enmKenCodeObjectstructure.MapObj;
                                gobj.Name = tx;
                                gobj.MpObjCode = -2;
                                break;
                            case enmLayerType.Normal:
                                gobj.Objectstructure = enmKenCodeObjectstructure.MapObj;
                                gobj.Name = tx;
                                gobj.MpObjCode = newAttrData.Get_ObjectCode_from_ObjName(Lmapfile, tx, LTime);
                                gobj.CenterPoint = UseMap.Get_Enable_CenterP(gobj.MpObjCode, LTime);
                                gobj.Symbol = gobj.CenterPoint.Clone();
                                gobj.Label = gobj.CenterPoint.Clone();
                                break;
                            case enmLayerType.DefPoint:
                                gobj.Objectstructure = enmKenCodeObjectstructure.MapObj;
                                gobj.Name = tx;
                                break;
                        }
                    }
                }
            }
            newAttrData.Add_one_Layer(ktGrid.getLayerName(i), LType, Lmesh, LSP, Lmapfile, LTime, RefSystem, LayComment, LayYMaxReal, Get_Obj);

            let newAt = newAttrData.LayerData[i];
            newAt.Type = LType;
            if (SyntheticObjF == true) {
                let n = oldAttr.LayerData[OldLay].atrObject.NumOfSyntheticObj;
                newAt.atrObject.NumOfSyntheticObj = n;
                newAt.atrObject.MPSyntheticObj = [];
                for (let j = 0; j < n; j++) {
                    newAt.atrObject.MPSyntheticObj.push(oldAttr.LayerData[OldLay].atrObject.MPSyntheticObj[j].Clone());
                }
                newAt.Shape = oldAttr.LayerData[OldLay].Shape;
            } else {
                if (LSP == enmShape.NotDeffinition) {
                    newAt.Shape = newAttrData.Check_LayerShape_Sub(i).shape;
                } else {
                    newAt.Shape = LSP;
                }
            }
            let DN_Str = Generic.Array2Dimension(LayXMax, LayYMax);
            let TTL = [];
            let UNT = [];
            let Mis = [];
            let Note = [];
            for (let j = 0; j < LayXMax; j++) {
                TTL[j] = ktGrid.getFixedYSData(i, j, 3);
                UNT[j] = ktGrid.getFixedYSData(i, j, 4);
                Mis[j] = Generic.ConvertMissingValueFromString(ktGrid.getFixedYSData(i, j, 2));
                Note[j] = ktGrid.getFixedYSData(i, j, 5);
            }
            for (let j = 0; j < LayYMax; j++) {
                if (YChange[j] != -1) {
                    for (let k = 0; k < LayXMax; k++) {
                        DN_Str[k][YChange[j]] = ktGrid.getGridData(i, k, j);
                    }
                }
            }
            let retv=newAttrData.Set_STRData_To_Cell(i, LayXMax, TTL, UNT, Mis, Note, DN_Str);
            if(retv.ok==false){
                return retv;
            }
            switch (newAt.Type) {
                case enmLayerType.Normal:
                case enmLayerType.Mesh:
                    newAt.LayerModeViewSettings.GraphMode.initDataSet()
                    newAt.LayerModeViewSettings.LabelMode.initDataSet()
                    break;
            }
        }
        return {ok:true};
    }

    /**データエラーのチェック */
    function ErrorCheck() {
        errorInfo.value="";
        let emes = ErrorCheckLayerMapFile();
        if (emes.length != 0) {
            let tx = "";
            for (let i in emes) {
                tx += emes[i] + "\n";
            }
            errorInfo.value = tx;
            return true;
        }
        let tx2 = "";
        for (let i = 0; i < ktGrid.getLayerMax(); i++) {
            let mes = Check_ObjectNameLayer(i);
            for (let i in mes) {
                tx2 += mes[i] + "\n";
            }
        }
        if (tx2 != "") {
            errorInfo.value = tx2;
            return true;
        }
        return false;
    }

    /**レイヤ全体にかかわる項目エラーのチェック */
    function ErrorCheckLayerMapFile() {
        let eMes = [];
        if (newAttrData.GetNumOfMapFile() == 0) {
            eMes.push("地図ファイルが指定されていません。");
            return eMes;
        }
        let mfileList = newAttrData.GetMapFileName();
        for (let i = 0; i < ktGrid.getLayerMax(); i++) {
            let laytype = ktGrid.getLayerData(i, GridLayerData.Type);
            let mpFileName = ktGrid.getLayerData(i, GridLayerData.MapFile);
            let mpFile = newAttrData.SetMapFile(mpFileName);
            let mpn = mfileList.indexOf(mpFileName.toUpperCase());
            if (mpn != -1) {
                mfileList[mpn] = "";
            }
            let layName = ktGrid.getLayerName(i);
            let kk = 0;
            let FYGrid = ktGrid.getFixedYSData(i);
            let LatN = 0
            let LonN = 0

            for (let j = 0; j < ktGrid.getXsize(i); j++) {
                let f;
                let ttl = FYGrid[j][3].toUpperCase();
                if ((ttl != "URL") && (ttl != "URL_NAME")) {
                    if (FYGrid[j][3] == "") {
                        f = false;
                        for (let jj = 0; jj < ktGrid.getYsize(i); jj++) {
                            if (ktGrid.getGridData(i, j, jj) != "") {
                                f = true;
                                break;
                            }
                        }
                    } else {
                        f = true;
                    }
                    switch (ttl) {
                        case "LAT":
                            LatN++;
                            break;
                        case "LON":
                            LonN++;
                            break;
                    }
                }
                if (f == true) {
                    kk++;
                }
            }
            if (kk == 0) {
                eMes.push(layName + "：データ項目がありません。");
            }

            let L_Time = ktGrid.getLayerData(i, GridLayerData.Time);
            let zahyo = mpFile.Map.Zahyo.Mode
            if ((mpFile.Map.Time_Mode == true) && (L_Time.nullFlag() == true)) {
                eMes.push(layName + "：時期設定が必要です。");
            }
            switch (laytype) {
                case enmLayerType.DefPoint: {
                    if (LatN == 0) {
                        eMes.push(layName + "：地点定義レイヤではLATタグで地点の緯度を指定して下さい。");
                    } else if (LatN >= 2) {
                        eMes.push(layName + "：地点定義レイヤではLATタグを複数箇所で指定しないで下さい。");
                    }
                    if (LonN == 0) {
                        eMes.push(layName + "：地点定義レイヤではLONタグで地点の経度を指定して下さい。");
                    } else if (LonN >= 2) {
                        eMes.push(layName + "：地点定義レイヤではLONタグを複数箇所で指定しないで下さい。");
                    }
                    if (zahyo == enmZahyo_mode_info.Zahyo_No_Mode) {
                        eMes.push(layName + "：緯度経度座標系の地図ファイルでないので地点定義レイヤには設定できません。");
                    }
                    break;
                }
                case enmLayerType.Mesh:
                    if (zahyo == enmZahyo_mode_info.Zahyo_No_Mode) {
                        eMes.push(layName + "：緯度経度座標系の地図ファイルでないのでメッシュレイヤには設定できません。");
                    }
                    break;
            }
        }
        for (let i = 0; i < mfileList.length; i++) {
            if (mfileList[i] != "") {
                eMes.push("地図ファイル" + mfileList[i] + "は使われていません。");
            }
        }
        return eMes;
    }

    /**レイヤごとのオブジェクト名をチェックする */
    function Check_ObjectNameLayer(LayerNum){
        let eMes=[];
        let Enable_Obj  = 0;

        let L_Name  = ktGrid.getLayerName(LayerNum);
        let LayerType  = ktGrid.getLayerData(LayerNum, GridLayerData.Type);
        let SyntheticObjF  = ktGrid.getLayerData(LayerNum, GridLayerData.SyntheticObjF);
        let mpFileName = ktGrid.getLayerData(LayerNum, GridLayerData.MapFile);
        let mpFile = newAttrData.SetMapFile(mpFileName);

        if (SyntheticObjF == false) {
            let L_Time;
            let LAY_Time = true;
            if (LayerType == enmLayerType.Trip_Definition) {
                L_Time = clsTime.GetNullYMD();
            } else if (mpFile.Map.Time_Mode == false) {
                L_Time = clsTime.GetNullYMD()
            } else {
                L_Time = ktGrid.getLayerData(LayerNum, GridLayerData.Time);
            }
            let MeshCodeLen = 0;
            if (LayerType == enmLayerType.Mesh) {
                MeshCodeLen = Generic.getMeshCodeLength(ktGrid.getLayerData(LayerNum, GridLayerData.Mesh));
            }

            let Object_Use_Check = [];
            let FXGrid = ktGrid.getFixedXSData(LayerNum);
            let SH = new Array(4);
            SH.fill(0);
            for (let j = 0; j < ktGrid.getYsize(LayerNum); j++) {
                let ObjName = FXGrid[1][j];
                if (ObjName != "") {
                    switch (LayerType) {
                        case enmLayerType.Normal: {
                            let code = newAttrData.Get_ObjectCode_from_ObjName(mpFileName, ObjName, L_Time);
                            if (code == -1) {
                                let em2 = ""
                                for (let k = 0; k < mpFile.Map.Kend; k++) {
                                    for (let k2 = 0; k2 < mpFile.MPObj[k].NumOfNameTime; k2++) {
                                        let mnt = mpFile.MPObj[k].NameTimeSTC[k2];
                                        if (mnt.NamesList.indexOf(ObjName) != -1) {
                                            em2 += Generic.getTimeList(mpFile.MPObj[k].NameTimeSTC[k2]) + "\n";
                                        }
                                    }
                                }
                                if (em2 != "") {
                                    if (LAY_Time == true) {
                                        eMes.push(L_Name + "：「" + ObjName + "」は時期が違っています。正しい有効期間は\n" + em2 + "です。");
                                    }
                                } else {
                                    eMes.push(L_Name + "：「" + ObjName + "」は地図ファイル中に存在しません。");
                                }
                            } else {
                                if (Object_Use_Check[code] == true) {
                                    eMes.push(L_Name + "：「" + ObjName + "」は複数回使用されています。");
                                } else {
                                    Object_Use_Check[code] = true;
                                    SH[mpFile.MPObj[code].Shape]++;
                                    Enable_Obj++;
                                }
                            }
                            break;
                        }
                        case enmLayerType.Mesh: {
                            if (ObjName.length != MeshCodeLen) {
                                eMes.push(L_Name + "：「" + ObjName + "」はメッシュサイズが設定と異なります。");
                            } else {
                                Enable_Obj++;
                            }
                            break;
                        }
                        case enmLayerType.DefPoint:
                            Enable_Obj++;
                            break;
                    }
                }
            }
            if (Enable_Obj == 0) {
                eMes.push(L_Name + "：有効なオブジェクトがありません。");
            } else {
                if (LayerType == enmLayerType.Normal) {
                    let enableShale = Generic.checkShape(SH);
                    let LayShape = ktGrid.getLayerData(LayerNum, GridLayerData.Shape);
                    switch (LayShape) {
                        case enmShape.PolygonShape:
                            if (enableShale != enmShape.PolygonShape) {
                                eMes.push(L_Name + "：面形状に設定できません。");
                            }
                            break;
                        case enmShape.LineShape:
                            if (enableShale == enmShape.PointShape) {
                                eMes.push(L_Name + "：線形状に設定できません。");
                            }
                            break;
                    }
                }
            }
        }
        return eMes;
    }

    /**レイヤ情報の画面セット */
    function Set_LayerTypeShape(){
        cboLayerMapFile.disabled= true;
        cboLayerType.disabled=true;
        cboLayerShape.disabled= true;
        cboMesh.disabled=true;
        DateTimePickerLayer.disabled = true;
        zahyoSystemFrame.setVisibility(false);
        if (newAttrData.GetNumOfMapFile == 0) {
            return;
        }
        let LayerNum  = ktGrid.getLayer();
        let layMap  = ktGrid.getLayerData(LayerNum, GridLayerData.MapFile);
        cboLayerMapFile.setSelectText(layMap);
        let LayType  = ktGrid.getLayerData(LayerNum, GridLayerData.Type);
        let LayShape  = ktGrid.getLayerData(LayerNum, GridLayerData.Shape);
        let MeshType  = ktGrid.getLayerData(LayerNum, GridLayerData.Mesh);
        let ReferenceSystm  = ktGrid.getLayerData(LayerNum, GridLayerData.ReferenceSystem);
        cboLayerType.setSelectValue(LayType);
        cboLayerShape.setSelectValue(LayShape);
        cboMesh.setSelectValue(MeshType);
        Generic.checkRadioByValue("zahyoSystem",ReferenceSystm);
        let T  = ktGrid.getLayerData(LayerNum, GridLayerData.Time);
        if(T.nullFlag()==false ){
            DateTimePickerLayer.value = T.toInputDate();
            DateTimePickerLayer.disabled=false;
        }
        cboLayerType.disabled=false;
        let SymtheF  = ktGrid.getLayerData(LayerNum, GridLayerData.SyntheticObjF);
        if(SymtheF == true ){
            cboLayerMapFile.disabled= true;
            cboLayerShape.disabled= false;
            cboLayerType.disabled=true;
            cboMesh.disabled=true;
            DateTimePickerLayer.disabled=true;
        }else{
            cboLayerMapFile.disabled= false;
            switch (LayType) {
                case enmLayerType.Normal:
                    cboLayerMapFile.disabled= false;
                    cboLayerShape.disabled= false;
                    break;
                case enmLayerType.DefPoint:
                    cboLayerMapFile.disabled= false;
                    zahyoSystemFrame.setVisibility(true);
                    break;
                case enmLayerType.Mesh:
                    cboLayerMapFile.disabled= false;
                    cboLayerShape.disabled= false;
                    cboMesh.disabled=false;
                    zahyoSystemFrame.setVisibility(true);
                    break;
            }
        }
        txtLayerComment.value = ktGrid.getLayerData(LayerNum, GridLayerData.Comment);
}
    function Check_DataKind(Layernum ){
        for (let i = 0; i < ktGrid.getXsize(Layernum); i++) {
            let lType = ktGrid.getLayerData(Layernum, GridLayerData.Type);
            let ttl = "通常のデータ";
            let titleCell = ktGrid.getFixedYSData(Layernum, i, 3).toUpperCase();
            let unitCell = ktGrid.getFixedYSData(Layernum, i, 4).toUpperCase();

            if (titleCell == "URL_NAME") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.URL_Name);
            } else if (titleCell == "URL") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.URL);
            } else if (unitCell == "CAT") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Category);
            } else if (unitCell == "STR") {
                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Strings);
            } else {
                switch (lType) {
                    case enmLayerType.DefPoint: {
                        switch (titleCell) {
                            case "LON":
                                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Lon);
                                break;
                            case "LAT":
                                ttl = Generic.ConvertAttDataTypeString(enmAttDataType.Lat);
                                break;
                        }
                        break;
                    }
                }
            }
            ktGrid.setFixedYSData(Layernum, i, 1, ttl);
        }
}
    function set_First_GridCellWidthHeight(Layernum){
       ktGrid.setFixedXSWidth(Layernum, 0,50);
       ktGrid.setFixedXSWidth(Layernum, 1,150);
       ktGrid.setFixedYSHeight(Layernum, 3,38);
       ktGrid.setFixedUpperLeftData(Layernum, 1, 1,"データの種類");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 2,"空白セル");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 3,"タイトル");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 4,"単位");
       ktGrid.setFixedUpperLeftData(Layernum, 1, 5,"注");
    }
    function Get_Data_Property_Value(_attrData,Layernum,DataNum){
        let al = _attrData.LayerData[Layernum];
        switch (al.atrData.Data[DataNum].DataType) {
            case enmAttDataType.Normal:
                //平均値
                return al.atrData.Data[DataNum].Statistics.Ave;
                break;
            case enmAttDataType.Category: {
                let n = 0;
                let retV=_attrData.Get_ClassFrequency(Layernum, DataNum, false);
                let freq=retV.frequency;
                for (let i = 0; i < freq.length; i++) {
                    n += freq[i];
                }
                //度数分布の平均
                return n / freq.length;
                break;
            }
            case enmAttDataType.Strings:
                let n = 0;
                for (let i = 0; i < al.atrObject.ObjectNum; i++) {
                    n += _attrData.Get_Data_Value(Layernum, DataNum, i, "").length;
                }
                //文字列の長さの平均値
                return n / al.atrObject.ObjectNum;
        }
    }

    function check_DataKind_and_Allignment(Layernum){
        for(let i  = 0 ;i< ktGrid.getXsize(Layernum);i++){
            let dtype  = Generic.getAttDataType_From_TitleUnit(ktGrid.getFixedYSData(Layernum, i, 3), ktGrid.getFixedYSData(Layernum, i, 4));
            ktGrid.setFixedYSData(Layernum, i, 1, Generic.ConvertAttDataTypeString(dtype));
            switch( dtype){
                case enmAttDataType.Normal:
                case enmAttDataType.Lat:
                case  enmAttDataType.Lon:
                    ktGrid.setGridAlligntment(Layernum, i, enmHorizontalAlignment.Right);
                    break;
                default:
                    ktGrid.setGridAlligntment(Layernum, i, enmHorizontalAlignment.Left);
                    break;
                }
            }
    }

    function SetMapFileList_to_CboBox(){
        let Mapfiles=newAttrData.GetMapFileName();
        if(Mapfiles.length==0){return;}
        let lst=[];
        for(let i in Mapfiles){
            lst.push({text:Mapfiles[i],value:i});
        }
        cboLayerMapFile.addSelectList(lst,undefined,true,false);

    }
    function setIniform() {
        let gl = GridLayerData;
        gl.MapFile = "MapFile";
        gl.Type = "Type";
        gl.Shape = "Shape";
        gl.Time = "Time";
        gl.OldIndex = "OldIndex";
        gl.Mesh = "Mesh";
        gl.SyntheticObjF = "Synthetic";
        gl.Comment = "Comment";
        gl.ReferenceSystem = "ReferenceSystem";
        Change_Data = false;
        let ltype = [{ value: enmLayerType.Normal, text: Generic.ConvertStringFromLayerType(enmLayerType.Normal) },
        { value: enmLayerType.DefPoint, text: Generic.ConvertStringFromLayerType(enmLayerType.DefPoint) },
        { value: enmLayerType.Mesh, text: Generic.ConvertStringFromLayerType(enmLayerType.Mesh) }];
        cboLayerType.addSelectList(ltype, 0, false, false)
        let lShape = [{ value: enmShape.NotDeffinition, text: Generic.ConvertShapeEnumString(enmShape.NotDeffinition) },
        { value: enmShape.PointShape, text: Generic.ConvertShapeEnumString(enmShape.PointShape) },
        { value: enmShape.LineShape, text: Generic.ConvertShapeEnumString(enmShape.LineShape) },
        { value: enmShape.PolygonShape, text: Generic.ConvertShapeEnumString(enmShape.PolygonShape) }];
        cboLayerShape.addSelectList(lShape, 0, false, false);
        let lMesh = [{ value: enmMesh_Number.mhFirst, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhFirst) },
        { value: enmMesh_Number.mhSecond, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhSecond) },
        { value: enmMesh_Number.mhThird, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhThird) },
        { value: enmMesh_Number.mhHalf, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhHalf) },
        { value: enmMesh_Number.mhQuarter, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhQuarter) },
        { value: enmMesh_Number.mhOne_Eighth, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhOne_Eighth) },
        { value: enmMesh_Number.mhOne_Tenth, text: Generic.ConvertMeshTypeFromEnum(enmMesh_Number.mhOne_Tenth) }];
        cboMesh.addSelectList(lShape, 0, false, false);
    }

    function btnAddMapfile() {
        openMapFile(getFile);
        function getFile(jsonMapData, filename) {
            if (jsonMapData == undefined) {
                Generic.alert(undefined, "読み込めませんでした。");
                return;
            }
            let fname = newAttrData.GetMapFileName();
            if (fname.indexOf(filename.toUpperCase()) != -1) {
                Generic.alert(undefined, filename + "は既に読み込まれています。");
            }

            let mapdata = new clsMapdata();
            mapdata.openJsonMapData(jsonMapData);
            mapdata.Map.FileName = filename;
            if (fname.length > 0) {
                let z = newAttrData.SetMapFile("").Map.Zahyo;
                let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mapdata.Map.Zahyo);
                if (retv.ok == false) {
                    Generic.alert(undefined, filename + "は既存の読み込み地図ファイルと座標系が異なります。");
                    return;
                }
            }
            newAttrData.AddExistingMapData(mapdata, filename);
            lstMapFile.add({ text: filename, value: 0 });
            cboLayerMapFile.addSelectList([{ text: filename, value: 0 }], undefined, false, false);
            btnRemoveMapfile.disabled = false;
            btnReplaceMapFile.disabled = false;
            btnObjectNameCopy.disabled = false;
            btnAddDefAttr.disabled = false;
            //ktGrid.setVisibility(true);
            gbSearch.disabled = false;
            if (newAttrData.GetNumOfMapFile() == 1) {
                for (let i = 0; i < ktGrid.getLayerMax(); i++) {
                    ktGrid.setLayerData(i, GridLayerData.MapFile, filename);
                }
                Set_LayerTypeShape()
            }
            ErrorCheck();
        }

    }
    
    function btnRemoveMapfileClick(){
        let sel  = lstMapFile.selectedIndex;
        if( sel == -1){
            Generic.alert(undefined,"地図ファイルを選択して下さい。");
            return;
        }
        let fname = lstMapFile.getText();
        for(let i  = 0 ;i< ktGrid.getLayerMax();i++){
            if (ktGrid.getLayerData(i, GridLayerData.MapFile).toUpperCase() == fname.toUpperCase()){
                Generic.alert(undefined,fname + "は使用されています。");
                return;
            }
        }
        newAttrData.RemoveMapData(fname);
        lstMapFile.removeList(sel,1);
        cboLayerMapFile.remove(sel);
        Set_LayerTypeShape();
    }

    function btnReplaceMapfileClick() {
        let sel = lstMapFile.selectedIndex;
        if (sel == -1) {
            Generic.alert(undefined, "地図ファイルを選択して下さい。");
            return;
        }
        let repFname = lstMapFile.getText();

        for (let i = 0; i < ktGrid.getLayerMax; i++) {
            let synf = ktGrid.getLayerData(i, GridLayerData.SyntheticObjF);
            if ((synf == true) && (ktGrid.getLayerData(i, GridLayerData.MapFile) == repFname)) {
                Generic.alert(undefined, "時系列集計されたレイヤで使われているので、差し替えできません。");
                return;
            }
        }

        openMapFile(getFile);
        function getFile(jsonMapData, filename) {
            if (jsonMapData == undefined) {
                Generic.alert(undefined, "読み込めませんでした。");
                return;
            }
            let fname = newAttrData.GetMapFileName();
            if (fname.indexOf(filename.toUpperCase()) != -1) {
                Generic.alert(undefined, filename + "は既に読み込まれています。");
            }
            let mData = new clsMapdata();
            mData.openJsonMapData(jsonMapData);
            mData.Map.FileName = filename;
    
            newAttrData.RemoveMapData(repFname);
            if (newAttrData.GetNumOfMapFile() > 0) {
                let z = newAttrData.SetMapFile("").Map.Zahyo;
                let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(z, mData.Map.Zahyo);
                if (retv.ok == false) {
                    Generic.alert(undefined, retv.emes);
                    return;
                }
            }
    
            newAttrData.AddExistingMapData(mData, filename);
            lstMapFile.removeList(sel,1);
            lstMapFile.add({ text: filename, value: 0 })
            cboLayerMapFile.remove(sel);
            cboLayerMapFile.addSelectList([{ text: filename, value: 0 }], undefined, false, false);
            for (let i = 0; i < ktGrid.getLayerMax(); i++) {
                let oldFname = ktGrid.getLayerData(i, GridLayerData.MapFile);
                if (oldFname == repFname) {
                    ktGrid.setLayerData(i, GridLayerData.MapFile, filename);
                    let LTime = ktGrid.getLayerData(i, GridLayerData.Time);
                    if ((newAttrData.SetMapFile(filename).Map.Time_Mode == true) && (LTime.nullFlag == true)) {
                        ktGrid.setLayerData(i, GridLayerData.Time, clsTime.GetYMD(new Date()));
                    } else if ((newAttrData.SetMapFile(filename).Map.Time_Mode == false) && (LTime.nullFlag == false)) {
                        ktGrid.setLayerData(i, GridLayerData.Time, clsTime.GetNullYMD());
                    }
                }
            }
            Set_LayerTypeShape();
            ErrorCheck();
            }
    }
}
    