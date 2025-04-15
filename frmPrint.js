const mousePointingSituations = {
    down: 0,
    move: 1,
    up: 2,
    downAndMove: 3,
    pinch:4
}

const enmPrintMouseMode = {
    Normal: 0,
    PlusMinus: 1,
    Fig: 2,
    SymbolPoint: 3,
    LabelPoint: 4,
    RangePrint: 5,
    Accessory_Drag: 7,
    Distance: 9,
    od: 10,
    DistanceObject: 11,
    MultiObjectSelect: 12
}

const Check_Acc_Result = {
    NoAccessory: 0,
    Title: 1,
    Compass: 2,
    Scale: 3,
    Legend: 4,
    GroupBox: 5,
    Note: 6
}

var mapMouse = function (elem, callback) {

    let MouseDownF = false;
    let mousePointingSituation = mousePointingSituations.up;
    let mouseDownPosition;
    let mousePreviousPosition;
    let touchStartTime;
    elem.addEventListener("mousedown", mdown, false);
    elem.addEventListener("touchstart", mdown, {passive:false});
    elem.addEventListener("mousemove", mmove, false);
    elem.addEventListener("touchmove", mmove, {passive:false});
    elem.addEventListener("mouseup", mup, false);
    elem.addEventListener("touchend", mup, {passive:false});
    elem.addEventListener("mouseleave", mup, false);
    let mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    elem.addEventListener(mousewheelevent, onWheel, false);
    var g = elem.getContext('2d');

    //出力画面でのキー操作
    document.addEventListener('keydown', function (e) {
        let elm = document.getElementsByName("backDiv");
        if (elm.length == 0) {
            if (Frm_Print.style.zIndex == 2) {
                if (Frm_Print.getVisibility() == true) {
                    keyOperation(e.keyCode, e.shiftKey, e.ctrlKey);
                }
            }else{
            }
        }
    });
    document.addEventListener('keyup', function (e) {
        let elm = document.getElementsByName("backDiv");
        if (elm.length == 0) {
            if (e.keyCode == 13) {
                if (settingModeWindow.style.zIndex == 2) {
                    //設定画面でEnterを押すと描画開始ボタンにフォーカス移動
                    document.getElementById("btnDraw").focus();
                }
            }
        }
    });

    function keyOperation(keyCode, shiftKey, ctrlKey) {
        if (mousePointingSituation != mousePointingSituations.up) {
            return;
        }
        let vs = attrData.TotalData.ViewStyle.ScrData.ScrView;
        let w = vs.width();
        let h = vs.height();
        switch (keyCode) {
            case 82: //Rキー
                frmPrint.wholeMapShow();
            case 37:
            case 38:
            case 39:
            case 40: {
                let xmove = 0;
                let ymove = 0;
                if ((keyCode == 37) || (keyCode == 39)) {
                    xmove = (keyCode - 38) * w / 5;
                }
                if ((keyCode == 38) || (keyCode == 40)) {
                    ymove = (keyCode - 39) * h / 5;
                }
                if ((shiftKey == true) && (ctrlKey == true)) {
                    xmove /= 8;
                    ymove /= 8;
                } else {
                    if (shiftKey == true) {
                        xmove /= 2;
                        ymove /= 2;
                    }
                    if (ctrlKey == true) {
                        xmove /= 4;
                        ymove /= 4;
                    }
                }
                vs.offset(xmove, ymove);
                callback(elem);
                break;
            }
            case 33:
            case 34: {
                let bairitsu;

                if (keyCode == 34) {
                    bairitsu = 0.4;
                } else {
                    bairitsu = -0.4;
                }
                if ((shiftKey == true) && (ctrlKey == true)) {
                    bairitsu /= 8;
                } else {
                    if (shiftKey == true) {
                        bairitsu /= 2;
                    }
                    if (ctrlKey == true) {
                        bairitsu /= 4;
                    }
                }
                let ratio = 1 - bairitsu;
                expansionMap(attrData.TotalData.ViewStyle.ScrData.getSXSY_Margin().centerP(), ratio);             
                break;
            }
        }
    }

    function mdown(e) {
        e.preventDefault();
        let event;
        if (e.type === "mousedown") {
             event = e;
        } else {
             event = e.changedTouches[0];
        }
        MouseDownF = true;
        touchStartTime=new Date().getTime();
        mousePointingSituation = mousePointingSituations.down;
        mouseDownPosition = Generic.getCanvasXY(event);

    }


    function mmove(e) {
        let event;
        e.preventDefault();
        if (e.type === "mousemove") {
             event = e;
        } else {
            if(mousePointingSituation == mousePointingSituations.pinch){
                pinchMove(e);
                return;
            }
            if( e.changedTouches.length>1){
                e.preventDefault();
                mousePointingSituation = mousePointingSituations.pinch;
                pinch(e);
                return;
            }else{
                event = e.changedTouches[0];
            }
        }
        let p = Generic.getCanvasXY(event);
        let vs = attrData.TotalData.ViewStyle;
        let MapPos = vs.ScrData.getSRXY(p);
        switch (mousePointingSituation) {
            case mousePointingSituations.up: {
                //ボタンを押さずに移動中
                switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                    case enmPrintMouseMode.od:
                    case enmPrintMouseMode.Normal: {
                        let mCursorF = false;
                        if (attrData.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F == false) {
                            if (propertyWindow.fixed == false) {
                                LocationSearch(p);
                            } else {
                                //picMapMouseMovePointInformation(p);
                            }
                            LocationContourSearch(p);
                            mCursorF = LocationODSearch(p);
                        }
                        if (mCursorF == false) {
                            if (Check_Acc(p).type != Check_Acc_Result.NoAccessory) {
                                mCursorF = true;
                            }
                        }
                        if (mCursorF == true) {
                            elem.style.cursor = 'pointer';
                        } else {
                            elem.style.cursor = 'default';
                        }
                        break;
                    }
                }
                break;
            }
            case mousePointingSituations.down: {
                //マウスダウンの直後
                if (p.Equals(mouseDownPosition) == false) {
                    mousePreviousPosition = p;
                    mousePointingSituation = mousePointingSituations.downAndMove;
                    switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                        case enmPrintMouseMode.Normal: {
                            let retv = Check_Acc(p);
                            attrData.TempData.frmPrint_Temp.mouseAccesoryDragType = retv.type;
                            if (attrData.TempData.frmPrint_Temp.mouseAccesoryDragType != Check_Acc_Result.NoAccessory) {
                                attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Accessory_Drag;
                                elem.style.cursor = 'move';
                            }
                            break;
                        }
                        case enmPrintMouseMode.Fig: {
                            break;
                        }
                    }
                }
                break;
            }
            case mousePointingSituations.downAndMove: {
                //マウスダウンとドラッグ開始後
                if (p.Equals(mousePreviousPosition) == false) {
                    let vs = attrData.TotalData.ViewStyle;
                    let MouseDownSRxy = vs.ScrData.getSRXY(mouseDownPosition);
                    let movePx = new point(p.x - mouseDownPosition.x, p.y - mouseDownPosition.y);
                    switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                        case enmPrintMouseMode.RangePrint: {
                            //表示範囲指定
                            break;
                        }
                        case enmPrintMouseMode.Accessory_Drag: {
                            //飾りの移動
                            g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);

                            let stp=new point();
                            let smode = (vs.ScrData.Accessory_Base == enmBasePosition.Screen);
                            if (smode) {
                                stp.x = movePx.x / vs.ScrData.MapScreen_Scale.width();
                                stp.y = movePx.y / vs.ScrData.MapScreen_Scale.height();
                            } else {
                                stp.x = MapPos.x - MouseDownSRxy.x;
                                stp.y = MapPos.y - MouseDownSRxy.y;
                            }
                            
                            switch (attrData.TempData.frmPrint_Temp.mouseAccesoryDragType) {
                                case Check_Acc_Result.Compass: {
                                    let P = attrData.TempData.Accessory_Temp.Push_CompassXY.Clone();
                                    P.offset(stp);     
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 1, 0, 1));
                                    }
                                    vs.AttMapCompass.Position = P;
                                    clsAccessory.Compass_print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Title: {
                                    let P = attrData.TempData.Accessory_Temp.Push_titleXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0,  1, 0, 1));
                                    }
                                    vs.MapTitle.Position = P;
                                    clsAccessory.Title_Print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Scale: {
                                    let P = attrData.TempData.Accessory_Temp.Push_ScaleXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 0.95,0, 0.95));
                                    }
                                    vs.MapScale.Position = P;
                                    clsAccessory.Scale_Print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Note: {
                                    let P = attrData.TempData.Accessory_Temp.Push_DataNoteXY.Clone();
                                    P.offset(stp);
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0,  1, 0, 1));
                                    }
                                    vs.DataNote.Position = P;
                                    clsAccessory.Note_Print(g, attrData);
                                    break;
                                }
                                case Check_Acc_Result.Legend: {
                                    let P = attrData.TempData.Accessory_Temp.Push_LegendXY.Clone();
                                    P.offset(stp);   
                                    if(smode)  {
                                        P = spatial.checkAndModifyPointInRect(P, new  rectangle(0, 0.95,0, 0.95));
                                    }
                                    vs.MapLegend.Base.LegendXY[attrData.TempData.Accessory_Temp.Edit_Legend] = P;
                                    clsAccessory.Legend_print(g,  attrData.TempData.Accessory_Temp.Edit_Legend, false);
                                    break;
                                }
                                case Check_Acc_Result.GroupBox: {
                                    attrData.TempData.Accessory_Temp.GroupBox_Rect = attrData.TempData.Accessory_Temp.OriginalGroupBoxRect.Clone();
                                    attrData.TempData.Accessory_Temp.GroupBox_Rect.offset(movePx.x,movePx.y);
                                    if (smode) {
                                        let atg = attrData.TempData.Accessory_Temp.GroupBox_Rect;
                                        let rcp = atg.centerP();
                                        rcp = spatial.checkAndModifyPointInRect(rcp, new rectangle(0, 0, vs.ScrData.frmPrint_FormSize.width(), vs.ScrData.frmPrint_FormSize.height()));
                                        atg = new rectangle(new point(rcp.x - atg.width() / 2, rcp.y - atg.height() / 2), new size(atg.width(), atg.height()));
                                    }
                                    clsAccessory.AccGroupBoxDraw(g);
                                    break;
                                }
                            }
                            break;
                        }
                        case enmPrintMouseMode.od: {
                            OD_Line_Print(g,MapPos);
                            elem.style.cursor = 'move';
                            break;
                        }
                        case enmPrintMouseMode.Fig: {
                            break;
                        }
                        case enmPrintMouseMode.Normal: {
                            g.clearRect(0, 0, elem.width, elem.height);
                            g.putImageData(attrData.TempData.frmPrint_Temp.image, movePx.x, movePx.y);
                            break;
                        }
                    }
                    elem.style.cursor = 'move';
                    mousePreviousPosition = p;
                }
                break;
            }
        }
    }


    function mup(e) {
        
        e.preventDefault();
        let event;
        if(mousePointingSituation == mousePointingSituations.pinch){
            pinchUp(e)
            mousePointingSituation = mousePointingSituations.up;
            MouseDownF=false;
            return;
        }
        if ((e.type === "mouseup") ||(e.type === "mouseleave")){
             event = e;
        } else {
             event = e.changedTouches[0];
        }
        let vs = attrData.TotalData.ViewStyle;
        let mouseUpPosition = Generic.getCanvasXY(event);
        let mouseUpSRXT = vs.ScrData.getSRXY(mouseUpPosition);

        if((attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.SymbolPoint )||( attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.LabelPoint )){
        //シンボル位置／ラベル位置移動
            if (e.which  == 3) {
            } else {
                let tmp = attrData.TempData.frmPrint_Temp;
                let P = vs.ScrData.getSRXY(mouseDownPosition);

                switch (tmp.PrintMouseMode) {
                    case enmPrintMouseMode.SymbolPoint: {
                        let d = tmp.OnObject[0];
                        attrData.LayerData[d.objLayer].atrObject.atrObjectData[d.ObjNumber].Symbol = P;
                        break;
                    }
                    case enmPrintMouseMode.LabelPoint: {
                        let d = tmp.OnObject[0];
                        attrData.LayerData[d.objLayer].atrObject.atrObjectData[d.ObjNumber].Label = P;
                        break;
                    }
                }
                clsPrint.printMapScreen(Frm_Print.picMap);
                Frm_Print.picMap.style.cursor = 'default';
                mousePointingSituation = mousePointingSituations.up;
                tmp.PrintMouseMode = enmPrintMouseMode.Normal;
                tmp.MouseDownF = false;
                return;
            }
        }

        if (mousePointingSituation == mousePointingSituations.downAndMove) {
            let StartP = vs.ScrData.getSRXY(mouseDownPosition);
            let EndP = mouseUpSRXT;
            let mapstep = new point(EndP.x - StartP.x, EndP.y - StartP.y);
            switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                case enmPrintMouseMode.RangePrint: {
                    break;
                }
                case enmPrintMouseMode.Accessory_Drag: {
                    if (attrData.TempData.frmPrint_Temp.mouseAccesoryDragType == Check_Acc_Result.GroupBox) {
                        //グループボックスのドラッグの場合
                        let stp = new point();
                        if (vs.ScrData.Accessory_Base == enmBasePosition.Screen) {

                            let gr = attrData.TempData.Accessory_Temp;
                            let movePx = new point(gr.GroupBox_Rect.left - gr.OriginalGroupBoxRect.left, gr.GroupBox_Rect.top - gr.OriginalGroupBoxRect.top);
                            stp.x = movePx.x / vs.ScrData.MapScreen_Scale.width();
                            stp.y = movePx.y / vs.ScrData.MapScreen_Scale.height();
                        } else {
                            stp = mapstep;
                        }
                        let ag = vs.AccessoryGroupBox;
                        if (ag.Title == true) {
                            vs.MapTitle.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Scale == true) {
                            vs.MapScale.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Note == true) {
                            vs.DataNote.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Comapss == true) {
                            vs.AttMapCompass.Position.offset(stp.x, stp.y);
                        }
                        if (ag.Legend == true) {
                            for (let i = 0; i < attrData.TempData.Accessory_Temp.Legend_No_Max; i++) {
                                vs.MapLegend.Base.LegendXY[i].offset(stp.x, stp.y);
                            }
                        }
                    }
                    callback(elem, attrData);
                    break;
                }
                case enmPrintMouseMode.od: {
                    //線モード
                    let Layernum = attrData.TotalData.LV1.SelectedLayer;
                    let odra = attrData.TempData.frmPrint_Temp.OD_Drag;
                    attrData.LayerData[Layernum].Add_OD_Bezier(odra.ObjectPos, odra.Data, mouseUpSRXT);
                    clsPrint.printMapScreen(Frm_Print.picMap);
                    break;
                }
                case enmPrintMouseMode.Fig: {
                    break;
                }
                case enmPrintMouseMode.Normal: {
                    vs.ScrData.ScrView.offset(StartP.x - EndP.x, StartP.y - EndP.y);
                    callback(elem, attrData);
                    break;
                }
            }
            attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        }else{
            if (e.type != "mouseleave") {
                //クリックの場合
                let touchTime = (new Date().getTime()- touchStartTime) / 1000;
                let rightButton=false;
                if(e.button==2){rightButton=true;}
                if((e.type === "touchend") && (mousePointingSituation == mousePointingSituations.down)&&(touchTime>0.5)){
                    //タッチで0.5秒以上移動しない場合は右クリック
                    rightButton=true;
                }
                switch (rightButton) {
                    case true: {//右クリック
                        switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                            case enmPrintMouseMode.Normal: {
                                let retV = Check_Acc(mouseUpPosition);
                                if (retV.type == Check_Acc_Result.NoAccessory) {
                                    let av = attrData.TotalData.ViewStyle;
                                    let mnuAccPopupVisible = [];
                                    if (av.ScrData.ThreeDMode.Set3D_F == false) {
                                        attrData.TempData.frmPrint_Temp.LocationMenuString.ClickMapPos = mouseUpSRXT;
                                        Loc_Data_Menu(mnuAccPopupVisible);
                                    }
                                    //非表示の飾りを表示させるメニューの表示
                                    if ((av.MapTitle.Visible == false) || (av.MapLegend.Base.Visible == false) || (av.MapScale.Visible == false) || (
                                        av.AttMapCompass.Visible == false) || (av.AttMapCompass.Visible == false) || (av.AccessoryGroupBox.Visible == false)) {
                                        if (mnuAccPopupVisible.length > 0) {
                                            mnuAccPopupVisible.push({ caption: "-" });
                                        }
                                    }
                                    if (av.MapTitle.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "タイトル表示",
                                            event: function () { attrData.TotalData.ViewStyle.MapTitle.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.MapLegend.Base.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "凡例表示",
                                            event: function () { attrData.TotalData.ViewStyle.MapLegend.Base.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.MapScale.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "スケール表示",
                                            event: function () { attrData.TotalData.ViewStyle.MapScale.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.AttMapCompass.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "方位表示",
                                            event: function () { attrData.TotalData.ViewStyle.AttMapCompass.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap) }
                                        });
                                    }
                                    if (av.DataNote.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "注表示",
                                            event: function () { attrData.TotalData.ViewStyle.DataNote.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if (av.AccessoryGroupBox.Visible == false) {
                                        mnuAccPopupVisible.push({
                                            caption: "飾りグループボックス表示",
                                            event: function () { attrData.TotalData.ViewStyle.AccessoryGroupBox.Visible = true; clsPrint.printMapScreen(Frm_Print.picMap); }
                                        });
                                    }
                                    if(attrData.TotalData.ViewStyle.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido){
                                        let pmnu={caption: "この地点のWeb地図を表示", enabled: true, child: [
                                            { caption: "Googleマップ", event: showWebMap },
                                            { caption: "YAHOO!地図", event:  showWebMap},
                                            { caption: "Mapion", event:  showWebMap},
                                            { caption: "MapFan", event:  showWebMap},
                                            { caption: "地理院地図", event:  showWebMap},
                                            { caption: "今昔マップ", event:  showWebMap}
                                        ]};
                                        mnuAccPopupVisible.push(pmnu);
                                        function showWebMap(data, e) {
                                            let p = vs.ScrData.getSRXY(mouseDownPosition);
                                            let xy1=spatial.Get_Reverse_XY(p,attrData.TotalData.ViewStyle.Zahyo);   
                                            let xy=spatial.Get_World_IdoKedo(xy1,attrData.TotalData.ViewStyle.Zahyo);   
                                            let url="";
                                            let zm=13;
                                            switch (data.caption) {
                                                case "Googleマップ":
                                                    url="https://www.google.com/maps/search/?api=1&query=" + xy.lat + "," + xy.lon + '&zoom='+zm;
                                                    break;
                                                case "YAHOO!地図":
                                                    url="https://map.yahoo.co.jp/maps?lat=" + xy.lat + "&lon=" + xy.lon + "&z="+zm;
                                                    break;
                                                case "Mapion":
                                                    url="https://www.mapion.co.jp/m2/" + xy.lat + "," + xy.lon + ","+zm;
                                                    break;
                                                case "MapFan":
                                                    url="https://mapfan.com/map/spots/search?c=" + xy.lat + "," + xy.lon + ","+zm;
                                                    break;
                                                case "地理院地図":
                                                    url="https://maps.gsi.go.jp/#"+zm+"/" + xy.lat + "/" + xy.lon;
                                                    break;
                                                case "今昔マップ":
                                                    url="http://ktgis.net/kjmapw/kjmapw.html?lat=" + xy.lat + "&lng=" + xy.lon +"&zoom="+zm;
                                                    break;
                                            }
                                            let x = window.screenX+10;
                                            let y = window.screenY+10;
                                            window.open(url, null, "titlebar=No,status=0,scrollbars=1,resizable=0,width=900,height=700,left="+x+",top="+y);
                                        
                                        }
                                    }
                                    if (mnuAccPopupVisible.length > 0) {
                                        Generic.ceatePopupMenu(mnuAccPopupVisible, new point(event.clientX, event.clientY));
                                    }
                                } else {
                                    //飾り上で右クリックメニュー
                                    let mnuAccPopupVisible = [];
                                    switch (retV.type) {
                                        case Check_Acc_Result.Compass:
                                            mnuAccPopupVisible.push({ caption: "方位非表示", event: function () { attrData.TotalData.ViewStyle.AttMapCompass.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap) } });
                                            mnuAccPopupVisible.push({ caption: "方位設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.GroupBox:
                                            mnuAccPopupVisible.push({ caption: "飾りグループボックス非表示", event: function () { attrData.TotalData.ViewStyle.AccessoryGroupBox.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap) } });
                                            mnuAccPopupVisible.push({ caption: "飾りグループボックス設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Legend:
                                            mnuAccPopupVisible.push({ caption: "凡例非表示", event: function () { attrData.TotalData.ViewStyle.MapLegend.Base.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "凡例設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Scale:
                                            mnuAccPopupVisible.push({ caption: "スケール非表示", event: function () { attrData.TotalData.ViewStyle.MapScale.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "スケール設定", event: accVisible });
                                            break;
                                        case Check_Acc_Result.Note:
                                            mnuAccPopupVisible.push({ caption: "注釈非表示", event: function () { attrData.TotalData.ViewStyle.DataNote.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "注釈設定", event: accVisible });
                                            break
                                        case Check_Acc_Result.Title:
                                            mnuAccPopupVisible.push({ caption: "タイトル非表示", event: function () { attrData.TotalData.ViewStyle.MapTitle.Visible = false; clsPrint.printMapScreen(Frm_Print.picMap); } });
                                            mnuAccPopupVisible.push({ caption: "タイトル設定", event: accVisible });
                                            break
                                    }
                                    Generic.ceatePopupMenu(mnuAccPopupVisible, new point(event.clientX, event.clientY));
                                    function accVisible(data, e) {
                                        switch (data.caption) {
                                            case "凡例設定":
                                                frmPrintOption(2);
                                                break;
                                            case "方位設定":
                                                frmCompassSettings(attrData.TotalData.ViewStyle.AttMapCompass,
                                                    function (v) {
                                                        attrData.TotalData.ViewStyle.AttMapCompass = v;
                                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                                    });
                                                break;
                                            case "凡例設定":
                                                frmPrintOption(2);
                                                break;
                                            case "スケール設定":
                                                frmPrintOption(4);
                                                break;
                                            default:
                                                frmPrintOption(0);
                                                break;
                                        }
                                    }
                                }
                                break;
                            }
                            case enmPrintMouseMode.od: {
                                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                                let ato = attrData.TempData.frmPrint_Temp.OD_Drag;
                                let retV = attrData.LayerData[Layernum].Get_OD_Bezier_RefPoint(ato.ObjectPos, ato.Data);
                                if (retV.ok == true) {
                                    let popmenu = [{ caption: "直線に戻す", event: odReset }];
                                    Generic.ceatePopupMenu(popmenu, new point(event.clientX, event.clientY));
                                    function odReset() {
                                        attrData.LayerData[Layernum].Remove_OD_Bezier(ato.ObjectPos, ato.Data);
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                    case false: {//左クリック
                        if ((e.type === "touchend") && (mousePointingSituation == mousePointingSituations.down)) {
                            let p = Generic.getCanvasXY(event);
                            LocationSearch(p);
                        } else {
                            switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                                case enmPrintMouseMode.Normal: {
                                    frmPrint.PropertyFix();
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        elem.style.cursor = 'default';
        attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
        mousePointingSituation = mousePointingSituations.up;
        switch (attrData.TempData.frmPrint_Temp.PrintMouseMode){
            case enmPrintMouseMode.Normal:{
                frmPrint.PrintCursorObjectLine(g,false);
                break;
            }
        }
        MouseDownF = false;

        function Loc_Data_Menu(mnuAccPopupVisible) {
            let alm = attrData.TempData.frmPrint_Temp.LocationMenuString;
            switch (attrData.TotalData.LV1.Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    if (attrData.TempData.frmPrint_Temp.OnObject.length == 1) {
                        //mnuAccPopupVisible.push({ caption:"図形モードでオブジェクト名・データ値表示", event: function(){}});
                        let Layernum = attrData.TempData.frmPrint_Temp.OnObject[0].objLayer;
                        let ObjNum = attrData.TempData.frmPrint_Temp.OnObject[0].ObjNumber;
                        let dtIndex = alm.DataIndex;
                        let al = attrData.LayerData[Layernum];
                        let alo = al.atrObject.atrObjectData[ObjNum];
                        let SymbolPosMeuF = false;
                        switch (al.Print_Mode_Layer) {
                            case enmLayerMode_Number.SoloMode: {
                                alm.ObjectNameValue = attrData.getOneObjectPanelLabelString(Layernum, dtIndex, ObjNum, ":");
                                switch (attrData.getSoloMode(Layernum, dtIndex)) {
                                    case enmSoloMode_Number.MarkBlockMode:
                                    case enmSoloMode_Number.MarkSizeMode:
                                    case enmSoloMode_Number.MarkTurnMode:
                                    case enmSoloMode_Number.MarkBarMode:
                                        SymbolPosMeuF = true
                                        break;
                                    case enmSoloMode_Number.ClassHatchMode:
                                    case enmSoloMode_Number.ClassMarkMode:
                                    case enmSoloMode_Number.ClassPaintMode:
                                        if (al.Shape == enmShape.PointShape) {
                                            SymbolPosMeuF = true;
                                        }
                                        break;
                                }

                                break;
                            }
                            case enmLayerMode_Number.GraphMode: {
                                let DataItem = al.LayerModeViewSettings.GraphMode.DataSet[dtIndex].Data;
                                let n = DataItem.length;
                                let tx = "";
                                for (let i = 0; i < n; i++) {
                                    tx += attrData.Get_DataTitle(Layernum, DataItem[i].DataNumber, false) + ":" +
                                        attrData.Get_Data_Value(Layernum, DataItem[i].DataNumber, ObjNum, "") + attrData.Get_DataUnit(Layernum, DataItem[i].DataNumber)
                                    if (i != n - 1) {
                                        tx += chrLF;
                                    }
                                }
                                alm.ObjectNameValue = tx;
                                SymbolPosMeuF = true;
                                break;
                            }
                            case enmLayerMode_Number.LabelMode: {
                                let DataItem = al.LayerModeViewSettings.LabelMode.DataSet[dtIndex].DataItem;
                                let n = DataItem.length;
                                let tx = "";
                                for (let i = 0; i < n; i++) {
                                    tx += attrData.Get_DataTitle(Layernum, DataItem[i], false) + ":" +
                                        attrData.Get_Data_Value(Layernum, DataItem[i], ObjNum, "") + attrData.Get_DataUnit(Layernum, DataItem[i]);
                                    if (i != n - 1) {
                                        tx += chrLF;
                                    }
                                }
                                alm.ObjectNameValue = tx;
                                break;
                            }
                            case enmLayerMode_Number.TripMode:
                                break;
                        }
                        if (SymbolPosMeuF == true) {
                            mnuAccPopupVisible.push({
                                caption: "記号表示位置移動", event: function () {
                                    if (attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage == true) {
                                        if (window.confirm("新しい記号表示位置をクリックして指定します(右クリックでキャンセル)。") == false) {return;}
                                    }
                                    attrData.TempData.frmPrint_Temp.SymbolPointFirstMessage = false;
                                    Frm_Print.picMap.style.cursor = 'crosshair';
                                    attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.SymbolPoint;
                                }
                            });
                            if (alo.CenterPoint.Equals(alo.Symbol) == false) {
                                mnuAccPopupVisible.push({
                                    caption: "記号表示位置を元に戻す", event: function () {
                                        let on = attrData.TempData.frmPrint_Temp.OnObject[0];
                                        let d = attrData.LayerData[on.objLayer].atrObject.atrObjectData[on.ObjNumber];
                                        d.Symbol = d.CenterPoint;
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                });
                            }
                        }
                        if ((al.Print_Mode_Layer == enmLayerMode_Number.LabelMode) || ((al.Print_Mode_Layer == enmLayerMode_Number.SoloMode) && (
                            attrData.getSoloMode(Layernum, dtIndex) == enmSoloMode_Number.StringMode))) {
                            mnuAccPopupVisible.push({
                                caption: "ラベル表示位置移動", event: function () {
                                    if (attrData.TempData.frmPrint_Temp.LabelPointFirstMessage == true) {
                                        if (window.confirm("新しいラベル表示位置をクリックして指定します(右クリックでキャンセル)。") == false) { return; }
                                    }
                                    attrData.TempData.frmPrint_Temp.LabelPointFirstMessage = false;
                                    Frm_Print.picMap.style.cursor = 'crosshair';
                                    attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.LabelPoint;
                                }
                            });
                            if (alo.CenterPoint.Equals(alo.Label) == false) {
                                mnuAccPopupVisible.push({
                                    caption: "ラベル表示位置を元に戻す", event: function () {
                                        let on = attrData.TempData.frmPrint_Temp.OnObject[0];
                                        let d = attrData.LayerData[on.objLayer].atrObject.atrObjectData[on.ObjNumber];
                                        d.Label = d.CenterPoint;
                                        clsPrint.printMapScreen(Frm_Print.picMap);
                                    }
                                });
                            }
                        }
                        if (alo.HyperLinkNum > 0) {
                            mnuAccPopupVisible.push({ caption: "-" })
                        }
                        for (let i = 0; i < alo.HyperLinkNum; i++) {
                            mnuAccPopupVisible.push({caption:"リンク：" + alo.HyperLink[i].Name,event:function(data,e){
                                window.open(data.tag, '_blank');
                            },tag:alo.HyperLink[i].Address} );
                        }
                        // mnuAccPopupVisible.push({ caption: "-" });
                        // mnuAccPopupVisible.push({caption: "リンクの編集", event: mnuAccPopupVisible_LinkEdit} );

                        let ObjName = Generic.Check_StringLength_And_Cut(attrData.Get_KenObjName(Layernum, ObjNum), 20)
                        if (alo.Objectstructure == enmKenCodeObjectstructure.SyntheticObj) {
                            // mnuAccPopupVisible.push({caption: ObjName + "の構成", event: mnuAccPopupVisible_synthetic} );
                        }
                    }
                    break;
                }
            }
            if (alm.ContourStacPos != -1) {
                mnuAccPopupVisible.push({caption: "等値線の値表示", event: function(){}});
            }
        }
    }

    let pinchCenter=new point();
    let pinchBaseDis;
    let pinchPresentDis;
    function pinch(event){
        let touches=event.changedTouches;
        let p1=Generic.getCanvasXY(touches[0]);
        let p2=Generic.getCanvasXY(touches[1]);
        pinchCenter=new point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
        pinchBaseDis=spatial.Distance(p1.x,p1.y,p2.x,p2.y);
    }
    function pinchMove(event){
        let touches=event.changedTouches;
        if(touches.length>1){
            let p1=Generic.getCanvasXY(touches[0]);
            let p2=Generic.getCanvasXY(touches[1]);
            pinchCenter=new point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
            pinchPresentDis=spatial.Distance(p1.x,p1.y,p2.x,p2.y);
        }
    }
    function pinchUp(event){
        let ratio=pinchPresentDis/pinchBaseDis;
        expansionMap(pinchCenter,ratio);
    }
    function onWheel(event) {
        if ((MouseDownF == true)||(attrData.TempData.drawing==true)) {
            return;
        }
        let bairitu = 0.5;
        if ((window.event.ctrlKey == true) && (window.event.shiftKey == true)) {
            bairitu = 0.125;
        } else if (window.event.shiftKey == true) {
            bairitu = bairitu * 0.25;
        }

        let ratio;
        if (event.deltaY > 0) {
            ratio = 1 - bairitu;
        } else {
            ratio = 1 + bairitu * 2;
        }
        let cpos = Generic.getCanvasXY(event);
        expansionMap(cpos,ratio);
    }

    function expansionMap(cpos,ratio){
        let sd = attrData.TotalData.ViewStyle.ScrData;
        let sv = sd.ScrView;
        let Pos = sd.getSRXY(cpos);
        let h1 = Pos.y - sv.top;
        let h2 = sv.bottom - Pos.y;
        let w1 = Pos.x - sv.left;
        let w2 = sv.right - Pos.x;
        let rec = new rectangle(Pos.x - w1 / ratio, Pos.x + w2 / ratio, Pos.y - h1 / ratio, Pos.y + h2 / ratio);
        if (Generic.Check_New_ScrView(sd.MapRectangle, rec) == true) {
            attrData.TotalData.ViewStyle.ScrData.ScrView = rec;
            callback(elem);
            switch (attrData.TempData.frmPrint_Temp.PrintMouseMode) {
                case enmPrintMouseMode.Fig: {
                    //frm_Figure.Print_Fig()
                    break;
                }
                case enmPrintMouseMode.Normal: {
                    frmPrint.PrintCursorObjectLine(g,true);
                    break;
                }
                case enmPrintMouseMode.MultiObjectSelect: {
                    //printSeletedMultiObject()
                    break;
                }
            }
        }

    }


    /**ドラッグで移動中のOD曲線を描く */
    function OD_Line_Print(g,P){

        let DataNum = attrData.TempData.frmPrint_Temp.OD_Drag.Data;
        let ObNum = attrData.TempData.frmPrint_Temp.OD_Drag.ObjectPos;
        let Layernum = attrData.TotalData.LV1.SelectedLayer
        let al = attrData.LayerData[Layernum];
        let odmd = al.atrData.Data[DataNum].SoloModeViewSettings.ClassODMD;
        let oal = attrData.LayerData[odmd.o_Layer];
        let OriginP;

        let origin_objn = oal.atrObject.ObjectNum
        if (odmd.O_object > origin_objn) {
            //ダミーオブジェクトが始点の場合
            let Dob = oal.Dummy[odmd.O_object - origin_objn].code;
            OriginP = al.MapFileData.Get_Enable_CenterP(Dob, oal.Time);
        } else {
            OriginP = oal.atrObject.atrObjectData[odmd.O_object].CenterPoint;
        }
        let DestP = al.atrObject.atrObjectData[ObNum].CenterPoint;
        let poxy = Generic.Get_OD_Spline_Point(P, OriginP, DestP);

        let pxy = clsSpline.Spline_Get(0, 4, poxy, 0.1, attrData.TotalData.ViewStyle.ScrData);
        let Cate  = attrData.Get_Categoly(Layernum, DataNum, ObNum);
        let O_LPat  = al.atrData.Data[DataNum].SoloModeViewSettings.Class_Div[Cate].ODLinePat.Clone();
        O_LPat.Color=clsBase.ColorRed();
        g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);
        attrData.Draw_Line(g, O_LPat,  pxy);
    }

    /**線モードのラインの移動チェック */
    function LocationODSearch(ScreenP) {
        let MapP = attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        let odc = Near_OD(MapP);
        if (odc != -1) {
            let tx4 = "OD" + attrData.Get_KenObjName(attrData.TotalData.LV1.SelectedLayer, odc);
            Frm_Print.label3.style.left=(Frm_Print.label1.offsetWidth+Frm_Print.label2.offsetWidth+20).px();
            Frm_Print.label3.innerHTML = tx4;
            attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.od;
            return true;
        } else {
            attrData.TempData.frmPrint_Temp.PrintMouseMode = enmPrintMouseMode.Normal;
            return false;
        }
    }

    /**線モードの最寄りラインを求める */
    function Near_OD(MapP){
        let Near_ODNumber  = -1;
        switch (attrData.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                let Layernum = attrData.TotalData.LV1.SelectedLayer;
                let al = attrData.LayerData[Layernum];
                let DataNum = al.atrData.SelectedIndex;
                if (al.Print_Mode_Layer == enmLayerMode_Number.SoloMode) {
                    if ((attrData.getSoloMode(Layernum, DataNum) == enmSoloMode_Number.ClassODMode) && (
                        al.Shape != enmShape.LineShape) && (al.Type != enmLayerType.Trip)) {
                        Near_ODNumber = Near_OD_sub(MapP, Layernum, DataNum);
                    }
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                let ovl = attrData.TotalData.TotalMode.OverLay.DataSet[attrData.TotalData.TotalMode.OverLay.SelectedIndex];
                for (let i = 0; i < ovl.DataItem.length; i++) {
                    let Layernum = ovl.Layer
                    let DataNum = ovl.DataNumber
                    if ((ovl.Print_Mode_Layer == enmLayerMode_Number.SoloMode)&& (ovl.Mode == enmSoloMode_Number.ClassODMode) && (
                        al.Shape != enmShape.LineShape)){
                        Near_ODNumber = Near_OD_sub(MapP, Layernum, DataNum);
                        if (Near_ODNumber != -1) {
                            break;
                        }
                    }
                }
                break;
            }
        }
        return Near_ODNumber;

        function Near_OD_sub(MapP ,  Layernum ,  DataNum){
            let al=attrData.LayerData[Layernum];
            let mod=al.atrData.Data[DataNum].SoloModeViewSettings.ClassODMD;
            let oal=attrData.LayerData[mod.o_Layer];
            let StartP ;
            let EndP ;
            let objn  = al.atrObject.ObjectNum;
            let origin_objn  = oal.atrObject.ObjectNum
            if(mod.O_object > origin_objn ){
                //ダミーオブジェクトが始点の場合
                let Dob  = oal.Dummy[mod.O_object - origin_objn].code;
                StartP=al.MapFileData.Get_Enable_CenterP(Dob, oal.Time);
            }else{
                StartP = oal.atrObject.atrObjectData[mod.O_object].CenterPoint;
            }

            let mind  = 5;
            let Category_Array = attrData.Get_CategolyArray(Layernum, DataNum);
            let Near_Obj  = -1;
            for (let i = 0; i <  objn ; i++) {
                EndP = al.atrObject.atrObjectData[i].CenterPoint;
                let Cate  = Category_Array[i];
                if(Cate != -1 ){
                    let D ;
                    if (((i == mod.O_object) && (Layernum == mod.o_Layer)) || (
                        (al.atrData.Data[DataNum].SoloModeViewSettings.Class_Div[Cate].ODLinePat.BlankF == false) && (
                            attrData.Check_Missing_Value(Layernum, DataNum, i) == false))) {
                        let retV = al.Get_OD_Bezier_RefPoint(i, DataNum);
                        if (retV.ok == false) {
                             D= spatial.Distance_PointLine2(MapP, StartP, EndP).distance;
                        } else {
                            let ControlP = retV.RefPoint;
                            let Refp = Generic.Get_OD_Spline_Point(ControlP, StartP, EndP);
                            let d1 = spatial.Distance_PointLine2(MapP, StartP, Refp[2]).distance;
                            let d2 = spatial.Distance_PointLine2(MapP, Refp[1], Refp[2]).distance;
                            let d3 = spatial.Distance_PointLine2(MapP, EndP, Refp[1]).distance;
                            D = Math.min(d1, d2);
                            D = Math.min(D, d3);
                        }
                        D *= attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                        if (D < mind) {
                            mind = D;
                            Near_Obj = i;
                            attrData.TempData.frmPrint_Temp.OD_Drag.ObjectPos = Near_Obj;
                            attrData.TempData.frmPrint_Temp.OD_Drag.Data = DataNum;
                        }
                    }
                }
            }
            return Near_Obj;
        }
    }

    /**等値線の位置とカーソルチェック */
    function LocationContourSearch(ScreenP) {
        let MapP = attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        let tx4 = ""
        if (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.Normal) {
            attrData.TempData.frmPrint_Temp.LocationMenuString.ContourStacPos = -1;
            if (Check_Contour_in() == true) {
                let c = Near_Contour(MapP);
                if (c != -1) {
                    attrData.TempData.frmPrint_Temp.LocationMenuString.ContourStacPos = c;
                    let cdt = attrData.TempData.ContourMode_Temp.Contour_Object[c];
                    tx4 = "等値線" + cdt.Value.toString() + attrData.Get_DataUnit(cdt.Layernum, cdt.DataNum);
                    let conDiv=document.getElementById("contourDataTip");
                    if(conDiv==undefined){
                        conDiv=Generic.createNewSpan(Frm_Print,tx4,"contourDataTip","",ScreenP.x+5,ScreenP.y+scrMargin.top-15,"z-index:2000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#ffffff",undefined)
                    }else{
                        conDiv.innerHTML=tx4;
                        conDiv.style.left=(ScreenP.x+5).px();
                        conDiv.style.top=(ScreenP.y+scrMargin.top-15).px();
                    }
                }
            }
        }
        if(tx4==""){
            let dv=document.getElementById("contourDataTip")
            if( dv!=undefined){
                Frm_Print.removeChild(dv);
            }
    }

        // 等値線モードが表示されているかチェック
         function Check_Contour_in() {    
             switch (attrData.TotalData.LV1.Print_Mode_Total) {
                 case enmTotalMode_Number.DataViewMode: {
                     let Layernum = attrData.TotalData.LV1.SelectedLayer;
                     if (attrData.LayerData[Layernum].atrData.Count > 0) {
                         let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
                         if (attrData.getSoloMode(Layernum, DataNum) == enmSoloMode_Number.ContourMode) {
                             return true;
                         }
                     }
                     break;
                 }
                 case enmTotalMode_Number.OverLayMode: {
                     let ato = attrData.TotalData.TotalMode.OverLay;
                     let atod = ato.DataSet[ato.SelectedIndex];
                     for (let i = 0; i < atod.DataItem.Count; i++) {
                         let atodi = atod.DataItem[i];
                         if ((atodi.Print_Mode_Layer == enmLayerMode_Number.SoloMode) && (atodi.Mode == enmSoloMode_Number.ContourMode)) {
                             return true;
                         }
                     }
                     break;
                 }
            }
            return false;
        }
        // 最寄りの等値線取得
        function Near_Contour(MapP) {
            let Near_ContourNumber = -1;
            let mind = 5;
            let atc = attrData.TempData.ContourMode_Temp;
            for (let i = 0; i < atc.Contour_All_Number; i++) {
                let atco = atc.Contour_Object[i];
                if ((atco.Flag == true) && (spatial.Check_PointInBox(MapP, 0, atco.Circumscribed_Rectangle) == true)) {
                    for (let j = atco.PointStac; j <= atco.PointStac + atco.NumOfPoint - 2; j++) {
                        let retV = spatial.Distance_PointLine(MapP.x,MapP.y, atc.Contour_Point[j].x,atc.Contour_Point[j].y, atc.Contour_Point[j + 1].x, atc.Contour_Point[j + 1].y ) ;
                        let d=retV.distance* attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                        if (d < mind) {
                            mind = d;
                            Near_ContourNumber = i;
                        }
                    }
                }
            }
            return Near_ContourNumber;
        }
    }

    /**マウス位置の情報、カーソルを＋に変える場合trueを返す*/
    function LocationSearch(ScreenP) {
        let MapP  = attrData.TotalData.ViewStyle.ScrData.getSRXY(ScreenP);
        picMapMouseMovePointInformation(ScreenP);
        let L_Print_Mode_Total ;
        let L_Layer ;
        let L_Print_Mode_Layer ;
        let L_Data ;
        let L_Solomode ;
        if( attrData.TotalData.LV1.Print_Mode_Total == enmTotalMode_Number.SeriesMode ){
            let koma  = attrData.TempData.Series_temp.Koma;
            let n  = attrData.TotalData.TotalMode.Series.SelectedIndex;
            let im= attrData.TotalData.TotalMode.Series.DataSet[n].DataItem[koma];
                L_Print_Mode_Total = im.Print_Mode_Total;
                L_Print_Mode_Layer = im.Print_Mode_Layer;
                L_Layer = im.Layer;
                L_Data = im.Data;
                L_Solomode = im.SoloMode;
        } else {
            let lv = attrData.TotalData.LV1;
            L_Print_Mode_Total = lv.Print_Mode_Total
            L_Layer = lv.SelectedLayer;
            let ld = attrData.LayerData[L_Layer];
            L_Print_Mode_Layer = ld.Print_Mode_Layer;
            L_Data = ld.atrData.SelectedIndex;
            switch (L_Print_Mode_Total) {
                case enmTotalMode_Number.DataViewMode: {
                    switch (L_Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode: {
                            L_Data = ld.atrData.SelectedIndex;
                            L_Solomode = ld.atrData.Data[L_Data].ModeData;
                            break;
                        }
                        case enmLayerMode_Number.GraphMode: {
                            L_Data = ld.LayerModeViewSettings.GraphMode.SelectedIndex;
                            break;
                        }
                        case enmLayerMode_Number.LabelMode: {
                            L_Data = ld.LayerModeViewSettings.LabelMode.SelectedIndex;
                            break;
                        }
                        case enmLayerMode_Number.TripMode: {
                            L_Data = ld.LayerModeViewSettings.TripMode.SelectedIndex;
                            break;
                        }
                    }
                    break;
                }
                case enmTotalMode_Number.OverLayMode: {
                    L_Data = attrData.TotalData.TotalMode.OverLay.SelectedIndex;
                    break;
                }
            }
        }
        switch (L_Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                //データ表示モード
                let OnObject = [];
                let Layernum = L_Layer;
                let dtindex = L_Data;
                switch (L_Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        break;
                    }
                    case enmLayerMode_Number.TripMode: {
                        OnObject = NearestObject(MapP, Layernum);
                        if (OnObject.length == 0) {
                            //frm_PropertypnlProperty.Visible = false;
                        } else {
                            if (mnuPropertyWindow.Checked == true) {
                                //frm_Property.ShowTripModeProperty(attrData, Layernum, OnObject, dtindex);
                            }
                        }
                        break;
                    }
                }
                if (L_Print_Mode_Layer != enmLayerMode_Number.TripMode) {
                    switch (OnObject.length) {
                        case 0: {
                            propertyWindow.pnlProperty.setVisibility(false);
                            Frm_Print.label2.innerHTML="";
                            break;
                        }
                        case 1: {
                            if ((propertyWindow.getVisibility() == true) && (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.Normal)) {
                                frmPrint.ShowOneObjectProperty( Layernum, OnObject[0].ObjNumber, dtindex, attrData.LayerData[Layernum].Print_Mode_Layer);
                            }
                            attrData.TempData.frmPrint_Temp.LocationMenuString.DataIndex = dtindex;
                            break;
                        }
                        default: {
                            frmPrint.ShowOverLayObjectProperty(Layernum,dtindex,  OnObject);
                            break;
                        }
                    }
                }
                let tx = "";
                for (let i = 0; i < OnObject.length; i++) {
                    let onum = OnObject[i].ObjNumber;
                    tx += attrData.Get_KenObjName(Layernum, onum) + "［" + attrData.Get_Data_Value(Layernum, L_Data, onum, "欠損値") + "］"
                    if (i != OnObject.length - 1) {
                        tx += "／"
                    }
                }
                if (tx != "") {
                    if (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.MultiObjectswitch) {
                        if (attrData.TempData.frmPrint_Temp.MultiObjects.IndexOf(OnObject[0].ObjNumber) != -1) {
                            tx += "（選択中）"
                        }
                    }
                }
                Frm_Print.label2.style.left=(Frm_Print.label1.offsetWidth+10).px();
                Frm_Print.label2.innerHTML= tx;
                attrData.TempData.frmPrint_Temp.OnObject = OnObject;
                if ((attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.MultiObjectswitch) && (L_Print_Mode_Layer == enmLayerMode_Number.SoloMode)){
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                //重ね合わせモード
                Get_Object_By_XY_OverLayMode(MapP, L_Data);
                break;
            }
        }

        switch (attrData.TempData.frmPrint_Temp.PrintMouseMode){
            case enmPrintMouseMode.Normal:{
                frmPrint.PrintCursorObjectLine(g,false);
                break;
            }
        }
    }

    /**重ね合わせモードの位置情報 */
    function Get_Object_By_XY_OverLayMode(MapP, OverLayIndex) {
        let tx = "";
        let f = false;
        attrData.TempData.frmPrint_Temp.OnObject = [];
        let ato = attrData.TotalData.TotalMode.OverLay;
        let lblTxt = ""
        for (let i = ato.DataSet[OverLayIndex].DataItem.length - 1; i >= 0; i--) {
            let d = ato.DataSet[OverLayIndex].DataItem[i];
            let OnObject = NearestObject(MapP, d.Layer);
            for (let j = 0; j < OnObject.length; j++) {
                let ObjData = OnObject[j];
                lblTxt += "レイヤ：" + attrData.Get_LayerName(ObjData.objLayer) + '<br>';
                lblTxt += "オブジェクト：" + attrData.Get_KenObjName(ObjData.objLayer, ObjData.ObjNumber) + '<br>';
                if (f == true) {
                    tx += "／";
                } else {
                    f = true;
                }
                tx += attrData.Get_KenObjName(ObjData.objLayer, ObjData.ObjNumber);
                switch (d.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode:
                        lblTxt += "　" + attrData.getOneObjectPanelLabelString(ObjData.objLayer, d.DataNumber, ObjData.ObjNumber,"<br>　") + '<br>';
                        break;
                    case enmLayerMode_Number.GraphMode:
                        lblTxt += "　グラフ表示モード" + '<br>';
                        break;
                    case enmLayerMode_Number.LabelMode:
                        lblTxt += "　ラベル表示モード" + '<br>';
                        break;
                    case enmLayerMode_Number.TripMode:
                        // lblTxt += "　移動表示モード" + '<br>';
                        break;
                }
                lblTxt += '<br>';
                attrData.TempData.frmPrint_Temp.OnObject.push(ObjData);
            }
        }
        if (propertyWindow.getVisibility() == true) {
            let cnode = propertyWindow.pnlProperty.childNodes;
            for (let i in cnode) {
                if (cnode[i].name == "grid") {
                    propertyWindow.pnlProperty.removeChild(cnode[i]);
                    break;
                }
            }
            propertyWindow.pnlProperty.setVisibility(true);
            propertyWindow.pnlProperty.objInfo.style.height = '100%';
            propertyWindow.pnlProperty.objInfo.innerHTML = lblTxt;
            // if (lblTxt == "") {
            //     frm_Property.pnlOverLayProperty.Visible = false;
            // }
        }
        Frm_Print.label2.style.left=(Frm_Print.label1.offsetWidth+10).px();
        Frm_Print.label2.innerHTML = tx
    }

    /**一番近いオブジェクトを探して数とオブジェクト番号を返す */
    function NearestObject(MapP, Layernum) {
        let OnObject = [];

        if (attrData.LayerData[Layernum].Type == enmLayerType.Trip) {

        } else {
            switch (attrData.LayerData[Layernum].Shape) {
                case (enmShape.PolygonShape): {
                    let retV = attrData.LayerData[Layernum].PrtSpatialIndex.GetRectIn(MapP.x, MapP.y);
                    if (retV.number > 0) {
                        for (let i = 0; i < retV.number; i++) {
                            if (attrData.TempData.ObjectPrintedCheckFlag[Layernum][retV.Tags[i]] == true) {
                                if (attrData.Check_Point_in_Kencode_OneObject(Layernum, retV.Tags[i], MapP) == true) {
                                    let ObjData =new strLocationSearchObject(Layernum,retV.Tags[i]) ;
                                    OnObject.push(ObjData);
                                }
                            }
                        }
                    }
                    break;
                }
                default: {
                    let retV;
                    let mind = 10 / attrData.TotalData.ViewStyle.ScrData.ScreenMG.Mul;
                    if (attrData.LayerData[Layernum].Shape == enmShape.PointShape) {
                        retV = attrData.LayerData[Layernum].PrtSpatialIndex.GetNearPointNumber(MapP.x, MapP.y, mind);
                    } else {
                        retV = attrData.LayerData[Layernum].PrtSpatialIndex.GetNearestLineNumber(MapP.x, MapP.y, mind);
                    }
                    if (retV.num > 0) {
                        let serarchNCount = 0;
                        for (let i = 0; i < retV.num; i++) {
                            if (attrData.TempData.ObjectPrintedCheckFlag[Layernum][retV.Tags[i]] == true) {
                                let ObjData = new strLocationSearchObject(Layernum, retV.Tags[i]);
                                OnObject.push(ObjData);
                                serarchNCount++;
                                if (serarchNCount == 5) {//候補は最大で5つ
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        return OnObject;
    }

    //地図上をカーソルが移動した場合に座標情報を表示
    function picMapMouseMovePointInformation(MousePosition) {
        const vs = attrData.TotalData.ViewStyle;
        let originalP = vs.ScrData.getSRXY(MousePosition);
        if(spatial.Check_PsitionReverse_Enable(originalP, vs.Zahyo)==true){
            let P  = spatial.Get_Reverse_XY(originalP, vs.Zahyo);
            let PSt  = Generic.Get_PositionCoordinate_Strings(P, vs.Zahyo);
            Frm_Print.label1.innerHTML=PSt.x + "/" + PSt.y;
        }else{
            Frm_Print.label1.innerHTML="";
        }
    }

    function Check_Acc(ScreenP) {
        let vs = attrData.TotalData.ViewStyle;
        let threed = vs.ScrData.ThreeDMode;
        let ata = attrData.TempData.Accessory_Temp;
        if (vs.MapTitle.Visible == true) {
            if (spatial.Check_PointInBox(ScreenP, vs.MapTitle.Font.Kakudo, ata.MapTitle_Rect) == true) {
                ata.Push_titleXY = vs.MapTitle.Position.Clone();
                return { type: Check_Acc_Result.Title, rect: ata.MapTitle_Rect };
            }
        }
        //------方位
        if ((vs.AttMapCompass.Visible == true) && ((vs.ScrData.ThreeDMode.Set3D_F == false) || ((threed.Pitch == 0) && (threed.Head == 0)))) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.MapCompass_Rect) == true) {
                ata.Push_CompassXY = vs.AttMapCompass.Position.Clone();
                return { type: Check_Acc_Result.Compass, rect: ata.MapCompass_Rect };
            }
        }
        //------スケール
        if ((vs.MapScale.Visible == true) && ((vs.ScrData.ThreeDMode.Set3D_F == false) || ((threed.Pitch == 0) && (threed.Head == 0)))) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.MapScale_Rect) == true) {
                ata.Push_ScaleXY = vs.MapScale.Position.Clone();
                return { type: Check_Acc_Result.Scale, rect: ata.MapScale_Rect };
            }
        }
        //------注
        if (vs.DataNote.Visible == true) {
            if (spatial.Check_PointInBox(ScreenP, 0, ata.DataNote_Rect) == true) {
                ata.Push_DataNoteXY = vs.DataNote.Position.Clone();
                return { type: Check_Acc_Result.Note, rect: ata.DataNote_Rect };
            }
        }
        //------凡例
        for (let i = ata.Legend_No_Max - 1; i >= 0; i--) {
            let lg =  ata.MapLegend_W[i];
            if ((vs.MapLegend.Base.Visible == true) || (lg.LineKind_Flag == true) || (lg.PointObject_Flag == true)) {
                if (spatial.Check_PointInBox(ScreenP, 0, lg.Rect) == true) {
                    ata.Edit_Legend = i;
                    ata.Push_LegendXY = attrData.TotalData.ViewStyle.MapLegend.Base.LegendXY[i];
                    return { type: Check_Acc_Result.Legend, rect: lg.Rect };
                }
            }
        }
        //------グループボックス
        if ((vs.AccessoryGroupBox.Visible == true) && (vs.ScrData.ThreeDMode.Set3D_F == false)) {
            let Acc_Rect = ata.GroupBox_Rect.Clone();
            let pad = attrData.Get_PaddingPixcel(vs.AccessoryGroupBox.Back);
            Acc_Rect.inflate(pad, pad);
            if (spatial.Check_PointInBox(ScreenP, 0, Acc_Rect) == true) {
                ata.Push_GroupBoxXY = vs.MapScale.Position.Clone();
                ata.OriginalGroupBoxRect = Acc_Rect.Clone();
                return { type: Check_Acc_Result.GroupBox, rect: Acc_Rect };
            }
        }
        return { type: Check_Acc_Result.NoAccessory, rect: undefined };
    }
}

class frmPrint {

    /** コピー画像ウインドウ表示*/
    static copyImageWindow(){
        frmPrint.savePNG(true)
    }

    //画像ファイルに保存
    static savePNG(WindowOutFlag = false) {
        let tilecanvas = document.createElement("canvas");
        tilecanvas.width = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.width();
        tilecanvas.height = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize.height();
        tilecanvas.style.vivility = false;
        let tg = tilecanvas.getContext('2d');
        tg.fillStyle = "#ffffff";//背後が透過色になるため白にする
        tg.fillRect(0, 0, tilecanvas.width, tilecanvas.height)
        tg.drawImage(Frm_Print.picMap, 0, 0);
        if (WindowOutFlag == true) {
            Generic.windowCenterOpen(tilecanvas.toDataURL(), tilecanvas.width, tilecanvas.height, "MANDARA JS");
        } else {
            Generic.prompt(undefined, "画像ファイル名", "mandara.png", function (v) {
                let a = document.createElement('a');
                a.href = tilecanvas.toDataURL();
                a.download = v;
                a.click();
                });
        }
    }

    //線種ラインパターン設定
    static linePattern(data,e) {
        const backDiv = Generic.set_backDiv("", "線種ラインパターン設定", 240, 380, true, true, buttonOK, 0.2, true);
        Generic.Set_Box_Position_in_Browser(e, backDiv);

        Generic.createNewSpan(backDiv, "地図ファイル", "", "", 15, 35, "", "");
        let NewLineKind = [];
        let MapFileList = attrData.GetMapFileName()
        let list = [];
        for (let i = 0; i < MapFileList.length; i++) {
            let LK = attrData.SetMapFile(MapFileList[i]).Get_TotalLineKind();
            NewLineKind.push(LK);
            list.push({ value: MapFileList[i], text: MapFileList[i] });
        }
        const selectDataItem = Generic.createNewSelect(backDiv, list, 0, "", 15, 55, false, mapListchange, "width:210px;");
        const pnlLinePattern = Generic.createNewDiv(backDiv, "", "", "", 15, 85, 210, 200, "overflow-y:scroll;overflow-x:hidden;border:solid 1px;border-color:#666666;", "");
        const pnlLineList = Generic.createNewDiv(pnlLinePattern, "", "", "", 0, 0, 210, 100, "", "");
        let meshf=false;
        for (let i = 0; i < attrData.TotalData.LV1.Lay_Maxn; i++) {
            if (attrData.LayerData[i].Type == enmLayerType.Mesh) {
                meshf= true;
                break;
            }
        }
        const pnlMeshLine = Generic.createNewDiv(backDiv, "", "", "", 15, 290, 200, 40, "", "");
        const picMeshLine=Generic.createNewWordDivCanvas(pnlMeshLine, "","メッシュデータの輪郭ラインパターン",0,0,100,meshLinePatternClick);
        let MeshLpat=attrData.TotalData.ViewStyle.MeshLine.Clone();
        if (meshf == true) {
            pnlMeshLine.setVisibility(true);
            attrData.Draw_Sample_LineBox(picMeshLine,MeshLpat );
            pnlLinePattern.style.height = (pnlMeshLine.offsetTop - pnlLinePattern.offsetTop - 5).px();
        } else {
            pnlMeshLine.setVisibility(false);
            pnlLinePattern.style.height = (pnlMeshLine.offsetTop + pnlMeshLine.offsetHeight - pnlLinePattern.offsetTop).px();
        }
        showLinePattern();

        function meshLinePatternClick(e) {
            clsLinePatternSet(e, MeshLpat, LinePatternGet);
            function LinePatternGet(Lpat) {
                MeshLpat = Lpat;
                attrData.Draw_Sample_LineBox(e.target, Lpat);
            }
        }
        function mapListchange() {
            showLinePattern();
        }
        function buttonOK() {
            for (let i = 0; i < MapFileList.length; i++) {
                let lk = [];
                for (let j in NewLineKind[i]) {
                    let d = new LPatSek_Info();
                    d.Pat = NewLineKind[i][j].Pat.Clone();
                    lk.push(d);
                }
                attrData.SetMapFile(MapFileList[i]).Set_TotalLineKind(lk);
            }
            attrData.TotalData.ViewStyle.MeshLine = MeshLpat.Clone();
            Generic.clear_backDiv();
            clsPrint.printMapScreen(Frm_Print.picMap);
        }

        function showLinePattern(){
            const LineKindHeight=35;
            while (pnlLineList.lastChild) {
                pnlLineList.removeChild(pnlLineList.lastChild);
            }
            let Mpindex  = selectDataItem.selectedIndex
            let lnum  = NewLineKind[Mpindex].length;
            pnlLineList.style.height = (lnum * LineKindHeight + 10).px();

            for(let i  = 0 ;i< lnum;i++){
                let lk=NewLineKind[Mpindex][i];
                let y=i * LineKindHeight + 3;
                let lc=Generic.createNewWordDivCanvas(pnlLineList, "",lk.Name,10,y,100,inePatternClick);
                lc.tag=i;
                attrData.Draw_Sample_LineBox(lc, lk.Pat);
            }
            function inePatternClick(e){
                let n=e.target.tag;
                clsLinePatternSet(e, NewLineKind[Mpindex][n].Pat, LinePatternGet);
                function LinePatternGet(Lpat) {
                    NewLineKind[Mpindex][n].Pat = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                }
            }
        }
}

    static windowClose(){
        propertyWindow.nextVisible=(propertyWindow.getVisibility()==true);
        propertyWindow.setVisibility(false);
        frmPrint.propertyWindowClose();
    }

    static propertyWindowClose(){
        propertyWindow.fixed=false;
        propertyWindow.pnlProperty.setVisibility(false);
        propertyWindow.style.borderWidth='1px';    

    }

    //プロパティウインドウの表をコピー
    static copyProperty(){
        let toptx=propertyWindow.pnlProperty.objInfo.innerText+'\n'+'\n';
        let gridtx="";
        let cnode = propertyWindow.pnlProperty.childNodes;
        for(let i in cnode){
            if(cnode[i].name=="grid"){
                gridtx=Generic.getTableValue(cnode[i].table);
                break;
            }
        }
        Generic.copyText(toptx+gridtx);
    }

    //プロパティウインドウの固定・解除
    static PropertyFix() {
        if (propertyWindow.pnlProperty.getVisibility() == true) {
            let f = !propertyWindow.fixed;
            if (f == true) {
                propertyWindow.style.borderWidth = '2px';
            } else {
                propertyWindow.style.borderWidth = '1px';
            }
            propertyWindow.fixed = f;
        }
    }

    //複数オブジェクトのプロパティ表示
    static ShowOverLayObjectProperty(Layernum,dtindex,OnObject ){
        if ((propertyWindow.pnlProperty.getVisibility()==true) && (attrData.TempData.frmPrint_Temp.PrintMouseMode == enmPrintMouseMode.Normal)) {
            let cnode = propertyWindow.pnlProperty.childNodes;
            for(let i in cnode){
                if(cnode[i].name=="grid"){
                    propertyWindow.pnlProperty.removeChild(cnode[i]);
                    break;
                }
            }
        }
        propertyWindow.pnlProperty.setVisibility(true);
        let ptx = "";
        for (let i = 0; i < OnObject.length; i++) {
            ptx += attrData.Get_KenObjName(Layernum, OnObject[i].ObjNumber) + '<br>' +
                attrData.Get_DataTitle(Layernum, dtindex, false) + ":" +
                attrData.Get_Data_Value(Layernum, dtindex, OnObject[i].ObjNumber, attrData.TotalData.ViewStyle.Missing_Data.Label) +
                attrData.Get_DataUnit_With_Kakko(Layernum, dtindex);
            if (i != OnObject.length - 1) {
                ptx += '<br>' + '<br>';
            }
            propertyWindow.pnlProperty.objInfo.style.height = '100%';
            propertyWindow.pnlProperty.objInfo.innerHTML = ptx;
        }
    }

    //1オブジェクトのプロパティ表示
    static ShowOneObjectProperty(LayerNum ,  objNumber ,  DataNumber , LayerMode ){
        if ((propertyWindow.oObject == objNumber) && (propertyWindow.oLayer == LayerNum) && (propertyWindow.oData == DataNumber) && (propertyWindow.pnlProperty.getVisibility() == true)) {
            return;
        }
        let headTx="";
        let headHeight;
        propertyWindow.pnlProperty.setVisibility(true);

        let cnode = propertyWindow.pnlProperty.childNodes;
        for (let i in cnode) {
            if (cnode[i].name == "grid") {
                propertyWindow.pnlProperty.removeChild(cnode[i]);
                break;
            }
        }
        let data=[];
        switch (LayerMode) {
            case enmLayerMode_Number.SoloMode: {
                headTx = "<b>" + attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headTx+=attrData.getOneObjectPanelLabelString(LayerNum, DataNumber, objNumber, '<br>' + " ");
                headHeight=90;
                let n = attrData.Get_DataNum(LayerNum);
                data = Generic.Array2Dimension(3, n + 1);
                data[0][0] = "データ項目";
                data[1][0] = "値";
                data[2][0] = "単位";
                for (let i = 0; i < n; i++) {
                    data[0][i + 1] = attrData.Get_DataTitle(LayerNum, i, true);
                    data[1][i + 1] = attrData.Get_Data_Value(LayerNum, i, objNumber, "");
                    data[2][i + 1] = attrData.Get_DataUnit(LayerNum, i);
                }
                break;
            }
            case enmLayerMode_Number.GraphMode: {
                headTx = "<b>" + attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headHeight=30;
                let al=attrData.LayerData[LayerNum];
                let Dset  = al.LayerModeViewSettings.GraphMode.SelectedIndex;
                let ald=al.LayerModeViewSettings.GraphMode.DataSet[Dset];
                let DataItem = ald.Data;
                let n = DataItem.length;
                if (n == 0) {
                    return;
                }
                switch (ald.GraphMode) {
                    case enmGraphMode.PieGraph:
                    case enmGraphMode.StackedBarGraph: {
                        data = Generic.Array2Dimension(3, n + 2);
                        data[0][0] = "データ項目";
                        data[1][0] = "値(" + attrData.Get_DataUnit(LayerNum, DataItem[0].DataNumber) + ")";
                        data[2][0] = "割合(%)";
                        let sum = 0;
                        let v = [];
                        for (let i = 0; i < n; i++) {
                            data[0][i + 1] = attrData.Get_DataTitle(LayerNum, DataItem[i].DataNumber, true);
                            let val = Number(attrData.Get_Data_Value(LayerNum, DataItem[i].DataNumber, objNumber, ""));
                            data[1][i + 1] = val;
                            v.push(val);
                            sum += val;
                        }
                        v.push(sum);
                        data[0][n + 1] = "合計";
                        data[1][n + 1] =  sum;
                        ;
                        for (let i = 0; i <= n; i++) {
                            data[2][i + 1] = (v[i] / sum * 100).toFixed(2);
                        }
                        break;
                    }
                    case enmGraphMode.LineGraph:
                    case enmGraphMode.BarGraph: {
                        data = Generic.Array2Dimension(2, n + 5);
                        data[0][0] = "データ項目";
                        data[1][0] = "値(" + attrData.Get_DataUnit(LayerNum, DataItem[0].DataNumber) + ")";
                        let sum = 0;
                        let v = [];
                        for (let i = 0; i < n; i++) {
                            data[0][i + 1] = attrData.Get_DataTitle(LayerNum, DataItem[i].DataNumber, true);
                            let val =Number( attrData.Get_Data_Value(LayerNum, DataItem[i].DataNumber, objNumber, ""));
                            data[1][i + 1] = val;
                            v.push(val);
                            sum += val;
                        }
                        v.sort(function (a, b) { return a - b; });
                        data[0][n + 1] = "合計";
                        data[0][n + 2] = "平均値";
                        data[0][n + 3] = "最大値";
                        data[0][n + 4] = "最小値";
                        data[1][n + 1] = sum;
                        data[1][n + 2] = (sum / n).toFixed(4);
                        data[1][n + 3] = v[n - 1];
                        data[1][n + 4] = v[0];
                        break;
                    }
                }
                break;
            }
            case enmLayerMode_Number.LabelMode: {
                headTx = "<b>" + attrData.Get_KenObjName(LayerNum, objNumber) + "</b><br>";
                headHeight=30;
                let al=attrData.LayerData[LayerNum];
                let Dset  = al.LayerModeViewSettings.LabelMode.SelectedIndex;
                let ald=al.LayerModeViewSettings.LabelMode.DataSet[Dset];
                let DataItem = ald.DataItem;
                let n = DataItem.length;
                data = Generic.Array2Dimension(3, n + 1);
                data[0][0] = "データ項目";
                data[1][0] = "値";
                data[2][0] = "単位";
                for (let i = 0; i < n; i++) {
                    data[0][i + 1] = attrData.Get_DataTitle(LayerNum, DataItem[i], true);
                    data[1][i + 1] =  attrData.Get_Data_Value(LayerNum, DataItem[i], objNumber, "");
                    data[2][i + 1] = attrData.Get_DataUnit(LayerNum, i);
                }
                break;
            }
        }
        propertyWindow.pnlProperty.objInfo.innerHTML = headTx;
        propertyWindow.pnlProperty.objInfo.style.height = headHeight.px();
        propertyWindow.oObject = objNumber;
        propertyWindow.oLayer = LayerNum;
        propertyWindow.oData = DataNumber;

        let y=propertyWindow.pnlProperty.objInfo.offsetHeight;
        let gd=Generic.createNewGrid(propertyWindow.pnlProperty, "", "", "", "", data, 0, y, '100%', propertyWindow.pnlProperty.offsetHeight - 70,'100%', "", "font-size:13px", 1, "background-color:#aaffaa;",  "", "", "");
        gd.name="grid";
}

    static set_frmPrint_Window_Size() {
        let FpicRect  = attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize;
        Frm_Print.style.left = (FpicRect.left - scrMargin.side).px();
        Frm_Print.style.top = (FpicRect.top - scrMargin.top).px();
        Frm_Print.style.width =(FpicRect.width() + scrMargin.side*2).px();
        Frm_Print.style.height = (FpicRect.height() + scrMargin.top + scrMargin.bottom).px();
        propertyWindow.style.left=(Frm_Print.style.left.removePx()+Frm_Print.style.width.removePx()+10).px();
        propertyWindow.style.top=(Frm_Print.style.top.removePx()+scrMargin.top).px();
        propertyWindow.style.height=Frm_Print.style.height;
        Generic.moveInnerElement(propertyWindow);
        this.resizeMapWindow();
    }
    
    static resizeMapWindow() {
        var mapDIV = Frm_Print.picMap.parentNode;
        Frm_Print.picMap.style.left = scrMargin.side.px();
        Frm_Print.picMap.style.top = scrMargin.top.px();
        Frm_Print.picMap.width = mapDIV.style.width.removePx() - scrMargin.side * 2;
        Frm_Print.picMap.height = mapDIV.style.height.removePx() - scrMargin.top - scrMargin.bottom;
        let p = new point(Frm_Print.style.left.removePx() + scrMargin.side, Frm_Print.style.top.removePx() + scrMargin.top);
        let s = new size(Frm_Print.picMap.width, Frm_Print.picMap.height);
        attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize = new rectangle(p, s);
        Generic.moveInnerElement(Frm_Print);
        if(Frm_Print.maxSizeFlag==false){
            Frm_Print.oldpos=new rectangle(new point(Frm_Print.style.left.removePx(),Frm_Print.style.top.removePx()),
                        new size(Frm_Print.style.width.removePx(),Frm_Print.style.height.removePx()));
        }
        Frm_Print.resetMaxButton(!Frm_Print.maxSizeFlag);
        if (Frm_Print.getVisibility() == true) {
            clsPrint.printMapScreen(Frm_Print.picMap, attrData);
        }
    }
    static Init_FrmPrint() {
        let ScreenH = Generic.getBrowserHeight();
        let ScreenW = Generic.getBrowserWidth();
    
        let a = ScreenH * 0.7;
        if (ScreenH > ScreenW) {
            a = ScreenW * 0.7;
        }
        let psw = a + scrMargin.side * 2;
        let psh = a / 1.41 + scrMargin.top + scrMargin.bottom;
    
        let p = new point(ScreenW / 2 - psw / 2, ScreenH / 2 - psh / 2);
        let s = new size(psw, psh);
        attrData.TotalData.ViewStyle.ScrData.frmPrint_FormSize = new rectangle(p, s);
        Frm_Print.resetMaxButton(true);
        Frm_Print.label1.innerHTML="";
        Frm_Print.label2.innerHTML="";
        Frm_Print.label3.innerHTML="";
    }
    

    /**連続表示ボタン 次*/
    static seriesNext() {
        let ats = attrData.TotalData.TotalMode.Series;
        let n = ats.SelectedIndex;
        let atst = attrData.TempData.Series_temp;
        atst.Koma = (atst.Koma == ats.DataSet[n].DataItem.length - 1) ? 0 : atst.Koma+1;
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    /**連続表示ボタン 前*/
    static seriesBefore() {
        let ats = attrData.TotalData.TotalMode.Series;
        let n = ats.SelectedIndex;
        let atst = attrData.TempData.Series_temp;
        atst.Koma  = (atst.Koma == 0) ? ats.DataSet[n].DataItem.length - 1 : atst.Koma-1;
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    //全体表示ボタン
    static wholeMapShow() {
        attrData.TotalData.ViewStyle.ScrData.ScrView = attrData.TotalData.ViewStyle.ScrData.MapRectangle.Clone();
        clsPrint.printMapScreen(Frm_Print.picMap);
    }

    //カーソル位置のオブジェクトを強調
    static PrintCursorObjectLine(g, Draw_F) {
        let OnObject = attrData.TempData.frmPrint_Temp.OnObject;
        let OldObject = attrData.TempData.frmPrint_Temp.OldObject;
        if (OnObject.length == 0) {
            if (OldObject.length > 0) {
                g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);
                attrData.TempData.frmPrint_Temp.OldObject = [];
            }
            return;
        } else {
            if ((OnObject.length == OldObject.length) && (Draw_F == false)) {
                //ちらつき防止のため、描画済みの場合は再描画しない
                let f = false;
                for (let i in OnObject) {
                    for (let j in OldObject) {
                        if ((OnObject[i].ObjNumber != OldObject[j].ObjNumber) || (OnObject[i].objLayer != OldObject[j].objLayer)) {
                            f = true;
                            break;
                        }
                    }
                }
                if (f == false) {
                    return;
                }
            }
        }
        g.putImageData(attrData.TempData.frmPrint_Temp.image, 0, 0);
        attrData.TempData.frmPrint_Temp.OldObject = Generic.ArrayClone(OnObject);
        for (let i in OnObject) {
            printSelectedObject(g, OnObject[i].objLayer, OnObject[i].ObjNumber);
        }

        function printSelectedObject(g, Layernum, ObjNum) {
            const sp = attrData.LayerData[Layernum].Shape;
            switch (sp) {
                case enmShape.PointShape: {
                    let CP = attrData.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Symbol;
                    let OP = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(CP);
                    let Mk = clsBase.Mark();
                    Mk.Tile.Color = new colorRGBA([255, 0, 150, 150]);
                    attrData.Draw_Mark(g, OP, 10, Mk)
                    break;
                }
                case enmShape.LineShape:
                case enmShape.PolygonShape: {

                    let w = 3;
                    if (sp == enmShape.LineShape) {
                        w = 5;
                    }
                    if (attrData.LayerData[Layernum].Type == enmLayerType.Mesh) {
                        let meshP = Generic.ArrayClone(attrData.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MeshPoint);
                        meshP[4] = meshP[0].Clone();
                        let pxy = attrData.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(5, meshP, false);
                        drawLines(g, pxy, 3, new colorRGBA([255, 0, 150, 200]));
                    } else {
                        let ELine = attrData.Get_Enable_KenCode_MPLine(Layernum, ObjNum);
                        for (let j in ELine) {
                            let pxy = clsPrint.Get_PointXY_by_LineCode(Layernum, ELine[j].LineCode, false);
                            if (pxy != undefined) {
                                drawLines(g, pxy, w, new colorRGBA([255, 0, 150, 150]));
                            }
                        }
                    }
                    break;
                }
            }
            function drawLines(g, pxy, w, col) {
                g.lineWidth = w;
                g.strokeStyle = col.toRGBA();
                g.beginPath();
                g.moveTo(pxy[0].x, pxy[0].y);
                pxy.forEach(function (p) {
                    g.lineTo(p.x, p.y);
                });
                g.stroke();
            }
        }
    }
}


