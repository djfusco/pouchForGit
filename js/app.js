(function() {

  'use strict';

  var ENTER_KEY = 13;
  var newTodoDom = document.getElementById('new-todo');
  var syncDom = document.getElementById('sync-wrapper');


  // EDITING STARTS HERE (you dont need to edit anything above this line)

//  var db = false;
  var db = new PouchDB('todos');
  var remoteCouch = false;

  db.changes({
    since: 'now',
    live: true
  }).on('change', showTodos);


/*
  // Bar chart
new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
});
*/


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
      redrawTodosUI(doc.rows);
    });

    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      processItems(doc.rows, function display(backMap){

          var labelsArray = [];
          var resultsArray = [];
          var labelsArrayOrig = ["Fiat", "Ford", "Toyota", "Chevy"];
          var resultsArrayOrig = [2478,5267,734,784];

          ///alert(JSON.stringify(backMap));

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
                  text: 'Total Number of Cars Sold'
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
    });
    //end of db.allDocs
  }
  //end of showTodos


  function processItems(todos, callback) {
    var map = {};
    todos.forEach(function(todo) {
           map[todo.doc.title] = (map[todo.doc.title] || 0) + 1;
    });
    callback(map);
  }
//end of NEW





  function checkboxChanged(todo, event) {
    todo.completed = event.target.checked;
    db.put(todo);
  }

  // User pressed the delete button for a todo, delete it
  function deleteButtonPressed(todo) {
    db.remove(todo);
  }

  // The input box when editing a todo has blurred, we should save
  // the new title or delete the todo if the title is empty
  function todoBlurred(todo, event) {
    var trimmedText = event.target.value.trim();
    if (!trimmedText) {
      db.remove(todo);
    } else {
        todo.title = trimmedText;
        db.put(todo);
      }
  }

  // Initialise a sync with the remote server
  function sync() {
  }

  // EDITING STARTS HERE (you dont need to edit anything below this line)

  // There was some form or error syncing
  function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
  }

  // User has double clicked a todo, display an input so they can edit the title
  function todoDblClicked(todo) {
    var div = document.getElementById('li_' + todo._id);
    var inputEditTodo = document.getElementById('input_' + todo._id);
    div.className = 'editing';
    inputEditTodo.focus();
  }

  // If they press enter while editing an entry, blur it to trigger save
  // (or delete)
  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById('input_' + todo._id);
      inputEditTodo.blur();
    }
  }

  // Given an object representing a todo, this will create a list item
  // to display it.
  function createTodoListItem(todo) {
    var checkbox = document.createElement('input');
    checkbox.className = 'toggle';
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', checkboxChanged.bind(this, todo));

    var label = document.createElement('label');
    label.appendChild( document.createTextNode(todo.title));
    label.addEventListener('dblclick', todoDblClicked.bind(this, todo));

    var deleteLink = document.createElement('button');
    deleteLink.className = 'destroy';
    deleteLink.addEventListener( 'click', deleteButtonPressed.bind(this, todo));

    var divDisplay = document.createElement('div');
    divDisplay.className = 'view';
    divDisplay.appendChild(checkbox);
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement('input');
    inputEditTodo.id = 'input_' + todo._id;
    inputEditTodo.className = 'edit';
    inputEditTodo.value = todo.title;
    inputEditTodo.addEventListener('keypress', todoKeyPressed.bind(this, todo));
    inputEditTodo.addEventListener('blur', todoBlurred.bind(this, todo));

    var li = document.createElement('li');
    li.id = 'li_' + todo._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    if (todo.completed) {
      li.className += 'complete';
      checkbox.checked = true;
    }

    return li;
  }

  function redrawTodosUI(todos) {
    var ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    todos.forEach(function(todo) {
      ul.appendChild(createTodoListItem(todo.doc));
    });
  }

  function newTodoKeyPressHandler( event ) {
    if (event.keyCode === ENTER_KEY) {
      addTodo(newTodoDom.value);
      newTodoDom.value = '';
    }
  }

  function addEventListeners() {
    newTodoDom.addEventListener('keypress', newTodoKeyPressHandler, false);
  }

  addEventListeners();
  showTodos();

  if (remoteCouch) {
    sync();
  }

})();
