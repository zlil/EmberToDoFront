import Ember from 'ember';

export default Ember.Component.extend({
  newToDo: '',
  newToDoList: [],
  repo: Ember.inject.service('repo'),
  data: Ember.computed.alias('todos'),
  totalToDo: null,
  completedToDo: null,
  leftToDo: null,
  didReceiveAttrs() {
    this._super(...arguments);
    const todos = this.get('data');
    this.set('totalToDo', todos.length);
    this.totalToDo = todos.length;
    let checkCompleted = todos.filter(function (elem) {
        return elem.complete == 1;
      }
    );
    this.completedToDo = checkCompleted.length;
    this.leftToDo = this.totalToDo - checkCompleted.length;
  },
  actions: {
    deleteTodo(todo) {
      this.set('totalToDo', this.totalToDo - 1);
      this.set('completedToDo', this.completedToDo - 1);
      if (this.leftToDo > 0) {
        this.set('leftToDo', this.leftToDo - 1);
      }
      this.get('repo').setComplete(todo);
      this.get('repo').delete(todo);
      let id = todo.id;
      $("#todo-" + id).remove();

    },
    completeTodo(todo) {
      let self = this;
      Ember.set(self.todos[todo.id - 1], 'complete', 1)
      this.set('completedToDo', this.completedToDo + 1);
      this.set('leftToDo', this.leftToDo - 1);
      this.get('repo').setComplete(todo);
    },
    addTask() {
      let description = this.get('newToDo');
      this.get('repo').add({description: description, complete: 0, active: 1});
      $("#addNewToDo").val('');
      this.set('totalToDo', this.totalToDo+1);
      this.set('leftToDo', this.leftToDo+1);
    },
    //todo - Move It The Controller \ another service ?
    editTask(todo) {
      // Get the record's ID via attribute
      var self = this;
      let id = todo.id;
      Ember.$.get('http://localhost:3232/ToDoBack/public/task/' + id)
        .then((response) => {
          let data = JSON.parse(response);

          // Populate the form fields with the data returned from server
          $('#userForm')
            .find('[name="id"]').val(data.id).end()
            .find('[name="description"]').val(data.description).end()

          // Show the dialog
          bootbox.dialog({
            title: 'Edit the user profile',
            message: $('#userForm'),
            show: false // We will show it manually later
          })
            .on('shown.bs.modal', function () {
              $('#userForm')
                .show()                             // Show the login form
            })
            .on('hide.bs.modal', function (e) {
              // Bootbox will remove the modal (including the body which contains the login form)
              // after hiding the modal
              // Therefor, we need to backup the form
              $('#userForm').hide().appendTo('body');
            })
            .modal('show');
        });

      $("#saveDetails").on('click', function (e) {
        // Save the form data via an Ajax request
        e.preventDefault();
        var $form = $('#userForm'),
          id = $form.find('[name="id"]').val(),
          description = $form.find('[name="description"]').val();
        Ember.$.post('http://localhost:3232/ToDoBack/public/edit', $form.serialize())
          .then((response) => {

            // Hide the dialog
            $form.parents('.bootbox').modal('hide');
            //self.get('repo').editTodo({id: id, description: description});
            Ember.set(self.todos[id - 1], 'description', description)
            // You can inform the user that the data is updated successfully
            // by highlighting the row or showing a message box
            bootbox.alert('The todo is updated');
          });

      });
    }
  }
});
