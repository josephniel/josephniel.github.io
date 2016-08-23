/** 
 * ---------------------------------------------
 *  @author Joseph Niel I. Tuazon
 *  @version v.1.0.0
 *  @description 
 *      Compiled vanilla Javascript helpers as 
 *      alternative to their framework
 *      counterparts.
 * ---------------------------------------------
 */ 

(function(helper){

    /**
     *  @description
     *      Cross-browser request animation frame
     * 
     *  @link http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    /**
     *  @description
     *      Adds a class in the class attribute 
     *      of an element
     * 
     *  @link http://youmightnotneedjquery.com/
     * 
     *  @param el - element
     *  @param className - class to be added
     */
    helper.addClass = function(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    /**
     *  @description
     *      Removes a class in the class attribute 
     *      of an element
     * 
     *  @link http://youmightnotneedjquery.com/
     * 
     *  @param el - element
     *  @param className - class to be removed
     */
    helper.removeClass = function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = 
                el.className.replace( new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    /**
     *  @description
     *      Checks a class in the class attribute 
     *      of an element is present
     * 
     *  @link http://youmightnotneedjquery.com/
     * 
     *  @param el - element
     *  @param className - class to be checked
     */
    helper.hasClass = function(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    /**
     *  @description
     *      Fades out the element
     * 
     *  @link http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
     * 
     *  @param el - element
     */
    helper.fadeOut = function(el){
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .05) == 0)
                el.style.display = "none";
            else 
                window.requestAnimationFrame(fade);
        })();
    }

})(this.helper = this.helper === undefined ? {} : this.helper);
