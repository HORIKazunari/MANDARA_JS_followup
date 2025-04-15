

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
/**　グリッドコントロール */

let gridControl = function (ParentObj, x, y, width, height,fontName) {
    this.top=y;
    this.left=x
    this.width=width;
    this.height=height;
    const Keys = {
        Left: 37,
        Right: 39,
        Up: 38,
        Down: 40,
        ShiftKey: 16,
        ControlKey: 17,
        Z: 90,
        C: 67,
        X: 88,
        V: 86,
        Tab: 9,
        Return: 13,
        PageDown: 34,
        PageUp: 33,
        Home: 36,
        Enter: 13,
        Escape: 27,
        Delete: 46
    }
    let Undo_InputCopyPasteClearInfo = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Rect; // Rectangle
        this.GridData; // String
    }
    let Undo_InsertRows = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Top; // Integer
        this.Bottom; // Integer
    }
    let Undo_InsertColumns = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Left; // Integer
        this.Right; // Integer
    }
    let Undo_DeleteRows = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Top; // Integer
        this.Bottom; // Integer
        this.GridData; // String
    }
    let Undo_DeleteColumns = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Left; // Integer
        this.Right; // Integer
        this.GridData; // String
    }
    let Undo_ChangeRowHeight = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Top; // Integer
        this.Bottom; // Integer
        this.Height = []; // Integer
    }
    let Undo_ChangeColumnWidth = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Left; // Integer
        this.Right; // Integer
        this.Width = []; // Integer
    }
    let Undo_ChangeLayerName = function () {
        this.Layer; // Integer
        this.caption; // String
        this.Name; // String
    }
    let Undo_SwapLayer = function () {
        this.Layer1; // Integer
        this.Layer2; // Integer
        this.caption; // String
    }
    let Undo_MoveLayer = function () {
        this.OriginLay; // Integer
        this.DestLay; // Integer
        this.caption; // String
    }
    let Undo_deleteLayer = function () {
        this.OriginLay; // Integer
        this.GridData; // Grid_Info
        this.caption; // String
    }
    let Undo_InsertLayer = function () {
        this.Layer; // Integer
        this.caption; // String
    }


let UndoArray=[]; // New ArrayList

    let FixedObjectNameData_Info = function () {
        this.Width; // Integer
        this.Allignment; // Windows.Forms.HorizontalAlignment
    }
    FixedObjectNameData_Info.prototype.Clone = function () {
        let d = new FixedObjectNameData_Info();
        Object.assign(d, this);
        return d;
    }

    let FixedDataItemData_Info = function () {
        this.Height; // Integer
        this.Allignment; // Windows.Forms.HorizontalAlignment
    }
    FixedDataItemData_Info.prototype.Clone = function () {
        let d = new FixedDataItemData_Info();
        Object.assign(d, this);
        return d;
    }

    let FixedUpperLeft_Info = function () {
        this.Text=""; // String
        this.Allignment; // Windows.Forms.HorizontalAlignment
    }
    FixedUpperLeft_Info.prototype.Clone = function () {
        let d = new FixedUpperLeft_Info();
        Object.assign(d, this);
        return d;
    }

    let CellData_Info = function () {
        this.Width; // Integer
        this.Allignment; // Windows.Forms.HorizontalAlignment
    }
    CellData_Info.prototype.Clone = function () {
        let d = new CellData_Info();
        Object.assign(d, this);
        return d;
    }

    let GridTextColor_Info = function () {
        this.Text=""; // String
        this.colorSetF=false; // Boolean
        this.Color = new colorRGBA();; // Color
    }
    GridTextColor_Info.prototype.Clone = function () {
        let d = new GridTextColor_Info();
        Object.assign(d, this);
        d.Color = this.Color.Clone();
        return d;
    }

    let Operation_enable_info = function () {
        this.RightClickEnabled; // Boolean 'グリッド上の右クリックでコピー以外は使えなくする
        this.RightClickAllEnabled; // Boolean '右クリックメニューの使用可否
        this.InputEnabled; // Boolean '入力の可否
        this.GridRowEnabled; // Boolean '行削除・挿入を行わない
        this.GridColEnabled; // Boolean '列削除・挿入を行わない
        this.FixedXSEnabled; // Boolean '左固定領域の変更を行わない
        this.FixedYSEnabled; // Boolean '上固定領域の変更を行わない
        this.FixedUpperLeftEnabeld; // Boolean '左上固定領域の変更を行わない
        this.TABvisible;
        this.TabClickEnabled;
    }
    Operation_enable_info.prototype.Clone = function () {
        let d = new Operation_enable_info();
        Object.assign(d, this);
        return d;
    }

    let Grid_Info = function () {
        this.OriginalLayerNumber; // Integer
        this.Grid_Text = []; // GridTextColor_Info 2次元
        this.FixedObjectName = []; // GridTextColor_Info2次元
        this.FixedDataItem = []; // GridTextColor_Info2次元
        this.FixedUpperLeft = []; // FixedUpperLeft_Info2次元
        this.Ope = new Operation_enable_info();

        this.LayerName; // String
        this.LayerData = []; // Dictionary(Of String, Object)
        this.Ymax; // Integer
        this.Xmax; // Integer
        this.DataItemData = []; // CellData_Info
        this.CellHeight = []; // Integer

        this.FixedDataItemData = []; // FixedDataItemData_Info

        this.FixedDataItemHeight = function () { // Integer
            let H = 0;
            for (let i = 0; i < this.FixedDataItemData.length; i++) {
                H += this.FixedDataItemData[i].Height;
            }
            return H;
        }
        this.FixedObjectNameData = []; // FixedObjectNameData_Info
        this.FixedObjectNameDataWidth = function () { // Integer
            let W = 0;
            for (let i = 0; i < this.FixedObjectNameData.length; i++) {
                W += this.FixedObjectNameData[i].Width;
            }
            return W;
        }
        this.FixedUpperLeftAllignment; // Integer
        this.GridLineCol = new colorRGBA();; // Color
        this.TopCell; // Integer
        this.LeftCell; // Integer
        this.scrollTop;
        this.scrollLeft;
        this.BottomCell; // Integer
        this.RightCell; // Integer
        this.SelectedF; // Boolean
        this.MouseDownX; // Integer
        this.MouseDownY; // Integer
        this.MouseDown_Mode; // Integer '0/通常のセル 1/最上段　2/左端
        this.MouseUpX; // Integer
        this.MouseUpY; // Integer
        this.MouseUpDownRect = function () {  // Rectangle
            return new rectangle(Math.min(this.MouseDownX, this.MouseUpX), Math.max(this.MouseDownX, this.MouseUpX), Math.min(this.MouseDownY, this.MouseUpY),
                Math.max(this.MouseDownY, this.MouseUpY))
        }
    }
    Grid_Info.prototype.Clone = function () {  // Grid_Info
        let CloneGrid = new Grid_Info(); // Grid_Info
        Object.assign(CloneGrid, this);
        CloneGrid.Grid_Text = Generic.Array2Clone(this.Grid_Text);
        CloneGrid.FixedObjectName = Generic.Array2Clone(this.FixedObjectName);
        CloneGrid.FixedDataItem = Generic.Array2Clone(this.FixedDataItem);
        CloneGrid.FixedUpperLeft = Generic.Array2Clone(this.FixedUpperLeft);
        CloneGrid.Ope = this.Ope.Clone();
        CloneGrid.LayerName = this.LayerName
        CloneGrid.LayerData = [];
        for(let key in this.LayerData){
            CloneGrid.LayerData[key] = this.LayerData[key];
        }
        Object.assign(CloneGrid.LayerData, this.LayerData);
        CloneGrid.DataItemData = Generic.ArrayClone(this.DataItemData);
        CloneGrid.CellHeight = Generic.ArrayShallowCopy(this.CellHeight);
        CloneGrid.FixedDataItemData = Generic.ArrayClone(this.FixedDataItemData);
        CloneGrid.FixedObjectNameData = Generic.ArrayClone(this.FixedObjectNameData);
        CloneGrid.GridLineCol = this.GridLineCol.Clone();
        return CloneGrid
    }
    let Grid_Property = [];//; // Grid_Info

    let Grid_Color = function () {
        this.Frame = new colorRGBA();
        this.SelectedFrame = new colorRGBA();
        this.Grid = new colorRGBA();
        this.GridLine = new colorRGBA();
        this.TextBox = new colorRGBA();
        this.SelectedGrid = new colorRGBA();
        this.FixedGrid = new colorRGBA();
        this.SelectedFixedGrid = new colorRGBA();
    }
    let Grid_Total_Info = function () {
        this.initOK; // Boolean
        this.LayerNum; // Integer
        this.Layer; // Integer
        this.FixedDataItem_n; // Integer
        this.FixedDataItem_n2; // Integer
        this.FixedObjectName_n; // Integer
        this.FixedObjectName_n2; // Integer
        this.tOpe = new Operation_enable_info();

        this.RowCaption; // String
        this.ColumnCaption; // String
        this.LayerCaption; // String
        this.DefaultFixedXWidth; // Integer
        this.DefaultFixedXNumberingWidth; // Integer
        this.DefaultGridWidth; // Integer
        this.DefaultFixedYSAllignment; // Windows.Forms.HorizontalAlignment
        this.DefaultFixedXSAllignment; // Windows.Forms.HorizontalAlignment
        this.DefaultFixedUpperLeftAlligntment; // Windows.Forms.HorizontalAlignment
        this.DefaultGridAlligntment; // Windows.Forms.HorizontalAlignment
        this.DefaultNumberingAlligntment; // Windows.Forms.HorizontalAlignment
        this.Color = new Grid_Color();
        this.GridFont; // Font
        this.MsgBoxTitle; // String
        this.GridWidth;
        this.GridHeight;
    }
    let Grid_Total = new Grid_Total_Info();

    let TimerObj;
    let TimerVX;
    let TimerVY;
    let GridMouseDown=false;
    let inClipboard="";
    let Grid_Resize_Info = function () {
        this.Enable; // Integer
        this.GridX; // Integer
        this.GridY; // Integer
        this.LeftX; // Integer
        this.TopY; // Integer
        this.tempImage;
    }
    let GridResize = new Grid_Resize_Info();

    const tabh = 25;
    const tabArrowW = 40;
    const tabw = 100;
    const defoFont="15px '" +  fontName +"'";
    const defoCellHeight = 22;
    const scrollSize=25;
    let GT=Grid_Total;
    GT.initOK = false;
    GT.GridFont = defoFont;
    GT.DefaultFixedXNumberingWidth = 50;
    GT.DefaultFixedXWidth = 150;
    GT.DefaultGridWidth = 100;
    GT.DefaultFixedUpperLeftAlligntment = enmHorizontalAlignment.Left;
    GT.DefaultFixedXSAllignment = enmHorizontalAlignment.Left;
    GT.DefaultFixedYSAllignment = enmHorizontalAlignment.Left;
    GT.DefaultGridAlligntment = enmHorizontalAlignment.Right;
    GT.DefaultNumberingAlligntment = enmHorizontalAlignment.Center;
    let GTC = GT.Color;
    GTC.TextBox = new colorRGBA([250, 250, 250]);
    GTC.GridLine = new colorRGBA([0x80, 0x80, 0x80]);
    GTC.Grid = new colorRGBA([255, 255, 255]);
    GTC.FixedGrid = new colorRGBA([0xAA, 0xFF, 0xAA]);
    GTC.Frame = new colorRGBA([0xCA, 0xCA, 0xCA]);  //上端、左端の固定部分
    GT.MsgBoxTitle = "";

    let GX;
    let GY;
    let touchStartTime;
    let base = Generic.createNewDiv(ParentObj, "", "", "", x, y, width, height, "overflow:hidden", "");
    let tabbase = {};
    let picGrid = Generic.createNewDiv(base, "", "", "", 0, tabh + 1, width - 2, height - tabh-3, "overflow :hidden;border:solid 1px", undefined);
    let vScroll = new scrollBar(base, width - scrollSize-1, tabh+2, scrollSize, height - tabh - scrollSize-2, 0, height - tabh, height - tabh - scrollSize, 100, 10, ScrollChange);
    let hScroll = new scrollBar(base, 1, height - scrollSize-1, scrollSize, width - scrollSize-1, 1, width - 2,width - scrollSize, 200, 20, ScrollChange);
    vScroll.setVisibility(false);
    hScroll.setVisibility(false);
    function ScrollChange() {
        if (txtTextBox.getVisibility() == true) {
            txtTextBox.setVisibility(false);
            Set_Data_from_txtBox_To_Grid();
        }
        let GP = Grid_Property[Grid_Total.Layer];
        GP.scrollTop = vScroll.getPosition();
        GP.scrollLeft = hScroll.getPosition();
        Print_Grid_Data();
    }
    let canvas = Generic.createNewCanvas(picGrid, "", "", 0, 0, width-2, height-2, undefined, "");
    base.addEventListener("contextmenu",contextMenuPrevent);
    canvas.addEventListener("mousedown", mdown, false);
    canvas.addEventListener("touchstart", mdown, {passive:false});
    canvas.addEventListener("touchmove", mmove, {passive:false});
    canvas.addEventListener("mouseup", mup, false);
    canvas.addEventListener("touchend", mup, {passive:false});
    canvas.addEventListener("mouseleave", mleave, false);
    addDocumentEvent();
    let txtTextBox = Generic.createNewTextarea(picGrid, "text", "", 0, 0, 100, 50, "height:25px;width:10px;text-align:right;resize: none;padding:0px;border: 0px solid #ccc;appearance: none");
    
    txtTextBox.onfocus=function(){this.select()};

    let ctx = canvas.getContext("2d");
    ctx.font = defoFont;
    ctx.textBaseline='top';
    Grid_Total.GridWidth = width;
    Grid_Total.GridHeight = height;
    let eventCall;
    tabInit();

    
/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 外部からアクセス可能
*/
    /** init
    //<param name="LayerCaption">タブのキャプション</param>
    //<param name="RowCaption">行のキャプション</param>
    //<param name="ColumnCaption">列のキャプション</param>
    //<param name="FixedXs">左端固定列数</param>
    //<param name="FixedXs2">左端固定列数のうち左側の固定数</param>
    //<param name="FixedYs">状態固定行数</param>
    //<param name="FixedYS2">状態固定行数のうち上側の行数</param>
    //enableOperation:Operation_enable_info{}
 */
    this.init = function (LayerCaption, RowCaption, ColumnCaption, FixedXs, FixedXs2, FixedYs, FixedYS2,enableOperation,_eventCall) {
        Grid_Total.LayerCaption = LayerCaption;
        Grid_Total.RowCaption = RowCaption;
        Grid_Total.ColumnCaption = ColumnCaption;
        Grid_Total.FixedObjectName_n = FixedXs;
        Grid_Total.FixedObjectName_n2 = FixedXs2;
        Grid_Total.FixedDataItem_n = FixedYs;
        Grid_Total.FixedDataItem_n2 = FixedYS2;
        Object.assign(Grid_Total.tOpe, enableOperation);
        Grid_Total.Layer = 0;
        Grid_Total.LayerNum = 0;
        Grid_Total.Color.SelectedFixedGrid = Grid_Total.Color.FixedGrid.getDarkColor();
        Grid_Total.Color.SelectedFrame = Grid_Total.Color.Frame.getDarkColor();
        Grid_Total.Color.SelectedGrid = Grid_Total.Color.Grid.getDarkColor();
        GX = 0
        GY = 0
        UndoArray.length = 0;
        Grid_Property.length = 0;
        eventCall = _eventCall;
    }

    /**サイズ変更 */
    this.changeSize = function (newWidth, newHeight) {
        width = newWidth;
        height = newHeight;
        this.width = width;
        this.height = height;
        base.style.width = width.px();
        base.style.height = height.px();
        picGrid.style.width = (width - 2).px();
        picGrid.style.height = (height - tabh-3).px();
        vScroll.setXY(width - scrollSize - 1, tabh + 2);
        vScroll.setLength(height - tabh - scrollSize - 2)
        vScroll.setAreaRange(height - tabh - scrollSize);
        hScroll.setXY(1, height - scrollSize - 1);
        hScroll.setLength(width - scrollSize-1);
        hScroll.setAreaRange(width - scrollSize);
        Print_Grid_ViewSize();

        let ctx = canvas.getContext("2d");
        ctx.font = defoFont;
        ctx.textBaseline = 'top';
        Grid_Total.GridWidth = width;
        Grid_Total.GridHeight = height;
        tabbase.moveDiv.style.left=(width - tabArrowW * 2).px();
        tabSelect();
        Print_Grid_Data();
    }
    

    /**グリッドを表示 */
    this.show = function () {
        tabbase.frame.setVisibility(Grid_Total.tOpe.TABvisible);
        if (Grid_Total.tOpe.TABvisible) {
            picGrid.style.top = (tabh + 1).px();
            picGrid.style.height = (Grid_Total.GridHeight - tabh - 3).px();
        } else {
            picGrid.style.top = "0px";
            picGrid.style.height = Grid_Total.GridHeight.px();
        }
        picGrid.setVisibility(true);
        txtTextBox.setVisibility(false);
        Grid_Total.Layer = 0;
        Print_Grid_ViewSize();
        Print_Grid_Data();
    }

    /**設定を反映する際に使用 */
    this.refresh=function(){
        tabSelect();
        Print_Grid_Data();
    }

    /**レイヤ追加（メソッド） */
    this.addLayer = function (LayName, LayerNum, Xsize, Ysize, opeEnable = undefined) {
        
        let Ope = new Operation_enable_info();
        if (opeEnable == undefined) {
            Ope = Grid_Total.tOpe;
        } else {
            Object.assign(Ope, opeEnable);
        }
        Insert_Layer(LayName, LayerNum, LayerNum, Xsize, Ysize, Ope);
    }

    /**データ項目追加  */
    this.addDataItem = function (Layer, AddPoint, AddNum) {
        if ((Layer < 0) || (Grid_Total.LayerNum < Layer)) {
            Generic.alert(undefined, "Layerが誤っています。");
            return;
        }
        if (AddPoint < 0) {
            Generic.alert(undefined, "AddPointが誤っています。");
            return;
        }
        if (AddNum < 0) {
            Generic.alert(undefined, "AddNumが誤っています。");
            return;
        }
        let xMaxS = Grid_Property[Layer].Xmax;
        if (xMaxS <= AddPoint) {
            AddPoint = xMaxS;
        }
        InsertColumns(Layer, AddPoint, AddNum);
    }

    /**オブジェクト追加 Layer:レイヤ番号 AddPoint:追加縦行位置 AddNum:追加行数*/
    this.addObject = function (Layer, AddPoint, AddNum) {
        if ((Layer < 0) || (Grid_Total.LayerNum < Layer)) {
            Generic.alert(undefined, "Layerが誤っています。");
            return;
        }
        if (AddPoint < 0) {
            Generic.alert(undefined, "AddPointが誤っています。");
            return;
        }
        if (AddNum < 0) {
            Generic.alert(undefined, "AddNumが誤っています。");
            return;
        }
        let YMaxS = Grid_Property[Layer].Ymax;
        if (YMaxS <= AddPoint) {
            AddPoint = YMaxS;
        }
        InsertRows(Layer, AddPoint, AddNum);
    }
    /** レイヤ削除*/
    this.removeLayer = function (Layer) {
        let mxt = Grid_Total.LayerNum;
        Delete_Layer(Layer);
        tabMake();
        Set_SSTAB_Name();
        let nnt;
        if (Layer == mxt - 1) {
            nnt = Layer - 1;
        } else {
            nnt = Layer;
        }
        Grid_Total.Layer = nnt;
        tabSelect();
        Print_Grid_ViewSize();
        Print_Grid_Data();
    }

    /**オブジェクト削除 Layer:レイヤ番号 RemovePoint:削除する位置 RemoveNum:削除する数*/
    this.removeObject=function(Layer , RemovePoint , RemoveNum ) {
        if((Layer < 0)||(Grid_Total.LayerNum < Layer )){
            Generic.alert(undefined,"Layerが誤っています。");
            return;
        }
        if(RemovePoint < 0 ){
            Generic.alert(undefined,"RemovePointが誤っています。");
            return;
        }
        if(RemoveNum < 0 ){;
            Generic.alert(undefined,"RemoveNumが誤っています。");
            return;
        }
        let YMaxS  = Grid_Property[Layer].Ymax;
        if(YMaxS <= RemovePoint ){
            Generic.alert(undefined,"RemovePointが誤っています。");
            return;
        }else if( YMaxS < RemovePoint + RemoveNum ){
            RemoveNum = YMaxS - RemovePoint;
        }
        DeleteRows(Layer, RemovePoint, RemoveNum);
    }

    /**データ項目削除 */
    this.RemoveDataItem = function (Layer, RemovePoint, RemoveNum) {
        if ((Layer < 0) || (Grid_Total.LayerNum < Layer)) {
            Generic.alert(undefined, "Layerが誤っています。");
            return;
        }
        if (RemovePoint < 0) {
            Generic.alert(undefined, "RemovePointが誤っています。");
            return;
        }
        if (RemoveNum < 0) {
            Generic.alert(undefined, "RemoveNumが誤っています。");
            return;
        }
        let xMaxS = Grid_Property[Layer].Xmax
        if (xMaxS <= RemovePoint) {
            Generic.alert(undefined, "RemovePointが誤っています。");
            return;
        } else if (xMaxS < RemovePoint + RemoveNum) {
            RemoveNum = xMaxS - RemovePoint;
        }
        DeleteColumns(Layer, RemovePoint, RemoveNum);
    }

    /**検索 MatchingMode:マッチング*/
    this.Find = function (FindStr, MatchingMode) {
        let SPL = Grid_Total.Layer;
        let SX, SY;
        let GP = Grid_Property[SPL];
        if (GP.SelectedF == true) {
            SX = GP.MouseDownX
            SY = GP.MouseDownY
            if (SX == -Grid_Total.FixedObjectName_n) {
                SX ++;
            }
            if (SY == -Grid_Total.FixedDataItem_n) {
                SY ++;
            }
        } else {
            SX = -Grid_Total.FixedObjectName_n + 1;
            SY = -Grid_Total.FixedDataItem_n + 1;
        }

        let X = SX;
        let Y = SY;
        let L = SPL;
        let Index = -1;
        do {
            GP = Grid_Property[L];
            Y++;
            if (Y == GP.Ymax) {
                Y = -Grid_Total.FixedDataItem_n + 1;
                X++;
            }
            if (X == GP.Xmax) {
                L++;
                if (L == Grid_Total.LayerNum) {
                    L = 0;
                }
                X = -Grid_Total.FixedObjectName_n + 1;
            }
            let gstr = Get_XYData(L, X, Y);
            if ((gstr != undefined)) {
                switch (MatchingMode) {
                    case enmMatchingMode.PerfectMatching:
                        if (gstr == FindStr) {
                            Index = 0;
                            break;
                        }
                    case enmMatchingMode.PartialtMatching:
                        Index = gstr.indexOf(FindStr);
                        break;
                }
            }
        } while ((Index == -1) && ((SX != X) || (SY != Y) || (SPL != L)))
        if ((SX == X) && (SY == Y) && (SPL == L) && (Index == -1)) {
            Generic.alert(undefined, "見つかりませんでした:" + FindStr);
        } else {
            GP = Grid_Property[L];
            GP.TopCell = Math.max(Y, 0);
            GP.LeftCell = Math.max(X, 0);
            GP.SelectedF = true;
            GP.MouseDownX = X;
            GP.MouseDownY = Y;
            GP.MouseUpX = X;
            GP.MouseUpY = Y;
            if (Grid_Total.Layer != L) {
                Grid_Total.Layer = L;
                tabSelect();
                Print_Grid_ViewSize();
            }
            VScrollGrid_ValueSet();
            HScrollGrid_ValueSet();
            Print_Grid_Data();
        }
    }
    /**逆方向検索 */
    this.FindRev = function (FindStr, MatchingMode) {
        let SPL = Grid_Total.Layer;
        let SX, SY;
        let GP = Grid_Property[SPL];
        if (GP.SelectedF == true) {
            SX = GP.MouseDownX;
            SY = GP.MouseDownY;
            if (SX == -Grid_Total.FixedObjectName_n) {
                SX++;
            }
            if (SY == -Grid_Total.FixedDataItem_n) {
                SY++;
            }
        } else {
            SX = GP.Xmax - 1;
            SY = GP.Ymax - 1;
        }

        let X = SX;
        let Y = SY;
        let L = SPL;
        let Index = -1;
        do {
            GP = Grid_Property[L];
            Y--;
            if (Y == -Grid_Total.FixedDataItem_n) {
                Y = GP.Ymax - 1
                X--;
            }
            if (X == -Grid_Total.FixedObjectName_n) {
                L--;
                if (L == -1) {
                    L = Grid_Total.LayerNum - 1;
                }
                X = Grid_Property[L].Xmax - 1;
                Y = Grid_Property[L].Ymax - 1;
            }
            let gstr = Get_XYData(L, X, Y);
            if (gstr != undefined) {
                switch (MatchingMode) {
                    case enmMatchingMode.PerfectMatching:
                        if (gstr == FindStr) {
                            Index = 0;
                        }
                        break;
                    case enmMatchingMode.PartialtMatching:
                        Index = gstr.indexOf(FindStr);
                        break;
                }
            }
        } while ((Index == -1) && ((SX != X) || (SY != Y) || (SPL != L)))
        if ((SX == X) && (SY == Y) && (SPL == L) && (Index == -1)) {
            Generic.alert(undefined, "見つかりませんでした:" + FindStr);
        } else {
            GP = Grid_Property[L];
            GP.TopCell = Math.max(Y, 0);
            GP.LeftCell = Math.max(X, 0);
            GP.SelectedF = true;
            GP.MouseDownX = X;
            GP.MouseDownY = Y;
            GP.MouseUpX = X;
            GP.MouseUpY = Y;
            if (Grid_Total.Layer != L) {
                Grid_Total.Layer = L;
                tabSelect();
            }
            Print_Grid_Data();
        }
    }

