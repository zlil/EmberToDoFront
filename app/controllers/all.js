import Ember from 'ember';

export default Ember.Controller.extend({
  repo: Ember.inject.service(),
  newToDo: '',
  actions: {
    createTodo(e) {
      debugger;
        let description = this.get('newToDo');
        var self = this;
        this.get('repo').add({ description: description, completed: false }, self);
        this.set('newToDo','');

    },
  }
});
