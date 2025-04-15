// JavaScript source code
/// <reference path="clsGeneric.js" />
/// <reference path="clsAttrData.js" />
/// <reference path="clsTime.js" />
/// <reference path="clsMapdata.js" />
/// <reference path="clsPrint.js" />

class clsDraw {

    static print(g, Word, P, Font_P, HorizonalAlignment, VerticalAlignment, ScrData) {


        let Word_a = Word;

        let tdata = this.TextCut_for_print(g, Word_a, Font_P, true, -1, ScrData);
        let Word_Array = tdata.Out_Text;
        let yw = tdata.Height;
        let xw = tdata.RealWidth;
        let an = Word_Array.length;
        let X;
        let Y;
        switch (HorizonalAlignment) {
            case enmHorizontalAlignment.Left:
                X = P.x;
                break;
            case enmHorizontalAlignment.Center:
                X = P.x - xw / 2;
                break;
            case enmHorizontalAlignment.Right:
                 
                X = P.x - xw;
                break;

        }

        switch (VerticalAlignment) {
            case enmVerticalAlignment.Top:
                Y = P.y;
                break;
            case enmVerticalAlignment.Center:
                Y = P.y - yw * an / 2;
                break;
            case enmVerticalAlignment.Bottom:
                Y = P.y - yw * an;
                break;
        }

        let C_Rect = new rectangle(new point(X, Y), new size(xw, yw * an));

        let f = false;
        if (ScrData.SampleBoxFlag == false) {
            if (spatial.Compare_Two_Rectangle_Position_turned(C_Rect, Font_P.Kakudo, ScrData.MapScreen_Scale) != cstRectangle_Cross.cstOuter) {
                f = true;
            } else {
                f = false;
            }
        } else {
            f = true;
        }

        if (f == true) {
            let TH;
            if (ScrData.SampleBoxFlag == false) {
                TH = ScrData.Get_Length_On_Screen(Font_P.Size);
            } else {
                TH = Font_P.Size;
            }
            let npw = 1
            if (Font_P.FringeF == true) {
                npw = Math.max(TH * Font_P.FringeWidth / 100 / 2, 3);
            }
            let ita_plus = 0;
            if (Font_P.italic == true) {
                ita_plus = TH / 5;
            }
           clsDrawTile.Draw_Tile_RoundBox(g, new rectangle(X - npw, X + xw + npw - 1 + ita_plus, Y - npw, Y + yw * an + npw - 1), Font_P.Back, Font_P.Kakudo, ScrData);
            for (let i = 0; i < an; i++) {
                let P2 = new point(-xw / 2, -yw / 2);
                P2 = spatial.Trans2D(P2, -Font_P.Kakudo);
                P2.offset(X + xw / 2, Y + yw * i + yw / 2);
                this.DrawText2(g, P2, Word_Array[i], Font_P, ScrData);
            }
        }
        return f;

    }

    static DrawText2(g, P, Tx, P_Font, ScrData) {
        let TH;
        if (ScrData.SampleBoxFlag == false) {
            TH = ScrData.Get_Length_On_Screen(P_Font.Size);
        } else {
            TH = P_Font.Size;
        }
        let ftext = "";
        if (P_Font.italic == true) {
            ftext += "italic ";
        }
        if (P_Font.bold == true) {
            ftext += "bold ";
        }
        //if (P_Font.Underline == true) {
        //    ftext += "underline ";
        //}
        ftext += TH + "px " + "'" + P_Font.Name + "' ";
        g.font = ftext;
        g.textBaseline = 'top';
        g.fillStyle = P_Font.Color.toRGBA();
        g.lineCap = "round";
        g.lineJoin = "round";
        if (P_Font.Kakudo != 0) {
            g.save();
            g.translate(P.x, P.y);
            g.rotate(-P_Font.Kakudo * Math.PI / 180);
            if (P_Font.FringeF == true) {
                let w = Math.max(TH * P_Font.FringeWidth / 100 / 2, 1);
                g.lineWidth = w;
                g.strokeStyle = P_Font.FringeColor.toRGBA();
                g.strokeText(Tx, 0, 0);
            }
            g.fillText(Tx, 0, 0);
            g.restore();
        } else {
            if (P_Font.FringeF == true) {
                let w = Math.max(TH * P_Font.FringeWidth / 100 / 2, 1);
                g.lineWidth = w;
                g.strokeStyle = P_Font.FringeColor.toRGBA();
                g.strokeText(Tx, P.x, P.y);
            }
            g.fillText(Tx, P.x, P.y);

        }

    }


    //指定した幅で文字列を分割して返す
    static TextCut_for_print(g, T, P_Font, Orikaesi_F, Max_Width, ScrData) {

        let Out_Text=[];
        let thdata = P_Font.toContextFont(ScrData);
        g.font = thdata.font;
        let FSize;
        let subText = "";
        let i = 0;
        let Mxw = 0;
        T = String(T);
        do {
            if (T.mid(i, 1) == chrLF) {
                i += 1;
                Out_Text.push(subText);
                subText = "";
            } else {
                let MidText = T.mid(i, 1);
                FSize = g.measureText(subText + MidText);
                if (Max_Width > 0) {
                    if (FSize.width > Max_Width) {
                        Out_Text.push(subText);
                        i++;
                        subText = MidText;
                    } else {
                        Mxw = Math.max(Mxw, FSize.width);
                        subText += MidText;
                        i++;
                    }
                } else {
                    subText += MidText;
                    i++;
                    Mxw = Math.max(Mxw, FSize.width);
                }
            }
        } while (i <= T.length)
        Out_Text.push(subText);
        if (Orikaesi_F == false) {
            Out_Text.splice(1, Out_Text.length - 1);
        }
        return {
            RealWidth: Mxw, Height: thdata.height, Out_Text: Out_Text
        };
    }

 
    static DrawPolyPolygon(g, Polydata, Fcolor) {
        let Pon = Polydata.Pon;
        let pxy = Polydata.pxy;
        let nPolyP = Polydata.nPolyP;
        let n = 0;
        g.beginPath();
        for (let i = 0; i < Pon; i++) {
            g.moveTo(pxy[n].x, pxy[n].y);
            n++;
            for (var j = 1; j < nPolyP[i]; j++) {
                g.lineTo(pxy[n].x, pxy[n].y);
                n++;
            }
        }
        g.closePath();
        g.fillStyle = Fcolor;
        g.fill("evenodd");
    }

    static ClipPolyPolygon(g, pxy, AllnPolyP) {
        let Pon = AllnPolyP.length;
        let n = 0;
        g.beginPath();
        for (let i = 0; i < Pon; i++) {
            g.moveTo(pxy[n].x, pxy[n].y);
            n++;
            for (var j = 1; j < AllnPolyP[i]; j++) {
                g.lineTo(pxy[n].x, pxy[n].y);
                n++;
            }
        }
        g.closePath();
        g.clip("evenodd");
    }

    static Ellipse(g, Point, r, InnerColor, BorderColor, width) {
        g.beginPath();
        g.arc(Point.x, Point.y, r, 0, 2 * Math.PI, false);
        if (InnerColor != undefined) {
            g.fillStyle = InnerColor;
            g.fill();
        }
        if (BorderColor != undefined) {
            g.strokeStyle = BorderColor;
            g.lineWidth = width;
            g.stroke();
        }
    }
    static Draw_Tile_and_Paint_and_Line(g, pxy, nPolyP, polyn, Tile, LinePat, ScrData) {
        if (LinePat != undefined) {
            let lc = ['butt', 'square', 'round'];
            let lj = ['miter', 'bevel', 'round'];
            g.lineCap = lc[LinePat.Edge_Connect_Pattern.lineCap];
            g.lineJoin = lj[LinePat.Edge_Connect_Pattern.lineJoin];
            g.miterLimit = LinePat.Edge_Connect_Pattern.miterLimit;
            g.strokeStyle = LinePat.Color.toRGBA();
            g.lineWidth = ScrData.Get_Line_Width(LinePat.Width);
        }
        let n = 0;
        g.beginPath();
        for (let i = 0; i < polyn; i++) {
            if (nPolyP[i] > 0) {
                g.moveTo(pxy[n].x, pxy[n].y);
                n++;
                for (var j = 1; j < nPolyP[i]; j++) {
                    g.lineTo(pxy[n].x, pxy[n].y);
                    n++;
                }
            }
        }
        if (Tile != undefined) {
            if (Tile.BlankF == false) {
                g.closePath();
                g.fillStyle = Tile.Color.toRGBA();
                g.fill();
            }
        }
        if (LinePat != undefined) {
            if (LinePat.BlankF == false) {
                g.stroke();
            }
        }
    }



}

class clsDrawLine {
    static Line(g, LinePat, d1, d2, d3) {
        if (LinePat.BlankF == true) {
            return;
        }
        let pxy = [];
        let ScrData;
        if ((d1 instanceof point) == true) {
            pxy = [d1, d2];
            ScrData = d3;
        } else {
            pxy = d1;
            ScrData = d2;
        }
        this.Draw_SolidPolyLine(g, pxy, LinePat, ScrData);
    }

    static Draw_SolidPolyLine(g, pxy, LinePat, ScrData) {
        g.lineCap = LinePat.Edge_Connect_Pattern.lineCap;
        g.lineJoin = LinePat.Edge_Connect_Pattern.lineJoin;
        g.miterLimit = LinePat.Edge_Connect_Pattern.miterLimit;
        g.strokeStyle = LinePat.Color.toRGBA();
        g.lineWidth = ScrData.Get_Line_Width(LinePat.Width);
        g.beginPath();
        g.moveTo(pxy[0].x, pxy[0].y);
        pxy.forEach(function (p) {
            g.lineTo(p.x, p.y);
        });
        g.stroke();
    }

    /**矢印描画 */
    static Arrow(g, P, BeforPoint, LPat, DArrow, ScrData) {
        let e2=new point() ;
        let e3 =new point() ;
        let e4 =new point() ;
        this.Draw_Arrow_Keisan(e3, e2, e4,  P, BeforPoint, LPat, DArrow, false, ScrData);
        let pxy=[];
        pxy[0] = ScrData.Get_SxSy_With_3D(e3);
        pxy[1] = ScrData.Get_SxSy_With_3D(P);
        pxy[2] = ScrData.Get_SxSy_With_3D(e4);

        switch (DArrow.ArrowHeadType) {
            case enmArrowHeadType.Line: {
                let lp=LPat.Clone();
                let LA_Pat = lp.Edge_Connect_Pattern;
                LA_Pat.MiterLimitValue = 10;
                LA_Pat.Join_Pattern = enmJoinPattern.Miter;
                LA_Pat.Edge_Pattern = enmEdge_Pattern.Flat;
                this.Line(g, lp, pxy, ScrData);
                break;
            }
            case enmArrowHeadType.Fill: {
                pxy[3] = pxy[0].Clone();
                let Polydata = { Pon: 1, pxy: pxy, nPolyP:[4] };
                clsDraw.DrawPolyPolygon(g,Polydata, LPat.Color.toRGBA());
                break;
            }
        }

    }

