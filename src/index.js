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

    this.slideIndex = 0
    this.barIndex = 0

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
      borderRadius : 5,
      background   : '#F7E29C',
      barColor     : '#FCBC80',
      height       : '10'
    }, easing      : 'cubic-bezier(0.22, 0.77, 0.01, 0.8)',


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

      .${this.element.classList[0]} .zero_bar{
        width: 100%;
        height: ${this.options.barStyle.height}px ;
        background:  ${this.options.barStyle.background} ;
        position: relative ;
        cursor: pointer ;
        border-radius: ${this.options.barStyle.borderRadius}px ;
      }

      .${this.element.classList[0]} .zero_bar .zero_innerBar{
        top: 0;
        bottom: 0;
        left: 0;
        background: ${this.options.barStyle.barColor} ;
        position: absolute;
        cursor: pointer;
        transition: width 1s ${this.options.easing} ;
        border-radius: ${this.options.barStyle.borderRadius}px ;

      }

      `

      head.appendChild( style )
      
    },


    _create: function () {
      this.reloadItems()

      this.track = C$( 'div' )
      addClass( this.track, 'zero_track' )

      this.bar = C$( 'div' )
      addClass( this.bar, 'zero_bar' )

      this.innerBar = C$( 'span' )
      addClass(this.innerBar, 'zero_innerBar')

      this.items.forEach( item => this.track.appendChild( item ) )
      this.element.appendChild( this.track )

      this.bar.appendChild(this.innerBar)
      if (this.options.controlBar == !0) this.element.appendChild(this.bar)

      this.renderStyle()
    },


    _barStyleUpdate: function () {
      css( this.innerBar , {
        width: `${this.barIndex}px`
      })
    },


    _draging: function () {
      let isDown = false
      let startX
      let slideX

      addEvent(this.track, 'mousedown',(e)=>{
        isDown = true
        addClass( this.track, 'zero_active' )

        let txt = this.track.style.transform
        let numb = txt.match(/\d/g)
        
        if (numb != null) 
          numb = numb.join( "" );
          startX = e.pageX - this.track.offsetLeft
          slideX = numb
      })

      addEvent(this.track, 'mouseleave', ()=>{
        isDown = false
        removeClass( this.track, 'zero_active' )

        if (this.slideIndex >= ( this.itemWidth * this.items.length  - window.innerWidth)) {
          this.slideIndex = (this.itemWidth * this.items.length  - window.innerWidth )
          this.track.style.transform = `translateX(-${this.slideIndex}px)`
        }
      })

      addEvent(this.track, 'mouseup', ()=>{
        isDown = false
        removeClass( this.track, 'zero_active' )
        
        if (this.slideIndex >= ( this.itemWidth * this.items.length  - window.innerWidth)) {
          this.slideIndex = (this.itemWidth * this.items.length  - window.innerWidth )
          this.track.style.transform = `translateX(-${this.slideIndex}px)`
        }
        
      })


      this.track.addEventListener('mousemove',(e)=>{
        if ( !isDown ) return

        e.preventDefault()

        const x = e.pageX - this.track.offsetLeft
        const walk = x - startX
    
        this.slideIndex = slideX - walk
        
        this.barIndex = this.slideIndex  / (((this.items.length * this.itemWidth) -  this.element.offsetWidth ) / this.element.offsetWidth)

        this.track.style.transform = `translateX(-${this.slideIndex}px)`
        
        this._barStyleUpdate()

      })
    },

    slider: function () {
      addEvent(this.bar , 'click',(e)=>{
        this.barIndex = e.screenX
        this._barStyleUpdate()
      })
    },


    init: function() {
      this._create()
      this._draging()
      this.slider()
    }

  }




  window.SliderZero = SliderZero

})(window)

export default SliderZero