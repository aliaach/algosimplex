window.onerror = myErrorTrap;
var epsilon = .00000000000001  
var maxSigDig = 13; 
var okToRoll = true;		
var stepName = "";		
var tab = unescape( "%09" );	
var cr = unescape( "%0D" );	
var lf = unescape( "%0A" );
var symb = unescape( "%C5" );
var backSlash = unescape( "%5C" );
var gteSymbol = unescape( "%B3" ); 
var lteSymbol = unescape( "%B2" );
var lte = unescape ("%u2264");	
var gte = unescape ("%u2265");
var comma = ",";
var singular = false;
var msFormat = false;
var maxRows = 15;
var maxCols = 30;
var numRows = 0;
var numCols = 0;
var numConstraints = 0;
var maximization = true;		
var phase1 = false;			
var objectiveName = "p";
var numVariables = 1;
var variables = [];
var theTableau = new makeArray2 (1,1);
var theStringTableau = new makeArray2 (1,1); 	
var starred = new makeArray(1);		
var TableauNumber = 1;				
var maxSteps = 50;					
var numSigDigs = 6;					
var activeVars = new Array();			
var maxDenom = 1000;  
var tol = .000000001; 
var tooBigString = "Too many matrices in your expression," + cr + "or your expression is too complicated." + cr +"Please keep it simple!"
var theSampleLPString = "Maximize p = 5x + 3y + z  subject to" + cr + "x + y + z <= 25" + cr + "2x + y - z >= 10" + cr + "y >= 8";
var theInstructionString = "Notes on formatting: " + cr + " (1) Variable names must begin with letters." + cr + tab + tab + "    (eg. p, x1, loss, z, s, t, u...) " + cr + " (2) For fraction inputs, keep the variable on the right." + cr + tab + tab + "    (eg. (1/3)x and not x/3) " + cr + " (3) Every variable you use must appear in the objective function, (but not"+cr+"     necessarily in the constraints). " + cr + tab + tab + "    (eg. p = 0x + 2y + 0z ) " + cr + " (4) The words 'maximize' (or 'minimize') and 'subject to' must appear. " + cr + " (5) Each inequality should be on its own line, as shown. " + cr + " (6) No need to enter the default constraints: x >= 0, y >= 0, z >= 0 etc."
var fractionMode = false;
var integerMode = false;
var okToRoll = true;
var browserName = navigator.appName;
var browserVersion = navigator.appVersion;
if ( (browserName == "Netscape") && (parseInt(browserVersion) >= 3)) browserName = "N";
else if ( (browserName == "Microsoft Internet Explorer") && (parseInt(browserVersion) >= 3) ) browserName = "M";
function myErrorTrap(message,url,linenumber) {
alert("Sorry, I can't process this." + cr +" Press 'Example' for general information.");
return (true);
} 
function hcf (a,b) {
var bigger = Math.abs(a);
var smaller = Math.abs(b);
var x = 0;
var theResult = 1;
if ( (a == 0) || (b == 0) ) return(1);
if (smaller > bigger) {x = bigger; bigger = smaller;  smaller = x}
var testRatio = roundSigDig(bigger/smaller, 11);
var testRatio2 = 0;
if (testRatio == Math.floor(testRatio) ) return (smaller)
else
	{
	var found = false;
	var upperlimit = smaller;
	for (var i = upperlimit; i >= 2; i--)
		{
		testRatio = roundSigDig(smaller/i, 10);
		testRatio2 = roundSigDig(bigger/i, 10);
		if  ( (testRatio == Math.floor(testRatio) ) && (testRatio2 == Math.floor(testRatio2) ) )
			{
			smaller = Math.round(smaller/i);
			smaller = Math.round(bigger/i);
			return(theResult *hcf(bigger, smaller) );
			}
		}
		return(theResult);
		}
alert("error!");
return(-1); 
} 
function lcm(a,b) {
var bigger = Math.abs(a);
var smaller = Math.abs(b);
var x = 0;
if ( (a == 0) || (b == 0) ) return(1);
if (smaller > bigger) {x = bigger; bigger = smaller;  smaller = x}
var testRatio = roundSigDig(bigger/smaller, 11)
if (testRatio == Math.floor(testRatio) ) return (bigger)
else
	{
	var found = false;
	for (var i = 2; i <= smaller; i++)
		{
		if (i*i >= smaller) break;
		testRatio = roundSigDig(smaller/i, 11);
		if (testRatio == Math.floor(testRatio) )
			{
			smaller = testRatio;
			bigger = bigger*i;
			return( lcm(bigger, smaller) );
			}
		}
		return(bigger*smaller);
		}
alert("error!");
return(-1); 
} 
function reduce(fraction){
with (Math)
	{
	var HCF = hcf(fraction[1], fraction[2]);
	fraction[1] = Math.round(fraction[1]/HCF);
	fraction[2] = Math.round(fraction[2]/HCF);
	} 
return(fraction);
} 
function toFracArr(x, maxDenom, tol) {
	var theFrac = new Array();
	theFrac[1] = 0;
	theFrac[2] = 0;
	var p1 = 1;
	var p2 = 0;
	var q1 = 0;	
	var q2 = 1;	
	var u =0;
	var t = 0;
	var flag = true;
	var negflag = false;
	var a = 0;
	var xIn = x; 
	if (x >10000000000) return(theFrac);
while (flag)
	{
	if (x<0) {x = -x; negflag = true; p1 = -p1}
	var intPart = Math.floor(x);
	var decimalPart = roundSigDig((x - intPart),15);
	x = decimalPart;
	a = intPart;
	t = a*p1 + p2;
	u = a*q1 + q2;
	if  ( (Math.abs(t) > 10000000000 ) || (u > maxDenom ) ) 
		{
			n = p1;
			d = q1;
			break;
		}
		p = t;
		q = u;
	if ( x == 0 )
		{
		n = p;
		d = q;
		break;
		}
		p2 = p1;
		p1 = p;
		q2 = q1;
		q1 = q;
		x = 1/x;
	} 
	theFrac[1] = n;
	theFrac[2] = d;
	return(theFrac);
} 
function toFrac(x, maxDenom, tol) {
	var theFrac = new Array();
	theFrac[1] = 0;
	theFrac[2] = 0;
	var p1 = 1;
	var p2 = 0;
	var q1 = 0;	
	var q2 = 1;	
	var u =0;
	var t = 0;
	var flag = true;
	var negflag = false;
	var a = 0;
	var xIn = x; 
	if (x >10000000000) return(theFrac);
while (flag)
	{
	if (x<0) {x = -x; negflag = true; p1 = -p1}
	var intPart = Math.floor(x);
	var decimalPart = roundSigDig((x - intPart),15);
	x = decimalPart;
	a = intPart;
	t = a*p1 + p2;
	u = a*q1 + q2;
	if  ( (Math.abs(t) > 10000000000 ) || (u > maxDenom ) ) 
		{
			n = p1;
			d = q1;
			break;
		}
		p = t;
		q = u;
	if ( x == 0 )
		{
		n = p;
		d = q;
		break;
		}
		p2 = p1;
		p1 = p;
		q2 = q1;
		q1 = q;
		x = 1/x;
	} 
	theFrac[1] = n;
	theFrac[2] = d;
	if (theFrac[2] == 1) return (theFrac[1].toString());
	else return (theFrac[1] + "/" + theFrac[2]);
} 
function lastChar(theString) {
if (theString == "") return(theString);
var len = theString.length;
return theString.charAt(len-1); 
}
function isCharHere (InString, RefString)  {
	if(InString.length!=1) 
		return (false);
	if (RefString.indexOf (InString, 0)==-1) 
		return (false);
	return (true);
}
function looksLikeANumber(theString) {
var result = true;
var length = theString.length;
if (length == 0) return (false);
var x = ""
var y = "1234567890-+*. /"
var yLength = y.length;
for (var i = 0; i <= length; i++)
	{ 
	x = theString.charAt(i);
		result = false;
		for (var j = 0; j <= yLength; j++) 
			{
			if (x == y.charAt(j)) {result = true; break}
			} 
	if (result == false) return(false);
	} 
return(result);
} 
function roundSix(theNumber) {
var x = (Math.round(1000000*theNumber))/1000000;
return(x);
}
function shiftRight(theNumber, k) {
	if (k == 0) return (theNumber)
	else
		{
		var k2 = 1;
		var num = k;
		if (num < 0) num = -num;
		for (var i = 1; i <= num; i++)
			{
			k2 = k2*10
			}
		}
	if (k>0) 
		{return(k2*theNumber)}
	else 
		{return(theNumber/k2)}
	}
