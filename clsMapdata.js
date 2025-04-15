/// <reference path="clsGeneric.js" />
/// <reference path="clsTime.js" />
/// <reference path="main.js" />
/// <reference path="SortingSearch.js" />
/// <reference path="clsAttrdata.js" />
/// <reference path="clsDraw.js" />
/// <reference path="SpatialIndexSearch.js" />

var Hennyu_Data = function () {
    this.code; //Integer
    this.Name; //String
    this.Time; //strYMD
    this.Part; //Boolean

}

//オブジェクト継承データ（地図データ）
var Object_Succession_Data = function () {
    this.ObjectCode; //Integer
    this.Time = new strYMD;
}
Object_Succession_Data.prototype.Clone = function () {
    let d=new Object_Succession_Data();
    d.ObjectCode=this.ObjectCode;
    d.Time=this.Time.Clone();
}

//オブジェクト名スタック（地図データ）
var Object_NameTimeStac_Data = function () {
    this.NamesList = []; //String
    this.SETime = new Start_End_Time_data();
}
Object_NameTimeStac_Data.prototype.connectNames = function (delimiter = '/') {
    return this.NamesList.join(delimiter);
}
Object_NameTimeStac_Data.prototype.Clone = function () {
    let o = new Object_NameTimeStac_Data();
    o.SETime = this.SETime.Clone();
    o.NamesList = Generic.ArrayShallowCopy(this.NamesList);
    return o;
}

// オブジェクト代表点（地図データ）
var Object_CenterPoint_Data = function () {
    this.Position = new point();
    this.SETime = new Start_End_Time_data();
}
Object_CenterPoint_Data.prototype.Clone=function(){
    let d=new Object_CenterPoint_Data();
    d.Position=this.Position.Clone();
    d.SETime=this.SETime.Clone();
    return d;
}
var LineCodeStac_Data = function () {
    this.LineCode; //Integer
    this.NumOfTime; //Integer
    this.Times = []; //Start_End_Time_data
}
LineCodeStac_Data.prototype.Clone=function(){
    let d=new LineCodeStac_Data();
    d.LineCode=this.LineCode;
    d.NumOfTime=this.NumOfTime;
    d.Times=Generic.ArrayClone( this.Times);
    return d;
}

const enmObjectGoupType_Data = {
    NormalObject: 0, //通常のオブジェクト
    AggregationObject: 1//集成オブジェクト
}


class strMPObjDefAttData_Info {
    constructor() {
        this.Title;
        this.Unit; //String
        this.MissingF; //Boolean
        this.Note;  //String
    }
    get AttDataType() {
        return Generic.getAttDataType_From_TitleUnit(this.Title, this.Unit);
    }
    set AttDataType(value) {
        let tu = Generic.SetTitleUnit_from_AttDataType(value, this.Title, this.Unit);
        this.Title = tu.title;
        this.Unit = tu.unit;
    }
}
strMPObjDefAttData_Info.prototype.Clone = function () {
    let d = new strMPObjDefAttData_Info();
    Object.assign(d, this);
    return d;
}

//初期時点属性データで、所定時点以外を指定した場合のデータの処理
var enmDefPointAttDataExtraValue = {
    MissingValue: 0,
    NearestValue: 1,
    interpolation_MissingValue: 2,
    interpolation_NearestValue: 3
}

//初期時間属性データの種類
var enmDefTimeAttDataType = {
    PointData: 0,
    SpanData: 1,
    interpolation_MissingValue: 2,
    interpolation_NearestValue: 3
}

//初期時間属性データのデータ項目（オブジェクトグループに指定）
var strMPObjDefTimeAttData_Info = function () {
    this.Type; //enmDefTimeAttDataType
    this.attData = new strMPObjDefAttData_Info();
    this.ExtraValue; // enmDefPointAttDataExtraValue
}
strMPObjDefTimeAttData_Info.prototype.Clone = function () {
    let d = new strMPObjDefTimeAttData_Info();
    Object.assign(d, this);
    d.attData = this.attData.Clone();
    return d;
}

//オブジェクトグループデータ
var strObjectGroup_Data = function () {
    this.ObjectType; //enmObjectGoupType_Data 'ObjectGoupType_Dataの内容
    this.Name; //String
    this.Shape; //enmShape
    this.Mesh; //enmMesh_Number
    this.Color = new colorRGBA();

    this.DefTimeAttDataNum; //Integer
    this.DefTimeAttSTC = []; //strMPObjDefTimeAttData_Info

    this.ObjectNameNum; //Integer
    this.ObjectNameList = []; //String

    this.UseLineType = []; //Boolean 'NormalObjectで使用
    this.UseObjectGroup = []; //Boolean 'AggregationObjectで使用するオブジェクトグループ
}
strObjectGroup_Data.prototype.Clone = function () {
    let d = new strObjectGroup_Data();
    Object.assign(d, this);
    d.DefTimeAttSTC = [];
    for (let i in this.DefTimeAttSTC) {
        d.DefTimeAttSTC[i] = this.DefTimeAttSTC[i].Clone();
    }
    d.ObjectNameList = this.ObjectNameList.slice();
    d.UseLineType = this.UseLineType.slice();
    d.UseObjectGroup = this.UseObjectGroup.slice();
    return d;
}

//初期時間属性データ個別(TypeがPointの場合はSpanの開始だけを使う)
var strDefTimeAttDataEach_Info = function () {
    this.Span = new Start_End_Time_data();
    this.Value; //String
}
strDefTimeAttDataEach_Info.prototype.Clone= function () {
    let d=new strDefTimeAttDataEach_Info();
    d.Span=this.Span.Clone();
    d.Value=this.Value;
    return d;
}
//初期時間属性データ
var strDefTimeAttData_Info = function () {
    this.Data = []; //strDefTimeAttDataEach_Info
}
strDefTimeAttData_Info.prototype.Clone= function () {
    let d=new strDefTimeAttData_Info();
    d.Data=Generic.ArrayClone(this.Data);
    return d;
}

//オブジェクト（地図データ）
var strObj_Data = function () {
    this.Number; //Integer 'オブジェクト番号
    this.Kind; //Integer
    this.Shape; //enmShape
    this.NumOfNameTime; //Integer
    this.NumOfCenterP; //Integer
    this.NumOfSuc; //Integer
    this.NumOfLine; //Integer '集約オブジェクトの場合は、AggrtObj、普通のオブジェクトの場合はLineの数
    this.Circumscribed_Rectangle = new rectangle();
    this.DefTimeAttValue = []; //strDefTimeAttData_Inf
    this.SucSTC = []; //Object_Succession_Data
    this.NameTimeSTC = []; //Object_NameTimeStac_Data
    this.CenterPSTC = []; //Object_CenterPoint_Data
    this.LineCodeSTC = []; //LineCodeStac_Data
}
strObj_Data.prototype.Clone = function () {
    let d=new strObj_Data();
    Object.assign(d, this);
    d.Circumscribed_Rectangle=this.Circumscribed_Rectangle.Clone();
    d.DefTimeAttValue=Generic.ArrayClone(this.DefTimeAttValue);
    d.SucSTC=Generic.ArrayClone(this.SucSTC) ;
    d.NameTimeSTC=Generic.ArrayClone(this.NameTimeSTC);
    d.CenterPSTC=Generic.ArrayClone(this.CenterPSTC);
    d.LineCodeSTC=Generic.ArrayClone(this.LineCodeSTC);
    return d;
}


//方位の文字
var dirWord_Data = function () {
    this.East = ""; //String
    this.West = ""; //String
    this.North = ""; //String
    this.South = ""; //String
}
dirWord_Data.prototype.Clone = function () {
    let w = new dirWord_Data();
    w.East = this.East;
    w.West = this.West;
    w.North = this.North;
    w.South = this.South;
    return w;
}

//方位の設定（地図・属性データ）
var strCompass_Attri = function () {
    this.Visible; //Boolean
    this.Position = new point();
    this.Mark = new Mark_Property();
    this.dirWord = new dirWord_Data();
    this.Font = new Font_Property();
}
strCompass_Attri.prototype.Clone = function () {
    let cp = new strCompass_Attri();
    cp.Visible = this.Visible;
    cp.Position = this.Position.Clone();
    cp.Mark = this.Mark.Clone();
    cp.dirWord = this.dirWord.Clone();
    cp.Font = this.Font.Clone();
    return cp;
}

//ライン線種・時間データ（地図データ）
var Line_Time_Data = function () {
    this.Kind; //Integer
    this.SETime = new Start_End_Time_data();
}
Line_Time_Data.prototype.Clone = function () {
    let d = new Line_Time_Data();
    d.Kind = this.Kind;
    d.SETime = this.SETime.Clone();
    return d;
}
Line_Time_Data.prototype.Equals = function (LT) {
    if(LT.Kind == this.Kind){
        if(LT.SETime.Equals(this.SETime)){
            return true;
        }
    }
    return false;
}

//ラインデータ（地図データ）
var strLine_Data = function () {
    this.Number; //Integer 'ライン番号
    this.NumOfPoint; //Integer
    this.Connect; //enmLineConnect
    this.NumOfLineUse; //Integer
    this.Circumscribed_Rectangle = new rectangle();
    this.NumOfTime; //Integer
    this.Drawn; //Boolean
    this.LineTimeSTC = []; //Line_Time_Data
    this.PointSTC = []; //PointF
}
strLine_Data.prototype.Clone = function () {
    let d = new strLine_Data();
    Object.assign(d, this);
    d.Circumscribed_Rectangle = this.Circumscribed_Rectangle.Clone();
    d.PointSTC = Generic.ArrayClone(this.PointSTC);
    d.LineTimeSTC = Generic.ArrayClone(this.LineTimeSTC);
    return d;
}

//利用可能なライン（属性・地図データ）
var EnableMPLine_Data = function (lcode, Kind) {
    this.LineCode = lcode; //Integer
    this.Kind = Kind; //Integer
}
EnableMPLine_Data.prototype.Clone = function () {
    let d = new EnableMPLine_Data();
    Object.assign(d, this);
    return d;
}

var Zahyo_info = function () {
    this.Mode; //enmZahyo_mode_info '緯度経度か、平面直角か
    this.System; //enmZahyo_System_Info '世界測地系か、日本測地系か
    this.HeimenTyokkaku_KEI_Number; //Short  '1-19の値
    this.Projection; //enmProjection_Info '投影法
    this.CenterXY = new point(); //PointF  '緯度経度の中心
}
Zahyo_info.prototype.Clone = function () {
    let d = new Zahyo_info();
    Object.assign(d, this);
    d.CenterXY = this.CenterXY.Clone();
    return d;
}

var strMap_data = function () {
    this.MPVersion; //Single
    this.FileName; //String
    this.FullPath; //String
    this.OBKNum; //Integer
    this.Kend; //Integer
    this.LpNum; //Integer
    this.ALIN; //Integer
    this.SCL; //Single
    this.SCL_U; //enmScaleUnit
    this.Comment; //String
    this.Time_Mode; //Boolean
    this.Circumscribed_Rectangle = new rectangle(); //地図の外接四角形
    this.Zahyo = new Zahyo_info();
    this.Detail = new Map_Detail_Data();
    this.MapCompass = new strCompass_Attri();
}

var strLKOjectGroup_Info = function () {
    this.GroupNumber; //Integer
    this.UseOnly; //Boolean
    this.Pattern = new Line_Property();
}
strLKOjectGroup_Info.prototype.Clone = function () {
    let d = new strLKOjectGroup_Info();
    Object.assign(d, this);
    d.Pattern = this.Pattern.Clone();
    return d;
}

//線種名とパターン（地図データ）
var LineKind_Data = function () {
    this.Name; //String
    this.NumofObjectGroup; //Integer '1の場合は通常の線種、2以上の場合はオブジェクトグループ連動
    this.ObjGroup = []; //strLKOjectGroup_Info '(0)は通常の線種のパターン
    this.Mesh; //enmMesh_Number
}
LineKind_Data.prototype.Clone = function () {
    let d = new LineKind_Data();
    Object.assign(d, this);
    d.ObjGroup = [];
    d.ObjGroup=Generic.ArrayClone(this.ObjGroup);
    return d;
}

//線種をオブジェクトグループ連動を個別に数えた場合に使用
var LPatSek_Info = function () {
    this.LKind; //Integer
    this.LkindPatNum; //Integer
    this.Name; //String
    this.Pat = new Line_Property();
}

var Map_Detail_Data = function () {
    this.DistanceMeasurable; //Boolean
    this.ScaleVisible; //Boolean

}

//面オブジェクトの境界線の方向
//Boundary_Arrange関数で使用
var Hennyu_Data = function () {
    this.code; //Integer
    this.Direction; //Integer '1 or -1
}



