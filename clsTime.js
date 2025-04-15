/// <reference path="clsGeneric.js" />
/// <reference path="clsAttrData.js" />
/// <reference path="main.js" />
/// <reference path="clsMapdata.js" />

class clsTime  {
    static GetNullYMD  () {
        var ymd = new strYMD(0, 0, 0)
        return ymd;
    }

    //指定の日付の間の日数を数える。Time1がTime2より後の場合は負の値
    static getDifference (Time1, Time2) {
        let day1 = Time1.toDate();
        let day2 = Time2.toDate();
        let termDay = (day2 - day1) / 86400000;
        return termDay;
    }
    static GetNullStartEndYMD(){
        let d=new Start_End_Time_data();
        d.StartTime=this.GetNullYMD();
        d.EndTime=this.GetNullYMD();
        return d;
    }

    static YMDtoString(YMD) {
        if (YMD.nullFlag() == true) {
            return "未設定";
        } else {
            return YMD.toString();
        }
    }

    /**20131116のような年月日をそのまま数値にした値を返す。nullValueの場合は0 */
    static YMDtoValue(YMD) {
            return YMD.Day + YMD.Month * 100 + YMD.Year * 10000;
    }

    static GetYMDfromValue(value){
        let  YMD =new  strYMD();
        let s  = "00000000" + value.toString().right( 8);
        YMD.Year = Number(s.substr(0, 4));
        YMD.Month = Number(s.substr(4, 2));
        YMD.Day = Number(s.substr(6, 2));
        return YMD;
    }
    static StartEndtoString(StartEnd) {
        let txs = "";
        if (StartEnd.StartTime.nullFlag() == true) {
            txs = "開始";
        }
        txs += this.YMDtoString(StartEnd.StartTime) + "-";
        if (StartEnd.EndTime.nullFlag() == true) {
            txs += "終了";
        }
        txs += this.YMDtoString(StartEnd.EndTime);
        return txs;
    }
    static checkDurationIn(duration, Point) {
        //現時点が指定の期間に含まれているかどうかをチェックし、含まれている場合にtrue
        if ((Point.nullFlag() == true) || (duration.StartTime.nullFlag() == true) && (duration.EndTime.nullFlag() == true)) {
            return true;
        } else {
            let time = Point.toDate();
            switch (duration.StartTime.nullFlag()) {
                case true:
                    if(duration.EndTime.nullFlag() == true) {
                        return true;
                    }else{
                        let etime = duration.EndTime.toDate();
                        return (time <= etime);
                        }
                    break;
                case false:
                    let stime = duration.StartTime.toDate();
                    if (duration.EndTime.nullFlag() == true) {
                        return (stime <= time);
                    } else {
                        let etime =duration.EndTime.toDate();
                        return ((stime <= time) && (time <= etime));
                    }
                    break;

            }
        }
    }

    static GetYMD(date) {
        return new strYMD(date.getFullYear(), date.getMonth()+1, date.getDate());
    }
    static GetFromInputDate  (value) {
        let t = value.split("-");
        return new strYMD(Number(t[0]), Number(t[1]), Number(t[2]));
    }
    static Check_YMD_Correct(y, m, d) {
        if ((new Date(y, m, 0).getDate() < d) || (m < 1)|| (m > 12) || (d < 1)) {
            return false;
        }
    }

};



var Font_Property = function () {
    this.Color=new colorRGBA();
    this.Size; //Single
    this.italic=false; //Boolean
    this.bold = false; //Boolean
    this.Underline = false; //Boolean
    this.Name; //String
    this.Kakudo=0; //Single
    this.FringeF = false; //Boolean
    this.FringeWidth=50; //Single '文字の大きさに対する割合
    this.FringeColor = new colorRGBA();
    this.Back = new BackGround_Box_Property(); 
}
Font_Property.prototype.Clone = function () {
    let d = new Font_Property();
    Object.assign(d, this)
    d.Color = this.Color.Clone();
    d.FringeColor = this.FringeColor.Clone();
    d.Back = this.Back.Clone();
    return d;
}
//fontプロパティから、Cnvas用fontに変換
Font_Property.prototype.toContextFont = function(ScrData){
    let TH;
    if (ScrData.SampleBoxFlag == false) {
        TH = ScrData.Get_Length_On_Screen(this.Size);
    } else {
        TH = this.Size;
    }
    if (TH == 0) {
        return { font: undefined, height: TH };
    }

    let ftext = TH + "px " + "'" + this.Name + "' ";
    if (this.bold == true) {
        ftext += "bold ";
    }
    if (this.italic == true) {
        ftext += "italic ";
    }
    return { font: ftext, height: TH };
}

