function click_tab(me) {
    document.getElementsByClassName("active")[0].classList.remove("active");//removeClass("active");
    me.className = me.className + " active";
    container = document.getElementById(me.id.replace("tab", "container"));
    container.className = container.className + " active";
}

