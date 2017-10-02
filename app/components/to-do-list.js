import Ember from 'ember';

export default Ember.Component.extend({
  newToDo: '',
  newToDoList: [],
  repo: Ember.inject.service('repo'),
  data: Ember.computed.alias('todos'),
  actions: {
    deleteTodo(todo) {
      debugger;
      this.get('repo').delete(todo);
      let id = todo.id;
      $("#todo-"+id).remove();

    },
    completeTodo(todo) {
      this.get('repo').setComplete(todo);
    },
    addTask() {
      let description = this.get('newToDo');
      this.get('repo').add({ description: description, complete: 0, active: 1 });
      //e.target.value = '';
      $("#addNewToDo").val('');
    },
    editTask(todo) {
        // Get the record's ID via attribute
        var self = this;
        let id = todo.id;
         Ember.$.get('http://localhost:3232/ToDoBack/public/task/'+id)
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
            .on('shown.bs.modal', function() {
              $('#userForm')
                .show()                             // Show the login form
            })
            .on('hide.bs.modal', function(e) {
              // Bootbox will remove the modal (including the body which contains the login form)
              // after hiding the modal
              // Therefor, we need to backup the form
              $('#userForm').hide().appendTo('body');
            })
            .modal('show');
        });

         $("#saveDetails").on('click', function(e) {
           // Save the form data via an Ajax request
           e.preventDefault();
           var $form = $('#userForm'),
                id    = $form.find('[name="id"]').val(),
                description = $form.find('[name="description"]').val();
           Ember.$.post('http://localhost:3232/ToDoBack/public/edit', $form.serialize())
             .then((response) => {
              debugger;
               // Hide the dialog
               $form.parents('.bootbox').modal('hide');

               //self.get('repo').editTodo({id: id, description: description});
               Ember.set(self.todos[id - 1],'description', description)
               // You can inform the user that the data is updated successfully
               // by highlighting the row or showing a message box
               bootbox.alert('The todo is updated');
             });

           });
    }
  }
});
