/*=========================================
Feature Cards Reveal
=========================================*/

const featureCards = document.querySelectorAll(".feature-card");

const featureObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show-card");

        }

    });

},{
    threshold:.2
});

featureCards.forEach(card=>{

    featureObserver.observe(card);

});