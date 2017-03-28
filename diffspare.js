var primefactors = new Array();
var paths = new Array();
var checknum = 0;
var mult = 2;
var permutations = new Array();
var permnum = 0;
var duperms = new Array();
var inarr = 0;
var lastplen = 0;
var decremarray = new Array();
var diffarr = new Array();
var meandiff = 80;
var allperms = new Array();
var diffscores = new Array();
var contdiffscores = new Array();
contdiffscores[0] = new Array();
contdiffscores[1] = new Array();
contdiffscores[2] = new Array();

storediff();

function storediff (){
	dotheperms(mult);
	diffscores[mult-2] = meandiff;
	mult++;
	paths = [];
	permutations = [];
	duperms = [];
	checknum = 0;
	permnum = 0;
	inarr = 0;
	lastplen = 0;
	if (mult < 101){
		storediff();
	}
	//remove unusuable values
	var d = 0;
	var e = 0;
	while (d < diffscores.length){
		if (diffscores[d] != 0.0){
			contdiffscores[0][e] = d+2;
			contdiffscores[1][e] = diffscores[d];
			d++;
			e++;
		}
		else{
			d++;
		}
	}
	goodtogo = true;
}


function chunk (n){
	var chunkness = 0;
	switch(n){
		case "1": chunkness = 1;
		break;
		case "10": chunkness = 2;
		break;
		case "2": chunkness = 4;
		break;
		case "5": chunkness = 4.5;
		break;
		case "4": chunkness = 5;
		break;
		case "6": chunkness = 5.5;
		break;
		case "9": chunkness = 5;
		break;
		case "8": chunkness = 6;
		break;
		case "3": chunkness = 7;
		break;
		case "7": chunkness = 9;
		break;
		case "0": chunkness = 0;
		break;
	}
	return chunkness;
}

function dothediffs (){
	diffarr = [];
	var l = 0;
	while (l < duperms.length){
		var permsum = 0;
		var pl = 0;
		while (pl < duperms[l].length){
			var permchar = duperms[l].substr(pl,1);
			if (permchar == "1"){
				permchar = "10";
			}
			var chkval = chunk(permchar);
			permsum += chkval;
			pl++;
		}
		diffarr.push(permsum);
		l++;
	}
	l = 0;
	meandiff = 0; 
	while (l < diffarr.length){
		meandiff += diffarr[l];
		l++;
	}
	meandiff = meandiff/l;
	meandiff = parseFloat(meandiff).toFixed(1);	
}

function dotheperms(target){
	mult = target;
	get_primefactors(mult);
	while (inarr < paths.length){
		if (inarr == (paths.length)-1){
			if (paths[inarr][0].length != null && paths[inarr][0].length != 0){
				contdiffscores[2].push(paths[inarr][0].length);
			}
		}
		
		var inputArray = paths[inarr][0];
		var inputArrayString = inputArray.toString();
		decremarray[inarr] = new Array();
		var c = 0;
		var charnow;
		var intnow;
		while (c < inputArrayString.length){
			charnow =  inputArrayString.substr(c,1);
			if (charnow == "1"){
				charnow = "10";
			}		
			if (charnow != "," && charnow != "0"){
				intnow = parseInt(charnow);
				intnow--;
				decremarray[inarr].push(intnow);
			}
			c++;
		}
		permutator();
		inarr++;
	}
	dothediffs();
}

var t = 0;
while (t < allperms.length){
	t++;
}


