
var packageWeight = 0;
var packageLength = 0;
var packageWide = 0;
var packageHeight = 0;
var startPlace = "台北市";
var endPlace = "台北市";

var gov_cost = 0;
var cat_cost = 0;
var pelican_cost = 0;
var hct_cost = 0;

var packageSize = 0;

var normalTemp = false;
var lowTemp = false;

var gov_valid = false;
var cat_valid = false;
var pelican_valid = false;
var hct_valid = false;

var inputNull = false;

var buffer = 1000;


window.addEventListener("load", function() {
	document.getElementById('compute').addEventListener("click", function(){
			
		inputNull = false;

		/************************   Check input   ***********************/
		if(document.getElementById('package-weight').value==""){inputNull = true;}
		if(document.getElementById('package-length').value==""){inputNull = true;}
		if(document.getElementById('package-wide').value==""){inputNull = true;}
		if(document.getElementById('package-height').value==""){inputNull = true;}

		packageWeight = parseInt(document.getElementById('package-weight').value);
		packageLength = parseInt(document.getElementById('package-length').value);
		packageWide = parseInt(document.getElementById('package-wide').value);
		packageHeight = parseInt(document.getElementById('package-height').value);
		startPlace = document.getElementById('start-place').value;
		endPlace = document.getElementById('end-place').value;

		
		gov_cost = 0;
		cat_cost = 0;
		pelican_cost = 0;
		hct_cost = 0;

		packageSize = packageLength + packageWide + packageHeight;

		if(document.getElementById('normal').checked){
			normalTemp = true;
		}else if(document.getElementById('low').checked){
			lowTemp = true;
		}
		
		gov_valid = false;
		cat_valid = false;
		pelican_valid = false;
		hct_valid = false;

		buffer = 1000;

		gov_post();
		cat_post();
		pelican_post();
		hct_post();
		
		if(inputNull === true){ // Not enough package information 
			alert("請輸入完整包裹資訊");
		}else{
			var url = "result.html?gov=" + gov_cost.toString() +"&cat="+ cat_cost.toString() +"&pelican="+ pelican_cost.toString() +"&hct="+ hct_cost.toString();
			window.location.href = url ;
		}
		return false;	
	});
});

var gov_post = function(){
	console.log("in");
	if(lowTemp === true){
		alert("【中華郵政】\n 無低溫宅配服務");
		gov_valid = false;
	}else if(packageWeight > 30){
		alert("【中華郵政】\n 重量限制：30kg)");
		gov_valid = false;
	}else if( packageLength>150 || packageWide > 150 || packageHeight>150 ){
		alert("【中華郵政】\n 尺寸限制：單邊不得超過150cm)")
		gov_valid = false;
	}else{ //Vaild package
		gov_valid = true;
		var gov_costPlan = gov_determindCostPlan(packageWeight);
		var gov_AreaPlan = 0;

		///***************    Determind deliver area   ***************///
		if(startPlace === endPlace){
			gov_AreaPlan = 1;
		}else{
			
			var startArea = determindArea(startPlace);
			var endArea = determindArea(endPlace);

			if(startArea === "taipei" && endArea ==="taipei"){
				gov_AreaPlan = 1;
			}else if(startArea === "other" && endArea === "other"){
				gov_AreaPlan = 2;
			}else if(startArea === "island" && endArea === "island"){
				gov_AreaPlan = 3;
			}else if(startArea === "island" || endArea === "island"){
				gov_AreaPlan = 3;
			}else{
				gov_AreaPlan = 2;
			}
		}

		///***************     Compute the cost     ***************///
		if(gov_costPlan === 5){//over 20kg
			if(gov_AreaPlan === 1){
				gov_cost = 135 + (Math.ceil(packageWeight)-20)*10;
			}else if(gov_AreaPlan === 2){
				gov_cost = 145 + (Math.ceil(packageWeight)-20)*10;
			}else if(gov_AreaPlan === 3){
				gov_cost = 180 + (Math.ceil(packageWeight)-20)*10;
			}
			if(packageLength+packageWide+packageHeight > 150){
				gov_cost += Math.ceil((packageSize-150)/10)*10 ;
			}
		}else{//less than 20kg
			if(gov_AreaPlan === 1){//Taipei area
				if(gov_costPlan === 1){
					gov_cost = 70;
				}else if(gov_costPlan === 2){
					gov_cost = 90;
				}else if(gov_costPlan === 3){
					gov_cost = 110;
				}else if(gov_costPlan === 4){
					gov_cost = 135;
				}
			}else if(gov_AreaPlan === 2){//Taiwan other area
				if(gov_costPlan === 1){
					gov_cost = 80;
				}else if(gov_costPlan === 2){
					gov_cost = 100;
				}else if(gov_costPlan === 3){
					gov_cost = 120;
				}else if(gov_costPlan === 4){
					gov_cost = 145;
				}
			}else if(gov_AreaPlan === 3){//island
				if(gov_costPlan === 1){
					gov_cost = 100;
				}else if(gov_costPlan === 2){
					gov_cost = 125;
				}else if(gov_costPlan === 3){
					gov_cost = 150;
				}else if(gov_costPlan === 4){
					gov_cost = 180;
				}
			}

			if(packageSize > 150){
				gov_cost += Math.ceil((packageSize-150)/10)*10 ;
			}
		}
	}
	/*if(gov_valid === true){
		console.log("郵局費用:" + gov_cost);
	}*/
};

