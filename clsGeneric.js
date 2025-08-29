/// <reference path="main.js" />
/// <reference path="clsAttrData.js" />
/// <reference path="clsTime.js" />
/// <reference path="SortingSearch.js" />
/// <reference path="clsMapdata.js" />
/// <reference path="clsDraw.js" />


const EarthR  = 6370;
const chrLF = String.fromCharCode(10);

var SpatialPointType = {
    SinglePoint : 1,
    SPILine : 2,
    SPIRect : 3
}


var enmMatchingMode = {
    PerfectMatching: 0,
    PartialtMatching: 1
}

var cstRectangle_Cross = {
    //長方形間の関係を示す定数
cstOuter : -1,
cstCross : 0,
cstInner : 1,
cstInclusion : 2,
cstEqual : 3
}

var EllipPar = function () {
    this.a;
    this.f1;
    this.f;
    this.E;
    this.namec;
}
var TKY2JGDInfo=function() {
    var EP = new Array(3);
    var XY_Genten = new Array(20);
    var rad2deg = 57.2957795130823;
    var deg2rad = 0.0174532925199433;
    var HAF_PI = 1.5707963267949;
    var PID = 3.14159265358979;
    var TWO_PI = 6.28318530717959;
    var HAF_PI = 1.5707963267949;
    var ROBYO = 206264.806247;
    Set_EP_Parameter();

    //国土地理院技術資料 Ｈ・１－Ｎｏ．２「測地成果2000のための座標変換ソフトウェアTKY2JGD」によるTKY2JGDソース・コードを利用
     this.Tokyo97toITRF94=function(latlonP) {
        // Ver.1.1  1999/1/28  (C) Mikio TOBITA 飛田幹男，国土地理院
        // 「3ﾊﾟﾗﾒｰﾀによる」Tokyo97系からITRF94系への座標変換を行う。
        //  この変換では楕円体高Hはゼロとする。
        // by 飛田幹男
        // 入力　B1    : 緯度(度)
        // 　　　L1    : 経度(度)
        // 出力　B2    : 緯度(度)
        // 　　　L2    : 経度(度)
        let B1 = latlonP.lat;
        let L1 = latlonP.lon;

        let Brad = B1 * deg2rad;
        let ALrad = L1 * deg2rad;

        //緯度，経度から三次元直交座標系(X,Y,Z)への換算
        let xyz1= BLHXYZcalc(Brad, ALrad, 0, EP[1]) //EP(1):Bessel楕円体
        //三次元直交座標系(X,Y,Z)から三次元直交座標系(X,Y,Z)への座標変換
         let xyz2 = xyz2xyz(xyz1)
        //三次元直交座標系(X,Y,Z)から緯度，経度への換算
         let retV = XYZBLHcalc(xyz2, EP[2]); //EP(2):GRS-80楕円体

         let B2 = retV.Brad * rad2deg;
         let L2 = retV.ALrad * rad2deg;
         return new latlon(B2, L2);
    }

    this.ITRF94toTokyo97 = function (latlonP) {
        let B1 = latlonP.lat;
        let L1 = latlonP.lon;
        let Brad = B1 * deg2rad;
        let ALrad = L1 * deg2rad;
        let xyz1 = BLHXYZcalc(Brad, ALrad, 0, EP[2]);
        let xyz2 = xyz2xyzR(xyz1);
        let retV = XYZBLHcalc(xyz2, EP[1])

        xyz1 = BLHXYZcalc(retV.Brad, retV.ALrad, -retV.H, EP[2]);
        xyz2 = xyz2xyzR(xyz1);
        retV = XYZBLHcalc(xyz2, EP[1]);
        let B2 = retV.Brad * rad2deg;
        let L2 = retV.ALrad * rad2deg;
        return new latlon(B2, L2);
    }

    this.doCalcXy2bl = function (Ellip12, Kei, X, Y) {
        let M0  //Kei    //系番号，基準子午線の縮尺係数
        let cB1 , cL1    //原点の緯度，経度。c = combo box
        let B1 , L1      //原点の緯度，経度。基本的にradian
        let b , L        //求める緯度，経度。基本的にradian
        let Bdeg , Ldeg  //求める緯度，経度。基本的にdeg
        let Gamma                 //=γ 子午線収差角。radian
        let Gammadeg              //真北方向角。deg
        let MMM                   //縮尺係数
        let D , AM , s , SN , SNS 
        let AEE , CEE , Ep2 
        let AJ , BJ , CJ , DJ , EJ 
        let FJ , GJ , HJ , IJ 
        let S0                    //赤道から座標原点までの子午線弧長
        let M 
        let Eta2 , M1 , N1          //phi1の関数
        let Eta2phi , Mphi , Nphi   //phi(=B)の関数
        let T , T2 , T4 , T6 
        let e2 , e4 , e6 , e8 , e10 
        let e12 , e14 , e16 
        let S1 , phi1 , oldphi1 , icount 
        let Bunsi , Bunbo 
        let YM0 , N1CosPhi1 
        let EPs = new EllipPar();

        M0 = 0.9999;
        EPs.a = EP[Ellip12].a
        EPs.f1 = EP[Ellip12].f1
        EPs.f = EP[Ellip12].f
        EPs.E = EP[Ellip12].E
        EPs.namec = EP[Ellip12].namec
        e2 = EPs.E
        e4 = e2 * e2
        e6 = e4 * e2
        e8 = e4 * e4
        e10 = e8 * e2
        e12 = e8 * e4
        e14 = e8 * e6
        e16 = e8 * e8

        //定数項 the same as bl2xy
        AEE = EPs.a * (1.0 - EPs.E) //a(1-e2)
        CEE = EPs.a / Math.Sqrt(1.0 - EPs.E)   //C=a*sqr(1+e'2)=a / sqr(1 - e2)
        Ep2 = EPs.E / (1.0 - EPs.E) //e'2(e prime 2) Eta2を計算するため

        AJ = 4927697775.0 / 7516192768.0 * e16
        AJ = AJ + 19324305.0 / 29360128.0 * e14
        AJ = AJ + 693693.0 / 1048576.0 * e12
        AJ = AJ + 43659.0 / 65536.0 * e10
        AJ = AJ + 11025.0 / 16384.0 * e8
        AJ = AJ + 175.0 / 256.0 * e6
        AJ = AJ + 45.0 / 64.0 * e4
        AJ = AJ + 3.0 / 4.0 * e2
        AJ = AJ + 1.0
        BJ = 547521975.0 / 469762048.0 * e16
        BJ = BJ + 135270135.0 / 117440512.0 * e14
        BJ = BJ + 297297.0 / 262144.0 * e12
        BJ = BJ + 72765.0 / 65536.0 * e10
        BJ = BJ + 2205.0 / 2048.0 * e8
        BJ = BJ + 525.0 / 512.0 * e6
        BJ = BJ + 15.0 / 16.0 * e4
        BJ = BJ + 3.0 / 4.0 * e2
        CJ = 766530765.0 / 939524096.0 * e16
        // CJ = CJ + 45090045 / 5870256 * e14 精密測地網一次基準点測量作業規定の誤りによるバグ
        CJ = CJ + 45090045.0 / 58720256.0 * e14
        CJ = CJ + 1486485.0 / 2097152.0 * e12
        CJ = CJ + 10395.0 / 16384.0 * e10
        CJ = CJ + 2205.0 / 4096.0 * e8
        CJ = CJ + 105.0 / 256.0 * e6
        CJ = CJ + 15.0 / 64.0 * e4
        DJ = 209053845.0 / 469762048.0 * e16
        DJ = DJ + 45090045.0 / 117440512.0 * e14
        DJ = DJ + 165165.0 / 524288.0 * e12
        DJ = DJ + 31185.0 / 131072.0 * e10
        DJ = DJ + 315.0 / 2048.0 * e8
        DJ = DJ + 35.0 / 512.0 * e6
        EJ = 348423075.0 / 1879048192.0 * e16
        EJ = EJ + 4099095.0 / 29360128.0 * e14
        EJ = EJ + 99099.0 / 1048576.0 * e12
        EJ = EJ + 3465.0 / 65536.0 * e10
        EJ = EJ + 315.0 / 16384.0 * e8
        FJ = 26801775.0 / 469762048.0 * e16
        FJ = FJ + 4099095.0 / 117440512.0 * e14
        FJ = FJ + 9009.0 / 524288.0 * e12
        FJ = FJ + 693.0 / 131072.0 * e10
        GJ = 11486475.0 / 939524096.0 * e16
        GJ = GJ + 315315.0 / 58720256.0 * e14
        GJ = GJ + 3003.0 / 2097152.0 * e12
        HJ = 765765.0 / 469762048.0 * e16
        HJ = HJ + 45045.0 / 117440512.0 * e14
        IJ = 765765.0 / 7516192768.0 * e16


        B1 = XY_Genten(Kei).CenterB * deg2rad
        L1 = XY_Genten(Kei).CenterL * deg2rad

  

        //赤道からの子午線長の計算
        S0= MeridS(B1, AEE, AJ, BJ, CJ, DJ, EJ, FJ, GJ, HJ, IJ ) //赤道から座標原点までの子午線弧長
        M = S0 + X / M0

        //Baileyの式による異性緯度（isometric latitude）phi1の計算。
        //「精密測地網一次基準点測量計算式」P57の11.(1)の式から。
        //この式と「現代測量学１ 測量の数学的基礎」P102の式とは，Cos(phi1)だけ異なる。
        //この式を導入したためベッセル楕円体以外で往復計算OKとなった。
        icount = 0
        phi1 = B1
        do {
            icount++;
            oldphi1 = phi1
            S1 = MeridS(phi1, AEE, AJ, BJ, CJ, DJ, EJ, FJ, GJ, HJ, IJ) //赤道から点までの子午線弧長
            Bunsi = 2.0 * (S1 - M) * (1.0 - EPs.E * Math.sin(phi1) * Math.sin(phi1)) ** 1.5
            Bunbo = 3.0 * EPs.E * (S1 - M) * Math.sin(phi1) * Math.cos(phi1) * Math.sqrt(1.0 - EPs.E * Math.sin(phi1) * Math.sin(phi1)) - 2.0 * EPs.a * (1.0 - EPs.E)
            phi1 = phi1 + Bunsi / Bunbo
        } while ((Math.abs(phi1 - oldphi1) >= 0.00000000000001) && (icount < 100)) //本では1e-12で十分　iterationの回数は４回

        //何度も使う式を変数に代入
        YM0 = Y / M0
        T = Math.tan(phi1)  //「精密測地網一次基準点測量計算式」P51のt1に等しい
        T2 = T * T
        T4 = T2 * T2
        T6 = T4 * T2
        Eta2 = Ep2 * Math.cos(phi1) * Math.cos(phi1)     //=η1*η1
        M1 = CEE / Math.sqrt((1.0 + Eta2) ** 3.0)
        N1 = CEE / Math.sqrt(1.0 + Eta2)
        N1CosPhi1 = N1 * Math.cos(phi1)

        //緯度Bの計算 「精密測地網一次基準点測量計算式」P51のphiを求める式より
        b = ((1385.0 + 3633.0 * T2 + 4095 * T4 + 1575.0 * T6) / (40320.0 * N1 ** 8.0)) * YM0 ** 8.0
        b = b - ((61.0 + 90.0 * T2 + 45 * T4 + 107.0 * Eta2 - 162.0 * T2 * Eta2 - 45.0 * T4 * Eta2) / (720.0 * N1 ** 6.0)) * YM0 ** 6.0
        b = b + ((5.0 + 3.0 * T2 + 6.0 * Eta2 - 6.0 * T2 * Eta2 - 3.0 * Eta2 ** 2 - 9.0 * T2 * Eta2 ** 2) / (24.0 * N1 ** 4.0)) * YM0 ** 4.0
        b = b - ((1.0 + Eta2) / (2.0 * N1 ** 2.0)) * YM0 ** 2.0
        b = b * T
        b = b + phi1

        //経度Lの計算 「精密測地網一次基準点測量計算式」P51のΔλを求める式より
        L = -((61.0 + 662.0 * T2 + 1320.0 * T4 + 720.0 * T6) / (5040.0 * N1 ** 6.0 * N1CosPhi1)) * YM0 ** 7.0
        L = L + ((5.0 + 28.0 * T2 + 24.0 * T4 + 6.0 * Eta2 + 8.0 * T2 * Eta2) / (120.0 * N1 ** 4.0 * N1CosPhi1)) * YM0 ** 5.0
        L = L - ((1.0 + 2.0 * T2 + Eta2) / (6.0 * N1 ** 2.0 * N1CosPhi1)) * YM0 ** 3.0
        L = L + (1.0 / N1CosPhi1) * YM0
        L = L + L1

        //子午線収差角の計算 「精密測地網一次基準点測量計算式」P51のγを求める式より
        Gamma = ((1.0 + T2) * (2.0 + 3.0 * T2) / (15.0 * N1 ** 5.0)) * (Y / M0) ** 5.0
        Gamma = Gamma - ((1.0 + T2 - Eta2) / (3.0 * N1 ** 3.0)) * (Y / M0) ** 3.0
        Gamma = Gamma + (1.0 / N1) * Y / M0
        Gamma = Gamma * T

        //縮尺係数の計算 「精密測地網一次基準点測量計算式」P51のmを求める式より
        Eta2phi = Ep2 * Math.cos(b) * Math.cos(b)     //=η*η。Bはphiと同じ。
        Mphi = CEE / Math.sqrt((1.0 + Eta2phi) ** 3.0)
        Nphi = CEE / Math.sqrt(1.0 + Eta2phi)
        MMM = Y ** 4.0 / (24.0 * Mphi * Mphi * Nphi * Nphi * M0 ** 4.0)
        MMM = MMM + Y * Y / (2.0 * Mphi * Nphi * M0 ** 2.0)
        MMM = MMM + 1.0
        MMM = MMM * M0

        //出力
        Bdeg = b * rad2deg
        Ldeg = L * rad2deg

        return new latlon(Bdeg, Ldeg);
    }

    function MeridS(Phi, AEE, AJ, BJ, CJ, DJ, EJ, FJ, GJ, HJ, IJ) {
        let SS;
        SS = IJ / 16.0 * Math.sin(16.0 * Phi);
        SS = SS - HJ / 14.0 * Math.sin(14.0 * Phi);
        SS = SS + GJ / 12.0 * Math.sin(12.0 * Phi);
        SS = SS - FJ / 10.0 * Math.sin(10.0 * Phi);
        SS = SS + EJ / 8.0 * Math.sin(8.0 * Phi);
        SS = SS - DJ / 6.0 * Math.sin(6.0 * Phi);
        SS = SS + CJ / 4.0 * Math.sin(4.0 * Phi);
        SS = SS - BJ / 2.0 * Math.sin(2.0 * Phi);
        SS = SS + AJ * Phi
        return SS;
    }
    function xyz2xyzR(xyz) {
        T1 = 14641.4
        T2 = -50733.7
        T3 = -68050.7
        let T1real = T1 * 0.01
        let T2real = T2 * 0.01
        let T3real = T3 * 0.01 
        let x2 = xyz.x + T1real
        let y2 = xyz.y + T2real
        let z2 = xyz.z + T3real
        return new point3(x2, y2, z2);
    }

    function XYZBLHcalc(xyz,  EP) {
        let x = xyz.x;
        let y = xyz.y;
        let z = xyz.z;

        let a = EP.a;
        let fi = EP.f1;
        let E = EP.E;

        let P2 = x * x + y * y;
        let p = Math.sqrt(P2);
        if (p == 0) {
            return;
        }
        let ALradV;
        if (x == 0) {
            ALradV = HAF_PI;
        } else {
            ALradV = Math.atan(y / x)
        }
        if (x < 0) {
            ALradV += PID;
        }
        if (ALradV > PID) {
            ALradV -= TWO_PI;
        }

        let r = Math.sqrt(P2 + z * z);
        let myu = Math.atan((z / p) * (1.0 - (1.0 / fi) + E * a / r));
        let myus3 = Math.sin(myu);
        myus3 = myus3 * myus3 * myus3;
        myuc3 = Math.cos(myu);
        myuc3 = myuc3 * myuc3 * myuc3;
        let BradV = Math.atan((z * (1.0 - 1.0 / fi) + E * a * myus3) / ((1.0 - 1.0 / fi) * (p - E * a * myuc3)));
        let Hv = p * Math.cos(BradV) + z * Math.sin(BradV) - a * Math.sqrt(1.0 - E * Math.sin(BradV) * Math.sin(BradV));    //楕円体高

        return { Brad: BradV, ALrad: ALradV,H:Hv};
    }

    function xyz2xyz(xyz) {
        let T1 = -14641.4
       let T2 = 50733.7
        letT3 = 68050.7
        let T1real = T1 * 0.01  
        let T2real = T2 * 0.01
        let T3real = T3 * 0.01 
        let x2 = xyz.x + T1real
        let y2 = xyz.y + T2real
        let z2 = xyz.z + T3real
        return new point3(x2, y2, z2);
    }

    function BLHXYZcalc(Brad, ALrad, H, EP) {

        let a = EP.a
        let fi = EP.f1
        let E = EP.E
        let CB = Math.cos(Brad);
        let SB = Math.sin(Brad);
        let CL = Math.cos(ALrad);
        let SL = Math.sin(ALrad)
        let w = Math.sqrt(1.0 - E * SB * SB);
        let an = a / w;
        x = (an + H) * CB * CL;
        y = (an + H) * CB * SL;
        z = (an * (1.0 - E) + H) * SB;
        return new point3(x, y, z);
    }

    function Set_EP_Parameter() {
        EP[1]=new EllipPar();
        EP[2] = new EllipPar();
        
        EP[1].a = 6377397.155;
        EP[1].f1 = 299.152813;
        EP[1].namec = "Bessel";
        EP[1].f = 1.0/ EP[1].f1;
        EP[1].E = (2.0 * EP[1].f1 - 1.0) / EP[1].f1 / EP[1].f1; //=e*e [squared e]
        EP[2].a = 6378137.0;
        EP[2].f1 = 298.257222101;
        EP[2].namec = "GRS-80";
        EP[2].f = 1.0 / EP[2].f1;
        EP[2].E = (2.0 * EP[2].f1 - 1.0) / EP[2].f1 / EP[2].f1; //=e*e [squared e]

        for (let i = 1; i < 20; i++) {
            XY_Genten[i] = new latlon();
        }
        XY_Genten[1].lat = 33;
        XY_Genten[1].lon = 129.5;
        XY_Genten[2].lat = 33;
        XY_Genten[2].lon = 131;
        XY_Genten[3].lat = 36;
        XY_Genten[3].lon = 132 + 10 / 60;
        XY_Genten[4].lat = 33;
        XY_Genten[4].lon = 133.5;
        XY_Genten[5].lat = 36;
        XY_Genten[5].lon = 134 + 20 / 60;
        XY_Genten[6].lat = 36;
        XY_Genten[6].lon = 136;
        XY_Genten[7].lat = 36;
        XY_Genten[7].lon = 137 + 10 / 60;
        XY_Genten[8].lat = 36;;
        XY_Genten[8].lon = 138.5;
        XY_Genten[9].lat = 36;
        XY_Genten[9].lon = 139 + 50 / 60;
        XY_Genten[10].lat = 40;
        XY_Genten[10].lon = 140 + 50 / 60;
        XY_Genten[11].lat = 44;
        XY_Genten[11].lon = 140 + 15 / 60;
        XY_Genten[12].lat = 44;
        XY_Genten[12].lon = 142 + 15 / 60;
        XY_Genten[13].lat = 44;
        XY_Genten[13].lon = 144 + 15 / 60;
        XY_Genten[14].lat = 26;
        XY_Genten[14].lon = 142;
        XY_Genten[15].lat = 26;
        XY_Genten[15].lon = 127.5;
        XY_Genten[16].lat = 26;
        XY_Genten[16].lon = 124;
        XY_Genten[17].lat = 26;
        XY_Genten[17].lon = 131;
        XY_Genten[18].lat = 20;
        XY_Genten[18].lon = 136;
        XY_Genten[19].lat = 26;
        XY_Genten[19].lon = 154;
    }
}

class spatial {

    /**メッシュコードから投影変換した四角形を返す */
    static Get_MeshCode_Rectangle(Meshcode ,  MeshType ,  refOrigin,refDestZahyo){
        let RectLatLon  = spatial.Get_Ido_Kedo_from_MeshCode(Meshcode, MeshType);
        RectLatLon.NorthWest = spatial.ConvertRefSystemLatLon(RectLatLon.NorthWest, refOrigin, refDestZahyo.System);
        RectLatLon.SouthEast = spatial.ConvertRefSystemLatLon(RectLatLon.SouthEast, refOrigin, refDestZahyo.System);
        let P=[];
        P[0] = spatial.Get_Converted_XY(RectLatLon.NorthWest.toPoint(), refDestZahyo);
        P[1] = spatial.Get_Converted_XY(RectLatLon.NorthEast().toPoint(), refDestZahyo);
        P[2] = spatial.Get_Converted_XY(RectLatLon.SouthEast.toPoint(), refDestZahyo);
        P[3] = spatial.Get_Converted_XY(RectLatLon.SouthWest().toPoint(), refDestZahyo);
        return { convRect: spatial.getCircumscribedRectangle(P), latlonBox: RectLatLon, RPoint: P };
    }

    /**地図座標のXYから緯度経度にして距離測定 */
    static Distance_Ido_Kedo_XY_Point(P1, P2, MapDTMapZahyo) {
        let D1 = this.Get_Reverse_XY(P1, MapDTMapZahyo);
        let D2 = this.Get_Reverse_XY(P2, MapDTMapZahyo);
        return this.Distance_Ido_Kedo_LatLon(D1.toLatlon(), D2.toLatlon());
    }

    /**緯度経度で地点間の距離を求める */
    static Distance_Ido_Kedo_LatLon(D1, D2) {
        if (D1.Equals(D2)) {
            return 0;
        } else {
            let DV = Math.sqrt((Math.cos((D1.lat + D2.lat) * Math.PI / 180 / 2) * Math.sin((D1.lon - D2.lon) * Math.PI / 180 / 2)) ** 2 + 
                (Math.sin((D1.lat - D2.lat) * Math.PI / 180 / 2) * Math.cos((D1.lon - D2.lon) * Math.PI / 180 / 2)) ** 2)

            return 2 * EarthR * Math.atan(DV / Math.sqrt(-DV * DV + 1));
        }
    }

    /**二つの線分の交点を求める関数。交点がある場合座標、ない場合undefined */
    static Line_Cross_Point(LAP1, LAP2, LBP1, LBP2) {
        let ax1 = LAP1.x
        let ay1 = LAP1.y
        let ax2 = LAP2.x
        let ay2 = LAP2.y
        let bx1 = LBP1.x
        let by1 = LBP1.y
        let bx2 = LBP2.x
        let by2 = LBP2.y
        //２点が同一、または２線が平行の場合は戻る
        if (((ax2 == ax1) && (bx2 == bx1)) || ((ay2 == ay1) && (by2 == by1)) || (
            (ax1 == bx1) && (ay1 == by1)) || ((ax2 == bx1) && (ay2 == by1)) || ((ax1 == bx2) && (ay1 == by2)) || ((ax2 == bx2) && (ay2 == by2))) {
            return undefined;
        }

        if ((ax2 == ax1) || (bx2 == bx1)) {
            //どちらかがY軸に平行の場合
            if (bx2 == bx1) {
                //B線の場合はAB入れ替えてA線を平行に
                [bx1, ax1] = [ax1, bx1];
                [bx2, ax2] = [ax2, bx2];
                [by1, ay1] = [ay1, by1];
                [by2, ay2] = [ay2, by2];
            }
            if (Generic.Check_Two_Value_In(ax1, bx1, bx2) == chvValue_on_twoValue.chvIN) {
                //交点のY座標を求める
                let BL = (by2 - by1) / (bx2 - bx1);
                let bm = by1 - BL * bx1;
                let px = ax1;
                let py = BL * px + bm;
                if ((Generic.Check_Two_Value_In(py, ay1, ay2) != chvValue_on_twoValue.chvOuter) && (
                    Generic.Check_Two_Value_In(py, by1, by2) != chvValue_on_twoValue.chvOuter)) {
                    //Y座標がAB線の内部だったら交差
                    return new point(px, py);;
                }
            }
            return undefined;
        } else if ((ay2 == ay1) || (by2 == by1)) {
            //どちらかがX軸に平行の場合
            if (by2 == by1) {
                //B線の場合はAB入れ替えてA線を平行に
                [bx1, ax1] = [ax1, bx1];
                [bx2, ax2] = [ax2, bx2];
                [by1, ay1] = [ay1, by1];
                [by2, ay2] = [ay2, by2];
            }
            if (Generic.Check_Two_Value_In(ay1, by1, by2) != chvValue_on_twoValue.chvOuter) {
                //交点のX座標を求める
                let BL = (by2 - by1) / (bx2 - bx1);
                let bm = by1 - BL * bx1;
                let py = ay1;
                let px = (py - bm) / BL;
                if ((Generic.Check_Two_Value_In(px, ax1, ax2) != chvValue_on_twoValue.chvOuter) && (
                    Generic.Check_Two_Value_In(px, bx1, bx2) != chvValue_on_twoValue.chvOuter)) {
                    //X座標がAB線の内部だったら交差
                    return new point(px, py);
                }
            }
            return undefined;
        } else {
            let AL = (ay2 - ay1) / (ax2 - ax1);
            let BL = (by2 - by1) / (bx2 - bx1);
            if (AL == BL) {
                //傾きが等しいと交差しない
                return undefined;
            }
            let AM = ay1 - AL * ax1;
            let bm = by1 - BL * bx1;
            let px = (bm - AM) / (AL - BL);
            let py = AL * px + AM;
            if (((ax1 == px) && (ay1 == py)) || ((ax2 == px) && (ay2 == py)) || ((bx1 == px) && (by1 == py)) || ((bx2 == px) && (by2 == py))) {
            } else {
                if ((Generic.Check_Two_Value_In(px, ax1, ax2) != chvValue_on_twoValue.chvOuter) && (Generic.Check_Two_Value_In(py, ay1, ay2) != chvValue_on_twoValue.chvOuter)) {
                    if ((Generic.Check_Two_Value_In(px, bx1, bx2) != chvValue_on_twoValue.chvOuter) && (
                        Generic.Check_Two_Value_In(py, by1, by2) != chvValue_on_twoValue.chvOuter)) {
                        //交点が２線の内部だったら交差
                        return new point(px, py);
                    }
                }
            }
            return undefined;
        }
    }

    /** 指定したベクトルと垂直のベクトルを取得*/
    static Get_Suisen_Vec(Vx, Vy) {
        return { rVx: -Vy, rVy: Vx };
    }

    /**ベクトルVecX,VecY方向に距離D離れた地点の座標を取得 */
    static Get_Vec_Point(VecX , VecY ,Dis , CenterFlag){
            let D ;
            if(CenterFlag ==true ){
                D = Dis / 2;
            }else{
                D = Dis;
            }
    
            let x2 , y2 ;
            if(VecX == 0 ){
                x2 = 0;
                y2 = D * Math.sign(VecY);
            }else if(VecY == 0 ){
                x2 = D * Math.sign(VecX);
                y2 = 0;
            }else{
                x2 = (D * VecX) / Math.sqrt(VecY ** 2 + VecX ** 2);
                y2 = x2 * VecY / VecX;
            }
            return new point(x2, y2);
    }

