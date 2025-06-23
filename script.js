const users = {
    patients: {
        'RM001': { 
            password: 'patient123', 
            name: 'John Doe', 
            phone: '081234567890',
            medicalRecords: []
        },
        'RM002': { 
            password: 'patient456', 
            name: 'Jane Smith', 
            phone: '081234567891',
            medicalRecords: []
        }
    },
    doctors: {
        'DOC001': { password: 'doctor123', name: 'Dr. Ahmad Susanto', specialty: 'Dokter Umum', poli: 'Poli Umum' },
        'DOC002': { password: 'doctor456', name: 'Dr. Sarah Wijaya', specialty: 'Dokter Gigi', poli: 'Poli Gigi' },
        'DOC003': { password: 'doctor789', name: 'Dr. Michael Chen', specialty: 'Spesialis Dalam', poli: 'Poli Penyakit Dalam' },
        'DOC004': { password: 'doctor012', name: 'Dr. Siti Nurhaliza', specialty: 'Spesialis Kandungan', poli: 'Poli Kandungan' }
    },
    admin: {
        'admin': { password: 'admin123', name: 'Administrator' }
    }
};

const schedules = {
    'umum': [
        { id: 'SCH001', doctor: 'Dr. Ahmad Susanto', date: '2025-06-09', day: 'Senin', time: '08:00-12:00', patients: 5, maxPatients: 20, appointments: [] },
        { id: 'SCH002', doctor: 'Dr. Ahmad Susanto', date: '2025-06-11', day: 'Rabu', time: '14:00-18:00', patients: 8, maxPatients: 20, appointments: [] },
        { id: 'SCH003', doctor: 'Dr. Budi Santoso', date: '2025-06-10', day: 'Selasa', time: '08:00-12:00', patients: 12, maxPatients: 20, appointments: [] }
    ],
    'gigi': [
        { id: 'SCH004', doctor: 'Dr. Sarah Wijaya', date: '2025-06-09', day: 'Senin', time: '09:00-13:00', patients: 3, maxPatients: 15, appointments: [] },
        { id: 'SCH005', doctor: 'Dr. Sarah Wijaya', date: '2025-06-12', day: 'Kamis', time: '14:00-17:00', patients: 7, maxPatients: 15, appointments: [] }
    ],
    'dalam': [
        { id: 'SCH006', doctor: 'Dr. Michael Chen', date: '2025-06-10', day: 'Selasa', time: '08:00-12:00', patients: 15, maxPatients: 20, appointments: [] },
        { id: 'SCH007', doctor: 'Dr. Michael Chen', date: '2025-06-13', day: 'Jumat', time: '13:00-17:00', patients: 9, maxPatients: 20, appointments: [] }
    ],
    'kandungan': [
        { id: 'SCH008', doctor: 'Dr. Siti Nurhaliza', date: '2025-06-11', day: 'Rabu', time: '08:00-12:00', patients: 6, maxPatients: 18, appointments: [] },
        { id: 'SCH009', doctor: 'Dr. Siti Nurhaliza', date: '2025-06-14', day: 'Sabtu', time: '09:00-13:00', patients: 4, maxPatients: 18, appointments: [] }
    ]
};

let currentUser = null;
let currentUserType = null;
let selectedDate = null;

function showSection(section) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section + 'Section').classList.remove('hidden');
    document.querySelector('footer').classList.toggle('hidden', section !== 'home');
    // Show navbar only on home/landing
    if(section === 'home') {
        document.getElementById('mainNavbar').style.display = '';
    } else {
        document.getElementById('mainNavbar').style.display = '';
    }
    if (document.getElementById('navLinks').classList.contains('active')) {
        toggleMenu();
    }
}

function showLogin(type) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(type + 'LoginSection').classList.remove('hidden');
    document.querySelector('footer').classList.add('hidden');
    document.getElementById('mainNavbar').style.display = '';
    if (document.getElementById('navLinks').classList.contains('active')) {
        toggleMenu();
    }
}

function showRegister() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('patientRegisterSection').classList.remove('hidden');
    document.querySelector('footer').classList.add('hidden');
    if (document.getElementById('navLinks').classList.contains('active')) {
        toggleMenu();
    }
}

function showDashboard(type) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(type + 'Dashboard').classList.remove('hidden');
    document.querySelector('footer').classList.add('hidden');
    hideNavbar();
}

function logout() {
    currentUser = null;
    currentUserType = null;
    showSection('home');
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.getElementById('mainNavbar').style.display = '';
    if (document.getElementById('navLinks').classList.contains('active')) {
        toggleMenu();
    }
}

document.getElementById('patientLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('patientId').value;
    const password = document.getElementById('patientPassword').value;

    if (users.patients[id] && users.patients[id].password === password) {
        currentUser = users.patients[id];
        currentUserType = 'patient';
        showDashboard('patient');
        updatePatientInfo(id, currentUser);
        updatePatientAppointments();
        updatePatientMedicalRecords();
        setDateConstraints();
    } else {
        alert('No. RM atau password salah!');
    }
});

document.getElementById('patientRegisterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !phone || !password) {
        alert('Harap lengkapi semua data!');
        return;
    }

    const newPatientId = `RM${Object.keys(users.patients).length + 1}`.padStart(5, '0');
    users.patients[newPatientId] = { password, name, phone, medicalRecords: [] };
    alert(`Registrasi berhasil!\nNo. Rekam Medis Anda: ${newPatientId}\nSilakan login untuk melanjutkan.`);
    showLogin('patient');
});

document.getElementById('doctorLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('doctorId').value;
    const password = document.getElementById('doctorPassword').value;

    if (users.doctors[id] && users.doctors[id].password === password) {
        currentUser = users.doctors[id];
        currentUserType = 'doctor';
        showDashboard('doctor');
        updateDoctorInfo(currentUser);
        updateDoctorSchedule();
        updateTodayPatients();
    } else {
        alert('ID dokter atau password salah!');
    }
});

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const password = document.getElementById('adminPassword').value;

    if (users.admin[id] && users.admin[id].password === password) {
        currentUser = users.admin[id];
        currentUserType = 'admin';
        showDashboard('admin');
        updateAdminStats();
        updateReports();
        updateAdminMedicalReports();
        searchPatientMedicalRecords();
    } else {
        alert('Username atau password salah!');
    }
});

