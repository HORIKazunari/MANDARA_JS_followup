/// <reference path="clsGeneric.js" />


var Add_or_Remove_Add_Obj = 1;
var Add_or_Remove_Remove_Obj = 2;
var GetObjectPointTagInfo = function (ObjectNumber, PointNumber, Tag) {
    this.ObjectNumber = ObjectNumber;
    this.PointNumber = PointNumber;
    this.Tag = Tag;
}

var clsSpatialIndexSearch = function (ObjType, ExtraRangeFlag, Rect, ExtraRange_Size) {
    /// <signature>
    /// <summary>空間インデックス</summary>
    /// <param name="ObjType" >種類SpatialPointType.SinglePoint,SpatialPointType.SPILine,SpatialPointType.SPIRect</param>
    /// <param name="ExtraRangeFlag" >周囲にマージンを設定する場合true</param>
    /// <param name="Rect" >外接四角形、設定していない場合は'undefined'</param>
    /// <param name="ExtraRange_Size" >マージンのサイズ。設定委しない場合は'undefined'</param>
    /// </signature>


    var Object_Info = function (ObjectNumber, ObjectPointNumber) {
        this.ObjectPointNumber = ObjectPointNumber; //オブジェクト内のポイント番号
        this.ObjectNumber = ObjectNumber;//メッシュ内のオブジェクト番号
    }
    var  IndexContents_Info = function(){
        this.Num = 0; //メッシュ内のオブジェクト数
        this.ObjectNumber = new Array;
    }
    var MeshIndex = new Array;
    var XYSize;
    var meshw;
    var meshh;

    var ObjectXY_Info = function (Pnum, Point, Tag, RemoveF) {
        this.Pnum=Pnum;
        this.Point=Generic.ArrayClone( Point);
        this.Tag=Tag;
        this.RemoveF = RemoveF;
    }

    var ObjectXY = new Array;
    var ObjectType = ObjType;
    var MeshRect = new rectangle();
    var AddEndF = false;
    var ObjectNum = 0;
    var ExtraRange = 0;
    if (typeof ExtraRange_Size != 'undefined') {
        ExtraRange = ExtraRange_Size;
    }
    var ExtraRangeF = ExtraRangeFlag;
    var RectSetF = false;
    if (typeof Rect != 'undefined') {
        RectSetF = true;
        MeshRect = BoxData_AddExtraRange(Rect);
    }
    var LineCutNum;


    function BoxData_AddExtraRange(pbox) {
        //四角形に幅をプラスする
        let d = new rectangle();
        d .left = pbox.left - ExtraRange;
        d .right = pbox.right + ExtraRange;
        d .top = pbox.top - ExtraRange;
        d.bottom = pbox.bottom + ExtraRange;
        return d;
    }
    this.AddEnd=function (){
        if(ObjectNum==0) return;
        var n = 0;
        for (var i = 0; i < ObjectNum; i++) {
            n+=  ObjectXY[i].Pnum;
        }
        switch (ObjectType) {
            case SpatialPointType.SinglePoint:
                XYSize = Math.floor(Math.sqrt(n));
                if (ExtraRange == 0){ XYSize = XYSize * 2};
                break;
            case SpatialPointType.SPILine:
                XYSize = Math.floor(Math.sqrt(n) / 8);
                LineCutNum = Math.floor((n / ObjectNum));
                LineCutNum = Math.max(LineCutNum, 50);
                break;
            case SpatialPointType.SPIRect:
                XYSize = Math.floor(Math.sqrt(n));
                break;
        }
        XYSize = Math.max(XYSize, 2);
        MeshIndex = Generic.Array2Dimension(XYSize + 1, XYSize + 1);

        //すべてnewすると遅いので、addmeshの際にindefinedの場合にnewすることにした
        //for (var i = 0; i < XYSize + 1; i++) {
        //    for (var j = 0; j < XYSize+1; j++) {
        //        MeshIndex[i][j] = new IndexContents_Info();
        //    }
        //}
        if (RectSetF == false) {
            MeshRect.left = ObjectXY[0].Point[0].x;
            MeshRect.right = MeshRect.left;
            MeshRect.top = ObjectXY[0].Point[0].y;
            MeshRect.bottom = MeshRect.top;
            for (var i = 0; i < ObjectNum; i++) {
                for(var j=0; j<ObjectXY[i].Pnum; j++){
                    MeshRect=spatial.getCircumscribedRectangle(ObjectXY[i].Point[j], MeshRect);
                }
            }
            BoxData_AddExtraRange(MeshRect);
        }

        if (MeshRect.left == MeshRect.right) {
            meshw = 1;
        }  else {
            meshw = (MeshRect.right - MeshRect.left) / XYSize;
        }
        if (MeshRect.top == MeshRect.bottom) {
            meshh = 1;
        } else {
            meshh = (MeshRect.bottom - MeshRect.top) / XYSize;
        }

        ExtraRange = Math.min(meshw, meshh, ExtraRange);


        for (var i = 0; i < ObjectNum; i++) {
            if (ObjectXY[i].RemoveF == false) {
                switch (ObjectType) {
                    case SpatialPointType.SinglePoint:
                        AddMeshPoint(i, Add_or_Remove_Add_Obj);
                        break;
                    case SpatialPointType.SPILine:
                        AddMeshLine(i);
                        break;
                    case SpatialPointType.SPIRect:
                        AddMeshRect(i, Add_or_Remove_Add_Obj);
                        break;
                }
            }
        }

        AddEndF = true;
    }
    this.Refresh = function () {
        RectSetF = false;
        this.AddEnd();
    }
    function AddMeshLine(ObjNum) {
        for (var i = 0; i < ObjectXY[ObjNum].Pnum; i += LineCutNum) {
            Add_Mesh_LineSub(ObjNum, i, Add_or_Remove_Add_Obj)
        }
    }
    function Add_Mesh_LineSub(ObjNum, StartP, AddorRemove){
        var oxy = ObjectXY[ObjNum];
        var ex = StartP + LineCutNum;0
        if (oxy.Pnum < ex) {
            ex = oxy.Pnum;
        }
        var PBox = new rectangle(oxy.Point[0]);
        var RBox = new rectangle();
        for (var i = StartP; i < ex; i++) {
            PBox=spatial.getCircumscribedRectangle(oxy.Point[i], PBox);
        }
        PBox=BoxData_AddExtraRange(PBox);
        var f = GetRangeXY(PBox, RBox);
        if (f == true) {
            for (var i = RBox.left; i <= RBox.right; i++) {
                for (var j = RBox.top; j <= RBox.bottom; j++) {
                    switch (AddorRemove) {
                        case Add_or_Remove_Add_Obj:
                            Add_Mesh_PointSub(i, j, ObjNum, StartP);
                            break;
                        case Add_or_Remove_Remove_Obj:
                            RemoveObject_sub(i, j, ObjNum);
                            break;
                    }
                }
            }
        }
    }
    function AddMeshRect(ObjNum, AddorRemove) {
        var PBox = BoxData_AddExtraRange(spatial.Get_Rectangle(ObjectXY[ObjNum].Point[0], ObjectXY[ObjNum].Point[1]));
        var RBox = new rectangle();
        var f = GetRangeXY(PBox, RBox);
        if (f == true) {
            for (var i = RBox.left; i <= RBox.right; i++) {
                for (var j = RBox.top; j <= RBox.bottom; j++) {
                    switch (AddorRemove) {
                        case Add_or_Remove_Add_Obj:
                            Add_Mesh_PointSub(i, j, ObjNum, 0);
                            break;
                        case Add_or_Remove_Remove_Obj:
                            RemoveObject_sub(i, j, ObjNum);
                            break;
                    }
                }
            }
        }
    }
    function AddMeshPoint(ObjNum, AddorRemove) {
        var oxy = ObjectXY[ObjNum];
        for (var k = 0; k < oxy.Pnum; k++) {
            if (ExtraRange == false) {
                //大きさのないポイントを追加
                var outXY=new point;
                var exf = GetConPointXY(oxy.Point[k], outXY);
                if (exf == true) {
                    switch (AddorRemove) {
                        case Add_or_Remove_Add_Obj:
                            Add_Mesh_PointSub(outXY.x, outXY.y, ObjNum, k);
                            break;
                        case Add_or_Remove_Remove_Obj:
                            RemoveObject_sub(outXY.x, outXY.y, ObjNum);
                            break;
                    }
                }
            } else {
                //大きさのあるポイントを追加
                var RBox = new rectangle();
                exf = GetExtraRange_XY(oxy.Point[k], RBox)
                if (exf == true) {
                    for (var i = RBox.left; i <= RBox.right; i++) {
                        for (var j = RBox.top; j <= RBox.bottom; j++) {
                            switch (AddorRemove) {
                                case Add_or_Remove_Add_Obj:
                                    Add_Mesh_PointSub(i, j, ObjNum, k);
                                    break;
                                case Add_or_Remove_Remove_Obj:
                                    RemoveObject_sub(i, j, ObjNum);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    function Add_Mesh_PointSub(X, Y, ObjNum, Pointnum) {
        if (typeof MeshIndex[X][Y] === "undefined"){
            MeshIndex[X][Y]  = new IndexContents_Info();
        }
        var n = MeshIndex[X][Y].Num;
        MeshIndex[X][Y].ObjectNumber[n] = new Object_Info(ObjNum,Pointnum);
        MeshIndex[X][Y].Num++;
    }

    function GetConPointXY(inXY, outXY) {
        //メッシュ領域に入るかチェック
        outXY.x = Math.floor((inXY.x - MeshRect.left) / meshw);
        outXY.y = Math.floor((inXY.y - MeshRect.top) / meshh);
        if ((outXY.x < 0) || (outXY.y < 0) || (outXY.x > XYSize) || (outXY.y > XYSize)) {
            return false;
        }else{
            return true;
        }
    }

    function GetExtraRange_XY(xy, OutPutRect) {
        var PBox = new rectangle();
        PBox.left = xy.x - ExtraRange;
        PBox.right = xy.x + ExtraRange;
        PBox.top = xy.y - ExtraRange;
        PBox.bottom = xy.y + ExtraRange;

        return GetRangeXY(PBox, OutPutRect);
    }

    function GetRangeXY(InPBox, OutRBox) {
        if (spatial.Compare_Two_Rectangle_Position(InPBox, MeshRect) != cstRectangle_Cross.cstOuter) {
            var x1 = Math.floor((InPBox.left - MeshRect.left) / meshw);
            var y1 = Math.floor((InPBox.top - MeshRect.top) / meshh);
            x1 = Generic.m_min_max(x1, 0, XYSize);
            y1 = Generic.m_min_max(y1, 0, XYSize);
            var x2 = Math.floor((InPBox.right - MeshRect.left) / meshw);
            var y2 = Math.floor((InPBox.bottom - MeshRect.top) / meshh);
            x2 = Generic.m_min_max(x2, 0, XYSize);
            y2 = Generic.m_min_max(y2, 0, XYSize);

            OutRBox.left = x1;
            OutRBox.right = x2;
            OutRBox.top = y1;
            OutRBox.bottom = y2;
            return true;
        } else {
            return false;
        }
    }
    function Add_Point_Sub(Pnum, XY, TagData) {
        ObjectXY[ObjectNum] = new ObjectXY_Info(Pnum, XY, TagData,false);
        if (AddEndF == true) {
            switch (ObjectType) {
                case SpatialPointType.SinglePoint:
                    AddMeshPoint(ObjectNum, Add_or_Remove.Add_Obj);
                    break;
                case SpatialPointType.SPILine:
                    AddMeshLine(ObjectNum);
                    break;
                case SpatialPointType.SPIRect:
                    AddMeshRect(ObjectNum, Add_or_Remove.Add_Obj);
                    break;
            }
        }
        ObjectNum++;

    }
    this.AddMultiPoint = function (Pnum, XY, TagData) {
        //複数地点オブジェクトを追加
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        Add_Point_Sub(Pnum, XY, TagData);
    }
    this.AddDoublePoint = function (XY1, XY2, TagData) {
        //2地点オブジェクトを追加
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        var XY = new Array(XY1, XY2);
        Add_Point_Sub(2, XY, TagData);
    }

    this.AddSinglePoint = function (XY1, TagData) {
        /// <signature>
        /// <summary>地点オブジェクトを追加</summary>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        var XY = new Array(XY1);
        Add_Point_Sub(1, XY, TagData);
    }
    this.AddSinglePoint_Array = function (Num, XY, TagData) {
        //1地点オブジェクトを配列で追加
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        for (var i = 0; i < Num; i++) {
            var XYS = new Array(XY[i]);
            Add_Point_Sub(1, XYS, TagData);
        }
    }

    this.GetSamePointNumber = function (x, y) {
        /// <signature>
        /// <summary>同じ地点を求め、番号を返す 存在しない場合は-1を返す</summary>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return  new GetObjectPointTagInfo(-1,0, 0); 
        }
        if ( ExtraRangeF == true){
            alert( "GetSamePointNumberは大きさのあるポイントには実装されていません。");
            return  new GetObjectPointTagInfo(-1,0, 0); 
        }
        if (ObjectNum == 0) {
            return  new GetObjectPointTagInfo(-1,0, 0); 
        }
        var XY = new point(x, y);
        var outXY = new point();
        var exf = GetConPointXY(XY, outXY);
        if (exf == false) { return new GetObjectPointTagInfo(-1, 0, 0); }
        var gn = -1;
        var PointNumber;
        var Tag;
        var meshxy = MeshIndex[outXY.x][outXY.y];
        if (meshxy != undefined) {
            for (var i = 0; i < meshxy.Num; i++) {
                var n = meshxy.ObjectNumber[i].ObjectNumber;
                var np = meshxy.ObjectNumber[i].ObjectPointNumber;
                var Point = ObjectXY[n].Point[np];
                if (Point.x == x) {
                    if (Point.y == y) {
                        var gn = n;
                        PointNumber = np;
                        Tag = ObjectXY[n].Tag;
                        break;
                    }
                }
            }
        }
        return new GetObjectPointTagInfo(gn, PointNumber, Tag) ;
    }

    this.GetSamePointNumberArray = function (x, y, SamePointData) {
        /// <signature>
        /// <summary>同じ地点を求め、番号を返す 存在しない場合は-1か0を返す</summary>
        /// <param name="SamePointData" >GetObjectPointTagInfoの配列、オブジェクト番号、オブジェクト-ポイント番号、タグ（戻り値）</param>
        /// <returns type="Number" >同じ地点の数</returns>
        /// </signature> 

        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        if (ExtraRangeF == true) {
            alert("GetSamePointNumberArrayは大きさのあるポイントには実装されていません。");
            return;
        }
        if (ObjectNum == 0) {
            return -1;
        }
        SamePointData.length = 0;
        var XY = new point(x, y);
        var outXY = new point;
        var exf = GetConPointXY(XY, outXY);
        if (exf == false) { return -1; }

        var meshxy = MeshIndex[outXY.x][outXY.y];
        for (var i = 0; i < meshxy.Num; i++) {
            var n = meshxy.ObjectNumber[i].ObjectNumber;
            var np = meshxy.ObjectNumber[i].ObjectPointNumber;
            var Point = ObjectXY[n].Point[np];
            if (Point.x == x) {
                if (Point.y == y) {
                    SamePointData.push(new GetObjectPointTagInfo(n,np,ObjectXY[n].Tag));
                }
            }
        }
        return SamePointData.length;
    }

    this.GetNearestLineNumber = function (x, y, BaseDistance, ExceptionNumber, ExceptionTag) {
        
        if (ObjectType != SpatialPointType.SPILine) {
            alert("線以外はできません。");
            return { Num:0 };
        }
        if (ObjectNum == 0) {
            return { Num:0 };
        }
        let XY = new point(x, y);
        let outXY = new point(x, y);
        let ObStac=[];
        let PStac=[];
        let NearP=[];
        let Tags=[];

        let exf = GetConPointXY(XY, outXY);
        if (exf == false) { return { Num:0 }; }

        let mind = Math.min(ExtraRange, BaseDistance);
        let meshxy = MeshIndex[outXY.x][outXY.y];
        if (meshxy != undefined) {
            for (var i = 0; i < meshxy.Num; i++) {
                let Onum = meshxy.ObjectNumber[i].ObjectNumber;
                let SP = meshxy.ObjectNumber[i].ObjectPointNumber;
                let EP = SP + LineCutNum;
                if (ObjectXY[Onum].Pnum < EP) {
                    EP = ObjectXY[Onum].Pnum;
                }
                let thisMin = Math.min(ExtraRange, BaseDistance);
                let thisNearP;
                let thisNearObjPoint = -1;

                //線分集合ごとに最短距離を求める
                let oxy = ObjectXY[Onum];
                for (let j = SP; j < EP - 1; j++) {
                    let retD = spatial.Distance_PointLine(x, y, oxy.Point[j].x, oxy.Point[j].y,oxy.Point[j + 1].x, oxy.Point[j + 1].y);
                    if (retD.distance < thisMin) {
                        thisMin = retD.distance;
                        thisNearP = retD.nearP;
                        thisNearObjPoint = j;
                    }
                }
                if ((thisMin <= mind) && (thisNearObjPoint != -1)) {
                    //線分集合の最短最小値がそれ以前の最短距離以下の場合
                    if (thisMin != mind) {
                        ObStac.length = 0;
                        PStac.length = 0;
                        NearP.length = 0;
                        Tags.length = 0;
                    }
                    ObStac.push(Onum);
                    PStac.push(thisNearObjPoint);
                    NearP.push(thisNearP);
                    Tags.push(ObjectXY[Onum].Tag);
                    mind = thisMin;
                }
            }
        }
        let return_V = {
            ObjectPointNumber: NearP,
            Onumber: ObStac,
            PNumber: PStac,
            Tags: Tags,
            NearestPoint: NearP,
            Distance: mind,
            num: PStac.length
        }
        return return_V;
    }

    //近い地点を返す、数と番号（配列）を返す（複数出力） 存在しない場合は-1を返す
    this.GetNearPointNumber= function (x, y, BaseDistance,ExceptionNumber=-1,ExceptionTag){
        let ObStac=[];
        let PStac=[];
        let Distance=[];
        let Tags=[];
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance};
        }
        if (ExtraRangeF == false) {
            alert("GetNearPointNumberは大きさのないポイントには実装されていません。");
            return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance};
        }
        if (ObjectNum == 0) {
            return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance};
        }
        if(ExceptionTag==undefined){
            ExceptionTag=[];
        }
        var XY = new point(x, y);
        var outXY = new point;
        var exf = GetConPointXY(XY, outXY);
        if (exf == false) { return {num:0} }

        let mind  = Math.min(ExtraRange, BaseDistance);
        var mi = MeshIndex[outXY.x][outXY.y];
        if (mi != undefined) {
            for (let i = 0; i < mi.ObjectNumber.length; i++) {
                let n = mi.ObjectNumber[i].ObjectNumber;
                let np = mi.ObjectNumber[i].ObjectPointNumber;
                if ((n != ExceptionNumber) && ((ExceptionTag.indexOf(ObjectXY[n].Tag) == -1))) {
                    let op = ObjectXY[n].Point[np];
                    let D = spatial.Distance(x, y, op.x, op.y);
                    if (D < mind) {
                        Distance.push(D);
                        ObStac.push(n);
                        PStac.push(np);
                        Tags.push(ObjectXY[n].Tag);
                    }
                }
            }
        }
        return {num:ObStac.length, Onumber:ObStac,PNumber:PStac, Tags:Tags,Distance:Distance}
    }

    this.GetNearestPointNumber = function (x, y, BaseDistance, ExceptionNumber, ExceptionTag) {
        /// <signature>
        /// <summary>最も近い地点を求め、数と番号（配列）を返す（複数出力） 存在しない場合は-1を返す</summary>
        /// <param name="BaseDistance" >基準となる距離</param>
        /// <param name="NearestPointData" >最も近い地点の配列(戻り値)</param>
        /// <param name="ExceptionNumber" >対象から除外するオブジェクト番号</param>
        /// <param name="ExceptionTag" >対象から除外するタグ</param>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        let NearestPointData=[];
        if (ObjectType != SpatialPointType.SinglePoint) {
            alert("点以外はできません。");
            return;
        }
        if (ExtraRangeF == false) {
            alert("GetNearestPointNumberは大きさのないポイントには実装されていません。");
            return;
        }
        if (ObjectNum == 0) {
            return -1;
        }
        if(ExceptionTag==undefined){
            ExceptionTag=[];
        }
        var XY = new point(x, y);
        var outXY = new point;
        var exf = GetConPointXY(XY, outXY);
        if (exf == false) { return {num:0}  }

        var mind = Math.min(ExtraRange, BaseDistance);
        var o_mind = mind - 1;
        var meshxy = MeshIndex[outXY.x][outXY.y];
        if (meshxy != undefined) {
            for (var i = 0; i < meshxy.Num; i++) {
                var n = meshxy.ObjectNumber[i].ObjectNumber;
                var np = meshxy.ObjectNumber[i].ObjectPointNumber;
                if ((n != ExceptionNumber) && (ObjectXY[n].Tag != ExceptionTag)) {
                    var Point = ObjectXY[n].Point[np];
                    var D = spatial.Distance(x, y, Point.x, Point.y);
                    if (D <= mind) {
                        if (D != o_mind) {
                            NearestPointData.length = 0;
                        }
                        NearestPointData.push(new GetObjectPointTagInfo(n, np, ObjectXY[n].Tag));
                        mind = D;
                        o_mind = mind;
                    }
                }
            }
        }
        return {mind:mind,num:NearestPointData.length,NearestPointData: NearestPointData};
    }

    //指定した点が入る四角領域を取得
    this.GetRectIn = function (x, y) {
        if (ObjectType != SpatialPointType.SPIRect) {
            alert("四角以外はできません。");
            return 0;
        }
        if (ObjectNum == 0) {
            return 0;
        }

        let XY = new point();
        let sp = new point();
        XY.x = x;
        XY.y = y;
        let exf = GetConPointXY(XY, sp);
        if (exf == false) {
            return 0;
        }

        let same_N = 0;
        let ObStac = new Array();
        let MI = MeshIndex[sp.x][sp.y];
        if (MI != undefined) {
            for (let i = 0; i < MI.ObjectNumber.length;i++) {
                let n = MI.ObjectNumber[i].ObjectNumber;
                let Ob = ObjectXY[n];
                let PBox= spatial.Get_Rectangle(Ob.Point[0], Ob.Point[1]);
                if (spatial.Check_PointInBox(new point(x, y), 0, PBox) == true) {
                    ObStac.push(n);
                    same_N++;
                }
            }
        }
        let Tags = new Array(same_N);
        for (let i = 0; i < same_N; i++) {
            Tags[i] = ObjectXY[ObStac[i]].Tag;
        }
        return {number:same_N,Tags:Tags,ObStac:ObStac}

        }

    this.RemoveObject = function (Number) {
        /// <signature>
        /// <summary>指定したオブジェクト番号を検索インデックスから削除</summary>
        /// <param name="Number" >オブジェクト番号</param>
        /// </signature> 

        var RBox = new rectangle();
        ObjectXY[Number].RemoveF = true;
        switch (ObjectType) {
            case SpatialPointType.SinglePoint:
                AddMeshPoint(Number, Add_or_Remove_Remove_Obj);
                break;
            case SpatialPointType.SPILine:
                for (var i = 0; i < ObjectXY[Number].Pnum;i+=LineCutNum){
                    Add_Mesh_LineSub(Number, i, Add_or_Remove_Remove_Obj);
                }
                break;
            case SpatialPointType.SPIRect:
                AddMeshRect(Number, Add_or_Remove_Remove_Obj);
                break;
        }
    }

    function RemoveObject_sub(x,y,Number) {
        var meshxy = MeshIndex[x][y];
        var i = -1;
        do {
           i ++;
        } while (meshxy.ObjectNumber[i].ObjectNumber != Number)
        //for (j = i + 1;j<meshxy.Num;j++){ '配列をつめる
        //    meshxy.ObjectNumber[j-1]=meshxy.ObjectNumber[j]
        //}
        //meshxy.ObjectNumber.splice(i, 1)メソッドもあるがはやくない
        meshxy.ObjectNumber[i] = meshxy.ObjectNumber[meshxy.Num - 1]//配列最後と入れ替える
        meshxy.Num--;
    }

    this.RemoveObject_byTag = function (TagNumber) {
        //指定したタグのオブジェクトの検索インデックスを削除
        for (var i = 0; i < ObjectNum; i++) {
            if (ObjectXY[i].Tag == TagNumber) {
                if (ObjectXY[i].RemoveF == false) {
                    this.RemoveObject(i);
                }
            }
        }
    }

    this.AddLine = function (Pnum , XY,  TagData) {
        //線オブジェクト追加
        if (ObjectType != SpatialPointType.SPILine) {
            alert("線以外はできません。");
            return;
        }
        Add_Point_Sub(Pnum, XY , TagData);
    }

    this.ChangeTagValue = function ( ChangeValue,  StartRangeValue , LastRangeValue ) {
        //タグの値を変化させる
        for (var i = 0; i < ObjectNum; i++) {
            if (Generic.Check_Two_Value_In(ObjectXY[i].Tag, StartRangeValue, LastRangeValue) != chvOuter) {
                ObjectXY[i].Tag += ChangeValue;
            }
        }
    }

    this.AddRect = function (XY1_rectangle, XY2_TagData ,  TagData) {
        //四角オブジェクト追加
        if (ObjectType != SpatialPointType.SPIRect) {
            alert("四角以外はできません。");
            return;
        }
        if ((XY1_rectangle instanceof point) == true) {
            XY = new Array(XY1_rectangle, XY2_TagData);
            Add_Point_Sub(2, XY, TagData);
        } else {
            var XY = new Array(2);
            XY[0] = new point(XY1_rectangle.left, XY1_rectangle.top);
            XY[1] = new point(XY1_rectangle.right, XY1_rectangle.bottom);
            Add_Point_Sub(2, XY, XY2_TagData);
        }
    }


}
