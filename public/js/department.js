$(document).ready(function () {
    $(document).on("click", ".open-DeleteDepartmentDialog", function () {
        var _id = $(this).data('id');
        $(".modal-footer #departmentId").val(_id);
    })

    $(document).on("click", ".edit-DepartmentName", function () {
        var departmentName = $(this).attr("value");
        if (departmentName != "" || departmentName != null) {
            $("#inputDepartmentName").val(departmentName);
        }
    })
})