function setDateConstraints() {
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    dateInput.min = minDate.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];
}

function updatePatientInfo(rmId, userData) {
    document.getElementById('patientName').textContent = userData.name;
    document.getElementById('patientRM').textContent = rmId;
    document.getElementById('patientPhone').textContent = userData.phone;
}

function updateDoctorInfo(userData) {
    document.getElementById('doctorName').textContent = userData.name;
    document.getElementById('doctorSpec').textContent = userData.specialty;
    document.getElementById('doctorPoli').textContent = userData.poli;
}

function updatePatientMedicalRecords() {
    const tbody = document.getElementById('patientMedicalRecords');
    tbody.innerHTML = '';
    const patientId = document.getElementById('patientRM').textContent;

    if (users.patients[patientId].medicalRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Belum ada rekam medis.</td></tr>';
        return;
    }

    users.patients[patientId].medicalRecords.forEach(record => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.poli}</td>
            <td>${record.doctor}</td>
            <td>${record.diagnosis}</td>
            <td>${record.therapy}</td>
        `;
    });
}

function showPoliSelection() {
    selectedDate = document.getElementById('appointmentDate').value;
    if (!selectedDate) {
        alert('Silakan pilih tanggal terlebih dahulu!');
        return;
    }
    document.getElementById('poliModal').style.display = 'block';
}

function selectPoli(poliType) {
    const poliNames = {
        'umum': 'Poli Umum',
        'gigi': 'Poli Gigi',
        'dalam': 'Poli Penyakit Dalam',
        'kandungan': 'Poli Kandungan'
    };

    document.getElementById('scheduleTitle').textContent = `Jadwal ${poliNames[poliType]}`;
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = '';

    const poliSchedules = schedules[poliType].filter(s => s.date === selectedDate);
    const scheduleGrid = document.createElement('div');
    scheduleGrid.className = 'schedule-grid';

    poliSchedules.forEach((schedule, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        if (schedule.patients >= schedule.maxPatients) {
            scheduleItem.classList.add('full');
        }

        const estimatedTime = calculateEstimatedTime(schedule);
        scheduleItem.innerHTML = `
            <h5>${schedule.doctor}</h5>
            <p><strong>${schedule.day}</strong></p>
            <p>${schedule.time}</p>
            <p>Pasien: ${schedule.patients}/${schedule.maxPatients}</p>
            <p>Estimasi: ${estimatedTime}</p>
            ${schedule.patients < schedule.maxPatients ? 
                `<button class="btn btn-primary" onclick="bookAppointment('${poliType}', '${schedule.id}')">Pilih Jadwal</button>` : 
                '<span class="status-badge status-full">Penuh</span>'
            }
        `;
        scheduleGrid.appendChild(scheduleItem);
    });

    scheduleContent.appendChild(scheduleGrid);
    closeModal('poliModal');
    document.getElementById('scheduleModal').style.display = 'block';
}

function calculateEstimatedTime(schedule) {
    const [startTime] = schedule.time.split('-');
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const patients = schedule.patients;
    const estimatedMinutes = startMinutes + patients * 15; // 15 minutes per patient
    const estHours = Math.floor(estimatedMinutes / 60);
    const estMinutes = estimatedMinutes % 60;
    return `${estHours.toString().padStart(2, '0')}:${estMinutes.toString().padStart(2, '0')}`;
}

function bookAppointment(poliType, scheduleId) {
    const schedule = schedules[poliType].find(s => s.id === scheduleId);
    if (schedule.patients >= schedule.maxPatients) {
        alert('Maaf, jadwal sudah penuh!');
        return;
    }

    schedule.patients++;
    schedule.appointments.push({
        patientId: document.getElementById('patientRM').textContent,
        patientName: document.getElementById('patientName').textContent,
        queueNumber: schedule.patients,
        estimatedTime: calculateEstimatedTime(schedule),
        status: 'Terkonfirmasi'
    });

    alert(`Perjanjian berhasil dibuat!\nDokter: ${schedule.doctor}\nTanggal: ${schedule.date}\nJam: ${schedule.time}\nNo. Antrian: ${schedule.patients}\nEstimasi: ${calculateEstimatedTime(schedule)}`);
    closeModal('scheduleModal');
    updatePatientAppointments();
}

function showMedicalRecordForm(patientId, patientName, scheduleId, poliType) {
    const schedule = schedules[poliType].find(s => s.id === scheduleId);
    document.getElementById('scheduleTitle').textContent = `Catat Rekam Medis - ${patientName}`;
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div class="card">
            <h4>Rekam Medis untuk ${patientName} (RM: ${patientId})</h4>
            <div class="form-group">
                <label>Tanggal Kunjungan</label>
                <input type="date" id="recordDate" value="${schedule.date}" readonly>
            </div>
            <div class="form-group">
                <label>Poliklinik</label>
                <input type="text" id="recordPoli" value="${poliType.charAt(0).toUpperCase() + poliType.slice(1)}" readonly>
            </div>
            <div class="form-group">
                <label>Dokter</label>
                <input type="text" id="recordDoctor" value="${schedule.doctor}" readonly>
            </div>
            <div class="form-group">
                <label>Anamnesa</label>
                <textarea id="recordAnamnesis" placeholder="Masukkan anamnesa" required></textarea>
            </div>
            <div class="form-group">
                <label>Pemeriksaan Fisik</label>
                <textarea id="recordPhysicalExam" placeholder="Masukkan hasil pemeriksaan fisik" required></textarea>
            </div>
            <div class="form-group">
                <label>Diagnosis</label>
                <textarea id="recordDiagnosis" placeholder="Masukkan diagnosis" required></textarea>
            </div>
            <div class="form-group">
                <label>Terapi</label>
                <textarea id="recordTherapy" placeholder="Masukkan terapi" required></textarea>
            </div>
            <button class="btn btn-success" onclick="addMedicalRecord('${patientId}', '${scheduleId}', '${poliType}')">Simpan Rekam Medis</button>
        </div>
    `;
    document.getElementById('scheduleModal').style.display = 'block';
}

