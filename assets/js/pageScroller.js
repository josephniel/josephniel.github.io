/** 
 * ---------------------------------------------
 *  @author Joseph Niel I. Tuazon
 *  @version v.0.1.0
 *  @description 
 *      Joseph Niel Tuazon's custom full page 
 *      scroller inspired by fullPage.js @
 *      http://alvarotrigo.com/fullPage/
 * ---------------------------------------------
 *  TODO:
 *      - Change animation with easings and should be time-based
 */ 
(function(helper, pageScroller){

    /**
     *  @description
     *      Variable for the body element
     */
    var body = document.getElementsByTagName("body")[0];

    /**
     *  @description 
     *      The global animation id used by requestAnimationFrame
     */
    var animationId;

    /**
     *  @description
     *      The object containing the parameter values
     */
    var parameters = {
        animationInterval: 30,
        sectionClass: "page-section",
        headerClass: "header",
        sectionTitleClass: "page-section-title",
        sectionPageClass: "page-section-counter",
    };

    /**
     *  @function initializeSections
     * 
     *  @description
     *      Initializes the sections used for the 
     *      full page scroll
     */
    pageScroller.initializeSections = function(params) {

        // Gets the provided parameters
        if(params) {
            Object.keys(params).forEach(function(key) {
                if(parameters[key])
                    parameters[key] = params[key];
            });
        }

        // Initialize all functions on-load
        setResizeEvents();
        setScrollEvents();
        changeDynamicContents();

        // Sets the resize events function handler
        window.addEventListener("resize", setResizeEvents);

        // Sets the scroll events function handler
        window.addEventListener("scroll", setScrollEvents);

        // On key down, prevents the browser from performing
        // certain actions using the up or down keys
        window.addEventListener("keydown", function(e) {
            if([38,40].indexOf(e.keyCode) != -1)
                e.preventDefault();
        });

        // On key up of the up or down keys, the 
        // next visible section is determined.
        window.addEventListener("keyup", setNavigationEvents);

        // On mouse wheel movement, the next
        // visible section is determined
        window.addEventListener("wheel", setNavigationEvents);
    }

    /**
     *  @function getSections()
     * 
     *  @description 
     *      Gets all the elements with the page-section class
     *      in the DOM and returns them as an array.
     *  
     *  @returns Array sectionList 
     */
    function getSections() {
        var sections = document.getElementsByClassName(parameters.sectionClass),
            sectionList = Array.prototype.slice.call(sections);
        return sectionList;
    }

    /**
     *  @function setResizeEvents()
     * 
     *  @description 
     *      Sets all the events to be triggered when a resize 
     *      event occurs.
     */
    function setResizeEvents() {
        
        // Sets the section height
        setSectionHeight();
    }

    /**
     *  @function setHeight()
     *  
     *  @description
     *      Sets the height for all <section> tags 
     *      based on the client viewport height.
     */
    function setSectionHeight() {
        var sections = getSections(),
            windowHeight = window.innerHeight;
            
        for(var i = 0; i < sections.length; i++) {
            sections[i].style.height = windowHeight+"px";
        }
    }

    /**
     *  @function setScrollEvents()
     * 
     *  @description 
     *      Sets all the events to be triggered when a scroll 
     *      event occurs.
     */
    function setScrollEvents() {

        // Sets the visible sections (adds class)
        setVisibleSections();

        // For touch devices (mouse wheel and keyboard could not trigger 
        // the change in dynamic content)
        if('ontouchstart' in document.documentElement)
            changeDynamicContents();
    }

    /**
     *  @function setVisibleSections()
     * 
     *  @description
     *      Sets the class 'is-visible' to all the
     *      visible elements in the viewport
     */
    function setVisibleSections() {
        var sections = getSections(),
            scrollTop = window.scrollY,
            windowHeight = window.innerHeight;
        
        for(var i = 0; i < sections.length; i++) {
            var section = sections[i],
                sectionTop = section.getBoundingClientRect().top;

            helper.removeClass(section, "is-visible");
            
            if(sectionTop > -windowHeight && sectionTop < windowHeight) 
                helper.addClass(section, "is-visible");
        }
    }

    /**
     *  @function getVisibleSectionIndex()
     * 
     *  @description 
     *      Gets the first section with the 
     *      class 'is-visible'. 
     * 
     *  @returns number currentIndex
     */
    function getVisibleSectionIndex() {
        var sections = getSections(),
            currentIndex = null;
        for(var i = 0; i < sections.length; i++) {
            if(helper.hasClass(sections[i], "is-visible")){
                currentIndex = i;
                return currentIndex;
            }
        }
    }

    /**
     *  @function setSectionTitle()
     * 
     *  @description 
     *      Sets the current section page
     */
    function setSectionPage() {
        var sections = getSections(),
            currentSection = getVisibleSectionIndex(),
            totalSections = sections.length,
            sectionPageEl = document.getElementsByClassName(parameters.sectionPageClass)[0];

        sectionPageEl.innerHTML = "Page " + (currentSection+1) + " of " + totalSections;
    }

    /**
     *  @function setSectionTitle()
     * 
     *  @description 
     *      Sets the section title based from the attribute 
     *      "data-section-name" of the section element
     */
    function setSectionTitle() {
        var sections = getSections(),
            currentSection = getVisibleSectionIndex(),
            sectionName = sections[currentSection].getAttribute("data-section-name"), 
            sectionTitleEl = document.getElementsByClassName(parameters.sectionTitleClass)[0];
        
        if(!sectionName || helper.hasClass(body, "is-scrolling")) {
            sectionTitleEl.style.left = "-50%";
        } else {
            sectionTitleEl.style.left = "0";
            sectionTitleEl.innerHTML = sectionName;
        }
    }

    function setRightMovement() {

        unsetRightMovement();

        var sections = getSections(),
            currentSectionIndex = getVisibleSectionIndex(),
            currentSectionEl = sections[currentSectionIndex],
            rightEl =  currentSectionEl.getElementsByClassName("right-page-section-container")[0];
        
        if(rightEl){
            var rightElMobile = rightEl.getElementsByClassName("mobile")[0];
            if(rightElMobile)
                rightEl.style.right = 0;
        } 
    }

    function unsetRightMovement() {
         var rightEls = document.getElementsByClassName("right-page-section-container"),
            rightElList = Array.prototype.slice.call(rightEls);
            
        rightElList.forEach(function(rightEl) {
            rightEl.style.right = "-50%";
        }, this);
    }

    /**
     *  @function setNavigationEvents()
     * 
     *  @description 
     *      Sets all the events to be triggered when a keyup 
     *      or a mouse wheel is triggered.
     */
    function setNavigationEvents(e) {

        // Moves to the next visible section
        moveSection(e);
    }

    /**
     *  @function changeDynamicContents()
     * 
     *  @description 
     *      Sets all the dynamic contents in the page.
     */
    function changeDynamicContents() {
        
        // Sets the label for parameters.sectionTitleClass
        setSectionTitle();

        // Sets the label for parameters.sectionPageClass
        setSectionPage();

        setRightMovement();
    }

    /**
     *  @function afterAnimationCallback()
     * 
     *  @description 
     *      Contains all method that should be executed
     *      after animation.
     */
    function afterAnimationCallback() {
        window.cancelAnimationFrame(animationId);
        helper.removeClass(body, "is-scrolling");

        changeDynamicContents();
    }

    /**
     *  @function moveSection()
     * 
     *  @description
     *      Determines the next visible section by
     *      issuing certain functions to
     *      animate to it.
     * 
     *  @param e - event 
     */
    function moveSection(e) {

        if(!helper.hasClass(body, "is-scrolling")) {
            var key = (e.type == "keyup") ? 
                        e.keyCode : ((e.deltaY > 0) ? 40 : 38);
            if(key === 40) // down arrow || scroll down
                scrollToSection(e, getVisibleSectionIndex());
            else if(key === 38)  // up arrow || scroll up
                scrollToSection(e, getVisibleSectionIndex(), true);
        }
    }
    
    /**
     *  @function scrollToSection()
     *      
     *  @description
     *      Prepares the necessary values to be used in animating
     *      to the next section.
     * 
     *  @param e        - event of the current listener
     *  @param index    - index of current section
     *  @param isAbove  - whether the next section is above or not
     */
    function scrollToSection(e, index, isAbove) {

        e.preventDefault();

        helper.addClass(body, "is-scrolling");

        var windowHeight = window.innerHeight,
            addend = (!isAbove) ? 1 : -1;
            scrollStart = window.scrollY, //windowHeight*index,
            scrollEnd = windowHeight*(index+addend);

        /**
         *  @function animateScroll()
         * 
         *  @description
         *      Animates the scroll using requestAnimationFrame
         *  
         *  @param current  - the current top y-location of the element
         *  @param modulo   - the value to be added/subracted to complete the animation 
         *                    (i.e. when the max interval multiple value is used)
         */
        (function animateScroll(current, modulo) {
            if(current == scrollEnd) {
                afterAnimationCallback();
            } else {
                current = (!current) ? scrollStart : current;
                modulo = (!modulo) ? ((scrollEnd - current) % parameters.animationInterval) : modulo;

                var next = (current + modulo == scrollEnd) ? 
                                current + modulo : 
                                ((current < scrollEnd) ? 
                                    current + parameters.animationInterval : 
                                    current - parameters.animationInterval
                                );

                window.scrollTo(0, next);
                animationId = window.requestAnimationFrame(function(){
                    animateScroll(next, modulo);
                });
            }
        })();
    }

})(helper, this.pageScroller = this.pageScroller === undefined ? {} : this.pageScroller);
