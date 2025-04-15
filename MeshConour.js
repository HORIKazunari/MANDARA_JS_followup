
/// <reference path="SortingSearch.js" />
/// <reference path="SpatialIndexSearch.js" />


var conPart_info=function(){
    this.p0=new point();
    this.p1=new point();
}
var contourLineStacInfo = function (ContourNumber, NumOfPoint) {
    this.ContourNumber = ContourNumber;
    this.NumOfPoint = NumOfPoint;
    this.points = new Array();//point
}
var clsMeshContour = function (XMesh_Num, YMesh_Num, Xmesh_Size, YMesh_Size, X_plus, Y_Plus) {
    /// <signature>
    /// <summary>メッシュ作成クラス</summary>
    /// <param name="XMesh_Num" >横メッシュ数</param>
    /// <param name="YMesh_Num" >縦メッシュ数</param>
    /// <param name="Xmesh_Size" >横メッシュの全体幅</param>
    /// <param name="YMesh_Size" >縦メッシュの全体高さ</param>
    /// <param name="X_plus" >左上の座標</param>
    /// <param name="Y_Plus" >右上の座標</param>
    /// </signature> 
    var ConValuePlus = 0.0001;
    var Quad_Mesh_Info = function (Positon, Max, Min, LackF) {
        /// <signature>
        /// <summary>四分木データの配列に入れる情報</summary>
        /// <param name="Positon" >座標（rectinfo）</param>
        /// <param name="Max" >最高地点標高</param>
        /// <param name="Min" >最低地点標高</param>
        /// <param name="LackF" >欠損値の場合true</param>
        /// </signature> 
        this.Position = Positon;//rectinfo
        this.Max = Max;
        this.Min = Min;
        this.LackF = LackF;
    }
    var Quad_MeshData = new Array; //Quad_Mesh_Info
    var PCell = new Array();
    var XMeshNum = XMesh_Num;
    var YMeshNum = YMesh_Num;
    var XMeshSize = Xmesh_Size;
    var YMeshSize = YMesh_Size;
    var Xplus = X_plus;
    var Yplus = Y_Plus;
    var Mesh = Generic.Array2Dimension(XMeshNum, YMeshNum);
    this.SetMeshValue = function (x, y, Value) {
        Mesh[x][y] = Value;
    }
    this.GetMeshValue = function (x, y) {
        return Mesh[x][y];
    }
    this.Execute_Mesh = function (ContourNum, Contour_High_M, Con_LineStac) {
        /// <signature>
        /// <summary>等値線取得、戻り値は等値線ラインの数</summary>
        /// <param name="ContourNum" >取得する等値線の数</param>
        /// <param name="Contour_High_M" >等値線値</param>
        /// <param name="Contour_Line" >等値線ごとの等値線番号、ポイント数、座標contourLineStacInfo(戻り値)</param>
        /// </signature> 

        //'出力
        //'戻り値：線の数
        //'Con_LineStac() (0)等高線番号　(1)点スタックの始め　(2)点の数～　線の数分繰り返す
        //'Con_Point() xy座標

        let hn = ContourNum;
        let High_M = Contour_High_M;
        let max_PartitiopnLevel = Get_PartitiopnLevel(XMeshNum, YMeshNum);
        let High_CN = new Array(hn);//等値線の値ごとの等値線部分線分数
        for (let i = 0; i < High_CN.length;i++) { High_CN[i] = 0;}
        let con = new Array(hn);
        for (let i = 0; i < hn; i++) {
            con[i] = [];// new conPart_info(); 
        }
         Con_LineStac.length=0;//contourLineStacInfo
  
        //等値線計算中1
         Set_MeshQuadTree(Mesh, XMeshNum, YMeshNum, max_PartitiopnLevel);//線形四分木データをQuad_MeshDataに作成
         let n = [];
         for (let k = 0; k < hn; k++) {
            let High = High_M[k] + ConValuePlus;
            Get_Quad_MeshCell(High, PCell, 0, 0, n, max_PartitiopnLevel);//Quad_MeshDataから該当するメッシュの範囲を取得
            for (i = 0; i < n[0]; i++) {
                let rect=Quad_MeshData[PCell[i]].Position;
                for (let j = rect.left; j <= rect.right; j++) {
                    for (let k2 = rect.top; k2 <= rect.bottom; k2++) {
                        if(typeof Mesh[j][k2] != 'undefined') {
                            Mesh_Sub(con, Mesh, j, k2, k, High, High_CN);
                        }
                    }
                }
            }
        }
        //等値線計算中2、バラバラの等高線線分を結合する
        let all_Pon = 0;
        for (let i = 0; i < hn; i++) {
            let NL = High_CN[i];
            if (0 < NL) {
                let PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint, false, new rectangle(0, XMeshNum, 0, YMeshNum));
                let Arrange_LineCode = Generic.Array2Dimension(NL + 1, 2);
                for (let j = 0; j < Arrange_LineCode.length; j++) {
                    for (let k = 0; k < Arrange_LineCode[j].length; k++) { Arrange_LineCode[j][k] = 0; }
                }
                let Fringe = new Array(NL + 1);
                for (let j = 0; j < Fringe.length; j++) { Fringe[j] = new Fringe_Line_Info(); }
                let Get_Linef = new Array(NL + 1);
                for (let j = 0; j < Get_Linef.length; j++) { Get_Linef[j] = false; }
                for (let j = 0; j < NL; j++) {
                    PointIndex.AddDoublePoint(con[i][j].p0, con[i][j].p1, j);
                }
                PointIndex.AddEnd();
                let fnl = 0;
                let Pon = 0;
                let Contf = false;
                let stxy = new point();
                let exy = new point();
                let Reverse_f=false;
                while (fnl < NL) {
                    let js = 0;
                    if (Contf == false) {
                        for (let j = 0; j < NL; j++) {
                            //始点の探索
                            if (Get_Linef[j] == false) {
                                Arrange_LineCode[Pon][0] = fnl;
                                Arrange_LineCode[Pon][1] = 1;
                                Get_Linef[j] = true;
                                Fringe[fnl].code = j;
                                Fringe[fnl].direction = 1;
                                fnl++;
                                stxy = con[i][j].p0.Clone();
                                exy = con[i][j].p1.Clone();
                                PointIndex.RemoveObject(j);
                                Reverse_f = false;
                                js = j;
                                break;
                            }
                        }
                    }
                    Contf = false;
                    //始点Xチェック
                    var LineNO2 = PointIndex.GetSamePointNumber(exy.x, exy.y);
                    if (LineNO2.ObjectNumber != -1) {
                        var PointTag = LineNO2.Tag;
                        Contf = true;
                        Get_Linef[PointTag] = true;
                        Arrange_LineCode[Pon][1]++;
                        Fringe[fnl].code = PointTag;
                        if (LineNO2.PointNumber == 0) {
                            exy = con[i][PointTag].p1.Clone();
                            Fringe[fnl].direction = 1; //順方向
                        } else {
                            exy = con[i][PointTag].p0.Clone();
                            Fringe[fnl].direction = -1; //逆方向
                        }
                        PointIndex.RemoveObject(PointTag);
                        fnl++;
                    }
                    if (exy.Equals(stxy) == true) {
                        Contf = false;
                        Pon++;
                    } else {
                        if (Contf == false) {
                            if (Reverse_f == false) {
                                //始点も終点もチェックしてない場合は、初期の始点と終点を入れ替えて繰り返す
                                Reverse_f = true;
                                let k2 = Arrange_LineCode[Pon][0];
                                let Kn = Arrange_LineCode[Pon][1];
                                let Fringe_Sub = new Array(Kn);
                                for (let k = 0 ; k < Kn; k++) {
                                    Fringe_Sub[k]=new Fringe_Line_Info();
                                    Fringe_Sub[k].code = Fringe[k2 + k].code;
                                    Fringe_Sub[k].direction = Fringe[k2 + k].direction;
                                }
                                for (let k = 0 ; k < Kn; k++) {
                                    Fringe[k2 + k].code = Fringe_Sub[Kn - k - 1].code;
                                    Fringe[k2 + k].direction = -Fringe_Sub[Kn - k - 1].direction;
                                }
                                stxy = con[i][js].p1.Clone();
                                exy = con[i][js].p0.Clone();
                                Contf = true;
                            } else {
                                Contf = false;
                                Pon++;
                            }
                        }
                    }
                }

                if (Contf == true) {
                    Pon++;
                }
                for (j = 0; j < Pon; j++) {
                    Con_LineStac[all_Pon + j] = new contourLineStacInfo(i, Arrange_LineCode[j][1] + 1);
                    var k2 = Arrange_LineCode[j][0];
                    var fk2 = Fringe[k2];
                    if (fk2.direction == 1) {
                        Con_LineStac[all_Pon + j].points.push(con[i][fk2.code].p0.Clone(), con[i][fk2.code].p1.Clone());
                    } else {
                        Con_LineStac[all_Pon + j].points.push(con[i][fk2.code].p1.Clone(), con[i][fk2.code].p0.Clone());
                    }
                    for (k = 1; k < Arrange_LineCode[j][1]; k++) {
                        var fk2 = Fringe[k2 + k];
                        if (fk2.direction == 1) {
                            Con_LineStac[all_Pon + j].points.push(con[i][fk2.code].p1.Clone());
                        } else {
                            Con_LineStac[all_Pon + j].points.push(con[i][fk2.code].p0.Clone());
                        }
                    }
                }
                all_Pon += Pon;
            }
        }
        for (i = 0; i < all_Pon; i++) {
            for (j = 0; j < Con_LineStac[i].NumOfPoint; j++) {
                var cp = Con_LineStac[i].points[j];
                cp.x = Xplus + cp.x / (XMeshNum - 1) * XMeshSize;
                cp.y = Yplus + cp.y / (YMeshNum - 1) * YMeshSize;
            }

        }
        return all_Pon;

    }

    this.Execute_FrameGet = function (GetSide, ContourNum, Contour_High_M, Frame_LineContour, Frame_Point) {
        /// <signature>
        /// <summary>等値線の枠取得、戻り値は等値線ラインの数</summary>
        /// <param name="GetSide" >0左 1上 2右 3下</param>
        /// <param name="ContourNum" >取得する等値線の数</param>
        /// <param name="Contour_High_M" >等値線値</param>
        /// <param name="Frame_LineContour" >等高線番号配列(戻り値)</param>
        /// <param name="Frame_Point" >xy座標配列(戻り値)</param>
        /// </signature> 



        for (i = 0; i < ContourNum - 1; i++) {
            //等高線が低→高に並べ替えてある必要
            if(Contour_High_M[i + 1] < Contour_High_M[i]) { return -1;}
        }
        let sx;
        let  sy;
        let  ex;
        let  ey;
        switch (GetSide) {
            case 0:
                sx = 0;
                sy = 0;
                ex = 0;
                ey = YMeshNum - 1;
                break;
            case 1:
                sx = 0;
                sy = 0;
                ex = XMeshNum - 1;
                ey = 0;
                break;
            case 2:
                sx = XMeshNum - 1;
                sy = 0;
                ex = XMeshNum - 1;
                ey = YMeshNum - 1;
                break;
            case 3:
                sx = 0;
                sy = YMeshNum - 1;
                ex = XMeshNum - 1;
                ey = YMeshNum - 1;
                break;
        }
        let vn;
        Frame_LineContour.length=0;//point
        Frame_Point.length=0;
        switch (GetSide) {
            case 0:
                vn = GetFrameSub(ContourNum, Contour_High_M, sx, sy, 0, 1, YMeshNum, Frame_Point, Frame_LineContour);
                break;
            case 1:
                vn = GetFrameSub(ContourNum, Contour_High_M, sx, sy, 1, 0, XMeshNum, Frame_Point, Frame_LineContour);
                break;
            case 2:
                vn = GetFrameSub(ContourNum, Contour_High_M, ex, sy, 0, 1, YMeshNum, Frame_Point, Frame_LineContour);
                break;
            case 3:
                vn = GetFrameSub(ContourNum, Contour_High_M, sx, ey, 1, 0, XMeshNum, Frame_Point, Frame_LineContour);
                break;
        }
        for (let i = 0; i < vn; i++) {
            var cp = Frame_Point[i];
            cp.x = Xplus + cp.x / (XMeshNum - 1) * XMeshSize;
            cp.y = Yplus + cp.y / (YMeshNum - 1) * YMeshSize;
        }
        return vn;
    }
    function GetFrameSub(ContourNum, Contour_High_M, sx, sy, Xplus, Yplus, LoopNum, Vpoint, Vcon) {
        // Contour_High_M[]
        //Vpoint[]:point
        //Vcon[]
        let SepV = new Array();
        let VPC = new Array();

        //始終点のコンターの位置を取得
        let SPN = -1;
        for (let i = ContourNum - 1; i >= 0; i--) {
            if((Contour_High_M[i] + ConValuePlus) <= Mesh[sx][sy]) {
                SPN = i;
                break;
            }
        }
        SepV.push(0);
        VPC.push(SPN);

        let ex = sx + (LoopNum - 1) * Xplus;
        let ey = sy + (LoopNum - 1) * Yplus;
        let EPN = -1;
        for (let i = ContourNum - 1; i >= 0; i--) {
            if((Contour_High_M[i] + ConValuePlus) <= Mesh[ex][ey]) {
                EPN = i;
                break;
            }
        }
        SepV.push(LoopNum - 1);
        VPC.push(EPN);

        //コンターの区切り箇所を取得
        for (let i = 0;i<=LoopNum - 2;i++){
            let V1 = Mesh[sx + i * Xplus][ sy + i * Yplus];
            let V2 = Mesh[sx + (i + 1) * Xplus][ sy + (i + 1) * Yplus];
            for (let j = 0;j< ContourNum ;j++){
                let High = Contour_High_M[j] + ConValuePlus;
                let VH1 = V1 - High;
                let VH2 = V2 - High;
                if((((VH1 <= 0) && (VH2 >= 0)) || ((VH1 >= 0) && (VH2 <= 0))) && (V1 != V2)) {
                    SepV.push(i + Math.abs(VH1 / (V1 - V2)));
                    if(V1 < V2) {
                        VPC.push(j);
                    } else {
                        VPC.push(j - 1);
                    }
                }
            }

        }
        let VPN = SepV.length;

        let SepVSort= new clsSortingSearch();
        SepVSort.AddRange(SepV);
        Vpoint.length = VPN;
        Vcon.length = VPN;
        let n = 0;
        for (let i = 0; i < VPN ; i++) {
            let j = SepVSort.DataPosition(i);
            let f=false;
            if( i == 0 ){
                f = true;
            }else{
                if( SepVSort.DataPositionValue(i - 1) != SepVSort.DataPositionValue(i) ){
                    f = true;
                }
            }
            if( f == true ){
                Vcon[n]=VPC[j];
                if( Xplus == 1 ){
                    Vpoint[n] = new point(SepV[j], sy);
                }else{
                    Vpoint[n] = new point(sx, SepV[j]);
                }
                n++;
            }else{
                if(i != VPN - 1) {
                    n--;
                }
            }
        }
        return n;
    }

    function Mesh_Sub(con, Mesh, mi, mj, HK, High, High_CN) {
        //メッシュ内で横切る等値線を取得
        var V1 = Mesh[mi][mj];
        var V2 = Mesh[mi + 1][mj];
        var V3 = Mesh[mi][mj + 1];
        var V4 = Mesh[mi + 1][mj + 1];
        //取得する等高線の値とメッシュの４すみを比較
        var VH1 = V1 - High;
        var VH2 = V2 - High;
        var VH3 = V3 - High;
        var VH4 = V4 - High;
        let Q = 0;
        let C12 = 0;
        let C24 = 0;
        let C34 = 0;
        let C13 = 0;
        if( (((VH1 <= 0)&&(VH2 >= 0)) || ((VH1 >= 0 )&&( VH2 <= 0)) )&&( V1 != V2 )){ C12 = 1; Q ++;}
        if( (((VH2 <= 0)&&(VH4 >= 0)) || ((VH2 >= 0 )&&( VH4 <= 0)) )&&( V2 != V4 )){ C24 = 1; Q ++;}
        if( (((VH4 <= 0)&&(VH3 >= 0)) || ((VH4 >= 0 )&&( VH3 <= 0)) )&&( V3 != V4 )){ C34 = 1; Q ++;}
        if( (((VH1 <= 0)&&(VH3 >= 0)) || ((VH1 >= 0 )&&( VH3 <= 0)) )&&( V1 != V3 )){ C13 = 1; Q ++;}

        switch (Q) {
            case 2:
                R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, High_CN, con);
                break;
            case 4:
                if(( V2 == High)&&(V3 == High)){
                    C12 = 1; C13 = 1;
                    R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, High_CN, con);
                }else{
                    C34 = 0; C13 = 0; C12 = 1; C24 = 1;
                    R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, High_CN, con);
                    C12 = 0; C24 = 0; C34 = 1; C13 = 1;
                    R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, High_CN, con);
                }
                break;
            case 3:
                if(( C12 == 1 )&&( C24 == 1 )&&( V2 == High )){ C12 = 0;}
                if( (C12 == 1 )&&( C13 == 1 )&&( V1 == High )){ C12 = 0;}
                if(( C24 == 1 )&&( C34 == 1 )&&( V4 == High )){ C24 = 0;}
                if(( C34 == 1 )&&( C13 == 1 )&&( V3 == High )){ C13 = 0;}

                R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, High_CN, con);
                break;
        }
    }

    function R2220(mi, mj, C12, C34, C24, C13, VH1, VH2, VH3, VH4, V1, V2, V3, V4, HK, High_CN, con) {
        let T = 0;
        let po = new Array(4);
        if(C12 == 1 ){
            po[T] = new point(mi + Math.abs(VH1 / (V1 - V2)), mj);
            T++;
        }
        if (C34 == 1) {
            po[T] = new point(mi + Math.abs(VH3 / (V3 - V4)), mj + 1);
            T++;
        }
        if (C24 == 1) {
            po[T] = new point(mi + 1, mj + Math.abs(VH2 / (V2 - V4)));
            T++;
        }
        if (C13 == 1) {
            po[T] = new point(mi, mj + Math.abs(VH1 / (V1 - V3)));
            T++;
        }
        if(T < 2 ){
            return; //Tはほぼ常に２で２未満のことはない
        }
        if(po[0].Equals(po[1])==false){
            //二つの座標が同じになってしまう場合は含めない
            let Pon = High_CN[HK];
            con[HK][Pon]=new conPart_info();
            con[HK][Pon].p0 = po[0].Clone();
            con[HK][Pon].p1= po[1].Clone();
            High_CN[HK] = Pon + 1;
            }
    }

    function Get_Sum_geometric_progression(shokou, kouhi, n) {
        /// <signature>
        /// <summary>等比数列の和を求める。今は使っていない</summary>
        /// <param name="shokou">初項</param>
        /// <param name="kouhi">項比</param>
        /// <param name="n">n</param>
        /// <returns type="Number" />
        /// </signature>

        return shokou * (1 - Math.pow(kouhi, n)) / (1 - kouhi);
    }

    function Get_MortonArrayPosition(n) {
        /// <signature>
        /// <summary>四分木線形配列の開始位置。</summary>
        /// <param name="n">n</param>
        /// <returns type="Number" />
        /// </signature>
        return -(1 - Math.pow(4, n)) / 3;
    }
    function Get_MortonNumberXY(X, Y, SpaceLevel, max_PartitiopnLevel) {
        /// <signature>
        /// <summary>点の座標値と所属する空間レベルから、四分木線形配列の位置を返す</summary>
        /// <param name="x">X座標</param>
        /// <param name="y">Y座標</param>
        /// <param name="SpaceLevel">空間レベル</param>
        /// <param name="max_PartitiopnLevel">最大分割レベル</param>
        /// <returns type="Number"/>
        /// </signature>

        var zero ="0".repeat(max_PartitiopnLevel);
        var x2 = (zero + X.toString(2)).right(max_PartitiopnLevel); //X座標を2進数に
        var y2 = (zero + Y.toString(2)).right(max_PartitiopnLevel); //Y座標を2進数に
        var Num = "";
        for(var i = 0;i< max_PartitiopnLevel;i++){
            Num +=  y2.substr(i, 1) + x2.substr( i, 1);
        }
        return parseInt(Num, 2) + Get_MortonArrayPosition(SpaceLevel);
    }


    function Set_MeshQuadTree(Mesh, xw, yw, max_PartitiopnLevel) {
        /// <signature>
        /// <summary>メッシュの四分木データをQuad_MeshDataに作成</summary>
        /// <param name="Mesh">元々のメッシュ二次元配列</param>
        /// <param name="xw">メッシュの横サイズ</param>
        /// <param name="yw">メッシュの縦サイズ</param>
        /// <param name="max_PartitiopnLevel">最大分割レベル</param>
        /// </signature>

        var QD = new Array();
        let stp = Math.pow(2, max_PartitiopnLevel - 1);
        let w = Math.floor(xw / stp);//最大分割レベルの横セル数
        let H = Math.floor(yw / stp);//最大分割レベルの縦セル数
        for (var i = 0; i < stp; i++) {
            let h2;
            if (i == stp - 1) {
                h2 = H + (yw % stp); //ループ最後では余り部分を追加する
            } else {
                h2 = H + 1; //1メッシュ分重複を持たせる
            }
            var py2 = i * H;
            for (var j = 0; j < stp; j++) {
                let w2;
                if (j == stp - 1) {
                    w2 = w + (xw % stp);//ループ最後では余り部分を追加する
                } else {
                    w2 = w + 1; //1メッシュ分重複を持たせる
                }
                let f = true;//すべて欠損の場合true
                let px2 = j * w;
                let mxv;// = Mesh[px2][py2];;
                let mnv;// = mxv;
                for (var ky = 0; ky < h2; ky++) {
                    var py = py2 + ky;
                    for (var kx = 0; kx < w2; kx++) {
                        var px = px2 + kx;
                        if (typeof Mesh[px][py] != 'undefined') { //Web等高線メーカーの場合-9999になっているので必要ないが汎用性のため残す
                            if (f == true) {
                                mxv = Mesh[px][py];
                                mnv = mxv;
                                f = false;
                            } else {
                                if (mxv < Mesh[px][py]) {
                                    mxv = Mesh[px][py];
                                } else if (Mesh[px][py] < mnv) {
                                    mnv = Mesh[px][py];
                                }
                            }
                        }
                    }
                }
                let mon = Get_MortonNumberXY(j, i, max_PartitiopnLevel - 1, max_PartitiopnLevel);
                //四分木線形配列の最大分割レベルに、当該メッシュの範囲と、最大標高、最低標高を保存
                Quad_MeshData[mon] = new Quad_Mesh_Info(new rectangle(px2, px2 + w2 - 2, i * H, i * H + h2 - 2), mxv, mnv, f);
            }
        }

        //親レベルの最大標高、最低標高を計算
        for (let k = max_PartitiopnLevel - 1; k >= 1; k--) {
            let SP = Get_MortonArrayPosition(k); //自レベルの四分木線形配列の開始位置
            let SP2 = Get_MortonArrayPosition(k - 1);//親レベルの四分木線形配列の開始位置
            for (let i = 0; i < Math.pow(4, k); i += 4) {　//子4メッシュで親1メッシュ
                let f = true;
                for (let j = 0; j <= 3; j++) {
                    let Quad_MeshDataSub = Quad_MeshData[SP + i + j];
                    if (Quad_MeshDataSub.LackF == false) {
                        if (f == true) {
                            mxv = Quad_MeshDataSub.Max;
                            mnv = Quad_MeshDataSub.Min;
                            f = false;
                        } else {
                            if (mxv < Quad_MeshDataSub.Max) {
                                mxv = Quad_MeshDataSub.Max;
                            }
                            if (Quad_MeshDataSub.Min < mnv) {
                                mnv = Quad_MeshDataSub.Min;
                            }
                        }
                    }
                }
                //親空間レベルの最大／最小値を設定
                let n = SP2 + Math.floor(i / 4);
                Quad_MeshData[n] = new Quad_Mesh_Info();
                Quad_MeshData[n].LackF = f;
                Quad_MeshData[n].Max = mxv;
                Quad_MeshData[n].Min = mnv;
            }
        }

    }

    //
    function Get_Quad_MeshCell(value, Qcell, SpaceLevel, Scell, n, max_PartitiopnLevel) {
        /// <signature>
        /// <summary>四分木から等値線にかかるメッシュを抜き出す再帰処理</summary>
        /// <param name="value">取得する等高線の数値</param>
        /// <param name="Qcell">取得する等高線の値がかかる四分木配列の位置の配列（戻り値）</param>
        /// <param name="SpaceLevel">調べる空間レベル（初回呼び出しは0）</param>
        /// <param name="Scell">調べるモートン番号開始位置（戻り値）</param>
        /// <param name="n">Qcellのメッシュ数。参照渡しにするため配列にする</param>
        /// <param name="max_PartitiopnLevel">最大分割レベル</param>
        /// </signature>
        if (SpaceLevel == 0) {
            //初回の呼び出し
            Qcell.length = Get_MortonArrayPosition( max_PartitiopnLevel);
            n[0] = 0;
            var Quad_MeshDataSub = Quad_MeshData[0];
            if ((Generic.Check_Two_Value_In(value, Quad_MeshDataSub.Min, Quad_MeshDataSub.Max) != chvValue_on_twoValue.chvOuter) && (Quad_MeshDataSub.LackF == false)) {
                Get_Quad_MeshCell(value, Qcell, SpaceLevel + 1, 0, n, max_PartitiopnLevel)
            }
        } else {
            var SP = Get_MortonArrayPosition( SpaceLevel);
            for (var i = 0; i <= 3 ; i++) {
                var Quad_MeshDataSub = Quad_MeshData[SP + Scell + i];
                if ((Generic.Check_Two_Value_In(value, Quad_MeshDataSub.Min, Quad_MeshDataSub.Max) != chvValue_on_twoValue.chvOuter) && (Quad_MeshDataSub.LackF == false)) {
                    //該当した場合
                    if (SpaceLevel == max_PartitiopnLevel - 1) {
                        //最大レベルの場合、四分木線形配列の位置をQcellに記憶
                        Qcell[n[0]] = SP + Scell + i;
                        n[0] ++;
                    } else {
                        //最大レベルでない場合は、さらに子レベルを調べる
                        Get_Quad_MeshCell(value, Qcell, SpaceLevel + 1, (Scell + i) * 4, n, max_PartitiopnLevel);
                    }
                }
            }
        }
    }

    function Get_PartitiopnLevel(xs, ys) {
        /// <signature>
        /// <summary>四分木の最大分割段階を決める</summary>
        /// <param name="xs">横メッシュ数</param>
        /// <param name="ys">縦メッシュ数</param>
        /// <returns type="Number" />
        /// </signature>
        let ms = Math.min(xs, ys);
        let i=1;
        let n;
        do{
            n = Math.floor(ms / Math.pow(2, i));
            i++;
        } while (n >= 20);
        if (i == 2) {
            i = 3;
        }
        return i-1;
    }
}