function addMedicalRecord(patientId, scheduleId, poliType) {
    const schedule = schedules[poliType].find(s => s.id === scheduleId);
    const record = {
        date: document.getElementById('recordDate').value,
        poli: document.getElementById('recordPoli').value,
        doctor: document.getElementById('recordDoctor').value,
        anamnesis: document.getElementById('recordAnamnesis').value,
        physicalExam: document.getElementById('recordPhysicalExam').value,
        diagnosis: document.getElementById('recordDiagnosis').value,
        therapy: document.getElementById('recordTherapy').value
    };

    if (!record.anamnesis || !record.physicalExam || !record.diagnosis || !record.therapy) {
        alert('Harap lengkapi semua data rekam medis!');
        return;
    }

    users.patients[patientId].medicalRecords.push(record);
    alert('Rekam medis berhasil disimpan!');
    closeModal('scheduleModal');
    updateTodayPatients();
}

function updatePatientAppointments() {
    const tbody = document.getElementById('patientAppointments');
    tbody.innerHTML = '';
    const patientId = document.getElementById('patientRM').textContent;

    Object.keys(schedules).forEach(poliType => {
        schedules[poliType].forEach(schedule => {
            schedule.appointments.forEach(appointment => {
                if (appointment.patientId === patientId) {
                    const row = tbody.insertRow();
                    row.innerHTML = `
                        <td>${schedule.date}</td>
                        <td>${poliType.charAt(0).toUpperCase() + poliType.slice(1)}</td>
                        <td>${schedule.doctor}</td>
                        <td>${schedule.time}</td>
                        <td>${appointment.queueNumber}</td>
                        <td>${appointment.estimatedTime}</td>
                        <td><span class="status-badge status-${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                    `;
                }
            });
        });
    });
}