    static Check_Draw_Arrow_Line(OP, BeforPoint, LineP1, LineP2, LPat, DArrow, ScrData) {
        let e2=new point() ;
        let e3=new point() ;
        let e4=new point() ;
        this.Draw_Arrow_Keisan(e3, e2, e4,  OP, BeforPoint, LPat, DArrow, true, ScrData);
        return spatial.Line_Cross_Point(e3, e4, LineP1, LineP2);
    }

    static Draw_Arrow_Keisan(a1, ac, a2,  OP, BeforPoint, LPat, DArrow, Check_F, ScrData) {

        let VecX = OP.x - BeforPoint.x;
        let VecY = OP.y - BeforPoint.y;

        //sita:矢印の角度の半分
        let sita = DArrow.Angle / 2;

        //線の幅を求める
        let LineW = LPat.Width;
        if (LPat.BlankF == true) {
            LineW = 0;
        }

        //a:矢印の底辺の長さの半分
        let a = ScrData.STDWsize * ((LineW * DArrow.LWidthRatio + DArrow.WidthPlus) / 2) / 100 * ScrData.GSMul;
        if (Check_F == true) {
            a = a * 0.95;
        }
        //c:矢印の頂点から底辺へ垂線の長さ
        let c = a / Math.sin(sita * Math.PI / 180);
        //b:矢印の三角形の長辺の長さ
        let b = c * Math.cos(sita * Math.PI / 180);

        let e2=new point();
        let tva = Math.sqrt(1 / (VecX ** 2 + VecY ** 2));
        e2.x = VecX * tva * b;
        e2.y = VecY * tva * b;

        let retV = spatial.Get_Suisen_Vec(VecX, VecY);
        let V_VecX = retV.rVx;
        let V_VecY = retV.rVy;

        let newP = spatial.Get_Vec_Point(V_VecX, V_VecY, a, false);

        ac.x = OP.x - e2.x;
        ac.y = OP.y - e2.y;

        a1.x = ac.x + newP.x;
        a1.y = ac.y + newP.y;

        a2.x = ac.x - newP.x;
        a2.y = ac.y - newP.y;
    }

    static Draw_Sample_LineBox(picBox, Lpat, ScrData) {
        let w = picBox.width;
        let h = picBox.height;
        let g = picBox.getContext('2d');
        g.fillStyle = "rgb(255, 255, 255)";
        g.fillRect(0, 0, w, h);
        ScrData.SampleBoxFlag = true;
        if (Lpat.BlankF == true) {
            let Font =  clsBase.Font();
            Font.Size = 13;
            clsDraw.print(g, "透明", new point(w / 2, h / 2), Font , enmHorizontalAlignment.Center, enmVerticalAlignment.Center, ScrData);
        } else {
            let p1 = new point(w * 0.1, h / 2);
            let p2 = new point(w * 0.9, h / 2);
            this.Line(g, Lpat, p1, p2, ScrData);
        }
    }
}

class clsDrawTile {

    static Draw_Poly_Inner(g, pxy, numPolyP,T) {
        if(T.BlankF==false){
            let Polydata = { Pon: numPolyP.length, pxy: pxy, nPolyP:numPolyP };
            clsDraw.DrawPolyPolygon(g, Polydata, T.Color.toRGBA())

        }
    }

    //角丸四角形
    static Draw_Tile_RoundBox(g, _BoundaryRect, Back, Kakudo, ScrData) {

        if ((Back.Tile.BlankF == true) && (Back.Line.BlankF == true)) {
            return;
        }
        let BoundaryRect=_BoundaryRect.Clone();
        if (Back.Padding != 0) {
            let w = ScrData.Get_Length_On_Screen(Back.Padding);
            BoundaryRect.inflate(w, w);
        }
        if (Back.Round == 0) {
            this.Draw_Tile_Box(g, BoundaryRect, Back.Line, Back.Tile, Kakudo,  ScrData);
            return;
        }
        let RoundR = ScrData.Get_Length_On_Screen(Back.Round);
        let pxy1 = spatial.Get_Fan_Coordinates(new point(BoundaryRect.left + RoundR, BoundaryRect.top + RoundR), RoundR, Math.PI * 2 * 3 / 4, Math.PI * 2, false);
        let pxy2 = spatial.Get_Fan_Coordinates(new point(BoundaryRect.right - RoundR, BoundaryRect.top + RoundR), RoundR, 0, Math.PI * 2 / 4, false);
        let pxy3 = spatial.Get_Fan_Coordinates(new point(BoundaryRect.right - RoundR, BoundaryRect.bottom - RoundR), RoundR, Math.PI * 2 / 4, Math.PI, false);
        let pxy4 = spatial.Get_Fan_Coordinates(new point(BoundaryRect.left + RoundR, BoundaryRect.bottom - RoundR), RoundR, Math.PI, Math.PI * 2 * 3 / 4, false);
        let cn = pxy1.length + pxy2.length + pxy3.length + pxy4.length + 1;
        let pxy = pxy1.concat();
        Array.prototype.push.apply(pxy, pxy2);
        Array.prototype.push.apply(pxy, pxy3);
        Array.prototype.push.apply(pxy, pxy4);
        pxy.push(pxy[0]);
        if (Kakudo != 0) {
            let cp = BoundaryRect.centerP();
            for (let i = 0; i < cn; i++) {
                pxy[i] = spatial.Trans2D(cp, pxy[i], -Kakudo);
            }
        }

        if (Back.Tile.BlankF == false) {
            let Polydata = { Pon: 1, pxy: pxy, nPolyP: [pxy.length] };
            clsDraw.DrawPolyPolygon(g, Polydata, Back.Tile.Color.toRGBA());
        }
        if (Back.Line.BlankF == false) {
            clsDrawLine.Line(g, Back.Line, pxy, ScrData);
        }
    }

    //タイル四角形描画
    static Draw_Tile_Box(g, BoundaryRect, L, T, Kakudo, ScrData) {
        let pxy = spatial.Get_TurnedRectangle(BoundaryRect, Kakudo);
        if (T.BlankF == false) {
            let Polydata = { Pon: 1, pxy: pxy, nPolyP: [pxy.length] };
            clsDraw.DrawPolyPolygon(g, Polydata, T.Color.toRGBA());
        }
        if (L.BlankF == false) {
            clsDrawLine.Line(g, L, pxy, ScrData);
        }
    }

    //サンプル背景フレーム表示
    static Darw_Sample_BackGroundBox(picBox, BG, ScrData) {
        let w = picBox.width;
        let h = picBox.height;
        let rect = new rectangle(new point(2, 2),new size( w - 4, h - 4));
        let g = picBox.getContext('2d');
        g.fillStyle = "rgb(255, 255, 255)";
        g.fillRect(0, 0, w, h);
        if (BG.Padding != 0) {
            const wp = ScrData.Get_Length_On_Screen(BG.Padding);
            rect.inflate(-wp, -wp);
        }
        ScrData.SampleBoxFlag = true;
        if (BG.Tile.BlankF == true) {
            let Font = clsBase.Font();
            Font.Size = 13;
            clsDraw.print(g, "透明", new point(w / 2, h / 2), Font, enmHorizontalAlignment.Center, enmVerticalAlignment.Center, ScrData);
        }

        clsDrawTile.Draw_Tile_RoundBox(g, rect, BG, 0, ScrData);
    }
}