var clsMapdata = function () {
    this.Map = new strMap_data();
    this.ObjectKind = []; //strObjectGroup_Data()
    this.MPObj = []; // strObj_Data
    this.LineKind = []; // new LineKind_Data()
    this.MPLine = []; // strLine_Data
    let _NoDataFlag; // Boolean
    //地図データを初期化
    this.init_MapData = function () {
        this.ObjectKind = [];
        this.MPObj = [];
        this.LineKind = [];
        this.MPLine = [];
        let m = new strMap_data();
        m.FileName = "";
        m.FullPath = "";
        m.MPVersion = 11;
        m.ALIN = 0;
        m.Kend = 0;
        m.OBKNum = 0;
        m.LpNum = 0;
        m.SCL = 0;
        m.SCL_U = enmScaleUnit.kilometer;
        m.Time_Mode = false;
        m.Comment = "";
        m.Zahyo.Mode = enmZahyo_mode_info.Zahyo_No_Mode;
        m.Zahyo.System = enmZahyo_System_Info.Zahyo_System_No;
        m.Detail.DistanceMeasurable = true;
        m.Detail.ScaleVisible = true;
        m.MapCompass.Visible = true;
        this.Map = m;
        _NoDataFlag == true;
    }

    //初期属性データ項目を追加（時間属性設定なし）
    this.Add_one_DefAttDataSet = function (OBKNum, title, Unit, Note) {
        let ok = this.ObjectKind[OBKNum];
        let def = new strMPObjDefTimeAttData_Info();
        def.attData.Title = title;
        def.attData.Unit = Unit;
        def.attData.Note = Note;
        ok.DefTimeAttSTC[ok.DefTimeAttDataNum] = def;
        ok.DefTimeAttDataNum++;
    }

    //方位記号の初期値設定
    this.init_Compass_First = function () {
        let mc = this.Map.MapCompass;
        mc.dirWord.North = "";
        mc.dirWord.East = "";
        mc.dirWord.West = "";
        mc.dirWord.South = "";
        mc.Mark = clsBase.Mark();
        mc.Font = clsBase.Font();
        mc.Mark.ShapeNumber = 11;//clsSettings.Data.Compass_Mark
        mc.Mark.PrintMark = enmMarkPrintType.Mark;
        mc.Mark.Line.Width = 0.3;
        mc.Mark.Tile.Color = clsBase.ColorBlack();
        mc.Mark.WordFont.Size = 8;//clsSettings.Data.Compass_Mark_Size
        mc.Visible = true;
        mc.Position = this.Get_Compass_Position_First_Position();
    }

    this.Get_Compass_Position_First_Position = function () {
        let mc = this.Map.Circumscribed_Rectangle;
        let pxy = new point();
        pxy.x = mc.left + (mc.right - mc.left) / 20;
        pxy.y = mc.top + (mc.bottom - mc.top) / 20;
        return pxy;
    }

    //オブジェクトグループの代表点の色の初期値を決める(同時に全部)
    this.Set_First_ObjectKind_Color = function () {

        for (let i = 0; i < this.Map.OBKNum; i++) {
            this.ObjectKind[i].Color = this.Set_First_ObjectKind_Color_Solo(i);
        }
    }
    //オブジェクトグループの代表点の色の初期値を決める（一つずつ）
    this.Set_First_ObjectKind_Color_Solo = function (ObkCode) {
        let Object_Color = [];
        Object_Color.push(new colorRGBA(0, 255, 0));
        Object_Color.push(new colorRGBA(0, 255, 255));
        Object_Color.push(new colorRGBA(255, 255, 0));
        Object_Color.push(new colorRGBA(255, 0, 255));
        Object_Color.push(new colorRGBA(200, 200, 200));
        let v1 = ObkCode % 6;
        let v2 = parseInt(ObkCode / 6);
        let col = new colorRGBA(Object_Color[v1].r - v2 / 50, Object_Color[v1].g - v2 / 50, Object_Color[v1].b - v2 / 50);
        return col;
    }

    //ラインの初期化
    this.Init_One_Line = function (LineKindNumber) {
        let line = new strLine_Data();
        line.Number = -1;
        line.NumOfPoint = 0;
        line.NumOfTime = 1;
        let lt = new Line_Time_Data();
        lt.Kind = LineKindNumber;
        lt.SETime = clsTime.GetNullStartEndYMD();
        line.LineTimeSTC.push(lt);
        return line;
    }

    //初期化したオブジェクトを返す
    this.Init_One_Object = function (ObjectKindNumber) {
        let Obj = new strObj_Data();
        Obj.Number = -1;
        Obj.NumOfNameTime = 1;
        Obj.NumOfCenterP = 1;
        Obj.NumOfLine = 0;
        Obj.NumOfSuc = 0;
        Obj.Shape = enmShape.PointShape;
        Obj.Kind = ObjectKindNumber;
        let ok = this.ObjectKind[ObjectKindNumber];
        if (ok.DefTimeAttDataNum > 0) {
            Obj.DefTimeAttValu = [];
            for (let i = 0; i < ok.DefTimeAttDataNum; i++) {
                Obj.DefTimeAttValue.push([]);
            }
        }
        let NL = new Object_NameTimeStac_Data();
        NL.NamesList.length = ok.ObjectNameNum;
        NL.NamesList.fill("");
        NL.SETime = clsTime.GetNullStartEndYMD();
        Obj.NameTimeSTC.push(NL);
        let cp = new Object_CenterPoint_Data();
        cp.SETime = clsTime.GetNullStartEndYMD();
        Obj.CenterPSTC.push(cp);
        return Obj;
    }

    this.Save_Object = function (EditingObject, checkObjectmaxMinFlaf) {

        if (EditingObject.Number == -1) {
            //新規オブジェクト
            EditingObject.Number = this.Map.Kend;
            this.Map.Kend++;
        }
        this.MPObj[EditingObject.Number] = EditingObject.Clone();
        if (checkObjectmaxMinFlaf == true) {
            this.Check_Obj_Maxmin(this.MPObj(EditingObject.Number), true);
        }
    }

    //ライン登録
    this.Save_Line = function (EditingLine, checkRelatedLineFlag, checkRelatedObjectShapeFlag, checkLineMaxMinFlag) {
        let SEpoint = [];
        let newf;
        SEpoint.push(EditingLine.PointSTC[0].Clone());
        SEpoint.push(EditingLine.PointSTC[EditingLine.NumOfPoint-1].Clone());
        if (EditingLine.Number == -1) {
            //新規
            EditingLine.Number = this.Map.ALIN;
            this.Map.ALIN++;
            newf = true;
        } else {
            SEpoint.push(this.MPLine[EditingLine.Number].PointSTC[0].Clone());
            SEpoint.push(this.MPLine[EditingLine.Number].PointSTC[this.MPLine[EditingLine.Number].NumOfPoint - 1].Clone());
            newf = false;
        }
        EditingLine.Connect = this.Check_Line_Connect(EditingLine);
        this.MPLine[EditingLine.Number] = EditingLine.Clone();
        if (checkLineMaxMinFlag == true) {
            this.Check_Line_Maxmin(EditingLine.Number, true);
        }

        if ((newf == false) && (checkRelatedObjectShapeFlag == true)) {
            //当該ラインを使用するオブジェクトの形状チェック
            for (let i = 0; i < this.Map.Kend; i++) {
                let ob = this.MPObj[i];
                for (let j = 0; j < ob.NumOfLine; j++) {
                    if (ob.LineCodeSTC[j].LineCode == EditingLine.Number) {
                        ob.Shape = this.Check_Obj_Shape_AllTime(ob);
                        break;
                    }
                }
            }
        }

        if (checkRelatedLineFlag == true) {
            this.Check_Related_Line(SEpoint, EditingLine.Number);
        }
    }

    //指定した起終点の座標のラインを検索し、結節関係をチェックする
    this.Check_Related_Line = function (SEpoint, exCode) {
        let n = SEpoint.length;
        for (let i = 0; i < this.Map.ALIN; i++) {
            let ml = this.MPLine[i];
            if ((i != exCode) && (ml.NumOfPoint > 0)) {
                let f = false;
                for (let j = 0; j < n; j++) {
                    if (SEpoint[j].Equals(ml.PointSTC[0]) == true) {
                        f = true;
                        break;
                    } else if (SEpoint[j].Equals(ml.PointSTC[ml.NumOfPoint - 1]) == true) {
                        f = true
                        break;
                    }
                }
                if (f == true) {
                    let ct = this.Check_Line_Connect(ml, exCode);
                    if (ct != ml.Connect) {
                        ml.Connect = ct;
                    }
                }
            }
        }
    }

    //指定したラインの他ラインとの接続状況を返す
    //exclude_codeで、比較対象からはずすラインを指定できる
    this.Check_Line_Connect = function (Line, exclusion_code = -1) {
        let ck = this.Check_Line_Connect_Detail(Line, exclusion_code);
        switch (ck) {
            case 0:
                return enmLineConnect.no;
                break;
            case 1:
            case 2:
                return enmLineConnect.one;
                break;
            case 3:
                return enmLineConnect.both;
                break;
            case 4:
                return enmLineConnect.loopen;
                break;
        }
    }

    //指定したラインの他ラインとの接続状況の詳細を返す
    this.Check_Line_Connect_Detail = function (Line, exclusion_code = -1) {
        if (Line.NumOfPoint == 0) {
            return 0;
        }

        let XY1 = Line.PointSTC[0];
        let XY2 = Line.PointSTC[Line.NumOfPoint - 1];

        if (XY1.Equals(XY2) == true) {
            return 4;
        }

        let ret_v = 0;
        for (let i = 0; i < this.Map.ALIN; i++) {
            if ((i != exclusion_code) && (i != Line.Number)) {
                let ml = this.MPLine[i];
                let n = ml.NumOfPoint;
                if (n > 0) {
                    let pxy1 = ml.PointSTC[0];
                    let pxy2 = ml.PointSTC[n - 1];
                    if ((pxy1.Equals(XY1) == true) || (pxy2.Equals(XY1) == true)) {
                        ret_v = (ret_v) || (1);
                    }
                    if ((pxy1.Equals(XY2) == true) || (pxy2.Equals(XY2) == true)) {
                        ret_v = (ret_v) || (2);
                    }
                }
            }
        }
        return ret_v;
    }

    //同じオブジェクトグループ名の番号を返す見つからなかった場合-1
    this.Get_ObjectGroupNumber_By_Name = function (Name) {
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (this.ObjectKind[i].Name == Name) {
                return i;
            }
        }
        return -1;
    }

    //Get_TotalLineKindのラインパターンを地図データの線種に設定する
    this.Set_TotalLineKind = function (LPC) { //LPatSek_Info
        let n = 0;
        for (let i = 0; i < this.Map.LpNum; i++) {
            let lk = this.LineKind[i];
            for (let j = 0; j < lk.NumofObjectGroup; j++) {
                lk.ObjGroup[j].Pattern = LPC[n].Pat.Clone();
                n += 1
            }
        }
    }

    //指定したオブジェクトグループのオブジェクトを抽出して配列に取得(時間指定)
    this.Get_Objects_by_Group = function (ObjGroup, Time) {
        let Get_Objects = [];
        for (let i = 0; i < this.Map.Kend; i++) {
            if (this.MPObj[i].Kind == ObjGroup) {
                if (this.CheckEnableObject(this.MPObj[i], Time) == true) {
                    Get_Objects.push(i);
                }
            }
        }
        return Get_Objects;
    }

    //地図データを指定の座標モードに変換 
    this.Convert_ZahyoMode = function (newMapZahyo) {
        let m = this.Map;
        m.MapCompass.Position = spatial.Get_Reverse_and_Convert_XY(m.MapCompass.Position, m.Zahyo, newMapZahyo);

        for (let i = 0; i < m.ALIN; i++) {
            for (let j = 0; j < this.MPLine[i].NumOfPoint; j++) {
                this.MPLine[i].PointSTC[j] = spatial.Get_Reverse_and_Convert_XY(this.MPLine[i].PointSTC[j], m.Zahyo, newMapZahyo);

            }
        }
        for (let i = 0; i < m.Kend; i++) {
            for (let j = 0; j < this.MPObj[i].NumOfCenterP; j++) {
                this.MPObj[i].CenterPSTC[j].Position = spatial.Get_Reverse_and_Convert_XY(this.MPObj[i].CenterPSTC[j].Position, m.Zahyo, newMapZahyo);
            }
        }
        m.Zahyo = newMapZahyo.Clone();
        this.Checl_All_Line_Maxmin();
        this.Check_All_Obj_MaxMin();
        m.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
    }

    //地図ファイルの外接四角形を計算して返す
    this.Get_Mapfile_Rectangle = function () {
        let MapRec;
        let m = this.Map;
        if (this.Map.ALIN > 0) {
            MapRec = new rectangle(this.MPLine[0].PointSTC[0]);
            for (let i = 0; i < m.ALIN; i++) {
                MapRec = spatial.getCircumscribedRectangle(this.MPLine[i].Circumscribed_Rectangle, MapRec);
            }
        } else {
            MapRec = new rectangle(this.MPObj[0].CenterPSTC[0].Position);
        }
        for (let i = 0; i < m.Kend; i++) {
            for (let j = 0; j < this.MPObj[i].NumOfCenterP; j++) {     
                MapRec = spatial.getCircumscribedRectangle(this.MPObj[i].CenterPSTC[j].Position, MapRec);
            }
        }
        return MapRec;
    }

    //全てのオブジェクトの大きさを求める
    this.Check_All_Obj_MaxMin = function () {
        let m = this.Map;
        for (let i = 0; i < m.Kend; i++) {
            this.Check_Obj_Maxmin(this.MPObj[i], false);
        }

    }

    /**線のポイントを指定した距離に応じて削除、座標と数を返すルーチン */
    this.Smoothing_Line = function (_PointXY,s_distanceas){
        let PointXY = Generic.ArrayClone(_PointXY);
        let FirstPointNum = PointXY.length;
        if (FirstPointNum <= 3) {
            return PointXY;
        }

        let LoopF = false;
        if (PointXY[0].Equals(PointXY[FirstPointNum - 1]) == true) {
            LoopF = true;
        } else {
            LoopF = false;
        }

        let Push_point = new Array(FirstPointNum);
        let ts = FirstPointNum;
        let n = 0;
        let Cng_f;
        do {
            Cng_f = false;
            for (let k = 0; k <= 1; k++) {
                FirstPointNum = ts;
                if (k == 1) {
                    Push_point[1] = PointXY[1].Clone();
                }
                n = 1 + k;
                if ((LoopF == true) && (FirstPointNum <= 8)) {
                    break;
                }
                for (let j = 1 + k; j <= FirstPointNum - 3; j += 2) {
                    let D;
                    if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                        D = spatial.Distance_Ido_Kedo_XY_Point(PointXY[j], PointXY[j + 1], this.Map.Zahyo);
                    } else {
                        D = spatial.Distance_Point(PointXY[j], PointXY[j + 1]) / this.Map.SCL;
                    }
                    if (D < s_distanceas) {
                        Push_point[n] = new point((PointXY[j].x + PointXY[j + 1].x) / 2, (PointXY[j].y + PointXY[j + 1].y) / 2);
                        n++;
                        Cng_f = true;
                    } else {
                        Push_point[n] = PointXY[j].Clone();
                        Push_point[n + 1] = PointXY[j + 1].Clone();
                        n += 2;
                    }
                }
                if (((FirstPointNum % 2 == 1) && (k == 0)) || ((FirstPointNum % 2 == 0) && (k == 1))) {
                    Push_point[n] = PointXY[FirstPointNum - 2].Clone();
                    n++;
                }
                Push_point[0] = PointXY[0].Clone();
                Push_point[n] = PointXY[FirstPointNum - 1].Clone();
                n++;
                PointXY = [];
                for (let j = 0; j < n; j++) {
                    PointXY[j] = Push_point[j].Clone();
                }
                ts = n;
            }
        } while (Cng_f == true);
        return PointXY;
    }
    
    //線種を一つ追加する
    this.Add_OneLineKind = function (LineKindName, LPat, LMesh) {
        this.LineKind.push(this.Get_OneLineKind_Parameter(LineKindName, LPat, LMesh));
        this.Map.LpNum++;
        for (let i = 0; i < this.Map.OBKNum; i++) {
            this.ObjectKind[i].UseLineType.push(false);
        }
    }

    this.Get_OneLineKind_Parameter = function (LineKindName, LPat, LMesh) {
        let Lkind = new LineKind_Data();
        Lkind.ObjGroup = [];
        Lkind.ObjGroup.push(new strLKOjectGroup_Info());
        Lkind.Name = LineKindName;
        Lkind.ObjGroup[0].Pattern = LPat.Clone();
        Lkind.Mesh = LMesh;
        Lkind.NumofObjectGroup = 1;
        return Lkind;
    }

    //オブジェクトグループの追加
    this.Add_OneObjectGroup_Parameter = function (Name, Shape, Mesh, type) {
        let Okind = this.Get_OneObjectGroup_Parameter(Name, Shape, this.Map.OBKNum, this.Map.LpNum, Mesh, type);
        this.ObjectKind.push(Okind);
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (this.ObjectKind[i].ObjectType == enmObjectGoupType_Data.AggregationObject) {
                this.ObjectKind[i].UseObjectGroup.push(false);
            }
        }
        this.Map.OBKNum++;
    }

    //新規オブジェクトグループパラメータの取得
    this.Get_OneObjectGroup_Parameter = function (Name, Shape, ObkNum, LpNum, Mesh, type) {
        let Okind = new strObjectGroup_Data();
        Okind.Color = clsBase.ColorWhite();//マップエディタがないので設定不要
        Okind.Mesh = Mesh;
        Okind.Name = Name;
        Okind.Shape = Shape;
        Okind.ObjectType = type;
        Okind.DefTimeAttDataNum = 0;
        Okind.ObjectNameNum = 1;
        Okind.ObjectNameList = ["オブジェクト名1"];
        if (type == enmObjectGoupType_Data.AggregationObject) {
            Okind.UseLineType.length = (Math.max(ObkNum, 0));
        } else {
            Okind.UseLineType.length = (Math.max(LpNum - 1, 0));
        }
        Okind.UseLineType.fill(false);
        return Okind;
    }

    //Y座標を反転
    this.YReverse = function () {

        this.Map.Circumscribed_Rectangle.top = -mo.Circumscribed_Rectangle.top;
        this.Map.Circumscribed_Rectangle.bottom = -mo.Circumscribed_Rectangle.bottom;

        for (let i = 0; i < this.Map.ALIN; i++) {
            let mp = this.MPLine[i];
            for (let j = 0; j < mp.NumOfPoint; j++) {
                mp.PointSTC[j].y = -mp.PointSTC[j].y;
                mp.Circumscribed_Rectangle.top = -mo.Circumscribed_Rectangle.top;
                mp.Circumscribed_Rectangle.bottom = -mo.Circumscribed_Rectangle.bottom;
            }
        }

        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            for (let j = 0; j < mo.NumOfCenterP; j++) {
                mo.CenterPSTC[j].Position.y = -mo.CenterPSTC[j].Position.y;
                mo.Circumscribed_Rectangle.top = -mo.Circumscribed_Rectangle.top;
                mo.Circumscribed_Rectangle.bottom = -mo.Circumscribed_Rectangle.bottom;
            }
        }
    }

    //座標値が緯度経度そのままの地図データを、投影変換後の座標に変換する
    this.MapLatLon_Zahyo_convert = function () {
        let XY_Rect = this.Get_Mapfile_Rectangle();
        this.Map.SCL = 1;
        this.MapSCL_U = enmScaleUnit.kilometer;
        this.Map.Zahyo.CenterXY = XY_Rect.centerP();
        for (let i = 0; i < this.Map.ALIN; i++) {
            let ml = this.MPLine[i];
            for (let j = 0; j < ml.NumOfPoint; j++) {
                ml.PointSTC[j] = spatial.Get_Converted_XY(ml.PointSTC[j], this.Map.Zahyo);
            }
            this.Check_Line_Maxmin(i, false);
        }
        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            let CP;
            switch (mo.Shape) {
                case enmShape.PointShape:
                    CP = mo.CenterPSTC[0].Position;
                    CP = spatial.Get_Converted_XY(CP, this.Map.Zahyo);
                    break;
                case enmShape.PolygonShape:
                    CP = this.GetObjGraviityXY(mo, clsTime.GetNullYMD());
                    break;
                case enmShape.LineShape:
                    let ml = this.MPLine[mo.LineCodeSTC[0].LineCode];
                    CP = ml.PointSTC[parseInt(ml.NumOfPoint / 2)];
                    break;
            }
            mo.CenterPSTC[0].Position = CP;
            this.Check_Obj_Maxmin(mo, false);
        }
        this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
    }

    this.GetObjectGravity_All = function () {
        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            switch (mo.Shape) {
                case enmShape.PolygonShape:
                    let CP;
                    CP = this.GetObjGraviityXY(mo, CP, clsTime.GetNullYMD());
                    mp.CenterPSTC[0].Position = CP.Clone();
            }
            this.Check_Obj_Maxmin(mo, false);
        }
    }
    //オブジェクトの重心を求める。面形状でない場合はundefinedを返す
    this.GetObjGraviityXY = function (ObjData, L_Time) {
        if (ObjData.Shape != enmShape.PolygonShape) {
            //ポリゴンでない場合は求めない
            return undefined;
        }

        let GPoint = new point();
        let retV = this.Menseki(ObjData,  L_Time);
        let xy2=retV.gpoint;
        if (retV.menseki == -1) {
            return false;
        } else if (retV.menseki == 0) {
            GPoint = xy2.Clone();
        } else {
            //重心がオブジェクト内部に収まるかチェック
            let ELine = this.Get_EnableMPLine(ObjData, L_Time);;
            let Fringe_Line = [];
            for (let j = 0; j < ELine.length; j++) {
                Fringe_Line.push(ELine[j].LineCode);
            }
            let retV = this.Check_Point_in_Polygon_LineCode(xy2.x, xy2.y, Fringe_Line);
            if (retV.ok == true) {
                GPoint = xy2.Clone();
            } else {
                //入らない場合
                let Cross_x=retV.CrossPoint_X;
                let crn=Cross_x.length;
                if (crn < 2) {
                    GPoint = this.MPLine[Fringe_Line[0]].PointSTC[0];
                    return false
                }
                let mw = Cross_x[1] - Cross_x[0];
                let mww = 0;
                if (crn % 2 == 1) {
                    crn -= 1;
                }
                if (crn >= 4) {
                    for (let i = 2; i <= crn - 1; i += 2) {
                        let mw2 = Cross_x[i + 1] - Cross_x[i];
                        if (mw2 > mw) {
                            mw = mw2;
                            mww = i;
                        }
                    }
                }
                GPoint.y = xy2.y;
                GPoint.x = (Cross_x[mww + 1] + Cross_x[mww]) / 2;
            }
        }
        return GPoint;
    }

    this.Check_Obj_Maxmin = function (ObjData, MapRectCheckF) {
        let oldObjRect = ObjData.Circumscribed_Rectangle;
        let Obj_rect = new rectangle();
        for (let i = 0; i < ObjData.NumOfCenterP; i++) {
            let p = ObjData.CenterPSTC[i].Position;
            if (i == 0) {
                Obj_rect = new rectangle(p);
            } else {
                Obj_rect = spatial.getCircumscribedRectangle(p, Obj_rect);
            }
        }
        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
            if (ObjData.NumOfLine > 0) {
                for (let i = 0; i < ObjData.NumOfLine; i++) {
                    Obj_rect = spatial.getCircumscribedRectangle(this.MPLine[ObjData.LineCodeSTC[i].LineCode].Circumscribed_Rectangle, Obj_rect);
                }
            }
        } else {
            let AggObs = this.Get_MpObj_used_AggregateObject(ObjData, clsTime.GetNullYMD());
            for (let i = 0; i < AggObs.length; i++) {
                let m = this.MPObj[AggObs[i]];
                if (this.ObjectKind[m.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                    Obj_rect = spatial.getCircumscribedRectangle(m.Circumscribed_Rectangle, Obj_rect);
                }
            }
        }
        ObjData.Circumscribed_Rectangle = Obj_rect;
        if (MapRectCheckF == true) {
            this.Check_MapCircumscribedRectangle(oldObjRect, Obj_rect);
        }
    }
    this.Check_MapCircumscribedRectangle = function (oldRect, newRect) {
        if (spatial.Compare_Two_Rectangle_Position(this.Map.Circumscribed_Rectangle, newRect) != cstRectangle_Cross.cstInclusion) {
            //内部に含まれない場合はUNIONで外接四角形を求める
            this.Map.Circumscribed_Rectangle = spatial.Get_Rectangle_Union(this.Map.Circumscribed_Rectangle, newRect);
        } else {
            //newRectが内部に含まれる場合
            if (spatial.Check_TwoRectangele_Inner_Contact(this.Map.Circumscribed_Rectangle, oldRect) == true) {
                //oldRectが地図データの外周の一部だった場合は再計算
                this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle();
            }
        }
    }

    this.Checl_All_Line_Maxmin = function () {
        let m = this.Map;
        for (let i = 0; i < m.ALIN; i++) {
            this.Check_Line_Maxmin(i, false);
        }
    }

    //指定したラインコードの外接四角形を求める
    this.Check_Line_Maxmin = function (Lcode, MapRectCheckF) {
        let oldRect = this.MPLine[Lcode].Circumscribed_Rectangle;
        this.MPLine[Lcode].Circumscribed_Rectangle = spatial.getCircumscribedRectangle(this.MPLine[Lcode].PointSTC);
        if (MapRectCheckF == true) {
            this.Check_MapCircumscribedRectangle(oldRect, this.MPLine[Lcode].Circumscribed_Rectangle);
        }

    }

    //選択したオブジェクトグループ同士が同じかどうかを調べる
    // <param name="ObjSel">選択したオブジェクトグループにtrue</param>
    // <param name="Emes">エラーメッセージ（戻り値）</param>
    // <param name="check_objType">オブジェクトのタイプをチェックする場合true</param>
    // <param name="check_objNameListNum">オブジェクト名リストの数をチェックする場合true</param>
    this.Check_Selected_ObjectGroup_Same = function (ObjSel, check_objType, check_objNameListNum) {
        let f = true;
        let Emes = "";
        let SeFlOb = -1;
        for (let i = 0; i < this.Map.OBKNum; i++) {
            if (ObjSel[i] == true) {
                if (SeFlOb == -1) {
                    SeFlOb = i;
                } else {
                    if (this.ObjectKind[i].Shape != this.ObjectKind[SeFlOb].Shape) {
                        Emes = "異なる形状のオブジェクトグループが選択されています。";
                        f = false;
                        break;
                    }
                    if (check_objType == true) {
                        if (this.ObjectKind[i].ObjectType != this.ObjectKind[SeFlOb].ObjectType) {
                            Emes = "異なるオブジェクトのタイプのオブジェクトグループが選択されています。";
                            f = false;
                            break;
                        }
                    }
                    if (check_objNameListNum == true) {
                        if (this.ObjectKind[i].ObjectNameNum != this.ObjectKind[SeFlOb].ObjectNameNum) {
                            Emes = "オブジェクト名リスト数が異なるオブジェクトグループが選択されています。";
                            f = false;
                            break;
                        } else {
                            for (let j = 0; j < this.ObjectKind[i].ObjectNameNum; j++) {
                                if (this.ObjectKind[i].ObjectNameList(j) != this.ObjectKind[SeFlOb].ObjectNameList[j]) {
                                    Emes = "オブジェクト名リストの名称が異なるオブジェクトグループが選択されています。";
                                    f = false;
                                    i = this.Map.OBKNum - 1
                                    break;
                                }
                            }
                        }
                    }
                    if (this.ObjectKind[i].DefTimeAttDataNum != this.ObjectKind[SeFlOb].DefTimeAttDataNum) {
                        Emes = "初期属性数が異なるオブジェクトグループが選択されています。";
                        f = false;
                        break;
                    } else {
                        for (let j = 0; j < this.ObjectKind[i].DefTimeAttDataNum; j++) {
                            if ((this.ObjectKind[i].DefTimeAttSTC[j].attData.Title != this.ObjectKind[SeFlOb].DefTimeAttSTC[j].attData.Title) ||
                                (this.ObjectKind[i].DefTimeAttSTC[j].attData.Unit != this.ObjectKind[SeFlOb].DefTimeAttSTC[j].attData.Unit)) {
                                Emes = "初期属性のタイトルまたは単位が異なるオブジェクトグループが選択されています。";
                                f = false;
                                i = this.Map.OBKNum - 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return Emes;
    }

    //指定したオブジェクトの境界線を面領域を描くような順番に並べ替える
    this.Boundary_Arrange = function (ObjData_objNum, Time) {
        let ELine = this.Get_EnableMPLine(ObjData_objNum, Time)
        let boundArrange = this.Boundary_Arrange_Sub(ELine);
        return boundArrange;
    }

    //オブジェクトの使用するラインの境界線を面領域を描くような順番に並べ替える
    this.Boundary_Arrange_Sub = function (ELine) {
        let boundArrange = new boundArrangeData();
        let NL = ELine.length;
        if (NL == 0) {
            boundArrange.Pon = 0;
            return boundArrange;
        }
        let spxy = [];
        let epxy = [];
        for (let i = 0; i < NL; i++) {
            let LineNO = ELine[i].LineCode;
            spxy.push(this.MPLine[LineNO].PointSTC[0]);
            epxy.push(this.MPLine[LineNO].PointSTC[this.MPLine[LineNO].NumOfPoint - 1]);
        }
        boundArrange = spatial.BoundaryArrangeGeneral(NL, spxy, epxy);
        for (let i = 0; i < NL; i++) {
            boundArrange.Fringe[i].code = ELine[boundArrange.Fringe[i].code].LineCode;
        }
        return boundArrange;
    }

    //指定したラインコードがループでない場合は－１、ループの場合は面積を返す
    this.Get_LoopLine_Menseki = function (L_Code) {
        let ml = this.MPLine[L_Code];
        let men;
        let PN = ml.NumOfPoint;
        if (PN == 0) {
            return -1;
        }
        let PE = PN - 1;
        if (ml.PointSTC[PE].Equals(ml.PointSTC[0]) == true) {
            let pxy =Generic.ArrayClone( ml.PointSTC);
            pxy.push(ml.PointSTC[1].Clone());
            men = spatial.Get_Hairetu_Menseki(pxy, this.Map);
        } else {
            men = -1;
        }
        return men;
    }

    //指定したオブジェクトの面積を重心付きで返す
    this.Menseki = function (ObjData,  L_Time) {
        let badata = this.Boundary_Arrange(ObjData, L_Time);
        if (badata.Pon <= 0) {
            return -1;
        } else {
            return this.Menseki_Sub( badata);
        }
    }

    this.Menseki_sub2 = function (badata) {
        let Pon = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;
        let mens = new Array(Pon);
        for (let i = 0; i < Pon; i++) {
            let LXY2 = new Array();
            let n2 = this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            LXY2.push(LXY2[1]);
            mens[i] = spatial.Get_Hairetu_Menseki(LXY2, this.Map);
        }
        let m;
        if (Pon == 1) {
            m = mens[0]
        } else {
            let TotalInOut = new Array();
            let In_Out = this.Object_Polygon_InOut(badata, TotalInOut);
            m = 0;
            for (let i = 0; i < Pon; i++) {
                if ((TotalInOut[i] % 2) == 1) {
                    //何かのポリゴンに奇数回含まれるポリゴンは中抜け
                    mens[i] = -mens[i];
                } else {
                    m += mens[i];
                }
            }
        }
        return m;
    }

    //ポリゴンごとの面積を求めて、中抜け等を判定して全体の面積を返す（重心つき）
    this.Menseki_Sub = function (badata) {
        // if ((GXY instanceof boundArrangeData) == true) {
        //     return this.Menseki_sub2(GXY);
        // }
        let GXY=new point();
        let Pon = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;
        let mens = new Array(Pon);
        let gp = new Array(Pon);
        for (let i = 0; i < Pon; i++) {

            let LXY2 = new Array();
            let n2 = this.Get_Object_Polygon_Coords(i, 0, Arrange_LineCode, Fringe, LXY2, false, 1);
            LXY2.push(LXY2[1]);
            let w = 0;
            if (n2 > 2) {
                //重心の位置を求める
                let wsw = new Array(n2 - 1);
                let a = LXY2[0].x;
                let b = LXY2[0].y;
                for (let j = 0; j < n2 - 1; j++) {
                    wsw[j] = (LXY2[j].x - a) * (LXY2[j + 1].y - b) - (LXY2[j + 1].x - a) * (LXY2[j].y - b);
                    w += wsw[j];
                }
                let xx = 0;
                let yy = 0;
                for (let j = 0; j < n2 - 1; j++) {
                    xx += wsw[j] * (LXY2[j].x + LXY2[j + 1].x)
                    yy += wsw[j] * (LXY2[j].y + LXY2[j + 1].y)
                }
                if (w != 0) {
                    gp[i] =new point( (a + xx / w) / 3, (b + yy / w) / 3);
                }
            }

            if (n2 < 2) {
                gp[i] = LXY2[0];
            } else {
                mens[i] = spatial.Get_Hairetu_Menseki( LXY2, this.Map);
                if (((mens[i] < 0.0000000001) && (gp[i] == undefined) ) || w == 0) {
                    //幅のないポリゴンはポイント座標で重心
                    let xx = 0;
                    let yy = 0;
                    for (let j = 0; j < n2 - 1; j++) {
                        xx += LXY2[j].x;
                        yy += LXY2[j].y;
                    }
                    gp[i] =new point(xx / (n2 - 1), yy / (n2 - 1));
                }
            }
        }
        let m;
        if (Pon == 1) {
            m = mens[0]
            GXY = gp[0];
        } else {
            let TotalInOut = new Array();
            let In_Out = this.Object_Polygon_InOut(badata, TotalInOut);
            m = 0;
            let sm = 0;
            for (let i = 0; i < Pon; i++) {
                if ((TotalInOut[i] % 2) == 1) {
                    //何かのポリゴンに奇数回含まれるポリゴンは中抜け
                    mens[i] = -mens[i];
                } else {
                    if (mens[i] > sm) {
                        //より面積の大きいポリゴンに重心を移す
                        GXY = gp[i];
                        sm = mens[i];
                    }
                }
                m += mens[i];
            }
        }
        return {menseki:m,gpoint:GXY};
    }

    //ある地点がオブジェクトの外接四角形に入るかどうかを調べ、さらに面オブジェクトの中かどうかを調べる
    this.Check_Point_in_OneObject = function (Obj_ObjNumber, x, y, LAY_Time) {
        let obj;
        if ((typeof Obj_ObjNumber) == 'number') {
            obj = this.MPObj[Obj_ObjNumber];
        } else {
            obj = Obj_ObjNumber;
        }

        let Fringe_Line = [];
        let f = this.Check_Point_in_oneObject_Box(obj, x, y);
        if (f == true) {
            let ELine = this.Get_EnableMPLine(obj, LAY_Time);
            for (let j = 0; j < ELine.length; j++) {
                Fringe_Line.push(ELine[j].LineCode);
            }
            return this.Check_Point_in_Polygon_LineCode(x, y, Fringe_Line).ok;
        } else {
            return false
        }
    }

    //ある地点がオブジェクトの外接四角形に入るかどうかを調べる
    this.Check_Point_in_oneObject_Box = function (Obj_ObjNumber, x, y) {
        let obj;
        if ((typeof Obj_ObjNumber) == 'number') {
            obj = this.MPObj[Obj_ObjNumber];
        } else {
            obj = Obj_ObjNumber;
        }
        let f = false;
        if (obj.Shape != enmShape.PointShape) {
            if (spatial.Check_PointInBox(new point(x, y), 0, obj.Circumscribed_Rectangle) == true) {
                f = true;
            }
        }
        return f;
    }

    //一つのオブジェクト内のポリゴンの包含関係を返す
    this.Object_Polygon_InOut = function (badata, TotalInOutNum) {
        let Polygon_Num = badata.Pon;
        let Arrange_LineCode = badata.Arrange_LineCode;
        let Fringe = badata.Fringe;

        let SIndex = new clsSpatialIndexSearch(SpatialPointType.SPIRect, false, undefined, undefined);

        TotalInOutNum.length=Polygon_Num;
        TotalInOutNum.fill(0);
        let InOut = Generic.Array2Dimension(Polygon_Num, Polygon_Num);

        for (let i = 0; i < Polygon_Num; i++) {
            let PRect = this.MPLine[Fringe[Arrange_LineCode[i][0]].code].Circumscribed_Rectangle;
            for (let j = 1; j < Arrange_LineCode[i][1]; j++) {
                let ML = this.MPLine[Fringe[Arrange_LineCode[i][0] + j].code];
                PRect = spatial.getCircumscribedRectangle(ML.Circumscribed_Rectangle, PRect);
            }
            SIndex.AddRect(PRect, i);
        }
        SIndex.AddEnd();
        for (let i = 0; i < Polygon_Num; i++) {
            let ML = this.MPLine[Fringe[Arrange_LineCode[i][0]].code];
            let X = ML.PointSTC[0].x;
            let Y = ML.PointSTC[0].y;
            let retRin = SIndex.GetRectIn(X, Y);
            let n=retRin.number;
            let Onum =retRin.ObStac;
            let Otags=retRin.Tags;

            for (let j = 0; j < n; j++) {
                let LCD = Otags[j];
                if (LCD != i) {
                    let Fringe_Line = [];
                    for (let k = 0; k < Arrange_LineCode[LCD][1]; k++) {
                        Fringe_Line.push(Fringe[Arrange_LineCode[LCD][0] + k].code);
                    }
                    let retV = this.Check_Point_in_Polygon_LineCode(X, Y, Fringe_Line);
                    if (retV.ok == true) {
                        let ML = this.MPLine[Fringe[Arrange_LineCode[i][0]].code];
                        let x2 = ML.PointSTC[1].x;
                        let y2 = ML.PointSTC[1].y;
                        let retV2 = this.Check_Point_in_Polygon_LineCode(x2, y2, Fringe_Line);
                        if (retV2.ok == true) {
                            //iがjの中に含まれる場合は(i,j)を1に
                            InOut[i][LCD] = 1;
                            TotalInOutNum[i]++;
                        }
                    }
                }
            }
        }
        return InOut;
    }

    /** 周辺ラインと指定した地点のX軸上の交点を求め、その地点数を返す。ポリゴン内に指定の地点が含まれる場合ok:true,CrossPoint_Xに交点x座標を返す*/ 
    this.Check_Point_in_Polygon_LineCode = function (x, y, Fringe_Line) {
        let P = new point(x, y);
        let CheckLine = [];

        for (let j = 0; j < Fringe_Line.length; j++) {
            let m = this.MPLine[Fringe_Line[j]];
            //調査地点のY座標を含むラインのみを選択
            if ((m.Circumscribed_Rectangle.top <= y) && (y <= m.Circumscribed_Rectangle.bottom)) {
                CheckLine.push(m.PointSTC);
            }
        }
        return spatial.check_Point_in_Polygon(P, CheckLine);
    }

    //オブジェクト内のポリゴンごとの連続した座標を取得する
    //poxy座標列（戻り値）
    //Equal_XY_Get_F前後の座標が同一の場合にも座標を取得する場合はtrue
    //getStep座標取得間隔（1,2,3,4等）
    this.Get_Object_Polygon_Coords = function (Num, Get_Coords_Data, Arrange_LineCode, Fringe, poxy, Equal_XY_Get_F, getStep) {
        //Get_Coords_Data
        //0:座標値そのもの
        //1:スクリーン上の座標に変換 --今は使わない。呼び出し元で変換する
        //2:世界測地系の緯度経度
        //3:元々の座標系の座標で取得

        let Pnum = this.Get_Object_Polygon_Points(Num, Arrange_LineCode, Fringe);
        poxy.length = 0;
        let n = 0;
        for (let i = 0; i < Arrange_LineCode[Num][1]; i++) {
            let XYS = new Array();
            let Fr = Fringe[Arrange_LineCode[Num][0] + i];
            let PN = this.Get_Coords_by_LineCode(Fr.code, Get_Coords_Data, Fr.Direction, XYS, getStep);
            for (let j = 0; j < PN; j++) {
                if ((n == 0) || (Equal_XY_Get_F == true)) {
                    poxy.push( XYS[j]);
                    n++;
                } else {
                    if (poxy[n - 1].Equals(XYS[j]) == true) {
                    } else {
                        poxy.push(XYS[j]);
                        n++;
                    }
                }
            }
        }
        return n
    }

    // Arrange_LineCodeの指定したポリゴンのポイント数を返す
    this.Get_Object_Polygon_Points = function (Num, Arrange_LineCode, Fringe) {
        let Pnum = 0;
        for (let i = 0; i < Arrange_LineCode[Num][1]; i++) {
            let L = Fringe[Arrange_LineCode[Num][0] + i].code;
            Pnum += this.MPLine[L].NumOfPoint;
        }
        return Pnum;

    }

    //指定したライン番号の世界測地系緯度経度などをを取得する
    this.Get_Coords_by_LineCode = function (LCode, Get_Coords_Data, P_Dir, XYS, getStep) {
        let fs;
        let fe;
        let fst;
        let ML = this.MPLine[LCode];
        if ((getStep + 1 >= ML.NumOfPoint) && (ML.PointSTC[0].Equals(ML.PointSTC[ML.NumOfPoint - 1]) == true)) {
            //ループで2地点となって点になるのをふせぐ
            getStep = 1;
        }
        XYS.length = ML.NumOfPoint;
        if (P_Dir == 1) {
            fs = 0;
            fe = ML.NumOfPoint - 1;
            fst = getStep;
        } else {
            fs = ML.NumOfPoint - 1;
            fe = 0;
            fst = -getStep;
        }

        let n = 0
        let lastp = fs
        for (let i = fs; i != fe+fst; i += fst) {
            let xy;
            switch (Get_Coords_Data) {
                case 0:
                    xy = ML.PointSTC[i];
                    break;
                case 1:
                    break;
                case 2:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[i], this.Map.Zahyo);
                    xy = spatial.Get_World_IdoKedo(xy, this.Map.Zahyo).toPoint;
                    if (xy.x > 180) {
                        xy.x -= 360;
                    }
                case 3:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[i], this.Map.Zahyo);
            }
            lastp = i;
            XYS[n] = xy;
            n++;
        }
        if (lastp != fe) {
            let xy;
            switch (Get_Coords_Data) {
                case 0:
                    xy = ML.PointSTC[fe];
                case 2:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[fe], this.Map.Zahyo);
                    xy = spatial.Get_World_IdoKedo(xy, this.Map.Zahyo).toPoint;
                    if (xy.x > 180) {
                        xy.x -= - 360;
                    }
                case 3:
                    xy = spatial.Get_Reverse_XY(ML.PointSTC[fe], this.Map.Zahyo);
            }
            XYS[n] = xy;
            n++;
        }
        return n
    }

    //指定されたオブジェクトで、指定された時期に使用可能なライン番号を返す
    this.Get_EnableMPLine = function (ObjData_objNum, Time) {
        let ObjData;
        if ((ObjData_objNum instanceof strObj_Data) == false) {
            ObjData = this.MPObj[ObjData_objNum];
        } else {
            ObjData = ObjData_objNum;
        }

        let LCode = [];
        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
            let AggObs = this.Get_MpObj_used_AggregateObject(ObjData, Time);
            for (let i = 0; i < AggObs.length; i++) {
                let lc = AggObs[i];
                if (this.ObjectKind[this.MPObj[lc].Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                    let E_LCode = this.Get_EnableMPLine_Normal(this.MPObj[lc], Time);
                    LCode = LCode.concat(E_LCode);
                }
            }
            if (LCode.length > 0) {
                LCode = Generic.Get_Outer_Mpline_AggregatedObj(LCode, this.ObjectKind[ObjData.Kind].Shape)
            }
        } else {
            LCode = this.Get_EnableMPLine_Normal(ObjData, Time);
        }
        return LCode;
    }

    let Enable_MPObjStac = [];
    //集成オブジェクトを構成する元のオブジェクト番号を取得
    this.Get_MpObj_used_AggregateObject = function (ObjData, Time) {
        Enable_MPObjStac = [];
        this.Get_MpObj_used_AggregateObject_Sub(ObjData, Time)
        return Enable_MPObjStac;
    }
    //集成オブジェクトを構成する元のオブジェクト番号を取得、再帰処理を行う
    this.Get_MpObj_used_AggregateObject_Sub = function (ObjData, Time) {
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let lc = this.Check_Enable_LineCode(ObjData.LineCodeSTC[i], Time)
            if (lc != -1) {
                if (this.CheckEnableObject(this.MPObj[lc], Time) == true) {
                    Enable_MPObjStac.push(lc);
                    if (this.ObjectKind[this.MPObj[lc].Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
                        //集成オブジェクトを参照している場合はさらに再帰処理
                        this.Get_MpObj_used_AggregateObject_Sub(this.MPObj[lc], Time)
                    }
                }
            }
        }
    }

    //ラインコードスタックのラインが指定時期に利用できるかをチェック、利用できる場合はラインコード番号を返し，そうでない場合は－１を返す
    this.Check_Enable_LineCode = function (Lcode_Stac, Time) {
        if ((Lcode_Stac.NumOfTime == 0) || (Time.nullFlag() == true)) {
            return Lcode_Stac.LineCode;
        } else {
            for (let i = 0; i < Lcode_Stac.NumOfTime; i++) {
                if (clsTime.checkDurationIn(Lcode_Stac.Times[i], Time) == true) {
                    return Lcode_Stac.LineCode;
                }
            }
        }
        return -1;
    }
    //ラインが指定時期に利用できるかをチェック,利用できる場合は線種番号そうでない場合は-1を返す
    this.Check_Enable_Line = function (MpLine, Check_Time) {
        let L_K = -1;
        if (Check_Time.nullFlag() == true) {
            L_K = MpLine.LineTimeSTC[0].Kind;
        } else {
            for (let i = 0; i < MpLine.NumOfTime; i++) {
                if (clsTime.checkDurationIn(MpLine.LineTimeSTC[i].SETime, Check_Time) == true) {
                    L_K = MpLine.LineTimeSTC[i].Kind;
                    break;
                }
            }
        }
        return L_K;
    }

    //指定したオブジェクトで、指定した時間に利用できるライン番号を戻し、その要素を返す
    this.Get_EnableMPLine_Normal = function (ObjData, Time) {
        let Enable_LCode = [];
        if (Time.nullFlag() == true) {
            for (let i = 0; i < ObjData.NumOfLine; i++) {
                let ls = ObjData.LineCodeSTC[i];
                let d = new EnableMPLine_Data();
                d.LineCode = ls.LineCode;
                d.Kind = this.MPLine[ls.LineCode].LineTimeSTC[0].Kind;
                Enable_LCode.push(d);
            }
            return Enable_LCode;
        } else {
            if (this.CheckEnableObject(ObjData, Time) == false) {
                return undefined;
            }
        }
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let L_K, f;
            let L_Code = this.Check_Enable_LineCode(ObjData.LineCodeSTC[i], Time);
            if (L_Code != -1) {
                L_K = this.Check_Enable_Line(this.MPLine[L_Code], Time);
                if (L_K != -1) {
                    f = true;
                }
                if (f == true) {
                    if (this.Map.Time_Mode == true) {
                        if (this.ObjectKind[ObjData.Kind].UseLineType[L_K] == true) {
                            let d = new EnableMPLine_Data();
                            d.LineCode = L_Code;
                            d.Kind = L_K;
                            Enable_LCode.push(d);
                        }
                    } else {
                        let d = new EnableMPLine_Data();
                        d.LineCode = L_Code;
                        d.Kind = L_K;
                        Enable_LCode.push(d);
                    }
                }
            }
        }
        return Enable_LCode;
    }



    //指定した時間に指定したオブジェクトが存在する場合trueを返す
    this.CheckEnableObject = function (ObjData, Time) {
        for (let i = 0; i < ObjData.NumOfNameTime; i++) {
            if (clsTime.checkDurationIn(ObjData.NameTimeSTC[i].SETime, Time) == true) {
                return true;
            }
        }
        return false;
    }

    //指定したオブジェクトグループの初期属性をすべて削除
    this.DeleteAllDefAttrData = function (objG) {
        this.ObjectKind[objG].DefTimeAttDataNum = 0;
        this.DefTimeAttSTC = [];
        for (let i = 0; i < this.Map.Kend; i++) {
            if (this.MPObj[i].Kind == objG) {
                this.MPObj[i].DefTimeAttValue = [];
            }
        }
    }

    //線種で、オブジェクトグループ連動型も一つとして数えて情報を返す
    this.Get_TotalLineKind = function () {
        let LPC = [];
        for (let i = 0; i < this.Map.LpNum; i++) {
            let lk = this.LineKind[i];
            for (let j = 0; j < lk.NumofObjectGroup; j++) {
                let LP = new LPatSek_Info();
                LP.Pat = lk.ObjGroup[j].Pattern;
                LP.LKind = i;
                LP.LkindPatNum = j;
                LP.Name = (j == 0) ? lk.Name : "-" + this.ObjectKind[lk.ObjGroup[j].GroupNumber].Name;
                LPC.push(LP);
            }
        }
        return LPC;
    }

    //オブジェクトグループ連動型も一つとして数えて線種の数を返す
    this.Get_TotalLineKind_Num = function () {
        let PatNum = 0;
        for (let i = 0; i < this.Map.LpNum; i++) {
            PatNum += this.LineKind[i].NumofObjectGroup;
        }
        return PatNum;
    }
    //オブジェクトの初期属性データ取得。時期がはずれてデータが取得できない場合はundefined
    this.Get_DefTimeAttrValue = function (ObjCode, defNumber, Time) {
        let ob = this.MPObj[ObjCode];
        let ogp = ob.Kind;
        let Value;
        if (this.Map.Time_Mode == false) {
            return ob.DefTimeAttValue[defNumber].Data[0].Value;
        } else {
            if (Time.nullFlag() == true) {
                return undefined;
            }
            let dev = ob.DefTimeAttValue[defNumber];
            let n = dev.Data.length;

            if (n == 0) {
                return undefined;
            }
            switch (this.ObjectKind[ogp].DefTimeAttSTC[defNumber].Type) {
                case enmDefTimeAttDataType.PointData:
                    //時点データの場合
                    for (let i = 0; i < n; i++) {
                        if (dev.Data[i].Span.StartTime.Equals(Time) == true) {
                            //同じ時点のデータがあった場合
                            return dev.Data[i].Value;
                        }
                    }
                    //なかった場合
                    switch (this.ObjectKind[ogp].DefTimeAttSTC[defNumber].ExtraValue) {
                        case enmDefPointAttDataExtraValue.MissingValue:
                            //欠損値
                            return undefined;
                            break;
                        case enmDefPointAttDataExtraValue.NearestValue:
                            //一番近い値
                            let ff = true;
                            let minDay;
                            for (let i = 0; i < n; i++) {
                                let daten = Math.abs(clsTime.getDifference(dev.Data[i].Span.StartTime, Time));
                                if (ff == true) {
                                    minDay = daten;
                                    Value = dev.Data[i].Value;
                                } else {
                                    if (minDay < daten) {
                                        minDay = daten;
                                        Value = dev.Data[i].Value;
                                    }
                                }
                            }
                            return Value;
                            break;
                        case enmDefPointAttDataExtraValue.interpolation_MissingValue:
                        case enmDefPointAttDataExtraValue.interpolation_NearestValue:
                            //間に挟まれた場合は按分
                            for (let i = 0; i < n - 1; i++) {
                                let span = new Start_End_Time_data();
                                span.StartTime = dev.Data[i].Span.StartTime;
                                span.EndTime = dev.Data[i + 1].Span.StartTime;
                                if (clsTime.checkDurationIn(span, Time) == true) {
                                    let v1 = Number(dev.Data[i].Value.replace(",", ""));
                                    let v2 = Number(dev.Data[i + 1].Value.replace(",", ""));
                                    let vsa = v2 - v1;
                                    let daten1 = Math.abs(clsTime.getDifference(span.StartTime, Time));
                                    let daten2 = Math.abs(clsTime.getDifference(span.StartTime, span.EndTime));
                                    let v3 = v1 + vsa * (daten1 / daten2);
                                    if(isNaN(v3)){console.log(ob,ObjCode, defNumber,dev.Data[i].Value , dev.Data[i+1].Value)}
                                    return String(v3);
                                }
                            }
                            switch (this.ObjectKind[ogp].DefTimeAttSTC[defNumber].ExtraValue) {
                                case enmDefPointAttDataExtraValue.interpolation_MissingValue:
                                    //間に挟まれていない場合は欠損値
                                    return undefined;
                                    break;
                                case enmDefPointAttDataExtraValue.interpolation_NearestValue:
                                    //間に挟まれていない場合は近い値

                                    if (dev.Data[0].Span.StartTime.nullFlag() == true) {
                                        return dev.Data[0].Value;
                                    } else {
                                        let d1 = Math.abs(clsTime.getDifference(dev.Data[0].Span.StartTime, Time));
                                        let d2 = Math.abs(clsTime.getDifference(dev.Data[n - 1].Span.StartTime, Time));
                                        if (d1 < d2) {
                                            return dev.Data[0].Value;
                                        } else {
                                            if (dev.Data[n - 1].Value == null) {
                                                return undefined;
                                            } else {
                                                return dev.Data[n - 1].Value;
                                            }
                                        }
                                    }
                                    break;
                            }
                            break;
                    }
                    break;
                case enmDefTimeAttDataType.SpanData:
                    //期間データの場合
                    for (let i = 0; i < dev.Data.length ; i++) {
                        if (clsTime.checkDurationIn(dev.Data[i].Span, Time) == true) {
                            return dev.Data[i].Value;
                        }
                    }
                    return undefined;
                    break;
            }
            return Value;
        }
    }

    /**オブジェクト番号で指定、'線オブジェクトと面・点オブジェクトの距離は、最も近い線の位置と点・面の代表点、点・面オブジェクト間の距離は代表点間の距離、 */
    this.Distance_Object = function (O_Code1, O_Code2, Time1, Time2) {
        let P1;
        let P2;
        if (this.MPObj[O_Code2].Shape == enmShape.LineShape) {
            [O_Code1, O_Code2] = [O_Code2, O_Code1];
            [Time1, Time2] = [Time2, Time1];
        }

        let d;
        if (this.MPObj[O_Code1].Shape == enmShape.LineShape) {
            //一方が線オブジェクトの場合
            P2 = this.Get_Enable_CenterP(O_Code2, Time2);
            d = this.Get_Distance_Between_ObjectLine_and_Point(O_Code1, Time1, P2);
        } else {
            P1 = this.Get_Enable_CenterP(O_Code1, Time1);
            P2 = this.Get_Enable_CenterP(O_Code2, Time2);
            if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(P1, P2, this.Map.Zahyo);
            } else {
                d = spatial.Distance_Point(P1, P2) / this.Map.SCL;
            }
        }
        return d;
    }

    this.Distance_ObjectCenterP = function (CP, O_Code1,  Time1) {
        let d;
        if (this.MPObj[O_Code1].Shape == enmShape.LineShape) {
            //一方が線オブジェクトの場合
            d = this.Get_Distance_Between_ObjectLine_and_Point(O_Code1, Time1, CP);
        } else {
            let P1 = this.Get_Enable_CenterP(O_Code1, Time1);
            if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                d = spatial.Distance_Ido_Kedo_XY_Point(CP, P1, this.Map.Zahyo);
            } else {
                d = spatial.Distance_Point(CP, P1) / this.Map.SCL;
            }
        }
        return d;
    }

    /**オブジェクトの線とある地点との距離を求める */
    this.Get_Distance_Between_ObjectLine_and_Point= function(Ocode ,  Time ,  P){
        let ELine=this.Get_EnableMPLine(this.MPObj[Ocode], Time);
        return Distance_PointMPLineAllay(P,  ELine)
    }

    this.Distance_PointMPLineAllay = function (P, LCode) {
        let mind;
        let f = false;
        for (let i = 0; i < LCode.length; i++) {
            let lc = LCode[i].LineCode;
            let ml = this.MPLine[lc];
            let ln = ml.NumOfPoint;
            for (let j = 0; j < ln - 1; j++) {
                let nearP;
                let DD = spatial.Distance_PointLine2(P, ml.PointSTC[j], ml.PointSTC[j + 1]);
                if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
                    DD = spatial.Distance_Ido_Kedo_XY(P, DD.nearP, this.Map.Zahyo)
                }
                if (f == false) {
                    mind = DD.distance;
                    f = true;
                } else {
                    if (DD.distance < mind) {
                        mind = DD.distance;
                    }
                }
            }
        }
        if (this.Map.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
            return mind;
        } else {
            return mind / this.Map.SCL;
        }
    }


    /**ライン中の同一座標の連続を削除 */
    this.DeleteSamePoints_inLine=function (Linenum) {

        let ml = this.MPLine[Linenum];
        if (ml.NumOfPoint > 0) {
            let ReMovePoint = [];
            ReMovePoint[0] = ml.PointSTC[0].Clone();
            for (let j = 1; j < ml.NumOfPoint; j++) {
                if (ml.PointSTC[j - 1].Equals(ml.PointSTC[j]) != true) {
                    ReMovePoint.push(ml.PointSTC[j].Clone());
                }
            }
            if (ml.NumOfPoint != ReMovePoint.length) {
                ml.PointSTC = ReMovePoint;
                ml.NumOfPoint = ReMovePoint.length;
            }
        }
    }

