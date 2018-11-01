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


  class SliderZero {

    constructor(elm, options) {

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

    _getItems(items) {
      let item
      for (let i = 0; i < items.length; i++) {

        item = items[i];
        addClass(item, 'zero_item')
        this.items.push(item)

        if (i == items.length - 1)
          [...items].forEach(item => item.remove(item))

      }
    }


    _reloadItems() {
      this.items = []
      this._getItems(this.element.children)
    }


    _renderStyle() {
      const head = $('head')[0]
      const style = C$('style')

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

      head.appendChild(style)

    }


    _checkResponsive() {
      if (this.options.responsive) {

        this.options.responsive.forEach(responsiveOption => {

          let media = window.matchMedia(`(max-width: ${responsiveOption.breakpoint}px)`)

          if (media.matches) this.options._slidesToShow = responsiveOption.settings._slidesToShow

        })
      }
    }


    _create() {
      this._reloadItems()

      this.track = C$('div')
      addClass(this.track, 'zero_track')

      this.bar = C$('div')
      addClass(this.bar, 'zero_bar')

      this.innerBar = C$('span')
      addClass(this.innerBar, 'zero_innerBar')

      this.items.forEach(item => this.track.appendChild(item))
      this.element.appendChild(this.track)

      this.bar.appendChild(this.innerBar)
      if (this.options.controlBar == !0) this.element.appendChild(this.bar)

      this._checkResponsive()
      this._slidesToShow()
      this._renderStyle()

      addEvent(window, 'resize', () => {
        this._checkResponsive()
        this._slidesToShow()
      })
    }


    _barStyleUpdate() {
      css(this.innerBar, {
        width: `${(100 / this.element.offsetWidth) * this.barIndex}%`
      })
    }


    _updateSlidex() {
      this.slideX
      let txt = this.track.style.transform
      let numb = txt.match(/\d/g)

      if (numb != null)
        numb = numb.join("");
      this.slideX = Number(numb)
    }


    _trackStyleUpdate(changeIndex) {

      if (changeIndex == !0 && this.slideIndex >= (this.itemWidth * this.items.length - window.innerWidth))
        this.slideIndex = (this.itemWidth * this.items.length - window.innerWidth)

      this.track.style.transform = `translateX(-${this.slideIndex}px)`
    }


    _draging() {
      let isDown = !1
      let startX

      addEvent(this.track, 'mousedown', (e) => {
        isDown = !0
        addClass(this.track, 'zero_active')
        startX = e.pageX - this.track.offsetLeft

        this._updateSlidex()
      })

      addEvent(this.track, 'mouseleave', () => {
        isDown = !1
        removeClass(this.track, 'zero_active')

        this._trackStyleUpdate(!0)
      })

      addEvent(this.track, 'mouseup', () => {
        isDown = !1
        removeClass(this.track, 'zero_active')

        this._trackStyleUpdate(!0)
      })


      this.track.addEventListener('mousemove', (e) => {
        if (!isDown) return

        e.preventDefault()

        const x = e.pageX - this.track.offsetLeft
        const walk = x - startX

        this.slideIndex = Math.round(this.slideX - walk)
        this.barIndex = this.slideIndex / (((this.items.length * this.itemWidth) - this.element.offsetWidth) / this.element.offsetWidth)

        this._trackStyleUpdate(!1)
        this._barStyleUpdate()

      })
    }


    _slidesToShow() {
      let items = document.querySelectorAll(`.${this.element.classList[0]} .zero_track .zero_item`)

      items.forEach(item => {
        let numb = (getStyle(item).width).match(/\d/g).join('')
        let width = Number(numb)

        let space = (this.element.offsetWidth - (width * this.options._slidesToShow)) / this.options._slidesToShow

        css(item, {
          margin: `0 ${space / 2}px`
        })

        this.itemWidth = Math.round(width + space)

      })

    }


    _autoplay(v) {
      this.autoplayStart

      let up = !0
      let increment = Number(this.itemWidth) * this.options._slidesToShow
      const ceiling = Number(this.itemWidth * this.items.length - window.innerWidth)

      if (v == !0) {
        this.autoplayStart = setInterval(() => {

          if (up == !0 && this.slideIndex <= ceiling) {
            this.slideIndex += increment

            if (this.slideIndex >= ceiling) {
              up = !1
            }
          } else {
            up = !1
            this.slideIndex -= increment;

            if (this.slideIndex <= 0) {
              up = !0
              this.slideIndex = 0
            }
          }

          this.barIndex = this.slideIndex / (((this.items.length * this.itemWidth) - this.element.offsetWidth) / this.element.offsetWidth)
          this._barStyleUpdate()
          this._trackStyleUpdate(!0)

        }, this.options.autoplaySpeed)

      } else {
        clearInterval(this.autoplayStart)
      }
    }


    _slider() {
      if (this.options.barClick == !0) {
        addEvent(this.bar, 'click', (e) => {
          this.barIndex = e.screenX
          this.slideIndex = Math.round(this.barIndex * (((this.items.length * this.itemWidth) - this.element.offsetWidth) / this.element.offsetWidth))

          this._updateSlidex()
          this._barStyleUpdate()
          this._trackStyleUpdate(!0)
        })
      }

      if (this.options.autoplay == !0) {
        this._autoplay(!0)

        addEvent(this.track, 'mouseenter', () => this._autoplay(!1))
        addEvent(this.track, 'mouseleave', () => this._autoplay(!0))
      }
    }

    init() {
      this._create()
      this._draging()
      this._slider()
    }

  }

  SliderZero.defaults = {
    _slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    controlBar: true,
    barClick: true,
    barStyle: {
      borderRadius: 5,
      background: '#F7E29C',
      barColor: '#FCBC80',
      height: '10'
    },
    easing: 'cubic-bezier(0.22, 0.77, 0.01, 0.8)',
  }


  window.SliderZero = SliderZero

})(window)

export default SliderZero
