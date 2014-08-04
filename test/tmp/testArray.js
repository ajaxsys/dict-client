eqDeep([ ['Y','Y','Y','Y'], ['X','X','X','X'], ['Y','X','Y','X'] ],  strToMatrix("YYYY\nXXXX\nYXYX"));

// "YYYY\nXXXX\nYXYX"
// -->
// [ ['Y','Y','Y','Y'], ['X','X','X','X'], ['Y','X','Y','X'] ]
function strToMatrix(str, splitter){
  splitter = splitter || '';
  var lines = str.split('\n'), matrix = [];

  for (var i in lines){
    var line = lines[i];
    //lines.forEach(function(line){
    var arr = line.split(splitter);
    matrix.push(arr);
  }

  return matrix;
}






eqDeep({"Y":[["Y","Y","Y"]],"X":[["X","X","X"]],"Z":[["X","Y","X"],["A","B","C"]]}    , matrixToMap(strToMatrix("YYYY\nXXXX\nZXYX\nZABC"),  0 ));
eqDeep({"Y":[["Y","Y","Y"]],"X":[["X","X","X"],["Z","X","Y"]],"C":[["Z","A","B"]]}    , matrixToMap(strToMatrix("YYYY\nXXXX\nZXYX\nZABC"),  3 ));

eqDeep({"Y":["Y","Y","Y"],"X":["X","X","X"],"Z":["X","Y","X"]}                        , matrixToMap(strToMatrix("YYYY\nXXXX\nZXYX\nZABC"),  0, 'override'));
eqDeep({"Y":["Y","Y","Y"],"X":["X","X","X"],"C":["Z","A","B"]}                        , matrixToMap(strToMatrix("YYYY\nXXXX\nZXYX\nZABC"),  3, 'override'));

// keyIdx must > matrix[N].length
function matrixToMap(matrix, keyIdx, isOverride){
  var obj = {};
  for (var i in matrix){
    var arr = matrix[i];
    var key = arr[keyIdx];
    arr.splice(keyIdx, 1); // NOTICE: arr changed
                           // it return the removed array e.g: ['X'] return
    if (isOverride) {
      /* Only keep the 1st values */
      if (!obj[key]){
        obj[key] = arr;
      }
    } else {
      /* Multi values added to arrays */
      if (obj[key]) {
        //obj[key].splice(0,0, arr); // Add first
        obj[key].push(arr); // Add last
      } else {
        obj[key] = new Array(arr);
        // OR:
        //obj[key] = [];
        //obj[key].push(arr); // NOTICE: push return a Int, which is the length of array
      }

    }
  }
  return obj;
}

var mmap = matrixToMap(strToMatrix("YYYY\nXXXX\nZXYX\nZABC"),  3 );

var keys = Object.keys(mmap);
eqDeep([ 'Y', 'X', 'C' ], keys)

keys.sort();
eqDeep([ 'C', 'X', 'Y' ], keys)

// Fast way get values
// {"Y":[["Y","Y","Y"]],"X":[["X","X","X"],["Z","X","Y"]],"C":[["Z","A","B"]]} 
var values = keys.map(function (k){return mmap[k];});
eqDeep([ 
  [ [ 'Z', 'A', 'B' ] ],
  [ [ 'X', 'X', 'X' ], [ 'Z', 'X', 'Y' ] ],
  [ [ 'Y', 'Y', 'Y' ] ] 
  ]     , values);





eqDeep( '\nabc\ndef\nefg'  ,removeBlankLine("      \t\nabc\n\ndef\n\t\t\nefg"));

function removeBlankLine(str){
  return str.split(/[ \t\n]+/).join("\n");
}





eqDeep( [["k1","v11","v12"],["k2","v21","v22"],["k3","v31","v32"]]         
  ,     arrayToMatrix(['k1','v11', 'v12', 'k2', 'v21','v22', 'k3', 'v31', 'v32'], 3));
eqDeep( [["v11","v12","k2"],["v21","v22","k3"]]
  ,     arrayToMatrix(['k1','v11', 'v12', 'k2', 'v21','v22', 'k3', 'v31', 'v32'], 3, 1));
eqDeep( [["k1","v11","v12","k2"],["v21","v22","k3","v31"]]
  ,     arrayToMatrix(['k1','v11', 'v12', 'k2', 'v21','v22', 'k3', 'v31', 'v32'], 4));


function arrayToMatrix(arr, splitSize, keyStartIdx) {
  var keyIdx = keyStartIdx || 0;
  var re = [];
  while ( (keyIdx + splitSize) <= arr.length ){
    var key = arr[keyIdx];
    re.push( arr.slice(keyIdx, keyIdx + splitSize) );
    keyIdx += splitSize;
  }
  return re;
}


eqDeep( {"k1":["v11","v12"],"k2":["v21","v22"],"k3":["v31","v32"]}
  ,     matrixToMap(arrayToMatrix(['k1','v11', 'v12', 'k2', 'v21','v22', 'k3', 'v31', 'v32'], 3), 0, true)     );
eqDeep( {"k1":[["v11","v12"]],"k2":[["v21","v22"]],"k3":[["v31","v32"]]}
  ,     matrixToMap(arrayToMatrix(['k1','v11', 'v12', 'k2', 'v21','v22', 'k3', 'v31', 'v32'], 3), 0)           );

eqDeep( "", "a");
eqDeep( {}, {"a":null});
eqDeep( [], ["a",null]);


function eqDeep(exp, val) {
  if (Array.isArray(exp) && Array.isArray(val)){
    if (exp.toString() !== val.toString()) {
      console.log('FATAL, array expected:`'+exp+'`\n              but was:`'+val+'`');
    }
  } else if (typeof exp === 'object' && typeof val === 'object') {
    if (JSON.stringify(exp) !== JSON.stringify(val)){
      console.log('FATAL, object expected:`'+JSON.stringify(exp)+'`\n               but was:`'+JSON.stringify(val)+'`');
    }
  } else {
    if (exp !== val){
      console.log('FATAL, expected:`'+exp+'`\n        but was:`'+val+'`');
    }
  }
}