    //四角形に点が入らない場合，入るように座標を修正して返す
    static checkAndModifyPointInRect(p,rect){
        let np =p.Clone();
        if(np.x < rect.left ){
            np.x = rect.left;
        }
        if(np.x > rect.right ){
            np.x = rect.right;
        }
        if(np.y < rect.top ){
            np.y = rect.top;
        }
        if(np.y > rect.bottom ){
            np.y = rect.bottom;
        }
        return np;
    }
    /**  ポリゴン内に指定の地点が含まれる場合ok:true,CrossPoint_Xに交点x座標を返す*/
    static check_Point_in_Polygon(checkPoint ,  PolyLine ){

        let CrossPoint_X = [];
        let f = false;
        for (let p = 0; p < PolyLine.length; p++) {
            let LinePoints = PolyLine[p];
            for (let i = 0; i < LinePoints.length-1; i++) {
                let cret = Get_CrossXPoint(checkPoint, LinePoints[i], LinePoints[i + 1]);
                if (cret.ok == true) {
                    CrossPoint_X.push(cret.CrossX);
                }
            }
        }
        //調査地点のX座標が交点の偶数番目の後に来る場合はtrue
        CrossPoint_X.sort(function(a,b){return (a-b)}); //小大に並べ替え
        for(let j  = 0 ;j< CrossPoint_X.length - 1 ;j+=2){
            if(( CrossPoint_X[j] <= checkPoint.x)&&(checkPoint.x <= CrossPoint_X[j + 1]) ){
                f=true;
                break;
            }
        }
        let retV ={ok:f,
            CrossPoint_X:CrossPoint_X
        }
        return retV;
        //水平線アルゴリズムで、線分と調査地点の座標との水平線上のX座標を求める。Y範囲がずれていた場合はfalse
        function Get_CrossXPoint(checkPoint ,  LinePoint1 ,  LinePoint2  ){
            let x  = checkPoint.x;
            let y  = checkPoint.y;
            let ay  = LinePoint1.y;
            let by  = LinePoint2.y;
            let f;
            let CrossX;
            if(( (ay <= y)&&(y < by))||( (by <= y)&&(y < ay) )){
                let BX  = LinePoint2.x;
                let ax  = LinePoint1.x;
                if( ay == by ){
                    CrossX = ax;
                }else{
                    CrossX = (ax - BX) / (ay - by) * (y - ay) + ax;
                }
                f=true;
            }else{
                f=false;
            }
            let retV ={ok:f,
                CrossX:CrossX
            }
            return retV;
        }
    }

    //地図座標が緯度経度に変換可能かチェックする
    static Check_PsitionReverse_Enable(Position, MPDataMapZahyo) {
        let f;
        switch (MPDataMapZahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode:
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                f = true;
                break;
            }
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                let oy = Position.y;
                f = true;
                switch (MPDataMapZahyo.Projection) {
                    case enmProjection_Info.prjSanson:
                    case enmProjection_Info.prjSeikyoEntou: {
                        if (Math.abs(oy / EarthR * 180 / Math.PI) > 90) {
                            f = false;
                        }
                        break;
                    }
                    case enmProjection_Info.prjMercator: {
                        //メルカトル図法ではyは無限大でtrue
                        break;
                    }
                    case enmProjection_Info.prjLambertSeisekiEntou: {
                        let tx = -oy / EarthR;
                        if (Math.abs(Math.atan(tx / Math.sqrt(-tx * tx + 1)) * 180 / Math.PI) > 90) {
                            f = false;
                        }
                        break;
                    }
                    case enmProjection_Info.prjMollweide: {
                        if (Math.abs(Position.y) > (Math.sqrt(2) * EarthR - 0.001)) {
                            f = false;
                        }
                        break;
                    }
                    case enmProjection_Info.prjEckert4: {
                        if (Math.abs(Position.y) > (1.3265004 * EarthR - 0.001)) {
                            f = false;
                        }
                        break;
                    }
                }
                break;
            }
        }
        return f;
    }


    //メッシュコードからメッシュの四角形緯度経度を求める
    static Get_Ido_Kedo_from_MeshCode(MeshCode, Mesh_Size) {
        MeshCode = (MeshCode + "0000000000").left(11);
        let id1 = Number(MeshCode.substr(0, 2));
        let id2 = Number(MeshCode.substr(4, 1));
        let id3 = Number(MeshCode.substr(6, 1));
        let kd1 = Number(MeshCode.substr(2, 2));
        let kd2 = Number(MeshCode.substr(5, 1));
        let kd3 = Number(MeshCode.substr(7, 1));
        let V2 = Number(MeshCode.substr(8, 1));
        let V4 = Number(MeshCode.substr(9, 1));
        let v8 = Number(MeshCode.substr(10, 1));
        let Ido = id1 / 1.5 + (id2 / 8) * (40 / 60) + (id3 / 10) * (5 / 60);
        let kdo = kd1 + 100 + (kd2 / 8) + (kd3 / 10) * (7.5 / 60);
        if (Mesh_Size == enmMesh_Number.mhOne_Tenth) {
            Ido = Ido + V2 * (30 / 3600) / 10;
            kdo = kdo + V4 * (45 / 3600) / 10;
        } else {
            if ((V2 == 3) || (V2 == 4)) {
                //1/2メッシュの北側
                Ido = Ido + (15 / 3600);
            }
            if ((V2 == 2) || (V2 == 4)) {
                //1/2メッシュの東側
                kdo = kdo + (22.5 / 3600);
            }
            if ((V4 == 3) || (V4 == 4)) {
                //1/4メッシュの北側
                Ido = Ido + (7.5 / 3600);
            }
            if ((V4 == 2) || (V4 == 4)) {
                //1/4メッシュの東側
                kdo = kdo + (11.25 / 3600);
            }
            if ((v8 == 3) || (v8 == 4)) {
                Ido = Ido + (3.75 / 3600);
            }
            if ((v8 == 2) || (v8 == 4)) {
                kdo = kdo + (5.625 / 3600);
            }
        }

        let meshWH = this.Get_MeshCode_Size_IdoKedo(Mesh_Size);
        return new latlonbox(new latlon(Ido + meshWH.height, kdo), new latlon(Ido, (kdo + meshWH.width)));
    }

    //メッシュの東西南北の幅を取得
    static Get_MeshCode_Size_IdoKedo(Mesh_Size) {
        let Xplus;
        let YPlus;

        switch (Mesh_Size) {
            case enmMesh_Number.mhFirst: {
                Xplus = 450 * 8 / 3600;
                YPlus = 300 * 8 / 3600;
                break;
            }
            case enmMesh_Number.mhSecond: {
                Xplus = 450 / 3600;
                YPlus = 300 / 3600;
                break;
            }
            case enmMesh_Number.mhThird:
            case enmMesh_Number.mhHalf:
            case enmMesh_Number.mhQuarter:
            case enmMesh_Number.mhOne_Eighth:
            case enmMesh_Number.mhOne_Tenth: {
                Xplus = 45 / 3600;
                YPlus = 30 / 3600;
                switch (Mesh_Size) {
                    case enmMesh_Number.mhHalf: {
                        Xplus = Xplus / 2;
                        YPlus = YPlus / 2;
                        break;
                    }
                    case enmMesh_Number.mhQuarter: {
                        Xplus = Xplus / 4;
                        YPlus = YPlus / 4;
                        break;
                    }
                    case enmMesh_Number.mhOne_Eighth: {
                        Xplus = Xplus / 8;
                        YPlus = YPlus / 8;
                        break;
                    } case enmMesh_Number.mhOne_Tenth:
                        Xplus = Xplus / 10;
                        YPlus = YPlus / 10;
                        break;
                }
            }
        }
        return new size(Xplus, YPlus);
    }

    //投影法の緯度に応じたスケール値の倍率を取得
    static Get_Scale_Baititu_IdoKedo(p, MPDataMapZahyo) {
        let v;
        switch (MPDataMapZahyo.Mode){
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                switch (MPDataMapZahyo.Projection) {
                    case enmProjection_Info.prjSanson: {
                        v = 1;
                        break;
                    }
                    case enmProjection_Info.prjMollweide:
                    case enmProjection_Info.prjEckert4: {
                        let newP = this.Get_Reverse_XY(p, MPDataMapZahyo);
                        let PA1 = this.Get_Converted_XY(new point(0, 0), MPDataMapZahyo);
                            let PA2 = this.Get_Converted_XY(new point(180, 0), MPDataMapZahyo);
                        let PB1 = this.Get_Converted_XY(new point(0, newP.y), MPDataMapZahyo);
                        let PB2 = this.Get_Converted_XY(new point(180, newP.y), MPDataMapZahyo);
                        let chk  = (Math.PI * EarthR) / (PA2.x - PA1.x)
                        let v2 = (PA2.x - PA1.x) / (PB2.x - PB1.x);
                        v = v2 / chk;
                        break;
                    }
                    case enmProjection_Info.prjSeikyoEntou:
                    case enmProjection_Info.prjMercator:
                    case enmProjection_Info.prjMiller:
                    case enmProjection_Info.prjLambertSeisekiEntou: {
                        let newP = this.Get_Reverse_XY(p, MPDataMapZahyo);
                        let Ido = Generic.m_min_max(newP.y, -89.9, 89.9);
                        v = 1 / Math.cos(Ido * Math.PI / 180);
                    }
                }
                break;
            }
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                v = 1;
                break;
            }
            case enmZahyo_mode_info.Zahyo_No_Mode: {
                v = 1;
                break;
            }
        }
        return v;
    }

    //測地系をチェックして、違っていたら変換して返す
    static ConvertRefSystemLatLon(P1, OriginRefSystem, DestRefSystem) {
        if (OriginRefSystem == DestRefSystem) {
            return P1;
        } else {
        //測地系が違う場合は、データ中の緯度経度を地図の測地系に合わせて変換して代表点に
            let P2;
            switch (OriginRefSystem) {
                case (enmZahyo_System_Info.Zahyo_System_tokyo): {
                    P2 = this.Tokyo97toITRF94(P1);
                    break;
                }
                case (enmZahyo_System_Info.Zahyo_System_World): {
                    P2 = this.ITRF94toTokyo97(P1);
                    break;
                }
            }
            return P2;
        }
    }

    //扇形の座標を求める
    static Get_Fan_Coordinates(CP, r, start_p, end_p, CenterLineF) {
        let ST = 1 / (r * 2 / 5);
        let pxy = [];

        if (((start_p == 0) && (end_p == Math.PI * 2)) || (CenterLineF == false)) {
        } else {
            pxy[0] = CP;
        }

        if (end_p - start_p < ST) {
            pxy.push(new point(r * Math.sin(start_p) + CP.x, -r * Math.cos(start_p) + CP.y));
        } else {
            for (let i = start_p; i < end_p - ST; i += ST) {
                pxy.push(new point(r * Math.sin(i) + CP.x, -r * Math.cos(i) + CP.y))
            }
        }
        pxy.push(new point(r * Math.sin(end_p) + CP.x, -r * Math.cos(end_p) + CP.y));
        if ((start_p == 0) && (end_p == Math.PI * 2) || (CenterLineF == false)) {
        } else {
            pxy.push(CP.Clone());
        }
        return pxy;
    }

    //世界測地系の緯度経度の座標に変換して返す
    static Get_World_IdoKedo(oxy, MapZahyo_Info) {
        let x2, y2;
        let LatLon = new latlon();

        if (MapZahyo_Info.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) {
            let Ellip12;
            //平面直角座標系の場合は緯度経度に変換
            if (MapZahyo_Info.System == enmZahyo_System_Info.Zahyo_System_tokyo) {
                Ellip12 = 1;
            } else {
                if (MapZahyo_Info.System == enmZahyo_System_Info.Zahyo_System_World) {
                    Ellip12 = 2;
                }
            }
            let Kei = MapZahyo_Info.HeimenTyokkaku_KEI_Number;
            TKY2JGDInfo.doCalcXy2bl(Ellip12, Kei, oxy.y, oxy.x, y2, x2);
            LatLon.lon = x2;
            LatLon.lat = y2;
        } else {
            LatLon.lat = oxy.y;
            LatLon.lon = oxy.x;
        }

        if(MapZahyo_Info.System == enmZahyo_System_Info.Zahyo_System_tokyo ){
        //日本測地系の場合は世界測地系に変換
            TKY2JGDInfo.Tokyo97toITRF94(LatLon.lat, LatLon.lon, y2, x2);
            LatLon.lon = x2;
            LatLon.lat = y2;
        }
        return LatLon;
    }
    //地図座標を新しい設定の地図座標に変換する
    static Get_Reverse_and_Convert_XY(OldP, oldMapZahyo, newMapZahyo) {
        if (oldMapZahyo.Mode == enmZahyo_mode_info.Zahyo_No_Mode) {
            return OldP;
        } else {
            let XY2;
            let XY3;
            let P2 = spatial.Get_Reverse_XY(OldP, oldMapZahyo);
            if ((newMapZahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) && (oldMapZahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido)) {
                if (newMapZahyo.System != oldMapZahyo.System) {
                    //二つとも緯度経度座標で、測地系が違う場合
                    switch (oldMapZahyo.System) {
                        case enmZahyo_System_Info.Zahyo_System_tokyo:
                            XY2 = TKY2JGD.Tokyo97toITRF94(P2.toLatlon());
                            break;
                        case enmZahyo_System_Info.Zahyo_System_World:
                            XY2 = TKY2JGD.ITRF94toTokyo97(P2.toLatlon());
                            break;
                    }
                    P2 = XY2.toPoint();
                }
            } else if ((oldMapZahyo.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) && (newMapZahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido)) {
                //元が平面直角、新規が緯度経度の場合、

                let Ellip12;
                let Kei = oldMapZahyo.HeimenTyokkaku_KEI_Number;
                if (oldMapZahyo.System == enmZahyo_System_Info.Zahyo_System_tokyo) {
                    Ellip12 = 1;
                } else {
                    if (oldMapZahyo.System == enmZahyo_System_Info.Zahyo_System_World) {
                        Ellip12 = 2;
                    }
                    XY2 = TKY2JGD.doCalcXy2bl(Ellip12, Kei, P2.y, P2.x);
                    if (newMapZahyo.System != oldMapZahyo.System) {
                        //さらに測地系が違う場合
                        switch (oldMapZahyo.System) {
                            case enmZahyo_System_Info.Zahyo_System_tokyo:
                                XY3 = TKY2JGD.Tokyo97toITRF94(XY2.toLatlon())
                                break;
                            case enmZahyo_System_Info.Zahyo_System_World:
                                XY3 = TKY2JGD.ITRF94toTokyo97(XY2.toLatlon())
                                break;
                        }
                        XY2 = XY3.Clone();
                    }
                    P2 = XY2.toPoint();
                }
            }
            let P3 = spatial.Get_Converted_XY(P2, newMapZahyo);
            return P3;
        }
    }

    /** 世界測地系の緯度経度の座標を、地図ファイルの測地系が日本測地系だった場合、日本測地系の緯度経度に変換、平面直角座標系の場合は変換不可*/
    static Get_ReverseWorld_IdoKedo(oLatLon, MapZahyo) {
        if (MapZahyo.Mode != enmZahyo_mode_info.Zahyo_Ido_Keido) {
            alert("平面直角は不可")
        }

        if (MapZahyo.System == enmZahyo_System_Info.Zahyo_System_tokyo) {
            //日本測地系の場合は変換
            let xy2 = TKY2JGD.ITRF94toTokyo97(oLatLon);
            return xy2;
        } else {
            return oLatLon;
        }
    }

    /** 起終点座標だけを指定した境界線を面領域を描くように並べ替える、返す値は並び順とオブジェクトのポリゴン数*/
    static BoundaryArrangeGeneral(LieneNum, spxy, epxy) {
        let boundArrange = new boundArrangeData();
        switch (LieneNum) {
            case 0:
                boundArrange.Pon = 0;
                return boundArrange;
                break;
            case 1:
                boundArrange.Pon = 1;
                let fr = new Fringe_Line_Info();
                fr.code = 0;
                fr.Direction = 1;
                boundArrange.Fringe[0] = fr;
                boundArrange.Arrange_LineCode[0] = [0, 1]
                return boundArrange;
                break;
        }
        let PointIndex = new clsSpatialIndexSearch(SpatialPointType.SinglePoint);
        let fnl = 0
        let Pon = 0
        let Eline2_n = 0
        let Eline2 = [];
        for (let i = 0; i < LieneNum; i++) {
            if (spxy[i].Equals(epxy[i]) == true) {
                let fr = new Fringe_Line_Info();
                fr.code = i;
                fr.Direction = 1;
                boundArrange.Fringe[fnl] = fr;
                boundArrange.Arrange_LineCode[Pon] = [fnl, 1];
                Pon++;
                fnl++;
            } else {
                PointIndex.AddDoublePoint(spxy[i], epxy[i], i);
                Eline2.push(i);
                Eline2_n++;
            }
        }
        PointIndex.AddEnd();

        let Contf = false;
        let f = true;
        let Eline2_i = 0;
        let stxy;
        let exy;
        while (Eline2_i < Eline2_n) {
            f = false;
            if (Contf == false) {
                for (let i = 0; i < Eline2_n; i++) {
                    if (Eline2[i] != -1) {
                        boundArrange.Arrange_LineCode[Pon]=[fnl,1]
                        let LineNO = Eline2[i];
                        Eline2[i] = -1;
                        let fr = new Fringe_Line_Info();
                        fr.code = LineNO;
                        fr.Direction = 1;
                        boundArrange.Fringe[fnl] = fr;
                        fnl++;
                        Eline2_i++;
                        stxy = spxy[LineNO];
                        exy = epxy[LineNO];
                        PointIndex.RemoveObject_byTag(LineNO);
                        break;
                    }
                }
            }
            Contf = false;

            let k2 = PointIndex.GetSamePointNumber(exy.x, exy.y);
            let LINENO2 = k2.Tag;
            let PointNumber = k2.PointNumber;
            if (k2.ObjectNumber != -1) {
                Contf = true;
                Eline2[k2.ObjectNumber] = -1;
                boundArrange.Arrange_LineCode[Pon][1]++;
                let fr = new Fringe_Line_Info();
                fr.code = LINENO2;
                if (PointNumber == 0) {
                    exy = epxy[LINENO2];
                    fr.Direction = 1 //順方向
                } else {
                    exy = spxy[LINENO2];
                    fr.Direction = -1 //逆方向
                }
                boundArrange.Fringe[fnl] = fr;
                PointIndex.RemoveObject_byTag(LINENO2);
                Eline2_i++;
                fnl++;
            }
            if (exy.Equals(stxy) == true) {
                Contf = false;
                Pon++;
                f = true;
            } else {
                if (Contf == false) {
                    f = false;
                    break;
                }
            }
        }
        if (f == false) {
            boundArrange.Pon = 0;
        } else {
            boundArrange.Pon = Pon;
        }
        return boundArrange;
    }

    static Get_Hairetu_Menseki(XY, MapDataMap) {
        let n = XY.length ;
        let xy2 =Generic.ArrayClone(XY);
        if (MapDataMap.Zahyo.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido) {
            //投影法が正積図法でない場合は座標を正積図法のものに変換
            switch (MapDataMap.Zahyo.Projection) {
                case enmProjection_Info.prjSeikyoEntou:
                case enmProjection_Info.prjMercator:
                case enmProjection_Info.prjMiller:
                    let RemapZahyo = new Zahyo_info();
                    RemapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
                    RemapZahyo.Projection = enmProjection_Info.prjLambertSeisekiEntou;
                    RemapZahyo.CenterXY = MapDataMap.Zahyo.CenterXY.Clone();
                    for (let j = 0; j < n; j++) {
                        let oxy = this.Get_Reverse_XY(XY[j], MapDataMap.Zahyo);
                        xy2[j] = this.Get_Converted_XY(oxy, RemapZahyo);
                    }
                    break;
            }
        }

        let men = 0;
        for (let j = 1; j < n-1; j++) {
            men += xy2[j].x * (xy2[j + 1].y - xy2[j - 1].y);
        }
        switch (MapDataMap.Zahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode:
                if (MapDataMap.SCL != 0) {
                    men = Math.abs(men / (MapDataMap.SCL * MapDataMap.SCL) / 2);
                } else {
                    men = Math.abs(men / 2);
                }
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                men = Math.abs(men / (MapDataMap.SCL * MapDataMap.SCL) / 2);
                break;
             default:
                men = Math.abs(men / 2);
                break;

        }
        return men;
    }


    static CheckTwoPoint (xy1, xy2) { //2つの座標が同じか調べる
        if ((xy1.x == xy2.x) && (xy1.y == xy2.y)) {
            return true;
        } else {
            return false;
        }
    }
    //四角形を回転させた外接四角形を求める
    static getCircumscribedRectangle_turned(Rect1, Angle) {
        let p = this.Get_TurnedRectangle(Rect1, Angle);
        return this.getCircumscribedRectangle(p);
    }

    /**Circumscribed_Rectangleの上下左右とpointまたはrectangleを比較し、XYがより外側の場合は置き換える。point_rectangleがpointの配列の場合は、pointからrectangle作成 */
    static getCircumscribedRectangle  (point_rectangle, Circumscribed_Rectangle) {

        let newRec;
        if ((point_rectangle instanceof Array) == true) {
            //地点配列の外接四角形
            newRec = new rectangle(point_rectangle[0]);
            for (let i = 1; i < point_rectangle.length; i++) {
                let xy = point_rectangle[i];
                if (newRec.left > xy.x) newRec.left = xy.x;
                if (newRec.top > xy.y) newRec.top = xy.y;
                if (newRec.right < xy.x) newRec.right = xy.x;
                if (newRec.bottom < xy.y) newRec.bottom = xy.y;
            }

        } else {
            newRec = Circumscribed_Rectangle.Clone();
            if ((point_rectangle instanceof point) == true) {
                let xy = point_rectangle;
                if (Circumscribed_Rectangle.left > xy.x) newRec.left = xy.x;
                if (Circumscribed_Rectangle.top > xy.y) newRec.top = xy.y;
                if (Circumscribed_Rectangle.right < xy.x) newRec.right = xy.x;
                if (Circumscribed_Rectangle.bottom < xy.y) newRec.bottom = xy.y;
            } else {
                let Rect = point_rectangle;
                if (Circumscribed_Rectangle.left > Rect.left) newRec.left = Rect.left;
                if (Circumscribed_Rectangle.top > Rect.top) newRec.top = Rect.top;
                if (Circumscribed_Rectangle.right < Rect.right) newRec.right = Rect.right;
                if (Circumscribed_Rectangle.bottom < Rect.bottom) newRec.bottom = Rect.bottom;
            }
        }
        return newRec;
    }



    static Get_Inner_Rectangle (Rect1, Rect2) {
        //二つの四角形が交わっている場合に、重複領域の四角形を取得する 。交わっているかどうかの判定は行わない 
        var inR = new rectangle();
        inR.left = Math.max(Rect1.left, Rect2.left);
        inR.right = Math.min(Rect1.right, Rect2.right);
        inR.top = Math.max(Rect1.top, Rect2.top);
        inR.bottom = Math.min(Rect1.bottom, Rect2.bottom);
        return inR;
    }

    static Check_PointInBox(checkXY, Kakudo, Rect) {//ポイントが四角形の中に入るかどうかチェック
        let ckP = checkXY.Clone();
        if (Kakudo != 0) {
            let rcp = Rect.centerP;
            ckP.offset(-rcp.x, -rcp.y);
            ckP=this.Trans2D(ckP, Kakudo);
            ckP.offset(rcp);
        }
        if ((Rect.left <= ckP.x) && (ckP.x <= Rect.right) && (Rect.top <= ckP.y) && (ckP.y <= Rect.bottom)) {
            return true;
        } else {
            return false;
        }
    }



    static Get_TwoPoint_Rect_SingleGet_TwoPoint_Rect_Single (P1, P2) {
        //二つのポイントの外接四角形を求める
        var Rec = new rectangle();
        if (P1.x < P2.x) {
            Rec.left = P1.x;
            Rec.right = P2.x;
        } else {
            Rec.left = P2.x;
            Rec.right = P1.x;
        }
        if (P1.y < P2.y) {
            Rec.top = P1.y;
            Rec.bottom = P2.y;
        } else {
            Rec.top = P2.y;
            Rec.bottom = P1.y;
        }
        return Rec;
    }
    //二つの四角形の外接四角形を求める
    static Get_Rectangle_Union(rec1,rec2){
        let r = new rectangle();
        if (rec1.left < rec2.left) { r.left = rec1.left } else { r.left = rec2.left };
        if (rec1.right < rec2.right) { r.right = rec2.right } else { r.right = rec1.right };
        if (rec1.top < rec2.top) { r.top = rec1.top } else { r.top = rec2.top };
        if (rec1.bottom < rec2.bottom) { r.bottom = rec2.bottom } else { r.bottom = rec1.bottom };
        return r;
    }

    //二つのポイントの外接四角形を求める
    //１つのポイントと半径rの円の外接四角形を求める
    //１つのポイントを中心としたsizeの外接四角形を求める
    static Get_Rectangle(P1, P2) {
        if ((typeof P2) == 'number') {
            let r = P2;
            return new rectangle(P1.x - r, P1.x + r, P1.y - r, P1.y + r);
        } else if ((P2 instanceof size) == true) {
            return new rectangle(P1.x - P2.width, P1.x + P2.width, P1.y - P2.height, P1.y + P2.height);
        } else {
            return new rectangle(Math.min(P1.x, P2.x), Math.max(P1.x, P2.x), Math.min(P1.y, P2.y), Math.max(P1.y, P2.y));
        }

    }

    //2つの四角形の上下左右端1つでも一致する場合true
    static Check_TwoRectangele_Inner_Contact(Rec1, Rec2) {
        if ((Rec1.left == Rec2.left) || (Math.abs(Rec1.right - Rec2.right) < 0.000001) || (Rec1.top == Rec2.top) || (Math.abs(Rec1.bottom - Rec2.bottom) < 0.000001)) {
            return true;
        } else {
            return false;
        }
    }

    static Compare_Two_Rectangle_Position (Rec1, Rec2) {
        //二つの長方形の内外判定
        if ((Rec1.left > Rec2.right) || (Rec1.top > Rec2.bottom) || (Rec1.right < Rec2.left) || (Rec1.bottom < Rec2.top)) {
            return cstRectangle_Cross.cstOuter;    //ずれている
        } else if ((Rec1.left <= Rec2.right) && (Rec1.top <= Rec2.bottom) && (Rec1.right >= Rec2.left) && (Rec1.bottom >= Rec2.top)) {
            if ((Rec1.left >= Rec2.left) && (Rec1.top >= Rec2.top) && (Rec1.right <= Rec2.right) && (Rec1.bottom <= Rec2.bottom)) {
                return cstRectangle_Cross.cstInner;  //Rec2の中にRec1が含まれる
            } else {
                return cstRectangle_Cross.cstCross;  //交差している
            }
        } else if ((Rec1.left < Rec2.left) && (Rec1.top < Rec2.top) && (Rec1.right > Rec2.right) && (Rec1.bottom > Rec2.bottom)) {
            return cstRectangle_Cross.cstInclusion; //Rec1の中にRec2が含まれる
        }
    }

    static Compare_Two_Rectangle_Position_Inflated(Rec1, Rec2, inflate) {
        let rect12 = Rec1.Clone();
        let rect22 = Rec2.Clone();
        rect12.inflate(inflate,inflate);
        rect22.inflate(inflate,inflate);
        return this.Compare_Two_Rectangle_Position(rect12, rect22);
    }

    static Compare_Two_Rectangle_Position_turned(Rect1, Rect1Angle, Rect2) {
        let trect = this.getCircumscribedRectangle_turned(Rect1, Rect1Angle);
        return this.Compare_Two_Rectangle_Position(trect, Rect2);
    }

    static Distance (x1, y1, x2, y2) {
        var d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        return d;
    }

    static Distance_Point (P1,P2) {
        return this.Distance(P1.x,P1.y,P2.x,P2.y);
    }
    static trans3D (x, y, z, TurnCenter, Expantion, Pitch, Head, Bank, XYPara) {
        let ESPara = Expantion / 100;
        let COSP = Math.cos(Pitch * Math.PI / 180);
        let SINP = Math.sin(Pitch * Math.PI / 180);
        let COSH = Math.cos(Head * Math.PI / 180);
        let SINH = Math.sin(Head * Math.PI / 180);
        let COSB = Math.cos(Bank * Math.PI / 180);
        let SINB = Math.sin(Bank * Math.PI / 180);

        let xx = X - TurnCenter.x;
        let yy = Y - TurnCenter.y;
        let ZZ = z;
        let yy1 = yy * COSP - ZZ * SINP;
        let ZZ1 = yy * SINP + ZZ * COSP;
        let xx2 = xx * COSH + ZZ1 * SINH;
        let ZZ2 = -xx * SINH + ZZ1 * COSH;
        let XX3 = xx2 * COSB - yy1 * SINB;
        let YY3 = xx2 * SINB + yy1 * COSB;
        let Z3D = ZZ2 * ESPara;
        XX3 = XX3 * ESPara;
        YY3 = YY3 * ESPara;
        let ww = XYPara / (XYPara - Z3D);
        let newP = new Point(XX3 * ww + TurnCenter.x, YY3 * ww + TurnCenter.y);
        return newP;
    }

    //回転中心を指定して二次元座標回転角度指定
    static Trans2D(CP, Kakudo_P, Kakudo) {
        let OutP = new point();
        if (typeof Kakudo_P == "number") {
            let k = Kakudo_P * Math.PI / 180
            OutP.x = CP.x * Math.cos(k) - CP.y* Math.sin(k);
            OutP.y = CP.x * Math.sin(k) + CP.y  * Math.cos(k);
        } else {
            let k = Kakudo * Math.PI / 180;
            let P = Kakudo_P;
            OutP.x = (P.x - CP.x) * Math.cos(k) - (P.y - CP.y) * Math.sin(k);
            OutP.y = (P.x - CP.x) * Math.sin(k) + (P.y - CP.y) * Math.cos(k);
            OutP.offset(CP);
        }
        return OutP;
    }


    //指定した高さ、幅のボックスの、回転後の外接四角形の高さ、幅を取得する
    static Get_TurnedBox(oSize, Angle) {
        let rect = new rectangle(new point(-oSize.width / 2,- oSize.height / 2), oSize);
        let trect = this.getCircumscribedRectangle_turned(rect, Angle);
        return trect.size();
    }

    //回転させた四角形の座標配列を取得。戻り値は5つの座標
    static Get_TurnedRectangle(Rect, Kakudo) {
        let x1 = Rect.left;
        let y1 = Rect.top;
        let x2 = Rect.right;
        let y2 = Rect.bottom;

        let pxy = [];
        pxy.push(new point(x1, y1));
        pxy.push(new point(x2, y1));
        pxy.push(new point(x2, y2));
        pxy.push(new point(x1, y2));
        if (Kakudo != 0) {
            let cp = Rect.centerP();
            for (let i = 0; i < 3; i++) {
                pxy[i] = spatial.Trans2D(cp, pxy[i], -Kakudo);
            }
        }
        pxy.push(pxy[0].Clone());
        return pxy;
    }

    static Distance_PointLine2(P,LineP1,LineP2){
        return this.Distance_PointLine(P.x,P.y,LineP1.x,LineP1.y,LineP2.x,LineP2.y);
    }
    static Distance_PointLine (X, Y, ax, ay, BX, BY ) {
        //AXAY,BXBYで定義される線分と、XYポイントの間の距離
        //Nearest_point:最も近い位置の線分上の点を取得（オプション）

        let Nearest_pointX, Nearest_pointY;
        var po = 0;
        var xs = BX - ax;
        var Ys = BY - ay;
        var d1 = this.Distance(X, Y, ax, ay);
        var d2 = this.Distance(X, Y, BX, BY);
        var D;
        if (xs == 0) {
            if ((Math.min(ay, BY) <= Y) && (Y <= Math.max(ay, BY))) {
                D = Math.abs(X - ax);
                Nearest_pointX = ax;
                Nearest_pointY = Y;
            } else {
                po = 1;
            }
        } else if (Ys == 0) {
            if ((Math.min(ax, BX) <= X) && (Y <= Math.max(ax, BX))) {
                D = Math.abs(Y - ay);
                Nearest_pointX = X;
                Nearest_pointY = ay;
            } else {
                po = 1;
            }
        } else {
            var a = Ys / xs;
            var b = -a * ax + ay;

            var Va = -1 / a;
            var Va2 = -Va * X + Y;
            var crossX = (Va2 - b) / (a - Va);
            if ((Math.min(ax, BX) <= crossX) && (crossX <= Math.max(ax, BX))) {
                D = Math.abs(-Ys * X + xs * Y - xs * ay + Ys * ax) / Math.sqrt(xs * xs + Ys * Ys);
                Nearest_pointX = crossX;
                Nearest_pointY = crossX * a + b;
            } else {
                po = 1;
            }
        }

        if (po == 1) {
            if (d1 < d2) {
                D = d1;
                Nearest_pointX = ax;
                Nearest_pointY = ay;
            } else {
                D = d2;
                Nearest_pointX = BX;
                Nearest_pointY = BY;
            }
        }
        return {distance:D,nearP:new point(Nearest_pointX,Nearest_pointY)};

    }

    //緯度経度等もともとの座標から、投影変換した座標を返す
    static Get_Converted_XY (Position, MPDataMapZahyo) {
        let ox = Position.x;
        let oy = Position.y;
        switch (MPDataMapZahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode: {
                return new point(ox, oy);
                break;
            }
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                return new point(ox, -oy);
                break;
            }
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                switch (MPDataMapZahyo.Projection) {
                    case enmProjection_Info.prjSeikyoEntou: {
                        return new point(EarthR * (ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180,
                            - EarthR * oy * Math.PI / 180);
                        break;
                    }
                    case enmProjection_Info.prjMercator: {
                        let newP = new point();
                        newP.x = EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180);
                        if (oy >= 89.9999) {
                            oy = 89.9999;
                        } else if (oy <= -89.9999) {
                            oy = -89.9999;
                        }
                        newP.y = -EarthR * Math.log(Math.tan((45 + oy / 2) * Math.PI / 180));
                        return newP;
                        break;
                    }
                    case enmProjection_Info.prjMiller: {
                        return new point(EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180),
                            - EarthR * Math.log(Math.tan((45 + oy * 2 / 5) * Math.PI / 180)) * 1.25);
                        break;
                    }
                    case enmProjection_Info.prjLambertSeisekiEntou: {
                        return new point(EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180),
                            - EarthR * Math.sin(oy * Math.PI / 180));
                        break;
                    }
                    case enmProjection_Info.prjSanson: {
                        return new point(EarthR * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180) * Math.cos(oy * Math.PI / 180),
                            - EarthR * oy * Math.PI / 180);
                        break;
                    }
                    case enmProjection_Info.prjMollweide: {
                        let theata = this.newtonMollweide(oy);
                        if (theata != undefined) {
                            let x = EarthR * Math.sqrt(2) / 90 * (ox - MPDataMapZahyo.CenterXY.x) * Math.cos(theata);
                            let y = -EarthR * Math.sqrt(2) * Math.sin(theata);
                            return new point(x, y);
                        } else {
                            return new point(0, 0);
                        }
                        break;
                    }
                    case enmProjection_Info.prjEckert4: {
                        let theata = this.newtonEckert4(oy);
                        if (theata != undefined) {
                            let x = EarthR * 0.4222382 * ((ox - MPDataMapZahyo.CenterXY.x) * Math.PI / 180) * (1 + Math.cos(theata));
                            let y = -EarthR * 1.3265044 * Math.sin(theata);
                            return new point(x, y);
                        } else {
                            return new point(0, 0);
                        }
                        break;
                    }
                }
            }
        }
    }
    static newtonMollweide (lat) {
        let x = 0;
        let lat2 = lat * Math.PI / 180;
        let n = 0;
        let dx;
        do {
             dx = -(x + Math.sin(x) - Math.PI * Math.sin(lat2)) / (Math.cos(x) + 1);
            x += dx;
            n++;
            if (n > 50) {
                return undefined;
            }
        } while (Math.abs(dx) >= 0.00001)
        return x / 2;
    }

    static newtonEckert4 (lat) {
        let x = 0;
        let lat2 = lat * Math.PI / 180;
        let n = 0;
        let dx;
        do {
             dx = -(x + Math.sin(x) * Math.cos(x) + 2 * Math.sin(x) - (2 + Math.PI / 2) * Math.sin(lat2)) / (1 + Math.cos(2 * x) + 2 * Math.cos(x));
            x += dx;
            n++;
            if (n > 50) {
                return undefined;
            }
        } while (Math.abs(dx) >= 0.00001)
        return x;
    }


    static Check_Zahyo_Projection_Convert_Enabled (OriginMap, ConvertMap) {
        /// <signature>
        /// <summary>座標系・測地系が変換可能か調べる</summary>
        /// <param name="OriginMap">もともとの座標系</param>  
        /// <param name="ConvertMap">変換予定の座標系</param>  
        /// </signature>
        if (((OriginMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode)) ||
            ((OriginMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode))) {
            let mes = "座標系の設定していないデータと、設定してあるデータを重ねることはできません。";
            return { ok: false, emes: mes };
        }
        if (((OriginMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode)) ||
            ((OriginMap.Mode != enmZahyo_mode_info.Zahyo_No_Mode) && (ConvertMap.Mode == enmZahyo_mode_info.Zahyo_No_Mode))) {
            let mes = "座標系の設定していないデータと、設定してあるデータを重ねることはできません。";
            return { ok: false, emes: mes };
        }
        if ((OriginMap.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) && (ConvertMap.Mode == enmZahyo_mode_info.Zahyo_Ido_Keido)) {
            let mes =  "平面直角座標系のデータ上に緯度経度座標系のデータは追加できません。";
            return { ok: false, emes: mes };
        }
        if ((OriginMap.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku) && (OriginMap.Mode == enmZahyo_mode_info.Zahyo_HeimenTyokkaku)) {
            if (ConvertMap.HeimenTyokkaku_KEI_Number != OriginMap.HeimenTyokkaku_KEI_Number) {
                let mes =  "平面直角座標系の系番号が違います。";
                return { ok: false, emes: mes };
            }
            if (ConvertMap.System != OriginMap.System) {
                let mes =  "平面直角座標系の測地系が違います。";
                return { ok: false, emes: mes };
            }
        }
        return { ok: true, emes: "" };
    }
    //緯度経度・平面直角座標系を変換した四角形の四隅座標から、元の緯度経度・平面直角座標系座標に戻す
    static Get_Reverse_Rect (In_Rect, MPDataMapZahyo) {
        let leftP1 = this.Get_Reverse_XY(new point(In_Rect.left, In_Rect.top), MPDataMapZahyo);
        let leftP2 = this.Get_Reverse_XY(new point(In_Rect.left, (In_Rect.top + In_Rect.bottom) / 2), MPDataMapZahyo);
        let leftP3 = this.Get_Reverse_XY(new point(In_Rect.left, In_Rect.bottom), MPDataMapZahyo);

        let left = Math.min(Math.min(leftP1.x, leftP2.x), leftP3.x);

        let rightP4 = this.Get_Reverse_XY(new point(In_Rect.right, In_Rect.top), MPDataMapZahyo);
        let rightP5 = this.Get_Reverse_XY(new point(In_Rect.right, (In_Rect.top + In_Rect.bottom) / 2), MPDataMapZahyo);
        let rightP6 = this.Get_Reverse_XY(new point(In_Rect.right, In_Rect.bottom), MPDataMapZahyo);

        let right = Math.max(Math.max(rightP4.x, rightP5.x), rightP6.x);

        return new rectangle(left, right, leftP3.y, leftP1.y);
    }

    //緯度経度・平面直角座標系を変換した座標(地図ファイル中の座標)から、元の緯度経度・平面直角座標系座標に戻す
    static Get_Reverse_XY (Position, MPDataMapZahyo) {
        let ox = Position.x;
        let oy = Position.y;
        let mz = MPDataMapZahyo;
        let newP = new point();
        let theata;
        switch (mz.Mode) {
            case enmZahyo_mode_info.Zahyo_No_Mode:
                return new point(ox, oy);
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                return new point(ox, -oy);
                break;
            case enmZahyo_mode_info.Zahyo_Ido_Keido:
                switch (mz.Projection) {
                    case enmProjection_Info.prjSanson:
                        let y = -oy / EarthR * 180 / Math.PI;
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI * Math.cos(y * Math.PI / 180)), y);
                        break;
                    case enmProjection_Info.prjSeikyoEntou:
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI), - oy / EarthR * 180 / Math.PI);
                        break;
                    case enmProjection_Info.prjMercator:
                        let tx = Math.exp(-oy / EarthR);
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI), 2 * Math.atan(tx) * 180 / Math.PI - 90);
                        break;
                    case enmProjection_Info.prjMiller:
                        let tx2 = Math.exp(-oy / (EarthR * 1.25));
                        return new point(mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI), Math.atan(tx2) * 5 / 2 * 180 / Math.PI - 45 * 5 / 2);
                        break;
                    case enmProjection_Info.prjLambertSeisekiEntou:
                        newP.x = mz.CenterXY.x + (ox * 180) / (EarthR * Math.PI);
                        let tx3 = -oy / EarthR;
                        if (tx3 >= 1) {
                            newP.y = 90;
                        } else if (tx3 <= -1) {
                            newP.y = -90;
                        } else {
                            newP.y = Math.atan(tx3 / Math.sqrt(-tx3 * tx3 + 1)) * 180 / Math.PI;
                        }
                        return newP
                        break;
                    case enmProjection_Info.prjMollweide:
                        if (Math.abs(Position.y) > (Math.sqrt(2) * EarthR - 0.001)) {
                            Position.y = (Math.sqrt(2) * EarthR - 0.001) * Math.sign(Position.y);
                        }
                        theata = Math.asin(Position.y / (Math.sqrt(2) * EarthR));
                        newP.y = -Math.asin((2 * theata + Math.sin(2 * theata)) / Math.PI) * 180 / Math.PI;
                        newP.x = MPDataMapZahyo.CenterXY.x + Math.PI * Position.x / (2 * EarthR * Math.sqrt(2) * Math.cos(theata)) * 180 / Math.PI;
                        return newP
                        break;
                    case enmProjection_Info.prjEckert4:
                        if (Math.abs(Position.y) > (1.3265004 * EarthR - 0.001)) {
                            Position.y = (1.3265004 * EarthR - 0.001) * Math.sign(Position.y);
                        }
                        theata = Math.asin(Position.y / (1.3265004 * EarthR));
                        newP.y = -Math.asin((theata + Math.sin(theata) * Math.cos(theata) + 2 * Math.sin(theata)) / (2 + Math.PI / 2)) * 180 / Math.PI;
                        newP.x = MPDataMapZahyo.CenterXY.x + Position.x / (0.4223382 * EarthR * (1 + Math.cos(theata))) * 180 / Math.PI;
                        return newP
                        break;
                }
                break;
        }
    }
}

