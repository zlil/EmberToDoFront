import Ember from 'ember';

export default Ember.Controller.extend({
  todoss: Ember.computed.alias('todos.data')
});
