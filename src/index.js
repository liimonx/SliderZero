import {
  $,
  C$,
  css,
  hasClass,
  addClass,
  getStyle,
  addEvent, 
  removeClass,
  removeEvent
} from './components/domUtility'


(function (window, undefined) {

  'use strict'


  function SliderZero(elm, options) {
    this.elm = elm

    for (var prop in SliderZero.defaults) {
      this.options[prop] = SliderZero.defaults[prop]
    }

    for (prop in options) {
        this.options[prop] = options[prop]
    }

  }

  SliderZero.defaults = {
    autoSlide: true,
    autoSlideTime : 3,
    controlBar = true,
    barClick = true,
    barStyle = {
      border: 0,
      background: '#ccc',
      barColor: 'blue'
    }
  }




  SliderZero.prototype = {
    
  }




  window.SliderZero = SliderZero

})(window)

export default SliderZero