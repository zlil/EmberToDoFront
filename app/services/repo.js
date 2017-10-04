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
    this.addToDB(todo);
    return todo;
  },
  delete(todo) {
    this.get('data').then(res => {
      res.removeObject(todo);
      this.deleteFromDB(todo);
    })
  },
  fetchData() {
    return Ember.$.get('http://localhost:3232/ToDoBack/public/')
      .then((response) => {
        let data = JSON.parse(response);
        this.set('total', data.length)
        return data;
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
      this.set(res[todo.id-1].description , todo.description)
        .then( this.set('data', res) )
        .then( res => {
      })
    })
  }
});