class Generic {

    /**読み込み中マーク 処理終了後に Generic.clear_backDiv();で消す*/
    static readingIcon(title){
        let boxReading = Generic.set_backDiv("", title, 300, 150, false, false, undefined, 0.2, false);     
        Generic.createNewDiv(boxReading,  " 読み込み中", "", "grayFrame", 30, 50, 230, 40, "padding:5px", undefined);   
        Generic.createNewImage(boxReading, "image/icon_loader.gif", "", "", "", 140, 110, "", undefined);
    }
    /**外部クリップボードから貼り付け */
    static outerPaste(okCall,cancelCall){
        const backDiv = Generic.set_backDiv("", "外部から貼り付け", 200, 240, true, true, buttonOK, 0.2, true,true,cancelCall);
        Generic.createNewSpan(backDiv,"下に貼り付けて下さい(Ctrl+V)","","",15,40,"",undefined);
        let tx=Generic.createNewTextarea(backDiv,"","",15,65,10,10,"width:170px;height:120px;resize: none;");
        tx.focus();
        function buttonOK(){
            Generic.clear_backDiv();
            okCall( tx.value);
        }
    }

    /**オブジェクト名と設定期間の組み合わせ文字列を返す */
    static getTimeList(OnameStac, separator = "") {
        let tx = "【" + OnameStac.connectNames() + "】" + separator + clsTime.StartEndtoString(OnameStac.SETime);
        return tx;
    }
    /**メッシュコードの名称を取得 */
    static ConvertMeshTypeFromEnum(MeshNumber) {
        switch (MeshNumber) {
            case enmMesh_Number.mhNonMesh:
                return "";
            case enmMesh_Number.mhFirst:
                return "1次メッシュ";
            case enmMesh_Number.mhSecond:
                return "2次メッシュ";
            case enmMesh_Number.mhThird:
                return "3次メッシュ";
            case enmMesh_Number.mhHalf:
                return "1/2メッシュ";
            case enmMesh_Number.mhQuarter:
                return "1/4メッシュ";
            case enmMesh_Number.mhOne_Eighth:
                return "1/8メッシュ";
            case enmMesh_Number.mhOne_Tenth:
                return "1/10メッシュ";
        }
    }
    static ConvertMeshTypeFromString(MeshType) {
        switch (MeshType) {
            case "":
                return enmMesh_Number.mhNonMesh;
            case "1次メッシュ":
                return enmMesh_Number.mhFirst;
            case "2次メッシュ":
                return enmMesh_Number.mhSecond;
            case "3次メッシュ":
                return enmMesh_Number.mhThird;
            case "1/2メッシュ":
                return enmMesh_Number.mhHalf;
            case "1/4メッシュ":
                return enmMesh_Number.mhQuarter;
            case "1/8メッシュ":
                return enmMesh_Number.mhOne_Eighth;
            case "1/10メッシュ":
                return enmMesh_Number.mhOne_Tenth;
        }
    }
    /** レイヤタイプの文字列を返す*/
    static ConvertStringFromLayerType(Type) {
        switch (Type) {
            case enmLayerType.Normal:
                return "通常のレイヤ";
                break;
            case enmLayerType.Mesh:
                return "メッシュレイヤ";
                break;
            case enmLayerType.DefPoint:
                return "地点定義レイヤ";
                break;
        }
    }
    static ConvertStringLayerFromString(TypeStr) {
        switch (TypeStr) {
            case "通常のレイヤ":
                return enmLayerType.Normal;
                break;
            case "メッシュレイヤ":
                return enmLayerType.Mesh;
                break;
            case "地点定義レイヤ":
                return enmLayerType.DefPoint;
                break;
        }
    }

    /** 属性データ編集で欠損値扱い欄に表示する文字を返す*/
    static ConvertMissingValueFromBool(MissingValueF) {
        switch (MissingValueF) {
            case true:
                return "欠損値";
                break;
            default:
                return "0または空白";
                break;
        }
    }
    static ConvertMissingValueFromString(MissingStr) {
        switch (MissingStr) {
            case "欠損値":
                return true;
                break;
            case "0または空白":
                return false;
                break;
        }
    }


    /**条件検索の文字を返す */
    static getConditionString(con){
        switch (con) {
            case enmCondition.Less:
                return "未満";
                break;
            case enmCondition.LessEqual:
                return "以下";
                break;
            case enmCondition.Equal:
                return "等しい";
                break;
            case enmCondition.GreaterEqual:
                return "以上";
                break;
            case enmCondition.Greater:
                return "より大きい";
                break;
            case enmCondition.NotEqual:
                return "以外";
                break;
            case enmCondition.Include:
                return "文字を含む";
                break;
            case enmCondition.Exclude:
                return "文字を含まない";
                break;
            case enmCondition.Head:
                return "先頭の文字";
                break;
            case enmCondition.Foot:
                return "末尾の文字";
                break;
        }
    }

    /**文字列配列Wordsをチェックして「新規1」「新規2」など連番を付ける */
    static Get_New_Numbering_Strings(CheckWords, Words) {
        let L = CheckWords.length;
        let V = 0;
        for (let i = 0; i < Words.length; i++) {
            if (Words[i].left(L) == CheckWords) {
                V = Math.max(Math.floor(Words[i].mid(L, undefined)), V);
            }
        }
        return CheckWords + String(V + 1);
    }

    /**オブジェクト名の漢字を統一する。比較する漢字が含まれていた場合にtrue */
    static ObjName_Kanji_Compatible(objName){
        let Word_Compatible  = clsSettingData.ObjectName_Word_Compatible.split("|");
        let f = false;

        let oldCharacter  = "亞圍壹飮榮艷應毆穩壞覺樂寬罐陷戲據峽鄕驅徑溪莖鷄缺圈獻險嚴恆國濟劑慘贊絲兒實釋獸肅緖敍稱剩條疊囑愼盡醉數聲攝專潛錢壯插裝續對臺澤擔彈遲鑄敕遞點黨當獨屆貳霸發濱福變辨舖寶餠藥餘搖來龍獵禮齡戀爐朗惡爲隱衞圓鹽橫假畫繪擴學勸歡觀顏歸龜犧擧挾勳惠經螢藝儉檢顯效鑛碎櫻雜棧殘辭舍壽從縱處奬燒證壤淨讓觸眞圖隨樞靜竊戰纖禪總騷臟墮帶瀧單膽斷晝鎭鐵傳盜讀繩惱廢賣髮甁拂邊瓣襃沒萬譯與樣賴覽綠隸勞樓灣壓醫稻營驛奧歐價會懷殼嶽卷關氣僞舊狹曉區薰繼輕劍權縣驗廣號黑齋册參蠶齒濕寫收澁諸將祥乘孃釀寢神粹髓瀨齊淺踐曾雙搜爭莊增藏屬體滯擇團癡蟲廳聽塚轉都燈德腦拜麥拔蠻祕佛竝辯穗豐飜滿默彌豫譽謠亂隆兩壘勵靈";
        let newCharacter  = "亜囲壱飲栄艶応殴穏壊覚楽寛缶陥戯拠峡郷駆径渓茎鶏欠圏献険厳恒国済剤惨賛糸児実釈獣粛緒叙称剰条畳嘱慎尽酔数声摂専潜銭壮挿装続対台沢担弾遅鋳勅逓点党当独届弐覇発浜福変弁舗宝餅薬余揺来竜猟礼齢恋炉朗悪為隠衛円塩横仮画絵拡学勧歓観顔帰亀犠挙挟勲恵経蛍芸倹検顕効鉱砕桜雑桟残辞舎寿従縦処奨焼証壌浄譲触真図随枢静窃戦繊禅総騒臓堕帯滝単胆断昼鎮鉄伝盗読縄悩廃売髪瓶払辺弁褒没万訳与様頼覧緑隷労楼湾圧医稲営駅奥欧価会懐殻岳巻関気偽旧狭暁区薫継軽剣権県験広号黒斎冊参蚕歯湿写収渋諸将祥乗嬢醸寝神粋髄瀬斉浅践曽双捜争荘増蔵属体滞択団痴虫庁聴塚転都灯徳脳拝麦抜蛮秘仏並弁穂豊翻満黙弥予誉謡乱隆両塁励霊";

        for(let i  = 0 ;i< Word_Compatible.length;i++){
            for(let j  = 1 ;j< Word_Compatible[i].length;j++){
                let k  =objName.indexOf(Word_Compatible[i].mid( j, 1));
                if(k != -1 ){
                    objName=objName.midReplace( k, Word_Compatible[i].left(1));
                    f = true;
                }
            }
        }

        if(clsSettingData.KatakanaCheck == true ){
            let katakana=Generic.Array2Dimension(3,2); 
            katakana[0][ 0] = "ヴァ"
            katakana[0][ 1] = "バ"
            katakana[1][ 0] = "ティ"
            katakana[1][ 1] = "チ"
            katakana[2][ 0] = "ヴェ"
            katakana[2][ 1] = "ベ"
            for(let i  = 0 ;i<= 2;i++){
                let k  = objName.indexOf(katakana[i][ 0]);
                if(k != -1 ){
                    objName = objName.midReplace(katakana[i][0], katakana[i][1]);
                    f = true;
                }
            }
        }

        //新字体旧字体比較
        if(clsSettingData.SinKyuCharacter == true ){
            for(let j  = 1 ;j<  objName.length;j++){
                let k  = oldCharacter.indexOf( objName.mid( j, 1));
                if(k != -1 ){
                    objName =objName.midReplace(j,  newCharacter.mid( k, 1));
                    f = true;
                }
            }
        }
        return {newObjname:objName,changeF:f};
    }

    /**レイヤの種類の名称 */
    static getLayerTypeName(layType){
        let tx = "";
        var enmLayerType = { Normal: 0, Trip_Definition: 1, Trip: 2, Mesh: 3, DefPoint: 4 };
        switch (layType) {
            case enmLayerType.Normal:
                tx = "通常のレイヤ";
                break;
            case enmLayerType.Mesh:
                tx = "メッシュレイヤ";
                break;
            case enmLayerType.DefPoint:
                tx = "地点定義レイヤ";
                break;
        }
        return tx;
    }

    /**スペース、カンマ、タブで区切る */
    static String_Cut(Wo,Spliter){
        let CUT = [];
        const vbQuate = String.fromCharCode(34);
        if (Wo.length == 0) {
            return [""];
        }
        switch (Spliter) {
            case " ": { //スペース区切り
                if (Wo == " ".repeat(Wo.length)) {
                    return [""];
                }
                while (Wo.left( 1) == " ") {
                    Wo = Wo.mid(1, undefined);
                }
                Wo += " ";
                let qua_f = false;
                let ST = 0;
                for (let i = 0; i < Wo.length; i++) {
                    let w = Wo.mid(i, 1);
                    if (w == vbQuate) {
                        qua_f = !qua_f;
                    }
                    switch (w) {
                        case " ": {
                            if (qua_f == false) {
                                let Cutw = wo.mid( ST, i - ST);
                                if (Cutw.left(1) == vbQuate) {
                                    Cutw = Cutw.mid(1, undefined);
                                }
                                if (Cutw.right(1) == vbQuate) {
                                    Cutw = Cutw.left(Cutw.length - 1);
                                }
                                CUT.push(Cutw);
                                while (wo.mid(Wo, i, 1) == " ") {
                                    i++;
                                }
                                ST = i;
                                i -= 1;
                            }
                            break;
                        }
                    }
                }
                return CUT;
                break;
            }
            case ",": { //カンマ区切り
                Wo += ",";
                let qua_f = false;
                let wf = false;

                let ST = 0;
                for (let i = 0; i < Wo.length; i++) {
                    let w = Wo.mid(i, 1);
                    switch (w) {
                        case vbQuate: {
                            qua_f = !qua_f;
                            wf = true;
                            if (qua_f == true) {
                                ST = i;
                            }
                            break;
                        }
                        case ",": {
                            if (qua_f == false) {
                                let Cutw;
                                if (wf == false) {
                                    Cutw = Wo.mid(ST, i - ST).trim();
                                    ST = i + 1
                                } else {
                                    Cutw = Wo.mid(ST + 1, i - ST - 2);
                                    ST = i + 1;
                                    wf = false;
                                }
                                CUT.push(Cutw);
                            }
                            break;
                        }
                    }
                }
                return CUT;
                break;
            }
            case '\t': { //タブ区切り
                let RetCut = Wo.split(('\t'));
                for (let i = 0; i < RetCut.length; i++) {
                    RetCut[i] = RetCut[i].trim();
                }
                return RetCut;
                break;
            }
        }

    }

