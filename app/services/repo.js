import Ember from 'ember';

export default Ember.Service.extend({

  lastId: 0,
  data: null,
  store: Ember.inject.service(),
  findAll() {
    this.set('data', this.fetchData());
    return this.get('data').then(res => {
      window.localStorage.setItem('todos', JSON.stringify(res));
      return res
    });
  },
  add(attrs, model) {
    this.data = model;
    let todo = Object.assign(attrs, {id: this.data.model.length + 1});
    model.model.pushObject(todo);
    this.persist();
    this.addToDB(todo);
    return todo;
  },
  delete(todo) {
    this.get('data').then(res => {
      debugger;
      res.removeObject(todo);
      this.persist();
      this.deleteFromDB(todo);
    })
  },
  persist() {
    window.localStorage.setItem('todos', JSON.stringify(this.get('data').then(res => { return res }) ));
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
  },
  setComplete(todo) {
    return Ember.$.post('http://localhost:3232/ToDoBack/public/complete', todo)
      .then((response) => {
        let res = JSON.parse(response);
      }).catch((err) => {
        let error = JSON.parse(err);
      })
  },
  addToDB(todo) {
    return Ember.$.post('http://localhost:3232/ToDoBack/public/add', todo)
      .then((response) => {
        let res = JSON.parse(response);
      }).catch((err) => {
        let error = JSON.parse(err);
      })
  },
  deleteFromDB(todo) {
    return Ember.$.post('http://localhost:3232/ToDoBack/public/delete', todo)
      .then((response) => {
        let res = JSON.parse(response);
      }).catch((err) => {
        let error = JSON.parse(err);
      })
  },
  editTodo(todo) {
    this.get('data').then(res => {
      debugger
      this.set(res[todo.id-1].description , todo.description)
        .then( this.set('data', res) )
        .then( res => {
        this.persist();
      })
    })
  }
});
