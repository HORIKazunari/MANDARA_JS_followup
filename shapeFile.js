// シェープファイル取得

clsShapefile = function () {

    let shapefile_info = function () {
        this.FileName;
        this.FullPath;
        this.Zahyo;
        this.prj_file_exist;
        this.dbf_file_exist;
        this.shx_file_exist;
        this.encodingnumber;
    }
    let IndexFileData_info = function () {
        this.offset;
        this.contentsLength;
    }
    let XY_Genten_Info = function () {
        this.CenterB;
        this.CenterL;
    }
    let XYMaxMin_Double = function () {
        this.XMin;
        this.Ymin;
        this.Xmax;
        this.YMax;
    }
    let XY_Double = function () {
        this.x;
        this.y;
    }

    let DBF_Info = function () {
        this.VerData;
        this.RecordNumber;
        this.FieldNumber;
        this.Year;
        this.Month;
        this.dbfDate;
        this.Header_Byte;
        this.Record_Byte;
    }
    let Field_Info = function () {
        this.Name;
        this.StringData_Flag;
        this.Length;
        this.PointLen;
    }

    let boundBox = function () {
        this.maxX;
        this.minX;
        this.maxY;
        this.minY;
    }

    let enmShape = {
        NotDeffinition: -1,
        PointShape: 0,
        LineShape: 1,
        PolygonShape: 2
    }
    let endian = {
        little: true,
        big: false
    }

    let ZahyoSettingFlag=false;
    this.getMapZahyo=function(){
        return MapZahyo.Clone();;
    }
    this.setMapZahyo=function(zahyo){
        MapZahyo=zahyo.Clone();
    }
    this.getZahyoSettingFlag=function(){
        return ZahyoSettingFlag;
    }

    let FileName;
    let MapZahyo = new Zahyo_info();
    MapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
    MapZahyo.System = enmZahyo_System_Info.Zahyo_System_World;
    MapZahyo.HeimenTyokkaku_KEI_Number = 1;

    let IndexData = [];
    let boundingBox = new boundBox();
    let C_Point = [];
    let PointIndex = [];
    let Points = [];
    let ShapeS;
    let FieldDT = [];
    let DataStr = [];
    let onError;
    let tag;
    this.getShape=function(){
        return ShapeS;
    }
    
    this.fileRead = function (files, dbfEncode, _tag, onOK, _onError) {
        onError = _onError;
        tag = _tag;
        let shxFile;
        let shapeFile;
        let dbfFile;
        let prjFile;
        FileName = Generic.getFilenameWithoutExtension(files[0].name);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            fname = file.name;
            let ext = file.name.slice(-3).toLowerCase();
            if (ext == "shx") {
                shxFile = file;
            }
            if (ext == "shp") { shapeFile = file; }
            if (ext == "dbf") { dbfFile = file; }
            if (ext == "prj") { prjFile = file; }
        }
        let okf = true;
        const shxReader = new FileReader();
        shxReader.readAsArrayBuffer(shxFile);
        //ファイルの読込が終了した時の処理
        shxReader.onload = function (evt) {
            IndexData = [];
            getSHXFile(shxReader.result);
            const shpReader = new FileReader();
            shpReader.readAsArrayBuffer(shapeFile);
            shpReader.onload = function (evt) {
                getShapeFile(shpReader.result);
                const dbfReader = new FileReader();
                dbfReader.readAsArrayBuffer(dbfFile);
                dbfReader.onload = function (evt) {
                    try {
                        getDbfFile(dbfReader.result, dbfEncode);
                    }
                    catch (e) {
                        okf = false;
                        onError(tag);
                        return;
                    }
                    if (prjFile != undefined) {
                        const prjReader = new FileReader();
                        prjReader.readAsText(prjFile, 'utf8');
                        prjReader.onload = function (evt) {
                            ZahyoSettingFlag = getPrjFile(prjReader.result);
                            //onloadFunction(MapZahyo, boundingBox, ShapeS, C_Point, PointIndex, Points, FieldDT, DataStr);
                            if (okf == true) {
                                onOK(tag);
                            }
                        }
                    } else {
                        if (okf == true) {
                            onOK(tag);
                        }
                        //onloadFunction(MapZahyo, boundingBox, ShapeS, C_Point, PointIndex, Points, FieldDT, DataStr);
                    }
                }
            }
        }
    }

    /**zipファイル圧縮シェープファイル */
    this.fileReadZip= function (unZipData, dbfEncode, _tag, onOK) {
        tag = _tag;
        let shxFile;
        let shapeFile;
        let dbfFile;
        let prjFile;
        for (let file  in unZipData) {
            let ext =Generic.getExtension(file).toLowerCase();
            if (ext == "shx") { shxFile = file; }
            if (ext == "shp") { 
                shapeFile = file;
                FileName = Generic.getFilenameWithoutExtension(shapeFile);
             }
            if (ext == "dbf") { dbfFile = file; }
            if (ext == "prj") { prjFile = file; }
        }
        IndexData = [];
        getSHXFile(Uint8Array.from(unZipData[shxFile]).buffer);
        getShapeFile(Uint8Array.from(unZipData[shapeFile]).buffer);
        getDbfFile(Uint8Array.from(unZipData[dbfFile]).buffer, dbfEncode);
        if (prjFile != undefined) {
            let prjtx = Generic.utf8ArrayToStr(unZipData[prjFile]);
            ZahyoSettingFlag = getPrjFile(prjtx);
        }
        onOK(tag);
    }

    //prjファイル読み込み
    getPrjFile = function (Prjtext) {
        const FData = Prjtext.toUpperCase();
        if (FData.indexOf("UNDEFINED") != -1) {
            return false;
        }

        let fixf = false;
        if ((FData.indexOf("D_TOKYO") != -1)) {
            //日本測地系
            MapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
            MapZahyo.System = enmZahyo_System_Info.Zahyo_System_tokyo;
            fixf = true;
        }

        if ((FData.indexOf("D_JGD_2000") != -1) || (FData.indexOf("D_JGD_2011") != -1) ||
            ((FData.indexOf("D_WGS84") != -1) || (FData.indexOf("D_WGS_1984") != -1))) {
            //'世界測地系
            MapZahyo.Mode = enmZahyo_mode_info.Zahyo_Ido_Keido;
            MapZahyo.System = enmZahyo_System_Info.Zahyo_System_World;
            fixf = true;
        }
        if ((FData.indexOf("JAPAN_ZONE_") != -1)) {
            //平面直角
            MapZahyo.Mode = enmZahyo_mode_info.Zahyo_HeimenTyokkaku;
            MapZahyo.HeimenTyokkaku_KEI_Number = parseInt(FData.substr(FData.indexOf("JAPAN_ZONE_") + 11, 2));
            fixf = true;
        } else {
            let HC = "Japan_Plane_Rectangular_CS_";
            let heimen_Code = [];

            heimen_Code[1] = HC + "I";
            heimen_Code[2] = HC + "II";
            heimen_Code[3] = HC + "III";
            heimen_Code[4] = HC + "IV";
            heimen_Code[5] = HC + "V";
            heimen_Code[6] = HC + "VI";
            heimen_Code[7] = HC + "VII";
            heimen_Code[8] = HC + "VIII";
            heimen_Code[9] = HC + "IX";
            heimen_Code[10] = HC + "X";
            heimen_Code[11] = HC + "XI";
            heimen_Code[12] = HC + "XII";
            heimen_Code[13] = HC + "XIII";
            heimen_Code[14] = HC + "XIV";
            heimen_Code[15] = HC + "XV";
            heimen_Code[16] = HC + "XVI";
            heimen_Code[17] = HC + "XVII";
            heimen_Code[18] = HC + "XVII";
            heimen_Code[19] = HC + "XIX";
            for (let i = 19; i > 0; i--) {
                if ((FData.indexOf(heimen_Code[i].toUpperCase()) != -1)) { //平面直角
                    MapZahyo.Mode = enmZahyo_mode_info.Zahyo_HeimenTyokkaku
                    MapZahyo.HeimenTyokkaku_KEI_Number = i;
                    fixf = true;
                    break;
                }
            }
        }
        return fixf;
    }


    //dbfファイル読み込み
    getDbfFile = function (buffer, encodenumber) {

        const dv = new DataView(buffer);

        let DataSet = new DBF_Info();

        DataSet.VerData = dv.getInt8(0); //Ver=3  = VerData And 7 
        DataSet.Year = dv.getInt8(1) //Year-1900
        DataSet.Month = dv.getInt8(2);
        DataSet.dbfDate = dv.getInt8(3);
        DataSet.RecordNumber = dv.getUint32(4, endian.little);
        DataSet.Header_Byte = dv.getUint16(8, endian.little);
        DataSet.Record_Byte = dv.getUint16(10, endian.little); //sum(FieldDT().Length)+1
        DataSet.FieldNumber = parseInt((DataSet.Header_Byte - 33) / 32);
        let pos = 12;
        pos += 4;
        pos += 12;
        pos += 4;
        //フィールド記述子配列読み込み
        for (let i = 0; i < DataSet.FieldNumber; i++) {
            let fd = new Field_Info();
            fd.Name = Get_WCharData_Binary(pos, 11, encodenumber).trim();
            pos += 11;
            let fieldType = String.fromCharCode(dv.getInt8(pos));
            switch (fieldType) {
                case "C":
                case "D":
                case "M":
                case "L": {
                    fd.StringData_Flag = true;
                    break;
                }
                case "F":
                case "N":
                    {
                    fd.StringData_Flag = false;
                    break;
                    }
            }
            pos += 1;
            pos += 4;
            fd.Length = dv.getUint8(pos)
            fd.PointLen = dv.getUint8(pos + 1)
            pos += 2;
            pos += 3;
            pos += 10;
            pos += 1;
            FieldDT.push(fd);
        }
        pos++;
        //データベースレコード読み込み
        for (let i = 0; i < DataSet.RecordNumber; i++) {
            pos++;
            let fdata = [];
            for (let j = 0; j < DataSet.FieldNumber; j++) {
                let dt = Get_WCharData_Binary(pos, FieldDT[j].Length, encodenumber).trim();
                fdata.push(dt);
                pos += FieldDT[j].Length;
            }
            DataStr.push(fdata);
        }
        return true;



        function Get_WCharData_Binary(Position, GetLen, encode) {
            let ubt = [];
            for (let i = 0; i < GetLen; i++) {
                ubt.push(dv.getInt8(Position + i));
            }
            let text_decoder = new TextDecoder(encode);
            let retstr = text_decoder.decode(Uint8Array.from(ubt).buffer);
            do {
                czero = retstr.indexOf(String.fromCharCode(0));
                if (czero != -1) {
                    retstr = retstr.slice(0, czero) + retstr.slice(czero + 1);
                }
            } while (czero != -1)

            return retstr;
        }
    }

    //shxファイル読み込み
    getSHXFile = function (buffer) {

            const dv = new DataView(buffer)

            let fcode = dv.getUint32(0, endian.big);
            let flen = dv.getUint32(24, endian.big) * 2 - 100;
            let fc2 = dv.getUint16(28, endian.little);
            boundingBox.minX = dv.getFloat64(36, endian.little);
            boundingBox.minY = dv.getFloat64(44, endian.little);
            boundingBox.maxX = dv.getFloat64(52, endian.little);
            boundingBox.maxY = dv.getFloat64(60, endian.little);
            for (let i = 0; i < flen; i += 8) {
                let dt = new IndexFileData_info();
                dt.offset = dv.getUint32(i + 100, false);
                dt.contentsLength = dv.getUint32(i + 104, false);
                IndexData.push(dt);
            }
            return IndexData;

    }


    //shpファイル読み込み
    getShapeFile = function (buffer) {
            const dv = new DataView(buffer);
    
            let fcode = dv.getUint32(0, endian.big);
            let flen = dv.getUint32(24, endian.big) * 2 - 100;
            let fc2 = dv.getUint16(28, endian.little);
    
            const shapeType = dv.getUint32(32, endian.little);
            switch (shapeType) {
                case 1:
                case 11:
                case 21: {
                    ShapeS = enmShape.PointShape;
                    break;
                }
                case 3:
                case 13:
                case 23: {
                    ShapeS = enmShape.LineShape;
                    break;
                }
                case 5:
                case 15:
                case 25: {
                    ShapeS = enmShape.PolygonShape;
                    break;
                }
                default:
                    return;
            }
    
            let n = 0;
    
            do {
                
                let pos = IndexData[n].offset * 2;
                let RecordNumber = dv.getUint32(pos, endian.big)+12;
                if (RecordNumber == 0) {
                    break;
                }
                switch (shapeType) {
                    case 1:
                    case 11:
                    case 21: {
                        pos += 12;
                        let p = getPointXY(dv, pos);
                        C_Point.push(p);
                        break;
                    }
                    case 3:
                    case 5:
                    case 13:
                    case 15:
                    case 23:
                    case 25: {
                        pos += 44;
                        let NumParts = dv.getUint32(pos, endian.little );
                        let NumPoints = dv.getUint32(pos + 4, endian.little);
                        pos += 8;
                        let pindex2 = [];
                        for (let i = 0; i < NumParts; i++) {
                            pindex2.push(dv.getUint32(pos, endian.little));
                            pos += 4;
                        }
                        for (let i = 0; i < NumPoints; i++) {
                            Points.push(getPointXY(dv, pos));
                            pos += 16;
                        }
                        pindex2.push(NumPoints);
                        PointIndex.push(pindex2);
                        break;
                    }
                }
                n++;
            } while (n < IndexData.length);
            return true;

    

        function getPointXY(dv, pos) {
            let p = new point();
            p.x = dv.getFloat64(pos, endian.little);
            p.y = dv.getFloat64(pos + 8, endian.little);
            return p;
        }
    }

    //読み込んだシェープファイルを地図ファイルに変換する
    this.convertToMapfile = function (projection,UnitCheckFlag) {
        let MapData = new clsMapdata();
        MapData.init_MapData();
        MapData.Add_OneObjectGroup_Parameter(FileName, ShapeS, enmMesh_Number.mhNonMesh, enmObjectGoupType_Data.NormalObject);
        if (ShapeS != enmShape.PointShape) {
            let lp = clsBase.Line();
            if (IndexData.length > 500) {
                lp.BlankF = true;
            }
            MapData.Add_OneLineKind(FileName, lp, enmMesh_Number.mhNonMesh);
        }

        const Obk = 0;
        const LK = 0;
        let pos = 0;
        for (let n = 0; n < IndexData.length; n++) {
            let newObj = MapData.Init_One_Object(Obk);
            newObj.Shape = ShapeS;
            newObj.NameTimeSTC[0].NamesList[0] = FileName + String(n);
            switch (ShapeS) {
                case enmShape.PointShape:
                    newObj.CenterPSTC[0].Position  = C_Point[n].Clone();
                    break;
                default:
                    let AlinS = MapData.Map.ALIN;
                    let NumParts = PointIndex[n];
                    newObj.NumOfLine = NumParts.length-1;
                    for (let i = 0; i < NumParts.length-1; i++) {
                        let newLine = MapData.Init_One_Line(LK);
                        newLine.NumOfPoint = NumParts[i + 1] - NumParts[i];
                        for (let j = 0; j < newLine.NumOfPoint; j++) {
                            newLine.PointSTC.push(Points[pos].Clone());
                            pos++;
                        }
                        MapData.Save_Line(newLine, false, false, false);
                    }

                    for (let j = 0; j < newObj.NumOfLine; j++) {
                        let lc = new LineCodeStac_Data();
                        lc.LineCode = AlinS + j;
                        lc.NumOfTime = 0;
                        newObj.LineCodeSTC.push(lc);
                    }
                    newObj.CenterPSTC[0].Position = MapData.MPLine[newObj.LineCodeSTC[0].LineCode].PointSTC[0].Clone();
                    break;
            }
            MapData.Save_Object(newObj, false);
        }

        let unit = []
        if (UnitCheckFlag == true) {
            unit = Generic.Check_DataType(FieldDT.length, IndexData.length, DataStr);
        } else {
            for (let i = 0; i < FieldDT.length; i++) {
                let fd = FieldDT[i];
                let unt = "";
                if (fd.StringData_Flag == true) {
                    unt = "STR";
                }
                unit.push(unt);
            }
        }
        for (let i = 0; i < FieldDT.length; i++) {
            let fd = FieldDT[i];
            MapData.Add_one_DefAttDataSet(Obk, fd.Name, unit[i], "");
        }

        for (let i = 0; i < IndexData.length; i++) {
            let mo = MapData.MPObj[i];
            for (let j = 0; j < FieldDT.length; j++) {
                let defv = new strDefTimeAttDataEach_Info();
                defv.Value = DataStr[i][j];
                let defa=new strDefTimeAttData_Info();
                defa.Data.push(defv);
                mo.DefTimeAttValue.push(defa);
            }
        }

        MapData.Map.Zahyo = MapZahyo.Clone();
        MapData.Map.Zahyo.Projection=projection;
        MapData.Map.FileName = FileName;
        MapData.Map.FullPath = "";
        MapData.NoDataFlag = false;
        MapData.Set_First_ObjectKind_Color();
        switch (MapData.Map.Zahyo.Mode) {
            case enmZahyo_mode_info.Zahyo_Ido_Keido:
            MapData.Checl_All_Line_Maxmin();
             MapData.MapLatLon_Zahyo_convert();
                break;
            case enmZahyo_mode_info.Zahyo_HeimenTyokkaku:
                MapData.YReverse()
                MapData.Checl_All_Line_Maxmin();
                MapData.Check_All_Obj_MaxMin();
                MapData.GetObjectGravity_All();
                MapData.Map.SCL = 1000;
                MapData.Map.SCL_U = enmScaleUnit.kilometer;
                MapData.Map.Circumscribed_Rectangle = MapData.Get_Mapfile_Rectangle();
                break;
            case enmZahyo_mode_info.Zahyo_No_Mode:
                MapData.Checl_All_Line_Maxmin();
                MapData.Check_All_Obj_MaxMin();
                MapData.GetObjectGravity_All();
                MapData.Map.SCL = 1;
                MapData.Map.SCL_U = enmScaleUnit.kilometer;
                MapData.Map.Circumscribed_Rectangle = MapData.Get_Mapfile_Rectangle();
                break;
        }
        return MapData;
    }
}
