var collapsibles = document.getElementsByClassName("release");
var i;

for( i = 0 ; i < collapsibles.length ; i++ )
{
    // Add the click event
    collapsibles[i].addEventListener( "click", ToggleContent );

    
    // // Hide the content
    // var content = collapsibles[i].nextElementSibling;
    // content.style.display = "none";
}



function ToggleContent()
{
    this.classList.toggle("release-show-content");
    var content = this.nextElementSibling;

    if (content.style.maxHeight)
        content.style.maxHeight = null;
    else
        content.style.maxHeight = content.scrollHeight + "px";
    
}

