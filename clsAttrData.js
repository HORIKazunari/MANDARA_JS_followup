/// <reference path="clsGeneric.js" />
/// <reference path="clsTime.js" />
/// <reference path="main.js" />
/// <reference path="SortingSearch.js" />
/// <reference path="clsMapdata.js" />
/// <reference path="clsDraw.js" />



var size = function (width, height) {
    this.width = width;
    this.height = height;
}
size.prototype.Clone = function () {
    let sz = new size(this.width, this.height);
    return sz;
}


var point = function (x, y) {
    this.x = x;
    this.y = y;
}

point.prototype.Clone = function () {
    let p = new point(this.x, this.y);
    return p;
}

point.prototype.offset = function (p_xp, yp) {
    if (p_xp instanceof point) {
        this.x += p_xp.x;
        this.y += p_xp.y;
    } else {
        this.x += p_xp;
        this.y += yp;
    }
}

point.prototype.toLatlon = function () {
    let p = new latlon(this.y, this.x);
    return p;
}

point.prototype.Equals = function (np) {
    if ((this.x == np.x) && (this.y == np.y)) {
        return true;
    } else {
        return false;
    }
}


var point3 = function (x, y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

//度分秒構造体
var strDegreeMinuteSeconde=function(){
    this.Degree;
    this.Minute;
    this.Second;
}

//度分秒緯度経度構造体
var strLatLonDegreeMinuteSecond=function(){
    this.LatitudeDMS=new strDegreeMinuteSeconde();
    this.LongitudeDMS=new strDegreeMinuteSeconde();
}
strLatLonDegreeMinuteSecond.prototype.toLatLon=function(){
    let latlon = new latlon();
    latlon.lat = Math.abs(this.LatitudeDMS.Degree) + this.LatitudeDMS.Minute / 60 + this.LatitudeDMS.Second / 3600;
    if (this.LatitudeDMS.Degree < 0) {
        latlon.lat = -latlon.lat;
    }
    latlon.lon = Math.abs(this.LongitudeDMS.Degree) + this.LongitudeDMS.Minute / 60 + this.LongitudeDMS.Second / 3600;
    if (this.LongitudeDMS.Degree < 0) {
        latlon.lon = -latlon.lon;
    }
    return latlon;
}


var latlon = function (lat, lon) {
    this.lat=lat;
    this.lon=lon;
}
latlon.prototype.Equals = function (np) {
    if ((this.lat == np.lat) && (this.lon == np.lon)) {
        return true;
    } else {
        return false;
    }
}
latlon.prototype.toPoint = function(){
    return new point(this.lon, this.lat);
}
latlon.prototype.Clone = function () {
    return new latlon( this.lat,this.lon);
}
latlon.prototype.toDegreeMinuteSecond= function(){
    let d=new strLatLonDegreeMinuteSecond();
    d.LatitudeDMS = toDegreeMinuteSecond_sub(this.lat);
    d.LongitudeDMS = toDegreeMinuteSecond_sub(this.lon);
    return d;
    function toDegreeMinuteSecond_sub(V){
        let s = new  strDegreeMinuteSeconde();
        s.Degree = parseInt(V);
        let v2  = (Math.abs(V) - s.Degree) * 60;
        s.Minute = parseInt(v2);
        s.Second = (Math.abs(v2) - s.Minute) * 60;
        return s ;
    }
}

var latlonbox = function (northWestLatLon,southEastLatLon) {
    this.NorthWest = northWestLatLon;
    this.SouthEast = southEastLatLon;
}
latlonbox.prototype.Clone = function () {
    let nw = this.NorthWest.Clone();
    let sw = this.SouthEast.Clone();
    return new latlonbox(nw, sw);
}

latlonbox.prototype.toRectangle = function () {
    return new rectangle(this.NorthWest.lon, this.SouthEast.lon, this.SouthEast.lat, this.NorthWest.lat);
}
latlonbox.prototype.NorthEast = function () {
    return new latlon(this.NorthWest.lat,this.SouthEast.lon);
}

latlonbox.prototype.SouthWest = function () {
    return new latlon(this.SouthEast.lat, this.NorthWest.lon);
}

latlonbox.prototype.CenterPoint = function () {
    return new latlon((this.SouthEast.lat + this.NorthWest.lat) / 2, (this.SouthEast.lon + this.NorthWest.lon) / 2);
}

var rectangle = function (left_point, right_size, top, bottom) { //四角形を保持するクラス
    if ((left_point instanceof point) == true) {
        let p = left_point;
        if ((right_size instanceof size) == true) {
            let s = right_size;
            this.left = p.x;
            this.right = p.x + s.width;
            this.top = p.y;
            this.bottom = p.y + s.height;
        } else {
            this.left = p.x;
            this.right = p.x;
            this.top = p.y;
            this.bottom = p.y;
        }

    } else {
        this.left = left_point;
        this.right = right_size;
        this.top = top;
        this.bottom = bottom;
    }

}
rectangle.prototype.centerP = function () { return new point((this.right + this.left) / 2, (this.bottom + this.top) / 2) }
rectangle.prototype.size = function () { return new size((this.right - this.left), (this.bottom - this.top)) }
rectangle.prototype.width = function () { return (this.right - this.left) }
rectangle.prototype.height = function () { return (this.bottom - this.top) }
rectangle.prototype.size = function () { return new size(this.right - this.left,this.bottom - this.top) }

rectangle.prototype.Clone = function () {
    let re = new rectangle(this.left, this.right, this.top, this.bottom);
    return re;
}
rectangle.prototype.topLeft = function () {
    return new point(this.left, this.top);
}
rectangle.prototype.topRight = function () {
    return new point(this.right, this.top);
}
rectangle.prototype.bottomRight = function () {
    return new point(this.right, this.bottom);
}
rectangle.prototype.bottomLeft = function () {
    return new point(this.left, this.bottom);
}

rectangle.prototype.contains = function (P) {
    if ((P.x >= this.left) && (P.x <= this.right) && (P.y >= this.top) && (P.y <= this.bottom)) {
        return true;
    } else {
        return false;
    }
}
rectangle.prototype.offset = function (xplus, yplus) {
    this.left += xplus;
    this.right += xplus;
    this.top += yplus;
    this.bottom += yplus;
}
rectangle.prototype.inflate = function (xplus, yplus) {
    this.left -= xplus;
    this.right += xplus;
    this.top -= yplus;
    this.bottom += yplus;
}
rectangle.prototype.Equals = function (rect){
    if((rect.left==this.left)&&(rect.right==this.right)&&(rect.top==this.top)&&(rect.bottom==this.bottom)){
        return true;
    }else{
        return false;
    }
}


var PeripheriDirinfo = function (Code, Dir) {//オブジェクト周囲のコードと方向
    this.Code = Code;
    this.Dir = Dir;
}

var strYMD = function (y, m, d) {
    this.Year = y;
    this.Month = m;
    this.Day = d;
}
strYMD.prototype.nullFlag = function () {
    if (this.Day == 0) {
        return true;
    } else {
        return false;
    }
}
strYMD.prototype.Equals = function (time) {
    if ((time.Year == this.Year) && (time.Month == this.Month) && (time.Day == this.Day)) {
        return true;
    } else {
        return false;
    }
}
//JSのInputのdate要素用に変換
strYMD.prototype.toInputDate = function() {
    let y = ("0000" + this.Year).slice(-4)
    let m = ("0" + this.Month).slice(-2)
    let d = ("0" + this.Day).slice(-2)
    return (y + "-" + m + "-" + d);
}
strYMD.prototype.toString = function () {
    if (this.nullFlag() == true) {
        return "未設定";
    } else {
        let y = ("0000" + this.Year).slice(-4)
        let m = ("0" + this.Month).slice(-2)
        let d = ("0" + this.Day).slice(-2)
        return (y + "/" + m + "/" + d);

    }
}
//JSのDate変数へ変換
strYMD.prototype.toDate = function () {
    return new Date(this.Year, this.Month - 1, this.Day);
}
strYMD.prototype.Clone=function(){
    let d=new strYMD(this.Year,this.Month,this.Day);
    return d;
}

var Start_End_Time_data = function () {
    this.StartTime = new strYMD();
    this.EndTime = new strYMD();
}
Start_End_Time_data.prototype.Clone=function(){
    let d=new Start_End_Time_data();
    d.StartTime=this.StartTime.Clone();
    d.EndTime=this.EndTime.Clone();
    return d;
}
Start_End_Time_data.prototype.Equals=function(SETime){
    if(this.StartTime.Equals(SETime.StartTime)){
        if(this.EndTime.Equals(SETime.EndTime)){
            return true;
        }
    }
    return false;
}

var enmDataSource = {
    NoData: -1,
    Clipboard: 0,
    CSV: 1,
    DataEdit: 2,
    MDRJ: 3,
    MDRMJ: 4,
    Viwer: 7,
    Shapefile: 8
}

var enmClassMode_Meshod = {
    Noral: 0,
    Separated:1
}
var enmPointOnjectDrawOrder = {
    ObjectOrder: 0,
    LowerToUpperCategory: 1,
    UpperToLowerCategory: 2

}



//データ表示モード
var enmLayerMode_Number = {
    NoData: -1,
    SoloMode: 0,
    GraphMode: 1,
    LabelMode: 2,
    TripMode: 3
}

//'線端形状
var enmEdge_Pattern = {
    Round: 0,// '丸
    Rectangle: 1,// '四角
    Flat: 2 //'平ら
}

//折れ線の接続
var enmJoinPattern = {
    Round: 0,
    Bevel: 1,
    Miter: 2,
}

var enmLineConnect={
    no : 0,
    one : 1,
    both : 2,
    loopen : 3
}
//階級区分モードの凡例
var enmClassModE_Meshod = {
    Noral: 0,
    Separated: 1
}
// 階級区分凡例分離表示のさいの表記法
var enmSeparateClassWords = {
    Japanese: 0,
    English: 1
}

var enmLayerType = { Normal: 0, Trip_Definition: 1, Trip: 2, Mesh: 3, DefPoint: 4 };
var enmMesh_Number = {
    mhNonMesh: -1,
    mhFirst: 0,
    mhSecond: 1,
    mhThird: 2,
    mhHalf: 3,
    mhQuarter: 4,
    mhOne_Eighth: 5,
    mhOne_Tenth: 6
}
var enmZahyo_System_Info = {
    Zahyo_System_No: -1,
    Zahyo_System_tokyo: 0, //日本測地系
    Zahyo_System_World: 1 //世界測地系
}

var enmScaleUnit = {
    centimeter: 0,
    meter: 1,
    kilometer: 2,
    inch: 3,
    feet: 4,
    yard: 5,
    mile: 6,
    syaku: 7,
    ken: 8,
    ri: 9,
    kairi: 10
}

var enmProjection_Info = {
    prjNo: -1,
    prjSanson: 0,//サンソン図法
    prjSeikyoEntou: 1,//正距円筒図法
    prjMercator: 2,//メルカトル図法
    prjMiller: 3,//ミラー図法
    prjLambertSeisekiEntou: 4,//ランベルト正積円筒図法
    prjMollweide: 5,//モルワイデ図法
    prjEckert4: 6,//エッケルト第4図法
}
var enmZahyo_mode_info = {
    Zahyo_No_Mode: -1,
    Zahyo_Ido_Keido: 0,//緯度経度
    Zahyo_HeimenTyokkaku: 1,//平面直角
}
var cstRectangle_Cross = { //長方形間の関係を示す定数
    cstOuter: -1,
    cstCross: 0,
    cstInner: 1,
    cstInclusion: 2,
    cstEqual: 3
}
var Cross_Line_Data = function () { //交点取得用
    this.BeforPoint;
    this.Point;
}
var enmShape = {
    NotDeffinition: -1,
    PointShape: 0,
    LineShape: 1,
    PolygonShape: 2
}

var enmGraphMode= {
    PieGraph : 0,
    StackedBarGraph : 1,
    LineGraph : 2,
    BarGraph : 3
}

//属性データのタイプ
var enmAttDataType = {
    Normal: 0,
    Category: 1,
    Strings: 2,
    URL: 3,
    URL_Name: 4,
    Lon: 5,
    Lat: 6,
    Place: 7,
    Arrival: 8,
    Departure: 9
}
var cstLinePolygonRelationd = { //ラインとポリゴンの関係を示す定数
    cstOuter: -1,
    cstCross: 0,
    cstInner: 1
}
var chvValue_on_twoValue = { //二つの値にチェックする値が挟まれているか調べる
    chvOuter: -1,
    chvJust: 0,
    chvIN: 1
}

var strURL_Data = function () {
    this.Name;
    this.Address;
}

//オブジェクト名とコード、シンボル位置（属性データ）
var strObject_Data_Info = function () {
    this.MpObjCode;
    this.Name;
    this.Objectstructure;
    this.HyperLinkNum;
    this.HyperLink = []; //strURL_Data
    this.CenterPoint=new point();
    this.Symbol=new point();
    this.Label=new point();
    this.defPoint= new latlon();
    this.MeshRect=new rectangle();
    this.MeshPoint = [];//PointF
    this.Visible;
}
strObject_Data_Info.prototype.Clone = function () {
    var d = new strObject_Data_Info();
    d.MpObjCode = this.MpObjCode;
    d.Name = this.Name;
    d.Objectstructure = this.Objectstructure;
    d.HyperLinkNum = this.HyperLinkNum;
    for(let i in this.HyperLink){
        let  ud=new strURL_Data();
        Object.assign(ud,this.HyperLink[i]);
        d.HyperLink.push(ud);
    }
    d.CenterPoint = this.CenterPoint.Clone();
    d.Symbol = this.Symbol.Clone();
    d.Label = this.Label.Clone();
    d.MeshRect = this.MeshRect.Clone();
    d.defPoint = this.defPoint.Clone();
    d.MeshPoint =Generic.ArrayClone(this.MeshPoint); 
    d.Visible = this.Visible;
    return d;
}

var strObject_Info = function () {
    this.ObjectNum;
    this.NumOfSyntheticObj;
    this.atrObjectData = [];//strObject_Data_Info
    this.MPSyntheticObj = [];//strSynthetic_Object_Data
    this.TripObjData = [];
}

//合成オブジェクト名とコード（属性データ）
var strSynthetic_ObjectName_and_Code = function () {
    this.code;
    this.Name;
    this.Draw_F;
}
strSynthetic_ObjectName_and_Code.prototype.Clone = function () {
    var dt = new strSynthetic_ObjectName_and_Code();
    Object.assign(dt,this);
    return dt;
}

//合成オブジェクト（属性・地図データ）
var strSynthetic_Object_Data = function () {
    this.Kind;
    this.NumOfObject;
    this.Name;
    this.CenterP = new point();
    this.SETime = new Start_End_Time_data();
    this.Shape; //enmShape
    this.Circumscribed_Rectangle = new rectangle();
    this.Objects = []; //strSynthetic_ObjectName_and_Code
}
strSynthetic_Object_Data.prototype.Clone = function () {
    var dt = new strSynthetic_Object_Data();
    Object.assign(dt, this);
    dt.SETime = this.SETime.Clone();
    dt.CenterP = this.CenterP.Clone();
    dt.Circumscribed_Rectangle = this.Circumscribed_Rectangle.Clone();
    dt.Objects = Generic.ArrayClone(this.Objects);
    return dt;
}

var enmLatLonLine_Order = {
    Back: 0,
    Front: 1
}

var enmInner_Data_Info_Mode = {
    ClassPaint: 0,
    ClassHatch: 1
}

var enmMarkSizeValueMode = {
    inDataItem: 0,
    UserDefinition: 1
}

var enmMarkPrintType = {
    Mark: 0,
    Word: 1,
    Picture:2
}

//画面上に固定または地図領域に固定
var enmBasePosition = {
    Map: 0,
    Screen: 1
}

var enmHorizontalAlignment = {
    Left : -1,
    Center : 0,
    Right: 1
}

var enmScaleBarPattern = {
    Thin : 0,
        Bold : 1,
        Slim : 2
}
var enmVerticalAlignment = {
    Top: -1,
    Center : 0,
    Bottom : 1
}


//記号の数，大きさ，階級記号，線モードの内部色設定
var strInner_Data_Info = function () {
    this.Flag;
    this.Data;
}
strInner_Data_Info.prototype.Clone = function () {
    let d = new strInner_Data_Info();
    d.Flag=this.Flag;
    d.Data=this.Data;
    return d;
}

var colorRGBA = function (rgba) {
    this.r;
    this.g;
    this.b;
    this.a;
    if (rgba != undefined) {
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        if (rgba.length == 4) {
            this.a = rgba[3];
        } else {
            this.a = 255;
        }
    }
}
colorRGBA.prototype.Clone = function () {
    let d = new colorRGBA([this.r, this.g, this.b, this.a]);
    return d;
}
colorRGBA.prototype.toRGB = function () {
    return 'RGB(' + this.r + ',' + this.g + ',' + this.b + ')';
}
colorRGBA.prototype.toRGBA = function () {
    return 'RGBA(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a/255 + ')';
}
colorRGBA.prototype.toHex = function () {
    /// <signature>
    /// <summary>rgbカラーを16進数に変換</summary>
    /// </signature> 
    var rgb = this.b | (this.g << 8) | (this.r << 16);
    return '#' + rgb.toString(16);
};

colorRGBA.prototype.Equals = function (col) {
    if ((col.r == this.r) && (col.g == this.g) && (col.b == this.b) && (col.a == this.a)) {
        return true;
    } else {
        return false;
    }
}
colorRGBA.prototype.getDarkColor=function(){
    let  rate  = 0.85;
    return new colorRGBA([this.r * rate,this.g * rate,this.b * rate,this.a]);
  }
  
/**イルマップを描画するタイミング */
var enmDrawTiming={
    BeforeDataDraw:0,
    AfterDataDraw:1
}
/**タイルマップを描画する際の情報 */
var strTileMapViewInfo= function () {
    this.Visible;
    this.AlphaValue;// 0-1
    this.TileMapDataSet={} ;// tileMapList.getTileInfo// strTileMapData_Info
    this.DrawTiming;//enmDrawTiming
}
strTileMapViewInfo.prototype.Clone=function(){
    let d=new strTileMapViewInfo();
    Object.assign(d,this);
    d.TileMapDataSet=Generic.Clone(this.TileMapDataSet);
    return d;
}

/**取得する個別タイル 旧Watchize_Data_Info*/
var tileList_Data_Info = function () {
    this.LatLonBox;//  strLatLonBox
    this.ScrPosition;//  Rectangle
    this.URL;//  String
}


//ペイントモード設定値（属性データ）
var strClassPaint_Data = function () {
    this.color1 = new colorRGBA();
    this.color2 = new colorRGBA();
    this.color3 = new colorRGBA();
    this.Color_Mode;//enmPaintColorSettingModeInfo
}
strClassPaint_Data.prototype.Clone=function(){
    let d=new strClassPaint_Data();
    d.color1=this.color1.Clone();
    d.color2=this.color2.Clone();
    d.color3=this.color3.Clone();
    d.Color_Mode=this.Color_Mode;
    return d;
}
//記号モード共通
var strMarkCommon_Data = function () {
    this.Inner_Data = new strInner_Data_Info();
    this.MinusTile = new Tile_Property();
    this.MinusLineColor = new colorRGBA();
    this.LegendMinusWord;
    this.LegendPlusWord;
}
strMarkCommon_Data.prototype.Clone=function(){
    let d=new strMarkCommon_Data();
    d.Inner_Data=this.Inner_Data.Clone();
    d.MinusTile=this.MinusTile.Clone();
    d.MinusLineColor=this.MinusLineColor.Clone();
    d.LegendMinusWord=this.LegendMinusWord;
    d.LegendPlusWord=this.LegendPlusWord;
    return d;
}

var strMarkSizeModeLineShapeData = function () {
    this.LineWidth;  //Single
    this.LineEdge = new LineEdge_Connect_Pattern_Data_Info();
    this.Color = new colorRGBA;
}
strMarkSizeModeLineShapeData.prototype.Clone=function(){
    let d=new strMarkSizeModeLineShapeData();
    d.LineWidth=this.LineWidth;
    d.LineEdge=this.LineEdge.Clone();
    d.Color=this.Color.Clone();
    return d;
}

//記号の大きさモード設定（属性データ）
var strMarkSize_Data = function () {
    this.MaxValueMode;  //enmMarkSizeValueMode
    this.MaxValue;  //Double
    this.Value = [];  //Double '4
    this.Mark = new Mark_Property();
    this.LineShape = new strMarkSizeModeLineShapeData;
}
strMarkSize_Data.prototype.Clone=function(){
    let d=new strMarkSize_Data();
    d.MaxValueMode=this.MaxValueMode;
    d.MaxValue=this.MaxValue;
    d.Value=this.Value.concat();
    d.Mark=this.Mark.Clone();
    d.LineShape=this.LineShape.Clone();
    return d;
}

//記号の数モード設定（属性データ）
var strMarkBlock_Data= function () {
    this.Value;// Double
    this.ArrangeB ;// enmMarkBlockArrange
    this.HasuVisible ;// Boolean
    this.Mark =new  Mark_Property();
    this.Overlap ;// Integer
    this.LegendBlockModeWord ;// String
}
strMarkBlock_Data.prototype.Clone=function(){
    let d=new strMarkBlock_Data();
    Object.assign(d,this);
    d.Mark=this.Mark.Clone();
    return d;
}

//記号の棒モード
var enmMarkBarShape = {
    bar: 0,
    triangle: 1
}

var strMarkBar_Data = function () {
    this.Width;  //Single
    this.MaxHeight;  //Single
    this.MaxValueMode;  //enmMarkSizeValueMode
    this.MaxValue;  //Double
    this.InnerTile = new Tile_Property();
    this.FrameLinePat = new Line_Property();
    this.ThreeD;  //Boolean
    this.ScaleLineInterval;  //Double
    this.ScaleLineVisible;  //Boolean
    this.scaleLinePat = new Line_Property();
    this.BarShape;//enmMarkBarShape
}
strMarkBar_Data.prototype.Clone=function(){
    let d=new strMarkBar_Data();
    Object.assign(d,this);
    d.InnerTile=this.InnerTile.Clone();
    d.FrameLinePat=this.FrameLinePat.Clone();
    d.scaleLinePat=this.scaleLinePat.Clone();
    return d;
}

//文字モード
var strString_Data = function () {
    this.Font = new Font_Property();
    this.maxWidth;  //Single
    this.WordTurnF;  //Boolean
}
strString_Data.prototype.Clone=function(){
    let d=new strString_Data();
    d.Font=this.Font.Clone();
    d.maxWidth=this.maxWidth;
    d.WordTurnF=this.WordTurnF;
    return d;
}

const enmMarkBlockArrange = {
    Block: 0,
    Vertical: 1,
    Horizontal: 2,
    Random:3
}

/**単独表示モードの列挙型 */
const enmSoloMode_Number = {
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
    StringMode: 9
}

//階級区分データ（属性データ）
var strClass_Div_data = function () {
    this.Value;  //Double/String
    this.PaintColor = new colorRGBA();
    this.ClassMark = new Mark_Property();
    this.ODLinePat = new Line_Property();
}
strClass_Div_data.prototype.Clone = function () {
    let d = new strClass_Div_data();
    d.Value = this.Value;
    d.PaintColor = this.PaintColor.Clone();
    d.ClassMark = this.ClassMark.Clone();
    d.ODLinePat = this.ODLinePat.Clone()
    return d;
}

var strContour_Data_Regular_interval = function () {
    //等値線モード設定（属性データ）
    this.bottom; // Double
    this.Interval; // Double
    this.top; // Double
    this.Line_Pat = new Line_Property();
    this.SP_Bottom; // Double
    this.SP_interval; // Double
    this.SP_Top; // Double
    this.SP_Line_Pat = new Line_Property();
    this.EX_Value_Flag; // Boolean
    this.EX_Value; // Double
    this.EX_Line_Pat = new Line_Property();
}
var strContour_Data_Irregular_interval = function () {
    this.Value; // Double
    this.Line_Pat = new Line_Property();
}
strContour_Data_Irregular_interval.prototype.Clone = function () {
    let ir = new strContour_Data_Irregular_interval();
    ir.Value = this.Value;
    ir.Line_Pat = this.Line_Pat.Clone();
    return ir;
}

var enmContourIntervalMode = {
    RegularInterval: 0,
    SeparateSettings: 1,
    ClassPaint: 2,
    ClassHatch: 3
}
var strContour_Data = function () {
    this.Interval_Mode; // enmContourIntervalMode
    this.Draw_in_Polygon_F; // Boolean
    this.Spline_flag; // Boolean
    this.Detailed; // Integer
    this.Regular = new strContour_Data_Regular_interval();
    this.IrregularNum; // Integer
    this.Irregular = []; // strContour_Data_Irregular_interval
}
strContour_Data.prototype.Clone = function () {
    let d = new strContour_Data();
    Object.assign(d, this);
    d.Regular = new strContour_Data_Regular_interval();
    Object.assign(d.Regular, this.Regular);
    d.Regular.Line_Pat = this.Regular.Line_Pat.Clone();
    d.Regular.SP_Line_Pat = this.Regular.SP_Line_Pat.Clone();
    d.Regular.EX_Line_Pat = this.Regular.EX_Line_Pat.Clone();
    d.Irregular = [];
    for (let i in this.Irregular) {
        d.Irregular.push(this.Irregular[i].Clone());
    }
    return d;
}

var strContour_Line_property = function () {
    this.Flag; // Boolean
    this.Layernum; // Integer
    this.DataNum; // Integer
    this.Value; // Double
    this.NumOfPoint; // Integer
    this.PointStac; // Integer
    this.Circumscribed_Rectangle = new rectangle(); 
}
//線引きモード（属性データ）
var strClassODMode_data = function () {
    this.o_Layer; // Integer
    this.O_object; // Integer
    this.Dummy_ObjectFlag; // Boolean
    this.Arrow = new Arrow_Data();
}
strClassODMode_data.prototype.Clone=function(){
    let d=new strClassODMode_data();
    d.o_Layer=this.o_Layer;
    d.O_object=this.O_object;
    d.Dummy_ObjectFlag=this.Dummy_ObjectFlag;
    d.Arrow=this.Arrow.Clone();
    return d;
}
var enmMarkTurnDirection = {
    AntiClockwise: 0,
    Clockwise: 1
}
//記号の回転モード
var strMarkTurnMode_Data = function () {
    this.Dirction;// enmMarkTurnDirection //0:反時計回り　1:時計回り
    this.Mark = new Mark_Property();
    this.DegreeLap;// Double '一周の値
}
strMarkTurnMode_Data.prototype.Clone = function () {
    let d = new strMarkTurnMode_Data();
    d.Dirction = this.Dirction;
    d.DegreeLap = this.DegreeLap;
    d.Mark = this.Mark.Clone();
    return d;
}

//データ項目ごとの単独表示モードのプロパティを保持する構造体
var strSoloModeViewSettings_Data = function () {
    this.Div_Num;  //Integer
    this.Div_Method;  //enmDivisionMethod
    this.ClassPaintMD = new strClassPaint_Data();
    this.MarkCommon = new strMarkCommon_Data();
    this.MarkSizeMD = new strMarkSize_Data();
    this.MarkBlockMD = new strMarkBlock_Data();
    this.MarkBarMD = new strMarkBar_Data();
    this.StringMD = new strString_Data();
    this.ContourMD = new strContour_Data();
    this.ClassODMD = new strClassODMode_data();
    this.ClassMarkMD=new strInner_Data_Info();
    this.MarkTurnMD = new strMarkTurnMode_Data();
    this.Class_Div = [];  //strClass_Div_data;
}
var strStatisticInfo = function () {
    this.Max; //Double
    this.Min; //Double
    this.Ave; //Double
    this.STD; //Double
    this.Sum; //Double
    this.sa; //Double
    this.BeforeDecimalNum; //Integer
    this.AfterDecimalNum; //Integer
}





var enmScaleUnit = {
    centimeter: 0,
    meter: 1,
    kilometer: 2,
    inch: 3,
    feet: 4,
    yard: 5,
    mile: 6,
    syaku: 7,
    ken: 8,
    ri: 9,
    kairi: 10

}

//階級区分の分割方法
var enmDivisionMethod = {
    Free: 0,
    Quantile: 1,
    AreaQuantile: 2,
    StandardDeviation: 3,
    EqualInterval: 4
}

//記号モードなど最大サイズの値
var enmMarkMaxValueType = {
    SelectedDataMax: 0,
    UserSettingValue: 1
}

/** 円グラフ、帯グラフの最大サイズ*/
var enmGraphMaxSize= {
    Fixed : 0,
    Changeable :1
}
/**帯グラフの方向*/
var enmStackedBarChart_Direction= {
    Vertical : 0,
    Horizontal : 1
}
/** 折れ線・棒グラフの最大最小値*/
var enmBarLineMaxMinMode= {
    Auto : 0,
    Manual : 1
}


/**棒・折れ線グラフ枠のパターン */
var enmBarChartFrameAxePattern={
    Whole:0,
    Half:1
}

var enmMultiEnGraphPattern = {
    multiCircle: 0,
    oneCircle: 1
}
var enmKenCodeObjectstructure = {
    MapObj: 0,  //地図ファイル中のオブジェクトの場合
    SyntheticObj: 1 //時系列集計による合成オブジェクトの場合
}


//データ項目の情報
var strData_info = function () {
    this.Title;  //String
    this.Unit;  //String
    this.MissingF;  //Boolean
    this.Note;  //String
    this.DataType;  //enmAttDataType
    // 欠損値のデータ数
    this.MissingValueNum;  //Integer
    // 欠損値を除いたデータ項目中のデータ数
    this.EnableValueNum;  //Integer
    this.Statistics = new strStatisticInfo();
    //  表示モード
    this.ModeData;  //enmSoloMode_Number
    this.SoloModeViewSettings = new strSoloModeViewSettings_Data();//  '単独表示モードごとのプロパティ
    this.Value = [];  //String
}
strData_info.prototype.Clone = function (NoValueFlag=false) {
    let dt = new strData_info;
    dt.Title = this.Title;
    dt.Unit = this.Unit;
    dt.MissingF = this.MissingF;
    dt.Note = this.Note;
    dt.DataType = this.DataType;
    dt.MissingValueNum = this.MissingValueNum;
    dt.EnableValueNum = this.EnableValueNum;
    dt.Statistics =new strStatisticInfo();
    Object.assign(dt.Statistics,this.Statistics);
    dt.ModeData = this.ModeData;
    dts=dt.SoloModeViewSettings;
    dts.Div_Num=this.SoloModeViewSettings.Div_Num;
    dts.Div_Method=this.SoloModeViewSettings.Div_Method;
    dts.Class_Div = [];
    for (let i in this.SoloModeViewSettings.Class_Div) {
        dts.Class_Div[i] = this.SoloModeViewSettings.Class_Div[i].Clone();
    }
    dts.ClassMarkMD = this.SoloModeViewSettings.ClassMarkMD.Clone();
    dts.ClassODMD = this.SoloModeViewSettings.ClassODMD.Clone();
    dts.ClassPaintMD = this.SoloModeViewSettings.ClassPaintMD.Clone();
    dts.ContourMD= this.SoloModeViewSettings.ContourMD.Clone();
    dts.MarkCommon = this.SoloModeViewSettings.MarkCommon.Clone();
    dts.MarkBarMD = this.SoloModeViewSettings.MarkBarMD.Clone();
    dts.MarkBlockMD = this.SoloModeViewSettings.MarkBlockMD.Clone();
    dts.MarkSizeMD = this.SoloModeViewSettings.MarkSizeMD.Clone();
    dts.MarkTurnMD = this.SoloModeViewSettings.MarkTurnMD.Clone();
    dts.StringMD = this.SoloModeViewSettings.StringMD.Clone();
    if (NoValueFlag == false) {
        dt.Value = this.SoloModeViewSettings.Value.concat();
    }
    return dt
}

var strShowViewerLayerInfo = function () {
    //白地図初期属性データのレイヤ情報
    this.Name; //String
    this.MapfileName; //String
    this.UseObjectKind = []; //Boolean
    this.Time = new strYMD();
    this.Shape; //enmShape
}

var stratrData_Info = function () {
    this.Count;//データ項目数
    this.SelectedIndex;//選択中のデータ項目番号
    this.Data = [];//strData_info
}

var strLayerPointLineShape_Data = function () {
    this.LineWidth; //Single
    this.LineEdge = new LineEdge_Connect_Pattern_Data_Info();
    this.PointMark = new Mark_Property();
}
/**ラベルモード全体 */
var strLabelMode_Data_info = function () {
    this.SelectedIndex;// Integer
    this.DataSet = [];// As strLabel_Data
}
strLabelMode_Data_info.prototype.initDataSet = function(){
    this.SelectedIndex=0;
    this.DataSet = [];
    this.AddDataSet();
}

strLabelMode_Data_info.prototype.AddDataSet= function(){
    let d=new strLabel_Data();
    d.initData();
    this.DataSet.push(d);
}

strLabelMode_Data_info.prototype.Clone = function () {
    let d = new strLabelMode_Data_info();
    d.SelectedIndex = this.SelectedIndex;
    for (let i in this.DataSet) {
        d.push(this.DataSet[i].Clone());
    }
    return d;
}

/**ラベルモードの個別データセットの構造体*/
var strLabel_Data = function () {
        this.title; //String
        this.Location_Mark_Flag; //Boolean
        this.Location_Mark=new Mark_Property();
        this.Width; //Single
        this.DataItem=[]; //Integer
        this.DataValue_Font=new Font_Property();
        this.DataValue_Unit_Flag; //Boolean
        this.DataValue_TurnFlag; //Boolean
        this.DataValue_Print_Flag; //Boolean
        this.DataName_Print_Flag; //Boolean
        this.BorderObjectTile=new Tile_Property();
        this.BorderDataTile=new Tile_Property();
        this.BorderLine=new Line_Property();
}
strLabel_Data.prototype.Clone = function () {
    let d = new strLabel_Data();
    Object.assign(d, this);
    d.DataItem = this.DataItem.concat();
    d.Location_Mark = this.Location_Mark.Clone();
    d.DataValue_Font = this.DataValue_Font.Clone();
    d.BorderObjectTile = this.BorderObjectTile.Clone();
    d.BorderDataTile = this.BorderDataTile.Clone();
    d.BorderLine = this.BorderLine.Clone();
    return d;
}
strLabel_Data.prototype.initData = function () {
    this.DataItem = [];
    this.title = "";
    this.Location_Mark = clsBase.Mark();
    this.Location_Mark.WordFont.Size = 1;
    this.Location_Mark_Flag = false;
    this.Width = 30;

    this.DataValue_Font = clsBase.Font();
    this.DataValue_Font.Size = 2;
    this.DataValue_Font.FringeF = true;
    this.DataValue_TurnFlag = true;
    this.DataValue_Unit_Flag = true;
    this.DataValue_Print_Flag = true;
    this.DataName_Print_Flag = true;

    this.ObjectName_Font = clsBase.Font();
    this.ObjectName_Font.Size = 2;
    this.ObjectName_Font.FringeF = true;
    this.ObjectName_Turn_Flag = true;
    this.ObjectName_Print_Flag = true;

    this.BorderLine = clsBase.BlankLine();
    this.BorderDataTile = clsBase.BlancTile();
    this.BorderObjectTile = clsBase.BlancTile();
}


//グラフモード全体の構造体
var strGraphMode_DataSetting_Info= function () {
    this.SelectedIndex;// Integer
    this.DataSet = [];// As strGraph_Data
}
strGraphMode_DataSetting_Info.prototype.initDataSet=function(){
    this.SelectedIndex=0;
    this.DataSet = [];
    this.AddDataSet();
}
strGraphMode_DataSetting_Info.prototype.AddDataSet=function(){
    let d=new strGraph_Data();
    d.initData();
    this.DataSet.push(d);
}
strGraphMode_DataSetting_Info.prototype.Clone=function(){
    let d=new strGraphMode_DataSetting_Info();
    d.SelectedIndex=this.SelectedIndex;
    d.DataSet=Generic.ArrayClone(this.DataSet);
    return d;
}

/**グラフモード個別データセット */
var strGraph_Data= function () {
    this.title; //String
    this.GraphMode; //enmGraphMode
    this.Data=[]; //GraphModeDataItem
    this.En_Obi=new strGraph_Data_En();
    this.Oresen_Bou=new strGraph_Data_Oresen();
}
strGraph_Data.prototype.initData=function(){
    this.title="";
    this.Data=[];
    this.En_Obi=new strGraph_Data_En();
    this.GraphMode=enmGraphMode.PieGraph;
    this.En_Obi.EnSize = 10;
    this.En_Obi.EnSizeMode = enmGraphMaxSize.Changeable;
    this.En_Obi.BoaderLine = clsBase.Line();
    this.En_Obi.AspectRatio = 0.5;
    this.En_Obi.StackedBarDirection = 0;
    this.En_Obi.MaxValueMode = enmMarkMaxValueType.SelectedDataMax;

    this.Oresen_Bou.Size = 10;
    this.Oresen_Bou.Line = clsBase.Line();
    this.Oresen_Bou.AspectRatio = 1;
    this.Oresen_Bou.YmaxMinMode = enmBarLineMaxMinMode.Auto;
    this.Oresen_Bou.BackgroundTile = clsBase.Tile();
    this.Oresen_Bou.BackgroundTile.BlankF = true;
    this.Oresen_Bou.BackgroundTile.Color = new colorRGBA([255,255,255,128]);
    this.Oresen_Bou.BorderLine = clsBase.Line();
    this.Oresen_Bou.FrameAxe = enmBarChartFrameAxePattern.Half;
}

strGraph_Data.prototype.Clone=function(){
    let d=new strGraph_Data();
    Object.assign(d,this);
    d.En_Obi=this.En_Obi.Clone();
    d.Oresen_Bou=this.Oresen_Bou.Clone();
    d.Data=[];
    for(let i in this.Data){
        d.Data.push(this.Data[i].Clone());
    }
    return d;
}

var GraphModeDataItem = function () {
    this.DataNumber;// Integer
    this.Tile = new Tile_Property();
}
GraphModeDataItem.prototype.Clone=function(){
    let d = new GraphModeDataItem();
    d.DataNumber = this.DataNumber;
    d.Tile = this.Tile.Clone();
    return d;
}
var strGraph_Data_En= function () {
    this.EnSizeMode; //enmGraphMaxSize
    this.EnSize; //Single
    this.Value1; //Double
    this.Value2; //Double
    this.Value3; //Double
    this.BoaderLine=new Line_Property();
    this.AspectRatio; //Single
    this.StackedBarDirection; //enmStackedBarChart_Direction
    this.RMAX; //Double
    this.RMIN; //Double
    this.MaxValueMode; //enmMarkMaxValueType
    this.MaxValue; //Double
}
strGraph_Data_En.prototype.Clone=function(){
    let d=new strGraph_Data_En();
    Object.assign(d,this);
    d.BoaderLine=this.BoaderLine.Clone();
    return d;
}
var strGraph_Data_Oresen = function () { //複数表示（折れ線）（属性データ）
    this.Size; //Single
    this.Line=new Line_Property();
    this.AspectRatio; //Single
    this.YmaxMinMode; //enmBarLineMaxMinMode
    this.YMax; //Double
    this.Ymin; //Double
    this.Ystep; //Double
    this.BackgroundTile=new Tile_Property();
    this.BorderLine=new Line_Property();
    this.FrameAxe;//enmBarChartFrameAxePattern
}
strGraph_Data_Oresen.prototype.Clone=function(){
    let d=new strGraph_Data_Oresen();
    Object.assign(d,this);
    d.Line=this.Line.Clone();
    d.BackgroundTile=this.BackgroundTile.Clone();
    d.BorderLine=this.BorderLine.Clone();
    return d;
}

var strLayerModeViewSetting_Data = function () {
   //this.TripMode = new strTripMode_Data_Info;
   this.LabelMode = new strLabelMode_Data_info();
   this.GraphMode = new strGraphMode_DataSetting_Info();
    // 点オブジェクトのペイントモードの記号・線オブジェクトのペイントモードの線幅等設定
    this.PointLineShape = new strLayerPointLineShape_Data;
    // ダミーオブジェクトをクリッピング領域に設定
    this.PolygonDummy_ClipSet_F; //Boolean
}

/**ダミーオブジェクトの配列 */
var strDummyObjectName_and_Code = function () {
    this.code //Integer
    this.Name //String
}
strDummyObjectName_and_Code.prototype.Clone = function () {
    let d = new strDummyObjectName_and_Code();
    d.code = this.code;
    d.Name = this.Name;
    return d;
}

var enmMoveDirection = {
    NextPos: 1,
    PreviousPos: -1
}



var ODBezier_Data= function () {
    this.ObjectPos;//Integer
    this.Data;//Integer
    this.Point=new point();
}
ODBezier_Data.prototype.Clone=function(){
    let d=new ODBezier_Data();
    d.ObjectPos=this.ObjectPos;
    d.Data=this.Data;
    d.Point=Generic.Array2Clone(this.Point);
    return d;
}

var strLayerDataInfo = function () {

    this.Name;//String
    this.MapFileName;//String
    this.MapFileData;//clsMapData
    this.MapFileObjectNameSearch;//clsObjectNameSearch
    this.Shape;//enmShape
    this.Type;//enmLayerType
    this.MeshType;//enmMesh_Number
    this.ReferenceSystem;//enmZahyo_System_Info
    this.Time = new strYMD();
    this.Comment;//String
    this.TripTimeSpan;// = new TripTimeSpan_Info;
    this.TripType;//enmTripPositionType
    // オブジェクトの情報
    this.atrObject = new strObject_Info();
    // データ項目の情報
    this.atrData = new stratrData_Info();
    this.Dummy =[];// new strDummyObjectName_and_Code();
    this.DummyGroup=[];// 番号;
    this.Print_Mode_Layer;//enmLayerMode_Number '0:単独 1:グラフ 2:ラベル 3:移動
    // グラフ表示、ラベル表示、移動表示、点線オブジェクトのペイントモードの記号
    this.LayerModeViewSettings = new strLayerModeViewSetting_Data();

    this.PrtSpatialIndex;//clsSpatialIndexSearch
    this.ObjectGroupRelatedLine = [];//Integer()
    this.ODBezier_DataStac= [];// ;//List(Of ODBezier_Data)
}
strLayerDataInfo.prototype.initLayerData_from_mdrz = function () {
    if (this.MapFileData.Map.ALIN > 0) {
        this.ObjectGRelatedLine = [];
    }
}

/** 線モードのベジェ曲線用の参照地点をRefPointに返す。該当しない場合はfalseを返す*/
strLayerDataInfo.prototype.Get_OD_Bezier_RefPoint = function (ObjPos, DataNum) {
    for (let i = 0; i < this.ODBezier_DataStac.length; i++) {
        let bs = this.ODBezier_DataStac[i];
        if ((bs.Data == DataNum) && (bs.ObjectPos == ObjPos)){
            return { ok: true, RefPoint: bs.Point };
        }
    }
    return { ok: false };
}

/**線モードのベジェ曲線用の参照地点を削除 */
strLayerDataInfo.prototype.Remove_OD_Bezier = function (ObjPos, DataNum) {
    for (let i = 0; i < this.ODBezier_DataStac.length; i++) {
        let bs = this.ODBezier_DataStac[i];
        if ((bs.Data == DataNum) && (bs.ObjectPos == ObjPos)){
            this.ODBezier_DataStac.splice(i,1);
            return;
        }
    }
}

/**線モードのベジェ曲線用の参照地点を追加。存在する場合は変更 */
strLayerDataInfo.prototype.Add_OD_Bezier = function (ObjPos, DataNum,RefPoint) {
    for (let i = 0; i < this.ODBezier_DataStac.length; i++) {
        let bs = this.ODBezier_DataStac[i];
        if ((bs.Data == DataNum) && (bs.ObjectPos == ObjPos)){
            bs.Point=RefPoint.Clone();
            return;
        }
    }
    let newD=new ODBezier_Data();
    newD.Data = DataNum;
    newD.ObjectPos = ObjPos;
    newD.Point = RefPoint.Clone();
    this.ODBezier_DataStac.push(newD);
}

strLayerDataInfo.prototype.initLayerData = function () {
    this.ObjectGRelatedLine = [];
    switch (this.Type) {
        case enmLayerType.Normal:
        case enmLayerType.Mesh:
        case enmLayerType.DefPoint:
            this.Print_Mode_Layer = enmLayerMode_Number.SoloMode;
            let ps = new strLayerPointLineShape_Data();
            ps.LineWidth = 0.5;
            ps.LineEdge = clsBase.LineEdge();
            ps.PointMark = clsBase.Mark();
            ps.PointMark.WordFont.Size = 3;
            this.LayerModeViewSettings.PointLineShape = ps;
            this.LayerModeViewSettings.PolygonDummy_ClipSet_F =false;
            this.LayerModeViewSettings.LabelMode.initDataSet()
            this.LayerModeViewSettings.GraphMode.initDataSet()
            break;
        case enmLayerType.Trip:
            break;
        case enmLayerType.Trip_Definition:
            break;
    }
}

//通常のデータの最初の位置を返す。存在しない場合は-1を返す
strLayerDataInfo.prototype.getFirstNormalDataItem = function () {
    for (let i in this.atrData) {
        if (this.atrData[i].DataType == enmAttDataType.Normal) {
            return i;
        }
    }
    return -1;
}


var strScreen_Setting_Data_Info = function () {
    //画面設定保存用
    this.title;
    this.frmPrint_FormSize = new rectangle();
    this.ScrView = new rectangle();
    this.Screen_Margin= new ScreenMargin();
    this.Accessory_Base;//enmBasePosition
    this.MapScale= new strScale_Attri();
    this.MapTitle= new strTitle_Attri();
    this.DataNote= new strNote_Attri();
    this.AttMapCompass= new clsMapData.strCompass_Attri();
    this.MapLegend= new strLegend_Attri();
    this.ThreeDMode= new strThreeDMode_Set();
}
strScreen_Setting_Data_Info.prototype.Clone=function(){
    let d=new strScreen_Setting_Data_Info();
    Object.assign(d,this);
    d.frmPrint_FormSize=this.frmPrint_FormSize.Clone();
    d.ScrView=this.ScrView.Clone();
    d.Screen_Margin=this.Screen_Margin.Clone();
    d.MapScale =this.MapScale.Clone();
    d.MapTitle =this.MapTitle.Clone();
    d.DataNote =this.DataNote.Clone();
    d.AttMapCompass =this.AttMapCompass.Clone();
    d.MapLegend =this.MapLegend.Clone();
    d.ThreeDMode =this.ThreeDMode.Clone();
    return d;
}

var strOverLay_DataSet_Item_Info = function () {
    this.Layer;
    this.DataNumber;
    this.Print_Mode_Layer;//enmLayerMode_Number
    this.Mode;//enmSoloMode_Number
    this.Legend_Print_Flag;//Boolean
 //   this.TileMapf;//Boolean
 //   this.TileData;//strTileMapViewDataInfo使用しない
}
strOverLay_DataSet_Item_Info.prototype.Clone=function(){
    let d=new strOverLay_DataSet_Item_Info();
    Object.assign(d,this);
    return d;
}

// <summary>
// 重ね合わせモードの個別データセットに関するデータ
// </summary>
// <remarks></remarks>
var strOverLay_Dataset_Info = function () {
    this.title = "";
    this.SelectedIndex = -1;
    this.DataItem = [];// strOverLay_DataSet_Item_Info
    this.Note = "";
}
strOverLay_Dataset_Info.prototype.initData= function () {
    this.SelectedIndex = -1;
    this.title = "";
    this.DataItem = [];// strOverLay_DataSet_Item_Info
    this.Note = "";
 }

// 重ね合わせモード全体のデータ
var strOverLayMOde_Dataset_Info = function () {
    this.SelectedIndex = 0;
    this.DataSet = []; // strOverLay_Dataset_Info)
    // 常に重ねる設定のデータセット・存在しない場合は-1
    this.Always_Overlay_Index = -1;
    this.MarkModePosFixFlag=false;
    this.initDataSet = function () {
        this.Always_Overlay_Index = -1
        this.SelectedIndex = 0;
        this.MarkModePosFixFlag=false;
        this.DataSet = []; // strOverLay_Dataset_Info)
        this.AddDataSet();
    }
    this.AddDataSet = function () {
        let d = new strOverLay_Dataset_Info();
        this.DataSet.push(d);
    }
}

var strSeries_DataSet_Item_Info = function () {//連続表示モード
    this.Layer;
    this.Data;
    this.Print_Mode_Total;// enmTotalMode_Number
    this.Print_Mode_Layer;// enmLayerMode_Number
    this.SoloMode;// enmSoloMode_Number
}
strSeries_DataSet_Item_Info.prototype.Clone=function(){
    let d=new strSeries_DataSet_Item_Info();
    Object.assign(d,this);
    return d;
}

// 連続表示モードの個別データセットの構造体
var strSeries_Dataset_Info = function () {
    this.title = "";
    this.SelectedIndex = -1
    this.DataItem = []; //  strSeries_DataSet_Item_Info

    this.initData = function () {
       this.SelectedIndex = 0;
       this.title = "";
       this.DataItem = [];// List(Of strSeries_DataSet_Item_Info)
    }
    this.AddData = function (LayerIndex, DataIndex, TotalDataViewMode, LayerDataVieMode, SoloViewMode) {
        let d = new strSeries_DataSet_Item_Info()
        d.Layer = LayerIndex;
        d.Data = DataIndex;
        d.Print_Mode_Total = TotalDataViewMode;
        d.Print_Mode_Layer = LayerDataVieMode;
        d.SoloMode = SoloViewMode;
        this.DataItem.push(d);
    }
}
strSeries_Dataset_Info.prototype.Clone=function(){
    let d=strSeries_Dataset_Info();
    Object.assign(d,this);
    for(let i in d.DataItem){
        d.DataItem.push(this.DataItem[i].Clone());
    }
    return d;
}

// 連続表示モード全体の構造体
var strSeriesMode_Dataset_Info = function () {
    this.SelectedIndex;
    this.DataSet = []; //  strSeries_Dataset_Info)
    this.initDataSet = function () {
        this.SelectedIndex=0;
        this.DataSet = []; //  strSeries_Dataset_Info)
        this.AddDataSet();
    }
    this.AddDataSet = function () {
        let d = new strSeries_Dataset_Info()
        this.DataSet.push(d)
    }
}

var  strTotalMode_Info = function () {
    this.OverLay = new strOverLayMOde_Dataset_Info();
    this.Series = new  strSeriesMode_Dataset_Info();
}

//欠損値の設定（属性データ）
var strMissing_set = function () {
    this.Print_Flag; //Boolean
    this.Text; //String
    this.PaintTile = new Tile_Property();
    this.Mark = new Mark_Property();
    this.BlockMark = new Mark_Property();
    this.ClassMark = new Mark_Property();
    this.MarkBar = new Mark_Property();
    this.Label; //String
    this.LineShape = new Line_Property();
}
strMissing_set.prototype.Clone=function(){
    let d=new strMissing_set();
    Object.assign(d,this);
    d.PaintTile = this.PaintTile.Clone();
    d.Mark = this.Mark.Clone();
    d.BlockMark = this.BlockMark.Clone();
    d.ClassMark = this.ClassMark.Clone();
    d.MarkBar = this.MarkBar.Clone();
    d.LineShape = this.LineShape.Clone();
    return d;
}

//代表点と記号表示位置を結ぶデータ（属性データ）
var strSymbol_Lien_Data = function () {
    this.Visible;
    this.Line = new Line_Property();
}
strSymbol_Lien_Data.prototype.Clone=function(){
    let d=new strSymbol_Lien_Data();
    d.Visible=this.Visible;
    d.Line=this.Line.Clone();
    return d;
}

//属性データ基本値（属性データ）
var strBasic_Data = function () {
    this.Lay_Maxn = 0; //Integer
    // 選択中のレイヤ番号
    this.SelectedLayer; //Integer
    this.Print_Mode_Total; //enmTotalMode_Number '0:データ表示 1:重ね合わせ　2:連続
    this.Comment; //String
    this.MDRFileVersion; //Single
    this.FileName; //String
    this.FullPath; //String
    this.DataSourceType; //enmDataSource
}
strBasic_Data.prototype.Clone=function(){
    let d=new strBasic_Data();
    Object.assign(d,this);
    return d;
}

var enmCondition={
    Less : 0,
    LessEqual : 1,
    Equal : 2,
    GreaterEqual : 3,
    Greater : 4,
    NotEqual : 5,
    Include : 6,
    Exclude : 7,
    Head : 8,
    Foot : 9
}
var enmConditionAnd_Or={
    _And : 0,
    _Or :1
}
var strCondition_Limitation_Info= function () {
    this.Data ;// Integer
    this.Condition ;// enmCondition
    this.Val; // String
}
strCondition_Limitation_Info.prototype.Clone=function(){
    let d=new strCondition_Limitation_Info();
    Object.assign(d,this);
    return d;
}
var strCondition_Data_Info= function () {
    this.And_OR;//enmConditionAnd_Or
    this.Condition=[];//strCondition_Limitation_Info
}
strCondition_Data_Info.prototype.Clone=function(){
    let d=new strCondition_Data_Info();
    d.And_OR=this.And_OR;
    d.Condition=Generic.ArrayClone(this.Condition);
    return d;
}

var strCondition_DataSet_Info= function () {
    this.Enabled ;// Boolean
    this.Layer; // Integer
    this.Name; // String
    this.Condition_Class=[]; // List(Of strCondition_Data_Info) '（条件の段階別の条件スタック）
}
strCondition_DataSet_Info.prototype.Clone=function(){
    let d=new strCondition_DataSet_Info();
    Object.assign(d,this);
    d.Condition_Class = Generic.ArrayClone(this.Condition_Class);
    return d;
}


//属性データ全体に関わるデータ（属性データ）
var Total_Data_Info = function () {
    this.LV1 = new strBasic_Data();
    this.TotalMode = new strTotalMode_Info;
    this.ViewStyle = new strViewStyle_Info();
    this.FigureStac = [];
    this.Condition = [];//strCondition_DataSet_Info

    this.initTotalData = function () {
        this.TotalMode.OverLay.initDataSet();
        this.TotalMode.Series.initDataSet();
        this.ViewStyle.initViewStyle();
        this.FigureStac = [];
        this.Condition = [];
    }

}

var strDummyObjectPointMark_Info = function () {
    this.ObjectKindName; //String
    this.mark=new Mark_Property(); //Mark_Property
}
strDummyObjectPointMark_Info.prototype.Clone=function(){
    let d=new strDummyObjectPointMark_Info();
    d.ObjectKindName=this.ObjectKindName;
    d.mark=this.mark.Clone();
    return d;
}

var strLegend_Base_Attri = function () {
    this.Visible; //Boolean
    this.Legend_Num; //Integer
    this.Font; //Font_Property
    this.Back; //BackGround_Box_Property
    this.LegendXY = []; // As PointF
    this.Comma_f; //Boolean
    this.ModeValueInScreenFlag;
}
strLegend_Base_Attri.prototype.Clone =function(){
    let d=new strLegend_Base_Attri();
    Object.assign(d,this);
    d.Font=this.Font.Clone();
    d.Back=this.Back.Clone();
    dispatchEvent.LegendXY=Generic.ArrayClone(this.LegendXY);
    return d;
}

var enmCircleMDLegendLine = {
    Zigzag :0,
    Straight : 1
}

var strClassBoundaryLine_Info = function () {
    this.Visible;
    this.LPat = new Line_Property();
}
strClassBoundaryLine_Info.prototype.Clone =function(){
    let d=new strClassBoundaryLine_Info();
    d.Visible=this.Visible;
    d.LPat=this.LPat.Clone();
    return d;
}
var strLegend_Class_Attri = function () {
    this.PaintMode_Line = new Line_Property();
    this.PaintMode_Method; //enmClassMode_Meshod
    this.CategorySeparate_f; //Boolean
    this.PaintMode_Width; //Single
    this.ClassMarkFrame_Visible; //Boolean
    this.SeparateClassWords; //enmSeparateClassWords
    this.SeparateGapSize; //Single
    this.ClassBoundaryLine = new strClassBoundaryLine_Info();
    this.FrequencyPrint; //Boolean
}
strLegend_Class_Attri.prototype.Clone =function(){
    let d=new strLegend_Class_Attri();
    Object.assign(d,this);
    d.PaintMode_Line=this.PaintMode_Line.Clone();
    d.ClassBoundaryLine=this.ClassBoundaryLine.Clone();
    return d;
}

var strLegend_Mark_Attri = function () {
    this.CircleMD_CircleMini_F; //Boolean
    this.MultiEnMode_Line = new Line_Property();
}
strLegend_Mark_Attri.prototype.Clone =function(){
    let d=new strLegend_Mark_Attri();
    Object.assign(d,this);
    return d;
}

var strLegend_Line_Dummy_Attri = function () {
    this.Line_Visible; //Boolean
    this.Line_Visible_Number_STR; //String '線種ごとに表示するかどうか、１は表示０は非表示で連続文字列
    this.Line_Pattern; //enmCircleMDLegendLine
    this.Dummy_Point_Visible; //Boolean
    this.Back = new BackGround_Box_Property();
}
strLegend_Line_Dummy_Attri.prototype.Clone =function(){
    let d=new strLegend_Line_Dummy_Attri();
    Object.assign(d,this);
    d.Back=this.Back.Clone();
    return d;
}

var strOverLay_Legend_Title_Info = function () {
    this.Print_f;
    this.MaxWidth;
}
strOverLay_Legend_Title_Info.prototype.Clone=function(){
    let d=new strOverLay_Legend_Title_Info();
    Object.assign(d,this);
    return d;
}  

var strLegend_Attri = function () {
    this.Base = new strLegend_Base_Attri();
    this.OverLay_Legend_Title = new strOverLay_Legend_Title_Info();
    this.ClassMD = new strLegend_Class_Attri();
    this.MarkMD = new strLegend_Mark_Attri();
    this.Line_DummyKind = new strLegend_Line_Dummy_Attri();
    this.En_Graph_Pattern; //enmMultiEnGraphPattern
}
strLegend_Attri.prototype.Clone = function () {
    let d = new strLegend_Attri();
    d.Base = this.Base.Clone();
    d.OverLay_Legend_Title = this.OverLay_Legend_Title.Clone();
    d.ClassMD = this.ClassMD.Clone();
    d.MarkMD = this.MarkMD.Clone();
    d.Line_DummyKind = this.Line_DummyKind.Clone();
    d.En_Graph_Pattern = this.En_Graph_Pattern; //enmMultiEnGraphPattern
    return d;
}
var strLatLonLine_Print_Info = function () {
    this.Visible;
    this.Order;//enmLatLonLine_Order
    this.Lat_Interval;
    this.Lon_Interval;
    this.LPat = new Line_Property();
    this.OuterPat = new Line_Property();
    this.Equator = new Line_Property();
}
strLatLonLine_Print_Info.prototype.Clone = function () {
    let d = new strLatLonLine_Print_Info();
    Object.assign(d, this);
    d.LPat = this.LPat.Clone();
    d.OuterPat = this.OuterPat.Clone();
    d.Equator = this.Equator.Clone();
    return d;
}

var strAccessoryGroupBox_Info = function () {
    this.Visible ;  // Boolean
    this.Back = new BackGround_Box_Property();
    this.Title ;  // Boolean
    this.Comapss ;  // Boolean
    this.Scale ;  // Boolean
    this.Legend ;  // Boolean
    this.Note ;  // Boolean
    this.LinePattern ;  // Boolean
    this.ObjectGroup ;  // Boolean
}
strAccessoryGroupBox_Info.prototype.Clone=function(){
    let d=new strAccessoryGroupBox_Info();
    Object.assign(d,this);
    d.Back=this.Back.Clone();
    return d;
}
var strScreen_Back_data=function(){
    this.MapAreaFrameLine =new Line_Property();
    this.ScreenFrameLine=new Line_Property();
    this.ScreenAreaBack =new Tile_Property();
    this.MapAreaBack  =new Tile_Property();
    this.ObjectInner  =new Tile_Property();
}
strScreen_Back_data.prototype.Clone=function(){
    let d=new strScreen_Back_data();
    d.MapAreaFrameLine = this.MapAreaFrameLine.Clone();
    d.ScreenFrameLine = this.ScreenFrameLine.Clone();
    d.ScreenAreaBack = this.ScreenAreaBack.Clone();
    d. MapAreaBack= this.MapAreaBack.Clone();
    d.ObjectInner= this.ObjectInner.Clone();
    return d;
}

var strValueShow_Info = function () {
    this.ValueVisible;//Boolean
    this.ValueFont = new Font_Property();
    this.DecimalSepaF;//Boolean
    this.DecimalNumber ;
    this.ObjNameVisible;//Boolean
    this.ObjNameFont = new Font_Property();
}
strValueShow_Info.prototype.Clone = function () {
    let d = new strValueShow_Info();
    d.ValueVisible = this.ValueVisible;
    d.ValueFont = this.ValueFont.Clone();
    d.DecimalSepaF = this.DecimalSepaF;
    d.DecimalNumber = this.DecimalNumber;
    d.ObjNameVisible = this.ObjNameVisible;
    d.ObjNameFont = this.ObjNameFont.Clone();
    return d;
}

var strSouByou_Info=function(){
    this.Auto ;// Boolean
    this.AutoDegree;//(1-5の値)
    this.ThinningPrint_F ;// Boolean
    this.PointInterval ;// Single
    this.LoopAreaF ;// Boolean
    this.LoopSize ;// Single
    this.Spline_F ;// Boolean
}
strSouByou_Info.prototype.Clone =function(){
    let d=new strSouByou_Info();
    Object.assign(d,this);
    return d;
}

//飾りの設定を保持（属性データ）
var strViewStyle_Info = function () {
    this.ScrData = new Screen_info();
    this.MapScale = new strScale_Attri();
    this.MapTitle = new strTitle_Attri();
    this.DataNote = new strNote_Attri();
    this.AttMapCompass = new strCompass_Attri();
    this.MapLegend = new strLegend_Attri()
    this.FigureVisible; //Boolean
    this.AccessoryGroupBox = new strAccessoryGroupBox_Info();
    this.Missing_Data = new strMissing_set();
    this.Screen_Back =  new strScreen_Back_data();
    this.SymbolLine = new strSymbol_Lien_Data();
    this.Trip_Line; // =  new strTrip_Line_Data
    this.PointPaint_Order; //enmPointOnjectDrawOrder
    this.Dummy_Size_Flag; //Boolean
    this.MeshLine = new Line_Property();
    this.TileLicenceFont = new Font_Property();
    this.ObjectLimitationF; //Boolean
    this.InVisibleObjectBoundaryF; //Boolean
    // Key:地図ファイル、Value:点オブジェクトのダミー表示時記号
    this.DummyObjectPointMark = []; // = new Dictionary(Of String, strDummyObjectPointMark_Info())
    this.MapPrint_Flag; //Boolean

    this.LatLonLine_Print = new strLatLonLine_Print_Info();
    this.SouByou= new strSouByou_Info();
    this.TileMapView = new strTileMapViewInfo();

    this.Screen_Setting = []; //List(Of strScreen_Setting_Data_Info)
    this.ValueShow = new strValueShow_Info();
    this.Zahyo = new Zahyo_info();
}
strViewStyle_Info.prototype.Clone = function () {
    let d = new strViewStyle_Info();
    d.ScrData = this.ScrData.Clone();
    d.MapScale = this.MapScale.Clone();
    d.MapTitle = this.MapTitle.Clone();
    d.DataNote = this.DataNote.Clone();
    d.AttMapCompass = this.AttMapCompass.Clone();
    d.MapLegend = this.MapLegend.Clone();
    d.FigureVisible = this.FigureVisible;
    d.AccessoryGroupBox = this.AccessoryGroupBox.Clone();
    d.Missing_Data = this.Missing_Data.Clone();
    d.Screen_Back = this.Screen_Back.Clone();
    d.SymbolLine = this.SymbolLine.Clone();
    //  d.Trip_Line =  this.Trip_Line; // =  new strTrip_Line_Data
    d.PointPaint_Order = this.PointPaint_Order; //enmPointOnjectDrawOrder
    d.Dummy_Size_Flag = this.Dummy_Size_Flag; //Boolean
    d.MeshLine = this.MeshLine.Clone();
    d.TileLicenceFont = this.TileLicenceFont.Clone();
    d.ObjectLimitationF = this.ObjectLimitationF; //Boolean
    d.InVisibleObjectBoundaryF = this.InVisibleObjectBoundaryF; //Boolean
    d.DummyObjectPointMark = Generic.ArrayClone(this.DummyObjectPointMark);
    d.MapPrint_Flag = this.MapPrint_Flag; //Boolean
    
    d.SouByou = this.SouByou.Clone();
    d.LatLonLine_Print = this.LatLonLine_Print.Clone();
    d.TileMapView = this.TileMapView.Clone();

    d.Screen_Setting = Generic.ArrayClone(this.Screen_Setting);
    d.ValueShow = this.ValueShow.Clone();
    d.Zahyo = this.Zahyo.Clone();
    return d;
}
strViewStyle_Info.prototype.initViewStyle = function () {
    let md = this.Missing_Data;
    md.Print_Flag = true;
    md.Text = "欠損値";
    md.PaintTile = clsBase.Tile();
    md.PaintTile.BlankF = true;
    md.Mark = clsBase.Mark();
    md.Mark.ShapeNumber = 6
    md.BlockMark = clsBase.Mark();
    md.BlockMark.Tile.Color = new colorRGBA([255, 255, 255]);
    md.BlockMark.ShapeNumber = 6;
    md.ClassMark = clsBase.Mark();
    md.ClassMark.wordmark = "NA";
    md.ClassMark.WordFont.Color = new colorRGBA([0, 0, 0]);
    md.ClassMark.PrintMark = enmMarkPrintType.Word;
    md.BlockMark.ShapeNumber = 6;
    md.MarkBar = clsBase.Mark();
    md.MarkBar.ShapeNumber = 6;
    md.MarkBar.Tile.Color = new colorRGBA([255, 255, 255]);
    md.Label = "欠損値";

    this.SymbolLine.Visible = false;
    this.SymbolLine.Line = clsBase.Line();
    this.Dummy_Size_Flag = true;

    let sb = this.SouByou;
    sb.Auto=true;
    sb.AutoDegree=2;
    sb.LoopSize = 0;
    sb.PointInterval = 0;
    sb.Spline_F = false;
    sb.ThinningPrint_F = false;
    sb.LoopAreaF = false;

    let tb = this.TileMapView;
    tb.Visible = false;
    tb.TileMapDataSet = tileMapClass.getTileMapData('k_cj4');
    tb.AlphaValue = 0.8;
    tb.DrawTiming = enmDrawTiming.BeforeDataDraw;

    let sm = this.ScrData.Screen_Margin;
    sm.rect=new rectangle( 4,20, 4.5 ,10);
    sm.ClipF = false;
    let st = this.ScrData.ThreeDMode;
    st.Set3D_F = false;
    st.Pitch = 65;
    st.Head = 0;
    st.Bank = 0;
    st.Expand = 100;
    this.ScrData.Accessory_Base = enmBasePosition.Screen;

    this.MapPrint_Flag = true;
    this.FigureVisible = true;
    this.MapLegend = new strLegend_Attri();
    let ml = this.MapLegend;
    ml.En_Graph_Pattern = enmMultiEnGraphPattern.multiCircle;
    let mlb = ml.Base;
    mlb.Visible = true;
    mlb.Comma_f = true;
    mlb.Font = clsBase.Font();
    mlb.Font.Size = 3.5;
    mlb.Back = clsBase.WhiteBackground();
    mlb.ModeValueInScreenFlag = false;
    mlb.Back.Line.Edge_Connect_Pattern.Edge_Pattern = enmEdge_Pattern.Rectangle;
    mlb.Back.Line.Edge_Connect_Pattern.Join_Pattern = enmJoinPattern.Miter;
    mlb.Legend_Num = 1;
    mlb.LegendXY = [];

    ml.OverLay_Legend_Title.Print_f = true;
    ml.OverLay_Legend_Title.MaxWidth = 30

    let cmd = ml.ClassMD;
    cmd.PaintMode_Line = clsBase.Line();
    cmd.PaintMode_Line.Edge_Connect_Pattern.Edge_Pattern = 1;
    cmd.PaintMode_Line.Edge_Connect_Pattern.Join_Pattern = 2;
    cmd.PaintMode_Method = enmClassModE_Meshod.Noral;
    cmd.CategorySeparate_f = true;
    cmd.PaintMode_Width = 1.2;
    cmd.SeparateGapSize = 0.2;
    cmd.ClassMarkFrame_Visible = false;
    cmd.SeparateClassWords = enmSeparateClassWords.Japanese;
    cmd.FrequencyPrint = false;
    cmd.ClassBoundaryLine.Visible = false;
    cmd.ClassBoundaryLine.LPat = clsBase.BoldLine();
    cmd.ClassBoundaryLine.LPat.Width=0.5;
    cmd.ClassBoundaryLine.LPat.Color = new colorRGBA([0xbf, 0, 0, 255]);

    ml.MarkMD.MultiEnMode_Line = clsBase.Line();
    ml.MarkMD.CircleMD_CircleMini_F = true;

    ml.Line_DummyKind.Line_Visible =false;
    ml.Line_DummyKind.Back=clsBase.WhiteBackground();
    ml.Line_DummyKind.Line_Pattern=enmCircleMDLegendLine.Zigzag;
    ml.Line_DummyKind.Dummy_Point_Visible=false;
    ml.Line_DummyKind.Line_Visible_Number_STR = "" //ここの設定は後で

    let agb = this.AccessoryGroupBox;
    agb.Visible = false;
    agb.Back = clsBase.WhiteBackground();
    agb.Back.Line.BlankF = false;
    agb.Back.Line.Color= new colorRGBA([180,180,180,255]);
    agb.Legend = true;
    agb.Title = true;
    agb.Comapss = true;
    agb.Scale = true;
    agb.ObjectGroup = true;
    agb.LinePattern = true;
    agb.Note = true;

    let mtl = this.MapTitle;
    mtl.Visible = true;
    mtl.MaxWidth = 70;
    mtl.Font = clsBase.Font();
    mtl.Font.Size = 5;
    mtl.Font.Back = clsBase.WhiteBackground();

    let mdn = this.DataNote;
    mdn.Visible = true;
    mdn.MaxWidth = 20;
    mdn.Font = clsBase.Font();
    mdn.Font.Size = 2.5;
    mdn.Font.Back = clsBase.WhiteBackground();

    let msl = this.MapScale;
    msl.Visible = true;
    msl.Font = clsBase.Font();
    msl.Font.Size = 3.5;
    msl.BarAuto = true;
    msl.BarPattern = enmScaleBarPattern.Thin;
    msl.BarDistance = 0;
    msl.BarKugiriNum = 2;
    msl.Back = clsBase.WhiteBackground();
    msl.Back.Line = clsBase.BlankLine();
    msl.Unit = enmScaleUnit.kilometer;

    let mll = this.LatLonLine_Print;
    //緯度経度地図データの場合は，initTotalData_andOtherで設定
    mll.Visible = false;
    mll.Order = 0;
    mll.LPat = clsBase.Line();
    mll.LPat.Color = new colorRGBA([200, 200, 200]);
    mll.Lat_Interval = 1;
    mll.Lon_Interval = 1;
    mll.OuterPat = clsBase.Line();
    mll.Equator = clsBase.Line();

    let mvs = this.ValueShow;
    mvs.ObjNameVisible = false;
    mvs.ObjNameFont = clsBase.Font();
    mvs.ObjNameFont.Size = 2.5;
    mvs.ObjNameFont.FringeF = true;
    mvs.ObjNameFont.FringeColor = clsBase.ColorWhite();
    mvs.ValueVisible = false;
    mvs.DecimalSepaF = false;
    mvs.DecimalNumber = 0;
    mvs.ValueFont = clsBase.Font();
    mvs.ValueFont.Size = 2.5;
    mvs.ValueFont.FringeF = true;
    mvs.ValueFont.FringeColor = clsBase.ColorWhite();

    this.PointPaint_Order = enmPointOnjectDrawOrder.LowerToUpperCategory;
    this.MeshLine = clsBase.BlankLine();

    let msb = this.Screen_Back;
    msb.MapAreaFrameLine = clsBase.BlankLine();
    msb.MapAreaFrameLine.BlankF = true;
    msb.ScreenFrameLine = clsBase.BlankLine();
    msb.MapAreaBack = clsBase.BlancTile();
    msb.MapAreaBack.Color = new colorRGBA([255, 255, 250]);
    msb.ScreenAreaBack = clsBase.BlancTile();
    msb.ScreenAreaBack.Color = new colorRGBA([255, 255, 240]);
    msb.ObjectInner = clsBase.BlancTile();
    msb.ObjectInner.BlankF = true;
    msb.ObjectInner.Color = new colorRGBA([210, 255, 210, 255]);

    this.Screen_Setting = [];
    this.ObjectLimitationF = false;
    this.InVisibleObjectBoundaryF = true;
}



//スケール設定（属性データ）
var strScale_Attri = function () {
    this.Visible; //Boolean
    this.Position = new point();
    this.Font = new Font_Property();
    this.BarPattern; //enmScaleBarPattern
    this.BarAuto; //Boolean
    this.BarDistance; //Single
    this.BarKugiriNum; //Integer
    this.Back = new BackGround_Box_Property();
    this.Unit; //enmScaleUnit
}
strScale_Attri.prototype.Clone = function () {
    let s = new strScale_Attri();
    s.Visible=this.Visible; 
    s.Position=this.Position.Clone();
    s.Font=this.Font.Clone() ;
    s.BarPattern=this.BarPattern; 
    s.BarAuto= this.BarAuto; 
    s.BarDistance= this.BarDistance; 
    s.BarKugiriNum= this.BarKugiriNum; //Integer
    s.Back = this.Back.Clone();
    s.Unit= this.Unit; 
    return s;
}

//注釈設定（属性データ）
var strNote_Attri = function () {
    this.Visible; //Boolean
    this.Position = new point();
    this.MaxWidth; //Single
    this.Font = new Font_Property();
}
strNote_Attri.prototype.Clone = function () {
    let v = new strNote_Attri();
    v.Visible=this.Visible; //Boolean
    v.Position=this.Position.Clone();
    v.MaxWidth=this.MaxWidth; //Single
    v.Font = this.Font.Clone();
    return v;
}

//タイトル設定（属性データ）
var strTitle_Attri = function () {
    this.Visible; //Boolean
    this.Position = new point();
    this.MaxWidth; //Single
    this.Font = new Font_Property();
}
strTitle_Attri.prototype.Clone = function () {
    let t = new strTitle_Attri();
    t.Visible=this.Visible; 
    t.Position = this.Position.Clone();
    t.MaxWidth=this.MaxWidth;
    t.Font = this.Font.Clone();
    return t;
}

var Magnification = function () {
    this.Xplus; // Single
    this.YPlus; // Single
    this.Mul; // Single
}
Magnification.prototype.Clone=function(){
    let d=new Magnification();
    Object.assign(d,this);
    return d;
}

var ScreenMargin = function () {
    this.ClipF; //Boolean
    this.rect = new rectangle();
}
ScreenMargin.prototype.Clone=function(){
    let d=new ScreenMargin();
    d.ClipF=this.ClipF;
    d.rect=this.rect.Clone();
    return d;
}
var enmOutputDevice = {
    Screen: 0,
    Printer: 1,
    EMF: 2
}
var enmKenCodeObjectstructure = {
    MapObj: 0,   //地図ファイル中のオブジェクトの場合
    SyntheticObj: 1 //時系列集計による合成オブジェクトの場合
}

//3Dモードの回転に使用（属性データ）
var strThreeDMode_Set = function () {
    this.Set3D_F; //Boolean
    this.Pitch; //Integer
    this.Head; //Integer
    this.Bank; //Integer
    this.Expand; //Integer
}
strThreeDMode_Set.prototype.Clone=function(){
    let d=new strThreeDMode_Set();
    Object.assign(d,this);
    return d;
}
var Screen_info = function () {
    this.FirstScreenMGMul; //Single '全体が表示してある場合の拡大係数(MDRには保存しない)
    this.GSMul; //Double '地図サイズに対するウィンドウサイズの比(MDRには保存しない)
    // MapRectangleの面積と同等の正方形の対角線の長さ
    this.STDWsize; //Single
    //  '地図中の画面に表示したい領域（地図座標）
    this.ScrView = new rectangle(); //旧wx1など
    // 画面領域四隅の地図座標
    this.ScrRectangle = new rectangle(); //旧S_Wx1など
    // 地図の領域全体の地図座標
    this.MapRectangle = new rectangle();   //旧F_Wx1など
    // 画面の四隅の座標（0,0,width,bottom）
    this.MapScreen_Scale = new rectangle();  //pictureboxの大きさ.Left=0  .Top=0  .bottom=Scalebottom  .Top=scaleTop
    // 地図座標を画面座標に変換する際の拡大係数とXY座標の平行移動値
    this.ScreenMG = new Magnification(); //旧mul,xp,yp
    this.OutputDevide; //enmOutputDevice
    this.PrinterMG = new Magnification(); //旧Prtmul,xp,yp
    // 画面上下左右端のマージン
    this.Screen_Margin = new ScreenMargin() //画面のマージン
    this.frmPrint_FormSize = new rectangle();  //frmPrintのウィンドウ自体の位置とサイズ
    this.Accessory_Base; //enmBasePosition '飾り等のサイズを地図領域でなくpictureboxの大きさに比例させる場合true
    this.SampleBoxFlag; //Boolean 'サンプルのライン、記号等に表示する際にtrueにする
    this.ThreeDMode = new strThreeDMode_Set();

    this.init = function (pictureboxSize, picBoxMargin, MapAllAreaRect, AccessoryBase, SCRViewResetF) {
        // <param name="picturebox">表示するpictureBoxのsize</param>
        // <param name="picBoxMargin">マージンScreenMargin構造体</param>
        // <param name="MapAllAreaRect">地図領域全体の外接四角形</param>
        // <param name="AccessoryBaseSetScreenFlag">飾り等のサイズを地図領域でなくpictureboxの大きさに比例させる場合true</param>
        // <param name="SCRViewResetF">SCRViewResetFを初期化する場合true</param>
        this.Screen_Margin = picBoxMargin;
        this.MapRectangle = MapAllAreaRect.Clone();
        let SCRS = this.ScrView.Clone();
        this.ScrView = MapAllAreaRect.Clone();
        this.Set_PictureBox_and_CulculateMul(pictureboxSize)
        this.FirstScreenMGMul = this.ScreenMG.Mul;
        if (SCRViewResetF == false) {
            this.ScrView = SCRS;
        }
        
        this.Accessory_Base = AccessoryBase;
        this.STDWsize = Math.sqrt((this.MapRectangle.width()) * (this.MapRectangle.height()));
        this.Get_Screen_BaseMul();
        this.SampleBoxFlag = false;
        this.OutputDevide = enmOutputDevice.Screen;
    }
    this.Set_PictureBox_and_CulculateMul = function (Size) {
        let Wwidth = Size.width;
        let Wheight = Size.height;
        let w = Wwidth * (1 - (this.Screen_Margin.rect.left + this.Screen_Margin.rect.right) / 100);
        let H = Wheight * (1 - (this.Screen_Margin.rect.top + this.Screen_Margin.rect.bottom) / 100);

        let FN = w / H;
        let xw = this.ScrView.width();
        let yw = this.ScrView.height();
        let n = xw / yw;
        if (n >= FN) {
            this.ScreenMG.Mul = w / xw;
        } else {
            this.ScreenMG.Mul = H / yw;
        }
        this.ScreenMG.Xplus = (w - xw * this.ScreenMG.Mul) / 2 + Wwidth * this.Screen_Margin.rect.left / 100;
        this.ScreenMG.YPlus = (H - yw * this.ScreenMG.Mul) / 2 + Wheight * this.Screen_Margin.rect.top / 100;
        if (this.OutputDevide != enmOutputDevice.Printer) {
            this.MapScreen_Scale = new rectangle(0, Wwidth, 0, Wheight)
            this.ScrRectangle = new rectangle(this.getSRX(0), this.getSRX(Wwidth), this.getSRY(0), this.getSRY(Wheight));
        } else {
            this.OutputDevide = enmOutputDevice.Screen;
            this.ScrRectangle = new rectangle(this.getSRX(0), this.getSRX(Wwidth), this.getSRY(0), this.getSRY(Wheight));
            this.OutputDevide = enmOutputDevice.Printer;
            this.MapScreen_Scale = this.getSxSy(this.ScrRectangle);
        }
        this.Get_Screen_BaseMul();
    }

    //地図サイズに対する表示領域サイズの比を求める
    this.Get_Screen_BaseMul = function () {

        if (this.Accessory_Base == enmBasePosition.Screen) {
            let s = Math.sqrt(this.ScrView.width() * this.ScrView.height());
            this.GSMul = s / this.STDWsize;
        } else {
            this.GSMul = 1;
        }
    }

    //画面上のピクセルが地図中の何パーセントに当たるか計算
    this.Get_Length_On_BaseMap = function (Pixcel) {
        let a = Pixcel / this.STDWsize * 100 / this.ScreenMG.Mul / this.GSMul;
        if (this.OutputDevide == enmOutputDevice.Printer) {
            a = a / this.PrinterMG.Mul;
        }
        return a;
    }
    //パーセントのサイズが，画面上で何ピクセルかを取得
    this.Get_Length_On_Screen = function (Percentage) {
        if (this.SampleBoxFlag == false) {
            let RR = this.STDWsize * Percentage / 100 * this.ScreenMG.Mul * this.GSMul
            if (this.OutputDevide == enmOutputDevice.Printer) {
                RR = RR * this.PrinterMG.Mul
            }
            return (RR);
        } else {
            return (this.STDWsize * Percentage / 100 * this.FirstScreenMGMul)
        }
    }
    //最大値に占める指定値の割合に面積比例する画面半径を返す
    this.Radius = function(R_Percent, Value, max_Value){
        let RR;
        if (max_Value == 0) {
            RR = 0;
        } else {
            RR = this.STDWsize * R_Percent * this.GSMul / 100 * this.ScreenMG.Mul * Math.sqrt(Value) / Math.sqrt(max_Value) / 2;
        }
        return parseInt(RR)
    }

    //地図X座標をスクリーン座標に
    this.getSx = function (x) {
        let nx = (x - this.ScrView.left) * this.ScreenMG.Mul + this.ScreenMG.Xplus;
        return nx;
    }
    //地図Y座標をスクリーン座標に
    this.getSy = function (y) { return (y - this.ScrView.top) * this.ScreenMG.Mul + this.ScreenMG.YPlus }
    //回転を考慮して地図座標列をスクリーン座標に変換
    this.Get_SxSy_With_3D = function (p1, p2, p3) {
        if ((typeof p1) == 'number') {
            let Pnum = p1;
            let inXY = p2;
            let ReverseGetF = p3;
            if (this.ThreeDMode.Set3D_F == true) {
                let XYPara = Math.sqrt((this.MapRectangle.width()) ** 2 + (this.MapRectangle.height()) ** 2);
                let TurnCenter = this.MapRectangle.centerP();
                let INXY2 = [];
                for (let i = 0; i < Pnum; i++) {
                    INXY2.push(spatial.Trans3D(inXY[i].x, inXY[i].y, 0, TurnCenter, this.ThreeDMode.Expand, this.ThreeDMode.Pitch, this.ThreeDMode.Head, this.ThreeDMode.Bank, XYPara));
                }
                return this.getSxSyArray(Pnum, INXY2, ReverseGetF, true);
            } else {
                let nxy = this.getSxSyArray(Pnum, inXY, ReverseGetF, true);
                return nxy;
            }
        } else if ((p1 instanceof Array) == true) {
            let meshP = [];
            for (let i = 0; i < 4; i++) {
                meshP.push(p1[i].Clone());
            }
            meshP.push(p1[0].Clone);
            return this.Get_SxSy_With_3D(5, meshP, false);
        } else if ((p1 instanceof rectangle) == true) {
            let meshP = [];
            meshP[0] = new point(Rect.left, Rect.top);
            meshP[1] = new point(Rect.right, Rect.top);
            meshP[2] = new point(Rect.right, Rect.bottom);
            meshP[3] = new point(Rect.left, Rect.bottom);
            let pxy = this.Get_SxSy_With_3D(4, meshP, false);
            let minx = pxy(0).x;
            let maxx = pxy(0).x;
            let miny = pxy(0).y;
            let maxy = pxy(0).y;
            for (let i = 1; i < pxy.length; i++) {
                minx = Math.min(minx, pxy(i).x)
                maxx = Math.max(maxx, pxy(i).x)
                miny = Math.min(miny, pxy(i).y)
                maxy = Math.max(maxy, pxy(i).y)
            }
            let ret = new rectangle(minx, maxx, miny, maxy);
            return ret;
        } else if ((p1 instanceof point) == true) {
            let P = [p1.Clone()];
            let Pout = this.Get_SxSy_With_3D(1, P, false);
            return Pout[0];
        }
    }
    //画面上のピクセル数に対応する地図座標のサイズを取得
    this.Get_MapDataSize_from_ScreenPixcel = function (Pixcel) { Pixcel / this.ScreenMG.Mul }
    //余白の四角形を取得
    this.getSXSY_Margin = function () {
        let p1 = new point(this.Screen_Margin.rect.left / 100, this.Screen_Margin.rect.top / 100);
        let p2 = new point(1 - this.Screen_Margin.rect.right / 100, 1 - this.Screen_Margin.rect.bottom / 100);
        let pp1 = this.getSxSy(this.getSRXYfromRatio(p1));
        let pp2 = this.getSxSy(this.getSRXYfromRatio(p2));
        let marginRect = new rectangle(pp1.x, pp2.x, pp1.y, pp2.y);;
        return marginRect;
    }
    //元々の座標を地図座標経由してスクリーン座標XYに変換
    this.getSxSy = function (Point) {
        let newP = new point(this.getSx(Point.x), this.getSy(Point.y))
        return newP;
    }
    /** 元々の四角形座標を地図座標経由してスクリーン座標XYに変換*/
    this.getSxSyRect = function (rect) {
        let L  = new point(rect.left, rect.top);
        let R  = new point(rect.right, rect.bottom);
        let LC  = this.getSxSy(L)
        let RC  = this.getSxSy(R)
        return new rectangle(LC.x,RC.x, LC.y,  RC.y);
    }

    this.getSxSyArray = function (n, XY, ReverseGetF, SamePointCheck) {
        let j;
        let jp;
        let XY2 = [];
        if (ReverseGetF == false) {
            j = 0;
            jp = 1;
        } else {
            j = n - 1;
            jp = -1;
        }

        if (SamePointCheck == true) {
            XY2[0] = this.getSxSy(XY[j]);
            j += jp;
            let newP = 1;
            for (i = 1; i < n; i++) {
                let nXY = this.getSxSy(XY[j]);
                if (nXY.Equals(XY2[newP - 1]) == false) {
                    //一つ前のポイントとスクリーン座標が違う場合は追加する
                    XY2.push(nXY);
                    newP++;
                }
                j += jp;
            }
            if ((newP == 1) && (n > 1)) {
                //短い線で1点になってしまう場合
                newP++;
                XY2[1] = XY2[0].Clone();
            }
        } else {
            for (let i = 0; i < n; i++) {
                XY2[i] =this.getSxSy(XY[j]);
                j += jp;
            }
        }
        return XY2;

    }

    this.getSRX = function (x) {
        let newx = (x - this.ScreenMG.Xplus) /this.ScreenMG.Mul + this.ScrView.left;
        return newx;
    }
    this.getSRY = function (y) {
        newy = (y - this.ScreenMG.YPlus)/ this.ScreenMG.Mul + this.ScrView.top;
        return newy;
    }
    this.getSRXY = function (P) {
        let newx = this.getSRX(P.x);
        let newy = this.getSRY(P.y);
        return new point(newx, newy);
    }

    //線幅を返す（線幅が0の場合は最小値に）
    this.Get_Line_Width = function (Percentage) {
        if (Percentage == 0) {
            return (clsSettingData.MinimumLineWidth*0.2+0.1);
        } else {
            return this.Get_Length_On_Screen(Percentage);
        }
    }

    //画面の上下の位置の相対比（0～1）から画面座標を返す
    this.getSxSyfromRatio = function(p){
        let P2 = new point();
        P2.x = this.ScrRectangle.left + this.ScrRectangle.width() * p.x;
        P2.y = this.ScrRectangle.top + this.ScrRectangle.height() * p.p;
        return this.getSxSy(P2);
    }
    //画面座標から相対比座標を返す
    this.getRatioPfromSxSy = function (p) {
        let P2 = new point(p.x / this.frmPrint_FormSize.width(), p.y / this.frmPrint_FormSize.height());
        return P2;
    }

    //地図座標から相対比座標を返す
    this.getRatioPfromSrxSry = function (p) {
        let p2 = this.getSxSy(P);
        let P3 = new point(p2.X / this.frmPrint_FormSize.width(), p2.y / this.frmPrint_FormSize.height());
        return P3;
    }

    //画面の上下の位置の相対比（0～1）から地図座標に戻す(旧SRX2,SRY2)
    this.getSRXYfromRatio = function (p) {
        let P2 = new point();
        P2.x = this.ScrRectangle.left + this.ScrRectangle.width() * p.x;
        P2.y = this.ScrRectangle.top + this.ScrRectangle.height() * p.y;
        return P2;
    }

}
Screen_info.prototype.Clone=function(){
    let d=new Screen_info();
    Object.assign(d,this);
    d.ScrView = this.ScrView.Clone();
    d.ScrRectangle=this.ScrRectangle.Clone();
    d.MapRectangle=this.MapRectangle.Clone();
    d.MapScreen_Scale=this.MapScreen_Scale.Clone();
    d.ScreenMG=this.ScreenMG.Clone();
    d.PrinterMG=this.PrinterMG.Clone();
    d.Screen_Margin=this.Screen_Margin.Clone();
    d.frmPrint_FormSize=this.frmPrint_FormSize.Clone();
    d.ThreeDMode=this.ThreeDMode.Clone();
    return d;
}

//データ項目データ取得で、欠損値以外の値を取得する際に使用
var strObjLocation_and_Data_info = function () {
    this.ObjLocation;
    this.DataValue;
}

var Overlay_Temporaly_Data_Info = function () {
    this.Printing_Number; // Integer
    this.OverLay_Printing_Flag; // Boolean  '記号やブロックを重ね合わせる際に標示位置をずらすのに使用
    this.OverLay_EMode_N; // Integer '記号モードをずらす際に使用するが、10では使用しない
    this.OverLay_EMode_Now; // Integer
    this.Always_Ove_DataStac; // List(Of strOverLay_Dat//et_Item_Info)
}

var Legend2_Atri = function () {
   this.LineKind_Flag;// Boolean
   this.PointObject_Flag;// Boolean
   this.Layn;// Integer
   this.DatN;// Integer
   this.Print_Mode_Layer;// enmLayerMode_Number
   this.SoloMode;// enmSoloMode_Number
   this.GraphMode;// enmGraphMode
   this.title;// String
   this.Rect =new rectangle();
}
Legend2_Atri.prototype.Clone = function () {
    let La = new Legend2_Atri();
    La.LineKind_Flag = this.LineKind_Flag;
    La.PointObject_Flag = this.PointObject_Flag;
    La.Layn = this.Layn;
    La.DatN = this.DatN;
    La.Print_Mode_Layer = this.Print_Mode_Layer;
    La.SoloMode = this.SoloMode;
    La.GraphMode = this.GraphMode;
    La.title = this.title;
    La.Rect = this.Rect.Clone();
    return La;
}

var AccessoryTemp_Infp = function () {
    this.MapScale_Rect = new rectangle();
    this.MapTitle_Rect = new rectangle();
    this.DataNote_Rect = new rectangle();
    this.MapLegend_W = [];// Legend2_Atri
    this.MapCompass_Rect = new rectangle();
    this.GroupBox_Rect = new rectangle();
    this.Legend_No_Max;// Integer
    this.Push_titleXY = new point();
    this.Push_LegendXY = new point();
    this.Edit_Legend;// Integer
    this.Push_CompassXY = new point();
    this.Push_ScaleXY = new point();
    this.Push_DataNoteXY = new point();
    this.Push_GroupBoxXY = new point();
    this.OriginalGroupBoxRect = new rectangle();
} 
AccessoryTemp_Infp.prototype.Clone = function () {
    let tac = new AccessoryTemp_Infp();
    tac.MapScale_Rect = this.MapScale_Rect.Clone();
    tac.DataNote_Rect = this.DataNote_Rect.Clone();
    tac.MapTitle_Rect = this.MapTitle_Rect.Clone();
    tac.MapCompass_Rect = this.MapCompass_Rect.Clone();
    tac.Legend_No_Max = this.Legend_No_Max;
    tac.Edit_Legend = this.Edit_Legend;
    tac.Push_CompassXY = this.Push_CompassXY.Clone();
    tac.Push_LegendXY = this.Push_LegendXY.Clone();
    tac.Push_ScaleXY = this.Push_ScaleXY.Clone();
    tac.Push_DataNoteXY = this.Push_DataNoteXY.Clone();
    tac.Push_titleXY = this.Push_titleXY.Clone();
    tac.MapLegend_W = Generic.ArrayClone(this.MapLegend_W);
    return tac;

}

//一時データ

let strLocationSearchObject = function (layer, objnumber) {
    this.objLayer = layer;// Integer
    this.ObjNumber = objnumber;//  Integer
}
strLocationSearchObject.prototype.Clone = function () {
    let d = new strLocationSearchObject;
    Object.assign(d, this);
    return d;
}

let strTempLocationMenuString = function () {
    this.ObjectNameValue;// String
    this.ContourStacPos;//  Integer
    this.ClickMapPos = new point();//  PointF
    this.DataIndex;//  Integer
}

let frmPrint_temp_info = function(){
    this.OnObject=[];// List(Of strLocationSearchObject)
    this.OldObject=[];// List(Of strLocationSearchObject)
    this.PrintMouseMode = enmPrintMouseMode.Normal;// enmPrintMouseMode
    this.MultiObjectSelectSub;// enmMultiObjectSelecModesSub
    this.MultiObjectSelectShowFlag;// Boolean
    this.MultiObjects=[];// List(Of Integer)
    this.FigMode;// strFigureMode
    this.mouseAccesoryDragType;// Check_Acc_Result
    this.OD_Drag =new ODBezier_Data();
    this.MouseDownF;// Boolean
    this.LocationMenuString=new strTempLocationMenuString();
    this.RightButtonClickF;// Boolean
    this.SymbolPointFirstMessage;// Boolean
    this.LabelPointFirstMessage;// Boolean
    this.Menu_Enable;// menu_Ename_Info
    this.PointDistanceArea;// List(Of PointF)
    this.image;//出力画面の保存
}

var DotMapTemp_Info= function () {
    this. DotMapTempResetF ;// Boolean
    this. DotMapPoint=[];// As Dictionary(Of Integer, PointF())
}

var strSeries_Temporaly_Data_Info = function () {
    this.Printing_Flag;//Boolean
    this.Koma;//Integer
    this.title;//String
}
var ContourModeTemp_Temporaly_Data_Info = function () {
    this.ContourDataResetF;//Boolean
    this.ContourMesh;//clsMeshContour
    this.Contour_Object = [];//strContour_Line_property
    this.Contour_Point = [];//PointF  '描いた等値線のデータ
    this.Contour_All_Number;//Integer '描いた等値線の全体数
    this.Contour_All_Point;//Integer '描いた等値線のポイント数
}

var ModeValueInScreen_Stac_Info = function () {
    this.setF; // Boolean
    this.LayerNum; // Integer
    this.DataNum; // Integer
    this.divValue = []; // Double
    this.MarkSize_MaxValueMode; // clsAttrData.enmMarkSizeValueMode
    this.MarkSize_MaxValue; // Double
    this.MarkBar_MaxValueMode; // clsAttrData.enmMarkSizeValueMode
    this.MarkBar_MaxValue; // Double
}
var strTem = function () {
    this.Series_temp= new strSeries_Temporaly_Data_Info();
    this.OverLay_Temp = new Overlay_Temporaly_Data_Info();
    this.ContourMode_Temp= new ContourModeTemp_Temporaly_Data_Info();
    this.Trip_Temp; //TripModeTemp_DataInfo
    this.Accessory_Temp = new AccessoryTemp_Infp();
    this.frmPrint_Temp=new frmPrint_temp_info();
    this.FigurePrinted = []; //Boolean
    this.ObjectPrintedCheckFlag = []; //Boolean
    this.PointObjectKindUsedStack = []; //Stack(Of strObjectKindUsed_Info)
    this.drawing;//boolean描画中
    this.DotMap_Temp =new DotMapTemp_Info();
    this.ModeValueInScreen_Stac=new ModeValueInScreen_Stac_Info();
    // 地図の緯度経度の領域
    this.MapAreaLatLon; //RectangleF
    this.SoubyouLayerEnable=[]; //Boolean
    this.SoubyouLoopLineArea=[];
    this.SoubyouLoopAreaCriteria;
    this.SoubyouLinePointIntervalCriteria;
}



var strGetLinePointAPI_Info = function () {
    this.GetF; //Boolean
    this.Drawn; //Boolean
    this.Reverse; //Boolean
    this.Point = []; //Point
}

var enmPrint_Enable = { Printable: 0, Printable_with_Error: 2, UnPrintable: 1 };
var enmPaintColorSettingModeInfo = { twoColor: 0, threeeColor: 1, SoloColor: 2, multiColor: 3 };


var strLayerReadingInfo = function () {
    this.Name;
    this.MapFile;
    this.Time;
    this.Type; //enmLayerType
    this.MeshType;//enmMesh_Number
    //ポイント、メッシュ、移動データの測地系指定
    this.ReferenceSystem;  //enmZahyo_System_Info
    this.Shape; //enmShape
    this.TTL = [];
    this.UNT = [];
    this.DTMis = [];
    this.Note = [];
    this.ObjectDataStac = [];
    this.Dummy_Temp = [];
    this.Dummy_OBKTemp = [];
    this.Comment_Temp;
}
//レイヤの初期化。タイプはNormal形状はNotDefinition
strLayerReadingInfo.prototype.init = function () {
    this.TTL = [];
    this.UNT = [];
    this.DTMis = [];
    this.Note = [];
    this.ObjectDataStac = [];
    this.Dummy_Temp = [];
    this.Dummy_OBKTemp = [];
    this.Comment_Temp = "";
    this.Name = "";
    this.MapFile = "";
    this.Time = clsTime.GetNullYMD();
    this.Type = enmLayerType.Normal;
    this.Shape = enmShape.NotDeffinition;
    this.MeshType = enmMesh_Number.mhNonMesh;
}
var strSaveLinePat_Info=function(){
    this. MapNum ;// Integer
    this. MapFileName=[];//  As String
    this. LpatNumByMapfile=[];//  As Integer
    this. Lpat=[];//  As List(Of clsMapData.LineKind_Data)
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var clsAttrData = function () {
    var defaultColor = {}
    defaultColor.paintMode = [new colorRGBA([0x99, 0x34, 0x4]), new colorRGBA([0xFF, 0xFF, 0xC4])];
    defaultColor.markColorTrance = new colorRGBA([0xff, 0xbf, 0xbf,200]);
    defaultColor.markColor = new colorRGBA([0xff, 0xbf, 0xbf]);
    defaultColor.markBarColor = new colorRGBA([0xff, 0x80, 0x00]);
    defaultColor.minusColor = new colorRGBA([0x55, 0x55, 0xbf]);

    this.TempData = new strTem();


    this.LayerData = []; //strLayerDataInfo
    this.TotalData = new Total_Data_Info(); //Total_Data_Info
    let lv = this.TotalData.LV1;
    lv.Comment = "";
    lv.Lay_Maxn = 0;
    lv.SelectedLayer = 0;
    lv.DataSourceType = enmDataSource.NoData;
    lv.Print_Mode_Total = enmTotalMode_Number.DataViewMode;

    this.MapData = new clsAttrMapData(); //clsAttrMapData
    this.MPSubLine = {}; //strGetLinePointAPI_Info
    this.LineKindUse = []; //Boolean

    //＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊

    /**ダミーオブジェクトグループの設定をDummyOBGArray[true,false]の配列で返す、trueNumはtrueの数 */
    this.getDummyObjGroupArray = function (Layernum, shape = undefined) {
        let al = attrData.LayerData[Layernum];
        let alm = al.MapFileData;
        let DummyObjG = new Array(alm.Map.OBKNum);
        DummyObjG.fill(false);
        let n = 0;
        for (let i = 0; i < al.DummyGroup.length; i++) {
            let objg = al.DummyGroup[i];
            if ((alm.ObjectKind[objg].Shape == shape) || shape == undefined) {
                DummyObjG[objg] = true;
                n++;
            }
        }
        return {DummyOBGArray:DummyObjG,trueNum:n};
    }

    /**設定した状態で描画可能か調べる Print_Enable: enmPrint_Enable.とmessageを返す*/
    this.Get_PrintError=function(){
        
        let LV1E  = false;
        let LV2E  = false;
        let Layernum  = this.TotalData.LV1.SelectedLayer;
        let lay = this.LayerData[Layernum];
        let DataNum  = lay.atrData.SelectedIndex;
        let laydata=this.LayerData[Layernum].atrData.Data[DataNum];
        let mes = "";
        switch (this.TotalData.LV1.Print_Mode_Total) {
            case enmTotalMode_Number.DataViewMode: {
                switch (lay.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        if (this.Get_DataNum(Layernum) == 0) {
                            mes += "データがありません。" + '\n';
                            LV1E = true;
                        } else {
                            let DataMax = laydata.Statistics.Max;
                            let DataMin = laydata.Statistics.Min;
                            let md = laydata.ModeData;
                            if ((md == enmSoloMode_Number.ContourMode) && (
                                (laydata.SoloModeViewSettings.ContourMD.Interval_Mode == enmContourIntervalMode.ClassPaint) || (
                                    laydata.SoloModeViewSettings.ContourMD.Interval_Mode == enmContourIntervalMode.ClassHatch))) {
                                md = enmSoloMode_Number.ClassPaintMode;
                            }
                            switch (md) {
                                case enmSoloMode_Number.ClassPaintMode:
                                case enmSoloMode_Number.ClassMarkMode:
                                case enmSoloMode_Number.ClassODMode: {
                                    let ef = 0;
                                    if (this.Get_DataType(Layernum, DataNum) == enmAttDataType.Normal) {
                                        for (let i = 0; i < laydata.SoloModeViewSettings.Div_Num - 1; i++) {
                                            let v = laydata.SoloModeViewSettings.Class_Div[i].Value;
                                            if ((v > DataMax) || (v < DataMin)) {
                                                ef = 2;
                                            }
                                            if (i != 0) {
                                                if (laydata.SoloModeViewSettings.Class_Div[i - 1].Value <= v) {
                                                    ef = 1;
                                                }
                                            }
                                        }
                                    }
                                    if (ef == 2) {
                                        mes += "区分値の最小値または最大値の値が、データの最小値～最大値の値を越えています。" + '\n';
                                        LV2E = true;
                                    }
                                    if (ef == 1) {
                                        mes += "階級区分の区分値が不正です" + '\n';
                                        LV1E = true;
                                    }
                                    break;
                                }
                                case enmSoloMode_Number.MarkSizeMode:
                                    break;
                                case enmSoloMode_Number.ContourMode: {
                                    let cmd = laydata.SoloModeViewSettings.ContourMD;
                                    switch (cmd.Interval_Mode) {
                                        case enmContourIntervalMode.RegularInterval: {
                                            let cmdr = cmd.Regular;
                                            if (cmdr.Interval <= 0) {
                                                mes += "通常の等値線：間隔は0よりも大きくして下さい。" + '\n';
                                                LV1E = true;
                                            }
                                            if ((cmdr.bottom > DataMax) || (cmdr.top < DataMin)) {
                                                mes += "通常の等値線：下限値または上限値が不正です。" + '\n';
                                                LV1E = true;
                                            }
                                            if (cmdr.top < cmdr.bottom) {
                                                mes += "通常の等値線：下限値が上限値よりも大きくなっています。"
                                                LV1E = true;
                                            }

                                            if (cmdr.SP_interval <= 0) {
                                                mes += "強調する等値線：間隔は0よりも大きくして下さい。" + '\n';
                                                LV1E = true;
                                            }
                                            if ((cmdr.SP_Bottom > DataMax) || (cmdr.SP_Top < DataMin)) {
                                                mes += "強調する等値線：下限値または上限値が不正です。" + '\n';
                                                LV1E = true;
                                            }
                                            if (cmdr.SP_Top < cmdr.SP_Bottom) {
                                                mes += "強調する等値線：下限値が上限値よりも大きくなっています。";
                                                LV1E = true;
                                            }
                                            if ((cmdr.EX_Value_Flag == true) && ((cmdr.EX_Value > DataMax) || (cmdr.top < cmdr.EX_Value))) {
                                                mes += "一本だけ強調する等値線の値が不正です。"
                                                LV2E = true;
                                            }
                                            if (LV1E == false) {
                                                let contn = Math.floor((Math.max(cmdr.top, DataMax) - Math.min(cmdr.bottom, DataMin)) / cmdr.Interval);
                                                if (contn > 100) {
                                                    mes += "等値線が" + contn + "本ほど描かれます。" + '\n';
                                                    LV2E = true;
                                                }
                                            }
                                            break;
                                        }
                                        case enmContourIntervalMode.SeparateSettings: {
                                            if (cmd.IrregularNum == 0) {
                                                mes += "等値線の値を設定してください。" + '\n';
                                                LV1E = true;
                                            } else {
                                                for (let i = 0; i < cmd.IrregularNum; i++) {
                                                    if ((cmd.Irregular[i].Value > DataMax) || (cmd.Irregular[i].Value < DataMin)) {
                                                        mes += "区分値が不正です。" + '\n';
                                                        LV2E = true;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }

                    }
                    case enmLayerMode_Number.GraphMode:{
                        let dset  = lay.LayerModeViewSettings.GraphMode.SelectedIndex;
                        let gdata= lay.LayerModeViewSettings.GraphMode.DataSet[dset];
                        if(gdata.Data.length==0){
                            mes += "表示データが設定されていません。" + '\n';
                            LV1E = true;
                            break;
                        }
                        if((gdata.GraphMode == enmGraphMode.PieGraph)||(gdata.GraphMode == enmGraphMode.StackedBarGraph )){
                                for(let i  = 0 ;i< gdata.Data.length ;i++){
                                    let a  = gdata.Data[i].DataNumber;
                                    if(lay.atrData.Data[a].Statistics.Min < 0 ){
                                        mes += "選択データに負の数が含まれています。" + '\n';
                                        LV1E = true;
                                        break;
                                    }
                                }
                            }
                            if(gdata.length <= 1 ){
                                mes += "選択データが足りません。" + '\n';
                                LV1E = true;
                            }
                        break;
                    }
                    case enmLayerMode_Number.LabelMode:
                        break;
                }
                break;
            }
            case enmTotalMode_Number.OverLayMode: {
                let oset = this.TotalData.TotalMode.OverLay;
                let odata = oset.DataSet[oset.SelectedIndex];
                if (odata.DataItem.length == 0) {
                    mes += "重ね合わせデータが設定されていません。" + '\n';
                    LV1E = true;
                }
                break;
            }
            case enmTotalMode_Number.SeriesMode: {
                let sset = this.TotalData.TotalMode.Series;
                let sdata = sset.DataSet[sset.SelectedIndex];
                if (sdata.DataItem.length == 0) {
                    mes += "連続表示データが設定されていません。" + '\n';
                    LV1E = true;
                }
                break;
            }
        }

        if (LV1E == true) {
            return { Print_Enable: enmPrint_Enable.UnPrintable, message: mes };
        } else {
            if (LV2E == true) {
                return { Print_Enable: enmPrint_Enable.Printable_with_Error, message: mes };
            }
        }
        return { Print_Enable: enmPrint_Enable.Printable, message: mes };
    }

    /** データ挿入 AddMapFileNameF:レイヤ名に地図ファイルを追加する場合true */
this.ADD_AttrData= function( InsertData ,  AddMapFileNameF  ) {

    let ErrorMessage = "";
    if (spatial.Check_Zahyo_Projection_Convert_Enabled(this.TotalData.ViewStyle.Zahyo, InsertData.TotalData.ViewStyle.Zahyo, ErrorMessage) == false) {
        return { ok: false, ErrorMessage: ErrorMessage };
    }
    let Mfile = InsertData.GetMapFileName();
    let ExtMfile = this.GetMapFileName();
    let LayerPlus = this.TotalData.LV1.Lay_Maxn;
    if (InsertData.TotalData.LV1.DataSourceType == enmDataSource.MDRMJ) {
        for (let i = 0; i < Mfile.length; i++) {
            let newMFname = this.getUniqueMapFileName(Mfile[i]);
            this.MapData.AddExistingMapData(InsertData.SetMapFile(Mfile[i]), newMFname);
            for (let j = 0; j < InsertData.TotalData.LV1.Lay_Maxn; j++) {
                if (InsertData.LayerData[j].MapFileName.toUpperCase() == Mfile[i].toUpperCase()) {
                    InsertData.LayerData[j].MapFileName = newMFname;
                }
            }
        }
    } else {
        for (let i = 0; i < Mfile.length; i++) {
            if (ExtMfile.indexOf(Mfile[i]) == -1) {
                this.MapData.AddExistingMapData(InsertData.SetMapFile(Mfile[i]), Mfile[i]);
            }
        }
    }

    InsertData.Convert_Zahyo(this.TotalData.ViewStyle.Zahyo);
    this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo, "");

    if (InsertData.TotalData.LV1.Comment != "") {
        this.TotalData.LV1.Comment += "\n" + InsertData.TotalData.LV1.FileName + "を挿入" + "\n" +
            InsertData.TotalData.LV1.Comment

    }
    //レイヤのコピー
    let nLayer = this.TotalData.LV1.Lay_Maxn + InsertData.TotalData.LV1.Lay_Maxn;
    for (let i = 0; i < InsertData.TotalData.LV1.Lay_Maxn; i++) {
        let il = InsertData.LayerData[i];
        if ((il.Name == "") && (InsertData.TotalData.LV1.Lay_Maxn > 1)) {
            il.Name = (i + 1).toString();
        }
        if (AddMapFileNameF == true) {
            if (il.Name != "") {
                if (InsertData.TotalData.LV1.FileName != "") {
                    il.Name = InsertData.TotalData.LV1.FileName + "：" + il.Name;
                }
            } else {
                il.Name = InsertData.TotalData.LV1.FileName;
            }
        }
        for (let j = 0; j < il.atrData.Count; j++) {
            il.atrData.Data[j].SoloModeViewSettings.ClassODMD.o_Layer += LayerPlus;
        }
        this.LayerData[this.TotalData.LV1.Lay_Maxn + i] = InsertData.LayerData[i];
        this.LayerData[this.TotalData.LV1.Lay_Maxn + i].MapFileData = this.MapData.SetMapFile(InsertData.LayerData[i].MapFileName);
    }
    this.TotalData.LV1.Lay_Maxn = nLayer;

    let itt = InsertData.TotalData.TotalMode;
    //重ね合わせモード
    for (let i = 0; i < itt.OverLay.DataSet.length; i++) {
        let lttd = itt.OverLay.DataSet[i];
        for (let j = 0; j < lttd.DataItem.length; j++) {
            let d = lttd.DataItem[j].Clone();
            d.Layer += LayerPlus;
            lttd.DataItem[j] = d
            if ((itt.OverLay.DataSet.length == 1) && (itt.OverLay.DataSet[0].DataItem.length == 0) && (itt.OverLay.DataSet[0].title == "")) {
            } else {
                this.TotalData.TotalMode.OverLay.DataSet.push(lttd.Clone());
            }
        }
    }

    //連続表示モード
    for (let i = 0; i < itt.Series.DataSet.length; i++) {
        let ltts = itt.Series.DataSet[i];
        for (let j = 0; j < ltts.DataItem.length; j++) {
            let d = ltts.DataItem[j];
            d.Layer += LayerPlus;
            ltts.DataItem[j] = d;
        }
        if ((itt.Series.DataSet.length == 1) && (itt.Series.DataSet[0].DataItem.length == 0) && (itt.Series.DataSet[0].title == "")) {
        } else {
            this.TotalData.TotalMode.Series.DataSet.push(ltts.Clone());
        }
    }

    //表示設定のコピー
    let itv = InsertData.TotalData.ViewStyle;
    for (let i = 0; i < itv.Screen_Setting.length; i++) {
        this.TotalData.ViewStyle.Screen_Setting.push(itv.Screen_Setting[i].Clone());
    }

    for (let i = 0; i < Mfile.length; i++) {
        if (ExtMfile.indexOf(Mfile[i]) == -1) {
            if (itv.DummyObjectPointMark.length > 0) {
                this.TotalData.ViewStyle.DummyObjectPointMark[Mfile[i]] = itv.DummyObjectPointMark[Mfile[i]];
            }
        }
    }


    let it = InsertData.TotalData;
    //条件設定の変換
    for (let i = 0; i < it.Condition.length; i++) {
        let d = it.Condition.Item[i].Clone();
        d.Layer += LayerPlus;
        //it.Condition.Item[i] = d;
        this.TotalData.Condition.push(d);
    }

    //図形モードの変換
    // For wi  = 0 To InsertData.TotalData.FigureStac.Count - 1
    //     let FigStac As Object = InsertData.TotalData.FigureStac(wi)
    //     switch( true
    //         case TypeOf FigStac Is clsAttrData.strFig_Word_Data
    //             let FigData As clsAttrData.strFig_Word_Data = DirectCast(FigStac, clsAttrData.strFig_Word_Data)
    //             if(FigData.Data.Layer != 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Line_Data
    //             let FigData As clsAttrData.strFig_Line_Data = DirectCast(FigStac, clsAttrData.strFig_Line_Data)
    //             if(FigData.Data.Layer != 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Rectangle_Data
    //             let FigData As clsAttrData.strFig_Rectangle_Data = DirectCast(FigStac, clsAttrData.strFig_Rectangle_Data)
    //             if(FigData.Data.Layer != 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Circle_data
    //             let FigData As clsAttrData.strFig_Circle_data = DirectCast(FigStac, clsAttrData.strFig_Circle_data)
    //             if(FigData.Data.Layer != 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_Point_Data
    //             let FigData As clsAttrData.strFig_Point_Data = DirectCast(FigStac, clsAttrData.strFig_Point_Data)
    //             if(FigData.Data.Layer != 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //         case TypeOf FigStac Is clsAttrData.strFig_gazo_data
    //             let FigData As clsAttrData.strFig_gazo_data = DirectCast(FigStac, clsAttrData.strFig_gazo_data)
    //             if(FigData.Data.Layer != 0 ){
    //                 FigData.Data.Layer += LayerPlus
    //             }
    //             this.TotalData.FigureStac.Add(FigData)
    //     }
    // }

    this.Check_Vector_Object()
    this.LinePatternCheck()
    this.PrtObjectSpatialIndex()
    let retV = { ok: true, ErrorMessage: ErrorMessage };
    return retV;
}

    /**データ中の座標を変換する */
    this.Convert_Zahyo= function(newZahyo){
        let oldZahyo = this.TotalData.ViewStyle.Zahyo;
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let li = this.LayerData[i];
            if ((li.Type != enmLayerType.Trip) && (li.Type != enmLayerType.Trip_Definition)) {
                //記号・ラベル表示位置
                for (let j = 0; j < li.atrObject.ObjectNum; j++) {
                    let lia = li.atrObject.atrObjectData[j];
                    lia.CenterPoint = spatial.Get_Reverse_and_Convert_XY(lia.CenterPoint, oldZahyo, newZahyo);
                    lia.Symbol = spatial.Get_Reverse_and_Convert_XY(lia.Symbol, oldZahyo, newZahyo);
                    lia.Label = spatial.Get_Reverse_and_Convert_XY(lia.Label, oldZahyo, newZahyo);
                }
                //ODの参照点
                for (let j = 0; j < li.ODBezier_DataStac.length; j++) {
                    li.ODBezier_DataStac[j].Point = spatial.Get_Reverse_and_Convert_XY(d.Point, oldZahyo, newZahyo);
                }
            }
            if (li.Type == enmLayerType.Mesh) {
                for (let j = 0; j < li.atrObject.ObjectNum; j++) {
                    let lia = li.atrObject.atrObjectData[j];
                    for (let k = 0; k <= 3; k++) {
                        lia.MeshPoint[k] = spatial.Get_Reverse_and_Convert_XY(lia.MeshPoint[k], oldZahyo, newZahyo);
                    }
                    lia.MeshRect = spatial.getCircumscribedRectangle(lia.MeshPoint);
                }
            }

        }

        //図形モード
        for (let i = 0; i < this.TotalData.FigureStac.length; i++) {
            let FigStac = this.TotalData.FigureStac[i];
            switch (true) {
                case FigStac instanceof strFig_Word_Data: {
                    for (let j = 0; j < FigData.StringPos.length; j++) {
                        FigStac.StringPos[j] = spatial.Get_Reverse_and_Convert_XY(FigStac.StringPos[j], oldZahyo, newZahyo);
                    }
                    break;
                }
                case FigStac instanceof strFig_Line_Data: {
                    for (let j = 0; j < FigData.NumOfPoint; j++) {
                        FigStac.Points[j] = spatial.Get_Reverse_and_Convert_XY(FigStac.Points[j], oldZahyo, newZahyo);
                    }
                    break;
                }
                case FigStac instanceof strFig_Circle_data: {
                    FigData.Position = spatial.Get_Reverse_and_Convert_XY(FigStac.Position, oldZahyo, newZahyo);
                    break;
                }
                case FigStac instanceof strFig_Point_Data: {
                    for (let j = 0; j < FigData.NumOfPoint; j++) {
                        FigStac.Points[j] = spatial.Get_Reverse_and_Convert_XY(FigStac.Points[j], oldZahyo, newZahyo);
                    }
                    break;                    
                }
            }
        }
    }

    /**重ね合わせデータセットの内容を自動で並べ替える */
        this.Sort_OverLay_Data = function (DataSetNumber) {
            let d = this.TotalData.TotalMode.OverLay.DataSet[DataSetNumber]
                ; d.DataItem = this.Sort_OverLay_Data_Sub(d.DataItem);
        }

    /**重ね合わせモードにセットするデータを並べ替える（一つのstrOverLay_DataSet_Item_Infoデータセット） */
    this.Sort_OverLay_Data_Sub = function (Ov_Data) {

        let PicUpMode = [];
        let PicUpShape = [];// enmShape

        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("0");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("4");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("3");
        PicUpShape.push(enmShape.LineShape); PicUpMode.push("016");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("125678");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("9A");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("B");
        PicUpShape.push(enmShape.LineShape); PicUpMode.push("2349");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("3");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("0");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("1245678");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("9A");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("B");
        PicUpShape.push(enmShape.PolygonShape); PicUpMode.push("C");
        PicUpShape.push(enmShape.LineShape); PicUpMode.push("C");
        PicUpShape.push(enmShape.PointShape); PicUpMode.push("C");

        let Sub_Over = [];// strOverLay_DataSet_Item_Info)

        for (let i = 0; i < PicUpMode.length; i++) {
            for (let j = 0; j < Ov_Data.length; j++) {
                let ovd = Ov_Data[j].Clone();
                if (this.LayerData[ovd.Layer].Shape == PicUpShape[i]) {
                    switch (ovd.Print_Mode_Layer) {
                        case enmLayerMode_Number.SoloMode:
                            if (PicUpMode[i].indexOf(String(ovd.Mode)) != -1) {
                                Sub_Over.push(ovd);
                            }
                            break;
                        case enmLayerMode_Number.GraphMode: {
                            let d = this.LayerData[ovd.Layer].LayerModeViewSettings.GraphMode.DataSet[ovd.DataNumber];
                            if (PicUpMode[i].indexOf("A") != -1) {
                                if ((d.GraphMode == enmGraphMode.PieGraph) || (d.GraphMode == enmGraphMode.StackedBarGraph) || (d.GraphMode == enmGraphMode.BarGraph)) {
                                    Sub_Over.push(ovd);
                                }
                            } else if (PicUpMode[i].indexOf("B") != -1) {
                                if (d.GraphMode == enmGraphMode.LineGraph) {
                                    Sub_Over.push(ovd);
                                }
                            }
                            break;
                        }
                        case enmLayerMode_Number.LabelMode:
                            if (PicUpMode[i].indexOf("C") != -1) {
                                Sub_Over.push(ovd)
                            }
                            break;
                        case enmLayerMode_Number.TripMode:
                            // if(InStr(PicUpMode[i], "D") != 0 ){
                            //     Sub_Over.push(Ov_Data[j])
                            // }
                            break;
                    }
                }
            }
        }

        // for (let i = 0; i < Ov_Data.Count; i++) {　タイルは使用しない
        //     if (Ov_Data[i].TileMapf == true) {
        //         Sub_Over.splice(i,0, Ov_Data[i].Clone())
        //     }
        // }
        return Sub_Over;
    }

    this.Check_Missing_Value = function (Layernum, DataNumber, objNumber) {
        let ad = attrData.LayerData[Layernum].atrData.Data[DataNumber];
        if ((ad.MissingValueNum == 0) || (ad.MissingF == false)) {
            return false;
        } else {
            if (ad.Value[objNumber] == undefined ){
                return true;
            } else {
                return false;
            }
        }
    }

    /**レイヤ内のURLリンクの最大数を求める */
    this.Get_MaxURLNum = function (Layernum) {
        let mx=0;
        let al = attrData.LayerData[Layernum];
        for (let i = 0; i < al.atrObject.ObjectNum; i++) {
            mx = Math.max(mx, al.atrObject.atrObjectData[i].HyperLinkNum);
        }
        return mx;
    }

    /**通常データ、カテゴリーデータの凡例を指定したデータ項目にコピーする */
    this.Set_Legend = function (D_Layer, D_DataNum, O_Data, ClassPaintF, MarkSizeF, MarkSizeValueCopyF, MarkBlockF,
        ContourF, ClassMarkF, ClassODF, StringModeF, MarkBarF, ClassODOriginCopyF,
        copyMarkCommonInnerDataF) {

        let ls =this.LayerData[D_Layer].atrData.Data[D_DataNum].SoloModeViewSettings;
        if ((ClassPaintF == true) || (ClassMarkF == true) || (ClassODF == true)) {
            if (O_Data.DataType == enmAttDataType.Normal) {
                //通常のデータの場合
                let p = O_Data.SoloModeViewSettings.Div_Num;
                ls.Class_Div.length = p;
                for (j = 0; j < p; j++) {
                    ls.Class_Div[j]=new strClass_Div_data();
                }
                ls.Div_Num = O_Data.SoloModeViewSettings.Div_Num;
                ls.Div_Method = O_Data.SoloModeViewSettings.Div_Method;
                if (ls.Div_Method == enmDivisionMethod.Free) {
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].Value = O_Data.SoloModeViewSettings.Class_Div[j].Value;
                    }
                } else {
                    this.Set_Div_Value(D_Layer, D_DataNum);
                }
                if (ClassPaintF == true) {
                    ls.ClassPaintMD = O_Data.SoloModeViewSettings.ClassPaintMD.Clone();
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].PaintColor = O_Data.SoloModeViewSettings.Class_Div[j].PaintColor;
                    }
                }
                if (ClassMarkF == true) {
                    ls.ClassMarkMD = O_Data.SoloModeViewSettings.ClassMarkMD.Clone();
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].ClassMark = O_Data.SoloModeViewSettings.Class_Div[j].ClassMark;
                    }
                }
                if (ClassODF == true) {
                    if (ClassODOriginCopyF == true) {
                        ls.ClassODMD = O_Data.SoloModeViewSettings.ClassODMD.Clone();
                    } else {
                        ls.ClassODMD.Arrow = O_Data.SoloModeViewSettings.ClassODMD.Arrow.Clone();
                    }
                    for (j = 0; j < p; j++) {
                        ls.Class_Div[j].ODLinePat = O_Data.SoloModeViewSettings.Class_Div[j].ODLinePat.Clone();
                    }
                }
            } else if (O_Data.DataType == enmAttDataType.Category) {
                //カテゴリーデータの場合
                if (ClassPaintF == true) {
                    ls.ClassPaintMD = O_Data.SoloModeViewSettings.ClassPaintMD.Clone();
                }
                if (ClassMarkF == true) {
                    ls.ClassMarkMD = O_Data.SoloModeViewSettings.ClassMarkMD.Clone();
                }
                if (ClassODF == true) {
                    ls.ClassODMD = O_Data.SoloModeViewSettings.ClassODMD.Clone();
                }
                let P1 = O_Data.SoloModeViewSettings.Div_Num;
                let O_CateStr = [];
                for (j = 0; j < P1; j++) {
                    O_CateStr[j] = O_Data.SoloModeViewSettings.Class_Div[j].Value;
                }

                let P2 = ls.Div_Num;
                let Con_Class_Div_Temp = [];
                for (j = 0; j < P2; j++) {
                    Con_Class_Div_Temp[j] = ls.Class_Div[j];
                }
                let Con_CateStr = [];
                for (j = 0; j < P2; j++) {
                    Con_CateStr[j] = ls.Class_Div[j].Value;
                }

                let okf = [];
                let caten = 0;
                for (j = 0; j < P1; j++) {
                    let k = Con_CateStr.indexOf(O_CateStr[j]);
                    if (k != -1) {
                        let o_Class_Div_Temp = O_Data.SoloModeViewSettings.Class_Div[j]
                        let ald = ls.Class_Div[caten];
                        ald.Value = o_Class_Div_Temp.Value;
                        if (ClassPaintF == true) {
                            ald.PaintColor = o_Class_Div_Temp.PaintColor.Clone();
                        }
                        if (ClassMarkF == true) {
                            ald.ClassMark = o_Class_Div_Temp.ClassMark.Clone();
                        }
                        if (ClassODF == true) {
                            ald.ODLinePat = o_Class_Div_Temp.ODLinePat.Clone();
                        }
                        caten++;
                        okf[k] = true;
                    }
                }
                for (j = 0; j < P2; j++) {
                    if (okf[j] == false) {
                        ls.Class_Div[caten] = Con_Class_Div_Temp[j];
                        caten++;
                    }
                }
                if (ClassODF == true) {
                    if (ClassODOriginCopyF == true) {
                        ls.ClassODMD = O_Data.SoloModeViewSettings.ClassODMD.Clone();
                    } else {
                        ls.ClassODMD.Arrow = O_Data.SoloModeViewSettings.ClassODMD.Arrow.Clone();
                    }
                }
            }
        }
        if ((MarkSizeF == true) || (MarkBlockF == true) || (StringModeF == true) || (MarkBarF == true)) {
            alm = ls.MarkCommon;
            if (copyMarkCommonInnerDataF == true) {
                ls.Inner_Data = O_Data.SoloModeViewSettings.MarkCommon.Inner_Data;
            }
            alm.LegendMinusWord = O_Data.SoloModeViewSettings.MarkCommon.LegendMinusWord;
            alm.LegendPlusWord = O_Data.SoloModeViewSettings.MarkCommon.LegendPlusWord;
            alm.MinusLineColor = O_Data.SoloModeViewSettings.MarkCommon.MinusLineColor.Clone();
            alm.MinusTile = O_Data.SoloModeViewSettings.MarkCommon.MinusTile.Clone();
        }
        if (MarkSizeF == true) {
            ls.MarkSizeMD.MaxValueMode = O_Data.SoloModeViewSettings.MarkSizeMD.MaxValueMode;
            if (ls.MarkSizeMD.MaxValueMode == enmMarkSizeValueMode.UserDefinition) {
                ls.MarkSizeMD.MaxValue = O_Data.SoloModeViewSettings.MarkSizeMD.MaxValue;
            }
            ls.MarkSizeMD.Mark = O_Data.SoloModeViewSettings.MarkSizeMD.Mark.Clone();
            if (MarkSizeValueCopyF == true) {
                ls.MarkSizeMD.Value = O_Data.SoloModeViewSettings.MarkSizeMD.Value.concat();
            }
        }
        if (MarkBlockF == true) {
            ls.MarkBlockMD = O_Data.SoloModeViewSettings.MarkBlockMD.Clone();
        }
        if (ContourF == true) {
            ls.ContourMD = O_Data.SoloModeViewSettings.ContourMD.Clone();
        }
        if (StringModeF == true) {
            ls.StringMD = O_Data.SoloModeViewSettings.StringMD.Clone();
        }
        if (MarkBarF == true) {
            ls.MarkBarMD = O_Data.SoloModeViewSettings.MarkBarMD.Clone();
        }
    }

    //オブジェクト名とデータ項目を文字列で取得
    this.getOneObjectPanelLabelString = function (LayerNum, DataNumber, objNumber, SeparataString) {
        let SoloProperty = this.Get_DataTitle(LayerNum, DataNumber, false) + SeparataString +
            this.Get_Data_Value(LayerNum, DataNumber, objNumber, this.TotalData.ViewStyle.Missing_Data.Text) +
            this.Get_DataUnit_With_Kakko(LayerNum, DataNumber);
        let inData = -1;
        let layData = this.LayerData[LayerNum].atrData.Data[DataNumber];
        switch (layData.ModeData) {
            case enmSoloMode_Number.ClassMarkMode: {
                if (layData.SoloModeViewSettings.ClassMarkMD.Flag == true) {
                    inData = layData.SoloModeViewSettings.ClassMarkMD.Data;
                }
                break;
            }
            case enmSoloMode_Number.MarkSizeMode:
            case enmSoloMode_Number.MarkBlockMode:
            case enmSoloMode_Number.MarkTurnMode: {
                if (layData.SoloModeViewSettings.MarkCommon.Inner_Data.Flag == true) {
                    inData = layData.SoloModeViewSettings.MarkCommon.Inner_Data.Data;
                }
                break;
            }
        }
        if (inData != -1) {
            //内部データの値
            SoloProperty += SeparataString + this.Get_DataTitle(LayerNum, inData, false) + SeparataString +
                this.Get_Data_Value(LayerNum, inData, objNumber, this.TotalData.ViewStyle.Missing_Data.Text) +
                this.Get_DataUnit_With_Kakko(LayerNum, inData);
        }
        return SoloProperty;
    }

    //MDRJ形式で保存
    this.saveAsMDRJ=function(fname,MDRMJFlag){
        let saveLPat = new strSaveLinePat_Info();
        let MapFileList = this.GetMapFileName();
        saveLPat.MapNum = MapFileList.length;
        saveLPat.MapFileName = MapFileList;
        for (let i = 0; i < MapFileList.length; i++) {
            let n = this.SetMapFile(MapFileList[i]).Map.LpNum;
            saveLPat.LpatNumByMapfile.push(n);
            for (let j = 0; j < n; j++) {
                saveLPat.Lpat.push(this.SetMapFile(MapFileList[i]).LineKind[j]);
            }
        }

        let savedata;
        if (MDRMJFlag == false) {
            savedata = {
                TotalData: this.TotalData,
                LayerData: this.LayerData,
                saveLPat: saveLPat
            }
        } else {
            savedata = {
                TotalData: this.TotalData,
                LayerData: this.LayerData,
                saveLPat: saveLPat,
                mapData:this.MapData.getAllMapData()
            }
        }
        //地図ファイルデータがLayer内に保存されるのを防ぐ
        for (let i in this.LayerData){
            savedata.LayerData[i].MapFileData=undefined
        }

        let json = JSON.stringify(savedata);

        //Layer内の地図ファイル参照を戻す
        for (let i in this.LayerData){
            this.LayerData[i].MapFileData=this.SetMapFile(this.LayerData[i].MapFileName);
        }

        let bData=[Generic.strToUtf8Array(json)];
        let bDataFile=[fname+"in"];
        Generic.zipFile(fname,bData,bDataFile);
    }

    //ある地点がオブジェクト内部に入るかどうかを調べる
    this.Check_Point_in_Kencode_OneObject = function (Layernum, ObjNum, MapP) {
        if (this.LayerData[Layernum].Type == enmLayerType.Mesh) {
            let meshP =Generic.ArrayClone( this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MeshPoint);
            meshP.push(meshP[0].Clone());
            let ap =[];
            ap.push(meshP)
            let retV=spatial.check_Point_in_Polygon(MapP, ap);
            return retV.ok;
        } else {
            switch (this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Objectstructure) {
                case enmKenCodeObjectstructure.MapObj: {
                    let O_Code = this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MpObjCode;
                    let Time = this.LayerData[Layernum].Time;
                    return this.LayerData[Layernum].MapFileData.Check_Point_in_OneObject(O_Code, MapP.x, MapP.y, Time);
                    break;
                }
                case enmKenCodeObjectstructure.SyntheticObj: {
                    let f = Check_Point_in_Kencode_oneObject_Box(Layernum, ObjNum, MapP.x, MapP.y);
                    if (f == true) {
                        let ELine = this.Get_Enable_KenCode_MPLine(Layernum, ObjNum)
                        let Fringe_Line = [];
                        for (let j = 0; j < ELine.length; j++) {
                            Fringe_Line.push(ELine[j].LineCode);
                        }
                        return this.LayerData[Layernum].MapFileData.Check_Point_in_Polygon_LineCode(MapP.x, MapP.y, n, Fringe_Line)
                    }
                    break;
                }
            }
        }
    }
    //階級区分の度数分布を求める。区分値が不正の場合はfalseを返す
    this.Get_ClassFrequency = function (Layernum, DataNum, ConditionCheck) {
        let ld = this.LayerData[Layernum].atrData.Data[DataNum];
        let ldd = ld.SoloModeViewSettings;
        if (ld.DataType == enmAttDataType.Category) {
        } else {
            for (let i = 0; i < ldd.Div_Num - 2; i++) {
                let v = ldd.Class_Div[i + 1].Value;
                if (ldd.Class_Div[i].Value <= v) {
                    return { ok: false };
                }
            }
        }
        let cate = this.Get_CategolyArray(Layernum, DataNum);
        let MissFreq = 0;
        let Freqency = new Array(ldd.Div_Num).fill(0);
        for (let i = 0; i < cate.length; i++) {
            let f = true;
            if (ConditionCheck == true) {
                f = this.Check_Condition(Layernum, i);
            }
            if (f == true) {
                if (cate[i] == -1) {
                    MissFreq++;
                } else {
                    Freqency[cate[i]]++;
                }
            }
        }
        return { ok: true, frequency: Freqency, missFreq: MissFreq };
    }

    //Backgroundの余白部分のピクセル数を取得
    this.Get_PaddingPixcel = function (back) {
        if ((back.Line.BlankF == true) && (back.Tile.BlankF == true)) {
            return 0;
        } else {
            return this.TotalData.ViewStyle.ScrData.Get_Length_On_Screen(back.Padding);
        }
    }

    /**レイヤの階級区分数を取得 */
    this.Get_DivNum=function(Layernum,DataNum){
        return this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings.Div_Num;
    }
    //レイヤ名を取得
    this.Get_LayerName = function (Layernum){
        return this.LayerData[Layernum].Name;
    }

    //レイヤ内のオブジェクトのオブジェクト名を取得
    this.Get_KenObjName = function (Layernum, Objectnum) {
        switch (this.LayerData[Layernum].Type) {
            case enmLayerType.Trip: {
                return this.LayerData[Layernum].atrObject.TripObjData[Objectnum].TripPersonName;
                break;
            }
            default: {
                return this.LayerData[Layernum].atrObject.atrObjectData[Objectnum].Name;
                break;
            }
        }
    }

    /**レイヤ内のオブジェクトのオブジェクト番号(地図ファイル中)を取得 */
    this.Get_KenObjCode= function (Layernum, Objectnum) {
        switch (this.LayerData[Layernum].Type) {
            case enmLayerType.Trip: {
                return this.LayerData[Layernum].atrObject.TripObjData[Objectnum].TripPersonCode;
                break;
            }
            default: {
                return this.LayerData[Layernum].atrObject.atrObjectData[Objectnum].MpObjCode;
                break;
            }
        }      
    }

    //レイヤ・データ・オブジェクトを指定して値を取得
    this.Get_Data_Value = function (Layernum, DataNum, Obj, Missing_word) {
        let ad = this.LayerData[Layernum].atrData.Data[DataNum];
        let v = ad.Value[Obj];
        if (ad.MissingF == false) {
            return v;
        } else {
            if (v == undefined) {
                return Missing_word;
            } else {
                return v;
            }
        }
    }

    //パーセントのサイズが，画面上で何ピクセルかを取得/TotalData.ViewStyle.ScrData.Get_Length_On_Screenのショートカット
    this.Get_Length_On_Screen = function (Percentage) {
        let s = this.TotalData.ViewStyle.ScrData;
        if (s.SampleBoxFlag == false) {
            let RR = s.STDWsize * Percentage / 100 * s.ScreenMG.Mul * s.GSMul;
            return parseInt(RR);
        } else {
            return parseInt(s.STDWsize * Percentage / 100 * s.FirstScreenMGMul);
        }

    }

    /** */
    this.Draw_Arrow= function(g, DestFP, StartFP, LinePat, Arrow){
        clsDrawLine.Arrow(g,DestFP,StartFP,LinePat,Arrow,this.TotalData.ViewStyle.ScrData);
    }
    //ライン描画
    this.Draw_Line = function (g, LinePat, P1, P2) {
        if (P2 == undefined) {
            clsDrawLine.Line(g, LinePat, P1, this.TotalData.ViewStyle.ScrData);
        } else {
            clsDrawLine.Line(g, LinePat, P1, P2, this.TotalData.ViewStyle.ScrData);
        }
    }

    this.Draw_Poly_Inner= function (g, pxy, nPolyP,T) {
        clsDrawTile.Draw_Poly_Inner(g, pxy, nPolyP,  T);
    }

    this.Draw_Tile_Region= function (g, BoundaryRect, L, T, Kakudo) {}
    
    this.Draw_Tile_Box = function (g, BoundaryRect, L, T, Kakudo) {
        clsDrawTile.Draw_Tile_Box(g, BoundaryRect, L, T, Kakudo, this.TotalData.ViewStyle.ScrData);
    }

    this.Draw_Tile_RoundBox = function (g, BoundaryRect, Back, Kakudo) {
        clsDrawTile.Draw_Tile_RoundBox(g, BoundaryRect, Back, Kakudo, this.TotalData.ViewStyle.ScrData);
    }

    this.Draw_Print = function (g, Word, Pos, Font_P, HorizonalAlignment, VerticalAlignment) {
        return clsDraw.print(g, Word, Pos, Font_P, HorizonalAlignment, VerticalAlignment, this.TotalData.ViewStyle.ScrData);
    }

    this.Draw_Fan= function (g, OP, r, start_p, end_p,Lpat,Tile){
        clsDrawMarkFan.Draw_Fan(g,OP,r,start_p, end_p,Lpat,Tile,this.TotalData.ViewStyle.ScrData);
    }

        // サンプル記号ボックスに記号を描画
    this.Draw_Sample_Mark_Box = function (picBox, Mark) {
        clsDrawMarkFan.Draw_Mark_Sample_Box(picBox, Mark, this.TotalData.ViewStyle.ScrData);
    }
    //サンプルラインボックスにラインを描画
    this.Draw_Sample_LineBox = function (picBox, LinePat) {
        clsDrawLine.Draw_Sample_LineBox(picBox, LinePat, this.TotalData.ViewStyle.ScrData);
    }
    //記号描画
    this.Draw_Mark = function (g, Position, r, Mark) {

        clsDrawMarkFan.Mark_Print(g, Position, r, Mark, this.TotalData.ViewStyle.ScrData);
    }
    // 最大値に占める指定値の割合に面積比例する画面半径を返す/TotalData.ViewStyle.ScrData.Radiusのショートカット
    this.Radius = function (R_Percent, Value, max_Value) {
        return this.TotalData.ViewStyle.ScrData.Radius(R_Percent, Value, max_Value);
    }

    //データ項目の中央値を求める
    this.Get_MedianValue = function (Layernum, DataNum) {

        let ST = new clsSortingSearch();
        let MV = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
        let n = MV.length;
        let n2 = Math.floor(n / 2);
        for (let i = 0; i < n; i++) {
            ST.Add(Number(MV[i].DataValue));
        }
        ST.AddEnd();
        if ((n % 2) == 1) {
            //奇数個の場合
            return ST.DataPositionRevValue(n2);
        } else {
            //偶数個の場合
            return (ST.DataPositionRevValue(n2 - 1) + ST.DataPositionRevValue(n2)) / 2

        }

    }

    /**属性データ編集から座標系を設定する */
    this.attrGridZahyoSet=function(){
        this.TotalData.ViewStyle.Zahyo = this.MapData.GetPrestigeZahyoMode();
        return this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo).ok;
    }
    //指定した地図ファイルを削除
    this.RemoveMapData = function (MapFileName) {
        this.MapData.RemoveMapData(MapFileName);
    }
    //既存地図ファイル追加
    this.AddExistingMapData = function (MData, MapFileName) {
        if (this.MapData == undefined) {
            this.MapData = new clsAttrMapData();
        }
        this.MapData.AddExistingMapData(MData, MapFileName);
    }
    //同じ名前の地図ファイルが存在する場合、別名をつけて返す
    this.getUniqueMapFileName = function (checkMfile) {
        let ExtMfile = this.GetMapFileName();
        if (ExtMfile.indexOf(checkMfile) == -1) {
            return checkMfile;
        } else {
            let Omfile, n = 1;
            do
                Omfile = checkMfile + n.ToString;
            while (ExtMfile.indexOf(Omfile) != -1)
            return Omfile;
        }
    }
    //地図デーセットをセットする 空白の場合、最初に読み込まれた地図
    this.SetMapFile = function (MapFileName) {
        return this.MapData.SetMapFile(MapFileName);
    }

    //地図ファイル数を取得
    this.GetNumOfMapFile = function () {
        return this.MapData.GetNumOfMapFile();
    }

    //読み込んだ地図ファイルのファイル名の配列を返す
    this.GetMapFileName = function () {
        return this.MapData.GetMapFileName();
    }

    //指定したレイヤ・データ項目で指定した単独表示モードが表示可能か調べる
    //Solo_md:enmSoloMode_Number
    this.Check_Enable_SoloMode = function (Solo_md, Layernum, DataNum) {
        switch (this.LayerData[Layernum].atrData.Data[DataNum].DataType) {
            case enmAttDataType.Strings:
                if (Solo_md != enmSoloMode_Number.StringMode) {
                    return false;
                }
                break;
            case enmAttDataType.Category:
                switch (Solo_md) {
                    case enmSoloMode_Number.MarkSizeMode:
                    case enmSoloMode_Number.MarkBlockMode:
                    case enmSoloMode_Number.ContourMode:
                    case enmSoloMode_Number.MarkTurnMode:
                    case enmSoloMode_Number.MarkBarMode:
                        return false;
                        break;
                }
                break;
        }
        switch (this.LayerData[Layernum].Type) {
            case enmLayerType.Normal:
                case enmLayerType.Mesh:
                if (this.LayerData[Layernum].Shape == enmShape.LineShape) {
                    switch (Solo_md) {
                        case enmSoloMode_Number.ClassHatchMode:
                        case enmSoloMode_Number.ClassMarkMode:
                        case enmSoloMode_Number.MarkBlockMode:
                        case enmSoloMode_Number.ContourMode:
                        case enmSoloMode_Number.MarkTurnMode:
                        case enmSoloMode_Number.MarkBarMode:
                            return false;
                    }
                }
                break;
            case enmLayerType.Trip:
                switch (Solo_md) {
                    case enmSoloMode_Number.ClassHatchMode:
                    case enmSoloMode_Number.ClassMarkMode:
                    case enmSoloMode_Number.MarkSizeMode:
                    case enmSoloMode_Number.MarkBlockMod:
                    case enmSoloMode_Number.ContourMode:
                    case enmSoloMode_Number.MarkTurnMode:
                    case enmSoloMode_Number.MarkBarMode:
                    case enmSoloMode_Number.StringMode:
                        return false;
                }
                break;
            case enmLayerType.Trip_Definition:
                switch (Solo_md) {
                    case enmSoloMode_Number.ClassHatchMode:
                    case enmSoloMode_Number.ClassMarkMode:
                    case enmSoloMode_Number.MarkSizeMode:
                    case enmSoloMode_Number.MarkBlockMode:
                    case enmSoloMode_Number.ContourMode:
                    case enmSoloMode_Number.MarkTurnMode:
                    case enmSoloMode_Number.MarkBarMode:
                    case enmSoloMode_Number.StringMode:
                        return false;
                        break;
                }
                break;
        }

        return true;
    }

    //飾りの初期位置指定
    this.Set_Acc_First_Position = function () {
        let mv = this.TotalData.ViewStyle;
        let mr = mv.ScrData.MapRectangle;
        let w = mr.width();
        let H = mr.height();

        for (let i = 0; i < mv.MapLegend.Base.Legend_Num; i++) {
            mv.MapLegend.Base.LegendXY[i] = new point(mr.right + (i - i) * w / 50, mr.top + H / 2 + (1 - i) * H / 50);
        }
        mv.MapTitle.Position = new point(mr.centerP().x, mr.bottom + H / 20);
        mv.MapScale.Position = new point(mr.left + w * 4 / 5, mr.bottom + H / 30);
        mv.DataNote.Position = new point(mr.left + w, mr.bottom - H * 0.2);
 
        let cpx = mv.AttMapCompass.Position.x;
        let cpy = mv.AttMapCompass.Position.y;
        if (cpx >= mr.right + w * 0.3) {
            mv.AttMapCompass.Position.x = mr.right - w * 0.1;
        }
        if (cpx <= mr.left - w * 0.3) {
            mv.AttMapCompass.Position.x = mr.left + w * 0.1;
        }
        if (cpy >= mr.bottom + H * 0.3) {
            mv.AttMapCompass.Position.y = mr.bottom - H * 0.1;
        }
        if (cpy >= mr.top - H * 0.3) {
            mv.AttMapCompass.Position.y = mr.top + H * 0.1;
        }

        if (mv.ScrData.Accessory_Base == enmBasePosition.Screen) {
            this.Change_Acc_Position_by_Accessory_Base_Set_Screen()
        }
    }
    this.Boundary_Kencode_Arrange = function (Layernum, ObjNum) {
        let O_Code = this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MpObjCode;
        let badata = new boundArrangeData();

        switch (this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj:
                badata = this.LayerData[Layernum].MapFileData.Boundary_Arrange(O_Code, this.LayerData[Layernum].Time);
                break;
            case enmKenCodeObjectstructure.SyntheticObj:
                let ELine = this.Get_Enable_KenCode_MPLine( Layernum, ObjNum);
                badata = this.LayerData[Layernum].MapFileData.Boundary_Arrange_Sub(ELine);
                break;
        }
        return badata;
    }

    //飾りをウインドウに固定する際の飾り位置をチェック・修正
    this.Change_Acc_Position_by_Accessory_Base_Set_Screen = function () {
        let mv = this.TotalData.ViewStyle;
        let ms = mv.ScrData.ScrRectangle;
        let lft = ms.left;
        let tp = ms.top;
        let w = ms.width();
        let H = ms.height();
        mv.MapTitle.Position = new point(
            Generic.m_min_max((mv.MapTitle.Position.x - lft) / w, 0.1, 0.9),
            Generic.m_min_max((mv.MapTitle.Position.y - tp) / H, 0.1, 0.95));
        mv.MapScale.Position = new point(
            Generic.m_min_max((mv.MapScale.Position.x - lft) / w, 0.1, 0.8),
            Generic.m_min_max((mv.MapScale.Position.y - tp) / H, 0.1, 0.95));
        mv.DataNote.Position = new point(
            Generic.m_min_max((mv.DataNote.Position.x - lft) / w, 0.1, 0.9),
            Generic.m_min_max((mv.DataNote.Position.y - tp) / H, 0.1, 0.95));

        mv.AttMapCompass.Position = new point(
            Generic.m_min_max((mv.AttMapCompass.Position.x - lft) / w, 0.1, 0.9),
            Generic.m_min_max((mv.AttMapCompass.Position.y - tp) / H, 0.1, 0.9));
        for (let i = 0; i < mv.MapLegend.Base.Legend_Num; i++) {
            mv.MapLegend.Base.LegendXY[i] = new point(
                Generic.m_min_max((mv.MapLegend.Base.LegendXY[i].x - lft) / w, 0.1, 0.8),
                Generic.m_min_max((mv.MapLegend.Base.LegendXY[i].y - tp) / H, 0.1, 0.8));
        }
    }

    //変換した座標を計算済み座標に登録
    this.Set_MPSubLineXY = function (MapFileName, LineCode, XY, ReverseF) {
        let LinePoint = this.MPSubLine[MapFileName.toUpperCase()];
        let LP = new strGetLinePointAPI_Info();
        LP.GetF = true;
        LP.ReverseF = ReverseF;
        LP.Point = Generic.ArrayClone(XY);
        LP.Drawn = false;
        LinePoint[LineCode] = LP;
    }

    /** MPSubLine.Drawnの値をfalseにする*/
    this.ResetMPSubLineDrawn = function (MapFileName) {
        let LinePoint = this.MPSubLine[MapFileName.toUpperCase()];
        for (let i = 0; i < LinePoint.Length; i++) {
            LinePoint[i].Drawn = false;
        }
    }

    this.getMpLineDrawn = function (MapFileName, LineCode) {
        let LinePoint = this.MPSubLine[MapFileName.toUpperCase()];
        if (LinePoint[LineCode] == undefined) {
            return undefined;
        } else {
            return this.MPSubLine[MapFileName.toUpperCase()][LineCode].Drawn;
        }
    }
    this.setMpLineDrawn = function (MapFileName, LineCode, value) {
         this.MPSubLine[MapFileName.toUpperCase()][LineCode].Drawn = value;
    }


    //線種の使用チェック
    this.getLineKindUseChecked = function (MapFileName, lineKindNum, PatternNum) {
        let n = this.MapData.GetLineKindPosition(MapFileName, lineKindNum, PatternNum);
        return this.LineKindUse[n];
    }
    this.setLineKindUseChecked = function (MapFileName, lineKindNum, PatternNum, value) {
        let n = this.MapData.GetLineKindPosition(MapFileName, lineKindNum, PatternNum);
        this.LineKindUse[n] = value;
    }

    /**線種の使用状況を取得 */
    this.Get_LineKindUsedList = function (){
        return this.LineKindUse;
    }

    //地図データの保存してある計算済み座標を取得する
    this.Get_MPSubLineXY = function (MapFileName, LineCode, ReverseF) {
        let xy = [];
        let LinePoint = this.MPSubLine[MapFileName.toUpperCase()];
        let MPSubLinePointXY = LinePoint[LineCode];
        if (MPSubLinePointXY != undefined) {
            if (MPSubLinePointXY.GetF == true) {
                if (ReverseF == MPSubLinePointXY.ReverseF) {
                    xy = Generic.ArrayClone(MPSubLinePointXY.Point);
                } else {
                    //反転コピー
                    let np = MPSubLinePointXY.Point.length - 1
                    for (let i = 0; i < np + 1; i++) {
                        xy.push(MPSubLinePointXY.Point[np - i].Clone());
                    }
                }
                return xy;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    //計算済み座標と使用線種をリセットする
    this.ResetMPSubLineXY = function () {
        for (var key in this.MPSubLine) {
            delete this.MPSubLine[key];
        }
        let FList = this.MapData.GetMapFileName();
        for (let i = 0; i < this.MapData.GetNumOfMapFile(); i++) {
            // for (j = 0; j < this.MapData.SetMapFile(FList[i]).Map.ALIN; j++) {
            //     let d = new strGetLinePointAPI_Info()
            // }
            this.MPSubLine[FList[i]] = [];//strGetLinePointAPI_Info
        }
        this.LineKindUse = [];
        this.TempData.PointObjectKindUsedStack = [];
    }

    //**点ダミーオブジェクトの凡例表示用に記録する */
    this.AddPointObjectKindUsed= function (MapFilename,ObjKindNumber,MK) {
        for(let i in this.TempData.PointObjectKindUsedStack){
            let Ob=this.TempData.PointObjectKindUsedStack[i];
            if(( Ob.MapFileName== MapFilename )&&( Ob.ObjectKindNumber == ObjKindNumber) ){
                //記録済み
                return;
            }
        }
        let newObk = new  strObjectKindUsed_Info();
        newObk.MapFileName = MapFilename;
        newObk.ObjectKindNumber = ObjKindNumber;
        newObk.Mark = MK;
        newObk .ObjectKindName = this.SetMapFile(MapFilename).ObjectKind[ObjKindNumber].Name;
        this.TempData.PointObjectKindUsedStack.Push(newObk)
    }

    //オブジェクトの表示チェックをクリア
    this.ResetObjectPrintedCheckFlag = function () {
        this.TempData.ObjectPrintedCheckFlag = [];
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            this.TempData.ObjectPrintedCheckFlag[i] = [];
        }
    }

    //データ読み込み後の共通初期化
    this.initTotalData_andOther = function () {
        let DourceType = this.TotalData.LV1.DataSourceType;
        if ((DourceType == enmDataSource.CSV) ||
            (DourceType == enmDataSource.Clipboard) ||
            (DourceType == enmDataSource.Viwer) ||
            (DourceType == enmDataSource.Shapefile) ||
            (DourceType == enmDataSource.DataEdit)) {
            this.TotalData.initTotalData();
            let tv = this.TotalData.ViewStyle;
            tv.AttMapCompass = this.SetMapFile("").Map.MapCompass.Clone();
            tv.MapScale.Visible = this.SetMapFile("").Map.Detail.ScaleVisible;
            tv.MapScale.Unit = this.SetMapFile("").Map.SCL_U;
            this.Check_Vector_Object();
            if (this.TotalData.ViewStyle.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                //緯度経度の場合の経緯線設定
                let w = this.TempData.MapAreaLatLon.width();
                let v;
                let visi = false;
                if (w < 30) {
                    v=1;
                } else if (w < 60) {
                    v = 2;
                } else if (w < 90) {
                    v = 5;
                } else if (w < 180) {
                    visi = true;
                    v = 10;
                } else {
                    visi = true;
                    v = 15;
                }
                this.TotalData.ViewStyle.LatLonLine_Print.Lat_Interval = v;
                this.TotalData.ViewStyle.LatLonLine_Print.Lon_Interval = v;
                this.TotalData.ViewStyle.LatLonLine_Print.Visible = visi;
            }
            this.initDummuyPointObjectMark();
        } else {
            this.TempData.MapAreaLatLon = this.get_DataLatLonBox();
        }

        this.LinePatternCheck();
        this.PrtObjectSpatialIndex();
    }

    //単独表示モードで選択中のデータ項目のタイトルを返す
    this.Get_SelectedDataTitle = function () {
        let l = this.TotalData.LV1.SelectedLayer;
        let d = this.LayerData[l].atrData.SelectedIndex;
        return this.LayerData[l].atrData.Data[d].Title;
    }

    //レイヤごとのオブジェクトの空間インデックス作成
    this.PrtObjectSpatialIndex = function () {
        let mrect = this.TotalData.ViewStyle.ScrData.MapRectangle;
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let LD = this.LayerData[i];
            let obn = LD.atrObject.ObjectNum;
            switch (LD.Shape) {
                case enmShape.PointShape: {
                    let XYSize;
                    if (obn > 100) {
                        XYSize = Math.sqrt(obn) / 2;
                    } else {
                        XYSize = Math.sqrt(obn);
                    }
                    LD.PrtSpatialIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, true, mrect, mrect.width() / XYSize);
                    for (let j = 0; j < obn; j++) {
                        LD.PrtSpatialIndex.AddSinglePoint(LD.atrObject.atrObjectData[j].CenterPoint, j)
                    }
                    break;
                }
                case enmShape.LineShape: {
                    let XYSize = Math.sqrt(obn) / 4;
                    LD.PrtSpatialIndex = new clsSpatialIndexSearch(SpatialPointType.SPILine, true, mrect, mrect.width() / XYSize);
                    for (let j = 0; j < obn; j++) {
                        if (LD.Type == enmLayerType.Mesh) {
                            LD.PrtSpatialIndex.AddLine(4, LD.atrObject.atrObjectData[j].MeshPoint, j)
                        } else {
                            let ELine = this.Get_Enable_KenCode_MPLine(i, j);
                            for (let k in ELine) {
                                let LDM = LD.MapFileData.MPLine[ELine[k].LineCode];
                                LD.PrtSpatialIndex.AddLine(LDM.NumOfPoint, LDM.PointSTC, j);
                            }
                        }
                    }
                    break;
                }
                case enmShape.PolygonShape: {
                    LD.PrtSpatialIndex = new clsSpatialIndexSearch(SpatialPointType.SPIRect, false, mrect);
                    for (let j = 0; j < obn; j++) {
                        let ObjRect = this.Get_Kencode_Object_Circumscribed_Rectangle(i, j);
                        LD.PrtSpatialIndex.AddRect(ObjRect, j);
                    }
                    break;
                }
            }
            LD.PrtSpatialIndex.AddEnd();
        }

    }

    /**レイヤの地図ファイルのオブジェクト番号からオブジェクトの外周を取得 */
    this.Get_Object_Circumscribed_Rectangle= function (Layernum, ObjCode) {
        return this.LayerData[Layernum].MapFileData.MPObj[ObjCode].Circumscribed_Rectangle;
    }
    //レイヤのオブジェクト位置からオブジェクトの外周を取得
    this.Get_Kencode_Object_Circumscribed_Rectangle = function (Layernum, ObjNum) {
        let LD = this.LayerData[Layernum];
        switch (LD.Type) {
            case enmLayerType.Mesh: {
                return LD.atrObject.atrObjectData[ObjNum].MeshRect;
                break;
            }
            case enmLayerType.DefPoint: {
                let LDA = LD.atrObject.atrObjectData[ObjNum];
                let pt = [LDA.CenterPoint, LDA.Symbol, LDA.Label];
                let rect = spatial.getCircumscribedRectangle(pt);
                return rect;
                break;
            }
        }
        let code = LD.atrObject.atrObjectData[ObjNum].MpObjCode;
        switch (LD.atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj: {
                return LD.MapFileData.MPObj[code].Circumscribed_Rectangle;
                break;
            }
            case enmKenCodeObjectstructure.SyntheticObj: {
                return LD.atrObject.MPSyntheticObj[code].Circumscribed_Rectangle;
                break;
            }

        }
    }

    //ダミー点オブジェクトの記号を初期化
    this.initDummuyPointObjectMark = function () {
        let vs = this.TotalData.ViewStyle;
        vs.MapLegend.Line_DummyKind.Line_Visible_Number_STR = "1".repeat(this.GetAllMapLineKindNum());
        vs.DummyObjectPointMark = [];
        let PointObjG = this.GetAllPointObjectGroup();
        for (let key in PointObjG) {
            if (PointObjG[key].length > 0) {
                let d = [];
                for (let i = 0; i < PointObjG[key].length; i++) {
                    let dd = new strDummyObjectPointMark_Info();
                    dd.ObjectKindName = PointObjG[key];
                    dd.mark = clsBase.Mark();
                    d.push(dd);
                }
                vs.DummyObjectPointMark[key] = d;
            }
        }
    }

    //点オブジェクトグループのオブジェクト名のDictionary（地図ファイル名,オブジェクトグループ名）を取得
    this.GetAllPointObjectGroup = function () {
        return this.MapData.GetAllPointObjectGroup();
    }

    /**読み込んだ地図ファイルの全線種（オブジェクト連動型を含む）一覧を返す */
    this.Get_AllMapLineKind = function () {
        return this.MapData.GetAllMapLineKind();
    }

    /**読み込んだ地図ファイルの全線種名（オブジェクト連動型を含む）一覧を返す */
    this.GetAllMapLineKindName=function(){
        return this.MapData.GetAllMapLineKindName();
    }
    //読み込んだ地図ファイルの全線種数（オブジェクト連動型を含む）を返す
    this.GetAllMapLineKindNum = function () {
        return this.MapData.GetAllMapLineKindNum();
    }

    //表示領域の最大サイズを求めてMapRectangleに格納する
    this.Check_Vector_Object = function () {
        let TotalScrRect = new rectangle();

        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let FirstF = false;
            let ScrRect = new rectangle();
            let ld = this.LayerData[i];
            if (ld.Type != enmLayerType.Trip_Definition) {
                let MapFileData = ld.MapFileData;
                let LayerTime = ld.Time;
                if (this.TotalData.ViewStyle.Dummy_Size_Flag == true) {

                    for (let j = 0; j < MapFileData.Map.Kend; j++) {
                        let mp = MapFileData.MPObj[j];
                        if (ld.DummyGroup.indexOf(mp.Kind) != -1) {
                            let cxy = MapFileData.Get_Enable_CenterP(j, LayerTime);
                            if (cxy != undefined) {
                                if (FirstF == false) {
                                    ScrRect = new rectangle(cxy);
                                    FirstF = true;
                                } else {
                                    ScrRect = spatial.getCircumscribedRectangle(mp.Circumscribed_Rectangle, ScrRect)
                                }
                            }
                        }
                    }
                    for (let j = 0; j < ld.Dummy.length; j++) {
                        let ocode = ld.Dummy[j].code;
                        if (FirstF == false) {
                            let cxy = MapFileData.Get_Enable_CenterP(ocode, LayerTime);
                            if (cxy != undefined) {
                                ScrRect = new rectangle(cxy);
                                FirstF = true;
                            }
                        }
                        ScrRect = spatial.getCircumscribedRectangle(MapFileData.MPObj[ocode].Circumscribed_Rectangle, ScrRect);
                    }
                    switch (ld.Type) {
                        case enmLayerType.Trip:
                            break;
                        case enmLayerType.Mesh:{
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                let Rect =ld.atrObject.atrObjectData[j].MeshRect;
                                if (FirstF == false) {
                                    ScrRect = Rect;
                                    FirstF = true;
                                }
                                ScrRect = spatial.getCircumscribedRectangle(Rect, ScrRect);
                            }
                            break;
                        }
                        case enmLayerType.DefPoint:{
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                let p = ld.atrObject.atrObjectData[j].CenterPoint;
                                if (FirstF == false) {
                                    ScrRect = new rectangle(p);
                                    FirstF = true;
                                }
                                ScrRect = spatial.getCircumscribedRectangle(p, ScrRect);
                            }
                            break;
                        }
                        case enmLayerType.Normal:{
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                let ocode = ld.atrObject.atrObjectData[j].MpObjCode;
                                switch (ld.atrObject.atrObjectData[j].Objectstructure) {
                                    case enmKenCodeObjectstructure.MapObj:
                                        if (FirstF == false) {
                                            let cxy = ld.atrObject.atrObjectData[j].CenterPoint;
                                            ScrRect = new rectangle(cxy, new size(0, 0));;
                                            FirstF = true;
                                        }
                                        ScrRect = spatial.getCircumscribedRectangle(MapFileData.MPObj[ocode].Circumscribed_Rectangle, ScrRect);
                                        break;
                                    case enmKenCodeObjectstructure.SyntheticObj:
                                        ScrRect = spatial.getCircumscribedRectangle(ld.atrObject.MPSyntheticObj[ocode].Circumscribed_Rectangle, ScrRect);
                                        break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if (i == 0) {
                TotalScrRect = ScrRect.Clone();     
            }else{
                TotalScrRect=spatial.getCircumscribedRectangle(TotalScrRect,ScrRect);
            }
        }
        if (TotalScrRect.left == TotalScrRect.right) {
            TotalScrRect.left = TotalScrRect.left - 1;
            TotalScrRect.right = TotalScrRect.left + 2;
        }
        if (TotalScrRect.top == TotalScrRect.bottom) {
            TotalScrRect.top = TotalScrRect.top - 1;
            TotalScrRect.bottom = TotalScrRect.top + 2;
        }
        this.TotalData.ViewStyle.ScrData.MapRectangle = TotalScrRect;
        this.TempData.MapAreaLatLon = this.get_DataLatLonBox();
    }

    this.getSolomodeWord = function (md) {

        switch (md) {
            case enmSoloMode_Number.ClassPaintMode: {
                return "ペイントモード";
                break;
            }
            case enmSoloMode_Number.ClassMarkMode: {
                return "階級記号モード";
                break;
            }
            case enmSoloMode_Number.ClassODMode: {
                return "線モード";
                break;
            }
            case enmSoloMode_Number.MarkSizeMode: {
                selDiv = divMarkSize;
                return "記号の大きさモード";
                break;
            }
            case enmSoloMode_Number.MarkBlockMode: {
                return "記号の数モード";
                break;

            }
            case enmSoloMode_Number.MarkTurnMode: {
                return "記号の回転モード";
                break;
            }
            case enmSoloMode_Number.MarkBarMode: {
                return "棒の高さモード";
                break;
            }
            case enmSoloMode_Number.ContourMode: {
                return "等値線モード";
                break;
            }
            case enmSoloMode_Number.StringMode: {
                selDiv = divString;
                return "文字モード";
                break;
            }
        }
    }

    /**現在のレイヤのグラフモードを返す */
    this.layerGraph= function () {
        const Layernum = this.TotalData.LV1.SelectedLayer;
        return attrData.LayerData[Layernum].LayerModeViewSettings.GraphMode;
    }

    /**現在のレイヤのグラフモードの選択データセットを返す */
    this.nowGraph= function () {
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const gv=attrData.LayerData[Layernum].LayerModeViewSettings.GraphMode;
        return gv.DataSet[gv.SelectedIndex];
    }

    /**現在のレイヤのラベルモードを返す */
    this.layerLabel= function () {
        const Layernum = this.TotalData.LV1.SelectedLayer;
        return lv=attrData.LayerData[Layernum].LayerModeViewSettings.LabelMode;
    }
    /**現在のレイヤのラベルモードの選択データセットを返す */
    this.nowLabel= function () {
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const lv=attrData.LayerData[Layernum].LayerModeViewSettings.LabelMode;
        return lv.DataSet[lv.SelectedIndex];;
    }
    /**現在の重ね合わせモードのデータセットを返す */
    this.nowSeries = function () {
        let series = attrData.TotalData.TotalMode.Series;
        return series.DataSet[series.SelectedIndex];
    }

    /**現在の重ね合わせモードのデータセットを返す */
    this.nowOverlay=function(){
        let over = attrData.TotalData.TotalMode.OverLay;
        return over.DataSet[over.SelectedIndex];
    }

    /**現在のレイヤの位置を返す */
    this.nowLayer= function(){
        const Layernum = this.TotalData.LV1.SelectedLayer;
        return attrData.LayerData[Layernum];
    }

    /**
     * 現在のレイヤ・データ項目の位置を返す */
    this.nowData= function(){
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const DataNum = this.LayerData[Layernum].atrData.SelectedIndex;
        return attrData.LayerData[Layernum].atrData.Data[DataNum];
    }

    /**現在のレイヤ・データ項目のSoloModeViewSettings位置を返す */
    this.nowDataSolo= function(){
        const Layernum = this.TotalData.LV1.SelectedLayer;
        const DataNum = this.LayerData[Layernum].atrData.SelectedIndex;
        return attrData.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
    }

    //単独表示モードのモードを取得
    this.getSoloMode = function (LayerNum, DataNum) {
        return this.LayerData[LayerNum].atrData.Data[DataNum].ModeData;
    }

    this.setSoloMode = function (LayerNum, DataNum, mode) {
        this.LayerData[LayerNum].atrData.Data[DataNum].ModeData = mode;
    }

    //データの緯度経度の領域を返す
    this.get_DataLatLonBox = function () {
        let IdoKedoRect = new rectangle();
        let Zahyo = this.TotalData.ViewStyle.Zahyo;
        if (Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido) {
            return IdoKedoRect;
        }
        switch (Zahyo.Projection) {
            case enmProjection_Info.prjMercator:
            case enmProjection_Info.prjMiller:
            case enmProjection_Info.prjSeikyoEntou:
            case enmProjection_Info.prjLambertSeisekiEntou:
                IdoKedoRect = spatial.Get_Reverse_Rect(this.TotalData.ViewStyle.ScrData.MapRectangle, Zahyo);
                return IdoKedoRect;
                break;
        }
        let pf = this.LayerData[0].atrObject.atrObjectData[0].CenterPoint.Clone();
        let pf2 = spatial.Get_Reverse_XY(pf, Zahyo);
        let LLRect = new rectangle(pf2, new size(0, 0));
        let LineCheck = {}// Dictionary(Of String, Boolean())
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let ld = this.LayerData[i];
            if (ld.Type != enmLayerType.Trip_Definition) {
                let MapFileData = ld.MapFileData;
                if (Object.keys(LineCheck).indexOf(ld.MapFileName) == -1) {
                    let LineL = new Array(MapFileData.Map.ALIN).fill(false);
                    LineCheck[ld.MapFileName] = LineL;
                }
                let LC = LineCheck[ld.MapFileName];
                let LayerTime = ld.Time;
                if (this.TotalData.ViewStyle.Dummy_Size_Flag == true) {
                    //ダミー領域も範囲に含む場合
                    let dmObj = [];
                    if (ld.DummyGroup.length > 0) {
                        let ObjGIndex = new Array(MapFileData.Map.OBKNum);
                        for (let j = 0; j < ld.DummyGroup.length; j++) {
                            ObjGIndex[ld.DummyGroup[j]] = true;
                        }
                        for (let j = 0; j < MapFileData.Map.Kend; j++) {
                            if (ObjGIndex[MapFileData.MPObj[j].Kind] == true) {
                                dmObj.push[j];
                            }
                        }
                    }
                    for (let j = 0; j < ld.Dummy.length; j++) {
                        let ocode = ld.Dummy[j].code;
                        dmObj.push(ocode);
                    }
                    for (let j = 0; j < dmObj.length; j++) {
                        if (MapFileData.MPObj[j].Shape == enmShape.PointShape) {
                            let cp = MapFileData.Get_Enable_CenterP(dmObj[j], LayerTime);
                            let cp2 = spatial.Get_Reverse_XY(cp, Zahyo);
                            LLRect = spatial.getCircumscribedRectangle(cp2, LLRect);
                        } else {
                            let ELine = MapFileData.Get_EnableMPLine(dmObj[j], LayerTime);
                            for (let k = 0; k < ELine.length; k++) {
                                if (LC[ELine[k].LineCode] == false) {
                                    LLRect=this.getLinelatLon(MapFileData, ELine[k].LineCode, LLRect);
                                    LC[ELine[k].LineCode] = true;
                                }
                            }
                        }
                    }
                }
                switch (ld.Type) {
                    case enmLayerType.Trip:
                        break;
                    case enmLayerType.Mesh: {
                        for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                            let Meshcode = ld.atrObject.atrObjectData[j].Name;
                            let RectLatLon = spatial.Get_Ido_Kedo_from_MeshCode(Meshcode, ld.MeshType);
                            LLRect = spatial.getCircumscribedRectangle(RectLatLon.toRectangle(), LLRect);
                        }
                        break;
                    }
                    case enmLayerType.DefPoint: {
                        for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                            let p = spatial.Get_Reverse_XY(ld.atrObject.atrObjectData[j].CenterPoint, Zahyo)
                            LLRect = spatial.getCircumscribedRectangle(p, LLRect);
                        }
                        break;
                    }
                    case enmLayerType.Normal: {
                        for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                            if (ld.Shape == enmShape.PointShape) {
                                let p = spatial.Get_Reverse_XY(ld.atrObject.atrObjectData[j].CenterPoint, Zahyo)
                                LLRect = spatial.getCircumscribedRectangle(p, LLRect)
                            } else {
                                let ELine = this.Get_Enable_KenCode_MPLine(i, j)
                                for (let k = 0; k < ELine.length; k++) {
                                    let cd = ELine[k].LineCode;
                                    if (LC[cd] == false) {
                                        LLRect=this.getLinelatLon(MapFileData, cd, LLRect);
                                        LC[cd] = true;
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        return LLRect;
    }

    this.getLinelatLon= function(mapdata,LineNumber,rect){
        let ml=mapdata.MPLine[LineNumber];
        let LP=[];
        for (let i = 0; i <  ml.NumOfPoint;i++){
            LP.push( spatial.Get_Reverse_XY(ml.PointSTC[i], this.TotalData.ViewStyle.Zahyo))
        }
        let rectf = spatial.getCircumscribedRectangle(LP);
        let newRect = spatial.getCircumscribedRectangle(rect, rectf)  ;
        return newRect;
    }
    //MANDARAファイルデータを開く
    this.OpenNewMandaraFile = function (MapDataList, attrText, filename, ext) {
        let retv;
        if (ext == "clipboard") {
            retv = this.SetDataFromClipBoard(MapDataList, attrText)
            this.TotalData.LV1.DataSourceType = enmDataSource.Clipboard;
            this.TotalData.LV1.FileName = "Clipboard";
        }
        if (ext == "csv") {
            retv = this.SetDataFromClipBoard(MapDataList, attrText);
            this.TotalData.LV1.DataSourceType = enmDataSource.CSV;
            this.TotalData.LV1.FileName = filename;
        }
        
        if (ext == "mdrj") {
            retv = this.SetDataFromMDRJ(MapDataList, attrText);
            this.TotalData.LV1.DataSourceType = enmDataSource.MDRJ;
            this.TotalData.LV1.FileName = filename;
        }
        if (ext == "mdrmj") {
            retv = this.SetDataFromMDRJ(MapDataList, attrText);
            this.TotalData.LV1.DataSourceType = enmDataSource.MDRMJ;
            this.TotalData.LV1.FileName = filename;
        }
        if (retv.ok == true) {
            this.initTotalData_andOther();
        }
        return retv;
    }
    //mdrjファイルから読み込み
    this.SetDataFromMDRJ = function (MapDataList, attrText) {
        this.MapData = new clsAttrMapData();
        for (let i = 0; i < MapDataList.length; i++) {
            this.MapData.AddExistingMapData(MapDataList[i], MapDataList[i].Map.filename);
        }

        let odata = JSON.parse(attrText);
        
        if(odata.hasOwnProperty("mapData")){
            //地図データ付属形式
            for(let mapfname in odata.mapData){
                let mdata = new clsMapdata();
                mdata.openJsonMapData(odata.mapData[mapfname],true);
                mdata.Map.filename = mapfname;
                this.MapData.AddExistingMapData(mdata, mdata.Map.filename);
            }
        }

        this.TotalData.initTotalData();
        let existFont=[];
        let nonExistFont=[];
        let lv1 = this.TotalData.LV1;
        lv1.Comment = odata.TotalData.LV1.Comment;
        lv1.Lay_Maxn = odata.TotalData.LV1.Lay_Maxn;
        lv1.Print_Mode_Total = odata.TotalData.LV1.Print_Mode_Total;
        lv1.SelectedLayer = odata.TotalData.LV1.SelectedLayer;

        let vs = this.TotalData.ViewStyle;
        let oldvs = odata.TotalData.ViewStyle;
        vs.AttMapCompass = cnvCompass(oldvs.AttMapCompass);
        let oldSCR = oldvs.ScrData;
        let vss = vs.ScrData;
        vss.Accessory_Base = oldSCR.Accessory_Base;
        vss.frmPrint_FormSize = cnvRectgle(oldSCR.frmPrint_FormSize);
        vss.GSMul = oldSCR.GSMul;
        vss.MapRectangle = cnvRectgle(oldSCR.MapRectangle);
        vss.MapScreen_Scale = cnvRectgle(oldSCR.MapScreen_Scale);
        Object.assign(vss.PrinterMG, oldSCR.PrinterMG);
        Object.assign(vss.ScreenMG, oldSCR.ScreenMG);
        vss.Screen_Margin.ClipF = oldSCR.Screen_Margin.ClipF;
        vss.Screen_Margin.rect = cnvRectgle(oldSCR.Screen_Margin.rect);
        vss.ScrRectangle = cnvRectgle(oldSCR.ScrRectangle);
        vss.ScrView = cnvRectgle(oldSCR.ScrView);
        Object.assign(vss.ThreeDMode, oldSCR.ThreeDMode);

        vs.Dummy_Size_Flag = oldvs.Dummy_Size_Flag;
        //点ダミーオブジェクトの記号
        let oldDOG = oldvs.DummyObjectPointMark;
        for (let key in oldDOG) {
            let d = oldDOG[key];
            let nd = [];
            for (let i = 0; i < d.length; i++) {
                let dd = new strDummyObjectPointMark_Info();
                dd.ObjectKindName = d.ObjectKindName;
                dd.Mark = cnvMarkProperty(d.Mark);
                nd.push[dd];
            }
            vs.DummyObjectPointMark[key] = nd;
        }
        let lp = vs.LatLonLine_Print;
        let olp = oldvs.LatLonLine_Print;
        if(olp.Lat_Interval==undefined){olp.Lat_Interval=1;}
        if(olp.Lon_Interval==undefined){olp.Lon_Interval=1;}
        lp.Lat_Interval = olp.Lat_Interval;
        lp.Lon_Interval = olp.Lon_Interval;
        lp.LPat = cnvLineProperty(olp.LPat);
        lp.Order = olp.Order;
        lp.Visible = olp.Visible;

        vs.MapLegend = cnvMapLegend(oldvs.MapLegend);

        vs.MapPrint_Flag = oldvs.MapPrint_Flag;
        vs.MapScale = cnvMapSCL(oldvs.MapScale);
        vs.MapTitle = cnvMapTitle(oldvs.MapTitle);
        vs.DataNote = cnvDataNode(oldvs.DataNote);
        vs.Missing_Data = cnvMissingData(oldvs.Missing_Data);
        vs.PointPaint_Order = oldvs.PointPaint_Order;
        if(vs.PointPaint_Order==undefined){//試作版0.0のmdrjファイルの問題への対処
            vs.PointPaint_Order=enmPointOnjectDrawOrder.LowerToUpperCategory;
        }
        vs.Screen_Back = cnvScreen_Back(oldvs.Screen_Back);
        vs.AccessoryGroupBox = cnvAccessoryGroupBox(oldvs.AccessoryGroupBox);
        vs.Screen_Setting = cnvScreen_Setting(oldvs.Screen_Setting);
        vs.ValueShow=cnvValueShow(oldvs.ValueShow);
        vs.SouByou = cnvSouByou(oldvs.SouByou);
        vs.TileMapView=cnvTileMapView(oldvs.TileMapView);
        vs.SymbolLine.Visible = oldvs.SymbolLine.Visible;
        vs.SymbolLine.Line = cnvLineProperty(oldvs.SymbolLine.Line);
        vs.Zahyo = new Zahyo_info();
        Object.assign(vs.Zahyo, oldvs.Zahyo);
        vs.Zahyo.CenterXY=cnvPoint(oldvs.Zahyo.CenterXY);

        this.TotalData.Condition = cnvCondition(odata.TotalData.Condition);
        this.TotalData.TotalMode = cnvTotalmode(odata.TotalData.TotalMode);
        //レイヤデータの読み込み
        for (let i = 0; i < lv1.Lay_Maxn; i++) {
            this.LayerData[i] = cnvLayerData(odata.LayerData[i]);
        }
        
        //レイヤに地図ファイルを設定
        let mpfileEr="";
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let fname = this.LayerData[i].MapFileName.toUpperCase();
            if (this.MapData.CheckMapfileExists(fname) == true) {
                this.LayerData[i].MapFileData = this.MapData.SetMapFile(fname);
                this.LayerData[i].MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(fname);
            } else {
                let tx = "";
                switch (fname) {
                    case "JAPAN.MPFJ":
                    case "日本緯度経度.MPFJ":
                    case "WORLD.MPFJ":
                        tx = preReadMapFile[fname];
                        break;
                } 
                if (tx != "") {
                    let mapdata = new clsMapdata();
                    mapdata.openJsonMapData(tx);
                    this.MapData.AddExistingMapData(mapdata, fname);
                    this.LayerData[i].MapFileData = this.MapData.SetMapFile(fname);
                    this.LayerData[i].MapFileObjectNameSearch = this.MapData.SetObject_Name_Search( fname);
                }else{
                    mpfileEr += "地図ファイル" + fname + "を読み込んでください。\n";
                }
            }
        }
        if(mpfileEr!=""){
            return { ok: false, emes: mpfileEr };
        }

        let ObjectErrorMessage="";
        //線種の設定
        let saveLPat = odata.saveLPat;
        let ct = 0;
        for (let i = 0; i < saveLPat.MapNum; i++) {
            let mpk = this.SetMapFile(saveLPat.MapFileName[i]).Map.LpNum;
            let setN = 0;
            //線種名が地図ファイルと属性データファイルと同じものを探し、セットする
            for (let j = 0; j < mpk; j++) {
                let mapLkind = this.SetMapFile(saveLPat.MapFileName[i]).LineKind[j]
                for (let k = 0; k < saveLPat.LpatNumByMapfile[i]; k++) {
                    if (saveLPat.Lpat[ct + k].Name == mapLkind.Name) {
                        if (mapLkind.NumofObjectGroup != saveLPat.Lpat[ct + k].NumofObjectGroup) {
                        } else {
                            for (let og = 0; og < mapLkind.NumofObjectGroup; og++) {
                                if(mapLkind.ObjGroup[og].GroupNumber==saveLPat.Lpat[ct + k].ObjGroup[og].GroupNumber){
                                    mapLkind.ObjGroup[og].Pattern=cnvLineProperty( saveLPat.Lpat[ct + k].ObjGroup[og].Pattern);
                                }
                            }
                            setN++;
                            break;
                        }
                    }
                }
            }
            if ((setN != mpk) || (setN != saveLPat.LpatNumByMapfile[i])) {
                ObjectErrorMessage = "地図ファイル" + saveLPat.MapFileName[i] + "の線種が変更されています。" + "\n"
            }
            ct += saveLPat.LpatNumByMapfile[i];
        }
        
        //投影法の設定
        if (this.TotalData.ViewStyle.Zahyo.Projection != this.MapData.SetMapFile("").Map.Zahyo.Projection) {
            let MapFileList = attrData.GetMapFileName();
            for (let i = 0; i < MapFileList.length; i++) {
                attrData.SetMapFile(MapFileList[i]).Convert_ZahyoMode(this.TotalData.ViewStyle.Zahyo);
            }
        }
        return { ok: true, emes: ObjectErrorMessage };

        //-----------------
        function cnvAccessoryGroupBox(oa){
            let d=new strAccessoryGroupBox_Info();
            Object.assign(d, oa);
            d.Back=cnvBackGround_Box_Property(oa.Back);
            return d;
        }

        function cnvLayerData(oldLay) {
            let ld = new strLayerDataInfo();
            ld.Name = oldLay.Name;
            ld.MapFileName = oldLay.MapFileName;
            ld.Shape = oldLay.Shape;
            ld.Type = oldLay.Type;
            ld.MeshType = oldLay.MeshType;
            ld.ReferenceSystem = oldLay.ReferenceSystem;
            ld.Time = cnvTime(oldLay.Time);
            ld.Comment = oldLay.Comment;
            ld.Print_Mode_Layer = oldLay.Print_Mode_Layer;

            let lda = ld.atrObject;// オブジェクトの情報
            lda.ObjectNum = oldLay.atrObject.ObjectNum;
            lda.NumOfSyntheticObj = oldLay.atrObject.NumOfSyntheticObj;
            for (let i = 0; i < oldLay.atrObject.atrObjectData.length; i++) {
                let od = oldLay.atrObject.atrObjectData[i];
                let d = new strObject_Data_Info();
                d.MpObjCode = od.MpObjCode;
                d.Name = od.Name;
                d.Objectstructure = od.Objectstructure;
                d.HyperLinkNum = od.HyperLinkNum;
                for (let i in od.HyperLink) {
                    let ud = new strURL_Data();
                    Object.assign(ud, od.HyperLink[i]);
                    d.HyperLink.push(ud);
                }
                d.CenterPoint = cnvPoint(od.CenterPoint);
                d.Symbol = cnvPoint(od.Symbol);
                d.Label = cnvPoint(od.Label);
                d.MeshRect = cnvRectgle(od.MeshRect);
                d.defPoint = new latlon(od.defPoint.lat, od.defPoint.lon);
                for(let i in od.MeshPoint){
                    d.MeshPoint.push(cnvPoint(od.MeshPoint[i]));
                }
                d.Visible = od.Visible;
                lda.atrObjectData.push(d);
            }
            for (let i = 0; i < oldLay.atrObject.MPSyntheticObj.length; i++) {
                let od = oldLay.atrObject.MPSyntheticObj[i];
                let d = new strSynthetic_Object_Data();
                d.Kind = od.Kind;
                d.NumOfObject = od.NumOfObject;
                d.Name = od.Name;
                d.CenterP = cnvPoint(od.CenterP);
                d.SETime = cnvStart_End_Time_data(od.SETime);
                d.Shape = od.Shape;
                d.Circumscribed_Rectangle = new rectangle();
                d.Objects = [];
                for (let j in o.Objects) {
                    let s = new strSynthetic_ObjectName_and_Code();
                    Object.assign(s, o.Objects[j]);
                    d.Objects.push(s);
                }
                lda.MPSyntheticObj.push(d);
            }

            let ldd = ld.atrData;//データ項目の情報
            ldd.Count = oldLay.atrData.Count;
            ldd.SelectedIndex = oldLay.atrData.SelectedIndex;
            for (let i in oldLay.atrData.Data) {
                let od = oldLay.atrData.Data[i];
                let d = new strData_info();
                Object.assign(d, od);
                d.Statistics = new strStatisticInfo();
                Object.assign(d.Statistics, od.Statistics);
                let dts = new strSoloModeViewSettings_Data();
                let odts = od.SoloModeViewSettings;
                dts.Div_Method = odts.Div_Method;
                dts.Div_Num = odts.Div_Num;
                dts.Class_Div = [];
                for (let j in odts.Class_Div) {
                    let s = new strClass_Div_data();
                    s.Value = odts.Class_Div[j].Value;
                    s.PaintColor = cnvColorProperty(odts.Class_Div[j].PaintColor);
                    s.ClassMark = cnvMarkProperty(odts.Class_Div[j].ClassMark);
                    s.ODLinePat = cnvLineProperty(odts.Class_Div[j].ODLinePat);
                    dts.Class_Div.push(s);
                }
                dts.ClassMarkMD = new strInner_Data_Info();
                Object.assign(dts.ClassMarkMD, odts.ClassMarkMD);
                dts.ClassODMD = new strClassODMode_data();
                Object.assign(dts.ClassODMD, odts.ClassODMD);
                dts.ClassODMD.Arrow = cnvArrow(odts.ClassODMD.Arrow);
                if(dts.ClassODMD.Dummy_ObjectFlag==undefined){
                    dts.ClassODMD.Dummy_ObjectFlag=false;
                }
                dts.ClassPaintMD = new strClassPaint_Data();
                dts.ClassPaintMD.color1 = cnvColorProperty(odts.ClassPaintMD.color1);
                dts.ClassPaintMD.color2 = cnvColorProperty(odts.ClassPaintMD.color2);
                dts.ClassPaintMD.color3 = cnvColorProperty(odts.ClassPaintMD.color3);
                dts.ClassPaintMD.Color_Mode = odts.ClassPaintMD.Color_Mode;
                dts.ContourMD = new strContour_Data();
                Object.assign(dts.ContourMD, odts.ContourMD);
                dts.ContourMD.Regular = new strContour_Data_Regular_interval();
                Object.assign(dts.ContourMD.Regular, odts.ContourMD.Regular);
                dts.ContourMD.Regular.Line_Pat = cnvLineProperty(odts.ContourMD.Regular.Line_Pat);
                dts.ContourMD.Regular.SP_Line_Pat = cnvLineProperty(odts.ContourMD.Regular.SP_Line_Pat);
                dts.ContourMD.Regular.EX_Line_Pat = cnvLineProperty(odts.ContourMD.Regular.EX_Line_Pat);
                dts.ContourMD.Irregular = [];
                for (let j in odts.ContourMD.Irregular) {
                    let ir = new strContour_Data_Irregular_interval();
                    ir.Value = odts.ContourMD.Irregular[j].Value;
                    ir.Line_Pat = cnvLineProperty(odts.ContourMD.Irregular[j].Line_Pat);
                    ddts.ContourMD.Irregular.push(ir);
                }
                dts.MarkCommon = new strMarkCommon_Data();
                dts.MarkCommon.Inner_Data = new strInner_Data_Info();
                Object.assign(dts.MarkCommon.Inner_Data, odts.MarkCommon.Inner_Data);
                dts.MarkCommon.MinusTile = cnvTileProperty(odts.MarkCommon.MinusTile);
                dts.MarkCommon.MinusLineColor = cnvColorProperty(odts.MarkCommon.MinusLineColor);
                dts.MarkCommon.LegendMinusWord = odts.MarkCommon.LegendMinusWord;
                dts.MarkCommon.LegendPlusWord = odts.MarkCommon.LegendPlusWord;
                dts.MarkBarMD = new strMarkBar_Data();
                Object.assign(dts.MarkBarMD, odts.MarkBarMD);
                dts.MarkBarMD.InnerTile = cnvTileProperty(odts.MarkBarMD.InnerTile);
                dts.MarkBarMD.FrameLinePat = cnvLineProperty(odts.MarkBarMD.FrameLinePat);
                dts.MarkBarMD.scaleLinePat = cnvLineProperty(odts.MarkBarMD.scaleLinePat);
                if(dts.MarkBarMD.BarShape==undefined){
                    dts.MarkBarMD.BarShape = enmMarkBarShape.bar;
                }
                dts.MarkBlockMD = new strMarkBlock_Data();
                Object.assign(dts.MarkBlockMD, odts.MarkBlockMD);
                dts.MarkBlockMD.Mark = cnvMarkProperty(odts.MarkBlockMD.Mark);
                dts.MarkSizeMD = new strMarkSize_Data();
                dts.MarkSizeMD.MaxValueMode = odts.MarkSizeMD.MaxValueMode;
                dts.MarkSizeMD.MaxValue = odts.MarkSizeMD.MaxValue;
                dts.MarkSizeMD.Value = odts.MarkSizeMD.Value.concat();
                dts.MarkSizeMD.Mark = cnvMarkProperty(odts.MarkSizeMD.Mark);
                dts.MarkSizeMD.LineShape = new strMarkSizeModeLineShapeData();
                dts.MarkSizeMD.LineShape.LineWidth = odts.MarkSizeMD.LineShape.LineWidth;
                dts.MarkSizeMD.LineShape.LineEdge = cnvLineEdgeProperty(odts.MarkSizeMD.LineShape.LineEdge);
                dts.MarkSizeMD.LineShape.Color = cnvColorProperty(odts.MarkSizeMD.LineShape.Color);
                dts.MarkTurnMD = new strMarkTurnMode_Data();
                dts.MarkTurnMD.Dirction = odts.MarkTurnMD.Dirction;
                dts.MarkTurnMD.DegreeLap = odts.MarkTurnMD.DegreeLap;
                dts.MarkTurnMD.Mark = cnvMarkProperty(odts.MarkTurnMD.Mark);
                dts.StringMD = new strString_Data();
                dts.StringMD.Font = cnvFontProperty(odts.StringMD.Font);
                dts.StringMD.maxWidth = odts.StringMD.maxWidth;
                dts.StringMD.WordTurnF = odts.StringMD.WordTurnF;
                d.SoloModeViewSettings = dts;
                ldd.Data.push(d);
            }

            ld.Dummy = [];//ダミーオブジェクト
            for (let i in oldLay.Dummy) {
                let d = new strDummyObjectName_and_Code();
                Object.assign(d, oldLay.Dummy[i]);
                ld.Dummy.push(d);
            }
            ld.DummyGroup = [];//ダミーオブジェクトグループ
            ld.DummyGroup = oldLay.DummyGroup.concat();

            let oldv = oldLay.LayerModeViewSettings;
            let oldvl = oldv.LabelMode;
            let ldv = ld.LayerModeViewSettings;
            ldv.LabelMode = new strLabelMode_Data_info();//ラベルモード
            ldv.LabelMode.SelectedIndex = oldvl.SelectedIndex;
            for (let i in oldvl.DataSet) {
                let od = oldvl.DataSet[i];
                let d = new strLabel_Data();
                Object.assign(d, od);
                d.DataItem = od.DataItem.concat();
                d.Location_Mark = cnvMarkProperty(od.Location_Mark);
                d.DataValue_Font = cnvFontProperty(od.DataValue_Font);
                d.ObjectName_Font= cnvFontProperty(od.ObjectName_Font);
                d.BorderObjectTile = cnvTileProperty(od.BorderObjectTile);
                d.BorderDataTile = cnvTileProperty(od.BorderDataTile);
                d.BorderLine = cnvLineProperty(od.BorderLine);
                ldv.LabelMode.DataSet.push(d);
            }
            let oldvg = oldv.GraphMode;
            ldv.GraphMode = new strGraphMode_DataSetting_Info();//グラフモード
            ldv.GraphMode.SelectedIndex = oldvg.SelectedIndex;
            for (let i in oldvg.DataSet) {
                let od = oldvg.DataSet[i];
                let d = new strGraph_Data();
                Object.assign(d, od);
                d.En_Obi = new strGraph_Data_En();
                Object.assign(d.En_Obi, od.En_Obi);
                d.En_Obi.BoaderLine = cnvLineProperty(od.En_Obi.BoaderLine);
                d.Oresen_Bou = new strGraph_Data_Oresen();
                Object.assign(d.Oresen_Bou, od.Oresen_Bou);
                d.Oresen_Bou.Line = cnvLineProperty(od.Oresen_Bou.Line);
                d.Oresen_Bou.BackgroundTile = cnvTileProperty(od.Oresen_Bou.BackgroundTile);
                d.Oresen_Bou.BorderLine = cnvLineProperty(od.Oresen_Bou.BorderLine);
                d.Data = [];
                for (let j in od.Data) {
                    let s = new GraphModeDataItem();
                    s.DataNumber = od.Data[j].DataNumber;
                    s.Tile = cnvTileProperty(od.Data[j].Tile);
                    d.Data.push(s);
                }
                ldv.GraphMode.DataSet.push(d);
            }

            
            ldv.PointLineShape.LineWidth = oldv.PointLineShape.LineWidth;
            ldv.PointLineShape.LineEdge = cnvLineEdgeProperty(oldv.PointLineShape.LineEdge);
            ldv.PointLineShape.PointMark = cnvMarkProperty(oldv.PointLineShape.PointMark);
            ldv.PolygonDummy_ClipSet_F = oldv.PolygonDummy_ClipSet_F;

            for (let i in oldLay.ODBezier_DataStac) {
                let d = new ODBezier_Data();
                Object.assign(d, oldLay.ODBezier_DataStac[i]);
                d.Point = cnvPoint(oldLay.ODBezier_DataStac[i].Point);
                ld.ODBezier_DataStac.push(d);
            }
            return ld;
        }

        function cnvArrow(oa) {
            let a = new Arrow_Data();
            Object.assign(oa);
            return a;
        }
        function cnvStart_End_Time_data(ot) {
            let nt = new Start_End_Time_data();
            nt.StartTime = strYMD(ot.StartTime);
            nt.EndTime = strYMD(ot.EndTime);
            return nt;
        }
        function cnvTime(oldT) {
            return new strYMD(oldT.Year, oldT.Month, oldT.Day);
        }
        function cnvTotalmode(oldTM) {
            let otmo = oldTM.OverLay;
            let tm = new strTotalMode_Info();
            let tmo = tm.OverLay;
            tmo.SelectedIndex = otmo.SelectedIndex;
            tmo.Always_Overlay_Index = otmo.Always_Overlay_Index;
            for (let i = 0; i < otmo.DataSet.length; i++) {
                let od = otmo.DataSet[i];
                let d = new strOverLay_Dataset_Info();
                d.title = od.title;
                d.SelectedIndex = od.SelectedIndex;
                d.Note = od.Note;
                for (let j = 0; j < od.DataItem.length; j++) {
                    let itm = new strOverLay_DataSet_Item_Info();
                    Object.assign(itm, od.DataItem[j]);
                    d.DataItem.push(itm);
                }
                tmo.DataSet.push(d);
            }
            let otms = oldTM.Series;
            let tms = tm.Series;
            tms.SelectedIndex = otms.SelectedIndex;
            for (let i = 0; i < otms.DataSet.length; i++) {
                let od = otms.DataSet[i];
                let d = new strSeries_Dataset_Info();
                d.title = od.title;
                d.SelectedIndex = od.SelectedIndex;
                for (let j = 0; j < od.DataItem.length; j++) {
                    let itm = new strSeries_DataSet_Item_Info();
                    Object.assign(itm, od.DataItem[j]);
                    d.DataItem.push(itm);
                }
                tms.DataSet.push(d);
            }
            return tm;
        }

        function cnvCondition(oldC) {
            let cd = [];
            for (let i = 0; i < oldC.length; i++) {
                let od = oldC[i];
                let d = new strCondition_DataSet_Info();
                d.Enabled = od.Enabled;
                d.Layer = od.Layer;
                d.Name = od.Name;
                for (let j = 0; j < od.Condition_Class.length; j++) {
                    let oind = od.Condition_Class[j];
                    let ind = new strCondition_Data_Info();
                    ind.And_OR = oind.And_OR;
                    for (let k = 0; k < oind.Condition.length; k++) {
                        let lim = new strCondition_Limitation_Info();
                        Object.assign(lim, oind.Condition[k]);
                        ind.Condition.push(lim);
                    }
                    d.Condition_Class.push(ind);
                }
                cd.push(d);
            }
            return cd;
        }
        function cnvTileMapView(oldTV){
            let tm = new strTileMapViewInfo();
            Object.assign(tm, oldTV);
            return tm;
        }

        function cnvSouByou(oldSB) {
            let sb = new strSouByou_Info();
            Object.assign(sb, oldSB);
            if (sb.Auto==undefined){
                sb.Auto=false;
                sb.AutoDegree=2;
            }
            return sb;
        }

        function cnvValueShow(oldvs) {
            let sv = new strValueShow_Info();
            Object.assign(sv, oldvs);
            if (sv.DecimalNumber == undefined) {
                sv.DecimalNumber = 0;
            }
            if (sv.DecimalSepaF == undefined) {
                sv.DecimalSepaF = false;
            }
            sv.ValueFont = cnvFontProperty(oldvs.ValueFont);
            sv.ObjNameFont = cnvFontProperty(oldvs.ObjNameFont);
            return sv;
        }

        function cnvScreen_Setting(oldSS) {
            let ss = [];
            for (let i = 0; i < oldSS.length; i++) {
                let s = new strScreen_Setting_Data_Info();
                s.title = oldSS.Title;
                s.frmPrint_FormSize = cnvRectgle(oldSS.frmPrint_FormSize);
                s.ScrView = cnvRectgle(oldSS.ScrView);
                s.Screen_Margin = new ScreenMargin();
                s.Screen_Margin.ClipF = oldSS.Screen_Margin.ClipF;
                s.Screen_Margin.rect = cnvRectgle(oldSS.Screen_Margin.rect);
                s.Accessory_Base = oldSS.Accessory_Base;
                s.MapScale = cnvMapSCL(oldSS.MapScale);
                s.MapTitle = cnvMapTitle(oldSS.MapTitle);
                s.DataNote = cnvDataNode(oldvs.DataNote);
                s.AttMapCompass = cnvCompass(oldvs.AttMapCompass);
                s.MapLegend = cnvMapLegend(oldvs.MapLegend);
                s.ThreeDMode = new strThreeDMode_Set();
                Object.assign(s.ThreeDMode, soldSS.ThreeDMode);
                ss.push(s);
            }
            return ss;
        }

        function cnvDataNode(oldDN) {
            let dn = new strNote_Attri();
            dn.Visible = oldDN.Visible;
            dn.Position = cnvPoint(oldDN.Position);
            dn.MaxWidth = oldDN.MaxWidth;
            dn.Font = cnvFontProperty(oldDN.Font);
            return dn;
        }

        function cnvScreen_Back(oldsb) {
            let sb = new strScreen_Back_data();
            sb.MapAreaFrameLine = cnvLineProperty(oldsb.MapAreaFrameLine);
            sb.ScreenFrameLine = cnvLineProperty(oldsb.ScreenFrameLine);
            sb.ScreenAreaBack = cnvTileProperty(oldsb.ScreenAreaBack);
            sb.MapAreaBack = cnvTileProperty(oldsb.MapAreaBack);
            sb.ObjectInner = cnvTileProperty(oldsb.ObjectInner);
            return sb;
        }
        function cnvMissingData(oldM) {
            let m = new strMissing_set();
            m.Print_Flag = oldM.Print_Flag;
            m.Text = oldM.Text;
            m.PaintTile = cnvTileProperty(oldM.PaintTile);
            m.Mark = cnvMarkProperty(oldM.Mark);
            m.BlockMark = cnvMarkProperty(oldM.BlockMark);
            m.ClassMark = cnvMarkProperty(oldM.ClassMark);
            m.MarkBar = cnvMarkProperty(oldM.MarkBar);
            m.Label = oldM.Label;
            m.LineShape = cnvLineProperty(oldM.LineShape);
            return m;
        }
        function cnvMapTitle(oldTtl) {
            let ttl = new strTitle_Attri();
            ttl.Visible = oldTtl.Visible;
            ttl.Position = cnvPoint(oldTtl.Position);
            ttl.MaxWidth = oldTtl.MaxWidth;
            ttl.Font = cnvFontProperty(oldTtl.Font);
            return ttl;
        }
        function cnvMapSCL(olsSCL) {
            let scl = new strScale_Attri();
            scl.Visible = olsSCL.Visible;
            scl.Position = cnvPoint(olsSCL.Position);
            scl.Font = cnvFontProperty(olsSCL.Font);
            scl.BarPattern = olsSCL.BarPattern;
            scl.BarAuto = olsSCL.BarAuto;
            scl.BarDistance = olsSCL.BarDistance;
            scl.BarKugiriNum = olsSCL.BarKugiriNum;
            scl.Back = cnvBackGround_Box_Property(olsSCL.Back);
            scl.Unit = olsSCL.Unit;
            return scl;
        }
        function cnvMapLegend(oldML) {
            let MapLegend = new strLegend_Attri();
            let mlb = MapLegend.Base;
            mlb.Back = cnvBackGround_Box_Property(oldML.Base.Back);
            mlb.Font = cnvFontProperty(oldML.Base.Font);
            mlb.Legend_Num = oldML.Base.Legend_Num
            mlb.LegendXY = [];
            for (let i = 0; i < mlb.Legend_Num; i++) {
                mlb.LegendXY.push(cnvPoint(oldML.Base.LegendXY[i]));
            }
            mlb.Visible = oldML.Base.Visible;
            mlb.Comma_f = oldML.Base.Comma_f;
            mlb.ModeValueInScreenFlag = oldML.Base.ModeValueInScreenFlag;
            if (mlb.ModeValueInScreenFlag == undefined) {
                mlb.ModeValueInScreenFlag = false;
            }
            let mlc = MapLegend.ClassMD;
            mlc.ClassMarkFrame_Visible = oldML.ClassMD.ClassMarkFrame_Visible;
            mlc.PaintMode_Line = cnvLineProperty(oldML.ClassMD.PaintMode_Line);
            mlc.PaintMode_Method = oldML.ClassMD.PaintMode_Method;
            mlc.PaintMode_Width = oldML.ClassMD.PaintMode_Width;
            mlc.SeparateGapSize = oldML.ClassMD.SeparateGapSize;
            mlc.SeparateClassWords = oldML.ClassMD.SeparateClassWords;
            mlc.FrequencyPrint = oldML.ClassMD.FrequencyPrint;
            mlc.ClassBoundaryLine.Visible = oldML.ClassMD.ClassBoundaryLine.Visible;
            mlc.ClassBoundaryLine.LPat = cnvLineProperty(oldML.ClassMD.ClassBoundaryLine.LPat);
            if (oldML.ClassMD.CategorySeparate_f == undefined) {
                oldML.ClassMD.CategorySeparate_f = false;
            }
            mlc.CategorySeparate_f = oldML.ClassMD.CategorySeparate_f;
            MapLegend.En_Graph_Pattern = oldML.En_Graph_Pattern;

            let mll = MapLegend.Line_DummyKind;
            mll.Back = cnvBackGround_Box_Property(oldML.Line_DummyKind.Back);
            mll.Dummy_Point_Visible = oldML.Line_DummyKind.Dummy_Point_Visible;
            mll.Line_Pattern = oldML.Line_DummyKind.Line_Pattern;
            mll.Line_Visible = oldML.Line_DummyKind.Line_Visible;
            mll.Line_Visible_Number_STR = oldML.Line_DummyKind.Line_Visible_Number_STR;

            let mlm = MapLegend.MarkMD;
            mlm.CircleMD_CircleMini_F = oldML.MarkMD.CircleMD_CircleMini_F;
            mlm.MultiEnMode_Line = cnvLineProperty(oldML.MarkMD.MultiEnMode_Line);

            Object.assign(MapLegend.OverLay_Legend_Title, oldML.OverLay_Legend_Title);

            return MapLegend;
        }

        function cnvPoint(oldP) {
            return new point(oldP.x, oldP.y);
        }
        function cnvRectgle(orect) {
            let rec = new rectangle(orect.left, orect.right, orect.top, orect.bottom);
            return rec;
        }
        function cnvCompass(ovsc) {
            let vsc = new strCompass_Attri();
            vsc.dirWord.East = ovsc.dirWord.East;
            vsc.dirWord.West = ovsc.dirWord.West;
            vsc.dirWord.North = ovsc.dirWord.North;
            vsc.dirWord.South = ovsc.dirWord.South;
            vsc.Visible = ovsc.Visible;
            vsc.Font = cnvFontProperty(ovsc.Font);
            vsc.Mark = cnvMarkProperty(ovsc.Mark);
            vsc.Position.x = ovsc.Position.x;
            vsc.Position.y = ovsc.Position.y;
            return vsc;
        }
        function cnvMarkProperty(oldMK) {
            let mk = new Mark_Property();
            mk.PrintMark = oldMK.PrintMark;
            mk.ShapeNumber = oldMK.ShapeNumber;
            mk.Tile = cnvTileProperty(oldMK.Tile);
            mk.Line = cnvLineProperty(oldMK.Line);
            mk.wordmark = oldMK.wordmark;
            mk.WordFont = cnvFontProperty(oldMK.WordFont);
            return mk;
        }
        function cnvFontProperty(oldFont) {
            let fnt = new Font_Property();
            fnt.Color = cnvColorProperty(oldFont.Color);
            fnt.Size = oldFont.Size;
            fnt.italic = oldFont.italic;
            fnt.bold = oldFont.bold;
            fnt.Underline = oldFont.Underline;
            fnt.Name = oldFont.Name;
            fnt.Kakudo = oldFont.Kakudo;
            fnt.FringeF = oldFont.FringeF;
            fnt.FringeWidth = oldFont.FringeWidth;
            fnt.FringeColor = cnvColorProperty(oldFont.FringeColor);
            fnt.Back = cnvBackGround_Box_Property(oldFont.Back);
            //フォントの有無チェック
            if(existFont.indexOf(fnt.Name)==-1){
                if(nonExistFont.indexOf(fnt.Name)==-1){
                    if(Generic.checkFontExist(fnt.Name)==true){
                        existFont.push(fnt.Name);
                    }else{
                        nonExistFont.push(fnt.Name);
                        fnt.Name=clsSettingData.SetFont;
                    }
                }else{
                    fnt.Name=clsSettingData.SetFont;
                }
            }
            return fnt;
        }
        function cnvBackGround_Box_Property(oldBK) {
            let bk = new BackGround_Box_Property();
            bk.Tile = cnvTileProperty(oldBK.Tile)
            bk.Line = cnvLineProperty(oldBK.Line);
            bk.Round = oldBK.Round;
            bk.Padding = oldBK.Padding;
            return bk;
        }
        function cnvColorProperty(oldColor) {
            let col = new colorRGBA();
            return Object.assign(col, oldColor);
        }
        function cnvLineProperty(oldLine) {
            let line = new Line_Property();
            line.BlankF = oldLine.BlankF;
            line.Width = oldLine.Width;
            line.Color = cnvColorProperty(oldLine.Color);
            line.Edge_Connect_Pattern = cnvLineEdgeProperty(oldLine.Edge_Connect_Pattern);
            return line;
        }
        function cnvLineEdgeProperty(oldLineEdsge) {
            let ledge = new LineEdge_Connect_Pattern_Data_Info();
            return Object.assign(ledge, oldLineEdsge);
        }
        function cnvTileProperty(oldTile) {
            let tile = new Tile_Property();
            tile.BlankF = oldTile.BlankF;
            tile.Color = cnvColorProperty(oldTile.Color);
            return tile;
        }
}

    //クリップボードから読み込み
    this.SetDataFromClipBoard = function (MapDataList, attrText) {
        this.MapData = new clsAttrMapData();
        for (let i = 0; i < MapDataList.length; i++) {
            this.MapData.AddExistingMapData(MapDataList[i], MapDataList[i].Map.filename);
        }

        let str = attrText.split(/\n/);
        let retv = this.ReadAttrDataOneLine(str);
        if (retv.ok == true) {
            this.TotalData.ViewStyle.Zahyo = this.MapData.GetPrestigeZahyoMode();
            let retv2 = this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo);
            if (retv2.ok == false) {
                ObjectErrorMessage += "地図ファイルの座標系・測地系を統一できません。" + '\n' + retv2.emes;
                f = false;
            }
        }
        return { ok: retv.ok, emes: retv.emes };
    }

    //Clipboard,CSVのデータを一行ずつ処理して読み込む
    this.ReadAttrDataOneLine = function (STR) {
        let ObjectErrorMessage = '';
        let lay = -1;
        let LayerReading = new strLayerReadingInfo();
        LayerReading.init();
        let LayerError = "";
        let LayerTypeTripDefinitionExists = false;
        let OK_Flag = true;
        let TotalMissing=false;
        let Map_readed = (this.MapData.GetNumOfMapFile()!=0);
        for (let i = 0; i < STR.length; i++) {
            let tb = STR[i].indexOf('\t');
            let cm = STR[i].indexOf(',');
            let splitter='\t';
            if ((tb == -1) && (cm != -1)) {
                splitter = ",";
            }
            let CutS=Generic.String_Cut(STR[i],splitter);
            const CutN = CutS.length;
            switch (CutS[0].toUpperCase()) {
                case "": {
                    break;
                }
                case "MAP": {
                    if (2 <= CutN) {
                        for (let i = 1; i < CutN; i++) {
                            if(CutS[i]!=""){
                                let fu =Generic.getFilenameWithoutExtension( CutS[i].toUpperCase())+".MPFJ";
                                switch (fu) {//既存地図ファイルを使用
                                    case "JAPAN.MPFJ":
                                    case "日本緯度経度.MPFJ":
                                    case "WORLD.MPFJ": {
                                        if (this.MapData.CheckMapfileExists(fu) == false) {
                                            if (preReadMapFile[fu]) {
                                                let mapdata = new clsMapdata();
                                                mapdata.openJsonMapData(preReadMapFile[fu]);
                                                this.MapData.AddExistingMapData(mapdata, fu);
                                                Map_readed = true;
                                            } else {
                                                ObjectErrorMessage+="地図ファイル" + CutS[i] + "を読み込んでください。";
                                                return { ok: false, emes: ObjectErrorMessage };
                                            }
                                        }
                                        break;
                                    }
                                    default:{
                                        if (this.MapData.CheckMapfileExists(fu) == false) {
                                            ObjectErrorMessage+="地図ファイル" + CutS[i] + "を読み込んでください。";
                                            return { ok: false, emes: ObjectErrorMessage };
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                case "COMMENT": {
                    if (2 <= CutN) {
                        if (lay == -1) {
                            this.TotalData.LV1.Comment += CutS[1] + '\n';
                        }
                        LayerReading.Comment_Temp += CutS[1];
                    }
                    break;
                }
                case "DUMMY": {
                    LayerReading.Dummy_Temp.push(CutS);
                    break;
                }
                case "DUMMY_GROUP": {
                    LayerReading.Dummy_OBKTemp.push(CutS);
                    break;
                }
                case "TITLE": {
                    if (lay == -1) {
                        lay = 0;
                    }
                    LayerReading.TTL = Array.from(CutS);
                    break;
                }
                case "UNIT": {
                    if (lay == -1) {
                        lay = 0;
                    }
                    LayerReading.UNT = Array.from(CutS);
                    break;
                }
                case "DATA_MISSING": {
                    if (lay == -1) {
                        lay = 0;
                    }
                    for (let j = 0; j < CutN; j++) {
                        if (CutS[j].toUpperCase() == "ON") {
                            LayerReading.DTMis[j] = true;
                        } else {
                            LayerReading.DTMis[j] = false;
                        }
                    }
                    break;
                }
                case "NOTE": {
                    if (lay == -1) {
                        lay = 0;
                    }
                    LayerReading.Note = Array.from(CutS);
                    break;
                }
                case "SHAPE": {
                    if (2 <= CutN) {
                        switch (CutS[1].toUpperCase()) {
                            case "POINT": {
                                LayerReading.Shape = enmShape.PointShape;
                                break;
                            }
                            case "LINE": {
                                LayerReading.Shape = enmShape.LineShape;
                                break;
                            }
                            case "POLYGON": {
                                LayerReading.Shape = enmShape.PolygonShape;
                                break;
                            }
                            default:
                                LayerError += "SHAPEタグで" + CutS(1) + "は無効です。";
                        }
                    }
                    break;
                }
                case "TYPE": {
                    if (2 <= CutN) {
                        switch (CutS[1].toUpperCase()) {
                            case "NORMAL": {
                                LayerReading.Type = enmLayerType.Normal;
                                break;
                            }
                            case "TRIP_DEFINITION": {
                                if (LayerTypeTripDefinitionExists == true) {
                                    ObjectErrorMessage += "移動主体定義レイヤは１つしか設定できません。" + '\n';
                                    return { ok: false, emes: ObjectErrorMessage };
                                }
                                LayerReading.Type = enmLayerType.Trip_Definition;
                                LayerTypeTripDefinitionExists = true;
                                break;
                            }
                            case "TRIP": {
                                LayerReading.Type = enmLayerType.Trip;
                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                if (3 <= CutN) {
                                    let Sys = CutS[2];
                                    switch (Sys) {
                                        case "日本": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_tokyo;
                                            break;
                                        }
                                        case "世界": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                            break;
                                        }
                                        case "":{
                                            break;
                                        }
                                        default:
                                            LayerError += "TYPE TRIPの測地系指定で" + Sys + "は無効です。";
                                    }
                                }
                                break;
                            }
                            case "POINT": {
                                LayerReading.Type = enmLayerType.DefPoint;
                                LayerReading.Shape = enmShape.PointShape;
                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                if (3 <= CutN) {
                                    let Sys = CutS[2];
                                    switch (Sys) {
                                        case "日本": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_tokyo;
                                            break;
                                        }
                                        case "世界": {
                                            LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                            break;
                                        }
                                        case "":{
                                            break;
                                        }
                                        default:
                                            LayerError += "TYPE POINTの測地系指定で" + Sys + "は無効です。";
                                    }
                                }
                                break;
                            }
                            case "MESH": {
                                LayerReading.Type = enmLayerType.Mesh
                                if (3 <= CutN) {
                                    let MT = CutS[2];
                                    switch (MT) {
                                        case "1": {
                                            LayerReading.MeshType = enmMesh_Number.mhFirst;
                                            break;
                                        }
                                        case "2": {
                                            LayerReading.MeshType = enmMesh_Number.mhSecond;
                                            break;
                                        }
                                        case "3":
                                        case "1km": {
                                            LayerReading.MeshType = enmMesh_Number.mhThird;
                                            break;
                                        }
                                        case "1/2":
                                        case "4":
                                        case "500m": {
                                            LayerReading.MeshType = enmMesh_Number.mhHalf;
                                            break;
                                        }
                                        case "1/4":
                                        case "5":
                                        case "250m": {
                                            LayerReading.MeshType = enmMesh_Number.mhQuarter;
                                            break;
                                        }
                                        case "1/8": {
                                            LayerReading.MeshType = enmMesh_Number.mhOne_Eighth;
                                            break;
                                        }
                                        case "1/10": {
                                            LayerReading.MeshType = enmMesh_Number.mhOne_Tenth;
                                            break;
                                        }
                                        default:
                                            ObjectErrorMessage += "メッシュの種類の設定が不正です。" + CutS[2] + '\n';
                                            return;
                                    }
                                    if (LayerReading.Shape == enmShape.NotDeffinition) {
                                        LayerReading.Shape = enmShape.PolygonShape;
                                    }
                                    LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                    if (4 <= CutN) {
                                        let Sys = CutS[3];
                                        switch (Sys) {
                                            case "日本": {
                                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_tokyo;
                                                break;
                                            }
                                            case "世界": {
                                                LayerReading.ReferenceSystem = enmZahyo_System_Info.Zahyo_System_World;
                                                break;
                                            }
                                            case "":{
                                                break;
                                            }
                                            default:
                                                LayerError += "TYPE MESHの測地系指定で" + Sys + "は無効です。";
                                        }
                                    }
                                }
                                break;
                            }
                            default:
                                ObjectErrorMessage += "TYPEタグで" + CutS[1] + "は無効です。" + '\n';
                                return { ok: false, emes: ObjectErrorMessage };
                        }
                    }
                    break;
                }
                case "LAYER": {
                    lay += 1;
                    if (1 <= lay) {
                        if ((LayerReading.TTL == undefined) || (LayerReading.ObjectDataStac == undefined)) {
                            alert("レイヤのデータがありません：" + LayerReading.Name);
                            return { ok: false, emes: ObjectErrorMessage };
                        }
                        let retv = this.Set_Data_from_String(LayerReading, TotalMissing);
                        OK_Flag = OK_Flag && retv.ok;
                        LayerError += retv.emes;;
                        if (LayerError != "") {
                            ObjectErrorMessage += "エラー／レイヤ:";
                            if (LayerReading.Name == "") {
                                ObjectErrorMessage += (this.TotalData.LV1.Lay_Maxn).ToString + '\n';
                            } else {
                                ObjectErrorMessage += LayerReading.Name + '\n';
                            }
                            ObjectErrorMessage += LayerError + '\n';
                        }
                    }
                    LayerError = "";
                    LayerReading.init();
                    LayerReading.Time = clsTime.GetNullYMD();
                    if (2 <= CutN) {
                        LayerReading.Name = CutS[1];
                    }
                    if (3 <= CutN) {
                        LayerReading.MapFile = CutS[2];
                    }
                    if ((LayerReading.MapFile != "") && (Generic.getExtension(LayerReading.MapFile) == "")) {
                        LayerReading.MapFile += ".MPFJ";
                    }
                    if (LayerReading.MapFile != "") {
                        if (this.MapData.CheckMapfileExists(LayerReading.MapFile) == false) {
                            alert("レイヤ" + LayerReading.Name + "の地図ファイルを読み込んでください。");
                            return { ok: false, emes: ObjectErrorMessage };
                        }
                    }
                    break;
                }
                case "TIME": {
                    if (lay == -1) {
                        lay = 0;
                    }
                    if (LayerReading.Time.nullFlag() == true) {
                        if (2 <= CutN) {
                            let cngTimeF = false;
                            CutS[1].replace(",", "");
                            let Y = Math.floor(CutS[1]);
                            //if (DateTime.MinValue.Year > Y) {
                            //    Y = DateTime.MinValue.Year;
                            //    cngTimeF = true;
                            //}
                            let m = 1;
                            let d = 1;
                            if (3 <= CutN) {
                                m = Math.floor(CutS[2]);
                                if (m <= 0) {
                                    m = 1;
                                    cngTimeF = true;
                                } else {
                                    if (m > 12) {
                                        m = 12;
                                        cngTimeF = true;
                                    }
                                }
                            }
                            if (4 <= CutN) {
                                let iDaysInMonth = new Date(Y, m, 0).getDate();
                                d = Math.floor(CutS[3]);
                                if (d <= 0) {
                                    d = 1;
                                    cngTimeF = true;
                                } else {
                                    if (d > iDaysInMonth) {
                                        d = iDaysInMonth;
                                        cngTimeF = true;
                                    }
                                }
                            }
                            if (Y != -1) {
                                if (clsTime.Check_YMD_Correct(Y, m, d) == false) {
                                    alert("TIMEタグの時期設定が不正です。");
                                    return { ok: false, emes: ObjectErrorMessage };
                                }
                                LayerReading.Time = new strYMD(Y, m, d);
                                if (cngTimeF == true) {
                                    LayerError += "TIMEタグの時期は修正されました:" + LayerReading.Time.toString() + '\n';
                                }
                            }
                        } else {
                            LayerError += "TIMEタグに時間設定がありません。" + '\n';
                        }
                    } else {
                        LayerError += "1つのレイヤには1箇所しかTIMEタグは使用できません。" + '\n';
                    }
                    break;
                }
                case "MISSING": {
                    if (2 <= CutN) {
                        if (CutS[1].toUpperCase() == "ON") {
                            TotalMissing = true;
                        } else {
                            TotalMissing = false;
                        }
                    }
                    break;
                }
                default: {
                    if ((lay == -1) && (Map_readed == false)) {
                        return { ok: false, emes: ObjectErrorMessage };
                    }
                    if (Map_readed == false) {
                        ObjectErrorMessage += "データの先頭にMAPタグが見つかりません。\n";
                        return { ok: false, emes: ObjectErrorMessage };
                    }
                    if ((this.MapData.SetMapFile(LayerReading.MapFile).Map.Time_Mode == true) &&
                        (LayerReading.Type != enmLayerType.Trip_Definition)) {
                        if (LayerReading.Time.nullFlag() == true) {
                            LayerError += "使用する地図ファイルは、時空間モードで作成されています。" + '\n' + "レイヤごとにTIMEタグを使用して属性データの時期を指定してください。" + '\n';
                            ObjectErrorMessage += LayerError;
                            return { ok: false, emes: ObjectErrorMessage };
                        }
                    }
                    if (lay == -1) {
                        lay = 0;
                    }
                    LayerReading.ObjectDataStac.push(CutS);
                    break;
                }
            }
        }
        let retv = this.Set_Data_from_String(LayerReading, TotalMissing);
        OK_Flag = OK_Flag && retv.ok;
        LayerError += retv.emes;
        if (LayerError != "") {
            ObjectErrorMessage += "エラー／レイヤ:";
            if (LayerReading.Name == "") {
                ObjectErrorMessage += (this.TotalData.LV1.Lay_Maxn).ToString + '\n';
            } else {
                ObjectErrorMessage += LayerReading.Name + '\n';
            }
            ObjectErrorMessage += LayerError + '\n';
        }
        if ((lay == -1) ){
            return { ok: false, emes: ObjectErrorMessage };
        }
        if (this.TotalData.LV1.Lay_Maxn == 0) {
            return { ok: false, emes: ObjectErrorMessage };
        }
        return { ok: OK_Flag, emes: ObjectErrorMessage };
    }

    /**オブジェクトからオブジェクトコードを返す。見つからない場合は-1を返す Timeは地図ファイル指定の場合     */
    this.Get_ObjectCode_from_ObjName= function(Layernum_MapfileName, ObjName,Time){
        if(typeof(Layernum_MapfileName)=="string"){//地図ファイル指定
            let MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(Layernum_MapfileName);
            return MapFileObjectNameSearch.Get_KenToCode(ObjName, Time);
        }else{//レイヤ指定
            let MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(Layernum_MapfileName);
            return MapFileObjectNameSearch.Get_KenToCode(ObjName, this.LayerData[Layernum_MapfileName].Time);    
        }
    }


    //文字列からデータに変換
    this.Set_Data_from_String = function (LayerReading, TotalMissing) {
        let E_Mes = "";
        let MapFileData = this.MapData.SetMapFile(LayerReading.MapFile);
        let MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(LayerReading.MapFile);
        let Object_Use_Check = new Array(MapFileData.Map.Kend - 1);
        let No_Object_Name = [];
        let Over_Lap_Object = [];

        let MxData = 0;
        MxData = Math.max(LayerReading.TTL.length, MxData);
        MxData = Math.max(LayerReading.UNT.length, MxData);
        MxData = Math.max(MxData, LayerReading.DTMis.length);
        MxData = Math.max(MxData, LayerReading.Note.length);
        for (let i = 0; i < LayerReading.ObjectDataStac.length; i++) {
            MxData = Math.max(MxData, LayerReading.ObjectDataStac[i].length);
        }
        if (MxData == 0) {
            return { ok: false, emes: "タグ・オブジェクトが存在しません。" + '\n' };
        }
        let DN_Str = Generic.Array2Dimension(MxData, LayerReading.ObjectDataStac.length);
        
        let Get_Obj = [];//strObject_Data_Info / strTripObjData_Info / string
        let MeshCodeLen = 0;
        if (LayerReading.Type == enmLayerType.Mesh) {
            MeshCodeLen = Generic.getMeshCodeLength(LayerReading.MeshType);
        }

        for (let i = 0; i < LayerReading.ObjectDataStac.length; i++) {
            let CutS = LayerReading.ObjectDataStac[i];
            let OBName = CutS[0];
            let code;
            switch (LayerReading.Type) {
                case (enmLayerType.Normal): {
                    code = MapFileObjectNameSearch.Get_KenToCode(OBName, LayerReading.Time);
                    if (code == -1) {
                        No_Object_Name.push(OBName);
                    } else {
                        if (Object_Use_Check[code] == true) {
                            Over_Lap_Object.push(OBName);
                            code = -1;
                        } else {
                            Object_Use_Check[code] = true;
                        }
                    }
                    break;
                }
                case (enmLayerType.Mesh): {
                    if (OBName.length != MeshCodeLen) {
                        No_Object_Name.push(OBName);
                        code = -1;
                    } else {
                        code = -2;// Val(OBName)10桁以上になるとintegerに入らない
                    }
                    break;
                }
                case (enmLayerType.Trip): {
                    let d = new  strTripObjData_Info();
                    d.TripPersonName = OBName;
                    Get_Obj.push(d);
                    break;
                }
                case (enmLayerType.Trip_Definition): {
                    Get_Obj.push(OBName);
                    code = 0;
                    break;
                }
                default:
                    code = 0;
            }
            if (code != -1) {
                if ((LayerReading.Type == enmLayerType.Mesh) || (LayerReading.Type == enmLayerType.Normal) || (LayerReading.Type == enmLayerType.DefPoint)) {
                    let d = new strObject_Data_Info();
                    d.MpObjCode = code;
                    d.Name = OBName;
                    d.Objectstructure = enmKenCodeObjectstructure.MapObj;
                    if (LayerReading.Type == enmLayerType.Normal) {
                        d.CenterPoint = MapFileData.Get_Enable_CenterP(code, LayerReading.Time);
                        d.Symbol = d.CenterPoint;
                        d.Label = d.Symbol;
                        d.Visible = true;
                    }
                    Get_Obj.push(d);
                }
            }
            for (let j = 1; j < MxData; j++) {
                let T = "";
                if (j < CutS.length) {
                    T = CutS[j];
                }
                DN_Str[j - 1][Get_Obj.length - 1] = T;
            }
        }
        if( MapFileData.Map.Zahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido ){
            switch (LayerReading.Type) {
                case (enmLayerType.Mesh): {
                    E_Mes = "メッシュレイヤの場合は、緯度経度情報つきの地図ファイルを使用して下さい。" + '\n';
                    return { ok: false, emes: E_Mes };
                    break;
                }
                case (enmLayerType.DefPoint): {
                    E_Mes = "地点定義レイヤの場合は、緯度経度情報つきの地図ファイルを使用して下さい。" + '\n';
                    return { ok: false, emes: E_Mes };
                    break;
                }
            }
        }
        if (0 < No_Object_Name.length) {
            switch (LayerReading.Type) {
                case (enmLayerType.Mesh): {
                    E_Mes += "以下のメッシュコードは指定のメッシュと異なります。" + '\n';
                    break;
                }
                case (enmLayerType.Normal): {
                    E_Mes += "以下のオブジェクトは地図ファイルに含まれていません。" + '\n';
                    break;
                }
            }
            for (let i = 0; i < Math.min(50, No_Object_Name.length); i++) {
                E_Mes += No_Object_Name[i] + '\n';
            }
            if (50 < No_Object_Name.Count) {
                E_Mes += "ほか" + No_Object_Name.length - 50 + "オブジェクト" + '\n';
            }
            E_Mes += + '\n';
        }
        if (0 < Over_Lap_Object.Count) {
            E_Mes += "以下のオブジェクトは同一レイヤ内に複数含まれていました。最初に出てきたものが採用されています。" + '\n';
            E_Mes += Over_Lap_Object.join('\n');
        }

        let Object_num = Get_Obj.length;
        if (Object_num == 0) {
            E_Mes = "有効なオブジェクトがありません。";
            return { ok: false, emes: E_Mes };
        }
        
        this.Add_one_Layer(LayerReading.Name, LayerReading.Type, LayerReading.MeshType, LayerReading.Shape, LayerReading.MapFile,
            LayerReading.Time, LayerReading.ReferenceSystem, LayerReading.Comment_Temp, Object_num, Get_Obj);

        let Laye_Shape_Emes = this.Check_LayerShape();
        if (Laye_Shape_Emes != "") {
            E_Mes += Laye_Shape_Emes + '\n';
        }

        if (LayerReading.UNT.length==0) {
            LayerReading.UNT = new Array(MxData).fill("");
        }
        if (LayerReading.TTL.length == 0) {
            LayerReading.TTL = new Array(MxData).fill("");
        }

        if (LayerReading.DTMis.length == 0) {
            LayerReading.DTMis = new Array(MxData).fill(TotalMissing);
        }
        if (LayerReading.Note.length == 0) {
            LayerReading.Note = new Array(MxData).fill("");
        }

        LayerReading.TTL.shift();
        LayerReading.UNT.shift();
        LayerReading.DTMis.shift();
        LayerReading.Note.shift();

        let DummmyObjNamesList = [];
        for (let i = 0; i < LayerReading.Dummy_Temp.length; i++) {
            let DCS = LayerReading.Dummy_Temp[i];
            for (let j = 1; j < DCS.length; j++) {
                if (DCS[j] != "") {
                    DummmyObjNamesList.push(DCS[j]);
                }
            }
        }

        let DummmyObjGroupNamesList = [];
        for (let i = 0; i < LayerReading.Dummy_OBKTemp.length; i++) {
            let DCS = LayerReading.Dummy_OBKTemp[i];
            for (let j = 1; j < DCS.length; j++) {
                if (DCS[j] != "") {
                    DummmyObjGroupNamesList.push(DCS[j]);
                }
            }
        }
        let NowLay = this.TotalData.LV1.Lay_Maxn - 1;
        let Emes = this.Set_Dummy_and_Group(NowLay, DummmyObjNamesList, DummmyObjGroupNamesList);
        if (Emes != "") {
            E_Mes += "ダミーオブジェクト指定で地図ファイルに含まれないものがあります。" + '\n' + Emes
        }
        let retv = this.Set_STRData_To_Cell(NowLay, MxData - 1, LayerReading.TTL, LayerReading.UNT, LayerReading.DTMis, LayerReading.Note, DN_Str);
        E_Mes += retv.emes;
        return { ok: retv.ok, emes: E_Mes };
    }


    //レイヤ単位で文字列配列に入れたデータを設定する
    this.Set_STRData_To_Cell = function (Layernum, DataNum, TTL, UNT, DTMissing, Note, DN_Str) {
        let ErrorMes = "";
        let L = this.LayerData[Layernum];
        let ObjNum = L.atrObject.ObjectNum;
        let DataItemNotF = new Array(DataNum).fill(false);
        let URLData = new Array(DataNum);
        let URL_NameData = new Array(DataNum);
        let URLDataNum = 0;
        let URL_NameDataNum = 0;
        let LatPosition = -1;
        let LonPosition = -1;

        let DepartureGet = -1;
        let ArrivalGet = -1;
        let PlaceGet = -1;
        for (let i = 0; i < DataNum; i++) {
            let Uttl = TTL[i].toUpperCase();
            if (Uttl == "URL") {
                DataItemNotF[i] = true;
                URLData[URLDataNum] = i;
                URLDataNum += 1;
            } else if (Uttl == "URL_NAME") {
                DataItemNotF[i] = true;
                URL_NameData[URL_NameDataNum] = i;
                URL_NameDataNum += 1;
            } else {
                switch (L.Type) {
                    case (enmLayerType.Trip): {
                        //移動データのデータは通常のデータに入れない
                        switch (Uttl) {
                            case ("LAT"): {
                                if (LatPosition == -1) {
                                    LatPosition = i
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("LON"): {
                                if (LonPosition == -1) {
                                    LonPosition = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("PLACE"): {
                                if (PlaceGet == -1) {
                                    PlaceGet = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("ARRIVAL"): {
                                if (ArrivalGet == -1) {
                                    ArrivalGet = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                            case ("DEPARTURE"): {
                                if (DepartureGet == -1) {
                                    DepartureGet = i;
                                }
                                DataItemNotF[i] = true;
                                break;
                            }
                        }
                    }
                    case (enmLayerType.DefPoint): {
                        //地点定義レイヤ
                        if (Uttl == "LAT") {
                            if (LatPosition = -1) {
                                LatPosition = i;
                            }
                            DataItemNotF[i] = true;
                        } else if (Uttl == "LON") {
                            if (LonPosition == -1) {
                                LonPosition = i;
                            }
                            DataItemNotF[i] = true;
                        }
                        break;
                    }
                }
            }
        }
        //リンク
        if ((L.Type != enmLayerType.Trip) && (L.Type != enmLayerType.Trip_Definition)) {
            for (let i = 0; i < ObjNum; i++) {
                let O = L.atrObject.atrObjectData[i];
                O.HyperLinkNum = 0;
                O.HyperLink = [];
                if (0 < URL_NameDataNum) {
                    for (let j = 0; j < URLDataNum; j++) {
                        let T = DN_Str[URLData[j]][i];
                        if (T != "") {
                            let u = new strURL_Data();
                            u.Address = T;
                            u.Name = DN_Str[URL_NameData[j]][i];
                            O.HyperLink.push(u);
                            O.HyperLinkNum++;
                        }
                    }
                }
            }
        }
        //移動データの処理
        if (L.Type == enmLayerType.Trip) {
            let posTagF = false;
            if ((LatPosition != -1) && (LonPosition != -1)) {
                L.TripType = enmTripPositionType.LatLon;
                posTagF = true;
            } else if (PlaceGet != -1) {
                L.TripType = enmTripPositionType.ObjectSet;
                posTagF = true;
            } else {
                ErrorMes += "移動データレイヤの位置指定のタグ（LAT,LON,PLACE）が指定されていません。" + '\n';
            }
            if (ArrivalGet == -1) {
                ErrorMes += "移動データレイヤの到着時間タグ（ARRIVAL）が指定されていません。" + '\n';
            }
            if (DepartureGet == -1) {
                ErrorMes += "移動データレイヤの出発時間タグ（DEPARTURE）が指定されていません。" + '\n';
            }
            if ((ArrivalGet == -1) || (DepartureGet == -1) || (posTagF == false)) {
                return { ok: false, emes: ErrorMes };
            }

            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                let TD = L.atrObject.TripObjData[j];
                if (L.TripType == enmTripPositionType.ObjectSet) {
                    TD.PositionObjName = DN_Str[PlaceGet][j];
                } else {
                    TD.PositionObjName = "";
                    let lonV = Number(DN_Str[LonPosition][j]);
                    let latV = Number(DN_Str[LatPosition][j]);
                    TD.LatLon = new latlon(latV, lonV);
                }
                TD.PositionObjName += '\t' + DN_Str[ArrivalGet][j].trim() + '\t' + DN_Str[DepartureGet][j].trim();//後でCheck_Trip_Dataから中身を調べる
            }
        }

        //メッシュレイヤの処理
        if (L.Type == enmLayerType.Mesh) {
            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                let O = L.atrObject.atrObjectData[j];
                let retV=spatial.Get_MeshCode_Rectangle( O.Name, L.MeshType, L.ReferenceSystem, this.SetMapFile("").Map.Zahyo);
                O.CenterPoint = spatial.Get_Converted_XY(retV.latlonBox.CenterPoint().toPoint(), this.SetMapFile("").Map.Zahyo);
                O.Symbol = O.CenterPoint.Clone();
                O.Label = O.CenterPoint.Clone();
                O.MeshRect = retV.convRect;
                O.MeshPoint = retV.RPoint;
                O.Visible = true;
            }
        }

        //地点定義レイヤの処理
        if (L.Type == enmLayerType.DefPoint) {
            if (LonPosition == -1) {
                ErrorMes += "地点定義レイヤの経度（LONタグ）が指定されていません。" + '\n';
            }
            if (LatPosition == -1) {
                ErrorMes += "地点定義レイヤの経度（LATタグ）が指定されていません。" + '\n';
            }
            if ((LonPosition == -1) || (LatPosition == -1)) {
                return { ok: false, emes: ErrorMes };
            }
            let valE = false;
            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                let O = L.atrObject.atrObjectData[j];
                let lonV = Number(Generic.convValue(DN_Str[LonPosition][j]));
                if (isNaN(lonV) == true) {
                    ErrorMes += "地点定義レイヤの経度で数字以外の地点があります。(" + O.Name + ":" + DN_Str[LonPosition][j] + ")" + '\n';
                    valE = true;
                    lonV=0;
                }

                let latV = Number(Generic.convValue(DN_Str[LatPosition][j]));
                if (isNaN(latV) == true) {
                    ErrorMes += "地点定義レイヤの緯度で数字以外の地点があります。(" + O.Name + ":" + DN_Str[LatPosition][j] + ")" + '\n';
                    valE = true;
                    latV=0;
                } else {
                    if (Math.abs(latV) >= 90) {
                        ErrorMes += "地点定義レイヤの緯度で90度を超えている地点があります。(" + O.Name + DN_Str[LatPosition][j] + ")" + '\n';
                        valE = true;
                        latV=0;
                    }
                }
                O.defPoint = new latlon(latV, lonV);
                let conp = spatial.ConvertRefSystemLatLon(O.defPoint, L.ReferenceSystem, this.SetMapFile("").Map.Zahyo.System);
                O.CenterPoint = spatial.Get_Converted_XY(conp.toPoint(), this.SetMapFile("").Map.Zahyo);
                O.Symbol = O.CenterPoint;
                O.Label = O.CenterPoint;
                O.Visible = true;
            }
            if (valE == true) {
                return { ok: false, emes: ErrorMes };
            }
        }
        //データ項目の追加
        let addErMes = "";
        let Data_Val_STR = new Array(ObjNum);
        for (let i = 0; i < DataNum; i++) {
            if (DataItemNotF[i] == false) {
                for (let j = 0; j < ObjNum; j++) {
                    Data_Val_STR[j] = DN_Str[i][j];
                }
                let Dtype = Generic.getAttDataType_From_TitleUnit(TTL[i], UNT[i]);
                if (Dtype == enmAttDataType.Normal) {
                    for (let j = 0; j < ObjNum; j++) {
                        if (Data_Val_STR[j] != "") {
                            Data_Val_STR[j] = Data_Val_STR[j].replace(/,/g, "");
                        }
                        if ((isNaN(Data_Val_STR[j]) == true)||(Data_Val_STR[j] === "")) {
                            if (Data_Val_STR[j] === "") {
                                if (DTMissing[i] == false) {
                                    if ((TTL[i] != "") || (UNT[i] != "")) {
                                        addErMes += "欠損値設定でないデータ項目に空白データがあります。0に設定されます。(" + TTL[i] + ")" + '\n';
                                        Data_Val_STR[j] = "0";
                                    }
                                }else{
                                    Data_Val_STR[j] = undefined;
                                }
                            } else {
                                addErMes += "数字以外のデータがあります。欠損値に設定されます。(" + TTL[i] + ":" + Data_Val_STR[j] + ")" + '\n';
                                DTMissing[i] = true;
                                Data_Val_STR[j] = undefined;
                            }
                        }
                    }
                }
                if (this.Add_One_Data_Value(Layernum, TTL[i], UNT[i], Note[i], Data_Val_STR, DTMissing[i]) == false) {
                    if (TTL[i] != "") {
                        addErMes += TTL[i] +"はデータ値がないため取得できませんでした。" + '\n';
                    }
                }
            }

        }
        if (addErMes.Length != 0) {
            ErrorMes += addErMes;
        }
        if ((this.Get_DataNum(Layernum) == 0) && (L.Type != enmLayerType.Trip)) {
            this.Add_One_Data_Value(Layernum, "地図表示", "CAT", "", new Array(ObjNum).fill(''), false)
            switch (L.Shape){
                case (enmShape.PointShape):{
                    L.atrData.Data[0].SoloModeViewSettings.Class_Div[0].PaintColor = new colorRGBA([255, 255,191, 255])
                    break;
                }
                case (enmShape.PolygonShape):{
                    L.atrData.Data[0].SoloModeViewSettings.Class_Div[0].PaintColor = clsBase.ColorWhite();
                    break;
                }
            }
            ErrorMes += "有効なデータ項目がなかったため、「地図表示」データ項目を自動生成しました。";
        }


        return { ok: true, emes: ErrorMes };
    }

    //レイヤにダミーオブジェクトとグループを設定する
    this.Set_Dummy_and_Group=function(LayerNum, Dummy, DummyGroup){
        let L = this.LayerData[LayerNum];
        if (L.Type == enmLayerType.Trip_Definition) {
            return "";
        }
        let DummyEmes = "";
        if (Dummy != undefined) {
            L.Dummy=[];
            for (let i = 0; i < Dummy.length; i++) {
                let k = L.MapFileObjectNameSearch.Get_KenToCode(Dummy[i], L.Time);
                if (k != -1) {
                    let d=new strDummyObjectName_and_Code();
                    d.code=k;
                    d.Name=Dummy[i];
                    L.Dummy.push(d);
                } else {
                    if (DummyEmes != "") {
                        DummyEmes += "/";
                    }
                    DummyEmes += Dummy[i];
                }
            }
        }

        let DummyGroupEmes = "";
        if (DummyGroup != undefined) {
            L.DummyGroup=[];
            for (let i = 0; i < DummyGroup.length; i++) {
                let k = L.MapFileData.Get_ObjectGroupNumber_By_Name(DummyGroup[i]);
                if (k != -1) {
                    L.DummyGroup.push(k);
                } else {
                    if (DummyGroupEmes != "") {
                        DummyGroupEmes += "/";
                    }
                    DummyGroupEmes += DummyGroup[i];
                }
            }
        }
        if ((DummyEmes != "") && (DummyGroupEmes != "")){
            DummyEmes += '\n';
        }
        let Emes = DummyEmes + DummyGroupEmes;

        return Emes;
    }

    /**白地図・初期属性データ表示から読み込み DeleteDefDataFlag:取得した初期属性データを地図データ中から削除する場合true */
    this.SetMapViewerData = function (MapDataList, LayDataInf, DeleteDefDataFlag) {      
        this.MapData = new clsAttrMapData();
        for (let i = 0; i < MapDataList.length;i++) {
            this.MapData.AddExistingMapData(MapDataList[i], MapDataList[i].Map.FileName);
        }
        this.TotalData.ViewStyle.Zahyo = this.MapData.GetPrestigeZahyoMode();
        this.MapData.EqualizeZahyoMode(this.TotalData.ViewStyle.Zahyo);

        let LayN = 0;
        let  noAttrData = true;
        for (let key in LayDataInf) {
            let layData = LayDataInf[key];
            let Get_Obj = [];
            let fobk = 0;
            let UseMap = this.SetMapFile(layData.MapfileName);
            for (let i = 0; i < UseMap.Map.Kend; i++) {
                if (layData.UseObjectKind[UseMap.MPObj[i].Kind] == true) {
                    fobk = UseMap.MPObj[i].Kind;
                    let objName = UseMap.Get_Enable_ObjectName(i, layData.Time, false);
                    if (objName != undefined) {
                        let CP = UseMap.Get_Enable_CenterP(i, layData.Time);
                        ob = new strObject_Data_Info();
                        ob.MpObjCode = i;
                        ob.Name = objName[0];
                        ob.Objectstructure = enmKenCodeObjectstructure.MapObj;
                        ob.CenterPoint = CP.Clone();
                        ob.Symbol = CP.Clone();
                        ob.Label = CP.Clone();
                        ob.Visible = true;
                        ob.HyperLinkNum=0;
                        Get_Obj.push(ob);
                    }
                }
            }
            let layshape = layData.Shape;
            if (layshape == enmShape.NotDeffinition) {
                layshape = UseMap.MPObj[Get_Obj[0].MpObjCode].Shape;
            }

            let objn = Get_Obj.length;
            this.Add_one_Layer(layData.Name, enmLayerType.Normal, enmMesh_Number.mhNonMesh, layshape, layData.MapfileName, layData.Time,
                enmZahyo_System_Info.Zahyo_System_No, "", objn, Get_Obj);
            if (UseMap.ObjectKind[fobk].DefTimeAttDataNum == 0) {
                //初期属性が無い場合の色の設定

                this.Add_One_Data_Value(LayN, "地図表示", "CAT", "", new Array(objn).fill(''), false)
                if (layData.Shape != enmShape.LineShape) {
                    this.LayerData[LayN].atrData.Data[0].SoloModeViewSettings.Class_Div[0].PaintColor = new colorRGBA([255, 255, 255,255])
                }
            } else {
                noAttrData = false;
                let nDX = UseMap.ObjectKind[fobk].DefTimeAttDataNum;
                let misf = false;
                for (let j = 0; j < nDX; j++) {
                    let attData = UseMap.ObjectKind[fobk].DefTimeAttSTC[j].attData;
                    let Data_Val = [];
                    for (let k = 0; k < objn; k++) {
                        let v = UseMap.Get_DefTimeAttrValue(Get_Obj[k].MpObjCode, j, layData.Time);
                        if((attData.MissingF==true)&&(v=="")){
                            v = undefined;
                        }
                        if (v == undefined) {
                            misf = true;
                        }
                        Data_Val.push(v);
                    }
                    if((attData.MissingF==true)&&(misf == false)){
                        misf=true;
                    }
                    this.Add_One_Data_Value(LayN, attData.Title, attData.Unit, attData.Note, Data_Val, misf);
                }
                if (DeleteDefDataFlag == true) {
                    UseMap.DeleteAllDefAttrData(fobk);
                }
            }
            LayN += 1;

        }
        this.TotalData.LV1.DataSourceType = enmDataSource.Viwer;
        this.TotalData.LV1.FileName =Generic.getFilenameWithoutExtension( this.LayerData[0].MapFileName);
        this.TotalData.LV1.FullPath = this.TotalData.LV1.FileName;
        this.initTotalData_andOther();
        if (noAttrData == true) {
            this.TotalData.ViewStyle.MapLegend.Base.Visible = false;
            this.TotalData.ViewStyle.MapTitle.Visible = false;
        }

        return true;
    }

    //レイヤの形状を実際のオブジェクトの形状に基づいて設定
    this.Check_LayerShape = function () {
        let EMes = "";
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let L = this.LayerData[i];
            switch (L.Type) {
                case (enmLayerType.Normal): {
                    let sp = this.Check_LayerShape_Sub(i);
                    if (sp.emes != "") {
                        EMes += sp.emes;
                    }
                    switch (L.Shape) {
                        case (enmShape.NotDeffinition): {
                            L.Shape = sp.shape;
                            break;
                        }
                        case (enmShape.PolygonShape): {
                            if (sp.shape != enmShape.PolygonShape) {
                                EMes += "面形状に指定されましたが、" + Generic.ConvertShapeEnumString(sp.shape) + "形状に設定されました。" + '\n';
                                L.Shape = sp.shape;
                            }
                            break;
                        }
                        case (enmShape.LineShape): {
                            if (sp.shape == enmShape.PointShape) {
                                EMes += "線形状に指定されましたが、" + Generic.ConvertShapeEnumString(sp.shape) + "形状に設定されました。" + '\n';
                                L.Shape = sp.shape;
                            }
                            break;
                        }
                    }
                    break;
                }
                case (enmLayerType.DefPoint): {
                    L.Shape = enmShape.PointShape;
                    break;
                }
                case (enmLayerType.Mesh): {
                    if (L.Shape == enmShape.NotDeffinition) {
                        L.Shape = enmShape.PolygonShape;
                    }
                    break;
                }
            }
        }
        return EMes;
    }

    this.Check_LayerShape_Sub = function (LayerNum) {
        let EMes = "";
        let L = this.LayerData[LayerNum];
        switch (L.Type) {
            case (enmLayerType.Mesh): {
                return { shape: enmShape.PolygonShape, emes: EMes };
                break;
            }
        }

        let sh = new Array(3).fill(0);
        for (let j = 0; j < L.atrObject.ObjectNum; j++) {
            let D;
            let O = L.atrObject.atrObjectData[j];
            if (O.Objectstructure == enmKenCodeObjectstructure.MapObj) {
                D = L.MapFileData.MPObj[O.MpObjCode].Shape;
            } else {
                D = L.atrObject.MPSyntheticObj[O.MpObjCode].Shape;
            }
            sh[D] ++;
        }
        let shcount = 0;
        let shmax = sh[0];
        let shmaxN = enmShape.PointShape;
        for (let j = 0; j <= 2; j++) {
            if (sh[j] > 0 ) {
                shcount++;
                if (shmax < sh[j] ) {
                    shmax = sh[j];
                    shmaxN = j;
                }
            }
        }
        if (shcount > 1) {
            EMes += "レイヤ：" + L.Name + '\n';
            EMes += "オブジェクトの形状が混在しています。" + '\n';
            EMes += "最も多い形状：" + Generic.ConvertShapeEnumString(shmaxN) + '\n';
            EMes += "それ以外の形状のオブジェクト" + '\n';
            for (let j = 0; j < L.atrObject.ObjectNum; j++) {
                let D;
                let O = L.atrObject.atrObjectData[j];
                if (O.Objectstructure == enmKenCodeObjectstructure.MapObj) {
                    D = L.MapFileData.MPObj[O.MpObjCode].Shape;
                } else {
                    D = L.atrObject.MPSyntheticObj[O.MpObjCode].Shape;
                }
                if (D != shmaxN) {
                    EMes += L.atrObject.atrObjectData[j].Name + "(" + Generic.ConvertShapeEnumString(D) + ")" + '\n';
                }
            }
        }
        return { shape: Generic.checkShape(sh), emes: EMes };
    }

    //オブジェクトグループ連動型線種の線種決定
    this.LinePatternCheck = function () {
        for (let Lay = 0; Lay < this.TotalData.LV1.Lay_Maxn; Lay++) {
            let LD = this.LayerData[Lay];
            if (LD.Type != enmLayerType.Trip_Definition) {
                let MapFileData = LD.MapFileData;
                for (let i = 0; i < MapFileData.Map.LpNum; i++) {
                    let lk = MapFileData.LineKind[i];
                    if (lk.NumofObjectGroup >= 2) {
                        for (let j = 1; j < lk.NumofObjectGroup; j++) {
                            let Ltmp = [];
                            if ((lk.ObjGroup[j].UseOnly == false) || ((lk.ObjGroup[j].UseOnly == true) && (LD.DummyGroup.indexOf(lk.ObjGroup[j].GroupNumber) !=-1))) {
                                for (let k = 0; k < MapFileData.Map.Kend; k++) {
                                    if (MapFileData.MPObj[k].Kind == lk.ObjGroup[j].GroupNumber) {
                                        let ELine = MapFileData.Get_EnableMPLine(k, LD.Time)
                                        for (let k2 in ELine) {
                                            if (ELine[k2].Kind == i) {
                                                Ltmp[ELine[k2].LineCode] = true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                //データで使われている場合に限る
                                for (let k = 0; k < LD.atrObject.ObjectNum; k++) {
                                    let obk;
                                    if (LD.atrObject.atrObjectData[k].Objectstructure == enmKenCodeObjectstructure.MapObj) {
                                        obk = MapFileData.MPObj[LD.atrObject.atrObjectData[k].MpObjCode].Kind;
                                    } else {
                                        obk = LD.atrObject.MPSyntheticObj[LD.atrObject.atrObjectData[k].MpObjCode].Kind;
                                    }
                                    if (obk == lk.ObjGroup[j].GroupNumber) {
                                        let ELine = this.Get_Enable_KenCode_MPLine(Lay, k);
                                        for (let k2 in ELine) {
                                            if (ELine[k2].Kind == i) {
                                                Ltmp[ELine[k2].LineCode] = true;
                                            }
                                        }
                                    }
                                }
                            }
                            for (let k = 0; k < MapFileData.Map.ALIN; k++) {
                                if ((Ltmp[k] == true) && (LD.ObjectGroupRelatedLine[k] == undefined)) {
                                    LD.ObjectGroupRelatedLine[k] = j;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    //指定されたオブジェクトで、指定された時期に使用可能なライン数と番号を返す
    this.Get_Enable_KenCode_MPLine = function (Layernum, ObjNum) {
        switch (this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj:
                let O_Code = this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].MpObjCode;
                return this.LayerData[Layernum].MapFileData.Get_EnableMPLine(O_Code, this.LayerData[Layernum].Time);
                break;
            case enmKenCodeObjectstructure.SyntheticObj:
                return this.Get_EnableMPLine_SyntheticObject(Layernum, ObjNum);
                break;
        }
    }
    //合成オブジェクトの外周線を返す
    this.Get_EnableMPLine_SyntheticObject = function (Layernum, ObjNum) {
        let LD = this.LayerData[Layernum];
        let SO_Code = LD.atrObject.atrObjectData[ObjNum].MpObjCode;
        let Time = LD.Time;
        let ELineStock = [];
        let mp = LD.atrObject.MPSyntheticObj[SO_Code];
        for (let i = 0; i < mp.NumOfObject; i++) {
            if (mp.Objects[i].Draw_F == true) {
                let c = mp.Objects[i].code;
                if (c != -1) {
                    ELine = LD.MapFileData.Get_EnableMPLine(c, Time);
                    for (let j in ELine) {
                        ELineStock.push(ELine[j]);
                    }
                }
            }
        }
        let ag = Generic.Get_Outer_Mpline_AggregatedObj(ELineStock, LD.Shape);
        return ag;
    }

    //オブジェクトが画面内に入るかどうかチェック
    this.Check_screen_Kencode_In = function (Layernum, ObjNum) {
        let rect = this.Get_Kencode_Object_Circumscribed_Rectangle(Layernum, ObjNum);
        if (this.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F == true) {
            let turnRect = this.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(rect);
            let screct = new rectangle(0, this.TotalData.ViewStyle.ScrData.frmPrint_FormSize.width(), 0, this.TotalData.ViewStyle.ScrData.frmPrint_FormSize.height());
            let relation = spatial.Compare_Two_Rectangle_Position(turnRect, screct);
            if (relation == cstRectangle_Cross.cstOuter) {
                return false;
            } else {
                if (relation == cstRectangle_Cross.cstInclusion) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (spatial.Compare_Two_Rectangle_Position(rect, this.TotalData.ViewStyle.ScrData.ScrRectangle) == cstRectangle_Cross.cstOuter) {

                return false;
            } else {
                return true;
            }
        }
    }
        //地図ファイル中のオブジェクトが画面内に入るかどうかチェック
    this.Check_Screen_Objcode_In = function (Layernum, ObjCode) {
        let rect = this.LayerData[Layernum].MapFileData.MPObj[ObjCode].Circumscribed_Rectangle;
        if (this.TotalData.ViewStyle.ScrData.ThreeDMode.Set3D_F == true) {
            let turnRect = this.TotalData.ViewStyle.ScrData.Get_SxSy_With_3D(rect);
            let screct = new rectangle(0, this.TotalData.ViewStyle.ScrData.frmPrint_FormSize.Width, 0, this.TotalData.ViewStyle.ScrData.frmPrint_FormSize.Height);
            let relation = spatial.Compare_Two_Rectangle_Position(turnRect, screct);
            if (relation == cstRectangle_Cross.cstOuter) {
                return false;
            } else {
                if (relation == cstRectangle_Cross.cstInclusion) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (spatial.Compare_Two_Rectangle_Position(rect, this.TotalData.ViewStyle.ScrData.ScrRectangle) == cstRectangle_Cross.cstOuter) {
                return false;
            } else {
                return true;
            }
        }
    }

    //指定の画面座標の中心点と半径の領域が画面に入る場合はtrue
    this.Check_Screen_In = function (CenterP, R) {
        if ((CenterP instanceof rectangle) == true){
            if (spatial.Compare_Two_Rectangle_Position(CenterP, this.TotalData.ViewStyle.ScrData.MapScreen_Scale) != cstRectangle_Cross.cstOuter) {
                return true;
        } else {
            return false;
        }
        } else {
            let C_Rect = new rectangle(new point(CenterP.x - R, CenterP.y - R), new size(R * 2, R * 2));
            if (spatial.Compare_Two_Rectangle_Position(C_Rect, this.TotalData.ViewStyle.ScrData.MapScreen_Scale) != cstRectangle_Cross.cstOuter) {
                return true;
            } else {
                return false;
            }
        }
    }

    this.Add_One_Data_Value = function (Layernum, TTL, UNT, Note, Dn_Val_str, Missing_F) {

        if(TTL == null){TTL=""}
        if(UNT == null){UNT=""}
        let ObjNum = this.LayerData[Layernum].atrObject.ObjectNum;
        
        if (((TTL == "") && (UNT == "")) || ((UNT.toUpperCase() != "STR") && (UNT.toUpperCase()) != "CAT")) {
            let f = false;
            let f2=false;
            for (let i = 0; i < ObjNum; i++) {
                if (Dn_Val_str[i] != undefined) {
                    f = true
                    break;
                }
                if (Dn_Val_str[i] != undefined) {
                    f2 = true
                    break;
                }
            }
            if (f == false) {
                return false;
            }
            if ((f2 == false)&&(TTL=="")) {
                return false;
            }

        }
        let DataNum = this.Get_DataNum(Layernum);
        let Dtype = Generic.getAttDataType_From_TitleUnit(TTL, UNT);
        let newD = new strData_info();
        newD.MissingF = Missing_F;
        newD.Unit = UNT;
        newD.Title = TTL;
        newD.Note = (Note == null) ? "": Note;
        newD.DataType = Dtype;
        // newD.SoloModeViewSettings.Div_Num = 0;
        if (Dtype == enmAttDataType.Normal) {
            for (let i = 0; i < Dn_Val_str.length; i++) {
                if (Dn_Val_str[i] != undefined) {
                    if(isNaN(Dn_Val_str[i])){
                        let sv = Dn_Val_str[i].replace(/,/g, "");
                        sv = sv.replace(/\s+/g, "");
                        newD.Value[i] = Number(sv);
                    } else {
                        newD.Value[i] = Dn_Val_str[i];
                    }
                } else {
                    newD.Value[i] = undefined;
                }
            }
        } else {
            newD.Value = Generic.Clone(Dn_Val_str);
        }
        this.LayerData[Layernum].atrData.Data.push(newD);
        this.LayerData[Layernum].atrData.Count++;
        this.CulcuOne(Layernum, DataNum);//データの統計情報取得
        this.SetIniHanrei(Layernum, DataNum)
        return true;
    }

    //レイヤのオブジェクト数を求める
    this.Get_ObjectNum = function (Layernum) {
        return this.LayerData[Layernum].atrObject.ObjectNum;
    }

    //レイヤ名を取得する。レイヤが1つでレイヤ名が空白の場合は""を返す
    this.Get_Layer_Name = function (Layernum, CR_F=false) {
        let ln = "";
        if ((this.TotalData.LV1.Lay_Maxn == 1) && (this.LayerData[Layernum].Name == "")) {
        } else {
            ln = "レイヤ:" + this.LayerData[Layernum].Name +  '\n';
            if (CR_F == true) {
                ln +=   '\n';
            }
        } return ln;
    }

    /**指定レイヤの条件設定情報を文字列で出力 */
    this.Get_Condition_Info = function (Layernum) {
        let ST1 = "表示オブジェクト限定:"

        if (this.Check_ObjectLimitation(Layernum) == true) {
            ST1 += "あり";
        } else {
            ST1 += "なし";
        }

        let st2 = "";
        for (ic = 0; ic < this.TotalData.Condition.length; ic++) {
            let tc = this.TotalData.Condition[ic];
            if ((tc.Enabled == true) && (tc.Layer == Layernum)) {
                st2 += this.Get_Layer_Name(Layernum)
                st2 += tc.Name + "\n"
                for (i = 0; i < this.TotalData.Condition[ic].Condition_Class.length; i++) {
                    let tcc = tc.Condition_Class[i];
                    if (tcc.Condition.length > 0) {
                        st2 += "第" + (i + 1).toString() + "段階" + "\n"
                        for (j = 0; j < tcc.Condition.length; j++) {
                            let tcc2 = tcc.Condition[j];
                            st2 += "データ項目：" + this.Get_DataTitle(Layernum, tcc2.Data, false) + "／";
                            st2 += tcc2.Val + "／";
                            st2 += Generic.getConditionString(tcc2.Condition);
                            if (j != tcc.Condition.length-1) {
                                if (tcc.And_OR == enmConditionAnd_Or._And) {
                                    st2 += "　かつ";
                                } else {
                                    st2 += "　または";
                                }
                            }
                            st2 += "\n";
                        }
                    }
                }
                st2 += "\n";
            }
        }
        if (st2 != "") {
            st2 = "属性検索設定" + "\n" + "\n" + st2;
        } else {
            st2 = "属性検索設定なし" + "\n";
        }
        let ST = ST1 + "\n" + "\n" + st2 + "\n";
        return ST;
    }

    //指定したレイヤに条件設定または表示オブジェクト限定が有効に設定されているかを調べる
    this.Check_Condition_UMU = function (Layernum) {
        for (let i = 0; i < this.TotalData.Condition.length; i++) {
            if ((this.TotalData.Condition[i].Enabled == true) && (this.TotalData.Condition[i].Layer == Layernum)) {
                return true;
            }
        }
        if (this.Check_ObjectLimitation(Layernum) == true) {
            return true;
        }
        return false;
    }

    //**指定したレイヤに表示オブジェクト限定が有効に設定されているかを調べる */
    this.Check_ObjectLimitation = function (Layernum) {
        if (this.TotalData.ViewStyle.ObjectLimitationF == true) {
            for (let i = 0; i < this.Get_ObjectNum(LayerNum); i++) {
                if (this.LayerData[LayerNum].atrObject.atrObjectData[i].Visible == false) {
                    return true;
                }
            }
        }
        return false;
    }

    //表示オブジェクト限定、属性検索条件に合うオブジェクト数を数えて文字列で出力
    this.Get_Condition_Ok_Num_Info = function (Layernum) {
        let T = this.Get_Layer_Name(Layernum,false);
        T += "全オブジェクト数:"+ this.Get_ObjectNum(Layernum).toString()  + '\n';
        T += "条件に適合するオブジェクト数:" + this.Get_Condition_Ok_Num(Layernum).toString() +  '\n' + '\n';
        return T;
    }

    //表示オブジェクト限定、属性検索条件に合うオブジェクト数を数える
    this.Get_Condition_Ok_Num = function (Layernum) {
        let n = 0;
        for (let j = 0; j < this.Get_ObjectNum(Layernum); j++) {
            if ((this.TotalData.ViewStyle.ObjectLimitationF == false) || (this.LayerData[Layernum].atrObject.atrObjectData[j].Visible == true)) {
                if (this.Check_Condition(Layernum, j) == true) {
                    n++;
                }
            }
        }
        return n;
    }

    //属性検索条件･オブジェクト限定のチェック
    this.Check_Condition = function (Layernum, Obj) {
        if ((this.LayerData[Layernum].atrObject.atrObjectData[Obj].Visible == false) && (this.TotalData.ViewStyle.ObjectLimitationF == true)) {
            return false;
        }

        let af = true;
        let td = this.TotalData.Condition;
        for (let ic = 0; ic < td.length; ic++) {
            let d = td[ic];
            if ((d.Enabled == true) && (d.Layer == Layernum)) {
                for (let i = 0; i < d.Condition_Class.length; i++) {
                    let tdc = d.Condition_Class[i];
                    if (tdc.And_OR == enmConditionAnd_Or._And) {
                        af = true;
                    } else {
                        af = false;
                    }
                    for (let j = 0; j < tdc.Condition.length; j++) {
                        let f;
                        let tdcc = tdc.Condition[j];
                        let V = this.Get_Data_Value(Layernum, tdcc.Data, Obj, "\t");
                        if (V == "\t") {
                            //欠損値の場合
                            f = false;
                        } else {
                            switch (this.Get_DataType(Layernum, tdcc.Data)) {
                                case enmAttDataType.Category:
                                case enmAttDataType.Strings:{
                                    f = false;
                                    switch (tdcc.Condition) {
                                        case enmCondition.Less:
                                            if (V < tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.LessEqual:
                                            if (V <= tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Equal:
                                            if (V == tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.GreaterEqual:
                                            if (V >= tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Greater:
                                            if (V > tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.NotEqual:
                                            if (V != tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Include:
                                            if (V.indexOf(tdcc.Val) != -1) { f = true }
                                            break;
                                        case enmCondition.Exclude:
                                            if (V.IndexOf(tdcc.Val) == -1) { f = true }
                                            break;
                                        case enmCondition.Head:
                                            if ((V.left(tdcc.Val.length)) == tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Foot:
                                            if (V.right(tdcc.Val.length) == tdcc.Val) { f = true }
                                            break;
                                    }
                                    break;
                                }
                                default:{
                                    let av = Math.floor(V);
                                    f = false;
                                    switch (tdcc.Condition) {
                                        case enmCondition.Less:
                                            if (av < tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.LessEqual:
                                            if (av <= tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Equal:
                                            if (av == tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.GreaterEqual:
                                            if (av >= tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Greater:
                                            if (av > tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.NotEqual:
                                            if (av != tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Include:
                                            if (V.indexOf(tdcc.Val) != -1) { f = true }
                                            break;
                                        case enmCondition.Exclude:
                                            if (V.indexOf(tdcc.Val) == -1) { f = true }
                                            break;
                                        case enmCondition.Head:
                                            if (V.left(tdcc.Val.length) == tdcc.Val) { f = true }
                                            break;
                                        case enmCondition.Foot:
                                            if (V.left(tdcc.Val.length) == tdcc.Val) { f = true }
                                            break;
                                    }
                                    break;
                                }
                            }
                        }
                        if (tdc.And_OR == enmConditionAnd_Or._And) {
                            if (f == false) {
                                af = false;
                                break;
                            }
                        } else {
                            if (f == true) {
                                af = true;
                                break;
                            }
                        }
                    }
                    if (af == false) {
                        break;
                    }
                }
            }
            if (af == false) {
                break;
            }
        }
        return af;
    }


    //データ項目のデータを配列で取得、欠損値は最小値-1に、カテゴリーデータの場合はカテゴリーの位置
    this.Get_Data_Cell_Array_With_MissingValue = function (Layernum, DataNum) {
        let ObjNum = this.LayerData[Layernum].atrObject.ObjectNum;
        let ad = this.LayerData[Layernum].atrData.Data[DataNum];
        let DT = [];
        if (ad.EnableValueNum == 0) {
            return dt;
        }
        switch (ad.DataType) {
            case enmAttDataType.Category: {
                DT = this.Get_CategolyArray(Layernum, DataNum);
                break;
            }
            case enmAttDataType.Normal: {
                for (let i = 0; i < ObjNum; i++) {
                    if (ad.Value[i] != undefined) {
                        DT[i] =Number( ad.Value[i]);
                    } else {
                        DT[i] = ad.Statistics.Min - 1;
                    }
                }
                break;
            }
        }
        return DT;
    }

    //データ項目のデータが欠損値だった場合にTRUEが入る配列を返す
    this.Get_Missing_Value_DataArray = function (Layernum, DataNum) {
        let ObjNum = this.LayerData[Layernum].atrObject.ObjectNum;
        let dt =[];
        let ad = this.LayerData[Layernum].atrData.Data[DataNum];
        if ((ad.MissingValueNum == 0) || (ad.MissingF == false)) {
             dt = new Array(ObjNum).fill(false);
        } else {
            for (let i = 0; i < ObjNum; i++) {
                dt[i] = (ad.Value[i] == undefined);
            }
        }
        return dt;
    }


    //指定したレイヤのデータ項目の全オブジェクトの階級区分の際の位置を配列で取得する。欠損値は-1
    this.Get_CategolyArray = function (Layernum, DataNum) {
        let Category_Array = [];
        for (let i = 0; i < this.LayerData[Layernum].atrObject.ObjectNum; i++) {
            Category_Array.push(this.Get_Categoly(Layernum, DataNum, i));
        }
        return Category_Array;
    }

    //指定したレイヤのデータ項目・オブジェクトの階級区分の際の位置を取得する。欠損値の場合は-1を返す
    this.Get_Categoly = function (Layernum, DataNum, Objectnum) {
        let ad = this.LayerData[Layernum].atrData.Data[DataNum];
        let Div_Num = ad.SoloModeViewSettings.Div_Num;
        let sj;
        if (ad.Value[Objectnum] == undefined) {
            sj = -1;
        } else {
            switch (ad.DataType) {
                case enmAttDataType.Normal: {
                    sj = Div_Num - 1;
                    let h = ad.Value[Objectnum];
                    for (let j = 0; j < Div_Num - 1; j++) {
                        if (h >= ad.SoloModeViewSettings.Class_Div[j].Value) {
                            sj = j;
                            break;
                        }
                    }
                    break;
                }
                case enmAttDataType.Category: {
                    for (let j = 0; j < Div_Num; j++) {
                        if (ad.Value[Objectnum] == ad.SoloModeViewSettings.Class_Div[j].Value) {
                            sj = j;
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return sj;
    }
    //データ項目の初期凡例の設定
    this.SetIniHanrei = function (Layernum, DataNum) {
        let data = this.LayerData[Layernum].atrData.Data[DataNum];
        let lay = this.LayerData[Layernum];

        if (data.EnableValueNum == 0) {
            return;
        }
        let DType = data.DataType;
        let DataMax = data.Statistics.Max;
        let DataMin = data.Statistics.Min;
        //ペイント
        let pmd = data.SoloModeViewSettings.ClassPaintMD;
        if (lay.Type == enmLayerType.Trip_Definition) {
            pmd.color1 = new colorRGBA([255, 255, 0, 255]);
            pmd.color2 = new colorRGBA([255, 0, 0, 255]);
        } else {
            pmd.color1 = defaultColor.paintMode[0].Clone();

                pmd.color2 =defaultColor.paintMode[1].Clone();

        }
        //タイトルと単位によって記号モードとペイントモードを振り分ける
        let Class_Mode_Title = ["率", "割合", "密度", "Rate", "density", "average", "平均", "比",
            "Ratio ", "あたり", "当たり", "時間", "距離", "distance", "標高", "水深"];
        let Class_Mode_unit = ["パーセント", "％", "%", " per ", "/", "‰", "パーミル", "／"];
        let m = enmSoloMode_Number.MarkSizeMode;
        let meshF = false;
        switch (lay.Type) {
            case enmLayerType.Mesh:
                meshF = true;
                break;
            case enmLayerType.Normal:
                let d = lay.atrObject.atrObjectData[0].MpObjCode;
                if (lay.MapFileData.ObjectKind[lay.MapFileData.MPObj[d].Kind].Mesh != enmMesh_Number.mhNonMesh) {
                    meshF = true;
                }
                break;
        }
        if (DType == enmAttDataType.Strings) {
            m = enmSoloMode_Number.StringMode;
        } else if ((DType == enmAttDataType.Category) || (lay.Shape != enmShape.PolygonShape) || (data.Unit == "") || (meshF == true)) {
            m = enmSoloMode_Number.ClassPaintMode;
        } else {
            let t = data.Title.toUpperCase();
            for (let i = 0; i < Class_Mode_Title.length; i++) {
                if (t.indexOf(Class_Mode_Title[i].toUpperCase()) != -1) {
                    m = enmSoloMode_Number.ClassPaintMode;
                    break;
                }
            }
            let u = data.Unit.toUpperCase();
            for (let i = 0; i < Class_Mode_unit.length; i++) {
                if (u.indexOf(Class_Mode_unit[i].toUpperCase()) != -1) {
                    m = enmSoloMode_Number.ClassPaintMode;
                    break;
                }
            }
        }
        data.ModeData = m;
        data.SoloModeViewSettings.Div_Method = enmDivisionMethod.Free;

        if (DType == enmAttDataType.Category) {
            //'カテゴリーデータの階級区分
            let cateData = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
            let n = cateData.length;
            let Value = [];
            for (let i = 0; i < n; i++) {
                Value[i] = cateData[i].DataValue;
            }
            let CateValue = Generic.Remove_Same_String(Value);
            data.Statistics.sa = CateValue.length;
            data.SoloModeViewSettings.Div_Num = CateValue.length;
            data.SoloModeViewSettings.Class_Div = [];
            for (let i = 0; i < CateValue.length; i++) {
                let v = new strClass_Div_data();
                v.Value = CateValue[i];
                data.SoloModeViewSettings.Class_Div.push(v);
            }
            pmd.Color_Mode = enmPaintColorSettingModeInfo.SoloColor;
            let mmMD = data.SoloModeViewSettings.ClassMarkMD;
            mmMD.Data = DataNum;
            mmMD.Flag = false;

        } else {
            //通常のデータの階級区分値
            let zn = [];
            pmd.Color_Mode = enmPaintColorSettingModeInfo.twoColor;
            let cdiv = Generic.WIC(5, DataMax, DataMin);

            let dk = cdiv.min;
            let cn=0;
            while(dk<=cdiv.max){
                dk=cdiv.min+cdiv.step*cn;
                cn++;
                if (((dk > DataMin) && (dk < DataMax)) || (DataMax == DataMin)) {
                    zn.push(dk);
                }
            }
            let DVN = zn.length;
            for (let k = zn.length - 1; 0 <= k; k--) {
                let v = new strClass_Div_data();
                v.Value = zn[k];
                data.SoloModeViewSettings.Class_Div.push(v);
            }
            data.SoloModeViewSettings.Class_Div.push(new strClass_Div_data());
            data.SoloModeViewSettings.Div_Num = DVN + 1;
            if (lay.Type != enmLayerType.Trip) {
                //記号の大きさモードの凡例値
                let mzn = [];
                let h = {};
                if (DataMax != DataMin) {
                    let Max, Min;
                    if (DataMin < 0) {
                        Min = 0;
                        Max = Math.max(Math.abs(DataMax), Math.abs(DataMin));
                    } else {
                        Min = DataMin;
                        Max = DataMax;
                    }
                    let cdiv = Generic.WIC(10, Max, Min);
                    let dk = cdiv.min;
                    let cn=0;
                    while(dk<=cdiv.max){
                        dk=cdiv.min+cdiv.step*cn;
                        cn++;
                        if ((Min < dk) && (dk < Max)) {
                            mzn.push(dk);
                        }
                    }
 
                    let mDVN = mzn.length;
                    switch (mDVN) {
                        case 2:
                            h = { h1: 1, h2: 0, h3: -1 };
                            break;
                        case 3:
                            h = { h1: 2, h2: 1, h3: 0 };
                            break;
                        case 4:
                            h = { h1: 3, h2: 1, h3: 0 };
                            break;
                        case 5:
                            h = { h1: 4, h2: 2, h3: 0 };
                            break;
                        case 6:
                            h = { h1: 5, h2: 2, h3: 0 };
                            break;
                        default:
                            h = { h1: mDVN - 1, h2: Math.floor(mDVN / 2) - 1, h3: 0 };
                            break;
                    }
                } else {
                    h = { h1: 0, h2: 1, h3: 2 };
                    mzn = [DataMax, 0, 0];
                }
                let mmd = data.SoloModeViewSettings.MarkSizeMD;
                mmd.Value[0] = mzn[h.h1];
                mmd.Value[1] = mzn[h.h2];
                if (zn[3] == 0) {
                    mmd.Value[2] = mzn[h.h2] / 2;
                } else {
                    mmd.Value[2] = mzn[h.h3];
                }
                mmd.Value[3] = 0;
                mmd.Value[4] = 0;
                mmd.MaxValueMode = 0;
                mmd.MaxValue = Math.max(Math.abs(DataMax), Math.abs(DataMin));
                if (lay.Shape == enmShape.LineShape) {
                    mmd.LineShape.LineWidth = 1;
                    mmd.LineShape.Color = new colorRGBA([0, 0, 0]);
                    mmd.LineShape.LineEdge = clsBase.LineEdge();;
                } else {
                    mmd.Mark = clsBase.Mark();
                    mmd.Mark.ShapeNumber = 0;
                    mmd.Mark.Tile.BlankF = false;
                    mmd.Mark.Tile.Color = defaultColor.markColorTrance.Clone();
                    mmd.Mark.Line.BlankF = false;
                    mmd.Mark.WordFont.Size = 10;
                }
                //記号の数モードの凡例値

                Max = Math.max(Math.abs(DataMax), Math.abs(DataMin));
                Min = 0;
                ST = 0;
                let mdiv =Generic.WIC(10, Max, Min);
                let mmb = data.SoloModeViewSettings.MarkBlockMD;
                if ((mdiv.step < 1) && (mdiv.min >= 1)){
                    mmb.Value = 1;
                } else {
                    mmb.Value = mdiv.step;
                }
                mmb.ArrangeB = enmMarkBlockArrange.Block;
                mmb.HasuVisible = false;
                mmb.Mark = clsBase.Mark();
                mmb.Mark.Tile.Color=defaultColor.markColor.Clone();
                mmb.Mark.WordFont.Size = 2;
                mmb.Overlap = 0;
                mmb.LegendBlockModeWord = "";

                let mmMD = data.SoloModeViewSettings.ClassMarkMD;
                mmMD.Data = DataNum;
                mmMD.Flag = false;

                let mmt = data.SoloModeViewSettings.MarkTurnMD;
                mmt.Dirction = 0;
                mmt.DegreeLap = 360;
                mmt.Mark = clsBase.Mark();
                mmt.Mark.ShapeNumber = 14;
                mmt.Mark.Tile.Color=defaultColor.markColor.Clone();
                mmt.Mark.WordFont.Size = 5;

                let mmbar = data.SoloModeViewSettings.MarkBarMD;
                mmbar.InnerTile.BlankF=false;
                mmbar.InnerTile.Color = defaultColor.markBarColor.Clone();
                mmbar.FrameLinePat = clsBase.Line();
                mmbar.ScaleLineInterval = mdiv.step;
                mmbar.MaxHeight = 10;
                mmbar.MaxValueMode = enmMarkSizeValueMode.inDataItem;
                mmbar.MaxValue = DataMax;
                mmbar.scaleLinePat = clsBase.Line();
                mmbar.scaleLinePat.Color = clsBase.ColorWhite();
                mmbar.ScaleLineVisible = true;
                mmbar.Width = 1.5;
                mmbar.ThreeD = true;
                mmbar.BarShape=enmMarkBarShape.bar;
            }
        }

        let mkc = data.SoloModeViewSettings.MarkCommon;
        mkc.MinusTile = clsBase.Tile();
        mkc.MinusTile.Color = defaultColor.minusColor.Clone();
        mkc.MinusTile.BlankF = false;
        mkc.MinusLineColor = defaultColor.minusColor.Clone();
        mkc.Inner_Data.Flag = false;
        mkc.Inner_Data.Data = DataNum;
        mkc.LegendMinusWord = "";
        mkc.LegendPlusWord = "";

        let smd = data.SoloModeViewSettings.StringMD;
        smd.Font = clsBase.Font();
        smd.Font.Size = 3;
        smd.Font.FringeF=true;
        smd.maxWidth = 20;
        smd.WordTurnF = true;
        this.Twocolort(Layernum, DataNum);

        if ((DType == enmAttDataType.Normal) && (lay.Shape != enmShape.LineShape)) {
            let sv = data.SoloModeViewSettings;
            let ctm = sv.ContourMD;
            ctm.Interval_Mode = 2;
            ctm.Detailed = 3;
            ctm.Draw_in_Polygon_F = true;
            ctm.Spline_flag = true;
            let ctmr = ctm.Regular;
            ctmr.bottom = sv.Class_Div[sv.Div_Num - 2].Value;
            ctmr.Interval = (sv.Class_Div[sv.Div_Num - 3].Value - ctmr.bottom) / 2;
            ctmr.Line_Pat = clsBase.Line();
            ctmr.top = DataMax;
            ctmr.SP_Bottom = ctmr.bottom;
            ctmr.SP_interval = ctmr.Interval * 5;
            ctmr.SP_Line_Pat = clsBase.Line();
            ctmr.SP_Line_Pat.Color = clsBase.ColorBlue();
            ctmr.SP_Top = ctmr.top;
            ctmr.EX_Value_Flag = false;
            ctmr.EX_Value = 0;
            ctmr.EX_Line_Pat = clsBase.Line();
            ctmr.EX_Line_Pat.Color = clsBase.ColorRed();
            ctm.IrregularNum = 0;
        }
        this.Set_Class_Div(Layernum, DataNum, 0);

        if ((lay.Type != enmLayerType.Trip) && (lay.Type != enmLayerType.Trip_Definition)) {
            let odm = data.SoloModeViewSettings.ClassODMD;
            odm.O_object = 0;
            odm.o_Layer = Layernum;
            odm.Dummy_ObjectFlag = false;
            odm.Arrow = clsBase.Arrow();
            for (let kk = 0; kk < this.TotalData.LV1.Lay_Maxn; kk++) {
                if ((this.LayerData[kk].Type != enmLayerType.Trip) && (this.LayerData[kk].Type != enmLayerType.Trip_Definition)) {
                    for (let k = 0; k < this.LayerData[kk].atrObject.ObjectNum; k++) {
                        if (lay.atrData.Data[DataNum].Title.indexOf(this.LayerData[kk].atrObject.atrObjectData[k].Name) != -1) {
                            odm.O_object = k;
                            odm.o_Layer = kk;
                            kk = this.TotalData.LV1.Lay_Maxn;
                            break;
                        }
                    }
                }
            }

        }
    }

    //階級記号、記号の大きさモードなどの内部データ設定の際に、内部データの色またはハッチを返す
    this.Get_InnerTile = function (InnerData, Layernum, CategoryPos) {
        let t;
        if (CategoryPos == -1) {
            t = TotalData.ViewStyle.Missing_Data.PaintTile.Clone();
        } else {
            t = clsBase.Tile();
            t.Color = this.LayerData[Layernum].atrData.Data[InnerData.Data].SoloModeViewSettings.Class_Div[CategoryPos].PaintColor.Clone();
        }
        return t;
    }
    //階級区分設定(ペイントモードでは特に設定なし)
    this.Set_Class_Div = function (Layernum, DataNum, setStartPos) {
        let att_DTA = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        let n = att_DTA.Div_Num;
        for (let j = setStartPos; j < n; j++) {
            let cs = att_DTA.Class_Div[j];
            cs.ClassMark = clsBase.Mark();
            cs.ClassMark.wordmark = String.fromCharCode("A".charCodeAt(0) + j % 26);
            cs.ClassMark.PrintMark = 1;
            cs.ClassMark.Tile = clsBase.Tile();
            cs.ClassMark.Tile.Color=defaultColor.markColor.Clone();
            cs.ClassMark.WordFont = clsBase.Font();
            cs.ClassMark.WordFont.Size = 4;
            cs.ClassMark.WordFont.FringeF=true;

            let w = 1;
            let col = cs.PaintColor;
            if (col.Equals(clsBase.ColorWhite()) == true){
                col = new colorRGBA([200, 200, 200]);
            }
            cs.ODLinePat = clsBase.Line();
            cs.ODLinePat.Color = col;
            cs.ODLinePat.Width = w;
            cs.ODLinePat.Edge_Connect_Pattern.Edge_Pattern = enmEdge_Pattern.Flat;
            if ((j == n - 1) && (this.LayerData[Layernum].atrData.Data[DataNum].DataType == enmAttDataType.Normal) &&
                (this.LayerData[Layernum].Shape == enmShape.PolygonShape) || (this.LayerData[Layernum].Shape == enmShape.PointShape)) {
                cs.ODLinePat.BlankF=true;
            }
        }
    }

    //2色グラテーション設定
    this.Twocolort = function (Layernum, DataNum) {
        let pms = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        let n = pms.Div_Num;
        if (n == 1) {
            pms.Class_Div[0].PaintColor = pms.ClassPaintMD.color1;
        } else {
            let coldata = Generic.TwoColorGradation(pms.ClassPaintMD.color1, pms.ClassPaintMD.color2, n);
            for (let i = 0; i < n; i++) {
                pms.Class_Div[i].PaintColor = coldata[i];
           }
        }
    }

    //3色グラテーション設定
    this.Threecolor = function (Layernum, DataNum, Color_cng_n) {
        let pms = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        let n = pms.Div_Num;
        let coldata = Generic.ThreeColorGradation(pms.ClassPaintMD.color1, pms.ClassPaintMD.color3, pms.ClassPaintMD.color2, n, Color_cng_n);
        for (let i = 0; i < n; i++) {
            pms.Class_Div[i].PaintColor = coldata[i];
        }
    }

    //複数グラデーション
    this.FourColor = function (Layernum, DataNum, Color_cng_n, GradationPoint4, col) {
        let ColData = [];// colorARGB

        if (Color_cng_n == GradationPoint4) { return; }

        let sv = this.LayerData[Layernum].atrData.Data[DataNum].SoloModeViewSettings;
        if (Color_cng_n < GradationPoint4) {
            let n = GradationPoint4 + 1;
            ColData = Generic.TwoColorGradation(sv.ClassPaintMD.color1, col, Color_cng_n + 1);
            for (let i = 0; i < Color_cng_n; i++) {
                sv.Class_Div[i].PaintColor = ColData[i];
            }
            ColData = Generic.TwoColorGradation(col, sv.ClassPaintMD.color3, n - Color_cng_n);
            for (let i = Color_cng_n; i < n; i++) {
                sv.Class_Div[i].PaintColor = ColData[i - Color_cng_n];
            }
        } else {
            let n = Color_cng_n - GradationPoint4 + 1;
            ColData = Generic.TwoColorGradation(sv.ClassPaintMD.color3, col, n);
            for (let i = 0; i < n; i++) {
                sv.Class_Div[GradationPoint4 + i].PaintColor = ColData[i];
            }
            n = sv.Div_Num - Color_cng_n;
            ColData = Generic.TwoColorGradation(col, sv.ClassPaintMD.color2, n);
            for (let i = 0; i < n; i++) {
                sv.Class_Div[Color_cng_n + i].PaintColor = ColData[i];
            }

        }
    }
   
    //データ項目の平均、合計、標準偏差等を計算
    this.CulcuOne = function (Layernum, DataNum) {
        let L = this.LayerData[Layernum].atrData.Data[DataNum];
        L.MissingValueNum = this.Get_Att_Missing_Num(Layernum, DataNum);
        L.EnableValueNum = this.LayerData[Layernum].atrObject.ObjectNum - L.MissingValueNum;
        switch (L.DataType) {
            case enmAttDataType.Normal:
                let EDataNum = L.EnableValueNum;
                if (EDataNum > 0) {
                    let EnableDT = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
                    let Add = 0, Add2 = 0, Max = EnableDT[0].DataValue, Min = Max;
                    let Decimal = { AfterDecimal: 0, BeforeDecimal: 0 };

                    for (let i = 0; i < EDataNum; i++) {
                        let v = Number(EnableDT[i].DataValue);
                        Add += v;
                        Add2 += +v * v;
                        Max = Math.max(Max, v);
                        Min = Math.min(Min, v);
                        let Dsub = Generic.Figure_Arrange(v);
                        Decimal.AfterDecimal = Math.max(Decimal.AfterDecimal, Dsub.AfterDecimal);
                        Decimal.BeforeDecimal = Math.max(Decimal.BeforeDecimal, Dsub.BeforeDecimal);
                    }
                    L.Statistics.Max = Max;
                    L.Statistics.Min = Min;
                    L.Statistics.Sum = Add;
                    L.Statistics.AfterDecimalNum = Decimal.AfterDecimal;
                    L.Statistics.BeforeDecimalNum = Decimal.BeforeDecimal;
                    L.Statistics.Ave = Add / EDataNum;
                    L.Statistics.Ave = Number(Generic.Figure_Using(L.Statistics.Ave, Decimal.AfterDecimal + 1));
                    L.Statistics.sa = Max - Min;
                    L.Statistics.STD = Math.sqrt(Add2 / EDataNum - L.Statistics.Ave * L.Statistics.Ave);
                    L.Statistics.STD = Number(Generic.Figure_Using(L.Statistics.STD, Decimal.AfterDecimal + 1));
                }
                break;
        }
    }


    /**オブジェクトの重心取得、できなかった場合はFalse */
    this.Get_ObjectGravityPoint = function (Layernum, ObjNumber) {
        let lay = this.LayerData[Layernum];
        let LO = lay.atrObject.atrObjectData[ObjNumber];
        if (lay.Type == enmLayerType.Mesh) {
            let px = LO.MeshPoint[0].x;
            let py = LO.MeshPoint[0].y;
            for (let i = 1; i <= 4; i++) {
                px += LO.MeshPoint[i].x;
                py += LO.MeshPoint[i].y;
            }
            px /= 4;
            py /= 4;
            return { ok: true, gpoint: new point(px, py) };
        } else {
            let badata = this.Boundary_Kencode_Arrange(Layernum, ObjNumber);
            if (badata.Pon <= 0) {
                return { ok: false };
            } else {
                let v = this.LayerData[Layernum].MapFileData.Menseki_Sub(badata);
                return { ok: true, gpoint: v.gpoint };
            }
        }
    }

    //オブジェクトの面積取得
    this.GetObjMenseki = function (Layernum, ObjNumber) {
        let lay=this.LayerData[Layernum];
        let LO = lay.atrObject.atrObjectData[ObjNumber];
        if (lay.Type == enmLayerType.Mesh) {
            let p = new Array();
            for (let i = 0; i < LO.MeshPoint.length; i++) {
                p.push(LO.MeshPoint[i]);
            }
            p.push(LO.MeshPoint[0]);
            p.push(LO.MeshPoint[1]);
            let men = spatial.Get_Hairetu_Menseki( p, lay.MapFileData.Map)
            return {menseki:men};
        } else {
            let badata = this.Boundary_Kencode_Arrange(Layernum, ObjNumber);
            if (badata.Pon <= 0) {
                return (-1);
            } else {
                let m = lay.MapFileData.Menseki_Sub(badata);
                return m;
            }
        }
    }

    //オブジェクトの周長を求める
    this.Get_ObjectLength = function (Layernum, ObjNum) {
        let lay=this.LayerData[Layernum];
        let ELine;
        switch (lay.atrObject.atrObjectData[ObjNum].Objectstructure) {
            case enmKenCodeObjectstructure.MapObj:
                let O_Code = lay.atrObject.atrObjectData[ObjNum].MpObjCode;
                ELine = lay.MapFileData.Get_EnableMPLine(O_Code, lay.Time);
                break;
            case enmKenCodeObjectstructure.SyntheticObj:
                ELine = this.Get_Enable_KenCode_MPLine( ObjNum, Layernum);
                break;
        }
        let NL = ELine.length;
        if (NL == 0) {
            return -1;
        }
        let za=this.TotalData.ViewStyle.Zahyo;
        let D = 0;
        for (let i = 0; i < NL; i++) {
            let ml = lay.MapFileData.MPLine[ELine[i].LineCode];
            if (za.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                for (let j = 0; j < ml.NumOfPoint - 1; j++) {
                    D += spatial.Distance_Ido_Kedo_XY_Point(ml.PointSTC[j], ml.PointSTC[j + 1], za);
                }
            } else {
                for (let j = 0; j < ml.NumOfPoint - 1; j++) {
                    D += spatial.Distance_Point(ml.PointSTC[j], ml.PointSTC[j + 1]);
                }
            }
        }
        if (za.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
        } else {
            D = D / lay.MapFileData.Map.SCL;
        }
        return D;
    }

    //階級区分値の指定
    this.Set_Div_Value = function (Layernum, DataNum) {
        let L = this.LayerData[Layernum].atrData.Data[DataNum];
        let v = L.SoloModeViewSettings.Div_Method;
        let EDataNum = L.EnableValueNum;
        let div_num = L.SoloModeViewSettings.Div_Num;
        let dtype = L.DataType;
        let Div_Value = new Array(div_num);
        switch (v) {
            case enmDivisionMethod.Free:
                return;
                break;
            case enmDivisionMethod.Quantile://分位数
            case enmDivisionMethod.AreaQuantile:
               let EnableDT = this.Get_Data_Cell_Array_Without_MissingValue(Layernum, DataNum);
                let SortV = new clsSortingSearch();
                for (let i = 0; i < EDataNum; i++) {
                    SortV.Add(Number(EnableDT[i].DataValue));
                }
                SortV.AddEnd();
                if (v == enmDivisionMethod.Quantile) {
                    let divvStp = SortV.NumofData() / div_num;
                    let i = 0;
                    let divv = divvStp;
                    do {
                        Div_Value[i] = SortV.DataPositionRevValue(parseInt(divv) - 1);
                        divv += divvStp;
                        i++;
                    } while (divv < SortV.NumofData());
                } else {
                    //面積分位数
                    let Mense = new Array(EDataNum);
                    let AddMense = 0;
                    for (let i = 0; i < EDataNum; i++) {
                        Mense[i] = this.GetObjMenseki(Layernum, EnableDT[i].ObjLocation);
                        AddMense += Mense[i].menseki;
                    }
                    let n = 0;
                    let Addv = 0;
                    let divvStp = AddMense / div_num;
                    let divv = divvStp;
                    for (let i = 0; i < SortV.NumofData(); i++) {
                        let j = SortV.DataPositionRev(i);
                        Addv += Mense[j].menseki;
                        if (Addv >= divv) {
                            Div_Value[n] = SortV.DataPositionRevValue(i);
                            divv += divvStp;
                            n++;
                            Addv -= Mense[j].menseki;
                            i--;
                        }
                    }
                }
                break;
            case enmDivisionMethod.StandardDeviation://標準偏差
                Div_Value[0] = L.Statistics.Ave + L.Statistics.STD;
                Div_Value[1] = L.Statistics.Ave + L.Statistics.STD / 2;
                Div_Value[2] = L.Statistics.Ave;
                Div_Value[3] = L.Statistics.Ave - L.Statistics.STD / 2;
                Div_Value[4] = L.Statistics.Ave - L.Statistics.STD;
                for (let i = 0; i < 4; i++) {
                    Div_Value[i] = parseFloat(Generic.Figure_Using(Div_Value[i], L.Statistics.AfterDecimalNum + 1));
                }
                break;
            case enmDivisionMethod.EqualInterval: //等間隔
                let a = L.Statistics.sa / div_num;
                for (let i = 0; i < div_num; i++) {
                    Div_Value[i] = L.Statistics.Max - a * (i + 1);
                }
                for (let i = 0; i < div_num; i++) {
                    Div_Value[i] = parseFloat(Generic.Figure_Using(Div_Value[i], L.Statistics.AfterDecimalNum + 1));
                  }
                break;
        }
        for (let i = 0; i < div_num; i++) {
            L.SoloModeViewSettings.Class_Div[i].Value = Div_Value[i];
        }
    }

    this.Get_Att_Missing_Num = function (LayerNum, DataNum) {
        if (this.LayerData[LayerNum].atrData.Data[DataNum].MissingF == false) {
            return 0;
        } else {
            return Generic.Count_Specified_Value_Array(this.LayerData[LayerNum].atrData.Data[DataNum].Value, undefined);
        }
    }

    //欠損値を除いた配列でデータ項目の値を取得
    this.Get_Data_Cell_Array_Without_MissingValue = function (LayerNum, DataNum) {
        let ObjNum = this.LayerData[LayerNum].atrObject.ObjectNum;
        let DT = [];
        let LD = this.LayerData[LayerNum].atrData.Data[DataNum];
        if (LD.EnableValueNum == 0) {
            return undefined;
        }
        if ((LD.MissingF == false) || (LD.MissingValueNum == 0)) {
            for (let i = 0; i < ObjNum; i++) {
                DT[i] = new strObjLocation_and_Data_info();
                DT[i].ObjLocation = i;
                DT[i].DataValue = LD.Value[i];
            }
            return DT;
        } else {
            let n = 0;
            for (let i = 0; i < ObjNum; i++) {
                if (LD.Value[i] != undefined) {
                    DT[n] = new strObjLocation_and_Data_info();
                    DT[n].ObjLocation = i;
                    DT[n].DataValue = LD.Value[i];
                    n++;
                }
            }
            return DT;
        }
    }

    this.Get_DataType = function (Layernum, DataNum) {
        return this.LayerData[Layernum].atrData.Data[DataNum].DataType;

    }
    this.Get_DataNote = function (Layernum, DataNum) {
        return this.LayerData[Layernum].atrData.Data[DataNum].Note;
    }

    this.Set_DataTitle_to_CheckedListBox= function(CheckedListBox, Layernum, defoChecked, Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true, Special_Astarisk_Num = -1){
        let titles = this.getDataTitleName(Layernum, Number_Print_F, Normal_F, Category_f, String_f, Special_Astarisk_Num);
        let list = [];
        for(let i in titles){
            list.push({checked:defoChecked,text:titles[i]});
        }
        CheckedListBox.removeAll();
        CheckedListBox.addList(list, 0);
    }


    this.Set_DataTitle_to_cboBox= function(cbox, Layernum, SelectedIndex, Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true, Special_Astarisk_Num = -1){
        let titles = this.getDataTitleName(Layernum, Number_Print_F, Normal_F, Category_f, String_f, Special_Astarisk_Num);
        let items = [];
        for (let i = 0; i < titles.length; i++) {
            items.push({ value: (i), text: titles[i] });
        }
        cbox.addSelectList(items, SelectedIndex, true,true);
    }

    //**グラフデータセットのタイトル配列取得(value:番号、text:タイトル) */
    this.getGraphTitle= function (Layernum){
        let graph = this.LayerData[Layernum].LayerModeViewSettings.GraphMode;
        let items = [];
        for (let i = 0; i < graph.DataSet.length; i++) {
            let tx = graph.DataSet[i].title;
            if (tx == "") {
                tx = "データセット" + (i + 1).toString();
            }
            items.push({ value: i, text: tx });
        }
        return items;
    }

    //**ラベルデータセットのタイトル配列取得(value:番号、text:タイトル) */
    this.getLabelTitle = function (Layernum) {
        let lbl = this.LayerData[Layernum].LayerModeViewSettings.LabelMode;
        let items = [];
        for (let i = 0; i < lbl.DataSet.length; i++) {
            let tx = lbl.DataSet[i].title;
            if (tx == "") {
                tx = "データセット" + (i + 1).toString();
            }
            items.push({ value: i, text: tx });
        }
        return items;
    }

    //**重ね合わせデータセットのタイトル配列取得(value:番号、text:タイトル) */
    this.getOverlayTitle= function (){
        let over = this.TotalData.TotalMode.OverLay;
        let items = [];
        for (let i = 0; i < over.DataSet.length; i++) {
            let tx = over.DataSet[i].title;
            if (tx == "") {
                tx = "データセット" + (i + 1).toString();
            }
            items.push({ value: i, text: tx });
        }
        return items;
    }

    //データ項目のタイトルを取得する。Number_Print_F=trueの場合は、データの種類毎に選択可否可能
    // <param name="Number_Print_F">タイトルの前に番号を振る</param>
    // <param name="Normal_F">通常のデータを選択可に</param>
    // <param name="Category_f">カテゴリーデータを選択可に</param>
    // <param name="String_f">文字列データを選択可に</param>
    // <param name="Special_Astarisk_Num">特別にアスタリスクにする番号</param>
    this.getDataTitleName = function (Layernum, Number_Print_F = true, Normal_F = true, Category_f = true, String_f = true, Special_Astarisk_Num = -1) {
        let ad = this.LayerData[Layernum].atrData;
        let items = [];
        const n = this.Get_DataNum(Layernum);
        for (let i = 0; i < n; i++) {
            let d = ad.Data[i];
            let itm = d.Title;
            let hd = "";
            if (Number_Print_F == true) {
                if (i == Special_Astarisk_Num) {
                    hd = "*";
                } else {
                    hd = String(i + 1);
                    switch (d.DataType) {
                        case (enmAttDataType.Normal): {
                            if (Normal_F == false) {
                                hd = "*"
                            }
                            break;
                        }
                        case (enmAttDataType.Category): {
                            if (Category_f == false) {
                                hd = "*";
                            }
                            break;
                        }
                        case (enmAttDataType.Strings): {
                            if (String_f == false) {
                                hd = "*";
                            }
                            break;
                        }
                    }
                }
                itm = hd + ":" + itm;
            }
            items.push(itm);
        }
        return items;
    }

    this.Get_DataTitle = function (Layernum, DataNum, PreFixDataNumberFlag) {
        let tx = this.LayerData[Layernum].atrData.Data[DataNum].Title;
        if (PreFixDataNumberFlag == true) {
            tx = (DataNum + 1) + ":" + tx;
        }
        return tx;
    }

    this.Get_DataTitleLayer = function (Layernum, PreFixDataNumberFlag) {
        let n = this.LayerData[Layernum].atrData.Count;
        let ttl = [];
        for (let i = 0; i < n; i++){
            ttl.push(this.Get_DataTitle(Layernum, i, PreFixDataNumberFlag));
        }
        return ttl;
    }

    this.Get_DataUnitLayer = function (Layernum) {
        let n = this.LayerData[Layernum].atrData.Count;
        let unt = [];
        for (let i = 0; i < n; i++) {
            unt.push(this.Get_DataUnit(Layernum, i));
        }
        return unt;
    }

    this.Get_DataUnit = function (Layernum, DataNum) {
        return this.LayerData[Layernum].atrData.Data[DataNum].Unit;
    }

    this.Get_DataUnit_With_Kakko = function (Layernum, DataNum) {
        let tx = "";
        if (this.LayerData[Layernum].atrData.Data[DataNum].DataType == enmAttDataType.Normal) {
            tx = this.Get_DataUnit(Layernum, DataNum);
        }
        if (tx != "") {
            tx = "(" + tx + ")"
        }
        return tx;
    }
    this.Get_DataMax = function (Layernum, DataNum) {
        return this.LayerData[Layernum].atrData.Data[DataNum].Statistics.Max;
    }

    this.Get_DataMin = function (Layernum, DataNum) {
        return this.LayerData[Layernum].atrData.Data[DataNum].Statistics.Min;
    }

    this.Get_DataNum = function (LayerNum) {
        return this.LayerData[LayerNum].atrData.Count;
    }
    this.Get_DataMissingNum = function (LayerNum, DataNum) {
        return this.LayerData[LayerNum].atrData.Data[DataNum].MissingValueNum;
    }
  
    /**連続表示モードのデータセット一覧を取得 */
    this.getSeriesDataSetName=function(){
        let series = attrData.TotalData.TotalMode.Series;
        let seriesDataSetList = [];
        for (let i = 0; i < series.DataSet.length; i++) {
            let tx = series.DataSet[i].title;
            if (tx == "") {
                tx = "データセット" + (i + 1).toString();
            }
            seriesDataSetList.push({ value: i, text: tx });
        }
        return seriesDataSetList;
    }

    /** 連続表示モードのデータセットをリストビューに入れる*/
    this.SeriesMode_to_ListViewData=function(seriesListView,DataSetItem){
        seriesListView.clear();
        let seriesData = [4];
        for (let i = 0; i < DataSetItem.length; i++) {
            let di = DataSetItem[i];
            seriesData[0] = (i + 1).toString();
            if (di.Print_Mode_Total == enmTotalMode_Number.OverLayMode) {
                let over = this.TotalData.TotalMode.OverLay;
                seriesData[1] = "重ね合わせ表示モード";
                let T = over.DataSet[over.SelectedIndex].title;
                if (T == "") {
                    T = "データセット" + String(di.Data + 1);
                }
                seriesData[2] = T;
                seriesData[3] = ""
            } else {
                seriesData[1] = this.LayerData[di.Layer].Name;
                switch (di.Print_Mode_Layer) {
                    case enmLayerMode_Number.SoloMode: {
                        seriesData[2] = this.Get_DataTitle(di.Layer, di.Data, false);
                        seriesData[3] = Generic.getSolomodeStrings(di.SoloMode);
                        break;
                    }
                    case enmLayerMode_Number.GraphMode: {
                        seriesData[2] = "グラフ表示";
                        let T = this.LayerData[di.Layer].LayerModeViewSettings.GraphMode.DataSet[di.Data].title;
                        if (T == "") {
                            T = "データセット" + String(di.Data + 1);
                        }
                        seriesData[3] = T;
                        break;
                    }
                    case enmLayerMode_Number.LabelMode: {
                        seriesData[2] = "ラベル表示";
                        let T = this.LayerData[di.Layer].LayerModeViewSettings.LabelMode.DataSet[di.Data].title;
                        if (T == "") {
                            T = "データセット" + String(di.Data + 1);
                        }
                        seriesData[3] = T;
                        break;
                    }
                    case enmLayerMode_Number.TripMode:
                        break;
                }
            }
            seriesListView.insertRow(1, seriesData);
        }

    }
    this.Add_one_Layer = function (LayerName, LayerType, LayerMeshType, LayerShape, LayerMapFile, LayerTime, LayerSystem, comment,ObjectNum, ObjData) {
        //レイヤの追加
        let NewL = new strLayerDataInfo();
        if (LayerMapFile == "") {
            LayerMapFile = this.MapData.GetPrestigeMapFileName();
        }
        NewL.MapFileName = LayerMapFile;
        NewL.MapFileData = this.MapData.SetMapFile(LayerMapFile);
        NewL.MapFileObjectNameSearch = this.MapData.SetObject_Name_Search(LayerMapFile);
        NewL.Name = LayerName;
        NewL.Type = LayerType;
        NewL.ReferenceSystem = LayerSystem;
        NewL.MeshType = LayerMeshType;
        NewL.Shape = LayerShape;
        NewL.Time = LayerTime;
        NewL.Comment = comment;
        NewL.atrData.Count = 0;
        NewL.atrData.SelectedIndex = 0;
        NewL.atrObject.ObjectNum = ObjectNum;
        NewL.atrObject.NumOfSyntheticObj = 0;
        for (let i = 0; i < NewL.atrObject.ObjectNum; i++) {
            NewL.atrObject.atrObjectData[i] = ObjData[i].Clone();
        }
        NewL.initLayerData()
        this.LayerData.push(NewL);
        this.TotalData.LV1.Lay_Maxn++;
    }

    /**レイヤ名をセレクトボックスに入れる */
    this.Set_LayerName_to= function(selbox,SelectedIndex,NormalF=true,syntheticF=true,PointF=true,MeshF=true){
        let lst = [];
        let fall=false;
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let f =false;
            switch (this.LayerData[i].Type) {
                case enmLayerType.Normal: {
                    if (this.LayerData[i].atrObject.NumOfSyntheticObj > 0) {
                        if ((NormalF == true) && (syntheticF == true)) {
                            f = true;
                        } else {
                            f = false;
                        }
                    } else {
                        f = NormalF;
                    }
                    break;
                }
                case enmLayerType.DefPoint:
                    f = PointF;
                    break;
                case enmLayerType.Mesh:
                    f = MeshF;
                    break;
            }
            if (f == false) { fall = true }
            let d = { value: i, text:f ?  attrData.LayerData[i].Name: "*"+attrData.LayerData[i].Name}
            lst.push(d);
        }
        selbox.addSelectList(lst, SelectedIndex, true,fall);
    }

    
    /**セレクトボックスにレイヤ内のオブジェクト一覧と初期設定を入れる */
    this.Set_ObjectName_to_selectBox = function (selbox, Layernum, SelectedObject) {
        let objList=[];
        selbox.removeAll();
        let L = this.LayerData[Layernum].atrObject;
        for (let i = 0; i <L.ObjectNum;i++){
            let v={text:L.atrObjectData[i].Name,value:i};
            objList.push(v);
        }
        if (objList.length > 0) {
            selbox.addSelectList(objList, SelectedObject, true, true);
        }
    }
    /**セレクトボックスにレイヤ内のダミーオブジェクト一覧と初期設定を入れる */
    this.Set_DummyObjectName_to_selectBox = function (selbox, Layernum, SelectedObject) {
        let objList = [];
        selbox.removeAll();
        let L = this.LayerData[Layernum].Dummy
        for (let i = 0; i < L.length; i++) {
            let v = { text: L[i].Name, value: i };
            objList.push(v);
        }
        if (objList.length > 0) {
            selbox.addSelectList(objList, SelectedObject, true, true);
        }
    }

    /**リストボックスexにレイヤ内のオブジェクト一覧と初期設定を入れる */
    this.Set_ObjectName_to_checkedListBox = function (lbox,Layernum, SelectedObjects) {
        let objList=[];
        lbox.removeAll();
        let L = this.LayerData[Layernum].atrObject;
        for (let i = 0; i <L.ObjectNum;i++){
            let v={text:L.atrObjectData[i].Name,checked:false};
            if(SelectedObjects=!undefined){
                v.checked=SelectedObjects[i];
            }
            objList.push(v);
        }
        lbox.addList(objList,0);
    }

    /**リストボックスexにレイヤ内のダミーオブジェクト一覧と初期設定を入れる */
    this.Set_DummyObjectName_to_checkedListBox = function (lbox,Layernum, SelectedObjects) {
        let objList=[];
        lbox.removeAll();
        let L=this.LayerData[Layernum].Dummy
        for (let i = 0; i <L.length;i++){
            let v={text:L[i].Name,checked:false};
            if(SelectedObjects=!undefined){
                v.checked=SelectedObjects[i];
            }
            objList.push(v);
        }
        if(objList.length>0){
            lbox.addList(objList,0);
        }
    }
    /**レイヤとそのでのオブジェクト位置から代表点を取得 */
    this.Get_CenterP=function(Layernum,ObjNum){
        return this.LayerData[Layernum].atrObject.atrObjectData[ObjNum].CenterPoint;
    }

    /**オブジェクトと座標の距離 */
    this.Distance_Kencode_Point = function (Layernum, Obj, Point) {
        let L = this.LayerData[Layernum];
        if (L.Shape == enmShape.LineShape) {
            v = this.Get_Distance_Kencode_Between_ObjectLine_and_Point(Layernum, Obj, Point);
        } else {
            let p1 = this.Get_CenterP(Layernum, Obj);
            let z = this.TotalData.ViewStyle.Zahyo;
            if (z.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                let PS = spatial.Get_Reverse_XY(Point, z);
                let P2 = spatial.Get_Reverse_XY(p1, z);
                v = spatial.Distance_Ido_Kedo_LatLon(PS.toLatlon(), P2.toLatlon());
            } else {
                v = spatial.Distance_Point(Point, p1) / this.MapData.SetMapFile("").Map.SCL;
            }
        }
        return v;
    }

    /**KecnCodeと地図ファイルのオブジェクトの間で指定/線オブジェクトと面・点オブジェクトの距離は、最も近い線の位置と点・面の代表点、点・面オブジェクト間の距離は代表点間の距離、線と線の場合は、o_Code2側か線、o_Code1側が点として扱われる */
    this.Distance_Kencode_MPObject = function (LayNum1, ObjNum1, MapFile, ObjCode2, Time ) {
        let P1;
        let P2;
        let d;
        let z = this.TotalData.ViewStyle.Zahyo;
        if (this.MapData.SetMapFile(MapFile).MPObj(ObjCode2).Shape == enmShape.LineShape) {
            if (this.LayerData[LayNum1].Shape != enmShape.LineShape) {
                P1 = this.Get_CenterP(LayNum1, ObjNum1);
                d = this.MapData.SetMapFile(MapFile).Get_Distance_Between_ObjectLine_and_Point(ObjCode2, Time, P1);
            } else {
                this.MapData.SetMapFile(MapFile).Get_Enable_CenterP(P1, ObjCode2, Time);
                if (z.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, z);
                } else {
                    d = spatial.Distance_Point(P1, P2) / this.MapData.SetMapFile("").Map.SCL;
                }
            }
        } else {
            if (this.LayerData[LayNum1].Shape == enmShape.LineShape) {
                P1 = this.Get_CenterP(LayNum1, ObjNum1);
                d = this.Get_Distance_Kencode_Between_ObjectLine_and_Point(LayNum1, ObjNum1, P2);
            } else {
                P1 = this.Get_CenterP(LayNum1, ObjNum1);
                this.MapData.SetMapFile(MapFile).Get_Enable_CenterP(P2, ObjCode2, Time);
                if (z.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, z);
                } else {
                    d = spatial.Distance_Point(P1, P2) / this.MapData.SetMapFile("").Map.SCL;
                }
            }
        }
        return d;
    }

    /**KecnCodeで指定/線オブジェクトと面・点オブジェクトの距離は、最も近い線の位置と点・面の代表点、点・面オブジェクト間の距離は代表点間の距離、線と線の場合は、o_Code2側か線、o_Code1側が点として扱われる */
    this.Distance_Kencode_Object = function (ObjNum1, ObjNum2, LayNum1, LayNum2) {
        let P1;
        let P2;

        if (this.LayerData[LayNum2].Shape == enmShape.LineShape) {
            [ObjNum1, ObjNum2] = [ObjNum2, ObjNum1];
            [LayNum1, LayNum2] = [LayNum2, LayNum1];
        }
        let d;
        if (this.LayerData[LayNum1].Shape == enmShape.LineShape) {
            //一方が線オブジェクトの場合
            P2 = this.Get_CenterP(LayNum2, ObjNum2);
            d = this.Get_Distance_Kencode_Between_ObjectLine_and_Point(LayNum1, ObjNum1, P2);
        } else {
            P1 = this.Get_CenterP(LayNum1, ObjNum1);
            P2 = this.Get_CenterP(LayNum2, ObjNum2);
            if (this.TotalData.ViewStyle.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, this.TotalData.ViewStyle.Zahyo);
            } else {
                d = spatial.Distance_Point(P1, P2) / this.MapData.SetMapFile("").Map.SCL;
            }
        }
        return d;
    }

    /**オブジェクトの線とある地点との距離を求める */
    this.Get_Distance_Kencode_Between_ObjectLine_and_Point = function (LayNum, ObjNum, P) {

        let ELine = this.Get_Enable_KenCode_MPLine(LayNum, ObjNum);
        let d = this.LayerData[LayNum].MapFileData.Distance_PointMPLineAllay(P,  ELine);
        return d;
    }

    /**オブジェクトを削除（移動レイヤ、移動主体定義レイヤ、合成オブジェクト使用レイヤは削除不可 LayerDelNum:レイヤごとの削除数の配列。削除しない場合は0,ObjectDeleteCheck:オブジェクトの数だけの配列で、削除する場合Trueを、全レイヤ分Listに格納） */
    this.DeleteObjects=function(LayerDelNum,ObjectDeleteCheck){
        //線モードの起点オブジェクトをチェックするために新旧対応リスト作成
        let LayMax=this.TotalData.LV1.Lay_Maxn;
        let ConvObj = [];
        for (let i = 0; i < LayMax; i++) {
            let ObjConv = [];
            if (LayerDelNum[i] > 0) {
                let obn = ObjectDeleteCheck[i];
                let n = 0;
                for (let j = 0; j < obn.length; j++) {
                    if (obn[j] == false) {
                        ObjConv[j] = n;
                        n++;
                    } else {
                        ObjConv[j] = 0;
                    }
                }
            }
            ConvObj.push(ObjConv);
        }

        for(let i  = 0;i< LayMax;i++){
            if (LayerDelNum[i] > 0) {
                let ld = this.LayerData[i];
                let obn = ObjectDeleteCheck[i];
                let GetList = [];
                for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                    if (obn[j] == false) {
                        GetList.push(j);
                    }
                }
                let newObjN = GetList.length;
                ld.atrObject.ObjectNum = newObjN
                for (let j = 0; j < newObjN; j++) {
                    let fromObj = GetList[j];
                    if (fromObj != j) {
                        ld.atrObject.atrObjectData[j] = ld.atrObject.atrObjectData[fromObj].Clone();
                    }
                    for (let k = 0; k < this.Get_DataNum(i); k++) {
                        ld.atrData.Data[k].Value[j] = ld.atrData.Data[k].Value[fromObj];
                    }
                }
                ld.atrObject.atrObjectData.length = newObjN;
                for (let k = 0; k < this.Get_DataNum(i); k++) {
                    let oldData = this.LayerData[i].atrData.Data[k].Clone(true);
                    let oldMode = ld.atrData.Data[k].ModeData;
                    ld.atrData.Data[k].Value.length = newObjN;
                    this.CulcuOne(i, k);
                    this.SetIniHanrei(i, k);
                    this.Set_Legend(i, k, oldData, true, true, true, true, true, true, true, true, true, true, true);
                    ld.atrData.Data[k].ModeData = oldMode;
                    if (oldData.DataType != enmAttDataType.Strings) {
                        let ldc = ld.atrData.Data[k].SoloModeViewSettings.ClassODMD;
                        if (ldc.Dummy_ObjectFlag == false) {
                            if (LayerDelNum[ldc.o_Layer] > 0) {
                                ldc.O_object = ConvObj[ldc.o_Layer][ldc.O_object];
                            }
                        }
                    }
                }
            }
        }
    }

    /**レイヤごとに自動間引きができるかどうかチェック */
    this.check_AutoSoubyou_Enable = function () {
        this.TempData.SoubyouLayerEnable = [];
        this.TempData.SoubyouLoopLineArea = [];
        for (let i = 0; i < this.TotalData.LV1.Lay_Maxn; i++) {
            let ld = this.LayerData[i]
            let LoopLineArea = new Array(ld.MapFileData.Map.ALIN );
            LoopLineArea.fill(0);
            //ダミーオブジェクトグループのチェック
            let ObjGIndex = new Array(ld.MapFileData.Map.OBKNum);
            ObjGIndex.fill(false);
            for (let j = 0; j < ld.DummyGroup.length; j++) {
                ObjGIndex[ld.DummyGroup[j]] = true;
            }
            for (let j = 0; j < ld.MapFileData.Map.Kend; j++) {
                if (ObjGIndex[ld.MapFileData.MPObj[j].Kind] == true) {
                    let ELine = ld.MapFileData.Get_EnableMPLine( j, ld.Time);
                    for (let k = 0; k < ELine.length; k++) {
                        let Lcode = ELine[k].LineCode;
                        if (LoopLineArea[Lcode] == 0) {
                            let men = ld.MapFileData.Get_LoopLine_Menseki(Lcode);
                            LoopLineArea[Lcode] = men;
                            this.TempData.SoubyouLayerEnable[i] = true;
                        }
                    }
                }
            }
            //ダミーオブジェクトのチェック
            for (let j = 0; j < ld.Dummy.length; j++) {
                let c = ld.Dummy[j].code;
                if (ld.MapFileData.MPObj[c].Shape != enmShape.PointShape) {
                    let ELine = ld.MapFileData.Get_EnableMPLine(c, ld.Time);
                    for (let k = 0; k < ELine.length; k++) {
                        let Lcode = ELine[k].LineCode;
                        if (LoopLineArea[Lcode] == 0) {
                            let men = ld.MapFileData.Get_LoopLine_Menseki(Lcode);
                            LoopLineArea[Lcode] = men;
                            this.TempData.SoubyouLayerEnable[i] = true;
                        }
                    }
                    break;
                }
            }
            if (ld.Type == enmLayerType.Normal) {
                switch (ld.Shape) {
                    case enmShape.PointShape:
                        break;
                    case enmShape.LineShape:
                        this.TempData.SoubyouLayerEnable[i] = true;
                        break;
                    case enmShape.PolygonShape: {
                        let checkObjn = Math.min(ld.atrObject.ObjectNum, 100);
                        let LUse = new Array(ld.MapFileData.Map.ALIN);
                        LUse.fill(0);
                        for (let j = 0; j < checkObjn; j++) {
                            let ELine = this.Get_Enable_KenCode_MPLine( i, j);
                            for (let k = 0; k < ELine.length; k++) {
                                LUse[ELine[k].LineCode]++;
                                if (LUse[ELine[k].LineCode] == 2) {
                                    this.TempData.SoubyouLayerEnable[i] = true;
                                    j = ld.atrObject.ObjectNum;
                                    break;
                                }
                            }
                        }
                        if (this.TempData.SoubyouLayerEnable[i] == true) {
                            //ループオブジェクトの中で、最後に残す一番面積の大きいループを決める
                            for (let j = 0; j < ld.atrObject.ObjectNum; j++) {
                                let ELine = this.Get_Enable_KenCode_MPLine( i, j);
                                let Loop_mens = new clsSortingSearch();
                                let LoopOnlyf = true;
                                for (let k = 0; k < ELine.length; k++) {
                                    let Lcode = ELine[k].LineCode;
                                    let men = LoopLineArea[Lcode];
                                    if (men == 0) {
                                        men = ld.MapFileData.Get_LoopLine_Menseki(Lcode);
                                        LoopLineArea[Lcode] = men;
                                    }
                                    if (men == -1) {
                                        LoopOnlyf = false;
                                    } else {
                                        Loop_mens.Add(men);
                                    }
                                }
                                if (LoopOnlyf == true) {
                                    Loop_mens.AddEnd();
                                    let lnum = Loop_mens.DataPositionRev(0);
                                    LoopLineArea[ELine[lnum].LineCode] = -2;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            this.TempData.SoubyouLoopLineArea[i] = LoopLineArea;
        }
    }
}



//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var clsAttrMapData = function () {
    let strAttrMap = function () {
        this.FileName; //String
        this.FullPath; //String
        this.Mapdata; //clsMapData
    }
    let Prestage_MapFileName;
    let attrMapData = {}; //  clsMapData
    let Object_Name_Search = []; //clsObjectNameSearch

    this.getAllMapData= function (){
        return attrMapData;
    }

    this.AddExistingMapData = function (MapData, MapFileName) {
        let key = MapFileName.toUpperCase();
        attrMapData[key] = MapData;
        Object_Name_Search[key] = new clsObjectNameSearch(MapData, true);
        if (Object.keys(attrMapData).length == 1) {
            Prestage_MapFileName = key;
        }
    }
    this.SetMapFile = function (MapFileName) {
        if (MapFileName == "") {
            return attrMapData[Prestage_MapFileName];
        } else {
            //存在しない場合はundefined
            return attrMapData[MapFileName.toUpperCase()];
        }
    }
    this.SetObject_Name_Search = function (MapFileName) {
        if (MapFileName == "") {
            return Object_Name_Search[Prestage_MapFileName];
        } else {
            //存在しない場合はundefined
            return Object_Name_Search[MapFileName.toUpperCase()];
        }
    }

    // 読み込んだ地図ファイル名の配列を返す
    this.GetMapFileName = function () {
        let fname = Object.keys(attrMapData);
        return fname;
    }
    //読み込んだ地図ファイル数を返す
    this.GetNumOfMapFile = function () {
        return Object.keys(attrMapData).length;
    }
    //地図ファイルの有無を調べる
    this.CheckMapfileExists = function (MapFileName) {
        let fname = Object.keys(attrMapData);
        if (fname.indexOf(MapFileName) == -1) {
            return false;
        } else {
            return true;
        }
    }


    this.EqualizeZahyoMode = function (Zahyo) {
        //読み込んだ地図ファイルの投影法等座標設定を同じにする
        let f = true;
        let emes = "";
        //コレクションのループ
        Object.keys(attrMapData).forEach(function (key) {
            let retv = spatial.Check_Zahyo_Projection_Convert_Enabled(Zahyo, attrMapData[key].Map.Zahyo);
            if (retv.ok == false) { 
                f = false;
                emes += key + ":" + retv.emes + '\n';
            }
        }, attrMapData);
        if (f == true) {
            Object.keys(attrMapData).forEach(function (key) {
                if (Generic.equal(attrMapData[key].Map.Zahyo, Zahyo) == false) {
                    attrMapData[key].Convert_ZahyoMode(Zahyo);
                }
            }, attrMapData);
        }
        return {
            ok: f, emes: emes
        };
    }
    this.GetPrestigeZahyoMode = function () {
        return attrMapData[Prestage_MapFileName].Map.Zahyo;
    }

    //点オブジェクトグループのオブジェクト名のDictionary（地図ファイル名,オブジェクトグループ名）を取得
    this.GetAllPointObjectGroup = function () {
        let AllPOBJG = [];
        for (let key in attrMapData) {
            let cmap = attrMapData[key];
            let PointObk = [];
            for (let i = 0; i < cmap.Map.OBKNum; i++) {
                if(cmap.ObjectKind[i].Shape == enmShape.PointShape){
                    PointObk.push(cmap.ObjectKind[i].Name);
                }
            }
            if (PointObk.length > 0) {
                AllPOBJG[key] = PointObk;
            }
        }
        return AllPOBJG;
    }

    //地図ファイル名、線種、グループで、線種位置番号を求める
    this.GetLineKindPosition = function(MapFileName, lineKindNum, PatternNum){
        let n = 0;
        for (let key in attrMapData) {
            let cmap = attrMapData[key];
            if (key != MapFileName.toUpperCase()) {
                n += cmap.Get_TotalLineKind_Num();
            } else {
                for (let j = 0; j < lineKindNum; j++) {
                    n += cmap.LineKind[j].NumofObjectGroup;
                }
                n += PatternNum
                return n;
            }
        }
        return -1;
    }
    //優先地図ファイル名取得
    this.GetPrestigeMapFileName = function () {
        return Prestage_MapFileName;
    }
    //最初の地図ファイル名の座標プロパティ取得
    this.GetPrestigeZahyoMode = function () {
        return attrMapData[Prestage_MapFileName].Map.Zahyo;
    }

    /** 読み込んだ地図ファイルの全線種（オブジェクト連動型を含む）一覧を返す*/
    this.GetAllMapLineKind = function () {
        let LKind = [];
        for (let key in attrMapData) {
            let LK = attrMapData[key].Get_TotalLineKind();
            for (let j = 0; j < LK.length; j++) {
                LKind.push(LK[j]);
            }
        }
        return LKind;
    }

    /** 読み込んだ地図ファイルの全線種名（オブジェクト連動型を含む）一覧を返す*/
    this.GetAllMapLineKindName = function () {
        let STR = [];
        for (let key in attrMapData) {
            let LK = attrMapData[key].Get_TotalLineKind();
            for (let j = 0; j < LK.length; j++) {
                STR.push(LK[j].Name);
            }
        }
        return STR;
    }

    //読み込んだ地図ファイルの全線種数（オブジェクト連動型を含む）を返す
    this.GetAllMapLineKindNum = function () {
        let n = 0;
        for (let key in attrMapData) {
            n += attrMapData[key].Get_TotalLineKind_Num();
        }
        return n;
    }

    /**指定した地図ファイルを削除 */
    this.RemoveMapData= function(mapFileName){
        if(mapFileName == "" ){
            mapFileName = this.Prestage_MapFileName
        }
        delete attrMapData[mapFileName];
        delete Object_Name_Search[mapFileName];
        if(mapFileName == Prestage_MapFileName ){
            if(attrMapData.length == 0 ){
                Prestage_MapFileName = ""
            }else{
                Prestage_MapFileName = Object.keys(attrMapData)[0];
            }
        }
    }
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var clsObjectNameSearch = function (MapData, CheckKanjiCompatibleFlag) {
    //オブジェクト名検索用クラス
    this.ObjNameAndTime_Info = function () {
        this.ObjCode;
        this.SETime = new Start_End_Time_data();
    }
    let Object_Name_Search = new clsSortingSearch();
    let Object_Name_Stac_for_Search_O_Code = []; //ObjNameAndTime_Info
   let checkObjectNameKanjiCompatibleFF = CheckKanjiCompatibleFlag; //Boolean
    // let Name_n = 0
    // for (let i = 0; i < MapData.Map.Kend; i++) {
    //     Name_n += MapData.MPObj[i].NumOfNameTime * MapData.ObjectKind[MapData.MPObj[i].Kind].ObjectNameNum;
    // }
    
    for (let i = 0; i < MapData.Map.Kend; i++) {
        for (let j = 0; j < MapData.MPObj[i].NumOfNameTime; j++) {
            let nstc = MapData.MPObj[i].NameTimeSTC[j];
            for (let k = 0; k < nstc.NamesList.length; k++) {
                let nam = nstc.NamesList[k];
                if (nam != "") {
                    if (checkObjectNameKanjiCompatibleFF == true) {
                        let retV=Generic.ObjName_Kanji_Compatible(nam);
                        nam=retV.newObjname;
                    }
                    Object_Name_Search.Add(nam);
                    let dt = new this.ObjNameAndTime_Info();
                    dt.ObjCode = i;
                    dt.SETime = nstc.SETime;
                    Object_Name_Stac_for_Search_O_Code.push(dt);
                }
            }
        }
    }
    Object_Name_Search.AddEnd();

    this.Object_Name_Stac = function (Pos) {
        return Object_Name_Stac_for_Search_O_Code[Pos];
    }
    this.DataPositionValue = function (Pos) {
        return Object_Name_Search.DataPositionValue[Pos];
    }
    this.NumofData = function () {
        return Object_Name_Search.NumofData();
    }
    this.DataPosition = function (num) {
        return Object_Name_Search.DataPosition(Num);
    }

    this.Get_KenToCode = function (ObjName, Time) {
        //オブジェクト名からオブジェクト番号を取得する。見つからなかった場合-1を返す
        if (ObjName == "") {
            return -1;
        }
        if (checkObjectNameKanjiCompatibleFF  == true) {
            let retV=Generic.ObjName_Kanji_Compatible(ObjName);
            ObjName=retV.newObjname;
        }
        let DataList = Object_Name_Search.SearchData_Array(ObjName);
        for (let i in DataList) {
            let j = DataList[i];
            if (clsTime.checkDurationIn(Object_Name_Stac_for_Search_O_Code[j].SETime, Time) == true) {
                return Object_Name_Stac_for_Search_O_Code[j].ObjCode;
            }
        }
        return - 1;
    }
}