// JavaScript source code

//カラーチャート
function clsColorChart(event,ClassN,buttonOK){
    const colorChart = Generic.set_backDiv("", "カラーチャート", 260, 400, false, true, undefined, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, colorChart);
    const pnlColorPattern = Generic.createNewDiv(colorChart, "", "", "", 10, scrMargin.top + 10, 240, 310, "overflow-y: scroll;border:solid 1px;border-color:#666666;", "");
    const pnlPatternList = Generic.createNewDiv(pnlColorPattern, "", "", "", 0, 0, 210, 100, "", "");

    let picw = pnlPatternList.offsetWidth * 0.9;
    let pich = 25;
    let topMargin = pich / 2;
    let leftMargin = picw * 0.05;
    let colorPat = [];

    let blue = new colorRGBA([0, 65, 255]);
    let red = new colorRGBA([255, 40, 0]);
    let yellow = new colorRGBA([255, 230, 0]);
    let green = new colorRGBA([0, 0x77, 0x10]);

    colorPat.push([clsBase.ColorBlack(), clsBase.ColorWhite()]);
    colorPat.push([blue, clsBase.ColorWhite()]);
    colorPat.push([new colorRGBA([0x8, 0x51, 0x9C]), new colorRGBA([0xEF, 0xF3, 0xFF])]);
    colorPat.push([new colorRGBA([0x54, 0x27, 0x8F]), new colorRGBA([0xF2, 0xF0, 0xF7])]);
    colorPat.push([red, clsBase.ColorWhite()]);
    colorPat.push([red, new colorRGBA([0x56, 0x86, 0x36])]);
    colorPat.push([new colorRGBA([0xEC, 0x34, 0x4]), new colorRGBA([0xFF, 0xDE, 0xC3])]);
    colorPat.push([new colorRGBA([0x99, 0x34, 0x4]), new colorRGBA([0xFF, 0xFF, 0xC4])]);
    colorPat.push([new colorRGBA([0xA6, 0x36, 0x3]), new colorRGBA([0xFE, 0xED, 0xDE])]);
    colorPat.push([new colorRGBA([0xA5, 0xF, 0x15]), new colorRGBA([0xFE, 0xE5, 0xD9])]);
    colorPat.push([new colorRGBA([0xB0, 0x0, 0x26]), new colorRGBA([0xFF, 0xFF, 0xB2])]);
    colorPat.push([new colorRGBA([0x0, 0x62, 0x2C]), new colorRGBA([0xED, 0xF8, 0xE9])]);
    colorPat.push([new colorRGBA([0, 0x37, 0x0]), new colorRGBA([0xE6, 0xE6, 0x96])]);
    colorPat.push([red, blue]);
    colorPat.push([new colorRGBA([0xB0, 0x0, 0x26]), new colorRGBA([0xFF, 0xFF, 0xB2]), new colorRGBA([0xBF, 0xBF, 0xFF])]);
    colorPat.push([new colorRGBA([255,191,191]), new colorRGBA([0xFF, 0xFF, 0xB2]), new colorRGBA([0xBF, 0xBF, 0xFF])]);
    colorPat.push([new colorRGBA([255,128,0]), new colorRGBA([0xFF, 0xFF, 0xB2]), new colorRGBA([0xBF, 0xBF, 0xFF])]);
    colorPat.push([red, clsBase.ColorWhite(), blue]);
    colorPat.push([red, new colorRGBA([255, 255, 191]), blue]);
    colorPat.push([red, yellow, blue]);
    colorPat.push([red, yellow, green]);
    colorPat.push([new colorRGBA([255, 0x80, 0]), new colorRGBA([255, 0xFF, 0xBF]), new colorRGBA([0x55, 0xBF, 0x55])]);
    colorPat.push([new colorRGBA([0xEC, 0x34, 0x4]), new colorRGBA([0xFF, 0xDE, 0xC3]), green]);
    colorPat.push([red, yellow, new colorRGBA([0, 255, 0]), blue]);
    colorPat.push([new colorRGBA([255, 0x80, 0]), new colorRGBA([255, 0xFF, 0xBF]), new colorRGBA([0x55, 0xBF, 0x55]), new colorRGBA([0xBF, 0xBF, 0xFF])]);
    colorPat.push([new colorRGBA([255, 0x80, 0]), new colorRGBA([255, 0xFF, 0xBF]), new colorRGBA([0x55, 0xBF, 0x55]), new colorRGBA([85, 85, 191])]);
    colorPat.push([red, yellow, clsBase.ColorGreen(), blue, new colorRGBA([0, 0, 50])]);
    colorPat.push([new colorRGBA([180, 0, 104]), red, yellow, clsBase.ColorGreen(), blue, new colorRGBA([0, 0, 50])]);
    colorPat.push([new colorRGBA([180, 0, 104]), red, yellow, clsBase.ColorGreen(), new colorRGBA([185, 235, 255]), blue, new colorRGBA([0, 0, 50])]);

    let ConvColor = [];
    let maxn = colorPat.length;
    for (let i in colorPat) {
        if (colorPat[i].length > ClassN) {
            maxn = i;
            break;
        }
    }
    pnlPatternList.style.height = pich * maxn + topMargin * 2;
    for (let i = 0; i < maxn; i++) {
        let y = pich * i + topMargin;
        let canvas = Generic.createNewCanvas(pnlPatternList, "", "imgButton", leftMargin, y, picw, pich - 4, selectColor);
        canvas.tag = i;
        let ColData = [];// colorRGBA
        let colcol = []; // colorRGBA
        for (let j in colorPat[i]) {
            colcol.push(colorPat[i][j].Clone());
        }
        let colnum = colorPat[i].length;
        switch (colnum) {
            case 2:
                ColData = Generic.TwoColorGradation(colcol[0], colcol[1], ClassN);
                break;
            case 3:
                let cp = parseInt(ClassN / 2);
                ColData = Generic.ThreeColorGradation(colcol[0], colcol[1], colcol[2], ClassN, cp);
                break;
            default:
                let pos = [];
                for (let j = 0; j < colnum - 1; j++) {
                    pos.push(parseInt((j / (colnum - 1)) * ClassN));
                }
                pos.push(ClassN - 1);
                for (let j = 0; j < colnum - 1; j++) {
                    let tcol = Generic.TwoColorGradation(colcol[j], colcol[j + 1], pos[j + 1] - pos[j] + 1);
                    for (let k=0;k< tcol.length;k++) {
                        ColData[pos[j] + k] = tcol[k];
                    }
                }
                break;
        }

        var ctx = canvas.getContext("2d");
        for (let j = 0; j < ClassN; j++) {
            let left = picw * (j / ClassN);
            let right = picw * ((j + 1) / ClassN);
            ctx.fillStyle = ColData[j].toRGBA();
            ctx.fillRect(left, 0, right - left, pich-4);
        }
        ConvColor.push(ColData);
    }

    function selectColor(){
        Generic.clear_backDiv();
        let n=this.tag;
        buttonOK(ConvColor[n]);
    }
}

