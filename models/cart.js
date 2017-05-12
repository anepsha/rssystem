module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;

    this.add = function (user, item, id, departmentName) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { user: user, item: item, qty: 0, departmentName: departmentName };
        }
        storedItem.qty++;
        this.totalQty++;
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
}
