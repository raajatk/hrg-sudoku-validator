
var async = require("async");

var solution =      [[5, 3, 4, 6, 7, 8, 9, 1, 2],   //This is the Correct Solution
                     [6, 7, 2, 1, 9, 5, 3, 4, 8],
                     [1, 9, 8, 3, 4, 2, 5, 6, 7],
                     [8, 5, 9, 7, 6, 1, 4, 2, 3],
                     [4, 2, 6, 8, 5, 3, 7, 9, 1],
                     [7, 1, 3, 9, 2, 4, 8, 5, 6],
                     [9, 6, 1, 5, 3, 7, 2, 8, 4],
                     [2, 8, 7, 4, 1, 9, 6, 3, 5],
                     [3, 4, 5, 2, 8, 6, 1, 7, 9]];

// var solution =        [[5, 3, 4, 6, 7, 8, 9, 1, 2],   //This is the Incorrect Solution
//                        [6, 7, 2, 1, 9, 0, 3, 4, 8],
//                        [1, 0, 0, 3, 4, 2, 5, 6, 0],
//                        [8, 5, 9, 7, 6, 1, 0, 2, 0],
//                        [4, 2, 6, 8, 5, 3, 7, 9, 1],
//                        [7, 1, 3, 9, 2, 4, 8, 5, 6],
//                        [9, 0, 1, 5, 3, 7, 2, 1, 4],
//                        [2, 8, 7, 4, 1, 9, 6, 3, 5],
//                        [3, 0, 0, 4, 8, 1, 1, 7, 9]];

var rowsValidator = function(solution, callback){
  var flag = true;
  var i=0;
  async.whilst(function(){
    return i<9 && flag;
  },function(callback1){
    var rowMap = new Map();
    async.forEach(solution[i],function(element,next){
      if(!rowMap.has(element) && element>0 && element<10){
        rowMap.set(element);
      }else {
        flag = false; //on repetition
      }
      next();
    },function(err){
      if(rowMap.size!=9){
        flag = false
      }
      i=i+1;
      callback1();
    })
  },function(err){
    console.log("Rows Flag",flag);
    callback(false,{flag:flag});
  })
}

var columnValidator = function(solution, callback){
  var flag = true;
  var i=0;
  async.whilst(function(){
    return i<9 && flag;
  },function(callback1){
    var rowMap = new Map();

    var column = [solution[0][i],solution[1][i],solution[2][i],solution[3][i],solution[4][i],solution[5][i],solution[6][i],solution[7][i],solution[8][i]];

    async.forEach(column,function(element,next){
      if(!rowMap.has(element) && element>0 && element<10){
        rowMap.set(element);
      }else {
        flag = false; //on repetition
      }
      next();
    },function(err){
      if(rowMap.size!=9){
        flag = false
      }
      i=i+1;
      callback1();
    })
  },function(err){
    console.log("Column Flag",flag);
    callback(false,{flag:flag});
  })
}

var boxesMaker = function(solution, callback){
  var boxes = [];
  var box = [];
  var i=0;
  var j=0;
  var a=0;
  var b=0;

  async.whilst(function(){
    return i<=6;
  },function(callback1){
      j=0;
      async.whilst(function(){
        return j<=6;
      },function(callback2){
          a=0;
          async.whilst(function(){
            return a<3;
          },function(callback3){
              b=0;
              async.whilst(function(){
                return b<3;
              },function(callback4){
                  box.push(solution[i+a][j+b]);
                  b=b+1;
                  callback4();
              },function(err4){
                  a=a+1;
                  callback3();
              })
          },function(err3){
              boxes.push(box);
              box=[];

              j=j+3;
              callback2();
          })
      },function(err2){
          i=i+3;
          callback1();
      })
  },function(err1){
      callback(false,boxes);
  })
}

async.auto({
 validateRows:function(next, result){
   rowsValidator(solution, next);
 },
 validateColumns:function(next, result){
   columnValidator(solution, next);
 },
 makeBoxes:function(next, result){
   boxesMaker(solution, next);
 },
 validateBoxes:['makeBoxes',function(next,results){
   rowsValidator(next.makeBoxes, results);
 }]
},function(err,results){
  if(results.validateRows.flag && results.validateColumns.flag && results.validateBoxes.flag){
    console.log("The Sudoku Puzzle is Correct");
  }else {
    console.log("The Sudoku Puzzle is Incorrect");
  }
});