function roundSigDig(theNumber, numDigits) {
		numDigits = numDigits -1		
	with (Math)
		{
		if (theNumber == 0) return(0);
		else if(abs(theNumber) < 0.000000000001) return(0);
		else
			{
			var k = floor(log(abs(theNumber))/log(10))-numDigits
			var k2 = shiftRight(round(shiftRight(abs(theNumber),-k)),k)
			if (theNumber > 0) return(k2);
			else return(-k2)
			} 
		}
	}
function looksLikeANumber(theString) {
var result = true;
var length = theString.length;
var x = ""
var y = "1234567890-+^*./ "
var yLength = y.length;
for (var i = 0; i <= length; i++)
	{ 
	x = theString.charAt(i);
		result = false;
		for (var j = 0; j <= yLength; j++) 
			{
			if (x == y.charAt(j)) {result = true; break}
			} 
	if (result == false) return(false);
	} 
return(result);
} 
function makeInteger(theMatrix, RowNum, ColNum,Strings) {
var rowArray = new makeArray2(ColNum,2);
var outArray = new makeArray2(RowNum,ColNum);
for (var i = 1; i <= RowNum; i++)
	{
	for (var j = 1; j <= ColNum; j++) 
		{
		for (var k = 1; k <= 2; k++) rowArray[j][k] = toFracArr(theMatrix[i][j],maxDenom, tol)[k];
		} 
	var rowLcm = 1;
	for (j = 1; j <= ColNum; j++) rowLcm = lcm(rowLcm,rowArray[j][2]);
	var x = 0;
	for  (j = 1; j <= ColNum; j++) 
		{ 
		x = rowLcm*rowArray[j][1]/rowArray[j][2];
		if (!Strings) outArray[i][j] = Math.round(x);
		else outArray[i][j] = Math.round(x).toString();
		} 
	outArray[0][j] = rowLcm;
	} 
return(outArray);
} 
function pivot(InMatrix,rows,cols,theRow,theCol) {
var thePivot = InMatrix[theRow][theCol];
activeVars[theRow] = theCol; 
starred[theRow] = 0; 
for (var i = 1; i <= cols; i++)
	{
	InMatrix[theRow][i] = InMatrix[theRow][i]/thePivot;
	} 
for (var i = 1; i <= rows; i++)
	{
	if ( (i != theRow) && (InMatrix[i][theCol] != 0) )
		{
		var factr = InMatrix[i][theCol];
		for (var j = 1; j <= cols; j++)
			{
			InMatrix[i][j] = roundSigDig(InMatrix[i][j],maxSigDig+2) - roundSigDig(factr*InMatrix[theRow][j],maxSigDig+2); 
			} 
		}
	} 
return(InMatrix);
}
function simplexMethod(InMatrix, rows, cols) {
var negIndicator = false;
var testRatio = new Array();
var theRow = 0; singular = false;
document.theSpreadsheet.expr.value = "working..";
while ( (phase1) && (TableauNumber <= maxSteps) )
	{
		var checkingForZeros = true;
		var foundAZero = false; 
		while(checkingForZeros) {
			checkingForZeros = false;
			for (i = 1; i <= numRows-1; i++)
				{
				if (starred[i] == 1)  break;
				} 
			theRowx = i;
			if (roundSigDig(InMatrix[theRowx][cols],maxSigDig)==0) InMatrix[theRowx][cols]=0;
			if ((InMatrix[theRowx][cols] == 0)&&(starred[theRowx] == 1)){
				checkingForZeros  = true;
				foundAZero = true;
				for (var j = 1; j <= cols-1; j++) {
					InMatrix[theRowx][j] *= -1;
					} 
				starred[theRowx] = 0;
				TableauNumber +=1;
				document.theSpreadsheet.expr.value += "..";
				displayMatrix(1);
				} 
			} 
		phase1 = false;
		for (var i = 1; i <= numConstraints; i++) {
			if (starred[i] == 1) {phase1 = true; break}
			} 
	if (phase1) {
		if(!foundAZero) {
			var rowmax = 0;
			for (i = 1; i <= numRows-1; i++)
				{
				if (starred[i] == 1) break;
				} 
			theRowx = i;
			for (j = 1; j <= numCols-2; j++)
				{
				numx = roundSigDig(InMatrix[i][j],10);
				if (numx > rowmax) {rowmax = numx; theColx = j;}
				} 
			if (rowmax == 0) {singular = true; displayFinalStatus(); return(InMatrix)}
			else
				{
				for (var i = 1; i <=rows-1; i++)
					{
					testRatio[i] = -1;
		if (roundSigDig(InMatrix[i][theColx],maxSigDig) >0) 
						{
						if (Math.abs(InMatrix[i][cols]) < epsilon) InMatrix[i][cols] = 0;
						testRatio[i] = InMatrix[i][cols]/ InMatrix[i][theColx];
						}
					} 
				var minRatio = 10000000000000;
				theRow = 0;			
				for (var i = 1; i <=rows-1; i++)
					{
					if ((testRatio[i] >= 0) && (testRatio[i] < minRatio))
						{
						minRatio = testRatio[i];
						theRow = i;
						} 
					else if ((testRatio[i] >= 0) && (testRatio[i] == minRatio))
						{
						if (starred[i] == 1) theRow = i;  
						else if (Math.random()>.5) theRow = i;
						}
					} 
				if (theRow == 0) {singular = true; displayFinalStatus(); return(InMatrix)}
				InMatrix = pivot(InMatrix,rows,cols,theRow,theColx);
			} 
			TableauNumber +=1;
			document.theSpreadsheet.expr.value += "..";
			displayMatrix(1);
			}
		} 
	}
var testnum = 0;
for (var i = 1; i <= cols-1; i++)
	{
	testnum = roundSigDig(InMatrix[rows][i],10)
	if (testnum<0)
		{
		negIndicator = true;
		}
	} 
var theCol = 0;
if (negIndicator) 
	{
	var minval = 0;
	for (i = 1; i <= cols-1; i++)
		{
		testnum = roundSigDig(InMatrix[rows][i],10);
		if (testnum<minval)
			{
			minval = testnum;
			theCol = i;
			}
	} 
	}
while  ( (negIndicator) && (TableauNumber <= maxSteps) ) 
	{
	for (var i = 1; i <=rows-1; i++)
		{
		testRatio[i] = -1;
		if (roundSigDig(InMatrix[i][theCol],maxSigDig) >0) 
			{
			if (Math.abs(InMatrix[i][cols]) < epsilon) InMatrix[i][cols] = 0;
			testRatio[i] = InMatrix[i][cols]/ InMatrix[i][theCol];
			}
		} 
	var minRatio = 10000000000000;
	theRow = 0;			
	for (var i = 1; i <=rows-1; i++)
		{
		if ((testRatio[i] >= 0) && (testRatio[i] < minRatio))
			{
			minRatio = testRatio[i];
			theRow = i;
			}
		else if ((testRatio[i] >= 0) && (testRatio[i] == minRatio))
						{
						if (Math.random()>.5) theRow = i;
						}
		} 
	if (theRow == 0) {singular = true; displayFinalStatus(); return(InMatrix)}
	InMatrix = pivot(InMatrix,rows,cols,theRow,theCol);
	TableauNumber +=1;
	document.theSpreadsheet.expr.value += "..";
	displayMatrix(1);
	negIndicator = false;
	for (var i = 1; i <= cols-1; i++)
		{
		if (roundSigDig(InMatrix[rows][i], 10) <0)
			{
			negIndicator = true;
			}
		} 
      if (negIndicator)  
      {
         var minval = 0;
         for (i = 1; i <= cols-1; i++)
         {
            testnum = roundSigDig(InMatrix[rows][i],10);
            if (testnum<minval)
            {
               minval = testnum;
               theCol = i;
            }
         } 
      }  
	} 
displayFinalStatus();
return(InMatrix);
} 
function checkString(InString,subString,backtrack)
{
var found = -1;
var theString = InString;
var Length = theString.length;
var symbLength = subString.length;
for (var i = Length- symbLength; i >-1; i--)
	{	
	TempChar=theString.substring (i, i+ symbLength);
	if (TempChar == subString) 
			{
			found = i;
			if (backtrack) i = -1
			}
	} 
return(found);
} 
function parser (InString, Sep)  {
	var NumSeps=0; var Count = 0;
	var location = new Array;
	location[0] = -1;
	var len = InString.length;
	for (Count=0; Count < len; Count++)  {
		if (InString.charAt(Count)==Sep)
			{
			NumSeps++;
			location[NumSeps] = Count;
			}
		}
	var parse = new makeArray (NumSeps+2);
	if (NumSeps == 0) {parse[0] = 1; parse[1] = InString; return(parse);}
	parse[0] = NumSeps + 1;  
	for (var i = 1; i <=NumSeps; i++)
		{
		parse[i] = InString.substring(location[i-1]+1, location[i]);
		}	
		parse[NumSeps+1] = InString.substring(location[NumSeps]+1, len);
	return (parse);
}
function parseLinearExpr(InString) {
InString = stripChar(InString,"(");   
InString = stripChar(InString,")");
var stringlen = InString.length
if (!looksLikeANumber(InString.charAt(0))) InString = "1" + InString;
if (InString.charAt(0) != "-") InString = "+"+ InString;
	var variableList = "";
	InString = replaceSubstring (InString,"+","_+");
	InString = replaceSubstring (InString,"-","_-");
	var ch = "_";
	var Ar = parser(InString, ch);
	var parsd = new makeArray (Ar[0]+1, "");
	for (var i = 1; i < Ar[0]; i++)
		{
		parsd[i] = stripChar(Ar[i+1],"_"); 
		}
var vars = [];
for (var i = 1; i < Ar[0]; i++)
	{
	vars[i-1] = /([a-zA-Z].*)/.exec(parsd[i])[1];
	parsd[i] = parsd[i].replace(/[a-zA-Z].*/, '');
	if (parsd[i] == "+") parsd[i] = "1";  
	else if  (parsd[i] == "-") parsd[i] = "-1";
	parsd[i] = stripChar(parsd[i],"+");
	}
parsd[0] = vars;
	return (parsd);
} 
function rightString (InString, num)  {
	OutString=InString.substring (InString.length-num, InString.length);
	return (OutString);
}
function rightTrim (InString)  {
	var length = InString.length;
	OutString=InString.substring(0,length-1);
	return (OutString);
}
function replaceChar (InString,oldSymbol,newSymbol)  {
	var OutString="";
	var TempChar = "";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=oldSymbol)
			OutString=OutString+TempChar
		else OutString=OutString+newSymbol;
	}
	return (OutString);
}
function replaceSubstring (InString,oldSubstring,newSubstring)  {
	OutString="";
	var sublength = oldSubstring.length;
	for (Count=0; Count < InString.length; Count++)  {
		TempStr=InString.substring (Count, Count+sublength);
		TempChar=InString.substring (Count, Count+1);
		if (TempStr!= oldSubstring)
			OutString=OutString+TempChar
		else 
			{
			OutString=OutString+ newSubstring;
			Count +=sublength-1
			}
	}
	return (OutString);
}
function sesame(url,hsize,vsize){ 
        var tb="toolbar=0,directories=0,status=0,menubar=0"
        tb+=",scrollbars=1,resizable=1,"
    var tbend="width="+hsize+",height="+vsize;
    if(tbend.indexOf("<undefined>")!=-1){tbend="width=550,height=400"}
        tb+=tbend
        Win_1 = window.open("","win1",tb);
        Win_1 = window.open(url,"win1",tb);
    }