/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ プロパティメソッド**/

    /**内部のコピーデータに設定 */
    this.setCopyText=function(CopyData){
        inClipboard=CopyData;
    }

    /** グリッドの上端固定部分の文字*/
    this.setFixedDataItem = function (LayerNum, X, Y, value) {
        Grid_Property[LayerNum].FixedDataItem[X][Y].Text = value;
    }
    this.getFixedDataItem = function (LayerNum, X, Y) {
        return Grid_Property[LayerNum].FixedDataItem[X][Y].Text;
    }

    /** グリッドの左端固定部分の文字*/
    this.setFixedXSData = function (LayerNum, X, Y, value) {
        Grid_Property[LayerNum].FixedObjectName[X][Y].Text = value;
    }
   /**グリッドの左端固定部分の文字設定取得  XY指定なしの場合は配列で取得*/
   this.getFixedXSData = function (LayerNum, X=undefined, Y=undefined) {
    let GP = Grid_Property[LayerNum];
    if (X != undefined) {
        return GP.FixedObjectName[X][Y].Text;    
    }else{
        let xs = Grid_Total.FixedObjectName_n;
        let ys = GP.Ymax;
        let dt = Generic.Array2Dimension(xs, ys);
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < ys; j++) {
                dt[i][j] = GP.FixedObjectName[i][j].Text;
            }
        }
        return dt;
    }
}
    /**グリッドの中身設定 */
    this.setGridData = function (LayerNum, X, Y, value) {
        Grid_Property[LayerNum].Grid_Text[X][Y].Text = value;
    }
    this.getGridData = function (LayerNum, X, Y) {
        return Grid_Property[LayerNum].Grid_Text[X][Y].Text;
    }
    /**グリッドの左上固定部分設定 */
    this.setFixedUpperLeftData = function (LayerNum, X, Y, value) {
        Grid_Property[LayerNum].FixedUpperLeftData[X][Y].Text = value;
    }
    /**グリッドの左端固定部分の配置設定 */
    this.setFixedXSAllignment= function (LayerNum, X,value) {
        Grid_Property[LayerNum].FixedObjectNameData[X].Allignment=value;
    }
    this.getFixedUpperLeftData = function (LayerNum, X) {
        return Grid_Property[LayerNum].FixedObjectNameData[X].Allignment;
    }
    /**グリッドの左端固定部分の幅設定 */
    this.setFixedXSAllignment= function (LayerNum, X,value) {
        Grid_Property[LayerNum].FixedObjectNameData[X].Width=value;
    }
    this.getFixedUpperLeftData = function (LayerNum, X) {
        return Grid_Property[LayerNum].FixedObjectNameData[X].Width;
    }
    /**document要素のイベントを削除　終了時に呼び出す */
    this.removeEventlister = function () {
        removeEventlister();
    }
    /**document要素のイベントを削除　終了時に呼び出す */
    this.addEventlister = function () {
        addDocumentEvent();
    }

 
    /**現在のレイヤの左端セルの取得 */
    this.getLeftCell = function () {
        return Grid_Property[Grid_Total.Layer].LeftCell;
    }
    /**現在のレイヤの左端セルの設定(refresh必要) */
    this.setLeftCell = function (v) {
        Grid_Property[Grid_Total.Layer].LeftCell = v;
    }
    /**現在のレイヤの上端セルの取得 */
    this.getTopCell = function () {
        return Grid_Property[Grid_Total.Layer].TopCell;
    }
    /**現在のレイヤの上端セルの設定(refresh必要) */
    this.setTopCell = function (v) {
        Grid_Property[Grid_Total.Layer].TopCell = v;
    }
    /**グリッドのフォントの取得 */
    this.getTopCell = function () {
        return Grid_Total.GridFont;
    }
    /**グリッドのフォントの設定ex "15px 'Meiryo UI'";(refresh必要) */
    this.setTopCell = function (v) {
        Grid_Total.GridFont = v;
    }
    /**左端番号列の幅の取得 */
    this.getDefaultFixedXNumberingWidth = function () {
        return Grid_Total.DefaultFixedXWidth;
    }
    /**左端番号列の幅の設定(refresh必要) */
    this.setDefaultFixedXNumberingWidth = function (v) {
        Grid_Total.DefaultFixedXWidth = v;
    }
    /**左端固定列の幅の取得 */
    this.getDefaultFixedXWidth = function () {
        return Grid_Total.DefaultGridWidth;
    }
    /**左端固定列の幅の設定(refresh必要) */
    this.setDefaultFixedXWidth = function (v) {
        Grid_Total.DefaultGridWidth = v;
    }
    /**左上端固定列のアライメント取得 */
    this.getDefaultFixedUpperLeftAlligntment = function () {
        return Grid_Total.DefaultFixedUpperLeftAlligntment;
    }
    /**左上端固定列のアライメント(refresh必要) */
    this.setDefaultFixedUpperLeftAlligntment = function (v) {
        Grid_Total.DefaultFixedUpperLeftAlligntment = v;
    }
    /**上端固定列のアライメント取得 */
    this.getDefaultFixedYSAllignment = function () {
        return Grid_Total.DefaultFixedYSAllignment;
    }
    /**上端固定列のアライメント(refresh必要) */
    this.setDefaultFixedYSAllignment = function (v) {
        Grid_Total.DefaultFixedYSAllignment = v;
    }
    /**左端固定列のアライメント取得 */
    this.getDefaultFixedXSAllignment = function () {
        return Grid_Total.DefaultFixedXSAllignment;
    }
    /**左端固定列のアライメント(refresh必要) */
    this.setDefaultFixedXSAllignment = function (v) {
        Grid_Total.DefaultFixedXSAllignment = v;
    }
       /**グリッドのアライメント取得 */
       this.getDefaultGridAlligntment = function () {
        return Grid_Total.DefaultGridAlligntment;
    }
    /**グリッドのアライメント(refresh必要) */
    this.setDefaultGridAlligntment = function (v) {
        Grid_Total.DefaultGridAlligntment = v;
    }
    /**グリッドの選択範囲を取得 */
    this.getSelectedArea = function (LayerNum) {
        let R = Grid_Property[LayerNum].MouseUpDownRect;
        if (Grid_Property[LayerNum].SelectedF == false) {
            R.Height = -1;
            R.Width = -1;
            R.X = 0;
            R.Y = 0;
        } else {
            R.Height++;
            R.Width++;
        }
        return R;
    }
    /**グリッドの横セル数取得 */
    this.getXsize = function (LayerNum) {
        return Grid_Property[LayerNum].Xmax;
    }
    /**グリッドの横セル数設定 */
    this.setXsize = function (LayerNum, value) {
        let xmax = Grid_Property[LayerNum].Xmax;
        if (value == xmax) {
            return;
        } else if (value > xmax) {
            InsertColumns(LayerNum, xmax, value - xmax);
        } else {
            DeleteColumns(LayerNum, value, xmax - value);
        }
    }
    /**グリッドの縦セル数取得 */
    this.getYsize = function (LayerNum) {
        return Grid_Property[LayerNum].Ymax;
    }
    /**グリッドの縦セル数設定 */
    this.setYsize = function (LayerNum, value) {
        let ymax = Grid_Property[LayerNum].Ymax;
        if (value == ymax) {
            return;
        } else if (value > ymax) {
            InsertRows(LayerNum, ymax, value - ymax);
        } else {
            DeleteRows(LayerNum, value, ymax - value);
        }
    }
    /**上固定部分の行数 */
    this.getFixedYsNum = function () {
        return Grid_Total.FixedDataItem_n;
    }

    /**上固定部分二段目の行数 */
    this.getFixedYsNum2 = function () {
        return Grid_Total.FixedDataItem_n2;
    }

    /** 左固定部分の行数 */
    this.getFixedXsNum = function () {
        return Grid_Total.FixedObjectName_n;
    }

    /**左固定部分二段の行数 */
    this.getFixedXsNum2 = function () {
        return Grid_Total.FixedObjectName_n2;
    }

    /**グリッドの位置を指定して表示 */
    this.SetGridPosition = function (LayerNum, LeftCell, TopCell) {
        let GP = Grid_Property[LayerNum];
        GP.TopCell = Math.max(TopCell, 0);
        GP.LeftCell = Math.max(LeftCell, 0);
        GP.SelectedF = true;
        GP.MouseDownX = LeftCell;
        GP.MouseDownY = TopCell;
        GP.MouseUpX = LeftCell;
        GP.MouseUpY = TopCell;
        if (Grid_Total.Layer != LayerNum) {
            Grid_Total.Layer = LayerNum;
            tabSelect();
        }
        Print_Grid_Data();
    }

    /**グリッドのデータを配列取得／取得のみ */
    this.getLayerGridData = function (LayerNum) {
        let GP = Grid_Property[LayerNum];
        let xs = GP.Xmax;
        let ys = GP.Ymax;
        let D = Generic.Array2Dimension(xs, ys);
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < ys; j++) {
                D[i][j] = GP.Grid_Text[i][j].Text;
            }
        }
        return D;
    }

    /**グリッドの文字設定取得（セル単位）：実行時のみ */
    this.getGridData = function (LayerNum, X, Y) {
        let GP = Grid_Property[LayerNum];
        return GP.Grid_Text[X][Y].Text;
    }
    /** */
    this.setGridData = function (LayerNum, X, Y, value) {
        let GP = Grid_Property[LayerNum];
        GP.Grid_Text[X][Y].Text = value;
    }

    /**グリッドの左上固定部分を配列取得 */
    this.getFixedUpperLeftData = function (LayerNum) {
        let GP = Grid_Property[LayerNum];
        let xs = Grid_Total.FixedObjectName_n;
        let ys = Grid_Total.FixedDataItem_n;
        let dt = Generic.Array2Dimension(xs, ys);
        for (let i = 0; i <= xs; i++) {
            for (let j = 0; j <= ys; j++) {
                dt[i][j] = GP.FixedUpperLeft[i][j].Text;
            }
        }
        return dt;
    }

 

    /** */
    this.set = function (value) {
        let GP = Grid_Property[LayerNum];
        GP.FixedObjectName[X][Y].Text = value;
    }
    /** グリッドの左端固定部分の個別色設定*/
    this.getFixedXSColor = function (Layernum, X, Y) {
        if (Grid_Property[Layernum].FixedObjectName[X][Y].colorSetF == true) {
            return Grid_Property[Layernum].FixedObjectName[X][Y].Color
        } else {
            if (X < Grid_Total.FixedObjectName_n2) {
                return Grid_Total.Color.Frame;
            } else {
                return Grid_Total.Color.FixedGrid;
            }
        }
    }
    /** */

    this.setFixedXSColor = function (Layernum, X, Y,value) {
        Grid_Property[Layernum].FixedObjectName[X][Y].colorSetF = true;
        Grid_Property[Layernum].FixedObjectName[X][Y].Color = value;
    }
    /**レイヤのグリッドの左端固定部分の色設定をすべてクリア */
    this.FixedAllXSColorReset = function (LayerNum) {
        let GP = Grid_Property[LayerNum];
        for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
            for (let j = 0; j < GP.Ymax; j++) {
                GP.FixedObjectName[i][j].colorSetF = false;
            }
        }
        Print_Grid_Data();
    }

    /**グリッドの左端固定部分の色設定クリア */
    this.FixedXSColorReset = function (Layernum, X, Y) {
        Grid_Property[Layernum].FixedObjectName[X][Y].colorSetF = false;
    }

    /**グリッドの上端固定部分の文字設定取得 XY指定なしの場合は配列で取得*/
    this.getFixedYSData = function (LayerNum, X=undefined, Y=undefined) {
        let GP = Grid_Property[LayerNum];
        if (X != undefined) {
            return GP.FixedDataItem[X][Y].Text;
        } else {
            let xs = GP.Xmax;
            let ys = Grid_Total.FixedDataItem_n;
            let dt = Generic.Array2Dimension(xs, ys);
            for (let i = 0; i < xs; i++) {
                for (let j = 0; j < ys; j++) {
                    dt[i][j] = GP.FixedDataItem[i][j].Text;
                }
            }
            return dt;
        }
    }

    this.setFixedYSData = function (LayerNum, X, Y,value) {
        let GP = Grid_Property[LayerNum];
        GP.FixedDataItem[X][Y].Text = value;
    }

    /**グリッドの上端固定部分の個別色設定 */
    this.getFixedYSColor = function (Layernum, X, Y) {
        if (Grid_Property[Layernum].FixedDataItem[X][Y].colorSetF == true) {
            return Grid_Property[Layernum].Grid_Text[X][Y].Color;
        } else {
            if (Y < Grid_Total.FixedDataItem_n2) {
                return Grid_Total.Color.Frame;
            } else {
                return Grid_Total.Color.FixedGrid;
            }
        }
    }
    this.setFixedYSColor = function (Layernum, X, Y,value) {
        Grid_Property[Layernum].FixedDataItem[X][Y].colorSetF = true;
        Grid_Property[Layernum].FixedDataItem[X][Y].Color = value;
    }
    /**レイヤのグリッドの上端固定部分の色設定をすべてクリア */
    this.FixedAllYSColorReset = function (LayerNum) {
        let GP = Grid_Property[LayerNum];
        for (let i = 0; i < Grid_Total.FixedDataItem_n; i++) {
            for (let j = 0; j < GP.Ymax ; j++) {
                GP.FixedDataItem[i][j].colorSetF = false;
            }
        }
        Print_Grid_Data();
    }
    /**グリッドの上端固定部分の色設定クリア */
    this.FixedYSColorReset = function (Layernum, X, Y) {
        Grid_Property[Layernum].FixedDataItem[X][Y].colorSetF = false
    }


    /**グリッド上端固定部分の文字設定 */
    this.getFixedUpperLeftData = function (LayerNum, X, Y) {
        return Grid_Property[LayerNum].FixedUpperLeft[X][Y].Text;
    }
    this.setFixedUpperLeftData = function (LayerNum, X, Y, value) {
        Grid_Property[LayerNum].FixedUpperLeft[X][Y].Text = value;
    }

    /** グリッドの高さ設定 */
    this.getGridHeight = function (LayerNum, Y) {
        return Grid_Property[LayerNum].CellHeight[Y]
    }
    this.setGridHeight = function (LayerNum,Y, value) {
        Grid_Property[LayerNum].CellHeight[Y] = value;
    }


    /** グリッドの幅設定 */
    this.getGridWidth = function (LayerNum, X) {
        return Grid_Property[LayerNum].DataItemData[X].Width;
    }
    this.set = function (LayerNum, X, value) {
        Grid_Property[LayerNum].DataItemData[X].Width = value;
    }

    /** グリッドの配置設定 */
    this.getGridAlligntment = function (LayerNum, X) {
        return Grid_Property[LayerNum].DataItemData[X].Allignment
    }
    this.setGridAlligntment = function (LayerNum, X, value) {
        Grid_Property[LayerNum].DataItemData[X].Allignment = value;
    }


    /** グリッドの左上固定部分の配置設定 */
    this.getFixedUpperLeftAlligntment = function (LayerNum) {
        return Grid_Property[LayerNum].FixedUpperLeftAllignment
    }
    this.setFixedUpperLeftAlligntment = function (LayerNum, value) {
        Grid_Property[LayerNum].FixedUpperLeftAllignment = value;
    }


    /** グリッドの左端固定部分の配置設定 */
    this.getFixedXSAllignment = function (LayerNum, n) {
        return Grid_Property[LayerNum].FixedObjectNameData[n].Allignment
    }
    this.setFixedXSAllignment = function (LayerNum, n, value) {
        Grid_Property[LayerNum].FixedObjectNameData[n].Allignment = value;
    }

    /** グリッドの左端固定部分の幅設定 */
    this.getFixedXSWidth = function (LayerNum, n) {
        return Grid_Property[LayerNum].FixedObjectNameData[n].Width
    }
    this.setFixedXSWidth = function (LayerNum, n, value) {
        Grid_Property[LayerNum].FixedObjectNameData[n].Width = value;
    }

    /** 上部固定部分の行ごとの配置設定 */
    this.getFixedYSAllignment = function (LayerNum, n) {
        return Grid_Property[LayerNum].FixedDataItemData[n].Allignment
    }
    this.setFixedYSAllignment = function (LayerNum, n, value) {
        Grid_Property[LayerNum].FixedDataItemData[n].Allignment = value;
    }

    /** 上部固定部分の行ごとの高さ設定 */
    this.getFixedYSHeight = function (LayerNum, n) {
        return Grid_Property[LayerNum].FixedDataItemData[n].Height
    }
    this.setFixedYSHeight = function (LayerNum, n, value) {
        Grid_Property[LayerNum].FixedDataItemData[n].Height = value;
    }

    /** レイヤの最大数を取得：実行時・取得のみ */
    this.getLayerMax = function () {
        return Grid_Total.LayerNum;
    }


    /** レイヤタグを取得：：実行時・取得のみ　設定はAddLayerメソッド */
    this.getLayerData = function (LayerNum, key) {
        return Grid_Property[LayerNum].LayerData[key];
    }
    this.setLayerData = function (LayerNum, key, value) {
        Grid_Property[LayerNum].LayerData[key] = value;
    }

    /**現在のレイヤを取得：実行時 */
    this.getLayer = function () {
        return Grid_Total.Layer;
    }
    this.setLayer = function (value) {
        Grid_Total.Layer = value;
    }

    /**レイヤ名を取得・設定 */
    this.getLayerName = function (LayerNum) {
        return Grid_Property[LayerNum].LayerName;
    }
    this.setLayerName = function (LayerNum, value) {
        Grid_Property[LayerNum].LayerName = value;
        Set_SSTAB_Name();
    }

    /** タブをクリックしてレイヤメニューが出るかどうか */
    this.getTabClickEnabled = function () {
        return Grid_Total.TabClickEnabled
    }
    this.setTabClickEnabled = function (value) {
        Grid_Total.TabClickEnabled = value;
    }

    /**セルの既定色設定 */
    this.getTotalGridColor = function () {
        return Grid_Total.Color.Grid;
    }
    this.setTotalGridColor = function (value) {
        Grid_Total.Color.Grid = value;
    }

    /** セルの個別色設定 */
    this.getGridColor = function (LayerNum, X, Y) {
        if (Grid_Property[LayerNum].Grid_Text[X][Y].colorSetF == false) {
            return Grid_Total.Color.Grid;
        } else {
            return Grid_Property[LayerNum].Grid_Text[X][Y].Color;
        }
    }
    this.setGridColor = function (LayerNum, X, Y,value) {
        Grid_Property[LayerNum].Grid_Text[X][Y].colorSetF = true;
        Grid_Property[LayerNum].Grid_Text[X][Y].Color = value;
    }

    /** レイヤのグリッドの色設定をすべてクリア */
    this.GridColorReset = function (LayerNum) {
        let GP = Grid_Property[LayerNum];
        for (let i = 0; i <= GP.Xmax; i++) {
            for (let j = 0; j < GP.Ymax; j++) {
                GP.Grid_Text[i][j].colorSetF = false;
            }
        }
        Print_Grid_Data();
    }

    /** グリッドの色設定クリア */
    this.getGridColorReset = function (LayerNum, X, Y) {
        Grid_Property[LayerNum].Grid_Text[X][Y].colorSetF = false;
    }

    /**固定部分の色設定 */
    this.getFixedGridColor = function () {
        return Grid_Total.Color.FixedGrid;
    }
    this.setFixedGridColor = function (value) {
        Grid_Total.Color.FixedGrid = value;
    }

    /**セル境界線色設定 */
    this.getGridLineColor = function () {
        return Grid_Total.Color.GridLine;
    }
    this.setGridLineColor = function (value) {
        Grid_Total.Color.GridLine = value;
    }
    /**枠部分色設定 */
    this.getFrameColor = function () {
        return Grid_Total.Color.Frame;
    }
    this.set = function (value) {
        Grid_Total.Color.Frame = value;
    }
    /**行のキャプション */
    this.getRowCaption = function () {
        return Grid_Total.RowCaption;
    }
    this.setRowCaption = function (value) {
        Grid_Total.RowCaption = value;
    }
    /**列のキャプション */
    this.getColumnCaption = function () {
        return Grid_Total.ColumnCaption;
    }
    /**レイヤ行キャプション */
    this.getLayerCaption = function () {
        return Grid_Total.LayerCaption;
    }
    this.setLayerCaption = function (value) {
        Grid_Total.LayerCaption = value;
    }
