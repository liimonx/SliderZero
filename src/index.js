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
    this.element = $(elm)[0]

    this.options = {}

    for (var prop in SliderZero.defaults) {
      this.options[prop] = SliderZero.defaults[prop]
    }

    for (prop in options) {
        this.options[prop] = options[prop]
    }

    this.init()
  }

  SliderZero.defaults = {
   
    autoplay       : true,
    autoplaySpeed  : 2000,
    controlBar     : true,
    barClick       : true,
    barStyle       : {
      border       : 0,
      background   : '#ccc',
      barColor     : 'blue'
    }, easing      : 'cubic-bezier(0, 1.09, 0.27, 1.28)',


  }




  SliderZero.prototype = {

    _getItems: function ( items ) {
      let item 
      for ( let i = 0; i < items.length; i++ ) {

        item = items[i];
        addClass(item, 'zero_item')
        this.items.push( item )

        this.itemWidth = ( getStyle( item ).width )
        .match(/\d/g).join('')
        
        if (i == items.length - 1) 
          [...items].forEach( item => item.remove( item ) )

      }
    },


    reloadItems: function () {
      this.items = []
      this._getItems(this.element.children)
    },


    renderStyle: function(){
      const head = $( 'head' )[0]
      const style = C$('style' )

      style.innerHTML = `

      .${this.element.classList[0]}{
        overflow: hidden;
      }
      
      .${this.element.classList[0]} .zero_track{
        width: ${this.items.length * this.itemWidth}px; 
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        transition: transform 1s ${this.options.easing};
        will-change: transform;
        position: relative;
      }

      .${this.element.classList[0]} .zero_track.zero_active{
        cursor: grabbing;
      }

      .${this.element.classList[0]} .zero_track .zero_item{
        display: inline-flex;
      }

      `

      head.appendChild( style )
      
    },


    _create: function () {
      this.reloadItems()

      const track = C$( 'div' )
      addClass( track, 'zero_track' )

      this.items.forEach( item => track.appendChild( item ) )
      this.element.appendChild( track )

      this.renderStyle()
    },


    init: function() {
      this._create()
    }

  }




  window.SliderZero = SliderZero

})(window)

export default SliderZero