    /**地図ファイルをgetMapfileByHttpRequestで開き、JSONで返す */
    static getMapfileByHttpRequest(url,readCall){
        
        Generic.readingIcon("地図ファイル読み込み");
        let ext=Generic.getExtension(url).toLowerCase();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (xhr.status === 200) {
                let file = new Blob([xhr.response]);
                Generic.unzipFile(file, unzipOk, unzipError);
                function unzipOk(data) {
                    let key = Object.keys(data)[0];
                    if(ext=="mpfj"){
                        readCall(JSON.parse(Generic.utf8ArrayToStr(data[key]))) ;
                    }else{
                        readCall(Generic.utf8ArrayToStr(data[key])) ;
                    }
                    Generic.clear_backDiv();
                }
                function unzipError(err) {
                    Generic.clear_backDiv();
                    alert(url+"の展開に失敗しました");
                }
            }
        };
        xhr.onerror=function(){
            Generic.clear_backDiv();
            alert(url+"のダウンロードに失敗しました");
        }
        xhr.send(null);
    }

    /**画像ウインドウ表示 */
    static windowCenterOpen(img, Xv, Yv, title) {
    let Xw = Xv + 10;
    let Yw = Yv + 80;
    let  new1 = window.open("", "_blank", "titlebar=No,directories=no,resizable=Yes,width=" + Xw + ",height=" + Yw + "");

    new1.document.write("<html><head><meta http-equiv=Content-Type content=\"text/html charset=utf-8\"><title>" + title + "</title></head><body bgcolor=#FFFFFF>");
    let  imgs = "<img src=" + img + ">"
    new1.document.write(imgs);
    new1.document.write("</br>画像を右クリックして保存またはコピーして下さい。</br></br>");
    new1.document.write("<center><input type=button value='このウインドウを閉じる' onClick='window.close()'></center>");
    new1.document.write("</body></html>");
    new1.document.close();
}

/** ウィンドウでutl表示 */
static windowCenterPage(help_url, Xv, Yv) {

    let Xw = Xv + 50;
    let Yw = Yv + 80;
    let  new2 = window.open(help_url, "_blank", "titlebar=No,status=0,scrollbars=1,resizable=0,width=" + Xw + ",height=" + Yw + "");
    if (navigator.appVersion.charAt(0) >= 3) { new2.focus() };
}