function SetupTableau() {
if (!okToRoll) return (666);
maximization = true;
singular = false;		
var theString = document.theSpreadsheet.input.value; 
theString += cr;		
theString = stripSpaces(theString);
theString = stripChar(theString,tab);			
theString = stripChar(theString,":");			
theString = replaceSubstring(theString,lf, cr);	
theString = theString.toLowerCase();
theString = replaceSubstring(theString, "to", "to"+cr);
theString = replaceSubstring(theString, ",", cr);
theString = replaceSubstring(theString, cr+"subject", "subject"); 
var doublecr = true;
while (doublecr) 
	{
	if (checkString(theString,cr+cr,false) == -1) doublecr = false;
	else theString = replaceSubstring(theString,cr+cr,cr);
	}
if (lastChar(theString) == cr) theString = rightTrim(theString,1);
theString = replaceSubstring(theString, "<=", lteSymbol);
theString = replaceSubstring(theString, ">=", gteSymbol);
theString = replaceSubstring(theString, lte, lteSymbol);
theString = replaceSubstring(theString, gte, gteSymbol);
var check = checkString(theString,"maxi",false)
if (check == -1) 
	{check = checkString(theString,"mini",false); maximization = false; phase1 = true}
if (check == -1) { document.theSpreadsheet.expr.value = "Huh?"; document.theSpreadsheet.output.value = "That does not look like a linear programming problem to me!" + cr + cr + "Press Example to see how to type one in." ; okToRoll = false; return(666);}
len = theString.length;
theString = theString.substring(check,len);
var tempAr = parser(theString,cr); 
var numConstTemp = tempAr[0]-1;
for (var i = 2; i <= numConstTemp+1; i++) {
	if (tempAr[i] && tempAr[i].match(/=/)) {
		tempAr[i] = tempAr[i].replace(/=/, lteSymbol);
		tempAr[numConstTemp+2] = tempAr[i].replace(lteSymbol, gteSymbol);
		numConstTemp += 1;
		tempAr[0] += 1;
	}
}
var line1 = tempAr[1];
check = checkString(line1,"subj",true);
if (check > 0) line1 = line1.substring(0,check);
check = checkString(line1,"=",false);
if (check <=0) return(666);
objectiveName = line1.charAt(check-1);
len = line1.length;
var expression = line1.substring(check+1,len);
var OBJ = parseLinearExpr(expression);
variables = OBJ[0];
numConstraints = tempAr[0]-1;
numVariables = variables.length;
numRows = numConstraints+1;
numCols = numRows + numVariables + 1;
theTableau = new makeArray2 (numRows,numCols);
theStringTableau = new makeArray2 (numRows,numCols); 
if (phase1) starred = new makeArray(numRows);		
for (var j = 1; j <= numCols; j++) theTableau[numRows][j] = 0; 
for (var i = 1; i <= numVariables; i++)
	{
	if (maximization) theTableau[numRows][i] = -eval(OBJ[i]);
	else theTableau[numRows][i] = eval(OBJ[i]);
	}
theTableau[numRows][numCols-1] = 1;
theTableau[numRows][numCols] = 0;
theString = tempAr[2];
var x = checkString(theString,"to",false);
len = theString.length;
if (x != -1) theString = theString.substring(x+2,len);
tempAr[2] = theString;
var GTE = false; 
for (var i = 1; i <= numConstraints; i++)
	{
	activeVars[i] = i + numVariables;
	starred[i] = 0;
	GTE = false;
	twoPart = parser(tempAr[1+i], lteSymbol);
	if (twoPart[0] < 2) {
		twoPart = parser(tempAr[1+i], gteSymbol); phase1 = true; GTE = true;
		}
	if (twoPart[0] <2) 
		{ 
		i += 1; 
		okToRoll = false; 
		document.theSpreadsheet.expr.value = "Huh? The expression in line " + i + " does not look like an inequality to me!"; 
		return (666)
		}
	var leftHandSide = parseLinearExpr(twoPart[1]);
	for (var j = 1; j <= numCols; j++) theTableau[i][j] = 0;	
	theTableau[i][numCols] = eval(twoPart [2]); 		
	if (GTE) {
		theTableau[i][numVariables + i] = -1;
		starred[i] = 1;
		phase1 = true;
			}
	else theTableau[i][numVariables + i] = 1;
	var theIndex = 0;
	for (var j = 1; j <= numVariables; j++)
		{
		theVar = variables[j-1];
				theIndex = -1;
				for (var k = 0; k < leftHandSide[0].length; k++) {
					if (leftHandSide[0][k] == theVar) {
						theIndex = k;
						break;
					}
				}
				if (theIndex == -1) theTableau[i][j] = 0;
				else theTableau[i][j] = eval(leftHandSide[theIndex+1]); 
		}
	} 
displayMatrix(1);
return(1);
} 
function displayFinalStatus() {
if  (TableauNumber > maxSteps) document.theSpreadsheet.expr.value = "No optimal solution found after 50 steps. Aborted."
else if (singular) document.theSpreadsheet.expr.value = "No optimal solution exists for this problem."
else
	{
	document.theSpreadsheet.expr.value = "Optimal Solution: " + objectiveName + " = ";
	var numx = 0; var theRowx = 0; var theColx = 0; var count = 0; var theChar = ""; 
	var theStr = ""; 
	var objectiveVal = theTableau[numRows][numCols];
	if (!maximization) objectiveVal = - objectiveVal;
	if ((fractionMode) || (integerMode)) document.theSpreadsheet.expr.value += toFrac (roundSigDig(objectiveVal,15), maxDenom, tol) + "; ";  else
			document.theSpreadsheet.expr.value  += roundSigDig(objectiveVal, numSigDigs).toString() + "; ";
	var thePivotPosn = new Array();
	var useThis = true;
	for (var j = 1; j <= numVariables; j++)
		{ 
		useThis = true;
		count = 0;
		theRowx = 0; 
		theChar = variables[j-1];		
		thePivotPosn[j] = 0;
		useThis = true;
		document.theSpreadsheet.expr.value += theChar + " = ";
		for (var i = 1; i <= numRows; i++)
			{
			numx = roundSigDig(theTableau[i][j],10);
			if (numx != 0)
				{
				count++; 
				if (numx != 0) theRowx = i
				}
			} 
		if ((count == 1) && (roundSigDig(theTableau[theRowx][j],10)> 0))
		 	 {
			thePivotPosn[j] = theRowx; 
			if(theRowx==numRows) useThis=false; 
			for (var u = 1; u <= j-1; u++) if (thePivotPosn[j] == thePivotPosn[u]) useThis = false;
			if (useThis) {
				if ((fractionMode) || (integerMode)) theStr = toFrac (roundSigDig((theTableau[theRowx][numCols]/theTableau[theRowx][j]),15), maxDenom, tol);  
				else theStr = roundSigDig((theTableau[theRowx][numCols]/theTableau[theRowx][j]),numSigDigs).toString();
					}
				else theStr = "0";
				if (j < numVariables) theStr += ", "; 
				document.theSpreadsheet.expr.value += theStr;
			} 
		else 
			{
			theStr = "0";
			if (j < numVariables) theStr += ", "; 								document.theSpreadsheet.expr.value += theStr;
			}
		} 
	} 
}
function displayMatrix(number) {
var theString = "Tableau #" + TableauNumber + cr;
if (singular) theString += "undefined";
else
{
var RowNum = numRows;
var ColNum = numCols;
var maxLength = 1;
var x = "", i=0, j=0, k=0;
var xLen = 0;
if (integerMode) theStringTableau = makeInteger(theTableau, RowNum, ColNum,true);
else {
	for (i = 1; i <= RowNum; i++)
	{ 
	for (j = 1; j <= ColNum; j++) 
		{ 
if (fractionMode) x = toFrac (roundSigDig(theTableau[i][j],15) , maxDenom, tol);  
	else x = roundSigDig(theTableau[i][j], numSigDigs).toString();
		xLen = x.length; 
		if (xLen > maxLength) maxLength = xLen; 
		theStringTableau[i][j] = x; 
		} 
	} 
	} 
if (maxLength < 6) maxLength = 6;  
	var spaceString = "";
	for (i = 0; i <= RowNum; i++) 
		{
		for (j = 1; j <= ColNum; j++) 
			{ 
			if (i == 0)
				{ 
				if  (j <= numVariables)  x = variables[j-1];
				else if (j == numVariables + numConstraints + 1) {x = objectiveName; if (!maximization) x = "-"+x;}
				else if (j < ColNum) { var mmm = j - numVariables ; x = "s" + mmm.toString();}
				else if (j == ColNum) x = " ";
				} 
			else x = theStringTableau[i][j];
			sp = maxLength - x.length
			spaceString = "";
			for (k = 0; k <= sp; k++) spaceString += " ";
			theString += x + spaceString;
			} 
		theString += cr;
		} 
} 
document.theSpreadsheet.output.value += theString + cr;
return(0);
}
function makeArray3 (X,Y,Z)
	{
	var count;
	this.length = X+1;
	for (var count = 1; count <= X+1; count++)
		this[count] = new makeArray2(Y,Z);
	} 
