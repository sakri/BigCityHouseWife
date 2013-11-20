(function (window){

	var BCHWArrayUtil=function(){};
	
	BCHWArrayUtil.shuffle = function(array){
		//console.log("BCHWArrayUtil.shuffle : "+array);
		var copy=[];
		while(array.length>0){
			var num=array.splice(Math.floor(Math.random()*array.length),1);
			copy.push(num[0]);
		}
		//console.log("copy : "+copy);
		return copy;
	};
	
	BCHWArrayUtil.createSequentialNumericArray = function(length){
		var array=[];
		for(var i=0;i<length;i++){
			array[i]=i;
		}
		return array;
	};
	
	
	window.BCHWArrayUtil=BCHWArrayUtil;
	
}(window));