/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 内部関数*/
    /**グリッドを表示 */
    function Print_Grid_Data() {

        let picW = picGrid.clientWidth;
        let picH = picGrid.clientHeight;
        if ((picW == 0) || (picH == 0)) {
            return;
        }

        let GP = Grid_Property[Grid_Total.Layer];
        let xs = GP.Xmax;
        let ys = GP.Ymax;
        let topPixcel = vScroll.getPosition();
        let leftPixcel = hScroll.getPosition();
        ctx.clearRect(0,0,picW,picH);

        let tpx=0;
        let TopCell=0;
        do{
            tpx+= GP.CellHeight[TopCell];
             TopCell++;
        }while ((tpx < topPixcel) && (TopCell< ys))
        TopCell--;
        GP.TopCell = TopCell;

        let LeftCell=0;
        let lpx=0;
        do{
            lpx += GP.DataItemData[LeftCell].Width;
            LeftCell++;
        }while ((lpx < leftPixcel) && (LeftCell < xs))
        LeftCell--;
        GP.LeftCell = LeftCell;

        let txtF = txtTextBox.getVisibility();

        let MBX1 = Math.min(GP.MouseDownX, GP.MouseUpX);
        let MBX2 = Math.max(GP.MouseDownX, GP.MouseUpX);
        let MBY1 = Math.min(GP.MouseDownY, GP.MouseUpY);
        let MBY2 = Math.max(GP.MouseDownY, GP.MouseUpY);


        let font = Grid_Total.GridFont;

        let Y = GP.FixedDataItemHeight();
        let j = GP.TopCell;
        do {
            let X = GP.FixedObjectNameDataWidth();
            let i = GP.LeftCell;
            let bkCol;
            if (j == ys - 1) {//一番下の行は折り返しが見えないようにクリップ
                ctx.save();
                ctx.rect(0,Y,picW,GP.CellHeight[j]+1);
                ctx.clip();
            }
            do {
                if (GP.Grid_Text[i][j].colorSetF == false) {
                    bkCol = Grid_Total.Color.Grid.Clone();
                } else {
                    bkCol = GP.Grid_Text[i][j].Color.Clone();
                }
                if (GP.SelectedF == true) {
                    if (((MBX1 <= i) && (i <= MBX2)) && ((MBY1 <= j) && (j <= MBY2))) {
                        bkCol = Grid_Total.Color.SelectedGrid.Clone();
                    }
                }
                let ptx=GP.Grid_Text[i][j].Text;
                if(ptx=='undefined'){
                    ptx="";
                }
               Print_Data(ptx, GP.DataItemData[i].Allignment, X, Y, GP.DataItemData[i].Width, GP.CellHeight[j], GP.GridLineCol, bkCol, 0, font);
                X += GP.DataItemData[i].Width;
                i++;
            } while ((X < picW) && (i < xs))
            //オブジェクト名
            X = 0;
            for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
                if (GP.FixedObjectName[i][j].colorSetF == true) {
                    bkCol = GP.FixedObjectName[i][j].Color.Clone();
                } else {
                    if (i < Grid_Total.FixedObjectName_n2) {
                        bkCol = Grid_Total.Color.Frame;
                    } else {
                        bkCol = Grid_Total.Color.FixedGrid;
                    }
                }
                if (GP.SelectedF == true) {
                    if ((MBY1 <= j) && (j <= MBY2)) {
                        if ((MBX1 <= -(Grid_Total.FixedObjectName_n - i)) && (-(Grid_Total.FixedObjectName_n - i) <= MBX2)) {
                            bkCol = bkCol.getDarkColor();
                        } else {
                            if (i < Grid_Total.FixedObjectName_n2) {
                                bkCol = bkCol.getDarkColor();
                            }
                        }
                    }
                }
                Print_Data(GP.FixedObjectName[i][j].Text, GP.FixedObjectNameData[i].Allignment, X, Y, GP.FixedObjectNameData[i].Width, GP.CellHeight[j], GP.GridLineCol, bkCol, 1, font);

                X += GP.FixedObjectNameData[i].Width;
            }
            if (j == ys - 1) {
                ctx.restore();
            }
            Y += GP.CellHeight[j];
            j++;
            
        } while ((Y < picH) && (j < ys))
        if (Y >= picH) {
            GP.BottomCell = j - 2;
        } else {
            GP.BottomCell = j - 1;
        }
        
        //データ項目
        ctx.save();//データ項目が下にはみ出さないようにクリップ
        ctx.rect(0,0, picW, GP.FixedDataItemHeight());
        ctx.clip()
        let X = GP.FixedObjectNameDataWidth();
        let i = GP.LeftCell;
        do {
            let Y = 0;
            for (let j = 0; j < Grid_Total.FixedDataItem_n; j++) {
                let bkCol;
                if (GP.FixedDataItem[i][j].colorSetF == true) {
                    bkCol = GP.FixedDataItem[i][j].Color.Clone();
                } else {
                    if (j < Grid_Total.FixedDataItem_n2) {
                        bkCol = Grid_Total.Color.Frame.Clone();
                    } else {
                        bkCol = Grid_Total.Color.FixedGrid.Clone();
                    }
                }

                if (GP.SelectedF == true) {
                    if ((MBX1 <= i) && (i <= MBX2)) {
                        if ((MBY1 <= -(Grid_Total.FixedDataItem_n - j)) && (-(Grid_Total.FixedDataItem_n - j) <= MBY2)) {
                            bkCol = bkCol.getDarkColor();
                        } else {
                            if (j < Grid_Total.FixedDataItem_n2) {
                                bkCol = bkCol.getDarkColor();
                            }
                        }
                    }
                }
                Print_Data(GP.FixedDataItem[i][j].Text, GP.FixedDataItemData[j].Allignment, X, Y, GP.DataItemData[i].Width, GP.FixedDataItemData[j].Height, GP.GridLineCol, bkCol, 0, font);
                Y += GP.FixedDataItemData[j].Height;
            }
            X += GP.DataItemData[i].Width;
            i++; 1
        } while ((X < picW) && (i < xs))
        if (X >= picW) {
            if (GP.Xmax == 1) {
                GP.RightCell = 0;
            } else {
                GP.RightCell = i - 2;
            }
        } else {
            GP.RightCell = i - 1;
        }

        //左上固定部分
         X = 0;
        for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
            let Y = 0
            for (let j = 0; j < Grid_Total.FixedDataItem_n; j++) {
                let bkCol;
                if ((i < Grid_Total.FixedObjectName_n2) || (j < Grid_Total.FixedDataItem_n2)) {
                    bkCol = Grid_Total.Color.Frame.Clone();
                } else {
                    bkCol = Grid_Total.Color.FixedGrid.Clone();
                }
                if (GP.SelectedF == true) {
                    let dkf = false;
                    if (((MBX1 <= -(Grid_Total.FixedObjectName_n - i)) && (-(Grid_Total.FixedObjectName_n - i) <= MBX2)
                    ) && ((MBY1 <= -(Grid_Total.FixedDataItem_n - j)) && (-(Grid_Total.FixedDataItem_n - j) <= MBY2))) {
                        dkf = true;
                    }
                    if ((MBX1 <= -(Grid_Total.FixedObjectName_n - i)) && (-(Grid_Total.FixedObjectName_n - i) <= MBX2)) {
                        if (j < Grid_Total.FixedDataItem_n2) {
                            dkf = true;
                        }
                    }
                    if ((MBY1 <= -(Grid_Total.FixedDataItem_n - j)) && (-(Grid_Total.FixedDataItem_n - j) <= MBY2)) {
                        if (i < Grid_Total.FixedObjectName_n2) {
                            dkf = true;
                        }
                    }
                    if (dkf == true) {
                        bkCol = bkCol.getDarkColor();
                    }
                }
                Print_Data(GP.FixedUpperLeft[i][j].Text, GP.FixedUpperLeftAllignment, X, Y, GP.FixedObjectNameData[i].Width, GP.FixedDataItemData[j].Height, GP.GridLineCol, bkCol, 0, font)
                Y += GP.FixedDataItemData[j].Height;
            }
            X += GP.FixedObjectNameData[i].Width;
        }
        ctx.restore();
        if (txtF == true) {
            if ((GP.MouseDownX > GP.RightCell) || (GP.MouseDownX < GP.LeftCell) || (GP.MouseDownY > GP.BottomCell) || (GP.MouseDownY < GP.TopCell)) {
            } else {
                txtTextBox.setVisibility(true);
                SetTextBox(GP.MouseDownX, GP.MouseDownY);
            }
        }
    }

    /**テキストボックスの文字をグリッドにセットする */
    function Set_Data_from_txtBox_To_Grid(){
        let tx  = Get_Data_from_Grid(Grid_Total.Layer, GX, GY);
        let newTx  = txtTextBox.value;
        if (tx != newTx ){
            SetUndo_Input(GX, GY, newTx + "の入力");
            Set_Data_To_Grid(Grid_Total.Layer, GX, GY, newTx, true);
            Check_ChangeEvent(GX, GY);
        }
    }

    /** 指定された位置のグリッド配列のデータを取得する*/
    function Get_Data_from_Grid(Grid_Lay, X, Y) {
        let tx;
        let GP = Grid_Property[Grid_Lay];
        if ((X < 0) && (Y < 0)) {
            tx = GP.FixedUpperLeft[X + Grid_Total.FixedObjectName_n][Y + Grid_Total.FixedDataItem_n].Text;
        } else if (X < 0) {
            tx = GP.FixedObjectName[X + Grid_Total.FixedObjectName_n][Y].Text;
        } else if (Y < 0) {
            tx = GP.FixedDataItem[X][Y + Grid_Total.FixedDataItem_n].Text;
        } else {
            tx = GP.Grid_Text[X][Y].Text;
        }
        if (tx == undefined) {
            tx = "";
        }
        return tx
}