var BackGround_Box_Property = function () {
    this.Tile = new Tile_Property();
    this.Line = new Line_Property();
    this.Round; //Single
    this.Padding; //Single
}
BackGround_Box_Property.prototype.Clone = function () {
    let d = new BackGround_Box_Property();
    Object.assign(d, this);
    d.Tile = this.Tile.Clone();
    d.Line = this.Line.Clone();
    return d;
}

var LineEdge_Connect_Pattern_Data_Info = function () {
    this.lineCap="round";
    this.lineJoin = "round";
    this.miterLimit=10;
}
LineEdge_Connect_Pattern_Data_Info.prototype.Clone = function () {
    let d = new LineEdge_Connect_Pattern_Data_Info();
    Object.assign(d, this)
    return d;
}

var Line_Property = function () {
    this.BlankF=false;
    this.Width=0;
    this.Color = new colorRGBA();
    this.Edge_Connect_Pattern = new LineEdge_Connect_Pattern_Data_Info();
}
Line_Property.prototype.Clone = function () {
    let d = new Line_Property();
    d.BlankF = this.BlankF;
    d.Width = this.Width;
    d.Color = this.Color.Clone();
    d.Edge_Connect_Pattern = this.Edge_Connect_Pattern.Clone();
    return d;
}
Line_Property.prototype.Set_Same_ColorWidth_to_LinePat= function (Color, width) {
    this.Width = width;
    this.Color = Color;
}

var Tile_Property = function () {
    this.BlankF=true;
    this.Color = new colorRGBA();
}
Tile_Property.prototype.Clone = function () {
    let d = new Tile_Property();
    d.BlankF = this.BlankF;
    d.Color = this.Color.Clone();
    return d;
}

//記号のプロパティ
var Mark_Property = function () {
    this.PrintMark; //enmMarkPrintType
    this.ShapeNumber; //Short
    this.Tile = new Tile_Property();
    this.Line = new Line_Property();
    this.wordmark; //String
    this.WordFont = new Font_Property();
}
Mark_Property.prototype.Clone = function () {
    let d = new Mark_Property();
    Object.assign(d, this);
    d.Tile = this.Tile.Clone();
    d.Line = this.Line.Clone();
    d.WordFont = this.WordFont.Clone();
    return d;
}

var enmArrowHeadType={
    Line : 0,
    Fill : 1
}
//矢印のプロパティ
var Arrow_Data = function () {
    this.Start_Arrow_F; //Boolean
    this.End_Arrow_F; //Boolean
    this.ArrowHeadType; //enmArrowHeadType
    this.Angle; //Single
    this.LWidthRatio; //Single
    this.WidthPlus; //Single
}
Arrow_Data.prototype.Clone = function () {
    let d = new Arrow_Data();
    Object.assign(d,this);
    return d;
}

var enmLatLonPrintPattern = {
    DegreeMinuteSecond: 0,
    DecimalDegree: 1
}

var Setting_Info = function () {
    this.ObjectName_Word_Compatible = "ヶガケかカヵ|曽曾|桧檜|条條|蕊蘂|釜竈竃|桜櫻|当當|頸頚|梼檮|挾狭|諫諌|鶯鴬|真眞|篭籠|鯵鰺|檮梼|藪薮|龍竜";
    this.KatakanaCheck = true;
    this.SinKyuCharacter = true;
    this.SetFont = "";
    this.MinimumLineWidth = 4;
    this.Printing_Time_Limit = 1;
    this.Ido_Kedo_Print_Pattern = enmLatLonPrintPattern.DecimalDegree ;// enmLatLonPrintPattern
    this.Compass_Mark = 11;
    this.Compass_Mark_Size = 8;
    this.SinKyuCharacter = true;
    this.KatakanaCheck = true;
    this.default_Projection = enmProjection_Info.prjMercator// enmProjection_Info
    this.MDRFileHistory;
    this.BackImageSpeed = 3;
    this.LegendMinusWord = "負の値";
    this.LegendPlusWord = "正の値";
    this.LegendBlockmodeWord = "1個あたり";
}
Setting_Info.prototype.Clone= function(){
    let d=new Setting_Info();
    Object.assign(d,this);
    return d;
}