/**prompt入力 event_pointがundefinedの場合は画面中央表示*/
    static prompt(event_point, promptText, defoText, okCall,textAlign='left',cancelCall=undefined) {
        let gsize = Generic.getDivSize(promptText, 270, "");
        let fheight = (gsize.height) + 130;
        let alertObj = Generic.set_backDiv("", "MANDARA JS", 300, fheight, true, true, buttonOK, 0.2, false,true,cancelCall);
        if (event_point != undefined) {
            Generic.Set_Box_Position_in_Browser(event_point, alertObj);
        }
        this.createNewDiv(alertObj, promptText, "", "", 15, 40, 270, undefined, "", undefined);
        let inbox = Generic.createNewInput(alertObj, 'text', defoText, "", 15, gsize.height + 50, undefined, "width:270px;text-align:"+textAlign);
         inbox.select();
        inbox.onkeydown = function (e) {
            if (e.keyCode == 13) {
                let children = alertObj.childNodes;
                for (let i in children) {
                    if (children[i].name == "ok") {
                        children[i].focus();
                        break;
                    }
                }
            }else if(e.keyCode == 27){
                let children = alertObj.childNodes;
                for (let i in children) {
                    if (children[i].name == "cancel") {
                        children[i].click();
                        break;
                    }
                }
            }
        }
        function buttonOK() {
            Generic.clear_backDiv();
            okCall(inbox.value);
        }
    }

    /**yes　noの確認 event_point:表示座標*/
    static confirm(event_point, text, yesFunc, noFunc) {
        let gsize=Generic.getDivSize(text,220,"");
        let fheight=(gsize.height)+100;
        let fw=250;
        let confirmObj = Generic.set_backDiv("", "MANDARA JS",fw, fheight, false, false, undefined, 0.2,false);
        if(event_point!=undefined){
            Generic.Set_Box_Position_in_Browser(event_point, confirmObj);
        }
        this.createNewDiv(confirmObj,text,"","",15,40,220,undefined,"",undefined);
        Generic.createNewButton(confirmObj, "いいえ", "", fw - 80, fheight - 35, btnNo,"width:60px;height:23px");
        Generic.createNewButton(confirmObj, "はい", "", fw - 150, fheight - 35, btnYes, "width:60px;height:23px");

        function btnYes() {
            Generic.clear_backDiv();
            if(typeof yesFunc == 'function'){
                yesFunc();
            }
        }
        function btnNo() {
            Generic.clear_backDiv();
            if(typeof noFunc == 'function'){
                noFunc();
            }
        }
    }

    /**alertメッセージ event_pointがundefinedの場合は画面中央表示*/
    static alert(event_point, text, returnFunction) {
        let gsize=Generic.getDivSize(text,220,"");
        let fheight=(gsize.height)+100;
        let alertObj = Generic.set_backDiv("", "MANDARA JS",250, fheight, true, false, buttonOK, 0.2,false,true,returnFunction);
        if(event_point!=undefined){
            Generic.Set_Box_Position_in_Browser(event_point, alertObj);
        }
        this.createNewDiv(alertObj,text,"","",15,40,220,undefined,"",undefined);
        function buttonOK() {
            Generic.clear_backDiv();
            if (typeof returnFunction == 'function') {
                returnFunction();
            }
        }
    }

    /**圧縮ファイルを展開 展開後のファイル名の連想配列のバイナリデータを返す*/
    static unzipFile(file,onOK,onError) {
        let zipReader = new FileReader();
        zipReader.readAsArrayBuffer(file);
        let unZipData=[];
        zipReader.onload = function () {
            try {
                let zipArr = new Uint8Array(zipReader.result);
                let unzip = new Zlib.Unzip(zipArr);
                let importFileList = unzip.getFilenames();
                for (let i in importFileList) {
                    let importFile = importFileList[i];
                    //let jsonBuffer = utf8ArrayToStr(unzip.decompress(importFile));
                    unZipData[importFile] = unzip.decompress(importFile);
                }
               onOK(unZipData);
            } catch (e) {
                console.log(e);
                 onError(e);
             }
        }
    }

    /**データ（バイナリ）と対応するファイル名をtotalFileNameにZIP圧縮 */
    static zipFile(totalFileName,data,fileName) {
        let zip = new Zlib.Zip();
        for(let i in data){
            zip.addFile(data[i], {filename: Generic.strToUtf8Array(fileName[i])
        });
        }
        let compressData = zip.compress();

        let blob = new Blob([compressData], { 'type': 'application/octet-stream' });

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, totalFileName);
            window.navigator.msSaveOrOpenBlob(blob, totalFileName);
        } else {
            let a= document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = totalFileName;
            a.click();
        }
    }

    /**バイト配列をUTF8文字列に変換 */
    static utf8ArrayToStr(array) {
        var len = array.length;
        var out = "";
        var i = 0;
        var char1, char2, char3;
        if(array[0]==239){
            i=3;
        }
        while (i < len) {
            char1 = array[i++];
            switch (char1 >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    out += String.fromCharCode(char1);
                    break;
                case 12: case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((char1 & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((char1 & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    /**UTF8文字列をバイト配列に変換 */
     static strToUtf8Array(str) {
        var n = str.length,
            idx = -1,
            bytes = [],
            i, j, c;

        for (i = 0; i < n; ++i) {
            c = str.charCodeAt(i);
            if (c <= 0x7F) {
                bytes[++idx] = c;
            } else if (c <= 0x7FF) {
                bytes[++idx] = 0xC0 | (c >>> 6);
                bytes[++idx] = 0x80 | (c & 0x3F);
            } else if (c <= 0xFFFF) {
                bytes[++idx] = 0xE0 | (c >>> 12);
                bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
                bytes[++idx] = 0x80 | (c & 0x3F);
            } else {
                bytes[++idx] = 0xF0 | (c >>> 18);
                bytes[++idx] = 0x80 | ((c >>> 12) & 0x3F);
                bytes[++idx] = 0x80 | ((c >>> 6) & 0x3F);
                bytes[++idx] = 0x80 | (c & 0x3F);
            }
        }
        return bytes;
    };

    /**投影法に対応した文字列を返す */
    static getStringProjectionEnum (prj){
        switch (prj) {
            case enmProjection_Info.prjNo:
                return "設定なし";
            case enmProjection_Info.prjSanson:
                return "サンソン図法";
            case enmProjection_Info.prjSeikyoEntou:
                return "正距円筒図法";
            case enmProjection_Info.prjMercator:
                return "メルカトル図法";
            case enmProjection_Info.prjMiller:
                return "ミラー図法";
            case enmProjection_Info.prjLambertSeisekiEntou:
                return "ランベルト正積円筒図法";
            case enmProjection_Info.prjMollweide:
                return "モルワイデ図法";
            case enmProjection_Info.prjEckert4:
                return "エッケルト第４図法";
        }
    }
    /**指定の文字数より長い場合、以降を...で省略して返す。短い場合はそのまま返す */
    static Check_StringLength_And_Cut(Str,MaxLen){
        let rstr  = Str;
        if(rstr.length>MaxLen){
            rstr = rstr.left(MaxLen) + "..."
        }
        return rstr;
} 

/**単独表示モードの文字列を返す */
    static getSolomodeStrings (solomode){
        switch (solomode) {
            case enmSoloMode_Number.ClassPaintMode:
                return "ペイント";
            case enmSoloMode_Number.MarkSizeMode:
                return "記号の大きさ";
            case enmSoloMode_Number.MarkBlockMode:
                return "記号の数";
            case enmSoloMode_Number.ContourMode:
                return "等値線";
            case enmSoloMode_Number.ClassHatchMode:
                return "ハッチ";
            case enmSoloMode_Number.ClassMarkMode:
                return "階級記号";
            case enmSoloMode_Number.ClassODMode:
                return "線";
            case enmSoloMode_Number.MarkTurnMode:
                return "記号の回転";
            case enmSoloMode_Number.MarkBarMode:
                return "棒の高さ";
            case enmSoloMode_Number.StringMode:
                return "文字";
        }
    }

    /**spanの文字のサイズをbodyに設定して求める（改行しない） */
    static getSpanSize(text,fontSize){
        let t = this.createNewSpan(document.body, text, "", "", 0, 0, "", "visibility:hidden");
        t.whiteSpace = 'nowrap';
        t.style.top = '600px';
        t.style.fontSize = fontSize.px();
        let w = t.offsetWidth;
        let h = t.offsetHeight;
        document.body.removeChild(t);
        return new size(w, h);
    }

    /**divの文字のサイズをbodyに設定して求める（指定幅より広いと改行） */
    static getDivSize(text, width, styleinfo) {
        let t = this.createNewDiv(document.body, text, "", "", 0, 0, "", styleinfo + ";visibility:hidden");
        if (width != undefined) {
            t.style.width = width.px();
        }
        let w = t.offsetWidth;
        let h = t.offsetHeight;
        document.body.removeChild(t);
        return new size(w, h);
    }
    /** 線モードの曲線の座標列を求めるための4つのコントロールポイント取得*/
    static Get_OD_Spline_Point(ControlP, OriginP, DestP) {
        let poxy = [];
        let retV = spatial.Distance_PointLine2(ControlP, OriginP, DestP);
        let D = retV.distance;
        let dd1 = Math.abs((OriginP.x - ControlP.x) ** 2 + (OriginP.y - ControlP.y) ** 2 - D ** 2);
        let dd2 = Math.abs((DestP.x - ControlP.x) ** 2 + (DestP.y - ControlP.y) ** 2 - D ** 2);
        if (dd2 < dd1) {
            dd1 = dd2;
        }
        poxy.push(DestP.Clone());
        if (OriginP.y == DestP.y) {
            poxy.push(new point(ControlP.x - Math.sqrt(dd1) * 0.75, ControlP.y));
            poxy.push(new point(ControlP.x + Math.sqrt(dd1) * 0.75, ControlP.y));
        } else if (OriginP.x == DestP.x) {
            poxy.push(new point(ControlP.x, ControlP.y - Math.sqrt(dd1) * 0.75));
            poxy.push(new point(ControlP.x, ControlP.y + Math.sqrt(dd1) * 0.75));
        } else {
            let a = (DestP.y - OriginP.y) / (DestP.x - OriginP.x);
            let xa = Math.sqrt(dd1 / (a * a + 1)) * 0.75;
            if (OriginP.x < DestP.x) { xa = -xa }
            let ya = xa * a;
            poxy.push(new point(ControlP.x - xa, ControlP.y - ya));
            poxy.push(new point(ControlP.x + xa, ControlP.y + ya));
        }
        poxy.push(OriginP.Clone());
        return poxy;
    }

    /**前後文字付き数字入力テキストボックス onChangeでオブジェクトと値を返し、後で数値を設定する場合はHTMLElement.prototype.setNumberValue()を使用 */
    static createNewWordNumberInput(ParentObj, headWord, footWord, defoValue, ID, x, y,headWordWidth, width, onChange, styleinfo) {
        let hsw = this.createNewWordWidthDiv(ParentObj, "", headWord, x, y, 21, headWordWidth, undefined);
        let tx = this.createNewNumberInput(ParentObj, defoValue, ID, x + hsw, y, width, onChange, styleinfo);
        if (footWord != "") {
            Generic.createNewSpan(ParentObj, footWord, "", "", x + width + hsw + 5, y + 3, "", "");
        }
        return tx;
    }

    /**数値に変換する */
    static convValue(value){
        let v=value;
        v = v.replace(/\s+/g, "");//スペース削除
        v = v.replace(/\s+/g, "　");//スペース削除
        v = v.replaceAll("．", ".");
        v = v.replaceAll("－", "-");
        v = v.replaceAll("＋", "+");
        v = v.replace(/[０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        return v;
    }

    /**数字入力テキストボックス 数字以外の入力の場合は元に戻す。onChangeでオブジェクトと値を返し、後で数値を設定する場合はHTMLElement.prototype.setNumberValue()を使用*/
    static createNewNumberInput(ParentObj, defoValue, ID, x, y, width, onChange, styleinfo) {
        let box = this.createNewInput(ParentObj, "text", defoValue, ID, x, y, undefined, "width:" + width.px() + ";" + styleinfo + ";text-align:right;padding:0px 5px 0px 0px ");
        box.preValue = defoValue;
        box.numberCheck = true;//数字のチェックをしない場合はfalseにする
        box.onchange = function () {
            let v = box.value;         
            if (box.numberCheck == false) {
                if(typeof onChange=='function'){
                    onChange(box, v);
                }
            } else {
                if (isNaN(v) == false) {
                    let nv = Number(v);
                    box.preValue = nv;
                    if(typeof onChange=='function'){
                        onChange(box, nv);
                    }
                } else {
                    v=Generic.convValue(v);
                    if (isNaN(v) == false) {
                        let nv = Number(v);
                        box.value = nv;
                        box.preValue = nv;
                        if(typeof onChange=='function'){
                            onChange(box, nv);
                        }
                    } else {
                        //一秒間メッセージを表示
                        let bpos = box.getBoundingClientRect();
                        let divele = Generic.createNewDiv(document.body, "数値を入力して下さい", "", "", bpos.left + width / 2, bpos.top + 20, 110, undefined,
                            "z-index:2000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#ffffdd;text-align:center", "");
                        let timerId = setTimeout(
                            function () {
                                document.body.removeChild(divele);
                                clearTimeout(timerId);
                            }, 1000);
                        box.value = box.preValue;//退避値にもどす
                    }
                }
            }
        }
        return box;
    }

    /**数字入力＋リストボックス onChangeでオブジェクトと値を返し、後で数値を設定する場合はHTMLElement.prototype.setNumberValue()を使用**/
    static createNewNumberComboBox(ParentObj,defoValue,ID,list,x,y,width,maxNumber,onChange){
        let dropinwidth=18;
        let ipsize=this.createNewNumberInput(document.body,defoValue,"",0,0,width-dropinwidth+1,onChange,"visibility:hidden");
        let boxh=ipsize.offsetHeight-2;
        let base=this.createNewDiv(ParentObj,"","","numberCbox",x,y,ipsize.offsetWidth+dropinwidth,boxh,"","");
        document.body.removeChild(document.body.lastChild);
        let ip=this.createNewNumberInput(base,defoValue,ID,0,0,width-dropinwidth,onChange,"border:none");
        this.createNewDiv(base, "▼", "", "", width - dropinwidth, 0, dropinwidth, boxh, "background-Color:white;border:none;cursor:default;text-align:center", dropList);
        return ip;
        function dropList(){
            let e = document.getElementsByName("backDiv");
            let maxZindex = 1000 + e.length*10;
            let d = Generic.createNewDiv(document.body, "", "frontDIV", "setting", 0, 0, '100%', '100%',"",function () {
                //固定ウインドウを消す
                document.body.removeChild(document.body.lastChild);
            });
            d.setAttribute("name", "backDiv");
            d.style.zIndex = maxZindex;
            let rrect=ip.getBoundingClientRect();
            let dropArea=Generic.createNewDiv(d,"","","",rrect.left,rrect.bottom-1,rrect.width+18,100,"background-Color:#ffffff;border:solid 1px;overflow-x:hidden;overflow-y:scroll",undefined);
            let selectList = document.createElement("div");
            dropArea.appendChild(selectList)
            let mainw = 0;
            let lineh;
            for (let i in list) {
                let msp = document.createElement('span');
                document.body.appendChild(msp)
                msp.innerHTML = list[i].caption;
                mainw = Math.max(mainw, msp.offsetWidth);
                lineh = msp.offsetHeight;
                document.body.removeChild(msp);
                y += lineh;
            }
            dropArea.style.height=(Math.min(maxNumber,list.length)*lineh).px();
            for (let i in list) {
                let md = Generic.createNewDiv(selectList, list[i], "", "", 0, lineh * i, mainw + 20, lineh, "padding-left:5px", "");
                md.onmouseover = function () {
                    md.style.backgroundColor = '#dddddd';
                }
                md.onmouseleave = function () {
                    md.style.backgroundColor = 'white';
                }
                md.onclick = function () {
                    ip.value=this.innerText;
                    ip.preValue=ip.value;
                    if(typeof onChange=='function'){
                        onChange(ip,Number(ip.value));
                    }
                }
            }
        }
    }

    /**チェックリストボックス */
    static createNewCheckListBox(ParentObj, ID, list, x, y, width, height, onChange, styleinfo) {
        let lineH = this.getDivSize("A", undefined, "").height + 3;
        let allh = lineH * list.length;
        let ovy = (allh < height - 2) ? "" : "overflow-y: scroll";
        let w = (allh < height - 2) ? width - 2 : width - scrMargin.scrollWidth - 1;
        const frame = this.createNewDiv(ParentObj, "", ID, "grayFrame", x, y, width, height, ovy + "overflow-x:hidden");
        const inFrame = this.createNewDiv(frame, "", ID, "", 0, 0, w, allh, "");
        for (let i in list) {
            let cbox = this.createNewCheckBox(inFrame, list[i].text, "", list[i].checked, 3, i * lineH,undefined, 
                function (obj) {
                    if (typeof onChange == 'function') {
                        onChange(Number(obj.tag), obj.checked);
                    }
                }, styleinfo + ";overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
            cbox.tag = i;
        }
        return frame;
    }


    //**色を指定分明るくまたは暗くする（0を下回った場合は0、255を上回った場合は255） */
    static GetColorArrange(Col,ChangeValue){
        let newcol=Col.Clone();
        let r  = Generic.m_min_max(Col.r + ChangeValue, 0, 255)
        let g  = Generic.m_min_max(Col.g + ChangeValue, 0, 255)
        let b  = Generic.m_min_max(Col.b + ChangeValue, 0, 255)
        newcol.r = r;
        newcol.g = g;
        newcol.b = b;
        return newcol;
    }


    //2次元配列aData()の内容から、データ項目ごとに通常、文字列、カテゴリーと分類する
    static Check_DataType(DataNum, ObjNum, aData) {
        let UNT = [];
        let SS = new clsSortingSearch();
        for (let i = 0; i < DataNum; i++) {
            let f = true;
            for (let j = 0; j < ObjNum; j++) {
                let v = aData[j][i];
                let L = v.length;
                if (L > 20) {
                    f = false;
                    break;
                } else {
                    if (v != "") {
                        if (isNaN(v) == true) {
                                f = false;
                            break;
                        }
                    }
                }
            }
            if (f == false) {
                //文字列のデータ項目の場合
                for (let j = 0; j < ObjNum; j++) {
                    SS.Add(aData[j][i]);
                }
                SS.AddEnd()
                let ctn = SS.EachValue_Array();
                //カテゴリー数が256未満の場合はカテゴリーデータ
                if (ctn.length < 256) {
                    UNT[i] = "CAT";
                } else {
                    UNT[i] = "STR";
                }
            } else {
                UNT[i] = "";
            }
        }
        return UNT;
    }

    //セレクトボックス用投影法リスト
    static getProjectionList() {
        let list = [
            { value: enmProjection_Info.prjMercator, text: 'メルカトル図法' },
            { value: enmProjection_Info.prjMiller, text: 'ミラー図法' },
            { value: enmProjection_Info.prjSeikyoEntou, text: '正距円筒図法' },
            { value: enmProjection_Info.prjLambertSeisekiEntou, text: 'ランベルト正積円筒図法' },
            { value: enmProjection_Info.prjEckert4, text: 'エッケルト第4図法' },
            { value: enmProjection_Info.prjMollweide, text: 'モルワイデ図法' },
            { value: enmProjection_Info.prjSanson, text: 'サンソン図法' }
        ];
        return list;
    }

    /**拡張子取得 */ 
    static getExtension(filename){
        let n=filename.lastIndexOf(".");
        if(n==-1){
            return "";
        }else{
            return filename.mid(n+1,filename.length);
        }
    }

       /**フォルダを除いたファイル名を取得 */
       static getFilename(filename) {
        let hn = filename.lastIndexOf("/");//スラッシュ
        let tx = "";
        if ((hn == -1)) {
            tx = filename;
        } else {
            tx = filename.mid(hn + 1,undefined);
        }
        return tx;
    }

    /**拡張子を除いたファイル名を取得 */
    static getFilenameWithoutExtension(filename) {
        let n = filename.lastIndexOf(".");
        let hn = filename.lastIndexOf("/");//スラッシュ
        let tx = "";
        if ((n == -1) && (hn == -1)) {
            tx = filename;
        } else if (n == -1) {
            tx = filename.right(filename.length - (hn + 1), n);
        } else if (hn == -1) {
            tx = filename.left(n);
        } else {
            tx = filename.mid(hn + 1, n - hn);
        }
        return tx;
    }

    //テキストファイル保存
    static saveText(text, fileName) {
        /// <signature>
        /// <summary>ファイル保存</summary>
        /// </signature> 
        if (fileName == null) {
            fileName = "textfile.txt";
        }
        let blob = new Blob([text], {
            type: "text/plain"
        });
        if (window.navigator.msSaveBlob != null) {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            a.click();
        }
    };

    //座標の文字列取得
    static Get_PositionCoordinate_Strings(P, MPDataMapZahyo, Header_Flag = true) {
        let retPS={};
        switch (MPDataMapZahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku: {
                if (Header_Flag == true) {
                    retPS.x = "Y:";
                    retPS.y = "X:";
                }
                retPS.x += P.x.toFixed(1);
                retPS.y += P.y.toFixed(1);
                break;
            }
            case enmZahyo_mode_info.Zahyo_No_Mode: {
                if (Header_Flag == true) {
                    retPS.x = "X:";
                    retPS.y = "Y:";
                }
                retPS.x += P.x.toFixed(3);
                retPS.y += P.y.toFixed(3);
                break;
            }
            case enmZahyo_mode_info.Zahyo_Ido_Keido: {
                retPS = this.Get_LatLon_PointStrings(P, Header_Flag);
                break;
            }
        }
        return retPS;
    }

    /**緯度経度(latlon)の文字列取得 (.x,.y)*/
    static Get_LatLon_Strings(LatLon, Header_Flag = true) {
        let p = LatLon.toPoint();
        return this.Get_LatLon_PointStrings(p, Header_Flag);
    }

    /**緯度経度(point)の文字列取得*/
    static Get_LatLon_PointStrings(Pos, Header_Flag=true){
        let P = Pos.Clone();
        let retPS ={};

        if( Header_Flag == true ){
            if( P.y < 0 ){
                retPS.y = "南緯";
            }else{
                retPS.y = "北緯";
            }
            let V2  = Math.abs(P.x);
            let V3  = V2 % 360;
            if( 180 < V3 ){
                if( P.x < 0 ){
                    P.x = (P.x - Math.floor(P.x /360) * 360) + 360;
                }else{
                    P.x = (P.x - Math.floor(P.x /360)  * 360) - 360;
                }
            }else{
                P.x = P.x - Math.floor(P.x /360)  * 360;
            }
            if( P.x < 0 ){
                retPS.x = "西経";
            }else{
                retPS.x = "東経";
            }
            P.x = Math.abs(P.x);
            P.y= Math.abs(P.y);
        }else{
            retPS.x = "";
            retPS.y = "";
        }
        if (clsSettingData.Ido_Kedo_Print_Pattern == enmLatLonPrintPattern.DegreeMinuteSecond) {
            let LatLonDMS = new latlon(P.y,p.x).toDegreeMinuteSecond();
            let o = LatLonDMS.LongitudeDMS;
            retPS.x += String(o.Degree) + "度" + String(o.Minute) + "分" + o.Second.toFixed(4) + "秒"
            let a = LatLonDMS.LatitudeDMS;
            retPS.y += String(a.Degree) + "度" + String(a.Minute) + "分" + a.Second.toFixed(4) + "秒"
        } else {
            retPS.x += P.x.toFixed(6) + "度";
            retPS.y += P.y.toFixed(6)  + "度";
        }
        return retPS;
    }

    //メッシュコードの文字の長さを取得
    static getMeshCodeLength(MeshNumber) {
        let CodeLen;
        switch (MeshNumber) {
            case enmMesh_Number.mhFirst: {
                CodeLen = 4;
                break;
            }
            case enmMesh_Number.mhSecond: {
                CodeLen = 6;
                break;
            }
            case enmMesh_Number.mhThird: {
                CodeLen = 8;
                break;
            }
            case enmMesh_Number.mhHalf: {
                CodeLen = 9;
                break;
            }
            case enmMesh_Number.mhQuarter: {
                CodeLen = 10;
                break;
            }
            case enmMesh_Number.mhOne_Eighth: {
                CodeLen = 11;
                break;
            }
            case enmMesh_Number.mhOne_Tenth: {
                CodeLen = 10;
                break;
            }
        }
        return CodeLen;
    }

    /**距離単位をvalueとtextの配列で返す */
    static getScaleUnit_for_select(){
        let list=[];
        let scl=[enmScaleUnit.centimeter,enmScaleUnit.meter,enmScaleUnit.kilometer,enmScaleUnit.inch,enmScaleUnit.feet,enmScaleUnit.yard,enmScaleUnit.mile,
            enmScaleUnit.syaku,enmScaleUnit.ken,enmScaleUnit.ri,enmScaleUnit.kairi];
            for (let i in scl){
                list.push({ value: scl[i], text: this.getScaleUnitStrings(undefined, scl[i]) });
            }
            return list;
    }

    
    /**距離単位列挙型から面積文字列を返す */
    static getScaleUnitAreaStrings(scl) {
        switch (scl) {
            case enmScaleUnit.meter:
                return "㎡";
            case enmScaleUnit.kilometer:
                return "㎢";
            case enmScaleUnit.centimeter:
                return "㎠";
            case enmScaleUnit.inch:
                return "sq in";
            case enmScaleUnit.feet:
                return "sq ft";
            case enmScaleUnit.yard:
                return "sq yd";
            case enmScaleUnit.mile:
                return "sq mi";
            case enmScaleUnit.syaku:
                return "平方尺";
            case enmScaleUnit.ken:
                return "坪";
            case enmScaleUnit.ri:
                return "平方里";
            case enmScaleUnit.kairi:
                return "平方海里";
            default:
                return "km";
        }
    }

    ///*距離単位列挙型と値から距離文字列を返す 距離単位だけの場合はValue=undefined*/
    static getScaleUnitStrings(Value, scl) {
        let vs;
        if(Value==undefined){
            vs="";
        }else{
            vs = Value.toString();
        }
        switch( scl){
            case enmScaleUnit.meter:
                return vs + "m";
                break;
            case enmScaleUnit.kilometer:
                return vs + "km";
                break;
            case enmScaleUnit.centimeter:
                return vs + "cm";
                break;
            case enmScaleUnit.inch:
                return vs + "inch";
                break;
            case enmScaleUnit.feet:
                if (Value == 1) {
                    return "1 foot";
                } else {
                    return vs + "feet";
                }
                break;
            case enmScaleUnit.yard:
                if (Value == 1) {
                    return "1 yard";
                } else {
                    return vs + " yards";
                }
            case enmScaleUnit.mile:
                if (Value == 1) {
                    return "1 mile";
                } else {
                    return vs + " miles";
                }
                break;
            case enmScaleUnit.syaku:
                return vs + "尺";
                break;
            case enmScaleUnit.ken:
                return vs + "間";
                break;
            case enmScaleUnit.ri:
                return vs + "里";
                break;
            case enmScaleUnit.kairi:
                return vs + "海里";
                break;
            default:
                return vs + "km"
                break;
        }
    }

    //距離単位の変換係数を求める
    static Convert_ScaleUnit(from_Unit, to_Unit){
        let kmco = [];
        kmco[enmScaleUnit.meter] = 1000;
        kmco[enmScaleUnit.kilometer] = 1;
        kmco[enmScaleUnit.centimeter] = 100000;
        kmco[enmScaleUnit.inch] = 39370.078740157;
        kmco[enmScaleUnit.feet] = 3280.8398950131;
        kmco[enmScaleUnit.yard] = 1093.6132983377;
        kmco[enmScaleUnit.mile] = 0.62137119223733;
        kmco[enmScaleUnit.syaku] = 3300;
        kmco[enmScaleUnit.ken] = 550;
        kmco[enmScaleUnit.ri] = 0.25462962962963;
        kmco[enmScaleUnit.kairi] = 0.53995680345572;

        let fromdis = kmco[from_Unit];
        let todis = kmco[to_Unit];
        return (todis / fromdis);
}

    //レイヤの形状ごとの数を入れた配列から、可能な形状を返す
    static checkShape(Shape) {
        if (Shape[enmShape.PointShape] > 0) {
            return enmShape.PointShape;
        } else if (Shape[enmShape.LineShape] > 0) {
            return enmShape.LineShape;
        } else {
        return enmShape.PolygonShape;
        }
    }

    static RGBAfromElement(ele) {
        //要素の背景色をcolorRGBAに変換して返す
        let opa=1 ;
        let bcol = ele.style.backgroundColor;
        let k1 = bcol.indexOf("(");
        let k2 = bcol.indexOf(")");
        let cola = bcol.slice(k1 + 1, k2);
        let RGB = cola.split(",");
        if (RGB.length == 4) {
            opa = parseFloat(RGB[3]);
        }
        opa *= 256;
        let col = new colorRGBA([parseInt(RGB[0]), parseInt(RGB[1]), parseInt(RGB[2]), opa]);
        return col;
    }
    static Set_Box_Position_in_Browser(e_point, box) {	//
        /// <signature>
        /// <summary>ブラウザからはみださないようにボックスの位置を決める</summary>
        /// <param name="e" >イベントの引数</param>
        /// <param name="box" >div等の要素</param>
        /// </signature> 
        box.style.left = "0px"; //いったん左上に移す（高さ、幅の自動調整をなくすため）
        box.style.top = "0px";

        let x;
        let y;
        if(e_point instanceof point){
            x=e_point.x;
            y=e_point.y;
        }else{
            x = e_point.clientX; //ページ内でのマウスカーソル位置を取得
            y = e_point.clientY;
        }
        if (x == 'undefined') {
            x = e_point.pageX;
            y = e_point.pageY;
        } else {
            x += document.body.scrollLeft;
            y += document.body.scrollTop;
        }
        y += 5;
        x += 5;
        var clientWidth =this.getBrowserWidth();     //ウインドウの高さと幅
        var clientHeight = this.getBrowserHeight();
        var boxWidth = box.scrollWidth;		//作成したボックスの高さと幅
        var boxHeight = box.scrollHeight;
        if ((y + boxHeight - document.body.scrollTop) > clientHeight) {	//縦にはみ出る場合
            y = document.body.scrollTop + clientHeight - boxHeight - 10;
        }
        if ((x + boxWidth - document.body.scrollLeft) > clientWidth) {  //横にはみ出る場合
            x = clientWidth - boxWidth - 20;
        }
        box.style.left = x.px();
        box.style.top = y.px();
    }

    static Check_Point_in_screen(p, ScrData, Mode) {
        //定義
        //Mode=0/SRX:SRY  Mode=1/SR:SY
        //ScrData.ScrRectangle.Left = SRX(0): ScrData.ScrRectangle.Top = SRY(0)
        //ScrData.ScrRectangle.Right = SRX(MapScreen.ScaleWidth): ScrData.ScrRectangle.bottom = SRY(MapScreen.ScaleHeight)

        switch (Mode) {
            case 0:
                return ScrData.ScrRectangle.contains(p);
                break;
            case 1:
                return ScrData.MapScreen_Scale.contains(p);
                break;
        }
    }

    //属性データタイプ列挙型から文字を返す
    static ConvertAttDataTypeString(dataType) {
        switch (dataType) {
            case enmAttDataType.Normal:
                return "通常のデータ";
                break;
            case enmAttDataType.Category:
                return "ｶﾃｺﾞﾘｰﾃﾞｰﾀ";
                break;
            case enmAttDataType.Strings:
                return "文字データ";
                break;
            case enmAttDataType.URL:
                return "URLのアドレス";
                break;
            case enmAttDataType.URL_Name:
                return "URLの名称";
                break;
            case enmAttDataType.Lon:
                return "経度";
                break;
            case enmAttDataType.Lat:
                return "緯度";
                break;
            case enmAttDataType.Place:
                return "場所";
                break;
            case enmAttDataType.Arrival:
                return "到着時刻";
                break;
            case enmAttDataType.Departure:
                return "出発時刻";
                break;
            default:
                return "その他" //本当はこれは出現しない
                break;
        }
    }

    //selectのアイテム削除後に、次のインデックスを指定する
    static ListIndex_Reset(select, Old_n) {
        if (select.options.length == 0) {
            return;
        }
        if (Old_n == select.options.length) {
            select.selectedIndex = Old_n - 1;
        } else {
            select.selectedIndex = Old_n;
        }
    }


    //形状列挙型からその文字を返す
    static ConvertShapeEnumString(shape) {
        switch (shape) {
            case enmShape.LineShape:
                return "線";
                break;
            case enmShape.PointShape:
                return "点";
                break;
            case enmShape.PolygonShape:
                return "面";
                break;
            case enmShape.NotDeffinition:
                return "未指定" //本当はこれは出現しない
                break;
        }
    }

    //イベント情報からcanvas上の座標位置を求める
    static getCanvasXY(e) {
        let cx = e.clientX;
        let cy = e.clientY;
        let rx = cx - (e.target.parentNode.style.left.removePx() + e.target.style.left.removePx());
        let ry = cy - (e.target.parentNode.style.top.removePx() + e.target.style.top.removePx());
        return new point(rx, ry);
    }

        //イベント情報からcanvas上の座標位置を求める
        static getCanvasXY2(e) {
            let cx = e.clientX;
            let cy = e.clientY;
            if(typeof e.target.getBoundingClientRect !='function'){
                return undefined;//ブラウザ外に移動した場合
            }
            let rx = cx - (e.target.getBoundingClientRect().x);
            let ry = cy - (e.target.getBoundingClientRect().y);
            return new point(rx, ry);
        }

    //画面表示領域変更の可否のチェック
    static Check_New_ScrView(MapRect, new_Rect) {
        if (new_Rect.width() > MapRect.width() / 5000) {
            //拡大しすぎでない場合
            if (new_Rect.width() < MapRect.width() * 10) {
                //縮小しすぎでない場合
                return true;
            }
        }
        return false;
    }

    //集成オブジェクトの輪郭線（>ラインコード）のみを抽出し、必要なラインコードに変換して返す
    static Get_Outer_Mpline_AggregatedObj(LCode, Shape) { //LCode:EnableMPLine_Data
        let lc = this.ArrayClone(LCode);

        let ncode = [];
        for (let i = 0; i < lc.length; i++) {
            let k = lc[i].LineCode;
            if (k != -1) {
                for (let j = i+1; j < lc.length; j++) {
                    if (k == lc[j].LineCode) {
                        lc[j].LineCode = -1;
                        //面形状の場合は重複するラインは使用しない
                        //線形上の場合は、最初の1回だけ使用する
                        if (Shape == enmShape.PolygonShape) {
                            lc[i].LineCode = -1;
                        }
                    }
                }
            }
            if (lc[i].LineCode != -1) {
                ncode.push(lc[i]);
            }
        }
        return ncode;
    }

    //タイトル、単位から属性データタイプ列挙型を返す
    static getAttDataType_From_TitleUnit(Title, Unit) {
        let dtype;
        let UTitle = Title.toUpperCase();
        if (UTitle == "URL") {
            dtype = enmAttDataType.URL;
        } else if (UTitle == "URL_NAME") {
            dtype = enmAttDataType.URL_Name;
        } else if (UTitle == "LON") {
            dtype = enmAttDataType.Lon;
        } else if (UTitle == "LAT") {
            dtype = enmAttDataType.Lat;
        } else if (UTitle == "PLACE") {
            dtype = enmAttDataType.Place;
        } else if (UTitle == "ARRIVAL") {
            dtype = enmAttDataType.Arrival;
        } else if (UTitle == "DEPARTURE") {
            dtype = enmAttDataType.Departure;
        } else if (Unit.toUpperCase() == "CAT") {
            dtype = enmAttDataType.Category;
        } else if (Unit.toUpperCase() == "STR") {
            dtype = enmAttDataType.Strings;
        } else {
            dtype = enmAttDataType.Normal;
        }
        return dtype;
    }

    //属性データタイプ列挙型からTITLE、単位文字列を設定

    /** @returns {MyType} */
    static SetTitleUnit_from_AttDataType(dtype, defoTitle, defoUnit, ) {
        let Title=defoTitle;
        let Unit=defoUnit;
        switch (dtype) {
            case enmAttDataType.Normal:
                if ((defoTitle.toUpperCase() == "URL") || (defoTitle.toUpperCase() == "URL_NAME")) {
                    Title = "データ" + Title
                }
                if ((defoUnit.toUpperCase() == "CAT") || (defoUnit.toUpperCase() == "STR")) {
                    Unit = ""
                }
                break;
            case enmAttDataType.Lon:
                Title = "LON";
                Unit = "";
                break;
            case enmAttDataType.Lat:
                Title = "LAT";
                Unit = "";
                break;
            case enmAttDataType.Category:
                Unit = "CAT";
                break;
            case enmAttDataType.Strings:
                Unit = "STR";
                break;
            case enmAttDataType.URL:
                Title = "URL";
                break;
            case enmAttDataType.URL_Name:
                Title = "URL_NAME";
                break;
            case enmAttDataType.Arrival:
                Title = "ARRIVAL";
                break;
            case enmAttDataType.Departure:
                Title = "DEPARTURE";
                break;
            case enmAttDataType.Place:
                Title = "PLACE";
        }
        return { title: Title, unit: Unit }
    }


    //オブジェクトが同じかどうか調べる
    static equal(objecta, objectb) {
        return (JSON.stringify(objecta) == JSON.stringify(objectb))
    }
    static Clone(odata) {
        return JSON.parse(JSON.stringify(odata));
    }

    //配列のシャローコピー
    static ArrayShallowCopy(Arr){
        return Arr.concat();
    }
    /**Cloneメソッドを持つオブジェクトの配列をコピーする */ 
    static ArrayClone(array) {
        if (array.length==0){
            return [];
        }
        if (typeof array[0].Clone != 'function') {
            //Clone関数を持たない場合
            return undefined;
        }
        let rea = array.map(x => x.Clone());
        return rea;
    }
    /**Cloneメソッドを持つオブジェクトの2次元配列をコピーする */
    static Array2Clone(array){
        let ca = [];
        for (let i = 0; i < array.length; i++) {
            ca.push(this.ArrayClone(array[i]));
        }
        return ca;
    }

    
    static m_min_max(V, Min, Max) {
        //検査値がMinより小さければMinを返し、Maxより大きければMaxを返す

        if (V < Min) {
            return Min;
        }

        if (V > Max) {
            return Max;
        }
        return V;

    }

    //画面の幅取得
    static getBrowserWidth() {
        if (window.innerWidth) {
            return window.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientWidth != 0) {
            return document.documentElement.clientWidth;
        }
        else if (document.body) {
            return document.body.clientWidth;
        }
        return 0;
    }

    //画面の高さ取得
    static getBrowserHeight() {
        if (window.innerHeight) {
            return window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight != 0) {
            return document.documentElement.clientHeight;
        }
        else if (document.body) {
            return document.body.clientHeight;
        }
        return 0;
    }

    //ドキュメントの高さ取得
    static getDocumentHeight() {
        var h = Math.max.apply(null, [document.body.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]);
        return h;
    }

    //ウィンドウで表示  
    static CenterPage(help_url, Xv, Yv) {
        if (win2p == "on") {
            if (new2.closed) { } else { new2.close(); }
        }
        win1p = "on";
        Xw = Xv + 50;
        Yw = Yv + 80;
        new2 = window.open(help_url, "_blank", "titlebar=No,status=0,scrollbars=1,resizable=0,width=" + Xw + ",height=" + Yw + "");
        if (navigator.appVersion.charAt(0) >= 3) { new2.focus() };
    }

    //ボタン作成
    static createNewButton(ParentObj, text, ID, x, y, onClick, styleinfo) {
        var ok = this.createNewInput(ParentObj, "button", text, ID, x, y, "", styleinfo);
        ok.addEventListener('click', onClick);
        ParentObj.appendChild(ok);
        return ok;
    }


    //img要素作成
    static createNewImage(ParentObj, src,alt, ID, Class, x, y, styleinfo, onclick) {
        var obj = document.createElement("img");
        obj.src = src;
        obj.alt = alt;
        obj.setAttribute("id", ID);
        obj.setAttribute("class", Class);
        obj.setAttribute("onclick", onclick);
        obj.setAttribute("style", "position:absolute;" + styleinfo)
        obj.style.top = y.px();
        obj.style.left = x.px();
        ParentObj.appendChild(obj);
        return obj;
    }

    //span要素作成
    static createNewSpan(ParentObj, innerHtml, ID, Class, x, y, styleinfo, onclick) {
        var obj = document.createElement("span");
        obj.setAttribute("id", ID);
        obj.setAttribute("class", Class);
        obj.onclick= onclick;
        obj.innerHTML = innerHtml;
        obj.setAttribute("style", "position:absolute;" + styleinfo)
        obj.style.top = y.px();
        obj.style.left = x.px();
        ParentObj.appendChild(obj);
        return obj;
    }

    //文字配列中の同じ文字を削除した配列を返す
    static Remove_Same_String(ST) {
        let ST2 = [];
        let sdv = [];
        let n = ST.length;
        for (let i = 0; i < n - 1; i++) {
            if (sdv[i] == undefined) {
                for (let j = i + 1; j < n; j++) {
                    if ((ST[i] == ST[j]) && (sdv[j] == undefined)) {
                        sdv[j] = true;
                    }
                }
            }
        }
        for (let i = 0; i < n; i++) {
            if (sdv[i] == undefined) {
                ST2.push(ST[i]);
            }
        }
        return ST2;
    }

    //二色の間で指定の数だけグラデーションをかける
    static TwoColorGradation(StartCol, EndCol, n) {
        let ColData = [];
        let a1 = StartCol.a;
        let AL = EndCol.a - a1;
        let r1 = StartCol.r;
        let RL = EndCol.r - r1;
        let g1 = StartCol.g;
        let GL = EndCol.g - g1;
        let B1 = StartCol.b;
        let BL = EndCol.b - B1;
        let cf = 0;
        if (n >= 3) {
            if (EndCol.toHex() == '#ffffff') {
                cf = 1;
            }
            if (StartCol.toHex() == '#ffffff') {
                cf = -1
            }
        }
        for (let i = 0; i < n; i++) {
            let v = i / (n - 1);
            if ((i >= 1) && (i <= n - 2) && (cf != 0)) {
                v = v + 1 / (2 * (n - 1)) * cf;
            }
            let a = a1 + AL * v;
            let b = B1 + BL * v;
            let r = r1 + RL * v;
            let g = g1 + GL * v;
            ColData[i] = new colorRGBA([ r, g, b,a]);
        }
        return ColData;
    }

    //3色の間で指定の数だけグラデーションをかける
    static ThreeColorGradation(StartCol, CenterCol, EndCol, n, Color_cng_n) {
        let ColData = [];
        let coldata1 = this.TwoColorGradation(StartCol, CenterCol, Color_cng_n + 1);
        for (let i = 0; i <= Color_cng_n; i++) {
            ColData[i] = coldata1[i];
        }
        coldata1 = this.TwoColorGradation(CenterCol, EndCol, n - Color_cng_n);
        for (let i = Color_cng_n; i < n; i++) {
            ColData[i] = coldata1[i - Color_cng_n];
        }
        return ColData;
    }

    //最大値と最小値を指定の区分数で切りのよい数字で区切る
    static WIC(CUTN, Max, Min) {
        if (Max == Min) {
            return { max: Max + 1, min: Min - 1, step: 1 }
        }
        let ret = {};

        let H = Max - Min;
        let f = 1;
        let deci = this.Figure_Arrange(Max);
        let deci2 = this.Figure_Arrange(Min);
        if (deci.BeforeDecimal + deci2.BeforeDecimal == 0) {
            let f = 10 ** deci2.AfterDecimal;
            Max = Max * f;
            Min = Min * f;
            H = H * f;
        } else {
            let deci3 = this.Figure_Arrange(H);
            if (deci3.BeforeDecimal == 0) {
                f = 10 ** deci3.AfterDecimal;
                Max = Max * f;
                Min = Min * f;
                H = H * f;
            }
        }
        let deci4 = this.Figure_Arrange(H);
        let b = 10 ** (deci4.BeforeDecimal - 1);
        let w = (1 + Math.floor(H / b)) * b / CUTN;
        let deci5 = this.Figure_Arrange(w)
        b = 10 ** (deci5.BeforeDecimal - 1);
        let w2 = w;
        w = Math.floor(w / b) * b
        if (w == 0) {
            w = w2 / b;
        }
        b = 10 ** (deci4.BeforeDecimal - 1);
        H = Math.floor(Min / b) * b;
        if ((H >= 0) || (Max <= 0)) {
        } else {
            let H2 = H;
            while (H2 < 0) {
                H2 += w;
            }
            H -= H2;
        }
        ret.step = w / f;
        let a = H / f;
        ret.min = a;
        let n = 0;
        while (a < Max / f) {
            a += ret.step;
            n++;
        }
        ret.max = ret.min + ret.step * n;
        return ret;
    }

    static Figure_Arrange(Value) {
        let Left, Right;

        if (Value == 0) {
            Left = 1;
        } else {
            Left = Math.floor(Math.log10(Math.abs(Value))) + 1;
        }
        let b = String(Value);
        let c = b.indexOf(".");
        if ((c == -1) || (b.indexOf("E+") != -1)) {
            Right = 0;
        } else if (b.indexOf("E-") != -1) {
            Right = b.length - b.indexOf("E") + Math.floor(b.slice(b.indexOf("-") + 1));
        } else {
            Right = b.slice(c + 1).length;
        }
        if (Left < 0) {
            Left = 0;
        }
        return { BeforeDecimal: Left, AfterDecimal: Right };
    }

    static Figure_Using_Solo(val, commma_f) {

        let retv = this.Figure_Arrange(val);
        let L = retv.BeforeDecimal;
        let r = retv.AfterDecimal;
        if (L == 0) {
            L = 1;
        }
        if (val < 0) {
            L++;
        }
        return this.Figure_Using3(val, L, r, commma_f);
    }

    //指定した数値を、指定した小数点以下桁数の文字列に変換して返す
    static Figure_Using(Value, RightOfDecimaplPoint) {
        return Value.toFixed(RightOfDecimaplPoint);
    }

    static Figure_Using3(Value, LeftOfDecimalPoint, RightOfDecimaplPoint, Comma_f) {
        
        let Comma_Num;
        if (Comma_f == true) {
            Comma_Num = Math.floor((LeftOfDecimalPoint - 1) / 3);
        } else {
            Comma_Num = 0;
        }
        let Num = Comma_Num + LeftOfDecimalPoint + RightOfDecimaplPoint;
        if (RightOfDecimaplPoint > 0) {
            Num++;
        }
        let FL = " ".repeat(LeftOfDecimalPoint);
        if (Comma_f == true) {
            FL += Math.floor(Value).toLocaleString();
        } else {
            FL += String(Math.floor(Value));
        }
        if (RightOfDecimaplPoint != 0) {
            FL += "." + Number(Value).toFixed(RightOfDecimaplPoint).split(".")[1];
        }
        FL = FL.right(Num);
        return FL;
    }

    //配列から特定の値の位置を取り出す
    static Get_Specified_Value_Array(Original_Array, Specified_Value) {
        let retArray = [];
        for (let key in Original_Array) {
            if (Original_Array[key] == Specified_Value) {
                retArray.push(key);
            }
        }
        return retArray;
    }
    //配列中の指定した値の数をカウントする
    static Count_Specified_Value_Array(Original_Array, Specified_Value) {
        let n = 0;
        for (let key in Original_Array) {
            if (Original_Array[key] == Specified_Value) {
                n++;
            }
        }
        return n;
    }
    /**配列中から含まれる要素とその数の一覧の配列[{value: num:}]を返す */
    static getArrayContentsList(originArray){
        let s=new clsSortingSearch();
        s.AddRange(originArray);
        return s.EachValue_Array();
    }

    /**タブ作成(base.panel[]に内部要素を追加する) */
    static createNewTab(ParentObj, tabList, firstSel, x, y, width, height) {
        let tabh = 20;
        let base = this.createNewDiv(ParentObj, "", "", "", x, y, width, height, "", "");
        base.tab = [];
        base.selectedIndex = firstSel;
        base.panel = [];
        let n = tabList.length;
        let tabw = Math.floor(width - 20) / n;
        for (let i = 0; i < n; i++) {
            let tab = this.createNewDiv(base, tabList[i], "", "", i * tabw, 0, tabw, tabh, "border:solid 1px;border-color:#666666;line-height:"+(tabh-2).px(), tabclick);
            tab.style.backgroundColor = "#e1e1e1";
            tab.align = 'center';
            tab.tag = i;
            base.tab.push(tab);
            let panel = this.createNewDiv(base, "", "", "", 0, tabh + 1, width, height - tabh - 1, "border:solid 1px;border-color:#666666;border-bottom-right-radius:3px;border-bottom-left-radius:3px;border-top-right-radius:3px", "");
            panel.tag = i;
            panel.setVisibility(false);
            panel.style.backgroundColor = "#ffffff";
            base.panel.push(panel);
        }
        base.tab[firstSel].style.backgroundColor = "#ffffff";
        base.panel[firstSel].style.visibility = "visible";
        base.panel[firstSel].setVisibility(true);
        let mask = this.createNewDiv(base, "", "", "", 0, tabh - 1, tabw - 1, 3, "");
        mask.style.backgroundColor = "#ffffff";
        mask.style.left = (firstSel * tabw + 1).px();
        return base;
        function tabclick(e) {
            for (let i = 0; i < n; i++) {
                base.tab[i].style.backgroundColor = "#e1e1e1";
                base.panel[i].setVisibility(false);
            }
            this.style.backgroundColor = "#ffffff";
            base.panel[this.tag].setVisibility(true);
            base.selectedIndex = Number(this.tag);
            mask.style.left = (this.tag * tabw + 1).px();
        }
    }

    static createNewDiv(ParentObj, innerHtml, ID, Class, x, y, width, height, styleinfo, onclick) {
        /// <signature>
        /// <summary>div要素を作成</summary>
        /// <param name="ParentObj">親要素</param>  
        /// <param name="innerHtml">innerHtml</param>  
        /// <param name="ID">ID</param>  
        /// <param name="Class">クラス名</param>  
        /// <param name="x">座標</param>  
        /// <param name="y">y座標</param>  
        /// <param name="width">幅</param>  
        /// <param name="height">高さ</param>  
        /// <param name="styleinfo">スタイルシート文字列</param>  
        /// <param name="onclick">onclickイベント</param>  
        /// <returns >div要素</returns>  
        /// </signature>
        var obj = document.createElement("div");
        obj.setAttribute("id", ID);
        obj.setAttribute("class", Class);
        obj.setAttribute("onclick", onclick);
        obj.setAttribute("style", "position:absolute;" + styleinfo);
        obj.onclick = onclick;
        obj.innerHTML = innerHtml;
        obj.style.top = y.px();
        obj.style.left = x.px();
        if (width != undefined) {
            if ((typeof width) == 'string') {
                obj.style.width = width;
            } else {
                obj.style.width = width.px();
            }
        }
        if (height != undefined) {
            if ((typeof height) == 'string') {
                obj.style.height = height;
            } else {
                obj.style.height = height.px();
            }
        }
        ParentObj.appendChild(obj);
        return obj;
    }


    /**
     *ラジオボタン要素をリスト(value,text,checked)で作成onClickで選択されたValueを返す
     * @static
     * @param {*} yplus 配列の場合は個別にプラス
     * @param {*} defoCheckValue
     * @param {*} onClick
     * @param {*} styleinfo
     * @memberof Generic
     */
    static createNewRadioButtonList(ParentObj, name, list, x, y,wordWidth, yplus,defoCheckValue, onClick, styleinfo) {
        let sy = y;
        for (let i = 0; i < list.length; i++) {
            this.createNewRadioButton(ParentObj, list[i].text, "radio" + name + i, name, (list[i].value == defoCheckValue), list[i].value, x, sy, wordWidth, onClick, styleinfo);
            if (Array.isArray(yplus)) {
                sy += yplus[i];
            } else {
                sy += yplus;
            }
        }
    }
    /**ラジオボタン要素作成 onClickで選択されたValueを返す */
    static createNewRadioButton(ParentObj, text, ID, name, checked,value, x, y,wordWidth, onClick, styleinfo) {
        let ok = this.createNewInput(ParentObj, "radio", "", ID, x, y, "", styleinfo);
        ok.addEventListener('change', change);
        ok.value = value;
        ok.setAttribute("name", name);
        if (checked == true) {
            ok.setAttribute("checked", "")
        }
        let asize = Generic.getDivSize(text, wordWidth, "");
        let sp=Generic.createNewDiv(ParentObj, text, "div"+ID, "", x+10, y + 16 / 2 - asize.height / 2, wordWidth, undefined, styleinfo+";padding-left:15px", undefined);
        ok.setAttribute("name", name);
        sp.tag = ID;
        sp.addEventListener('click', function gg(e) {
            let obj = document.getElementById(e.target.tag);
            if (obj.disabled == false) {
                obj.checked = true;
                change();
            }
        }, false);
//        sp.addEventListener('click', onClick, false);
        function change(){
            if (typeof (onClick) == "function") {
                let v=ok.value;
                if (isNaN(v)==false){
                    v=Number(v);
                }
                onClick(v);
            }
        }
    }

    //ラジオボタンの指定valueの要素をenabled/disableする
    static enableRadioByValue(name, value, enabled) {
        let rd = document.getElementsByName(name);
        for (let i = 0; i < rd.length; i++) {
            let v = rd[i].value;
            if ((isNaN(v) == false) && (isNaN(value) == false)) {
                v = Number(v);
            }
            if (v == value) {
                rd[i].disabled = !enabled;
                break;
            }
        }
    }
    //ラジオボタンの指定valueの要素をチェックする
    static checkRadioByValue(name, value) {
        let rd = document.getElementsByName(name);
        for (let i = 0; i < rd.length; i++) {
            let v = rd[i].value;
            if ((isNaN(v) == false) && (isNaN(value) == false)) {
                v = Number(v);
            }
            if (v == value) {
                rd[i].checked = true;
                break;
            }
        }
    }

    //ラジオボタンのチェック要素のvalueを取得する
    static getRadioCheckByValue(name) {
        let rd = document.getElementsByName(name);
        for (let i = 0; i < rd.length; i++) {
            if (rd[i].checked==true) {
                let v=rd[i].value;
                if (isNaN(v)==false){
                    v=Number(v);
                }
                return v;
                break;
            }
        }
        return undefined;
    }

    /**チェックボックス要素作成 onClickでは要素を返す */
    static createNewCheckBox(ParentObj, text, ID, checked, x, y,wordWidth, onClick, styleinfo) {
        let ok = this.createNewInput(ParentObj, "checkbox", "", ID, x, y, undefined, styleinfo);
        if (checked == true) {
            ok.setAttribute("checked", "")
        }
        ok.onchange = change;
        this.createNewWordWidthDiv(ParentObj, "", text, x + 20, y, 18, wordWidth, spnClick);
        function spnClick() {
            if(ok.disabled==false){
                ok.checked = !ok.checked;
                change();
                }
        }
        function change(){
            if (typeof (onClick) == "function") {
                onClick(ok);
            }
        }
        return ok;
    }

    /**inputText要素作成*/
    static createNewWordTextInput(ParentObj, headWord, footWord, defoText, ID, x, y,headWordWidth, boxWidth, onChange, styleinfo) {
        let hsw = this.createNewWordWidthDiv(ParentObj, "", headWord, x, y, 21, headWordWidth, undefined);
        styleinfo = "width:" + String(boxWidth) + "px;" + styleinfo;
        let tx = this.createNewInput(ParentObj, "text", defoText, ID, x + hsw, y, undefined, styleinfo);
        tx.onchange = onChange;
        if (footWord != "") {
            Generic.createNewSpan(ParentObj, footWord, "", "", x + boxWidth + hsw + 5, y + 3, "", "");
        }
        return tx;
    }

    /**イメージボタン */
    static createNewImageButton(ParentObj,ID,src,x,y,width,height,onClick,styleinfo){
        let ok=document.createElement("img");
        ok.setAttribute("style", "position:absolute;width:"+width.px()+";height:" +height.px() +";"+ styleinfo);
        ok.style.top = y.px();
        ok.style.left = x.px();
        ok.setAttribute("id", ID);
        ok.setAttribute("class", "imgButton");
        ok.setAttribute("src", src);
        ok.onclick = onClick;
        ParentObj.appendChild(ok);
        return ok;

    }


    //** input要素作成*/
    static createNewInput(ParentObj, type, text, ID, x, y, onClick, styleinfo) {
        let ok = document.createElement("input");
        ok.setAttribute("type", type);
        ok.setAttribute("id", ID);
        ok.setAttribute("value", text);
        ok.setAttribute("onclick", onClick);
        ok.setAttribute("style", "position:absolute;" + styleinfo);
        ok.style.top = y.px();
        ok.style.left = x.px();
        ParentObj.appendChild(ok);
        return ok;
    }

    /** 改行つきDIV作成*/
    static createNewWordWidthDiv(ParentObj, ID, word,  x, y,lineHeight,wordWidth, onclick,styleinfo=""){
        if (word == "") {
            return 0;
        } else {
            let asize = Generic.getDivSize(word, wordWidth,styleinfo);
            Generic.createNewDiv(ParentObj, word, "", "", x, y + lineHeight / 2 - asize.height / 2, wordWidth, undefined, styleinfo, onclick);
            return asize.width + 5;
        }
    }

    //タイルdivボックス
    static createNewTileBox(ParentObj, ID, word, defoTile, x, y,wordWidth, onclick, tileWidth = 45) {
        let lineH = 23;
        let hsw = this.createNewWordWidthDiv(ParentObj, "", word, x, y, lineH, wordWidth, undefined);
        const tilebox = Generic.createNewDiv(ParentObj, "", ID, "imgButton", x + hsw, y, tileWidth, lineH, "", onclick);
        Generic.createNewDiv(tilebox, "透明", "", "", 0, 3, tileWidth, lineH, "pointer-events: none;text-align:center", "");
        Generic.setTileDiv(tilebox, defoTile);
        return tilebox;
            }

    //タイルDIVに設定
    static setTileDiv(tileDiv, Tile) {
        const trans = tileDiv.children;
        if(trans.length==0){
            return;
        }
        if (Tile.BlankF == true) {
           trans[0].style.display = "inline";
            tileDiv.style.backgroundColor = 'white';
        } else {
           trans[0].style.display = "none";
            tileDiv.style.backgroundColor = Tile.Color.toRGBA();
        }
    }

    //** 背景Canvasボックス */
    static createNewWordDivCanvas(ParentObj, ID, word, x, y,wordWidth, onclick) {
        let lineH = 23;
        let hsw = this.createNewWordWidthDiv(ParentObj, "", word, x, y, lineH, wordWidth, undefined);
        const canv = Generic.createNewCanvas(ParentObj, ID, "imgButton", x + hsw, y, 45, lineH, onclick,"");
        return canv;
    }



    //** 色divボックス */
    static createNewColorBox(ParentObj,ID, word,color, x, y, onclick) {
        let sp = Generic.createNewSpan(ParentObj, word, "", "", x, y + 3, "", "");
        let sw = sp.offsetWidth;
        if (sw < 35) {
            sw = 35;
        } else {
            sw += 10;
        }
        const colbox = Generic.createNewDiv(ParentObj, "", ID, "imgButton", x + sw, y, 45, 23, "", colSelect);
        if(color instanceof colorRGBA){
            colbox.style.backgroundColor = color.toRGBA();
        }
        return colbox;
        function colSelect(e) {
            clsColorPicker(e, onclick);
        }
    }

    /**サイズ選択用select valueType:配列はそのまま入れる、1（0.1間隔）,2(0.5),3(5),4(10))、onChangeでは要素,オブジェクトと値を返す*/ 
    static createNewSizeSelect(ParentObj, defoValue, ID,preWord, x, y,preWordWidth,valueType, onChange,percentShowF=true) {
        let cboCodeList=[];
        if( valueType instanceof Array==true){
            for (let i　in valueType) {
                cboCodeList.push(valueType[i]);
            }
        }else{
            switch (valueType) {
                case 1: {
                    cboCodeList = [0];
                    for (let i = 1; i < 10; i++) {
                        let n = i / 10;
                        cboCodeList.push(n);
                    }
                    for (let i = 1; i < 5; i++) {
                        cboCodeList.push(i);
                    }
                    break;
                }
                case 2: {
                    cboCodeList = [0.2];
                    for (let i = 0.5; i < 5; i += 0.5) {
                        cboCodeList.push(i);
                    }
                    for (let i = 5; i < 20; i++) {
                        cboCodeList.push(i);
                    }
                    break;
                }
                case 3:
                    for (let i = 5; i < 55; i += 5) {
                        cboCodeList.push(i);
                    }
                    break;
                case 4: {
                    for (let i = 10; i < 110; i += 10) {
                        cboCodeList.push(i);
                    }
                    break;
                }
            }
    
        }
        let lineH =21;
        let sw =this.createNewWordWidthDiv(ParentObj,"",preWord,x,y,lineH,preWordWidth,undefined);
        let sInput=this.createNewNumberComboBox(ParentObj,defoValue,ID, cboCodeList,x+sw,y,60,10,onChange );
        if(percentShowF==true){
            Generic.createNewSpan(ParentObj, "%", "", "", x+sw+65, y+3, "", "");
        }
        return sInput;
    }


    /**最初からドロップダウンされているリストを表示 戻り値はselectedIndex番号 */
    static createNewDropdownSelect(title,textList,x,y,width,onChange){
        let pele=this.set_backDiv("",title,width,100,false,false,undefined,0,true);
        let oneHeight=this.getSpanSize(textList[0],15).height+2;
        let totalHeight=Math.min(8,textList.length)*oneHeight;
        pele.style.height=(scrMargin.top+totalHeight+2).px();
        let frame=this.createNewDiv(pele,"","","grayFrame",0,scrMargin.top,width-1,totalHeight,"overflow-y:scroll;overflow-x:hidden");
        Generic.Set_Box_Position_in_Browser(new point(x,y), pele);
        for (let i in textList) {
            let md = this.createNewDiv(frame, textList[i], "", "", 0, oneHeight * i, width-2, oneHeight - 2, "padding-top:2px;padding-left:10px;font-size:14px", "");
            md.tag = i;
            md.onmouseover = function () {
                md.style.backgroundColor = '#dddddd';
            }
            md.onmouseleave = function () {
                md.style.backgroundColor = 'white';
            }
            md.onclick = function (e) {
                change(Number(this.tag))
            }
        }

        function change(selectedIndex){
            Generic.clear_backDiv();
            onChange(selectedIndex);
        }
    }
    /**文つきselect要素作成 selectPosition:0は右、1は下*/
    static createNewWordSelect(ParentObj,headWord,  list, firstSelectIndex, ID, x, y,headWordWidth,selectWidth, selectPosition, onChange,divStyle, selectStyleinfo, astariskNonF=true) {
        let lineH = this.getDivSize("A", undefined, divStyle).height ;
        let hsw = this.createNewWordWidthDiv(ParentObj, "", headWord, x, y, lineH, headWordWidth, undefined,divStyle);
        let xx=x;
        let yy=y;
        if(selectPosition==0){
            xx= x + hsw;
        }else{
            xx+=15;
            yy+=lineH+2;
        }
        let sbox=this.createNewSelect(ParentObj, list, firstSelectIndex, ID, xx, yy, false, onChange, selectStyleinfo, 0 ,astariskNonF) ;
        sbox.style.width=selectWidth.px();
        return sbox;
    }
    /**select要素作成 list.value,.text *は非選択が標準、onChangeでは要素,selectedIndex,valueを返す*/
    static createNewSelect(ParentObj, list, firstSelectIndex, ID, x, y, multipleFlag, onChange, styleinfo, size = 1,astariskNonF=true) {
        var sbox = document.createElement("select")
        sbox.setAttribute("id", ID)
        sbox.multiple = multipleFlag;
        sbox.onchange =function(){
            let nochange=false;
            if((typeof onChange=='function')&&(nochange==false)){
                let sel;
                let v;
                if(multipleFlag==false){
                    sel=sbox.selectedIndex;
                    v=sbox.getValue();
                }else{
                    sel=Generic.getMultipleSelectIndex(sbox,0);
                }
                onChange(sbox,sel,v);
            }
        }
        sbox.setAttribute("style", "position:absolute;" + styleinfo)
        sbox.style.top = y.px();
        sbox.style.left = x.px();
        sbox.setAttribute("size", size);
        sbox.addEventListener("mouseenter", mouseEnter, false);
        sbox.addEventListener("mouseleave", mouseLeave, false);
        if (list != undefined) {
            sbox.addSelectList( list, firstSelectIndex,true,astariskNonF);
            sbox.selectedIndex = firstSelectIndex;
        }
        sbox.oldSel = firstSelectIndex;
        ParentObj.appendChild(sbox);
        return sbox;
        function mouseEnter(e) {
            let w = Generic.getSpanSize(sbox.getText(), sbox.style.fontSize.removePx()).width + 20;
            if (w > sbox.offsetWidth) {
                Generic.createNewDiv(this.parentNode, sbox.getText(), "", "", x + 50, y + sbox.offsetHeight, 150, undefined, "z-index:1000;font-size:12px;border: solid 1px; border-radius:3px; background-color:#fffff0;text-align:center", "");
                sbox.tooltip = 'true';
            }
        }
        function mouseLeave(e) {
            if (sbox.tooltip == 'true') {
                this.parentNode.removeChild(this.parentNode.lastChild);
                sbox.tooltip = '';
            }
        }
    }



    //
    /**複数選択select要素の選択状態を取得 mode0は選択された番号の配列、mode1は選択をtruefalseを配列で返す */
    static getMultipleSelectIndex(obj, mode) {
        let opts = obj.options;
        let selectedIndex = [];
        let selected = []
        for (let i = 0; i < opts.length; i++) {
            if (opts[i].selected) {
                selectedIndex.push(i);
                selected[i] = true;
            } else {
                selected[i] = false;
            }
        }
        switch (mode) {
            case 0:
                return selectedIndex;
                break;
            case 1:
                return selected;
                break;
        }
    }

    //子要素までdisabledを設定
    static setDisabled(element, value) {
        let children = element.children;
        for (let i = 0; i < children.length; i++) {
            children[i].disabled = value;
            if (children[i].children.length > 0) {
               this.setDisabled(children[i], value);
            }
        }

    }

    //Canvas要素を作成
    static createNewCanvas(ParentObj, ID, Class, x, y, width, height, onClick, styleinfo) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("style", "position:absolute;" + styleinfo);
        canvas.setAttribute("id", ID);
        canvas.setAttribute("class", Class);
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = y.px();
        canvas.style.left = x.px();
        canvas.onclick = onClick;
        ParentObj.appendChild(canvas);
        return canvas;
    }

    static createMenuMark(ParentObj, onClick, markSize){
        var size = 20;
        if (markSize != undefined) {
            size = markSize;
        }
        var canvas = this.createNewCanvas(ParentObj, "","", 10, 4, size, size, click, "");
        //canvas.addEventListener("touchend",click);
        canvas.addEventListener("mouseenter",click);
        canvas.name = "menuMark";
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(1, 5);
        ctx.lineTo(size - 2, 5);
        ctx.moveTo(1, 10);
        ctx.lineTo(size - 2, 10);
        ctx.moveTo(1, 15);
        ctx.lineTo(size - 2, 15);
        ctx.stroke();
        return canvas;
        function click(e){
            e.preventDefault();
            let rect=canvas.getBoundingClientRect();
            onClick(new point(rect.right,rect.bottom))
        }
    }

    //ParentObjの右上にXマーク表示
    static createXmark(ParentObj, onClick, markSize) {
        var size = 20;
        if (markSize != undefined) {
            size = markSize;
        }
        var canvas = this.createNewCanvas(ParentObj, "","", ParentObj.style.width.removePx() - 14 - size, 4, size, size, onClick, "");
        canvas.name = "xMark";
        canvas.rightPositionFixed=true;
        canvas.relativePosition=new point(size+14,0);
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(1, 1);
        ctx.lineTo(size - 2, size - 2);
        ctx.moveTo(size - 2, 1);
        ctx.lineTo(1, size - 2);
        ctx.stroke();
        return canvas;
    }

        //windowの右上に最大化マーク表示
        static createMaxButton(ParentObj, onClick, markSize) {
            var size = 20;
            if (markSize != undefined) {
                size = markSize;
            }
            var canvas = this.createNewCanvas(ParentObj, "","", ParentObj.style.width.removePx() - 14 - size, 4, size, size, onClick, "");
            canvas.name = "maxButton";
            return canvas;
        }

        //移動要素の内部の要素で右下に固定のものを動かす
    static moveInnerElement(parentObj) {
        let cnode = parentObj.children;
        let w = parentObj.style.width.removePx();　//親要素で幅100%と指定すると機能しないので注意
        let h = parentObj.style.height.removePx();
        for (let i = 0; i < cnode.length; i++) {
            let node = cnode[i];
            if (node.hasOwnProperty('rightPositionFixed')) {//右固定
                node.style.left = (w - node.relativePosition.x).px();
            }
            if (node.hasOwnProperty('bottomRightPositionFixed')) {//右下固定
                if(node.relativePosition.x==-1){ //-1に設定した場合は、親要素左端から全幅
                    node.style.left = (0).px();
                    node.style.width= w.px();
                    node.style.top = (h - node.relativePosition.y).px();    
                }else{
                    node.style.left = (w - node.relativePosition.x).px();
                    node.style.top = (h - node.relativePosition.y).px();
                    }
            }
            if (node.hasOwnProperty('bottomPositionFixed')) {//下固定
                node.style.top = (h - node.relativePosition.y).px();
            }
            if (node.hasOwnProperty('sizeFixed')) {//サイズ固定
                node.style.width = (w - node.relativeSize.width).px();
                node.style.height = (h - node.relativeSize.height).px();
            }
            if (node.nodeType == 1) {
                if (node.childElementCount > 0) {//子要素も調べる
                    this.moveInnerElement(node);
                }
            }
        }
    }
 
    //指定したオブジェクトの子要素に、指定したIDの子要素が含まれるかどうかチェックする
    static checkHasChildNode(parentObj,childObjID) {
        let cnode = parentObj.childNodes;
        for (let i = 0; i < cnode.length; i++) {
            if (cnode[i].id == childObjID) {
                return true;
                break;
            }
        }
        return false;
    }


    //テキストエリアを作成
    static createNewTextarea(ParentObj, text, ID, x, y, row, col, styleinfo) {
        var obj = document.createElement("textarea")
        obj.setAttribute("id", ID);
        obj.innerHTML = text;
        obj.setAttribute("style", "position:absolute;" + styleinfo)
        obj.setAttribute("rows", row)
        obj.setAttribute("cols", col)
        obj.style.top = y.px();
        obj.style.left = x.px();
        ParentObj.appendChild(obj);
        return obj;
    }


    static createNewTable(ParentObj, ID, tableClass, data, width, styleinfo, headNum, headStyleinfo, normalStyleinfo, headXStyleinfo, normalXStyleinfo) {
        /// <signature>
        /// <summary>グリッドを作成</summary>
        /// <param name="ParentObj">親のDOM</param>  
        /// <param name="ID">表のID</param>  
        /// <param name="tableClass">表のclassパラメータ</param>  
        /// <param name="data">グリッドに表示するデータの二次元配列</param>  
        /// <param name="width">表の幅</param>  
        /// <param name="styleinfo">表のスタイルCSS</param>  
        /// <param name="headNum">表のヘッダ行の数</param>  
        /// <param name="headStyleinfo">表のヘッダのスタイルCSS</param>  
        /// <param name="normalStyleinfo">表の通常セルのスタイルCSS</param>  
        /// <param name="headXStyleinfo">表のヘッダの列ごとのスタイルCSS配列</param>  
        /// <param name="normalXStyleinfo">表の通常セルの列ごとのスタイルCSS配列</param>  
        /// </signature>

        var xcell = data.length;
        var ycell = data[1].length;

        var tb = document.createElement("table");
        tb.setAttribute("style", "position:absolute;" + styleinfo)
        tb.setAttribute("id", ID);
        tb.setAttribute("class", tableClass);
        tb.style.top = "0px"
        tb.style.left = "0px"
        if ((typeof width) == 'string') {
            tb.style.width = width;
        } else {
            tb.style.width = width.px();
        }
        for (var i = 0; i < ycell; i++) {
            var row = tb.insertRow(-1)
            if (i < headNum) {
                row.setAttribute("style", headStyleinfo)
            } else {
                row.setAttribute("style", normalStyleinfo)
            }
            for (var j = 0; j < xcell; j++) {
                var newtd = row.insertCell(-1);
                newtd.setAttribute("class", tableClass);
                if (i < headNum) {
                    if (headXStyleinfo != "") {
                        newtd.setAttribute("style", headXStyleinfo[j]);
                    }
                } else {
                    if (normalXStyleinfo != "") {
                        newtd.setAttribute("style", normalXStyleinfo[j]);
                    }
                }
                newtd.innerHTML = data[j][i];
            }
        }
        ParentObj.appendChild(tb);
        return tb;
    }

    static createNewGrid(ParentObj, gridID, TableID, gridClass, tableClass, data, x, y, width, height, tableWidth, styleinfo, tableStyleinfo, tableHeadNum,
        tableHeadStyleinfo, tableNormalStyleinfo, tableHeadXStyleinfo, tableNormalXStyleinfo) {
        /// <signature>
        /// <summary>グリッドを作成</summary>
        /// <param name="ParentObj">親のDOM</param>  
        /// <param name="gridID">グリッドのID</param>  
        /// <param name="TableID">グリッド内の表のID</param>  
        /// <param name="gridClass">グリッドのclassパラメータ</param>  
        /// <param name="tableClass">グリッド内の表のclassパラメータ</param>  
        /// <param name="data" >グリッドに表示するデータの二次元配列</param>  
        /// <param name="x">グリッドのX座標</param>  
        /// <param name="y">グリッドのY座標</param>  
        /// <param name="width">グリッドの幅</param>  
        /// <param name="height">グリッドの高さ</param>  
        /// <param name="tableWidth">表の幅（文字指定）</param>  
        /// <param name="styleinfo">グリッドのスタイルCSS</param>  
        /// <param name="tableStyleinfo">グリッド内の表のスタイルCSS</param>  
        /// <param name="tableHeadNum">グリッド内の表のヘッダ行の数</param>  
        /// <param name="tableHeadStyleinfo">グリッド内の表のヘッダのスタイルCSS</param>  
        /// <param name="tableNormalStyleinfo">グリッド内の表の通常セルのスタイルCSS</param>  
        /// <param name="tableHeadXStyleinfo">グリッド内の表のヘッダの列ごとのスタイルCSS配列</param>  
        /// <param name="tableNormalXStyleinfo">グリッド内の通常セルの列ごとのスタイルCSS配列</param>  
        /// </signature>
        var obj = document.createElement("div")
        obj.setAttribute("style", "position:absolute;overflow: auto;" + styleinfo)
        obj.setAttribute("id", gridID);
        obj.setAttribute("class", gridClass);
        obj.style.top = y.px();
        obj.style.left = x.px();
        if ((typeof width) == 'string') {
            obj.style.width = width;
        } else {
            obj.style.width = width.px();
        }
        if ((typeof height) == 'string') {
            obj.style.height = height;
        } else {
            obj.style.height = height.px();
        }
        obj.table=this.createNewTable(obj, TableID, tableClass, data, tableWidth, tableStyleinfo, tableHeadNum,
            tableHeadStyleinfo, tableNormalStyleinfo, tableHeadXStyleinfo, tableNormalXStyleinfo);
        ParentObj.appendChild(obj);
        return obj;
    }

    //表の中身を取得する
    static getTableValue(table){
        let tx="";
        for(let i=0;i<table.rows.length;i++){
            for(let j=0;j<table.rows[i].cells.length;j++){
                tx+=table.rows[i].cells[j].innerText;
                if(j!=table.rows[i].cells.length-1){
                    tx+='\t';
                }else{
                    tx+='\n';
                }
            }
        }
        return tx;
    }

    static Array2Dimension(dim1num, dim2num,defoValue) {
        //二次元配列を作成
        var ArrayData = new Array(dim1num);
        for (let i = 0; i < dim1num; i++) {
            ArrayData[i] = new Array(dim2num);
            if(defoValue!=undefined){
                ArrayData[i].fill(defoValue);
            }
        }
        return ArrayData;
    }



    static createNewFrame(ParentObj, id, Class, x, y, width, height, text = "") {
        var div;
        var yy = y;
        if (text != "") {
            yy += 10;
        }
        div = this.createNewDiv(ParentObj, "", id, Class, x, yy, width, height, "border:solid 1px;border-color:#666666;border-radius:3px;", "");
        if (text != "") {
            let bg = ParentObj.style.backgroundColor;
            if (bg == ""){
                bg = ParentObj.parentNode.style.backgroundColor;
            }
            let lb = this.createNewSpan(div, text,  "label", Class,  8, -8, "padding-left:3px;padding-right:3px;background-color:" + bg, "");
        }
        return div;
    }

    /**メッセージ表示 borderFlag:枠を動かせるかどうか*/
    static createMsgBox(title,text,borderFlag,width=350,height=400) {
        let msgbox = this.set_backDiv('msgbox', title, width, height, true, false, undefined, 0.2, false);
        let ta=this.createNewTextarea(msgbox, text, "", 10, scrMargin.top+10, 20, 50, "resize:none;width:480px;height:420px;font-size:13px");
        ta.style.width=(width-20).px();
        ta.style.height=(height-50-scrMargin.top-10).px();
        if(borderFlag==true){
            msgbox.dragBorder(undefined,undefined);
            ta.sizeFixed=true;
            ta.relativeSize=new size(20,80);
        }
        let copy=Generic.createNewButton(msgbox, "コピー", "", 30, height - 35, copyValue, "width:60px;height:23px");
        copy.bottomPositionFixed=true;
        copy.relativePosition = new point(0, 30);
        copy.setAttribute("name",'copy');
        function copyValue(){
            Generic.copyText(ta.value);
        }
    }

    static createMsgTableBox(title, data, width, height,borderFlag) {
        /// <signature>
        /// <summary>グリッドを作成</summary>
        /// <param name="title">タイトル</param>
        /// <param name="data" >グリッドに表示するデータの二次元配列</param>  
        /// <param name="width">幅</param>  
        /// <param name="height">高さ</param>  
        /// <param name="tableHeadNum">グリッド内の表のヘッダ行の数</param>  
        /// </signature>
        let msgbox = this.set_backDiv('msgbox', title, width, height, true, false, undefined, 0.2, false);
        let gd=Generic.createNewGrid(msgbox, "", "", "", "", data, 5, 35, width - 10, height - 80,'100%', "", "font-size:13px", 1, "background-color:#aaffaa;",  "", "", "");
        if(borderFlag==true){
            msgbox.dragBorder(undefined,undefined);
            gd.sizeFixed=true;
            gd.relativeSize=new size(30,70);

        }
        let copy=Generic.createNewButton(msgbox, "コピー", "", 30, height - 35, copyValue, "width:60px;height:23px");
        copy.bottomPositionFixed=true;
        copy.relativePosition=new point(0,30);
        copy.setAttribute("name",'copy');
        function copyValue(){
            let tx=Generic.getTableValue(gd.table);
            Generic.copyText(tx);
        }
    }

    static createWindow(ID, Class, title, x, y, width, height, visibilieF,menuMarkF,menuCall,XmarkF,XmarkCall,footer_Flag,footerID,maxButtonF,maxButtonCall) {
        var hiddenWindow = function () {
            window.setVisibility(false) ;
            if(XmarkCall !=undefined){
                XmarkCall();
            }
        }
        let window = Generic.createNewDiv(document.body, "", ID, Class, x, y, width, height, "border: solid 1px; border-radius:5px; background-color:white; overflow:hidden; ", "");
        let pl="padding-left:40px;"
        if(menuMarkF==false){
            pl="padding-left:15px;"
        }
        let hd = Generic.createNewDiv(window, "", "", title, 0, 0, '100%', scrMargin.top-3, "padding-top:3px;background-color: gray;color:#ffffff;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"+pl, "");
        hd.name = "header";
        window.maxSizeFlag=false;
        if (footer_Flag == true) {
            let ft = Generic.createNewDiv(window, "", footerID, "", 0, 0, 100, scrMargin.bottom, "background-color: #dddddd;color:#000000;font-size:13px;padding-left:10px;padding-top:5px", "");
            ft.bottomRightPositionFixed=true;
            ft.relativePosition=new point(-1,scrMargin.bottom);
            ft.name = "footer";
        }
        if (XmarkF == true) {
            this.createXmark(window, hiddenWindow);
        }
        if (menuMarkF == true) {
            this.createMenuMark(window,menuCall);
        }
        if (maxButtonF == true) {
            const cs=this.createMaxButton(window, resizeWindow);
            cs.rightPositionFixed=true;
            if(XmarkF==true){
                cs.relativePosition=new point(cs.width*2+38,0);
            }else{
                cs.relativePosition=new point(cs.width+14,0);
            }
            
            const w=cs.width;
            const ctx = cs.getContext("2d");
            function resizeWindow(){
                //最大化ボタン
                ctx.clearRect(0, 0,cs.width,cs.height);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.strokeRect(2, 2,w-4,w-4);
                if (window.maxSizeFlag == false) {
                    ctx.strokeRect(2, 7,Math.floor(w/2),Math.floor(w/2));//小さい四角を追加
                    window.oldpos=new rectangle(new point(window.style.left.removePx(),window.style.top.removePx()),
                        new size(window.style.width.removePx(),window.style.height.removePx()));
                    let ScreenH = Generic.getBrowserHeight();
                    let ScreenW = Generic.getBrowserWidth();
                    window.style.width = (ScreenW * 0.9).px();
                    window.style.height = (ScreenH * 0.9).px();
                    window.style.left = (ScreenW * 0.05).px();
                    window.style.top = (ScreenH * 0.05).px();
                    window.maxSizeFlag=true;
                } else {
                    window.style.width = window.oldpos.width().px();
                    window.style.height = window.oldpos.height().px();
                    window.style.left = window.oldpos.left.px();
                    window.style.top = window.oldpos.top.px();
                    window.maxSizeFlag=false;
                }
                maxButtonCall();
            }
        }
        window.setVisibility(visibilieF);
        window.setTitle = function (title) {
            let cnode = this.childNodes;
            for (let i = 0; i < cnode.length; i++) {
                if (cnode[i].name == 'header') {
                    cnode[i].innerHTML = title;
                    break;
                }
            }
        }
        return window;
    }

    static clear_backDiv() {
        //固定ウインドウを消す
        document.body.removeChild(document.body.lastChild);
        document.body.removeChild(document.body.lastChild);
    }

    static set_backDiv(idname, title, innerWidth, innerHeight,okButtonF,cancelButtonF,okCall, opacity,outerClickF,createXmark=true,cancelCall=undefined) {
        /// <signature>
        /// <summary>固定ウインドウを作る</summary>
        /// <param name="idname">DIV要素のid</param>  
        /// <param name="innerWidth">内部div幅（ピクセル、省略可）</param>  
        /// <param name="innerHeight">内部div高さ（ピクセル、省略可）</param>  
        /// <param name="opacity">背景透過度（省略可）</param>  
        /// <returns >div要素</returns>  
        /// </signature>

        var e = document.getElementsByName("backDiv");
        let maxZindex = 1000 + e.length*10;
        var browserWidth = this.getBrowserWidth();
        var browserHeight = this.getBrowserHeight();
        var d = document.createElement("div");
        var deletediv = function (e) {
        //固定ウインドウを消す
            e.preventDefault();
            document.body.removeChild(document.body.lastChild);
            document.body.removeChild(document.body.lastChild);
        };

        if (outerClickF == true) {
            d.onclick = deletediv;
            d.ontouchstart=deletediv;
        }
        d.setAttribute("id", "backDiv");
        d.setAttribute("name", "backDiv");
        d.setAttribute("style", "position:absolute;background-color:#000000;font-size:13px")
        d.style.zIndex = maxZindex;
        d.style.top = "0px";
        d.style.left = "0px";
        d.style.width = '100%';
        d.style.height = '100%';
        d.style.opacity = 0.5;
        if (opacity != undefined) {
            d.style.opacity =opacity;
        }
        document.body.appendChild(d)

        var w = browserWidth * 0.9;
        if (innerWidth != undefined) {
            w = innerWidth;
        }
        var h = browserHeight * 0.8// / 2
        if (innerHeight != undefined) {
            h = innerHeight;
        }
        var y = this.getScrollY() + (browserHeight - h) / 2;
        var x = (browserWidth - w) / 2;
        var dup = this.createNewDiv(document.body, idname, "frontDIV", "setting", x, y, w, h, "background-color:#ffffff; border:solid 1px; border-radius: 4px;border-color:#666666;opacity:1");
        dup.style.zIndex = maxZindex+1;
        let head = Generic.createNewDiv(dup, "", "", "", 0, 0, '100%', scrMargin.top, "background-color: gray;color:#ffffff;font-size:15px", "");
        Generic.createNewSpan(head, title, "", "", 10, 0, "margin-top:4px", "");
        if(createXmark){
            var cv = this.createXmark(dup, cancelButton);
        }

        let bux = innerWidth;
        if (cancelButtonF == true) {
            let ele=Generic.createNewButton(dup, "Cancel", "", bux - 80, innerHeight - 35, cancelButton, "width:70px;height:23px");
            ele.bottomRightPositionFixed=true;
            ele.relativePosition=new point(80,30);
            ele.name="cancel";
            bux -= 60;
        }
        if (okButtonF == true) {
            if (okCall == undefined) {
                okCall = deletediv;
            }
            let ele=Generic.createNewButton(dup, "OK", "", bux - 90, innerHeight - 35, okButton, "width:60px;height:23px");
            ele.bottomRightPositionFixed=true;
            if (cancelButtonF == true) {
                ele.relativePosition=new point(150,30);
            }else{
                ele.relativePosition=new point(90,30);
            }
            ele.name="ok";
        }
        function cancelButton(e){
            deletediv(e);
            if(cancelCall!=undefined){
                cancelCall();
            }
        }
        function okButton(e) {
            okCall(e);
        }
        return dup;
    }



    static getScrollX() {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        return x;
    }

    static getScrollY() {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return y;
    }

    static decodePolyline(data) {
        //Google Mapのエンコード化ポリラインをデコードする
        var cood = new Array();
        var n = 0;
        var selpos = 0;
        var cflag = 0;
        var sc = new latlon(0, 0);
        var newlat;
        var newlon;

        do {
            var strcode = new Array();
            var i = 0;
            while (true) {
                var w1 = data.substr(i + selpos, 1);
                var cd = w1.charCodeAt(0);
                strcode[i] = cd - 63;
                if (strcode[i] >= 32) {
                    strcode[i] -= 32;
                } else {
                    i++
                    break;
                }
                i++;
            }
            selpos += i;
            var binary = "";
            for (var j = 0; j < i; j++) {
                var x = ("00000" + strcode[i - j - 1].toString(2)).slice(-5)
                binary += x;
            }
            var binary10;
            if (binary.slice(-1) == "1") {
                binary10 = ~(parseInt(binary, 2));
            } else {
                binary10 = parseInt(binary, 2);
            }
            binary10 /= 2;
            var val = binary10 / 100000;

            if (cflag == 0) {
                sc.lat = val;
            } else {
                sc.lon = val;
                if (n == 0) {
                    cood[n] = new Array();
                    cood[n].push(sc.lat);
                    cood[n].push(sc.lon);
                    newlat = sc.lat;
                    newlon = sc.lon;
                } else {
                    cood[n] = new Array();
                    newlat = sc.lat + newlat;
                    newlon = sc.lon + newlon;
                    cood[n].push(newlat);
                    cood[n].push(newlon);
                }
                n++;
            }
            cflag = 1 - cflag;
        } while (selpos < data.length)
        return cood;
    }



    static Check_Two_Value_In(CheckV, V1, V2) {
        //チェックする値が二つの数字の中間であればtrue

        if ((CheckV == V1) || (CheckV == V2)) {
            return chvValue_on_twoValue.chvJust;
        } else if (V1 < V2) {
            if ((V1 < CheckV) && (CheckV < V2)) {
                return chvValue_on_twoValue.chvIN;
            }
        } else {
            if ((V2 < CheckV) && (CheckV < V1)) {
                return chvValue_on_twoValue.chvIN;
            }
        }
        return chvValue_on_twoValue.chvOuter;
    }
    static Angle(si, co) {//角度を求める
        var AngleV;
        if (co == 0) {
            AngleV = 90;
        } else {
            AngleV = Math.atan(Math.abs(si / co)) * 180 / Math.PI;
        }
        if ((0 <= si) && (0 <= co)) {
        } else if ((0 <= si) && (co < 0)) {
            AngleV = 180 - AngleV;
        } else if ((si < 0) && (0 <= co)) {
            AngleV = 360 - AngleV;
        } else if ((si < 0) && (co < 0)) {
            AngleV = 180 + AngleV;
        }
        return AngleV;
    }

    //クリップボードにテキスト出力
    static copyText(text) {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.parentElement.removeChild(ta);
    }

    //フォントがシステムに入っているかチェック
    static checkFontExist(checkFont) {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testString = "mmmmmmmmmmlli";
        const testSize = '72px';
        const h = document.getElementsByTagName("body")[0];
        const s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        let  defaultWidth = {};
        let defaultHeight = {};
        for (let index in baseFonts) {
            //get the default width for the three base fonts
            s.style.fontFamily = baseFonts[index];
            h.appendChild(s);
            defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
            defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
            h.removeChild(s);
        }
        let detected = false;
        for (let index in baseFonts) {
            s.style.fontFamily = checkFont + ',' + baseFonts[index];
            h.appendChild(s);
            let matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    }
//トップメニュー(ポップアップと上下の調整が取れないため未使用)
    static ceateTopMenu(ParentObj,list, pos,width) {
        for(let i in list){
            let data=list[i];
            let div=this.createNewDiv(ParentObj,data.caption,"","",pos.x+i*width,pos.y,width,20,"position:absolute;background-color:#cccccc;");
            div.style.zIndex = 1000;
            div.setAttribute("name","topmenu");
            div.onmouseover =function(){
                let rect=div.getBoundingClientRect();
                let oldm=document.getElementById("popmenu");
                if(oldm!=undefined){
                    document.body.removeChild(oldm);
                }
                Generic.ceatePopupMenu(data.child,new point(rect.left,rect.bottom));
                let tm=document.getElementsByName("topmenu");
                for(let j=0;j< tm.length;j++){
                    tm[j].style.backgroundColor="#cccccc";
                }
                div.style.backgroundColor="#eeeeee";
            }
            div.onmouseleave=function(){
            }
    
        }
    }
    //ポップアップメニュー
    static ceatePopupMenu(list, pos) {
        
        let e = document.getElementsByName("backDiv");
        let maxZindex = 1000 + e.length * 10;
        let touchf=false;
        var mnudiv = document.createElement("div");
        
        var deletediv = function () {
            //メニューを消す
            let nd=document.getElementById("popmenu");
            if(nd!=undefined){
                document.body.removeChild(nd);
            }
            //トップメニューがある場合は色をそろえる
            let tm=document.getElementsByName("topmenu");
            for(let j=0;j< tm.length;j++){
                tm[j].style.backgroundColor="#cccccc";
            }
        };
        mnudiv.onclick = mnudicclivk;
        mnudiv.addEventListener('touchstart',mnudicclivk,false)
        function mnudicclivk(e){
            e.stopPropagation();
            e.preventDefault();
            if(touchf==true){//タッチした直後はクリックスルー
                touchf=false;
            }else{
                deletediv();
            }
        }
        mnudiv.setAttribute("id", "popmenu");
        mnudiv.setAttribute("name", "backDiv");
        mnudiv.setAttribute("style", "position:absolute;back-ground");
        mnudiv.setAttribute("class", "popMenu");
        mnudiv.style.zIndex = maxZindex;
        mnudiv.style.backgroundColor="#55555555"
        mnudiv.style.top = "0px";
        mnudiv.style.left = "0px";
        mnudiv.style.width = '100%';
        mnudiv.style.height = '100%';
        document.body.appendChild(mnudiv)

        var mainMenu = document.createElement("div");
        mnudiv.appendChild(mainMenu)
        let mainw = 0;
        let lineh;
        for (let i in list) {
            let msp = document.createElement('span');
            mnudiv.appendChild(msp)
            msp.innerHTML = list[i].caption;
            mainw = Math.max(mainw, msp.offsetWidth);
            lineh = msp.offsetHeight;
            mnudiv.removeChild(msp);
        }
        lineh+=6;
        let y=list.length*lineh;
        let subn = 0;
        for (let i in list) {
            let data = list[i];
            if (data.caption == "-") {
                let md = this.createNewDiv(mainMenu, "", "", "popMenu", 10, lineh * i + lineh / 2, mainw + 20, 2, "", "");
                md.style.backgroundColor = '#dddddd';
            } else {
                let md = this.createNewDiv(mainMenu, data.caption, "", "", 0, lineh * i, mainw + 20, lineh-2, "padding-top:2px;padding-left:20px", "");
                md.onmouseover = function () {
                    md.style.backgroundColor = '#dddddd';
                    for (let j in subMenu) {
                        subMenu[j].style.visibility = 'hidden';
                    }
                    if ((data.hasOwnProperty('child'))&&(md.enabled==true)) {
                        subMenu[md.submenunum].style.visibility = 'visible';
                    }
                }
                md.addEventListener("touchstart", touch, false);
                function touch() {
                    touchf=true;
                    md.style.backgroundColor = '#dddddd';
                    for (let j in subMenu) {
                        subMenu[j].style.visibility = 'hidden';
                    }
                    if ((data.hasOwnProperty('child'))&&(md.enabled==true)) {
                        subMenu[md.submenunum].style.visibility = 'visible';
                    }
                }
                md.onmouseleave = function () {
                    md.style.backgroundColor = 'white';
                }
                let enabled=true;
                if (data.hasOwnProperty('enabled')) {
                    if(data.enabled==false){
                        md.style.color="#888888";
                        enabled=false;
                    }
                }
                md.enabled=enabled;
                if (data.hasOwnProperty('event')) {
                    if (enabled==true) {
                        md.onclick = function (e) {
                            deletediv();
                            data.event(data,e);
                        }
                        md.ontouchend = function (e) {
                            deletediv();
                            data.event(data,e);
                        }
                    }
                }
                if (data.hasOwnProperty('checked')) {
                    let tx = "";
                    if (data.checked == true) {
                        tx = "✓";
                    }
                    this.createNewDiv(md, tx, "", "", 0, 0, 20, lineh, "", "");
                }
                if (data.hasOwnProperty('child')) {
                        this.createNewDiv(md, "‣", "", "", mainw + 20, 0, 10, lineh, "", "");
                        md.submenunum = subn;
                        subn++;
                }
            }
        }

        mainMenu.setAttribute("style", "position:absolute;border:solid 1px; border-radius: 1px;border-color:#666666;background-color:#ffffff");
        mainMenu.style.left = pos.x.px();
        mainMenu.style.top = pos.y.px();
        mainMenu.style.width = (mainw + 40).px();
        mainMenu.style.height = y.px();
        mainMenu.style.zIndex = maxZindex + 1;
        let subMenu = [];
        for (let i in list) {
            if (list[i].hasOwnProperty('child')) {
                let smenu = document.createElement("div");
                mnudiv.appendChild(smenu);
                let cdata = list[i].child;
                let w = 0;
                for (let j in cdata) {
                    let msp = document.createElement('span');
                    mnudiv.appendChild(msp)
                    msp.innerHTML = cdata[j].caption;
                    w = Math.max(w, msp.offsetWidth);
                    mnudiv.removeChild(msp);
                }
                for (let j in cdata) {
                    let data = cdata[j];
                    if (data.caption == "-") {
                        let md = this.createNewDiv(smenu, "", "", "popMenu1", 10, lineh * j + lineh / 2, w  + 30, 2, "", "");
                        md.style.backgroundColor = '#dddddd';
                    } else {
                        let md = this.createNewDiv(smenu, data.caption, "", "", 0, lineh * j, w + 10, lineh-2, "padding-top:2px;padding-left:20px", "");
                        md.setAttribute("name", "popmenu1");
                        md.onmouseover = function () {
                            md.style.backgroundColor = '#dddddd';
                        }
                        md.onmouseleave = function () {
                            md.style.backgroundColor = 'white';
                        }
                        let enabled=true;
                        if (data.hasOwnProperty('enabled')) {
                            if(data.enabled==false){
                                md.style.color="#888888";
                                enabled=false;
                            }
                        }
                        if ((data.hasOwnProperty('event'))&&(enabled==true)) {
                            md.onclick = function () {
                                deletediv();
                                data.event(data);
                            }
                            md.ontouchend = function (e) {
                                deletediv();
                                data.event(data,e);
                            }
                        }
                        if (data.hasOwnProperty('checked')) {
                            let tx = "";
                            if (data.checked == true) {
                                tx = "✓";
                            }
                            this.createNewDiv(md, tx, "", "", 0, 0, 20, lineh, "", "");
                        }
    
                    }

                }
                smenu.setAttribute("style", "position:absolute;border:solid 1px; border-radius: 1px;border-color:#666666;background-color:#ffffff")
                smenu.style.left = (mainw + 40 + pos.x - 5).px();
                smenu.style.top = (lineh * i + pos.y).px();
                smenu.style.width = (w + 30).px();
                smenu.style.height = (lineh * cdata.length).px();
                smenu.style.visibility = 'hidden';
                smenu.style.zIndex = maxZindex + 1;
                subMenu.push(smenu);
            }
        }
        let menuRect=new rectangle(new point(mainMenu.style.left.removePx(),mainMenu.style.top.removePx()),new size(mainMenu.clientWidth,mainMenu.clientHeight));
        if(subMenu.length>0){
            for (let i in subMenu){
                let menuRectSub=new rectangle(new point(subMenu[i].style.left.removePx(),subMenu[i].style.top.removePx()),new size(subMenu[i].clientWidth,subMenu[i].clientHeight));
                menuRect=spatial.getCircumscribedRectangle(menuRect,menuRectSub);
            }
        }

        let gScreenWidth = (Generic.getBrowserWidth());
        let gScreenHeight = (Generic.getBrowserHeight());
        if (menuRect.bottom > gScreenHeight) {
            let sa=menuRect.bottom - gScreenHeight;
            mainMenu.style.top = (menuRect.top -sa ).px();
            for (let i in subMenu){
                subMenu[i].style.top=(subMenu[i].style.top.removePx()-sa).px()
            }
        }
        if (menuRect.right > gScreenWidth) {
            let sa=menuRect.right - gScreenWidth;
            mainMenu.style.left = (menuRect.left - sa).px();
            for (let i in subMenu){
                subMenu[i].style.left=(subMenu[i].style.left.removePx()-sa).px()
            }
        }
    }

    /**メニューオブジェクトのプロパティからオブジェクトを取得する */
    static getPopMenuObj(menuObj,property,pname) {
        for (let i in menuObj) {
            if (menuObj[i].hasOwnProperty(property)) {
                if (menuObj[i][property] == pname) {
                    return menuObj[i];
                }
                if (menuObj[i].hasOwnProperty('child')) {
                    let v = this.getPopMenuObj(menuObj[i].child, property, pname);
                    if (v != undefined) {
                        return v;
                    }
                }
            }
        }
    }
};


/**チェックリストボックス twoStepCheckF:二回目のクリックでチェックを変更*/
var CheckedListBox=function(ParentObj, Class, list,x, y,width,height,twoStepCheckF, onChange,styleinfo){
    let _this = this;
    let lineH = Generic.getDivSize("A", undefined, "").height + 3;
    let allh = lineH * list.length;
    let ovy = (allh < height - 2) ? "" : "overflow-y: scroll;";
    let w = (allh < height - 2) ? width - 2 : width - scrMargin.scrollWidth - 1;
    let lBox = [];
    const frame = Generic.createNewDiv(ParentObj, "", Class, "grayFrame", x, y, width, height - 24, ovy + "overflow-x:hidden;background-color:white;user-Select:none");
    const allSelFrame = Generic.createNewDiv(ParentObj, "", "", "", x, y + (height - 22), w, 22, "");
    Generic.createNewButton(allSelFrame, "全選択", "", width - 115, 0, function () { allChange(true);if(onChange!=undefined){onChange()}  }, "width:55px;height:22px;padding:0");
    Generic.createNewButton(allSelFrame, "全解除", "", width - 55, 0, function () { allChange(false);if(onChange!=undefined){onChange()} }, "width:55px;height:22px;padding:0");
    const inFrame = Generic.createNewDiv(frame, "", "", "", 0, 0, w, allh, "");
    _addList(list, 0);

    /**リ1つ追加 */
    this.add = function (soloData, pos=undefined) {
        if(pos==undefined){
            pos=this.length;
        }
        _addList([soloData],pos);
    }
    
    /**リストを追加 */
    this.addList = function (list, pos) {
        _addList(list, pos);
    }
    /**指定範囲のリストを削除 */
    this.removeList = function (pos, delNum) {
        _removeList(pos, delNum);
    }
    /**全リストを削除 */
    this.removeAll = function () {
        _removeList(0, lBox.length);
    }

    /**チェック状態を取得 */
    this.getCheckedStatus = function (n) {
        return lBox[n].checked;
    }

    /**チェック状態を設定 */
    this.setCheckStatus= function(n,checked){
        lBox[n].checked=checked;
    }

    /**テキストを設定 */
    this.setText= function(n,text){
        lBox[n].word.innerHTML=text;
    }


    this.length = 0;
    this.selectedIndex=-1;
    /**チェックの状態を返す checkedStatus:全項目のtrue|false,checkedArray:trueの番号一覧*/
    this.getChecked=function(){
        return _getChecked();
    }
    function _removeList(pos, delNum) {
        if (lBox.length == 0) {
            return;
        }
        for (let i = 0; i < delNum; i++) {
            if(_this.selectedIndex == (i+pos)){
                setIndexColor(-1);
            }
            inFrame.removeChild(lBox[i + pos].word);
            inFrame.removeChild(lBox[i + pos]);
        }
        lBox.splice(pos, delNum);
        reNumbering();
    }

    function _addList(lst, pos) {
        let osel=_this.selectedIndex;
        let newsel = (osel == -1) ? -1 : osel + lst.length;
        if(osel >=pos){
            setIndexColor(-1);
        }
        for (let i = 0; i < lst.length; i++) {
            let ypos = (i + pos) * lineH;
            let asfdisabled = (lst[i].text.left(1) == "*");
            let cbox = Generic.createNewInput(inFrame, "checkbox", "", "", 3, ypos, undefined, "");
            cbox.checked = lst[i].checked;
            cbox.disabled = asfdisabled;
            cbox.onchange = change;
            cbox.word = Generic.createNewDiv(inFrame, lst[i].text, "", "", 20, ypos, undefined, undefined, styleinfo + ";padding-left:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
                function (e) {
                    if (asfdisabled == false) {
                        cbox.checked = !cbox.checked;
                        change(e);
                    }
                });
            lBox.splice(pos + i, 0, cbox);
        }
        reNumbering();
        if(osel >=pos){
            setIndexColor(newsel);
        }
        function change(e) {
            let obj = e.target;
            let newSel=Number(obj.tag);
            if(_this.selectedIndex != newSel){
                setIndexColor(newSel);
                if(twoStepCheckF==true){
                    lBox[newSel].checked=!lBox[newSel].checked;
                    return;
                }
            }
            if (typeof onChange == 'function') {
                let retV=_getChecked();
                onChange(newSel, retV.checkedStatus, retV.checkedArray);
            }
        }
    }

    function setIndexColor(newSel){
        if (_this.selectedIndex != -1) {
            lBox[_this.selectedIndex].word.style.backgroundColor = "#ffffff";
        }
        _this.selectedIndex = newSel;
        if (newSel != -1) {
            lBox[newSel].word.style.backgroundColor = "#e1e1ff";
        }
    }

    function _getChecked(){
        let checkedList = [];
        let checkedArray = [];
        for (let i = 0; i < lBox.length; i++) {
            checkedList.push(lBox[i].checked);
            if (lBox[i].checked) {
                checkedArray.push(i);
            }
        }
        return {checkedStatus:checkedList,checkedArray:checkedArray};
    }

    function allChange(checked) {
        for (let i = 0; i < lBox.length; i++) {
            if(lBox[i].disabled==false){
                lBox[i].checked = checked;
            }
        }
    }
    function reNumbering() {
        allh = lineH * lBox.length;
        w = (allh < height - 2) ? width - 2 : width - scrMargin.scrollWidth - 1;
        inFrame.style.height = allh.px();
        for (let i = 0; i < lBox.length; i++) {
            lBox[i].style.top = (i * lineH).px();
            lBox[i].tag = i;
            lBox[i].word.style.top = (i * lineH + 3).px();
            lBox[i].word.style.width = (w - 20).px();
            lBox[i].word.tag = i;
        }
        _this.length = lBox.length;
    }
}

/**リストボックスコントロール addEventListenerを付ける場合は.frameに*/
var ListBox=function(ParentObj, Class, list,x, y,width,height, onChange,styleinfo){
    let _this=this;
    this.selectedIndex= -1;
    this.length=0;
    this.value=undefined;
    let lBox=[];
    let lineH = Generic.getDivSize("A", undefined, "").height + 3;
    let allh = lineH * list.length;
    let ovy = (allh < height - 2) ? "" : "overflow-y: scroll";
    let w = (allh < height - 2) ? width - 2 : width - scrMargin.scrollWidth - 1;
    this.frame = Generic.createNewDiv(ParentObj, "", "", "grayFrame", x, y, width, height, ovy + "overflow-x:hidden;background-color:white");//addEventListenerを付ける場合はframeに
    const inFrame = Generic.createNewDiv(this.frame, "", "", "", 0, 0, w, allh, "");
    _addList(list, 0);

    /**1つ追加 */
    this.add=function(soloData,pos=undefined){
        if(pos==undefined){
            pos=this.length;
        }
        _addList([soloData],pos);
    }
    /**リストを配列で追加 */
    this.addList = function (list, pos=undefined) {
        if(pos==undefined){
            pos=this.length;
        }
        _addList(list, pos);
    }
    /**指定範囲のリストを削除 */
    this.removeList = function (pos, delNum) {
        _removeList(pos, delNum);
    }
    /**全リストを削除 */
    this.removeAll = function () {
        _removeList(0, lBox.length);
    }
    /**選択要素を指定 */
    this.setSelectedIndex = function (newIndex){
        if(this.selectedIndex!=-1){
            lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
        }
        this.selectedIndex=newIndex;
        lBox[newIndex].style.backgroundColor = "#e1e1e1";
        this.value=lBox[newIndex].value;
    }

    this.getText=function(){
        if (this.selectedIndex != -1) {
            return lBox[this.selectedIndex].innerText;
        }else{
            return undefined;
        }
    }
    this.getAllText = function () {
        let v = [];
        for (let i = 0; i < this.length; i++) {
            v.push(lBox[i].innerText)
        }
        return v;
    }

    this.getValue=function(){
        if(this.selectedIndex!=-1){
            return lBox[this.selectedIndex].value;
        }else{
            return undefined;
        }
    }
    this.getAllValue = function () {
        let v = [];
        for (let i = 0; i < this.length; i++) {
            v.push(lBox[i].value)
        }
        return v;
    }

    this.setText=function(row,text){
        lBox[row].innerText=text;
    }

    this.setValue=function(row,value){
        lBox[row].innerText=value;
    }

    this.rowUp = function (row) {
        if (lBox.length < 2) {
            return;
        }
        let dest = row - 1;
        dest = (dest == -1) ? lBox.length - 1 : dest;
        [lBox[row].innerText, lBox[dest].innerHTML] = [lBox[dest].innerText, lBox[row].innerHTML];
        [lBox[row].value, lBox[dest].value] = [lBox[dest].value, lBox[row].value];
        if (row == this.selectedIndex) {
            lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
            this.selectedIndex = dest;
            lBox[this.selectedIndex].style.backgroundColor = "#e1e1e1";
        }
    }

    this.rowDown = function (row) {
        if (lBox.length < 2) {
            return;
        }
        let dest = row + 1;
        dest = (dest == lBox.length) ? 0 : dest;
        [lBox[row].innerText, lBox[dest].innerHTML] = [lBox[dest].innerText, lBox[row].innerHTML];
        [lBox[row].value, lBox[dest].value] = [lBox[dest].value, lBox[row].value];
        if (row == this.selectedIndex) {
            lBox[this.selectedIndex].style.backgroundColor = "#ffffff";
            this.selectedIndex = dest;
            lBox[this.selectedIndex].style.backgroundColor = "#e1e1e1";
        }
    }

    function _addList(lst, pos) {
        if (lst.length == 0) {
            return;
        }
        if (_this.selectedIndex != -1) {
            lBox[_this.selectedIndex].style.backgroundColor = "#ffffff";
        }
        _this.selectedIndex = pos;
        for (let i in lst) {
            let div = Generic.createNewDiv(inFrame, lst[i].text, "", Class, 3, i * lineH, w, lineH, styleinfo+";overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background-color:white",
                function (e) {
                    if (_this.selectedIndex != -1) {
                        lBox[_this.selectedIndex].style.backgroundColor = "#ffffff";
                    }
                    let obj = e.target;
                    obj.style.backgroundColor = "#e1e1e1";
                    _this.selectedIndex = Number(obj.tag);
                    _this.value = lBox[_this.selectedIndex].value;
                    if (typeof onChange == 'function') {
                        onChange(Number(obj.tag), obj.value);
                    }
                });
            div.value = lst[i].value;
            lBox.splice(pos + i, 0, div);
        }
        reNumbering();
    }
    function _removeList(pos, delNum) {
        if (lBox.length == 0) {
            return;
        }
        if(_this.selectedIndex!=-1){
            lBox[_this.selectedIndex].style.backgroundColor = "#ffffff";
        }
        for (let i = 0; i < delNum; i++) {
            inFrame.removeChild(lBox[i + pos]);
        }
        lBox.splice(pos,delNum);
        if (_this.selectedIndex >= pos) {
            _this.selectedIndex -= delNum;
            _this.selectedIndex = (_this.selectedIndex < 0) ? 0 : _this.selectedIndex;
        }
        reNumbering();
    }
    function reNumbering() {
         allh = lineH * lBox.length;
         w = (allh < height - 2) ? width - 2 : width - scrMargin.scrollWidth - 1;
        inFrame.style.height =allh.px();
        for (let i = 0; i < lBox.length; i++) {
            lBox[i].style.top = (i * lineH).px();
            lBox[i].style.width=w.px();
            lBox[i].tag = i;
        }
        if(lBox.length>0){
            lBox[_this.selectedIndex].style.backgroundColor = "#e1e1e1";
            _this.value=lBox[_this.selectedIndex].value;
        }else{
            _this.selectedIndex=-1;
            _this.value=undefined;
        }
        _this.length=lBox.length;
    }
}

/**リストビューコントロール_rowselFlag=trueでクリックした行を返す,selectedRowで選択中の行 */
var ListViewTable=function(ParentObj, gridID,gridClass, tableClass,hdata, data,x, y,width,height,frameStyleinfo,  styleinfo,  
    headStyleinfo, normalStyleinfo, headXStyleinfo, normalXStyleinfo,_rowselFlag,onclick){

    this.frameStyleinfo=frameStyleinfo;
    this.styleinfo=styleinfo;
    this.normalStyleinfo=normalStyleinfo;
    this.headStyleinfo=headStyleinfo;
    this.headXStyleinfo=headXStyleinfo;
    this.normalXStyleinfo=normalXStyleinfo;
    this.rowselFlag=_rowselFlag;
    let _this=this;
    let topDIV=Generic.createNewDiv(ParentObj,gridID,"",gridClass,x,y,width,height,this.frameStyleinfo,undefined);

    let headNum=hdata[0].length;
    let bpos;
    this.selectedRow= -1;
    this.oldBG=[];
    let mousePointingSituation=mousePointingSituations.up;
    let tbhdiv = document.createElement("div");
    let tbh;
    this.thead;
    let tbhHeight;

    if (headNum > 0) {
        tbh = document.createElement("table");
        tbh.setAttribute("style", "user-select: none;" + this.styleinfo)
        //tbh.setAttribute("id", ID);
        tbh.setAttribute("class", tableClass);
        tbh.style.tableLayout = 'fixed';
        tbh.style.width = '100%';
        tbh.onmousemove = function (e) {
            switch (mousePointingSituation) {
                case mousePointingSituations.up: {
                    let x = e.target.offsetLeft + e.offsetX;
                    let n = tbh.rows[0].cells.length;
                    bpos = -1;
                    for (let i = 0; i < n - 1; i++) {
                        let cellBorderx0 = tbh.rows[0].cells[i].offsetLeft + tbh.rows[0].cells[i].offsetWidth;
                        if ((Math.abs(x - cellBorderx0) < 10)) {
                            tbh.style.cursor = 'w-resize';
                            bpos = i;
                            break;
                        }
                    }
                    if (bpos == -1) {
                        tbh.style.cursor = 'default';
                    }
                    break;
                }
                case mousePointingSituations.down: {
                    if (bpos != -1) {
                        let x = e.target.offsetLeft + e.offsetX;
                        let w = x - tbh.rows[0].cells[bpos].offsetLeft;
                        tbh.rows[0].cells[bpos].style.width = w.px();
                        if(_this.tb.rows[0] !=undefined){
                            _this.tb.rows[0].cells[bpos].style.width = w.px();
                        }
                    }
                    break;
                }
            }
        }
        tbh.onmousedown = function (e) {
            mousePointingSituation = mousePointingSituations.down;
        }
        tbh.onmouseup = function (e) {
            bpos = -1;
            mousePointingSituation = mousePointingSituations.up;
        }
        this.thead = tbh.createTHead();
        this.thead.setAttribute("style", this.headStyleinfo);
        
        for (let i = 0; i < headNum; i++) {
            let row = this.thead.insertRow(-1);
            
            for (let j = 0; j < hdata.length; j++) {
                let newCell = row.insertCell(-1);
                newCell.setAttribute("style", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
                if ((this.headXStyleinfo[j] != undefined)) {
                    newCell.setAttribute("style", this.headXStyleinfo[j]);
                }
                newCell.innerHTML = hdata[j][i] ;
            }
        }
        
        tbhdiv.appendChild(tbh);
        document.body.appendChild(tbhdiv);//displayがnoneだと高さが取得できないため一時的にbodyに入れる
        tbhHeight=tbhdiv.clientHeight;
        document.body.removeChild(tbhdiv);
        topDIV.appendChild(tbhdiv);
    }

    let xcell = data.length;

    this.tbdiv = document.createElement("div");
    if (headNum > 0) {
        tbheight = height - tbhHeight;
    }
    this.tbdiv.setAttribute("style", "height:" + tbheight.px() + ";overflow-y: scroll;overflow-x:hidden")
    this.tb = document.createElement("table");
    this.tb.setAttribute("style", "user-select: none;" + this.styleinfo);
    this.tb.setAttribute("class", tableClass);
    this.tb.style.tableLayout = 'fixed';
    this.tb.style.width = '100%';
    this.tbody = this.tb.createTBody();
    if (xcell>0){//データがある場合
        let ycell = data[0].length;
        for (let i = 0; i < ycell; i++) {
            let row = this.tbody.insertRow(-1)
            row.setAttribute("style", this.normalStyleinfo);
            for (let j = 0; j < xcell; j++) {
                let newtd = row.insertCell(-1);
                newtd.innerHTML = data[j][i];
                newtd.setAttribute("style", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
                if (this.normalXStyleinfo[j] != undefined) {
                    newtd.setAttribute("style", this.normalXStyleinfo[j]);
                }
                newtd.onclick = function (e) { clickTBody(e) };
            }
        } 
        this.selectRow(0);
    }

    this.tb.appendChild(this.tbody);
    this.tbdiv.appendChild(this.tb);
    topDIV.appendChild(this.tbdiv);
    if (headNum > 0) {
        //ヘッダの幅をスクロールバーに合わせる
        tbhdiv.style.width = (width-scrMargin.scrollWidth).px();
    }

    function clickTBody(e) {
        _this.selectRow(e.target.parentNode.rowIndex);
        if (typeof onclick == 'function') {
            onclick(e.target.parentNode.rowIndex);
        }
    }
    this.selectRow = function (newSelRow) {
        if (_this.rowselFlag == true) {
            if (_this.rowselFlag == true) {
                if ((_this.selectedRow >= 0) && (_this.selectedRow < _this.tb.rows.length)) {
                    for (let i = 0; i < _this.tb.rows[_this.selectedRow].cells.length; i++) {
                        _this.tb.rows[_this.selectedRow].cells[i].style.backgroundColor = _this.oldBG[i];
                    }
                }
            }
            _this.oldBG = [];
            if (newSelRow != -1) {
                for (let i = 0; i < _this.tb.rows[newSelRow].cells.length; i++) {
                    _this.oldBG.push(_this.tb.rows[newSelRow].cells[i].style.backgroundColor)
                    _this.tb.rows[newSelRow].cells[i].style.backgroundColor = "#e1e1e1";
                }
        }
        }
        _this.selectedRow = newSelRow;
    }

    /**行にデータ挿入prototypeでは作りにくい rowInsertPos=0の場合はselectedRowの前に、1の場合は後ろに追加*/
    this.insertRow = function (rowInsertPos, plusData) {
        let rn=this.tb.rows.length;
        let rowpos = this.selectedRow + rowInsertPos;
        let row = this.tbody.insertRow(rowpos);
        row.setAttribute("style", this.normalStyleinfo);
        for (let j = 0; j < plusData.length; j++) {
            let newtd = row.insertCell(-1);
            newtd.innerHTML = plusData[j];
            newtd.setAttribute("style", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap");
            if (this.normalXStyleinfo[j] != undefined) {
                newtd.setAttribute("style", this.normalXStyleinfo[j]);
            }
            newtd.onclick = function (e) { clickTBody(e) };
            if((headNum>0)&&(rn==0)){//行がない状態で追加する場合、幅をヘッダに合わせる
                newtd.style.width=tbh.rows[0].cells[j].style.width;
            }
        }
        if(rowInsertPos==0){
            this.selectedRow++;
        }
        this.selectRow(rowpos);
    }
}
/**ListViewの行数取得 */
ListViewTable.prototype.getRowNumber = function () {
    return this.tb.rows.length;
}

/**selectedRowの行削除 */
ListViewTable.prototype.deleteRow = function () {
    let rowPos = this.selectedRow;
    if (rowPos == -1) { return; }
    this.tbody.deleteRow(rowPos);
    if (this.tb.rows.length == 0) {
        this.selectedRow = -1;
    } else {
        let newsel = Math.min(this.selectedRow, this.tb.rows.length - 1);
        this.selectRow(newsel);
    }
}

/**セルに値を設定 */
ListViewTable.prototype.setValue=function(x,y,value){
    this.tb.rows[y].cells[x].innerHTML=value;;
}

/**行の上下を反転 */
ListViewTable.prototype.reverse=function(){
    let n=this.tb.rows.length;
    let celln = this.tb.rows[0].cells.length;
    for (let i = 0; i < Math.floor(n/2); i++) {
        let r1=this.tb.rows[i];
        let r2=this.tb.rows[n-1-i];
        for (let j = 0; j < celln; j++) {
            [r1.cells[j].innerHTML, r2.cells[j].innerHTML] = [r2.cells[j].innerHTML, r1.cells[j].innerHTML]
        }
    }
    let newsel=this.tb.rows.length-1-this.selectedRow;
    this.selectRow(newsel);
}

/**selectedRowの行上移動 */
ListViewTable.prototype.rowUp = function () {
    if(this.tb.rows.length<2){return;}
    let rowPos=this.selectedRow;

    let celln = this.tb.rows[rowPos].cells.length;
    let dest = rowPos - 1;
    if (dest == -1) {
        let stac = [];
        for (let i = 0; i < celln; i++) {
            stac.push(this.tb.rows[rowPos].cells[i].innerHTML);
        }
        this.deleteRow();
        this.selectRow(this.tb.rows.length-1);
        this.insertRow(1, stac);
        this.tbdiv.scrollTop = this.tbdiv.scrollTopMax;
    } else {
        for (let i = 0; i < celln; i++) {
            [this.tb.rows[rowPos].cells[i].innerHTML, this.tb.rows[dest].cells[i].innerHTML] = [this.tb.rows[dest].cells[i].innerHTML, this.tb.rows[rowPos].cells[i].innerHTML]
        }
        this.selectRow(dest);
    }
    
}
/**selectedRowの行下移動 */
ListViewTable.prototype.rowDown = function () {
    let maxrow = this.tb.rows.length;
    if(maxrow<2){return;}
    let rowPos=this.selectedRow;
    let celln = this.tb.rows[rowPos].cells.length;
    let dest = rowPos + 1;
    if (dest == maxrow) {
        let stac = [];
        for (let i = 0; i < celln; i++) {
            stac.push(this.tb.rows[rowPos].cells[i].innerHTML);
        }
        this.deleteRow();
        this.selectRow(0);
        this.insertRow(0, stac);
        this.tbdiv.scrollTop = 0;
    } else {
        for (let i = 0; i < celln; i++) {
            [this.tb.rows[rowPos].cells[i].innerHTML, this.tb.rows[dest].cells[i].innerHTML] = [this.tb.rows[dest].cells[i].innerHTML, this.tb.rows[rowPos].cells[i].innerHTML]
        }
        this.selectRow(dest);
    }
}
/**表クリア */
ListViewTable.prototype.clear = function () {
    let maxrow = this.tb.rows.length;
    for (let i = maxrow - 1; i >= 0; i--) {
        this.selectRow(i);
        this.deleteRow();
    }
    this.selectRow(-1);
}

//ウインドウの最大化ボタンをリセットする
Element.prototype.resetMaxButton=function(MaxFlag){
    let cnode = this.childNodes;
    for (let i = 0; i < cnode.length; i++) {
        if (cnode[i].name == 'maxButton') {
            const ctx = cnode[i].getContext("2d");
            let w=cnode[i].width;
            ctx.clearRect(0, 0,cnode[i].width,cnode[i].height);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.strokeRect(2, 2,w-4,w-4);
            if (MaxFlag == false) {
                ctx.strokeRect(2, 7,Math.floor(w/2),Math.floor(w/2));//小さい四角を追加
            }
            break;
        }
    }
    if(MaxFlag==true){
        this.maxSizeFlag=false;
    }else{
        this.maxSizeFlag=true;
    }
}
//DIV要素の移動，拡大縮小
Element.prototype.dragBorder=function(movingCall,moveEndCall){
    let x;
    let y;
    let fx;
    let fy;
    let fW;
    let fH;
    let fLeft;
    let fTop;
    let mode;
    let mdownF=false;
    const targetEle=this;
    const SR=10;
    const TR=scrMargin.top;

    this.addEventListener("mousedown", mdown, false);
    this.addEventListener("touchstart", mdown, false);
    this.addEventListener("mousemove", mmovef, false);
    function mmovef(event) {
        //要素内の相対座標を取得
        fx = event.pageX- this.parentElement.offsetLeft;
        fy = event.pageY- this.parentElement.offsetTop;
        x = fx - this.offsetLeft;
        y = fy - this.offsetTop;
        fW = this.style.width.removePx();
        fH = this.style.height.removePx()
        const posX = fW - x;
        const posY = fH - y;
        const top = this.offsetTop;
        //拡大縮小エリアのカーソル
        if ((posX < SR) && (posY < SR)) {
            this.style.cursor = 'se-resize';
        } else if ((posX < SR) && (y < TR)) {
            this.style.cursor = 'ne-resize';
        } else if ((x < SR) && (y < TR)) {
            this.style.cursor = 'nw-resize';
        } else if ((x < SR) && (posY < SR)) {
            this.style.cursor = 'sw-resize';
        } else if ((posX < SR) && (y > TR)) {
            this.style.cursor = 'e-resize';
        } else if ((x < SR)) {
            this.style.cursor = 'w-resize';
        } else if ((posY < SR) && (top > 0)) {
            this.style.cursor = 's-resize';
        } else if ((((0 <= y) && (y <= TR)) || ((posY < SR) && (top <= 0))) && (70<posX )&&(40<x)) {
            if (y < 3) {
                this.style.cursor = 'n-resize';
            } else {
                this.style.cursor = 'move';
            }
        } else {
            this.style.cursor = 'default';
        }
    }

    //マウスが押された際の関数
    function mdown(e) {
        e.stopPropagation();
        let checkF = true;
         mdownF=true;
        //タッチデイベントとマウスのイベントの差異を吸収
        let event;
        if (e.type === "mousedown") {
             event = e;
        } else {
             event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        fx = event.pageX- this.parentElement.offsetLeft;
        fy = event.pageY- this.parentElement.offsetTop;
        fW = this.style.width.removePx();
        fH = this.style.height.removePx();
        fLeft = this.style.left.removePx();
        fTop = this.style.top.removePx();
        x = fx - this.offsetLeft;
        y = fy - this.offsetTop;
        const posX = fW - x;
        const posY = fH - y;
        const top = this.offsetTop;
        //拡大縮小エリアのカーソルとモード設定
        if ((posX < SR) && (posY < SR)) {
            this.style.cursor = 'se-resize';
            mode = 'se-resize';
        } else if ((posX < SR) && (y < TR)) {
            this.style.cursor = 'ne-resize';
            mode = 'ne-resize';
        } else if ((x < SR) && (y < TR)) {
            this.style.cursor = 'nw-resize';
            mode = 'nw-resize';
        } else if ((x < SR) && (posY < SR)) {
            this.style.cursor = 'sw-resize';
            mode = 'sw-resize';
        } else if ((posX < SR) && (y > TR)) {
            this.style.cursor = 'e-resize';
            mode = 'e-resize';
        } else if ((x < SR) && (y > TR)) {
            this.style.cursor = 'w-resize';
            mode = 'w-resize';
        } else if ((posY < SR) && (top > 0)) {
            this.style.cursor = 's-resize';
            mode = 's-resize';
        } else if ((((0 <= y) && (y <= TR)) || ((posY < SR) && (top <= 0))) && (posX > 60)) {
            if (x > 40) {
                if (y < 3) {
                    this.style.cursor = 'n-resize';
                    mode = 'n-resize';
                } else {
                    this.style.cursor = 'move';
                    mode = 'move';
                }
            }
        } else {
            checkF = false;
        }
        //ムーブイベントにコールバック
        if (checkF == true) {
            this.removeEventListener("mousemove", mmovef, false);
            this.parentElement.addEventListener("mousemove", mmove, false);
            this.parentElement.addEventListener("touchmove", mmove, false);
            this.addEventListener("mouseup", mdup, false);
        }
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {
        if(mdownF==false){
            return;
        }
        //同様にマウスとタッチの差異を吸収
        let event;
        if (e.type === "mousemove") {
             event = e;
        } else {
             event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();
        //マウスが動いた場所に要素を動かす
        const epx = event.pageX- targetEle.parentElement.offsetLeft;
        const epy = event.pageY- targetEle.parentElement.offsetTop;
        const newW = fW + epx - fx;
        const newH = fH + epy - fy;
        const newW2 = fW + fx - epx;
        const newH2 = fH + fy - epy;
        const minSize = 50;
        switch (mode) {
            case 'move':
                targetEle.style.top = (epy - y).px();
                targetEle.style.left = (epx - x).px();           
                break;
            case 'e-resize':
                if (newW > minSize) {
                    targetEle.style.width = newW.px();
                }
                break;
            case 'w-resize':
                if (newW2 > minSize) {
                    targetEle.style.left = (fLeft - (fx - epx)).px();
                    targetEle.style.width = newW2.px();
                }
                break;
            case 's-resize':
                if (newH > minSize) {
                    targetEle.style.height = newH.px();
                }
                break;
            case 'n-resize':
                if (newH2 > minSize) {
                    targetEle.style.top = (fTop - (fy - epy)).px();
                    targetEle.style.height = newH2.px();
                }
                break;
            case 'se-resize':
                if (newW > minSize) {
                    targetEle.style.width = newW.px();
                }
                if (newH > minSize) {
                    targetEle.style.height = newH.px();
                }
                break;
            case 'ne-resize':
                if (newW > minSize) {
                    targetEle.style.width = newW.px();
                }
                if (newH2 > minSize) {
                    targetEle.style.top = (fTop - (fy - epy)).px();
                    targetEle.style.height = newH2.px();
                }
                break;
            case 'sw-resize':
                if (newW2 > minSize) {
                    targetEle.style.left = (fLeft - (+fx - epx)).px();
                    targetEle.style.width = newW2.px();
                }
                if (newH > minSize) {
                    targetEle.style.height = newH.px();
                }
                break;
            case 'nw-resize':
                if (newW2 > minSize) {
                    targetEle.style.left = (fLeft - (+fx - epx)).px();
                    targetEle.style.width = newW2.px();
                }
                if (newH2 > minSize) {
                    targetEle.style.top = (fTop - (fy - epy)).px();
                    targetEle.style.height = newH2.px();
                }
                break;
        }
        if(mode!='move'){
            Generic.moveInnerElement(targetEle);
        }
        if (mode != 'move') {
            targetEle.maxSizeFlag = false;
            //リサイズ中に発生するコールバック
            if(typeof movingCall  == 'function'){
                movingCall(targetEle);
            }
        }
        targetEle.removeEventListener("mouseup", mdup, false);//移動した場合は同じ地点でマウスボタンが上がった場合の処理は行わない
        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        targetEle.addEventListener("mouseup", mup, false);
        targetEle.addEventListener("touchend", mup, false);
        targetEle.parentElement.addEventListener("touchleave", mup, false);
    }

    //同じ地点でマウスボタンが上がった場合の処理
    function mdup(e) {
        this.style.cursor = 'default';
        this.addEventListener("mousemove", mmovef, false);
        targetEle.parentElement.removeEventListener("mousemove", mmove, false);
        targetEle.parentElement.removeEventListener("touchmove", mmove, false);
        mdownF=false;
    }

    //マウスボタンが上がったら発火
    function mup(e) {
        if(mdownF==false){
            return;
        }

        this.style.cursor = 'default';
        this.addEventListener("mousemove", mmovef, false);
        //ムーブベントハンドラの消去
        this.parentElement.removeEventListener("mousemove", mmove, false);
        this.parentElement.removeEventListener("touchmove", mmove, false);
        targetEle.removeEventListener("mouseup", mup, false);
        targetEle.removeEventListener("touchend", mup, false);
        if (mode != 'move') {            
            if(typeof moveEndCall == 'function'){
                moveEndCall(targetEle);
            }
        }
        mdownF=false;
    }
}



//数値にpxをつける
Number.prototype.px = function (num) {
    var v = this.toString();
    return v + "px";
};

/**NumberInputに値を設定する */
HTMLElement.prototype.setNumberValue= function (v){
    this.preValue=v;
    this.value=v;
}
//select要素の子要素を削除
HTMLElement.prototype.removeAll = function () {
    while (this.lastChild) {
        this.removeChild(this.lastChild);
    }
}

/**select要素のoptionを入れ替える */
HTMLElement.prototype.optionSwap= function(n1,n2){
    let d = this.options[n1].text;
    this.options[n1].text = this.options[n2].text;
    this.options[n2].text = d;
    let v = this.options[n1].text;
    this.options[n1].value = this.options[n2].value;
    this.options[n2].value = v;
    let a = this.options[n1].disabled;
    this.options[n1].disabled = this.options[n2].disabled;
    this.options[n2].disabled = a;
}

//select要素の選択要素を一つ削除、選択位置を移動、削除したvalueを返す
HTMLElement.prototype.removeOne = function () {
    let mx=this.options.length;
    let fSel=parseInt(this.selectedIndex);
    if(fSel==-1){
        return undefined;
    }
    let v=this.options[fSel].value;
    let newSel=fSel;
    this.remove(fSel);
    if(mx==1){
        newSel=-1;
    }else{
        if(fSel==(mx-1)){
            newSel=fSel-1;
        }
    }
    this.selectedIndex=newSel;
    return v;
}

//select要素にリスト追加
HTMLElement.prototype.addSelectList = function (list, firstSelectIndex, resetF, astariskNonF,insertPoint=undefined) {
    if (resetF == true) {
        this.removeAll();
    }
    for (var j = 0; j < list.length; j++) {
        var opt = document.createElement("option");
        opt.value = list[j].value;
        opt.appendChild(document.createTextNode(list[j].text));
        if ((list[j].text.left(1) == "*") && (astariskNonF == true)) {
            opt.disabled = true;
        }
        if(insertPoint==undefined){
            this.appendChild(opt);
        }else{
            this.add(opt,insertPoint+j);
        }
    }
    if (firstSelectIndex != undefined) {
        this.selectedIndex = firstSelectIndex;
        this.oldSel=firstSelectIndex;
    }
}

//select要素の選択テキストを取得
HTMLElement.prototype.getText = function () {
    let n = this.selectedIndex;
    if (n == -1) {
        return undefined;
    }
    return this.options[n].text;
}

//select要素の選択valueを取得
HTMLElement.prototype.getValue = function () {
    let n = this.selectedIndex;
    if (n == -1) {
        return undefined;
    }
    let v=this.options[n].value;
    if (isNaN(v)==false){
        v=Number(v);
    }
    return v;
}

//select要素で指定した文字のテキストを選択
HTMLElement.prototype.setSelectText = function (txt) {
    let n = this.options.length;
    for (let i = 0; i < n; i++) {
        if (this.options[i].text == txt) {
            this.selectedIndex = i;
            return true;
            break;
        }
    }
    return false;
}

/**select要素の指定の位置のvalueとテキストを変更 */
HTMLElement.prototype.setSelectData=function(n,value,text){
    this.options[n].text=text;
    this.options[n].value=value;
}

//select要素で指定したvalueのテキストの先頭にアスタリスクを付ける、外す
HTMLElement.prototype.setAstarisk = function (value,astariskAddF) {
    let n = this.options.length;
    for (let i = 0; i < n; i++) {
        let v=this.options[i].value;
        if ((isNaN(v)==false)&&(isNaN(value)==false)){
            v=Number(v);
        }
        if (v == value) {
            let tx=this.options[i].text;
            if(astariskAddF==true){
                if(tx.left(1)!="*"){
                    tx="*"+tx;
                }
                this.options[i].disabled = true;
            }else{
                if(tx.left(1)=="*"){
                    tx=tx.mid(1,tx.length-1);
                }
                this.options[i].disabled = false;
            }
            this.options[i].text=tx;
            return;
        }
    }
}

//select要素で指定したvalueを選択
HTMLElement.prototype.setSelectValue= function (value) {
    let n = this.options.length;
    for (let i = 0; i < n; i++) {
        let v=this.options[i].value;
        if ((isNaN(v)==false)&&(isNaN(value)==false)){
            v=Number(v);
        }
        if (v == value) {
            this.selectedIndex = i;
            return true;
            break;
        }
    }
    return false;
}
//要素の表示状態を指定のものに設定
HTMLElement.prototype.setVisibility = function (visiflag) {
    if (visiflag == true) {
        this.style.display = "inline";
    } else {
        this.style.display = 'none';
    }
}
/**要素の表示状態を取得 */
HTMLElement.prototype.getVisibility = function () {
    if (this.style.display == "inline"){
        return true;
    } else {
        return false;
    }
}

/**ボタンの使用可／不可の切り替え */
HTMLElement.prototype.btnDisabled = function (f) {
    this.disabled = f;
    if (f == true) {
        this.className = "btnDisable";
    } else {
        this.className = "";
    }
}

//文字からpxをとる
String.prototype.removePx = function () {
    return parseInt(this.substr(0, this.length - 2))
}

//文字列繰り返し
String.prototype.repeat = function (num) {
    for (var str = ""; (this.length * num) > str.length; str += this);
    return str;
};

//文字列左から抜き出し
String.prototype.left = function (num) {
    return this.substr(0, num);
};

//文字列右から抜き出し
String.prototype.right = function (num) {
    return this.substr(this.length - num);
};
/**文字を途中から抜き出し lengthがundefinedの場合最後まで*/
String.prototype.mid = function (start, length){
    if(length==undefined){
        return this.slice(start);

    }else{
        return this.slice(start, start + length);
    }
}
/**文字列の指定位置に文字列を差し替え */
String.prototype.midReplace = function (start, replaceString){
    let tx = this.substring(0, start ) + replaceString + this.substring(start + replaceString.length);
   return tx;
}

//文字列全置換
String.prototype.replaceAll = function (org, dest) {
    return this.split(org).join(dest);
}