function updateDoctorSchedule() {
    const tbody = document.getElementById('doctorSchedule');
    tbody.innerHTML = '';
    const doctorName = document.getElementById('doctorName').textContent;

    Object.keys(schedules).forEach(poliType => {
        schedules[poliType]
            .filter(schedule => schedule.doctor === doctorName)
            .forEach(schedule => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${schedule.day}</td>
                    <td>${schedule.time}</td>
                    <td>${schedule.patients}/${schedule.maxPatients}</td>
                    <td><span class="status-badge status-${schedule.patients > 0 ? 'confirmed' : 'pending'}">${schedule.patients > 0 ? 'Aktif' : 'Standby'}</span></td>
                `;
            });
    });
}

function updateTodayPatients() {
    const tbody = document.getElementById('todayPatients');
    tbody.innerHTML = '';
    // Data dummy untuk tampilan
    const dummyPatients = [
        {
            queue: 1,
            name: 'John Doe',
            rm: 'RM001',
            time: '08:00',
            status: 'Terkonfirmasi'
        },
        {
            queue: 2,
            name: 'Jane Smith',
            rm: 'RM002',
            time: '08:15',
            status: 'Terkonfirmasi'
        },
        {
            queue: 3,
            name: 'Budi Santoso',
            rm: 'RM003',
            time: '08:30',
            status: 'Terkonfirmasi'
        }
    ];
    dummyPatients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.queue}</td>
            <td>${patient.name}</td>
            <td>${patient.rm}</td>
            <td>${patient.time}</td>
            <td><span class="status-badge status-confirmed">${patient.status}</span></td>
            <td><button class="btn btn-primary" disabled>Lihat Rekam Medis</button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateAdminStats() {
    let totalPatients = 0;
    let activeSchedules = 0;

    Object.keys(schedules).forEach(poliType => {
        schedules[poliType].forEach(schedule => {
            totalPatients += schedule.patients;
            if (schedule.patients > 0) activeSchedules++;
        });
    });

    document.getElementById('totalPatients').textContent = totalPatients;
    document.getElementById('totalDoctors').textContent = Object.keys(users.doctors).length;
    document.getElementById('activeSchedules').textContent = activeSchedules;
}

function manageSchedules() {
    document.getElementById('scheduleTitle').textContent = 'Kelola Jadwal Dokter';
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div class="card">
            <h4>Tambah Jadwal Baru</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div class="form-group">
                    <label>Dokter</label>
                    <select id="newScheduleDoctor" required>
                        ${Object.keys(users.doctors).map(id => `<option value="${users.doctors[id].name}">${users.doctors[id].name} (${users.doctors[id].poli})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Tanggal</label>
                    <input type="date" id="newScheduleDate" required>
                </div>
                <div class="form-group">
                    <label>Jam</label>
                    <input type="text" id="newScheduleTime" placeholder="08:00-12:00" required>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div class="form-group">
                    <label>Poliklinik</label>
                    <select id="newSchedulePoli" required>
                        <option value="umum">Poli Umum</option>
                        <option value="gigi">Poli Gigi</option>
                        <option value="dalam">Poli Penyakit Dalam</option>
                        <option value="kandungan">Poli Kandungan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Kuota Maksimal</label>
                    <input type="number" id="newScheduleQuota" placeholder="20" max="20" required>
                </div>
            </div>
            <button class="btn btn-success" onclick="addSchedule()">Tambah Jadwal</button>
        </div>
        <div class="card" style="margin-top: 20px;">
            <h4>Jadwal Saat Ini</h4>
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Dokter</th>
                            <th>Poliklinik</th>
                            <th>Tanggal</th>
                            <th>Jam</th>
                            <th>Kuota</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="currentSchedules"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = document.getElementById('currentSchedules');
    Object.keys(schedules).forEach(poliType => {
        schedules[poliType].forEach(schedule => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${schedule.doctor}</td>
                <td>${poliType.charAt(0).toUpperCase() + poliType.slice(1)}</td>
                <td>${schedule.date}</td>
                <td>${schedule.time}</td>
                <td>${schedule.maxPatients}</td>
                <td>
                    <button class="btn btn-warning" onclick="editSchedule('${poliType}', '${schedule.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteSchedule('${poliType}', '${schedule.id}')">Hapus</button>
                </td>
            `;
        });
    });

    document.getElementById('scheduleModal').style.display = 'block';
}

function addSchedule() {
    const doctor = document.getElementById('newScheduleDoctor').value;
    const date = document.getElementById('newScheduleDate').value;
    const time = document.getElementById('newScheduleTime').value;
    const poliType = document.getElementById('newSchedulePoli').value;
    const quota = parseInt(document.getElementById('newScheduleQuota').value);

    if (!doctor || !date || !time || !poliType || !quota || quota > 20) {
        alert('Harap lengkapi data dengan benar (kuota maksimal 20)!');
        return;
    }

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const day = days[new Date(date).getDay()];
    const newSchedule = {
        id: `SCH${Date.now()}`,
        doctor: doctor,
        date: date,
        day: day,
        time: time,
        patients: 0,
        maxPatients: quota,
        appointments: []
    };

    schedules[poliType].push(newSchedule);
    alert('Jadwal baru berhasil ditambahkan!');
    closeModal('scheduleModal');
    updateAdminStats();
}

function editSchedule(poliType, scheduleId) {
    const schedule = schedules[poliType].find(s => s.id === scheduleId);
    document.getElementById('newScheduleDoctor').value = schedule.doctor;
    document.getElementById('newScheduleDate').value = schedule.date;
    document.getElementById('newScheduleTime').value = schedule.time;
    document.getElementById('newSchedulePoli').value = poliType;
    document.getElementById('newScheduleQuota').value = schedule.maxPatients;

    const saveButton = document.querySelector('.btn-success');
    saveButton.textContent = 'Simpan Perubahan';
    saveButton.onclick = () => {
        schedule.doctor = document.getElementById('newScheduleDoctor').value;
        schedule.date = document.getElementById('newScheduleDate').value;
        schedule.time = document.getElementById('newScheduleTime').value;
        const newPoliType = document.getElementById('newSchedulePoli').value;
        schedule.maxPatients = parseInt(document.getElementById('newScheduleQuota').value);
        schedule.day = days[new Date(schedule.date).getDay()];
        
        if (newPoliType !== poliType) {
            schedules[poliType] = schedules[poliType].filter(s => s.id !== scheduleId);
            schedules[newPoliType].push(schedule);
        }

        alert('Jadwal berhasil diperbarui!');
        closeModal('scheduleModal');
        updateAdminStats();
    };
}

function deleteSchedule(poliType, scheduleId) {
    if (confirm('Yakin ingin menghapus jadwal ini?')) {
        schedules[poliType] = schedules[poliType].filter(s => s.id !== scheduleId);
        alert('Jadwal berhasil dihapus!');
        closeModal('scheduleModal');
        updateAdminStats();
    }
}

function viewAllAppointments() {
    document.getElementById('scheduleTitle').textContent = 'Semua Perjanjian Pasien';
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <label>Filter berdasarkan:</label>
            <select id="filterPoli" style="margin-left: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                <option value="">Semua Poliklinik</option>
                <option value="umum">Poli Umum</option>
                <option value="gigi">Poli Gigi</option>
                <option value="dalam">Poli Penyakit Dalam</option>
                <option value="kandungan">Poli Kandungan</option>
            </select>
            <input type="date" id="filterDate" style="margin-left: 10px; padding: 10px;">
            <button class="btn btn-primary" style="margin-left: 10px;" onclick="filterAppointments()">Filter</button>
        </div>
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID Perjanjian</th>
                        <th>Tanggal</th>
                        <th>Pasien</th>
                        <th>No. RM</th>
                        <th>Poliklinik</th>
                        <th>Dokter</th>
                        <th>Jam</th>
                        <th>No. Antrian</th>
                        <th>Estimasi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="allAppointments"></tbody>
            </table>
        </div>
    `;

    filterAppointments();
    document.getElementById('scheduleModal').style.display = 'block';
}

function filterAppointments() {
    const poliFilter = document.getElementById('filterPoli').value;
    const dateFilter = document.getElementById('filterDate').value;
    const tbody = document.getElementById('allAppointments');
    tbody.innerHTML = '';

    Object.keys(schedules).forEach(poliType => {
        if (!poliFilter || poliType === poliFilter) {
            schedules[poliType].forEach(schedule => {
                if (!dateFilter || schedule.date === dateFilter) {
                    schedule.appointments.forEach(appointment => {
                        const row = tbody.insertRow();
                        row.innerHTML = `
                            <td>APT${appointment.queueNumber}${schedule.id}</td>
                            <td>${schedule.date}</td>
                            <td>${appointment.patientName}</td>
                            <td>${appointment.patientId}</td>
                            <td>${poliType.charAt(0).toUpperCase() + poliType.slice(1)}</td>
                            <td>${schedule.doctor}</td>
                            <td>${schedule.time}</td>
                            <td>${appointment.queueNumber}</td>
                            <td>${appointment.estimatedTime}</td>
                            <td><span class="status-badge status-${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                        `;
                    });
                }
            });
        }
    });
}

function manageDoctors() {
    document.getElementById('scheduleTitle').textContent = 'Manajemen Dokter';
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div class="card">
            <h4>Tambah Dokter Baru</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group">
                    <label>ID Dokter</label>
                    <input type="text" id="newDoctorId" placeholder="DOC003" required>
                </div>
                <div class="form-group">
                    <label>Nama Dokter</label>
                    <input type="text" id="newDoctorName" placeholder="Dr. Nama Dokter" required>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group">
                    <label>Spesialisasi</label>
                    <input type="text" id="newDoctorSpec" placeholder="Spesialisasi" required>
                </div>
                <div class="form-group">
                    <label>Poliklinik</label>
                    <select id="newDoctorPoli" required>
                        <option value="umum">Poli Umum</option>
                        <option value="gigi">Poli Gigi</option>
                        <option value="dalam">Poli Penyakit Dalam</option>
                        <option value="kandungan">Poli Kandungan</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="newDoctorPassword" placeholder="Password" required>
            </div>
            <button class="btn btn-success" onclick="addDoctor()">Tambah Dokter</button>
        </div>
        <div class="card" style="margin-top: 20px;">
            <h4>Daftar Dokter</h4>
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID Dokter</th>
                            <th>Nama</th>
                            <th>Spesialisasi</th>
                            <th>Poliklinik</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="doctorList"></tbody>
                </table>
            </div>
        </div>
    `;

    const tbody = document.getElementById('doctorList');
    Object.keys(users.doctors).forEach(id => {
        const doctor = users.doctors[id];
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${id}</td>
            <td>${doctor.name}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.poli}</td>
            <td>
                <button class="btn btn-warning edit-btn" data-id="${id}">Edit</button>
                <button class="btn btn-danger" onclick="deleteDoctor('${id}')">Hapus</button>
            </td>
        `;
    });

    // Add event listener for Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const doctorId = this.getAttribute('data-id');
            editDoctorData(doctorId);
        });
    });

    document.getElementById('scheduleModal').style.display = 'block';
}

