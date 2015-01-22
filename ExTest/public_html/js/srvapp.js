(function () {
    Parse.initialize("EGBizx6dufMsT8d8ZnxmjP2qSEIsW2FzBwtdZNa7",
            "9KVQaAV99yIHgZmgsmhp54LxqfWqkoxFFwIwuk4u");
    // TODO: security?!

    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };
})();