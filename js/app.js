(function() {

  'use strict';

  var db = new PouchDB('todos');
  var remoteCouch = false;
  //var remoteCouch = 'http://joseph:showmethedata@http://52.24.125.55:3000/todos';
  ///!GOODvar remoteCouch = 'http://35.164.8.64:3000/todos';


  db.changes({
    since: 'now',
    live: true
  }).on('change', showTodos);




// start of event mgmt
  let eventData = [''];

  //single
  ///const mc = document.querySelector('multiple-choice');
  //const mc = document.querySelectorAll('input[name="checkLabel"]');

  //multiple
  const mc = document.querySelectorAll('multiple-choice');
  //const mc = document.querySelectorAll('input[name="checkLabel"]');


  //either single or multiple
  const evt = new CustomEvent('user-engagement', {
    bubbles: true,
    composed: true,
    cancelable: false,
    detail: {name: "dave"}
    //detail: eventData
  });


  //single
/*
  mc.addEventListener('user-engagement', e =>
                //alert("hi")
                //alert(mc.checkLabel)
               createStatement(function (backStatement){
                      addTodo(JSON.stringify(backStatement));
               })
  );

  mc.addEventListener('click', e => e.target.dispatchEvent(evt));
*/


  //multiple

  if (mc) {
    mc.forEach(function(el){
            el.addEventListener('user-engagement', e =>
             createStatement(function (backStatement){
                    addTodo(JSON.stringify(backStatement));
             })
            );
            el.addEventListener('click', e => e.target.dispatchEvent(evt));
    });
  }
// end of event mgmt


//function createStatement(mcInfo, callback) {
function createStatement(callback) {
//  var objectStatement = {};
  var objectStatement = {
            "actor": {
                "mbox": "mailto:dave@gmail.com",
                "name": "Dave Fusco",
                "objectType": "Agent"
            },
            "verb": {
                "id": "http://adlnet.gov/expapi/verbs/answered",
                "display": {
                    "en-US": "answered"
                }
            },
            "object": {
                "id": "http://adlnet.gov/expapi/activities/example",
                "definition": {
                    "name": {
                        "en-US": "Example Activity"
                    },
                    "description": {
                        "en-US": "Example activity description"
                    }
                },
                "objectType": "Activity"
            }
   };
  callback(objectStatement);
}
// END of NEW for MC and xAPI



  // We have to create a new todo document and enter it in the database
  function addTodo(text) {
    var todo = {
      _id: new Date().toISOString(),
      title: text,
      completed: false
    };
   db.put(todo, function callback(err, result) {
         if (!err) {
           console.log('Successfully posted a todo!');
        }
   });
  }


  // Show the current list of todos by reading them from the database
  function showTodos() {

    db.allDocs({include_docs: true, descending: true}, function(err, doc) {

      processxAPI(doc.rows, function displayxAPI(mapxAPI){
       //alert(mapxAPI);
       processItems(mapxAPI, function display(backMap){
          var labelsArray = [];
          var resultsArray = [];
          var labelsArrayOrig = ["Fiat", "Ford", "Toyota", "Chevy"];
          var resultsArrayOrig = [2478,5267,734,784];

          //alert(JSON.stringify(backMap));

          for (let key of Object.keys(backMap)) {
            //alert(key); // John, then 30
            labelsArray.push(key);
          }
          ///alert(JSON.stringify(labelsArray));

          for (let value of Object.values(backMap)) {
            //alert(value); // John, then 30
            resultsArray.push(value);
          }
          ///alert(JSON.stringify(resultsArray));

      //chart HERE
          new Chart(document.getElementById("bar-chart"), {
              type: 'bar',
              data: {
//                labels: ["Fiat", "Ford", "Toyota", "Chevy"],
                labels: labelsArray,
                datasets: [
                  {
                    label: "Number Sold (millions)",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
//                    data: [2478,5267,734,784]
                    data: resultsArray
                  }
                ]
              },
              options: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'xAPI Verbs'
                  //text: backTester
                },
                scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero: true,
                              fixedStepSize: 1
                          }
                      }]
                }
              }
          });
          //end of chart
        }
        // end of display function
       );
       //end of processItems
       }
       // end of displayxAPI function
      );
      //end of processxAPI
    });
    //end of db.allDocs
  }
  //end of showTodos


//  COPY OF LOCAL FOR remote
/*
function showRemoteTodos() {

  var dbRemote = new PouchDB('http://35.164.8.64:3000/todos');

  dbRemote.allDocs({include_docs: true, descending: true}, function(err, doc) {

    processxAPI(doc.rows, function displayxAPI(mapxAPI){
     //alert(mapxAPI);
     processItems(mapxAPI, function display(backMap){
        var labelsArray = [];
        var resultsArray = [];
        var labelsArrayOrig = ["Fiat", "Ford", "Toyota", "Chevy"];
        var resultsArrayOrig = [2478,5267,734,784];

        //alert(JSON.stringify(backMap));

        for (let key of Object.keys(backMap)) {
          //alert(key); // John, then 30
          labelsArray.push(key);
        }
        ///alert(JSON.stringify(labelsArray));

        for (let value of Object.values(backMap)) {
          //alert(value); // John, then 30
          resultsArray.push(value);
        }
        ///alert(JSON.stringify(resultsArray));

    //chart HERE
        new Chart(document.getElementById("bar-chart-remote"), {
            type: 'bar',
            data: {
//                labels: ["Fiat", "Ford", "Toyota", "Chevy"],
              labels: labelsArray,
              datasets: [
                {
                  label: "Number Sold (millions)",
                  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
//                    data: [2478,5267,734,784]
                  data: resultsArray
                }
              ]
            },
            options: {
              legend: { display: false },
              title: {
                display: true,
                text: 'xAPI Verbs'
                //text: backTester
              },
              scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fixedStepSize: 1
                        }
                    }]
              }
            }
        });
        //end of chart
      }
      // end of display function
     );
     //end of processItems
     }
     // end of displayxAPI function
    );
    //end of processxAPI
  });
  //end of db.allDocs
}
//end of showTodos

*/

//  END OF COPY OF LOCAL FOR remote


  function processxAPI(statements, callback) {
    var arrayxAPI = [];
    statements.forEach(function(statement) {
      var out = JSON.parse(statement.doc.title);
      //var jsonStatement = statement.actor.name;    //name
      var jsonStatement = out.verb.display['en-US']; //verb
      arrayxAPI.push(jsonStatement);
      //alert(jsonStatement);
    });
    callback(arrayxAPI);
  }


  function processItems(todos, callback) {
    var map = {};
    todos.forEach(function(todo) {
        map[todo] = (map[todo] || 0) + 1;
    });
    callback(map);
  }


  function sync() {
          var opts = {live: true};
          db.replicate.to(remoteCouch, opts, syncError);
          db.replicate.from(remoteCouch, opts, syncError);
  }

  showTodos();
  ///!GOODshowRemoteTodos();

  if (remoteCouch) {
    sync();
  }

})();
