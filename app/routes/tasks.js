import Ember from 'ember';

export default Ember.Route.extend({
  model() {

      return Ember.$.get('http://localhost:3232/ToDoBack/public/')
        .then((response) => {
        let data = JSON.parse(response);
        let total = 0;
        data.forEach(function (item) {
          if(item.complete)
            ++total;
        })
        let sendData = [];
        sendData['data'] = data;
        sendData['totalLeft'] = data.length-total;
        this.set('data', sendData['data']);
        this.set('totalLeft', sendData['totalLeft']);
        return sendData;
      });


    // return Ember.$.get('http://localhost:3232/ToDoBack/public/').then((response) => {
    //   return JSON.parse(response);
    // })
  },
  actions: {
    showTask(task) {
      alert(task)
    }
  },
  //total: Ember.computed("total", 4)
});