function makeArray2 (X,Y)
	{
	var count;
	this.length = X+1;
	for (var count = 0; count <= X+1; count++)
		this[count] = new makeArray(Y);
	} 
function makeArray (Y)
	{
	var count;
	this.length = Y+1;
	for (var count = 1; count <= Y+1; count++)
		this[count] = 0;
	} 
function stripSpaces (InString)  {
	OutString="";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=" ")
			OutString=OutString+TempChar;
		}
	return (OutString);
	}
function stripChar (InString,symbol)  {
	OutString="";
	for (Count=0; Count < InString.length; Count++)  {
		TempChar=InString.substring (Count, Count+1);
		if (TempChar!=symbol)
			OutString=OutString+TempChar;
	}
	return (OutString);
}
function doIt(){
	fractionMode = false;
	integerMode = false;
	var theMode = document.theSpreadsheet.Mode.selectedIndex;
	if (document.theSpreadsheet.Mode.options[theMode].text == "Fraction") fractionMode = true;
	else if (document.theSpreadsheet.Mode.options[theMode].text == "Integer") integerMode = true;
	var num = doIt.arguments[0];
	if (num == 1)
		{
		if (okToRoll)
			{
			TableauNumber = 1;
			document.theSpreadsheet.output.value = ""; 	
			SetupTableau();
			} 
		if (okToRoll) 
			{
			theTableau = simplexMethod(theTableau,numRows,numCols);
			}
		} 
	else  if (num == 2)
		{
		okToRoll = true;
		stepName = "Rounding information"
		var accuracydig = document.theSpreadsheet.acc.value;
		if ( (accuracydig == "") || (!looksLikeANumber(accuracydig)) ) { document.theSpreadsheet.expr.value = "Enter a value for the accuracy (Rounding) in the range 1-13."; okToRoll = false}
		if (okToRoll)
			{ 
			var thenum = eval(accuracydig); 
			if ((thenum < 1) || (thenum > 14)) {document.theSpreadsheet.expr.value = "Accuracy (Rounding) must be in the range 1-13."; okToRoll = false}
			else numSigDigs =thenum;
		if (document.theSpreadsheet.input.value == "") {document.theSpreadsheet.expr.value = "Enter a linear programming problem above (or press Example)."; okToRoll = false; }
			} 
		} 
	else  if (num == 3)
		{
		document.theSpreadsheet.input.value = "";
		document.theSpreadsheet.output.value = "";
		document.theSpreadsheet.expr.value = "";
		}
	else  if (num == 4)
		{
		} 
	else  if (num == 5)
		{
		document.theSpreadsheet.input.value = theSampleLPString;
		if (document.theSpreadsheet.acc.value == "") document.theSpreadsheet.acc.value = numSigDigs;
		document.theSpreadsheet.expr.value = "Press 'Solve' to solve the given problem.";
		document.theSpreadsheet.output.value =  theInstructionString;
		}
	else  if (num == 6)
		{
		} 
}
