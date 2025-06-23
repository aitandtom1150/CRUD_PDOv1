// โหลดข้อมูลจาก data base
function loadUsers() {
    fetch("crud.php")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(users => {
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = ""; // ล้างค่าก่อน
            if (Array.isArray(users)) {
                users.forEach(user => {
                    const row = `<tr>
                    <td>${user.ID}</td>
                    <td>${user.fname}</td>
                    <td>${user.lname}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${user.ID}" data-fname="${user.fname}" data-lname="${user.lname}" data-email="${user.email}" data-phone="${user.phone}" data-bs-toggle="modal" data-bs-target="#Edit-User-Modal">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${user.ID}">Delete</button>
                    </td>
                    </tr>`;
                    tbody.innerHTML += row;
                });
                // เพิ่ม Listener หลังสร้างปุ่มเสร็จ
                attachEventListeners();
            } else if (users && !users.success) {
                console.error("Sever error loading users: ", users.message);
                alert("Error loading users: " + users.message);
            }
        })
        .catch(error => {
            console.error("Error fetching users: ", error);
            alert("Something wrong while fetching users.")
        });
}
// function สำหรับแนบ Event Listeners ให้ปุ่ม Edit,Delete
function attachEventListeners() {
    // btn Edit
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.removeEventListener("click", handleEditClick); // ลบ listener เก่าก่อน ป้อนกันการซ้ำ
        button.addEventListener("click", handleEditClick);
    })

    // btn Delete
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.removeEventListener("click", handleDeleteClick);
        button.addEventListener("click", handleDeleteClick);
    })
}

// Event hadler สำหรับปุ่ม Edit
function handleEditClick(event) {
    const button = event.target;
    const id = button.dataset.id;
    const fname = button.dataset.fname;
    const lname = button.dataset.lname;
    const email = button.dataset.email;
    const phone = button.dataset.phone;

    // เติมข้อมูล ลงใน form แก้ไข
    document.getElementById("edit-user-ID").value = id;
    document.getElementById("edit-firstname").value = fname;
    document.getElementById("edit-lastname").value = lname;
    document.getElementById("edit-email").value = email;
    document.getElementById("edit-phone").value = phone;
}

// Event handler สำหรับปุ่ม Delete
function handleDeleteClick(event) {
    const id = event.target.dataset.id;
    if (confirm(`Are u sure u wanna delete User ID: ${id}`)) {
        fetch("crud.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json" // ระบุว่าส่งข้อมูลเป็น JSON
            },
            body: JSON.stringify({ ID: id }) // ส่ง ID ในรูปแบบ JSON
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network reponse was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then (data => {
                if (data.success) {
                    alert(data.message);
                    loadUsers(); // โหลดข้อมูลใหม่หลังจากลบ
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(err => {
                console.error("Error deleting user:", err);
                alert("Something wrong while deleting!!!");
            });
    }
}

document.addEventListener("DOMContentLoaded", loadUsers);


// เมื่อ submit form
document.getElementById("form-add-user").addEventListener("submit", function (e) {
    e.preventDefault(); // กันรีเฟรช

    const formData = new FormData(this);

    fetch("crud.php", {
        method: "POST", // นี่คือส่วนที่ระบุว่าเป็นการส่งคำขอแบบ POST
        body: formData  // ส่วนนี้คือข้อมูลที่คุณจะส่งไปกับคำขอ POST
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
