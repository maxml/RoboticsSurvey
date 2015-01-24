(function () {
    Parse.initialize("EGBizx6dufMsT8d8ZnxmjP2qSEIsW2FzBwtdZNa7",
            "9KVQaAV99yIHgZmgsmhp54LxqfWqkoxFFwIwuk4u");
    // TODO: security?!

    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };

    function click_tab(me) {
        document.getElementsByClassName("active")[0].classList.remove("active");//removeClass("active");
        me.className = me.className + " active";
        container = document.getElementById(me.id.replace("tab", "container"));
        container.className = container.className + " active";
    }

})();