function Grid_Clear(Caption ){
    let GP = Grid_Property[Grid_Total.Layer];
    if (GP.SelectedF == false) {
        return;
    }
    let rect = GP.MouseUpDownRect();
    let r1 = Math.max(-Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2, rect.left)
    let r2 = rect.right;
    let c1 = Math.max(-Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2, rect.top)
    let c2 = rect.bottom;
    
    SetUndo_CopyPasteCutClear(Caption);
    for (let i = r1; i <= r2; i++) {
        for (let j = c1; j <= c2; j++) {
            Set_Data_To_Grid(Grid_Total.Layer, i, j, "", true);
        }
    }
    Print_Grid_Data()
    Check_ChangeEventRange(r1, c1, r2 - r1 + 1, c2 - c1 + 1);
}

    /**テキストボックス、コンボボックスを指定した位置のセルのサイズに合わせる */
    function Get_Object_to_Cell_Size(X, Y, Obj) {
        let w, H;
        let n;
        let GP = Grid_Property[Grid_Total.Layer];
        let lef =0;
        let tp = 0;
        if (X < 0) {
            n = X + Grid_Total.FixedObjectName_n
            for (let i = 0; i < n ; i++) {
                lef += GP.FixedObjectNameData[i].Width;
            }
            w = GP.FixedObjectNameData[n].Width;
        } else {
            lef += GP.FixedObjectNameDataWidth();
            for (let i = GP.LeftCell; i < X; i++) {
                lef += GP.DataItemData[i].Width;
            }
            w = GP.DataItemData[X].Width;
        }
        if (Y < 0) {
            n = Y + Grid_Total.FixedDataItem_n;
            for (let i = 0; i < n; i++) {
                tp += GP.FixedDataItemData[i].Height;
            }
            H = GP.FixedDataItemData[n].Height;
        } else {
            tp += GP.FixedDataItemHeight();
            for (let i = GP.TopCell; i < Y; i++) {
                tp += GP.CellHeight[i];
            }
            H = GP.CellHeight[Y];
        }
        Obj.style.width = (w - 1).px();
        Obj.style.left = (lef + 1).px();
        Obj.style.height = (H - 1).px();
        Obj.style.top = (tp + 1).px();
    }

    function SetTextBox(X, Y) {
        let AL, n;
        Get_Object_to_Cell_Size(X, Y, txtTextBox);
        let GP = Grid_Property[Grid_Total.Layer];
        if (X < 0) {
            n = X + Grid_Total.FixedObjectName_n;
            AL = GP.FixedObjectNameData[n].Allignment;
        } else {
            AL = GP.DataItemData[X].Allignment;
        }

        let tx = Get_Data_from_Grid(Grid_Total.Layer, X, Y);
        let als = "";
        switch (AL) {
            case -1:
                als = "left";
                break;
            case 1:
                als = "right";
                break;
            case 0:
                als = "center";
                break;
        }
        txtTextBox.style.textAlign = als;
        txtTextBox.value = tx;
        txtTextBox.setVisibility(true);
        txtTextBox.focus();
        txtTextBox.select();
    }

    function Print_Data(STT, Allignment, X, Y, CellW, CellHeight, BorderColor, Fillcolor, BorderWidth, font) {
        if(STT==undefined){return;}
        let ST=STT.toString();
        ctx.fillStyle = Fillcolor.toRGBA();
        ctx.strokeStyle = BorderColor.toRGBA();
        ctx.lineWidth = 0.3;
        ctx.fillRect(X, Y, CellW, CellHeight);
        ctx.strokeRect(X, Y, CellW + 1, CellHeight + 1);

        let mes = ctx.measureText(ST);
        let S_Size = new size(mes.width, mes.actualBoundingBoxAscent + mes.actualBoundingBoxDescent);
        let txtw = (S_Size.width);
        let txth = (S_Size.height);
        if ((txtw >= CellW - 4) && (Allignment == enmHorizontalAlignment.Center)) {
            Allignment = enmHorizontalAlignment.Left;
        }
        ctx.fillStyle = 'rgba(0, 0, 0)';
        switch (Allignment) {
            case enmHorizontalAlignment.Left: { //左詰
                let STP = ST.split('\n');
                if ((txtw <= CellW - 4) && (STP.length == 1)) {
                    ctx.fillText(ST, X + 2, Y + 2);
                } else {
                    let H = 0;
                    do {
                        let i = 1;
                        let tw;
                        let ST2 ;
                        do {
                            ST2 = ST.left(i);
                            tw = ctx.measureText(ST2).width;
                            i++;
                        } while ((tw < CellW - 4) && (i <= ST.length) && (ST.mid(i - 1, ST.length) != '\n'))
                        if (tw >= CellW - 4) {
                            i--;
                        }
                        ST2 = ST.left(i - 1);
                        ctx.fillText(ST2, X + 2, Y + H + 2);
                        if (ST.mid(i, ST.length) != '\n') {
                            ST = ST.mid(i - 1, ST.length)
                        } else {
                            ST = ST.mid(i, ST.length)
                        }
                        H += txth;
                    } while ((H < CellHeight - 4) && (ST != ""))
                }
                break;
            }
            case enmHorizontalAlignment.Center:
                ctx.fillText(ST, X + CellW / 2 - txtw / 2, Y + 2);
                break;
            case enmHorizontalAlignment.Right: {
                if (txtw < CellW - 4) {
                    ctx.fillText(ST, X + CellW - 2 - txtw, Y + 2);
                } else {
                    let i = 1;
                    let tw;
                    let ST2 ;
                    do {
                        ST2 = ST.right(i);
                        tw = ctx.measureText(ST2).width;
                        i++;
                    } while (tw < CellW -8)
                    ST2 = ST.right(i - 1);
                    tw = ctx.measureText(ST2).width;
                    ctx.fillText(ST2, X + CellW - tw, Y + 2);
                }
                break;
            }
        }
      //  ctx.restore();
    }

    /**全体のサイズを求める */
    function Print_Grid_ViewSize() {
        if (Grid_Total.LayerNum == 0) {
            vScroll.setVisibility(false);
            hScroll.setVisibility(false);
            return;
        }
        let GP = Grid_Property[Grid_Total.Layer];
        let xs = GP.Xmax;
        let ys = GP.Ymax;

        let w = GP.FixedObjectNameDataWidth();
        for (let i = 0; i < xs; i++) {
            w += GP.DataItemData[i].Width;
        }
        w += GP.DataItemData[xs - 1].Width;
        let h = GP.FixedDataItemHeight();
        for (let i = 0; i < ys; i++) {
            h += GP.CellHeight[i];
        }
       h += GP.CellHeight[ys - 1] ;
        if ((w > width - 2) && (h > height - tabh - 2)) {
            canvas.width = width - scrollSize - 2;
            canvas.height = height - tabh - 2 - scrollSize;
            hScroll.setVisibility(true);
            vScroll.setVisibility(true);
        } else if (w > width - 2) {
            canvas.width = width - 2;
            canvas.height = height - tabh - scrollSize - 2;
            vScroll.setVisibility(false);
            hScroll.setVisibility(true);
        } else if (h > height - tabh - 2) {
            canvas.width = width - scrollSize - 2;
            canvas.height = height - tabh - 2;
            vScroll.setVisibility(true);
            hScroll.setVisibility(false);
        } else {
            canvas.height = height - tabh - 2;
            canvas.width = width - 2;
            hScroll.setVisibility(false);
            vScroll.setVisibility(false);
        }
        ctx = canvas.getContext("2d");
        ctx.font = defoFont;
        ctx.textBaseline = 'top';
        vScroll.setMaxValue(h);
        hScroll.setMaxValue(w);
    }

    /**レイヤ追加（内部） */
    function Insert_Layer(LayName, lay, OriginalLayerNumber, xs, ys, OperationEnable) {
        Grid_Total.LayerNum++;
        tabMake();
        if (Grid_Total.LayerNum != 1) {
            for (let i = Grid_Total.LayerNum - 1; i >= lay + 1; i--) {
                Grid_Property[i] = Grid_Property[i - 1].Clone();
            }
        }
        let GP = new Grid_Info(); 
        GP.OriginalLayerNumber = OriginalLayerNumber;
        GP.Grid_Text = Generic.Array2Dimension(xs, ys, "");
        GP.FixedObjectName = Generic.Array2Dimension(Grid_Total.FixedObjectName_n, ys, "")
        GP.FixedDataItem = Generic.Array2Dimension(xs, Grid_Total.FixedDataItem_n, "")
        GP.FixedUpperLeft = Generic.Array2Dimension(Grid_Total.FixedObjectName_n, Grid_Total.FixedDataItem_n, "")

        GP.Ope = OperationEnable;
        GP.LayerName = LayName;
        GP.LayerData = [];

        GP.Xmax = xs
        GP.Ymax = ys
        GP.CellHeight = [];
        Grid_Property[lay]=GP;

        Set_SSTAB_Name();
        if ((Grid_Total.Layer >= lay) && (Grid_Total.LayerNum > 1)) {
            Grid_Total.Layer++;
            tabbase.selectedIndex = Grid_Total.Layer;
        }
        tabSelect();
        Init_Grid(lay);
    }

    function Set_SSTAB_Name() {
        for (let i = 0; i < Grid_Total.LayerNum; i++) {
            tabbase.tab[i].innerHTML = Grid_Property[i].LayerName;
        }
    }
function RaiseEvent(call){
if(call !=undefined){

}
}
    function rightClickmenu(pos){
        let GPO = Grid_Property[Grid_Total.Layer].Ope;
        if(GPO.RightClickAllEnabled==false){return;}
        let udo="";
        if(UndoArray.length!=0){
            udo="("+UndoArray[UndoArray.length-1].caption+")";
        }
        let popmenu = [
            { caption: "元に戻す"+udo, enabled: true, event: Undo },
            { caption: "コピー", enabled: true, event: Grid_Copy },
            { caption: "貼り付け", enabled: GPO.RightClickEnabled,child:[{caption:"内部から", event: mnuPaste },{caption:"外部クリップボードから",event: mnuouterPaste}]},
            { caption: "切り取り", enabled: GPO.RightClickEnabled, event: mnuCut },
            { caption: Grid_Total.ColumnCaption+"数指定", enabled: GPO.GridColEnabled, event: mnuColNumber },
            { caption: Grid_Total.RowCaption+"数指定", enabled: GPO.GridRowEnabled, event: mnuRowNumber },
            { caption: Grid_Total.RowCaption+"挿入", enabled: GPO.GridColEnabled, child: [{ caption: "前に挿入", event: mnuInsertRow }, { caption: "後ろに挿入", event: mnuInsertRow }] },
            { caption: Grid_Total.ColumnCaption+"挿入", enabled: GPO.GridRowEnabled, child: [{ caption: "左に挿入", event: mnuInsertCOl }, { caption: "右に挿入", event: mnuInsertCOl }] },
            { caption: Grid_Total.RowCaption+"削除", enabled: GPO.GridColEnabled, event: mnuDeleteRow },
            { caption: Grid_Total.ColumnCaption+"削除", enabled: GPO.GridRowEnabled, event: mnuDeleteCol },
        ];
        Generic.ceatePopupMenu(popmenu, pos);
        function mnuPaste() {
            if (inClipboard != "") {
                Grid_Paste(inClipboard, false);
                return;
            }
        }
        /**外部から貼り付け */
        function mnuouterPaste(event){
            removeEventlister();
            document.body.removeEventListener("contextmenu", contextMenuPrevent);
            base.removeEventListener("contextmenu", contextMenuPrevent);
            Generic.outerPaste(function (tx) {
                addDocumentEvent();
                base.addEventListener("contextmenu", contextMenuPrevent);
                document.body.addEventListener("contextmenu", contextMenuPrevent);
                if (tx != "") {
                    inClipboard = tx;
                    Grid_Paste(inClipboard, false);
                }
            },function(){
                addDocumentEvent();
                base.addEventListener("contextmenu",contextMenuPrevent);
                document.body.addEventListener("contextmenu",contextMenuPrevent);
            });
        }

        function mnuCut() { Grid_Copy(); Grid_Clear("切り取り") }
        function mnuRowNumber() {
            let PV = Grid_Property[Grid_Total.Layer].Ymax;
            removeEventlister();
            Generic.prompt(undefined, Grid_Total.RowCaption + "数指定", PV, function (SF) {
                if (SF != "") {
                    SF=Generic.convValue(SF);
                    if (isNaN(SF) == true) {
                        Generic.alert(undefined,SF+":数値を入力して下さい。")
                    }
                    let V = Number(SF);
                    let n = V - PV;
                    if ((V > 0) && (n != 0)) {
                        if (n < 0) {
                            SetUndo_DeleteRows(Grid_Total.RowCaption + "数変更", PV + n, -n);
                            DeleteRows(Grid_Total.Layer, PV + n, -n);
                            Print_Grid_Data();
                            eventCall.evtChange_FixedXS();
                            eventCall.evtChange_Data();
                        } else {
                            InsertRows(Grid_Total.Layer, PV, n);
                            Print_Grid_Data();
                            eventCall.evtChange_FixedXS();
                            eventCall.evtChange_Data();
                        }
                    }
                    addDocumentEvent();
                }
            },"right",addDocumentEvent);
        }
        function mnuColNumber(){
            let PV = Grid_Property[Grid_Total.Layer].Xmax;
            removeEventlister();
            Generic.prompt(undefined, Grid_Total.ColumnCaption + "数指定", PV, function (SF) {
                if (SF != "") {
                    SF=Generic.convValue(SF);
                    if (isNaN(SF) == true) {
                        Generic.alert(undefined,SF+":数値を入力して下さい。")
                    }
                    let V = Number(SF);
                    let n = V - PV;
                    if ((V > 0) && (n != 0)) {
                        if (n < 0) {
                            SetUndo_DeleteColumns(Grid_Total.ColumnCaption + "数指定", PV + n, -n)
                            DeleteColumns(Grid_Total.Layer, PV + n, -n);
                            Print_Grid_Data();
                            eventCall.evtChange_FixedYS();
                            eventCall.evtChange_Data();
                        } else {
                            SetUndo_InsertColumns(Grid_Total.ColumnCaption + "数指定", PV, n)
                            InsertColumns(Grid_Total.Layer, PV, n);
                            Print_Grid_Data();
                            eventCall.evtChange_FixedYS();
                            eventCall.evtChange_Data();
                        }
                    }
                    addDocumentEvent();
                }
            },"right",addDocumentEvent);
        }

        function mnuInsertRow(e) {
            let GP = Grid_Property[Grid_Total.Layer];
            let ip;
            let rect = GP.MouseUpDownRect();
            if (rect.top < 0) { return; }
            let r = rect.bottom - rect.top + 1;
            if (e.caption == "後ろに挿入") {
                ip = rect.top + 1;
            } else {
                ip = rect.top;
                GP.MouseDownY = GP.MouseDownY + r;
                GP.MouseUpY = GP.MouseUpY + r;
            }

            SetUndo_InsertRows(Grid_Total.RowCaption + "挿入", ip, r);
            InsertRows(Grid_Total.Layer, ip, r);
            eventCall.evtChange_FixedXS();
            eventCall.evtChange_Data()
            Print_Grid_Data();
        }
        function mnuInsertCOl(e) {
            let GP = Grid_Property[Grid_Total.Layer];
            let rect = GP.MouseUpDownRect();
            if (rect.left < 0) {
                return;
            }

            let ip;
            let r = rect.right - rect.left + 1;
            if (e.caption == "右に挿入") {
                ip = rect.right + 1;
            } else {
                ip = rect.left;
                GP.MouseDownX = GP.MouseDownX + r;
                GP.MouseUpX = GP.MouseUpX + r;
            }
           　SetUndo_InsertColumns("列挿入", ip, r);
            InsertColumns(Grid_Total.Layer, ip, r);
            eventCall.evtChange_FixedYS();
            eventCall.evtChange_Data();
            Print_Grid_Data()
        }
        function mnuDeleteCol() {
            let GP = Grid_Property[Grid_Total.Layer];
            let rect = GP.MouseUpDownRect();
            let r1 = rect.left;
            let r2 = rect.right;
            let r = r2 - r1 + 1;
            if ((r1 < 0) || (r == GP.Xmax)) { return; }
            SetUndo_DeleteColumns(Grid_Total.ColumnCaption + "削除", r1, r);
            DeleteColumns(Grid_Total.Layer, r1, r);
            if ((GP.Xmax <= GP.MouseUpX)) {
                GP.MouseUpX = GP.Xmax - 1;
            }
            if ((GP.Xmax <= GP.MouseDownX)) {
                GP.MouseDownX = GP.Xmax - 1;
            }
            Print_Grid_Data();
            eventCall.evtChange_FixedYS();
            eventCall.evtChange_Data();
        }
        function mnuDeleteRow() {
            let GP = Grid_Property[Grid_Total.Layer];
            let rect = GP.MouseUpDownRect();
            let r1 = rect.top;
            let r2 = rect.bottom;
            let r = r2 - r1 + 1;
            if ((r1 < 0) || (r == GP.Ymax)) { return; }
            SetUndo_DeleteRows(Grid_Total.RowCaption + "削除", r1, r)
            DeleteRows(Grid_Total.Layer, r1, r);
            if ((GP.Ymax <= GP.MouseUpY)) {
                GP.MouseUpY = GP.Ymax - 1;
            }
            if ((GP.Xmax <= GP.MouseDownY)) {
                GP.MouseDownY = GP.Ymax - 1;
            }
            Print_Grid_Data();
            eventCall.evtChange_FixedXS();
            eventCall.evtChange_Data();
        }
    }
    /**レイヤのグリッド初期化 */
    function Init_Grid(L) {
        let GP = Grid_Property[L];
        GP.DataItemData = [];
        GP.CellHeight = [];
        GP.FixedObjectNameData = [];
        GP.FixedDataItemData = [];
        GP.SelectedF = false;
        GP.TopCell=0;
        GP.LeftCell=0;
        
        GP.scrollTop=0;
        GP.scrollLeft=0;
        let xs = GP.Xmax;
        let ys = GP.Ymax;
        GP.GridLineCol = Grid_Total.Color.GridLine.Clone();

        for (let i = 0; i < ys; i++) {
            for (let j = 0; j < xs; j++) {
                GP.Grid_Text[j][i] = new GridTextColor_Info();
            }
        }

        for (let i = 0; i < ys; i++) {
            GP.CellHeight[i] = defoCellHeight;
        }

        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < Grid_Total.FixedDataItem_n; j++) {
                GP.FixedDataItem[i][j] = new GridTextColor_Info();
            }
        }
        for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
            for (let j = 0; j < ys; j++) {
                GP.FixedObjectName[i][j] = new GridTextColor_Info();
            }
        }

        for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
            for (let j = 0; j < Grid_Total.FixedDataItem_n; j++) {
                GP.FixedUpperLeft[i][j] = new FixedUpperLeft_Info();
            }
        }
        for (let i = 0; i < Grid_Total.FixedDataItem_n; i++) {            
            let GPF =new FixedDataItemData_Info();
            GPF.Height = defoCellHeight;
            if (i == 0) {
                GPF.Allignment = Grid_Total.DefaultNumberingAlligntment;
            } else {
                GPF.Allignment = Grid_Total.DefaultFixedYSAllignment;
            }
            GP.FixedDataItemData[i]=GPF;
        }

        for (let i = 0; i < xs; i++) {
            let GPF =new CellData_Info(); 
            GPF.Width = Grid_Total.DefaultGridWidth;
            GPF.Allignment = Grid_Total.DefaultGridAlligntment;
            GP.DataItemData[i]=GPF;
        }

        for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
            let GPF =new FixedObjectNameData_Info();
            if (i == 0) {
                GPF.Width = Grid_Total.DefaultFixedXNumberingWidth;
                GPF.Allignment = Grid_Total.DefaultNumberingAlligntment;
            } else {
                GPF.Width = Grid_Total.DefaultFixedXWidth;
                GPF.Allignment = Grid_Total.DefaultFixedXSAllignment;
            }
            GP.FixedObjectNameData[i] = GPF;
        }

        GP.FixedUpperLeftAllignment = Grid_Total.DefaultFixedUpperLeftAlligntment;
        txtTextBox.style.font = Grid_Total.GridFont;
        txtTextBox.style.backgroundColor = Grid_Total.Color.TextBox.toHex();
        Set_FixedCell_Words(L);
    }

    /**document要素のイベントを追加  */
    function addDocumentEvent(){
        document.addEventListener("mousemove", mmove, false);
        document.addEventListener("mouseup", mup, false);
        document.addEventListener('keydown', keydown, false);
        vScroll.addEventlister();
        hScroll.addEventlister();
    }
    function removeEventlister(){
        document.removeEventListener("mousemove", mmove, false);
        document.removeEventListener("mouseup", mup, false);
        document.removeEventListener("keydown", keydown, false);
        vScroll.removeEventlister();
        hScroll.removeEventlister();
    }

    /** 行削除*/
    function DeleteRows(GridLay, DeletePoint, DeleteNum) {

        //データ部分を削除
        let GP = Grid_Property[GridLay];
        let oldYs = GP.Ymax;
        let ys = GP.Ymax - DeleteNum;
        GP.Ymax = ys;
        let xs = GP.Xmax;

        for (let j = DeletePoint + DeleteNum; j < oldYs; j++) {
            GP.CellHeight[j - DeleteNum] = GP.CellHeight[j];
        }
        GP.CellHeight.length = ys;
        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension(xs, ys);
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.Grid_Text[i][j] = GTempText[i][j];
            }
            for (let j = DeletePoint + DeleteNum; j < oldYs; j++) {
                GP.Grid_Text[i][ j - DeleteNum] = GTempText[i][j];
            }
        }

        //オブジェクト名部分を削除
         GTempText = Generic.Array2Clone(GP.FixedObjectName);
         xs = Grid_Total.FixedObjectName_n;
        GP.FixedObjectName = Generic.Array2Dimension(xs, ys);
        for (let i = -xs; i <= -1; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.FixedObjectName[i + xs][j] = GTempText[i + xs][j];
            }
            for (let j = DeletePoint + DeleteNum; j < oldYs; j++) {
                GP.FixedObjectName[i + xs][j - DeleteNum] = GTempText[i + xs][j];
            }
        }
        Set_FixedCell_Words(GridLay);
        Print_Grid_ViewSize();
    }


    function InsertRows(GridLay, InsertPoint, InsertNum) {
        /** データ部分を挿入*/
        let GP = Grid_Property[GridLay];
        let oldYs = GP.Ymax;
        let ys = GP.Ymax + InsertNum;
        GP.Ymax = ys;
        let xs = GP.Xmax;
        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension(xs, ys);
        let refPoint = (InsertPoint != oldYs) ? InsertPoint : InsertPoint - 1;
        for (let i = 0; i < xs; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.Grid_Text[i][j] = GTempText[i][j];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.Grid_Text[i][j + InsertPoint] = GTempText[i][refPoint].Clone();
                GP.Grid_Text[i][j + InsertPoint].Text = "";
            }
            for (let j = InsertPoint; j < oldYs; j++) {
                GP.Grid_Text[i][j + InsertNum] = GTempText[i][j];
            }
        }

        if (InsertPoint == oldYs) {
            for (let i = InsertPoint; i < InsertPoint + InsertNum; i++) {
                GP.CellHeight[i] = GP.CellHeight[InsertPoint - 1];
            }
        } else {
            for (let j = oldYs - 1; j >= InsertPoint; j--) {
                GP.CellHeight[j + InsertNum] = GP.CellHeight[j]
            }
            for (let j = InsertPoint + 1; j < InsertPoint + InsertNum; j++) {
                GP.CellHeight[j] = GP.CellHeight[InsertPoint];
            }
        }

        //オブジェクト名部分を挿入
        xs = Grid_Total.FixedObjectName_n
        GTempText = Generic.Array2Clone(GP.FixedObjectName);
        GP.FixedObjectName = Generic.Array2Dimension(xs, ys);
        for (let i = -xs; i <= -1; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.FixedObjectName[i + xs][j] = GTempText[i + xs][j];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.FixedObjectName[i + xs][j + InsertPoint] = GTempText[i + xs][refPoint].Clone();
                GP.FixedObjectName[i + xs][j + InsertPoint].Text = "";
            }
            for (let j = InsertPoint; j < oldYs; j++) {
                GP.FixedObjectName[i + xs][j + InsertNum] = GTempText[i + xs][j];
            }
        }
        Set_FixedCell_Words(GridLay);
        Print_Grid_ViewSize();
    }

    function DeleteColumns(GridLay, DeletePoint, DeleteNum) {

        //データ部分を挿入
        let GP = Grid_Property[GridLay];
        let oldXs = GP.Xmax;
        let ys = GP.Ymax;
        let xs = GP.Xmax - DeleteNum;
        GP.Xmax = xs;

        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension(xs, ys);
        for (let i = 0; i < ys; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.Grid_Text[j][i] = GTempText[j][i];
            }
            for (let j = DeletePoint + DeleteNum; j < oldXs; j++) {
                GP.Grid_Text[j - DeleteNum][ i] = GTempText[j][i];
            }
        }

        for (let j = DeletePoint + DeleteNum; j < oldXs; j++) {
            GP.DataItemData[j - DeleteNum] = GP.DataItemData[j];
        }
        GP.DataItemData.length = xs;

        //データ項目部分を削除
         ys = Grid_Total.FixedDataItem_n
        GTempText = Generic.Array2Clone(GP.FixedDataItem);
        GP.FixedDataItem = Generic.Array2Dimension(xs, ys);
        for (let i = -ys; i <= -1; i++) {
            for (let j = 0; j < DeletePoint; j++) {
                GP.FixedDataItem[j][i + ys] = GTempText[j][i + ys];
            }
            for (let j = DeletePoint + DeleteNum; j < oldXs; j++) {
                GP.FixedDataItem[j - DeleteNum][i + ys] = GTempText[j][i + ys];
            }
        }
        Set_FixedCell_Words(GridLay);
        Print_Grid_ViewSize();
    }

    function InsertColumns(GridLay, InsertPoint, InsertNum) {

        //データ部分を挿入
        let GP = Grid_Property[GridLay];
        let oldXs = GP.Xmax;
        let ys = GP.Ymax;
        let xs = GP.Xmax + InsertNum;
        GP.Xmax = xs;
        let GTempText = Generic.Array2Clone(GP.Grid_Text);
        GP.Grid_Text = Generic.Array2Dimension(xs, ys);
        let refPoint = (InsertPoint != oldXs) ? InsertPoint : InsertPoint - 1;
        for (let i = 0; i < ys; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.Grid_Text[j][i] = GTempText[j][i];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.Grid_Text[j + InsertPoint][ i] = GTempText[refPoint][i].Clone();
                GP.Grid_Text[j + InsertPoint][ i].Text="";
            }
            for (let j = InsertPoint; j < oldXs; j++) {
                GP.Grid_Text[j + InsertNum][ i] = GTempText[j][i];
            }
        }

        if (InsertPoint == oldXs) {
            for (let i = InsertPoint; i < InsertPoint + InsertNum; i++) {
                GP.DataItemData[i] = GP.DataItemData[InsertPoint - 1].Clone();
            }
        } else {
            for (let j = oldXs - 1; j >= InsertPoint; j--) {
                GP.DataItemData[j + InsertNum] = GP.DataItemData[j];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.DataItemData[j] = GP.DataItemData[refPoint].Clone();
                GP.DataItemData[j].Text="";
            }
            for (let j = InsertPoint + 1; j < InsertPoint + InsertNum; j++) {
                GP.DataItemData[j] = GP.DataItemData[InsertPoint].Clone();
            }
        }

        //データ項目部分を挿入
        GP = Grid_Property[GridLay];
         ys = Grid_Total.FixedDataItem_n
        GTempText = Generic.Array2Clone(GP.FixedDataItem);
        GP.FixedDataItem = Generic.Array2Dimension(xs, ys);
        for (let i = -ys; i <= -1; i++) {
            for (let j = 0; j < InsertPoint; j++) {
                GP.FixedDataItem[j][i + ys] = GTempText[j][i + ys];
            }
            for (let j = 0; j < InsertNum; j++) {
                GP.FixedDataItem[j + InsertPoint][ i + ys] = GTempText[refPoint][i + ys].Clone();
                GP.FixedDataItem[j + InsertPoint][ i + ys].Text="";
            }
            for (let j = InsertPoint; j < oldXs; j++) {
                GP.FixedDataItem[j + InsertNum][ i + ys] = GTempText[j][i + ys];
            }
        }
        Set_FixedCell_Words(GridLay);
        Print_Grid_ViewSize();
    }

    /** 固定行・列に番号をふる */
    function Set_FixedCell_Words(L) {
        let GP = Grid_Property[L];
        if (Grid_Total.FixedObjectName_n > 0) {
            for (let i = 0; i < GP.Ymax; i++) {
                 Set_Data_To_Grid(L, -Grid_Total.FixedObjectName_n, i, (i + 1).toString(), false)
            }
        }
        if (Grid_Total.FixedDataItem_n2 > 0) {
            for (let i = 0; i < GP.Xmax; i++) {
                 Set_Data_To_Grid(L, i, -Grid_Total.FixedDataItem_n, (i + 1).toString(), false)
            }
        }
    }

    /**指定された位置のグリッド配列にﾃﾞｰﾀをｾｯﾄする Check_F:変更できるかどうかチェックする */
    function  Set_Data_To_Grid( Grid_Lay ,  X ,  Y ,  tx ,  Check_F ){
        if (Check_F == true) {
            let gpo = Grid_Property[Grid_Total.Layer].Ope;
            if (((Y < 0) && (X >= 0)) && (gpo.FixedYSEnabled == false) ||
                ((X < 0) && (Y >= 0)) && (gpo.FixedXSEnabled == false) ||
                ((X < 0) && (Y < 0)) && (gpo.FixedUpperLeftEnabeld == false)) {
                return;
            }
        }
        let gp = Grid_Property[Grid_Lay];
        if ((X < 0) && (Y < 0)) {
            gp.FixedUpperLeft[X + Grid_Total.FixedObjectName_n][ Y + Grid_Total.FixedDataItem_n].Text = tx;
        } else if (X < 0) {
            gp.FixedObjectName[X + Grid_Total.FixedObjectName_n][ Y].Text = tx;
        } else if (Y < 0) {
            gp.FixedDataItem[X][ Y + Grid_Total.FixedDataItem_n].Text = tx;
        } else {
            gp.Grid_Text[X][Y].Text = tx;
        }
    }

    function Get_XYData(Layer, X, Y) {
        let GP = Grid_Property[Layer];
        if ((X < 0) && (Y < 0)) {
            return GP.FixedUpperLeft[X + Grid_Total.FixedObjectName_n][Y + Grid_Total.FixedDataItem_n].Text;
        } else if (X < 0) {
            return GP.FixedObjectName[X + Grid_Total.FixedObjectName_n][Y].Text;
        } else if (Y < 0) {
            return  GP.FixedDataItem[X][Y + Grid_Total.FixedDataItem_n].Text;
        } else {
            return  GP.Grid_Text[X][Y].Text;
        }
    }