/** 指定された線の共通部分を抽出して、位相構造化する。変更があった場合trueを返す */
    this.TopologyStructure_SameLine = function (TopologyLineList) {
        if (TopologyLineList == undefined) {
            //全ライン
            TopologyLineList = [];
            for (let i = 0; i < this.Map.ALIN; i++) {
                TopologyLineList.push(i);;
            }
        }
        let Result = false;
        TopologyLineList.sort(function (a, b) { return a - b; })
        for (let i in TopologyLineList) {
            this.DeleteSamePoints_inLine(TopologyLineList[i]);
        }

        let icount = 0;
        do {
            let i = TopologyLineList[icount];
            let jcount = icount + 1;
            while (jcount < TopologyLineList.length) {
                let j = TopologyLineList[jcount];
                let f;
                do {
                    let ODALIN1 = this.Map.ALIN;
                    f = this.TopologyStructure_Two_SameLine(i, j);
                    if (f == true) {
                        if (ODALIN1 > this.Map.ALIN) {
                            //二つのラインが全く同じで、片方が削除された場合
                            TopologyLineList.splice(jcount, 1);
                            for (let k = 0; k < TopologyLineList.length; k++) {
                                if (TopologyLineList[k] > j) {
                                    TopologyLineList[k]--;
                                }
                            }
                            break;
                        } else if (ODALIN1 < this.Map.ALIN) {
                            //ラインが増えた場合
                            for (let k = ODALIN1; k < this.Map.ALIN; k++) {
                                TopologyLineList.push(k);
                            }
                        } else {
                            f = false;
                        }
                        Result = true;
                    }
                } while (f == true)
                jcount++;
            }
            icount++;
        } while (icount < TopologyLineList.length);
        return Result;
    }

    /**二つの線ラインの共通部分を抽出して、位相構造化する。共通部分があればtrueを返す */
    this.TopologyStructure_Two_SameLine=function(LCode1, LCode2) {

        let mLine1 = this.MPLine[LCode1];
        let mLine2 = this.MPLine[LCode2];
        if (spatial.Compare_Two_Rectangle_Position_Inflated(mLine1.Circumscribed_Rectangle, mLine2.Circumscribed_Rectangle, 0.0001) == cstRectangle_Cross.cstOuter) {
            //ラインが重ならない場合
            return false;
        }
        //時間設定が同じかチェック
        if (mLine1.NumOfTime != mLine2.NumOfTime) {
            return false;
        } else {
            for (let i = 0; i < mLine1.NumOfTime; i++) {
                if (mLine1.LineTimeSTC[i].Equals(mLine2.LineTimeSTC[i]) == false) {
                    //時間設定・線種が異なる場合
                    return false;
                }
            }
        }

        if (this.Check_Points_Of_Two_Lines(LCode1, LCode2) == true) {
            //全く同じラインだった場合
            for (let i = 0; i < this.Map.Kend; i++) {
                let mo = this.MPObj[i];
                if (this.ObjectKind[mo.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                    for (let j = 0; j < mo.NumOfLine; j++) {
                        let mol = mo.LineCodeSTC[j];
                        if (mol.LineCode == LCode2) {
                            mol.LineCode = LCode1;
                        }
                    }
                }
            }
            this.Erase_Line(LCode2, false);
            return true;
        }

        let TwoRect = spatial.Get_Rectangle_Union(mLine1.Circumscribed_Rectangle, mLine2.Circumscribed_Rectangle);
        let PNum1 = mLine1.NumOfPoint;
        let XYstac1 = mLine1.PointSTC;
        let PNum2 = mLine2.NumOfPoint;
        let XYstac2 = mLine2.PointSTC;

        //    最初に座標が一致するポイントを取得
        let PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, false, TwoRect);
        PointIndex.AddSinglePoint_Array(PNum2, XYstac2, -1);
        PointIndex.AddEnd();

        let f = false;
        for (let i = 0; i < PNum1; i++) {
            let retV = PointIndex.GetSamePointNumber(XYstac1[i].x, XYstac1[i].y);
            if (retV.ObjectNumber != -1) {
                f = this.TopologyStructure_Two_SameLine_Check(LCode1, LCode2, PNum1, PNum2, i, retV.ObjectNumber, XYstac1, XYstac2);
                if (f == true) {
                    break;
                }
            }
        }
        return f;
    }

    this.TopologyStructure_Two_SameLine_Check=function (LCode1, LCode2, PNum1, PNum2, S1, s2, XYstac1, XYstac2) {

        let NewPnum1 = { A: 0, B: 0, NewXYstacA: [], NewXYstacB: [] };
        let NewPnum2 = { A: 0, B: 0, NewXYstacA: [], NewXYstacB: [] };
        let JointPnum;
        let NewXYstacJoint = [];
        let jp;

        let Start1, Start2

        //同一方向で、同じ座標が続くか調べる
        let naH2;
        let naH1 = TopologyStructure_Two_SameLine_sub(S1, s2, 1, 1, PNum1, PNum2, XYstac1, XYstac2);
        if (naH1 == 1) {
            //同一方向で続いていない場合、線2を逆方向にたどる
            naH1 = TopologyStructure_Two_SameLine_sub(S1, s2, 1, -1, PNum1, PNum2, XYstac1, XYstac2);
            naH2 = -naH1;
        } else {
            naH2 = naH1;
        }

        let Loop1F = XYstac1[0].Equals(XYstac1[PNum1 - 1]);
        if ((S1 == 0) && (Loop1F == true)) {
            let j;
            let nRev1;
            //線1がループで､始点が一致箇所の場合
            if (naH1 == 1) {
                //始点からはたどれない場合は終点から逆方向へ
                nRev1 = -TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, 1, PNum1, PNum2, XYstac1, XYstac2);
                if (nRev1 == -1) {
                    return false;
                }

                naH2 = -nRev1;
                if (nRev1 == -1) {
                    //同一方向で続いていない場合、線2を逆方向にたどる
                    nRev1 = -TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, -1, PNum1, PNum2, XYstac1, XYstac2);
                    naH2 = nRev1;
                }
                JointPnum = Math.abs(nRev1);
                j = PNum1 - JointPnum;
                if (PNum1 == Math.abs(nRev1)) {
                    //１周分続く場合
                    naH1 = PNum1;
                } else {
                    TopologyStructure_Two_SameLine_Cutsub(PNum1 - 1, nRev1, PNum1, NewPnum1, XYstac1);
                }
                TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
            } else {
                if (PNum1 == naH1) {
                    //１周分続く場合
                    JointPnum = naH1;
                    TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
                } else {
                    //始点からも、終点からもたどれる場合
                    if (naH2 < 0) {
                        jp = 1;
                    } else {
                        jp = -1;
                    }
                    nRev1 = TopologyStructure_Two_SameLine_sub(PNum1 - 1, s2, -1, jp, PNum1, PNum2, XYstac1, XYstac2);
                    Start1 = naH1 - 1;

                    let Len1 = naH1 + nRev1 - 1;
                    TopologyStructure_Two_SameLine_Cutsub(Start1, -Len1, PNum1, NewPnum1, XYstac1);
                    Start2 = s2 + naH2 + 1;
                    let Len2 = Len1;
                    if (naH2 > 0) {
                        Len2 = -Len2;
                    }
                    TopologyStructure_Two_SameLine_Cutsub(Start2, Len2, PNum2, NewPnum2, XYstac2);
                    JointPnum = naH1 + nRev1 - 1;
                    j = PNum1 - nRev1;
                }
            }

            for (let i = 0; i < JointPnum; i++) {
                NewXYstacJoint[i] = XYstac1[j].Clone();
                j++;
                if (j >= PNum1) {
                    j = 1;
                }
            }
        } else {
            if (naH1 == 1) {
                return false;
            }
            JointPnum = naH1;
            let j = S1;
            for (let i = 0; i < JointPnum; i++) {
                NewXYstacJoint[i] = XYstac1[j].Clone();
                j++;
                if (j > PNum1) {
                    j = 1;
                }
            }
            TopologyStructure_Two_SameLine_Cutsub(S1, naH1, PNum1, NewPnum1, XYstac1);
            TopologyStructure_Two_SameLine_Cutsub(s2, naH2, PNum2, NewPnum2, XYstac2);
        }

        //ラインを保存
        let PushLine = new strLine_Data();
        if ((Math.abs(naH1) != PNum1) && (NewPnum1.A != 1)) { //NewPnum1a!=1は、特殊なパターンでラインの点が1つになってしまう場合があるため
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.NumOfPoint = NewPnum1.A;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum1.NewXYstacA);
            this.Save_Line(PushLine, false, false, true);
        }

        if ((Math.abs(naH2) != PNum2) && (NewPnum2.A != 1)) { //NewPnum1.A!=2は、特殊なパターンでラインの点が1つになってしまう場合があるため
            PushLine = this.MPLine[LCode2].Clone();
            PushLine.NumOfPoint = NewPnum2.A;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum2.NewXYstacA);
            this.Save_Line(PushLine, false, false, true);
        }


        if ((JointPnum != PNum1) && (JointPnum != PNum2)) {
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.Number = -1;
            PushLine.NumOfPoint = JointPnum;
            PushLine.PointSTC = Generic.ArrayClone(NewXYstacJoint);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode1, this.Map.ALIN - 1);
            this.Topology_Line_Object_Shori(LCode2, this.Map.ALIN - 1);
        } else {
            if (JointPnum == PNum1) {
                this.Topology_Line_Object_Shori(LCode2, LCode1);
            } else if (JointPnum == PNum2) {
                this.Topology_Line_Object_Shori(LCode1, LCode2);
            }
        }

        if (NewPnum1.B > 0) {
            PushLine = this.MPLine[LCode1].Clone();
            PushLine.NumOfPoint = NewPnum1.B;
            PushLine.Number = -1;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum1.NewXYstacB);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode1, this.Map.ALIN - 1);
        }

        if (NewPnum2.B > 0) {
            PushLine = this.MPLine[LCode2].Clone();
            PushLine.NumOfPoint = NewPnum2.B;
            PushLine.Number = -1;
            PushLine.PointSTC = Generic.ArrayClone(NewPnum2.NewXYstacB);
            this.Save_Line(PushLine, false, false, true);
            this.Topology_Line_Object_Shori(LCode2, this.Map.ALIN - 1);
        }
        return true;
    }

    /**一致する箇所でラインを分断する */
    function TopologyStructure_Two_SameLine_Cutsub(Start_JointPoint, JointNum, OldPNum, NewPnum,
        OldXY) {

        let LoopF = OldXY[0].Equals(OldXY[OldPNum - 1]);
        NewPnum.B = -1;
        if (LoopF == true) {
            //線がループの場合
            let Start;
            NewPnum.A = OldPNum - Math.abs(JointNum) + 1;
            NewPnum.NewXYstacA=[];
            if (OldPNum < JointNum + Start_JointPoint) {
                //共有部分が始点終点を挟む場合１
                Start = JointNum - (OldPNum - Start_JointPoint);
                for (let i = Start; i <= Start_JointPoint; i++) {
                    NewPnum.NewXYstacA[i - Start] = OldXY[i].Clone();
                }
            } else if (JointNum + Start_JointPoint < 0) {
                //共有部分が始点終点を挟む場合２
                for (let i = Start_JointPoint; i <= OldPNum + (JointNum + Start_JointPoint); i++) {
                    NewPnum.NewXYstacA[i - Start_JointPoint] = OldXY[i].Clone();
                }
            } else if ((Start_JointPoint < 0) && (JointNum + Start_JointPoint > 0)) {
                //共有部分が始点終点を挟む場合3
                let j = 0;
                for (let i = JointNum + Start_JointPoint - 1; i <= OldPNum - 1 + Start_JointPoint; i++) {
                    NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                    j++;
                }
            } else {
                //共有部分が始点終点を挟まない場合
                if (JointNum > 0) {
                    //順方向
                    let j = 0
                    for (let i = Start_JointPoint + JointNum - 1; i < OldPNum - 1; i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                    for (let i = 0; i <= Start_JointPoint; i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                } else {
                    //逆方向
                    let j = 0;
                    for (let i = Start_JointPoint; i < OldPNum - 1; i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                    for (let i = 0; i <= (Start_JointPoint + JointNum + 1); i++) {
                        NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                        j++;
                    }
                }
            }
        } else {
            //線がループでない場合
            let End2;
            let Start2;
            if (JointNum < 0) {
                Start2 = Start_JointPoint + JointNum + 1;
                End2 = Start_JointPoint;
            } else {
                Start2 = Start_JointPoint;
                End2 = Start_JointPoint + JointNum - 1;
            }
            if ((Start2 == 0) || (End2 == OldPNum - 1)) {
                if (OldPNum == JointNum) {
                    //全体が共有されている場合
                    NewPnum.A = OldPNum;
                    NewPnum.NewXYstacA = Generic.ArrayClone(OldXY);
                } else {
                    //始点又は終点まで共有されている場合
                    NewPnum.A = OldPNum - Math.abs(JointNum) + 1;
                    let j = 0;
                    if (Start2 != 0) {
                        for (let i = 0; i <= Start2; i++) {
                            NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                            j++;
                        }
                    }
                    if (End2 != OldPNum - 1) {
                        for (let i = End2; i < OldPNum; i++) {
                            NewPnum.NewXYstacA[j] = OldXY[i].Clone();
                            j++;
                        }
                    }
                }
            } else {
                //始点終点が共有されていない場合は線を１本増やす
                NewPnum.A = Start2 + 1;
                NewPnum.NewXYstacA=[];
                for (let i = 0; i <= Start2; i++) {
                    NewPnum.NewXYstacA[i] = OldXY[i].Clone();
                }

                NewPnum.B = OldPNum - End2;
                NewPnum.NewXYstacB=[];
                for (let i = End2; i < OldPNum; i++) {
                    NewPnum.NewXYstacB[i - End2] = OldXY[i].Clone();
                }
            }
        }

    }

    /**一致するポイントを追跡する */
    function TopologyStructure_Two_SameLine_sub(S1, s2, ip, jp, PNum1, PNum2, XYstac1, XYstac2) {

        let i = S1;
        let j = s2;
        let Loop1F = XYstac1[0].Equals(XYstac1[PNum1 - 1]);
        let Loop2F = XYstac2[0].Equals(XYstac2[PNum2 - 1]);
        let n = 0;
        while (XYstac1[i].Equals(XYstac2[j]) == true) {
            i += ip;
            j += jp;
            n++;
            if (i >= PNum1) {
                if (Loop1F == true) {
                    i = 1;
                } else {
                    break;
                }
            }
            if (j >= PNum2) {
                if (Loop2F == true) {
                    j = 1;
                    jp = 1;
                } else {
                    break;
                }
            }
            if (i < 0) {
                if (Loop1F == true) {
                    i = PNum1 - 2;
                } else {
                    break;
                }
            }
            if (j < 0) {
                if (Loop2F == true) {
                    j = PNum2 - 2;
                } else {
                    break;
                }
            }
        }
        return n;
    }

    /**ラインがループの場合trueを返す */
    this. Check_Line_Loop=function(LCode){
        let ml = this.MPLine[LCode];
        return ml.PointSTC[0].Equals(ml.PointSTC[ml.NumOfPoint - 1]);
    }

    this.Check_Points_Of_Two_Lines=function (LC1, LC2) {
        let mLine1 = this.MPLine[LC1];
        let mLine2 = this.MPLine[LC2];
        let PNum1 = mLine1.NumOfPoint;
        let PNum2 = mLine2.NumOfPoint;
        let f2 = false;
        if (PNum1 == PNum2) {
            let f = mLine1.Circumscribed_Rectangle.Equals(mLine2.Circumscribed_Rectangle);
            if (f == true) {
                if ((this.Check_Line_Loop(LC1) == true) && (this.Check_Line_Loop(LC2) == true)) {
                    //ループの場合
                    //最初に座標が一致するポイントを取得
                    let s2 = -1
                    for (let i = 0; i < PNum2; i++) {
                        if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[i]) == true) {
                            s2 = i;
                            i = PNum2;
                        }
                    }
                    if (s2 == -1) {
                        f2 = false;
                    } else {
                        let s2p;
                        if (s2 == 0) {
                            if (mLine1.PointSTC[1].Equals(mLine2.PointSTC[1]) == true) {
                                s2p = 1;
                            } else {
                                s2p = -1;
                            }
                        } else {
                            if (mLine1.PointSTC[1].Equals(mLine2.PointSTC[s2 - 1]) == true) {
                                s2p = -1;
                            } else {
                                s2p = 1;
                            }
                        }
                        f2 = true;
                        let i = 0;
                        let j = s2;
                        while ((f2 == true) && (i < PNum1)) {
                            f2 = mLine1.PointSTC[i].Equals(mLine2.PointSTC[j]);
                            i++;
                            j = j + s2p;
                            if (j < 0) {
                                j = PNum2 - 2;
                            } else if (j >= PNum2) {
                                j = 1;
                            }
                        }
                    }
                } else {
                    //ループでない場合
                    if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[0]) == true) {
                        f2 = true
                        for (let i = 1; i < PNum1; i++) {
                            if (mLine1.PointSTC[i].Equals(mLine2.PointSTC[i]) == false) {
                                f2 = false;
                                break;
                            }
                        }
                    } else if (mLine1.PointSTC[0].Equals(mLine2.PointSTC[PNum1 - 1])) {
                        f2 = true;
                        for (let i = 1; i < PNum1; i++) {
                            if (mLine1.PointSTC[i].Equals(mLine2.PointSTC[PNum1 - 1 - i]) == false) {
                                f2 = false;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return f2;
    }


    /**
     * ラインの削除 Chack_Object_Shape_F:削除するラインを使用するオブジェクトの形状をチェックする場合true
     */
    this.Erase_Line = function (EraseLineCode, Chack_Object_Shape_F) {
        let LCode = [EraseLineCode];
        let SEpoint = [];
        let ml = this.MPLine[EraseLineCode];
        SEpoint[0] = ml.PointSTC[0].Clone();
        SEpoint[1] = ml.PointSTC[ml.NumOfPoint - 1].Clone();
        this.Erase_MultiLine(1, LCode, true, Chack_Object_Shape_F, true);
        this.Check_Related_Line(2, SEpoint, -1);
    }

    /**複数のラインを削除 */
    // <param name="LNum">削除するライン数</param>
    // <param name="LCode">ライン番号配列</param>
    // <param name="UsedLine_Delete_F">ラインがオブジェクトに使用されていても削除する場合、true</param>
    // <param name="Check_ObjectShape_F">ラインを使用するオブジェクトの形状を削除後にチェックする場合true</param>
    // <param name="MapRectCheckF">地図データ全体の外接四角形をチェックするか</param>
    // <returns>実際に削除したライン番号の配列</returns>
    this.Erase_MultiLine = function (LNum, LCode, UsedLine_Delete_F, Check_ObjectShape_F, MapRectCheckF) {

        let C_Mpline = [];
        let RealDeleteLineCode = [];
        for (let i = 0; i < LNum; i++) {
            C_Mpline[LCode[i]] = -1;
        }

        if (UsedLine_Delete_F == false) {
            for (let i = 0; i < this.Map.ALIN; i++) {
                if (C_Mpline[i] == -1) {
                    if (this.MPLine[i].NumOfLineUse > 0) {
                        C_Mpline[i] = 0;
                    }
                }
            }
        }

        let n = 0
        for (let i = 0; i < this.Map.ALIN; i++) {
            if (C_Mpline[i] == -1) {
                RealDeleteLineCode[n] = i;
                n++;
            } else {
                C_Mpline[i] = i - n;
                this.MPLine[i - n] = this.MPLine[i].Clone();
                this.MPLine[i - n].Number = i - n;
            }
        }
        if (n > 0) {
            this.Map.ALIN -= n;
            this.MPLine.length = this.Map.ALIN;
        }

        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            if (this.ObjectKind[mo.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                n = 0;
                for (let j = 0; j < mo.NumOfLine; j++) {
                    if (C_Mpline[mo.LineCodeSTC[j].LineCode] == -1) {
                        n++;
                    } else {
                        mo.LineCodeSTC[j].LineCode = C_Mpline[mo.LineCodeSTC[j].LineCode];
                        mo.LineCodeSTC[j - n] = mo.LineCodeSTC[j].Clone();
                    }
                }
                if (n > 0) {
                    mo.NumOfLine -= n;
                    if (mo.NumOfLine == 0) {
                        mo.LineCodeSTC = [];
                    } else {
                        mo.LineCodeSTC.length = mo.NumOfLine;
                    }
                    if ((UsedLine_Delete_F == true) && (Check_ObjectShape_F == true)) {
                        mo.Shape = this.Check_Obj_Shape_AllTime(this.MPObj[i]);
                    }
                }
            }
        }
        this.Check_ALl_Line_Connect()
        if (MapRectCheckF == true) {
            this.Map.Circumscribed_Rectangle = this.Get_Mapfile_Rectangle()
        }
        return RealDeleteLineCode;
    }
    //*************************************************************************************** */
    // <summary>
    // 
    // </summary>
    // <param name="ObjData">オブジェクト</param>
    // <param name="CutPoint">切れ目の地図座標を返す。必要ない場合は省略化</param>
    // <returns></returns>
    // <remarks></remarks>
    /**全期間を通したオブジェクトの形状をチェック */
    this.Check_Obj_Shape_AllTime=function(ObjData, CutPoint = undefined) {
        //オブジェクト名の有効期間の開始と終了時期での形状チェック

        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
            return Check_Obj_Shape(ObjData, clsTime.GetNullYMD);
        }

        let OT = []; // As Start_End_Time_data

        let SHP = [];
        let SHN = 0;

        let obtn = ObjData.NumOfNameTime;
        for (let i = 0; i < obtn; i++) {
            OT[i] = ObjData.NameTimeSTC[i].SETime.Clone();
        }

        for (let i = 0; i < obtn; i++) {
            if (OT[i].StartTithis.nullFlag == false) {
                SHP[SHN] = this.Check_Obj_Shape(ObjData, OT[i].StartTime, CutPoint);
                SHN++;
            }
            if (OT[i].EndTithis.nullFlag == false) {
                SHP[SHN] = this.Check_Obj_Shape(ObjData, OT[i].EndTime, CutPoint);
                SHN++;
            }
        }

        let TimeSort = new clsSortingSearch();
        for (let i = 0; i < ObjData.NumOfLine; i++) {
            let ols = ObjData.LineCodeSTC[i];
            for (let j = 0; j < ols.NumOfTime; j++) {
                TimeSort.Add(clsTime.YMDtoValue(ols.Times[j].StartTime));
                TimeSort.Add(clsTime.YMDtoValue(ols.Times[j].EndTime));
            }
            let olsl = this.MPLine[ols.LineCode];
            for (let j = 0; j < olsl.NumOfTime; j++) {
                let olsls = olsl.LineTimeSTC[j];
                TimeSort.Add(clsTime.YMDtoValue(olsls.SETime.StartTime));
                TimeSort.Add(clsTime.YMDtoValue(olsls.SETime.EndTime));
            }
        }
        TimeSort.AddEnd()

        let n = TimeSort.NumofData;
        let GT = [];
        let n2 = 0
        for (let i = 0; i < n; i++) {
            let v = TimeSort.DataPositionValue_Integer[i];
            let T = clsTime.GetYMDfromValue(v);
            if (T.nullFlag == false) {
                if (n2 == 0) {
                    if (OT[0].StartTithis.nullFlag == true) {
                        GT[0] = clsTime.getYesterday(T);
                        n2 = 1;
                    }
                    GT[n2] = T;
                    n2++;
                } else {
                    if (GT[n2 - 1].Equals(T) == false) {
                        GT[n2] = T;
                        n2++;
                    }
                }
            }
        }
        if (OT[obtn - 1].EndTithis.nullFlag == true) {
            if (n2 != 0) {
                GT[n2] = clsTime.getTomorrow(GT[n2 - 1]);
                n2++;
            }
        }

        for (let i = 0; i < n2; i++) {
            if (GT[i].nullFlag == false) {
                for (let j = 0; j < obtn; j++) {
                    if (clsTime.checkDurationIn(OT[j], GT[i]) == true) {
                        SHP[shn] = this.Check_Obj_Shape(ObjData, GT[i], CutPoint);
                        SHN++;
                    }
                }
            }
        }

        if (SHN == 0) {
            SHP[0] = this.Check_Obj_Shape(ObjData, clsTime.GetNullYMD, CutPoint);
            SHN = 1;
        }

        let SHF = new Array(SHN);
        SHF.fill(0);
        for (let i = 0; i < SHN; i++) {
            SHF[SHP[i]]++;
        }

        let sp;
        //チェックした期間内に、複数の形状が含まれている場合は、優先的に点＞線＞面が返される
        if (SHF(enmShape.PolygonShape) != 0) { sp = enmShape.PolygonShape }
        if (SHF(enmShape.LineShape) != 0) { sp = enmShape.LineShape }
        if (SHF(enmShape.PointShape) != 0) { sp = enmShape.PointShape }
        return sp;
    }


    // <summary>
    // オブジェクトの形状を返す。CutX,yで切れ目の座標を返す
    // </summary>
    // <param name="ObjData">オブジェクト</param>
    // <param name="L_Time">時期</param>
    // <param name="CutPoint">切れ目の地図座標</param>
    // <returns></returns>
    // <remarks></remarks>
    this.Check_Obj_Shape_Cut = function (ObjData, L_Time, CutPoint) {
        if (this.ObjectKind[ObjData.Kind].ObjectType == enmObjectGoupType_Data.AggregationObject) {
            //集成オブジェクトタイプの場合
            let OBShape = new Array(3);
            OBShape.fill(0);
            for (let i = 0; i < ObjData.NumOfLine; i++) {
                OBShape[this.MPObj(ObjData.LineCodeSTC[i].LineCode).Shape]++;
            }

            if ((OBShape[enmShape.LineShape] == 0) && (OBShape[enmShape.PolygonShape] == 0)) {
                return enmShape.PointShape;
            } else if ((this.ObjectKind[ObjData.Kind].Shape == enmShape.LineShape) || (OBShape[enmShape.LineShape] > 0)) {
                return enmShape.LineShape;
            } else {
                return enmShape.PolygonShape;
            }
        } else {
            //通常のオブジェクトタイプの場合
            let polyn = this.Check_PolyShape_PolygonNum(ObjData, L_Time, CutPoint);
            switch (polyn) {
                case -1:
                    return enmShape.PointShape;
                case 0:
                    return enmShape.LineShape;
                default:
                    return enmShape.PolygonShape;
            }
        }
    }

    // <summary>
    // オブジェクトを構成するポリゴン数を数えて返す
    // </summary>
    // <param name="ObjData">オブジェクト</param>
    // <param name="L_Time"></param>
    // <param name="CutPoint">切れ目の地図座標（戻り値）</param>
    // <returns></returns>
    // <remarks></remarks>
    this. Check_PolyShape_PolygonNum=function( ObjData ,  L_Time ,  CutPoint  = undefined) {

        let ELine  = this.Get_EnableMPLine( ObjData, L_Time);
        let NL=ELine.length;
        if(NL == 0 ){
            return -1;
        }

        if(this.ObjectKind[ObjData.Kind].Shape == enmShape.LineShape ){
            return 0;
        }

        let Fringe=[];
        for(let i  = 0;i<NL;i++){
            Fringe[i] = ELine[i].LineCode;
        }

        //ループラインをチェック
        let polyn  = 0;
        let stxy , exy 
        let k  = 0;

        for(let i  = 0;i<NL;i++){
            let ml= this.MPLine[Fringe[i]];
                stxy = ml.PointSTC[0];
                exy = ml.PointSTC[ml.NumOfPoint - 1];
            
            if(exy.Equals(stxy) == true ){
                NL --;
                polyn ++;
            }else{
                Fringe[k] = Fringe[i];
                k ++;
            }
        }
        if(k == 0 ){
            return polyn;
        }

        let Contf  = false;
        for(let i  = 0;i<NL;i++){
            if(Contf == false ){
                let ml= this.MPLine[Fringe[i]];
                    stxy = ml.PointSTC[0].Clone();
                    exy = ml.PointSTC[ml.NumOfPoint - 1].Clone();
                
            }
            Contf = false
            for (let j = i + 1; j < NL; j++) {
                let ml = this.MPLine[Fringe[j]];
                if (ml.PointSTC[0].Equals(exy) == true) {
                    exy = ml.PointSTC[ml.NumOfPoint - 1].Clone();
                    Contf = true;
                    [Fringe[j], Fringe[i + 1]] = [Fringe[i + 1], Fringe[j]];
                    break;
                } else if (ml.PointSTC[ml.NumOfPoint - 1].Equals(exy) == true) {
                    exy = ml.PointSTC[0].Clone();
                    Contf = true;
                    [Fringe[j], Fringe[i + 1]] = [Fringe[i + 1], Fringe[j]];
                    break;
                }
            }
            if(Contf == false ){
                if(exy.Equals(stxy) ){
                    polyn ++;
                }else{
                    polyn = 0;
                    CutPoint = exy;
                    break;
                }
            }
        }
        return polyn;
    }

    this.Check_ALl_Line_Connect = function () {
        let PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, false);
        for (let i = 0; i < Map.ALIN; i++) {
            let ml = this.MPLine[i];
            if (ml.NumOfPoint > 0) {
                PointIndex.AddDoublePoint(ml.PointSTC[0], ml.PointSTC[ml.NumOfPoint - 1], i);
            }
        }
        PointIndex.AddEnd();
        for (let i = 0; i < Map.ALIN; i++) {
            let ml = this.MPLine[i];
            if (ml.NumOfPoint > 0) {
                if (ml.PointSTC[0].Equals(ml.PointSTC[ml.NumOfPoint - 1]) == true) {
                    ml.Connect = 3;
                } else {
                    ml.Connect = 0;
                    for (let j = 0; j < 1; j++) {
                        let SamePointData = {};
                        let n = PointIndex.GetSamePointNumberArray(ml.PointSTC[j * (ml.NumOfPoint - 1)].x, ml.PointSTC[j * (ml.NumOfPoint - 1)].y, SamePointData)
                        for (let k = 0; k < n; k++) {
                            if (SamePointData.ObjectNumber[k] != i) {
                                ml.Connect++;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    //指定した時間のオブジェクトの代表点を取得、取得できない場合はundefinedを返す
    this.Get_Enable_CenterP = function (ObjInfo, Time) {
        let ObjData;
        if (typeof ObjInfo == 'number') {
            ObjData = this.MPObj[ObjInfo];
        } else {
            ObjData = ObjInfo;
        }

        if (this.CheckEnableObject(ObjData, Time) == false) {
            return undefined;
        }
        for (let i = 0; i < ObjData.NumOfCenterP; i++) {
            if (clsTime.checkDurationIn(ObjData.CenterPSTC[i].SETime, Time) == true) {
                return ObjData.CenterPSTC[i].Position.Clone();
            }
        }
        return undefined;
    }

    /**位相構造化したラインを使用するオブジェクトの修正 */
    this.Topology_Line_Object_Shori = function (Search_LineCode, Add_LineCode) {
        let Add_LineCode_Stac = [];
        Add_LineCode_Stac[0] = Add_LineCode;
        this.Object_LineCode_Add(Search_LineCode, 1, Add_LineCode_Stac);
    }

    /**切断したラインを使用するオブジェクトの修正 */
    this.Cut_Line_Object_Shori = function(Search_LineCode, ODALIN, num){
        let Add_LineCode = [];
        for (let i = 0; i < num; i++) {
            Add_LineCode[i] = ODALIN + i;
        }
        this.Object_LineCode_Add(Search_LineCode, num, Add_LineCode);
    }
    /**切断したラインを使用するオブジェクトの修正 */
    this.Object_LineCode_Add=function(Search_LineCode, AddLineNum, Add_LineCode){
        for (let i = 0; i < this.Map.Kend; i++) {
            let mo = this.MPObj[i];
            if (this.ObjectKind[mo.Kind].ObjectType == enmObjectGoupType_Data.NormalObject) {
                let n = mo.NumOfLine;
                for (let j = 0; j < n; j++) {
                    if (mo.LineCodeSTC[j].LineCode == Search_LineCode) {
                        this.Move_LineCodeStac(i, n + AddLineNum, n);
                        for (let k = 0; k < AddLineNum; k++) {
                            mo.LineCodeSTC[k + n] = mo.LineCodeSTC[j].Clone();
                            mo.LineCodeSTC[k + n].LineCode = Add_LineCode[k];
                        }
                        break;
                    }
                }
            }
        }
    }

    /**オブジェクト番号のラインコードスタック数を変更する */
    this.Move_LineCodeStac = function (ObjNum, New_NumOfLine, Old_NumOfLine) {
        let mo = this.MPObj[ObjNum];
        let dif = New_NumOfLine - Old_NumOfLine;
        mo.NumOfLine = mo.NumOfLine + dif;

        if (dif != 0) {
            if (dif > 0) {
                for (let i = Old_NumOfLine; i < mo.NumOfLine; i++) {
                    mo.LineCodeSTC[i] = new LineCodeStac_Data();
                    mo.LineCodeSTC[i].NumOfTime = 0;
                }
            } else {
                if (mo.NumOfLine == 0) {
                    mo.LineCodeSTC.length = [];
                } else {
                    mo.LineCodeSTC.length = mo.NumOfLine;
                }
            }
        }
    }
};






//オブジェクトから、指定した時間のオブジェクト名リストを取得、取得できない場合はundefinedを返す
//ObjData:strObj_Dataまたはオブジェクト番号
clsMapdata.prototype.Get_Enable_ObjectName = function (ObjInfo, Time, NoDataLastGetF) {
    let ObjData;
    if (typeof ObjInfo == 'number') {
        ObjData = this.MPObj[ObjInfo];
    } else {
        ObjData = ObjInfo;
    }
    let n;
    if (Time.nullFlag() == true) {
        n = ObjData.NumOfNameTime - 1;
    } else {
        n = -1;
        for (let i = 0; i < ObjData.NumOfNameTime; i++) {
            if (clsTime.checkDurationIn(ObjData.NameTimeSTC[i].SETime, Time) == true) {
                n = i;
                break;
            }
        }
        if ((n == -1) && (NoDataLastGetF == true)) {
            n = ObjData.NumOfNameTime - 1;
        }
    }
    if (n == -1) {
        return undefined;
    } else {
        return Generic.ArrayShallowCopy(ObjData.NameTimeSTC[n].NamesList);
    }
}

/** JSON地図ファイル(mdrmjFlag:trueはmdrmjファイル内の地図データ)読み込み */
clsMapdata.prototype.openJsonMapData = function (JsonData,mdrmjFlag=false) {
    this.init_MapData();
    let m = new strMap_data();
    m.FileName = JsonData.Map.FileName;
    m.FullPath = JsonData.Map.FullPath;
    m.MPVersion = JsonData.Map.MPVersion;
    m.ALIN = JsonData.Map.ALIN;
    m.Kend = JsonData.Map.Kend;
    m.OBKNum = JsonData.Map.OBKNum;
    m.LpNum = JsonData.Map.LpNum;
    m.SCL = JsonData.Map.SCL;
    m.SCL_U = JsonData.Map.SCL_U;
    m.Time_Mode = JsonData.Map.Time_Mode;
    m.Comment = JsonData.Map.Comment;
    m.Zahyo.Mode = JsonData.Map.Zahyo.Mode;
    m.Zahyo.System = JsonData.Map.Zahyo.System;
    m.Zahyo.HeimenTyokkaku_KEI_Number = JsonData.Map.Zahyo.HeimenTyokkaku_KEI_Number;
    m.Zahyo.Projection = JsonData.Map.Zahyo.Projection;
    m.Zahyo.CenterXY =cnvJsonPoint(JsonData.Map.Zahyo.CenterXY);
    m.Detail.DistanceMeasurable = JsonData.Map.Detail.DistanceMeasurable;
    m.Detail.ScaleVisible = JsonData.Map.Detail.ScaleVisible;
    m.MapCompass.Visible = JsonData.Map.MapCompass.Visible;
    m.MapCompass.Position = cnvJsonPoint(JsonData.Map.MapCompass.Position);
    m.MapCompass.Mark = cnvJsonMark_Property(JsonData.Map.MapCompass.Mark);
    Object.assign(m.MapCompass.dirWord,JsonData.Map.MapCompass.dirWord);
    // m.MapCompass.dirWord.East = JsonData.Map.MapCompass.dirWord.East;
    // m.MapCompass.dirWord.West = JsonData.Map.MapCompass.dirWord.West;
    // m.MapCompass.dirWord.North = JsonData.Map.MapCompass.dirWord.North;
    // m.MapCompass.dirWord.South = JsonData.Map.MapCompass.dirWord.South;
    // m.MapCompass.Font = cnvJsonFont(JsonData.Map.MapCompass.Font);
    this.Map = m;
    for (let i = 0; i < m.OBKNum; i++) {
        let ok = new strObjectGroup_Data();
        ok.ObjectType = JsonData.ObjectKind[i].ObjectType;
        ok.Name = JsonData.ObjectKind[i].Name;
        ok.Shape = JsonData.ObjectKind[i].Shape;
        ok.Mesh = JsonData.ObjectKind[i].Mesh;
        ok.Color = cnvJsonColor(JsonData.ObjectKind[i].Color);
        ok.DefTimeAttDataNum = JsonData.ObjectKind[i].DefTimeAttDataNum;
        ok.DefTimeAttSTC = JsonData.ObjectKind[i].DefTimeAttSTC;
        ok.ObjectNameNum = JsonData.ObjectKind[i].ObjectNameNum;
        ok.ObjectNameList = JsonData.ObjectKind[i].ObjectNameList;
        ok.UseLineType = JsonData.ObjectKind[i].UseLineType;
        ok.UseObjectGroup = JsonData.ObjectKind[i].UseObjectGroup;
        for (let j = 0; j < ok.DefTimeAttDataNum; j++) {
            let da = new strMPObjDefTimeAttData_Info();
            da.Type = JsonData.ObjectKind[i].DefTimeAttSTC[j].Type;
            da.attData.Title = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.Title;
            da.attData.Unit = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.Unit;
            da.attData.MissingF = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.MissingF;
            da.attData.Note = JsonData.ObjectKind[i].DefTimeAttSTC[j].attData.Note;
            da.ExtraValue = JsonData.ObjectKind[i].DefTimeAttSTC[j].ExtraValue;
            ok.DefTimeAttSTC[j] = da;
        }
        this.ObjectKind[i] = ok;
    }
    for (let i = 0; i < m.LpNum; i++) {
        let lk = new LineKind_Data();
        lk.Name = JsonData.LineKind[i].Name;
        lk.NumofObjectGroup = JsonData.LineKind[i].NumofObjectGroup;
        lk.Mesh = JsonData.LineKind[i].Mesh;
        for (let j = 0; j < lk.NumofObjectGroup; j++) {
            lk.ObjGroup[j] = new strLKOjectGroup_Info();
            lk.ObjGroup[j].GroupNumber = JsonData.LineKind[i].ObjGroup[j].GroupNumber;
            lk.ObjGroup[j].UseOnly = JsonData.LineKind[i].ObjGroup[j].UseOnly;
            lk.ObjGroup[j].Pattern = cnvJsonLine_Property(JsonData.LineKind[i].ObjGroup[j].Pattern);
        }
        this.LineKind[i] = lk;
    }

    for (let i = 0; i < m.ALIN; i++) {
        let ml = new strLine_Data();
        ml.Number = JsonData.MPLine[i].Number;
        ml.NumOfPoint = JsonData.MPLine[i].NumOfPoint;
        ml.Connect = JsonData.MPLine[i].Connect;
        ml.NumOfLineUse = JsonData.MPLine[i].NumOfLineUse;
        ml.Circumscribed_Rectangle = cnvJsonRect(JsonData.MPLine[i].Circumscribed_Rectangle);
        ml.NumOfTime = JsonData.MPLine[i].NumOfTime;
        ml.Drawn = JsonData.MPLine[i].Drawn;
        for (let j = 0; j < ml.NumOfTime; j++) {
            ml.LineTimeSTC[j] = new Line_Time_Data();
            ml.LineTimeSTC[j].Kind = JsonData.MPLine[i].LineTimeSTC[j].Kind;
            ml.LineTimeSTC[j].SETime = cnvJsonStart_End_Time_data(JsonData.MPLine[i].LineTimeSTC[j].SETime);
        }
        for (let j = 0; j < ml.NumOfPoint; j++) {
            ml.PointSTC[j] = cnvJsonPoint(JsonData.MPLine[i].PointSTC[j]);
        }
        this.MPLine[i] = ml;
    }
    for (let i = 0; i < m.Kend; i++) {
        let o = new strObj_Data();
        let s = JsonData.MPObj[i];
        o.Number = s.Number;
        o.Kind = s.Kind;
        o.Shape = s.Shape;
        o.NumOfNameTime = s.NumOfNameTime;
        o.NumOfCenterP = s.NumOfCenterP;
        o.NumOfSuc = s.NumOfSuc;
        o.NumOfLine = s.NumOfLine;
        o.Circumscribed_Rectangle = cnvJsonRect(s.Circumscribed_Rectangle);
        if (s.DefTimeAttValue != null) {
            for (let j = 0; j < s.DefTimeAttValue.length; j++) {
                let d = new strDefTimeAttData_Info();
                if (s.DefTimeAttValue[j].Data != null) {
                    for (let k = 0; k < s.DefTimeAttValue[j].Data.length; k++) {
                        d.Data[k] = new strDefTimeAttDataEach_Info();
                        d.Data[k].Span = cnvJsonStart_End_Time_data(s.DefTimeAttValue[j].Data[k].Span);
                        if (s.DefTimeAttValue[j].Data[k].Value == null) {
                            d.Data[k].Value = undefined;
                        } else {
                            d.Data[k].Value = s.DefTimeAttValue[j].Data[k].Value;
                        }
                    }
                }
                o.DefTimeAttValue[j] = d;
            }
        }
        for (let j = 0; j < s.NumOfSuc; j++) {
            o.SucSTC[j] = new Object_Succession_Data();
            o.SucSTC[j].ObjectCode = s.SucSTC[j].ObjectCode;
            o.SucSTC[j].Time = cnvJsonstrYMD(s.SucSTC[j].Time);
        }
        for (let j = 0; j < s.NumOfNameTime; j++) {
            o.NameTimeSTC[j] = new Object_NameTimeStac_Data();
            o.NameTimeSTC[j].NamesList = Generic.ArrayShallowCopy(s.NameTimeSTC[j].NamesList);
            o.NameTimeSTC[j].SETime = cnvJsonStart_End_Time_data(s.NameTimeSTC[j].SETime);
        }

        for (let j = 0; j < s.NumOfCenterP; j++) {
            o.CenterPSTC[j] = new Object_CenterPoint_Data();
            o.CenterPSTC[j].Position = cnvJsonPoint(s.CenterPSTC[j].Position);
            o.CenterPSTC[j].SETime = cnvJsonStart_End_Time_data(s.CenterPSTC[j].SETime)
        }
        for (let j = 0; j < s.NumOfLine; j++) {
            o.LineCodeSTC[j] = new LineCodeStac_Data();
            o.LineCodeSTC[j].LineCode = s.LineCodeSTC[j].LineCode;
            o.LineCodeSTC[j].NumOfTime = s.LineCodeSTC[j].NumOfTime;
            for (let k = 0; k < s.LineCodeSTC[j].Times.length; k++) {
                o.LineCodeSTC[j].Times[k] = cnvJsonStart_End_Time_data(s.LineCodeSTC[j].Times[k]);
            }
        }
        this.MPObj[i] = o;
    }

    function cnvJsonstrYMD(json) {
        let nt = new strYMD();
        Object.assign(nt,json);
        // nt.Year = json.Year;
        // nt.Month = json.Month
        // nt.Day = json.Day;
        return nt;
    }

    function cnvJsonStart_End_Time_data(json) {
        let nt = new Start_End_Time_data();
        nt.StartTime = cnvJsonstrYMD(json.StartTime);
        nt.EndTime = cnvJsonstrYMD(json.EndTime);
        return nt;
    }

    function cnvJsonFont(jsonf) {
        let newf = new Font_Property();
        if (mdrmjFlag == false) {
            newf.Color = cnvJsonColor(jsonf.Body.Color);
            newf.Size = jsonf.Body.Size;
            newf.italic = jsonf.Body.italic;
            newf.bold = jsonf.Body.bold;
            newf.Underline = jsonf.Body.Underline;
            newf.Name = jsonf.Body.Name;
            newf.Kakudo = jsonf.Body.Kakudo;
            newf.FringeF = jsonf.Body.FringeF;
            newf.FringeWidth = jsonf.Body.FringeWidth;
            newf.FringeColor = cnvJsonColor(jsonf.Body.FringeColor);
            newf.Back = cnvJsonBackGround_Box_Property(jsonf.Back);
        } else {
            newf.Color = cnvJsonColor(jsonf.Color);
            newf.Size = jsonf.Size;
            newf.italic = jsonf.italic;
            newf.bold = jsonf.bold;
            newf.Underline = jsonf.Underline;
            newf.Name = jsonf.Name;
            newf.Kakudo = jsonf.Kakudo;
            newf.FringeF = jsonf.FringeF;
            newf.FringeWidth = jsonf.FringeWidth;
            newf.FringeColor = cnvJsonColor(jsonf.FringeColor);
            newf.Back = cnvJsonBackGround_Box_Property(jsonf.Back);
        }
        return newf;
    }


    function cnvJsonRect(jsonr) {
        let newr = new rectangle();
        if (mdrmjFlag == false) {
            newr.left = jsonr.Left;
            newr.right = jsonr.Right;
            newr.top = jsonr.Top;
            newr.bottom = jsonr.Bottom;
        } else {
            Object.assign(newr,jsonr);
        }
        return newr;
    }

    function cnvJsonColor(jsonc) {
        let newc = new colorRGBA();
        Object.assign(newc,jsonc);
        // newc.a = jsonc.a;
        // newc.r = jsonc.r;
        // newc.g = jsonc.g;
        // newc.b = jsonc.b;
        return newc;
    }

    function cnvJsonPoint(jsonp) {
        let newp = new point();
        if (mdrmjFlag == false) {
            newp.x = jsonp.X;
            newp.y = jsonp.Y;
        } else {
            newp.x = jsonp.x;
            newp.y = jsonp.y;
        }
        return newp;
    }

    function cnvJsonBackGround_Box_Property(json) {
        let nt = new BackGround_Box_Property();
        nt.Tile = cnvJsonTile_Property(json.Tile);
        nt.Line = cnvJsonLine_Property(json.Line);
        nt.Round = json.Round;
        nt.Padding = json.Padding;
        return nt
    }
    function cnvJsonLineEdge_Connect_Pattern_Data_Info(json) {
        let nt = new LineEdge_Connect_Pattern_Data_Info();
        if (mdrmjFlag == false) {
            const lc = ['round', 'square','butt' ];
            const lj = [  'round','bevel','miter'];
            nt.lineCap = lc[json.Edge_Pattern];
            nt.lineJoin = lj[json.Join_Pattern];
            nt.miterLimit = json.MiterLimitValue;
            }else{
                Object.assign(nt,json);
        }
        return nt;
    }
    function cnvJsonLine_Property(json) {
        let nt = new Line_Property();
        if (mdrmjFlag == false) {
            nt.Width = json.BasicLine.SolidLine.Width;
            nt.Color = cnvJsonColor(json.BasicLine.SolidLine.Color);
            nt.Edge_Connect_Pattern = cnvJsonLineEdge_Connect_Pattern_Data_Info(json.Edge_Connect_Pattern);
            if ((json.BasicLine.pattern != -1) || (json.CrossLine.XLine_f == true) || (
                (json.ParallelLine.P_Line_f == true) && (json.ParallelLine.InnerColor_f == true))) {
                nt.BlankF = false;
            } else {
                nt.BlankF = true;
            }
        } else {
            nt.Width = json.Width;
            nt.Color = cnvJsonColor(json.Color);
            nt.Edge_Connect_Pattern = cnvJsonLineEdge_Connect_Pattern_Data_Info(json.Edge_Connect_Pattern);
            nt.BlankF= json.BlankF;
        }
        return nt;
    }

    function cnvJsonTile_Property(json) {
        let nt = new Tile_Property();
        if (mdrmjFlag == false) {
            nt.BlankF = (json.TileCode == 7);
            nt.Color = cnvJsonColor(json.Line.BasicLine.SolidLine.Color);
        } else {
            nt.BlankF = json.BlankF;
            nt.Color = cnvJsonColor(json.Color);
        }
        return nt;
    }

    function cnvJsonMark_Property(json) {
        let nt = new Mark_Property();
        nt.PrintMark = json.PrintMark;
        nt.ShapeNumber = json.ShapeNumber;
        nt.Tile = cnvJsonTile_Property(json.Tile);
        nt.Line = cnvJsonLine_Property(json.Line);
        nt.wordmark = json.wordmark;
        nt.WordFont = cnvJsonFont(json.WordFont);
        return nt;
    }
}