function addDoctor() {
    const id = document.getElementById('newDoctorId').value;
    const name = document.getElementById('newDoctorName').value;
    const specialty = document.getElementById('newDoctorSpec').value;
    const poli = document.getElementById('newDoctorPoli').value;
    const password = document.getElementById('newDoctorPassword').value;

    if (!id || !name || !specialty || !poli || !password) {
        alert('Harap lengkapi semua data!');
        return;
    }

    users.doctors[id] = { password, name, specialty, poli: poli.charAt(0).toUpperCase() + poli.slice(1) };
    alert('Dokter baru berhasil ditambahkan!');
    closeModal('scheduleModal');
    updateAdminStats();
}

function editDoctorData(doctorId) {
    const doctor = users.doctors[doctorId];
    document.getElementById('scheduleTitle').textContent = `Edit Data Dokter - ${doctor.name}`;
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div class="card">
            <h4>Edit Data Dokter</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group">
                    <label>ID Dokter</label>
                    <input type="text" id="editDoctorId" value="${doctorId}" readonly>
                </div>
                <div class="form-group">
                    <label>Nama Dokter</label>
                    <input type="text" id="editDoctorName" value="${doctor.name}" required>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group">
                    <label>Spesialisasi</label>
                    <input type="text" id="editDoctorSpec" value="${doctor.specialty}" required>
                </div>
                <div class="form-group">
                    <label>Poliklinik</label>
                    <select id="editDoctorPoli" required>
                        <option value="umum" ${doctor.poli === 'Poli Umum' ? 'selected' : ''}>Poli Umum</option>
                        <option value="gigi" ${doctor.poli === 'Poli Gigi' ? 'selected' : ''}>Poli Gigi</option>
                        <option value="dalam" ${doctor.poli === 'Poli Penyakit Dalam' ? 'selected' : ''}>Poli Penyakit Dalam</option>
                        <option value="kandungan" ${doctor.poli === 'Poli Kandungan' ? 'selected' : ''}>Poli Kandungan</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="editDoctorPassword" value="${doctor.password}" required>
            </div>
            <button class="btn btn-success" onclick="saveEditedDoctor('${doctorId}')">Simpan Perubahan</button>
        </div>
    `;
    document.getElementById('scheduleModal').style.display = 'block';
}

function saveEditedDoctor(doctorId) {
    const name = document.getElementById('editDoctorName').value;
    const specialty = document.getElementById('editDoctorSpec').value;
    const poli = document.getElementById('editDoctorPoli').options[document.getElementById('editDoctorPoli').selectedIndex].text;
    const password = document.getElementById('editDoctorPassword').value;

    if (!name || !specialty || !poli || !password) {
        alert('Harap lengkapi semua data!');
        return;
    }

    users.doctors[doctorId] = { password, name, specialty, poli };
    alert('Data dokter berhasil diperbarui!');
    closeModal('scheduleModal');
    manageDoctors(); // Refresh the doctor list
}

function deleteDoctor(id) {
    if (confirm('Yakin ingin menghapus dokter ini?')) {
        delete users.doctors[id];
        alert('Dokter berhasil dihapus!');
        closeModal('scheduleModal');
        updateAdminStats();
    }
}

function updateReports() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const tbody = document.getElementById('visitReports');
    tbody.innerHTML = '';

    Object.keys(schedules).forEach(poliType => {
        schedules[poliType].forEach(schedule => {
            if (!startDate || !endDate || (schedule.date >= startDate && schedule.date <= endDate)) {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${poliType.charAt(0).toUpperCase() + poliType.slice(1)}</td>
                    <td>${schedule.date}</td>
                    <td>${schedule.patients}</td>
                    <td>${schedule.doctor}</td>
                `;
            }
        });
    });
}