var gov_determindCostPlan = function(weight){
	if(weight < 5){
		return 1;
	}else if(weight >= 5 && weight < 10){
		return 2;
	}else if(weight >=10 && weight < 15){
		return 3;
	}else if(weight >= 15&& weight < 20){
		return 4;
	}else{
		return 5;
	}
}

var determindArea = function(place){

	var taipeiArea = ["台北市","新北市","基隆"];
	var otherArea = ["桃園市","新竹縣","苗栗縣","台中市","彰化縣","雲林縣","嘉義縣","台南市","高雄市"
					,"屏東縣","南投縣","宜蘭縣","花蓮縣","台東縣"];
	var islandArea = ["澎湖縣","金門縣","馬祖地區","東引地區","烏坵地區","綠島地區","蘭嶼地區","琉球地區"]; 
	for(var i=0 ; i < taipeiArea.length ; i++){
		if(place === taipeiArea[i]){
			return "taipei";
		}
	}
	for(var i=0 ; i < otherArea.length ; i++){
		if(place === otherArea[i]){
			return "other";
		}
	}
	for(var i=0 ; i<islandArea.length ; i++){
		if(place === islandArea[i]){
			return "island";
		}
	}
};

var cat_post = function(){

	if(packageSize > 150){
		alert("【黑貓宅急便】 \n 一般包裹尺寸不得超過150cm");
		cat_valid = false;
	}else{
		cat_valid = true;
		var cat_costPlan = determindCostPlan(packageSize);
		var cat_areaPlan = 0;

		var startArea = cat_determindArea(startPlace);
		var endArea = cat_determindArea(endPlace);
		
		if(startArea === "invalid" || endArea === "invalid"){
			alert("【黑貓宅急便】 \n 暫不提供此地區宅配服務");
			cat_valid = false;
		}else if(packageWeight > 20){
			alert("【黑貓宅急便】 \n 包裹尺寸不得超過20kg");
			cat_valid = false;
		}else{
			if(startArea === endArea){
				cat_areaPlan = 1;
			}else if(startArea === "island"){
				cat_areaPlan = 3;
			}else if(endArea === "island"){
				cat_areaPlan = 2;
			}else{
				cat_areaPlan = 1;
			}

			///***************     Compute the cost     ***************///
			if(normalTemp === true){//常溫宅急便
				if(cat_costPlan === 1){
					if(cat_areaPlan === 1){
						cat_cost = 120;
					}else if(cat_areaPlan === 2){
						cat_cost = 220;
					}else if(cat_areaPlan === 3){
						cat_cost = 130;
					}
				}else if(cat_costPlan === 2){
					if(cat_areaPlan === 1){
						cat_cost = 160;
					}else if(cat_areaPlan === 2){
						cat_cost = 280;
					}else if(cat_areaPlan === 3){
						cat_cost = 170;
					}
				}else if(cat_costPlan === 3){
					if(cat_areaPlan === 1){
						cat_cost = 200;
					}else if(cat_areaPlan === 2){
						cat_cost = 320;
					}else if(cat_areaPlan === 3){
						cat_cost = 210;
					}
				}else if(cat_costPlan === 4){
					if(cat_areaPlan === 1){
						cat_cost = 240;
					}else if(cat_areaPlan === 2){
						cat_cost = 360;
					}else if(cat_areaPlan === 3){
						cat_cost = 250;
					}
				}
			}else if(lowTemp === true){//低溫宅急便
				if(packageWeight>20){
					alert("【黑貓宅急便】 \n 低溫包裹重量不得超過20kg");
					cat_valid = false;
				}else{
					
					if(cat_costPlan === 1){
						if(cat_areaPlan === 1){
							cat_cost = 150;
						}else if(cat_areaPlan === 2){
							cat_cost = 260;
						}else if(cat_areaPlan === 3){
							cat_cost = 240;
						}
					}else if(cat_costPlan === 2){
						if(cat_areaPlan === 1){
							cat_cost = 210;
						}else if(cat_areaPlan === 2){
							cat_cost = 340;
						}else if(cat_areaPlan === 3){
							cat_cost = 270;
						}
					}else if(cat_costPlan === 3){
						if(cat_areaPlan === 1){
							cat_cost = 270;
						}else if(cat_areaPlan === 2){
							cat_cost = 400;
						}else if(cat_areaPlan === 3){
							cat_cost = 300;
						}
					}else if(cat_costPlan === 4){
							alert("【黑貓宅急便】 \n 低溫包裹尺寸不得超過120cm");
							cat_valid = false;
					}
				}
			}
		}
	}
	/*if(cat_valid === true){
		console.log("黑貓費用:" + cat_cost);
	}*/
}