function Grid_Copy(){
    picGrid.style.cursor = 'wait';

    let GP = Grid_Property[Grid_Total.Layer];
        let sb = "";
        let rect = GP.MouseUpDownRect();
        let r1 = Math.max(-Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2, rect.left)
        let r2 = rect.right
        let c1 = Math.max(-Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2, rect.top)
        let c2 = rect.bottom
        for (let i = c1; i <= c2; i++) {
            for (let j = r1; j <= r2; j++) {
                let PlusCell = Get_Data_from_Grid(Grid_Total.Layer, j, i);
                if (PlusCell.indexOf("\n") != -1) {
                    //改行が含まれるセルは""で囲む
                    PlusCell = '"' + PlusCell + '"';
                }
                sb += PlusCell;
                if (j != r2) {
                    sb += '\t';
                }
            }
            if (c1 != c2) {
                sb += '\n';
            }
        }
        if (sb.length != 0) {
            Generic.copyText(sb);
            inClipboard = sb;
        }
        picGrid.style.cursor = 'default';
    }

    /** 切り取り、貼り付け、入力、クリアのアンドゥセット*/
    function SetUndo_CopyPasteCutClear(Caption){
        let rect = Grid_Property[Grid_Total.Layer].MouseUpDownRect();
        let sb = "";
        for (let i = rect.top; i <= rect.bottom; i++) {
            for (let j = rect.left; j <= rect.right; j++) {
                sb += Get_Data_from_Grid(Grid_Total.Layer, j, i);
                sb += "\t";
            }
        }
        let UndoInput = new Undo_InputCopyPasteClearInfo();
        UndoInput.Layer = Grid_Total.Layer;
        UndoInput.GridData = sb;
        UndoInput.Rect = rect;
        UndoInput.caption = Caption;
        UndoArray.push(UndoInput);
    }

    function SetUndo_ChangeRowHeight(Layer, top, bottom) {
        let UndoData = new Undo_ChangeRowHeight();
        let oldH = [];
        let GP = Grid_Property[Layer];
        for (let i = top; i <= bottom; i++) {
            if (i < 0) {
                oldH[i - top] = GP.FixedDataItemData[i + Grid_Total.FixedDataItem_n].Height;
            } else {
                oldH[i - top] = GP.CellHeight[i];
            }
        }
        UndoData.caption = "高さ変更";
        UndoData.Layer = Layer;
        UndoData.Height = oldH;
        UndoData.Top = top;
        UndoData.Bottom = bottom;
        UndoArray.push(UndoData);
    }
    function SetUndo_Input(X, Y, Caption) {
        let UndoData = new Undo_InputCopyPasteClearInfo();
        UndoData.Layer = Grid_Total.Layer;
        UndoData.GridData = Get_Data_from_Grid(Grid_Total.Layer, X, Y);
        UndoData.Rect = new rectangle(X, X, Y, Y);
        UndoData.caption = Caption;
        UndoArray.push(UndoData);
    }

    function  SetUndo_InsertRows(Caption , y , InsertNum ){
        //行挿入
        let UndoData = new Undo_InsertRows();
        UndoData.caption = Caption;
        UndoData.Top = y;
        UndoData.Bottom = y + InsertNum - 1;
        UndoData.Layer = Grid_Total.Layer;
        UndoArray.push(UndoData)
    }
    
    function SetUndo_InsertColumns(Caption, x, InsertNum) {
        //列挿入
        let UndoData = new Undo_InsertColumns();
        UndoData.caption = Caption;
        UndoData.Left = x;
        UndoData.Right = x + InsertNum - 1;
        UndoData.Layer = Grid_Total.Layer;
        UndoArray.push(UndoData);
    }

    // 行削除のundo
    function SetUndo_DeleteRows(Caption, Y, DeleteNum) {
        let sb = "";
        for (let i = Y; i < Y + DeleteNum; i++) {
            for (let j = -Grid_Total.FixedObjectName_n; j < Grid_Property[Grid_Total.Layer].Xmax; j++) {
                sb += Get_Data_from_Grid(Grid_Total.Layer, j, i) + "\t";
            }
        }
        let UndoData = new Undo_DeleteRows();
        UndoData.Top = Y;
        UndoData.Bottom = Y + DeleteNum - 1;
        UndoData.caption = Caption;
        UndoData.Layer = Grid_Total.Layer;
        UndoData.GridData = sb;
        UndoArray.push(UndoData);
    }

    ////// 列削除のundo
    function SetUndo_DeleteColumns(Caption, X, DeleteNum) {
        let sb = "";
        for (let i = -Grid_Total.FixedDataItem_n; i < Grid_Property[Grid_Total.Layer].Ymax;i++) {
            for (let j = X; j < X + DeleteNum; j++) {
                sb += Get_Data_from_Grid(Grid_Total.Layer, j, i) + "\t";
            }
        }
        let UndoData = new Undo_DeleteColumns();
        UndoData.Left = X;
        UndoData.Right = X + DeleteNum - 1;
        UndoData.caption = Caption;
        UndoData.Layer = Grid_Total.Layer;
        UndoData.GridData = sb;
        UndoArray.push(UndoData);
    }

    function Grid_Paste(clipText, UndoMode_Flag) {

        let GP = Grid_Property[Grid_Total.Layer];

        //クリップボードのデータ分解
        if (clipText.right(1) == '\n') {
            clipText = clipText.left(clipText.length - 1);
        }
        let pastData = [];;
        let dbq = false;
        pastData[0] = [];
        let Yn = 0;
        let Xn = 0;
        let startp = 0;
        let endf = false;
        for (let i = 0; i < clipText.length; i++) {
            let tx = clipText.mid(i, 1)
            endf = false;
            if (tx == '"') {
                if (dbq == true) {
                    dbq = false;
                } else {
                    dbq = true;
                }
            } else if (tx == '\t') {
                let ptx = clipText.mid(startp, i - startp);
                startp = i + 1;
                if (ptx.indexOf('\n') != -1) {
                    ptx = ptx.mid(1, ptx.length - 2);
                }
                pastData[Yn].push(ptx);
                endf = true;
            } else if (tx == '\n') {
                if (dbq == false) {
                    let ptx = clipText.mid(startp, i - startp);
                    startp = i + 1;
                    pastData[Yn].push(ptx);
                    Xn = Math.max(Xn, pastData[Yn].length);
                    Yn++;
                    pastData[Yn] = [];
                    endf = true;
                }
            }
        }
        if (endf == false) {
            let ptx = clipText.mid(startp, undefined);
            pastData[Yn].push(ptx)
            Xn = Math.max(Xn, pastData[Yn].length);
            Yn++;
        }

        for (let i = 0; i < Yn; i++) {
            for (let j = pastData[i].length; j < Xn; j++) {
                pastData[i].push("");
            }
        }

        let ygmax = GP.Ymax;
        let xgmax = GP.Xmax;
        let rect = GP.MouseUpDownRect();
        let gt = Grid_Total;
        let xg = Math.max(-gt.FixedObjectName_n + gt.FixedObjectName_n2, rect.left);
        let yg = Math.max(-gt.FixedDataItem_n + gt.FixedDataItem_n2, rect.top);
        let xg2 = Math.max(-gt.FixedObjectName_n + gt.FixedObjectName_n2, rect.right);
        let yg2 = Math.max(-gt.FixedDataItem_n + gt.FixedDataItem_n2, rect.bottom);
        let ygs = yg2 - yg + 1;
        let xgs = xg2 - xg + 1;

        if (yg + Yn - 1 >= ygmax) {
            Yn = ygmax - yg;
        }
        if (xg + Xn - 1 >= xgmax) {
            Xn = xgmax - xg;
        }

        let f = true;
        if ((Yn == 1) && (Xn == 1)) {
            if (UndoMode_Flag == false) {
                SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = yg; i <= yg2; i++) {
                for (let j = xg; j <= xg2; j++) {
                    Set_Data_To_Grid(Grid_Total.Layer, j, i, pastData[0][0], true);
                }
            }
            Xn = xgs;
            Yn = ygs;
        } else if (((ygs == 1) && (xgs == 1)) || ((Xn == xgs) && (Yn == ygs))) {
            if (UndoMode_Flag == false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + Xn - 1;
                GP.MouseUpY = yg + Yn - 1;
                SetUndo_CopyPasteCutClear("貼り付け")
            }
            for (let i = 0; i < Yn; i++) {
                for (let j = 0; j < Xn; j++) {
                    Set_Data_To_Grid(Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true)
                }
            }
        } else if ((xgs == 1) && (ygs > 1) && (Yn == 1) && (Xn > 1)) {
            if (UndoMode_Flag == false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + Xn - 1;
                GP.MouseUpY = yg + ygs - 1;
                SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = 0; i < ygs; i++) {
                for (let j = 0; j < Xn; j++) {
                    Set_Data_To_Grid(Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true);
                }
            }
            Yn = ygs;
        } else if ((ygs == 1) && (xgs > 1) && (Xn == 1) && (Yn > 1)) {
            if (UndoMode_Flag == false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + xgs - 1;
                GP.MouseUpY = yg + Yn - 1;
                SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = 0; i < xgs; i++) {
                for (let j = 0; j < Yn; j++) {
                    Set_Data_To_Grid(Grid_Total.Layer, i + xg, j + yg, pastData[j][0], true);
                }
            }
            Xn = xgs;
        } else if ((xgs == 1) && (ygs == Yn)){
            if (UndoMode_Flag == false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + Xn - 1;
                GP.MouseUpY = yg + ygs - 1;
                SetUndo_CopyPasteCutClear("貼り付け");
            }
            for (let i = 0; i < Yn; i++) {
                for (let j = 0; j < Xn; j++) {
                    Set_Data_To_Grid(Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true);
                }
            }
        } else if ((ygs == 1) && (xgs == Xn)) {
            if (UndoMode_Flag == false) {
                GP.MouseDownX = xg;
                GP.MouseDownY = yg;
                GP.MouseUpX = xg + xgs - 1;
                GP.MouseUpY = yg + Yn - 1;
                SetUndo_CopyPasteCutClear("貼り付け")
            }
            for (let i = 0; i < Yn; i++) {
                for (let j = 0; j < Xn; j++) {
                    Set_Data_To_Grid(Grid_Total.Layer, j + xg, i + yg, pastData[i][j], true);
                }
            }
        } else {
            Generic.alert (undefined,"この形状には対応していません。");
            f = false;
        }

        if (f == true) {
            Print_Grid_Data();
            Check_ChangeEventRange(xg, yg, Xn, Yn);
        }
    }
    function Check_ChangeEvent(X , Y ){
    let f = false;
    let GPo= Grid_Property[Grid_Total.Layer].Ope;
        if((X < 0 )&&( Y >= 0 )&&(GPo.FixedXSEnabled == true) ){
            eventCall.evtChange_FixedXS();
            f = true;
        }
        if((Y < 0 )&&( X >= 0 )&&(GPo.FixedYSEnabled == true) ){
            eventCall.evtChange_FixedYS();
            f = true;
        }
        if((Y < 0 )&&( X < 0 )&&(GPo.FixedUpperLeftEnabeld == true )){
            eventCall.evtChange_FixedUpperLeft();
            f = true;
        }
        if((f == false )&&(GPo.InputEnabled == true )){
            eventCall.evtChange_Data();
        }
}

