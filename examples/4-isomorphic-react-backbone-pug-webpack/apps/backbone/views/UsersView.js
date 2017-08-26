import Backbone from 'backbone'

const UserView = Backbone.View.extend({
  el: '.users',

  events: {
    'click button': 'handleButtonClick'
  },

  handleButtonClick (event) {
    console.log(`Hello ${event.currentTarget.textContent} from Backbone!`);
  }
})

export default UserView