class clsBase {
    static Arrow() {
        let BArrow = new Arrow_Data();
        BArrow.End_Arrow_F = false;
        BArrow.Start_Arrow_F = false;
        BArrow.ArrowHeadType = enmArrowHeadType.Line;
        BArrow.WidthPlus = 2;
        BArrow.Angle = 50;
        BArrow.LWidthRatio = 1;
        return BArrow;
    }

    static LineEdge  () {
        let base = new LineEdge_Connect_Pattern_Data_Info()
        base.lineCap = "round";
        base.lineJoin = "round";
        base.miterLimit = 10;
        return base;

    }
    static Line  () {
        let BaseLine = new Line_Property();
        BaseLine.BlankF = false;
        BaseLine.Edge_Connect_Pattern = this.LineEdge();
        BaseLine.Width = 0;
        BaseLine.Color = new colorRGBA([0, 0, 0]);
        return BaseLine;
    }

    static BlankLine  () {
        let l = this.Line();
        l.BlankF = true;
        return l;
    }


    static BoldLine  () {
        let l = this.Line();
        l.Width = 0.3;
        return l;
    }
    static Tile  () {
        let BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    static BlancTile() {
        let BaseTile = new Tile_Property();
        BaseTile.BlankF = true;
        BaseTile.Color = new colorRGBA([255, 255, 255]);
        return BaseTile;
    }
    static PaintTile(col) {
        let BaseTile = new Tile_Property();
        BaseTile.BlankF = false;
        BaseTile.Color = col;
        return BaseTile;
    }

    static Font  () {
        let Base = new Font_Property();
        Base.Size = 4;
        Base.Color = new colorRGBA([0, 0, 0]);
        Base.italic = false;
        Base.Underline = false; //使えない
        Base.Name =clsSettingData.SetFont;
        Base.bold = false;
        Base.Kakudo = 0;
        Base.FringeF = false;
        Base.FringeWidth = 60;
        Base.FringeColor = new colorRGBA([255, 255,255]);
        Base.Back = new BackGround_Box_Property();
        Base.Back.Tile.BlankF = true;
        Base.Back.Tile.Color = new colorRGBA([255, 255, 255]);
        Base.Back.Line = this.Line();
        Base.Back.Line.BlankF = true;
        Base.Back.Round = 1;
        Base.Back.Padding = 1;
        return Base;
    }

    static Mark  () {
        let BMark = new Mark_Property();
        BMark.PrintMark = enmMarkPrintType.Mark;
        BMark.ShapeNumber=0; //Short
        BMark.Tile = this.Tile();
        BMark.Tile.Color = new colorRGBA([200, 200, 200])
        BMark.Line = this.Line();
        BMark.wordmark = "";
        BMark.WordFont = this.Font();
        BMark.WordFont.Size=2;
        return BMark;
    }

    static ColorWhite() {
        return new colorRGBA([255, 255, 255]);
    }
    static ColorGray() {
        return new colorRGBA([125, 125, 125]);
    }
    static ColorBlack() {
        return new colorRGBA([0, 0, 0]);
    }
    static ColorBlue() {
        return new colorRGBA([0, 0, 255]);
    }
    static ColorRed() {
        return new colorRGBA([255, 0, 0]);
    }
    static ColorGreen() {
        return new colorRGBA([0, 255, 0]);
    }


    static BlankBackground() {
        let Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = true;
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }

    static WhiteBackground() {
        let Back = new BackGround_Box_Property();
        Back.Line.BlankF = true;
        Back.Tile.BlankF = false;
        Back.Tile.Color = new colorRGBA([255, 255, 255,200]);
        Back.Round = 1;
        Back.Padding = 1;
        return Back;
    }
}