function permutator(){
	var result = decremarray[inarr].reduce(function permute(res, item, key, arr) {
		return res.concat(arr.length > 1 && arr.slice(0, key).concat(arr.slice(key + 1)).reduce(permute, []).map(function(perm) { return [item].concat(perm); }) || item);
	}, []);
	var resultstring = result.toString();
	resultstring = resultstring.replace( /,/g, "" );	
	//Special cases for 100 and 200
	if (resultstring == "10101010"){
		resultstring = "1010";
	}
	if (resultstring == "210102101010210101021021010102"){
		resultstring = "21010";
	}
	//
	//split result into ints with product = mult
	var resc = 0;
	var numnow = 0;
	var sum = 0;
	var lastin = 0;
	
	if (inarr > 0){
		lastplen = permnum+1;
	}
	else {
		lastplen = 1;
	}
	
	while (resc < resultstring.length){
		numnow = parseInt(resultstring.substr(resc,1))+1;
		if (sum == 0){
			sum = numnow;
			lastin =  resc;
		}
		else if (sum < mult){
			sum = sum*numnow;	
		}
		if (sum == mult){
			sum = 0;
			var tmp = resultstring.substr(lastin,(resc-lastin)+1);
		//add one to each char of tmp
			var t = 0;
			var tint;
			var tinstr;
			var tmpadd = "";
			while (t < tmp.length){
				tint = parseInt(tmp.substr(t,1))+1;
				tinstr = tint.toString();
				tmpadd = tmpadd + tinstr;
				t++;
			}
			permutations[permnum] = tmpadd; 
			if (permutations[permnum] == "1"){
				permutations[permnum] = "10";
			}
				permnum++;
				lastin =  resc;
			}
		resc++;
	}
	//REMOVE DUPLICATES HERE BY COPYING EACH ITEM INTO A DUPLICATES ARRAY (L TO R) ONLY IF IT IS NOT ALREADY INCLUDED IN THAT ARRAY
	
	var lo = lastplen-1;
	var hi = permnum-1;
	
	if (permutations[lo] == null){
		permutations[lo] = resultstring;
	}
	var l1 = permutations[lo].length;
	var lnew = permutations[lo].substr(l1-1,1);
	if (lnew == "1"){
		permutations[lo] = permutations[lo]+"0";
	}
	duperms.push(permutations[lo]);
	
	if (hi-lo == 1){
		if (permutations[hi] != permutations[hi-1]){
			duperms.push(permutations[hi]);
		}
	}
	else{
		var mindex = lo+1;
		while (mindex < hi+1){
			var dupfix = parseInt(permutations[mindex]);
			var subdex = 0;
			var isdup = false;
			while (subdex < duperms.length){
				var dupdex = 0;
				var dupflex = parseInt(duperms[subdex]);
				if (dupfix == dupflex){  //dupfix is already in duperms so do not add it to duperms
					isdup = true;	
				}
				subdex++;
			}
			if (isdup == false){
				duperms.push(permutations[mindex]);
			}
		mindex++;
		}
	}
}
  




function get_primefactors (mult) {
	var i = 2;
	var big = mult;
	var primechecked = 2;
	primefactors = [];
	while (i<=big){
		if (big%i == 0){
			primechecked = check_prime;
			while (primechecked > i){	
				check_prime(i);
			}
			big = big/i;
			if (i<11){
				primefactors.push(i);
			}
			else{
				primefactors = [];
			}
		}
		else{
			i++;
		}
	}
	paths[0] = new Array();
	paths[0].push(primefactors);
	var donot = false;
	if (primefactors.length == 1){
	var item = primefactors[0];
		if ((item == 2) || (item == 3) || (item == 5) || (item == 7))  {
			donot = true;
		}
	}
	if (donot == false){
		var pathnow = paths[0];
		make_paths.apply(this,pathnow);
	}
}

function check_prime (i){
	var i = i;
	var j = 2;
	while (j<(i-1)){
		if (i%j == 0){
			return j;
		}
		else{
			j++;
		}
	}
	return i;
}