var cat_determindArea = function(place){

	var taiwanArea = ["台北市","新北市","基隆","桃園市","新竹縣","苗栗縣","台中市",
					  "彰化縣","雲林縣","嘉義縣","台南市","高雄市","屏東縣","南投縣",
					  "宜蘭縣","花蓮縣","台東縣","琉球地區"];
	var islandArea = ["澎湖縣","金門縣","馬祖地區","綠島地區"]; 
	var invalidIslandArea =["東引地區","烏坵地區","蘭嶼地區","琉球地區"]; 

	for(var i=0 ; i < taiwanArea.length ; i++){
		if(place === taiwanArea[i]){
			return "taiwan";
		}
	}
	for(var i=0 ; i<islandArea.length ; i++){
		if(place === islandArea[i]){
			return "island";
		}
	}
	for(var i=0 ; i < invalidIslandArea.length ; i++){
		if(place === invalidIslandArea[i]){
			return "invalid";
		}
	}
};

var determindCostPlan = function(size){
	if(size <= 60){
		return 1;
	}else if(size > 60 && size <= 90){
		return 2;
	}else if(size > 90 && size <= 120){
		return 3;
	}else if(size > 120 && size <= 150){
		return 4;
	}
}

var pelican_post = function(){

	///*************** determind island ***************///
	var invalidIsland = false;
	var invalidIslandArea = ["馬祖地區","東引地區","烏坵地區","綠島地區","蘭嶼地區","琉球地區"]; 
	for(var i=0 ; i < invalidIslandArea.length ; i++){
		if(startPlace === invalidIslandArea[i]){
			invalidIsland = true;
		}else if(endPlace === invalidIslandArea[i]){
			invalidIsland = true;
		}
	}

	if(packageWeight > 20){
		alert("【台灣宅配通】 \n 貨件重量：不得超過20kg");
		pelican_valid = false;
	}else if(invalidIsland === true){
		alert("【台灣宅配通】 \n 外島區域只提供金門、澎湖地區");
		pelican_valid=false;
	}else{
		pelican_valid = true;
		var pelican_costPlan = determindCostPlan(packageSize);
		//var pelican_areaPlan = 0;

		var startArea = determindArea(startPlace);
		var endArea = determindArea(endPlace);

		///***************     Compute the cost     ***************///
		if(normalTemp === true){//常溫運費
			if(packageSize >150){
				alert("【台灣宅配通】 \n 常溫貨件規格：長+寬+高不得超過150cm");
				pelican_valid = false;
			}else if(startArea === "island" || endArea === "island"){
				if(pelican_costPlan === 1){
					pelican_cost = 220;
				}else if(pelican_costPlan === 2){
					pelican_cost = 280;
				}else if(pelican_costPlan === 3){
					pelican_cost = 320;
				}else if(pelican_costPlan ===4){
					pelican_cost = 360;
				}
			}else{
				if(pelican_costPlan === 1){
					pelican_cost = 110;
				}else if(pelican_costPlan === 2){
					pelican_cost = 150;
				}else if(pelican_costPlan === 3){
					pelican_cost = 190;
				}else if(pelican_costPlan ===4){
					pelican_cost = 230;
				}
			}
		}else if(lowTemp === true ){//低溫運費
			if(packageSize >120){
				alert("【台灣宅配通】 \n 低溫貨件：長+寬+高不得超過120cm");
				pelican_valid = false;
			}else if(packageLength > 75 || packageWide > 75 || packageHeight >75){
				alert("【台灣宅配通】 \n 低溫貨件：單邊長不得超過75cm");
				pelican_valid = false;
			}else{
				if(startArea === "island" || endArea === "island"){
					if(pelican_costPlan === 1){
						pelican_cost = 260;
					}else if(pelican_costPlan === 2){
						pelican_cost = 340;
					}else if(pelican_costPlan === 3){
						pelican_cost = 400;
					}
				}else{
					if(pelican_costPlan === 1){
						pelican_cost = 140;
					}else if(pelican_costPlan === 2){
						pelican_cost = 190;
					}else if(pelican_costPlan === 3){
						pelican_cost = 240;
					}
				}
			}
		}
	}
	/*if(pelican_valid === true){
		console.log("宅配通費用:" +pelican_cost);
	}*/
}

