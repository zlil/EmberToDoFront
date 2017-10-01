import Ember from 'ember';

export default Ember.Service.extend({
	lastId: 0,
	data: null,
	findAll() {
			this.set('data', this.fetchData());
			this.data = this.fetchData();
      return this.get('data');
	},
	add(attrs, model) {
		let todo = Object.assign({ id: this.incrementProperty('id') }, attrs);
		//this.get('data').pushObject(todo);
		model.model.pushObject(todo);
    this.persist();
		return todo;
	},
	delete(todo) {
		this.get('data').removeObject(todo);
		this.persist();
	},
	persist() {
		window.localStorage.setItem('todos', JSON.stringify(this.get('data')));
	},
	fetchData() {
    return Ember.$.get('http://localhost:3232/ToDoBack/public/')
      .then((response) => {
        let data = JSON.parse(response);
        return data;
        // let total = 0;
        // data.forEach(function (item) {
        //   if(item.complete)
        //     ++total;
        // })
        // let sendData = [];
        // sendData['data'] = data;
        // sendData['totalLeft'] = data.length-total;
        // this.set('data', sendData['data']);
        // this.set('totalLeft', sendData['totalLeft']);
        // return sendData;
      });
  }
});
