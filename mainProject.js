//main 3 modules 
//budget module
var budgetController = (function(){
var Income = function(id,description,value ,date) {
    this.id = id ;
    this.description=description ;
    this.date=date ;
    this.value=value ;
} ;
var Expenses= function(id,description,value , date) {
    this.id = id ;
    this.description=description ;
    this.date=date ;
    this.value=value ;
}
var data = {
    allItems : {
    inc : [] ,
    exp:[]
} ,
total : {
    inc: 0 ,
    exp : 0 ,
},
totalbudget : 0 ,
percentage : -1 

}

// helper method 
var calculations = function(type) {
    // total incom & expenses 
    var sum = 0 ;
    data.allItems[type].forEach(function(current){
      sum += current.value ;
    });
    data.total[type] = sum ;
}
return {
    addbudget : function(type , description , value ,date){
        if (data.allItems[type].length > 0) {
            var id = data.allItems[type][data.allItems[type].length -1].id + 1 ; 
        }else {
            id =0 ;
        }
            if (type === 'inc') {
            var newItem = new Income(id , description ,date, value );
        }else if (type === 'exp') {
            var newItem = new Expenses(id , description ,date, value );
        }
        data.allItems[type].push(newItem);
        return newItem
    } ,
    // delete items 
    deleteItems : function(type,ID){
        var ids , index ;
      ids = data.allItems[type].map(function(current){
         return  current.id ;
       });
       index = ids.indexOf(ID);
       if(index !== -1){
          data.allItems[type].splice(index , 1);
       }

       
    },

    caculateBudget: function(){
   // 1. calculations
     calculations('inc');
     calculations('exp');
     // inc - exp 
     data.totalbudget = data.total.inc - data.total.exp ;
    
     // percentage 
     if(data.total.inc > 0) {
       data.percentage = Math.round((data.total.exp / data.totalbudget) * 100);
     }else {
       data.percentage = -1 ;
     }
     //2. return values 
     return {
      incoms: data.total.inc ,
      exps: data.total.exp ,
      tot : data.totalbudget,
      per : data.percentage ,
     } 

    },
    test : function() {
        console.log(data);
    }
}


})();
// UI module
var uiController = (function(){
    domInputs ={
        inputType : '.add__type',
        inputDes : '.add__description',
        inputDate:'.add__date',
        inputVal : '.add__value',
        inputBtn :'.add__btn' ,
        incomeList : '.income-list',
        expensesList : '.expenses-list',
        budgetLable: '.budget__lable',
        incomLable: '.income__lable',
        expenseLable: '.expense__lable',
        percentageLable:'.percentage__lable',
        container: '.mainn'
    }
   return {
     getData : function(){
       return {
           type : document.querySelector(domInputs.inputType).value ,
           description : document.querySelector(domInputs.inputDes).value ,
           date : document.querySelector(domInputs.inputDate).value ,
           value : parseFloat(document.querySelector(domInputs.inputVal).value) ,
       }; 
      
    },
    addListItem : function(obj,type) {
        var html  ,element ;
        if (type =='inc') {
            element = domInputs.incomeList ;
         html =  '<div class="inc"><div class="inc-item d-flex justify-content-between mb-2" id="inc-Id "><span class="green">value</span><span>date</span><span>description</span><span><a href="#"><i class="far fa-trash-alt red"></i></a></span></div></div>' ;
        }else if (type=='exp') {
            element=domInputs.expensesList ;
            html = '<div class="exp"><div class="exp-item d-flex justify-content-between mb-2 " id="exp-Id"><span class="red">value</span><span>date</span><span>description</span><span><a href="#"><i class="far fa-trash-alt icon__delete red"></i></a></span></div></div> ';
        }
        
       html = html.replace('Id' , obj.id);
       html = html.replace('description', obj.description);
       html = html.replace('date', obj.date);
       html = html.replace('value' , obj.value);
       document.querySelector(element).insertAdjacentHTML('beforeend' ,  html);
       var fields = document.querySelectorAll(domInputs.inputDes +',' + domInputs.inputVal +','+ domInputs.inputDate) ;
       var feildsArray = Array.prototype.slice.call(fields);
       feildsArray.forEach(function(current) {
           current.value='';
       });
       feildsArray[0].focus();
      

    },
     addBudget : function(obj){
       document.querySelector(domInputs.budgetLable).textContent = obj.tot ;
       document.querySelector(domInputs.incomLable).textContent = obj.incoms ;
       document.querySelector(domInputs.expenseLable).textContent = obj.exps ;
       if(obj.incoms >0) {
       document.querySelector(domInputs.percentageLable).textContent = obj.per +'%' ;
       }else {
        document.querySelector(domInputs.percentageLable).textContent = "--" ;
       }
       if(obj.tot <0){
        document.querySelector(domInputs.budgetLable).classList.add('red');
    }else {
        document.querySelector(domInputs.budgetLable).classList.remove('red');
    }
    },
    deleteItem : function(item){
       var el = document.getElementById(item) ;
         el.parentNode.removeChild(el);
    },
    domStrings : function(){
        return domInputs ;
    }
   } 
})();
// controller module 
var Controller = (function(budgetctrl,uictrl){
    var setEventListeners = function() {
        var dom = uictrl.domStrings();
        document.querySelector(dom.inputBtn).addEventListener('click',addCtrl) ;
        document.addEventListener('keypress', function(e) {
            if(e.keyCode===13 || e.which===13) {
                addCtrl();
            }
        });
        document.querySelector(dom.container).addEventListener('click',deleteItem);
        
    };
  /// update budget 
    var updateBudget = function() {
      var budget = budgetctrl.caculateBudget();
      console.log(budget); //test budget
      uictrl.addBudget(budget);
    };
   
    var addCtrl= function(){
        // 1. get user data 
        var input = uictrl.getData();
        if(input.description !== ""&& !isNaN(input.value) && input.value > 0 && input.date!=="") {
            //2. add newitem to the array
        var newItem = budgetctrl.addbudget(input.type , input.description,input.date,input.value);
        //3.add new list of income and expenses items 
                uictrl.addListItem(newItem, input.type);
                console.log(newItem);
                updateBudget();
        };
       
    }
   var deleteItem = function(ev){
       var itemId,splitId,ID,type ;
        itemId = ev.target.parentNode.parentNode.parentNode.id;
        if(itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
             ID = parseInt(splitId[1]);
             budgetctrl.deleteItems(type,ID);    
             //delet item from ui
             uictrl.deleteItem(itemId);
             // update data 
             updateBudget();
        }
        
       

   } ;
 return {
     init : function() {
         console.log('starting app');
         setEventListeners() ;
     }
 }
  
 
})(budgetController,uiController);
Controller.init() ;