var hct_post = function(){

	if(packageWeight > 20){
		alert("【新竹貨運】 \n 重量限制：20kg");
		hct_valid = false;
	}else if(packageLength > 60 || packageWide > 60 || packageHeight > 60){
		alert("【新竹貨運】 \n 尺寸限制：單邊上限60cm");
		hct_valid = false;
	}else if(packageSize > 150){
		alert("【新竹貨運】 \n 尺寸限制：長寬高總和150cm以下");
		hct_valid = false;
	}else{
		hct_valid = true;

		var hct_costPlan = determindCostPlan(packageSize);
		var hct_areaPlan = 0;

		var startArea = hct_determindArea(startPlace);
		var endArea = hct_determindArea(endPlace);

		///***************    Determind deliver area   ***************///
		if(startArea === "invalid" || endArea === "invalid"){
			alert("【新竹貨運】 \n 暫不提供此地區寄件服務");
			hct_valid = false;
		}else{
			if(endArea === "taiwan"){
				hct_areaPlan = 1;
			}else if(endArea === "island"){
				hct_areaPlan = 2;
			}

			///***************     Compute the cost     ***************///
			if(normalTemp === true){//常溫寄件
				if(hct_areaPlan === 1){
					if(hct_costPlan === 1){
						hct_cost = 110;
					}else if(hct_costPlan === 2){
						hct_cost = 150;
					}else if(hct_costPlan === 3){
						hct_cost = 190;
					}else if(hct_costPlan === 4){
						hct_cost = 230;
					}
				}else if(hct_areaPlan === 2){
					if(hct_costPlan === 1){
						hct_cost = 220;
					}else if(hct_costPlan === 2){
						hct_cost = 280;
					}else if(hct_costPlan === 3){
						hct_cost = 320;
					}else if(hct_costPlan === 4){
						hct_cost = 360;
					}
				}
				

			}else if(lowTemp === true){//低溫寄件
				if(startArea === "island" || endArea === "island"){
					alert("【新竹貨運】 \n 離島地區無低溫寄送服務");
					hct_valid = false;
				}else{
					if(hct_costPlan === 1){
						hct_cost = 140;
					}else if(hct_costPlan === 2){
						hct_cost = 190;
					}else if(hct_costPlan === 3){
						hct_cost = 240;
					}else if(hct_costPlan === 4){
						alert("【新竹貨運】 \n 低溫服務尺寸不得超過120cm");
						hct_valid = false;
					}
				}
			}
		}
	}
	/*if(hct_valid === true){
		console.log("新竹貨運運費:" + hct_cost);
	}*/
} 

var hct_determindArea = function(place){

	var taiwanArea = ["台北市","新北市","基隆","桃園市","新竹縣","苗栗縣","台中市",
					  "彰化縣","雲林縣","嘉義縣","台南市","高雄市","屏東縣","南投縣",
					  "宜蘭縣","花蓮縣","台東縣","琉球地區"];
	var islandArea = ["澎湖縣","金門縣","琉球地區"]; 
	var invalidIslandArea =["東引地區","烏坵地區","馬祖地區","綠島地區","蘭嶼地區"]; 

	for(var i=0 ; i < taiwanArea.length ; i++){
		if(place === taiwanArea[i]){
			return "taiwan";
		}
	}
	for(var i=0 ; i<islandArea.length ; i++){
		if(place === islandArea[i]){
			return "island";
		}
	}
	for(var i=0 ; i < invalidIslandArea.length ; i++){
		if(place === invalidIslandArea[i]){
			return "invalid";
		}
	}
};

var module = { exports: {} };
// load eventemitter, problem solved without having to modify the code.

// exports method for other modules or files to use
module.exports.gov_determindCostPlan = gov_determindCostPlan;
module.exports.determindArea = determindArea;
module.exports.cat_determindArea = cat_determindArea;
module.exports.determindCostPlan = determindCostPlan;
module.exports.hct_determindArea = hct_determindArea;


