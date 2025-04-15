/// <reference path="clsGeneric.js" />

var clsSortingSearch = function () {
    var SortNumber = new Array();
    var Sortrr = new Array();
    var DataNum ;

    this.init=function(){
        var SortNumber = new Array();
        var Sortrr = new Array();
    }

    this.NumofData=function(){
        return DataNum;
    }

    /**元のデータのPositionのソート後の先頭からの位置を返す */
    this.getAfterSortPosition = function (originalPosition){
        return SortNumber.indexOf(originalPosition);
    }

    /**元のデータのPositionのソート後の後ろからの位置を返す */
    this.getAfterSortPositionRev = function (originalPosition) {
        return (DataNum - 1 - SortNumber.lastIndexOf(originalPosition));
    }
    
    this.SameValue_Number = function () {
        /// <signature>
        /// <summary>データ中に同じ値がどれだけあるか返す</summary>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        var SV=new Array();
        return Get_Same_value(SV);
    }
    /**重複しない個別の値とそれぞれの数のオブジェクトの配列を返す */
    this.EachValue_Array = function () {
        return Get_Each_value();
    }
    this.SameValue_Array = function (SameValueArray) {
        /// <signature>
        /// <summary>データ中の同じ値が含まれているケースを配列で返す</summary>
        /// <param name="SameValueArray" >同じ値の配列（戻り値）</param>
        /// <returns type="Number" >同じ値の数</returns>
        /// </signature> 
        let n=Get_Same_value(SameValueArray);
        return n;
    }
    this.SearchData_Array = function (SearchValue) {
        /// <signature>
        /// <summary>指定した検索値と等しいデータ番号を配列で返す</summary>
        /// <param name="SearchValue" >検索値</param>
        /// <param name="DataNumberArray" >等しいデータ番号の配列</param>
        /// <returns type="Number" >等しい値の数</returns>
        /// </signature>
        var EQn;
        let DataNumberArray = [];
        var DPosition = Search_Data_Multi(SearchValue);
        EQn = DPosition.Num_of_Equal_Data;
        if (EQn != -1) {
            for (i = 0; i < EQn; i++) {
                DataNumberArray.push(SortNumber[DPosition.firstPosition + i]);
            }
        }
        return DataNumberArray;
    }

    this.SearchData_One = function (SearchValue) {
        /// <signature>
        /// <summary>指定した検索値と等しいデータ番号を一つ返す</summary>
        /// <param name="SearchValue" >検索値</param>
        /// <returns type="Number" >データ番号</returns>
        /// </signature>
        var DPosition = Search_Data_Multi(SearchValue);
        if (DPosition.Num_of_Equal_Data == -1) {
            return -1;
        } else {
            return SortNumber[DPosition.firstPosition];
        }
    }

    this.DataPosition = function (Order) {
        /// <signature>
        /// <summary>指定した順位のデータ番号を返す</summary>
        /// <param name="Order" >順位</param>
        /// <returns type="Number" >データ番号</returns>
        /// </signature>

        return SortNumber[Order];
    }
    this.DataPositionRev = function (OrderReverse) {
        /// <signature>
        /// <summary>指定した逆順位のデータ番号を返す</summary>
        /// <param name="Order" >後方からの順位</param>
        /// <returns type="Number" >データ番号</returns>
        /// </signature>
        return SortNumber[DataNum - OrderReverse - 1];
    }

    this.DataPositionValue = function (Order) {
        /// <signature>
        /// <summary>指定した順位のデータ値を返す</summary>
        /// <param name="Order" >順位</param>
        /// <returns  >データ値</returns>
        /// </signature>
        return Sortrr[Order];
    }

    this.DataPositionRevValue = function (OrderReverse) {
        /// <signature>
        /// <summary>指定した逆順位のデータ値を返す</summary>
        /// <param name="Order" >後方からの順位</param>
        /// <returns type="Number" >データ値</returns>
        /// </signature>
        var n = DataNum - OrderReverse - 1;
        return Sortrr[n];
    }
    this.Add = function (Value) {
        /// <signature>
        /// <summary>データの追加</summary>
        /// <param name="Value" >値</param>
        /// <returns type="Number" />
        /// </signature>

        Sortrr.push(Value);
    }

    this.AddRange = function (ValueArray) {
        Sortrr = ValueArray.slice();
        this.AddEnd();
    }
    this.AddEnd = function () {
        /// <signature>
        /// <summary>データの追加終了</summary>
        /// </signature>
        DataNum = Sortrr.length;
        SortNumber=Sorting(DataNum);
    }



    function Sorting( n , sortdt ) {
        //'===========================================================
        //'ShelSort 指定された配列の整数をシェルソート
        //'             （改良挿入法）でソートする
        //' 0 1 2 3 4 5 にソート
        //'---------引数----------------------------------------------
        //'sortrr()   ここのデータをソートする
        //'sortrr_n()   ソート前の配列番号
        //'n    要素の数
        //'===========================================================
  
        var sortrr_n=new Array();
        for (var i = 0;i< n;i++){
            sortrr_n.push(i);
        }

        var gap = Math.floor(n / 2); //数列のとびの初期値
        //とびが１のとき、普通の基本挿入法
        while( gap > 0){
            //'数列番号－０からgapまで
            var k = 0;
            while (k < gap){
                //'数列kの要素と比べる最初の要素
                var j = k + gap;
                //'数列kに挿入していく
                while(j < n) {
                    //'配列数まで
                    //'まず数列kの右端の要素と比べる
                    var i = j - gap;
                    while( i >= k){
                        //数列kの最初の要素まで
                        if( Sortrr[i + gap] < Sortrr[i]){
                            TempD = Sortrr[i + gap];
                            Sortrr[i + gap] = Sortrr[i];
                            Sortrr[i] = TempD;
                            TempD = sortrr_n[i];
                            sortrr_n[i] = sortrr_n[i + gap];
                            sortrr_n[i + gap] = TempD;

                        }else{
                            break;
                        }
                    //'１つずつ左にずれる
                        i -= gap;
                    }
                    //'１つずつ右にずれる
                    j += gap;
                }
                //'次の数列に
                k ++;
            }
            //'とびの変更
            gap = Math.floor(gap / 2);
        }
        return sortrr_n;

    }
    function Search_Data_Multi( SearchValue ){
        //'-------------------------
        //'SearchValue／探し出すデータ
        //'firstPosition／データの見つかった最初の位置
        //'Num_of_Equal_Data／同じ値のデータの個数
        //'-------------------------    }

        var retV = {Num_of_Equal_Data:-1,firstPosition:-1};
        if( DataNum == 0){
            return retV;
        }
        var f = true;
        var mxx = DataNum - 1;
        var oh = mxx + 1;
        var ooh = -1;
        var H = Math.floor(mxx/2);
        while (Sortrr[H] != SearchValue) {
            if( SearchValue < Sortrr[H]){
                oh = H;
                H = Math.floor((ooh + H) /2);
                if(oh == H ){
                    f = false;
                    break;
                } 
            }else{
                ooh = H;
                H = Math.floor((oh + H) /2);
                if(ooh == H ){
                    f = false;
                    break;
                }
            }

        }
    
        if (f == false) {
            return retV;
        } else {
            if (H > 0) {
                while (Sortrr[H - 1] == SearchValue) {
                    H--;
                    if (H == 0) {
                        break;
                    }
                }
            }
            retV.firstPosition = H;

            if (H < DataNum) {
                while (Sortrr[H] == SearchValue) {
                    H++;
                    if (H == DataNum) {
                        break;
                    }
                }
            }
            retV.Num_of_Equal_Data = H - retV.firstPosition;
            return retV;
        }
    }

    function Get_Same_value(SameV) {
        //同じ値が含まれているケースを返す
        SameV.length = 0;
        let f =false;
        for (var i = 1; i < DataNum; i++) {
            if ((Sortrr[i - 1] == Sortrr[i]) && (f == false)) {
                SameV.push(Sortrr[i]);
                f = true;
            } else {
                f = false;
            }
        }
        return SameV.length;
    }

    function Get_Each_value() {
        //重複しない個別の値とそれぞれの数のオブジェクトの配列を返す
        let EachV=[];
        let n=1;
        for (var i =1; i < DataNum; i++) {
            if (Sortrr[i - 1] != Sortrr[i]) {
                EachV.push({value:Sortrr[i - 1],num:n});
                n=0;
            }
            n++;
        }
        EachV.push({value:Sortrr[DataNum - 1],num:n});
        return EachV;
    }
}