class clsDrawMarkFan {
    static init() {
        let mark_info = function () {
            this.name;
            this.stac;
        }
        //'最初の数値：記号内の要素の数
        //'要素の内訳
        //'単独円0、ポリゴン1、線2
        //'単独円の場合:X/Y/xR/yR/塗りつぶし1空白0
        //'ポリゴンの場合:ポリゴン数/ポリゴン１の座標数n/X1/Y1/････ポリゴン１の座標数nを-1にすると、多角形近似の円となり、後ろのパラメータは:X/Y/xR/yR
        //'線の場合：座標数/X1/Y1/・・・

        let sr = [];
        sr.push('丸,1,0,0,0,100,100,1,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('四角,1,1,1,5,-100,-100,100,-100,100,100,-100,100,-100,-100,,,,,,,,,,,,,,,,');
        sr.push('菱形,1,1,1,5,0,-100,-100,0,0,100,100,0,0,-100,,,,,,,,,,,,,,,,');
        sr.push('三角1,1,1,1,4,0,-100,-100,100,100,100,0,-100,,,,,,,,,,,,,,,,,,');
        sr.push('三角２,1,1,1,4,0,100,-100,-100,100,-100,0,100,,,,,,,,,,,,,,,,,,');
        sr.push('星,1,1,1,11,0,-100,-20,-20,-100,-20,-30,20,-50,100,0,50,50,100,30,20,100,-20,20,-20,0,-100,,,,');
        sr.push('バツ,1,1,1,13,-70,-100,0,-30,70,-100,100,-70,30,0,100,70,70,100,0,30,-70,100,-100,70,-30,0,-100,-70,-70,-100');
        sr.push('方位1,2,2,4,20,0,-20,-50,0,-100,0,100,2,2,40,20,-40,20,,,,,,,,,,,,,');
        sr.push('方位2,2,2,4,-20,0,20,-50,0,-100,0,100,2,2,40,20,-40,20,,,,,,,,,,,,,');
        sr.push('方位3,3,2,2,0,100,0,-100,2,2,40,20,-40,20,1,1,4,0,-100,-20,-60,20,-60,0,-100,,,,,,');
        sr.push('方位4,2,0,0,0,100,100,0,1,1,4,0,-100,34,94,-34,94,0,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('方位5,2,0,0,0,100,100,0,1,1,5,0,-100,34.2,94,0,70,-34.2,94,0,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('方位6,3,0,0,0,100,100,0,1,1,4,0,-100,25,0,-25,0,0,-100,2,3,25,0,0,100,-25,0,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('方位7,14,1,1,5,0,100,0,-100,20,-20,-20,20,0,100,1,1,5,-100,0,-20,-20,20,20,100,0,-100,0,2,2,0,-100,-20,-20,2,2,0,100,20,20,2,2,-100,0,-20,20,2,2,100,0,20,-20,1,1,4,-60,-60,-16,-35,-20,-20,-60,-60,2,2,-60,-60,-35,-16,1,1,4,60,-60,35,-16,20,-20,60,-60,2,2,60,-60,16,-35,1,1,4,60,60,16,35,20,20,60,60,2,2,60,60,35,16,1,1,4,-60,60,-35,16,-20,20,-60,60,2,2,-60,60,-16,35');
        sr.push('矢印1,1,1,1,8,0,-100,50,-50,25,-50,25,100,-25,100,-25,-50,-50,-50,0,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('矢印2,1,1,1,8,0,-100,70,0,25,0,25,100,-25,100,-25,0,-70,0,0,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('矢印3,1,1,1,5,0,-100,75,100,0,50,-75,100,0,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('田,1,1,2,5,-70,-100,-50,-100,-50,100,-70,100,-70,-100,5,70,-100,50,-100,50,100,70,100,70,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('畑,1,1,1,6,-100,-70,-80,-80,0,40,80,-80,100,-70,0,80,-100,-70,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('果樹園,2,1,1,5,-10,-90,10,-90,10,-30,-10,-30,-10,-90,1,2,-1,0,30,70,70,-1,0,30,50,50,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('桑畑,1,1,1,12,-60,-80,-45,-95,0,-50,45,-95,60,-80,10,-30,10,80,50,80,50,100,-10,100,-10,-30,-60,-80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('茶畑,3,0,0,-70,20,20,1,0,-70,60,20,20,1,0,70,60,20,20,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('その他の樹木畑,1,0,0,0,50,50,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('広葉樹林,2,1,1,5,-20,70,100,70,100,90,-20,90,-20,70,1,2,-1,-20,10,80,80,-1,-20,10,60,60,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('針葉樹林,1,1,1,11,-100,90,-20,-100,60,70,100,70,100,90,0,90,0,70,40,70,-20,-50,-80,90,-100,90,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('はいまつ地,1,1,1,10,10,-80,10,45,60,-10,70,0,0,80,-80,0,-60,-10,-10,45,-10,-80,10,-80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('竹林,1,1,3,5,-40,-80,-70,-30,-85,-40,-55,-90,-40,-80,5,40,-80,70,-30,85,-40,55,-90,40,-80,7,10,-80,10,70,50,70,50,90,-10,90,-10,-80,10,-80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('しの地,1,1,3,5,-40,-80,-70,-30,-85,-40,-55,-90,-40,-80,5,40,-80,70,-30,85,-40,55,-90,40,-80,5,10,-50,10,80,-10,80,-10,-50,10,-50,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('荒れ地,1,1,3,5,-10,-100,10,-100,10,100,-10,100,-10,-100,5,-70,0,-50,0,-50,100,-70,100,-70,0,5,70,0,50,0,50,100,70,100,70,0,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('市役所,1,1,4,-1,0,0,100,100,-1,0,0,85,85,-1,0,0,70,70,-1,0,0,60,60,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('官公署,2,1,3,5,-50,-80,-30,-80,-30,-50,-50,-50,-50,-80,5,50,-80,30,-80,30,-50,50,-50,50,-80,5,10,-100,10,-30,-10,-30,-10,-100,10,-100,1,2,-1,0,30,70,70,-1,0,30,50,50,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('裁判所,1,1,2,8,0,-100,60,20,10,20,10,100,-10,100,-10,20,-60,20,0,-100,4,0,-60,-25,0,25,0,0,-60,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('税務署,1,1,2,11,10,-100,10,-60,100,0,10,60,10,100,-10,100,-10,60,-100,0,-10,-60,-10,-100,10,-100,5,0,-45,-70,0,0,45,70,0,0,-45,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('警察署,2,1,1,13,-55,-70,0,-14,55,-70,70,-55,14,0,70,55,55,70,0,14,-55,70,-70,55,-14,0,-70,-55,-55,-70,1,2,-1,0,0,100,100,-1,0,0,80,80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('交番,1,1,1,13,0,-19,50,-100,65,-90,12,0,65,90,50,100,0,19,-50,100,-65,90,-12,0,-65,-90,-50,-100,0,-19,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('消防署,1,1,1,28,0,-20,-10,-21,-30,-40,-45,-60,-55,-80,-60,-100,-80,-100,-77,-80,-68,-60,-58,-40,-45,-20,-30,-7,-10,0,-10,100,10,100,10,0,30,-7,45,-20,58,-40,68,-60,77,-80,80,-100,60,-100,55,-80,45,-60,30,-40,10,-21,0,-20,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('保健所,1,1,3,-1,0,0,100,100,-1,0,0,90,90,13,10,-70,10,-10,70,-10,70,10,10,10,10,70,-10,70,-10,10,-70,10,-70,-10,-10,-10,-10,-70,10,-70,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('郵便局,1,1,4,-1,0,0,80,80,-1,0,0,100,100,5,-40,-60,40,-60,40,-40,-40,-40,-40,-60,9,-60,-20,60,-20,60,0,10,0,10,70,-10,70,-10,0,-60,0,-60,-20,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('工場,2,1,8,5,-10,-100,10,-100,10,-60,-10,-60,-10,-100,5,-10,100,10,100,10,60,-10,60,-10,100,5,-60,-75,-30,-45,-45,-30,-75,-60,-60,-75,5,-60,75,-30,45,-45,30,-75,60,-60,75,5,60,-75,30,-45,45,-30,75,-60,60,-75,5,60,75,30,45,45,30,75,60,60,75,5,60,-10,100,-10,100,10,60,10,60,-10,5,-60,-10,-100,-10,-100,10,-60,10,-60,-10,1,2,-1,0,0,70,70,-1,0,0,50,50,,,,,,,,');
        sr.push('発電所・変電所,2,1,8,5,-60,-75,-20,-35,-35,-20,-75,-60,-60,-75,5,60,-75,20,-35,35,-20,75,-60,60,-75,5,60,75,20,35,35,20,75,60,60,75,5,-60,75,-20,35,-35,20,-75,60,-60,75,7,100,-100,100,10,40,10,40,-10,80,-10,80,-100,100,-100,7,-100,100,-100,-10,-40,-10,-40,10,-80,10,-80,100,-100,100,5,10,-100,10,-40,-10,-40,-10,-100,10,-100,5,10,100,10,40,-10,40,-10,100,10,100,1,2,-1,0,0,50,50,-1,0,0,30,30');
        sr.push('小・中学校,1,1,2,4,-22,-20,0,2,22,-20,-22,-20, 18,10,-60,10,-40,60,-40,60,-20,50,-20,13,17,45,50,30,60,0,33,-30,60,-45,50,-13,17,-50,-20,-60,-20,-60,-40,-10,-40,-10,-60,10,-60,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('高等学校,1,1,4,4,-22,-20,0,2,22,-20,-22,-20,18,10,-60,10,-40,60,-40,60,-20,50,-20,13,17,45,50,30,60,0,33,-30,60,-45,50,-13,17,-50,-20,-60,-20,-60,-40,-10,-40,-10,-60,10,-60,-1,0,0,100,100,-1,0,0,80,80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('病院,1,1,3,13,10,-70,10,-30,60,-30,60,-10,10,-10,10,70,-10,70,-10,-10,-60,-10,-60,-30,-10,-30,-10,-70,10,-70,6,90,-100,90,50,0,100,-90,50,-90,-100,90,-100,6,80,-90,-80,-90,-80,45,0,90,80,45,80,-90,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('神社,1,1,2,13,100,-80,100,-60,60,-60,60,80,40,80,40,0,-40,0,-40,80,-60,80,-60,-60,-100,-60,-100,-80,100,-80,5,-40,-60,-40,-20,40,-20,40,-60,-40,-60,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('寺院,1,1,1,21,100,-100,100,10,10,10,10,80,100,80,100,100,-10,100,-10,10,-80,10,-80,100,-100,100,-100,-10,-10,-10,-10,-80,-100,-80,-100,-100,10,-100,10,-10,80,-10,80,-100,100,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('記念碑,1,1,2,9,0,-90,20,-70,20,80,80,80,80,90,-70,90,-70,-70,-50,-90,0,-90,7,10,80,-60,80,-60,-65,-45,-80,-5,-80,10,-65,10,80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('煙突,1,1,5,5,50,-100,50,-90,0,-90,0,-100,50,-100,5,30,-70,30,-60,-20,-60,-20,-70,30,-70,5,10,-40,10,-30,-40,-30,-40,-40,10,-40,7,-50,-10,-10,-10,-10,90,50,90,50,100,-50,100,-50,-10,5,-20,90,-40,90,-40,0,-20,0,-20,90,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('電波塔,2,1,1,14,90,-100,70,-70,50,-100,30,-70,2,-100,-5,-100,-5,5,5,5,5,-80,30,-50,50,-80,70,-50,95,-90,90,-100,1,2,-1,0,50,50,50,-1,0,50,40,40,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('油井・ガス田,1,1,2,5,50,-50,-50,-50,-50,50,50,50,50,-50, 28,60,-100,60,-60,100,-60,100,-50,60,-50,60,50,100,50,100,60,60,60,60,100,50,100,50,60,-50,50,-50,100,-60,100,-60,60,-100,60,-100,50,-60,50,-60,-50,-100,-50,-100,-60,-60,-60,-60,-100,-50,-100,-50,-60,50,-60,50,-100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('灯台,3,1,8,5,-10,-100,10,-100,10,-60,-10,-60,-10,-100,5,-10,100,10,100,10,60,-10,60,-10,100,5,-60,-75,-30,-45,-45,-30,-75,-60,-60,-75,5,-60,75,-30,45,-45,30,-75,60,-60,75,5,60,-75,30,-45,45,-30,75,-60,60,-75,5,60,75,30,45,45,30,75,60,60,75,5,60,-10,100,-10,100,10,60,10,60,-10,5,-60,-10,-100,-10,-100,10,-60,10,-60,-10,1,2,-1,0,0,70,70,-1,0,0,50,50,0,0,0,20,20,1,,,,,,,,,,,,,,,,,,');
        sr.push('城跡,1,1,1,17,-80,100,-80,-20,-40,-20,-40,-100,40,-100,40,-20,80,-20,80,100,70,100,70,-10,30,-10,30,-90,-30,-90,-30,-10,-70,-10,-70,100,-80,100,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('史跡・名称・天然記念物,3,0,0,-70,30,30,1,0,-70,60,30,30,1,0,70,60,30,30,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('墓地,1,1,1,9,70,90,70,100,-70,100,-70,90,-5,90,-5,-100,5,-100,5,90,70,90,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('温泉,1,1,4,5,5,-100,5,50,-5,50,-5,-100,5,-100,5,40,-50,50,-50,50,50,40,50,40,-50,5,-40,-50,-50,-50,-50,50,-40,50,-40,-50,45,0,90,-20,87,-30,85,-50,78,-70,65,-85,50,-90,30,-85,10,-70,0,-50,-10,-50,-20,-70,-10,-80,-6,-90,4,-97,20,-100,30,-97,40,-90,57,-70,80,-50,87,-30,95,-20,98,0,100,20,98,30,95,50,87,70,80,90,57,97,40,100,30,97,20,90,4,80,-6,70,-10,50,-20,50,-10,70,0,85,10,90,30,85,50,70,65,50,78,30,85,20,87,0,90');
        sr.push('滝,3,1,1,5,-100,-50,100,-50,100,-30,-100,-30,-100,-50,0,40,20,20,20,1,0,-40,20,20,20,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('三角点,2,0,0,20,10,10,1,1,2,4,0,-80,100,90,-100,90,0,-80,4,0,-57,-80,80,80,80,0,-57,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('水準点,2,0,0,0,10,10,1,1,2,5,90,90,-90,90,-90,-90,90,-90,90,90,5,80,80,80,-80,-80,-80,-80,80,80,80,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('楕円横,1,0,0,0,100,60,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        sr.push('楕円縦,1,0,0,0,60,100,1,,,,,,,');
        sr.push('平行四辺形,1,1,1,5,-100,70,60,70,100,-70,-60,-70,-100,70');
        sr.push('五角形,1,1,1,6,0,-100,95.1,-30.9,58.8,80.9,-58.8,80.9,-95.1,-30.9,0,-100');
        sr.push('六角形,1,1,1,7,100,0,50,86.6,-50,86.6,-100,0,-50,-86.6,50,-86.6,100,0');

        this.mShape = [];
        for (let i = 0; i < sr.length;i++) {
            let Mark_XY_Split = sr[i].split(",");
            let d = new mark_info();
            d.name = Mark_XY_Split[0];
            d.stac = [];
            for (let j = 1; j < Mark_XY_Split.length; j++) {
                if (Mark_XY_Split[j] != "") {
                    d.stac.push(Number(Mark_XY_Split[j]));                
                }
            }
            this.mShape.push(d);
        }
    }

    static getMarkShameNum() {
        let n = this.mShape.length;
        return n;
    }

    static Mark_Print(g, Position, r, Mark, ScrData) {
        switch (Mark.PrintMark) {
            case enmMarkPrintType.Mark: {
                clsDrawTile.Draw_Tile_RoundBox(g, spatial.Get_Rectangle(Position, r), Mark.WordFont.Back, Mark.WordFont.Kakudo, ScrData);
                let mkn = 0;
                let mk = this.mShape[Mark.ShapeNumber];
                let mk_fign = mk.stac[0];
                let n = 1;
                let pdaen = 0;
                do {
                    let Shape = mk.stac[n];
                    n++;
                    switch (Shape) {
                        case 0: {
                            let Circle_Tile;
                            if (mk.stac[n + 4] == 1) {
                                Circle_Tile = Mark.Tile;
                            } else {
                                Circle_Tile = clsBase.Tile();
                                Circle_Tile.BlankF = true;
                            }
                            let P2 = Position.Clone();
                            P2.offset(mk.stac[n] * r / 100, mk.stac[n + 1] * r / 100);
                            this.Draw_DAEN(g, P2, mk.stac[n + 2] * r / 100, mk.stac[n + 3] * r / 100, Mark.WordFont.Kakudo, Mark.Line, Circle_Tile, true, ScrData)
                            n += 5;
                            break;
                        }
                        case 1: {//ポリゴン
                            let poln = mk.stac[n];
                            n++;
                            let pxy = [];
                            let nPolyP = [];
                            for (let j = 0; j < poln; j++) {
                                let ln = mk.stac[n];
                                let ln2 = 0;
                                n++;
                                if (ln == -1) { //円の場合
                                    let P2 = Position.Clone();
                                    P2.offset(mk.stac[n] * r / 100, mk.stac[n + 1] * r / 100);
                                    let en_xy = this.Get_DAEN_Peri_XY(P2, r * mk.stac[n + 2] / 100, r * mk.stac[n + 3] / 100, Mark.WordFont.Kakudo, ScrData);
                                    n += 4;
                                    if ((pdaen % 2) == 1) { //内部円の場合は反転する（中抜けポリゴン）
                                        en_xy.reverse();
                                    }
                                    pdaen++;
                                    if (en_xy != undefined) {
                                        for (let i = 0; i < en_xy.length; i++) {
                                            pxy.push(en_xy[i]);
                                        }
                                        ln2 = en_xy.length;
                                    }
                                } else {  //通常の多角形
                                    for (let i = 0; i < ln; i++) {
                                        let p = new point(r * mk.stac[n], r * mk.stac[n + 1]);
                                        p = spatial.Trans2D(p, -Mark.WordFont.Kakudo);
                                        p.x = p.x / 100 + Position.x;
                                        p.y = p.y / 100 + Position.y;
                                        pxy.push(  p);
                                        n += 2
                                    }
                                    ln2 = ln;
                                }
                                nPolyP[j] = ln2;
                            }
                            clsDraw.Draw_Tile_and_Paint_and_Line(g, pxy, nPolyP, poln, Mark.Tile, Mark.Line, ScrData);
                            break;
                        }
                        case 2: {
                            let ln = mk.stac[n];
                            n++;
                            let pxy = [];
                            for (let i = 0; i < ln; i++) {
                                let p = new point(r * mk.stac[n], r * mk.stac[n + 1]);
                                p = spatial.Trans2D(p, -Mark.WordFont.Kakudo);
                                p.x = p.x / 100 + Position.x;
                                p.y = p.y / 100 + Position.y;
                                pxy.push(p);
                                n += 2;
                            }
                            clsDrawLine.Line(g, Mark.Line,  pxy, ScrData);
                            break;
                        }
                    }
                    mkn++;
                } while (mkn < mk_fign)
                break;
            }
            case enmMarkPrintType.Word: {
                let W_Font = Mark.WordFont.Clone();
                if (r == 0) { r = 1 }
                if (ScrData.SampleBoxFlag == false) {
                    W_Font.Size = ScrData.Get_Length_On_BaseMap(r * 2);
                } else {
                    W_Font.Size = r * 2;
                }
                clsDraw.print(g, Mark.wordmark, Position, W_Font, enmHorizontalAlignment.Center, enmVerticalAlignment.Center, ScrData);
                break;
            }
        }
    }


    static Draw_DAEN(g, Position, XR, YR, Kakudo, L, T, Real_Circle_F, ScrData) {
        if ((XR == 0) || (YR == 0)) { return }

        let inf;
        if ((XR == YR) && (Real_Circle_F == true)) {
            //楕円が真円で内部がベタ塗りか空白、線が実線または透明の場合
            let C_Rect = new rectangle(new point(Position.x - XR, Position.y - YR), new size(XR * 2, YR * 2));

            if (ScrData.SampleBoxFlag == false) {
                if (spatial.Compare_Two_Rectangle_Position_turned(C_Rect, Kakudo, ScrData.MapScreen_Scale) == cstRectangle_Cross.cstOuter) {
                    return false;
                }
            }

            let w = ScrData.Get_Line_Width(L.Width);
            let incol = T.Color.toRGBA();
            let linecol = L.Color.toRGBA();
            if (T.BlankF == true) {
                incol = undefined;
            }
            if (L.BlankF == true) {
                linecol = undefined;
            }
            clsDraw.Ellipse(g, Position, XR, incol, linecol, w);
            inf = true;
        } else {
            //円の周の座標を計算する必要あり.
            let pxy = this.Get_DAEN_Peri_XY(Position, XR, YR, Kakudo, ScrData);
            if (pxy != undefined) {
                let nPolyn = [pxy.length];
                clsDraw.Draw_Tile_and_Paint_and_Line(g, pxy, nPolyn, 1, T, L, ScrData);
                inf = true;
            }
        }
        return inf;
    }

    static Get_DAEN_Peri_XY(Position ,  XR ,  YR , Kakudo ,  ScrData) {
        let ST = 1 / ((XR + YR) / 5);
        let pxy = [];
        let n = 0;
        let ff = false;
        do {
            let ST2 = n * ST;
            let point2 = new point(Math.cos(ST2) * XR, Math.sin(ST2) * YR);
            point2 = spatial.Trans2D(point2, Kakudo);
            point2.y=-point2.y;
            point2.offset(Position.x,  Position.y);
            pxy.push( point2);
            let f = false;
            if (ScrData.SampleBoxFlag == false) {
                if (Generic.Check_Point_in_screen(pxy[n], ScrData, 1) == true) {
                    f = true;
                }
            } else {
                f = true;
            }
            if (f == true) {
                ff = true;
            }
            n++;
        } while (n * ST < Math.PI * 2)
        pxy.push(pxy[0].Clone());
        if (ff == true) {
            return pxy;
        } else {
            return undefined;
        }
    }

    static Draw_Mark_Sample_Box(picMarkBox, MK, ScrData) {
        let w = picMarkBox.width;
        let h = picMarkBox.height;
        let g = picMarkBox.getContext('2d');
        g.fillStyle = "rgb(255, 255, 255)";
        g.fillRect(0, 0, w, h);
        this.Mark_Print(g, new point(w / 2, h / 2), Math.min(w, h) * 0.4, MK, ScrData);
    }

    static Draw_Fan(g, centerP, r, start_p, end_p, Lpat, Tile, ScrData) {

        let w = ScrData.Get_Line_Width(Lpat.Width);
        let InnerColor = Tile.Color.toRGBA();
        let BorderColor = Lpat.Color.toRGBA();
        if (Tile.BlankF == true) {
            incol = undefined;
        }
        if (Lpat.BlankF == true) {
            linecol = undefined;
        }
        start_p -= 2 * Math.PI / 4;
        end_p -= 2 * Math.PI / 4;
        g.beginPath();
        g.moveTo(centerP.x, centerP.y);
        g.arc(centerP.x, centerP.y, r, start_p, end_p, false);
        g.closePath();
        if (InnerColor != undefined) {
            g.fillStyle = InnerColor;
            g.fill();
        }
        if (BorderColor != undefined) {
            g.strokeStyle = BorderColor;
            g.lineWidth = w;
            g.stroke();
        }
    }
}

class clsSpline {
    static Spline_Get(Ls, ln, Line_XY, stp, ScrData) {

        if (ln == 2) {
            let p = [];
            p[0] = ScrData.Get_SxSy_With_3D(Line_XY[0]);
            p[1] = ScrData.Get_SxSy_With_3D(Line_XY[1]);
            return p;
        }

        let lpf = false;
        if ((Line_XY[Ls].x == Line_XY[Ls + ln - 1].x) && (Line_XY[Ls].y == Line_XY[Ls + ln - 1].y)) {
            lpf = true;
        }
        let clf;
        let SPP = [];
        if (lpf == true) {
            for (let k = 0; k < ln; k++) {
                SPP.push(Line_XY[Ls + k].Clone());
            }
            for (let k = 0; k <= 2; k++) {
                SPP.push(SPP[1 + k].Clone());
            }
            ln += 3
            clf = true;
        } else {
            for (let k = 0; k < ln; k++) {
                SPP.push(Line_XY[Ls + k].Clone());
            }
            clf = false;
        }
        let Maxpt = ln;
        let Kvalue = 3;
        let mxt = Maxpt - 1 - Kvalue + 2;

        let pxy = [];
        let fa;
        let fa2;
        let n = 0;
        if (clf == true) {
            fa = 1;
            fa2 = mxt - 1;
        } else {
            fa = 0;
            fa2 = mxt;
        }
        for (let spa = fa; spa <= fa2 + 0.0001; spa += stp) {
            if (spa < fa2) {
                let p = this.Spline_xy(spa, Kvalue, Maxpt, SPP);
                pxy[n] = ScrData.Get_SxSy_With_3D(p);
                n++;
            }
        }
        if (lpf == true) {
            if (pxy[n - 1].Equals(pxy[0]) == false) {
                pxy[n - 1] = pxy[0].Clone();
            }
        } else {
            pxy[n] = ScrData.Get_SxSy_With_3D(Line_XY[Ls + ln - 1]);
            n++;
        }
        pxy.length = n;
        return pxy;
    }

    static Spline_Get_Fill(Ls, ln, Line_XY, stp, ScrData) {

        let lpf;
        if (Line_XY[Ls].Equals(Line_XY(Ls + ln - 1)) == true) {
            lpf = true;
        }

        let SPP = [];
        for (let k = 0; k < ln; k++) {
            SPP[k] = Line_XY[Ls + k].Clone();
        }
        if (lpf == false) {
            for (let k = 0; k <= 3; k++) {
                SPP.push(SPP[k].Clone());
            }
            ln += 4;
        } else {
            for (let k = 0; k <= 2; k++) {
                SPP.push(SPP[1 + k].Clone());
            }
            ln += 3;
        }
        let clf = true;

        let Maxpt = ln;
        let Kvalue = 3;
        let mxt = Maxpt - 1 - Kvalue + 2;
        let ln2 = parseInt(mxt / 0.1) + 2;

        let pxy = [];
        let n = 0;
        let fa;
        let fa2;
        if (clf == true) {
            fa = 1;
            fa2 = mxt - 1;
        } else {
            fa = 0;
            fa2 = mxt;
        }
        for (let spa = fa; spa <= fa2 + 0.0001; spa += stp) {
            if (spa < fa2) {
                let p = this.Spline_xy(spa, Kvalue, Maxpt, SPP);
                pxy[n] = ScrData.Get_SxSy_With_3D(p);
                n++;
            }
        }
        if (pxy[n - 1].Equals(pxy[0]) == false) {
            pxy[n - 1] = pxy[0].Clone();
        }
        ln = n;
        return pxy;
    }

    static Spline_xy(T, Kvalue, Maxpt, pt) {
        let P = new point();

        let z = Maxpt - 1;
        let Value = 0;
        let ST = parseInt(T) - 2;
        let ET = parseInt(T) + 2;
        if (ST < 0) ST = 0;
        if (ET > z) ET = z;
        for (let i = ST; i <= ET; i++) {
            let Q = this.Blend(i, Kvalue, T, Kvalue, z);
            Value += pt[i].x * Q;
        }
        P.x = Value;

        Value = 0;
        for (let i = ST; i <= ET; i++) {
            Value += pt[i].y * this.Blend(i, Kvalue, T, Kvalue, z);
        }
        P.y = Value;

        return P;
    }

    static Blend(i, k, T, Kvalue, Maxpt) {

        if (k == 1) {
            if ((this.Knot(i, Kvalue, Maxpt) <= T) && (T < this.Knot(i + 1, Kvalue, Maxpt))) {
                return 1;
            } else if ((T == (Maxpt - Kvalue + 2)) && (this.Knot(i, Kvalue, Maxpt) <= T) && (T <= this.Knot(i + 1, Kvalue, Maxpt))) {
                return 1;
            } else {
                return 0;
            }
        }

        let Number;
        let value1;
        let denom = this.Knot(i + k - 1, Kvalue, Maxpt) - this.Knot(i, Kvalue, Maxpt);
        if (denom == 0) {
            value1 = 0;
        } else {
            Number = (T - this.Knot(i, Kvalue, Maxpt)) * this.Blend(i, k - 1, T, Kvalue, Maxpt);
            value1 = Number / denom;
        }

        let value2;
        denom = this.Knot(i + k, Kvalue, Maxpt) - this.Knot(i + 1, Kvalue, Maxpt);
        if (denom == 0) {
            value2 = 0;
        } else {
            Number = (this.Knot(i + k, Kvalue, Maxpt) - T) * this.Blend(i + 1, k - 1, T, Kvalue, Maxpt);
            value2 = Number / denom;
        }
        return value1 + value2;
    }

    static Knot(i, Kvalue, Maxpt) {
        if (i < Kvalue) {
            return 0
        } else if (i <= Maxpt) {
            return i - Kvalue + 1;
        } else {
            return Maxpt - Kvalue + 2;
        }
    }
}


var clsTileMap=function() {

    let xhr=[];
    let TileMapData = setTileMapData();
    let LicenseFontData=clsBase.Font();
    LicenseFontData.Size = 2.5;
    LicenseFontData.Back=clsBase.WhiteBackground();

    /** BackImageSpeed:速度1-6 afterDrawFunction:描画終了後に実行する関数*/
    this.drawTileMap=function(g, TileMap, MapZahyo, ScrData, BackImageSpeed,afterDrawFunction) {
        if(xhr.length>0){
            for(let i in xhr){
                xhr[i].abort();
            }
        }
        xhr=[];
        let iRect = ScrData.ScrRectangle.Clone();

        let ScrLatLonBox = new latlonbox();
        let p = spatial.Get_Reverse_XY(new point(iRect.left, iRect.top), MapZahyo);
        ScrLatLonBox.NorthWest = spatial.Get_World_IdoKedo(p, MapZahyo);
        let p2 = spatial.Get_Reverse_XY(new point(iRect.right, iRect.bottom), MapZahyo);
        ScrLatLonBox.SouthEast = spatial.Get_World_IdoKedo(p2, MapZahyo);

        if (ScrLatLonBox.NorthWest.Latitude > 85) {
            ScrLatLonBox.NorthWest.Latitude = 85;
        }
        if (ScrLatLonBox.SouthEast.Latitude < -85) {
            ScrLatLonBox.SouthEast.Latitude = -85;
        }

        let ZoomMin = TileMap.opt.minZoom;
        let ZoomMax = TileMap.opt.maxNativeZoom;
        let g_num;

        let z = ZoomMax;
        do {
            g_num = this.Get_TileMap_Image_Number(z, ScrLatLonBox);
            z--;
        } while ((g_num >= BackImageSpeed * 10) && (z >= ZoomMin))
        if ((z + 1 < ZoomMin) || (g_num >= BackImageSpeed * 10)) {
            //MsgBox("背景画像を表示するにはさらに拡大してください。", MsgBoxStyle.Exclamation)
            return false;
        }
        let ZoomLevel = z + 1;
        let tileList_Data = this.Get_TileMap_Image(TileMap, ZoomLevel, ScrLatLonBox, MapZahyo, ScrData);
        let numofTile = tileList_Data.length;
        let getTileNum=0;
        for (let i = 0; i < numofTile; i++) {
            let d = tileList_Data[i];
            request(d.URL, d.ScrPosition);
        }

        return true;

        function request(url, destRect) {
            let n = xhr.length;
            xhr[n] = new XMLHttpRequest();
            xhr[n].open('GET', url, true);
            xhr[n].responseType = "blob";
            xhr[n].onerror = function () {
                getTileNum++;
                if (getTileNum == numofTile) {
                    if (typeof afterDrawFunction == 'function') {
                        afterDrawFunction();
                    }
                }
    }
            xhr[n].onload = function () {
                if (xhr[n].status == 200) {
                    let oURL = URL.createObjectURL(this.response);
                    let image = new Image();
                    image.src = oURL;
                    image.onload = function () {
                        URL.revokeObjectURL(oURL);
                        g.drawImage(image, 0, 0, 256, 256, destRect.left, destRect.top, destRect.width(), destRect.height());
                        getTileNum++;
                        if (getTileNum == numofTile) {
                            if (typeof afterDrawFunction == 'function') {
                                afterDrawFunction();
                            }
                        }
                    };
                }else if (xhr[n].status == 404) {
                    getTileNum++;
                    if (getTileNum == numofTile) {
                        if (typeof afterDrawFunction == 'function') {
                            afterDrawFunction();
                        }
                    }

                }
            };
            try {
                xhr[n].send(null);
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    /**ライセンスフォントを設定 */
    this.setLicenceFont=function(fnt){
        LicenseFontData = fnt;
    }

    this.getLicenceFont=function(){
        return LicenseFontData;
    }

    /**既存タイルマップデータをキーで取得 */
    this.getTileMapData=function(dataName){
        return TileMapData[dataName];
    }

    /**既存タイルマップデータをIDで取得 */
    this.getTileMapDataById = function (id) {
        for (let i in TileMapData) {
            if (TileMapData[i].opt.id == id) {
                return TileMapData[i];
            }
        }
        return undefined;
    }
    

    /**既存タイルマップの中のタグの一覧を取得 */
    this.getTileMapTagList=function(){
        let tag=[];
        for(let i in TileMapData){
            tag.push(TileMapData[i].opt.tag);
        }
        return Generic.getArrayContentsList(tag);
    }

    /**指定のタグに一致するタイルマップ一覧を取得 */
    this.getTileMapListByTag=function(tag){
        let tiles=[];
        for(let i in TileMapData){
            if(TileMapData[i].opt.tag==tag){
                tiles.push(TileMapData[i])
            };
        }
        return tiles;
    }

    /**  解像度と緯度経度範囲で、必要なタイルマップ数を求める*/
    this. Get_TileMap_Image_Number=function(ZoomLevel, ScrLatLonBox) {

        let StartP = this.Get_TileMap_Image_Code(ZoomLevel, ScrLatLonBox.NorthWest);
        let EndP = this.Get_TileMap_Image_Code(ZoomLevel, ScrLatLonBox.SouthEast);

        let w;
        if (StartP.x > EndP.x) {
            w = EndP.x + 2 ** ZoomLevel - StartP.x + 1
        } else {
            w = EndP.x - StartP.x + 1
        }
        let H = EndP.y - StartP.y + 1
        return parseInt(w) * parseInt(H);
    }

    /**緯度経度とズームレベルからタイルマップのXYを求める*/
    this.Get_TileMap_Image_Code=function(ZoomLevel, LatLon) {

        if ((LatLon.lat <= -90) || (90 <= LatLon.lat)) {
            LatLon.lat = Math.sign(LatLon.lat) * 89.9999
        }
        let TileXY = new point();
        TileXY.x = parseInt((LatLon.lon / 180 + 1) * 2 ** ZoomLevel / 2)
        TileXY.y = parseInt((-Math.log(Math.tan((45 + LatLon.lat / 2) * Math.PI / 180)) + Math.PI) * 2 ** ZoomLevel / (2 * Math.PI));
        return TileXY;
    }

    this. Get_TileMap_Image=function(TileMap, ZoomLevel, ScrLatLonBox,  MapZahyo, ScrData) {

        let FileNum = this.Get_TileMap_Image_Number(ZoomLevel, ScrLatLonBox);
        let StartP = this.Get_TileMap_Image_Code(ZoomLevel, ScrLatLonBox.NorthWest);
        let EndP = this.Get_TileMap_Image_Code(ZoomLevel, ScrLatLonBox.SouthEast);

        if (FileNum < 0) {
            //地図ファイルの投影法が変更されていた場合などにここになるケースがある
            return [];
        }
        let tileList_Data = [];
        for (let x = StartP.x; x <= EndP.x; x++) {
            for (let y = StartP.y; y <= EndP.y; y++) {
                let xx = x;
                let yy = y;
                let ox = xx;
                let retV = this.check_TileMap_XY(ZoomLevel, xx, yy);
                xx = retV.x;
                yy = retV.y;
                let ry;
                if (TileMap.ReverseF == true) {
                    ry = 2 ** ZoomLevel - yy - 1;
                } else {
                    ry = yy;
                }

                let d = new tileList_Data_Info();
                d.LatLonBox = this.Get_TileMap_IdoKedo(ZoomLevel, ox, yy);
                let NW = spatial.Get_ReverseWorld_IdoKedo(d.LatLonBox.NorthWest, MapZahyo);
                let SE = spatial.Get_ReverseWorld_IdoKedo(d.LatLonBox.SouthEast, MapZahyo);
                let NWpoint = ScrData.getSxSy(spatial.Get_Converted_XY(NW.toPoint(), MapZahyo));
                let SEpoint = ScrData.getSxSy(spatial.Get_Converted_XY(SE.toPoint(), MapZahyo));
                d.ScrPosition = new rectangle(NWpoint, new size(SEpoint.x - NWpoint.x, SEpoint.y - NWpoint.y));
                d.URL = TileMap.href;
                d.URL = d.URL.replace("{z}", String(ZoomLevel));
                d.URL = d.URL.replace("{x}", String(xx));
                d.URL = d.URL.replace("{y}", String(ry));
                tileList_Data.push(d);
            }
        }

        // let n = 0;
        // let hplus = EndP.y - StartP.y + 1;
        // for (let x = StartP.x; x <= EndP.x; x++) {
        //     for (let y = StartP.y; y <= EndP.y; y++) {
        //         if ((x != EndP.x) && (y != EndP.y)) {
        //             d = tileList_Data[n];
        //             d.ScrPosition.right = tileList_Data[n + hplus].ScrPosition.left ;
        //             let h = tileList_Data[n + 1].ScrPosition.top - d.ScrPosition.top;
        //             d.ScrPosition.width = w;
        //             d.ScrPosition.height = h;
        //         }
        //         n++;
        //     }
        // }

        return tileList_Data;
    }
    /**指定したZoomのタイルマップの緯度経度を求める*/
    this.Get_TileMap_IdoKedo=function(ZoomLevel, X, Y) {
        let nw = new latlon();
        nw.lon = (X / 2 ** ZoomLevel) * 360 - 180;
        let tx1 = (Y / 2 ** ZoomLevel) * 2 * Math.PI - Math.PI;
        nw.lat = 2 * Math.atan(Math.exp(-tx1)) * 180 / Math.PI - 90;

        let se = new latlon();
        se.lon = ((X + 1) / 2 ** ZoomLevel) * 360 - 180;
        let tx2 = ((Y + 1) / 2 ** ZoomLevel) * 2 * Math.PI - Math.PI;
        se.lat = 2 * Math.atan(Math.exp(-tx2)) * 180 / Math.PI - 90;
        let d = new latlonbox(nw,se);
        return d;
    }

    /**タイルマップのXYの値が外れていた場合に修正する*/
    this.check_TileMap_XY=function (ZoomLevel, X, Y){

        if (X < 0) {
            X = -X;
        }
        if (X > 2 ** ZoomLevel - 1) {
            X = X - 2 ** ZoomLevel;
        }
        if (Y < 0) {
            Y = 0;
        }
        if (Y > 2 ** ZoomLevel - 1) {
            Y = 2 ** ZoomLevel - 1;
        }
        return { x: X, y: Y };
    }
    /** 画面左下に著作権表示**/
    this. PrintCopyright=function(g,TileMap,ScrData) {
        let x = 5;
        let y = ScrData.MapScreen_Scale.bottom - 5;
        let tx=TileMap.copyright+chrLF+TileMap.opt.id;
        clsDraw.print(g, tx, new point(x, y), LicenseFontData, enmHorizontalAlignment.Left, enmVerticalAlignment.Bottom, ScrData);
    }

    /**既存タイルマップデータを設定 */
    function setTileMapData() {
        let gsitileref = "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>";

        let MapTypeArray = [];
        MapTypeArray['k_cj4'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
            info:'http://www.gsi.go.jp/common/000058211.pdf',
            copyright:'国土地理院',
            opt: { id: '地理院地図(標準地図)', minZoom: 2, maxNativeZoom: 18, attribution: gsitileref,tag:'国土地理院地図' }
          };
          MapTypeArray['pale'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
            info:'http://www.gsi.go.jp/common/000058211.pdf',
            copyright:'国土地理院',
            opt: { id: '淡色地図', minZoom: 2, maxNativeZoom: 18, attribution: gsitileref ,tag:'国土地理院地図'}
          };
          MapTypeArray['gsiEnglish'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png',
            copyright:'国土地理院',
            opt: { id: '地理院地図(English)', minZoom: 5, maxNativeZoom: 11, attribution: gsitileref,tag:'国土地理院地図' }
          };
          MapTypeArray['relief'] = {
            href: "https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png",
            copyright:'国土地理院',
            opt: {
              id: '色別標高図', minZoom: 5, maxNativeZoom: 15, attribution: gsitileref,tag:'国土地理院地図'
            }
          };
          MapTypeArray['hillshademap'] = {
            href: "https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png",
            copyright:'国土地理院',
            opt: {
              id: '陰影起伏図', minZoom: 5, maxNativeZoom: 15, attribution: gsitileref,tag:'国土地理院主題図'
            }
          };
          MapTypeArray['slopemap'] = {
            href: "https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png",
            copyright:'国土地理院',
            opt: {
              id: '傾斜量図', minZoom: 5, maxNativeZoom: 15, attribution: gsitileref,tag:'国土地理院主題図'
            }
          };
          MapTypeArray['whitemap'] = {
            href: "https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
            copyright:'国土地理院',
            opt: {
              id: '白地図', minZoom: 5, maxNativeZoom: 14, attribution: gsitileref,tag:'国土地理院地図'
            }
          };
      
          MapTypeArray['k_LCMFC01'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/lcmfc1/{z}/{x}/{y}.png',
            copyright:'国土地理院',
            opt: {
              info: "https://cyberjapandata.gsi.go.jp/legend/lcmfc1_legend.gif",
              id: '治水地形分類図初版', minZoom: 8, maxNativeZoom: 16, attribution: gsitileref,tag:'国土地理院主題図'
            }
        };
        MapTypeArray['k_LCMFC02'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/lcmfc2/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                info: "http://cyberjapandata.gsi.go.jp/legend/lcmfc2_legend.jpg",
                id: '治水地形分類図更新版', minZoom: 8, maxNativeZoom: 16, attribution: gsitileref, tag: '国土地理院主題図'
            }
        };
        MapTypeArray['k_afm'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/afm/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                info: "http://www.gsi.go.jp/common/000084060.pdf",
                id: '都市圏活断層図', minZoom: 8, maxNativeZoom: 16, attribution: gsitileref, tag: '国土地理院主題図'
            }
        };
        MapTypeArray['k_LCM25K'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/lcm25k/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                info: "http://cyberjapan.jp/legendminNativeZoomLCM_hanrei.png",
                id: '土地条件図初期整備版', minZoom: 8, maxNativeZoom: 16, attribution: gsitileref, tag: '国土地理院主題図'
            }
        };
        MapTypeArray['k_vlcd'] = { //火山土地条件図は桜島のみ
            href: 'https://cyberjapandata.gsi.go.jp/xyz/vlcd/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                info: "https://maps.gsi.go.jp/legend/l_vlcd_1skrj.jpg",
                id: '火山土地条件図', minZoom: 8, maxNativeZoom: 16, attribution: gsitileref, tag: '国土地理院主題図'
            }
        };

        MapTypeArray['k_did2015'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/did2015/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                info: "https://maps.gsi.go.jp/legend/l_vlcd_1skrj.jpg",
                id: '人口集中地区2015', minZoom: 8, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院主題図'
            }
        };


        MapTypeArray['k_ortho'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '地理院最新写真', minZoom: 8, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_ort_RIKU10'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/ort_riku10/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: { id: '写真1936', minZoom: 8, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_ort_USA10'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/ort_USA10/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: { id: '写真1945-50', minZoom: 8, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_ort_old10'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/ort_old10/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: { id: '写真1961-64', minZoom: 8, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_nlii1'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '写真1974-78', minZoom: 10, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_nlii2'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/gazo2/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '写真1979-83', minZoom: 10, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_nlii3'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/gazo3/{z}/{x}/{y}.jpg',
            opt: { id: '写真1984-87', minZoom: 10, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_nlii4'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/gazo4/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '写真1988-90', minZoom: 10, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院空中写真' }
        };
        MapTypeArray['k_toho1'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/toho1/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '震災直後画像', minZoom: 15, maxNativeZoom: 17, attribution: gsitileref, tag: '国土地理院東日本大震災' }
        };
        MapTypeArray['k_toho2'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/toho2/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '震災後2011', minZoom: 15, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院東日本大震災' }
        };
        MapTypeArray['k_toho3'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/toho3/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '震災後2012', minZoom: 15, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院東日本大震災' }
        };
        MapTypeArray['k_toho4'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/toho4/{z}/{x}/{y}.jpg',
            copyright: '国土地理院',
            opt: { id: '震災後2013', minZoom: 14, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院東日本大震災' }
        };
        MapTypeArray['k_kumaN'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/20160414kumamoto_0416dol1/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '熊本地震（熊本地区）平成28年4月16日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };
        MapTypeArray['k_kumaS'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/20160414kumamoto_0416dol2/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '熊本地震（熊本地区）平成28年4月16日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };

        MapTypeArray['k_hiroshimaDisaster'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/20140828dol/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '広島土砂災害 平成26年8月28日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };
        MapTypeArray['h30gouu_hiroshima'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/201807H3007gouu_sakachou_0711do/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '平成30年7月豪雨（広島市・坂町）9・11日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };
        MapTypeArray['h30gouu_okayama'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/201807H3007gouu_takahashigawa_0709do/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '平成30年7月豪雨（倉敷市・総社市）9日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };
        MapTypeArray['k_kinugawaN'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/20150911dol2/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '鬼怒川浸水北平成27年9月11日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };

        MapTypeArray['k_kinugawaS'] = {
            href: 'https://cyberjapandata.gsi.go.jp/xyz/20150911dol5/{z}/{x}/{y}.png',
            copyright: '国土地理院',
            opt: {
                id: '鬼怒川浸水南平成27年9月11日撮影', minZoom: 10, maxNativeZoom: 18, attribution: gsitileref, tag: '国土地理院災害'
            }
        };
        MapTypeArray['GSJseamless'] = {
            href: "https://gbank.gsj.jp/seamless/tilemap/basic/glfn/{z}/{y}/{x}.png",
            copyright: '国土地理院',
            opt: {
                info: "https://gbank.gsj.jp/seamless/legend.html",
                id: 'シームレス地質図', minZoom: 8, maxNativeZoom: 13, attribution: '<a href="https://gbank.gsj.jp/seamless/" target="_blank">産総研</a>', tag: 'その他'
            }
        };



        MapTypeArray['pop_density2015'] = {
            href: "https://ktgis.net/kjmapw/kjtilemap/pop_density2015/{z}/{x}/{y}.png",
            copyright: '谷謙二',
            opt: {
                info: 'https://ktgis.net/kjmapw/data.html#right_data',
                id: '人口密度(2015年)', minZoom: 5, maxNativeZoom: 14, attribution: '<a href="https://ktgis.net/lab/index.php" target="_blank">谷謙二</a>', tag: '人口'
            }
        };

        MapTypeArray['pop_density2010'] = {
            href: "https://ktgis.net/kjmapw/kjtilemap/pop_density2010/{z}/{x}/{y}.png",
            copyright: '谷謙二',
            opt: {
                info: 'https://ktgis.net/kjmapw/kjtilemap/data.html#right_data',
                id: '人口密度(2010年)', minZoom: 5, maxNativeZoom: 14, attribution: '<a href="https://ktgis.net/lab/index.php" target="_blank">谷謙二</a>', tag: '人口'
            }
        };

        MapTypeArray['pop_density2005'] = {
            href: "https://ktgis.net/kjmapw/kjtilemap/pop_density2005/{z}/{x}/{y}.png",
            copyright: '谷謙二',
            opt: {
                info: 'https://ktgis.net/kjmapw/kjtilemap/data.html#right_data',
                id: '人口密度(2005年)', minZoom: 5, maxNativeZoom: 14, attribution: '<a href="https://ktgis.net/lab/index.php" target="_blank">谷謙二</a>', tag: '人口'
            }
        };

        MapTypeArray['railroad2020'] = {
            href: "https://ktgis.net/kjmapw/kjtilemap/railroad2020/{z}/{x}/{y}.png",
            copyright: '谷謙二',
            opt: {
                info: 'https://ktgis.net/kjmapw/data.html#right_data',
                id: '鉄道2020', minZoom: 4, maxNativeZoom: 14, attribution: '<a href="https://ktgis.net/lab/index.php" target="_blank">谷謙二</a>', tag: 'その他'
            }
        };


        MapTypeArray['kantoZoning'] = {
            href: "https://ktgis.net/kjmapw/kjtilemap/kanto-zoning2019/{z}/{x}/{y}.png",
            copyright: '谷謙二',
            opt: {
                info: 'https://ktgis.net/kjmapw/data.html#right_data',
                id: '関東用途地域', minZoom: 5, maxNativeZoom: 16, attribution: '<a href="https://ktgis.net/lab/index.php" target="_blank">谷謙二;国土数値情報</a>', tag: 'その他'
            }
        };
        MapTypeArray['osm'] = {
            href: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            copyright: 'OpenStreetMap',
            opt: {
                id: 'オープンストリートマップ', minZoom: 0, maxNativeZoom: 18, attribution: '<a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>', tag: 'オープンストリートマップ'
            }
        };
        MapTypeArray['OpenTopoMap'] = {
            href: "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
            copyright: 'OpenTopotMap',
            opt: {
                id: 'OpenTopoMap', minZoom: 1, maxNativeZoom: 17, attribution: '<a href="https://opentopomap.org/about" target="_blank">OpenTopoMap</a>', tag: 'オープンストリートマップ'
            }
        };

        MapTypeArray['osm-mono'] = {
            href: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
            copyright: 'OpenStreetMap',
            opt: {
                id: 'OSM-monochrome', minZoom: 1, maxNativeZoom: 17, attribution: '<a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a>', tag: 'オープンストリートマップ'
            }
        };
        MapTypeArray['kjmap_tokyo50_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1896-1909年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1917-1924年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1927-1939年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1944-1954年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1965-1968年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1975-1978年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_6'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1983-1987年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_7'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/06/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1992-1995年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokyo50_8'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/07/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ首都圏編1998-2005年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1888-1898年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1920-1920年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1932-1932年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1937-1938年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1947-1947年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1959-1960年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_6'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1968-1973年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_7'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/06/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1976-1980年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_8'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/07/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1984-1989年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_chukyo_9'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/08/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ中京圏編1992-1996年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1892-1910年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1922-1923年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1927-1935年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1947-1950年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1954-1956年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/03x/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1961-1964年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_6'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1967-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_7'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1975-1979年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_8'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/06/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1983-1988年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_keihansin_9'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/07/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ京阪神圏編1993-1997年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tohoku_pacific_coast_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東北地方太平洋岸編1901-1916年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tohoku_pacific_coast_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東北地方太平洋岸編1949-1953年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tohoku_pacific_coast_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東北地方太平洋岸編1969-1982年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tohoku_pacific_coast_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東北地方太平洋岸編1990-2008年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanto_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanto/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ関東編1894-1915年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanto_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanto/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ関東編1928-1945年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanto_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanto/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ関東編1972-1982年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanto_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanto/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ関東編1988-2008年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sapporo_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ札幌編1916-1916年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sapporo_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ札幌編1935-1935年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sapporo_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ札幌編1950-1952年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sapporo_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ札幌編1975-1976年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sapporo_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ札幌編1995-1998年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_asahikawa_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ旭川編1916-1917年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_asahikawa_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ旭川編1950-1952年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_asahikawa_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ旭川編1972-1974年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_asahikawa_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ旭川編1986-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_asahikawa_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ旭川編1999-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kushiro_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ釧路編1897-1897年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kushiro_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ釧路編1922-1922年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kushiro_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ釧路編1958-1958年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kushiro_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ釧路編1981-1981年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kushiro_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ釧路編2001-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_obihiro_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ帯広編1896-1896年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_obihiro_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ帯広編1930-1930年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_obihiro_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ帯広編1956-1957年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_obihiro_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ帯広編1985-1985年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_obihiro_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ帯広編1998-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tomakomai_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ苫小牧編1896-1896年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tomakomai_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ苫小牧編1935-1935年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tomakomai_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ苫小牧編1954-1955年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tomakomai_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ苫小牧編1983-1984年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tomakomai_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ苫小牧編1993-1999年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_muroran_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/muroran/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ室蘭編1896-1896年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_muroran_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/muroran/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ室蘭編1917-1917年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_muroran_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/muroran/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ室蘭編1955-1955年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_muroran_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/muroran/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ室蘭編1986-1987年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_muroran_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/muroran/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ室蘭編1998-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hakodate_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ函館編1915-1915年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hakodate_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ函館編1951-1955年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hakodate_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ函館編1968-1968年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hakodate_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ函館編1986-1989年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hakodate_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ函館編1996-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aomori_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aomori/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ青森編1912-1912年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aomori_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aomori/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ青森編1939-1955年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aomori_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aomori/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ青森編1970-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aomori_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aomori/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ青森編1984-1989年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aomori_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aomori/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ青森編2003-2011年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hirosaki_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ弘前編1912-1912年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hirosaki_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ弘前編1939-1939年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hirosaki_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ弘前編1970-1971年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hirosaki_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ弘前編1980-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hirosaki_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ弘前編1994-1997年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_morioka_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/morioka/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ盛岡編1911-1912年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_morioka_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/morioka/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ盛岡編1939-1939年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_morioka_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/morioka/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ盛岡編1968-1969年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_morioka_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/morioka/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ盛岡編1983-1988年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_morioka_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/morioka/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ盛岡編1999-2002年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_iwatekennan_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岩手県南編1913-1913年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_iwatekennan_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岩手県南編1951-1951年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_iwatekennan_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岩手県南編1968-1968年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_iwatekennan_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岩手県南編1985-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_iwatekennan_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岩手県南編1996-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sendai_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sendai/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ仙台編1928-1933年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sendai_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sendai/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ仙台編1946-1946年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sendai_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sendai/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ仙台編1963-1967年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sendai_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sendai/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ仙台編1977-1978年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sendai_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sendai/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ仙台編1995-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_akita_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/akita/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ秋田編1912-1912年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_akita_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/akita/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ秋田編1971-1972年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_akita_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/akita/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ秋田編1985-1990年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_akita_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/akita/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ秋田編2006-2007年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamagata_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山形編1901-1903年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamagata_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山形編1931-1931年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamagata_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山形編1970-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamagata_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山形編1980-1989年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamagata_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山形編1999-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_syonai_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/syonai/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ庄内編1913-1913年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_syonai_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/syonai/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ庄内編1934-1934年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_syonai_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/syonai/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ庄内編1974-1974年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_syonai_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/syonai/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ庄内編1987-1987年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_syonai_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/syonai/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ庄内編1997-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukushima_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福島編1908-1908年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukushima_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福島編1931-1933年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukushima_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福島編1972-1974年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukushima_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福島編1983-1983年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukushima_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福島編1996-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aizu_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aizu/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ会津編1908-1910年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aizu_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aizu/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ会津編1931-1931年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aizu_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aizu/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ会津編1972-1975年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aizu_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aizu/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ会津編1988-1991年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_aizu_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/aizu/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ会津編1997-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_niigata_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/niigata/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ新潟編1910-1911年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_niigata_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/niigata/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ新潟編1930-1931年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_niigata_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/niigata/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ新潟編1966-1968年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_niigata_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/niigata/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ新潟編1980-1988年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_niigata_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/niigata/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ新潟編1997-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanazawa_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ金沢・富山編1909-1910年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanazawa_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ金沢・富山編1930-1930年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanazawa_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ金沢・富山編1968-1969年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanazawa_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ金沢・富山編1981-1985年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kanazawa_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ金沢・富山編1994-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukui_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukui/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福井編1909-1909年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukui_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukui/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福井編1930-1930年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukui_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukui/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福井編1969-1973年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukui_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukui/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福井編1988-1990年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukui_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukui/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福井編1996-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagano_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagano/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長野編1912-1912年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagano_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagano/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長野編1937-1937年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagano_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagano/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長野編1960-1960年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagano_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagano/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長野編1972-1973年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagano_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagano/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長野編1985-1985年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagano_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagano/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長野編2001-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsumoto_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松本編1910-1910年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsumoto_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松本編1931-1931年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsumoto_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松本編1974-1975年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsumoto_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松本編1987-1992年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsumoto_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松本編1996-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1889-1890年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1916-1918年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1938-1950年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1956-1959年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1975-1988年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1988-1995年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hamamatsu_6'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ浜松・豊橋編1996-2010年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tsu_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tsu/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ津編1892-1898年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tsu_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tsu/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ津編1920-1920年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tsu_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tsu/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ津編1937-1937年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tsu_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tsu/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ津編1959-1959年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tsu_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tsu/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ津編1980-1982年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tsu_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tsu/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ津編1991-1999年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omi_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omi/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ近江編1891-1909年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omi_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omi/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ近江編1920-1922年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omi_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omi/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ近江編1954-1954年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omi_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omi/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ近江編1967-1971年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omi_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omi/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ近江編1979-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omi_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omi/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ近江編1992-1999年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_himeji_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/himeji/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ姫路編1903-1910年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_himeji_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/himeji/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ姫路編1923-1923年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_himeji_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/himeji/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ姫路編1967-1967年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_himeji_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/himeji/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ姫路編1981-1985年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_himeji_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/himeji/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ姫路編1997-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_wakayama_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ和歌山編1908-1912年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_wakayama_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ和歌山編1934-1934年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_wakayama_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ和歌山編1947-1947年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_wakayama_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ和歌山編1966-1967年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_wakayama_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ和歌山編1984-1985年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_wakayama_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ和歌山編1998-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tottori_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tottori/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鳥取編1897-1897年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tottori_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tottori/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鳥取編1932-1932年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tottori_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tottori/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鳥取編1973-1973年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tottori_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tottori/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鳥取編1988-1988年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tottori_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tottori/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鳥取編1999-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsue_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsue/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松江・米子編1915-1915年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsue_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsue/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松江・米子編1934-1934年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsue_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsue/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松江・米子編1975-1975年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsue_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsue/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松江・米子編1989-1990年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsue_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsue/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松江・米子編1997-2003年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okayama_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okayama/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岡山・福山編1895-1898年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okayama_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okayama/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岡山・福山編1925-1925年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okayama_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okayama/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岡山・福山編1965-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okayama_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okayama/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岡山・福山編1978-1988年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okayama_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okayama/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ岡山・福山編1990-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hiroshima_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ広島編1894-1899年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hiroshima_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ広島編1925-1932年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hiroshima_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ広島編1950-1954年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hiroshima_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ広島編1967-1969年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hiroshima_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ広島編1984-1990年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_hiroshima_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ広島編1992-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamaguchi_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山口編1897-1909年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamaguchi_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山口編1922-1927年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamaguchi_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山口編1936-1951年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamaguchi_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山口編1969-1969年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamaguchi_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山口編1983-1989年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yamaguchi_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ山口編2000-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokushima_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ徳島編1896-1909年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokushima_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ徳島編1917-1917年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokushima_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ徳島編1928-1934年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokushima_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ徳島編1969-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokushima_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ徳島編1981-1987年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_tokushima_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ徳島編1997-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_takamatsu_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高松編1896-1910年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_takamatsu_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高松編1928-1928年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_takamatsu_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高松編1969-1969年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_takamatsu_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高松編1983-1984年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_takamatsu_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高松編1990-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsuyama_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松山編1903-1903年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsuyama_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松山編1928-1955年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsuyama_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松山編1966-1968年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsuyama_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松山編1985-1985年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_matsuyama_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ松山編1998-1999年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_toyo_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/toyo/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東予編1898-1906年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_toyo_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/toyo/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東予編1928-1928年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_toyo_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/toyo/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東予編1966-1969年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_toyo_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/toyo/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東予編1984-1989年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_toyo_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/toyo/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ東予編1994-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kochi_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kochi/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高知編1906-1907年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kochi_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kochi/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高知編1933-1933年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kochi_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kochi/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高知編1965-1965年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kochi_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kochi/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高知編1982-1982年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kochi_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kochi/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ高知編1998-2003年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukuoka_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福岡・北九州編1922-1926年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukuoka_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福岡・北九州編1936-1938年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukuoka_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福岡・北九州編1948-1956年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukuoka_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福岡・北九州編1967-1972年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukuoka_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福岡・北九州編1982-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_fukuoka_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ福岡・北九州編1991-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_saga_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/saga/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐賀・久留米編1900-1911年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_saga_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/saga/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐賀・久留米編1914-1926年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_saga_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/saga/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐賀・久留米編1931-1940年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_saga_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/saga/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐賀・久留米編1958-1964年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_saga_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/saga/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐賀・久留米編1977-1982年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_saga_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/saga/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐賀・久留米編1998-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagasaki_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長崎編1900-1901年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagasaki_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長崎編1924-1926年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagasaki_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長崎編1954-1954年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagasaki_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長崎編1970-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagasaki_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長崎編1982-1983年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nagasaki_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ長崎編1996-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sasebo_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐世保編1900-1901年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sasebo_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐世保編1924-1924年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sasebo_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐世保編1971-1971年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sasebo_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐世保編1985-1987年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_sasebo_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ佐世保編1997-1998年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omuta_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omuta/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大牟田・島原編1900-1900年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omuta_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omuta/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大牟田・島原編1941-1942年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omuta_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omuta/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大牟田・島原編1970-1970年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omuta_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omuta/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大牟田・島原編1983-1987年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omuta_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omuta/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大牟田・島原編1993-1994年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_omuta_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/omuta/05/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大牟田・島原編1999-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kumamoto_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ熊本編1900-1901年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kumamoto_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ熊本編1926-1926年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kumamoto_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ熊本編1965-1971年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kumamoto_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ熊本編1983-1983年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kumamoto_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ熊本編1998-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yatsushiro_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ八代編1901-1901年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yatsushiro_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ八代編1932-1942年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yatsushiro_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ八代編1965-1965年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yatsushiro_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ八代編1983-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_yatsushiro_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ八代編1997-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_oita_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/oita/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大分編1914-1914年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_oita_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/oita/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大分編1973-1973年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_oita_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/oita/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大分編1984-1986年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_oita_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/oita/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ大分編1997-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nobeoka_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ延岡編1903-1903年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nobeoka_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ延岡編1932-1932年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nobeoka_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ延岡編1964-1964年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nobeoka_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ延岡編1978-1978年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_nobeoka_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ延岡編1999-2000年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyazaki_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ宮崎編1902-1902年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyazaki_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ宮崎編1935-1935年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyazaki_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ宮崎編1962-1962年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyazaki_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ宮崎編1979-1979年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyazaki_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ宮崎編1999-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyakonojyou_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ都城編1902-1902年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyakonojyou_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ都城編1932-1932年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyakonojyou_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ都城編1966-1966年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyakonojyou_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ都城編1979-1980年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_miyakonojyou_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/04/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ都城編1998-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kagoshima_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/5man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鹿児島編1902-1902年',minZoom:8,maxNativeZoom:15,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kagoshima_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/2man/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鹿児島編1902-1902年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kagoshima_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鹿児島編1932-1932年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kagoshima_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鹿児島編1966-1966年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kagoshima_4'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鹿児島編1982-1983年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_kagoshima_5'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ鹿児島編1996-2001年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okinawas_0'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/00/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ沖縄本島南部編1919-1919年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okinawas_1'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/01/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ沖縄本島南部編1973-1975年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okinawas_2'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/02/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ沖縄本島南部編1992-1994年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            MapTypeArray['kjmap_okinawas_3'] = {
            ReverseF: true,
            href: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/03/{z}/{x}/{y}.png',
            copyright:'谷謙二',
            opt: {
            id: '今昔マップ沖縄本島南部編2005-2008年',minZoom:8,maxNativeZoom:16,attribution: '<a href="https://ktgis.net/kjmapw/" target="_blank">今昔マップ</a>',tag:'今昔マップ'
            }
            };
            
            

        return MapTypeArray;
    }
}