function updateAdminMedicalReports() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const tbody = document.getElementById('medicalReports');
    tbody.innerHTML = '';

    Object.keys(users.patients).forEach(patientId => {
        users.patients[patientId].medicalRecords.forEach(record => {
            if (!startDate || !endDate || (record.date >= startDate && record.date <= endDate)) {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${patientId}</td>
                    <td>${users.patients[patientId].name}</td>
                    <td>${record.date}</td>
                    <td>${record.poli}</td>
                    <td>${record.doctor}</td>
                    <td>${record.diagnosis}</td>
                    <td>${record.therapy}</td>
                `;
            }
        });
    });
}

function searchPatientMedicalRecords() {
    const patientId = document.getElementById('searchPatientId').value.trim();
    const tbody = document.getElementById('adminMedicalRecords');
    tbody.innerHTML = '';

    if (!patientId) {
        Object.keys(users.patients).forEach(id => {
            users.patients[id].medicalRecords.forEach(record => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${users.patients[id].name}</td>
                    <td>${record.date}</td>
                    <td>${record.poli}</td>
                    <td>${record.doctor}</td>
                    <td>${record.diagnosis}</td>
                    <td>${record.therapy}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editMedicalRecord('${id}', '${record.date}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteMedicalRecord('${id}', '${record.date}')">Hapus</button>
                    </td>
                `;
            });
        });
    } else if (users.patients[patientId]) {
        const records = users.patients[patientId].medicalRecords;
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Belum ada rekam medis untuk pasien ini.</td></tr>';
        } else {
            records.forEach(record => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${patientId}</td>
                    <td>${users.patients[patientId].name}</td>
                    <td>${record.date}</td>
                    <td>${record.poli}</td>
                    <td>${record.doctor}</td>
                    <td>${record.diagnosis}</td>
                    <td>${record.therapy}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editMedicalRecord('${patientId}', '${record.date}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteMedicalRecord('${patientId}', '${record.date}')">Hapus</button>
                    </td>
                `;
            });
        }
    } else {
        tbody.innerHTML = '<tr><td colspan="8">Pasien tidak ditemukan.</td></tr>';
    }
}

function showAddMedicalRecordForm() {
    document.getElementById('scheduleTitle').textContent = 'Tambah Rekam Medis';
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div class="card">
            <h4>Tambah Rekam Medis Baru</h4>
            <div class="form-group">
                <label>No. Rekam Medis</label>
                <input type="text" id="addRecordPatientId" placeholder="Masukkan No. RM" required>
            </div>
            <div class="form-group">
                <label>Tanggal Kunjungan</label>
                <input type="date" id="addRecordDate" required>
            </div>
            <div class="form-group">
                <label>Poliklinik</label>
                <select id="addRecordPoli" required>
                    <option value="Poli Umum">Poli Umum</option>
                    <option value="Poli Gigi">Poli Gigi</option>
                    <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                    <option value="Poli Kandungan">Poli Kandungan</option>
                </select>
            </div>
            <div class="form-group">
                <label>Dokter</label>
                <select id="addRecordDoctor" required>
                    ${Object.keys(users.doctors).map(id => `<option value="${users.doctors[id].name}">${users.doctors[id].name} (${users.doctors[id].poli})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Anamnesa</label>
                <textarea id="addRecordAnamnesis" placeholder="Masukkan anamnesa" required></textarea>
            </div>
            <div class="form-group">
                <label>Pemeriksaan Fisik</label>
                <textarea id="addRecordPhysicalExam" placeholder="Masukkan hasil pemeriksaan fisik" required></textarea>
            </div>
            <div class="form-group">
                <label>Diagnosis</label>
                <textarea id="addRecordDiagnosis" placeholder="Masukkan diagnosis" required></textarea>
            </div>
            <div class="form-group">
                <label>Terapi</label>
                <textarea id="addRecordTherapy" placeholder="Masukkan terapi" required></textarea>
            </div>
            <button class="btn btn-success" onclick="saveMedicalRecord()">Simpan Rekam Medis</button>
        </div>
    `;
    document.getElementById('scheduleModal').style.display = 'block';
}

function saveMedicalRecord() {
    const patientId = document.getElementById('addRecordPatientId').value.trim();
    const record = {
        date: document.getElementById('addRecordDate').value,
        poli: document.getElementById('addRecordPoli').value,
        doctor: document.getElementById('addRecordDoctor').value,
        anamnesis: document.getElementById('addRecordAnamnesis').value,
        physicalExam: document.getElementById('addRecordPhysicalExam').value,
        diagnosis: document.getElementById('addRecordDiagnosis').value,
        therapy: document.getElementById('addRecordTherapy').value
    };

    if (!patientId || !record.date || !record.poli || !record.doctor || !record.anamnesis || !record.physicalExam || !record.diagnosis || !record.therapy) {
        alert('Harap lengkapi semua data!');
        return;
    }

    if (!users.patients[patientId]) {
        alert('Pasien dengan No. RM tersebut tidak ditemukan!');
        return;
    }

    users.patients[patientId].medicalRecords.push(record);
    alert('Rekam medis berhasil ditambahkan!');
    closeModal('scheduleModal');
    searchPatientMedicalRecords();
}

function editMedicalRecord(patientId, recordDate) {
    const patient = users.patients[patientId];
    const record = patient.medicalRecords.find(r => r.date === recordDate);
    if (!record) {
        alert('Rekam medis tidak ditemukan!');
        return;
    }

    document.getElementById('scheduleTitle').textContent = `Edit Rekam Medis - ${patient.name}`;
    const scheduleContent = document.getElementById('scheduleContent');
    scheduleContent.innerHTML = `
        <div class="card">
            <h4>Edit Rekam Medis</h4>
            <div class="form-group">
                <label>No. Rekam Medis</label>
                <input type="text" id="editRecordPatientId" value="${patientId}" readonly>
            </div>
            <div class="form-group">
                <label>Tanggal Kunjungan</label>
                <input type="date" id="editRecordDate" value="${record.date}" readonly>
            </div>
            <div class="form-group">
                <label>Poliklinik</label>
                <select id="editRecordPoli" required>
                    <option value="Poli Umum" ${record.poli === 'Poli Umum' ? 'selected' : ''}>Poli Umum</option>
                    <option value="Poli Gigi" ${record.poli === 'Poli Gigi' ? 'selected' : ''}>Poli Gigi</option>
                    <option value="Poli Penyakit Dalam" ${record.poli === 'Poli Penyakit Dalam' ? 'selected' : ''}>Poli Penyakit Dalam</option>
                    <option value="Poli Kandungan" ${record.poli === 'Poli Kandungan' ? 'selected' : ''}>Poli Kandungan</option>
                </select>
            </div>
            <div class="form-group">
                <label>Dokter</label>
                <select id="editRecordDoctor" required>
                    ${Object.keys(users.doctors).map(id => `<option value="${users.doctors[id].name}" ${record.doctor === users.doctors[id].name ? 'selected' : ''}>${users.doctors[id].name} (${users.doctors[id].poli})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Anamnesa</label>
                <textarea id="editRecordAnamnesis" required>${record.anamnesis}</textarea>
            </div>
            <div class="form-group">
                <label>Pemeriksaan Fisik</label>
                <textarea id="editRecordPhysicalExam" required>${record.physicalExam}</textarea>
            </div>
            <div class="form-group">
                <label>Diagnosis</label>
                <textarea id="editRecordDiagnosis" required>${record.diagnosis}</textarea>
            </div>
            <div class="form-group">
                <label>Terapi</label>
                <textarea id="editRecordTherapy" required>${record.therapy}</textarea>
            </div>
            <button class="btn btn-success" onclick="saveEditedMedicalRecord('${patientId}', '${recordDate}')">Simpan Perubahan</button>
        </div>
    `;
    document.getElementById('scheduleModal').style.display = 'block';
}

function saveEditedMedicalRecord(patientId, recordDate) {
    const patient = users.patients[patientId];
    const recordIndex = patient.medicalRecords.findIndex(r => r.date === recordDate);
    if (recordIndex === -1) {
        alert('Rekam medis tidak ditemukan!');
        return;
    }

    const updatedRecord = {
        date: document.getElementById('editRecordDate').value,
        poli: document.getElementById('editRecordPoli').value,
        doctor: document.getElementById('editRecordDoctor').value,
        anamnesis: document.getElementById('editRecordAnamnesis').value,
        physicalExam: document.getElementById('editRecordPhysicalExam').value,
        diagnosis: document.getElementById('editRecordDiagnosis').value,
        therapy: document.getElementById('editRecordTherapy').value
    };

    if (!updatedRecord.poli || !updatedRecord.doctor || !updatedRecord.anamnesis || !updatedRecord.physicalExam || !updatedRecord.diagnosis || !updatedRecord.therapy) {
        alert('Harap lengkapi semua data!');
        return;
    }

    patient.medicalRecords[recordIndex] = updatedRecord;
    alert('Rekam medis berhasil diperbarui!');
    closeModal('scheduleModal');
    searchPatientMedicalRecords();
}

function deleteMedicalRecord(patientId, recordDate) {
    if (confirm('Yakin ingin menghapus rekam medis ini?')) {
        const patient = users.patients[patientId];
        patient.medicalRecords = patient.medicalRecords.filter(r => r.date !== recordDate);
        alert('Rekam medis berhasil dihapus!');
        searchPatientMedicalRecords();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

window.onclick = function(event) {
    const poliModal = document.getElementById('poliModal');
    const scheduleModal = document.getElementById('scheduleModal');
    if (event.target == poliModal) poliModal.style.display = 'none';
    if (event.target == scheduleModal) scheduleModal.style.display = 'none';
};

window.onload = function() {
    showSection('home');
};

function cetakRekapKunjungan() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;

    if (!startDate || !endDate) {
        alert('Harap pilih rentang tanggal terlebih dahulu!');
        return;
    }

    // Membuat konten untuk dicetak
    let printContent = `
        <html>
        <head>
            <title>Rekap Kunjungan RSU Delima</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .header { text-align: center; margin-bottom: 20px; }
                .tanggal { margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Rekap Kunjungan RSU Delima</h2>
                <p class="tanggal">Periode: ${startDate} s/d ${endDate}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Poliklinik</th>
                        <th>Tanggal</th>
                        <th>Jumlah Pasien</th>
                        <th>Dokter</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let totalKunjungan = 0;
    let poliCounts = {};
    
    Object.keys(schedules).forEach(poliType => {
        poliCounts[poliType] = 0;
        schedules[poliType].forEach(schedule => {
            if (schedule.date >= startDate && schedule.date <= endDate) {
                printContent += `
                    <tr>
                        <td>${poliType.charAt(0).toUpperCase() + poliType.slice(1)}</td>
                        <td>${schedule.date}</td>
                        <td>${schedule.patients}</td>
                        <td>${schedule.doctor}</td>
                    </tr>
                `;
                totalKunjungan += schedule.patients;
                poliCounts[poliType] += schedule.patients;
            }
        });
    });

    // Tambahkan ringkasan per poli
    printContent += `
        <tr><td colspan="4" style="height: 20px;"></td></tr>
        <tr><td colspan="4" style="background-color: #f5f5f5;"><strong>Ringkasan per Poliklinik</strong></td></tr>
    `;

    Object.keys(poliCounts).forEach(poli => {
        if (poliCounts[poli] > 0) {
            printContent += `
                <tr>
                    <td colspan="2"><strong>${poli.charAt(0).toUpperCase() + poli.slice(1)}</strong></td>
                    <td><strong>${poliCounts[poli]}</strong></td>
                    <td></td>
                </tr>
            `;
        }
    });

    printContent += `
                <tr><td colspan="4" style="height: 20px;"></td></tr>
                <tr style="background-color: #f8f9fa;">
                    <td colspan="2"><strong>Total Seluruh Kunjungan</strong></td>
                    <td><strong>${totalKunjungan}</strong></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            <div style="margin-top: 50px;">
                <p>Dicetak pada: ${new Date().toLocaleString()}</p>
                <p>Dicetak oleh: Admin</p>
            </div>
        </body>
        </html>
    `;

    // Membuat window baru untuk preview cetak
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Cetak setelah konten dimuat
    printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };
}

function cetakRekamMedis() {
    const startDate = document.getElementById('reportStartDate2').value;
    const endDate = document.getElementById('reportEndDate2').value;

    if (!startDate || !endDate) {
        alert('Harap pilih rentang tanggal terlebih dahulu!');
        return;
    }

    // Membuat konten untuk dicetak
    let printContent = `
        <html>
        <head>
            <title>Rekap Rekam Medis RSU Delima</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .header { text-align: center; margin-bottom: 20px; }
                .tanggal { margin-bottom: 10px; }
                @media print {
                    .page-break { page-break-before: always; }
                    thead { display: table-header-group; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Rekap Rekam Medis RSU Delima</h2>
                <p class="tanggal">Periode: ${startDate} s/d ${endDate}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No. RM</th>
                        <th>Nama Pasien</th>
                        <th>Tanggal</th>
                        <th>Poliklinik</th>
                        <th>Dokter</th>
                        <th>Diagnosis</th>
                        <th>Terapi</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let totalRecords = 0;
    let poliRecords = {};

    Object.keys(users.patients).forEach(patientId => {
        users.patients[patientId].medicalRecords.forEach(record => {
            if (record.date >= startDate && record.date <= endDate) {
                printContent += `
                    <tr>
                        <td>${patientId}</td>
                        <td>${users.patients[patientId].name}</td>
                        <td>${record.date}</td>
                        <td>${record.poli}</td>
                        <td>${record.doctor}</td>
                        <td>${record.diagnosis}</td>
                        <td>${record.therapy}</td>
                    </tr>
                `;
                totalRecords++;
                poliRecords[record.poli] = (poliRecords[record.poli] || 0) + 1;
            }
        });
    });

    // Tambahkan ringkasan per poli
    printContent += `
        <tr><td colspan="7" style="height: 20px;"></td></tr>
        <tr><td colspan="7" style="background-color: #f5f5f5;"><strong>Ringkasan per Poliklinik</strong></td></tr>
    `;

    Object.keys(poliRecords).forEach(poli => {
        printContent += `
            <tr>
                <td colspan="6"><strong>${poli}</strong></td>
                <td><strong>${poliRecords[poli]} rekam medis</strong></td>
            </tr>
        `;
    });

    printContent += `
                <tr><td colspan="7" style="height: 20px;"></td></tr>
                <tr style="background-color: #f8f9fa;">
                    <td colspan="6"><strong>Total Rekam Medis</strong></td>
                    <td><strong>${totalRecords}</strong></td>
                </tr>
                </tbody>
            </table>
            <div style="margin-top: 50px;">
                <p>Dicetak pada: ${new Date().toLocaleString()}</p>
                <p>Dicetak oleh: Admin</p>
            </div>
        </body>
        </html>
    `;

    // Membuat window baru untuk preview cetak
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Cetak setelah konten dimuat
    printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };
}

function searchPatientMedicalRecordsByDoctor() {
    const rm = document.getElementById('doctorSearchPatientRM').value.trim();
    const tbody = document.getElementById('doctorPatientRecords');
    tbody.innerHTML = '';
    // Data dummy, filter jika ada input
    const dummyRecords = [
        {
            date: '2025-06-10',
            name: 'John Doe',
            rm: 'RM001',
            poli: 'Poli Umum',
            doctor: 'Dr. Ahmad Susanto',
            diagnosis: 'Demam',
            therapy: 'Paracetamol'
        },
        {
            date: '2025-06-11',
            name: 'Jane Smith',
            rm: 'RM002',
            poli: 'Poli Gigi',
            doctor: 'Dr. Ahmad Susanto',
            diagnosis: 'Sakit Gigi',
            therapy: 'Obat Sakit Gigi'
        }
    ];
    const filtered = rm ? dummyRecords.filter(r => r.rm.toLowerCase() === rm.toLowerCase()) : dummyRecords;
    if(filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Data tidak ditemukan.</td></tr>';
        return;
    }
    filtered.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.name}</td>
            <td>${record.rm}</td>
            <td>${record.poli}</td>
            <td>${record.doctor}</td>
            <td>${record.diagnosis}</td>
            <td>${record.therapy}</td>
        `;
        tbody.appendChild(row);
    });
}

function showLoginOptions() {
    document.getElementById('loginOptionsModal').style.display = 'block';
}

function hideNavbar() {
    document.getElementById('mainNavbar').style.display = 'none';
}
function showNavbar() {
    document.getElementById('mainNavbar').style.display = '';
}

// Panggil hideNavbar() saat dashboard pasien/dokter/admin muncul
function showDashboard(type) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(type + 'Dashboard').classList.remove('hidden');
    document.querySelector('footer').classList.add('hidden');
    hideNavbar();
}

// Tampilkan navbar saat kembali ke landing/login
function showSection(section) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section + 'Section').classList.remove('hidden');
    document.querySelector('footer').classList.toggle('hidden', section !== 'home');
    showNavbar();
}
function showLogin(type) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(type + 'LoginSection').classList.remove('hidden');
    document.querySelector('footer').classList.add('hidden');
    showNavbar();
}

function registerPatientBaru() {
    const email = document.getElementById('registerEmail').value.trim();
    const name = document.getElementById('registerName').value.trim();
    const birthDate = document.getElementById('registerBirthDate').value;
    const nik = document.getElementById('registerNIK').value.trim();
    const password = document.getElementById('registerPassword').value;
    if (!email || !name || !birthDate || !nik || !password) {
        alert('Harap lengkapi semua data!');
        return;
    }
    // Simulasi generate No. RM otomatis
    const newPatientId = 'RM' + Math.floor(1000 + Math.random() * 9000);
    alert('Registrasi berhasil!\nNo. Rekam Medis Anda: ' + newPatientId + '\nSilakan login untuk melanjutkan.');
    document.getElementById('patientRegisterForm').reset();
    showLogin('patient');
    setTimeout(function() {
        document.getElementById('patientId').value = newPatientId;
    }, 300);
}