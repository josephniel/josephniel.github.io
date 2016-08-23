/** 
 * ---------------------------------------------
 *  @author Joseph Niel I. Tuazon
 *  @version v.0.1.0
 *  @description 
 *      Joseph Niel Tuazon's custom slideshow
 *      made with pure javascript
 * ---------------------------------------------
 * 
 * TODO: Handle multiple classes
 */ 
(function(helper, slideshow){

    /**
     *  @description
     *      The DOM element containing the overall slideshow
     */
    var mainContainer;

    /**
     *  @description
     *      The DOM element containing the thumbnails for the slideshow
     */
    var contentContainer;

    /**
     *  @description
     *      The DOM element containing the contents of the slideshow
     */
    var thumbnailsContainer;

    /**
     *  @description
     *      An object containing the computed width and height of each 
     *      thumbnail
     */
    var thumbnailDimensions;

    /**
     *  @description
     *      The object containing the parameter values
     */
    var parameters = {
        slideshowClass: 'slideshow',
        thumbnailContainerClass: 'slideshow-thumbnails',
        thumbnailClass: 'thumbnail',
        contentContainerClass: 'slideshow-contents',
        contentDetailsClass: 'slideshow-details',
        contentDetailsTitleClass: 'slide-title',
        contentDetailsContentClass: 'slide-content',
    };

    /**
     *  @function initializeSlideshow
     * 
     *  @description
     *      Initializes the slideshow
     */
    slideshow.initializeSlideshow = function(params) {

        // Gets the provided parameters
        if(params) {
            Object.keys(params).forEach(function(key) {
                if(parameters[key])
                    parameters[key] = params[key];
            });
        }

        // Get main parent element
        mainContainer = document.getElementsByClassName(parameters.slideshowClass)[0];

        // Get contents container element
        contentContainer = mainContainer.getElementsByClassName      (parameters.contentContainerClass)[0];
        
        // Get thumbnails container element
        thumbnailsContainer = mainContainer.getElementsByClassName      (parameters.thumbnailContainerClass)[0];

        // Initializes thumbnails
        initializeThumbnails();

        // Initializes contents
        initializeContents();
    }

    /**
     *  @function initializeThumbnails()
     * 
     *  @description 
     *      Runs in procedure the necessary functions to generate
     *      the thumbnails in the slideshow
     */
    function initializeThumbnails() {

        // Sets the thumbnail container heigth 
        setThumbnailContainerHeight();

        // Sets the individual thumbnail width & height
        // and saves the dimensions for later use
        thumbnailDimensions = setThumbnailDimensions();

        // Sets the pseudo-container for the thumbnails 
        setPseudoThumbnailContainer();

        // Sets the navigation for the thumbnails
        setThumbnailNavigation();

        // initializes the navigation functions
        initializeThumbnailNavigation();

        // Checks and hides unnecessary buttons on initialization
        checkNavigationButtonVisibility();
        
        // Initializes all thumbnails
        initializeIndividualThumbnails();
    }

        /**
         *  @function setThumbnailContainerHeight()
         * 
         *  @description 
         *     Sets the height of the thumbnailContainer
         *     element that holds the thumbnails
         */
        function setThumbnailContainerHeight() {
            var mainHeight = mainContainer.offsetHeight,
                contentHeight = contentContainer.offsetHeight,
                thumbnailHeight = mainHeight - contentHeight;

            thumbnailsContainer.style.height = thumbnailHeight + "px";
        }

        /**
         *  @function setThumbnailDimensions()
         * 
         *  @description 
         *     Sets the width and height of every thumbnail
         *     element in the thumbnailContainer element.
         * 
         *  @returns
         *     Object - containing the width and height of a thumbnail
         */
        function setThumbnailDimensions() {
            var thumbnailEls = thumbnailsContainer.getElementsByClassName(parameters.thumbnailClass),
                thumbnailHeight = thumbnailsContainer.offsetHeight,
                thumbnailWidth = Math.floor(thumbnailHeight * (16/9)),
                thumbnailSpacing = 0;

            for(var i = 0; i < thumbnailEls.length; i++) {
                thumbnailEls[i].style.width = thumbnailWidth + "px";
                thumbnailEls[i].style.height = thumbnailHeight + "px";
                if(i != thumbnailEls.length - 1)
                    thumbnailEls[i].style.marginRight = thumbnailSpacing + "px";
            }
            return {
                "width" : thumbnailWidth + thumbnailSpacing,
                "height": thumbnailHeight
            };
        }

        /**
         *  @function setPseudoThumbnailContainer()
         * 
         *  @description 
         *     Sets the properties of the pseudo-container for 
         *     the thumbnails.
         */
        function setPseudoThumbnailContainer() {
            var parentWidth = thumbnailsContainer.offsetWidth,
                pseudoContainerWidth = getPseudoThumbnailContainerWidth(),
                initialRightOffset = (pseudoContainerWidth - parentWidth);
    
            createPseudoThumbnailContainer();

            var pseudoThumbnailContainer = getPseudoThumbnailContainer();

            pseudoThumbnailContainer.style.width = pseudoContainerWidth + "px";
            pseudoThumbnailContainer.style.position = "absolute";
            pseudoThumbnailContainer.style.right = "-" + initialRightOffset + "px";
        }


        /**
         *  @function getPseudoThumbnailContainer()
         * 
         *  @description 
         *     Gets the the pseudo-container DOM element 
         * 
         * @returns
         *     DOM Element - the pseudo-container
         */
        function getPseudoThumbnailContainer() {
            return thumbnailsContainer.getElementsByClassName("pseudo-" + parameters.thumbnailContainerClass)[0];
        }

        /**
         *  @function getPseudoThumbnailContainerWidth()
         * 
         *  @description 
         *     Gets the pseudo-container width based on the
         *     number of thumbnails available
         * 
         *  @returns
         *      Integer - width of pseudo-container
         */
        function getPseudoThumbnailContainerWidth() {
            var thumbnailEls = thumbnailsContainer.getElementsByClassName(parameters.thumbnailClass),
                thumbnailWidth = thumbnailEls[0].offsetWidth,
                thumbnailSpacing = 0;
            
            console.log(thumbnailWidth);
            console.log(thumbnailEls.length);
            return (((thumbnailWidth + thumbnailSpacing) * thumbnailEls.length) - thumbnailSpacing)
        }

        /**
         *  @function createPseudoThumbnailContainer()
         * 
         *  @description 
         *     Creates the pseudo-container element inside the 
         *     thumbnailContainer element.
         */
        function createPseudoThumbnailContainer() {
            thumbnailsContainer.innerHTML = 
                "<div class='pseudo-" + parameters.thumbnailContainerClass + "'>" + 
                    thumbnailsContainer.innerHTML + 
                "</div>";
        }

        /**
         *  @function setThumbnailNavigation()
         * 
         *  @description 
         *     Sets the properties of the navigation element for 
         *     the thumbnails.
         */
        function setThumbnailNavigation() {
            var mainWidth = thumbnailsContainer.offsetWidth,
                thumbnailWidth = thumbnailDimensions.width,
                navigationWidth = mainWidth % thumbnailWidth,
                navigationWidth = (navigationWidth < 30) ? navigationWidth + thumbnailWidth : navigationWidth;
                
            createThumbnailNavigation();

            var thumbnailNavigation = getThumbnailNavigation();

            thumbnailNavigation.left.style.width = navigationWidth + "px";
            thumbnailNavigation.right.style.width = navigationWidth + "px";
        }

        /**
         *  @function createThumbnailNavigation()
         * 
         *  @description 
         *     Creates the left and right navigation buttons for
         *     the thumbnails
         */
        function createThumbnailNavigation() {
            var initialRightOffset = getPseudoThumbnailContainer().style.right,
                initialRightOffset = initialRightOffset.substr(0, initialRightOffset.length - 2);
            
            thumbnailsContainer.innerHTML = 
                "<div class='left-navigation icon-arrow-left' data-offset='0'></div>" + 
                    thumbnailsContainer.innerHTML + 
                "<div class='right-navigation icon-arrow-right' data-offset='" + initialRightOffset + "'></div>" ;
        }

        /**
         *  @function getThumbnailNavigation()
         * 
         *  @description
         *     Gets the left and right navigation DOM elements 
         *     and sets it into an object.
         *     
         *  @returns
         *     Object - containing the left and right navigation
         *     elements
         */
        function getThumbnailNavigation() {
            return {
                "left": thumbnailsContainer.getElementsByClassName("left-navigation")[0],
                "right": thumbnailsContainer.getElementsByClassName("right-navigation")[0]
            };
        }

        /**
         *  @function initializeThumbnailNavigation()
         * 
         *  @description 
         *     Initializes the navigation by setting up 
         *     the event listeners
         */
        function initializeThumbnailNavigation() {
            var mainWidth = thumbnailsContainer.offsetWidth,
                thumbnailWidth = thumbnailDimensions.width,
                navigationWidth = mainWidth % thumbnailWidth,
                navigationWidth = (navigationWidth < 30) ? navigationWidth + thumbnailWidth : navigationWidth,
                thumbnailNavigation = getThumbnailNavigation(),
                pseudoThumbnailContainer = getPseudoThumbnailContainer();

            thumbnailNavigation.left.addEventListener("click", function() {
                
                var rightOffset = (mainWidth - (navigationWidth + thumbnailWidth));
                    right = thumbnailNavigation.right.getAttribute("data-offset"),
                    right = parseInt(right) - rightOffset,
                    left = thumbnailNavigation.left.getAttribute("data-offset"),
                    left = parseInt(left) - rightOffset;

                if(left > 0) {
                    thumbnailNavigation.right.style.width = thumbnailWidth + "px";
                    thumbnailNavigation.left.setAttribute("data-offset", left);
                    thumbnailNavigation.right.setAttribute("data-offset", right);
                }
                else {
                    thumbnailNavigation.right.style.width = navigationWidth + "px";
                    thumbnailNavigation.left.setAttribute("data-offset", 0);
                    thumbnailNavigation.right.setAttribute("data-offset", right - left);
                    right = right - left;
                }
                pseudoThumbnailContainer.style.right = right + "px";

                checkNavigationButtonVisibility();
            });

            thumbnailNavigation.right.addEventListener("click", function() {
                
                var rightOffset = (mainWidth - (navigationWidth + thumbnailWidth));
                    right = thumbnailNavigation.right.getAttribute("data-offset"),
                    right = parseInt(right) + rightOffset,
                    left = thumbnailNavigation.left.getAttribute("data-offset"),
                    left = parseInt(left) + rightOffset;

                if(right < 0) {
                    thumbnailNavigation.left.style.width = thumbnailWidth + "px";
                    thumbnailNavigation.left.setAttribute("data-offset", left);
                    thumbnailNavigation.right.setAttribute("data-offset", right);
                }
                else {
                    thumbnailNavigation.left.style.width = navigationWidth + "px";
                    thumbnailNavigation.left.setAttribute("data-offset", left - right);
                    thumbnailNavigation.right.setAttribute("data-offset", 0);
                    right = 0;
                }
                pseudoThumbnailContainer.style.right = right + "px";

                checkNavigationButtonVisibility();
            });
        }

        /**
         *  @function checkNavigationButtonVisibility()
         * 
         *  @description 
         *     Checks if the data offset for a button is zero. If so,
         *     the button is hidden.
         */
        function checkNavigationButtonVisibility() {
            var pseudoContainerWidth = getPseudoThumbnailContainerWidth(),
                thumbnailContainerWidth = thumbnailsContainer.offsetWidth,
                thumbnailNavigation = getThumbnailNavigation(),
                leftOffset = thumbnailNavigation.left.getAttribute("data-offset"),
                rightOffset = thumbnailNavigation.right.getAttribute("data-offset");

            if(thumbnailContainerWidth < pseudoContainerWidth) {
                thumbnailNavigation.left.style.display = 
                    (leftOffset == "0") ? "none" : "flex";
                thumbnailNavigation.right.style.display = 
                    (rightOffset == "0") ? "none" : "flex";
            }
            else {
                thumbnailNavigation.left.style.display = "none";
                thumbnailNavigation.right.style.display = "none";
            }
        }

        /**
         *  @function initializeIndividualThumbnails()
         * 
         *  @description 
         *     Initializes all thumbnails by attaching to each one
         *     an event listener.
         */
        function initializeIndividualThumbnails() {
            var thumbnails = getThumbnails();
                
            helper.addClass(thumbnails[0], "is-active");
            setSlideshowContent(thumbnails[0]);

            thumbnails.forEach(function(thumbnail) {
                thumbnail.addEventListener("click", function() {
                    removeActiveThumbnails();
                    helper.addClass(thumbnail, "is-active");
                    setSlideshowContent(thumbnail);
                });
            }, this);
        }

        /**
         *  @function removeActiveThumbnails()
         * 
         *  @description 
         *     Removes the "is-active" class from all thumbnails
         */
        function removeActiveThumbnails() {
            getThumbnails().forEach(function(thumbnail) {
                helper.removeClass(thumbnail, "is-active");
            }, this);
        }
        
        /**
         *  @function getThumbnails()
         * 
         *  @description 
         *     Gets the array of thumbnails
         * 
         *  @returns
         *     Array - DOM elements (i.e. thumbnails)
         */
        function getThumbnails() {
            var thumbnails = thumbnailsContainer.getElementsByClassName(parameters.thumbnailClass);
            return Array.prototype.slice.call(thumbnails);
        }

        /**
         *  @function setSlideshowContent()
         * 
         *  @description 
         *     Displays the current content of the thumbnail
         *     for the slideshow
         * 
         *  @param thumbnail - the thumbnail to be displayed
         */
        function setSlideshowContent(thumbnail) {
            var imageURL = thumbnail.getAttribute("src");
            contentContainer.style.backgroundImage = "url("+imageURL+")";
            
            var contentDetailsContainer = contentContainer.getElementsByClassName(parameters.contentDetailsClass)[0],
                contentDetailsTitle = contentDetailsContainer.getElementsByClassName(parameters.contentDetailsTitleClass)[0];

            contentDetailsTitle.innerHTML = 
                "<div class='icon-circle-up'></div>" + 
                "<span class='title'>" +
                thumbnail.getAttribute("data-slide-title") +
                "</span>";

            var contentDetailsId = thumbnail.getAttribute("data-slide-content"),
                contentDetails = contentDetailsContainer.getElementsByClassName(parameters.contentDetailsContentClass);
                contentDetailsArray = Array.prototype.slice.call(contentDetails);
            
            contentDetailsArray.forEach(function(contentDetail) {
                var currentId = contentDetail.getAttribute("id");
                if(currentId == contentDetailsId) 
                    contentDetail.style.display = "flex";
                else 
                    contentDetail.style.display = "none";
            }, this);
        }

    /**
     *  @function initializeThumbnails()
     * 
     *  @description 
     *      Runs in procedure the necessary functions to generate
     *      the contents of the slideshow
     */
    function initializeContents() {

        initializeContentDetailsContainer();
    }

        function initializeContentDetailsContainer() {
            var contentDetailsContainer = contentContainer.getElementsByClassName(parameters.contentDetailsClass)[0],
                contentDetailsTitle = contentDetailsContainer.getElementsByClassName(parameters.contentDetailsTitleClass)[0],
                containerHeight = contentDetailsContainer.offsetHeight,
                titleHeight = contentDetailsTitle.offsetHeight,
                topOffset = containerHeight - titleHeight;
                
            contentDetailsContainer.style.top = topOffset + "px";
            contentDetailsContainer.addEventListener("mouseover", function() {
                contentDetailsContainer.style.top = 0;
            });
            contentDetailsContainer.addEventListener("mouseout", function() {
                contentDetailsContainer.style.top = topOffset + "px";
            });
        }

    
})(helper, this.slideshow = this.slideshow === undefined ? {} : this.slideshow);
