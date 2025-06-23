// โหลดข้อมูลจาก data base
function loadUsers() {
    fetch("crud.php")
        .then(response => response.json())
        .then(users => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ""; // ล้างค่าก่อน
            users.forEach(user => {
                const row = `<tr>
                    <td>${user.ID}</td>
                    <td>${user.fname}</td>
                    <td>${user.lname}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    </tr>`;
                tbody.innerHTML += row;

            });
        });
}

document.addEventListener("DOMContentLoaded", loadUsers);

// เมื่อ submit form
document.getElementById("form-add-user").addEventListener("submit", function (e) {
    e.preventDefault(); // กันรีเฟรช

    const formData = new FormData(this);

    fetch("crud.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("User added!!!");

                // ปิด modal ด้วย Bootstrap 5 JS API
                const modalElement = document.getElementById('Add-User-Modal');
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

                modal.hide(); // ปิด modal

                // โหลดหน้า Users
                loadUsers();
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(err => console.error("Error:", err));
});