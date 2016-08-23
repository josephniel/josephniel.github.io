(function(pageScroller, slideshow, helper){

    // Initializes the sections used for the full page scroll
    // Custom page scroller JS
    pageScroller.initializeSections({
        animationInterval: 40,
        sectionTitleClass: "page-header",
        sectionPageClass: "page-counter",
    });

    // Custom slideshow JS
    slideshow.initializeSlideshow();

    // Custom tooltip JS
    var tooltipTriggers = document.getElementsByClassName("tooltip-trigger"),
        tooltipTriggersArray = Array.prototype.slice.call(tooltipTriggers);

    tooltipTriggersArray.forEach(function(tooltipTrigger) {
        var tooltipParent = tooltipTrigger.parentNode,
            tooltipEl = tooltipParent.getElementsByClassName("tooltip")[0];

        tooltipParent.addEventListener("mouseover", function(){
                
            tooltipEl.style.display = "block";

            tooltipEl.innerHTML = 
                "<span class='arrow-up'></span>" + 
                tooltipEl.innerHTML;

            var tooltipWidth = tooltipEl.clientWidth,
                containerWidth = tooltipTrigger.clientWidth,
                excessWidth = Math.abs(tooltipWidth - containerWidth),
                marginOffset = Math.ceil(excessWidth/2);            

            tooltipEl.style.left = (tooltipWidth < containerWidth) ? marginOffset + "px" : "-" + marginOffset + "px";
        });

        tooltipParent.addEventListener("mouseout", function() {
            
            tooltipEl.style.display = "none";
                
            var upArrow = tooltipEl.getElementsByClassName("arrow-up")[0];
            upArrow.parentNode.removeChild(upArrow);
        })
    }, this);

    // Executes whenever the page load is finished
    window.onload = function() {
        // Just to set the first section shown if ever 
        // any scroll happened during load
        window.scrollTo(0, 0); 
        // Fades out the preloader upon page load
        helper.fadeOut(document.getElementById("loader-container"));
    }

})(pageScroller, slideshow, helper);