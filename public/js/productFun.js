$(document).ready(function () {
    $(document).on("click", ".open-DeleteProductDialog", function () {
        var _id = $(this).data('id');
        $(".modal-footer #productId").val(_id);
    })
})