function Check_ChangeEventRange(X , Y , Xn , Yn ){
    let GPo= Grid_Property[Grid_Total.Layer].Ope;
        if((Y < 0 )&&( X < 0 )&&(GPo.FixedUpperLeftEnabeld == true) ){
            eventCall.evtChange_FixedUpperLeft();
        }
        if((X < 0 )&&( 0 <= Y + Yn - 1 )&&(GPo.FixedXSEnabled == true )){
            eventCall.evtChange_FixedXS();
        }
        if((Y < 0 )&&( 0 <= X + Xn - 1 )&&(GPo.FixedYSEnabled = true )){
            eventCall.evtChange_FixedYS();
        }
        if((0 <= X + Xn - 1 )&&( 0 <= Y + Yn - 1) ){
            if(GPo.InputEnabled == true ){
                eventCall.evtChange_Data();
            }
        }

}
    function tabInit(){
        tabbase.frame = Generic.createNewDiv(base, "", "", "", 0, 0, width, tabh, "", "");
        tabbase.tab = [];
        tabbase.tabListBase = Generic.createNewDiv(tabbase.frame, "", "", "", 0, 0, width - tabArrowW*2 , tabh, "", undefined);
        tabbase.moveDiv = Generic.createNewDiv(tabbase.frame, "", "", "", width - tabArrowW*2 , 0, tabArrowW*2  , tabh + 1, "user-select:none;cursor:default;z-index:100;background-color:white", undefined);
        tabbase.moveLeft = Generic.createNewDiv(tabbase.moveDiv, "", "", "", 0, 0, tabArrowW, tabh, "", function () {
            let x = tabbase.tabListBase.style.left.removePx() + tabw / 2;
            x = Math.min(x, 0);
            tabbase.tabListBase.style.left = x.px()
        });
        let moveLeftCanvas = Generic.createNewCanvas(tabbase.moveLeft, "", "", 0, 0, tabArrowW, tabh, undefined, "");
        let ctxl = moveLeftCanvas.getContext("2d");
        let cx = tabArrowW / 2;
        let cy = tabh / 2;
        ctxl.fillStyle = 'gray';
        ctxl.beginPath();
        ctxl.moveTo(cx - tabh / 2, cy);
        ctxl.lineTo(cx + tabh / 2, 2);
        ctxl.lineTo(cx + tabh / 2, tabh - 2);
        ctxl.closePath();
        ctxl.fill();
        tabbase.moveRight = Generic.createNewDiv(tabbase.moveDiv, "", "", "", tabArrowW, 0, tabArrowW, tabh, "", function () {
            let x = tabbase.tabListBase.style.left.removePx() - tabw / 2;
            x = Math.max(x, -tabw * (tabbase.tab.length - 1));
            tabbase.tabListBase.style.left = x.px()
        });
        let moveRightCanvas = Generic.createNewCanvas(tabbase.moveRight, "", "", 0, 0, tabArrowW, tabh, undefined, "");
        let ctxr = moveRightCanvas.getContext("2d");
        ctxr.fillStyle = 'gray';
        ctxr.beginPath();
        ctxr.moveTo(cx + tabh / 2, cy);
        ctxr.lineTo(cx - tabh / 2, 2);
        ctxr.lineTo(cx - tabh / 2, tabh - 2);
        ctxr.closePath();
        ctxr.fill();

    }
    function tabMake() {
        let oldn = tabbase.tab.length;
        if (oldn < Grid_Total.LayerNum) {
            for (let i = oldn; i < Grid_Total.LayerNum; i++) {
                let tab = Generic.createNewDiv(tabbase.tabListBase, "", "", "", i * tabw, 0, tabw, tabh,
                    "font-size:14px;user-select: none; border:solid 1px;border-color:#666666;white-space:pre;overflow:hidden;line-height:" + (tabh - 2).px(), undefined);
                    tab.addEventListener("mousedown",tabMouseDown, false);
                    tab.addEventListener("touchstart",tabMouseDown, false)
                    tab.addEventListener("touchend",tabTouchend, false)
                tab.style.backgroundColor = "#e1e1e1";
                tab.align = 'center';
                tab.tag = i;
                tabbase.tab.push(tab);
            }
        } else if (Grid_Total.LayerNum < oldn) {
            for (let i = Grid_Total.LayerNum; i < oldn; i++) {
                tabbase.tabListBase.removeChild(tabbase.tab[i]);
            }
            tabbase.tab.length = Grid_Total.LayerNum;
        }
        return ;

        /**タブクリック */
        function tabMouseDown(e){
            //マウスダウンでレイヤ移動
            if (txtTextBox.getVisibility() == true) {
                txtTextBox.setVisibility(false);
                Set_Data_from_txtBox_To_Grid();
            }
            let GP = Grid_Property[Grid_Total.Layer];
            GP.scrollLeft = hScroll.getPosition();
            GP.scrollTop = vScroll.getPosition();
            tabbase.selectedIndex = Number(this.tag);
            let oldLay=Grid_Total.Layer;
            Grid_Total.Layer = Number(this.tag);
            let GP2 = Grid_Property[Grid_Total.Layer];
            Print_Grid_ViewSize();
            hScroll.setPosition(  GP2.scrollLeft);
            vScroll.setPosition(  GP2.scrollTop);
            tabSelect();
            Print_Grid_Data();
            eventCall.evtChange_LayerSelect(Grid_Total.Layer, oldLay);
            let rightButton = false;
            touchStartTime = new Date().getTime();
            if (e.button == 2) { rightButton = true; }

            //右クリックの場合メニュー
            if((rightButton)&&(Grid_Total.tOpe.TabClickEnabled)){
                
                tabRightClickMenu(new point(e.clientX,e.clientY));
            }
        }

        function tabTouchend(e) {
            let touchTime = (new Date().getTime() - touchStartTime) / 1000;
            if ((touchTime > 0.5)&&(Grid_Total.tOpe.TabClickEnabled)) {
                //タッチで0.5秒以上移動しない場合は右クリック
                tabRightClickMenu(new point(e.changedTouches[0].clientX,e.changedTouches[0].clientY));;
            }
        }
}

    /**タブを右クリック */
    function tabRightClickMenu(p) {
        let GPO = Grid_Property[Grid_Total.Layer].Ope;
        let lc = Grid_Total.LayerCaption;
        let popmenu = [
            { caption: lc + "名の変更", enabled: true, event: mnuTabRightMenuChangeTabName },
            { caption: lc + "の移動", enabled: true, child: [{ caption: "1つ前に移動", event: mnuTabRightMenuMove }, { caption: "1つ後ろに移動", event: mnuTabRightMenuMove }, { caption: "先頭に移動", event: mnuTabRightMenuMove }, { caption: "末尾に移動", event: mnuTabRightMenuMove }] },
            { caption: "新しい" + lc + "の挿入", enabled: GPO.RightClickEnabled, child: [{ caption: "前に挿入", event: mnuTabRightMenuInsert }, { caption: "後ろに挿入", event: mnuTabRightMenuInsert }] },
            { caption: lc + "の削除", enabled: GPO.RightClickEnabled, event: mnuTabRightMenuDeleteTab }
        ];
        Generic.ceatePopupMenu(popmenu, p);
        function mnuTabRightMenuMove(e) {
            let nt = Grid_Total.Layer;
            switch (e.caption) {
                case "1つ前に移動": {
                    if (nt != 0) {
                        let UndoData = new Undo_SwapLayer();
                        UndoData.Layer1 = nt;
                        UndoData.Layer2 = nt - 1;
                        UndoData.caption = "レイヤ移動";
                        UndoArray.push(UndoData);
                        Swap_GridLay(nt, nt - 1);
                        Grid_Total.Layer = nt - 1;
                        Set_SSTAB_Name();
                        tabSelect();
                        eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
                case "1つ後ろに移動": {
                    if (nt != Grid_Total.LayerNum - 1) {
                        let UndoData = new Undo_SwapLayer();
                        UndoData.Layer1 = nt;
                        UndoData.Layer2 = nt + 1;
                        UndoData.caption = "レイヤ移動";
                        UndoArray.push(UndoData);
                        Swap_GridLay(nt, nt + 1);
                        Grid_Total.Layer = nt + 1;
                        Set_SSTAB_Name();
                        tabSelect();
                        eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
                case "先頭に移動": {
                    if (nt != 0) {
                        let UndoData = new Undo_MoveLayer();
                        UndoData.OriginLay = nt;
                        UndoData.DestLay = 0;
                        UndoData.caption = "レイヤ移動";
                        UndoArray.push(UndoData);
                        Grid_Property.unshift(Grid_Property[nt].Clone());
                        Grid_Property.splice(nt + 1, 1);
                        Grid_Total.Layer = 0;
                        Set_SSTAB_Name();
                        tabSelect();
                        eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
                case "末尾に移動": {
                    let mxt = Grid_Total.LayerNum;
                    if (nt != mxt - 1) {
                        let UndoData = new Undo_MoveLayer();
                        UndoData.OriginLay = nt;
                        UndoData.DestLay = mxt - 1;
                        UndoData.caption = "レイヤ移動";
                        UndoArray.push(UndoData);
                        Grid_Property.push(Grid_Property[nt].Clone());
                        Grid_Property.splice(nt, 1);
                        Grid_Total.Layer = mxt - 1;
                        Set_SSTAB_Name();
                        tabSelect();
                        eventCall.evtChange_Layer(false, true, false);
                    }
                    break;
                }
            }
        }
        function mnuTabRightMenuChangeTabName() {
            removeEventlister();
            Generic.prompt(undefined, "新しい" + Grid_Total.LayerCaption + "名", Grid_Property[Grid_Total.Layer].LayerName, function (newLayerName) {
                if (newLayerName == "") {
                } else {
                    let UndoData = new Undo_ChangeLayerName();
                    UndoData.Layer = Grid_Total.Layer;
                    UndoData.caption = Grid_Total.LayerCaption + "名の変更";
                    UndoData.Name = Grid_Property[Grid_Total.Layer].LayerName;
                    UndoArray.push(UndoData);
                    Grid_Property[Grid_Total.Layer].LayerName = newLayerName;
                    Set_SSTAB_Name();
                    addDocumentEvent();
                    eventCall.evtChange_Layer(true, false, false);
                }
            }, "left", addDocumentEvent);
        }
        function mnuTabRightMenuInsert(e) {
            let nt;
            if (e.caption == "前に挿入") {
                nt = Grid_Total.Layer;
            } else {
                nt = Grid_Total.Layer + 1;
            }
            let UndoData = new Undo_InsertLayer();
            UndoData.Layer = nt;
            UndoData.caption = Grid_Total.LayerCaption + "の挿入";
            UndoArray.push(UndoData);

            let existLayer = [];
            for (let i = 0; i < Grid_Total.LayerNum; i++) {
                existLayer[i] = Grid_Property[i].LayerName;
            }
            let newName = Generic.Get_New_Numbering_Strings("新しい" + Grid_Total.LayerCaption, existLayer);
            Insert_Layer(newName, nt, -1, 5, 50, Grid_Total.tOpe);
            Grid_Total.Layer = nt;
            tabSelect();
            Print_Grid_ViewSize();
            Print_Grid_Data();
            eventCall.evtAdd_Layer(nt);
        }
        function mnuTabRightMenuDeleteTab() {
            let mxt = Grid_Total.LayerNum;
            if (mxt == 1) { return }
            let nt = Grid_Total.Layer;
            let UndoData = new Undo_deleteLayer();
            UndoData.OriginLay = nt;
            UndoData.GridData = Grid_Property[Grid_Total.Layer].Clone();
            UndoData.caption = Grid_Total.LayerCaption + "の削除";
            UndoArray.push(UndoData);
            Delete_Layer(nt);
            Set_SSTAB_Name();
            let nnt;
            if (nt == mxt - 1) {
                nnt = nt - 1;
            } else {
                nnt = nt;
            }
            Grid_Total.Layer = nnt;
            tabMake();
            tabSelect();
            eventCall.evtChange_Layer(false, false, true);
            Print_Grid_ViewSize();
            Print_Grid_Data();
        }
    }

    function Swap_GridLay(L1,L2){
        let TempGridLay=Grid_Property[L1].Clone();
        Grid_Property[L1] = Grid_Property[L2].Clone();
        Grid_Property[L2] = TempGridLay;
    }

    /**レイヤを削除 */
    function Delete_Layer(DLay) {
        Grid_Total.LayerNum--;
        Grid_Property.splice(DLay,1);
        Grid_Property.length = Grid_Total.LayerNum;
    }

    function tabSelect(){
        for (let i = 0; i < tabbase.tab.length; i++) {
            if (Grid_Total.Layer == i) {
                tabbase.tab[i].style.backgroundColor = "#ffffff";            
            }else{
                tabbase.tab[i].style.backgroundColor = "#e1e1e1";

            }
        }
    }
    /**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
    //マウス操作
    function mdown(e) {
        e.preventDefault();
        let event;
        if (e.type === "mousedown") {
            event = e;
        } else {
            event = e.changedTouches[0];
        }
        MouseDownF = true;
        touchStartTime = new Date().getTime();
        mouseDownPosition = Generic.getCanvasXY2(event);
        let x = mouseDownPosition.x;
        let y = mouseDownPosition.y;
        let xx, yy
        let GR = GridResize;
        let GP = Grid_Property[Grid_Total.Layer];
        if (GR.Enable != 0) {
            let grresult = check_Width_Height_Change(x, y);
            GR.Enable = grresult.result;
            GR.GridX = grresult.ResizeX;
            GR.GridY = grresult.ResizeY;
            GR.LeftX = grresult.lX
            GR.TopY = grresult.lY;
            GridMouseDown = true;
        } else {
            if (txtTextBox.getVisibility() == true) {
                txtTextBox.setVisibility ( false);
                Set_Data_from_txtBox_To_Grid();
                Print_Grid_Data();
            }
            let p = GetGridXY(mouseDownPosition.x, mouseDownPosition.y, true);
            xx = p.x;
            yy = p.y;
            let rightButton = false;
            if (e.button == 2) { rightButton = true; }

            if (rightButton == false) { //左クリック
                if ((xx < -Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2
                ) && (yy < -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2)) { //左上端をクリック
                    GP.MouseDownX = -Grid_Total.FixedObjectName_n;
                    GP.MouseDownY = -Grid_Total.FixedDataItem_n;
                    GP.MouseUpX = GP.Xmax - 1;
                    GP.MouseUpY = GP.Ymax - 1;
                } else {
                    if ((xx == -Grid_Total.FixedObjectName_n) && (0 < Grid_Total.FixedObjectName_n)) {  //左端をクリック
                        GP.MouseDownX = -Grid_Total.FixedObjectName_n;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = GP.Xmax - 1;
                        GP.MouseUpY = GP.MouseDownY;
                        GP.MouseDown_Mode = 2;
                        GridMouseDown = true;
                    } else if ((yy == -Grid_Total.FixedDataItem_n) && (0 < Grid_Total.FixedDataItem_n)) {  //上端をクリック
                        GP.MouseDownX = xx
                        GP.MouseDownY = -Grid_Total.FixedDataItem_n;
                        GP.MouseUpX = GP.MouseDownX;
                        GP.MouseUpY = GP.Ymax - 1;
                        GP.MouseDown_Mode = 1;
                        GridMouseDown = true;
                    } else if ((yy < -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2) && (xx >= 0)) {
                        //上端の固定部分その２　ClickFixedYS2イベントを発生させる
                        GP.MouseDownX = xx;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = xx;
                        GP.MouseUpY = yy;
                        GridMouseDown = false
                        let CellLeft = GP.FixedObjectNameDataWidth();
                        for (let i = GP.LeftCell; i < xx; i++) {
                            CellLeft += GP.DataItemData[i].Width;
                        }
                        let Celltop = picGrid.offsetTop;
                        let Y2 = Grid_Total.FixedDataItem_n + yy;
                        for (let i = 0; i < Y2; i++) {
                            Celltop += GP.FixedDataItemData[i].Height;
                        }
                        let mpos=new point(event.clientX,event.clientY)
                        eventCall.evtClick_FixedYS2(Grid_Total.Layer, xx, Y2, GP.FixedDataItem[xx][ Y2].Text, Celltop, CellLeft, GP.DataItemData[xx].Width, GP.FixedDataItemData[Y2].Height,mpos);
                        return;
                    } else {
                        //グリッドのデータ部分
                        GP.MouseDownX = xx;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = xx;
                        GP.MouseUpY = yy;
                        GP.MouseDown_Mode = 0;
                        GridMouseDown = true;
                    }
                    picGrid.Capture = true;
                }
                if (xx < 0) {
                    GP.LeftCell = 0;
                    HScrollGrid_ValueSet();
                }
                if (yy < 0) {
                    GP.TopCell = 0;
                    VScrollGrid_ValueSet();
                }
                GP.SelectedF = true;
                Print_Grid_Data();

            } else { //右クリック
                if ((GP.SelectedF = true) && (((GP.MouseDownX <= xx) && (xx <= GP.MouseUpX)) || ((GP.MouseDownX >= xx) && (xx >= GP.MouseUpX))) && (
                    ((GP.MouseDownY <= yy) && (yy <= GP.MouseUpY)) || ((GP.MouseDownY >= yy) && (yy >= GP.MouseUpY)))) {
                    //右クリックで、選択範囲内をクリックした場合は範囲を変更しない
                } else {
                    if ((xx == -Grid_Total.FixedObjectName_n) && (yy == -Grid_Total.FixedDataItem_n)) { //左上端をクリック
                        GP.MouseDownX = xx;
                        GP.MouseDownY = yy;
                        GP.MouseUpX = GP.Xmax - 1;
                        GP.MouseUpY = GP.Ymax - 1;
                    } else {
                        if (xx == -Grid_Total.FixedObjectName_n) { //左端をクリック
                            GP.MouseDownX = xx;
                            GP.MouseDownY = yy;
                            GP.MouseUpX = GP.Xmax - 1;
                            GP.MouseUpY = GP.MouseDownY;
                            GP.MouseDown_Mode = 2;
                        } else if (yy == -Grid_Total.FixedDataItem_n) { //上端をクリック
                            GP.MouseDownX = xx;
                            GP.MouseDownY = yy;
                            GP.MouseUpX = GP.MouseDownX;
                            GP.MouseUpY = GP.Ymax - 1
                            GP.MouseDown_Mode = 1;
                        } else {
                            GP.MouseDownX = xx;
                            GP.MouseDownY = yy;
                            GP.MouseUpX = xx;
                            GP.MouseUpY = yy;
                        }
                    }
                }
                GP.SelectedF = true;
                Print_Grid_Data();
                rightClickmenu(e);
            }
        }
    }
    function mmove(e) {
        let event;
        e.preventDefault();
        if(txtTextBox.getVisibility()==true){return;}

        if (e.type === "mousemove") {
            event = e;
        } else {
            // if(mousePointingSituation == mousePointingSituations.pinch){
            //     pinchMove(e);
            //     return;
            // }
            if (e.changedTouches.length > 1) {
                e.preventDefault();
                // mousePointingSituation = mousePointingSituations.pinch;
                // pinch(e);
                return;
            } else {
                event = e.changedTouches[0];
            }
        }
        let p = Generic.getCanvasXY2(event);
        if(p==undefined){
            return;
        }
        let x = p.x;
        let y = p.y;

        if (GridMouseDown == false) {
            GridResize.Enable = check_Width_Height_Change(x, y).result;
            GridResize.tempImage= ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            if (GridResize.Enable != 0) {
                picGrid.style.cursor = 'crosshair';
            } else {
                picGrid.style.cursor = 'default';
                //マウス移動中にセルの値ツールチップ表示
                // GetGridXY(x, y, xx, yy, true)
                // let v  = Get_Data_from_Grid(Grid_Total.Layer, xx, yy)
                // if(ToolTip1.GetToolTip(picGrid) != v ){
                //     ToolTip1.SetToolTip(picGrid, v);
                // }
            }
            return;
        }

        if (GridResize.Enable != 0) {
            Print_GridResizeLine(x, y);
        } else {
            let GP = Grid_Property[Grid_Total.Layer];
            let f = false;
            if ((GP.MouseDownX == -Grid_Total.FixedObjectName_n) || (GP.MouseDownY == -Grid_Total.FixedDataItem_n)) {
                f = true;
            } else {
                f = false;
            }
            if (((y > picGrid.clientHeight - 30) || (x > picGrid.clientWidth - 30) || (y < GP.FixedDataItemHeight()) || (x < GP.FixedObjectNameDataWidth()))) {
                if (TimerObj == undefined) {
                    TimerObj = setInterval(TimerMouse, 250);
                }
                TimerVX = x;
                TimerVY = y;
            } else {
                clearInterval(TimerObj);
                TimerObj = undefined;
                let grp = GetGridXY(x, y, f);
                switch (GP.MouseDown_Mode) {
                    case 0:
                        GP.MouseUpX = grp.x;
                        GP.MouseUpY = grp.y;
                        break;
                    case 1:
                        GP.MouseUpX = grp.x;
                        break;
                    case 2:
                        GP.MouseUpY = grp.y;
                        break;
                }
                Print_Grid_Data();
            }
        }
    }

    /**キーダウン */
    function keydown(e) {
        if (txtTextBox.getVisibility() == true) {
            let op=new point(GX,GY);
            txtTextBox_KeyDown(e);
            let np=new point(GX,GY);
            if((op.Equals(np)==false)||((GY==Grid_Property[Grid_Total.Layer].Ymax-1)&&(e.keyCode==Keys.Enter))){
                //セルが移動した場合はイベント継続キャンセル
                e.preventDefault();
            }
            return;
        }
        let GP = Grid_Property[Grid_Total.Layer];
        let GPO = GP.Ope;
        let CTRL_Key = e.ctrlKey;
        let Shift_Key = e.shiftKey;
        if (((CTRL_Key == true) && (e.keyCode == Keys.ControlKey)) || (
            (Shift_Key == true) && (e.keyCode == Keys.ShiftKey))) {
            return;
        }
        if (CTRL_Key == true) {
            switch (e.keyCode) {
                case Keys.Z: //Ctrl+Z
                    Undo() ;
                    return;
                    break;
                case Keys.X: //Ctrl+X
                    if ((GPO.RightClickEnabled == true) && (GP.Ope.InputEnabled == true)) {
                        Grid_Copy();
                        Grid_Clear("切り取り")
                        return;
                    }
                    break;
                case Keys.C: //Ctrl+C
                        Grid_Copy()
                        return;
                    break;
                case Keys.V: //Ctrl+V
                    if ((GPO.RightClickEnabled == true) && (GP.Ope.InputEnabled == true)) {
                        // let clip  = System.Windows.Forms.Clipboard.GetText()
                        if (inClipboard != "") {
                            Grid_Paste(inClipboard, false);;
                            return;
                        }
                    }
                    break;
            }
        }


        if (GP.SelectedF == false) {
            return;
        }
        if ((e.keyCode == Keys.Delete) && (GP.Ope.InputEnabled == true)) {
            Grid_Clear("削除");
        } else {
            if (CTRL_Key == true) {
                //CTRL+カーソル／上下左右端にとぶ
                let x, y;
                if (Shift_Key == true) {
                    x = GP.MouseUpX;
                    y = GP.MouseUpY;
                } else {
                    x = GP.MouseDownX;
                    y = GP.MouseDownY;
                }
                if (e.keyCode == Keys.Left) {
                    x = 0;
                    GX = x;
                    GP.LeftCell = x;
                    HScrollGrid_ValueSet();
                }
                if (e.keyCode == Keys.Right) {
                    x = GP.Xmax - 1;
                    GX = x;
                    GP.LeftCell = x;
                    HScrollGrid_ValueSet()
                }
                if (e.keyCode == Keys.Up) {
                    y = 0;
                    GY = y;
                    GP.TopCell = y;
                    VScrollGrid_ValueSet();
                }
                if (e.keyCode == Keys.Down) {
                    y = GP.Ymax - 1;
                    GY = y;
                    GP.TopCell = y;
                    VScrollGrid_ValueSet();
                }
                if (Shift_Key == false) {
                    GP.MouseDownX = x;
                    GP.MouseDownY = y;
                }
                GP.MouseUpX = x;
                GP.MouseUpY = y;
                Print_Grid_Data()
            }
            if ((CTRL_Key == false) && (e.keyCode != Keys.Tab) && (Shift_Key == true)) {
                //SHIFT+カーソル／選択範囲移動
                Key_Move(e.keyCode, true);
                Print_Grid_Data();
            }
            if (((CTRL_Key == false) && (Shift_Key == false)) || ((e.keyCode == Keys.Tab))) {
                //通常の移動
                Key_Move(e.keyCode, Shift_Key);
                Print_Grid_Data();
            }
        }
    }

    function Key_Move(KeyCode, Shit_f) {

        let X, Y;
        let GP = Grid_Property[Grid_Total.Layer];
        if (Shit_f == true) {
            X = GP.MouseUpX;
            Y = GP.MouseUpY;
        } else {
            X = GP.MouseDownX;
            Y = GP.MouseDownY;
        }
        switch (KeyCode) {
            case Keys.Left:
            case Keys.Right:
            case Keys.Down:
            case Keys.Up:
            case Keys.Tab:
            case Keys.Return:
            case Keys.PageDown:
            case Keys.PageUp:
            case Keys.Home: {
                if ((KeyCode == Keys.Left) || ((KeyCode == Keys.Tab) && (Shit_f == true))) {
                    X--;
                }
                if ((KeyCode == Keys.Right) || ((KeyCode == Keys.Tab) && (Shit_f == false))) {
                    X++;
                }
                if (KeyCode == Keys.Up) {
                    Y--;
                }
                if ((KeyCode == Keys.Down)|| (KeyCode == Keys.Return)){
                    Y++;
                }
                if (KeyCode == Keys.PageDown) {
                    Y += 20;
                }
                if (KeyCode == Keys.PageUp) {
                    Y -= 20;
                }
                if (KeyCode == Keys.Home) {
                    X = 0;
                    Y = 0;
                }
                if (X >= GP.Xmax) {
                    X = GP.Xmax - 1;
                }
                if (X < -Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2) {
                    X = -Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2;
                }
                if (Y >= GP.Ymax) {
                    Y = GP.Ymax - 1;
                }
                if (Y < -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2) {
                    Y = -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2;
                }
                Scroll_Set(X, Y);

                GP.SelectedF = false;

                if ((Shit_f == false) || (KeyCode == Keys.Tab)) {
                    Print_Grid_Data();
                }
                GX = X;
                GY = Y;
                GP.SelectedF = true;
                if ((Shit_f == false) || (KeyCode == Keys.Tab)) {
                    GP.MouseDownX = GX;
                    GP.MouseDownY = GY;
                }
                GP.MouseUpX = GX;
                GP.MouseUpY = GY;
            }
        }
    }

    /**テキストボックス中でのキー操作 */
    function txtTextBox_KeyDown(e) {
        
        let CTRL_Key = e.ctrlKey;
        let Shift_Key = e.shiftKey;
        let ALT_Key = e.altKey;

        
        let GP = Grid_Property[Grid_Total.Layer];
        GX = GP.MouseDownX;
        GY = GP.MouseDownY;
        txtTextBox.Tag = "";
        let Tx = txtTextBox.value;
        if (e.keyCode == Keys.Enter) {
            if (ALT_Key == true) { //Alt+Enter
                let a = txtTextBox.selectionStart;
                if (Tx.length == a) {
                    txtTextBox.value = Tx + "\n";
                } else if (a == 0) {
                    txtTextBox.value = "\n" + Tx;
                } else {
                    txtTextBox.value = Tx.left(a) + "\n" + Tx.mid(a, undefined);
                }
                txtTextBox.selectionStart = a;
                return;
            }else{
                if(Tx.right(1)=="\n"){
                    txtTextBox.value = Tx.left(Tx.length - 1);
                }
            }
        }

        switch (e.keyCode) {
            case Keys.Left:
            case Keys.Up:
            case Keys.Right:
            case Keys.Down:
            case Keys.Enter:
            case Keys.Tab: {
                if ((GP.Ymax == 1) && (GX == 0) && (GY == 0) && ((e.keyCode == Keys.Enter) || (e.keyCode == Keys.Tab))) {
                    Set_Data_from_txtBox_To_Grid();
                    txtTextBox.setVisibility(false);
                    Print_Grid_Data();
                    return;
                }
                let tv = txtTextBox.value;
                if ((txtTextBox.selectionStart != tv.length) && ((e.keyCode == Keys.Left) || (e.keyCode == Keys.Right))) {
                    return;
                }
                if (e.keyCode == Keys.Left) {
                    return;
                }

                Set_Data_from_txtBox_To_Grid();
                Key_Move(e.keyCode, Shift_Key);
                if ((e.keyCode == Keys.Up) && (GY == -1) && (((GP.Ope.FixedYSEnabled == false) && (GX >= 0)
                ) || ((GP.Ope.FixedUpperLeftEnabeld == false) && (GX < 0)))) {
                    GP.SelectedF = true;
                    SetTextBox(GX, GY);
                    txtTextBox.setVisibility(false);
                } else {
                    SetTextBox(GX, GY);
                }
                break;
            }
            case Keys.Escape:
                GP.SelectedF = true;
                txtTextBox.setVisibility(false);
                Print_Grid_Data();
                break;
        }
    }

    function Scroll_Set(X, Y) {

        let GP = Grid_Property[Grid_Total.Layer];
        if ((GP.BottomCell - 1 < Y) && (Y <= GP.Ymax - 1)) {
            GP.TopCell++;
            VScrollGrid_ValueSet();
        } else if ((0 <= Y) && (Y < GP.TopCell)) {
            GP.TopCell = Y;
            VScrollGrid_ValueSet();
        }
        if ((GP.RightCell < X) && (X <= GP.Xmax - 1)) {
            GP.LeftCell++;
            HScrollGrid_ValueSet();
        } else if ((X < GP.LeftCell) && (X >= 0)) {
            GP.LeftCell = X;
            HScrollGrid_ValueSet();
        }
    }

    function mup(e) {
        e.preventDefault();
        let event;

        if ((e.type === "mouseup") ||(e.type === "mouseleave")){
             event = e;
        } else {
             event = e.changedTouches[0];
        }
        let xx, yy
        let f=false;
        let mouseUpPosition = Generic.getCanvasXY2(event);

        if(mouseUpPosition==undefined){
            return;
        }
        let x = mouseUpPosition.x
        let y = mouseUpPosition.y

        if (GridMouseDown == true) {
            GridMouseDown = false;
            if (GridResize.Enable != 0) {
                Grid_Resize_MouseUp(x, y);
                GridResize.Enable = 0;
            } else {
                clearInterval(TimerObj);
                TimerObj=undefined;
                picGrid.Capture = false;
                let GP = Grid_Property[Grid_Total.Layer];
                let p = GetGridXY(x, y, f);
                xx = p.x;
                yy = p.y;
                let touchTime = (new Date().getTime() - touchStartTime) / 1000;
                if ((e.type === "touchend")  && (touchTime > 0.5)&&(GP.MouseDownX == xx) && (GP.MouseDownY == yy) ) {
                    //タッチで0.5秒以上移動しない場合は右クリック
                    rightClickmenu(new point(event.clientX,event.clientY));
                    return;
                }

                if ((GP.MouseDownX == xx) && (GP.MouseDownY == yy) && (GP.MouseDown_Mode == 0)) {
                    if ((yy == GP.BottomCell) && (yy < GP.Ymax - 1)) {
                        GP.TopCell++;
                        VScrollGrid_ValueSet();
                        Print_Grid_Data();
                    }
                    if ((xx == GP.RightCell) && (xx < GP.Xmax - 1)) {
                        GP.LeftCell++;
                        HScrollGrid_ValueSet();
                        Print_Grid_Data();
                    }
                    if ((GX == xx) && (GY == yy) && (GP.Ope.InputEnabled == true)) {
                        if (((xx < 0) && (yy >= 0) && (GP.Ope.FixedXSEnabled == false)) ||
                            ((xx >= 0) && (yy < 0) && (GP.Ope.FixedYSEnabled == false)) ||
                            ((xx < 0) && (yy < 0) && (GP.Ope.FixedUpperLeftEnabeld == false))) {
                            //固定部分が編集できない状態
                        } else {
                            Print_Grid_Data();
                            SetTextBox(GP.MouseDownX, GP.MouseDownY);
                        }
                    } else {
                        GX = xx;
                        GY = yy;
                        if ((xx >= 0) && (yy >= 0) && (GP.Ope.InputEnabled == false)) {
                            let CellLeft = GP.FixedObjectNameDataWidth();
                            for (let i = GP.LeftCell; i < xx; i++) {
                                CellLeft += GP.DataItemData[i].Width;
                            }
                            let Celltop = GP.FixedDataItemHeight();
                            for (let i = 0; i < yy; i++) {
                                Celltop += GP.CellHeight[i];
                            }
                            eventCall.evtClick_DataGrid(Grid_Total.Layer, xx, yy, GP.Grid_Text[xx][ yy].Text, Celltop, CellLeft, GP.DataItemData[xx].Width, GP.CellHeight[yy]);
                        }
                    }
                }
            }
        }
    }

    function TimerMouse() {
        let GP = Grid_Property[Grid_Total.Layer];
        let V = GP.TopCell;
        let H = GP.LeftCell;
        let omuX=GP.MouseUpX;
        let omuY=GP.MouseUpY;
        if (GP.MouseDownX != -Grid_Total.FixedObjectName_n) {
            if (TimerVX < GP.FixedObjectNameDataWidth()) {
                if (H == 0) {
                    GP.MouseUpX = GetGridX(TimerVX, false);
                } else {
                    GP.LeftCell = H - 1;
                    HScrollGrid_ValueSet();
                    GP.MouseUpX = H - 1;
                }
            } else if (TimerVX > picGrid.clientWidth-30) {
                if (H < GP.Xmax - 1) {
                    GP.LeftCell = H + 1;
                    HScrollGrid_ValueSet();
                    GP.MouseUpX = GP.RightCell+1;
                }
            } else {
                    GP.MouseUpX = GetGridX(TimerVX, false);
                }
        }
        if (GP.MouseDownY >= -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2) {
            let sa;
            if (TimerVY < GP.FixedDataItemHeight()) {
                if (V == 0) {
                    GP.MouseUpY = GetGridY(TimerVY, false);
                } else {
                    sa = Math.floor((GP.FixedDataItemHeight() - TimerVY) / 10) + 1;
                    GP.TopCell = V - sa;
                    if (GP.TopCell < 0) {
                        GP.TopCell = 0;
                    }
                    VScrollGrid_ValueSet();
                    GP.MouseUpY = V - sa;
                }
            } else if (TimerVY > picGrid.clientHeight - 30) {
                if (V < GP.Ymax - 1) {
                    sa = Math.floor((TimerVY - (picGrid.clientHeight - 30)) / 10) + 1;
                    GP.TopCell = V + sa;
                    if (GP.TopCell > GP.Ymax - 1) {
                        GP.TopCell = GP.Ymax - 1;
                    }
                    VScrollGrid_ValueSet();
                    GP.MouseUpY = GP.BottomCell + sa;
                    if (GP.MouseUpY > GP.Ymax - 1) {
                        GP.MouseUpY = GP.Ymax - 1;
                    }
                }
            }
            else {
                GP.MouseUpY = GetGridY(TimerVY, false);
                
            }
            switch (GP.MouseDown_Mode) {
                case 1:
                    GP.MouseUpY = GP.Ymax - 1;
                    break;
                case 2:
                    GP.MouseUpX = GP.Xmax - 1;
                    break;
            }
        }
        if ((GP.TopCell != V) || (GP.LeftCell != H)||(omuX != GP.MouseUpX) || (omuY != GP.MouseUpY)) {
            Print_Grid_Data();

        }
    }

    function mleave(){

    }

    function VScrollGrid_ValueSet() {
        let GP = Grid_Property[Grid_Total.Layer];
        let y = 0;
        for (let i = 0; i < GP.TopCell; i++) {
            y += GP.CellHeight[i];
        }
        vScroll.setPosition(  y+1);
    }
    function HScrollGrid_ValueSet() {
        let GP = Grid_Property[Grid_Total.Layer];
        let x = 0;
        for (let i = 0; i < GP.LeftCell; i++) {
            x += GP.DataItemData[i].Width;
        }
        hScroll.setPosition( x+1); 
    }

    /** グリッド上のマウスカーソルが列・行の境界線上にあるかどうかを調べる 0を返す/変更できない位置、1/行高変更可、2/列幅変更可　*/
    function check_Width_Height_Change(mx, my) {

        let i, s
        let H, w
        let OV;
        let lX, lY
        let ResizeX;
        let ResizeY;
        let result = 0;
        let GP = Grid_Property[Grid_Total.Layer];
        if (mx < GP.FixedObjectNameDataWidth()) {
            //行高変更位置
            if ((my <= GP.FixedDataItemHeight() + 2) && (0 < GP.FixedDataItemHeight())) {
                i = 0;
                H = 0;
                do {
                    OV = H;
                    H += GP.FixedDataItemData[i].Height;
                    s = Math.abs(my - H);
                    i++;
                } while ((i < Grid_Total.FixedDataItem_n) && (s > 2))
                i = (i - 1) - Grid_Total.FixedDataItem_n;
            } else {
                i = GP.TopCell;
                H = GP.FixedDataItemHeight();
                do {
                    OV = H;
                    H = H + GP.CellHeight[i];
                    s = Math.abs(my - H);
                    i++;
                } while ((i <= GP.BottomCell) && (s > 2))
                i--;
            }
            if (s <= 2) {
                result = 1;
                lY = OV;
                ResizeY = i;
            }
        }
        if (my < GP.FixedDataItemHeight()) {
            //列幅変更位置
            if (mx <= GP.FixedObjectNameDataWidth() + 2) {
                i = 0;
                w = 0;
                do {
                    OV = w;
                    w = w + GP.FixedObjectNameData[i].Width;
                    s = Math.abs(mx - w);
                    i++;
                } while ((i < Grid_Total.FixedObjectName_n) && (s > 2))
                i = (i - 1) - Grid_Total.FixedObjectName_n;
            } else {
                i = GP.LeftCell;
                w = GP.FixedObjectNameDataWidth();
                do {
                    OV = w;
                    w = w + GP.DataItemData[i].Width;
                    s = Math.abs(mx - w);
                    i++;
                } while ((i <= GP.RightCell) && (s > 2))
                i--;
            }
            if (s <= 2) {
                result = 2;
                lX = OV;
                ResizeX = i;
            }
        }
        return { result: result, ResizeX: ResizeX, ResizeY: ResizeY, lX: lX, lY: lY };
    }

    
    function Print_GridResizeLine(mox, moy) {
        let w, H;
        ctx.putImageData(GridResize.tempImage, 0, 0);
        ctx.lineWidth =0.5;
        ctx.strokeStyle ='black';
        switch (GridResize.Enable) {
            case 1: {
                //1/行高変更可
                w = picGrid.offsetWidth;
                ctx.beginPath();
                ctx.moveTo(0,GridResize.TopY);
                ctx.lineTo(w,GridResize.TopY);
                if (moy <= GridResize.TopY) {
                    moy = GridResize.TopY + 1
                }
                ctx.moveTo(0,moy);
                ctx.lineTo(w,moy);
                ctx.stroke();
                break;
            }
            case 2: {
                //2/列幅変更
                H = picGrid.offsetHeight;
                ctx.beginPath();
                ctx.moveTo(GridResize.LeftX,0);
                ctx.lineTo(GridResize.LeftX,H);
                if (mox <= GridResize.LeftX) {
                    mox = GridResize.LeftX + 1;
                }
                ctx.moveTo(mox,0);
                ctx.lineTo(mox,H);
                ctx.stroke();
                break;
            }
        }
    }

    function Grid_Resize_MouseUp(X, Y) {
        let S1, s2, T, TY, tx;
        let w, H;

        let GP = Grid_Property[Grid_Total.Layer]
        switch (GridResize.Enable) {
            case 1: {
                //行高変更位置
                TY = GridResize.GridY
                T = GridResize.TopY
                H = (Y - T) + 1
                H = Math.max(2, H)
                if (GP.SelectedF == true) {
                    let rect = GP.MouseUpDownRect();
                    S1 = rect.top;
                    s2 = rect.bottom;
                    if ((S1 <= TY) && (TY <= s2)) {
                    } else {
                        S1 = TY;
                        s2 = TY;
                    }
                } else {
                    S1 = TY;
                    s2 = TY;
                }
               SetUndo_ChangeRowHeight(Grid_Total.Layer, S1, s2);
                ChangeRowHeight(Grid_Total.Layer, S1, s2, H);
                break;
            }
            case 2: {
                //列幅変更位置
                tx = GridResize.GridX;
                T = GridResize.LeftX;
                w = (X - T) + 1;
                w = Math.max(3, w);
                if (GP.SelectedF == true) {
                    let rect = GP.MouseUpDownRect();
                    S1 = rect.left;
                    s2 = rect.right;
                    if ((S1 <= tx) && (tx <= s2)) {
                    } else {
                        S1 = tx;
                        s2 = tx;
                    }
                } else {
                    S1 = tx;
                    s2 = tx;
                }
               SetUndo_ChangeColumnWidth(Grid_Total.Layer, S1, s2);
                ChangeColumnWidth(Grid_Total.Layer, S1, s2, w);
                break;
            }
        }
        Print_Grid_ViewSize();
        Print_Grid_Data();
    }

    function ChangeRowHeight(Layer, top, bottom, Height) {
        let GP = Grid_Property[Layer];
        for (let i = top; i <= bottom; i++) {
            if (i < 0) {
                if(Array.isArray(Height)){
                    GP.FixedDataItemData[i + Grid_Total.FixedDataItem_n].Height = Height[i - top];
                }else{
                    GP.FixedDataItemData[i + Grid_Total.FixedDataItem_n].Height = Height;
                }
            } else {
                if(Array.isArray(Height)){
                    GP.CellHeight[i] = Height[i - top];
                }else{
                    GP.CellHeight[i] = Height;
                }
            }
        }
    }

    function ChangeColumnWidth(Layer, left, right, Width) {
        let GP = Grid_Property[Layer];
        for (let i = left; i <= right; i++) {
            if (i < 0) {
                if(Array.isArray(Width)){
                    GP.FixedObjectNameData[i + Grid_Total.FixedObjectName_n].Width = Width[i - left];
                }else{
                    GP.FixedObjectNameData[i + Grid_Total.FixedObjectName_n].Width = Width;
                }
            } else {
                if(Array.isArray(Width)){
                    GP.DataItemData[i].Width = Width[i - left];
                }else{
                    GP.DataItemData[i].Width = Width;
                }
            }
        }
    }

    function SetUndo_ChangeColumnWidth(Layer, left, right, Width) {
        let UndoData=new Undo_ChangeColumnWidth();
        let oldW = [];
        let GP = Grid_Property[Layer];
        for (let i = left; i <= right;i++) {
            if (i < 0) {
                oldW[i - left] = GP.FixedObjectNameData[i + Grid_Total.FixedObjectName_n].Width;
            } else {
                oldW[i - left] = GP.DataItemData[i].Width;
            }
        }
        UndoData.caption = "幅変更";
        UndoData.Layer = Layer;
        UndoData.Width = oldW;
        UndoData.Left = left;
        UndoData.Right = right;
        UndoArray.push(UndoData);
    }

    function GetGridXY(MouseX, MouseY, ZaroLine_F) {
        const GridX = GetGridX(MouseX, ZaroLine_F);
        const GridY = GetGridY(MouseY, ZaroLine_F);
        return new point(GridX, GridY)
    }

    function GetGridX(MouseX, ZaroLine_F) {
        let GridX;
        let GP = Grid_Property[Grid_Total.Layer];
        let w = 0;
        if (MouseX < GP.FixedObjectNameDataWidth()) {
            for (let i = 0; i < Grid_Total.FixedObjectName_n; i++) {
                w += GP.FixedObjectNameData[i].Width
                if (MouseX < w) {
                    GridX = -(Grid_Total.FixedObjectName_n - i)
                    break;
                }
            }
            if ((ZaroLine_F == false) && (GridX < -Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2)) {
                GridX = -Grid_Total.FixedObjectName_n + Grid_Total.FixedObjectName_n2;
            }
        } else {
            w = GP.FixedObjectNameDataWidth();
            GridX = GP.RightCell;
            for (let i = GP.LeftCell; i <=GP.RightCell ; i++) {
                w += GP.DataItemData[i].Width;
                if (MouseX < w) {
                    GridX = i;
                    break;
                }
            }
        }
        return GridX;
    }

    function GetGridY(MouseY, ZaroLine_F) {
        let GridY;
        let H = 0;

        let GP = Grid_Property[Grid_Total.Layer];
        if (MouseY < GP.FixedDataItemHeight()) {
            for (let i = 0; i < Grid_Total.FixedDataItem_n; i++) {
                H += GP.FixedDataItemData[i].Height;
                if (MouseY < H) {
                    GridY = -(Grid_Total.FixedDataItem_n - i);
                    break;
                }
            }
            if ((ZaroLine_F == false) && (GridY < -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2)) {
                GridY = -Grid_Total.FixedDataItem_n + Grid_Total.FixedDataItem_n2;
            }
        } else {
            H = GP.FixedDataItemHeight();
            GridY = GP.BottomCell
            for (let i = GP.TopCell; i <= GP.BottomCell; i++) {
                H += GP.CellHeight[i];
                if (MouseY < H) {
                    GridY = i;
                    break;
                }
            }
        }
        return GridY;
    }

    function Undo(){
        let n=UndoArray.length-1;
        if(n==-1){
            return;
        }
        let itm = UndoArray[n];
        switch (true) {
            case (itm instanceof Undo_InputCopyPasteClearInfo): {
                SetGrid_UndoData(itm.Layer, itm.Rect, itm.GridData);
                break;
            }
            case (itm instanceof Undo_InsertRows): {
                DeleteRows(itm.Layer, itm.Top, itm.Bottom - itm.Top + 1);
                eventCall.evtChange_FixedXS();
                break;
            }
            case (itm instanceof Undo_InsertColumns): {
                DeleteColumns(itm.Layer, itm.Left, itm.Right - itm.Left + 1);
                eventCall.evtChange_FixedYS();
                break;
            }
            case (itm instanceof Undo_DeleteRows): {
                let Dn = itm.Bottom - itm.Top + 1;
                InsertRows(itm.Layer, itm.Top, Dn);
                eventCall.evtChange_FixedXS();
                SetGrid_UndoData(itm.Layer, new rectangle(-Grid_Total.FixedObjectName_n, Grid_Property[itm.Layer].Xmax - 1, itm.Top, itm.Bottom), itm.GridData);
                break;
            }
            case (itm instanceof Undo_DeleteColumns): {
                let Dn = itm.Right - itm.Left + 1;
                InsertColumns(itm.Layer, itm.Left, Dn);
                eventCall.evtChange_FixedYS();
                SetGrid_UndoData(itm.Layer, new rectangle(itm.Left, itm.Right, -Grid_Total.FixedDataItem_n, Grid_Property[itm.Layer].Ymax - 1), itm.GridData);
                break;
            }
            case (itm instanceof Undo_ChangeRowHeight): {
                ChangeRowHeight(itm.Layer, itm.Top, itm.Bottom, itm.Height);
                Print_Grid_ViewSize();
                break;
            }

            case (itm instanceof Undo_ChangeColumnWidth): {
                ChangeColumnWidth(itm.Layer, itm.Left, itm.Right, itm.Width);
                break;
            }
            case (itm instanceof Undo_ChangeColumnWidth): {
                ChangeColumnWidth(itm.Layer, itm.Left, itm.Right, itm.Width);
                Print_Grid_ViewSize()
                break;
            }
            case (itm instanceof Undo_ChangeLayerName): {
                let GP = Grid_Property[itm.Layer];
                GP.LayerName = itm.Name;
                Set_SSTAB_Name();
                break;
            }
            case (itm instanceof Undo_SwapLayer): {
                Swap_GridLay(itm.Layer1, itm.Layer2);
                Set_SSTAB_Name();
                tabSelect();
                break;
            }
            case (itm instanceof Undo_MoveLayer): {
                let TempGridLay = Grid_Property[itm.DestLay].Clone();
                Grid_Property.splice(itm.DestLay, 1);
                Grid_Property.splice(itm.OriginLay, 0, TempGridLay);
                Grid_Total.Layer = itm.OriginLay;
                Set_SSTAB_Name();
                tabSelect();
                Print_Grid_ViewSize();
                break;
            }
            case (itm instanceof Undo_deleteLayer): {
                Grid_Total.LayerNum++;
                Grid_Property.splice(itm.OriginLay, 0, itm.GridData);
                tabMake();
                Set_SSTAB_Name();
                Grid_Total.Layer = itm.OriginLay
                tabSelect();
                Print_Grid_ViewSize();
                break;
            }
            case (itm instanceof Undo_InsertLayer): {
                Delete_Layer(itm.Layer);
                Set_SSTAB_Name();
                let nnt;
                if (itm.Layer == Grid_Total.LayerNum) {
                    nnt = itm.Layer - 1;
                } else {
                    nnt = itm.Layer;
                }
                Grid_Total.Layer = nnt;
                break;
            }
        }
        UndoArray.pop();
        Print_Grid_Data();
    }
    function SetGrid_UndoData(Layer,rect,GridData){
        let  SN  = 0;
        let cst = GridData.split("\t");
        for (let i = rect.top; i <= rect.bottom; i++) {
            for (let j = rect.left; j <= rect.right; j++) {
                 Set_Data_To_Grid(Layer, j, i, cst[SN], true);
                SN++;
            }
        }
    }
}



/**■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
/**　スクロールバーコントロール type:0縦、type1横　_areaRange:中身の大きさ*/
let scrollBar = function (ParentObj, x, y, size, length, type, _maxValue, _areaRange, largeChange, smallChange, changeEventCall) {

    let maxValue = _maxValue;
    let position = 0;
    let areaRange = _areaRange;
    let frame;
    let slideFrame;
    let slider;
    let slength = length - size*2;
    let slideArea;
    let sliderSize;
    let btnPlusCanvas;
    const arrowCol = "#555555";
    const backCol = "#eeeeee";
    const sliderCol = "#bbbbbb";
    let btnMDownF = false;
    let btnDownTimer;
    let btnDownID;
    if (type == 0) {//縦
        frame = Generic.createNewDiv(ParentObj, "", "", "", x, y, size, length, "background-color:" + backCol, undefined);
        let btnMinusCanvas = Generic.createNewCanvas(frame, "tateMinus", "", 0, 0, size, size , undefined, "");
        btnMinusCanvas.addEventListener('mousedown', btnMdown);
        btnMinusCanvas.addEventListener('mouseup', btnMup);
        btnMinusCanvas.addEventListener('mouseleave', btnMup);
        btnMinusCanvas.addEventListener("touchstart",btnMdown);
        btnMinusCanvas.addEventListener("touchend",btnMup);

        let ctxBtnMinus = btnMinusCanvas.getContext("2d");
        ctxBtnMinus.strokeStyle = arrowCol;
        ctxBtnMinus.lineWidth = 2;
        ctxBtnMinus.beginPath();
        ctxBtnMinus.moveTo(size * 0.3, size * 0.4+size/4);
        ctxBtnMinus.lineTo(size / 2, +size/4);
        ctxBtnMinus.lineTo(size * 0.7, size * 0.4+size/4);
        ctxBtnMinus.stroke();
        btnPlusCanvas = Generic.createNewCanvas(frame, "tatePlus", "", 0, length - size , size, size , undefined, "");
        btnPlusCanvas.addEventListener('mousedown', btnMdown);
        btnPlusCanvas.addEventListener('mouseup', btnMup);
        btnPlusCanvas.addEventListener('mouseleave', btnMup);
        btnPlusCanvas.addEventListener("touchstart",btnMdown);
        btnPlusCanvas.addEventListener("touchend",btnMup);
        let ctxBtnPlus = btnPlusCanvas.getContext("2d");
        ctxBtnPlus.strokeStyle = arrowCol;
        ctxBtnPlus.lineWidth = 2;
        ctxBtnPlus.beginPath();
        ctxBtnPlus.moveTo(size * 0.3, size * 0.1+size/4);
        ctxBtnPlus.lineTo(size / 2, size -size/4);
        ctxBtnPlus.lineTo(size * 0.7, size * 0.1+size/4);
        ctxBtnPlus.stroke();
        slideFrame = Generic.createNewDiv(frame, "", "slideFrame", "", 0, size, size, slength, "", undefined);
        sliderSize = Math.max(areaRange / maxValue * slength, size );
        slider = Generic.createNewDiv(slideFrame, "", "slider", "", 0, 0, size, sliderSize, "background-color:" + sliderCol, undefined);
        slideArea = slength - sliderSize;
    } else {//横
        frame = Generic.createNewDiv(ParentObj, "", "", "", x, y, length, size, "background-color:" + backCol, undefined);
        let btnMinusCanvas = Generic.createNewCanvas(frame, "yokoMinus", "", 0, 0, size , size, undefined, "");
        btnMinusCanvas.addEventListener('mousedown', btnMdown);
        btnMinusCanvas.addEventListener('mouseup', btnMup);
        btnMinusCanvas.addEventListener('mouseleave', btnMup);
        btnMinusCanvas.addEventListener("touchstart",btnMdown);
        btnMinusCanvas.addEventListener("touchend",btnMup);
        let ctxBtnMinus = btnMinusCanvas.getContext("2d");
        ctxBtnMinus.strokeStyle = arrowCol;
        ctxBtnMinus.lineWidth = 2;
        ctxBtnMinus.beginPath();
        ctxBtnMinus.moveTo(size * 0.4+size/4, size * 0.3);
        ctxBtnMinus.lineTo(+size/4, size / 2);
        ctxBtnMinus.lineTo(size * 0.4+size/4, size * 0.7);
        ctxBtnMinus.stroke();
        btnPlusCanvas = Generic.createNewCanvas(frame, "yokoPlus", "", length - size , 0, size , size, undefined, "");
        btnPlusCanvas.addEventListener('mousedown', btnMdown);
        btnPlusCanvas.addEventListener('mouseup', btnMup);
        btnPlusCanvas.addEventListener('mouseleave', btnMup);
        btnPlusCanvas.addEventListener("touchstart",btnMdown);
        btnPlusCanvas.addEventListener("touchend",btnMup);
        let ctxBtnPlus = btnPlusCanvas.getContext("2d");
        ctxBtnPlus.strokeStyle = arrowCol;
        ctxBtnPlus.lineWidth = 2;
        ctxBtnPlus.beginPath();
        ctxBtnPlus.moveTo(size * 0.4, size * 0.3);
        ctxBtnPlus.lineTo(size * 0.8, size / 2);
        ctxBtnPlus.lineTo(size * 0.4, size * 0.7);
        ctxBtnPlus.stroke();
        slideFrame = Generic.createNewDiv(frame, "", "slideFrame", "", size, 0, slength, size, "", undefined);
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slider = Generic.createNewDiv(slideFrame, "", "", "slider", 0, 0, sliderSize, size, "background-color:" + sliderCol, undefined);
        slideArea = slength - sliderSize;
    }
    slideFrame.addEventListener('mousedown', mdown);
    
    slideFrame.addEventListener("touchstart",mdown, false);
    slideFrame.addEventListener("touchmove", mmove, {passive:false});
    slideFrame.addEventListener("touchend",mup, false)
    addEvent();
    
    /**長さを変更 */
    this.setLength = function (newLength) {
        length = newLength;
        slength = length - size*2;
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slideArea = slength - sliderSize;
        if (type == 0) {//縦
            frame.style.height = length.px();
            btnPlusCanvas.style.top = (length - size ).px();
            slideFrame.style.height =slength.px();
        } else {
            frame.style.width = length.px();
            btnPlusCanvas.style.left = (length - size ).px();
            slideFrame.style.width = slength.px();
        }
        setSliderPosition();
    }

    /**表示非表示 */
    this.setVisibility = function(visiflag){
        if (visiflag == true) {
            addEvent();
            frame.style.display = "inline";
        } else {
            removeEvent()
            frame.style.display = 'none';
        }
    }

    /**スクロールバーの位置設定 */
    this.setXY = function (x, y) {
        frame.style.left = x.px()
        frame.style.top = y.px()
    }

    /**スクロールバーの位置取得 */
    this.getXY = function (x, y) {
        return new point(frame.style.left.removePx(), frame.style.top.removePx());
    }

    /**スライダーの位置を設定 */
    this.setPosition = function (newPosition) {
        position = newPosition;
        setSliderPosition();
    }

    /**スライダーの位置を取得 */
    this.getPosition = function () {
        return position;
    }

    /**最大値を設定 */
    this.setMaxValue = function (newMax) {
        maxValue = newMax;
        if (position > maxValue) {
            position = maxValue;
        }
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slideArea = slength - sliderSize;
        setSliderPosition();
    }

    /**最大値を取得 */
    this.getMaxValue = function () {
        return maxValue;
    }

    /**エリアレンジを設定 */
    this.setAreaRange = function (newAreaRange) {
        areaRange = newAreaRange;
        sliderSize = Math.max(areaRange / maxValue * slength, size);
        slideArea = slength - sliderSize;
        setSliderPosition();
    }

    /**エリアレンジを取得 */
    this.getAreaRange = function () {
        return areaRange;
    }

    /**document要素のイベントを削除 */
    this.removeEventlister = function () {
        removeEvent();
    }
    /**document要素のイベントを追加 */
    this.addEventlister = function () {
        addEvent();
    }
    function setSliderPosition() {
        if (type == 0) {//縦
            slider.style.top = (position / maxValue * slideArea).px()
            slider.style.height = sliderSize.px();
        } else {
            slider.style.left = (position / maxValue * slideArea).px();
            slider.style.width = sliderSize.px();
        }
    }

    function btnMdown(e) {
        if (btnMDownF == false) {
            btnMDownF = true;
            btnDownID = e.target.id;
            btnDownTimer = setInterval(timerButton, 50)
        }
    }
    function timerButton() {
        let opos = position;
        switch (btnDownID) {
            case "tateMinus":
                position -= smallChange;
                position = Math.max(position, 0);
                slider.style.top = (position / maxValue * slideArea).px()
                break;
            case "tatePlus":
                position += smallChange;
                position = Math.min(position, maxValue);
                slider.style.top = (position / maxValue * slideArea).px()
                break;
            case "yokoMinus":
                position -= smallChange;
                position = Math.max(position, 0);
                slider.style.left = (position / maxValue * slideArea).px()
                break;
            case "yokoPlus":
                position += smallChange;
                position = Math.min(position, maxValue);
                slider.style.left = (position / maxValue * slideArea).px()
                break;
        }
        if (opos != position) {
            changeEventCall(position);
        }
    }

    function btnMup(e) {
        if (btnMDownF == true) {
            btnMDownF = false;
            clearInterval(btnDownTimer);
            timerButton();
        }
        
    }

    function wheel(e) {
        let opos = position;
        if (type == 0) {//縦
            position += smallChange * e.deltaY;
        } else {
            position += smallChange * e.deltaX;
        }
        position = Math.max(position, 0);
        position = Math.min(position, maxValue);
        if (opos != position) {
            setSliderPosition();
            changeEventCall(position);
        }
    }

    function addEvent() {
            document.addEventListener('mousemove', mmove);
            document.addEventListener('mouseup', mup);
            document.addEventListener('mouseup', btnMup);
            document.addEventListener('wheel', wheel);
    }

    function removeEvent() {
            document.removeEventListener('mousemove', mmove);
            document.removeEventListener('mouseup', mup);
            document.removeEventListener('mouseup', btnMup);
            document.removeEventListener('wheel', wheel);
    }


    let mdownF = false;
    let sliderInPosition;//-1,0,1
    let mDownsliderInPosition;
    let mdownPos;
    function mdown(event) {
        let e;
        if (event.type === "mousedown") {
            e = event ;
        } else {
            e = event.changedTouches[0];
        }

        if (type == 0) {//縦
            mdownPos = e.clientY - slideFrame.getBoundingClientRect().y;
        } else {
            mdownPos = e.clientX - slideFrame.getBoundingClientRect().x;
        }
        mdownF = true;
        sliderInF = false;
        if (type == 0) {//縦
            // mdownPos = p.y;
            let p1 = slider.style.top.removePx();
            if ((p1 < mdownPos) && (mdownPos < p1 + slider.clientHeight)) {
                sliderInPosition = 0;
                mDownsliderInPosition = slider.style.top.removePx();
            } else if (p1 < mdownPos) {
                sliderInPosition = 1;
            } else {
                sliderInPosition = -1;
            }
        } else {//横
            // mdownPos = p.x;
            let p1 = slider.style.left.removePx();
            if ((p1 < mdownPos) && (mdownPos < p1 + slider.clientWidth)) {
                sliderInPosition = 0;
                mDownsliderInPosition = slider.style.left.removePx();
            } else if (p1 < mdownPos) {
                sliderInPosition = 1;
            } else {
                sliderInPosition = -1;
            }
        }
    }

    function mmove(event) {
        let e;
        if (event.type === "mousemove") {
            e = event ;
        } else {
            e = event.changedTouches[0];
        }
        if ((mdownF == false) || (sliderInPosition != 0)) {
            return;
        }
        let mdMovePos;
        if (type == 0) {//縦
            mdMovePos = e.clientY - slideFrame.getBoundingClientRect().y;
        } else {
            mdMovePos = e.clientX - slideFrame.getBoundingClientRect().x;
        }
        let moveAmount = mdownPos - mdMovePos;
        let bpos = mDownsliderInPosition - moveAmount;
        bpos = Math.min(bpos, slideArea);
        bpos = Math.max(bpos, 0);
        if (type == 0) {//縦
            slider.style.top = bpos.px();
        } else {
            slider.style.left = bpos.px()
        }
        position = bpos * maxValue / slideArea;
        changeEventCall(position);
    }

    function mup(event) {
        let e;
        if (event.type === "mouseup"){
            e = event ;
        } else {
            e = event.changedTouches[0];
        }
        if (type == 0) {//縦
            mdUpPos = e.clientY - slideFrame.getBoundingClientRect().y;
        } else {
            mdUpPos = e.clientX - slideFrame.getBoundingClientRect().x;
        }

        if (Math.abs(mdUpPos - mdownPos) < 5) {
            if (sliderInPosition != 0) {
                if (type == 0) {//縦
                    if (sliderInPosition == -1) {
                        position -= largeChange;
                        position = Math.max(position, 0);
                    } else {
                        position += largeChange;
                        position = Math.min(position, maxValue);
                    }
                    slider.style.top = (position / maxValue * slideArea).px();
                } else {//横
                    if (sliderInPosition == -1) {
                        position -= largeChange;
                        position = Math.max(position, 0);
                    } else {
                        position += largeChange;
                        position = Math.min(position, maxValue);
                    }
                    slider.style.left = (position / maxValue * slideArea).px()
                }
                changeEventCall(position);
            }
        }
        mdownF = false;
    }
}