/**カラーピッカー event_pointがpointの場合は表示位置のみ、targetがある場合はその要素の色も変える*/
function clsColorPicker(event_point,okEvent) {
    /// <signature>
    /// <summary>カラーピッカー</summary>
    /// <param name="event" >eventの引数。表示位置を決める。</param>
    /// <param name="okEvent" >okされた際に呼び出す関数</param>
    /// </signature>
    
    let OriginControl;
    let framepos;
    if( event_point instanceof point){
        framepos=event_point.Clone(); 
    }else{
        OriginControl = event_point.target;
        framepos=new point(event_point.clientX,event_point.clientY);
    }
     

    //要素のサイズ指定 
    let colPSize = {
        picW: 35,
        picH: 25,
        picMargin: 5,
        picInterval: 6,
        buttonHeight: 20,
        buttonWidth: 60,
        rangeWidth: 100,
        rangeHeight: 30
    }
    const colorList = ['#0000ff', '#00ff00', '#00ffff', '#ff0000', '#ff00ff', '#ffff00', '#ffffff',
        '#004080', '#00a040', '#50a060', '#ff2800', '#ff80ff', '#ff8000', '#000000',
        '#000040', '#000080', '#0000bf', '#5555bf', '#aaaabf', '#ffffbf', '#dbdbdb',
        '#400000', '#800000', '#bf0000', '#bf5555', '#bfaaaa', '#bfffff', '#b7b7b7',
        '#400040', '#800080', '#bf00bf', '#bf55bf', '#bfaabf', '#bfffbf', '#929292',
        '#004000', '#008000', '#00bf00', '#55bf55', '#aabfaa', '#ffbfff', '#6e6e6e',
        '#004040', '#008080', '#00bfbf', '#55bfbf', '#aabfbf', '#ffbfbf', '#494949',
        '#404000', '#808000', '#bfbf00', '#bfbf55', '#bfbfaa', '#bfbfff', '#252525'];

    colPSize.rangeTop = Math.floor(7 * (colPSize.picH + colPSize.picInterval) + colPSize.picMargin * 2)+scrMargin.top;
    colPSize.buttonTop = colPSize.rangeTop + colPSize.rangeHeight + colPSize.picMargin;
    colPSize.totalHeight = colPSize.buttonTop + colPSize.buttonHeight + colPSize.picMargin;
    colPSize.totalWidth = Math.floor(colPSize.picMargin * 2 + 8 * (colPSize.picW + colPSize.picInterval));


    //全体のDiv
    //固定DIV作成
    let colorPickerObj = Generic.set_backDiv("", "色設定", colPSize.totalWidth, colPSize.totalHeight, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(framepos, colorPickerObj);

    //既定色Div
    for (var i = 0; i <= 55; i++) {
        var colorDivObj = document.createElement('div');
        with (colorDivObj.style) {
            position = 'absolute';
            width = colPSize.picW.px();
            height = colPSize.picH.px();
            left = Math.floor(colPSize.picMargin + Math.floor(i / 7) * (colPSize.picW + colPSize.picInterval)).px();
            top = Math.floor((i % 7) * (colPSize.picH + colPSize.picInterval) + colPSize.picMargin+scrMargin.top).px();
            border = "1px solid #888888";
            backgroundColor = colorList[i];
        }
        colorDivObj.id = 'ColorPickerColorDivObj' + i;
        colorDivObj.onclick = setCol;
        colorDivObj.setAttribute("onmouseover", "this.style.border = '2px solid #000000';");
        colorDivObj.setAttribute("onmouseout", "this.style.border = '1px solid #888888';");
        colorPickerObj.appendChild(colorDivObj);
    }

    //透過度指定
    var rangeNameObj = document.createElement('span');
    rangeNameObj.innerHTML = "不透明度"
    with (rangeNameObj.style) {
        position = 'absolute';
        fontSize = "12px";
        color = "#000000";
        top = (colPSize.rangeTop).px();
        left = (50).px();
    }
    colorPickerObj.appendChild(rangeNameObj);
    let ocol;
    if(OriginControl!=undefined){
        ocol = Generic.RGBAfromElement(OriginControl);
    }else{
        ocol=clsBase.ColorWhite();
    }
     
    let rangeObj = document.createElement('input');
    rangeObj.type = 'range';
    rangeObj.min = 0;
    rangeObj.max = 100;
    rangeObj.step = 10;
    rangeObj.value = ocol.a/2.55;
    rangeObj.id = 'ColorPickerOpacityRange';
    with (rangeObj.style) {
        position = 'absolute';
        fontSize = "12px";
        width = colPSize.rangeWidth.px();
        top = (colPSize.rangeTop).px();
        left = (100).px();
    }
    rangeObj.onchange = setColBar;
    colorPickerObj.appendChild(rangeObj);

    //カラー表示用Box
    var colorPickerBox = document.createElement('input');
    colorPickerBox.type = 'text';
    colorPickerBox.id = 'ColorPickerColorPic';
    colorPickerBox.disabled = true;
    with (colorPickerBox.style) {
        position = 'absolute';
        top =( colPSize.buttonTop-3).px();
        left = (colPSize.picMargin * 2).px();
        width = "60px";
        height = (colPSize.buttonHeight ).px();
        backgroundColor = ocol.toRGBA();
        opacity = ocol.a;
        border = "1px solid #444444";
    }
    colorPickerObj.appendChild(colorPickerBox);

    function setCol(e) {
        var col = Generic.RGBAfromElement(e.target);
        col.a =parseInt( rangeObj.value * 2.55);
        colorPickerBox.style.backgroundColor = col.toRGBA();
    }

    function setColBar() {
        var col = Generic.RGBAfromElement(colorPickerBox);
        col.a = parseInt( rangeObj.value * 2.55);
        colorPickerBox.style.backgroundColor = col.toRGBA();
    }

    function buttonOK() {
        if (OriginControl != undefined) {
            OriginControl.style.backgroundColor = document.getElementById('ColorPickerColorPic').style.backgroundColor;
        }
        if (okEvent != undefined) {
            if (OriginControl != undefined) {
                okEvent(event_point);
            } else {
                okEvent(Generic.RGBAfromElement(document.getElementById('ColorPickerColorPic')));
            }
        }
        Generic.clear_backDiv();
    }
}

function clsMarkSet(event, okEvent,mark, _attrData) {
    /// <signature>
    /// <summary>記号選択</summary>
    /// <param name="event" >eventの引数。表示位置を決める。</param>
    /// <param name="okEvent" >okされた際に呼び出す関数</param>
    /// </signature>
    //全体のDiv
    //固定DIV作成
    const backDiv = Generic.set_backDiv("", "記号設定", 275, 240, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);

    const gbMark = Generic.createNewFrame(backDiv, "", "", 15, scrMargin.top+5, 245, 60, "表示記号");
    let mk = mark.Clone();
    const MarkPrintType = [{ value: enmMarkPrintType.Mark, text: "既定記号" },
        { value: enmMarkPrintType.Word, text: "文字記号" }];
    Generic.createNewRadioButtonList(gbMark, "MarkPrintType",MarkPrintType, 10, 10,undefined, 18,mk.PrintMark, markPrintTypeChange, "");
    const pnlMark = Generic.createNewDiv(gbMark, "", "", "", 110, 0, 100, 60, "", "");
    const picMark = Generic.createNewCanvas(pnlMark, "","imgButton", 0, 15, 30, 30,markClick,"");
    const picFrameLine = Generic.createNewWordDivCanvas(pnlMark, "", "輪郭", 40, 18,undefined, LinePatternClick);
    const pnlWord = Generic.createNewDiv(gbMark, "", "", "", 110, 0, 100, 60, "", "");
    const txtWord = Generic.createNewInput(pnlWord, "text", mk.wordmark, "", 0, 18, "", "width: 50px");
    txtWord.onchange = function (e) {
        mk.wordmark= e.target.value;
    }
    txtWord.style.color = mk.WordFont.Color.toHex();
    Generic.createNewButton(pnlWord, "フォント", "", 60, 18,fontClick,"" );
    // Generic.checkRadioByValue("MarkPrintType", mk.PrintMark);
    markPrintTypeChange(mk.PrintMark);
    const gbSize = Generic.createNewFrame(backDiv, "", "", 15, 110, 245, 85, "");
    const sizeBox = Generic.createNewSizeSelect(gbSize, mk.WordFont.Size, "","サイズ", 15, 15,40,2, undefined);
    const innerColorBox = Generic.createNewTileBox(gbSize, "", "内部", mk.Tile, 150, 15,undefined, tileClick);
    const backrColorBox = Generic.createNewWordDivCanvas(gbSize, "", "背景", 150, 45,undefined, backClick);
    clsDrawTile.Darw_Sample_BackGroundBox(backrColorBox, mk.WordFont.Back, _attrData.TotalData.ViewStyle.ScrData);
    const angleBox = Generic.createNewWordNumberInput(gbSize, "回転角度", "度", mk.WordFont.Kakudo, "", 15,45,undefined, 40, undefined, "");

    function fontClick(e) {
        mk.WordFont.Kakudo = Number(angleBox.value);
        mk.WordFont.Size = Number(sizeBox.value);
        clsFontSet(e, mk.WordFont, fontGet, _attrData);
        function fontGet(newFont) {
            mk.WordFont = newFont;
            angleBox.value = mk.WordFont.Kakudo;
            sizeBox.setNumberValue(mk.WordFont.Size);
            txtWord.style.color = mk.WordFont.Color.toHex();
            mk.Tile.Color = mk.WordFont.Color;
            Generic.setTileDiv(innerColorBox, mk.Tile);
            clsDrawTile.Darw_Sample_BackGroundBox(backrColorBox, mk.WordFont.Back, _attrData.TotalData.ViewStyle.ScrData);
            _attrData.Draw_Sample_Mark_Box(picMark, mk);
        }
    }
    function backClick(e) {
        clsBackgroundPatternSet(e, mk.WordFont.Back, backGet, _attrData);
        function backGet(back) {
            mk.WordFont.Back = back;
            clsDrawTile.Darw_Sample_BackGroundBox(backrColorBox, mk.WordFont.Back, _attrData.TotalData.ViewStyle.ScrData);
            _attrData.Draw_Sample_Mark_Box(picMark, mk);
        }
    }

    function LinePatternClick(e) {
        clsLinePatternSet(e, mk.Line, LinePatternGet);
        function LinePatternGet(Lpat) {
            mk.Line = Lpat;
            _attrData.Draw_Sample_LineBox(picFrameLine, mk.Line);
            _attrData.Draw_Sample_Mark_Box(picMark, mk);
        }
    }

    function markClick(e) {
        clsMarkSelect(e, markSet, mk.ShapeNumber);
        function markSet(number) {
            mk.ShapeNumber = number;
            _attrData.Draw_Sample_Mark_Box(picMark, mk);
        }
    }

    function tileClick(e) {
        clsTileSet(e, mk.Tile, tileGet);
        function tileGet(retTile) {
            mk.Tile = retTile;
            mk.WordFont.Color = mk.Tile.Color;
            txtWord.style.color = mk.Tile.Color.toHex();
            _attrData.Draw_Sample_Mark_Box(picMark, mk);
        }
    }
    function markPrintTypeChange(v) {
        mk.PrintMark = v;
        switch (mk.PrintMark) {
            case (enmMarkPrintType.Mark): {
                pnlMark.style.visibility = 'visible';
                pnlWord.style.visibility='hidden';
                _attrData.Draw_Sample_Mark_Box(picMark, mk);
                _attrData.Draw_Sample_LineBox(picFrameLine, mk.Line);
                break;
            }
            case (enmMarkPrintType.Word): {
                pnlMark.style.visibility = 'hidden';
                pnlWord.style.visibility = 'visible';
                break;
            }
        }
    }

    function buttonOK() {
        mk.WordFont.Kakudo = Number(angleBox.value);
        mk.WordFont.Size = Number(sizeBox.value);
        Generic.clear_backDiv();
        okEvent(mk);
    }
    //記号選択ウインドウ
    function clsMarkSelect(event, okEvent, markNumber) {
        let n = clsDrawMarkFan.getMarkShameNum();
        let turnN = 6;
        let tp = scrMargin.top+5;
        let left = 15;
        let size =30;
        let fwidth = left * 2 + turnN * (size);
        let fheight =  (Math.ceil(n / turnN)+1) * (size) + 50;
        const backDiv = Generic.set_backDiv("", "記号選択", fwidth, fheight , true, true, buttonOK, 0, true);
        Generic.Set_Box_Position_in_Browser(event, backDiv);
        let selected = Generic.createNewCanvas(backDiv, "", "grayFrame", left, fheight - 40, size, size,"" , "");
        let smk = clsBase.Mark();
        smk.ShapeNumber = markNumber;
        _attrData.Draw_Sample_Mark_Box(selected, smk);
        for (let i = 0; i < n; i++) {
            let x = left + (i % turnN) * size+1;
            let y = tp + parseInt(i / turnN) * size+1;
            let c = Generic.createNewCanvas(backDiv, String(i), "grayFrame", x, y, size - 2, size - 2, clickMark, "");
            c.setAttribute("onmouseover", "this.style.border = '1px solid #ff5500';");
            c.setAttribute("onmouseout", "this.style.border = '1px solid #666666';");
            smk.ShapeNumber = i;
            _attrData.Draw_Sample_Mark_Box(c,  smk);
        }
        function clickMark(e) {
            let n = parseInt(e.target.id);
            smk.ShapeNumber = n;
            _attrData.Draw_Sample_Mark_Box(selected, smk);
        }
        function buttonOK() {
            Generic.clear_backDiv();
            okEvent(smk.ShapeNumber);
        }
    }
}

function clsBackgroundPatternSet(event, back, okEvent, _attrData) {
    /// <signature>
    /// <summary>背景設定</summary>
    /// <param name="event" >eventの引数。表示位置を決める。</param>
    /// <param name="back" >最初の背景。</param>
    /// <param name="okEvent" >okされた際に呼び出す関数</param>
    /// </signature>
    const backDiv = Generic.set_backDiv("", "背景フレーム設定", 180, 215, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);

    let bk = back.Clone();
    const innerColorBox = Generic.createNewTileBox(backDiv, "", "背景", back.Tile, 15, scrMargin.top+5,undefined,  tileClick);
    const picFrameLine = Generic.createNewWordDivCanvas(backDiv, "", "枠線", 15, 70,undefined, LinePatternClick);
    _attrData.Draw_Sample_LineBox(picFrameLine, bk.Line);
    const cornerSize = Generic.createNewSizeSelect(backDiv, back.Round, "", "角丸サイズ", 15, 110,70, 1, "");
    const paddingSize = Generic.createNewSizeSelect(backDiv, back.Padding, "", "余白", 15, 140,70, 1, "");

    function LinePatternClick(e) {
        clsLinePatternSet(e, bk.Line, LinePatternGet);
        function LinePatternGet(Lpat) {
            bk.Line = Lpat;
            _attrData.Draw_Sample_LineBox(picFrameLine, bk.Line);
        }
    }

    function tileClick(e) {
        clsTileSet(e, bk.Tile, tileGet);
        function tileGet(retTile) {
            bk.Tile = retTile;
        }
    }
    function buttonOK() {
        Generic.clear_backDiv();
        bk.Round = Number(cornerSize.value);
        bk.Padding = Number(paddingSize.value);
        okEvent(bk);
    }

}

/**タイル設定 >eventの引数。表示位置を決める。tile:最初のタイル okEvent:された際に呼び出す関数 設定されたTileを返す*/
function clsTileSet(event,  tile, okEvent) {

    const backDiv = Generic.set_backDiv("", "タイル設定", 170, 140, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);

    let newTile = tile.Clone();
    const tileType = [ { value: 1, text: "色" }, { value: 0, text: "透明" }];
    let v = (newTile.BlankF ? 0 : 1);
    Generic.createNewRadioButtonList(backDiv, "tileType", tileType, 15, scrMargin.top+13,undefined, 30,v, tileTypeChange, "");
    const colBox = Generic.createNewColorBox(backDiv, "", "",newTile.Color, 45, scrMargin.top+10, undefined);
    tileTypeChange(v);

    function tileTypeChange(v) {
        if (v == 0) {
            newTile.BlankF = true;
            colBox.style.visibility = "hidden";
        } else {
            newTile.BlankF = false;
            colBox.style.visibility = "visible";
        }
    }
    function buttonOK() {
        newTile.Color = Generic.RGBAfromElement(colBox);
        Generic.setTileDiv(event.target, newTile);
        Generic.clear_backDiv();
        okEvent(newTile);
    }
}

function clsLinePatternSet(event, line, okEvent) {
    /// <signature>
    /// <summary>ライン設定</summary>
    /// <param name="event" >eventの引数。表示位置を決める。</param>
    /// <param name="line" >最初のライン。</param>
    /// <param name="okEvent" >okされた際に呼び出す関数</param>
    /// </signature>
    //全体のDiv
    //固定DIV作成
    const backDiv = Generic.set_backDiv("", "ライン設定", 170, 180, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);

    let tile = new Tile_Property();
    tile.BlankF = line.BlankF;
    tile.Color = line.Color.Clone();
    let newEdge=line.Edge_Connect_Pattern.Clone();
    const innerColorBox = Generic.createNewTileBox(backDiv, "", "色", tile, 15, 40,40,  tileClick);
    const sizeInput = Generic.createNewSizeSelect(backDiv, line.Width, "","幅", 15, 80,40, 1, undefined);
    Generic.createNewButton(backDiv, "線端設定","",55,113,btnPaintLineEdge,"");

    function btnPaintLineEdge(e){
        clsLineEdgePattern(e, newEdge, okButton);
        function okButton(retEdge) {
            newEdge = retEdge;
        }
    }

    function tileClick(e) {
        clsTileSet(e, tile, tileGet);
        function tileGet(retTile) {
            tile = retTile;
        }
    }
         
    function buttonOK() {
        let Lpat = new Line_Property();
        Lpat.BlankF = tile.BlankF;
        Lpat.Color = tile.Color;
        Lpat.Edge_Connect_Pattern = newEdge;
        Lpat.Width = Number(sizeInput.value);
        Generic.clear_backDiv();
        okEvent(Lpat);
    }
}

function clsFontSet(event, font, okEvent, _attrData) {
        /// <signature>
    /// <summary>フォント設定</summary>
    /// <param name="event" >eventの引数。表示位置を決める。</param>
    /// <param name="line" >最初のフォント</param>
    /// <param name="okEvent" >okされた際に呼び出す関数</param>
    /// </signature>
    const backDiv = Generic.set_backDiv("", "フォント設定", 450, 210, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);

    let ft = font.Clone();
//    Generic.createNewSpan(backDiv, "フォント名", "", "", 15, 45, "", "");
//    const name = Generic.createNewInput(backDiv, "text", ft.Name, "", 75, 45, "", "width:100px;text-align: left");
    const name=Generic.createNewWordTextInput(backDiv, "フォント名","",ft.Name,"",15,45,50,100,undefined,"");
    const size = Generic.createNewSizeSelect(backDiv, ft.Size, "", "サイズ", 190, 45,40, 2,function (obj, v) { ft.Size = v;}, true);
    const colBox = Generic.createNewColorBox(backDiv, "", "文字色", ft.Color, 330, 45,undefined);
    const boldBox = Generic.createNewCheckBox(backDiv, "太字", "boldBox", ft.bold, 15, 80,undefined, "", "");
    const italic = Generic.createNewCheckBox(backDiv, "イタリック", "italic", ft.italic, 100, 80,undefined,  "", "");
    const Kakudo = Generic.createNewWordNumberInput(backDiv, "回転角度", "度", ft.Kakudo, "", 190, 80,undefined, 40, undefined, "");
    const backColorBox = Generic.createNewWordDivCanvas(backDiv, "", "文字背景", 320, 80,undefined, backClick);
    clsDrawTile.Darw_Sample_BackGroundBox(backColorBox, ft.Back, _attrData.TotalData.ViewStyle.ScrData);
    const gbSize = Generic.createNewFrame(backDiv, "", "", 15, 115, 380, 40, "縁取り");
    const fringe = Generic.createNewCheckBox(gbSize, "縁取り", "fringe", ft.FringeF, 10, 10,undefined,  "", "");
    const fringeSizeBox = Generic.createNewSizeSelect(gbSize, ft.FringeWidth, "", "文字に対する幅", 90, 10,60, 4,function (obj, v) { ft.FringeWidth = v;}, true);
    const fringeColBox = Generic.createNewColorBox(gbSize, "", "色", ft.FringeColor, 280, 10, undefined);

    function backClick(e) {
        clsBackgroundPatternSet(e, ft.Back, backGet, _attrData);
        function backGet(back) {
            ft.Back = back;
            clsDrawTile.Darw_Sample_BackGroundBox(backColorBox, ft.Back, _attrData.TotalData.ViewStyle.ScrData);
            _attrData.Draw_Sample_Mark_Box(picMark, ft);
        }
    }

    function buttonOK(e) {
        if (Generic.checkFontExist(name.value)== false){
            Generic.alert(new point(e.clientX, e.clientY),"フォント名「"+name.value + "」は使えません。");
            return;
        }
        ft.Color  = Generic.RGBAfromElement(colBox);
        ft.Name = name.value;
        // ft.Size = Number(size.value);
        ft.bold = boldBox.checked;
        ft.italic = italic.checked;
        ft.Kakudo = Number(Kakudo.value);
        // ft.FringeWidth = Number(fringeSizeBox.value);
        ft.FringeF = fringe.checked;
        ft.FringeColor = Generic.RGBAfromElement(fringeColBox);
        Generic.clear_backDiv();
        okEvent(ft);
    }
}

function clsInnerDataSet(event, attrData ) {
            /// <signature>
    /// <summary>記号の大きさモードの内部データ設定</summary>
    /// <param name="event" >eventの引数。表示位置を決める。</param>
    /// <param name="okEvent" >okされた際に呼び出す関数</param>
    /// </signature>
    const backDiv = Generic.set_backDiv("", "内部に表示するデータ", 210, 165, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);

    let Layernum = attrData.TotalData.LV1.SelectedLayer;
    let DataNum = attrData.LayerData[Layernum].atrData.SelectedIndex;
    let data = attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
    let md=attrData.getSoloMode(Layernum,DataNum);
    let mkc;
    if (md == enmSoloMode_Number.ClassMarkMode) {
        mkc = data.ClassMarkMD;
    } else {
        mkc = data.MarkCommon.Inner_Data;
    }

    let checkbox=Generic.createNewCheckBox(backDiv, "データ値で塗り分ける", "", mkc.Flag, 15, 40,undefined,  undefined,"");
    let selectDataItem = Generic.createNewWordSelect(backDiv,"データ項目", undefined, -1, "selectLayer", 15, 75,undefined,160,1,  listchange,"", "");

    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
    attrData.Set_DataTitle_to_cboBox(selectDataItem, LayerNum, mkc.Data, true, true, true, false);

    function listchange() {
        checkbox.checked = true;
    }

    function buttonOK() {
        let n = parseInt(selectDataItem.value);
        mkc.Data = n;
        mkc.Flag = checkbox.checked;
        Generic.clear_backDiv();
    }
}

//線端・中間点接合設定
function clsLineEdgePattern(event, edgePat, okEvent) {
    let newEdge = edgePat.Clone();
    const backDiv = Generic.set_backDiv("", "線端・中間点接合設定", 290, 200, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);
    const edgeFrame = Generic.createNewFrame(backDiv, "", "", 15, 40, 100, 110, "線端");
    const edgeList = [{ value: 'round', text: "丸い" },
    { value: 'square', text: "四角い" },
    { value: 'butt', text: "たいら" }];
    Generic.createNewRadioButtonList(edgeFrame, "edgePattern", edgeList, 15, 15,undefined, 22,newEdge.lineCap, edgePatternChange);

    const jointFrame = Generic.createNewFrame(backDiv, "", "", 125, 40, 150, 110, "中間点");
    const jointList = [{ value: 'round', text: "丸い" },
    { value: 'bevel', text: "たいら" },
    { value: 'miter', text: "とがった" }];
    Generic.createNewRadioButtonList(jointFrame, "jointPattern", jointList, 15, 15,undefined, 22,newEdge.lineJoin, jointPatternChange);
    let limit = Generic.createNewWordNumberInput(jointFrame, "ミッターリミット", "", newEdge.miterLimit, "", 15, 80,undefined, 50, "", "");

    function jointPatternChange(v) {
        newEdge.lineJoin =v;
    }

    function edgePatternChange(v) {
        newEdge.lineCap = v;
    }
    function buttonOK() {
        Generic.clear_backDiv();
        newEdge.miterLimit = Number(limit.value);
        okEvent(newEdge);
    }
}

/**矢印設定 */
function clsArrow(event, Arrow,Start_Arrow_Caption,End_Arrow_Caption, okEvent) {
    let newArrow=Arrow.Clone();
    const backDiv = Generic.set_backDiv("", "矢印設定", 370, 230, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);
    const pnlStart_Arrow=Generic.createNewDiv(backDiv,"","","",15,40,100,30,"","");
    Generic.createNewCheckBox(pnlStart_Arrow,Start_Arrow_Caption,"",Arrow.Start_Arrow_F,0,0,undefined, function(obj){newArrow.Start_Arrow_F=obj.checked},"");
    const pnlEnd_Arrow=Generic.createNewDiv(backDiv,"","","",120,40,100,30,"","");
    Generic.createNewCheckBox(pnlEnd_Arrow,End_Arrow_Caption,"",Arrow.End_Arrow_F,0,0,undefined, function(obj){newArrow.End_Arrow_F=obj.checked},"");
    if(Start_Arrow_Caption==""){
        pnlEnd_Arrow.style.left=pnlStart_Arrow.style.left;
        pnlStart_Arrow.setVisibility(false);
    }
    if(End_Arrow_Caption==""){
        pnlEnd_Arrow.setVisibility(false);
    }

    const shapeFrame = Generic.createNewFrame(backDiv, "", "", 15, 70, 120, 100, "形状");
    const list = [{ value: enmArrowHeadType.Line, text: "＞（線）" }, { value: enmArrowHeadType.Fill, text: "▶（三角）" }]
    Generic.createNewRadioButtonList(shapeFrame, "ArrowShape", list, 15, 20,undefined, 30,Arrow.ArrowHeadType,
        function (v) {newArrow.ArrowHeadType=v }, "");

    const sizeFrame = Generic.createNewFrame(backDiv, "", "", 150, 70, 200, 100, "角度・大きさ");
    Generic.createNewWordNumberInput(sizeFrame, "角度", "度",Arrow.Angle,"",15,10,undefined,60,function(obj,v){newArrow.Angle=v},"");
    Generic.createNewSpan(sizeFrame,"矢の最大幅(%)","","",15,45,"",undefined);
    Generic.createNewWordNumberInput(sizeFrame, "線幅×", "",Arrow.LWidthRatio,"",25,65,undefined,40,function(obj,v){newArrow.LWidthRatio=v},"");
    Generic.createNewWordNumberInput(sizeFrame, "＋", "",Arrow.WidthPlus,"",120,65,undefined,40,function(obj,v){newArrow.WidthPlus=v},"");
    function buttonOK() {
        Generic.clear_backDiv();
        okEvent(newArrow);
    }
}

/**データ項目選択 PreAstariskはアスタリスクを付けたい番号を配列に入れ、ない場合はundefined、返す値は選択番号リスト配列,選択truefalse配列*/
function clsSelectData(event, _attrData, Layernum,okEvent, PreAstarisk=undefined,
    Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true) {
    const backDiv = Generic.set_backDiv("", "データ項目選択", 230, 330, true, true, buttonOK, 0.2, true);
    Generic.Set_Box_Position_in_Browser(event, backDiv);
    let titles = _attrData.getDataTitleName(Layernum, Number_Print_F, Normal_F, Category_f, String_f, -1);
    if (Array.isArray(PreAstarisk) == true) {
        for (let n in PreAstarisk) {
            let i = PreAstarisk[n];
            let tx=titles[i];
            if (tx.left(1) != "*") {
                let sp = tx.indexOf(":");
                titles[i] = "*" + titles[i].mid(sp, titles[i].length - sp);
            }
        }
    }
    let list=[];
    for(let i in titles){
        list.push({value:i,text:titles[i]});
    }
    let select=new CheckedListBox(backDiv,"",list,15,48,203,243,false,undefined);
    function buttonOK(){
        Generic.clear_backDiv();
        if(typeof okEvent=='function'){
            let retV=select.getChecked();
            okEvent(retV.checkedStatus, retV.checkedArray);
        }
    }
}

/**出力画面：オブジェクト名・データ値表示 */
function frmPrint_ObjectValue(_attrData, okEvent) {
    const backDiv = Generic.set_backDiv("", "オブジェクト名・データ値表示", 210, 280, true, true, buttonOK, 0.2, true);

    let avs = _attrData.TotalData.ViewStyle.ValueShow.Clone();
    const objNameFrame = Generic.createNewFrame(backDiv, "", "", 15, 40, 180, 50, "オブジェクト名");
    Generic.createNewCheckBox(objNameFrame, "表示", "", avs.ObjNameVisible, 15, 15,undefined,  function (obj) { avs.ObjNameVisible = obj.checked; }, "");
    Generic.createNewButton(objNameFrame, "フォント", "", 90, 15,
        function (e) {
            clsFontSet(e, avs.ObjNameFont, function (newFont) { avs.ObjNameFont = newFont; }, _attrData);
        }, "");
    const objValueFrame = Generic.createNewFrame(backDiv, "", "", 15, 120, 180, 100, "データ値");
    Generic.createNewCheckBox(objValueFrame, "表示", "", avs.ValueVisible, 15, 15,undefined,  function (obj) {avs.ValueVisible = obj.checked }, "");
    Generic.createNewButton(objValueFrame, "フォント", "", 90, 15,
        function (e) {
            clsFontSet(e, avs.ValueFont, function (newFont) { avs.ValueFont = newFont; }, _attrData);
        }, "");
    Generic.createNewCheckBox(objValueFrame, "小数点以下の設定", "", avs.DecimalSepaF, 45, 45, undefined, function (obj) { avs.DecimalSepaF = obj.checked }, "");
    Generic.createNewNumberComboBox(objValueFrame, avs.DecimalNumber, "", [0, 1, 2, 3, 4], 60, 75, 60, 10, function (ip, ipv) { avs.DecimalNumber = ipv });
    function buttonOK() {
        _attrData.TotalData.ViewStyle.ValueShow = avs;
        Generic.clear_backDiv();
        okEvent();
    }
}

/**背景表示設定 */
function frmPrint_backImageSet(_attrData, okEvent) {
    const backDiv = Generic.set_backDiv("", "背景画像設定", 260, 300, true, true, buttonOK, 0.2, true);
    let avt = _attrData.TotalData.ViewStyle.TileMapView;
    let chkVisible = Generic.createNewCheckBox(backDiv, "背景画像を表示", "", avt.Visible, 15, 40,undefined,  undefined, "");
    let gbTIle = Generic.createNewFrame(backDiv, "", "", 15, 70, 230, 80, "表示地図タイル");
    let tag = ["国土地理院地図", "国土地理院主題図", "国土地理院空中写真", "国土地理院東日本大震災", "国土地理院災害", "オープンストリートマップ", "人口","今昔マップ", "その他"];
    let taglist = [];
    for (let i in tag) {
        taglist.push({ value: tag[i], text: tag[i] });
    }
    let finedx = tag.indexOf(avt.TileMapDataSet.opt.tag);
    let tileTagSelect = Generic.createNewSelect(gbTIle, taglist, finedx, "", 15, 15, false, function () {
        setTileMapListByTag("");
    }, "width:180px", 1, false);
    let tileSelect = Generic.createNewSelect(gbTIle, [], 0, "", 30, 45, false, undefined, "width:180px", 1, false);
    setTileMapListByTag(avt.TileMapDataSet.opt.id);

    let gbTIming = Generic.createNewFrame(backDiv, "", "", 15, 170, 120, 70, "描画タイミング");
    let timing = [{ value: enmDrawTiming.BeforeDataDraw, text: "データ描画前" }, { value: enmDrawTiming.AfterDataDraw, text: "データ描画後" }]
    Generic.createNewRadioButtonList(gbTIming, "drawTiming", timing, 10, 15,undefined, 25,avt.DrawTiming, undefined, "");

    let gbAlpha = Generic.createNewFrame(backDiv, "", "", 150, 170, 95, 50, "不透明度");
    let rangeObj = document.createElement('input');
    rangeObj.type = 'range';
    rangeObj.min = 0;
    rangeObj.max = 100;
    rangeObj.step = 10;
    rangeObj.value = avt.AlphaValue * 100;
    rangeObj.id = 'AlphaValue';
    with (rangeObj.style) {
        position = 'absolute';
        fontSize = "12px";
        width = (80).px();
        top = (15).px();
        left = (5).px();
    }
    gbAlpha.appendChild(rangeObj);

    /**タグリストが変更になった場合は子要素リストを変更 */
    function setTileMapListByTag(firstID) {
        let tag = tileTagSelect.getValue();
        let tlist = tileMapClass.getTileMapListByTag(tag);
        let list = [];
        let seln = 0;
        for (let i in tlist) {
            list.push({ value: tlist[i].opt.id, text: tlist[i].opt.id });
            if (tlist[i].opt.id == firstID) {
                seln = i;
            }
        }
        tileSelect.addSelectList(list, seln, true, false);
    }
    /**OKボタン */
    function buttonOK() {
        let d = new strTileMapViewInfo();
        d.Visible = chkVisible.checked;
        d.TileMapDataSet = tileMapClass.getTileMapDataById(tileSelect.getValue())
        d.DrawTiming = Generic.getRadioCheckByValue("drawTiming");
        d.AlphaValue = rangeObj.value / 100;
        _attrData.TotalData.ViewStyle.TileMapView = d;
        Generic.clear_backDiv();
        okEvent();
    }
}

/**設定画面のグラフ表示モード・円・帯グラフ設定 */
function graphModeEn_Obi() {
    const backDiv = Generic.set_backDiv("", "円・帯グラフ設定", 350, 300, true, true, buttonOK, 0.2, true);

    let En_Obi=attrData.nowGraph().En_Obi.Clone();

    const gbMaxSize = Generic.createNewFrame(backDiv, "", "", 15, 40, 150, 90, "最大サイズ");
    const maxSizeMode = [{ value: enmGraphMaxSize.Fixed, text: "固定" }, { value: enmGraphMaxSize.Changeable, text: "可変" }]
    Generic.createNewRadioButtonList(gbMaxSize, "graphMaxSizeMode", maxSizeMode, 10, 10,undefined, 25,En_Obi.EnSizeMode,
        function (v) { En_Obi.EnSizeMode = v }, "");
    Generic.createNewSizeSelect(gbMaxSize, En_Obi.EnSize, "", "", 40, 60,40, 2, 
        function (obj, v) { En_Obi.EnSize = v; }, "");

    const gbMaxSizeValue = Generic.createNewFrame(backDiv, "", "", 180, 40, 150, 90, "最大サイズの値");
    const maxValuesetting = [{ value: enmMarkMaxValueType.SelectedDataMax, text: "選択データの最大値" },
        { value: enmMarkMaxValueType.UserSettingValue, text: "ユーザ設定" }];
    Generic.createNewRadioButtonList(gbMaxSizeValue, "graphMaxValuesetting", maxValuesetting, 10, 10,undefined, 25,En_Obi.MaxValueMode,
        function (v) { En_Obi.MaxValueMode = v }, "");
    Generic.createNewNumberInput(gbMaxSizeValue, En_Obi.MaxValue, "", 40, 60, 90,
        function (obj, v) { En_Obi.MaxValue = v; }, "");

    const gbGraphLegendValue = Generic.createNewFrame(backDiv, "", "", 15, 150, 150, 100, "凡例値");
    let lv = [En_Obi.Value1, En_Obi.Value2, En_Obi.Value3];
    for (let i = 0; i < 3; i++) {
        Generic.createNewWordNumberInput(gbGraphLegendValue, "値" + String(i + 1), "",lv[i], "txtGrapgLegendValue" + String(i + 1), 10, i * 30 + 10,undefined, 80,
            function (obj, v) {
                const n = Number(obj.id.right(1)) ;
                switch (n) {
                    case 1:
                        En_Obi.Value1 = v;
                        break;
                    case 2:
                        En_Obi.Value2 = v;
                        break;
                    case 3:
                        En_Obi.Value3 = v;
                        break;
                }
            }, "");
    }

    if (attrData.nowGraph().GraphMode == enmGraphMode.StackedBarGraph) {
        const gbStackGraphSetting = Generic.createNewFrame(backDiv, "", "", 180, 150, 150, 100, "帯グラフ表示");
        const StackedBarDirectionList = [{ value: enmStackedBarChart_Direction.Vertical, text: "縦" },
        { value: enmStackedBarChart_Direction.Horizontal, text: "横" }];
        Generic.createNewRadioButtonList(gbStackGraphSetting, "graphStackedBarDirection", StackedBarDirectionList, 10, 10,undefined, 30,En_Obi.StackedBarDirection,
            function (v) { En_Obi.StackedBarDirection = v }, "");
        Generic.createNewWordNumberInput(gbStackGraphSetting, "長辺:短辺 = 1 : " ,"", En_Obi.AspectRatio, "", 10, 60,undefined, 30,
        function(obj, v){
            En_Obi.AspectRatio=v;
        },"");

    }

    function buttonOK() {
        attrData.nowGraph().En_Obi=En_Obi;
        Generic.clear_backDiv();
    }
}

/**設定画面のグラフ表示モード・折れ線・棒グラフ設定 */
function graphModeOresen_Bou() {
    const backDiv = Generic.set_backDiv("", "折れ線・棒グラフ設定", 370, 330, true, true, buttonOK, 0.2, true);

    let Oresen_Bou = attrData.nowGraph().Oresen_Bou.Clone();
    const gbSize = Generic.createNewFrame(backDiv, "", "", 15, 40, 150, 90, "最大サイズ");
     Generic.createNewSizeSelect(gbSize, Oresen_Bou.Size, "","", 30, 15, 40, 3,
        function (obj, v) { Oresen_Bou.Size = v; }, "");
    Generic.createNewWordNumberInput(gbSize, "縦:横 = 1 :", "", Oresen_Bou.AspectRatio, "", 15, 50,undefined, 50,
        function (obj, v) { Oresen_Bou.AspectRatio = v; }, "");

    const gbFrame = Generic.createNewFrame(backDiv, "", "", 15, 150, 150, 135, "枠");
    Generic.createNewWordDivCanvas(gbFrame, "graphFrame", "輪郭線", 15, 15, 40,
        function (e) {
            clsLinePatternSet(e, Oresen_Bou.BorderLine,
                function (Lpat) {
                    Oresen_Bou.BorderLine = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                }
            );
        });
    attrData.Draw_Sample_LineBox(document.getElementById("graphFrame"), Oresen_Bou.BorderLine);
    Generic.createNewTileBox(gbFrame, "graphInnerColor", "内部色", Oresen_Bou.BackgroundTile, 15, 45,undefined, 
        function (e) {
            clsTileSet(e, Oresen_Bou.BackgroundTile,
                function (retTile) { Oresen_Bou.BackgroundTile = retTile });
        });
    const BarFrameList = [{ value: enmBarChartFrameAxePattern.Whole, text: "四角で囲む" },
    { value: enmBarChartFrameAxePattern.Half, text: "左と下" }];
    Generic.createNewRadioButtonList(gbFrame, "BarFrame", BarFrameList, 10, 80,undefined, 25,Oresen_Bou.FrameAxe,
        function (v) { Oresen_Bou.FrameAxe = v }, "");

    const gbMaxMin = Generic.createNewFrame(backDiv, "", "", 180, 40, 170, 130, "最大・最小値");
    const BarMaxMinSetList = [{ value: enmBarLineMaxMinMode.Auto, text: "自動" },
    { value: enmBarLineMaxMinMode.Manual, text: "ユーザ設定" }];
    Generic.createNewRadioButtonList(gbMaxMin, "BarMaxMin", BarMaxMinSetList, 10, 10,undefined, 25,Oresen_Bou.YmaxMinMode,
        function (v) { Oresen_Bou.YmaxMinMode = v }, "");
    Generic.createNewWordNumberInput(gbMaxMin, "最大値", "", Oresen_Bou.YMax, "", 30, 60, undefined,90,
        function (obj, v) {
            Oresen_Bou.YMax = v;
        }, "");
    Generic.createNewWordNumberInput(gbMaxMin, "最小値", "", Oresen_Bou.Ymin, "", 30, 85,undefined, 90,
        function (obj, v) {
            Oresen_Bou.Ymin = v;
        }, "");

    function buttonOK() {
        attrData.nowGraph().Oresen_Bou = Oresen_Bou;
        Generic.clear_backDiv();
    }
}

/**緯度経度の入力 */
function frmLatLonInput(LatLon,BoxF, okEvent){
    const backDiv = Generic.set_backDiv("", "緯度経度入力", 300, 200, true, true, buttonOK, 0.2, true);
    const pnlLat=Generic.createNewDiv(backDiv,"","","",15,40,280,50,"");
    const pnlLon=Generic.createNewDiv(backDiv,"","","",15,100,280,50,"");
    Generic.createNewSpan(pnlLat,"緯度","","",0,15,"",undefined);
    Generic.createNewSpan(pnlLon,"経度","","",0,15,"",undefined);
    if(BoxF==true){
        const pnlNorthSouth=Generic.createNewDiv(pnlLat,"","","",30,0,60,50,"",undefined);
        const pnlEastWest=Generic.createNewDiv(pnlLon,"","","",30,0,60,50,"",undefined);
        Generic.createNewRadioButtonList(pnlNorthSouth,"latNorthSouth",[{value:0,text:"北緯"},{value:1,text:"南緯"}],0,5,undefined,20,(LatLon.lat>=0)?0:1,undefined,"");
        Generic.createNewRadioButtonList(pnlEastWest,"lonEastWest",[{value:0,text:"東経"},{value:1,text:"西経"}],0,5,undefined,20,(LatLon.lon>=0)?0:1,undefined,"");
    }
    if (clsSettingData.Ido_Kedo_Print_Pattern == enmLatLonPrintPattern.DegreeMinuteSecond) {
        let LatLonDMS = LatLon.toDegreeMinuteSecond();
        Generic.createNewWordNumberInput(pnlLat, "", "度", Math.abs(LatLonDMS.LatitudeDMS.Degree), "latDBox", 90, 15, undefined, 50, undefined, "");
        Generic.createNewWordNumberInput(pnlLat, "", "分", LatLonDMS.LatitudeDMS.Minute, "latMBox", 170, 15, undefined, 30, undefined, "");
        Generic.createNewWordNumberInput(pnlLat, "", "秒", LatLonDMS.LatitudeDMS.Second, "latSox", 230, 15, undefined, 30, undefined, "");
        Generic.createNewWordNumberInput(pnlLon, "", "度", Math.abs(LatLonDMS.LongitudeDMS.Degree), "lonDBox", 90, 15, undefined, 50, undefined, "");
        Generic.createNewWordNumberInput(pnlLon, "", "分", LatLonDMS.LongitudeDMS.Minute, "lonMBox", 170, 15, undefined, 30, undefined, "");
        Generic.createNewWordNumberInput(pnlLon, "", "秒", LatLonDMS.LongitudeDMS.Second, "lonSox", 230, 15, undefined, 30, undefined, "");

    } else {
        Generic.createNewWordNumberInput(pnlLat, "", "度", Math.abs(LatLon.lat), "latDegreeBox", 90, 15, undefined, 100, undefined, "");
        Generic.createNewWordNumberInput(pnlLon, "", "度", Math.abs(LatLon.lon), "lonDegreeBox", 90, 15, undefined, 100, undefined, ""); 
    }
    function buttonOK(){
        if (clsSettingData.Ido_Kedo_Print_Pattern == enmLatLonPrintPattern.DegreeMinuteSecond) {
            let dms = new strLatLonDegreeMinuteSecond();
            dms.LatitudeDMS.Degree = Number(document.getElementById("latDBox").value);
            dms.LatitudeDMS.Minute = Number(document.getElementById("latMBox").value);
            dms.LatitudeDMS.Second = Number(document.getElementById("latSox").value);
            dms.LongitudeDMS.Degree = Number(document.getElementById("lonDBox").value);
            dms.LongitudeDMS.Minute = Number(document.getElementById("lonMBox").value);
            dms.LongitudeDMS.Second = Number(document.getElementById("lonSox").value);
            if (Generic.getRadioCheckByValue("latNorthSouth") == 1) {
                dms.LatitudeDMS.Degree = -dms.LatitudeDMS.Degree;
            }
            if (Generic.getRadioCheckByValue("lonEastWest") == 1) {
                dms.LongitudeDMS.Degree = -dms.LongitudeDMS.Degree;
            }
            LatLon=dmd.toLatLon();
        }else{
            LatLon.lat=Number(document.getElementById("latDegreeBox").value);
            LatLon.lon=Number(document.getElementById("lonDegreeBox").value);
            if (Generic.getRadioCheckByValue("latNorthSouth") == 1) {
                LatLon.lat = -LatLon.lat;
            }
            if (Generic.getRadioCheckByValue("lonEastWest") == 1) {
                LatLon.lon = -LatLon.lon;
            }
        }
        Generic.clear_backDiv();
        okEvent(LatLon);
    }
}

/**投影法変換 */
function frmProjectionConvert(_Zahyo,MapRect,okEvent){
    let Zahyo=_Zahyo.Clone();
    const backDiv = Generic.set_backDiv("", "投影法変換", 425, 300, true, true, buttonOK, 0.2, true);
    const gbPresentProjection=Generic.createNewFrame(backDiv,"","",15,40,200,50,"現在の投影法");
    Generic.createNewDiv( gbPresentProjection,Generic.getStringProjectionEnum(Zahyo.Projection),"","grayFrame",15,15,170,15,"padding:2px;");
    const gbCenterLon=Generic.createNewFrame(backDiv,"","",15,105,200,135,"中央経線の設定");
    let CenterLonList=[{value:0,text:"変更なし("+Zahyo.CenterXY.x + "度)"},{value:1,text:"地図の中央"},{value:2,text:"指定"}];
    Generic.createNewRadioButtonList(gbCenterLon,"rdCenter",CenterLonList,10,15,undefined,25,0,undefined,"");
    let centerInput=Generic.createNewWordNumberInput(gbCenterLon, "", "度", Zahyo.CenterXY.x, "boxCenterLon", 40, 90,undefined, 120,undefined, "");

    const gbProjection=Generic.createNewFrame(backDiv,"","",230,40,180,200,"変換後の投影法");
    let prjList=[{value:enmProjection_Info.prjMercator,text:Generic.getStringProjectionEnum(enmProjection_Info.prjMercator)},
        {value:enmProjection_Info.prjMiller,text:Generic.getStringProjectionEnum(enmProjection_Info.prjMiller)},
        {value:enmProjection_Info.prjSeikyoEntou,text:Generic.getStringProjectionEnum(enmProjection_Info.prjSeikyoEntou)},
        {value:enmProjection_Info.prjLambertSeisekiEntou,text:Generic.getStringProjectionEnum(enmProjection_Info.prjLambertSeisekiEntou)},
        {value:enmProjection_Info.prjEckert4,text:Generic.getStringProjectionEnum(enmProjection_Info.prjEckert4)},
        {value:enmProjection_Info.prjMollweide,text:Generic.getStringProjectionEnum(enmProjection_Info.prjMollweide)},
        {value:enmProjection_Info.prjSanson,text:Generic.getStringProjectionEnum(enmProjection_Info.prjSanson)}];
    Generic.createNewRadioButtonList(gbProjection, "Projection", prjList, 15, 15, undefined,25, Zahyo.Projection, 
        function(v){Zahyo.Projection=v;}, "");
      
    function buttonOK(){
        let csel=Generic.getRadioCheckByValue("rdCenter");
        switch (csel) {
            case 0:
                break;
            case 1:
                Zahyo.CenterXY.x = MapRect.CenterXY().x;
                break;
            case 2:
                Zahyo.CenterXY.x = Number(centerInput.value);
                break;
        }
        Generic.clear_backDiv();
        okEvent(Zahyo);
    }
}

/**方位記号の設定 */
function frmCompassSettings(_compass,okEvent){
    let comp=_compass.Clone();
    const backDiv = Generic.set_backDiv("", "方位記号の設定", 280, 270, true, true, buttonOK, 0.2, true);
    Generic.createNewCheckBox(backDiv,"方位記号を表示","",comp.Visible,10,40,undefined, function(obj){comp.Visible=obj.checked;},"");
    let gbCompMark = Generic.createNewFrame(backDiv, "", "", 10, 70, 110, 110, "方位記号の形状");
    let cmark=Generic.createNewCanvas(gbCompMark, "", "imgButton", 15, 15, 80, 80, function (e) {
        clsMarkSet(e, picMarkChange, comp.Mark, attrData);
        function picMarkChange(newMark) {
            comp.Mark = newMark;
            attrData.Draw_Sample_Mark_Box(e.target, newMark);
        }
    }, "");
    attrData.Draw_Sample_Mark_Box(cmark, comp.Mark);

    let gbCompWord = Generic.createNewFrame(backDiv, "", "", 140, 40, 120, 170, "方位文字");
    Generic.createNewWordTextInput (gbCompWord,"北","",comp.dirWord.North,"",15,15,undefined,50,function(e){comp.dirWord.North= e.target.value;},"");
    Generic.createNewWordTextInput (gbCompWord,"南","",comp.dirWord.South,"",15,45,undefined,50,function(e){comp.dirWord.South= e.target.value;},"");
    Generic.createNewWordTextInput (gbCompWord,"東","",comp.dirWord.East,"",15,75,undefined,50,function(e){comp.dirWord.East= e.target.value;},"");
    Generic.createNewWordTextInput (gbCompWord,"西","",comp.dirWord.West,"",15,105,undefined,50,function(e){comp.dirWord.West= e.target.value;},"");
    Generic.createNewButton(gbCompWord, "フォント", "", 40, 135,
        function (e) {
            clsFontSet(e, comp.Font, function (newFont) { comp.Font = newFont }, attrData);
        }, "padding-top:0;padding-bottom:0");

    function buttonOK(){
        Generic.clear_backDiv();
        okEvent(comp);
    }
}

/**出力画面のオプション */
function frmPrintOption(firstTab=0){
    let atv=attrData.TotalData.ViewStyle.Clone();
    let sdata=clsSettingData.Clone();
    const backDiv = Generic.set_backDiv("", "オブション", 600, 420, true, true, buttonOK, 0.2, true);
    let tablist=["全般","背景・描画","凡例設定","欠損値","スケール設定"];
    const tab=Generic.createNewTab(backDiv,tablist,firstTab,15,40,570,330);

    /**全般●●●●●●●●●●●●●●●●●●●●● */
    const tab00 = Generic.createNewFrame(tab.panel[0], "", "", 15, 10, 150, 260, "飾り");
    Generic.createNewCheckBox(tab00,"タイトル表示","",atv.MapTitle.Visible,10,15,undefined, function(obj){atv.MapTitle.Visible=obj.checked;},"");
    Generic.createNewButton(tab00,"フォント設定","",30,38,
    function(e){
        clsFontSet(e, atv.MapTitle.Font, function (newFont) { atv.MapTitle.Font = newFont }, attrData);
    },"padding-top:0;padding-bottom:0");
    Generic.createNewWordNumberInput(tab00,"最大幅","%",atv.MapTitle.MaxWidth,"",30,60,undefined,40,function (obj, v) { atv.MapTitle.MaxWidth = v;},"")
    Generic.createNewCheckBox(tab00,"方位表示","",atv.AttMapCompass.Visible,10,90,undefined, function(obj){atv.AttMapCompass.Visible=obj.checked;},"");
    Generic.createNewButton(tab00,"方位設定","",30,113,
        function(){
            frmCompassSettings(atv.AttMapCompass,function(v){atv.AttMapCompass=v;});
        },"padding-top:0;padding-bottom:0");
    Generic.createNewCheckBox(tab00,"注表示","",atv.DataNote.Visible,10,145,undefined, function(obj){atv.DataNote.Visible=obj.checked;},"");
    Generic.createNewButton(tab00,"フォント設定","",30,168,
    function(e){
        clsFontSet(e, atv.DataNote.Font, function (newFont) { atv.DataNote.Font = newFont }, attrData);
    },"padding-top:0;padding-bottom:0");
    Generic.createNewWordNumberInput(tab00,"最大幅","%",atv.DataNote.MaxWidth,"",30,190,undefined,40,function (obj, v) { atv.DataNote.MaxWidth = v;},"")
    Generic.createNewCheckBox(tab00,"図形表示","",atv.FigureVisible,10,220,undefined, function(obj){atv.FigureVisible=obj.checked;},"");

    let atva=atv.AccessoryGroupBox;
    const tab01 = Generic.createNewFrame(tab.panel[0], "", "", 180, 10, 170, 210, "飾りグループボックス");
    Generic.createNewCheckBox(tab01,"設定する","",atva.Visible,10,15,undefined, function(obj){atva.Visible=obj.checked;},"");
    const accGList=[{text:"凡例",checked:atva.Legend},{text:"タイトル",checked:atva.Title},{text:"方位",checked:atva.Comapss},{text:"スケール",checked:atva.Scale},
    {text:"注",checked:atva.Note},{text:"線種凡例",checked:atva.LinePattern},{text:"オブジェクトグループ凡例",checked:atva.ObjectGroup}];
    Generic.createNewCheckListBox(tab01,"",accGList,10,45,150,125,function(num,checked){
        switch (num) {
            case 0:
                atva.Legend = checked;
                break;
            case 1:
                atva.Title = checked;
                break;
            case 2:
                atva.Comapss = checked;
                break;
            case 3:
                atva.Scale = checked;
                break;
            case 4:
                atva.Note = checked;
                break;
            case 4:
                atva.LinePattern = checked;
                break;
            case 6:
                atva.ObjectGroup = checked;
                break;
        }
    },"");
    Generic.createNewWordDivCanvas(tab01, "atvaBack", "背景", 10, 180,undefined, function(e){
        clsBackgroundPatternSet(e, atva.Back, backGet, attrData);
        function backGet(back) {
            atva.Back = back;
            clsDrawTile.Darw_Sample_BackGroundBox(e.target, back, atv.ScrData);
        }
    });
    clsDrawTile.Darw_Sample_BackGroundBox(document.getElementById("atvaBack"), atva.Back, atv.ScrData);

    const tab03 = Generic.createNewFrame(tab.panel[0], "", "", 180, 235, 170, 50, "幅が「0」のライン幅");
        let zeroWidthList=[{value:0,text:"0.1ピクセル"},{value:1,text:"0.3ピクセル"},{value:2,text:"0.5ピクセル"},{value:3,text:"0.7ピクセル"},{value:4,text:"0.9ピクセル"}];
        Generic.createNewSelect(tab03,zeroWidthList,sdata.MinimumLineWidth,"",30,15,false,
        function(obj, sel, v){sdata.MinimumLineWidth=v;},"",1,false);


    const tab02 = Generic.createNewFrame(tab.panel[0], "", "", 365, 10, 190, 70, "記号表示位置と代表点");
    Generic.createNewCheckBox(tab02,"線で結ぶ","",atv.SymbolLine.Visible,10,15,undefined, function(obj){atv.SymbolLine.Visible=obj.checked;},"");
    Generic.createNewWordDivCanvas(tab02, "SymbolLine", "ラインパターン", 20, 35, 100,
        function (e) {
            clsLinePatternSet(e, atv.SymbolLine.Line,
                function (Lpat) {
                    atv.SymbolLine.Line = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("SymbolLine"), atv.SymbolLine.Line);

    const ConvScaleValue = Generic.Convert_ScaleUnit(enmScaleUnit.kilometer, atv.MapScale.Unit);
    let def_PointInterval = atv.SouByou.PointInterval * ConvScaleValue;
    let def_LoopSize = atv.SouByou.LoopSize * ConvScaleValue;
    const tab04 = Generic.createNewFrame(tab.panel[0], "", "", 365, 95, 190, 190, "総描");
    Generic.createNewCheckBox(tab04,"自動設定","",atv.SouByou.Auto,15,12,100,function(ob){
        atv.SouByou.Auto=ob.checked;
       Generic.setDisabled( soubyouManual,(ob.checked==true));
    },"");
    let autoLst=[{ value: 1, text: "弱"},{ value: 2, text: "中"},{ value: 3, text: "強"},{ value: 4, text: "最強"}];
    const cboSobyouAutoDegree=Generic.createNewSelect(tab04,autoLst,tab04,"",100,12,false,function(sbox,sel,v){
        atv.SouByou.AutoDegree=v;
    },"");
    cboSobyouAutoDegree.setSelectValue(atv.SouByou.AutoDegree);
    Generic.createNewCheckBox(tab04, "曲線近似", "", atv.SouByou.Spline_F,15,32,undefined, function(obj){atv.SouByou.Spline_F=obj.checked;},"");
    const soubyouManual = Generic.createNewFrame(tab04, "", "", 10, 50, 170, 122, "マニュアル設定");
    Generic.createNewCheckBox(soubyouManual, "ポイント間引き", "", atv.SouByou.ThinningPrint_F, 5, 15,undefined,  function (obj) { atv.SouByou.ThinningPrint_F = obj.checked; }, "");
    Generic.createNewWordNumberInput(soubyouManual, "取得間隔", Generic.getScaleUnitStrings(undefined, atv.MapScale.Unit), def_PointInterval, "", 10, 37, undefined,50,
        function (obj, v) { atv.SouByou.PointInterval = v / ConvScaleValue; }, "");
    Generic.createNewCheckBox(soubyouManual, "ループ間引き", "", atv.SouByou.LoopAreaF, 5, 70,undefined,  function (obj) { atv.SouByou.LoopAreaF = obj.checked; }, "");
    Generic.createNewWordNumberInput(soubyouManual, "最小取得サイズ", Generic.getScaleUnitStrings(undefined, atv.MapScale.Unit) + "<sup>2</sup>", def_LoopSize, "", 10, 92, undefined,40,
        function (obj, v) { atv.SouByou.LoopSize = v / ConvScaleValue; }, "");
    Generic.setDisabled( soubyouManual,(atv.SouByou.Auto==true));

    /**背景・描画●●●●●●●●●●●●●●●●●●●●● */
    const tab10 = Generic.createNewFrame(tab.panel[1], "", "", 15, 10, 260, 80, "ウインドウ内余白");
    Generic.createNewWordNumberInput(tab10, "上余白", "%", atv.ScrData.Screen_Margin.rect.top, "", 10, 15,undefined, 40, function (obj, v) { atv.ScrData.Screen_Margin.rect.top = v; }, "")
    Generic.createNewWordNumberInput(tab10, "下余白", "%", atv.ScrData.Screen_Margin.rect.bottom, "", 10, 45,undefined, 40, function (obj, v) { atv.ScrData.Screen_Margin.rect.bottom = v; }, "")
    Generic.createNewWordNumberInput(tab10, "右余白", "%", atv.ScrData.Screen_Margin.rect.right, "", 130, 15,undefined, 40, function (obj, v) { atv.ScrData.Screen_Margin.rect.right = v; }, "")
    Generic.createNewWordNumberInput(tab10, "左余白", "%", atv.ScrData.Screen_Margin.rect.left, "", 130, 45,undefined, 40, function (obj, v) { atv.ScrData.Screen_Margin.rect.left = v; }, "")

    const tab11 = Generic.createNewFrame(tab.panel[1], "", "", 15, 110, 260, 140, "枠・色");
    Generic.createNewCheckBox(tab11, "余白で地図画像クリップ", "", atv.ScrData.Screen_Margin.ClipF, 10, 15,undefined,  function (obj) { atv.ScrData.Screen_Margin.ClipF = obj.checked }, "");
    Generic.createNewWordDivCanvas(tab11, "MapAreaFrameLine", "地図領域枠線", 10, 45, 60,
        function (e) {
            clsLinePatternSet(e, atv.Screen_Back.MapAreaFrameLine,
                function (Lpat) {
                    atv.Screen_Back.MapAreaFrameLine = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("MapAreaFrameLine"), atv.Screen_Back.MapAreaFrameLine);
    Generic.createNewTileBox(tab11, "MapAreaBack", "地図領域背景色", atv.Screen_Back.MapAreaBack, 135, 45,60,
        function (e) {
            clsTileSet(e, atv.Screen_Back.MapAreaBack,
                function (retTile) { atv.Screen_Back.MapAreaBack = retTile });
        });

    Generic.createNewWordDivCanvas(tab11, "ScreenFrameLine", "画面外枠線", 10, 75, 60,
        function (e) {
            clsLinePatternSet(e, atv.Screen_Back.ScreenFrameLine,
                function (Lpat) {
                    atv.Screen_Back.ScreenFrameLine = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("ScreenFrameLine"), atv.Screen_Back.ScreenFrameLine);
    Generic.createNewTileBox(tab11, "ObjectInner", "オブジェクト内部色", atv.Screen_Back.ObjectInner, 135, 75,60,
        function (e) {
            clsTileSet(e, atv.Screen_Back.ObjectInner,
                function (retTile) { atv.Screen_Back.ObjectInner = retTile });
        });
    Generic.createNewTileBox(tab11, "ScreenAreaBack", "画面領域色", atv.Screen_Back.ScreenAreaBack, 10, 105,60,
        function (e) {
            clsTileSet(e, atv.Screen_Back.ScreenAreaBack,
                function (retTile) { atv.Screen_Back.ScreenAreaBack = retTile });
        });

    const tab12 = Generic.createNewFrame(tab.panel[1], "", "", 290, 10, 260, 240, "経緯線");
    Generic.createNewCheckBox(tab12, "表示", "", atv.LatLonLine_Print.Visible, 10, 15,undefined,  function (obj) { atv.LatLonLine_Print.Visible = obj.checked }, "");
    const gbtab12Order = Generic.createNewFrame(tab12, "", "", 10, 45, 80, 60, "表示階層");
    let latlonOrderList=[{value:enmLatLonLine_Order.Back, text:"背面"},{value:enmLatLonLine_Order.Front, text:"前面"}];
    Generic.createNewRadioButtonList(gbtab12Order, "latlonOrder", latlonOrderList, 10, 10,undefined, 25, atv.LatLonLine_Print.Order, 
        function (v) { atv.LatLonLine_Print.Order = v }, "");
    const gbtab12Lpat = Generic.createNewFrame(tab12, "", "", 110, 8, 140, 100, "ラインパターン");
    Generic.createNewWordDivCanvas(gbtab12Lpat, "OuterPat", "外周", 10, 10, 50,
        function (e) {
            clsLinePatternSet(e, atv.LatLonLine_Print.OuterPat,
                function (Lpat) {
                    atv.LatLonLine_Print.OuterPat = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("OuterPat"), atv.LatLonLine_Print.OuterPat);
    Generic.createNewWordDivCanvas(gbtab12Lpat, "Equator", "赤道", 10, 40, 50,
        function (e) {
            clsLinePatternSet(e, atv.LatLonLine_Print.Equator,
                function (Lpat) {
                    atv.LatLonLine_Print.Equator = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("Equator"), atv.LatLonLine_Print.Equator);
    Generic.createNewWordDivCanvas(gbtab12Lpat, "LPat", "その他", 10, 70, 50,
        function (e) {
            clsLinePatternSet(e, atv.LatLonLine_Print.LPat,
                function (Lpat) {
                    atv.LatLonLine_Print.LPat = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("LPat"), atv.LatLonLine_Print.LPat);

    const gbtab12Interval = Generic.createNewFrame(tab12, "", "", 10, 120, 170, 100, "間隔");
    const txtLatLonIntData = Generic.createNewDiv(gbtab12Interval, "", "", "grayFrame", 10, 15, 140, 35, "padding:5px;", undefined);
    if (attrData.TotalData.ViewStyle.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
        let retPS = Generic.Get_LatLon_Strings(new latlon(atv.LatLonLine_Print.Lat_Interval, atv.LatLonLine_Print.Lon_Interval), false);
        txtLatLonIntData.innerHTML = "緯度：" + retPS.y + "<br>" + "経度：" + retPS.x;
    }
    Generic.createNewButton(gbtab12Interval, "間隔設定", "", 50, 70, function () {
        frmLatLonInput(new latlon(atv.LatLonLine_Print.Lat_Interval, atv.LatLonLine_Print.Lon_Interval), false, function (lp) {
            atv.LatLonLine_Print.Lat_Interval = lp.lat;
            atv.LatLonLine_Print.Lon_Interval = lp.lon;
            let retPS = Generic.Get_LatLon_Strings(lp, false);
            txtLatLonIntData.innerHTML = "緯度：" + retPS.y + "<br>" + "経度：" + retPS.x;
        })
    }, "padding-top:0;padding-bottom:0");
    if(attrData.TotalData.ViewStyle.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido){
        Generic.setDisabled(tab12,true);//緯度経度でない場合はdisabledに設定
    }

    /**凡例設定●●●●●●●●●●●●●●●●●●●●● */
    Generic.createNewCheckBox(tab.panel[2], "凡例を表示", "", atv.MapLegend.Base.Visible, 10, 15,undefined,  function (obj) { atv.MapLegend.Base.Visible = obj.checked }, "");
    Generic.createNewCheckBox(tab.panel[2], "桁区切りカンマを表示", "", atv.MapLegend.Base.Comma_f, 150, 15,undefined,  function (obj) { atv.MapLegend.Base.Comma_f = obj.checked }, "");
    const tabLegend=Generic.createNewTab(tab.panel[2],["凡例背景・フォント","階級区分","記号・円グラフ","線種・点ダミー凡例"],0,30,50,490,230);

    /**凡例背景*/
    Generic.createNewButton(tabLegend.panel[0], "凡例フォント", "", 30, 25, 
        function(e){
            clsFontSet(e, atv.MapLegend.Base.Font, function (newFont) { atv.MapLegend.Base.Font = newFont }, attrData);
        }, "");
     Generic.createNewWordDivCanvas(tabLegend.panel[0], "BaseBack", "凡例背景", 30, 80,undefined, function(e){
        clsBackgroundPatternSet(e, atv.MapLegend.Base.Back, backGet, attrData);
        function backGet(back) {
            atv.MapLegend.Base.Back = back;
            clsDrawTile.Darw_Sample_BackGroundBox(e.target, back, atv.ScrData);
        }
    });
    clsDrawTile.Darw_Sample_BackGroundBox(document.getElementById("BaseBack"), atv.MapLegend.Base.Back, atv.ScrData);
    Generic.createNewCheckBox(tabLegend.panel[0], "局地変動モード", "", atv.MapLegend.Base.ModeValueInScreenFlag, 30, 130,undefined,  function (obj) { atv.MapLegend.Base.ModeValueInScreenFlag = obj.checked }, "");

    const tabLegendtab00 = Generic.createNewFrame(tabLegend.panel[0], "", "", 200, 25, 200, 120, "重ね合わせの凡例タイトル");
    Generic.createNewCheckBox(tabLegendtab00, "表示", "", atv.MapLegend.OverLay_Legend_Title.Print_f, 10, 70,undefined,  function (obj) { atv.MapLegend.OverLay_Legend_Title.Print_f = obj.checked }, "");
    Generic.createNewSizeSelect(tabLegendtab00, atv.MapLegend.OverLay_Legend_Title.MaxWidth, "","サイズ", 15, 25,40,3,
    function(obj, v){
        atv.MapLegend.OverLay_Legend_Title.MaxWidth=v;
    });
    /**階級区分*/
    const tabLegendtab10 = Generic.createNewFrame(tabLegend.panel[1], "", "", 10, 15, 110, 115, "凡例の表示方法");
    Generic.createNewRadioButtonList(tabLegendtab10, "PaintMode_Method", [{ value: enmClassMode_Meshod.Noral, text: "通常表示" }, { value: enmClassMode_Meshod.Separated, text: "分離表示" }], 5, 25, undefined,25, atv.MapLegend.ClassMD.PaintMode_Method,
        function (v) { atv.MapLegend.ClassMD.PaintMode_Method = v }, "");
    Generic.createNewCheckBox(tabLegendtab10, "カテゴリーデータは常に分離表示", "", atv.MapLegend.ClassMD.CategorySeparate_f, 5, 80, 90,function (obj) { atv.MapLegend.ClassMD.CategorySeparate_f = obj.checked }, "");

    const tabLegendtab11 = Generic.createNewFrame(tabLegend.panel[1], "", "", 130, 15, 150, 115, "分離表示の文字と間隔");
    Generic.createNewRadioButtonList(tabLegendtab11, "SeparateClassWords", [{ value: enmSeparateClassWords.Japanese, text: "以上/未満" }, { value: enmSeparateClassWords.English, text: "or more/less than" }], 5, 15,undefined, 25, atv.MapLegend.ClassMD.SeparateClassWords,
        function (v) { atv.MapLegend.ClassMD.SeparateClassWords = v }, "");
    Generic.createNewSizeSelect(tabLegendtab11, atv.MapLegend.ClassMD.SeparateGapSize, "", "間隔（文字の高さとの比）", 2, 70, 70, [0.1, 0.2, 0.3, 0.4],
        function (obj, v) {
            atv.MapLegend.ClassMD.SeparateGapSize = v;
        },false);
    const tabLegendtab12 = Generic.createNewFrame(tabLegend.panel[1], "", "", 290, 15, 190, 115, "階級区分枠");
    Generic.createNewSizeSelect(tabLegendtab12, atv.MapLegend.ClassMD.PaintMode_Width, "", "枠の幅（文字の高さとの比）", 10, 15, 90, [0.8, 1.0, 1.2, 1.5, 2.0],
        function (obj, v) {
            atv.MapLegend.ClassMD.PaintMode_Width = v;
        },false);
    Generic.createNewWordDivCanvas(tabLegendtab12, "PaintMode_Line", "ラインパターン", 10, 45, 100,
        function (e) {
            clsLinePatternSet(e, atv.MapLegend.ClassMD.PaintMode_Line,
                function (Lpat) {
                    atv.MapLegend.ClassMD.PaintMode_Line = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(document.getElementById("PaintMode_Line"), atv.MapLegend.ClassMD.PaintMode_Line);
    Generic.createNewCheckBox(tabLegendtab12, "階級記号モードでも表示", "", atv.MapLegend.ClassMD.ClassMarkFrame_Visible, 10, 80, undefined,function (obj) { atv.MapLegend.ClassMD.ClassMarkFrame_Visible = obj.checked }, "");

    const tabLegendtab13 = Generic.createNewFrame(tabLegend.panel[1], "", "", 10, 145, 260, 50, "面形状階級区分オブジェクト間の境界線");
    Generic.createNewCheckBox(tabLegendtab13, "表示", "", atv.MapLegend.ClassMD.ClassBoundaryLine.Visible, 15, 15,undefined,
     function (obj) { atv.MapLegend.ClassMD.ClassBoundaryLine.Visible = obj.checked }, "");
    let ClassBoundaryLine = Generic.createNewWordDivCanvas(tabLegendtab13, "", "ラインパターン", 100, 15, 100,
        function (e) {
            clsLinePatternSet(e, atv.MapLegend.ClassMD.ClassBoundaryLine.LPat,
                function (Lpat) {
                    atv.MapLegend.ClassMD.ClassBoundaryLine.LPat = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(ClassBoundaryLine, atv.MapLegend.ClassMD.ClassBoundaryLine.LPat);
    Generic.createNewCheckBox(tabLegend.panel[1], "度数の表示", "", atv.MapLegend.ClassMD.FrequencyPrint, 290, 160, undefined,function (obj) { atv.MapLegend.ClassMD.FrequencyPrint = obj.checked }, "");

    /**記号・円グラフ*/
    Generic.createNewCheckBox(tabLegend.panel[2],"記号の大きさモードで円の凡例をコンパクトにまとめる","",atv.MapLegend.MarkMD.CircleMD_CircleMini_F,20,20,180,
    function(obj){atv.MapLegend.MarkMD.CircleMD_CircleMini_F=obj.checked;},"")

    let ClasMarkMDMultiEnMode_Lines = Generic.createNewWordDivCanvas(tabLegend.panel[2], "", "記号の大きさモードの円、円・縦帯グラフの際の凡例線", 20, 60, 160,
        function (e) {
            clsLinePatternSet(e, atv.MapLegend.MarkMD.MultiEnMode_Line,
                function (Lpat) {
                    atv.MapLegend.MarkMD.MultiEnMode_Line = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(ClasMarkMDMultiEnMode_Lines, atv.MapLegend.MarkMD.MultiEnMode_Line);
    Generic.createNewWordWidthDiv(tabLegend.panel[2], "", "負の値の記号モードの既定凡例文字", 20, 110, 21, undefined, undefined);
    Generic.createNewWordTextInput(tabLegend.panel[2], "正の値", "", clsSettingData.LegendPlusWord, "", 40, 130, undefined, 80, function (e) {sdata.LegendPlusWord = e.target.value }, "");
    Generic.createNewWordTextInput(tabLegend.panel[2], "負の値", "", clsSettingData.LegendMinusWord, "", 40, 155, undefined, 80, function (e) { sdata.LegendMinusWord = e.target.value }, "");
    Generic.createNewWordTextInput(tabLegend.panel[2], "記号の数モードの際の凡例文字", "", clsSettingData.LegendBlockmodeWord, "", 270, 20, 100, 100, function (e) { sdata.LegendBlockmodeWord = e.target.value }, "");
    const gbEnGraphLegend = Generic.createNewFrame(tabLegend.panel[2], "", "", 270, 85, 150, 80, "円グラフの凡例形状");
    Generic.createNewRadioButtonList(gbEnGraphLegend, "enmMultiEnGraphPattern", [{ value: enmMultiEnGraphPattern.multiCircle, text: "複数の扇形に分ける" }, { value: enmMultiEnGraphPattern.oneCircle, text: "１つの円" }], 5, 20, 130, 30, atv.MapLegend.En_Graph_Pattern,
        function (v) { atv.MapLegend.En_Graph_Pattern = v }, "");

    /**線種・点ダミー*/
    let atvl=atv.MapLegend.Line_DummyKind;
    Generic.createNewCheckBox(tabLegend.panel[3], "線種の凡例を表示", "", atvl.Line_Visible, 20, 20, 180,
        function (obj) { atvl.Line_Visible = obj.checked; }, "");
    let lLK = attrData.GetAllMapLineKindName();
    let lLKList = [];
    for (let i = 0; i < lLK.length; i++) {
        let cv = (atvl.Line_Visible_Number_STR.mid(i, 1) == "1");
        lLKList.push({ text: lLK[i], checked: cv });
    }
    Generic.createNewCheckListBox(tabLegend.panel[3], "", lLKList, 20, 45, 150, 150, function (num, checked) {
        atvl.Line_Visible_Number_STR = atvl.Line_Visible_Number_STR.midReplace(num, (checked == true) ? "1" : "0");
    }, "");
    let MapLegendLine_DummyKind = Generic.createNewWordDivCanvas(tabLegend.panel[3], "", "背景", 190, 45, undefined, function (e) {
        clsBackgroundPatternSet(e, atvl.Back, backGet, attrData);
        function backGet(back) {
            atvl.Back = back;
            clsDrawTile.Darw_Sample_BackGroundBox(e.target, back, atv.ScrData);
        }
    });
    clsDrawTile.Darw_Sample_BackGroundBox(MapLegendLine_DummyKind, atvl.Back, atv.ScrData);
    let gbMapLegendLine = Generic.createNewFrame(tabLegend.panel[3], "", "", 190, 85, 100, 80, "線の描き方");
    Generic.createNewRadioButtonList(gbMapLegendLine, "enmCircleMDLegendLine", [{ value: enmCircleMDLegendLine.Zigzag, text: "＼／＼" }, { value: enmCircleMDLegendLine.Straight, text: "───" }], 5, 20, 130, 30, atvl.Line_Pattern,
        function (v) { atvl.Line_Pattern = v }, "");
    Generic.createNewCheckBox(tabLegend.panel[3], "点オブジェクトのダミーの凡例を表示", "", atvl.Dummy_Point_Visible, 310, 20, 130,
        function (obj) { atvl.Dummy_Point_Visible = obj.checked }, "");


    /**欠損値●●●●●●●●●●●●●●●●●●●●● */

    let atvm = atv.Missing_Data;
    Generic.createNewCheckBox(tab.panel[3], "欠損値を表示", "", atvm.Print_Flag, 20, 20, undefined, function (obj) { atvm.Print_Flag = obj.checked }, "");
    let gbmPat = Generic.createNewFrame(tab.panel[3], "", "", 30, 50, 500, 200, "欠損値のパターン");
    Generic.createNewWordTextInput(gbmPat, "欠損値の凡例文字", "", atvm.Text, "", 15, 15, 120, 90, function (e) { atvm.Text = e.target.value }, "");
    Generic.createNewTileBox(gbmPat, "", "ペイントモードの凡例", atvm.PaintTile, 15, 50, 120,
        function (e) {
            clsTileSet(e, atvm.PaintTile,
                function (retTile) { atvm.PaintTile = retTile });
        });
    let atvmClassMark = Generic.createNewWordDivCanvas(gbmPat, "", "階級記号モードの凡例記号", 15, 85, 120, function (e) {
        clsMarkSet(e, picMarkChange, atvm.ClassMark, attrData);
        function picMarkChange(newMark) {
            atvm.ClassMark = newMark;
            attrData.Draw_Sample_Mark_Box(e.target, newMark);
        }
    }, "");
    attrData.Draw_Sample_Mark_Box(atvmClassMark, atvm.ClassMark);
    let atvmMark = Generic.createNewWordDivCanvas(gbmPat, "", "記号の大きさモードの凡例記号", 15, 120, 120, function (e) {
        clsMarkSet(e, picMarkChange, atvm.Mark, attrData);
        function picMarkChange(newMark) {
            atvm.Mark = newMark;
            attrData.Draw_Sample_Mark_Box(e.target, newMark);
        }
    }, "");
    attrData.Draw_Sample_Mark_Box(atvmMark, atvm.Mark);
    let atvmBlockMark = Generic.createNewWordDivCanvas(gbmPat, "", "記号の数モードの凡例記号", 15, 155, 120, function (e) {
        clsMarkSet(e, picMarkChange, atvm.BlockMark, attrData);
        function picMarkChange(newMark) {
            atvm.BlockMark = newMark;
            attrData.Draw_Sample_Mark_Box(e.target, newMark);
        }
    }, "");
    attrData.Draw_Sample_Mark_Box(atvmBlockMark, atvm.BlockMark);
    let atvmBlockMarkBar = Generic.createNewWordDivCanvas(gbmPat, "", "棒の高さモードの凡例記号", 250, 15, 120, function (e) {
        clsMarkSet(e, picMarkChange, atvm.MarkBar, attrData);
        function picMarkChange(newMark) {
            atvm.MarkBar = newMark;
            attrData.Draw_Sample_Mark_Box(e.target, newMark);
        }
    }, "");
    attrData.Draw_Sample_Mark_Box(atvmBlockMarkBar, atvm.MarkBar);
    Generic.createNewWordTextInput(gbmPat, "文字・ラベルモードの凡例文字", "", atvm.Label, "", 250, 50, 120, 90, function (e) { atvm.Label = e.target.value }, "");
    let atvmLineShape = Generic.createNewWordDivCanvas(gbmPat, "", "線形状オブジェクトの凡例", 250, 85, 120,
        function (e) {
            clsLinePatternSet(e, atvm.LineShape,
                function (Lpat) {
                    atvm.LineShape = Lpat;
                    attrData.Draw_Sample_LineBox(e.target, Lpat);
                });
        });
    attrData.Draw_Sample_LineBox(atvmLineShape, atvm.LineShape);

    /**スケール設定●●●●●●●●●●●●●●●●●●●●● */
    let atvs = atv.MapScale;
    Generic.createNewCheckBox(tab.panel[4], "スケールを表示", "", atvs.Visible, 20, 20, undefined, function (obj) { atvs.Visible = obj.checked }, "");
    Generic.createNewButton(tab.panel[4], "フォント", "", 30, 55,
        function (e) {
            clsFontSet(e, atvs.Font, function (newFont) { atvs.Font = newFont }, attrData);
        }, "");
    let atvsBack = Generic.createNewWordDivCanvas(tab.panel[4], "", "背景", 30, 90, undefined, function (e) {
        clsBackgroundPatternSet(e, atvs.Back, backGet, attrData);
        function backGet(back) {
            atvs.Back = back;
            clsDrawTile.Darw_Sample_BackGroundBox(e.target, back, atv.ScrData);
        }
    });
    clsDrawTile.Darw_Sample_BackGroundBox(atvsBack, atvs.Back, atv.ScrData);
    Generic.createNewSpan(tab.panel[4], "スケールバーの表示単位", "", "", 30, 125, "", "");
    const scaleList = Generic.getScaleUnit_for_select();
    Generic.createNewSelect(tab.panel[4], scaleList, atvs.Unit, "", 40, 150, false,
        function (obj, sel, v) { atvs.Unit = v }, "",1,false);
    let gbScaleLength = Generic.createNewFrame(tab.panel[4], "", "", 180, 55, 200, 130, "スケールバーの長さ・間隔");
    Generic.createNewCheckBox(gbScaleLength, "スケールバー自動設定", "", atvs.BarAuto, 20, 20, undefined, function (obj) { atvs.BarAuto = obj.checked }, "");
    Generic.createNewWordNumberInput(gbScaleLength, "スケールバーの距離", "", atvs.BarDistance, "", 30, 55, 80, 70, function (obj, v) { atvs.BarDistance = v }, "");
    Generic.createNewDiv(gbScaleLength, "スケールバーの区切り数", "", "", 30, 90, 90, undefined, "", "");
    const sclDivList = [{ value: 1, text: "1" }, { value: 2, text: "2" }, { value: 3, text: "3" }, { value: 4, text: "4" }, { value: 5, text: "5" }, { value: 6, text: "6" }];
    Generic.createNewSelect(gbScaleLength, sclDivList, atvs.BarKugiriNum, "", 130, 90, false,
        function (obj, sel, v) { atvs.BarKugiriNum = v }, "");
    let gbScaleType = Generic.createNewFrame(tab.panel[4], "", "", 400, 55, 150, 110, "スケールバーの種類");
    Generic.createNewRadioButtonList(gbScaleType, "enmScaleBarPattern", [{ value: enmScaleBarPattern.Thin, text: "通常" }, { value: enmScaleBarPattern.Bold, text: "白黒交互" }, { value: enmScaleBarPattern.Slim, text: "細い" }], 15, 20, undefined, 30, atvs.BarPattern,
        function (v) { atvs.BarPattern = v }, "");


    function buttonOK(){
        Generic.clear_backDiv();
        clsSettingData = sdata.Clone();
        attrData.TotalData.ViewStyle = atv.Clone();
        clsPrint.printMapScreen(Frm_Print.picMap);
    }
}

/**データ項目設定コピー */
function frmMainCopyDataSettings(okEvent){
    const backDiv = Generic.set_backDiv("", "データ項目設定コピー", 560, 400, true, true, buttonOK, 0.2, true);
    let origin = Generic.createNewFrame(backDiv, "", "", 20, 50, 250, 290, "コピー元");
    let dest = Generic.createNewFrame(backDiv, "", "", 290, 50, 250, 290, "コピー先");
    let originLayer = Generic.createNewWordSelect(origin,"レイヤ", undefined, -1, "", 10, 10,70,150,0,  changeOriginLayer,"", "");
    let destLayer = Generic.createNewWordSelect(dest,"レイヤ", undefined, -1, "", 10, 10,70,150,0,  changeDestLayer,"", "");
    let originData = Generic.createNewWordSelect(origin,"データ項目", undefined, -1, "", 10, 40,70,150,0,  changeOriginData,"", "");
    Generic.createNewSpan(dest,"データ項目","","",10,40,"",undefined);
    let destData=new CheckedListBox(dest,"",[],80,40,150,240,false,undefined);
    let LayerNum=attrData.TotalData.LV1.SelectedLayer;
    attrData.Set_LayerName_to(originLayer,LayerNum);
    attrData.Set_LayerName_to(destLayer,LayerNum);
    let al = attrData.LayerData[LayerNum].atrData;
    attrData.Set_DataTitle_to_cboBox(originData, LayerNum, al.SelectedIndex);
    setDestDataItem();
    let grCopyMode = Generic.createNewFrame(origin, "", "", 10, 70, 220, 200, "コピーする表示モード");
    let chkClassMode=Generic.createNewCheckBox(grCopyMode,"階級区分モード","",true,10,20,100,undefined,"");
    let chkODOriginCopy=Generic.createNewCheckBox(grCopyMode,"線モードの起点オブジェクトもコピー","",true,30,45,130,undefined,"");
    let chkMarkMode=Generic.createNewCheckBox(grCopyMode,"階級区分モード","",true,10,85,100,undefined,"");
    let chkODMarkSizeValueCopy=Generic.createNewCheckBox(grCopyMode,"記号の大きさモードの凡例値もコピー","",true,30,110,130,undefined,"");
    let chkContour=Generic.createNewCheckBox(grCopyMode,"等値線モード","",true,10,155,100,undefined,"");

    function changeOriginLayer(obj, sel, v){
        attrData.Set_DataTitle_to_cboBox(originData, sel, 0);
        setDestDataItem();
        }
    function changeOriginData(){
        setDestDataItem();
    }
    function changeDestLayer(){
        setDestDataItem();
    }
    /**コピー先データ項目の設定 */
    function setDestDataItem(){
        let dLay=destLayer.selectedIndex;
        let oLay=originLayer.selectedIndex;
        let oData=originData.selectedIndex;
        let Otype  = attrData.LayerData[oLay].atrData.Data[oData].DataType;
        let astn = -1;
            if( oLay== dLay){
                astn = oData;
            }
        attrData.Set_DataTitle_to_CheckedListBox(destData,dLay,false,true, Otype == enmAttDataType.Normal, Otype == enmAttDataType.Category, Otype == enmAttDataType.Strings, astn);
    }

    function buttonOK(){
        Generic.clear_backDiv();
        
        let OLayer  = originLayer.selectedIndex;
        let Dlyaer  = destLayer.selectedIndex;
        let OData  = originData.selectedIndex;

        let ClassCopyF  = chkClassMode.checked;
        let MarkCopyF  = chkMarkMode.checked;
        let ContourCopyF  = chkContour.checked;
        let ODOriginCopyF  = chkODOriginCopy.checked;
        let MarkSizeValueCopyF  = chkODMarkSizeValueCopy.checked;

        let checked=destData.getChecked().checkedArray;
        for(let i in checked){
            let n  = checked[i];
            attrData.Set_Legend(Dlyaer, n, attrData.LayerData[OLayer].atrData.Data[OData], ClassCopyF, MarkCopyF, MarkSizeValueCopyF, MarkCopyF,
                                 ContourCopyF, ClassCopyF, ClassCopyF, MarkCopyF,MarkCopyF,  ODOriginCopyF, (Dlyaer == OLayer));
            }
        okEvent();
    }
}

/**連続表示モードにまとめて設定 */
function frmMain_SetSeriesMode(okEvent) {
    let DataItem = [];
    const backDiv = Generic.set_backDiv("", "連続表示モードにまとめて設定", 790, 390, true, true, buttonOK, 0.2, true);
    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
    let tablist = ["単独表示", "グラフ表示", "ラベル表示", "重ね合わせ"];
    const tab = Generic.createNewTab(backDiv, tablist, 0, 15, 40, 350, 290);
    let cboLayerSolo = Generic.createNewWordSelect(tab.panel[0], "レイヤ", undefined, -1, "", 10, 10, 40, 150, 0, setSoloModeDataItem, "", "");
    attrData.Set_LayerName_to(cboLayerSolo, LayerNum);
    let layerSoloData = new CheckedListBox(tab.panel[0], "", [], 10, 40, 200, 220,false, undefined);
    setSoloModeDataItem();
    let modeNameList = [{ value: enmSoloMode_Number.ClassPaintMode, text: "" }, { value: enmSoloMode_Number.ClassMarkMode, text: "" }, { value: enmSoloMode_Number.ClassODMode, text: "" }, { value: enmSoloMode_Number.ContourMode, text: "" },
    { value: enmSoloMode_Number.MarkSizeMode, text: "" }, { value: enmSoloMode_Number.MarkBlockMode, text: "" }, { value: enmSoloMode_Number.MarkBarMode, text: "" }, { value: enmSoloMode_Number.StringMode, text: "" }];
    for (let i in modeNameList) {
        modeNameList[i].text = Generic.getSolomodeStrings(modeNameList[i].value);
    }
    let gbsoloModeSelect = Generic.createNewFrame(tab.panel[0], "", "", 225, 30, 115, 210, "表示モード");
    Generic.createNewRadioButtonList(gbsoloModeSelect, "soloModeSelect", modeNameList, 10, 10, undefined, 25, enmSoloMode_Number.ClassPaintMode);

    let cboLayerGraph = Generic.createNewWordSelect(tab.panel[1], "レイヤ", undefined, -1, "", 10, 10, 40, 150, 0, setGraphModeDataItem, "", "");
    attrData.Set_LayerName_to(cboLayerGraph, LayerNum);
    let layerGraphData = new CheckedListBox(tab.panel[1], "", [], 50, 40, 200, 220,false, undefined);
    setGraphModeDataItem();

    let cboLayerLabel = Generic.createNewWordSelect(tab.panel[2], "レイヤ", undefined, -1, "", 10, 10, 40, 150, 0, setLabelModeDataItem, "", "");
    attrData.Set_LayerName_to(cboLayerLabel, LayerNum);
    let layerLabelData = new CheckedListBox(tab.panel[2], "", [], 50, 40, 200, 220,false, undefined);
    setLabelModeDataItem();

    let overlayData = new CheckedListBox(tab.panel[3], "", [], 50, 40, 200, 220,false, undefined);
    setOverlayModeDataItem();

    Generic.createNewImageButton(backDiv, "", "image/112_RightArrowLong_Grey_24x24_72.png", 385, 180, 30, 30, btnSet_Click, "");

    //右側
    let gbdestSeries = Generic.createNewFrame(backDiv, "", "", 440, 40, 330, 290, "設定先連続表示データセット");
    Generic.createNewRadioButtonList(gbdestSeries, "rbSeriesDataSet", [{ value: 0, text: "既存データセット" }, { value: 1, text: "新しいデータセット" }], 10, 20, undefined, 45,
        0, function (value) {
            switch(value){
                case 0: {
                    copyExsistAttrDataItem();
                    break;
                }
                case 1: {
                    DataItem = [];
                    SetListView();
                    break;
                }
            }
         }
        , "");
    let seriesHdata = Generic.Array2Dimension(4, 1);
    seriesHdata[0][0] = "順番";
    seriesHdata[1][0] = "レイヤ";
    seriesHdata[2][0] = "データ";
    seriesHdata[3][0] = "表示モード";
    let slborderStyle = "border:solid 1px;background-Color:#ffffff"
    let seriesListView = new ListViewTable(gbdestSeries, "", "", "", seriesHdata, [], 10, 110, 300, 170, slborderStyle, "font-size:13px;",
        "background-Color:#dddddd;text-align:center", "", ["width:10%"], ["text-align:center"], true, undefined);

    let txtNewDataSet = Generic.createNewWordTextInput(gbdestSeries, "タイトル", "", "", "", 40, 85, undefined, 200, undefined, "");
    let selectDataset = Generic.createNewSelect(gbdestSeries, attrData.getSeriesDataSetName(), 0, "", 40, 40, false, copyExsistAttrDataItem, "width:185px", 1, false);
    copyExsistAttrDataItem();

    function copyExsistAttrDataItem() {
        DataItem = [];
        let n = selectDataset.selectedIndex;
        let asd = attrData.TotalData.TotalMode.Series.DataSet[n];
        DataItem = Generic.ArrayClone(asd.DataItem);
        SetListView();
    }
    function btnSet_Click() {
        let emes = "";
        switch (tab.selectedIndex) {
            case 0: {
                let checked = layerSoloData.getChecked().checkedArray;
                if (checked.length == 0) {
                    return;
                }
                let LayerNum = cboLayerSolo.selectedIndex;
                for (let i = 0; i < checked.length; i++) {
                    let n = checked[i];
                    let dt = new strSeries_DataSet_Item_Info();
                    dt.Data = n;
                    dt.Layer = LayerNum;
                    dt.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
                    dt.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
                    dt.SoloMode = Generic.getRadioCheckByValue("soloModeSelect");
                    if (attrData.Check_Enable_SoloMode(dt.SoloMode, LayerNum, n) == true) {
                        DataItem.push(dt);
                    } else {
                        emes += attrData.Get_DataTitle(LayerNum, n, false) + "は" + Generic.getSolomodeStrings(dt.SoloMode) + "モードで表示できません。" + "\n";
                    }
                }
                break;
            }
            case 1: {
                let checked = layerGraphData.getChecked().checkedArray;
                if (checked.length == 0) {
                    return;
                }
                let LayerNum = cboLayerGraph.selectedIndex;
                for (let i = 0; i < checked.length; i++) {
                    let n = checked[i];
                    let dt = new strSeries_DataSet_Item_Info();
                    dt.Data = n;
                    dt.Layer = LayerNum;
                    dt.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
                    dt.Print_Mode_Layer = enmLayerMode_Number.GraphMode;
                    DataItem.push(dt);
                }
                break;
            }
            case 2: {
                let checked = layerLabelData.getChecked().checkedArray;
                if (checked.length == 0) {
                    return;
                }
                let LayerNum = cboLayerLabel.selectedIndex;
                for (let i = 0; i < checked.length; i++) {
                    let n = checked[i];
                    let dt = new strSeries_DataSet_Item_Info();
                    dt.Data = n;
                    dt.Layer = LayerNum;
                    dt.Print_Mode_Total = enmTotalMode_Number.DataViewMode;
                    dt.Print_Mode_Layer = enmLayerMode_Number.LabelMode;
                    DataItem.push(dt);
                }
                break;
            }
            case 3: {
                let checked = overlayData.getChecked().checkedArray;
                if (checked.length == 0) {
                    return;
                }
                for (let i = 0; i < checked.length; i++) {
                    let n = checked[i];
                    let dt = new strSeries_DataSet_Item_Info();
                    dt.Data = n;
                    dt.Print_Mode_Total = enmTotalMode_Number.OverLayMode;
                    DataItem.push(dt);
                }
                break;
            }
        }
        SetListView()
        if (emes != "") {
            Generic.createMsgBox("エラー", emes, true);
        }
    }

    function SetListView() {
        attrData.SeriesMode_to_ListViewData(seriesListView, DataItem);
    }
    function setGraphModeDataItem(){
        let lay = cboLayerGraph.selectedIndex;
        let titles = attrData.getGraphTitle(lay);
        let list = [];
        for (let i in titles) {
            list.push({ checked: false, text: titles[i].text });
        }
        layerGraphData.removeAll();
        layerGraphData.addList(list, 0);
    }
    function setLabelModeDataItem(){
        let lay = cboLayerLabel.selectedIndex;
        let titles = attrData.getLabelTitle(lay);
        let list = [];
        for (let i in titles) {
            list.push({ checked: false, text: titles[i].text });
        }
        layerLabelData.removeAll();
        layerLabelData.addList(list, 0);
    } 

    function setOverlayModeDataItem(){
        let titles = attrData.getOverlayTitle();
        let list = [];
        for (let i in titles) {
            list.push({ checked: false, text: titles[i].text });
        }
        overlayData.removeAll();
        overlayData.addList(list, 0);
    }

    function setSoloModeDataItem() {
        let lay = cboLayerSolo.selectedIndex;
        attrData.Set_DataTitle_to_CheckedListBox(layerSoloData,lay,false,true, true, true, true,-1);
    }
    function buttonOK() {
        let v=Generic.getRadioCheckByValue("rbSeriesDataSet");
        let as=attrData.TotalData.TotalMode.Series;
        let sel;
        switch(v){
            case 0: {
                 sel = selectDataset.selectedIndex;
                let dt =as.DataSet[sel];
                dt.SelectedIndex = 0;
                dt.DataItem=[];
                dt.DataItem =Generic.ArrayClone( DataItem);
                as.DataSet[sel] = dt;
                break;
            }
            case 1: {
                sel=as.DataSet.length
                let dt =new strSeries_Dataset_Info();
                dt.title = txtNewDataSet.value;
                dt.SelectedIndex = 0;
                dt.DataItem = Generic.ArrayClone( DataItem);
                as.DataSet.push(dt);
                break;
            }
        }
        Generic.clear_backDiv();
        okEvent(sel);
    }
}

/**記号表示位置等操作 */
function frmMain_MarkPosition(okEvent) {
    const backDiv = Generic.set_backDiv("", "記号表示位置等操作", 450, 365, true, true, buttonOK, 0.2, true);
    let Layernum = attrData.TotalData.LV1.SelectedLayer;
    let Objn = attrData.Get_ObjectNum(Layernum);
    let al = attrData.LayerData[Layernum];
    let lst = [{ value: 0, text: "代表点を属性データとして取得" },
    { value: 1, text: "記号表示位置を属性データとして取得" },
    { value: 2, text: "属性データを記号表示位置に設定" },
    { value: 3, text: "重心を記号表示位置に設定" },
    { value: 4, text: "記号表示位置を代表点に戻す" },
    { value: 5, text: "ラベル表示位置を属性データとして取得" },
    { value: 6, text: "記号表示位置をラベル表示位置に設定" },
    { value: 7, text: "属性データをラベル表示位置に設定" },
    { value: 8, text: "重心をラベル表示位置に設定" },
    { value: 9, text: "ラベル表示位置を代表点に戻す" },
    ]
    Generic.createNewSpan(backDiv, "操作を選択して下さい", "", "", 15, 40, "", undefined);
    Generic.createNewSpan(backDiv, "対象レイヤ：" + attrData.LayerData[Layernum].Name, "", "", 240, 40, "", undefined);
    Generic.createNewRadioButtonList(backDiv, "markPositionOperation", lst, 15, 70, 200, 25, 0, rbClick, "");
    const gbDataSelect = Generic.createNewFrame(backDiv, "", "", 240, 220, 200, 80, "設定する属性データ");
    const cboLonData = Generic.createNewWordSelect(gbDataSelect, "経度", [], 0, "", 10, 20, 30, 140, 0, undefined, "", "", true);
    const cboLatData = Generic.createNewWordSelect(gbDataSelect, "緯度", [], 0, "", 10, 50, 30, 140, 0, undefined, "", "", true);
    gbDataSelect.setVisibility(false);
    let titles = attrData.getDataTitleName(Layernum, true, true, false, false, undefined);
    let items = [{value:0,text:"変更なし"}];
    for (let i = 0; i < titles.length; i++) {
        items.push({ value: (i+1), text: titles[i] });
    }
    cboLonData.addSelectList(items, 0, true,true);
    cboLatData.addSelectList(items, 0, true,true);
    if (attrData.TotalData.ViewStyle.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido) {
        Generic.enableRadioByValue("markPositionOperation", 2, false);
        Generic.enableRadioByValue("markPositionOperation", 7, false);
    }
    if (al.Shape != enmShape.PolygonShape) {
        Generic.enableRadioByValue("markPositionOperation", 3, false);
        Generic.enableRadioByValue("markPositionOperation", 8, false);
        return;
    }
    function rbClick(value) {
        switch (value) {
            case 2:
            case 7:
                gbDataSelect.setVisibility(true);
                break;
            default:
                gbDataSelect.setVisibility(false);
                break;
        }
    }
    function buttonOK() {
        let mode = Generic.getRadioCheckByValue("markPositionOperation");
        switch (mode) {
            case 0: //代表点を属性データとして取得
            case 1: //記号表示位置を属性データとして取得
            case 5: { //ラベル表示位置を属性データとして取得                   
                Generic.clear_backDiv();
                okEvent(mode);
                break;
            }
            case 2: //属性データを記号表示位置に設定
            case 7: {//属性データをラベル表示位置に設定
                let lat = cboLatData.selectedIndex -1;
                let lon = cboLonData.selectedIndex - 1;
                if ((lat == -1) && (lon == -1)) {
                    Generic.alert(undefined, "選択されていません。");
                    return;
                }
                if (lat != -1) {
                    let ald = al.atrData.Data[lat];
                    if ((ald.Statistics.Max > 90) || (ald.Statistics.Min < -90)) {
                        Generic.alert(undefined, ald.Title + "の最大値・最小値が90/-90を超えています。");
                        return;
                    }
                }
                if (lon != -1) {
                    let ald = al.atrData.Data[lon];
                    if ((ald.Statistics.Max > 180) || (ald.Statistics.Min < -180)) {
                        Generic.alert(undefined, ald.Title + "の最大値・最小値が180/-180を超えています。");
                        return;
                    }
                }

                let OriPos = [];
                let zahyo = attrData.TotalData.ViewStyle.Zahyo;
                for (let i = 0; i < Objn; i++) {
                    let alo = al.atrObject.atrObjectData[i];
                    switch (mode) {
                        case 7:
                            OriPos[i] = spatial.Get_Reverse_XY(alo.Label, zahyo);
                            break;
                        case 2:
                            OriPos[i] = spatial.Get_Reverse_XY(alo.Symbol, zahyo);
                            break;
                    }
                }

                if (lat != -1) {
                    let Data = attrData.Get_Data_Cell_Array_Without_MissingValue(Layernum, lat);
                    for (let i = 0; i < Data.length; i++) {
                        OriPos[Data[i].ObjLocation].y = Number(Data[i].DataValue);
                    }
                }

                if (lon != -1) {
                    let Data = attrData.Get_Data_Cell_Array_Without_MissingValue(Layernum, lon);
                    for (let i = 0; i < Data.length; i++) {
                        OriPos[Data[i].ObjLocation].x = Number(Data[i].DataValue);
                    }
                }

                for (let i = 0; i < Objn; i++) {
                    let alo = al.atrObject.atrObjectData[i];
                    let P = spatial.Get_Converted_XY(OriPos[i], zahyo);
                    switch (mode) {
                        case 7:
                            alo.Label = P;
                            break;
                        case 2:
                            alo.Symbol = P;
                            break;
                    }
                }
                Generic.clear_backDiv();
                switch (mode) {
                    case 7:
                        Generic.alert(undefined, "属性データをラベル表示位置に設定しました。");
                        break;
                    case 2:
                        Generic.alert(undefined, "属性データを記号表示位置に設定しました。");
                        break;
                }
                okEvent(mode);
                break;
            }
            case 4: {//記号表示位置を代表点に戻す
                for (let i = 0; i < Objn; i++) {
                    al.atrObject.atrObjectData[i].Symbol = attrData.Get_CenterP(Layernum, i).Clone();
                }
                Generic.clear_backDiv();
                Generic.alert(undefined, "記号表示位置をオブジェクトの代表点に戻しました。");
                okEvent(mode);
                break;
            }
            case 6: {//記号表示位置をラベル表示位置に設定
                for (let i = 0; i < Objn; i++) {
                    al.atrObject.atrObjectData[i].Label = al.atrObject.atrObjectData[i].Symbol.Clone();
                }
                Generic.clear_backDiv();
                Generic.alert(undefined, "記号表示位置をラベル表示位置に設定しました。");
                okEvent(mode);
                break;
            }
            case 3://重心を記号表示位置に設定
            case 8: {//重心をラベル表示位置に設定
                for (let i = 0; i < Objn; i++) {
                    let retV = attrData.Get_ObjectGravityPoint(Layernum, i);
                    if (retV.ok == true) {
                        if (mode == 3) {
                            al.atrObject.atrObjectData[i].Symbol = retV.gpoint;
                        } else {
                            al.atrObject.atrObjectData[i].Label = retV.gpoint;
                        }
                    }
                }
                Generic.clear_backDiv();
                if (mode == 3) {
                    Generic.alert(undefined, "記号表示位置をオブジェクトの重心に設定しました。");
                } else {
                    Generic.alert(undefined, "ラベル表示位置をオブジェクトの重心に設定しました。");
                }
                okEvent(mode);
                break;
            }
            case 9: {//ラベル表示位置を代表点に戻す
                for (let i = 0; i < Objn; i++) {
                    al.atrObject.atrObjectData[i].Label = attrData.Get_CenterP(Layernum, i).Clone();
                }
                Generic.clear_backDiv();
                Generic.alert(undefined, "ラベル表示位置をオブジェクトの代表点に戻しました。");
                okEvent(mode);
                break;
            }
        }
    }
}

/**属性検索設定 */
function frmMain_ConditionSettings(okEvent){
    const backDiv = Generic.set_backDiv("", "属性検索設定", 305, 370, true, true, buttonOK, 0.2, true);
    Generic.createNewSpan(backDiv,"条件設定","","",15,40,"",undefined);
    Generic.createNewButton(backDiv,"設定変更","",15,275,function(){
        let n  = clbList.selectedIndex;
        if (n == -1){
            Generic.createMsgBox("","条件設定を選択して下さい。",false);
            return;
        }
        let ConItem = attrData.TotalData.Condition[n];
        frmMain_ConditionSettingSub(ConItem,btnOK);
        function btnOK(Con){
            attrData.TotalData.Condition[n] = Con;
            clbList.setText(n, "【" + attrData.LayerData[Con.Layer].Name + "】" + Con.Name);
            clbList.setCheckStatus(n, Con.Enabled)
        }
    },"width:80px");
    Generic.createNewButton(backDiv,"追加","",110,275,function(){
        let cttl=[];
        for(let  i = 0 ;i< attrData.TotalData.Condition.length;i++){
            cttl[i] = attrData.TotalData.Condition[i].Name;
        }
        let ConItem = new strCondition_DataSet_Info();
        ConItem.Layer = DefoLay;
        ConItem.Name = Generic.Get_New_Numbering_Strings("属性検索条件", cttl);
        ConItem.Condition_Class =[];// New List(Of clsAttrData.strCondition_Data_Info)
        let cdt = new strCondition_Data_Info();
        cdt.And_OR = enmConditionAnd_Or._And;
        cdt.Condition = [];// List(Of clsAttrData.strCondition_Limitation_Info)
        ConItem.Condition_Class.push(cdt);
        ConItem.Enabled = true;
        frmMain_ConditionSettingSub(ConItem,btnOK);
        function btnOK(Con){
            attrData.TotalData.Condition.push(Con);
            clbList.addList([{checked:true,text:"【" + attrData.LayerData[Con.Layer].Name + "】" + Con.Name}],clbList.length);
        }
    }, "width:80px");
    Generic.createNewButton(backDiv, "削除", "", 205, 275, function (e) { 
        let n  = clbList.selectedIndex;
        if (n == -1){
            Generic.alert(new point(e.clientX, e.clientY),"条件設定を選択して下さい。");
            return;
        }
        attrData.TotalData.Condition.splice(n, 1);
        clbList.removeList(n,1);
    }, "width:80px");
    let chkInvisibleObjectBoundary = Generic.createNewCheckBox(backDiv, "非表示面オブジェクトの境界線を描画", "", attrData.TotalData.ViewStyle.InVisibleObjectBoundaryF, 15, 305, 200, undefined, "");
    Generic.createNewButton(backDiv, "該当条件チェック", "", 15, 335, function () { 
        for(let i = 0;i<clbList.length;i++){
            let cdt  = attrData.TotalData.Condition[i];
            cdt.Enabled = clbList.getCheckedStatus(i);
        }
        let tx  = "";
        for(let i = 0 ;i< attrData.TotalData.LV1.Lay_Maxn ;i++){
            tx += attrData.Get_Condition_Ok_Num_Info(i);
        }
        Generic.createMsgBox("属性検索", tx, true);

    }, "");

    let DefoLay = attrData.TotalData.LV1.SelectedLayer;

    let atc = attrData.TotalData.Condition;
    let list = [];
    for (let i = 0; i < atc.length; i++) {
        let tx = "【" + attrData.LayerData[atc[i].Layer].Name + "】" + atc[i].Name;
        list.push({ checked: atc[i].Enabled, text: tx });
    }
    let clbList = new CheckedListBox(backDiv, "", list, 15, 65, 270, 200, true, undefined);

    function buttonOK() {
        Generic.clear_backDiv();
        let checkv=clbList.getChecked().checkedStatus;
        for (let i = 0; i < atc.length; i++) {
            atc[i].Enabled=checkv[i];
        }
        attrData.TotalData.ViewStyle.InVisibleObjectBoundaryF = chkInvisibleObjectBoundary.checked;
        okEvent();
    }
}

/**属性検索条件設定画面 */
function frmMain_ConditionSettingSub(_ConItem, okEvent) {

    const backDiv = Generic.set_backDiv("", "属性検索条件設定", 450, 540, true, true, buttonOK, 0.2, true);
    let ConItem = _ConItem.Clone();
    let LayerNum = ConItem.Layer;//attrData.TotalData.LV1.SelectedLayer;
    let grTop = Generic.createNewFrame(backDiv, "", "", 15, 40, 400, 90, "");
    let cboLayerLabel = Generic.createNewWordSelect(grTop, "レイヤ", undefined, -1, "", 15, 10, 60, 150, 0, changeLayer, "", "");
    attrData.Set_LayerName_to(cboLayerLabel, LayerNum);
    let txtTitle = Generic.createNewWordTextInput(grTop, "タイトル", "", ConItem.Name, "", 15, 50, 60, 160, undefined, "text-align:left");

    let cboStep = Generic.createNewWordSelect(backDiv, "段階", undefined, -1, "", 15, 140, 40, 80, 0, changeStep, "", "");
    Generic.createNewButton(backDiv, "段階追加", "", 170, 140, function () {
        let n = cboStep.options.length;
        let cdt = new strCondition_Data_Info();
        cdt.And_OR = enmConditionAnd_Or._And;
        cdt.Condition = [];
        ConItem.Condition_Class.push(cdt);
        setStep(n);
    }, "");
    Generic.createNewButton(backDiv, "段階削除", "", 250, 140, function (e) {
        if (ConItem.Condition_Class.length == 1) {
            Generic.alert(new point(e.clientX, e.clientY),"これ以上削除できません。");
            return;
        }
        let n = cboStep.selectedIndex;
        Generic.confirm(new point(e.clientX, e.clientY), cboStep.options[n].text + "を削除します。", function () {
            let newn;
            if (n == cboStep.options.length - 1) {
                newn = n - 1;
            } else {
                newn = n;
            }
            ConItem.Condition_Class.splice(n, 1);
            setStep(newn);
            ListViewSet()
        }, undefined);
    }, "");
    setStep(0);

    let grPanel = Generic.createNewFrame(backDiv, "", "", 15, 175, 400, 315, "");
    let overHdata = Generic.Array2Dimension(3, 1);
    overHdata[0][0] = "データ項目";
    overHdata[1][0] = "条件値";
    overHdata[2][0] = "条件";
    let borderStyle = "border:solid 1px;background-Color:#ffffff";
    let ListView = new ListViewTable(grPanel, "", "", "", overHdata, [], 10, 10, 290, 165, borderStyle, "font-size:13px;",
        "background-Color:#dddddd;text-align:center", "", ["", "", "width:30%"], "", true, undefined);

    let grAndOr = Generic.createNewFrame(grPanel, "", "", 310, 10, 75, 65, "");
    Generic.createNewRadioButtonList(grAndOr, "rdoAndOr", [{ value: enmConditionAnd_Or._And, text: "AND" }, { value: enmConditionAnd_Or.Or, text: "OR" }], 15, 10, undefined, 30, 0, undefined, "");
    Generic.createNewButton(grPanel, "項目削除", "", 310, 90, function (e) {
        let n = cboStep.selectedIndex;
        if (ListView.getRowNumber() == 0) {
            return;
        }
        let selRow = ListView.selectedRow;
        if (selRow == -1) {
            Generic.alert(new point(e.clientX, e.clientY),"項目を選択して下さい。");
        } else {
            let  newRow=ListView.selectedRow;
            ConItem.Condition_Class[n].Condition.splice(selRow, 1);
            ListViewSet();
            newRow=(newRow == ListView.getRowNumber()) ? newRow-1:newRow;
            ListView.selectRow(newRow);
        }
    }, "");

    let newSettings = Generic.createNewFrame(grPanel, "", "", 10, 185, 380, 110, "新規設定");
    let cboData = Generic.createNewWordSelect(newSettings, "データ項目", undefined, -1, "", 15, 15, 60, 160, 0,
        function (obj, sel, v) {
            unitSpan.innerHTML = attrData.Get_DataUnit(cboLayerLabel.selectedIndex, sel);
        }, "", "");
    let txtValue = Generic.createNewWordTextInput(newSettings, "条件値", "", "", "", 15, 45, 60, 150, undefined, "text-align:left");
    let unitSpan = Generic.createNewSpan(newSettings, "", "", "", 235, 45, "", undefined)
    changeLayer(0,LayerNum, 0);
    ListViewSet();

    const condList = [{ value: enmCondition.Less, text: '' }, { value: enmCondition.LessEqual, text: '' },
    { value: enmCondition.Equal, text: '' }, { value: enmCondition.GreaterEqual, text: '' }, { value: enmCondition.Greater, text: '' },
    { value: enmCondition.NotEqual, text: '' }, { value: enmCondition.Include, text: '' }, { value: enmCondition.Exclude, text: '' },
    { value: enmCondition.Head, text: '' }, { value: enmCondition.Foot, text: '' }];
    for (let i in condList) {
        let tx = Generic.getConditionString(condList[i].value);
        condList[i].text = tx;
    }
    let cboCondition = Generic.createNewWordSelect(newSettings, "条件", condList, enmCondition.Equal, "", 15, 75, 60, 100, 0, undefined, "", "");
    Generic.createNewButton(newSettings, "項目追加", "", 300, 75, function (e) {
        let n = cboStep.selectedIndex;
        let Lim = new strCondition_Limitation_Info();
        Lim.Data = cboData.selectedIndex;
        Lim.Val = txtValue.value;
        Lim.Condition = cboCondition.getValue();
        if (attrData.Get_DataType(ConItem.Layer, Lim.Data) == enmAttDataType.Normal) {
            if (isNaN(Lim.Val)) {
                Generic.alert(new point(e.clientX, e.clientY),"数値以外の文字が含まれています。");
                return;
            }
        }
        ConItem.Condition_Class[n].Condition.push(Lim);
        ListViewSet();
        txtValue.value = "";
    }, "");

    function changeStep(obj, sel, v) {
        ListViewSet();
    }
    function changeLayer(obj, sel, v) {
        ConItem.Layer = sel;
        attrData.Set_DataTitle_to_cboBox(cboData, sel, 0, true, true, true, true);
        ListView.clear();
        unitSpan.innerHTML=attrData.Get_DataUnit(sel,0);
        txtValue.value = "";
    }

    function ListViewSet() {
        let n = cboStep.selectedIndex;
        ListView.clear();
        for (let i = 0; i < ConItem.Condition_Class[n].Condition.length; i++) {
            let ItemData = new Array(3);
            let cd = ConItem.Condition_Class[n].Condition[i];
            ItemData[0] = attrData.Get_DataTitle(ConItem.Layer, cd.Data, false)
            ItemData[1]=cd.Val;
            ItemData[2]=Generic.getConditionString(cd.Condition);
            ListView.insertRow(1, ItemData);
        }
    }

    function setStep(select) {
        let lst = [];
        for (let i=0;i<ConItem.Condition_Class.length;i++) {
            lst.push({ value: i, text: "段階" + String(i + 1) });
        }
        cboStep.addSelectList(lst, select, true, false);
    }

    function buttonOK() {
        Generic.clear_backDiv();
        ConItem.Name = txtTitle.value;
        okEvent(ConItem);
    }
}


/**面積・周長取得 */
function frmMain_AreaPeripheri(okEvent){
    const backDiv = Generic.set_backDiv("", "面積・周長取得", 195, 200, true, true, buttonOK, 0.2, true);
    let atv=attrData.TotalData.ViewStyle.MapScale;
    Generic.createNewRadioButtonList(backDiv, "rbAreaOrPeri", [{ value: 0, text: "オブジェクト面積取得" }, { value: 1, text: "オブジェクト周長取得" }], 15, 50, undefined, 30, 0, undefined, "");
    const scaleList = Generic.getScaleUnit_for_select();
    let scaleUnit=Generic.createNewWordSelect(backDiv,"取得単位",scaleList,atv.Unit,"",15,120,60,60,0,undefined,"","",false);
    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
    switch (attrData.LayerData[LayerNum].Shape) {
        case enmShape.PolygonShape: {
            Generic.enableRadioByValue("rbAreaOrPeri",0,true);
            Generic.enableRadioByValue("rbAreaOrPeri",1,true);
            Generic.checkRadioByValue("rbAreaOrPeri",0);
            break;
        }
        case enmShape.LineShape: {
            Generic.enableRadioByValue("rbAreaOrPeri",0,false);
            Generic.enableRadioByValue("rbAreaOrPeri",1,true);
            Generic.checkRadioByValue("rbAreaOrPeri",1);
            break;
        }
        default: {
            Generic.enableRadioByValue("rbAreaOrPeri",0,false);
            Generic.enableRadioByValue("rbAreaOrPeri",1,false);
            break;
        }
    }
    function buttonOK(e) {
        let n = attrData.Get_ObjectNum(LayerNum);
        let Data_Val_STR = new Array(n);
        let Title = "";
        let note = "";
        let MisF = false;
        let ScaleUnit = scaleUnit.getValue();
        let ScaleRatio = Generic.Convert_ScaleUnit(enmScaleUnit.kilometer, ScaleUnit);
        let SUnit = Generic.getScaleUnitStrings(undefined,ScaleUnit);
        let Unit = "";
        let rv = Generic.getRadioCheckByValue("rbAreaOrPeri");
        switch (rv) {
            case 0: {
                for (let i = 0; i < n; i++) {
                    let v =Number((attrData.GetObjMenseki(LayerNum, i).menseki * (ScaleRatio ** 2)).toFixed(6));
                    Data_Val_STR[i] = v;
                }
                Title = "計測面積";
                Unit = Generic.getScaleUnitAreaStrings(ScaleUnit);
                break;
            }
            case 1: {
                for (let i = 0; i < n; i++) {
                    let v =Number(( attrData.Get_ObjectLength(LayerNum, i) * ScaleRatio).toFixed(6));
                    Data_Val_STR[i] = v;
                }
                Title = "計測周長";
                Unit = SUnit;
                break;
            }
        }
        
        Generic.clear_backDiv();
        frmTitleSettingsAddingData(Title, Unit, note, true,"",
            function (retV) {
                attrData.Add_One_Data_Value(LayerNum, retV.title, retV.unit, retV.note, Data_Val_STR, MisF);
                okEvent(e);
            }
        )
    }
}

function frmMain_Culc(okEvent) {
    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
    const backDiv = Generic.set_backDiv("", "データ計算", 430, 490, true, true, buttonOK, 0.2, true);
    const rdList = [{ value: 0, text: "足し算" }, { value: 1, text: "引き算" }, { value: 2, text: "かけ算" }, { value: 3, text: "割り算" }, { value: 4, text: "増減率(%)" }, { value: 5, text: "密度" }];
    const rdYplus = [110, 55, 55, 90, 55]
    Generic.createNewRadioButtonList(backDiv, "dataCulMethod", rdList, 20, 50, 50, rdYplus, 0, undefined, "");

    const sumDataItem = new CheckedListBox(backDiv, "", [], 100, 50, 205, 100, false, function (e) { Generic.checkRadioByValue("dataCulMethod", 0) });　//足し算
    attrData.Set_DataTitle_to_CheckedListBox(sumDataItem, LayerNum, false, true, true, false, false);
    Generic.createNewSpan(backDiv, "数値入力", "", "", 330, 100, "", undefined);
    const txtPlusInput = Generic.createNewNumberInput(backDiv, "", "", 315, 130, 100, undefined, "")

    const cboDif1 = Generic.createNewSelect(backDiv, [], -1, "", 100, 160, false, function (e) { Generic.checkRadioByValue("dataCulMethod", 1) }, "width:150px");//引き算
    const cboDif2 = Generic.createNewWordSelect(backDiv, "－", [], -1, "", 120, 185, 30, 150, 0, function (e) { Generic.checkRadioByValue("dataCulMethod", 1) }, "", "");
    attrData.Set_DataTitle_to_cboBox(cboDif1, LayerNum, 0, true, true, false, false);
    attrData.Set_DataTitle_to_cboBox(cboDif2, LayerNum, 0, true, true, false, false);
    cboDif1.selectedIndex = -1;
    cboDif2.addSelectList([{ value: 0, text: "数値入力" }], -1, false, true, 0);
    const txtMinusInput = Generic.createNewNumberInput(backDiv, "", "", 315, 185, 100, undefined, "")

    const cboMulti1 = Generic.createNewSelect(backDiv, [], -1, "", 100, 215, false, function (e) { Generic.checkRadioByValue("dataCulMethod", 2) }, "width:150px");//かけ算
    const cboMulti2 = Generic.createNewWordSelect(backDiv, "×", [], -1, "", 120, 240, 30, 150, 0, function (e) { Generic.checkRadioByValue("dataCulMethod", 2) }, "", "");
    attrData.Set_DataTitle_to_cboBox(cboMulti1, LayerNum, 0, true, true, false, false);
    attrData.Set_DataTitle_to_cboBox(cboMulti2, LayerNum, 0, true, true, false, false);
    cboMulti1.selectedIndex = -1;
    cboMulti2.addSelectList([{ value: 0, text: "数値入力" }], -1, false, true, 0);
    const txtMultiInput = Generic.createNewNumberInput(backDiv, "", "", 315, 240, 100, undefined, "")

    const  cbonumeratorData= Generic.createNewSelect(backDiv, [], -1, "", 100, 270, false, function (e) { Generic.checkRadioByValue("dataCulMethod", 3) }, "width:150px");//わり算
    const  cboDenominatorData= Generic.createNewWordSelect(backDiv, "÷", [], -1, "", 120, 295, 30, 150, 0, function (e) { Generic.checkRadioByValue("dataCulMethod", 3) }, "", "");
    attrData.Set_DataTitle_to_cboBox(cboDenominatorData, LayerNum, 0, true, true, false, false);
    attrData.Set_DataTitle_to_cboBox(cbonumeratorData, LayerNum, 0, true, true, false, false);
    cboDenominatorData.addSelectList([{ value: 0, text: "数値入力" }], -1, false, true, 0);
    cbonumeratorData.addSelectList([{ value: 0, text: "数値入力" }], -1, false, true, 0);
    const txtnumeratorData = Generic.createNewNumberInput(backDiv, "", "", 270, 270, 100, undefined, "")
    const txtDenominatorDataBox = Generic.createNewNumberInput(backDiv, "", "", 315, 295, 100, undefined, "")
    const chkPercent = Generic.createNewCheckBox(backDiv, "100倍してパーセントにする", "", false, 100, 325, 200, undefined, "");

    const cboStartData = Generic.createNewWordSelect(backDiv, "期首データ", [], -1, "", 100, 360, 60, 150, 0, function (e) { Generic.checkRadioByValue("dataCulMethod", 4) }, "", "");
    const cboEndData = Generic.createNewWordSelect(backDiv, "期末データ", [], -1, "", 100, 385, 60, 150, 0, function (e) { Generic.checkRadioByValue("dataCulMethod", 4) }, "", "");
    attrData.Set_DataTitle_to_cboBox(cboStartData, LayerNum, -1, true, true, false, false);
    attrData.Set_DataTitle_to_cboBox(cboEndData, LayerNum, -1, true, true, false, false);

    const cboDensityData = Generic.createNewSelect(backDiv, [], -1, "", 100, 415, false, function (e) { Generic.checkRadioByValue("dataCulMethod", 5) }, "width:150px");//密度
    attrData.Set_DataTitle_to_cboBox(cboDensityData, LayerNum, -1, true, true, false, false);

    cboDensityData.disabled = (attrData.LayerData[LayerNum].Shape != enmShape.PolygonShape);
    Generic.enableRadioByValue("dataCulMethod",5, (attrData.LayerData[LayerNum].Shape == enmShape.PolygonShape));

    function buttonOK(e) {
        let n = attrData.Get_ObjectNum(LayerNum)
        let Data_Val_STR = new Array(n);
        let Title = "";

        let note = "";
        let MisF = false;
        let Unit = "";

        let mode = Generic.getRadioCheckByValue("dataCulMethod");
        switch (mode) {
            case 0: {
                let retV = sumDataItem.getChecked();
                let seln = retV.checkedArray.length;
                if (seln == 0) {
                    Generic.alert(undefined, "加算するデータを選択して下さい。");
                    return;
                }
                let plusVal = Number(txtPlusInput.value);

                let sumv = new Array(n);
                let sumf = new Array(n);
                sumv.fill(0);
                sumv.fill(false);
                Title = ""
                for (let i = 0; i < seln; i++) {
                    let dt = retV.checkedArray[i];
                    Unit = attrData.Get_DataUnit(LayerNum, dt);
                    Title += attrData.Get_DataTitle(LayerNum, dt, false);
                    if (i != seln - 1) {
                        Title += "＋";
                    }
                    let v = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, dt);
                    let mis = attrData.Get_Missing_Value_DataArray(LayerNum, dt);
                    for (let j = 0; j < n; j++) {
                        if (mis[j] == false) {
                            sumv[j] += v[j];
                            sumf[j] = true;
                        }
                    }
                }
                for (let i = 0; i < n; i++) {
                    if (sumf[i] == true) {
                        Data_Val_STR[i] = String(sumv[i] + plusVal);
                    } else {
                        Data_Val_STR[i] = "";
                        MisF = true;
                    }
                }
                if (plusVal != 0) {
                    Title += "＋" + String(plusVal);
                }
                Title += "（和）";
                note = "各データ項目の和";
                break;
            }
            case 1: {
                let dt1 = cboDif1.selectedIndex;
                let dt2 = cboDif2.selectedIndex - 1;
                if ((dt1 == -1) || (dt2 == -2)) {
                    Generic.alert(undefined, "データ項目を選択して下さい。");
                    return;
                }
                let inputValue = Number(txtMinusInput.value);
                if (dt2 == -1) {
                    if (inputValue == 0) {
                        Generic.alert(undefined, "数値を入力して下さい。");
                        return;
                    }
                }
                let v1 = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, dt1);
                let mis1 = attrData.Get_Missing_Value_DataArray(LayerNum, dt1);
                let retV = setDataArray(LayerNum, dt2, inputValue);
                let v2 = retV.dataArray;
                let mis2 = retV.misArray;
                for (let i = 0; i < n; i++) {
                    if ((mis1[i] == true) || (mis2[i] == true)) {
                        Data_Val_STR[i] = "";
                        MisF = true;
                    } else {
                        Data_Val_STR[i] = String(v1[i] - v2[i]);
                    }
                }
                Title = attrData.Get_DataTitle(LayerNum, dt1, false) + "－";
                Unit = attrData.Get_DataUnit(LayerNum, dt1);
                note = attrData.Get_DataTitle(LayerNum, dt1, false) + "から";
                if (dt2 != -1) {
                    Title += attrData.Get_DataTitle(LayerNum, dt2, false) + "(差)";
                    if (attrData.Get_DataUnit(LayerNum, dt1) != attrData.Get_DataUnit(LayerNum, dt2)) {
                        Unit = "";
                    }
                    note += attrData.Get_DataTitle(LayerNum, dt2, false) + "を引いた値。";
                } else {
                    Title += inputValue.toString() + "(差)";
                    note += inputValue.toString() + "を引いた値。";
                }

                break;
            }
            case 2: {
                let dt1 = cboMulti1.selectedIndex;
                let dt2 = cboMulti2.selectedIndex - 1;
                if ((dt1 == -1) || (dt2 == -2)) {
                    Generic.alert(undefined, "データ項目を選択して下さい。");
                    return;
                }
                let inputValue = Number(txtMultiInput.value);
                if (dt2 == -1) {
                    if (inputValue == 0) {
                        Generic.alert(undefined, "数値を入力して下さい。");
                        return;
                    }
                }
                let v1 = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, dt1);
                let mis1 = attrData.Get_Missing_Value_DataArray(LayerNum, dt1);
                let retV = setDataArray(LayerNum, dt2, inputValue);;
                let v2 = retV.dataArray;
                let mis2 = retV.misArray;

                for (let i = 0; i < n; i++) {
                    if ((mis1[i] == true) || (mis2[i] == true)) {
                        Data_Val_STR[i] = "";
                        MisF = true;
                    } else {
                        Data_Val_STR[i] = String(v1[i] * v2[i]);
                    }
                }
                Title = attrData.Get_DataTitle(LayerNum, dt1, false) + "×";
                Unit = attrData.Get_DataUnit(LayerNum, dt1);
                note = attrData.Get_DataTitle(LayerNum, dt1, false) + "に";
                if (dt2 != -1) {
                    Title += attrData.Get_DataTitle(LayerNum, dt2, false) + "(積)";
                    if (attrData.Get_DataUnit(LayerNum, dt1) != attrData.Get_DataUnit(LayerNum, dt2)) {
                        Unit = "";
                    }
                    note += attrData.Get_DataTitle(LayerNum, dt2, false) + "をかけた値。";
                } else {
                    Title += inputValue.toString() + "(差)";
                    note += inputValue.toString() + "をかけた値。";
                }
                break;
            }
            case 5: {
                let dt = cboDensityData.selectedIndex;
                if (dt == -1) {
                    Generic.alert(undefined, "データ項目を選択して下さい。");
                    return;
                }
                let v = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, dt);
                let mis = attrData.Get_Missing_Value_DataArray(LayerNum, dt);
                for (let i = 0; i < n; i++) {
                    let area = attrData.GetObjMenseki(LayerNum, i)
                    if ((area == 0) || (mis[i] == true)) {
                        Data_Val_STR[i] = "";
                        MisF = true;
                    } else {
                        let dv = v[i] / area;
                        Data_Val_STR[i] ==String(Number(Generic.Figure_Using(dv, attrData.LayerData[LayerNum].atrData.Data[dt].Statistics.AfterDecimalNum + 1)));
                    }
                }
                Title = attrData.Get_DataTitle(LayerNum, dt, false) + "（密度）";
                Unit = attrData.Get_DataUnit(LayerNum, dt) + "/" + Generic.getScaleUnitAreaStrings(enmScaleUnit.kilometer);
                note = attrData.Get_DataTitle(LayerNum, dt, false) + "を面積で除した値。";
                break;
            }
            case 3: {
                let dt1 = cbonumeratorData.selectedIndex - 1;
                let dt2 = cboDenominatorData.selectedIndex - 1;
                if ((dt1 == -2) || (dt2 == -2)) {
                    Generic.alert(undefined, "データ項目を選択して下さい。");
                    return;
                }
                if ((dt1 == -1) && (dt2 == -1)) {
                    Generic.alert(undefined, "数値同士ではできません。");
                    return;
                }
                let inputValue1 = Number(txtnumeratorData.value);
                let inputValue2 = Number(txtDenominatorDataBox.value);

                if (((dt1 == -1) && (inputValue1 == 0)) || ((dt2 == -1) && (inputValue2 == 0))) {
                    Generic.alert(undefined, "数値を設定して下さい");
                    return;
                }

                let retV = setDataArray(LayerNum, dt1, inputValue1);
                let v1 = retV.dataArray;
                let mis1 = retV.misArray;
                let retV2 = setDataArray(LayerNum, dt2, inputValue2);
                let v2 = retV2.dataArray;
                let mis2 = retV2.misArray;

                let per = chkPercent.checked;
                let keta;
                let ad = attrData.LayerData[LayerNum].atrData;
                let dt1AfterDecimalNum;
                let dt2AfterDecimalNum;
                let dt1BeforeDecimalNum;
                let dt2BeforeDecimalNum;
                if (dt1 != -1) {
                    dt1AfterDecimalNum = ad.Data[dt1].Statistics.AfterDecimalNum;
                    dt1BeforeDecimalNum = ad.Data[dt1].Statistics.BeforeDecimalNum;
                } else {
                    let deci = Generic.Figure_Arrange(inputValue1);
                    dt1BeforeDecimalNum = deci.BeforeDecimal;
                    dt1AfterDecimalNum = deci.AfterDecimal;
                }
                if (dt2 != -1) {
                    dt2AfterDecimalNum = ad.Data[dt2].Statistics.AfterDecimalNum;
                    dt2BeforeDecimalNum = ad.Data[dt2].Statistics.BeforeDecimalNum;
                } else {
                    let deci = Generic.Figure_Arrange(inputValue2);
                    dt2BeforeDecimalNum = deci.BeforeDecimal;
                    dt2AfterDecimalNum = deci.AfterDecimal;
                }
                keta = Math.max(dt1AfterDecimalNum, dt2AfterDecimalNum) + 1;
                keta = Math.max(keta, dt1BeforeDecimalNum);
                keta = Math.max(keta, dt2BeforeDecimalNum);
                
                for (let i = 0; i < n; i++) {
                    let keta2 = keta
                    if ((mis1[i] == true) || (mis2[i] == true) || (v2[i] == 0)) {
                        Data_Val_STR[i] = "";
                        MisF = true;
                    } else {
                        let dv = v1[i] / v2[i];
                        if (per == true) {
                            dv *= 100;
                        }
                        if ((Math.abs(dv) < 1) && (v1[i] != 0)) {
                            //1未満の場合は，0が続かなくなった箇所から桁数を数える
                            let vv = Math.abs(dv);
                            let nketa = 1;
                            do {
                                vv = vv * 10;
                                nketa++;
                            } while (vv < 1);
                            keta2 += nketa - 1;
                        }
                        Data_Val_STR[i] =String(Number(Generic.Figure_Using(dv, keta2)));
                    }
                }
                Unit = "";
                if (chkPercent.checked == true) {
                    Unit = "％";
                }

                if (dt1 != -1) {
                    Title = attrData.Get_DataTitle(LayerNum, dt1, false) + "÷";
                    note += attrData.Get_DataTitle(LayerNum, dt1, false) + "を";
                } else {
                    Title += inputValue1.toString() + "÷";
                    note += inputValue1.toString() + "を";
                }

                if (dt2 != -1) {
                    Title += attrData.Get_DataTitle(LayerNum, dt2, false);
                    note += attrData.Get_DataTitle(LayerNum, dt2, false) + "で除した値。";
                } else {
                    Title += inputValue2.toString();
                    note += inputValue2.toString() + "で除した値。";
                }
                break;
            }
            case 4: {
                let dt1 = cboStartData.selectedIndex;
                let dt2 = cboEndData.selectedIndex;
                if ((dt1 == -1) || (dt2 == -1)) {
                    Generic.alert(undefined, "データ項目を選択して下さい。");
                    return;
                }
                let v1 = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, dt1);
                let mis1 = attrData.Get_Missing_Value_DataArray(LayerNum, dt1);
                let v2 = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, dt2);
                let mis2 = attrData.Get_Missing_Value_DataArray(LayerNum, dt2);
                for (let i = 0; i < n; i++) {
                    if ((mis1[i] == true) || (mis2[i] == true) || (v1[i] == 0)) {
                        Data_Val_STR[i] = "";
                        MisF = true;
                    } else {
                        let dv = (v2[i] - v1[i]) / v1[i] * 100;
                        Data_Val_STR[i] = String(Number(Generic.Figure_Using(dv, 3)));
                    }
                }
                Title = "増減率(" + attrData.Get_DataTitle(LayerNum, dt1, false) + "～" + attrData.Get_DataTitle(LayerNum, dt2, false) + ")";
                Unit = "％";
                note = attrData.Get_DataTitle(LayerNum, dt1, false) + "から" + attrData.Get_DataTitle(LayerNum, dt2, false) + "までの増減率。";
            }
        }
        Generic.clear_backDiv();
        frmTitleSettingsAddingData(Title, Unit, note, true, "計算後の新しいデータ項目",
            function (retV) {
                attrData.Add_One_Data_Value(LayerNum, retV.title, retV.unit, retV.note, Data_Val_STR, MisF);
                okEvent(e);
            }
        )

        /** 計算するデータを配列に設定*/
        function setDataArray(LayerNum, data, inputValue) {
            let dataArray = [];
            let misArray = [];
            if (data != -1) {
                dataArray = attrData.Get_Data_Cell_Array_With_MissingValue(LayerNum, data);
                misArray = attrData.Get_Missing_Value_DataArray(LayerNum, data);
            } else {
                let objn = attrData.LayerData[LayerNum].atrObject.ObjectNum;
                dataArray = new Array(objn);
                misArray = new Array(objn);
                dataArray.fill(inputValue);
                misArray.fill(false);
            }
            return { dataArray: dataArray, misArray: misArray };
        }
    }
}

/**距離測定 */
function frmMain_GetDistance(okEvent){
    let DisType = {
        Point : 0,
        LayerObject : 1,
        LayerDummy : 2,
        MapObject : 3
    }
    let pos_info=function () {
        this.xy =new point();
        this.type ;// DisType
        this.lay ;// Integer
        this.objpos ;//  Integer
        this.MapFile ;//  String
        this.Time ;//  strYMD
    }
    let LayerNum=attrData.TotalData.LV1.SelectedLayer;
    const backDiv = Generic.set_backDiv("", "距離測定", 450, 310, true, true, buttonOK, 0.2, true);
    Generic.createNewSpan(backDiv,"距離の取得元","","",15,40,"",undefined);
    let lbList= new ListBox(backDiv, "", [], 15, 65, 175, 135,undefined, "");
    Generic.createNewSpan(backDiv,"距離の取得元","","",15,40,"",undefined);
    Generic.createNewButton(backDiv, "消去", "", 15, 205, function () {
        let n=lbList.selectedIndex;
        if(n!=-1){
            lbList.removeList(n, 1);
        }
    },"")
    Generic.createNewButton(backDiv, "すべて消去", "", 75, 205, function (e) {
        lbList.removeAll();
    },"")
    const btnLlatlon=Generic.createNewButton(backDiv, "緯度経度で指定", "", 15, 235, 
    function (e) {
        frmLatLonInput(new latlon(0,0), true, function (lp) {
            let s=Generic.Get_LatLon_Strings(lp, true);
            let tx=s.x + "/" + s.y;
            let posd =new  pos_info();
            posd.xy = lp.toPoint();
            posd.type = DisType.Point;
            lbList.addList([{text:tx,value:posd}],lbList.length);
        })
    },"")
    btnLlatlon.disabled  = (attrData.TotalData.ViewStyle.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido);
    Generic.createNewButton(backDiv, "レイヤ内オブジェクトから追加", "", 15, 260, function () {
        frmMain_LayeObjectSelect(true,LayerNum,undefined,function(Lay,DummyF,sel){
            let pos=[];
            for(let i in sel){
                let tx  = "";
                let posd = new pos_info();
                if (Lay != LayerNum) {
                    tx = attrData.LayerData[Lay].Name + ":"
                }
                if (DummyF == false) {
                    tx += attrData.Get_KenObjName(Lay, sel[i]);
                    posd.type = DisType.LayerObject;
                    posd.lay = Lay;
                    posd.objpos = sel[i];
                } else {
                    let ld = attrData.LayerData[Lay].Dummy[sel[i]];
                    tx += ld.Name;
                    posd.type = DisType.LayerDummy;
                    posd.lay = Lay;
                    posd.objpos = ld.code;
                }
                pos.push({text:tx,value:posd});
            }
            lbList.addList(pos,lbList.length);
        });
    },"")

    const gbDistance = Generic.createNewFrame(backDiv, "", "", 215, 40, 200, 165, "距離取得方法");
    const rbDisGet = [{ value: 0, text: "取得元からの距離のうち、最も近い距離を取得" },
            { value: 1, text: "取得元それぞれとの距離を取得" }];
    Generic.createNewRadioButtonList(gbDistance, "rbDisGet", rbDisGet, 10, 30, 150, 50, 0,undefined);
    const scaleList = Generic.getScaleUnit_for_select();
    const atv=attrData.TotalData.ViewStyle.MapScale;
    let scaleUnit=Generic.createNewWordSelect(gbDistance,"取得単位",scaleList,atv.Unit,"",15,120,60,60,0,undefined,"","",false);

    function buttonOK(e) {
        let n = lbList.length;
        if (n == 0) {
            Generic.alert(new point(e.clientX, e.clientY), "距離の取得元がありません。");
            return;
        }
        let objn = attrData.LayerData[LayerNum].atrObject.ObjectNum;
        let dis = Generic.Array2Dimension(n, objn);
        let allD=0;
        let pos = lbList.getAllValue();
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < objn; j++) {
                let d;
                switch (pos[i].type) {
                    case DisType.Point: {
                        let P = spatial.Get_Converted_XY(pos[i].xy, attrData.TotalData.ViewStyle.Zahyo);
                        d = attrData.Distance_Kencode_Point(LayerNum, j, P);
                        break;
                    }
                    case DisType.LayerObject: {
                        d = attrData.Distance_Kencode_Object(j, pos[i].objpos, LayerNum, pos[i].lay);
                        break;
                    }
                    case DisType.LayerDummy: {
                        let L = attrData.LayerData[LayerNum];
                        if((L.Type==enmLayerType.DefPoint)||(L.Type==enmLayerType.Mesh)){
                            d = L.MapFileData.Distance_ObjectCenterP(L.atrObject.atrObjectData[j].CenterPoint, pos[i].objpos, L.Time);
                        }else{
                            d = L.MapFileData.Distance_Object(attrData.Get_KenObjCode(LayerNum, j), pos[i].objpos, L.Time, L.Time);
                        }
                        break;
                    }
                    case DisType.MapObject: {
                        d = attrData.Distance_Kencode_MPObject(LayerNum, j, pos[i].MapFile, pos[i].objpos, pos[i].Time);
                        break;
                    }
                }
                dis[i][j] = d;
                allD += d;
            }
        }
        let Unit = scaleUnit.getValue();
        let ScaleRatio = Generic.Convert_ScaleUnit(enmScaleUnit.kilometer, Unit);
        let lbText = lbList.getAllText();
        let rv = Generic.getRadioCheckByValue("rbDisGet");
        switch (rv) {
            case 0: {
                //最小距離取得
                let tx = "最も近い距離";
                let unt = Generic.getScaleUnitStrings(undefined,Unit);
                let Note = "距離測定機能で作成";
                frmTitleSettingsAddingData(tx, unt, Note, false, "最も近い地点との距離のデータ項目名",
                    function (retV) {
                        tx = retV.title;
                        unt = retV.unit;
                        Note = retV.note;
                        let Min_Dis = [];
                        let Min_Dis_ObjName = [];
                        for (let i = 0; i < objn; i++) {
                            Min_Dis[i] = allD;
                            Min_Dis_ObjName[i] = "";
                            for (let j = 0; j < n; j++) {
                                if ((LayerNum == pos[j].lay) && (i == pos[j].objpos)&&(pos[j].type==DisType.LayerObject)) {
                                }else{
                                    //同一オブジェクトでなければ
                                    if (Min_Dis[i] > dis[j][i]) {
                                        Min_Dis[i] = dis[j][i];
                                        Min_Dis_ObjName[i] = lbText[j];
                                    } else if (Min_Dis[i] == dis[j][i]) {
                                        Min_Dis_ObjName[i] += "/" & lbText[j];
                                    }
                                }
                            }
                        }

                        attrData.Add_One_Data_Value(LayerNum, "最も近い地点／オブジェクト", "CAT", "距離測定機能で作成", Min_Dis_ObjName, false);
                        let Data_Val_STR = [];
                        for (let i = 0; i < objn; i++) {
                            Data_Val_STR[i] = Number((Min_Dis[i] * ScaleRatio).toFixed(6));
                        }                        
                        attrData.Add_One_Data_Value(LayerNum, tx, unt, Note, Data_Val_STR, false);
                        Generic.clear_backDiv();
                        okEvent(e);
                    }
                );
                break;
            }
            case 1: {
                //全ての距離取得
                for (let j = 0; j < n; j++) {
                    let Data_Val_STR = [];
                    for (let i = 0; i < objn; i++) {
                        Data_Val_STR[i] = Number((dis[j][i] * ScaleRatio).toFixed(6));
                    }
                    attrData.Add_One_Data_Value(LayerNum, lbText[j] + "との距離", Generic.getScaleUnitStrings(undefined,Unit), "距離測定機能で作成", Data_Val_STR, false);
                }
                Generic.clear_backDiv();
                okEvent(e);
                break;
            }
        }
    }
}
/**レイヤ内オブジェクト選択（一つ）defDummyF:初期値がダミーオブジェクトを表示 */
function frmMain_LayeObjectSelectOne(Dummy_Select_EnableF,DefLayerNum, DefSelectObjectNumber,defDummyF, okEvent) {
    const backDiv = Generic.set_backDiv("", "レイヤ内オブジェクト選択", 230, 170, true, true, buttonOK, 0.2, true);
    let selectLayer = Generic.createNewWordSelect(backDiv, "レイヤ", undefined, DefLayerNum, "", 15, 40, 40, 150, 0, changeLayer, "");
    attrData.Set_LayerName_to(selectLayer, DefLayerNum, true, true, true, true);

    let lstObject = Generic.createNewSelect(backDiv, [], -1, "", 15, 70, false, undefined, "width:200px;", 1, false);

    let chkDumyObjectSelect = Generic.createNewCheckBox(backDiv, "ダミーオブジェクト選択", "", (defDummyF & Dummy_Select_EnableF), 15, 105, undefined, changeLayer, "");
 
    changeLayer(DefSelectObjectNumber);

    function changeLayer(v) {
        v=(v==undefined)?0:v;
        let L = selectLayer.selectedIndex;
        if(chkDumyObjectSelect.checked==true){
            attrData.Set_DummyObjectName_to_selectBox(lstObject,L,v);
        }else{
            attrData.Set_ObjectName_to_selectBox(lstObject,L,v);
        }
    }
    function buttonOK() {
        let L = selectLayer.selectedIndex;
        let Dummy_SelectF = chkDumyObjectSelect.checked;
        let selObj = lstObject.selectedIndex;
        if(selObj==-1){
            Generic.alert(undefined,"オブジェクトが選択されていません。");
            return;
        }
        Generic.clear_backDiv();
        okEvent(L,selObj, Dummy_SelectF);
    }

}


/**レイヤ内オブジェクト選択（複数） */
function frmMain_LayeObjectSelect(Dummy_Select_EnableF, DefLayerNum, DefSelectObjectNumber, okEvent) {
    const backDiv = Generic.set_backDiv("", "レイヤ内オブジェクト選択", 270, 300, true, true, buttonOK, 0.2, true);
    let selectLayer = Generic.createNewWordSelect(backDiv, "レイヤ", undefined, DefLayerNum, "", 15, 40, 40, 200, 0, changeLayer, "");
    attrData.Set_LayerName_to(selectLayer, attrData.TotalData.LV1.SelectedLayer);
    let lbObject = new CheckedListBox(backDiv, "", [], 15, 65, 240, 170, false, undefined, "");
    let chkDumyObjectSelect = Generic.createNewCheckBox(backDiv, "ダミーオブジェクト選択", "", false, 15, 240, undefined, changeLayer, "");
    attrData.Set_ObjectName_to_checkedListBox(lbObject, DefLayerNum, DefSelectObjectNumber);

    chkDumyObjectSelect.disabled=!Dummy_Select_EnableF;

    function changeLayer() {
        let L = selectLayer.selectedIndex;
        if (chkDumyObjectSelect.checked == true) {
            attrData.Set_DummyObjectName_to_checkedListBox(lbObject, L, undefined);
        } else {
            attrData.Set_ObjectName_to_checkedListBox(lbObject, L, undefined);
        }
    }
    function buttonOK() {
        let L = selectLayer.selectedIndex;
        let Dummy_SelectF = chkDumyObjectSelect.checked;
        let checkv = lbObject.getChecked().checkedArray;
        Generic.clear_backDiv();
        okEvent(L, Dummy_SelectF, checkv);
    }
}

/**追加データ項目のタイトル設定 */
function frmTitleSettingsAddingData(TTL, UNT, Note, CancefFlag, LabelStr, okEvent) {
    const backDiv = Generic.set_backDiv("", "追加データ項目のタイトル設定", 395, 210, true, CancefFlag, buttonOK, 0.2, true);
    Generic.createNewDiv(backDiv, LabelStr, "", "", 15, 40, 320, 30, "", undefined);
    let ttlBox = Generic.createNewWordTextInput(backDiv, "タイトル", "", TTL, "", 15, 70, 50, 250, undefined, "");
    let unitBox = Generic.createNewWordTextInput(backDiv, "単位", "", UNT, "", 15, 100, 50, 250, undefined, "");
    let noteBox = Generic.createNewWordTextInput(backDiv, "注", "", Note, "", 15, 130, 50, 250, undefined, "");
    if ((UNT.toUpperCase() == "CAT") || (UNT.toUpperCase() == "STR")) {
        ttlBox.disabled = true;
    }
    function buttonOK(e) {
        let retV = { title: ttlBox.value, unit: unitBox.value, note: noteBox.value };
        if (retV.title == "") {
            Generic.alert(new point(e.clientX, e.clientY), "タイトルを設定してください。");
            return;
        }
        Generic.clear_backDiv();
        okEvent(retV);
    }
}

/**空間検索 */
function frmMain_Buffer(okEvent){
    var normal_data = function () {
        this.add = 0;
        this.add2 = 0;
        this.max = 0;
        this.min = 0;
    }
    var category_data = function () {
        this.CateCount = [];
    }
    var bufMode = {
        Distance: 0,
        ObjectInPolygon : 1,
        ParentObject: 2
    }
    var registMode = {
        average: 0,
        sum: 1,
        standard: 2,
        max:3,
        min:4
    }
    const LayerNum = attrData.TotalData.LV1.SelectedLayer;
    const backDiv = Generic.set_backDiv("", "空間検索", 525, 420, true, true, buttonOK, 0.2, true);
    const gbLayerMethod = Generic.createNewFrame(backDiv, "", "", 15, 40, 230, 320, "対象レイヤと方法");
    const cboHandledLayer = Generic.createNewWordSelect(gbLayerMethod, "検索対象レイヤ", undefined, -1, "", 10, 20, 100, 150, 1, setDataList, "", "");
    attrData.Set_LayerName_to(cboHandledLayer, LayerNum, true, false, true, true);
    const gbMethod = Generic.createNewFrame(gbLayerMethod, "", "", 10, 70, 210, 180, "方法");
    const rbSearchMethod = [{ value: bufMode.ObjectInPolygon, text: "面領域内部のオブジェクトを検索する" },
    { value: bufMode.ParentObject, text: "元レイヤのオブジェクトを含むオブジェクトを検索する" },
    { value: bufMode.Distance, text: "バッファ距離を設定して内部のオブジェクトを検索する" }];
    Generic.createNewRadioButtonList(gbMethod, "rbSearchMethod", rbSearchMethod, 10, 20, 150, 40, bufMode.ObjectInPolygon,
        function (v) {
            chkObjectCount.disabled = (v == bufMode.ParentObject);
            chkObjNameOut.disabled = (v == bufMode.ParentObject);
            registDiv.setVisibility((v != bufMode.ParentObject));
    });
    let txtBuffer = Generic.createNewWordNumberInput(gbMethod, "バッファ距離", "", "", "", 40, 130, undefined, 100, 
        function(){Generic.checkRadioByValue("rbSearchMethod",bufMode.Distance);
        chkObjectCount.disabled = false;
        chkObjNameOut.disabled = false;
        registDiv.setVisibility(true);
     },"");
    const scaleList = Generic.getScaleUnit_for_select();
    const atv = attrData.TotalData.ViewStyle.MapScale;
    let scaleUnit = Generic.createNewWordSelect(gbMethod, "取得単位", scaleList, atv.Unit, "", 80, 155, 55, 60, 0, undefined, "", "", false);
    const chkConditionUse = Generic.createNewCheckBox(gbLayerMethod, "表示オブジェクト限定・属性検索の条件設定を使用する", "", false, 15, 280, 190, undefined, "");

    const gbOutout = Generic.createNewFrame(backDiv, "", "", 255, 40, 250, 320, "出力項目");
    const chkObjectCount = Generic.createNewCheckBox(gbOutout, "含まれるオブジェクト数のカウント", "", false, 15, 20, 200, undefined, "");
    const chkObjNameOut = Generic.createNewCheckBox(gbOutout, "含まれるオブジェクト名", "", false, 15, 50, undefined, undefined, "");
    const chkObjectData = Generic.createNewCheckBox(gbOutout, "含まれるオブジェクトの属性データ集計", "", false, 15, 80, undefined, undefined, "");
    Generic.createNewSpan(gbOutout, "集計データ項目", "", "", 50, 105, "", undefined);
    const selectDataItem = new CheckedListBox(gbOutout, "", [], 50, 125, 180, 120, false, function () {
        chkObjectData.checked = true;
    });
    const registDiv=Generic.createNewDiv(gbOutout,"","","",50,260,200,60,"",undefined);
    const regModeLst = [{ value: registMode.average, text: "平均値" }, { value: registMode.sum, text: "合計値" }, { value: registMode.standard, text: "標準偏差" },
        { value: registMode.max, text: "最大値" }, { value: registMode.min, text: "最小値" }];
    const cboRegistMode = Generic.createNewWordSelect(registDiv, "集計方法",regModeLst, 0, "", 0, 0, 60, 100, 0, undefined, "", "", false);
    Generic.createNewSpan(registDiv, "カテゴリーデータの場合は、カテゴリーごとに数がカウントされます", "", "", 0, 25, "width:180px", undefined);

    const disE = attrData.LayerData[LayerNum].MapFileData.Map.Detail.DistanceMeasurable;
    Generic.enableRadioByValue("rbSearchMethod", bufMode.Distance, disE);
    Generic.setDisabled(txtBuffer, disE);
    if (attrData.LayerData[LayerNum].Shape == enmShape.PolygonShape) {
        Generic.enableRadioByValue("rbSearchMethod", bufMode.ObjectInPolygon, true);
        Generic.checkRadioByValue("rbSearchMethod", bufMode.ObjectInPolygon);
    } else {
        Generic.enableRadioByValue("rbSearchMethod", bufMode.ObjectInPolygon, false);
        if (disE == true) {
            Generic.checkRadioByValue("rbSearchMethod", bufMode.Distance);
        } else {
            Generic.alert(undefined, "レイヤで使用する地図データに、距離の計測ができない設定がしてあります。");
            Generic.deletediv();
            return;
        }
        Generic.checkRadioByValue("rbSearchMethod", bufMode.ObjectInPolygon);
    }

    setDataList();

    function setDataList(){
        let L=cboHandledLayer.selectedIndex;
        let n=Generic.getRadioCheckByValue("rbSearchMethod");
        attrData.Set_DataTitle_to_CheckedListBox(selectDataItem, L, false, true, true, true, (n==bufMode.ParentObject));
    }

    function checkError(e) {
        let ef = false;
        let efm = "";
        let L2 = cboHandledLayer.selectedIndex;
        let rd = Generic.getRadioCheckByValue("rbSearchMethod");
        if ((rd == bufMode.Distance) || (rd == bufMode.ObjectInPolygon)) {
            if ((chkObjNameOut.checked == false) && (chkObjectCount.checked == false) && (chkObjectData.checked == false)){
                efm += "出力項目を指定してください。\n";
                ef = true;
            }
        }
        let Dis = Number(txtBuffer.value);
        if ((Dis <= 0) && (rd == bufMode.Distance)) {
            efm += "バッファ距離を指定してください。\n";
            ef = true
        }
        if (chkObjectData.checked == true) {
            if (selectDataItem.getChecked().checkedArray.length == 0) {
                efm += "集計データ項目が選択されていません。\n";
                ef = true
            }
        }
        if ((rd == bufMode.ParentObject) && (attrData.LayerData[L2].Shape != enmShape.PolygonShape)) {
            efm += "検索対象レイヤは面形状のものを指定してください。\n";
            ef = true;
        }
        if (ef == true) {
            Generic.alert(new point(e.clientX, e.clientY), efm);
        }  
        return ef;
    }

    function buttonOK(e) {
        if (checkError(e) == false) {
            if (Buffering() == true) {
                okEvent(e);
            }
        }
    }
    function Buffering(){

        let L1  = LayerNum;
        let L2  = cboHandledLayer.selectedIndex;
        let ObjnL1  = attrData.Get_ObjectNum(L1);
        let ObjnL2  = attrData.Get_ObjectNum(L2);
        let Buf2_Obj_Str=[];

        let BufferMode =Generic.getRadioCheckByValue("rbSearchMethod");
        let F_ObjectCount; 
        let ObjCount_STR=[];
        let ObjName_STR=[];
        if((chkObjectCount.checked == true)&&(chkObjectCount.disabled == false) ){
            F_ObjectCount = true;
        }else{
            F_ObjectCount = false;
        }
        let F_objNameOut ;
        if((chkObjNameOut.checked == true)&&(chkObjNameOut.disabled == false )){
            F_objNameOut = true;
        }else{
            F_objNameOut = false;
        }

        let Rdn ;
        let F_ObjectData ;
        let RegistMode;
        let AggData =[];
        let Inner_Object_Num=[];
        let Shukei_V;
        let Add_Data=[];
        if(chkObjectData.checked == true ){
            RegistMode=cboRegistMode.getValue();
            F_ObjectData = true;
            Add_Data=selectDataItem.getChecked().checkedArray;
            Rdn = Add_Data.length;
            let PlusDataNum  = 0;
            for(let i=0 ;i<  Rdn ;i++){
                if((attrData.Get_DataType(L2, Add_Data[i]) == enmAttDataType.Category)&&((BufferMode == bufMode.Distance)||(BufferMode == bufMode.ObjectInPolygon)) ){
                    let pn  = attrData.Get_DivNum(L2, Add_Data[i]);
                    PlusDataNum += pn + 1;
                }else{
                     PlusDataNum ++;
                }
            }
            Shukei_V=Generic.Array2Dimension( PlusDataNum , ObjnL1 );
        }else{
            F_ObjectData = false;
        }

        //----main
        let bufUnit  = scaleUnit.getValue();
        let ScaleRatio  = Generic.Convert_ScaleUnit(enmScaleUnit.kilometer, bufUnit);
        let Dis  = Number(txtBuffer.value);
        let chkConF  = chkConditionUse.checked;

        for (let i = 0; i < ObjnL1; i++) {  //現在のレイヤのオブジェクトの数
            let BFN = 0
            let InObjNameList = [];
            if (F_ObjectData == true) {
                AggData = [];
                for (let k = 0; k < Rdn; k++) {
                    let dt=Add_Data[k];
                    if ((attrData.Get_DataType(L2, dt) == enmAttDataType.Category) && ((BufferMode == bufMode.Distance) || (BufferMode == bufMode.ObjectInPolygon))) {
                        let cdata = new category_data();
                        let pn = attrData.Get_DivNum(L2, dt);
                        cdata.CateCount.length = pn;
                        cdata.CateCount.fill(0);
                        AggData.push(cdata);
                    } else {
                        let ndata = new normal_data();
                        ndata.max = attrData.LayerData[L2].atrData.Data[dt].Statistics.Min;
                        ndata.min = attrData.LayerData[L2].atrData.Data[dt].Statistics.Max;;
                        AggData.push(ndata);
                    }
                    Inner_Object_Num[k] = 0;
                }
            }

            let CP;
            if (BufferMode ==bufMode.ParentObject ) {
                CP = attrData.Get_CenterP(L1, i);
            }
            for (let j = 0; j < ObjnL2; j++) {//検索対象レイヤのオブジェクトの数
                let concheck = true;
                if (chkConF == true) {
                    concheck = attrData.Check_Condition(L2, j)
                }
                if (concheck == true) {
                    let f;
                    switch (BufferMode) {
                        case bufMode.Distance: {
                            //オブジェクト間の距離測定
                            let D = attrData.Distance_Kencode_Object(i, j, L1, L2);
                            if (D <= Dis / ScaleRatio) {
                                f = true;
                            } else {
                                f = false;
                            }
                            break;
                        }
                        case bufMode.ObjectInPolygon: {
                            //オブジェクトの内外判定
                            let OP = attrData.Get_CenterP(L2, j);
                            f = attrData.Check_Point_in_Kencode_OneObject(L1, i, OP);
                            break;
                        }
                        case bufMode.ParentObject: {
                            f = attrData.Check_Point_in_Kencode_OneObject(L2, j, CP);
                            break;
                        }
                    }
                    if (f == true) {
                        switch (BufferMode) {
                            case bufMode.Distance:
                            case bufMode.ObjectInPolygon: {
                                //バッファ距離を設定して内部のオブジェクトを探索する
                                //面領域内部のオブジェクトを探索する
                                BFN++;
                                if (F_objNameOut == true) {
                                    InObjNameList.push(attrData.Get_KenObjName(L2, j));
                                }
                                if (F_ObjectData == true) {
                                    //データの集計
                                    for (let k = 0; k < Rdn; k++) {
                                        if (attrData.Get_DataType(L2, Add_Data[k]) == enmAttDataType.Category) {
                                            let ct = attrData.Get_Categoly(L2, Add_Data[k], j)
                                            let cdata = AggData[k];
                                            if (ct != -1) {
                                                cdata.CateCount[ct]++;
                                            } else {
                                                cdata.CateCount[cdata.CateCount.length - 1]++;
                                            }
                                        } else {
                                            if (attrData.Check_Missing_Value(L2, Add_Data[k], j) == false) {
                                                let V = Number(attrData.Get_Data_Value(L2, Add_Data[k], j, ""));
                                                let nd = AggData[k];
                                                nd.add += V;
                                                nd.add2 += V ** 2;
                                                if (V < nd.min) {
                                                    nd.min = V;
                                                }
                                                if (nd.max < V) {
                                                    nd.max = V;
                                                }
                                                Inner_Object_Num[k]++;
                                            }
                                        }
                                    }
                                }
                                break;
                            }
                            case bufMode.ParentObject: {
                                //元レイヤのオブジェクトを含むオブジェクトを検索する
                                Buf2_Obj_Str[i] = attrData.Get_KenObjName(L2, j);
                                if (F_ObjectData == true) {
                                    //データの集計
                                    for (let k = 0; k < Rdn; k++) {
                                        Shukei_V[k][i] = attrData.Get_Data_Value(L2, Add_Data[k], j, "");
                                    }
                                }
                                j = ObjnL2;
                                break;
                            }
                        }
                    }
                }
            }
            if(F_objNameOut == true ){
                ObjName_STR[i] =InObjNameList.join('/');
            }

            if(F_ObjectCount == true ){
                ObjCount_STR[i] = BFN.toString();
            }

            if((F_ObjectData == true)&&((BufferMode == bufMode.Distance)||(BufferMode == bufMode.ObjectInPolygon)) ){
                //含まれるオブジェクトの属性データ集計
                let n  = 0;
                for(let k  = 0  ;k< Rdn ;k++){
                    if(attrData.Get_DataType(L2, Add_Data[k]) == enmAttDataType.Category ){
                        let cdata  = AggData[k];
                        for(let k2  = 0  ;k2< cdata.CateCount.length ;k2++){
                            Shukei_V[n][i]= cdata.CateCount[k2].toString();
                            n ++;
                        }
                    }else{
                        if(Inner_Object_Num[k] == 0 ){
                            //含まれるオブジェクトがない場合は欠損値
                            Shukei_V[n][i] = undefined;
                        }else{
                            let nd =AggData[k];
                            let V ;
                            switch( RegistMode){
                                case registMode.average:
                                    V = nd.add / Inner_Object_Num[k];
                                    break;
                                case registMode.sum:
                                    V = nd.add;
                                    break;
                                case registMode.standard:
                                    V = Math.Sqrt(nd.add2 / Inner_Object_Num[k] - (nd.add / Inner_Object_Num[k]) ** 2);
                                    break;
                                case registMode.max:
                                    V = nd.max;
                                    break;
                                case registMode.min:
                                    V = nd.min;
                                    break;
                            }
                            Shukei_V[n][i] = V.toString();
                        }
                        n ++;
                    }
                }
            }
        }

        //-----
        let Note  = "空間検索機能で作成";
        if ((chkConF == true) && (attrData.Check_Condition_UMU(L2) == true)) {
            Note += "\n" + attrData.Get_Condition_Info(L2);
        }
        if (BufferMode == bufMode.ParentObject) {
            let TTL;
            let UNT;
            TTL = attrData.LayerData[L2].Name + "レイヤに含まれているオブジェクト";
            UNT = "CAT";
            attrData.Add_One_Data_Value(L1, TTL, UNT, Note, Buf2_Obj_Str, true);
        } else {
            let TTL;
            let UNT;
            if (F_ObjectCount == true) {
                if (BufferMode == bufMode.Distance) {
                    TTL = "バッファ" + Dis.toString() + scaleUnit.getText() + "に含まれるオブジェクト数"
                } else {
                    TTL = attrData.LayerData[L2].Name + "のオブジェクト数"
                }
                UNT = ""
                attrData.Add_One_Data_Value(L1, TTL, "", Note, ObjCount_STR, false);
            }
            if (F_objNameOut == true) {
                if (BufferMode == bufMode.Distance) {
                    TTL = "バッファ" + Dis.toString() + scaleUnit.getText() + "に含まれるオブジェクト名";
                } else {
                    TTL = "含まれる" + attrData.LayerData[L2].Name + "のオブジェクト名";
                }
                UNT = "STR"
                attrData.Add_One_Data_Value(L1, TTL, UNT, Note, ObjName_STR, false);
            }
        }

        if (F_ObjectData == true) {
            let TTL;
            let UNT;
            let n = 0;
            for (let i = 0; i < Rdn; i++) {
                let k = Add_Data[i]
                TTL = attrData.LayerData[L2].Name + "：" + attrData.Get_DataTitle(L2, k, false);
                UNT = attrData.Get_DataUnit(L2, k);
                if (BufferMode == bufMode.Distance) {
                    TTL += ":バッファ"+ Dis.toString() + scaleUnit.getText();
                }
                if ((BufferMode == bufMode.Distance) || (BufferMode == bufMode.ObjectInPolygon)) {
                    if (attrData.Get_DataType(L2, k) == enmAttDataType.Category) {
                        let PData = attrData.LayerData[L2].atrData.Data[k];
                        let Class_div = PData.SoloModeViewSettings.Class_Div;
                        let ctn = attrData.Get_DivNum(L2, k);
                        if (attrData.Get_DataMissingNum(L2, k) != 0) {
                            ctn++;
                        }
                        for (let j = 0; j < ctn; j++) {
                            let fu;
                            if ((attrData.Get_DataMissingNum(L2, k) != 0) && (j == ctn - 1)) {
                                fu = "欠損値";
                            } else {
                                fu = Class_div[j].Value;
                            }
                            let TTL2 = TTL + "：" + fu;
                            let Data_Val_STR = [];
                            for (let k2 = 0; k2 < ObjnL1; k2++) {
                                Data_Val_STR.push(Shukei_V[n + j][k2]);
                            }
                            attrData.Add_One_Data_Value(L1, TTL2, "", Note, Data_Val_STR, true);
                        }
                        n += attrData.Get_DivNum(L2, k) + 1;
                    } else {
                        TTL += "：" + cboRegistMode.getText();
                        let Data_Val_STR = [];
                        for (let j = 0; j < ObjnL1; j++) {
                            Data_Val_STR.push(Shukei_V[n][j]);
                        }
                        attrData.Add_One_Data_Value(L1, TTL, UNT, Note, Data_Val_STR, true);
                        if (RegistMode === registMode.average) {
                            attrData.Set_Legend(L1, attrData.LayerData[L1].atrData.Count - 1, attrData.LayerData[L2].atrData.Data[k], true, true, true, true, true, true, true, true, true, false, true);
                        }
                        n++;
                    }
                } else {
                    let Data_Val_STR = [];
                    for (let j = 0; j < ObjnL1; j++) {
                        Data_Val_STR.push(Shukei_V[i][j]);
                    }
                    attrData.Add_One_Data_Value(L1, TTL, UNT, Note, Data_Val_STR, true);
                    attrData.Set_Legend(L1, attrData.LayerData[L1].atrData.Count - 1, attrData.LayerData[L2].atrData.Data[k], true, true, true, true, true, true, true, true, true, false, true)
                }
            }
        }
        return true;
    }
}


/**地図ファイルを開く */
function openMapFile(call) {

    //地図ファイルを開く
    var bbox = Generic.set_backDiv("","地図ファイル選択", 280, 270,false,true,"", 0.2,false);

    Generic.createNewButton(bbox, "MANDARA提供地図ファイル追加", "", 15, 40, addMandaraMapOn, "");

    let getFile = function (file) {   
        //地図ファイル読み込み（ボタン、ドロップ共通）
        Generic.readingIcon("地図ファイル読み込み");
        //readingScreen.open("地図ファイル読み込み");
        Generic.unzipFile(file, unzipOk, unzipError);
        // var reader = new FileReader();
        // reader.readAsText(file, 'utf8');
        function unzipOk(data) {
            //readingScreen.close();
            Generic.clear_backDiv();
            Generic.clear_backDiv();
            let key = Object.keys(data)[0];
            call(JSON.parse(Generic.utf8ArrayToStr(data[key])), file.name);
        }
        function unzipError(err) {
            readingScreen.close();
            //Generic.clear_backDiv();
            Generic.clear_backDiv();
            call(undefined);
        }
    }

    //ファイル選択する場合
    var fileIn = Generic.createNewInput(bbox, "file", "", "", 15, 75, "", "");
    fileIn.accept=".mpfj";
    fileIn.addEventListener("change", function (e) {
        var file = e.target.files[0];
        getFile(file);
    }  , false);

    //ドロップする場合
    var dropZone = Generic.createNewDiv(bbox, "地図ファイルをドロップ", "drop-zone", "", 15, 115, 250, 100, "border:dashed 1px;border-color:#888888;border-radius:4px;");
    dropZone.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, false);
    dropZone.addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // FileList object.
        var file = files[0];
        if (Generic.getExtension(file.name).toLowerCase() != "mpfj") {
            Generic.alert(undefined,"地図ファイルではありません。拡張子mpfjのファイルをドロップしてください。");
        }else{
            getFile(file);
        }
    }, false);

    function addMandaraMapOn(e){
        let popmenu = [{ caption: "JAPAN.mpfj", event: mapRead1 },
        { caption: "日本緯度経度.mpfj", event: mapRead1 },
        { caption: "WORLD.mpfj", event: mapRead1 },
        { caption: "日本市町村緯度経度.mpfj", event: mapRead2 },
        { caption: "日本鉄道緯度経度.mpfj", event: mapRead2 },
        { caption: "WORLD2.mpfj", event: mapRead2 },
        { caption: "日本市町村.mpfj", event: mapRead2 },
        { caption: "USA.mpfj", event: mapRead2 },
        { caption: "CHINA.mpfj", event: mapRead2 }
        ];
        Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
        
        function mapRead1(obj) {
            let fup = obj.caption.toUpperCase();
            Generic.clear_backDiv();
            call(preReadMapFile[fup], fup);
        }
        function mapRead2(obj) {
            let serverFile = "";
            let fup = obj.caption.toUpperCase();
            if (preReadMapFile[fup]) {
                Generic.clear_backDiv();
                call(preReadMapFile[fup], fup);
            } else {
                switch (fup) {
                    case "日本市町村緯度経度.MPFJ":
                        serverFile = "japanadm.mpfj";
                        break;
                    case "日本鉄道緯度経度.MPFJ":
                        serverFile = "japanRail.mpfj";
                        break;
                    case "WORLD2.MPFJ":
                        serverFile = "WORLD2.mpfj";
                        break;
                    case "日本市町村.MPFJ":
                        serverFile = "japanadmOld.mpfj";
                        break;
                    case "USA.MPFJ":
                        serverFile = "USA.mpfj";
                        break;
                    case "CHINA.MPFJ":
                        serverFile = "CHINA.mpfj";
                        break;
                }
                Generic.getMapfileByHttpRequest("https://ktgis.net/mdrjs/map/" + serverFile, function (jsonData) {
                    preReadMapFile[fup] = jsonData;                    
                    Generic.clear_backDiv();
                    call(preReadMapFile[fup], fup);
                });
            }
        }
    }
}

let strFrmCopyObjectName_init_parameter_data = function () {
    this.ObjName=""; //String
    this.Time=clsTime.GetNullYMD();; //strYMD
    this.TimeChangeEnabled=true; //Boolean
    this.pointShapeChecked=true; //Boolean
    this.lineShapeChecked=true; //Boolean
    this.polygonShapeChecked=true; //Boolean
    this.ShapeChangeEnabled=true; //Boolean
    this.ObjectGroupChecked=[]; //Boolean
    this.ObjectGroupEnabled=true; //Boolean
}

/**オブジェクト名コピー */
function frmCopyObjectName(MapData, initParapeter, okEvent, cancelEvent = undefined) {
    let condidateInfo=function(){
        this.ObjCode;
        this.TimeStac;
    }
    const backDiv = Generic.set_backDiv("", "オブジェクト名コピー", 420, 410, false, true, undefined, 0.2, true, true, cancelEvent);
    Generic.createNewSpan(backDiv, "検索するオブジェクト名", "", "", 10, 40, "", undefined);
    const objNameBox = Generic.createNewInput(backDiv, "text", initParapeter.ObjName, "", 20, 60, undefined, "width:160px");
    objNameBox.onkeydown = function (e) {
        if (e.keyCode == 13) {
            change();
        }else if(e.keyCode == 9){
            btnSearch.focus();
            e.preventDefault();
        }
    }
    const gbShape = Generic.createNewFrame(backDiv, "", "", 10, 100, 170, 50, "オブジェクトの形状");
    const cbPointShapeEdit = Generic.createNewCheckBox(gbShape, "点", "", initParapeter.pointShapeChecked, 10, 15, 30, change, "");
    const cbLineShapeEdit = Generic.createNewCheckBox(gbShape, "線", "", initParapeter.lineShapeChecked, 60, 15, 30, change, "");
    const cbPolygonShapeEdit = Generic.createNewCheckBox(gbShape, "面", "", initParapeter.polygonShapeChecked, 110, 15, 30, change, "");
    gbShape.disabled = !initParapeter.ShapeChangeEnabled;
    Generic.createNewSpan(backDiv, "オブジェクトグループ", "", "", 10, 180, "", undefined);
    let lObjGList = [];
    for (let i = 0; i < MapData.Map.OBKNum; i++) {
        lObjGList.push({ text: MapData.ObjectKind[i].Name, checked: initParapeter.ObjectGroupChecked[i] });
    }
    let lstObjGroup=new CheckedListBox(backDiv, "", lObjGList, 20, 200, 160, 110,false, change, "");
    lstObjGroup.disabled=!initParapeter.ObjectGroupEnabled;
    Generic.createNewSpan(backDiv, "時期限定", "", "", 10, 330, "", "");
    const dbdtpTime = Generic.createNewInput(backDiv, "date", initParapeter.Time.toInputDate(), "", 20, 350, "", "width:140px");
    dbdtpTime.disabled = !initParapeter.TimeChangeEnabled;
    let btnSearch=Generic.createNewButton(backDiv, "検索", "", 190, 60, change, "width:50px");
    Generic.createNewSpan(backDiv, "検索結果", "", "", 195, 100, "", "");
    let lbList = new CheckedListBox(backDiv, "", [], 195, 120, 210, 240, false, undefined,"");
    Generic.createNewButton(backDiv, "コピー", "", 220, 375, copy, "width:100px");

    let candidateObject =[];// List(Of condidateInfo)

    function change(){

        let SelF=new Array(MapData.Map.Kend).fill(false); 

        let tx0  = objNameBox.value;
        let tx  = "";
        for (let i = 0; i < tx0.length; i++) {
            switch (tx0.charCodeAt(i)) {
                case 10:
                case 13:
                case 8:
                    break;
                default:
                    tx += tx0.mid(i, 1);
                    break;
            }
        }
        objNameBox.value = tx;
        let retComp=Generic.ObjName_Kanji_Compatible(tx);
        tx = retComp.newObjname;
        let ChkShapeBoxSelected=new Array(2); 

        ChkShapeBoxSelected[enmShape.PointShape] = cbPointShapeEdit.checked;
        ChkShapeBoxSelected[enmShape.LineShape] = cbLineShapeEdit.checked;
        ChkShapeBoxSelected[enmShape.PolygonShape] = cbPolygonShapeEdit.checked;

        candidateObject = [];
        let Time  = clsTime.GetFromInputDate(dbdtpTime.value);
        for(let Smode  = 0 ;Smode<= 1;Smode++){
            for (let i = 0; i < MapData.Map.Kend; i++) {
                let mpObj = MapData.MPObj[i];
                if ((SelF[i] == false) && (lstObjGroup.getCheckedStatus(mpObj.Kind) == true) && (ChkShapeBoxSelected[mpObj.Shape] == true)) {
                    let f = false;
                    for (let j = 0; j < mpObj.NumOfNameTime; j++) {
                        let mpobjN = mpObj.NameTimeSTC[j];
                        if (clsTime.checkDurationIn(mpobjN.SETime, Time) == true) {
                            let objComp = mpobjN.NamesList.concat();
                            for (let k = 0; k < mpobjN.NamesList.length; k++) {
                                objComp[k] = Generic.ObjName_Kanji_Compatible(objComp[k]).newObjname;
                            }
                            let okf = false;
                            switch (Smode) {
                                case 0:
                                    if (objComp.indexOf(tx) != -1) {
                                        okf = true;
                                    }
                                    break;
                                case 1:
                                    for (let k = 0; k < mpobjN.NamesList.length; k++) {
                                        if (objComp[k] != undefined) {
                                            if (objComp[k].indexOf(tx) != -1) {
                                                okf = true;
                                            }
                                        }
                                    }
                                    break;
                            }
                            if (okf == true) {
                                SelF[i] = true;
                                let obj = new condidateInfo();
                                obj.ObjCode = i;
                                obj.TimeStac = j;
                                candidateObject.push(obj);
                            }
                        }
                    }
                }
            }
        }
        lbList.removeAll();
        let n  = candidateObject.length;
        if(n == 0 ){
            let msgText = "検索条件に当てはまるオブジェクトは見つかりませんでした。"
            Generic.alert(undefined,msgText);
        }else{
            let Values =[];
            
            for(let i  = 0;i<n ;i++){
                let oname  = MapData.MPObj[candidateObject[i].ObjCode].NameTimeSTC[candidateObject[i].TimeStac].NamesList[0];
                Values.push(oname);
            }
            for(let i  = 0;i<n ;i++){
                let mn= MapData.MPObj[candidateObject[i].ObjCode].NameTimeSTC[candidateObject[i].TimeStac];
                lbList.addList([{ text: mn.connectNames(), checked: true }], lbList.length);
            }
        }
    }

    function copy(e){
        let maxOname=0;
        let copyObjname=[];
        for (let i = 0; i < MapData.Map.OBKNum; i++) {
            if (lstObjGroup.getCheckedStatus(i) == true) {
                let onl=MapData.ObjectKind[i].ObjectNameList;
                maxOname = Math.max(maxOname, onl.length);
                for (let j = 0; j < onl.length; j++) {
                    if (copyObjname[j] == undefined) {
                        copyObjname[j] = onl[j];
                    } else {
                        copyObjname[j] += "/" + onl[j];
                    }
                }
            }
        }
        let popmenu =[];
        for(let i=0;i<maxOname;i++){
            popmenu.push({ caption: copyObjname[i],value:i, event: copyMode });
        }
        Generic.ceatePopupMenu(popmenu, new point(e.clientX, e.clientY));
        function copyMode(obj){
            let copyTx = "";
            for (let i = 0; i < candidateObject.length; i++) {
                if (lbList.getCheckedStatus(i) == true) {
                    copyTx += MapData.MPObj[candidateObject[i].ObjCode].NameTimeSTC[candidateObject[i].TimeStac].NamesList[obj.value] + "\n";
                }
            }
            Generic.clear_backDiv();
            okEvent(copyTx);
        }
    }

}

/**ダミーオブジェクトの設定 */
function frmPrint_DummyObjectGroup(){

    let Dummy = [];//strDummyObjectInfo
    let DummyOBGroup = [];
    let MapFileList = attrData.GetMapFileName();
    let PolygonDummy_ClipSet_F = [];
    let DummyObjectPointMark = [];//strDummyObjectPointMark_Info
    let LayerNum = attrData.TotalData.LV1.SelectedLayer;
    for (let i = 0; i < attrData.TotalData.LV1.Lay_Maxn; i++) {
        let al = attrData.LayerData[i];
        Dummy[i] = Generic.ArrayClone(al.Dummy);
        DummyOBGroup[i] = attrData.getDummyObjGroupArray(i).DummyOBGArray;
        PolygonDummy_ClipSet_F[i] = al.LayerModeViewSettings.PolygonDummy_ClipSet_F
    }

    const backDiv = Generic.set_backDiv("", "ダミーオブジェクト・グループ変更", 650, 430, true, true, buttonOK, 0.2, true, true);
    const gbDummyFrame=Generic.createNewFrame(backDiv,"","",15,40,400,370,"ダミーオブジェクト・グループ");
    let selLayer = Generic.createNewWordSelect(gbDummyFrame,"レイヤ", undefined, -1, "", 10, 30,50,150,0,  setDummyObjectList,"", "");
    attrData.Set_LayerName_to(selLayer,LayerNum);

    let gbDummyList = Generic.createNewFrame(gbDummyFrame, "", "", 10, 70, 195, 275, "ダミーオブジェクト");
    lstDummyItem = new ListBox(gbDummyList, "", [], 10, 15, 165, 125, undefined, "");
    Generic.createNewButton(gbDummyList, "削除", "", 115, 150,
        function () {
            let n = lstDummyItem.selectedIndex;
            if (n != -1) {
                Dummy[selLayer.selectedIndex].splice(n, 1);
                lstDummyItem.removeList(n, 1);
            }
        }, "width:60px");
    let txtDummy = Generic.createNewInput(gbDummyList, "text", "", "", 10, 185, undefined, "width:100px");
    txtDummy.addEventListener('keydown',txtKeyDown) ;
     function txtKeyDown (e) {if (e.keyCode == 13) { btnAdd.click(); } }
    let btnAdd=Generic.createNewButton(gbDummyList, "追加", "", 115, 180,
        function (e) {
            let tx = txtDummy.value;
            if (tx == "") {
                txtDummy.removeEventListener('keydown',txtKeyDown) ;
                Generic.alert(undefined, "オブジェクト名を入力して下さい。",function(){txtDummy.addEventListener('keydown',txtKeyDown)} );
                return;
            }else{
                if(AddDummyObject([tx])==true){
                    txtDummy.value="";
                }
            }
            txtDummy.focus();

        }, "width:60px");
    Generic.createNewButton(gbDummyList, "オブジェクト名コピーパネル", "", 10, 210, function (e) {
        let mp=attrData.LayerData[LayerNum].MapFileData;
        let init_para = new strFrmCopyObjectName_init_parameter_data();
        init_para.Time = attrData.LayerData[LayerNum].Time;
        init_para.ObjectGroupChecked.length = mp.Map.OBKNum;
        init_para.ObjectGroupChecked.fill(true);
        init_para.TimeChangeEnabled = false;
        frmCopyObjectName(mp,init_para,function (copyData) {
            let str=copyData.split("\n");
            AddDummyObject(str);
        })
    }, "width:170px;font-size:11px");
    Generic.createNewButton(gbDummyList, "クリップボードから追加", "", 10, 240, function (e) {
        document.body.removeEventListener("contextmenu",contextMenuPrevent);
        Generic.outerPaste(function(val){
            document.body.addEventListener("contextmenu",contextMenuPrevent);
            let strlst=val.split("\n");
            let oveCheck=Generic.getArrayContentsList(strlst);
            let str=[];
            for(let i in oveCheck){
                str.push(oveCheck[i].value);
            }
            AddDummyObject(str);
        },function(){
            document.body.addEventListener("contextmenu",contextMenuPrevent);
        });
        

     }, "width:170px;");

    let gbDummyOBGList = Generic.createNewFrame(gbDummyFrame, "", "", 215, 70, 175, 150, "ダミーオブジェクトグループ");
    let chklDummyGroup=new CheckedListBox(gbDummyOBGList, "", [], 10, 15,150, 130, false,function(){
        DummyOBGroup[LayerNum] = chklDummyGroup.getChecked().checkedStatus;
    },"");

    const chkDummyClip=Generic.createNewCheckBox(gbDummyFrame,"面形状ダミーオブジェクトをレイヤのクリッピング領域に設定","",PolygonDummy_ClipSet_F[LayerNum],215,260,150,
    function(){
        PolygonDummy_ClipSet_F[LayerNum]=chkDummyClip.checked;
    },"");
    const chkDummy_Size=Generic.createNewCheckBox(gbDummyFrame,"ダミーオブジェクトを画面領域の計算対象に含む","",attrData.TotalData.ViewStyle.Dummy_Size_Flag,215,300,150,function(){},"");

    let gbPointMark=Generic.createNewFrame(backDiv, "", "", 425, 40, 205, 300, "点オブジェクトの記号設定");
    let list = [];
    for (let i = 0; i < MapFileList.length; i++) {
        list.push({ value: MapFileList[i], text: MapFileList[i] });
    }
    const selMapFIle = Generic.createNewWordSelect(gbPointMark,"地図ファイル", list, 0, "", 10, 30,70,160,1, showPointMark,"", "");
    const pnlPointMark = Generic.createNewDiv(gbPointMark, "", "", "", 10, 85, 185, 180, "overflow-y:scroll;overflow-x:hidden;border:solid 1px;border-color:#666666;", "");
    const pnlPointMarkList = Generic.createNewDiv(pnlPointMark, "", "", "", 0, 0, 210, 100, "", "");

    setDummyObjectList();
    
    let ado=attrData.TotalData.ViewStyle.DummyObjectPointMark;
    for(let key in ado){
        DummyObjectPointMark[key]=[];
        for (let j in ado[key]){
            DummyObjectPointMark[key].push(ado[key][j].Clone());
        }
    }
    showPointMark();

    function showPointMark() {
        let lineHeight = 30;
        let DOPMark = DummyObjectPointMark[selMapFIle.getText()];
        if(DOPMark==undefined){
            DOPMark=[];
        }
        let DOPnum = DOPMark.length;
        pnlPointMarkList.style.height = (DOPnum * lineHeight + 10).px();
        for (let i = 0; i < DOPnum; i++) {
            let lk = DOPMark[i];
            let y = i * lineHeight + 3;
            let lc = Generic.createNewWordDivCanvas(pnlPointMarkList, "", lk.ObjectKindName, 10, y, 100, inePatternClick);
            lc.tag = i;
            attrData.Draw_Sample_Mark_Box(lc, DOPMark[i].mark);
            function inePatternClick(e) {
                let n = e.target.tag;
                clsMarkSet(e, function (newMark) {
                    DOPMark[n].mark = newMark;
                    attrData.Draw_Sample_Mark_Box(lc, newMark);
                }, DOPMark[n].mark, attrData);
            }
        }
    }

    function AddDummyObject(str){
        let emes  = "";
        let emesUsed  = "";
        let OKCodeName = [] //strDummyObjectName_and_Code)
        for (let i in str) {
            let objName = str[i];
            if (objName != "") {
                let code = attrData.Get_ObjectCode_from_ObjName(LayerNum, objName);
                if (code == -1) {
                    emes += "/" + objName;
                } else {
                    let f = true;
                    for (let j = 0; j < Dummy[LayerNum].length; j++) {
                        if (Dummy[LayerNum][j].code == code) {
                            emesUsed += "/" + objName;
                            f = false;
                            break;
                        }
                    }
                    if (f == true) {
                        let d = new strDummyObjectName_and_Code();
                        d.code = code;
                        d.Name = objName;
                        OKCodeName.push(d);
                        lstDummyItem.add({ text: d.Name, value: d.code })
                    }
                }
            }
        }
        Dummy[LayerNum] = Dummy[LayerNum].concat(OKCodeName);

        if(emes != "" ){
            txtDummy.removeEventListener('keydown',txtKeyDown);
            Generic.alert(undefined,"以下のオブジェクトは見つかりません。" + emes,function(){txtDummy.addEventListener('keydown',txtKeyDown)} );
        }
        if(emesUsed != "" ){
            txtDummy.removeEventListener('keydown',txtKeyDown);
            Generic.alert(undefined,"以下のオブジェクトは既にダミーオブジェクトに入っています。" + emesUsed,function(){txtDummy.addEventListener('keydown',txtKeyDown)} );
        }
        return ((emes == "") && (emesUsed == ""));         
    }

    function setDummyObjectList() {
        LayerNum = selLayer.selectedIndex;
        lstDummyItem.removeAll();
        chklDummyGroup.removeAll();
        for (let i = 0; i < Dummy[LayerNum].length; i++) {
            lstDummyItem.add({ text: Dummy[LayerNum][i].Name, value: Dummy[LayerNum][i].code });
        }
        let alm = attrData.LayerData[LayerNum].MapFileData;
        for (let i = 0; i < alm.Map.OBKNum; i++) {
            chklDummyGroup.add({ text: alm.ObjectKind[i].Name, value: i, checked: DummyOBGroup[LayerNum][i] });
        }
        chkDummyClip.Checked = PolygonDummy_ClipSet_F[LayerNum];
    }

    function buttonOK() {
        Generic.clear_backDiv();
        for (let i = 0; i < attrData.TotalData.LV1.Lay_Maxn; i++) {
            let al = attrData.LayerData[i];
            al.Dummy = Generic.ArrayClone(Dummy[i]);
            al.DummyGroup=Generic.Get_Specified_Value_Array(DummyOBGroup[i],true);
            al.LayerModeViewSettings.PolygonDummy_ClipSet_F = PolygonDummy_ClipSet_F[i];
        }
        let ado=attrData.TotalData.ViewStyle.DummyObjectPointMark;
        for(let key in DummyObjectPointMark){
            for (let j in DummyObjectPointMark[key]){
                ado[key][j]=DummyObjectPointMark[key][j];
            }
        }
        attrData.TotalData.ViewStyle.Dummy_Size_Flag = chkDummy_Size.checked;
        clsPrint.printMapScreen(Frm_Print.picMap);
    }
}