function make_paths (pathnow){	
	var pathnum = 0;
	var currentpath = pathnow;
	var pathsadded = 0;
	var pathsin = paths.length;
	var skip = false;
	if (currentpath.length == 1){
		if (checknum != 0){
			skip = true;
			checknum = paths.length;
		}
		else{
			var item = pathnow[0];
			if ((item == 2) || (item == 3) || (item == 5) || (item == 7))  {
				skip = true;
				pathnum++;
				paths[pathnum] = new Array(0);
				paths[pathnum].push(currentpath);			
			}
		}
	}
	//MAKE CANONICAL SET OF FACTORS 
	if (skip == false){
		var unique = new Array();
		var u = 0;
		var lastu = 0;
		while (u < currentpath.length){
			if (u > 0){
				lastu = currentpath[u-1];
			}
			if (currentpath[u] != lastu){
				var fnow = currentpath[u];
				var uadded = false;
				var w = 0;
				while (uadded == false){
					if (fnow != unique[w]){
						uadded = true;
						unique.push(fnow);
					}
					w++;
				}
				u++;
			}
			else{
				u++;
			}
		}
	}
	//END MAKE SET OF FACTORS
	
	//ITERATE THROUGH CURRENTPATH
	if (skip == false){
		var len = unique.length-1;
		var ldex = 0;
		var rdex = 1;
		var lval = 0;
		var rval = 0;
		var product = 0;
		pathnum = paths.length;
		var newudex = 0;
		var newuval = 0;
		var holder = new Array();
		var lhold = new Array();
		var rold = new Array();
		var ended = false;
		while (ended == false){
			lval = currentpath[ldex];
			rval = currentpath[rdex];
			product = lval*rval;
			if ((product < 11) && (ldex != rdex)){	//PATH HAS BEEN MODIFIED BY COMPRESSION
				holder = pathnow.slice(0);
				rhold = [];
				lhold = [];
				holder[rdex] = product;
				var ldeeqv = 0;
				if (ldex-1 == -1){
					ldexeqv = 0;
				}
				else{
					ldexeqv = ldex;
				}
				lhold = holder.slice(0,ldexeqv);	//LEFT SIDE OF HOLDER IS EVERYTHING BEFORE LDEX
				rhold = holder.slice(ldexeqv+1,holder.length);	//RIGHT SIDE OF HOLDER IS LDEX+1 TILL END
				lhold.push.apply(lhold,rhold);
				holder = lhold.slice(0);
				holder.sort(function(a, b){return a-b});
			
				//CHECK FOR DUPLICATES PATHS THAT SHOULD NOT BE INCLUDED.
				var d = 0;
				var duplicated = false;
				while (d < paths.length){
					if (d != pathnum){
						var p1 = holder.toString();
						var p2 = paths[d].toString();
						if (p1 == p2){
							duplicated = true;
						}
					}
					d++;
				}
				//END CHECK FOR DUPLICATES PATHS THAT SHOULD NOT BE INCLUDED.

				if (duplicated == false){
					paths[pathnum] = new Array(0);
					paths[pathnum].push(holder);
					pathnum++;
				}
			}
			//ADJUST LDEX AND RDEX, REGARDLESS OF WHETHER A NEW PATH WAS MADE
			if (rval == lval){
				if (rval == unique[len]){
					ended = true;
				}
				else{	//SET NEW RIGHT SIDE LIMIT BUT LEAVE LEFT SIDE LIMIT AS IS
					newudex = (unique.indexOf(rval))+1;
					newuval = unique[newudex];
					rdex = currentpath.indexOf(newuval);
					ldex++;
				}
			}
			else if (rval > lval){
				if (rval == unique[len]){	//RIGHT SIDE LIMIT REACHED. SET NEW LEFT SIDE LIMIT AND RIGHT SIDE LIMIT IS 1 INDEX GREATER
					newudex = (unique.indexOf(lval))+1;
					newuval = unique[newudex];
					ldex = currentpath.indexOf(newuval);
					rdex = ldex+1;
					if (rdex == currentpath.length){
						rdex = ldex;
					}
				}
				else{	//SET NEW RIGHT SIDE LIMIT BUT LEAVE LEFT SIDE LIMIT AS IS
					newudex = (unique.indexOf(rval))+1;
					newuval = unique[newudex];
					rdex = currentpath.indexOf(newuval);
				}
			}
		}
	}
	
	//RECURSE FUNCTION
	checknum++;
	if (checknum < paths.length){	
		pathnow = paths[checknum];
		var pa = pathnow[0];
		pathnow = pa;
		pathnow.sort(function(a, b){return a-b});
		make_paths(pathnow);
	}
	//else{
		//var show = 0;
		//while (show < paths.length){
			//alert(show+"> "+paths[show]);
			//show++;
		//}
	//}
}
