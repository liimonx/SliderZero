
// -------------------------- DOM Utility -------------------------- //

// use classList API if available
const supportClassList = 'classList' in document.createElement('div')


function classReg(c) {
    return new RegExp("(^|\\s+)" + c + "(\\s+|$)");
}


const  hasClass = supportClassList ? function hasClass(el, c) {
    return el.classList.contains(c)
  } : function (el, c) {
    return classReg(c).test(el.className)
}


const addClass = supportClassList ? function (el, c) {
    el.classList.add(c);
  } : function (el, c) {
    if ( !hasClass(el, c) ) {
        el.className = el.className + ' ' + c
    }
}


const removeClass = supportClassList ? function (el, c) {
        el.classList.remove(c)
    } : function (el, c) {
        el.className = el.className.replace(classReg(c), ' ')
}


// -------------------------- querySelector & css style -------------------------- //
function $(){
    let temp 
    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'string') {
            temp = document.querySelectorAll(arguments[i])
        }        
    }
    return temp
}


function C$(){
    let temp
    for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'string') {
            temp = document.createElement(arguments[i])
        }        
    }
    return temp
}


function css(el, styles){
    for (const property in styles) {
        el.style[property] = styles[property]
    }
}

// -------------------------- getStyle -------------------------- //

let defView = document.defaultView;

const getStyle = defView && defView.getComputedStyle ?
  function( elem ) {
    return defView.getComputedStyle( elem, null )
  } :
  function( elem ) {
    return elem.currentStyle
}

// -------------------------- addEvent / removeEvent -------------------------- //


function addEvent( obj, type, fn ) {
    if ( obj.addEventListener ) {
        obj.addEventListener( type, fn, false )
    } else if ( obj.attachEvent ) {
        obj[ 'e' + type + fn ] = fn;
        obj[ type + fn ] = function() {
        obj[ 'e' + type + fn ]( window.event );
        };
        obj.attachEvent( "on" + type, obj[ type + fn ] )
    }
}

function removeEvent( obj, type, fn ) {
    if ( obj.removeEventListener ) {
        obj.removeEventListener( type, fn, false )
    } else if ( obj.detachEvent ) {
        obj.detachEvent( "on" + type, obj[ type + fn ] )
        obj[ type + fn ] = null
        obj[ 'e' + type + fn ] = null
    }
}





export {$, C$, hasClass, addClass, removeClass, css, getStyle, addEvent, removeEvent}