import Ember from 'ember';

export default Ember.Controller.extend({
  todos: Ember.computed.alias('todos.data'),
  totals:  Ember.computed('model', function() {
    return this.get('model').then(res => { return res.length });
  }),

});
